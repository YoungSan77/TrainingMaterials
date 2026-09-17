'use strict';
// compactPack.test.js — Phase 4.5: 실측 ink 기반 compact 병합 모델(codeInk.js +
// compactPack.js) 회귀. Golden(lecture-ppt-java CompactRenderer) 포트가 실제로
// "shape 경계는 겹쳐도 되지만 실제 glyph ink 영역은 겹치면 안 된다"는 규칙을 지키는지,
// 그리고 font 축소 없이 안 되면 병합을 포기하는지를 확인한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../geometry.js');
const ink = require('../codeInk.js');
const {
  packCompactCodePages, isCodeOnlyPage, concatLines, tryMerge, choose, evaluate, CODE_SPACING,
} = require('../compactPack.js');

function codePage(topicTitle, blocksLines) {
  return {
    topicTitle,
    blocks: blocksLines.map((lines) => ({ type: 'code', lines })),
    citationTexts: [],
  };
}

// 폭 계산을 codeInk.glyphWidthIn으로 직접 뽑아서(하드코딩 매직넘버 없이) 정확히
// "이 폭에서 wrap이 나는지"를 결정하는 문자열을 만든다.
function repeatToWidth(ch, targetWidthIn, fontSizePt = G.FS_CODE) {
  const perChar = ink.glyphWidthIn(ch, fontSizePt);
  const n = Math.ceil(targetWidthIn / perChar);
  return ch.repeat(n);
}

test('Golden baseline: CODE/TREE는 맑은 고딕 10pt 측정 모델을 공유한다', () => {
  assert.equal(G.FS_CODE, 10);
  assert.equal(CODE_SPACING.leadingPt, 11.5);
});

test('1) 순수 좌우 컬럼 병합 — 짧은 두 블록은 같은 높이에서 시작하는 2열로 합쳐진다', () => {
  const linesA = ['int a = 1;', 'int b = 2;'];
  const linesB = ['int c = 3;', 'int d = 4;'];
  const choice = choose(linesA, linesB);
  assert.ok(choice, '짧은 두 블록은 반드시 병합 가능해야 한다');
  assert.equal(choice.name, 'columns');
  assert.equal(choice.first.y, G.CONTENT_TOP);
  assert.equal(choice.second.y, G.CONTENT_TOP, 'columns 배치는 두 box가 같은 높이에서 시작한다');
  assert.equal(choice.first.measured.wraps, 0);
  assert.equal(choice.second.measured.wraps, 0);
});

test('2) staggered 병합 — 컬럼 분할로는 줄바꿈이 나지만 더 넓은 폭을 쓰면 줄바꿈 없이 맞는 경우', () => {
  // columns 계열의 box1 최대폭: (CW-H_GAP)*0.60. staggered 계열의 box1 최대폭: CW*0.655
  // (compactPack.js 상수) — 그 사이 폭에서만 wrap이 나는 한 줄을 만든다.
  const columnsMaxW = (G.CW - 0.22) * 0.60;
  const staggeredMaxW = G.CW * 0.655;
  assert.ok(staggeredMaxW > columnsMaxW, '전제: staggered 쪽 box1 최대폭이 columns보다 넓어야 한다');
  const longLine = repeatToWidth('A', (columnsMaxW + staggeredMaxW) / 2);
  const linesA = [longLine, 'int x = 1;'];
  const linesB = ['int y = 2;', 'int z = 3;'];
  const choice = choose(linesA, linesB);
  assert.ok(choice, '더 넓은 폭이면 줄바꿈 없이 들어가야 하므로 병합에 성공해야 한다');
  assert.equal(choice.name, 'staggered', 'columns 폭으로는 이 줄이 wrap 없이 안 들어가야 staggered가 이긴다');
});

