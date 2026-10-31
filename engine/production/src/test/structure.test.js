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
  const bad = parse('## 09. 실습 3 — 수용 기준\n\n만드십시오.\n\n- **투입물**\n  + 작업 명세서\n- **평가 기준**\n  + 좋은가?\n');
  const w = practiceShape(bad.sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /프롬프트·점검 항목 또는 진행 방법·결과물·결과물의 파일 이름이\(가\) 없다/);
  const good = parse('## 09. 실습 3 — 수용 기준\n\n만드십시오.\n\n- **투입물**\n  + 작업 명세서\n- **프롬프트**\n  + "써줘"\n- **점검 항목**\n  1. **대표 예** — 있는가?\n- **결과물**\n  + `수용기준.md` — 실습 4의 투입물이다\n');
  assert.deepEqual(practiceShape(good.sections), []);
});

test("a sentence that describes the slide's own table is reported; one that states the content is not", () => {
  const { slideTalk } = require("../structure");
  const { parse } = require("../parse");
  const bad = parse([
    "## 02. 가드레일이란?",
    "",
    "표는 넷이 지키는 쪽·작동 시점에서 어떻게 다른지를 나란히 둔 것이다.",
    "",
    "- 표의 오른쪽 열이 각 수단의 한계다.",
    "- 지금까지 넷이 나왔다. 셋째 줄이 이 세션이다.",
    "",
  ].join("\n"));
  const w = slideTalk(bad.sections);
  assert.equal(w.length, 3);
  assert.match(w[0], /무엇으로 만들었는지/);
  assert.match(w[1], /열·행 위치/);
  const good = parse([
    "## 02. 가드레일이란?",
    "",
    "사람에게는 지키면 되는 규칙이지만, 에이전트에게는 **지켜질 확률**이다.",
    "",
    "**표 — 어긋난 실행을 막는 네 수단**",
    "",
    "| 수단 | 한계 |",
    "|---|---|",
    "| **가드레일** | 기계가 판정할 수 있는 규칙만 담는다 |",
    "",
    "- 위가 도메인 모델, 아래가 물리 모델이다.",
    "",
  ].join("\n"));
  assert.deepEqual(slideTalk(good.sections), []);
});

test("a lead that counts is checked against the one table under it", () => {
  const { countsMatchTable } = require("../structure");
  const { parse } = require("../parse");
  const table = ["", "| 위험 | 등급 |", "|---|---|", "| **a** | 높음 |", "| **b** | 높음 |", "| **c** | 중간 |", ""];
  const bad = parse(["## 03. 위험", "", "막을 위험은 **다섯**이다.", ...table].join("\n"));
  const w = countsMatchTable(bad.sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /다섯=5 ↔ 3행/);
  const good = parse(["## 03. 위험", "", "막을 위험은 **셋**이다.", ...table].join("\n"));
  assert.deepEqual(countsMatchTable(good.sections), []);
  // 세는 말이 아닌 쓰임("세 능력을 끊는 자리")은 보지 않는다.
  const other = parse(["## 03. 위험", "", "끊는 자리는 능력마다 다르다.", ...table].join("\n"));
  assert.deepEqual(countsMatchTable(other.sections), []);
});


// 실습은 사슬이므로 투입물은 프롬프트 문장 안이 아니라 제 항목으로 있어야 한다. 앞 실습이 없는
// 첫 실습(`실습 1`)만 예외다(session-authoring-guide.md 「사례·가정·실습」).
test("the first practice needs no 투입물; a later one does", () => {
  const { practiceShape } = require("../structure");
  const { parse } = require("../parse");
  const first = parse("## 01. 실습 1 — 질문\n\n**프롬프트 — 요청사항 포함**\n+ 첫 요청에서 정할 업무 조건을 제시해라.\n\n**점검 항목**\n1. **미결** — 임의로 정했는가?\n\n**결과물**\n+ `질문.md` — 실습 2의 투입물이다\n");
  assert.deepEqual(practiceShape(first.sections), []);
  const later = parse("## 01. 실습 2 — 질문\n\n**프롬프트 — 요청사항 포함**\n+ 앞 실습의 조건으로 질문을 제시해라.\n\n**점검 항목**\n1. **미결** — 임의로 정했는가?\n\n**결과물**\n+ `질문.md` — 실습 3의 투입물이다\n");
  const w = practiceShape(later.sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /투입물이\(가\) 없다/);
});

// 다음 실습이 이름으로 가리키므로 결과물은 파일 이름을 밝힌다.
test("결과물 without a file name is reported", () => {
  const { practiceShape } = require("../structure");
  const { parse } = require("../parse");
  const { sections } = parse("## 01. 실습 1 — 질문\n\n**프롬프트 — 요청사항 포함**\n+ 조건을 제시해라.\n\n**점검 항목**\n1. **미결** — 임의로 정했는가?\n\n**결과물**\n+ 질문 문서\n");
  const w = practiceShape(sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /결과물의 파일 이름이\(가\) 없다/);
});


