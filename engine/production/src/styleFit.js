"use strict";
// 문서형 슬라이드(실습·실습 답·별첨)의 글자 크기와 높이 — 어떤 크기로 놓을지(style), 그 크기로
// 블록이 차지하는 높이(styledCost), 템플릿이 써 둔 크기를 그 style로 바꾸는 일(restyle)
// (production-guide.md 「실습 슬라이드」·「별첨 — 참고 자료」).
const { A, P, all, child, spacing, el, kids } = require("./xml");
const { plain } = require("./text");
const { BULLET_LEVELS, numberWidthEmu } = require("./paragraphs");
const { EMU } = require("./visualFit");

// production-guide.md "실습 슬라이드": the practice slide and a text answer "(안)" take the sizes
// of the reference deck. A style gives the size of a plain paragraph (`text`) and of each list
// level, the size of a line's explanation after "—" and of a "(...)" span for a level size, and
// how lines are indented: `hang` sets each level 0.25in in with a 0.2in hanging glyph (answer);
// `aligned` puts an unbulleted "+ " line under its parent's text (practice).
const PRACTICE_STYLE = { fit: 0.9, text: 16, levels: [18, 16, 14], expl: (L) => L - 2, paren: (L) => Math.max(8, L - 4), aligned: true };
// `leftFirst`: 두 단은 왼쪽을 먼저 채우고 넘는 것만 오른쪽에 둔다(production-guide.md 「문서 형식」).
// `leftFit`: 왼쪽 단만의 여유. 오른쪽 단과 한 단짜리 장은 추정이 넉넉한 만큼 fit 1.1까지 받지만,
// 왼쪽 단이 넘치면 글이 쪽 번호를 덮으므로 1.04까지만 받고 나머지는 오른쪽으로 보낸다. 실제 출력으로
// 맞춘 값이다 — 1.0이면 들어가는 항목이 오른쪽으로 넘어가 왼쪽 아래가 비고, 1.1이면 넘친다.
const ANSWER_STYLE = { fit: 1.1, leftFit: 1.04, text: 14, levels: [14, 12, 11], expl: (L) => L - 2, paren: (L) => Math.max(8, L - 4), hang: true, leftFirst: true };
// "**참고 자료 목록**" (production-guide.md "별첨 — 참고 자료"): numbered entries at 8pt in two columns.
// `numberHang` starts a numbered entry at the left edge and its wrapped lines after "N. "; `space` is
// the space before and after each paragraph (pt, default STYLE_SPACE).
const REFERENCE_STYLE = { fit: 1.1, text: 8, levels: [8, 8, 8], expl: (L) => L, paren: (L) => L, hang: true, numberHang: true, space: 1 };
const REFERENCE_MARKER = /^\*\*참고 자료 목록\*\*$/;
const isReferenceMarker = (b) => b.kind === "text" && REFERENCE_MARKER.test(b.text.trim());
const shiftStyle = (size) => ({ fit: 1.04, text: size, levels: [size, size - 2, size - 4], expl: (L) => L - 2, paren: (L) => Math.max(8, L - 4), aligned: true });
const PRACTICE_BOX = { x: 0.4, y: 1.05, w: 9.43, h: 6.04 };
const ANSWER_COLUMNS = [{ x: 0.255, y: 1.05, w: 4.745, h: 6.04 }, { x: 5.0, y: 1.05, w: 4.855, h: 6.04 }];
// Glyph widths and line height in em for 맑은 고딕, calibrated against PowerPoint's own output of
// the practice and answer slides. A style's `fit` is the share of a box's height its text may be
// estimated at and still fit; the smaller answer sizes wrap less than estimated.
const KOREAN_EM = 0.9, SPACE_EM = 0.25, LINE_EM = 1.25;
const STYLE_SPACE = 3;
const AUTHORED = [18, 16, 14];

function styleSize(style, b) {
  return b.kind === "bullet" ? style.levels[Math.min(b.depth || 0, 2)] : style.text;
}

// Height (pt) of `blocks` set in `style` inside `box`: the key before the first " — " at the
// line's size, the explanation after it at the explanation size, "(...)" at the paren size.
function styledCost(blocks, style, box) {
  return blocks.reduce((sum, b) => {
    const L = styleSize(style, b), E = style.expl(L), P = style.paren(L);
    const depth = b.kind === "bullet" ? Math.min(b.depth || 0, 2) : -1;
    const level = depth < 0 ? null : BULLET_LEVELS[depth + 1];
    const numbered = /^(?:\d+\.|\(\d+\))\s/.test(b.text);
    const prefix = /^(?:\d+\.|\(\d+\))\s/.exec(plain(b.text));
    const indent = style.documentIndent ? (depth < 0 ? 0.2 : 0.45 + depth * 0.35) : style.numberHang && prefix ? numberWidthEmu(prefix[0], L) / EMU : depth < 0 ? 0 : style.hang ? (depth + 1) * 0.25
      : style.aligned && b.meta && b.meta.noGlyph && !numbered ? BULLET_LEVELS[depth].marL / EMU
      : numbered ? (level.marL + level.indent) / EMU + 0.25 : level.marL / EMU;
    const text = plain(b.text), cut = text.indexOf(" — ");
    let w = 0, paren = 0;
    Array.from(text).forEach((ch, i) => {
      const cp = ch.codePointAt(0);
      if (cp === 0x28) paren++;
      const size = paren > 0 ? P : cut >= 0 && i > cut ? E : L;
      w += size * (cp >= 0x1100 ? KOREAN_EM : cp === 0x20 ? SPACE_EM : 0.56);
      if (cp === 0x29 && paren > 0) paren--;
    });
    const lines = Math.max(1, Math.ceil(w / ((box.w - indent) * 72 - 12)));
    return sum + lines * L * LINE_EM + 2 * (style.space != null ? style.space : STYLE_SPACE);
  }, 0);
}

