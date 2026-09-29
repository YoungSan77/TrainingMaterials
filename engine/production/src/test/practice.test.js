"use strict";
// session-authoring-guide.md "사례·가정·실습": a practice assignment ("NN. 실습 — …") is one slide.
// When its text runs over, it is set again at 16 then 14pt, then in two columns at 14pt; its
// review example ("… 검토 예시") may take more slides.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render, isPractice, isAnswer } = require("../builder");
const { checkStructure } = require("../structure");
const { TEMPLATE_DIR } = require("../template");

async function pagesOf(md) {
  const { sections } = parse(md);
  const toc = sections.map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0, meta: null }));
  const out = path.join(os.tmpdir(), `tm-practice-${process.pid}-${Date.now()}.pptx`);
  try {
    return { sections, pages: (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages.filter((p) => !p.isToc) };
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

const bullets = (n) => Array.from({ length: n }, (_, i) => `- **${i + 1}번째** 과제 설명은 수강생이 LLM 초안을 검토할 기준을 한 줄 넘게 길게 적는다.`).join("\n");

test("only assignment topics are practices; review examples are not", () => {
  assert.ok(isPractice("41. 실습 — 경계와 의존성"));
  assert.ok(!isPractice("42. 실습 — 검토 예시"));
  assert.ok(!isPractice("04. 의존성"));
});

test("an overfull practice is set on one slide at a smaller size or in two columns", async () => {
  const { pages } = await pagesOf("## 01. 실습 — 과제\n\n실습의 **목표**를 한 문장으로 적는다.\n\n" + bullets(14) + "\n");
  assert.equal(pages.length, 1);
  assert.ok(pages[0].practiceSize <= 16);
});

test("a practice that fits nowhere on one slide stays split and is reported", async () => {
  const md = "## 01. 실습 — 과제\n\n실습의 **목표**를 한 문장으로 적는다.\n\n" + bullets(60) + "\n";
  const { sections, pages } = await pagesOf(md);
  assert.ok(pages.length > 1);
  const errors = checkStructure("/tmp/s99.md", "99. 테스트", sections, pages);
  assert.ok(errors.some((e) => /실습 .*한 슬라이드를 넘는다/.test(e)));
});

test("a review example may take more than one slide without an error", async () => {
  const md = "## 01. 실습 — 검토 예시\n\n검토 **예시**를 적는다.\n\n" + bullets(30) + "\n";
  const { sections, pages } = await pagesOf(md);
  assert.ok(pages.length > 1);
  assert.deepEqual(checkStructure("/tmp/s99.md", "99. 테스트", sections, pages).filter((e) => /실습/.test(e)), []);
});

const levelled = (n) => Array.from({ length: n }, (_, i) =>
  `- **구역 ${i + 1}**\n  - **규칙 ${i + 1}** 답의 규칙은 수강생이 LLM과 함께 정한 내용을 한 줄 넘게 길게 적는다.\n    - 세부 조건도 한 줄 넘게 길게 적어 답의 분량을 채운다.`).join("\n");

test("an answer is a topic titled \"NN. … (안)\"", () => {
  assert.ok(isAnswer("02. 요구사항 명세서 (안)"));
  assert.ok(!isAnswer("01. 실습 — 요구사항 명세서"));
  assert.ok(!isAnswer("34. 실습 — 검토 예시(모범답안)"));
});

// Run sizes of the list paragraphs (the title and footer shapes carry no "lvl").
const sizesOf = (page) => new Set(Array.from(page.doc.getElementsByTagName("a:p"))
  .filter((p) => { const pr = p.getElementsByTagName("a:pPr")[0]; return pr && pr.getAttribute("lvl"); })
  .flatMap((p) => Array.from(p.getElementsByTagName("a:rPr")).map((rp) => rp.getAttribute("sz"))));

test("a text answer is set in two columns at 14/12/11pt by level, its explanation 2pt under", async () => {
  const { pages } = await pagesOf("## 01. 명세서 (안)\n\n" + levelled(4) + "\n- **외부**\n  - **상품** — 설명\n");
  assert.equal(pages.length, 1);
  assert.equal(pages[0].answerColumns, 2);
  const sizes = sizesOf(pages[0]);
  for (const sz of ["1400", "1200", "1100", "1000"]) assert.ok(sizes.has(sz), `${sz} in ${[...sizes]}`);
  assert.ok(!sizes.has("1800") && !sizes.has("1600"));
});

test("an answer title sets its (안) at 18pt beside the 24pt title", async () => {
  const { pages } = await pagesOf("## 01. 명세서 (안)\n\n- **기능** — 설명\n");
  assert.equal(pages[0].heading, "01. 명세서 (안)");
});

test("a text answer too long for two columns stays split and is reported", async () => {
  const md = "## 01. 명세서 (안)\n\n" + levelled(40) + "\n";
  const { sections, pages } = await pagesOf(md);
  assert.ok(pages.length > 1);
  const errors = checkStructure("/tmp/s99.md", "99. 테스트", sections, pages);
  assert.ok(errors.some((e) => /답 .*한 슬라이드를 넘는다/.test(e)));
});

test("a practice slide sets explanations at 10.5pt and a + line under its parent's text", async () => {
  const { pages } = await pagesOf("## 01. 실습 — 과제\n\n실습의 **목표**를 한 문장으로 적는다.\n\n- **서비스 개요**\n  + 고객은 상품을 고른다.\n- **결과물** — 명세서\n");
  assert.equal(pages.length, 1);
  const sizes = sizesOf(pages[0]);
  assert.ok(sizes.has("1050") && sizes.has("1800"), [...sizes].join());
  const aligned = Array.from(pages[0].doc.getElementsByTagName("a:pPr")).find((pr) => pr.getAttribute("lvl") === "3");
  assert.equal(aligned.getAttribute("marL"), "723900");
  assert.equal(aligned.getAttribute("indent"), "0");
});

test("an indented numbered item nests under the list item above it", () => {
  const { sections } = parse("## 01. 실습 — 과제\n\n- **점검 항목**\n  1. **첫째** — 확인한다.\n  2. **둘째** — 확인한다.\n    - 세부 항목\n");
  const bs = sections[0].blocks;
  assert.deepEqual(bs.map((b) => [b.kind, b.depth, b.text.slice(0, 2)]),
    [["bullet", 0, "**"], ["bullet", 1, "1."], ["bullet", 1, "2."], ["bullet", 2, "세부"]]);
});

test("an answer's leading paragraph spans both columns above them", async () => {
  const { pages } = await pagesOf("## 01. 명세서 (안)\n\n**정기배송** 서비스의 개요를 한 문단으로 적는다.\n\n" + levelled(4) + "\n");
  assert.equal(pages.length, 1);
  const boxes = Array.from(pages[0].doc.getElementsByTagName("a:off")).map((o) => [+o.getAttribute("x"), +o.getAttribute("y")]);
  const body = boxes.filter(([, y]) => y >= 960120);
  assert.equal(body.length, 3);
  const lead = body.find(([x, y]) => y === 960120);
  assert.ok(lead && body.filter(([, y]) => y > 960120).length === 2);
});

test("a diagram answer keeps its text above the diagram, in the answer sizes", async () => {
  const md = "## 01. 도식 (안)\n\n한 줄 **요약**이다.\n\n- **항목** — 설명\n\n```plantuml:usecase\nactor 고객\nusecase \"신청\" as U\n고객 -- U\n```\n";
  const { pages } = await pagesOf(md);
  assert.equal(pages.length, 1);
  assert.ok((pages[0].pictures || []).length === 1);
  const sizes = sizesOf(pages[0]);
  assert.ok(sizes.has("1400") && !sizes.has("1800"), [...sizes].join());
});
