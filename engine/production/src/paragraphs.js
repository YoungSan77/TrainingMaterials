"use strict";
// Port of LecturePpt.paragraphs(): rewrites a placeholder shape's paragraphs from a Block list.
const { A, el, kids, body, shape, spacing } = require("./xml");
const { rich, richInline, run, runParen } = require("./richText");
const { plain } = require("./text");

// The template layout's own list style for the body placeholder (idx=1, "내용 개체 틀 2"),
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
// A thousands separator ("1,000쪽") is not a boundary: cutting there strands the tail of the
// Korean sentence in the 10pt run and splits an authored **bold** span in half, so a comma
// between two digits is skipped.
function isGroupingComma(text, i) {
  return /\d/.test(text[i - 1] || "") && /\d/.test(text[i + 1] || "");
}
function topLevelSplit(text) {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
    else if (c === "," && depth === 0 && !isGroupingComma(text, i)) return i;
  }
  return -1;
}

// Width of an authored list number ("9. ", "(10) ") at `size` pt, in EMU: digits ~0.55em,
// period/parenthesis ~0.3em, space ~0.25em in the body font.
function numberWidthEmu(prefix, size) {
  let em = 0;
  for (const ch of prefix) em += /\d/.test(ch) ? 0.55 : ch === " " ? 0.25 : 0.3;
  return Math.round(em * size * 12700);
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
    const requirementsHeading=page.s03Profile && /^03\. 요구와 요구사항/.test(page.heading) && block.kind==='heading' && block.text==='요구사항';
    const pr = spacing(p, requirementsHeading?12:page.paragraphSpace??6, page.paragraphSpace??6, null);
    // parse.js reuses the "bullet" kind for authored ordered-list items ("1. ", "2. ", ...) too,
    // keeping the numeral as literal text -- and for "+ " indent-only lines (block.meta.noGlyph).
    // Both still want the placeholder's lvl-based indentation; they just shouldn't ALSO get its
    // own level-1 bullet glyph stacked in front of a numeral that's already literal text, or in
    // front of prose that isn't an enumerated item at all -- buNone suppresses only the glyph.
    // "(1) ", "(2) ", ... is the same self-numbered case written with parens instead of a period.
    const selfNumbered = block.kind === "bullet" && /^(?:\d+\.|\(\d+\))\s/.test(block.text);
    const representative = Boolean(block.meta && block.meta.groupHead);
    const noGlyph = selfNumbered || representative || (block.meta && block.meta.noGlyph);
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
      if (selfNumbered) {
        // The literal "9. " is the hanging part: a wrapped line starts under the item's text, not
        // at the bullet glyph's fixed hang, and the first line stays where a bullet's glyph sits.
        const w = numberWidthEmu(/^(?:\d+\.|\(\d+\))\s/.exec(block.text)[0], [16, 14, 12][Math.min(block.depth, 2)]);
        pr.setAttribute("marL", String(level.marL + level.indent + w));
        pr.setAttribute("indent", String(-w));
      }
      if (noGlyph) {
        pr.appendChild(el(page.doc, A, "buNone"));
        // 인용문처럼 글머리표도 번호도 없는 문단은 내어쓰기까지 없앤다 -- 글머리표를 숨긴 자리에
        // 남은 내어쓰기가 첫 줄만 왼쪽으로 끌어내, 줄바꿈된 둘째 줄과 시작점이 달랐다(2026-11-15).
        if (representative || (block.meta && block.meta.noHang) || (noGlyph && !selfNumbered)) {
          const glyphAligned=block.meta && (block.meta.alignGlyph||block.meta.quote||block.meta.anchor) || /^>\s/.test(block.text);
          const bodyAligned=block.meta && block.meta.alignBody || !glyphAligned;
          pr.setAttribute("marL", String(representative ? 381000 : bodyAligned ? level.marL : level.marL+level.indent));
          pr.setAttribute("indent", "0");
        }
      } else {
        if (level.buSzPct) pr.appendChild(el(page.doc, A, "buSzPct", "val", level.buSzPct));
        pr.appendChild(el(page.doc, A, "buFont", "typeface", "Wingdings", "pitchFamily", "2", "charset", "2"));
        pr.appendChild(el(page.doc, A, "buChar", "char", level.buChar));
      }
    } else {
      // 그룹 대표명(`###` 소제목과 줄 전체가 굵은 문단)은 들여쓰기 없이 굵게, 글머리표 없이 둔다 --
      // 그 아래 소속 내용이 들여쓴 bullet이라 대표명이 왼쪽 끝에 있어야 묶음이 보인다(2026-11-15).
      pr.setAttribute("marL", "0");
      pr.setAttribute("indent", "0");
      pr.appendChild(el(page.doc, A, "buNone"));
    }
    if (block.meta && block.meta.caption) {
      // A table title ("**표 — 제목**", production-guide.md "표·도식 제목"): 14pt bold, centered.
      pr.setAttribute("algn", "ctr");
      rich(p, block.meta.caption, 14, true, false, new Set());
      expected.push(plain(block.meta.caption));
      continue;
    }
    // A "**인용문**"/"**Anchor Message**" marker (see builder.js) tags the following block's meta
    // as quote/anchor. guides/session-authoring-guide.md ("인용문과 출처 규칙") defines two forms:
    // with an English original -- "한글", "English", 저자, 출처 (all quoted parts) -- or without
    // one -- 한글 문장 또는 통계, 저자, 출처 (no quotes at all around the Korean part). Both forms
    // render as 18pt Korean + 10pt English/source (guides/production-guide.md "Typography 계약").
    const markedQuote = block.meta && (block.meta.quote || block.meta.anchor);
    // Recognise both quoted translations and unquoted summaries before the legacy comma split.
    // A comma inside Korean prose is punctuation, not the start of the 10pt English/source zone.
    const bulletCite = !markedQuote && block.kind === "bullet" ? bulletCitation(block.text) : null;
    const markedPartsA = (markedQuote && (citationParts(block.text) || summaryParts(block.text))) || bulletCite;
    let markedPartsB = null;
    if (markedQuote && !markedPartsA) {
      // Without an English original, the trailing reference labels delimit the source.
      // Preserve Korean commas and all labels, including commas inside a label.
      const labeled = /^(.+?)\s*,\s*(\[[^\]"]+\](?:\s*[,·]\s*\[[^\]"]+\])*)\s*$/.exec(block.text);
      if (labeled) markedPartsB = { korean: labeled[1].trim(), rest: labeled[2].trim() };
      else {
        const idx = topLevelSplit(block.text);
        if (idx > 0) markedPartsB = { korean: block.text.slice(0, idx).trim(), rest: block.text.slice(idx + 1).trim() };
      }
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
      // A bullet citation keeps its level's body size for the Korean part (production-guide.md
      // "인용문" -- bullet 인용); the 10pt English/source zone is the same either way.
      // markedPartsA[4] marks the summary form, whose Korean is not a quotation and keeps no quotes.
      const quoteBoth=page.s03Profile;
      const korean = quoteBoth ? displayQuote(markedPartsA[1]) : markedPartsA[4] ? markedPartsA[1] : `"${markedPartsA[1]}"`;
      // 마침표형 요약 인용은 한글이 제 종결 부호로 끝나므로 쉼표를 덧붙이지 않는다(summaryParts).
      const sep = markedPartsA[5] || ", ";
      const quoteSize = block.kind === "bullet" && !(block.meta && block.meta.anchor) ? [16,14,12][Math.min(block.depth,2)] : 18;
      richInline(p, korean, quoteSize, false);
      run(p, sep, 10, false);
      if (markedPartsA[2]) {
        // 영문 원문을 감싼 바깥따옴표는 원고에서 영역을 가르는 표식이므로 화면에 그리지 않는다.
        // 원문 **안**의 따옴표(`\"`)와 문장부호는 그대로 남는다(2026-11-16).
        run(p, plain(quoteBoth?displayQuote(markedPartsA[2]):markedPartsA[2]), 10, false);
        run(p, ", ", 10, false);
      }
      run(p, plain(markedPartsA[3]), 10, false);
      expected.push(plain(`${korean}${sep}` + (markedPartsA[2] ? `${quoteBoth?displayQuote(markedPartsA[2]):markedPartsA[2]}, ` : "") + markedPartsA[3]));
    } else if (markedPartsB) {
      richInline(p, unescapeQuotes(markedPartsB.korean), 18, false);
      run(p, ", ", 10, false);
      run(p, plain(unescapeQuotes(markedPartsB.rest)), 10, false);
      expected.push(plain(unescapeQuotes(markedPartsB.korean + ", " + markedPartsB.rest)));
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
      const size = block.meta && block.meta.storyPattern ? 14 : toc || ["heading", "text"].includes(block.kind) ? 18 : [16, 14, 12][Math.min(block.depth, 2)];
      rich(p, value, size, block.kind === "heading" || toc, false, new Set());
      expected.push(plain(value));
    }
  }
  page.items.push({ id, kind: "body", text: expected.join("\n"), rows: [] });
}

