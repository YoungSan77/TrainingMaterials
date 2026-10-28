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

test("text after a stacked diagram's code moves to the next slide instead of splitting the code", async () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300"><style>text{font-size:16px}</style>'
    + '<rect x="10" y="10" width="880" height="280" fill="#EBF1F8"/><text x="450" y="150">가로로 넓은 도식</text></svg>';
  const code = Array.from({ length: 16 }, (_, i) => "        값" + i + " = 계산한다(첫째, 둘째, 셋째);").join("\n");
  const trail = Array.from({ length: 4 }, (_, i) => "뒤따르는 해설 " + i + "은 코드와 함께 두면 한 장을 넘기므로 다음 장으로 보낸다.");
  const sections = [{ heading: "01. 코드", title: "01. 코드", notes: [], blocks: [
    block("text", "도식과 코드."), block("svg", svg), block("code", code), ...trail.map((t) => block("bullet", t))] }];
  const output = path.join(os.tmpdir(), `tm-code-trail-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE, output, "T", [block("bullet", "01. 코드")]);
    const pages = m.pages.filter((p) => String(p.heading).startsWith("01. 코드"));
    assert.equal(pages.length, 2, "the code keeps its slide and the trailing text takes the next");
    assert.equal(pages.filter((p) => p.items.some((it) => it.kind === "source")).length, 1, "the code is not split");
    assert.equal((pages[1].pictures || []).length, 0, "the diagram is not repeated");
    assert.ok(pages[1].items.some((it) => String(it.text).includes("뒤따르는")), "the trailing text follows");
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test("a governing message and a quotation above a short code block share its slide", async () => {
  const quote = "인용한 문장의 한글 요약이 두 줄에 걸칠 만큼 길다. 원문과 출처가 그 뒤에 이어진다";
  const sections = [{ heading: "01. 코드", title: "01. 코드", notes: [], blocks: [
    block("text", "코드 앞의 거버닝 메시지는 두 줄에 걸친다. 이 문장은 그 길이를 채우려고 조금 더 길게 썼다."),
    block("text", "**인용문**"),
    block("text", quote + ', "A quoted sentence that runs long enough to take a second line on the slide in English", [Author 2025]'),
    block("code", Array.from({ length: 8 }, (_, i) => "값" + i + " = " + i + ";").join("\n")),
  ] }];
  const output = path.join(os.tmpdir(), `tm-code-lead-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE, output, "T", [block("bullet", "01. 코드")]);
    const pages = m.pages.filter((p) => String(p.heading).startsWith("01. 코드"));
    assert.equal(pages.length, 1, "the lead, the quotation and the code are on one slide");
    assert.ok(pages[0].items.some((it) => it.kind === "source"));
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
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

test("counterexample and superseded enums do not define the baseline, but excerpts stay checked", (t) => {
  const { checkEnumConsistency } = require("../codeSource");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-enum-role-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (s, name, text) => {
    const dir = path.join(root, "code", s);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), text);
  };
  put("s01", "wrong.java", "// production-enum-baseline: exclude — intentional counterexample\nenum Status { WAITING, CANCELLED }");
  put("s02", "old.java", "// production-enum-baseline: exclude — superseded by current.java\nenum Status { WAITING, CANCELLED }");
  put("s02", "current.java", "enum Status { WAITING, PAID }");
  put("s03", "current.java", "enum Status { WAITING, PAID }");
  assert.deepEqual(checkEnumConsistency(path.join(root, "s03.md")), []);
  put("s04", "current.java", "enum Status { WAITING }");
  const warnings = checkEnumConsistency(path.join(root, "s04.md"));
  assert.equal(warnings.length, 2, "a real lost value is still reported for s02 and s03");
  assert.ok(warnings.every(w => w.includes("PAID")));
  const excerpt = "```java\nenum Status { WAITING, CANCELLED }\n```";
  assert.deepEqual(checkCodeSources(path.join(root, "s01.md"), excerpt), { errors: [], warnings: [] });
  assert.equal(checkCodeSources(path.join(root, "s01.md"), excerpt.replace("CANCELLED", "BOGUS")).errors.length, 1);
});

