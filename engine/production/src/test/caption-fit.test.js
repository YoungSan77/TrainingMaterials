"use strict";
// production-guide.md 「표·도식 제목」: 제목이 붙은 도식은 제목 높이만큼 내려가되, 쪽 번호
// 영역으로 들어가지 않는다. 아래가 모자라면 그림을 줄이기 전에 위의 여백만큼 올린다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render, PAGE_NUM_Y } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

const SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 380" width="960" height="380">',
  '  <rect x="6" y="6" width="948" height="368" fill="#ffffff" stroke="#64748b"/>',
  '  <text x="30" y="60" font-size="13" fill="#334155">문서의 네 절을 한 줄씩 적은 띠다</text>',
  "</svg>",
].join("\n");

const md = [
  "--------------------",
  "Session 명: 01. 제목이 붙은 도식",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 도식",
  "",
  "## 01. 도식",
  "",
  "클래스 다이어그램이 담는 것은 개념·속성·관계·다중성까지다. 값의 뜻도, 언제나 참이어야 하는 "
    + "조건도, 정하지 않은 것을 남긴 이유도 다이어그램에는 적을 자리가 없다. 그래서 정적 모델은 "
    + "**문서 하나**로 작성하고, 다이어그램은 그 문서의 한 절이 된다.",
  "",
  "**도식 — SVG — 정적 모델 문서의 4개 절**",
  "",
  "```svg",
  SVG,
  "```",
  "",
  "- 같은 것을 두 번 적지 않는다. 글로 정의하는 것은 **다이어그램에 적을 자리가 없는 것**이다.",
  "- 속성명의 뜻은 **용어집**에, 이번 기능의 조건과 미정은 **이 문서**에 있다. 용어집은 세션을 "
    + "가로질러 자라고, 문서는 기능마다 하나다.",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
].join("\n");

test("제목이 붙은 도식은 쪽 번호 영역으로 내려가지 않는다", async () => {
  const { sections, toc, session } = parse(md);
  const out = path.join(os.tmpdir(), `tm-caption-fit-${process.pid}-${Date.now()}.pptx`);
  let pages;
  try {
    pages = (await render(sections, TEMPLATE_DIR, out, session, toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
  const page = pages.find((p) => (p.pictures || []).length);
  assert.ok(page, "도식이 그려졌다");
  const b = page.pictures[0].bounds;
  assert.ok(Number.isFinite(b.y) && Number.isFinite(b.h), "좌표가 수다: " + JSON.stringify(b));
  assert.ok(b.y + b.h <= PAGE_NUM_Y - 0.15 + 1e-6,
    `도식이 쪽 번호 영역에 들어갔다: 아래 끝 ${(b.y + b.h).toFixed(2)}in`);
  const caption = [...page.doc.getElementsByTagName("a:t")].map((t) => t.textContent).join(" ");
  assert.match(caption, /정적 모델 문서의 4개 절/, "도식 제목이 그려졌다");
});
