"use strict";
// production-guide.md 「표 페이지 쌓기」: 표 뒤의 글은 들어가는 만큼 그 장을 채운다. 다음 표가
// 이어지면 그 사이의 글이 통째로 **다음 표의 lead**가 되어, 앞 장이 표 아래를 비운 채 끝났다
// (ai-native 세션 03의 시연 기록에서 18·20장이 절반 넘게 비었다, 2026-11-05).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

// 앞 표가 띠의 절반을 쓰고, 그 뒤의 글과 다음 표는 함께 들어가지 않는 크기다.
const rows = (n, tag) => Array.from({ length: n }, (_, i) =>
  `| ${tag}-${i + 1} | 주문 금액은 주문이 생길 때의 판매가로 정하고 그 뒤 판매가가 바뀌어도 바꾸지 않는다 | 회의 메모 |`);

const BETWEEN = Array.from({ length: 6 }, (_, i) =>
  `- 사이의 글 ${i + 1}. 이 줄이 다음 표의 lead로 통째로 밀려가면 앞 장은 표 아래를 비운 채 끝난다.`);

const md = [
  "--------------------",
  "Session 명: 01. 표 사이의 글",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 두 표",
  "",
  "## 01. 두 표",
  "",
  "**기록 그대로**",
  "",
  "**문서 형식 — 10pt**",
  "",
  "근거는 요청 한 줄과 회의 메모뿐입니다.",
  "",
  "### 2. 용어",
  "",
  "| 번호 | 규칙 | 근거 |",
  "|---|---|---|",
  ...rows(7, "AR"),
  "",
  ...BETWEEN,
  "",
  "### 4. 업무 규칙",
  "",
  "| 번호 | 규칙 | 근거 |",
  "|---|---|---|",
  ...rows(7, "BR"),
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
].join("\n");

async function pagesOf(source) {
  const { sections, toc, session } = parse(source);
  const out = path.join(os.tmpdir(), `tm-tlead-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, session, toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

test("다음 표가 들어가지 않아도 그 사이의 글은 앞 표 아래를 먼저 채운다", async () => {
  const pages = (await pagesOf(md)).filter((p) => p.heading.startsWith("01. 두 표"));
  assert.ok(pages.length >= 2, "표 2개가 갈린다");
  const first = pages[0];
  assert.ok(first.items.some((it) => it.kind === "table"), "앞 장에 표가 있다");
  assert.ok(
    first.doc.documentElement.textContent.includes("사이의 글 1."),
    "표 뒤의 글이 통째로 다음 표의 lead로 밀리지 않고 앞 장에 쌓인다",
  );
});

test("앞 표 아래에 들어가지 않는 나머지만 다음 표의 lead가 된다", async () => {
  const pages = (await pagesOf(md)).filter((p) => p.heading.startsWith("01. 두 표"));
  const first = pages[0].doc.documentElement.textContent;
  const last = pages[pages.length - 1];
  assert.ok(last.items.some((it) => it.kind === "table"), "마지막 장에 둘째 표가 있다");
  const text = last.doc.documentElement.textContent;
  for (let i = 1; i <= 6; i++) {
    const line = `사이의 글 ${i}.`;
    assert.ok(first.includes(line) || text.includes(line), line + "이 어느 장에는 있다");
    assert.ok(!(first.includes(line) && text.includes(line)), line + "을 두 장에 쓰지 않는다");
  }
  assert.ok(!text.includes("사이의 글 1."), "앞 장이 받을 수 있는 줄을 둘째 표의 lead로 밀지 않는다");
});
