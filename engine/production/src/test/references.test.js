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
    "## 01. 세션 목표", "", "「02. 개념」과 \"02. 요구 분석과 유스케이스\"의 「02. 유스케이스」를 본다.", "",
    "## 02. 개념", "", "\"02. 요구 분석과 유스케이스\"의 「01. 세션 목표」·「02. 유스케이스」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  assert.deepEqual(checkReferences(p, body), { errors: [], warnings: [] });
});

test("wrong numbers, topic titles quoted as sessions and S0x names are errors", () => {
  const root = course();
  const p = path.join(root, "sessions", "s03.md");
  const body = [
    "--------------------", "Session 명: 03. 정적 모델", "--------------------", "", "## 목차", "", "01. 세션 목표", "02. 개념", "",
    "## 01. 세션 목표", "", "「01. 개념」을 본다.", "", "\"02. 개념\"을 본다.", "", "S02에서 다뤘다.", "",
    "## 02. 개념", "", "\"02. 요구 분석과 유스케이스\"의 「03. 유스케이스」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  const { errors } = checkReferences(p, body);
  assert.equal(errors.length, 4);
  assert.match(errors[0], /「02\. 개념」로 고친다/);
  assert.match(errors[1], /주제 참조라면 「」/);
  assert.match(errors[2], /S0x/);
  assert.match(errors[3], /「03\. 유스케이스」/);
});

test("a continuation slide with only a line of text is reported as a warning", () => {
  const m = { pages: [
    { heading: "01. 주제 (1/2)", items: [{ kind: "body" }], textCost: 400 },
    { heading: "01. 주제 (2/2)", items: [{ kind: "body" }], textCost: 40 },
    { heading: "02. 표 (2/2)", items: [{ kind: "table" }], textCost: 0 },
  ] };
  const w = sparseContinuations(m);
  assert.equal(w.length, 1);
  assert.match(w[0], /슬라이드 2/);
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
    "## 01. 세션 목표", "", "뒤의 「02」와 \"02. 요구 분석과 유스케이스\"의 「02」를 본다.", "",
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
    "## 01. 세션 목표", "", "\"02. 요구 분석과 유스케이스\"의 「02. 유스케이스」의 「흐름」·「01. 세션 목표」.", "",
  ].join("\n");
  fs.writeFileSync(p, body);
  assert.deepEqual(checkReferences(p, body).errors, []);
});