// Applies `style` to the paragraphs paragraphs() wrote into `sh` at the authored sizes (18/16/14
// by level, the explanation 2pt and a "(...)" span 4pt under).
function restyle(sh, style) {
  for (const p of all(sh, A, "p")) {
    const sp = style.space != null ? style.space : STYLE_SPACE;
    spacing(p, sp, sp, null);
    const pr = child(p, A, "pPr");
    const lvl = pr && pr.getAttribute("lvl") ? parseInt(pr.getAttribute("lvl"), 10) : 0;
    const depth = lvl ? Math.min(lvl - 2, 2) : -1;
    const from = depth < 0 ? 18 : AUTHORED[depth];
    const L = depth < 0 ? style.text : style.levels[depth], E = style.expl(L), P = style.paren(L);
    for (const rp of all(p, A, "rPr")) {
      const sz = parseInt(rp.getAttribute("sz") || "1800", 10) / 100;
      const to = style.uniform ? L : sz >= from ? L : sz >= from - 2 ? E : sz >= from - 4 ? P : Math.max(8, Math.min(P, E - 2));
      rp.setAttribute("sz", String(Math.round(to * 100)));
    }
    const number = style.numberHang && /^(?:\d+\.|\(\d+\))\s/.exec(p.textContent);
    if (number && pr) {
      const w = numberWidthEmu(number[0], L);
      pr.setAttribute("marL", String(w));
      pr.setAttribute("indent", String(-w));
      continue;
    }
    if (style.documentIndent && pr) {
      const x = depth < 0 ? 0.2 : 0.45 + depth * 0.35;
      const bare = Boolean(child(pr, A, "buNone"));
      const prefix = /^(?:\d+\.)\s/.exec(p.textContent);
      if (prefix) {
        const w = numberWidthEmu(prefix[0], L);
        pr.setAttribute("marL", String(Math.round(x * EMU) + w));
        pr.setAttribute("indent", String(-w));
        continue;
      }
      pr.setAttribute("marL", String(Math.round(x * EMU)));
      pr.setAttribute("indent", String(depth < 0 || bare ? 0 : Math.round(-0.15 * EMU)));
      continue;
    }
    if (style.aligned && pr) {
      const prefix = /^(?:([①-⑤])|(\d+)\.)\s/.exec(p.textContent);
      if (prefix) {
        let count = prefix[0].length;
        for (const t of all(p, A, "t")) {
          const take = Math.min(count, t.textContent.length);
          t.textContent = t.textContent.slice(take);
          count -= take;
          if (!count) break;
        }
        for (const n of kids(pr, A, "buNone").concat(kids(pr, A, "buChar"), kids(pr, A, "buAutoNum"), kids(pr, A, "buFont"))) pr.removeChild(n);
        const circled = Boolean(prefix[1]);
        pr.setAttribute("marL", circled ? "981075" : "1028700");
        pr.setAttribute("indent", circled ? "-268288" : "-304800");
        pr.appendChild(el(p.ownerDocument, A, "buFont", "typeface", circled ? "+mj-ea" : "+mj-lt"));
        pr.appendChild(el(p.ownerDocument, A, "buAutoNum", "type", circled ? "circleNumDbPlain" : "arabicPeriod", "startAt", circled ? String(prefix[1].codePointAt(0) - 0x2460 + 1) : prefix[2]));
        continue;
      }
    }
    if (!lvl) continue;
    const bare = Boolean(child(pr, A, "buNone"));
    const level = BULLET_LEVELS[Math.min(lvl, BULLET_LEVELS.length) - 1];
    if (style.hang) {
      pr.setAttribute("marL", String(Math.round((lvl - 1) * 0.25 * EMU)));
      pr.setAttribute("indent", String(bare ? 0 : Math.round(-0.2 * EMU)));
    } else if (style.aligned && bare && parseInt(pr.getAttribute("indent"), 10) === level.indent) {
      pr.setAttribute("marL", String(BULLET_LEVELS[lvl - 2].marL));
      pr.setAttribute("indent", "0");
    }
  }
}

// Port of LecturePpt.geometry(): reads a template shape's <a:ext> in points, default 630x390.
function geometry(sh) {
  const sp = child(sh, P, "spPr");
  const xf = sp ? child(sp, A, "xfrm") : null;
  const ext = xf ? child(xf, A, "ext") : null;
  if (!ext) return [630, 390];
  return [parseInt(ext.getAttribute("cx"), 10) / 12700, parseInt(ext.getAttribute("cy"), 10) / 12700];
}

module.exports = {
  PRACTICE_STYLE, ANSWER_STYLE, REFERENCE_STYLE, REFERENCE_MARKER, isReferenceMarker, shiftStyle,
  PRACTICE_BOX, ANSWER_COLUMNS, STYLE_SPACE, styleSize, styledCost, restyle, geometry,
};
