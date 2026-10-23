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
  const toc = sections.filter(s => !s.appendix).map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0, meta: null }));
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

test("a thousands separator in the Korean summary is not the Korean/English boundary", async () => {
  const [p] = await deck('## 01. 주제\n\n**인용문**\n\n에이전트에게 **1,000쪽 지시서가 아니라 지도**를 준다, "give Codex a map, not a 1,000-page instruction manual", [Lopopolo 2026]\n');
  const first = paras(p)[0];
  assert.ok(pText(first).startsWith("에이전트에게 1,000쪽 지시서가 아니라 지도를 준다, "), pText(first));
  const korean = all(first, A, "r").filter((r) => child(r, A, "rPr").getAttribute("sz") === "1800");
  assert.equal(korean.map((r) => all(r, A, "t").map((t) => t.textContent).join("")).join(""), "에이전트에게 1,000쪽 지시서가 아니라 지도를 준다");
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

// production-guide.md "문서 형식" + "표·도식 제목": a 10pt document topic with one diagram is set on
// one slide. The diagram's "**도식 — … — 제목**" marker is its title, never a line of the document,
// and the title's own band is reserved so the diagram never slides onto the text below it.
const docDiagramDeck = (text) => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><style>text{font-size:16px}</style>'
    + '<rect width="320" height="220" fill="#fff"/><text x="20" y="40">가</text><text x="20" y="200">나</text></svg>';
  return deck("## 01. 문서\n\n**문서 형식 — 10pt**\n\n**도식 — SVG — 상태 기계**\n\n```svg\n" + svg + "\n```\n\n" + text);
};

test("a 10pt document's diagram marker is its title, not a line of the document", async () => {
  const ps = await docDiagramDeck("- **첫째** 읽는 법을 적는다.\n- **둘째** 범위를 적는다.\n");
  const p = ps.find((x) => (x.pictures || []).length);
  assert.ok(p, "the diagram is placed");
  for (const sp of all(p.doc, P, "sp")) {
    const line = all(sp, A, "t").map((t) => t.textContent).join("");
    assert.equal(line.includes("도식 —"), false, `the marker never shows: ${line}`);
  }
  assert.equal(p.pictures[0].caption, "상태 기계");
});

test("a 10pt document's diagram leaves its title's band free, so it never covers the text below", async () => {
  const ps = await docDiagramDeck("- **첫째** 읽는 법을 적는다.\n- **둘째** 범위를 적는다.\n- **셋째** 미정을 적는다.\n");
  const p = ps.find((x) => (x.pictures || []).length);
  assert.ok(p, "the diagram is placed");
  const b = p.pictures[0].bounds;
  const bottom = b.y + b.h;
  const below = all(p.doc, P, "sp")
    .filter((sp) => all(sp, A, "t").map((t) => t.textContent).join("").includes("셋째"))
    .flatMap((sp) => all(sp, A, "off").map((off) => Number(off.getAttribute("y")) / 914400));
  assert.ok(below.length, "the text below the diagram is on this slide");
  for (const y of below) assert.ok(y >= bottom - 1e-6, `text at ${y.toFixed(2)}" sits under the diagram ending at ${bottom.toFixed(2)}"`);
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


test("10pt document keeps both columns and every body run at 10pt", async () => {
  const [p] = await deck("## 01. 문서\n\n**문서 형식 — 10pt**\n\n### 전제\n\n- **항목** — 설명 (미결)\n  - 세부 질문\n\n### 후속\n\n- 후속 질문\n");
  assert.equal(p.answerColumns, 2);
  const shapes = all(p.doc, P, "sp").filter(s => all(s, A, "t").some(t => /전제|항목|후속|세부/.test(t.textContent)));
  assert.equal(shapes.length, 1, "short document stays entirely in the left column");
  for (const s of shapes) {
    for (const p of all(s, A, "p")) {
      if (!all(p, A, "t").length) continue;
      const pr = child(p, A, "pPr");
      assert.ok(Number(pr.getAttribute("marL")) >= 0.2 * 914400);
      for (const name of ["spcBef", "spcAft"]) {
        const spacing = child(child(pr, A, name), A, "spcPts");
        assert.equal(spacing.getAttribute("val"), "300");
      }
    }
    assert.equal(all(s, A, "t").some(t => t.textContent.includes("문서 형식")), false);
    const runs = all(s, A, "rPr");
    assert.ok(runs.length);
    for (const r of runs) assert.equal(r.getAttribute("sz"), "1000");
  }
});


test("practice prompt continuation hangs after its circled number", async () => {
  const [p] = await deck("## 01. 실습 — 확인\n\n안내\n\n**프롬프트**\n  + ① “첫 번째 요청이다.”\n  + ② “두 번째 요청이다.”\n");
  const ps = all(p.doc, A, "p").filter(p => all(p, A, "buAutoNum").some(n => n.getAttribute("type") === "circleNumDbPlain"));
  assert.equal(ps.length, 2);
  const { numberedText } = require("../inspect");
  const bodyShape = all(p.doc, P, "sp").find(s => all(s, A, "buAutoNum").length);
  assert.match(numberedText(bodyShape), /① “첫 번째 요청이다.”/);
  assert.match(numberedText(bodyShape), /② “두 번째 요청이다.”/);
  for (const p of ps) {
    assert.equal(child(p, A, "pPr").getAttribute("marL"), "981075");
    assert.equal(child(p, A, "pPr").getAttribute("indent"), "-268288");
    assert.equal(/^[①②]/.test(p.textContent), false);
  }
});


test("10pt document fills the left column before continuing on the right", async () => {
  const items = Array.from({ length: 34 }, (_, i) => `- **항목 ${i + 1}** 내용이다.`).join("\n");
  const [p] = await deck("## 01. 문서\n\n**문서 형식 — 10pt**\n\n" + items);
  const shapes = all(p.doc, P, "sp").filter(s => all(s, A, "t").some(t => /항목/.test(t.textContent)));
  assert.equal(shapes.length, 2);
  const counts = shapes.map(s => all(s, A, "p").filter(p => /항목/.test(p.textContent)).length);
  assert.ok(counts[0] > counts[1], String(counts));
  assert.equal(counts[0] + counts[1], 34);
});


test("progressive practice prompts retain native circle numbers through five", async () => {
  const marks = ["①", "②", "③", "④", "⑤"];
  const [p] = await deck("## 01. 실습 — 질문\n\n안내\n\n**프롬프트**\n" + marks.map(m => `  + ${m} “**요청**을 수행해라.”`).join("\n"));
  const nums = all(p.doc, A, "buAutoNum").filter(n => n.getAttribute("type") === "circleNumDbPlain");
  assert.deepEqual(nums.map(n => n.getAttribute("startAt")), ["1", "2", "3", "4", "5"]);
});


test("long document title keeps its complete text and shrinks before wrapping onto its subtitle", async () => {
  const title = "정기배송 최초 신청 및 계약 성립을 위한 질문";
  const [p] = await deck(`## 01. ${title}\n\n**문서 형식 — 10pt**\n\n- **질문**을 제시한다.\n`);
  const titleShape = shape(p.doc, 2);
  assert.ok(all(titleShape, A, "t").some(t => t.textContent.includes(title)));
  const size = Number(all(titleShape, A, "rPr")[0].getAttribute("sz"));
  assert.ok(size >= 1800 && size < 2400, String(size));
});


test("long 10pt document continues without reducing the number of entries or increasing text size", async () => {
  const items = Array.from({length: 100}, (_, i) => `- **업무${i + 1}** 결정 질문이다.`).join("\n");
  const pages = await deck("## 01. 긴 문서\n\n**문서 형식 — 10pt**\n\n" + items);
  assert.ok(pages.length > 1);
  let count = 0;
  for (const p of pages) {
    assert.equal(p.answerColumns, 2);
    for (const sh of all(p.doc, P, "sp")) {
      const ps = all(sh, A, "p").filter(p => /업무\d+/.test(p.textContent));
      count += ps.length;
      for (const p of ps) for (const rp of all(p, A, "rPr")) assert.equal(rp.getAttribute("sz"), "1000");
    }
  }
  assert.equal(count, 100);
});


test("continued long document titles fit the full title and page counter without losing text", async () => {
  const title = "정기배송 최초 신청 접수 및 계약 성립 정책 질문 목록 (1/8)";
  const [p] = await deck(`## 01. ${title}\n\n**문서 형식 — 10pt**\n\n- **질문**을 유지한다.\n`);
  const sh = shape(p.doc, 2);
  assert.ok(all(sh, A, "t").some(t => t.textContent.includes("정기배송 최초 신청 접수 및 계약 성립 정책 질문 목록")));
  const pt = Number(all(sh, A, "rPr")[0].getAttribute("sz"));
  assert.ok(pt >= 1600 && pt <= 1800, String(pt));
});

test("verbatim response marker is invisible and does not add emphasis to raw answer", async () => {
  const text = "고객은 기존에 등록된 배송지를 선택한다.";
  const pages = await deck(`## 01. 본문\n\n**안내**다.\n\n## 별첨. 실습 답\n\n## 실제 답\n\n**문서 형식 — 10pt**\n\n**실제 LLM 응답**\n\n- ${text}\n- **미정:** 고객이 결정한다.\n`);
  const paragraphs = pages.flatMap(p => all(p.doc, A, "p"));
  assert.equal(paragraphs.some(p => pText(p).includes("실제 LLM 응답")), false);
  const p = paragraphs.find(p => pText(p) === text);
  assert.ok(p);
  for (const rp of all(p, A, "rPr")) assert.notEqual(rp.getAttribute("b"), "1");
  assert.ok(paragraphs.some(p => pText(p).includes("미정:")));
});

test("five-stage practice preserves iterative feedback and repeatable final MD instructions", async () => {
  const instruction = "①로 시작해 답·질문·수정 요청을 주고받는다. ②~④는 횟수 제한 없는 보완 예시다. ⑤로 MD를 만들고 필요하면 보완·재생성한다.";
  const md = `## 01. 실습 — 피드백\n\n${instruction}\n\n**프롬프트 — 요청사항 포함**\n  + ① “**초안**을 작성해라.”\n  + ② “**답**을 반영해라. [앞선 질문에 대한 답] [추가 질문·수정 요청]”\n  + ③ “필요한 **품질**을 질문해라.”\n  + ④ “**기준**을 반영하고 검토해라.”\n  + ⑤ “합의한 **MD 파일**을 생성해라. 새 결정을 추가하지 마라.”\n\n**점검 항목**\n  1. **근거** — 답을 반영했는가?\n\n**결과물**\n  + **합의한 문서**\n\n**강사 노트**\n\n- 이것은 강사만 보는 실행 기록이다.\n`;
  const pages = await deck(md);
  assert.equal(pages.length, 1);
  const text = all(pages[0].doc, A, "t").map(t => t.textContent).join("");
  assert.ok(text.includes(instruction));
  assert.ok(text.includes("합의한 MD 파일을 생성해라. 새 결정을 추가하지 마라."));
  assert.ok(text.includes("[앞선 질문에 대한 답] [추가 질문·수정 요청]"));
  assert.equal(text.includes("강사만 보는 실행 기록"), false);
  const nums = all(pages[0].doc, A, "buAutoNum").filter(n => n.getAttribute("type") === "circleNumDbPlain");
  assert.deepEqual(nums.map(n => n.getAttribute("startAt")), ["1", "2", "3", "4", "5"]);
});

test("verbatim diagram answer uses answer prose sizes without changing the original title or emphasis", async () => {
  const sentence = "원래 응답의 문장과 강조를 그대로 보존한다.";
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80"><text x="10" y="40" font-size="16">개념</text></svg>';
  const pages = await deck(`## 01. 본문\n\n**안내**다.\n\n## 별첨. 실습 답\n\n## 원래 제목\n\n**실제 LLM 응답**\n\n${sentence}\n\n- 용어 설명\n\n\`\`\`svg\n${svg}\n\`\`\`\n`);
  const page = pages.find(p => all(p.doc, A, "t").some(t => t.textContent === sentence));
  assert.ok(page);
  const paragraph = all(page.doc, A, "p").find(p => pText(p) === sentence);
  const runs = all(paragraph, A, "rPr");
  assert.ok(runs.length);
  for (const rp of runs) {
    assert.equal(rp.getAttribute("sz"), "1400");
    assert.notEqual(rp.getAttribute("b"), "1");
  }
  assert.ok(all(page.doc, A, "t").some(t => t.textContent === "원래 제목"));
  assert.equal(all(page.doc, A, "t").some(t => /실제 LLM 응답|원래 제목 \(안\)/.test(t.textContent)), false);
});

test("explicit 10pt document with a diagram keeps prose at 10pt and renders the diagram", async () => {
  const sentence = "실제 응답의 설명을 줄이거나 편집하지 않고 배치한다.";
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80"><text x="10" y="40" font-size="16">개념</text></svg>';
  const pages = await deck(`## 01. 문서\n\n**문서 형식 — 10pt**\n\n${sentence}\n\n\`\`\`svg\n${svg}\n\`\`\`\n`);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].pictures.length, 1);
  const paragraph = all(pages[0].doc, A, "p").find(p => pText(p) === sentence);
  assert.ok(paragraph);
  for (const rp of all(paragraph, A, "rPr")) assert.equal(rp.getAttribute("sz"), "1000");
  assert.equal(all(pages[0].doc, A, "t").some(t => t.textContent.includes("문서 형식")), false);
});

test("a 10pt diagram document keeps the diagram and trailing rules together without dropping text", async () => {
  const { pictureTextPt } = require("../visualFit");
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="600" viewBox="0 0 500 600"><text x="10" y="40" font-size="16">모델</text></svg>';
  const rules = Array.from({length: 6}, (_, i) => `- 규칙 ${i + 1}: 합의한 업무 의미와 원문을 그대로 보존해 모든 내용을 확인할 수 있다.`).join("\n");
  const pages = await deck(`## 01. 도식 문서\n\n**문서 형식 — 10pt**\n\n\`\`\`svg\n${svg}\n\`\`\`\n\n### 규칙\n\n${rules}\n`);
  assert.equal(pages.length, 1);
  const page = pages[0];
  assert.equal(page.pictures.length, 1);
  assert.ok(pictureTextPt(page.pictures[0], page.pictures[0].bounds) >= 7);
  const text = all(page.doc, A, "t").map(t => t.textContent).join("");
  for (let i = 1; i <= 6; i++) assert.ok(text.includes(`규칙 ${i}:`));
});
