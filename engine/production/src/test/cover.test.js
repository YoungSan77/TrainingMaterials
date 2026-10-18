"use strict";
// production-guide.md 「표지와 과정 목차」: 과정의 첫 세션 덱만 표지(과정명)와 과정 목차(세션 전체)로
// 시작하고, 그다음이 그 세션의 목차다. 뒤 세션은 자기 목차가 첫 장이다. 과정명과 세션 목록은
// 원고 옆 ../course-design.md에서 읽으며, 과정 설계가 없으면 두 장 다 만들지 않는다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { courseInfo } = require("../course");
const { shape, text } = require("../xml");

const COURSE = "AI-native SW 공학";
const SESSION = "01. 사람의 일과 AI의 일";
const SESSIONS = [
  { number: "01", name: SESSION },
  { number: "02", name: "02. 요구와 유저 스토리" },
  { number: "03", name: "03. 도메인 모델" },
];

function source(session) {
  return [
    "--------------------",
    "Session 명: " + session,
    "--------------------",
    "",
    "## 목차",
    "",
    "01. 세션 목표",
    "02. 요약",
    "",
    "## 01. 세션 목표",
    "",
    "**목표**를 적는다.",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
    "## 02. 요약",
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
}

const DESIGN = [
  "# 과정",
  "",
  "## 1. 과정 정보",
  "",
  "- **과정명:** " + COURSE + " (`ai-native`)",
  "- **총 교육시간:** 14시간",
  "",
  "## 5. Session 구조",
  "",
  ...SESSIONS.map((s) => `### S${s.number} — ${s.name.slice(4)} (1시간)\n\n- **목표:** …\n`),
].join("\n");

function course(design) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-cover-"));
  if (design != null) fs.writeFileSync(path.join(root, "course-design.md"), design);
  const dir = path.join(root, "sessions");
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "s01.md"), source(SESSION));
  return path.join(dir, "s01.md");
}

async function pagesOf(session, info) {
  const md = source(session);
  const { sections, toc } = parse(md);
  const out = path.join(os.tmpdir(), `tm-cover-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, session, toc, info)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

const info = () => ({ name: COURSE, sessions: SESSIONS });

test("과정명과 세션 목록은 course-design.md에서 읽고 폴더 이름은 뺀다", () => {
  const read = courseInfo(course(DESIGN));
  assert.equal(read.name, COURSE);
  assert.deepEqual(read.sessions.map((s) => s.name), SESSIONS.map((s) => s.name));
});

test("과정 설계가 없으면 과정도 표지도 없다", async () => {
  assert.equal(courseInfo(course(null)), null);
  const pages = await pagesOf(SESSION, null);
  assert.equal(pages.filter((p) => p.isCover).length, 0);
  assert.ok(pages[0].isToc, "표지가 없으면 세션 목차가 첫 장이다");
});

test("첫 세션은 표지 · 과정 목차 · 세션 목차 순으로 시작한다", async () => {
  const pages = await pagesOf(SESSION, info());
  assert.ok(pages[0].isCover);
  assert.equal(pages[0].heading, "", "표지의 제목 자리는 비운다");
  assert.equal(pages[1].heading, COURSE + " 목차");
  assert.ok(pages[1].isToc);
  assert.equal(pages[2].heading, "01. 사람의 일과 AI의 일 목차");
  assert.ok(pages[2].isToc);
});

test("뒤 세션의 덱은 자기 목차가 첫 장이다", async () => {
  const pages = await pagesOf("02. 요구와 유저 스토리", info());
  assert.equal(pages.filter((p) => p.isCover).length, 0);
  assert.equal(pages[0].heading, "02. 요구와 유저 스토리 목차");
});

test("표지 가운데에 과정명을 40pt 굵게 가운데 맞춤으로 둔다", async () => {
  const [cover] = await pagesOf(SESSION, info());
  const par = [...cover.doc.getElementsByTagName("a:p")].find((p) => p.textContent === COURSE);
  assert.ok(par, "과정명 문단이 있다");
  assert.equal(par.getElementsByTagName("a:pPr")[0].getAttribute("algn"), "ctr");
  const rPr = par.getElementsByTagName("a:rPr")[0];
  assert.equal(rPr.getAttribute("sz"), "4000");
  assert.equal(rPr.getAttribute("b"), "1");
  assert.equal(cover.doc.documentElement.textContent.includes(SESSION), false, "표지에 세션명은 없다");
});

test("과정 목차는 과정의 세션을 모두 16pt로 담는다", async () => {
  const pages = await pagesOf(SESSION, info());
  const body = [...pages[1].doc.getElementsByTagName("a:p")].filter((p) => /^\d\d\. /.test(p.textContent));
  assert.deepEqual(body.map((p) => p.textContent), SESSIONS.map((s) => s.name));
  const sizes = new Set(body.flatMap((p) => [...p.getElementsByTagName("a:rPr")].map((r) => r.getAttribute("sz"))).filter(Boolean));
  assert.deepEqual([...sizes], ["1600"]);
});

test("표지와 두 목차에는 우측 상단 세션명을 쓰지 않는다", async () => {
  const pages = await pagesOf(SESSION, info());
  assert.equal(text(shape(pages[0].doc, 5)), "");
  assert.equal(text(shape(pages[1].doc, 5)), "");
  assert.equal(text(shape(pages[2].doc, 5)), "");
  assert.equal(text(shape(pages[3].doc, 5)), SESSION);
});