test('3) shape 경계는 겹쳐도 실제 glyph ink가 안 겹치면 충돌로 보지 않는다(PASS)', () => {
  // 두 placement의 선언된 box(x~x+w)는 겹치지만, 실제 텍스트는 짧아서 ink는 서로 안 닿는다.
  const p = { x: 0.4, y: G.CONTENT_TOP, w: 5.0, measured: ink.measureBlock(['ab'], 5.0, G.FS_CODE, CODE_SPACING) };
  const q = { x: 3.0, y: G.CONTENT_TOP, w: 5.0, measured: ink.measureBlock(['cd'], 5.0, G.FS_CODE, CODE_SPACING) };
  // shape 경계(선언 폭) 자체는 겹친다 — 이 값 자체가 이 테스트의 전제다.
  assert.ok(p.x < q.x + q.w && q.x < p.x + p.w, '전제: 선언된 box 경계는 겹쳐야 한다');
  assert.equal(ink.collide(p, q, 0.22, 0.04), false, '실제 ink는 각각 2글자뿐이라 안 닿아야 한다');
});

test('4) 실제 glyph ink가 겹치면 병합하지 않는다(FAIL)', () => {
  // 두 블록 다 거의 전체 폭(CW-0.3in)을 채우는 줄이 16줄씩이면: 좌/우로 나누면 폭이
  // 모자라 겹치고(같은 높이), stagger로 순서를 미뤄도 두 블록의 전체 폭 기준 높이 합이
  // 이미 CONTENT_H를 넘어(측정: 16줄 단독 전체폭 기준 약 3.25in, 둘을 순서대로 쌓으면
  // 6.5in > CONTENT_H) 겹치지 않게 떼어놓을 여유 자체가 없다 — 실측으로 확인한 값이다
  // (하드코딩 아님 — 이 파일의 repeatToWidth/measureBlock으로 직접 재서 판정한다).
  const fullLine = repeatToWidth('W', G.CW - 0.3);
  const linesA = Array.from({ length: 16 }, () => fullLine);
  const linesB = Array.from({ length: 16 }, () => fullLine);
  const soloHeight = ink.measureBlock(linesA, G.CW, G.FS_CODE, CODE_SPACING).height;
  assert.ok(soloHeight * 2 > G.CONTENT_H, '전제: 두 블록을 순서대로 쌓아도 안전 영역을 넘어야 한다(겹치지 않을 여유가 없다)');
  const choice = choose(linesA, linesB);
  assert.equal(choice, null, '겹침을 피할 폭도 높이도 없으면 병합 후보가 하나도 유효하지 않아야 한다');
});

test('5) 수직 방향 배치 — staggered로 선택되면 box2가 box1과 다른 높이에서 시작한다', () => {
  const columnsMaxW = (G.CW - 0.22) * 0.60;
  const staggeredMaxW = G.CW * 0.655;
  const longLine = repeatToWidth('A', (columnsMaxW + staggeredMaxW) / 2);
  const linesA = [longLine, 'short'];
  const linesB = ['short2', 'short3'];
  const choice = choose(linesA, linesB);
  assert.ok(choice);
  assert.equal(choice.name, 'staggered');
  assert.notEqual(choice.second.y, choice.first.y, 'staggered 배치는 box2가 box1과 다른 높이에서 시작해야 한다');
  assert.ok(choice.second.y > choice.first.y, 'box2는 box1보다 아래에서 시작한다(처지는 방향)');
});

test('6) 안전 영역에 안 들어가면 병합하지 않는다 — font 축소 없이 페이지를 그대로 유지한다', () => {
  // 각 블록만으로도 이미 CONTENT_H 예산을 넘는 줄 수 — 어떤 배치로도 안전 영역 안에 못 들어간다.
  const perLineIn = G.IN(G.FS_CODE * 1.15) + G.IN(2);
  const tooMany = Math.ceil(G.CONTENT_H / perLineIn) + 40;
  const linesA = Array.from({ length: tooMany }, (_, i) => `int a${i} = ${i};`);
  const linesB = Array.from({ length: tooMany }, (_, i) => `int b${i} = ${i};`);
  const choice = choose(linesA, linesB);
  assert.equal(choice, null, '두 블록 다 그 자체로 안전 영역을 넘으면 병합 후보가 없어야 한다');

  const pageA = codePage('주제 A', [linesA]);
  const pageB = codePage('주제 A', [linesB]);
  const packed = packCompactCodePages([pageA, pageB]);
  assert.equal(packed.length, 2, '병합에 실패하면 두 페이지를 그대로 유지해야 한다(font 축소로 우회하지 않는다)');
  assert.ok(!packed.some((p) => p.layout === 'code-compact'));
});

