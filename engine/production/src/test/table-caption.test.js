"use strict";
// production-guide.md 「표·도식 제목」: "**표 — 제목**"은 표 바로 위에 그린다. 앞 글이 길어 표와 한
// 장에 못 들어가면 글만 자기 장으로 가고, 표의 제목은 표를 따라간다(글의 바닥에 남지 않는다).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

const CAPTION = "수준별로 사람이 고치는 것";
const LONG = Array.from({ length: 14 }, (_, i) =>
  `- **항목 ${i + 1}** — 표와 한 장에 들어갈 수 없을 만큼 긴 설명을 여러 줄에 걸쳐 적은 보조 bullet이다.`
).join("\n");

const SOURCE = [
  "--------------------",
  "Session 명: 01. 표 제목",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 세션 목표",
  "02. 표",
  "03. 요약",
  "",
  "## 01. 세션 목표",
  "",
  "**목표**를 적는다.",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
  "## 02. 표",
  "",
  "**긴 글**이 앞에 온다.",
  "",
  LONG,
  "",
  `**표 — ${CAPTION}**`,
  "",
  "| 수준 | 사람이 고치는 것 |",
  "|---|---|",
  "| **명세 먼저** | 코드 |",
  "| **명세 고정** | 명세와 코드 |",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
  "## 03. 요약",
  "",
  "**요약**이다.",
  "",
  "### 핵심",
  "",
  "- **핵심** 한 줄",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
].join("\n");

async function pagesOf(md) {
  const { sections, toc, session } = parse(md);
  const out = path.join(os.tmpdir(), `tm-caption-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, session, toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

test("표의 제목은 글이 아니라 표를 따라간다", async () => {
  const pages = await pagesOf(SOURCE);
  const tablePage = pages.findIndex((p) => p.items.some((it) => it.kind === "table"));
  const captionPage = pages.findIndex((p) => p.items.some((it) => it.kind === "caption" && it.text === CAPTION));
  assert.ok(tablePage > 0, "표가 그려졌다");
  assert.ok(captionPage > 0, "표 제목이 그려졌다");
  assert.equal(captionPage, tablePage, "제목과 표가 같은 장에 있다");
  const leadPage = pages.findIndex((p) => p.items.some((it) => /항목 1\b/.test(it.text || "")));
  assert.ok(leadPage >= 0 && leadPage < tablePage, "긴 글은 앞 장에 따로 있다");
  assert.equal(
    pages[leadPage].doc.documentElement.textContent.includes(CAPTION),
    false,
    "표 제목이 글의 장에 남지 않는다"
  );
});

// 표 칸의 글은 세로 가운데에 둔다 — 위 여백만 있으면 가운데 맞춤이어도 아래로 치우쳐 보인다(2026-10-28).
test("표 칸은 세로 가운데 맞춤이고 위아래 여백이 같다", async () => {
  const md = [
    "--------------------",
    "Session 명: 01. 표",
    "--------------------",
    "",
    "## 목차",
    "",
    "01. 표",
    "",
    "## 01. 표",
    "",
    "**표 — 칸 맞춤**",
    "",
    "| 활동 | 사람이 한다 | AI가 한다 |",
    "|---|---|---|",
    "| 요구 | 범위와 기대값을 정한다 | 초안을 쓰고 묻는다 |",
    "| 설계 | 책임과 협력을 정한다 | 대안을 낸다 |",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
  ].join("\n");
  const { sections, toc } = parse(md);
  const out = path.join(os.tmpdir(), `tm-tcell-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE_DIR, out, "01. 표", toc);
    const page = m.pages.find((p) => (p.items || []).some((it) => it.kind === "table"));
    const cells = [...page.doc.getElementsByTagName("a:tcPr")];
    assert.ok(cells.length >= 9, "모든 칸을 본다");
    assert.equal(
      page.doc.getElementsByTagName("a:tc").length,
      cells.length,
      "tcPr이 없어 맞춤에서 빠진 칸이 없다"
    );
    for (const tc of cells) {
      assert.equal(tc.getAttribute("anchor"), "ctr");
      assert.equal(tc.getAttribute("marT"), tc.getAttribute("marB"), "위아래 여백이 같다");
    }
    // 틀의 높이가 행 높이의 합과 다르면 cy를 믿는 뷰어가 남는 높이를 행에 나눠 준다(2026-10-31).
    const kidsOf = (n, name) => {
      const out = [];
      for (let c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 1 && c.nodeName === name) out.push(c);
      }
      return out;
    };
    const gf = [...page.doc.getElementsByTagName("p:graphicFrame")]
      .find((g) => kidsOf(kidsOf(g, "a:graphic")[0] || g, "a:graphicData").length);
    const xfrm = kidsOf(gf, "p:xfrm")[0];
    const cy = Number(kidsOf(xfrm, "a:ext")[0].getAttribute("cy"));
    const rows = [...page.doc.getElementsByTagName("a:tr")]
      .reduce((sum, tr) => sum + Number(tr.getAttribute("h")), 0);
    assert.equal(cy, rows, "표 틀의 높이는 행 높이의 합과 같다");
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

