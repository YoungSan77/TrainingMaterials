"use strict";
// production-guide.md 「표·도식 제목」: `**표 — 제목**`은 표 바로 위에 14pt 굵게 가운데 그리고
// 표식 자체는 출력하지 않는다. 코드 블록 뒤에 표가 오면 그 제목 줄이 코드의 뒷글로 딸려 가
// 본문에 "표 — 제목" 그대로 찍히고 표는 제목을 잃었다(2026-11-05).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

const md = [
  "--------------------",
  "Session 명: 01. 코드와 표",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 파생 속성",
  "",
  "## 01. 파생 속성",
  "",
  "**주문 금액**은 저장하지 않고 계산한다.",
  "",
  "```java",
  "    public Money totalAmount() {",
  "        return items.stream().map(OrderItem::금액).reduce(Money.ZERO, Money::plus);",
  "    }",
  "```",
  "",
  "**표 — 저장할 값과 계산할 값**",
  "| 값 | 두는 방식 |",
  "|---|---|",
  "| 단가 | 저장한다 |",
  "| 주문 금액 | 계산식으로 둔다 |",
  "",
  "- 확인할 곳이 **한 군데**다.",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
].join("\n");

test("코드 뒤에 오는 표의 제목은 표의 캡션이 되고 본문에 찍히지 않는다", async () => {
  const { sections, toc, session } = parse(md);
  const out = path.join(os.tmpdir(), `tm-ctcap-${process.pid}-${Date.now()}.pptx`);
  let pages;
  try {
    pages = (await render(sections, TEMPLATE_DIR, out, session, toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
  const body = pages.filter((p) => p.heading.startsWith("01. 파생 속성"));
  assert.ok(body.length >= 1, "본문 장이 있다");
  const text = body.map((p) => p.doc.documentElement.textContent).join("\n");
  assert.ok(!text.includes("표 —"), "표식이 본문에 찍히지 않는다");
  assert.ok(text.includes("저장할 값과 계산할 값"), "제목 자체는 남는다");
  const tablePage = body.find((p) => p.items.some((it) => it.kind === "table"));
  assert.ok(tablePage, "표가 있다");
  assert.ok(
    tablePage.doc.documentElement.textContent.includes("저장할 값과 계산할 값"),
    "제목이 표와 같은 장에 있다",
  );
});
