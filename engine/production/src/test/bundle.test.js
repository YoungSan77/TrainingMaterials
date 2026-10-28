"use strict";
// production-guide.md 「묶음 덱」: 여러 원고를 받은 순서대로 한 .pptx에 담는다. 각 세션은 자기 덱과
// 같게 구성되고(표지와 과정 목차는 첫 세션에만, 세션마다 자기 목차), 슬라이드의 우측 상단 세션명과
// 별첨 표시도 그 장이 구성된 세션의 것이다. 원고마다의 구조·참조 검사는 단독 렌더링이 맡는다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render, bundle } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { shape, text } = require("../xml");

const COURSE = "묶음 과정";
const ONE = "01. 첫 세션";
const TWO = "02. 둘째 세션";
const SESSIONS = [{ number: "01", name: ONE }, { number: "02", name: TWO }];
const info = () => ({ name: COURSE, sessions: SESSIONS });

function source(session, withAppendix) {
  return [
    "--------------------",
    "Session 명: " + session,
    "--------------------",
    "",
    "## 목차",
    "",
    "01. 세션 목표",
    "02. 요약",
    "",
    "## 01. 세션 목표",
    "",
    "**목표**를 적는다.",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
    "## 02. 요약",
    "",
    "**요약**이다.",
    "",
    "### 핵심",
    "",
    "- **핵심** 한 줄",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
    ...(withAppendix ? [
      "## 별첨. 실습 답",
      "",
      "## 실습의 답",
      "",
      "**답**이다.",
      "",
      "**강사 노트**",
      "",
      "- 노트.",
      "",
    ] : []),
  ].join("\n");
}

function item(session, withAppendix) {
  const { sections, toc } = parse(source(session, withAppendix));
  return { session, toc, sections, course: info() };
}

async function out(name, run) {
  const file = path.join(os.tmpdir(), `tm-bundle-${name}-${process.pid}-${Date.now()}.pptx`);
  try {
    return await run(file);
  } finally {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

const pagesOf = (it) => out("one", async (file) => (await render(it.sections, TEMPLATE_DIR, file, it.session, it.toc, it.course)).pages);

test("받은 순서대로 이어 붙이고 장수는 따로 만든 덱의 합이다", async () => {
  const first = item(ONE), second = item(TWO, true);
  const alone = [(await pagesOf(first)).length, (await pagesOf(second)).length];
  const m = await out("sum", (file) => bundle([first, second], TEMPLATE_DIR, file, COURSE));
  assert.equal(m.pages.length, alone[0] + alone[1]);
  assert.equal(m.pages[0].isCover, true);
  assert.equal(m.pages[alone[0]].heading, TWO + " 목차", "둘째 세션은 자기 목차로 시작한다");
});

test("표지와 과정 목차는 첫 세션에서 한 번만 나온다", async () => {
  const m = await out("cover", (file) => bundle([item(ONE), item(TWO)], TEMPLATE_DIR, file, COURSE));
  assert.equal(m.pages.filter((p) => p.isCover).length, 1);
  assert.equal(m.pages.filter((p) => p.heading === COURSE + " 목차").length, 1);
});

test("슬라이드의 세션명은 그 장이 구성된 세션의 것이다", async () => {
  const first = item(ONE), second = item(TWO, true);
  const n = (await pagesOf(first)).length;
  const m = await out("label", (file) => bundle([first, second], TEMPLATE_DIR, file, COURSE));
  const label = (p) => text(shape(p.doc, 5));
  assert.equal(label(m.pages[0]), "", "표지와 목차는 세션명을 쓰지 않는다");
  assert.equal(label(m.pages[3]), ONE);
  assert.equal(label(m.pages[n + 1]), TWO);
  const appendix = m.pages.filter((p) => p.appendix);
  assert.equal(appendix.length, 1);
  assert.equal(label(appendix[0]), "별첨: " + TWO);
});

test("문서 제목은 과정명이고 manifest도 그것을 쓴다", async () => {
  const m = await out("title", (file) => bundle([item(ONE)], TEMPLATE_DIR, file, COURSE));
  assert.equal(m.title, COURSE);
});

test("묶을 원고가 없으면 거절한다", async () => {
  await assert.rejects(() => out("empty", (file) => bundle([], TEMPLATE_DIR, file, COURSE)), /묶을 원고가 없다/);
});
