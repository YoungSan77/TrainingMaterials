"use strict";
// session-authoring-guide.md 「사례·가정·실습」: 실습이 있는 세션에는 그 답이 요약 뒤 별첨에 있다.
// 여러 세션을 모으다 별첨만 빠지면 렌더는 깨끗한데 답이 없는 교재가 된다(2026-11-03).
const test = require("node:test");
const assert = require("node:assert/strict");
const { parse } = require("../parse");
const { missingPracticeAnswer } = require("../structure");

const head = [
  "--------------------",
  "Session 명: 04. 모델",
  "--------------------",
  "",
  "## 목차",
  "",
  "01. 세션 목표",
  "02. 실습 4 — 정적 모델",
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
  "## 02. 실습 4 — 정적 모델",
  "",
  "②~④에 **질문의 답**을 적는다.",
  "",
  "**투입물**",
  "  + 실습 3의 **요구사항 정의서**",
  "",
  "**프롬프트**",
  "  + ① \"정적 구조를 제안해라.\"",
  "",
  "**점검 항목**",
  "  1. **근거** — 요구에 없는 개념을 확정했는가?",
  "",
  "**결과물**",
  "  + `주문한다-정적모델.md` — 실습 5의 투입물이다",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
  "## 03. 요약",
  "",
  "### 세션 핵심",
  "",
  "- **핵심** 한 줄.",
  "",
  "### 다음 세션",
  "",
  "\"세션 05. 동적 모델\"이 잇는다.",
  "",
  "**강사 노트**",
  "",
  "- 노트.",
  "",
];

const appendix = [
  "",
  "## 별첨. 실습 답",
  "",
  "## 주문한다 정적 업무 모델",
  "",
  "**실제 LLM 응답**",
  "",
  "**문서 형식 — 10pt**",
  "",
  "주문과 주문 항목의 관계를 적는다.",
  "",
  "**강사 노트**",
  "",
  "- 실제 응답이다.",
  "",
];

test("실습만 있고 별첨이 없으면 경고한다", () => {
  const { sections } = parse(head.join("\n"));
  const w = missingPracticeAnswer(sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /실습 4/);
  assert.match(w[0], /별첨\. 실습 답/);
});

test("별첨이 있으면 경고하지 않는다", () => {
  const { sections } = parse(head.concat(appendix).join("\n"));
  assert.deepEqual(missingPracticeAnswer(sections), []);
});

test("실습이 없는 세션은 검사하지 않는다", () => {
  const md = [
    "--------------------",
    "Session 명: 04. 모델",
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
    "### 세션 핵심",
    "",
    "- **핵심** 한 줄.",
    "",
    "### 다음 세션",
    "",
    "\"세션 05. 동적 모델\"이 잇는다.",
    "",
    "**강사 노트**",
    "",
    "- 노트.",
    "",
  ].join("\n");
  const { sections } = parse(md);
  assert.ok(!sections.some((s) => /실습/.test(s.title)), "실습 topic이 없다");
  assert.deepEqual(missingPracticeAnswer(sections), []);
});
