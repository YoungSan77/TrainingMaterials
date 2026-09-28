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
