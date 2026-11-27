"use strict";
// 렌더 검사의 회귀 검사. 실제로 사람이 잡았던 결함을 고정 입력으로 재현해 검사가 그것을 잡는지,
// 그리고 정상 입력을 잘못 잡지는 않는지 본다(2026-11-27 S01 시각 검토).
const test = require("node:test");
const assert = require("node:assert/strict");
const { checkLines, checkShapes, BODY_BOTTOM, BODY_RIGHT, SLACK_IN } = require("./check-rendered");

// 기본값은 **오른쪽 끝까지 찬 본문 한 줄**이다 — 꼬리는 그런 줄 뒤에만 생긴다.
const line = (text, over = {}) => ({ text, xMin: 30, yMin: 100, xMax: 690, yMax: 120, ...over });
// 줄바꿈으로 떨어진 꼬리 — 바로 위의 긴 줄과 같은 왼쪽 끝에서 시작하고 바짝 붙어 있다.
const tail = (text) => line(text, { xMin: 30, xMax: 55, yMin: 121, yMax: 141 });

test("고아 줄 — 줄바꿈으로 한두 글자만 떨어지면 잡는다", () => {
  // S01 6장·14장: 문장이 넘쳐 "." 또는 "다."가 다음 줄로 내려갔다. pdftotext는 그 꼬리를
  // 제 블록으로 떼어 놓으므로 묶음이 아니라 **좌표**로 본다.
  const found = checkLines([[line("같은 종류의 빈칸이 더 있다"), tail(".")]]);
  assert.equal(found.length, 1);
  assert.equal(found[0].level, "경고");
  assert.equal(found[0].slide, 1);
  assert.match(found[0].message, /줄바꿈으로 "\."만 다음 줄에 떨어졌다/);
  assert.equal(checkLines([[line("…메우는 일이"), tail("다.")]]).length, 1);
});

test("제 줄로 시작하는 짧은 말과 페이지 번호·저작권 줄은 고아가 아니다", () => {
  assert.deepEqual(checkLines([[line("짧다")]]), []);
  assert.deepEqual(checkLines([[line("본문"), line("- 7 -", { yMin: 500, yMax: 515 })]]), []);
  assert.deepEqual(checkLines([[line("본문"), line("© 2026 Young On Kim.", { yMin: 520, yMax: 530 })]]), []);
  // 표 칸처럼 들여쓴 자리에서 시작하는 짧은 말은 꼬리가 아니다.
  assert.deepEqual(checkLines([[line("긴 설명 줄"), line("맥락", { xMin: 200, xMax: 230, yMin: 121, yMax: 141 })]]), []);
  // 같은 열에서 긴 칸 아래 짧은 칸이 와도 꼬리가 아니다 — 위 줄이 오른쪽 끝에 닿지 않았다.
  assert.deepEqual(checkLines([
    [line("검증 가능성", { xMin: 30, xMax: 120 }), line("위험", { xMin: 30, xMax: 60, yMin: 121, yMax: 141 })],
  ]), []);
  // 멀리 떨어진 짧은 줄도 꼬리가 아니다.
  assert.deepEqual(checkLines([[line("긴 설명 줄"), line("끝", { xMin: 30, xMax: 50, yMin: 300, yMax: 320 })]]), []);
});

test("본문 띠를 벗어난 글과 페이지 번호 자리까지 내려온 글은 오류다", () => {
  const right = checkLines([[line("오른쪽으로 넘친 줄", { xMax: BODY_RIGHT + 20 })]]);
  assert.equal(right[0].level, "오류");
  assert.match(right[0].message, /좌우 본문 띠/);
  const low = checkLines([[line("아래로 내려온 줄", { yMax: BODY_BOTTOM + 10 })]]);
  assert.equal(low[0].level, "오류");
  assert.match(low[0].message, /페이지 번호 자리/);
  // 페이지 번호 자체는 그 아래에 있는 것이 정상이다.
  assert.deepEqual(checkLines([[line("- 7 -", { yMax: BODY_BOTTOM + 10 })]]), []);
});

test("세션명이 장마다 다른 자리에 있으면 오류다", () => {
  // S01 8장: 제목이 길어 머리글이 두 줄이 되면서 세션명만 다른 자리로 갔다.
  const found = checkShapes([
    { slide: 4, sessionName: "6170933,367445", pictures: [] },
    { slide: 5, sessionName: "6170933,367445", pictures: [] },
    { slide: 8, sessionName: "5076056,0", pictures: [] },
  ]);
  assert.equal(found.length, 1);
  assert.equal(found[0].level, "오류");
  assert.match(found[0].message, /8장\(5076056,0\)/);
  // 같은 자리면 조용하다. 세션명이 없는 표지·목차 장은 비교에서 뺀다.
  assert.deepEqual(checkShapes([
    { slide: 1, sessionName: null, pictures: [] },
    { slide: 4, sessionName: "6170933,367445", pictures: [] },
    { slide: 5, sessionName: "6170933,367445", pictures: [] },
  ]), []);
});

test("도식 아래가 많이 비면 경고한다 — 키울 자리가 있다는 뜻이다", () => {
  // S01 7장: 도식이 8pt로 줄어 6.48in 폭에 아래가 1.5in 넘게 비어 있었다.
  const found = checkShapes([{ slide: 7, sessionName: null, pictures: [{ bottomIn: 5.5, widthIn: 6.48 }] }]);
  assert.equal(found.length, 1);
  assert.equal(found[0].level, "경고");
  assert.match(found[0].message, /도식 아래가 1\.5\din 비었다/);
  // 아래를 다 쓴 도식은 조용하다.
  assert.deepEqual(checkShapes([{ slide: 7, sessionName: null, pictures: [{ bottomIn: 7.0 - SLACK_IN + 0.5, widthIn: 6.48 }] }]), []);
  // 본문 폭을 이미 다 쓴 도식은 가로가 한도라 더 커질 수 없다 — 고칠 수 없는 경고는 내지 않는다.
  assert.deepEqual(checkShapes([{ slide: 7, sessionName: null, pictures: [{ bottomIn: 5.5, widthIn: 9.0 }] }]), []);
});
