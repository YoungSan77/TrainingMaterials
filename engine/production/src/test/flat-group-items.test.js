"use strict";
// session-authoring-guide.md 「묶음은 상위 bullet, 소속은 들여쓴 bullet이다」: 목록을 예고하는 머리말
// ("… 다음과 같다.", "다음 사항은 …", "…:")과 그 항목이 같은 단에 있으면 어디까지가 한 묶음인지
// 보이지 않고, 들여쓰기 단계가 주는 다른 글머리표도 붙지 않는다. LLM 산출물은 머리말을 문단으로,
// 항목을 평평한 목록으로 내놓으므로 기록을 옮길 때마다 이 모양이 들어온다(2026-11-05).
const test = require("node:test");
const assert = require("node:assert/strict");
const { flatGroupItems } = require("../structure");
const { parse } = require("../parse");

test("목록을 예고한 머리말 아래의 평평한 목록은 경고다", () => {
  const { sections } = parse(
    [
      "## 01. 미정",
      "",
      "확정하지 않은 것을 남긴다.",
      "",
      "정적 모델에서 다음 사항은 정하지 않는다.",
      "",
      "- `Address`의 세부 항목",
      "- `Quantity`의 구체적인 상한",
      "",
    ].join("\n"),
  );
  const w = flatGroupItems(sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /다음 사항은 정하지 않는다/);
});

test("머리말을 상위 bullet으로 두고 항목을 들여쓰면 경고가 없다", () => {
  const { sections } = parse(
    [
      "## 01. 미정",
      "",
      "확정하지 않은 것을 남긴다.",
      "",
      "- 정적 모델에서 다음 사항은 정하지 않는다.",
      "  - `Address`의 세부 항목",
      "  - `Quantity`의 구체적인 상한",
      "",
    ].join("\n"),
  );
  assert.deepEqual(flatGroupItems(sections), []);
});

test("목록을 예고하지 않는 lead 문장 아래의 bullet은 경고가 아니다", () => {
  const { sections } = parse(
    [
      "## 01. 단가",
      "",
      "주문 단가는 **생성 시점**에 확정된다.",
      "",
      "- 생성 뒤 판매가가 바뀌어도 단가는 그대로다.",
      "- 주문 금액도 바뀌지 않는다.",
      "",
    ].join("\n"),
  );
  assert.deepEqual(flatGroupItems(sections), []);
});