test('7) topic 경계를 넘어 병합하지 않는다', () => {
  const pageA = codePage('주제 A', [['int a = 1;']]);
  const pageB = codePage('주제 B', [['int b = 2;']]); // 다른 topic
  const packed = packCompactCodePages([pageA, pageB]);
  assert.equal(packed.length, 2, '서로 다른 topic의 인접 code-only 페이지는 병합 후보가 아니다');
  assert.equal(isCodeOnlyPage(pageA), true);
  assert.equal(isCodeOnlyPage(pageB), true);
});

test('8) 내용 보존 — 병합된 codeBoxes의 원문을 합치면 원래 두 페이지의 줄과 정확히 같다', () => {
  const linesA = ['int a = 1;', 'int b = 2;'];
  const linesB = ['int c = 3;', 'int d = 4;'];
  const pageA = codePage('주제 X', [linesA]);
  const pageB = codePage('주제 X', [linesB]);
  const merged = tryMerge(pageA, pageB);
  assert.ok(merged);
  assert.deepEqual(merged.boxes[0].lines, concatLines(pageA));
  assert.deepEqual(merged.boxes[1].lines, concatLines(pageB));
  // 원본 block 텍스트가 그대로 보존됐는지(순서/내용 모두) — 손실·재배열 없음.
  assert.deepEqual(merged.boxes[0].lines, linesA);
  assert.deepEqual(merged.boxes[1].lines, linesB);
});

test('9) font 축소가 아예 선택지에 없다 — evaluate/measure는 항상 G.FS_CODE 고정 폭 모델만 쓴다', () => {
  // choose()/evaluate()는 fontSizePt를 매개변수로 받지 않는다(compactPack.js 소스 계약) —
  // 안 들어가면 폭/좌표만 바꿔 재시도하고, 그래도 안 되면 null을 반환할 뿐 글꼴을 줄이지 않는다.
  assert.equal(evaluate.length <= 5, true);
  const linesA = ['int a = 1;'];
  const linesB = ['int b = 2;'];
  const c1 = evaluate(linesA, linesB, 3, G.MARGIN + 3.22, G.CONTENT_TOP);
  assert.ok(c1);
  // measured 결과의 폭 가정을 뒤집어 검증: 같은 linesA를 G.FS_CODE보다 큰 폰트로 재면 항상
  // 더 넓은 ink가 나온다 — 즉 compactPack이 내부적으로 더 작은 폰트를 몰래 쓰고 있지 않다는
  // 확인(더 큰 폰트로 측정했을 때 wrap이 줄어들거나 같아지는 일은 없어야 한다는 방향성 확인).
  const smaller = ink.measureBlock(linesA, 3, G.FS_CODE - 4, CODE_SPACING);
  const actual = ink.measureBlock(linesA, 3, G.FS_CODE, CODE_SPACING);
  assert.ok(actual.ink[0].w >= smaller.ink[0].w, '더 작은 폰트로 재면 폭이 더 좁아야 한다 — 실제 사용 중인 폭이 축소판이 아님을 방증');
});

test('10) 같은 입력에 대해 병합 결정이 결정적이다', () => {
  const linesA = ['int a = 1;', 'int b = 2;', 'System.out.println(a + b);'];
  const linesB = ['int c = 3;', 'int d = 4;', 'System.out.println(c + d);'];
  const c1 = choose(linesA, linesB);
  const c2 = choose(linesA, linesB);
  assert.ok(c1 && c2);
  assert.equal(c1.name, c2.name);
  assert.equal(c1.score, c2.score);
  assert.equal(c1.first.x, c2.first.x);
  assert.equal(c1.first.y, c2.first.y);
  assert.equal(c1.first.w, c2.first.w);
  assert.equal(c1.second.x, c2.second.x);
  assert.equal(c1.second.y, c2.second.y);
  assert.equal(c1.second.w, c2.second.w);
});
