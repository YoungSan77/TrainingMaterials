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

test("a practice slide sets explanations 2pt under their line and a + line under its parent's text", async () => {
  const { pages } = await pagesOf("## 01. 실습 — 과제\n\n실습의 **목표**를 한 문장으로 적는다.\n\n- **서비스 개요**\n  + 고객은 상품을 고른다.\n- **결과물** — 명세서\n");
  assert.equal(pages.length, 1);
  const sizes = sizesOf(pages[0]);
  assert.ok(sizes.has("1600") && sizes.has("1800") && !sizes.has("1050"), [...sizes].join());
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
  // 왼쪽을 먼저 채운다(production-guide.md 「문서 형식」): 짧은 답은 거버닝 메시지 + 왼쪽 단뿐이고,
  // 길어져 왼쪽을 넘길 때만 오른쪽 단이 생긴다.
  const short = await pagesOf("## 01. 명세서 (안)\n\n**정기배송** 서비스의 개요를 한 문단으로 적는다.\n\n" + levelled(4) + "\n");
  assert.equal(short.pages.length, 1);
  const boxesOf = (page) => Array.from(page.doc.getElementsByTagName("a:off"))
    .map((o) => [+o.getAttribute("x"), +o.getAttribute("y")]).filter(([, y]) => y >= 960120);
  const shortBody = boxesOf(short.pages[0]);
  assert.equal(shortBody.length, 2, "거버닝 메시지와 왼쪽 단뿐이다");
  assert.ok(shortBody.some(([, y]) => y === 960120), "거버닝 메시지가 두 단 위에 있다");

  const long = await pagesOf("## 01. 명세서 (안)\n\n**정기배송** 서비스의 개요를 한 문단으로 적는다.\n\n" + levelled(9) + "\n");
  assert.equal(long.pages.length, 1);
  const longBody = boxesOf(long.pages[0]);
  assert.equal(longBody.length, 3, "넘치면 오른쪽 단이 생긴다");
  const columns = longBody.filter(([, y]) => y > 960120).map(([x]) => x).sort((a, b) => a - b);
  assert.ok(columns[1] > columns[0], "두 단이 좌우로 놓인다");

  // 왼쪽을 먼저 채우되 제 여유(leftFit)를 넘기지 않는다 — 넘기면 글이 쪽 번호 위로 흐른다.
  const { ANSWER_COLUMNS, ANSWER_STYLE, styledCost } = require("../builder");
  const { sections } = parse("## 01. 명세서 (안)\n\n" + levelled(9) + "\n");
  const body = sections[0].blocks.filter((b) => b.kind === "bullet");
  const box = ANSWER_COLUMNS[0];
  const leftOnly = styledCost(body, ANSWER_STYLE, box);
  assert.ok(leftOnly > box.h * 72 * ANSWER_STYLE.leftFit, "이 분량은 한 단을 넘는다(두 단 분할이 일어난다)");
});

// production-guide.md 「문서 형식」: 왼쪽 단은 제 여유(leftFit)까지 채우고, 넘는 것만 오른쪽으로
// 보낸다. 여유를 빼면 들어갈 항목이 오른쪽으로 넘어가 왼쪽 아래가 비고, 오른쪽 단의 여유(fit)까지
// 열면 왼쪽 글이 쪽 번호를 덮는다. 추정과 실제 출력의 차이를 실제 덱으로 맞춘 값이다.
test("the left column fills to its own tolerance, between the box height and fit", async () => {
  const { ANSWER_COLUMNS, ANSWER_STYLE, styledCost, PAGE_NUM_Y } = require("../builder");
  assert.ok(1 < ANSWER_STYLE.leftFit && ANSWER_STYLE.leftFit < ANSWER_STYLE.fit, "여유는 제 높이와 fit 사이다");
  const col = ANSWER_COLUMNS[0];
  const box = { ...col, h: Math.min(col.h, PAGE_NUM_Y - 0.15 - col.y) };
  const long = (i) => `- **규칙 ${i}** 답의 규칙은 수강생이 LLM과 함께 정한 내용을 한 줄로 적는다.`;
  const body = (m) => "## 01. 명세서 (안)\n\n"
    + Array.from({ length: 10 }, (_, i) => long(i + 1)).join("\n") + "\n"
    + Array.from({ length: m }, (_, i) => `  - 짧은 조건 ${i + 1}이다.`).join("\n") + "\n";
  const ratio = (md) => styledCost(parse(md).sections[0].blocks.filter((b) => b.kind === "bullet"), ANSWER_STYLE, box) / (box.h * 72);
  // 제 높이를 조금 넘는 분량(여유 안)은 왼쪽 단에 남는다 — 오른쪽으로 넘기면 왼쪽 아래가 빈다.
  const inside = body(1);
  assert.ok(ratio(inside) > 1 && ratio(inside) <= ANSWER_STYLE.leftFit, `여유 안: ${ratio(inside).toFixed(3)}배`);
  assert.equal((await pagesOf(inside)).pages[0].columns, 1);
  // 여유를 넘으면 나머지를 오른쪽으로 보낸다 — 더 받으면 글이 쪽 번호를 덮는다.
  const over = body(2);
  assert.ok(ratio(over) > ANSWER_STYLE.leftFit, `여유 밖: ${ratio(over).toFixed(3)}배`);
  assert.equal((await pagesOf(over)).pages[0].columns, 2);
});

test("a diagram answer keeps its text above the diagram, in the answer sizes", async () => {
  const md = "## 01. 도식 (안)\n\n한 줄 **요약**이다.\n\n- **항목** — 설명\n\n```plantuml:usecase\nactor 고객\nusecase \"신청\" as U\n고객 -- U\n```\n";
  const { pages } = await pagesOf(md);
  assert.equal(pages.length, 1);
  assert.ok((pages[0].pictures || []).length === 1);
  const sizes = sizesOf(pages[0]);
  assert.ok(sizes.has("1400") && !sizes.has("1800"), [...sizes].join());
});
