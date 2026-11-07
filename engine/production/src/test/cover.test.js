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

const GOAL_LEAD = "이 과정은 **AI 도입으로 SW 공학이 어떻게 바뀌는가**를 다룬다.";
const GOALS = [
  "작업마다 가장 단순한 충분한 **형태**를 선택할 수 있다.",
  "결정마다의 검사를 **명령 하나**로 모아 루프 안에서 돌릴 수 있다.",
];

const DESIGN = [
  "# 과정",
  "",
  "## 1. 과정 정보",
  "",
  "- **과정명:** " + COURSE + " (`ai-native`)",
  "- **총 교육시간:** 14시간",
  "",
  "## 2. 과정 목표",
  "",
  "### 과정 목표 슬라이드",
  "",
  GOAL_LEAD,
  "",
  ...GOALS.map((g) => "- " + g),
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

const info = () => ({ name: COURSE, sessions: SESSIONS, goal: { lead: GOAL_LEAD, goals: GOALS } });

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

// 과정과 세션이 같은 "목차 → 목표" 순서다(production-guide.md 「표지·과정 목차·과정 목표」).
test("첫 세션은 표지 · 과정 목차 · 과정 목표 · 세션 목차 순으로 시작한다", async () => {
  const pages = await pagesOf(SESSION, info());
  assert.ok(pages[0].isCover);
  assert.equal(pages[0].heading, "", "표지의 제목 자리는 비운다");
  assert.equal(pages[1].heading, COURSE + " 목차");
  assert.ok(pages[1].isToc);
  assert.equal(pages[2].heading, COURSE + " 목표");
  assert.ok(pages[2].isCourseGoal);
  assert.equal(pages[3].heading, "01. 사람의 일과 AI의 일 목차");
  assert.ok(pages[3].isToc);
  assert.equal(pages[4].heading, "01. 세션 목표", "세션도 목차 다음이 목표다");
});

test("과정 목표는 설계의 「과정 목표 슬라이드」를 그대로 담는다", () => {
  const read = courseInfo(course(DESIGN));
  assert.equal(read.goal.lead, GOAL_LEAD);
  assert.deepEqual(read.goal.goals, GOALS);
});

test("설계에 과정 목표 슬라이드가 없으면 그 장만 만들지 않는다", async () => {
  const read = courseInfo(course(DESIGN.replace("### 과정 목표 슬라이드", "### 다른 절")));
  assert.equal(read.goal, null);
  const pages = await pagesOf(SESSION, { name: COURSE, sessions: SESSIONS, goal: null });
  assert.ok(pages[0].isCover);
  assert.equal(pages[1].heading, COURSE + " 목차");
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

test("표지·과정 목차·과정 목표에는 우측 상단 세션명을 쓰지 않는다", async () => {
  const pages = await pagesOf(SESSION, info());
  assert.equal(text(shape(pages[0].doc, 5)), "");
  assert.equal(text(shape(pages[1].doc, 5)), "");
  assert.equal(text(shape(pages[2].doc, 5)), "");
  assert.equal(text(shape(pages[3].doc, 5)), "");
  assert.equal(text(shape(pages[4].doc, 5)), SESSION);
});
