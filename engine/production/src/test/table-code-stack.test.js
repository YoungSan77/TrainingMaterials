"use strict";
// production-guide.md 「소스 코드」: 표 다음의 짧은 코드는 표 아래의 빈 띠에 쌓고, 그 뒤의 짧은
// 글도 같은 장에 이어 쓴다. 이 규칙이 없을 때는 표 장과 코드 장이 둘 다 절반쯤 빈 채로 갈렸다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

const CODE = [
  "public record Money(long amount) {",
  "    public Money {",
  "        if (amount < 0) throw new IllegalArgumentException(\"0 이상이다\");",
  "    }",
  "}",
].join("\n");

const md = (code) => [
  "--------------------",
  "Session 명: 01. 표와 코드",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 값",
  "",
  "## 01. 값",
  "",
  "**금액**은 숫자로 두지 않는다.",
  "",
  "**표 — 숫자로 둘 때와 타입으로 둘 때**",
  "| | `long amount` | `Money` |",
  "|---|---|---|",
  "| 음수를 막는 곳 | 쓰는 쪽마다 if | 만들 때 한 번 |",
  "| 단위를 아는 곳 | 변수 이름 | 타입 |",
  "",
  "```java",
  code,
  "```",
  "",
  "- 값 타입은 **식별자가 없다**.",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
].join("\n");

async function pagesOf(source) {
  const { sections, toc, session } = parse(source);
  const out = path.join(os.tmpdir(), `tm-tcode-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, session, toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

const bodyPages = (pages) => pages.filter((p) => p.heading.startsWith("01. 값"));

test("표 다음의 짧은 코드와 그 설명은 표와 같은 장에 쌓인다", async () => {
  const pages = await pagesOf(md(CODE));
  const body = bodyPages(pages);
  assert.equal(body.length, 1, "한 장이다 (" + body.length + "장)");
  const page = body[0];
  assert.ok(page.items.some((it) => it.kind === "table"), "표가 있다");
  assert.ok(page.items.some((it) => it.kind === "source"), "코드가 같은 장에 있다");
  assert.ok(page.doc.documentElement.textContent.includes("식별자가 없다"), "뒤의 글도 같은 장에 있다");
});

test("표 아래에 들어가지 않는 긴 코드는 제 장으로 간다", async () => {
  const long = Array.from({ length: 30 }, (_, i) => `    int 항목${i} = ${i};`).join("\n");
  const pages = await pagesOf(md("class 값 {\n" + long + "\n}"));
  const body = bodyPages(pages);
  assert.ok(body.length >= 2, "표와 코드가 갈린다");
  assert.ok(body[0].items.some((it) => it.kind === "table"), "앞 장이 표다");
  assert.ok(!body[0].items.some((it) => it.kind === "source"), "표 장에 코드를 억지로 넣지 않는다");
});