test("a focused prompt practice may provide 진행 방법 instead of a hidden checklist", () => {
  const { practiceShape } = require("../structure");
  const { parse } = require("../parse");
  const { sections } = parse("## 01. 실습 1 — 질문\n\n**프롬프트 — 요청사항 포함**\n+ 첫 신청에 필요한 질문만 제시해라.\n\n**진행 방법**\n+ 답을 읽고 두 번째 프롬프트로 파일을 받아라.\n\n**결과물**\n+ `질문.md` — 실습 2의 투입물이다\n");
  assert.deepEqual(practiceShape(sections), []);
});

// 수는 숫자로 적는다 — "세 가지"가 아니라 "3가지". '하나'의 관형어와 횟수의 '번'은 한글로 둔다.
test("a spelled-out count is reported; 한 번·두 번 and 한 줄 are not", () => {
  const { spelledNumbers } = require("../structure");
  const { parse } = require("../parse");
  const bad = parse("## 01. 예\n\n검사 세 가지를 붙이고 다섯 단계로 나눈다.\n");
  const w = spelledNumbers(bad.sections);
  assert.equal(w.length, 2);
  assert.match(w[0], /세 가지/);
  assert.match(w[1], /다섯 단계/);
  const good = parse("## 01. 예\n\n검사 3가지를 붙인다. 한 줄로 적고 두 번 돌린다.\n");
  assert.deepEqual(spelledNumbers(good.sections), []);
  // 코드와 도식 원본은 보지 않는다.
  const code = parse("## 01. 예\n\n```java\n// 세 가지를 확인한다\n```\n");
  assert.deepEqual(spelledNumbers(code.sections), []);
});

// 세션마다 요약의 강사 노트가 그 세션이 모델에 더한 것을 한 줄로 밝힌다(없으면 "없다"로 밝힌다).
test("a summary note without the model-update line is reported", () => {
  const { missingModelUpdate } = require("../structure");
  const { parse } = require("../parse");
  const without = parse("## 12. 요약\n\n### 세션 핵심\n\n- 한 줄\n\n**강사 노트**\n\n- 다음 세션으로 넘긴다.\n");
  const w = missingModelUpdate(without.sections);
  assert.equal(w.length, 1);
  assert.match(w[0], /모델에서 보완된 것/);
  const with_ = parse("## 12. 요약\n\n### 세션 핵심\n\n- 한 줄\n\n**강사 노트**\n\n- 모델에서 보완된 것 — 없다.\n");
  assert.deepEqual(missingModelUpdate(with_.sections), []);
  // 요약이 없는 원고(별첨)는 보지 않는다.
  assert.deepEqual(missingModelUpdate(parse("## 참고 자료\n\n본문.\n").sections), []);
});

test("verbatim LLM appendix preserves plain response text without requiring editorial emphasis", () => {
  const { unboldedText } = require("../structure");
  const text = "사람이 결정하지 않은 추가 정책을 저자가 편집하여 원문에 넣지 않는다.";
  const { sections } = parse(`## 별첨. 실습 답\n\n## 실제 답\n\n**실제 LLM 응답**\n\n- ${text}\n\n## 일반 설명\n\n- ${text}\n`);
  assert.equal(sections[1].verbatimResponse, true);
  assert.equal(sections[1].blocks[0].text, text);
  const warnings = unboldedText(sections);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /일반 설명/);
  assert.throws(() => parse("## 01. 일반 본문\n\n**실제 LLM 응답**\n"), /별첨/);
});

// 시연 topic의 "**기록 그대로**"도 같은 뜻이다 — 별첨이 아니어도 핵심어 강조 검사에서 뺀다.
test("기록 그대로 표식은 본문 topic에서도 강조 검사를 면제한다", () => {
  const { unboldedText } = require("../structure");
  const text = "다음 요청과 회의 메모로 주문 시스템의 요구사항 정의서 초안을 써줘. 모르는 것은 질문으로 남겨줘.";
  const { sections } = parse(`## 01. 시연\n\n**기록 그대로**\n\n- ${text}\n`);
  const topic = sections[0];
  assert.equal(topic.verbatimResponse, true);
  assert.equal(topic.blocks[0].text, text, "표식 줄은 본문에 남지 않는다");
  assert.equal(unboldedText([topic]).length, 0, "기록은 강조 검사에서 빠진다");
  assert.ok(unboldedText([{ ...topic, verbatimResponse: false }]).length > 0, "표식이 없으면 경고한다");
  // 수 표기도 같다 — 기록의 "두 곳"을 "2곳"으로 고치는 것이 곧 기록을 고치는 일이다.
  const { spelledNumbers } = require("../structure");
  const spelled = parse("## 01. 시연\n\n**기록 그대로**\n\n- 이 두 곳에 없는 내용은 정하지 않았습니다.\n").sections[0];
  assert.deepEqual(spelledNumbers([spelled]), []);
  assert.ok(spelledNumbers([{ ...spelled, verbatimResponse: false }]).length > 0);
});
