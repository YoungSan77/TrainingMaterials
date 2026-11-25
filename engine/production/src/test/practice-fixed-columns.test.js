"use strict";
// 실습 과제의 **좌우 두 단 한 장** 배치(builder.js의 `**결과물**`+`**프롬프트**` 분기).
//
// 2026-11-25: 분할 탐색이 왼쪽을 넓히는 51~75%만 보고, 모두 실패하면 맞지 않는 50:50 상자를
// 그대로 넘겨 일반 오류로 중단했다. 그래서 (1) **오른쪽** 단이 넘치는 실습은 맞는 분할이 있어도
// 찾지 못했고, (2) 보고된 초과량이 가장 가까운 분할이 아니라 50:50의 값이어서 원고에서 줄일 양을
// 알 수 없었다. 이 테스트는 두 가지를 고정한다 — 맞는 분할은 찾고, 없으면 가장 가까운 분할의
// 초과량을 보고한다. 전폭으로 떨어지는 대체 경로는 두지 않는다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

async function pagesOf(md) {
  const { sections } = parse(md);
  const toc = sections.map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0, meta: null }));
  const out = path.join(os.tmpdir(), `tm-fixedcol-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages.filter((p) => !p.isToc);
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

// 왼쪽(투입물·진행 방법·프롬프트)과 오른쪽(결과물) 분량을 따로 주어 어느 단이 넘칠지 정한다.
function practice(leftItems, rightItems) {
  const line = (label, i) => `+ ${label} ${i + 1}번은 수강생이 판단할 기준을 한 줄이 넘도록 적는다.`;
  return "## 01. 실습 1 — 과제\n\n실습의 **목표**를 한 문장으로 적는다.\n\n"
    + "**투입물**\n\n+ 실습 0의 `주문한다-업무조건.md`\n\n"
    + "**진행 방법**\n\n"
    + Array.from({ length: leftItems }, (_, i) => line("진행", i)).join("\n") + "\n\n"
    + "**프롬프트**\n\n  + ① 입력을 읽고 주문 스토리를 정리해라. 미정은 질문으로 남겨라.\n\n"
    + "**결과물**\n\n"
    + Array.from({ length: rightItems }, (_, i) => line("결과", i)).join("\n") + "\n";
}

test("좌우 두 단에 들어가는 실습은 한 장이고 14pt 두 단을 유지한다", async () => {
  const pages = await pagesOf(practice(3, 3));
  assert.equal(pages.length, 1);
  assert.equal(pages[0].practiceColumns, 2);
  assert.equal(pages[0].practiceSize, 14);
});

test("오른쪽 단이 넘치는 실습도 왼쪽을 좁혀 맞는 분할을 찾는다", async () => {
  // 왼쪽은 짧고 오른쪽이 길다 — 왼쪽을 넓히는 51~75%만 보던 탐색으로는 맞출 수 없었다.
  const pages = await pagesOf(practice(1, 14));
  assert.equal(pages.length, 1, "맞는 분할이 있으면 한 장으로 배치한다");
  assert.equal(pages[0].practiceColumns, 2, "전폭으로 떨어지지 않는다");
});

test("어느 분할로도 맞지 않으면 가장 가까운 분할의 초과량을 보고한다", async () => {
  await assert.rejects(() => pagesOf(practice(40, 40)), (error) => {
    assert.match(error.message, /실습 좌우 2단이 한 장에 들어가지 않는다/);
    assert.match(error.message, /01\. 실습 1 — 과제/, "어느 원고의 어느 topic인지 밝힌다");
    assert.match(error.message, /가장 가까운 분할 왼쪽 \d{2}%에서 \d+(?:\.\d)?pt 초과/,
      "줄일 양을 알 수 있도록 최소 초과량을 적는다");
    return true;
  });
});

test("보고하는 초과량은 50:50이 아니라 가장 가까운 분할의 값이다", async () => {
  // 한쪽으로 치우친 실습에서 50:50의 초과량은 최소 초과량보다 크다. 50%가 최적일 수는 없다.
  await assert.rejects(() => pagesOf(practice(2, 60)), (error) => {
    const at = /왼쪽 (\d{2})%에서 (\d+(?:\.\d)?)pt 초과/.exec(error.message);
    assert.ok(at, `초과량 보고 형식이 아니다: ${error.message}`);
    assert.notEqual(at[1], "50", "치우친 실습의 최적 분할은 50%가 아니다");
    assert.ok(Number(at[2]) > 0, "초과량은 양수다");
    return true;
  });
});
