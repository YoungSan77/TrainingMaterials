'use strict';
// geometry.js — production engine의 순수 기하 상수·측정 함수.
// 문자폭 모델은 engine/measure.js(donor, 그대로 재사용) 하나만 쓴다 — 엔진이 재는 줄 수와
// 검증기가 재는 줄 수가 갈라지면 오버플로가 구조적으로 생긴다(기존 context.js의 동일 원칙).
const measure = require('../measure.js');
const { IN, textW, lineCount } = measure;

// ── Slide 상수(pure geometry, session/semantic 개념 없음) ──────────────────
const SLIDE_W = 10, SLIDE_H = 7.5;           // LAYOUT_4x3 — 기존 legacy 산출물과 동일 규격(donor 관례, 낮은 위험)
const MARGIN = 0.4;
const CW = SLIDE_W - MARGIN * 2;             // 9.2
const TITLE_Y = 0.22, TITLE_H = 0.46;
const DIVIDER_Y = 0.80;
const CONTENT_TOP = 1.00;
const CONTENT_BOTTOM = 6.85;
const CONTENT_H = CONTENT_BOTTOM - CONTENT_TOP;
const FOOTER_DIVIDER_Y = 7.05;
const FOOTER_TEXT_Y = 7.10;
const PAD = 0.07;                             // box 내부 여백(in)

const FS_TITLE = 22, FS_TITLE_SMALL = 18;
const FS_SUB = 13;                            // subheading
const FS_BODY = 14;                           // paragraph/bullets
const FS_CODE = 11;                           // monospace
const FS_TABLE = 10;
const FS_FOOTER = 8;

const titleFS = (t) => (textW(t, FS_TITLE) <= CW ? FS_TITLE : FS_TITLE_SMALL);
const lineHIn = (fs) => IN(fs * 1.2);

// ── 일반 텍스트(paragraph/bullets/subheading) 높이 ─────────────────────────
// bullet=false: 들여쓰기 없는 문단. bullet=true: 불릿 들여쓰기 폭만큼 available width가 줄어든다.
const BULLET_INDENT_PT = 14;
function paraLines(text, availW, fs) {
  const avIn = availW;
  return lineCount(text, avIn, fs);
}
function paraHeight(text, fs, opts = {}) {
  const bulletIndentIn = opts.bullet ? IN(BULLET_INDENT_PT) : 0;
  const availIn = CW - PAD * 2 - bulletIndentIn;
  const n = paraLines(text, availIn, fs);
  return n * lineHIn(fs);
}

// ── monospace(code) 폭 모델 ──────────────────────────────────────────────
// Consolas 등 고정폭 글꼴은 measure.js의 가변폭(맑은 고딕 기준) 모델과 다르다.
// 문자당 폭 = 0.60em로 근사(고정폭 글꼴의 실측 평균에 가까운 보수적 상수 — SAFE 마진 포함).
const MONO_EM = 0.60;
function monoCharWidthIn(fs) { return IN(fs) * MONO_EM; }
function monoLineWidthIn(line, fs) { return [...String(line)].length * monoCharWidthIn(fs); }
const CODE_LINE_SPACING_IN = IN(FS_CODE * 1.15);

function codeBlockHeight(lines, fs = FS_CODE) {
  return lines.length * CODE_LINE_SPACING_IN + PAD * 2;
}

// 코드 한 줄이 사용 가능 폭을 넘으면(줄바꿈이 코드 들여쓰기 의미를 깨므로 wrap하지 않는다)
// overflow — 호출자가 split 또는 fail로 처리한다.
function codeLineOverflows(line, availW = CW - PAD * 2, fs = FS_CODE) {
  return monoLineWidthIn(line, fs) > availW;
}

// ── table 폭/높이 모델 ──────────────────────────────────────────────────
// 열폭: 각 열의 실제 텍스트 최대폭 비율로 배분(고정 상수로 재지 않는다 — primitives.js 원칙 계승,
// 코드는 새로 작성). 최소 열폭 바닥을 둬 극단적으로 좁아지는 열이 생기지 않게 한다.
function computeColWidths(header, rows, fs = FS_TABLE) {
  const nCols = header.length;
  const natural = new Array(nCols).fill(0);
  const allRows = [header, ...rows];
  for (const r of allRows) {
    for (let c = 0; c < nCols; c++) {
      const w = textW(String(r[c] ?? ''), fs) + PAD * 2;
      if (w > natural[c]) natural[c] = w;
    }
  }
  const totalNatural = natural.reduce((a, b) => a + b, 0);
  const MIN_COL = 0.55;
  let widths = natural.map(w => Math.max(MIN_COL, (w / totalNatural) * CW));
  const totalW = widths.reduce((a, b) => a + b, 0);
  widths = widths.map(w => (w / totalW) * CW);   // 정규화해서 정확히 CW에 맞춘다
  return widths;
}

function cellLines(text, colWidthIn, fs = FS_TABLE) {
  return lineCount(String(text ?? ''), colWidthIn - PAD * 2, fs);
}

function rowHeight(row, widths, fs = FS_TABLE) {
  let maxLines = 1;
  row.forEach((cell, c) => { maxLines = Math.max(maxLines, cellLines(cell, widths[c], fs)); });
  return maxLines * lineHIn(fs) + PAD * 2;
}

module.exports = {
  SLIDE_W, SLIDE_H, MARGIN, CW, TITLE_Y, TITLE_H, DIVIDER_Y,
  CONTENT_TOP, CONTENT_BOTTOM, CONTENT_H, FOOTER_DIVIDER_Y, FOOTER_TEXT_Y, PAD,
  FS_TITLE, FS_TITLE_SMALL, FS_SUB, FS_BODY, FS_CODE, FS_TABLE, FS_FOOTER,
  titleFS, lineHIn, paraLines, paraHeight, BULLET_INDENT_PT,
  monoCharWidthIn, monoLineWidthIn, CODE_LINE_SPACING_IN, codeBlockHeight, codeLineOverflows,
  computeColWidths, cellLines, rowHeight,
  IN, textW, lineCount,
};
