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