test("enum exclusion needs a reason and duplicate normal sources cannot overwrite lost values", (t) => {
  const { checkEnumConsistency } = require("../codeSource");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-enum-union-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const s of ["s01", "s02"]) fs.mkdirSync(path.join(root, "code", s), { recursive: true });
  fs.writeFileSync(path.join(root, "code/s01/a.java"), "// production-enum-baseline: exclude — \nenum Status { WAITING, PAID }");
  fs.writeFileSync(path.join(root, "code/s01/z.java"), "enum Status { WAITING }");
  fs.writeFileSync(path.join(root, "code/s02/a.java"), "enum Status { WAITING }");
  assert.match(checkEnumConsistency(path.join(root, "s02.md"))[0], /PAID/);
  fs.writeFileSync(path.join(root, "code/s01/a.java"), "enum Status { WAITING, PAID }");
  assert.match(checkEnumConsistency(path.join(root, "s02.md"))[0], /PAID/);
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

test("diagram and code on continuation slides stay above the page number", async () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300"><style>text{font-size:16px}</style>'
    + '<rect x="10" y="10" width="880" height="280" fill="#EBF1F8"/><text x="450" y="150">가로로 넓은 도식</text></svg>';
  const code = Array.from({ length: 80 }, (_, i) => "        값" + i + " = 계산한다(첫째, 둘째, 셋째, 넷째) + " + i + ";").join("\n");
  const md = "## 01. 코드\n\n이 topic의 lead 문장은 두 줄에 걸칠 만큼 길게 써서, 첫 장의 위쪽을 차지한다.\n\n"
    + "- 첫 장의 설명.\n\n**페이지 분할**\n\n- 둘째 장의 설명.\n\n**도식 — SVG — 넓은 도식**\n\n```svg\n" + svg + "\n```\n\n```java\n" + code + "\n```\n";
  const { sections } = parse(md);
  const output = path.join(os.tmpdir(), `tm-code-lead-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE, output, "T", [block("bullet", "01. 코드")]);
    const pages = m.pages.filter((p) => String(p.heading).startsWith("01. 코드"));
    assert.ok(pages.length >= 3, "the code continues across slides");
    const EMU = 914400, PAGE_NUM_Y = 6449625 / EMU;
    for (const p of pages.slice(1)) {
      for (const sp of Array.from(p.doc.getElementsByTagName("p:sp"))) {
        const off = sp.getElementsByTagName("a:off")[0], ext = sp.getElementsByTagName("a:ext")[0];
        if (!off || !ext || !String(sp.textContent || "").includes("값")) continue;
        const bottom = (Number(off.getAttribute("y")) + Number(ext.getAttribute("cy"))) / EMU;
        assert.ok(bottom <= PAGE_NUM_Y, `code ends at ${bottom.toFixed(2)}in, below the page number`);
      }
      for (const pic of p.pictures || []) assert.ok(pic.bounds.y + pic.bounds.h <= PAGE_NUM_Y);
    }
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test("a standalone quote marker does not need a blank line before its quoted paragraph", async () => {
  const { sections } = parse('## 01. 인용\n\n**인용문**\n한글 **정의**다, "English original", [Author 2000]\n');
  assert.deepEqual(sections[0].blocks.map(b => b.text), ['**인용문**', '한글 **정의**다, "English original", [Author 2000]']);
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tm-quote-line-")), "out.pptx");
  const m = await render(sections, TEMPLATE, out, "01. 인용", [block("bullet", sections[0].title)]);
  assert.ok(!m.pages.flatMap(p => p.items).some(i => i.text === '인용문'));
  const { all, A, text } = require('../xml');
  const runs = m.pages.flatMap(p => all(p.doc, A, 'r')).map(r => [r.textContent, all(r, A, 'rPr')[0]?.getAttribute('sz')]);
  assert.ok(runs.some(([t,s]) => t.includes('English original') && s === '1000'));
  assert.ok(runs.some(([t,s]) => t.includes('한글') && s === '1800'));
});

test("indented fenced examples retain content and are not misread as text or topic headings", () => {
  const { sections } = parse('## 01. 예\n\n- 설명\n\n  ```text\n  합계 = 단가 × 수량\n  ## 코드 속 제목\n  ```\n\n- 뒤 설명\n');
  assert.equal(sections.length, 1);
  assert.equal(sections[0].blocks[1].kind, 'code');
  assert.equal(sections[0].blocks[1].text, '합계 = 단가 × 수량\n## 코드 속 제목');
  const p = session('class 주문 {}', 'class 주문 {}');
  assert.deepEqual(checkCodeSources(p, '  ```java\n  class 주문 {}\n  ```'), { errors: [], warnings: [] });
  assert.equal(checkCodeSources(p, '  ```java\n  class 가짜 {}\n  ```').errors.length, 1);
});

test("10pt document prose keeps its size around a code example and a table", async () => {
  const md = '## 01. 문서\n\n**문서 형식 — 10pt**\n\n문서의 도입 문장이다.\n\n- 앞 조건\n\n  ```text\n  합계 = 단가 × 수량\n  ```\n\n- 중간 조건\n\n| 값 | 전 | 후 |\n|---|---|---|\n| 단가 | 1000 | 1000 |\n\n- 뒤 조건\n';
  const { sections } = parse(md);
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tm-mixed-doc-")), "out.pptx");
  const m = await render(sections, TEMPLATE, out, "01. 문서", [block("bullet", sections[0].title)]);
  const { all, A, text } = require('../xml');
  const runs = m.pages.flatMap(p => all(p.doc, A, 'r'));
  for (const token of ['문서의 도입', '앞 조건', '중간 조건', '뒤 조건']) {
    const selected = runs.filter(r => r.textContent.includes(token));
    assert.ok(selected.length, token);
    assert.ok(selected.every(r => all(r, A, 'rPr')[0].getAttribute('sz') === '1000'), token);
  }
  assert.equal(m.pages.filter(p => !p.isToc).length, 1, 'short mixed document does not spill because of 18pt estimates');
  assert.ok(m.codes.some(c => c.source === '합계 = 단가 × 수량'));
});

test("short trailing explanation uses printed line height instead of pagination slack", async () => {
  const code = Array.from({length: 16}, (_, i) => `int value${i} = ${i};`).join('\n');
  const explanation = '판매가가 바뀌어도 기존 항목의 확정 단가와 주문 총액은 바뀌지 않는다. 계산의 원천은 확정 단가다.';
  const { sections } = parse('## 01. 코드\n\n확정 값을 사용하여 금액을 계산한다.\n\n```java\n'+code+'\n```\n\n'+Array.from({length:3},()=>'- '+explanation).join('\n')+'\n');
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tm-trailing-line-")), "out.pptx");
  const m = await render(sections, TEMPLATE, out, "01. 코드", [block("bullet", sections[0].title)]);
  const pages = m.pages.filter(p => !p.isToc);
  assert.equal(pages.length, 1);
  assert.ok(pages[0].items.some(i => i.kind === 'source'));
  assert.ok(pages[0].items.some(i => i.text.includes('계산의 원천')));
});

test("mixed 10pt document fills a preceding code page with table rows before continuing", async () => {
  const rows = Array.from({ length: 14 }, (_, i) => `| 항목${i + 1} | 값${i + 1} |`).join('\n');
  const md = '## 01. 문서\n\n**문서 형식 — 10pt**\n\n- 첫 조건\n\n```text\n합계 = 단가 × 수량\n```\n\n- 표 앞 조건\n\n| 항목 | 값 |\n|---|---|\n'+rows+'\n\n- 표 뒤 조건\n';
  const { sections } = parse(md);
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tm-mixed-flow-')), 'out.pptx');
  const m = await render(sections, TEMPLATE, out, '문서', [block('bullet', sections[0].title)]);
  const pages = m.pages.filter(p => !p.isToc);
  assert.equal(pages.length, 2);
  assert.ok(pages[0].items.some(i => i.kind === 'source'));
  const tables = pages.map(p => p.items.find(i => i.kind === 'table'));
  assert.ok(tables.every(Boolean), 'both pages carry data rows, rather than a vacant code-only page');
  assert.ok(tables[0].rows.length > 2);
  assert.deepEqual(tables.map(t => t.rows[0]), [['항목', '값'], ['항목', '값']]);
  assert.deepEqual(tables.flatMap(t => t.rows.slice(1).map(r => r[0])), Array.from({length:14}, (_,i)=>`항목${i+1}`));
  assert.ok(pages[1].items.some(i => i.text.includes('표 뒤 조건')));
});

test("a mixed document that fits at equal 8pt gaps stays on one slide without dropping its final row", async (t) => {
  const input = fs.readFileSync(path.join(__dirname, 'fixtures/mixed-document-conditions.md'), 'utf8');
  const { sections } = parse(input);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tm-equal-gap-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const m = await render(sections, TEMPLATE, path.join(root, 'out.pptx'), '문서', [block('bullet', sections[0].title)]);
  const pages = m.pages.filter(p => !p.isToc);
  assert.equal(pages.length, 1);
  const p = pages[0];
  const table = p.items.find(i => i.kind === 'table');
  assert.equal(table.rows.length, 8, 'all seven data rows and the header remain on the same slide');
  assert.equal(table.rows.at(-1)[0], 'Order.shippingAddress');
  assert.ok(p.items.some(i => i.text.includes('생성 시점에는')));
  const { shape, all, A } = require('../xml');
  const bounds = p.items.map(item => {
    const s = shape(p.doc, item.id), off = all(s, A, 'off')[0], ext = all(s, A, 'ext').find(e => e.hasAttribute('cy'));
    for (const r of all(s, A, 'rPr')) assert.equal(r.getAttribute('sz'), '1000');
    const y = Number(off.getAttribute('y')) / 12700;
    const h = item.kind === 'table' ? 8 * 0.8 / 2.54 * 72 : Number(ext.getAttribute('cy')) / 12700;
    return { y, h };
  }).sort((a,b) => a.y-b.y);
  assert.equal(bounds.length, 5);
  for (let i = 1; i < bounds.length; i++) assert.ok(Math.abs(bounds[i].y - bounds[i-1].y - bounds[i-1].h - 8) < .001);
  assert.ok(bounds.at(-1).y + bounds.at(-1).h <= require('../builder').PAGE_NUM_Y * 72 - .15 * 72);
});

// 원고가 가리키지 않는 예시 코드는 잔여물이다(production-guide.md 「자동 검사 — 참조와 경고」).
test("example code no manuscript points at is reported", () => {
  const { checkOrphanCode } = require("../codeSource");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-orphan-"));
  const dir = path.join(root, "sessions");
  fs.mkdirSync(path.join(dir, "code", "s03"), { recursive: true });
  fs.mkdirSync(path.join(dir, "code", "s03", "order"));
  fs.mkdirSync(path.join(dir, "code", "s03", "옛시연"));
  fs.mkdirSync(path.join(dir, "code", "s03", "lib"));
  fs.writeFileSync(path.join(dir, "s03.md"), "## 01. 예\\n\\n**강사 노트**\\n\\n- 원본은 code/s03/order/다.\\n");
  const w = checkOrphanCode(path.join(dir, "s03.md"));
  assert.deepEqual(w, ["원고가 가리키지 않는 예시 코드: code/s03/옛시연"], "lib는 실행용 의존성이라 보지 않는다");
  fs.writeFileSync(path.join(dir, "s11.md"), "code/s03/옛시연 은 이 세션이 가리킨다.\\n");
  assert.deepEqual(checkOrphanCode(path.join(dir, "s03.md")), [], "같은 과정의 다른 원고가 가리켜도 된다");
});
