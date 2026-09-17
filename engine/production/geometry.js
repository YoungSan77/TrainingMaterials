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
const FS_CODE = 10;                           // Golden CODE/TREE baseline (맑은 고딕)
const FS_TABLE = 10;
const FS_FOOTER = 8;
const FS_CITATION = 10;                       // citation/출처 — 본문(14)보다 작게, 압도하지 않는다.

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
// paraHeight의 폭-매개변수화 버전 — split(좌/우 2단) 레이아웃처럼 CW 전체가 아니라 더 좁은
// column 폭에서 실제로 몇 줄이 되는지 재야 할 때 쓴다. 측정 로직(measure.js 문자폭 모델)은
// 완전히 동일하다 — "무엇을 폭으로 쓰는지"만 호출자가 명시한다.
function paraHeightW(text, fs, availW, opts = {}) {
  const bulletIndentIn = opts.bullet ? IN(BULLET_INDENT_PT) : 0;
  const availIn = availW - PAD * 2 - bulletIndentIn;
  const n = paraLines(text, availIn, fs);
  return n * lineHIn(fs);
}

// ── code/tree 폭 모델 ────────────────────────────────────────────────────
// [Phase 2/4 정정] Golden 실측으로 code/tree 글꼴이 Consolas 등 고정폭이 아니라 본문과
// 같은 맑은 고딕(가변폭)임이 확인됐다(Phase 2 archetype inventory). 그래서 별도의 monospace
// 상수를 쓰지 않고, measure.js의 textW(donor, 본문과 동일한 문자폭 모델)를 그대로 재사용한다
// — "엔진이 재는 폭과 검증기가 재는 폭이 갈라지면 안 된다"는 이 파일의 기존 원칙을 code에도
// 동일하게 적용한 것뿐이다(이전의 monoCharWidthIn=0.60em 고정값은 폐기 — 실측과 맞지 않았다).
function monoLineWidthIn(line, fs) { return textW(line, fs); }
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

// ── citation(출처) footer ──────────────────────────────────────────────
// slide 하단 별도 영역에 본문보다 작은 글자로 모아 놓는다(citation footer). 여러 개면 세로로 쌓는다.
const CITATION_GAP_IN = 0.04;
function citationFooterHeight(texts) {
  if (!texts || !texts.length) return 0;
  let h = CITATION_GAP_IN; // footer 상단 여백 한 번
  for (const t of texts) h += paraHeight(t, FS_CITATION) + CITATION_GAP_IN;
  return h;
}

// ── TOC(목차) ────────────────────────────────────────────────────────────
const TOC_TITLE = '목차';
const TOC_FS = 16;
const TOC_PARA_BEFORE_PT = 3;
const TOC_PARA_AFTER_PT = 3;
const TOC_LEFT_COUNT = 15;     // TOC 규칙: 좌측 01~15(고정 개수), 우측 16 이상 — 동적 반분이 아니다.
const TOC_GUTTER = 0.3;
const TOC_COL_W = (CW - TOC_GUTTER) / 2;

// 한 컬럼(entries 배열)이 실제로 필요한 세로 높이 — overflow 검증에 쓴다(silent shrink 금지).
function tocColumnHeight(entries, colW = TOC_COL_W, fs = TOC_FS, beforePt = TOC_PARA_BEFORE_PT, afterPt = TOC_PARA_AFTER_PT) {
  let h = 0;
  for (const e of entries) {
    const n = paraLines(e, colW, fs);
    h += n * lineHIn(fs) + IN(beforePt) + IN(afterPt);
  }
  return h;
}

// ── text+diagram / text+chart split 레이아웃 ────────────────────────────
const SPLIT_GUTTER = 0.3;
const SPLIT_TEXT_RATIO = 0.45;
const SPLIT_VISUAL_RATIO = 0.55;
const SPLIT_TEXT_W = CW * SPLIT_TEXT_RATIO - SPLIT_GUTTER / 2;
const SPLIT_VISUAL_W = CW * SPLIT_VISUAL_RATIO - SPLIT_GUTTER / 2;

module.exports = {
  SLIDE_W, SLIDE_H, MARGIN, CW, TITLE_Y, TITLE_H, DIVIDER_Y,
  CONTENT_TOP, CONTENT_BOTTOM, CONTENT_H, FOOTER_DIVIDER_Y, FOOTER_TEXT_Y, PAD,
  FS_TITLE, FS_TITLE_SMALL, FS_SUB, FS_BODY, FS_CODE, FS_TABLE, FS_FOOTER, FS_CITATION,
  titleFS, lineHIn, paraLines, paraHeight, paraHeightW, BULLET_INDENT_PT,
  monoLineWidthIn, CODE_LINE_SPACING_IN, codeBlockHeight, codeLineOverflows,
  computeColWidths, cellLines, rowHeight,
  citationFooterHeight, CITATION_GAP_IN,
  TOC_TITLE, TOC_FS, TOC_PARA_BEFORE_PT, TOC_PARA_AFTER_PT, TOC_LEFT_COUNT, TOC_GUTTER, TOC_COL_W,
  tocColumnHeight,
  SPLIT_GUTTER, SPLIT_TEXT_RATIO, SPLIT_VISUAL_RATIO, SPLIT_TEXT_W, SPLIT_VISUAL_W,
  IN, textW, lineCount,
};
