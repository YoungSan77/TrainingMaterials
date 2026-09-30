"use strict";
// Code excerpts checked against their compiled source, SVG UML diagrams that grow like PlantUML,
// and the stacked diagram that shrinks before code is split across slides.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse, block } = require("../parse");
const { render, fitTarget, naturalSize, visualPanel, TARGET_PT, UML_MAX_PT } = require("../builder");
const { checkCodeSources, runs } = require("../codeSource");

const { TEMPLATE_DIR: TEMPLATE } = require("../template");

function session(java, source) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-code-"));
  const p = path.join(root, "s02.md");
  fs.writeFileSync(p, "## 01. 코드\n\n```java\n" + java + "\n```\n");
  if (source !== undefined) {
    fs.mkdirSync(path.join(root, "code", "s02"), { recursive: true });
    fs.writeFileSync(path.join(root, "code", "s02", "예.java"), source);
  }
  return p;
}

const SOURCE = "class 주문 {\n    int 금액;\n    int 번호;\n\n    void 결제한다() {\n        금액 = 0;\n    }\n}\n";

test("an omission comment splits a code block into runs that must each appear in the source", () => {
  assert.deepEqual(runs("class 주문 {\n    // ... 필드 생략\n\n    void 결제한다() {\n    }\n}"),
    ["class 주문 {", "    void 결제한다() {\n    }\n}"]);
  const ok = session("class 주문 {\n    // ... 필드 생략\n    void 결제한다() {\n        금액 = 0;\n    }\n}", SOURCE);
  assert.deepEqual(checkCodeSources(ok, fs.readFileSync(ok, "utf-8")), { errors: [], warnings: [] });
});

test("sources in package subfolders (code/sNN/<package>/*.java) count as the session's source", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-code-pkg-"));
  const p = path.join(root, "s05.md");
  fs.writeFileSync(p, "## 01. 코드\n\n```java\npackage 주문;\n\npublic interface 배송요청 {\n    void 요청한다(String 주문번호);\n}\n```\n");
  fs.mkdirSync(path.join(root, "code", "s05", "주문"), { recursive: true });
  fs.writeFileSync(path.join(root, "code", "s05", "주문", "배송요청.java"), "package 주문;\n\npublic interface 배송요청 {\n    void 요청한다(String 주문번호);\n}\n");
  assert.deepEqual(checkCodeSources(p, fs.readFileSync(p, "utf-8")), { errors: [], warnings: [] });
});

test("a code block that differs from the source is an error; a missing source folder is a warning", () => {
  const bad = session("class 주문 {\n    int 금액 = 1;\n}", SOURCE);
  assert.equal(checkCodeSources(bad, fs.readFileSync(bad, "utf-8")).errors.length, 1);
  const none = session("class 주문 {}");
  const r = checkCodeSources(none, fs.readFileSync(none, "utf-8"));
  assert.equal(r.errors.length, 0);
  assert.equal(r.warnings.length, 1);
});

test("```svg:uml marks an SVG UML diagram that takes the full band like PlantUML; neither grows past 10pt", () => {
  const { sections } = parse("## 01. 도식\n\n```svg:uml\n<svg/>\n```\n\n```svg\n<svg/>\n```\n");
  const [uml, plain] = sections[0].blocks.filter((b) => b.kind === "svg");
  assert.deepEqual(uml.meta, { uml: "svg" });
  assert.equal(plain.meta, null);
  const image = { kind: "svg", width: 900, height: 300, fontSize: 32 };
  const natural = naturalSize(image, TARGET_PT);
  const roomy = { x: 0, y: 0, w: natural.w * 3, h: natural.h * 3 };
  assert.ok(Math.abs(fitTarget(roomy, { ...image, uml: true }).w - natural.w) < 1e-6, "no diagram grows past 10pt");
  const layout = { panel: { x: 1, y: 2, w: 8, h: 1.8 } };
  assert.equal(visualPanel(layout, 2, 4, [{ ...image, uml: true }]).h, 4);
  assert.equal(visualPanel(layout, 2, 4, [image]).h, 1.8);
});