// A citation's quoted parts may contain the original's own quotation marks written as \"
// (session-authoring-guide.md "인용과 출처"). They split as part of the quote and print as a plain
// '"' -- a stray backslash shows as "₩" in the Korean font.
const QUOTED = '"((?:[^"\\\\]|\\\\.)+)"';
const CITATION = new RegExp("^" + QUOTED + "\\s*,\\s*(?:" + QUOTED + "\\s*,\\s*)?(.+?)\\s*$");
function unescapeQuotes(text) {
  return String(text).replace(/\\(["\\])/g, "$1");
}
function citationParts(text) {
  const m = CITATION.exec(text);
  if (!m) return null;
  return [m[0], unescapeQuotes(m[1]), m[2] === undefined ? undefined : unescapeQuotes(m[2]), m[3]];
}

const LABEL_TAIL = /^\[[^\]"]+\](?:\s*[,·]\s*\[[^\]"]+\])*$/;

// The summary form of a citation: the Korean is a summary, so it carries no quotation marks of its
// own (session-authoring-guide.md "5. 인용과 출처" -- 핵심 요약, "English original", [저자 연도]).
// CITATION only matches a quoted Korean part, so without this a summary citation written as a
// bullet fell through to plain body text: no 10pt English/source zone, and its \" escapes printed
// raw (a backslash shows as "₩" in the Korean font).
// 한글과 영문 원문 사이의 구분자는 쉼표(`한국어 요약, "English", [출처]`)이거나 한글 문장의
// 마침표(`한국어 문장. "English", [출처]`)다. production-guide.md 「인용문」은 영역을 **따옴표로
// 감싼 영문 원문과 끝의 출처 레이블**로 나누라고 정하므로, 쉼표를 요구해 마침표형을 놓치면 영문이
// 한글 영역(18pt)에 남는다. 마침표는 한글 문장의 일부이므로 한글 run에 두고, 다시 이어 붙일
// 구분자만 달리한다(쉼표형은 ", ", 마침표형은 " ").
const SUMMARY = new RegExp('^([^"]+?)\\s*([,.])\\s*' + QUOTED + "\\s*,\\s*(.+?)\\s*$");
function summaryParts(text) {
  const m = SUMMARY.exec(String(text).trim());
  if (!m) return null;
  const period = m[2] === ".";
  // The 5th element marks the Korean as unquoted, so the renderer does not add quotes around it;
  // the 6th is the separator to print between the Korean and the English original.
  return [m[0], period ? m[1] + m[2] : m[1], unescapeQuotes(m[3]), m[4], true, period ? " " : ", "];
}

// A bullet whose whole line is a citation -- "한글", "English original", [Larman 2004], or the
// summary form above -- renders as one without a "**인용문**" marker (session-authoring-guide.md
// "5. 인용과 출처": supporting quotes indented under a definition quote). Both the English original
// and a reference label tail ("[저자 연도]", appendix "별첨 — 참고 자료") are required, so a bullet
// that merely lists quoted terms ("결제", "취소", "배송") stays a bullet.
function bulletCitation(text) {
  const line = String(text).trim();
  const quoted = citationParts(line);
  if (quoted && quoted[2] !== undefined && LABEL_TAIL.test(quoted[3])) return quoted;
  const summary = summaryParts(line);
  return summary && LABEL_TAIL.test(summary[3]) ? summary : null;
}

function displayQuote(value){return '“'+value.replace(/^(?:“([\s\S]*)”|"([\s\S]*)")$/,(_,curly,straight)=>curly??straight)+'”';}
module.exports = { paragraphs, BULLET_LEVELS, citationParts, summaryParts, bulletCitation, LABEL_TAIL, unescapeQuotes, numberWidthEmu, displayQuote };
