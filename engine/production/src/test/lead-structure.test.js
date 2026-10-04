"use strict";
// session-authoring-guide.md "한 장의 메시지" / production-guide.md "이어지는 장", "표·도식 제목":
// one lead per topic (a citation may be it when it opens the topic), "###" sub-headings bold and
// indented without a glyph, continuation slides that start with their own content, and titles for
// tables ("**표 — 제목**") and diagrams ("**도식 — PlantUML — 제목**").
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { A, P, all, shape, body, kids, child } = require("../xml");

async function deck(md) {
  const { sections } = parse(md);
  const toc = sections.map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0, meta: null }));
  const out = path.join(os.tmpdir(), `tm-lead-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages.filter((p) => !p.isToc);
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}
const paras = (page) => kids(body(shape(page.doc, 8)), A, "p");
const pText = (p) => all(p, A, "t").map((t) => t.textContent).join("");

test("a ### sub-heading is bold and indented with no glyph; what follows keeps its level", async () => {
  const [p] = await deck("## 01. 주제\n\n**리드** 문장이다.\n\n### 소제목\n\n- **항목** 하나\n");
  const ps = paras(p);
  const h = ps.find((x) => pText(x) === "소제목");
  const pr = child(h, A, "pPr");
  assert.ok(child(pr, A, "buNone"), "no glyph");
  assert.notEqual(pr.getAttribute("marL"), "0", "indented");
  assert.equal(all(h, A, "rPr")[0].getAttribute("b"), "1", "bold");
  const item = ps.find((x) => pText(x).startsWith("항목"));
  assert.equal(child(item, A, "pPr").getAttribute("lvl"), "2", "a top-level bullet stays at its own level");
});

test("a citation that opens the topic is its lead (flush, no glyph)", async () => {
  const [p] = await deck('## 01. 주제\n\n**인용문**\n\n핵심 **요약**이다, "Original sentence here.", Author, 2004\n\n- **보조** 설명\n');
  const first = paras(p)[0];
  assert.ok(pText(first).startsWith("핵심 요약이다"));
  assert.equal(child(first, A, "pPr").getAttribute("marL"), "0");
  assert.ok(child(child(first, A, "pPr"), A, "buNone"));
});

test("a continuation slide starts with its own content at the top, without repeating the lead", async () => {
  const lines = Array.from({ length: 16 }, (_, i) => `- **${i + 1}번** 설명 문장이 본문을 한 줄씩 길게 채워 다음 장으로 넘어가게 한다.`);
  const ps = await deck("## 01. 주제\n\n**리드** 메시지 문장이다.\n\n" + lines.join("\n") + "\n");
  assert.ok(ps.length >= 2);
  const first = paras(ps[1])[0];
  assert.notEqual(pText(first), "리드 메시지 문장이다.");
  assert.ok(/번 설명 문장/.test(pText(first)));
  for (const rp of all(first, A, "rPr")) assert.notEqual(rp.getAttribute("i"), "1");
});

test("a table title renders 14pt bold right above the table", async () => {
  const [p] = await deck("## 01. 주제\n\n**리드** 문장이다.\n\n**표 — 묶는 기준**\n\n| 기준 | 질문 |\n|---|---|\n| **합성** | 함께 있어야 하는가? |\n");
  const runs = all(p.doc, A, "r").filter((r) => all(r, A, "t").map((t) => t.textContent).join("") === "묶는 기준");
  assert.equal(runs.length, 1);
  const rp = child(runs[0], A, "rPr");
  assert.equal(rp.getAttribute("sz"), "1400");
  assert.equal(rp.getAttribute("b"), "1");
});

test("a diagram marker's title becomes the picture's caption, and the marker never shows", async () => {
  const ps = await deck("## 01. 주제\n\n**리드** 문장이다.\n\n**도식 — Mermaid — 주문 흐름**\n\n```mermaid\nflowchart LR\n  A --> B\n```\n");
  const pics = ps.flatMap((p) => p.pictures || []);
  assert.equal(pics[0].caption, "주문 흐름");
  for (const p of ps) for (const it of p.items) assert.equal(String(it.text).includes("도식 —"), false);
});

test("a side-layout diagram's title stays over the diagram column, clear of the text on the left", async () => {
  const lines = Array.from({ length: 6 }, (_, i) => `- **${i + 1}번** 설명 문장이 본문을 한 줄씩 길게 채워 옆 배치가 되게 한다.`);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400" viewBox="0 0 200 400"><style>text{font-size:16px}</style>'
    + '<rect width="200" height="400" fill="#fff"/><text x="20" y="40">가</text><text x="20" y="380">나</text></svg>';
  const ps = await deck("## 01. 주제\n\n**배치 — 좌우**\n\n**리드** 문장이다.\n\n" + lines.join("\n") + "\n\n**도식 — SVG — 세로 도식**\n\n```svg\n" + svg + "\n```\n");
  const p = ps.find((x) => x.visualLayout === "side");
  assert.ok(p, "the tall diagram goes beside the text");
  const cap = all(p.doc, P, "sp").find((sp) => all(sp, A, "t").map((t) => t.textContent).join("") === "세로 도식");
  const off = all(cap, A, "off")[0];
  assert.ok(Number(off.getAttribute("x")) / 914400 >= 5.85 - 1e-6, "the title starts in the right half");
});

test("a tall diagram stays below the text unless the topic asks for the side layout", async () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400" viewBox="0 0 200 400"><style>text{font-size:16px}</style>'
    + '<rect width="200" height="400" fill="#fff"/><text x="20" y="40">가</text><text x="20" y="380">나</text></svg>';
  const ps = await deck("## 01. 주제\n\n**리드** 문장이다.\n\n- **하나** 설명\n\n**도식 — SVG — 세로 도식**\n\n```svg\n" + svg + "\n```\n");
  assert.equal(ps.some((x) => x.visualLayout === "side"), false);
});

test("an unnumbered heading is a sub-topic: its own title, the group as the 11pt second line, not a TOC item", async () => {
  const md = "## 목차\n\n01. 연관\n02. 요약\n\n## 01. 연관\n\n## 연관의 이름\n\n**이름** 문장이다.\n\n## 다중성\n\n**다중성** 문장이다.\n\n## 02. 요약\n\n**요약** 문장이다.\n";
  const { sections, toc } = parse(md);
  assert.deepEqual(sections.map((s) => s.group || null), [null, "01. 연관", "01. 연관", null]);
  const out = path.join(os.tmpdir(), `tm-group-${process.pid}-${Date.now()}.pptx`);
  try {
    const pages = (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages;
    const content = pages.filter((p) => !p.isToc).map((p) => p.heading);
    assert.deepEqual(content, ["연관의 이름\n01. 연관", "다중성\n01. 연관", "02. 요약"], "an empty group makes no slide");
    const titleRuns = all(pages.find((p) => p.heading.startsWith("다중성")).doc, A, "r").filter((r) => all(r, A, "t").map((t) => t.textContent).join("") === "01. 연관");
    assert.equal(child(titleRuns[0], A, "rPr").getAttribute("sz"), "1100");
    const tocRuns = all(pages.find((p) => p.isToc).doc, A, "r").filter((r) => /^0\d\./.test(all(r, A, "t").map((t) => t.textContent).join("")));
    assert.equal(tocRuns.length, 2, "only the two groups are TOC items");
    for (const r of tocRuns) assert.equal(child(r, A, "rPr").getAttribute("sz"), "1600");
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

test("a group whose content is one sub-topic shows as the group itself, with no second title line", async () => {
  const md = "## 목차\n\n01. 연관\n02. 요약\n\n## 01. 연관\n\n## 연관의 이름\n\n**이름** 문장이다.\n\n## 02. 요약\n\n**요약** 문장이다.\n";
  const { sections, toc } = parse(md);
  assert.deepEqual(sections.map((s) => s.title), ["01. 연관", "02. 요약"]);
  const out = path.join(os.tmpdir(), `tm-group1-${process.pid}-${Date.now()}.pptx`);
  try {
    const pages = (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages.filter((p) => !p.isToc);
    assert.deepEqual(pages.map((p) => p.heading), ["01. 연관", "02. 요약"]);
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

test("**문서 형식** sets a topic on one slide in two columns at the answer sizes", async () => {
  const items = Array.from({ length: 14 }, (_, i) => `- **항목 ${i + 1}** — 명세서의 한 줄을 이루는 내용이 이어진다.`);
  const ps = await deck("## 01. 명세서\n\n**문서 형식**\n\n「주문을 관리한다」의 **명세서**다.\n\n" + items.join("\n") + "\n\n**페이지 분할**\n\n- **결과** — 끝\n");
  assert.equal(ps.length, 1, "one slide");
  assert.equal(ps[0].answerColumns, 2);
  for (const it of ps[0].items) assert.equal(String(it.text).includes("문서 형식"), false, "the marker never shows");
});