async function codePage(lines) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300"><style>text{font-size:16px}</style>'
    + '<rect x="10" y="10" width="880" height="280" fill="#EBF1F8"/><text x="450" y="150">가로로 넓은 도식</text></svg>';
  const code = Array.from({ length: lines }, (_, i) => "        값" + i + " = 계산한다(첫째, 둘째, 셋째, 넷째, 다섯째, 여섯째, 일곱째, 여덟째) + " + i + ";").join("\n");
  const sections = [{ heading: "01. 코드", title: "01. 코드", notes: [], blocks: [block("text", "도식과 코드."), block("svg", svg), block("code", code)] }];
  const output = path.join(os.tmpdir(), `tm-code-diagram-${lines}-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE, output, "T", [block("bullet", "01. 코드")]);
    return m.pages.filter((p) => String(p.heading).startsWith("01. 코드"));
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
}

test("a stacked diagram shrinks (down to 70%) before the code beneath it is split across slides", async () => {
  const full = (await codePage(10))[0].pictures[0].bounds.h;
  const shrunk = await codePage(24);
  assert.equal(shrunk.length, 1, "the code stays on one slide");
  const h = shrunk[0].pictures[0].bounds.h;
  assert.ok(h < full && h >= full * 0.7 - 1e-6, "by shrinking the diagram, no smaller than 70%");
  const split = await codePage(30);
  assert.ok(split.length > 1, "code too long even beside a 70% diagram is split");
  assert.ok(Math.abs(split[0].pictures[0].bounds.h - full) < 1e-6, "and then the diagram keeps its size");
});

test("course code bolds only declared names: types, and method/constructor names on declaration lines", () => {
  const { declaredNameSpans } = require("../richText");
  const bold = (line) => declaredNameSpans(line).map(([s, e]) => line.slice(s, e));
  assert.deepEqual(bold("final class 주문 {"), ["주문"]);
  assert.deepEqual(bold("record 수량(int 값) {"), ["수량"]);
  assert.deepEqual(bold("    List<상품> 상품을조회한다(String 검색조건);"), ["상품을조회한다"]);
  assert.deepEqual(bold("    주문(String 주문번호, 고객 고객) {"), ["주문"]);
  assert.deepEqual(bold("    금액 금액() { return 단가.곱한다(수량); }"), ["금액"]);
  assert.deepEqual(bold("        거절(() -> 시스템.결제한다(\"카드\"));"), [], "a call is not a declaration");
  assert.deepEqual(bold("        if (항목들.isEmpty())"), []);
  assert.deepEqual(bold("        var 새환불 = new 환불(결제금액);"), []);
});

test("an enum keeps its earlier sessions' values: adding is fine, renaming or dropping is reported", () => {
  const { checkEnumConsistency } = require("../codeSource");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-enum-"));
  for (const [s, body] of [["s01", "enum 주문상태 { 결제대기, 결제완료 }"], ["s02", "enum 주문상태 { 결제대기, 결제완료, 취소처리중 }"], ["s03", "enum 주문상태 { 주문됨, 결제완료 }"]]) {
    fs.mkdirSync(path.join(root, "code", s), { recursive: true });
    fs.writeFileSync(path.join(root, "code", s, "a.java"), body);
  }
  assert.deepEqual(checkEnumConsistency(path.join(root, "s02.md")), []);
  assert.equal(checkEnumConsistency(path.join(root, "s03.md")).length, 2, "결제대기 missing against s01 and s02");
});

test("a design session's English enum is compared with the analysis Korean enum through the course glossary", () => {
  const { checkEnumConsistency } = require("../codeSource");
  const course = fs.mkdtempSync(path.join(os.tmpdir(), "tm-glossary-"));
  const root = path.join(course, "sessions");
  fs.writeFileSync(path.join(course, "course-design.md"), [
    "### 영한 용어집과 명명 규칙", "", "| 한글 | 영문 | 종류 |", "|---|---|---|",
    "| 주문 상태 | `OrderStatus` | 타입 |", "| 결제대기 | `PENDING_PAYMENT` | 값 |", "| 결제완료 | `PAID` | 값 |",
    "| 찾는다 / 저장한다 | `findBy` / `save` | 메서드 |", "", "### 다음 절", "| 취소됨 | `CANCELLED` | 값 |",
  ].join("\n"));
  for (const [s, body] of [
    ["s04", "enum 주문상태 { 결제대기, 결제완료 }"],
    ["s05", "enum OrderStatus { PENDING_PAYMENT, PAID }"],
    ["s06", "enum OrderStatus { PENDING_PAYMENT }"],
    ["s07", "enum 주문상태 { 결제대기, 취소됨 }"],
    ["s08", "enum OrderStatus { PENDING_PAYMENT, PAID }"],
  ]) {
    fs.mkdirSync(path.join(root, "code", s), { recursive: true });
    fs.writeFileSync(path.join(root, "code", s, "a.java"), body);
  }
  assert.deepEqual(checkEnumConsistency(path.join(root, "s05.md")), [], "the glossary maps every Korean value");
  const dropped = checkEnumConsistency(path.join(root, "s06.md"));
  assert.equal(dropped.length, 2, "PAID dropped against s04 (through the glossary) and s05 (by name)");
  const unmapped = checkEnumConsistency(path.join(root, "s08.md"));
  assert.ok(unmapped.some((w) => w.includes("취소됨") && w.includes("영한 용어집")), "a value outside the glossary section is reported, not silently passed");
});

test("a code block right after another one stacks on the same slide when it fits, otherwise starts a new one", async () => {
  const pagesOf = async (md) => {
    const { sections } = parse(md);
    const toc = [{ kind: "bullet", text: sections[0].title, rows: [], depth: 0, meta: null }];
    const out = path.join(os.tmpdir(), `tm-code-stack-${process.pid}-${Date.now()}.pptx`);
    try {
      return (await render(sections, TEMPLATE, out, "테스트", toc)).pages.filter((p) => !p.isToc);
    } finally {
      if (fs.existsSync(out)) fs.unlinkSync(out);
    }
  };
  const short = "class 주문 {\n    int 금액;\n}";
  const stacked = await pagesOf("## 01. 코드\n\n코드 두 개를 잇는다.\n\n```java\n" + short + "\n```\n\n```java\n" + short + "\n```\n");
  assert.equal(stacked.length, 1);
  assert.equal(stacked[0].items.filter((it) => it.kind === "source").length, 2);
  const long = Array.from({ length: 200 }, (_, i) => `    int 필드${i};`).join("\n");
  const split = await pagesOf("## 01. 코드\n\n코드 두 개를 잇는다.\n\n```java\n" + short + "\n```\n\n```java\nclass 긴 {\n" + long + "\n}\n```\n");
  assert.ok(split.length >= 2, "a code block that does not fit below starts its own slide");
});

test("a ```text block is a learner-facing example rendered as code; only ```tree or box-drawing branches make a tree", () => {
  const kinds = (md) => parse(md).sections[0].blocks.filter((b) => b.kind === "code" || b.kind === "tree").map((b) => b.kind);
  const doc = (fence, body) => ["## 01. 예", "", "```" + fence, body, "```", "", "**강사 노트**", "", "- 노트"].join("\n");
  assert.deepEqual(kinds(doc("text", "제목: 결정\n상태: 채택")), ["code"]);
  assert.deepEqual(kinds(doc("plaintext", "한 줄 예시")), ["code"]);
  assert.deepEqual(kinds(doc("tree", "src\n  main")), ["tree"]);
  assert.deepEqual(kinds(doc("text", "src\n├─ main\n└─ test")), ["tree"]);
});
