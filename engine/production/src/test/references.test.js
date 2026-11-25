"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { checkReferences } = require("../references");
const { sparseContinuations } = require("../generate");

function course() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-refs-"));
  fs.mkdirSync(path.join(root, "sessions"));
  fs.writeFileSync(path.join(root, "course-design.md"),
    "### S01 — 개요 (45분)\n\n### S02 — 요구 분석과 유스케이스 (1시간)\n\n### S03 — 정적 모델 (1시간)\n");
  const s = (no, name, topics) => ["--------------------", "Session 명: " + no + ". " + name, "--------------------", "",
    "## 목차", "", ...topics, "", ...topics.map((t) => "## " + t + "\n\n본문.\n")].join("\n");
  fs.writeFileSync(path.join(root, "sessions", "s02.md"), s("02", "요구 분석과 유스케이스", ["01. 세션 목표", "02. 유스케이스"]));
  return root;
}

test("topic references resolve in the current session, or in the session named right before them", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "02. 개념", "",
    "## 01. 세션 목표", "", "「02. 개념」과 \"세션 02. 요구 분석과 유스케이스\"의 「02. 유스케이스」를 본다.", "",
    "## 02. 개념", "", "\"세션 02. 요구 분석과 유스케이스\"의 「01. 세션 목표」·「02. 유스케이스」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  assert.deepEqual(checkReferences(p, body), { errors: [], warnings: [] });
});

test("Curriculum supplies session names while sibling decks supply topic headings", () => {
  const root = course();
  const dir = path.join(root, "sessions");
  const p = path.join(dir, "s03.md");
  fs.writeFileSync(path.join(root, "curriculum.md"), [
    "| 세션 | 제목 |", "|---|---|", "| S02 | 요구사항 — 승인 제목 |", "| S03 | 정적 모델 |", "| S05 | 동적 관점 |",
  ].join("\n"));
  const body = 'Session 명: 03. 정적 모델\n\n## 01. 개념\n\n"세션 02. 요구사항 — 승인 제목"의 「02. 유스케이스」와 "세션 05. 동적 관점"을 본다.';
  assert.deepEqual(checkReferences(p, body), { errors: [], warnings: [] });
  assert.match(checkReferences(p, body.replace("요구사항 — 승인 제목", "요구 분석과 유스케이스")).errors[0], /세션명 "02\. 요구사항 — 승인 제목"과 다르다/);
  assert.match(checkReferences(p, body.replace("「02. 유스케이스」", "「02. 없는 주제」")).errors[0], /없는 주제.*없다/);
  assert.match(checkReferences(p, body.replace("05. 동적 관점", "01. 개요")).warnings[0], /Curriculum에 없음/);
  const sibling = path.join(dir, "s02.md");
  assert.match(checkReferences(sibling, fs.readFileSync(sibling, "utf-8")).errors[0], /원고 세션명.*Curriculum/);
});

test("wrong numbers, topic titles quoted as sessions and S0x names are errors", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "02. 개념", "",
    "## 01. 세션 목표", "", "「01. 개념」을 본다.", "", "\"세션 02. 개념\"을 본다.", "", "S02에서 다뤘다.", "",
    "## 02. 개념", "", "\"세션 02. 요구 분석과 유스케이스\"의 「03. 유스케이스」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  const { errors } = checkReferences(p, body);
  assert.equal(errors.length, 4);
  assert.match(errors[0], /「02\. 개념」로 고친다/);
  assert.match(errors[1], /주제 참조라면 「」/);
  assert.match(errors[2], /S0x/);
  assert.match(errors[3], /「03\. 유스케이스」/);
});

test('a named production-guide heading is not a bare session reference, but neighbouring S0x references still fail',()=>{
 const root=course(),p=path.join(root,'sessions','s03.md');
 const body='## 01. 세션 목표\n\n**강사 노트**\n\n- 제작 지침의 「S03 제작 기준」을 적용한다.\n';
 fs.writeFileSync(p,body);assert.deepEqual(checkReferences(p,body).errors,[]);
 assert.ok(checkReferences(p,body+'- 제작 지침의 「S03 제작 기준」을 읽고 S02를 본다.\n').errors.some(e=>/S0x/.test(e)));
 assert.deepEqual(checkReferences(p,'## 01. 세션 목표\n\n**강사 노트**\n\n- `../production-standard.md`의 「S03 제작 기준」을 적용한다.\n').errors,[]);
});

test("a session quoted without the word 세션 is an error that shows the form to use", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "",
    "## 01. 세션 목표", "", "\"02. 요구 분석과 유스케이스\"의 「02. 유스케이스」를 본다.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  const { errors } = checkReferences(p, body);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /"세션 02\. 요구 분석과 유스케이스"처럼 쓴다/);
  // Without the prefix the topic no longer resolves against that session either.
  assert.match(errors[1], /「02\. 유스케이스」/);
});

test("a session referenced by number alone is an error that names the session to use", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "",
    "## 01. 세션 목표", "", "\"세션 02.\"의 시연에서 보았다.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  const { errors } = checkReferences(p, body);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /"02\. 요구 분석과 유스케이스"로 쓴다/);
});

test("a continuation slide with only a line of text is reported only when more follows it", () => {
  const m = { pages: [
    { heading: "01. 주제 (1/3)", items: [{ kind: "body" }], textCost: 40 },
    { heading: "01. 주제 (2/3)", items: [{ kind: "body" }], textCost: 400 },
    { heading: "01. 주제 (3/3)", items: [{ kind: "body" }], textCost: 40 },
    { heading: "02. 표 (2/2)", items: [{ kind: "table" }], textCost: 0 },
  ] };
  const w = sparseContinuations(m);
  assert.equal(w.length, 1);
  assert.match(w[0], /슬라이드 1/);
});

test("a review deck sNN-add.md resolves own-session references against its full candidate sNN.md", () => {
  const root = course();
  const full = ["--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "02. 개념", "03. 코드", "",
    "## 01. 세션 목표", "", "본문.", "", "## 02. 개념", "", "본문.", "", "## 03. 코드", "", "「02. 개념」을 코드로 본다.", ""].join("\n");
  fs.writeFileSync(path.join(root, "sessions", "s03.md"), full);
  const add = ["--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "03. 코드", "",
    "## 03. 코드", "", "「02. 개념」을 코드로 본다.", ""].join("\n");
  const p = path.join(root, "sessions", "s03-add.md");
  fs.writeFileSync(p, add);
  assert.deepEqual(checkReferences(p, add), { errors: [], warnings: [] });
});

test("a bare topic number 「NN」 is an error that suggests the full 「NN. 제목」", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "02. 개념", "",
    "## 01. 세션 목표", "", "뒤의 「02」와 \"세션 02. 요구 분석과 유스케이스\"의 「02」를 본다.", "",
    "## 02. 개념", "", "본문.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  const { errors } = checkReferences(p, body);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /「02\. 개념」로 쓴다/);
  assert.match(errors[1], /「02\. 유스케이스」로 쓴다/);
});

test("a chained reference may name a sub-topic of each group", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "",
    "## 01. 세션 목표", "", "\"세션 02. 요구 분석과 유스케이스\"의 「02. 유스케이스」의 「흐름」·「01. 세션 목표」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  assert.deepEqual(checkReferences(p, body).errors, []);
});
