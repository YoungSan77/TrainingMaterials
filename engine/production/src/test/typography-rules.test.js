"use strict";
// Regression tests for the typography/visual rules added this session:
// - parens (Korean or English) shrink -4pt in body/TOC/title/citation-Korean text
// - a "라벨 — 설명" line breaks -2pt after the first "—", even across a **bold** span
// - citation's English-original+source (10pt) zone is the one exception: flat, parens included
// - slide titles are always bold
// - diagram (mermaid/plantuml) node/participant labels: "-" splits the label (line break + ~80%
//   size), the whole label is bold, but flow/edge/message text is not
// - diagram images target exactly 10pt, shrinking 90%/80% (never enlarging) when they overflow
// - the PlantUML innerSource() regression: "@startuml" on its own line must not swallow the next
//   line as if it were a same-line title
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parseXml, A, all, shape, body, kids, child, paragraph } = require("../xml");
const { rich, run, runParen } = require("../richText");
const { paragraphs } = require("../paragraphs");
const { render, naturalSize, fitTarget, visualPanel, tocSessionName, TARGET_PT, UML_MAX_PT } = require("../builder");
const { styleSource: mermaidStyleSource } = require("../mermaidAdapter");
const { styleSource: plantumlStyleSource, innerSource, assembled } = require("../plantumlAdapter");

const ROOT = path.resolve(__dirname, "../../../..");
const TEMPLATE = path.join(ROOT, "references/production/lecture-java-baseline/templates/approved.pptx");

// -- helpers ---------------------------------------------------------------

function freshParagraph() {
  const doc = parseXml(
    '<a:p xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>'
  );
  return { doc, p: doc.documentElement };
}

function textOf(r) {
  const t = child(r, A, "t");
  return t ? t.textContent : "";
}

// Minimal single-shape fixture for paragraphs(): a <p:sp id=13> with one placeholder paragraph.
function fixturePage(shapeId) {
  const doc = parseXml(
    '<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" ' +
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
    '<p:cSld><p:spTree><p:sp><p:nvSpPr><p:cNvPr id="' + shapeId + '" name="x"/></p:nvSpPr>' +
    '<p:txBody><a:p><a:r><a:t>old</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>'
  );
  return { doc, items: [] };
}

const textBlock = (value) => ({ kind: "text", text: value, rows: [], depth: 0, meta: null });
const bulletBlock = (value) => ({ kind: "bullet", text: value, rows: [], depth: 0, meta: null });

