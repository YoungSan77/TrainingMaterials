"use strict";
// Port of LecturePpt.paragraphs(): rewrites a placeholder shape's paragraphs from Block list,
// used by both Builder (auto mode, not exercised in this baseline) and ReferenceRenderer's
// "prose" fallback when a section's body text no longer matches the approved placeholder verbatim.
const { A, el, kids, body, shape, spacing } = require("./xml");
const { rich, richInline, run, runParen } = require("./richText");
const { plain } = require("./text");

// The approved.pptx layout's own list style for the body placeholder (idx=1, "내용 개체 틀 2"),
// read directly from ppt/slideLayouts/slideLayout1.xml -- lvl 1..5's marL/indent/buChar/buSzPct.
// A real placeholder shape (id=8) renders bullets correctly by INHERITING this through the
// slide -> layout -> master chain from just the "lvl" attribute alone. But a plain, non-placeholder
// textbox (id=13, the table page's lead text -- see builder.js table()) has its own empty
// <a:lstStyle/> and no placeholder link, so it inherits nothing: setting "lvl" there is silently a
// no-op (no glyph, no indent). Setting these explicitly on every bullet paragraph, regardless of
// which shape it lands in, makes bullets render identically either way instead of only working by
// accident on shapes that happen to inherit the right style.
const BULLET_LEVELS = [
  { marL: 342900, indent: -342900, buSzPct: "90000", buChar: "" },
  { marL: 723900, indent: -368300, buSzPct: "90000", buChar: "" },
  { marL: 1077913, indent: -354013, buSzPct: "90000", buChar: "" },
  { marL: 1433513, indent: -355600, buChar: "l" },
  { marL: 1787525, indent: -354013, buChar: "§" },
];

// Finds the first comma not nested inside (), [], or {} -- e.g. splits
// "...접근이다, Eric Evans, ..." correctly even though the sentence itself contains a
// parenthesized "(Domain-Driven Design, DDD)" with its own comma.
function topLevelSplit(text) {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
    else if (c === "," && depth === 0) return i;
  }
  return -1;
}

