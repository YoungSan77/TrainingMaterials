"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { checkStructure } = require("../structure");

function setup(no, goals, summary) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-structure-"));
  fs.mkdirSync(path.join(root, "sessions"));
  fs.writeFileSync(path.join(root, "course-design.md"), "### S01 — 개요 (45분)\n\n### S02 — 요구 분석 (1시간)\n");
  const p = path.join(root, "sessions", "s" + no + ".md");
  const md = ["## 01. 세션 목표", "", ...goals.map((g) => "- " + g), "", "## 02. 요약", "", ...summary, ""].join("\n");
  fs.writeFileSync(p, md);
  return { p, sections: parse(md).sections };
}
const page = (title) => ({ heading: title });

test("goals over seven and a summary without the next session fail", () => {
  const { p, sections } = setup("01", ["a", "b", "c", "d", "e", "f", "g", "h"], ["### 핵심", "- x"]);
  const errors = checkStructure(p, "01. 개요", sections, [page("01. 세션 목표"), page("02. 요약")]);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /8개/);
  assert.match(errors[1], /다음 세션/);
});

test("goals and summary spilling to a second slide fail", () => {
  const { p, sections } = setup("01", ["a"], ["### 핵심", "- x", "### 다음 세션", "- y"]);
  const errors = checkStructure(p, "01. 개요", sections,
    [page("01. 세션 목표"), page("01. 세션 목표 (2/2)"), page("02. 요약"), page("02. 요약 (2/2)")]);
  assert.equal(errors.length, 2);
});

test("the course's last session needs no next session", () => {
  const { p, sections } = setup("02", ["a"], ["### 핵심", "- x"]);
  assert.deepEqual(checkStructure(p, "02. 요구 분석", sections, [page("01. 세션 목표"), page("02. 요약")]), []);
});

test("a topic without an instructor note is reported", () => {
  const { missingNotes } = require("../structure");
  const sections = [{ title: "01. 가", notes: [{ text: "노트" }] }, { title: "02. 나", notes: [] }];
  assert.deepEqual(missingNotes(sections), ['강사 노트가 없다: "02. 나"']);
});

test("a question title without a question mark is reported", () => {
  const { unmarkedQuestionTitles } = require("../structure");
  const sections = [{ title: "유저 스토리란" }, { title: "BDD란?" }, { title: "05. 무엇을 누가 쓰는가" }, { title: "스토리 나누기" }];
  assert.deepEqual(unmarkedQuestionTitles(sections), ['의문문 제목에 "?"가 없다: "유저 스토리란"', '의문문 제목에 "?"가 없다: "무엇을 누가 쓰는가"']);
});

test("a question table cell without a question mark is reported", () => {
  const { unmarkedQuestionTitles } = require("../structure");
  const sections = [{ title: "순서", blocks: [{ kind: "table", rows: [["판단", "**무엇인가**"], ["얼마나 남기는가?", "무엇을 넣는가"]] }] }];
  assert.deepEqual(unmarkedQuestionTitles(sections), ['의문문 표 칸에 "?"가 없다: "순서"의 "무엇인가"', '의문문 표 칸에 "?"가 없다: "순서"의 "무엇을 넣는가"']);
});

test("a deck outside a course needs no next session in its summary", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-structure-"));
  const p = path.join(root, "deck.md");
  const md = ["## 01. 세션 목표", "", "- a", "", "## 02. 요약", "", "### 핵심", "- x", ""].join("\n");
  fs.writeFileSync(p, md);
  assert.deepEqual(checkStructure(p, "01. 참조", parse(md).sections, [page("01. 세션 목표"), page("02. 요약")]), []);
});

test("a bullet that starts with a circled number is reported; a numbered list item is not", () => {
  const { numberedBullets } = require("../structure");
  const { parse } = require("../parse");
  const { sections } = parse("## 01. 예\n\n본문.\n\n- **① 승인** — 결제완료\n- **승인** — ①과 같다\n\n1. **가격 변경** — 2,000원\n\n- **프롬프트**\n  + ① \"초안을 써줘\"\n");
  const w = numberedBullets(sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /① 승인/);
});

test("a practice topic missing 프롬프트·점검 항목 is reported; the full shape is not", () => {
  const { practiceShape } = require("../structure");
  const { parse } = require("../parse");
  const bad = parse('## 09. 실습 — 수용 기준\n\n만드십시오.\n\n- **투입물**\n  + 작업 명세서\n- **평가 기준**\n  + 좋은가?\n');
  const w = practiceShape(bad.sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /프롬프트·점검 항목·결과물이\(가\) 없다/);
  const good = parse('## 09. 실습 — 수용 기준\n\n만드십시오.\n\n- **투입물**\n  + 작업 명세서\n- **프롬프트**\n  + "써줘"\n- **점검 항목**\n  1. **대표 예** — 있는가?\n- **결과물** — 수용 기준\n');
  assert.deepEqual(practiceShape(good.sections), []);
});
