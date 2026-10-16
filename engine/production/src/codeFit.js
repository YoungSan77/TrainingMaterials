"use strict";
// 글과 코드가 차지하는 크기 — 본문 줄 수를 세고, 코드 블록의 글자 크기·단 수를 고른다
// (production-guide.md 「소스 코드」, 「괄호」).
const { plain, wide, estimate, codePoints } = require("./text");

// Lines a body paragraph takes: like estimate(), but a "(...)" span is rendered 4pt smaller
// (production-guide.md, 괄호 -4pt) and is measured at that size.
function proseLines(text, width, size) {
  let sum = 0, depth = 0;
  for (const cp of codePoints(text)) {
    if (cp === 0x28) depth++;
    const s = depth > 0 ? size - 4 : size;
    sum += wide(cp) ? s : s * 0.56;
    if (cp === 0x29 && depth > 0) depth--;
  }
  return Math.max(1, Math.ceil(sum / (width - 12)));
}

const CODE_COL_GAP = 0.2;
function codeHeightPt(lines, widthPt, size, lineH) {
  return (lines.reduce((s, l) => s + estimate(plain(l), widthPt, size), 0) + 1) * lineH;
}

// The two halves of a code block for side-by-side columns: split at a blank line nearest the
// middle (between members), else after the least-indented closing "}", so that a column never
// starts inside a method body.
function splitColumns(lines) {
  let best = Math.ceil(lines.length / 2), bestScore = Infinity;
  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    const indent = prev.length - prev.trimStart().length;
    let score;
    if (prev.trim() === "") score = Math.abs(i - lines.length / 2);
    else if (prev.trim() === "}") score = Math.abs(i - lines.length / 2) + 1000 * (indent + 1);
    else continue;
    if (score < bestScore) { best = i; bestScore = score; }
  }
  return [lines.slice(0, best), lines.slice(best)];
}

const wraps = (lines, widthPt, size) => lines.some((l) => estimate(plain(l), widthPt, size) > 1);

// The layout that fits the whole code in `availPt`, trying 10pt one column, 10pt two columns,
// then 9pt and 8pt (tighter line spacing) in one and two columns -- first among layouts where no
// line wraps, then among any. null when none fits.
function planCode(text, widthPt, availPt) {
  const lines = text.split("\n");
  const options = [];
  for (const [size, lineH] of [[10, 13], [9, 10.8], [8, 9.6]]) {
    options.push({ size, lineH, cols: [lines], w: widthPt });
    const halves = splitColumns(lines);
    if (halves[1].length) options.push({ size, lineH, cols: halves, w: (widthPt - CODE_COL_GAP * 72) / 2 });
  }
  const fits = (o) => Math.max(...o.cols.map((c) => codeHeightPt(c, o.w, o.size, o.lineH))) <= availPt;
  const pick = options.find((o) => fits(o) && !o.cols.some((c) => wraps(c, o.w, o.size))) || options.find(fits);
  return pick ? { size: pick.size, lineH: pick.lineH, cols: pick.cols.map((c) => c.join("\n")) } : null;
}

module.exports = { proseLines, codeHeightPt, splitColumns, planCode, CODE_COL_GAP };