function paragraphs(page, id, blocks, toc) {
  const b = body(shape(page.doc, id));
  for (const p of kids(b, A, "p")) b.removeChild(p);
  // CT_TextBody requires at least one <a:p> -- a visual-only page (images, no prose) calls this
  // with an empty `blocks` to clear the placeholder's inherited text, and looping zero times over
  // `blocks` would leave <p:txBody> with only bodyPr/lstStyle and no paragraph at all. PowerPoint
  // treats that as unreadable content and silently drops the shape on open, no specific error --
  // a blank paragraph satisfies the schema and renders as nothing, same as an empty body.
  if (blocks.length === 0) b.appendChild(el(page.doc, A, "p"));
  const expected = [];
  for (const block of blocks) {
    const p = el(page.doc, A, "p");
    b.appendChild(p);
    const pr = spacing(p, 6, 6, null);
    // parse.js reuses the "bullet" kind for authored ordered-list items ("1. ", "2. ", ...) too,
    // keeping the numeral as literal text -- and for "+ " indent-only lines (block.meta.noGlyph).
    // Both still want the placeholder's lvl-based indentation; they just shouldn't ALSO get its
    // own level-1 bullet glyph stacked in front of a numeral that's already literal text, or in
    // front of prose that isn't an enumerated item at all -- buNone suppresses only the glyph.
    // "(1) ", "(2) ", ... is the same self-numbered case written with parens instead of a period.
    const selfNumbered = block.kind === "bullet" && /^(?:\d+\.|\(\d+\))\s/.test(block.text);
    const noGlyph = selfNumbered || (block.meta && block.meta.noGlyph);
    if (block.kind === "bullet") {
      // Shifted one level deeper than the raw depth would suggest: the layout's own lvl=1 glyph
      // (BULLET_LEVELS[0], Wingdings ) renders as a filled square, which read as visually
      // heavier than intended for a plain top-level bullet. Starting from lvl=2's round glyph
      // () instead means every bullet in the deck sits one indent step deeper than its raw
      // authored depth, and the square lvl=1 glyph is never actually used.
      const lvl = 2 + block.depth;
      pr.setAttribute("lvl", String(lvl));
      const level = BULLET_LEVELS[Math.min(lvl, BULLET_LEVELS.length) - 1];
      pr.setAttribute("marL", String(level.marL));
      pr.setAttribute("indent", String(level.indent));
      if (noGlyph) {
        pr.appendChild(el(page.doc, A, "buNone"));
      } else {
        if (level.buSzPct) pr.appendChild(el(page.doc, A, "buSzPct", "val", level.buSzPct));
        pr.appendChild(el(page.doc, A, "buFont", "typeface", "Wingdings", "pitchFamily", "2", "charset", "2"));
        pr.appendChild(el(page.doc, A, "buChar", "char", level.buChar));
      }
    } else {
      pr.setAttribute("marL", "0");
      pr.setAttribute("indent", "0");
      pr.appendChild(el(page.doc, A, "buNone"));
    }
    // A "**인용문**"/"**Anchor Message**" marker (see builder.js) tags the following block's meta
    // as quote/anchor. guides/session-authoring-guide.md ("인용문과 출처 규칙") defines two forms:
    // with an English original -- "한글", "English", 저자, 출처 (all quoted parts) -- or without
    // one -- 한글 문장 또는 통계, 저자, 출처 (no quotes at all around the Korean part). Both forms
    // render as 18pt Korean + 10pt English/source (guides/production-guide.md "Typography 계약").
    const markedQuote = block.meta && (block.meta.quote || block.meta.anchor);
    // Straight quotes ("...") -- matches the actual authored format in s01.md. This used to look
    // for curly quotes ("..."), which no longer appear anywhere in the source, so this branch
    // silently never matched and every citation fell through to markedPartsB's plain top-level-
    // comma split -- which cuts at the FIRST comma even when it's inside the Korean sentence
    // itself (e.g. "...논리적·물리적, 정적·동적...", not the real Korean/English boundary),
    // stranding the tail of the Korean text in the 10pt run instead of the 18pt one.
    const markedPartsA = markedQuote && /^"([^"]+)"\s*,\s*(?:"([^"]+)"\s*,\s*)?(.+?)\s*$/.exec(block.text);
    let markedPartsB = null;
    if (markedQuote && !markedPartsA) {
      const idx = topLevelSplit(block.text);
      if (idx > 0) markedPartsB = { korean: block.text.slice(0, idx).trim(), rest: block.text.slice(idx + 1).trim() };
    }
    const anchor = /^(?:\*\*)?(?:Anchor Message|앵커 메시지)(?:\*\*)?\s*[:—-]\s*(.+)$/i.exec(block.text);
    const quoteText = anchor ? anchor[1] : block.text;
    const quote = /^(.*?)\.\s*,\s*(“[^”]+”)\s*,\s*(.+?;)\s*$/.exec(quoteText);
    const blockquote = /^>\s*/.test(block.text);
    if (markedPartsA) {
      // Per direct instruction: 한글/영어/출처를 줄바꿈 없이 ", "로 구분한다 (line breaks removed).
      // Korean 18pt zone is paren-aware (-4 on non-Korean parens) and honors authored **bold**
      // emphasis (richInline, not runParen -- see guides/session-authoring-guide.md "인용문 안의
      // bold는 강조만 뜻한다"); the English-original+source 10pt zone is the one stated exception
      // and stays flat, parens included, no bold.
      richInline(p, `"${markedPartsA[1]}"`, 18, false);
      run(p, ", ", 10, false);
      if (markedPartsA[2]) {
        run(p, `"${plain(markedPartsA[2])}"`, 10, false);
        run(p, ", ", 10, false);
      }
      run(p, plain(markedPartsA[3]), 10, false);
      expected.push(plain(`"${markedPartsA[1]}", ` + (markedPartsA[2] ? `"${markedPartsA[2]}", ` : "") + markedPartsA[3]));
    } else if (markedPartsB) {
      richInline(p, markedPartsB.korean, 18, false);
      run(p, ", ", 10, false);
      run(p, plain(markedPartsB.rest), 10, false);
      expected.push(plain(markedPartsB.korean + ", " + markedPartsB.rest));
    } else if (quote) {
      richInline(p, quote[1] + ".", 18, false);
      run(p, ", ", 10, false);
      run(p, quote[2], 10, false);
      run(p, ", ", 10, false);
      run(p, quote[3], 10, false);
      expected.push(plain(quote[1] + "., " + quote[2] + ", " + quote[3]));
    } else if (anchor) {
      richInline(p, anchor[1], 18, false);
      expected.push(plain(anchor[1]));
    } else {
      const value = blockquote ? block.text.replace(/^>\s*/, "") : block.text;
      const size = toc || ["heading", "text"].includes(block.kind) ? 18 : [18, 16, 14][block.depth];
      rich(p, value, size, block.kind === "heading" || toc, false, new Set());
      expected.push(plain(value));
    }
  }
  page.items.push({ id, kind: "body", text: expected.join("\n"), rows: [] });
}

module.exports = { paragraphs };