async function renderOnce(sections, toc, name) {
  const output = path.join(os.tmpdir(), `tm-typography-${name}-${process.pid}-${Date.now()}.pptx`);
  try {
    return await render(sections, TEMPLATE, output, "Typography Test", toc);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
}

// -- 1. parens: -4pt, Korean and English treated the same ------------------

test("runParen shrinks every parenthetical span -4pt, Korean or English", () => {
  const { p } = freshParagraph();
  runParen(p, "문장 (English) 그리고 (한글만) 끝", 18, false);
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz") }));
  assert.deepEqual(runs, [
    { text: "문장 ", sz: "1800" },
    { text: "(English)", sz: "1400" },
    { text: " 그리고 ", sz: "1800" },
    { text: "(한글만)", sz: "1400" },
    { text: " 끝", sz: "1800" },
  ]);
});

// -- 2. "—" line: -2pt after the dash, safe across a **bold** span ---------

test("rich() shrinks -2pt after the first em dash, even when it sits inside **bold**", () => {
  const { p } = freshParagraph();
  rich(p, "**본질적 어려움 — 주문 취소 업무의 의미와 규칙**", 18, false, false, new Set());
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz"), b: child(r, A, "rPr").getAttribute("b") }));
  // No literal "**" must leak into any run -- that was the exact regression (bold markers split
  // across the dash boundary before the fix).
  for (const r of runs) assert.equal(r.text.includes("*"), false);
  assert.equal(runs.every((r) => r.b === "1"), true, "the whole line was authored as one bold span");
  const before = runs.filter((r) => r.sz === "1800").map((r) => r.text).join("");
  const after = runs.filter((r) => r.sz === "1600").map((r) => r.text).join("");
  assert.equal(before, "본질적 어려움 —");
  assert.equal(after, " 주문 취소 업무의 의미와 규칙");
});

test("rich() compounds the paren rule on top of the dash rule", () => {
  const { p } = freshParagraph();
  rich(p, "라벨 — 설명 (English)", 18, false, false, new Set());
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz") }));
  const paren = runs.find((r) => r.text === "(English)");
  assert.equal(paren.sz, "1200", "16pt (dash tail) - 4pt (paren) = 12pt");
});

test("rich() exempts inline code spans from the paren rule (`Order.cancel()` is syntax, not an aside)", () => {
  const { p } = freshParagraph();
  rich(p, "**해결책** — 취소 버튼, `Order.cancel()`", 18, false, false, new Set());
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz") }));
  const code = runs.find((r) => r.text === "Order.cancel()");
  assert.equal(code.sz, "1600", "dash tail (16pt) applies, but the code span's own () is not paren-shrunk further");
  for (const r of runs) assert.equal(r.text.includes("`"), false, "backticks never survive into rendered text");
});

// -- 3. citation: Korean zone paren-aware, English+source zone flat --------

test("citation Korean zone shrinks parens; English-original+source zone stays flat", () => {
  const page = fixturePage(13);
  const block = {
    kind: "text",
    text: '"한글 (English aside)", "영문 (paren) here", 저자, 2020',
    meta: { quote: true },
    depth: 0,
    rows: [],
  };
  paragraphs(page, 13, [block], false);
  const p = child(body(shape(page.doc, 13)), A, "p");
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz") }));
  const koreanParen = runs.find((r) => r.text === "(English aside)");
  assert.equal(koreanParen.sz, "1400", "18pt Korean zone - 4pt");
  const englishRun = runs.find((r) => r.text === '"영문 (paren) here"');
  assert.equal(englishRun.sz, "1000", "10pt exception zone stays flat, parens included");
});

test("citation Korean zone honors authored **bold** emphasis (regression: was silently stripped)", () => {
  const page = fixturePage(13);
  const block = {
    kind: "text",
    text: '"재작업 비용의 약 **70~85%**가 요구사항 결함에서 비롯된다", "70% to 85% of all project rework costs are due to errors in requirements.", Dean Leffingwell, 1997, www',
    meta: { quote: true },
    depth: 0,
    rows: [],
  };
  paragraphs(page, 13, [block], false);
  const p = child(body(shape(page.doc, 13)), A, "p");
  const runs = kids(p, A, "r").map((r) => ({ text: textOf(r), b: child(r, A, "rPr").getAttribute("b") }));
  const stat = runs.find((r) => r.text === "70~85%");
  assert.equal(stat.b, "1", "authored ** bold must survive into the rendered run, not just get stripped by plain()");
  for (const r of runs) assert.equal(r.text.includes("*"), false, "the ** markers themselves never survive into rendered text");
});

test("an authored ordered-list item (\"1. ...\") is indented but doesn't also pick up the placeholder's bullet glyph", () => {
  const page = fixturePage(8);
  const block = { kind: "bullet", text: "1. 대상 시스템을 정의한다.", rows: [], depth: 0, meta: null };
  paragraphs(page, 8, [block], false);
  const p = child(body(shape(page.doc, 8)), A, "p");
  const pPr = child(p, A, "pPr");
  const children = kids(pPr, A, "buNone");
  assert.equal(children.length, 1, "numbered items need buNone -- the numeral is already literal text, so the template's own level-1 bullet glyph must not render in front of it too");
  assert.equal(pPr.getAttribute("lvl"), "2", "numbered items still get the same lvl-based indentation as a dash bullet, just without the extra glyph");
});

test("a real dash-bullet (\"- ...\") still gets the placeholder's bullet glyph, unlike a numbered item", () => {
  const page = fixturePage(8);
  const block = { kind: "bullet", text: "일반 bullet 항목", rows: [], depth: 0, meta: null };
  paragraphs(page, 8, [block], false);
  const p = child(body(shape(page.doc, 8)), A, "p");
  const pPr = child(p, A, "pPr");
  assert.equal(pPr.getAttribute("lvl"), "2", "bullets are deliberately shifted one level deeper so they start from the round lvl=2 glyph, not the square lvl=1 one");
  assert.equal(kids(pPr, A, "buNone").length, 0);
});

// -- 4. slide titles: always bold, paren-aware ------------------------------

test("slide title is bold and shrinks a mid-title paren -4pt", async () => {
  const sections = [{
    heading: "01. 제목(Note) 확인",
    title: "01. 제목(Note) 확인",
    blocks: [textBlock("본문 내용입니다.")],
    notes: [],
  }];
  const toc = [bulletBlock("01. 제목(Note) 확인")];
  const m = await renderOnce(sections, toc, "title-bold");
  const topicPage = m.pages.find((pg) => pg.heading === "01. 제목(Note) 확인");
  const runs = kids(child(body(shape(topicPage.doc, 2)), A, "p"), A, "r").map((r) => ({
    text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz"), b: child(r, A, "rPr").getAttribute("b"),
  }));
  assert.equal(runs.every((r) => r.b === "1"), true, "titles are always bold");
  const paren = runs.find((r) => r.text === "(Note)");
  assert.equal(paren.sz, "2000", "24pt title - 4pt paren");
  const rest = runs.filter((r) => r.text !== "(Note)").every((r) => r.sz === "2400");
  assert.equal(rest, true);
});

test("TOC paragraph spacing is 3pt, body paragraph spacing is 6pt", async () => {
  const sections = [{
    heading: "01. 세션 목표", title: "01. 세션 목표", blocks: [textBlock("본문 내용입니다.")], notes: [],
  }];
  const toc = [bulletBlock("01. 세션 목표")];
  const m = await renderOnce(sections, toc, "spacing");
  const tocPage = m.pages[0];
  const tocPar = child(body(shape(tocPage.doc, 10)), A, "p");
  const tocSpcBef = child(child(child(tocPar, A, "pPr"), A, "spcBef"), A, "spcPts");
  assert.equal(tocSpcBef.getAttribute("val"), "300");

  const bodyPage = m.pages.find((pg) => pg.items.some((item) => item.id === 8));
  const bodyPar = child(body(shape(bodyPage.doc, 8)), A, "p");
  const bodySpcBef = child(child(child(bodyPar, A, "pPr"), A, "spcBef"), A, "spcPts");
  assert.equal(bodySpcBef.getAttribute("val"), "600");
});

test("a TOC over 32 items splits into (1/2)/(2/2) pages, and the unused right column isn't left showing the template's placeholder text", async () => {
  const sections = Array.from({ length: 40 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { heading: `${n}. 토픽`, title: `${n}. 토픽`, blocks: [textBlock("본문 내용입니다.")], notes: [] };
  });
  const toc = sections.map((s) => bulletBlock(s.title));
  const m = await renderOnce(sections, toc, "toc-pagination");
  const tocPages = m.pages.filter((pg) => pg.isToc);
  assert.equal(tocPages.length, 2, "40 items over the 32-per-page cap must produce 2 TOC pages");
  assert.match(tocPages[0].heading, /\(1\/2\)$/);
  assert.match(tocPages[1].heading, /\(2\/2\)$/);
  // CT_TextBody requires at least one <a:p>, so a fully-empty column keeps exactly one blank
  // paragraph (no run/text) rather than zero -- the assertion that matters is that none of it is
  // the template's baked-in placeholder text, not the literal paragraph count.
  const page2Right = kids(body(shape(tocPages[1].doc, 4)), A, "p");
  assert.ok(page2Right.length <= 1, "page 2 has only 8 remaining items (all in the left column) -- the right column must be cleared, not left showing the template's baked-in placeholder text");
  for (const p of page2Right) assert.equal(paragraph(p), "");
  const page2Left = kids(body(shape(tocPages[1].doc, 10)), A, "p").map((p) => textOf(kids(p, A, "r")[0]));
  // Per-column capacity stays the already-tuned TOC_LEFT_MAX (15) on each side -- 30/page, not a
  // literal 32 -- since 32 would mean 17 in one column, tighter than the box height 15 was tuned
  // for and liable to reintroduce the exact overflow this pagination exists to avoid.
  assert.equal(page2Left[0], "31. 토픽");
  assert.equal(page2Left[page2Left.length - 1], "40. 토픽");
});

// -- 5. diagram image sizing: target exactly 10pt, shrink-only on overflow -

test("fitTarget renders at exactly TARGET_PT when the panel has room to spare", () => {
  const image = { kind: "mermaid", width: 1568, height: 236 };
  const bounds = { x: 1.4, y: 4.25, w: 7.2, h: 1.8 };
  const b = fitTarget(bounds, image);
  const estimatedPt = (24 * b.w * 96) / image.width;
  assert.ok(Math.abs(estimatedPt - TARGET_PT) < 1e-6, "must land on exactly 10pt, not stretch to fill the panel");
});

test("fitTarget shrinks in 10% steps (90%, then 80%) instead of overflowing a tight panel", () => {
  const image = { kind: "mermaid", width: 1568, height: 236 };
  const full = naturalSize(image, TARGET_PT);
  const tightBounds = { x: 0, y: 0, w: full.w * 0.85, h: full.h * 10 };
  const b = fitTarget(tightBounds, image);
  assert.ok(Math.abs(b.w - full.w * 0.9) < 1e-6, "85% of natural width only fits at the 90% step, not 100%");

  const tighterBounds = { x: 0, y: 0, w: full.w * 0.75, h: full.h * 10 };
  const b2 = fitTarget(tighterBounds, image);
  assert.ok(Math.abs(b2.w - full.w * 0.8) < 1e-6, "75% of natural width only fits at the 80% step");
});

test("fitTarget never enlarges past the 10pt target even with a huge panel", () => {
  const image = { kind: "mermaid", width: 1568, height: 236 };
  const full = naturalSize(image, TARGET_PT);
  const hugeBounds = { x: 0, y: 0, w: full.w * 5, h: full.h * 5 };
  const b = fitTarget(hugeBounds, image);
  assert.ok(Math.abs(b.w - full.w) < 1e-6);
});

test("fitTarget grows a PlantUML diagram into free space, capped at UML_MAX_PT", () => {
  const image = { kind: "plantuml", width: 764, height: 327 };
  const full = naturalSize(image, TARGET_PT);
  const roomy = fitTarget({ x: 0, y: 0, w: full.w * 10, h: full.h * 10 }, image);
  const estimatedPt = (39 * roomy.w * 96) / image.width;
  assert.ok(Math.abs(estimatedPt - UML_MAX_PT) < 1e-6, "a roomy panel grows the UML diagram only up to UML_MAX_PT");
  const snug = fitTarget({ x: 0, y: 0, w: full.w * 1.2, h: full.h * 10 }, image);
  assert.ok(Math.abs(snug.w - full.w * 1.2) < 1e-6, "growth stops at the panel edge");
  const tight = fitTarget({ x: 0, y: 0, w: full.w * 0.85, h: full.h * 10 }, image);
  assert.ok(Math.abs(tight.w - full.w * 0.9) < 1e-6, "an overflowing UML diagram still shrinks in 10% steps");
});

test("visualPanel gives an all-PlantUML topic the whole free band; other visuals keep the design panel", () => {
  const layout = { panel: { x: 1.4, y: 4.25, w: 7.2, h: 1.8 } };
  const uml = visualPanel(layout, 2.0, 4.0, [{ kind: "plantuml" }]);
  assert.equal(uml.h, 4.0);
  assert.equal(uml.w, 9.0);
  const mermaid = visualPanel(layout, 2.0, 4.0, [{ kind: "mermaid" }]);
  assert.equal(mermaid.h, 1.8);
  assert.equal(mermaid.w, 7.2);
  assert.ok(Math.abs(mermaid.y - (2.0 + (4.0 - 1.8) / 2)) < 1e-9);
});

test("tocSessionName drops the ' — ' subtitle only", () => {
  assert.equal(tocSessionName("03. 정적 모델 — 도메인 개념과 관계"), "03. 정적 모델");
  assert.equal(tocSessionName("13. OOAD에서 전문영역으로 — Architecture · DDD · MSA"), "13. OOAD에서 전문영역으로");
  assert.equal(tocSessionName("02. 요구 분석과 유스케이스"), "02. 요구 분석과 유스케이스");
  assert.equal(tocSessionName("07. 책임·협력·계약"), "07. 책임·협력·계약");
});

// -- 6. diagram labels: "-" splits + shrinks, whole label is bold ----------

test("mermaid styleSource bolds every quoted label and splits it at the first '-'", () => {
  const source = 'flowchart LR\n  P["문제 - 무엇을 해결할 것인가?"]\n  S["해결책"]\n  P -->|왜?| S';
  const styled = mermaidStyleSource(source);
  assert.equal(styled.includes('"<b>문제 -<br/><span style=\'font-size:0.8em\'> 무엇을 해결할 것인가?</span></b>"'), true);
  assert.equal(styled.includes('"<b>해결책</b>"'), true);
  // The unquoted pipe edge label is untouched -- it must stay plain text, not wrapped in <b>.
  assert.equal(styled.includes("|왜?|"), true);
  assert.equal(styled.includes("<b>왜?"), false);
});

test("plantuml styleSource splits a quoted label at '-' using a Creole <size:> tag", () => {
  const styled = plantumlStyleSource('participant "문제 - 무엇을 해결할 것인가?" as P');
  assert.equal(styled, 'participant "문제 -\\n<size:10> 무엇을 해결할 것인가?</size>" as P');
});

test("plantuml assembled(): sequence diagrams keep flow/message text plain despite default bold", () => {
  const content = assembled('actor "고객" as Customer', "sequence");
  assert.equal(content.includes("skinparam defaultFontStyle bold"), true);
  assert.equal(content.includes("skinparam SequenceMessageFontStyle plain"), true);
  assert.equal(content.includes("skinparam ArrowFontStyle plain"), true);
  // Sequence diagrams use PlantUML's own lifeline renderer, not the smetana graph layout.
  assert.equal(content.includes("!pragma layout smetana"), false);
});

test("plantuml assembled(): non-sequence kinds still get the smetana graph layout", () => {
  const content = assembled("class Order", "class");
  assert.equal(content.includes("!pragma layout smetana"), true);
});

// -- 7. regression: "@startuml" on its own line must not eat the next line -

test("plantuml innerSource keeps the line right after a bare '@startuml' (regression)", () => {
  const source = '@startuml\nactor "고객" as Customer\nparticipant "주문" as Order\nCustomer -> Order : 요청\n@enduml';
  const inner = innerSource(source);
  assert.equal(inner.includes('actor "고객" as Customer'), true, '"@startuml\\n<line>" must not be parsed as a same-line title that swallows <line>');
  assert.equal(inner.startsWith("actor"), true);
});

test("plantuml innerSource still strips a genuine same-line title", () => {
  const source = "@startuml My Title\nparticipant A\n@enduml";
  const inner = innerSource(source);
  assert.equal(inner, "participant A");
});

test("text after an explicit page split that follows the topic's only visual gets the full-page budget", async () => {
  // A tall class diagram forces the deep-stacked layout (small text capacity on the visual's page).
  const uml = 'class "가" as A {\n  a\n  b\n  c\n  d\n  e\n  f\n}';
  const lines = ["첫째 설명 문장입니다", "둘째 설명 문장입니다", "셋째 설명 문장입니다", "넷째 설명 문장입니다",
    "다섯째 설명 문장입니다", "여섯째 설명 문장입니다", "일곱째 설명 문장입니다"];
  const sections = [{
    heading: "01. 도식", title: "01. 도식",
    blocks: [
      textBlock("도식을 소개한다."),
      { kind: "plantuml", text: uml, rows: [], depth: 0, meta: { uml: "class" } },
      { kind: "pagebreak", text: "", rows: [], depth: 0, meta: null },
      ...lines.map(bulletBlock),
    ],
    notes: [],
  }];
  const toc = [bulletBlock("01. 도식")];
  const m = await renderOnce(sections, toc, "split-budget");
  const topicPages = m.pages.filter((pg) => pg.heading && pg.heading.startsWith("01. 도식"));
  assert.equal(topicPages.length, 2, "visual page + one text-only page, not a third continuation");
});

test("an explicit page split between a table and the topic's only visual puts the visual on its own page", async () => {
  const uml = 'class "가" as A {\n  a\n}';
  const table = { kind: "table", text: "", rows: [["표기", "의미"], ["개념", "문제영역의 것"]], depth: 0, meta: null };
  const build = (withSplit) => [{
    heading: "01. 표기", title: "01. 표기",
    blocks: [
      textBlock("표기를 소개한다."),
      table,
      ...(withSplit ? [{ kind: "pagebreak", text: "", rows: [], depth: 0, meta: null }] : []),
      { kind: "plantuml", text: uml, rows: [], depth: 0, meta: { uml: "class" } },
    ],
    notes: [],
  }];
  const toc = [bulletBlock("01. 표기")];
  const count = async (withSplit) => {
    const m = await renderOnce(build(withSplit), toc, `table-split-${withSplit}`);
    return m.pages.filter((pg) => pg.heading && pg.heading.startsWith("01. 표기")).length;
  };
  assert.equal(await count(false), 1, "without a split a small diagram shares the table page");
  assert.equal(await count(true), 2, "with a split the diagram gets its own page");
});

test("a **다이어그램 — …** marker becomes an 11pt second title line and stays out of the body and TOC", async () => {
  const { parse } = require("../parse");
  const source = [
    "--------------------", "Session 명: 01. 테스트", "--------------------", "",
    "## 목차", "", "01. 결제 흐름", "",
    "## 01. 결제 흐름", "", "**다이어그램 — 시퀀스 다이어그램**", "", "결제를 펼친다.", "",
  ].join("\n");
  const { sections, toc } = parse(source);
  assert.equal(sections[0].diagram, "시퀀스 다이어그램");
  assert.equal(sections[0].blocks.some((b) => /다이어그램 —/.test(b.text)), false, "marker is not body content");
  const m = await renderOnce(sections, toc, "diagram-subtitle");
  const page = m.pages.find((pg) => pg.heading.startsWith("01. 결제 흐름"));
  assert.equal(page.heading, "01. 결제 흐름\n시퀀스 다이어그램");
  const pars = kids(body(shape(page.doc, 2)), A, "p");
  assert.equal(pars.length, 2);
  const second = kids(pars[1], A, "r").map((r) => ({ text: textOf(r), sz: child(r, A, "rPr").getAttribute("sz") }));
  assert.deepEqual(second, [{ text: "시퀀스 다이어그램", sz: "1100" }]);
});

test("a visual after an explicit page split stays in its own segment, and the text-only page before it gets the full budget", async () => {
  const uml = 'class "가" as A {\n  a\n  b\n  c\n  d\n  e\n  f\n}';
  const lines = ["첫째 설명 문장입니다", "둘째 설명 문장입니다", "셋째 설명 문장입니다", "넷째 설명 문장입니다",
    "다섯째 설명 문장입니다", "여섯째 설명 문장입니다", "일곱째 설명 문장입니다"];
  const sections = [{
    heading: "01. 도식", title: "01. 도식",
    blocks: [
      textBlock("도식을 소개한다."),
      ...lines.map(bulletBlock),
      { kind: "pagebreak", text: "", rows: [], depth: 0, meta: null },
      bulletBlock("도식의 설명이다"),
      { kind: "plantuml", text: uml, rows: [], depth: 0, meta: { uml: "class" } },
    ],
    notes: [],
  }];
  const toc = [bulletBlock("01. 도식")];
  const m = await renderOnce(sections, toc, "segment-visual");
  const topicPages = m.pages.filter((pg) => pg.heading && pg.heading.startsWith("01. 도식"));
  assert.equal(topicPages.length, 2, "text-only page + visual page, no continuation");
  assert.equal((topicPages[0].pictures || []).length, 0, "the visual is not pulled back onto the first segment");
  assert.equal((topicPages[1].pictures || []).length, 1);
});

test("table-page stacking: text after a table, a second table and a leading legend share one slide when they fit", async () => {
  const table = (a) => ({ kind: "table", text: "", rows: [["표기", "의미"], [a, "설명"]], depth: 0, meta: null });
  const uml = 'class "가" as A';
  const sections = [
    { heading: "01. 두 표", title: "01. 두 표", notes: [],
      blocks: [textBlock("두 표를 비교한다."), table("가"), bulletBlock("둘째 표의 설명이다"), table("나")] },
    { heading: "02. 표와 설명", title: "02. 표와 설명", notes: [],
      blocks: [textBlock("표를 본다."), table("가"), bulletBlock("표 뒤의 짧은 설명이다")] },
    { heading: "03. 범례와 표", title: "03. 범례와 표", notes: [],
      blocks: [textBlock("범례를 본다."), { kind: "plantuml", text: uml, rows: [], depth: 0, meta: { uml: "class" } },
        bulletBlock("표기와 사용법"), table("가")] },
  ];
  const toc = ["01. 두 표", "02. 표와 설명", "03. 범례와 표"].map(bulletBlock);
  const m = await renderOnce(sections, toc, "stacking");
  const pagesOf = (h) => m.pages.filter((pg) => pg.heading && pg.heading.startsWith(h));
  assert.equal(pagesOf("01. 두 표").length, 1);
  assert.equal(pagesOf("01. 두 표")[0].items.filter((it) => it.kind === "table").length, 2);
  assert.equal(pagesOf("02. 표와 설명").length, 1);
  const legend = pagesOf("03. 범례와 표");
  assert.equal(legend.length, 1);
  assert.equal((legend[0].pictures || []).length, 1, "legend sits on the table slide");
  const pic = legend[0].pictures[0].bounds;
  assert.ok(pic.y + pic.h <= legend[0].tableBottom, "legend is above the table");
});

test("two tables with the same column count in one segment share column widths", async () => {
  const sections = [{ heading: "01. 두 계약", title: "01. 두 계약", notes: [], blocks: [
    textBlock("두 계약을 비교한다."),
    { kind: "table", text: "", rows: [["항목", "결제"], ["사전조건", "짧다"]], depth: 0, meta: null },
    { kind: "table", text: "", rows: [["항목", "주문 취소"], ["관련 유스케이스", "훨씬 더 긴 설명이 들어가는 셀이다 훨씬 더 긴 설명이 들어가는 셀이다"]], depth: 0, meta: null },
  ] }];
  const m = await renderOnce(sections, [bulletBlock("01. 두 계약")], "shared-widths");
  const page = m.pages.find((pg) => pg.heading.startsWith("01. 두 계약"));
  const grids = all(page.doc, A, "tblGrid").map((g) => kids(g, A, "gridCol").map((c) => c.getAttribute("w")).join(","));
  assert.equal(grids.length, 2);
  assert.equal(grids[0], grids[1]);
});