// 문장 전체가 따옴표 안에 있는 한 줄은 받은 말이므로 글머리표 없이 그린다. lead가 아닌 text 줄은
// bullet이 되지만 이 줄만 예외다(production-guide.md 「한 장의 메시지」, 2026-10-31).
test("문장 전체가 따옴표 안에 있는 한 줄은 글머리표가 붙지 않는다", async () => {
  const md = [
    "--------------------",
    "Session 명: 01. 말",
    "--------------------",
    "",
    "## 목차",
    "",
    "01. 말",
    "",
    "## 01. 말",
    "",
    "요청에서 답하지 않은 **업무 규칙**은 구현 전에 **업무 담당자에게 묻는다**.",
    "",
    '"장바구니에 담은 상품을 결제하면 주문이 되고 배송이 시작되게 해 주세요."',
    "",
    "- **주문 생성**은 배송지를 확정한 때다.",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
  ].join("\n");
  const { sections, toc } = parse(md);
  const out = path.join(os.tmpdir(), `tm-spoken-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE_DIR, out, "01. 말", toc);
    const page = m.pages.find((p) => /장바구니/.test(p.doc.documentElement.textContent));
    const paras = [...page.doc.getElementsByTagName("a:p")];
    const spoken = paras.find((p) => /장바구니/.test(p.textContent));
    assert.ok(spoken, "받은 말이 그려진다");
    assert.equal(spoken.getElementsByTagName("a:buChar").length, 0, "글머리표가 없다");
    const withGlyph = paras.find((p) => /주문 생성/.test(p.textContent));
    assert.equal(withGlyph.getElementsByTagName("a:buChar").length, 1, "보통 bullet에는 글머리표가 있다");
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

// 표 뒤의 bullet이 다 들어가지 않으면 들어가는 앞부분만 표 아래에 쌓는다. 통째로 넘기면 표 아래가
// 200pt 가까이 빈 장이 생겼다(production-guide.md 「표의 행 높이와 열 너비」, 2026-10-31).
test("표 뒤의 글은 들어가는 만큼 그 장을 채우고 나머지만 넘어간다", async () => {
  const md = [
    "--------------------",
    "Session 명: 01. 표",
    "--------------------",
    "",
    "## 목차",
    "",
    "01. 표",
    "",
    "## 01. 표",
    "",
    "표 아래에 이어지는 글이 한 장에 다 들어가지 않는 topic이다.",
    "",
    "**표 — 칸 맞춤**",
    "",
    "| 활동 | 사람이 한다 | AI가 한다 |",
    "|---|---|---|",
    "| 요구 | 범위와 기대값을 정한다 | 초안을 작성하고 묻는다 |",
    "| 설계 | 책임과 협력을 정한다 | 대안을 낸다 |",
    "",
    ...Array.from({ length: 12 }, (_, i) =>
      `- **항목 ${i + 1}** — 표 아래 자리를 채우고도 남을 만큼 길게 적은 보조 bullet이며 여러 줄을 차지한다.`),
    "",
    "### 소제목",
    "",
    "- **마지막 항목** — 소제목이 연 내용이므로 소제목과 같은 장에 있어야 한다.",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
  ].join("\n");
  const { sections, toc } = parse(md);
  const out = path.join(os.tmpdir(), `tm-tfill-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE_DIR, out, "01. 표", toc);
    const page = m.pages.find((p) => (p.items || []).some((it) => it.kind === "table"));
    const after = m.pages.indexOf(page) + 1;
    assert.ok(m.pages.length > after, "글이 넘쳐 다음 장이 생긴다");
    const texts = [...page.doc.getElementsByTagName("a:t")].map((t) => t.textContent).join(" ");
    assert.match(texts, /항목 1/, "표 아래 첫 bullet은 표와 같은 장에 있다");
    for (const p of m.pages) {
      const lines = [...p.doc.getElementsByTagName("a:t")].map((t) => t.textContent);
      const last = lines.filter((t) => /항목|소제목|마지막/.test(t)).pop();
      assert.notEqual(last, "소제목", "소제목은 장의 마지막 줄로 남지 않는다");
    }
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});
