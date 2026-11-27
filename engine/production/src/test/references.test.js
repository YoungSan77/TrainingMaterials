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
  assert.deepEqual(checkReferences(p, body), { errors: [], warnings: [], notes: [] });
});

test("Curriculum supplies session names while sibling decks supply topic headings", () => {
  const root = course();
  const dir = path.join(root, "sessions");
  const p = path.join(dir, "s03.md");
  fs.writeFileSync(path.join(root, "curriculum.md"), [
    "| 세션 | 제목 |", "|---|---|", "| S02 | 요구사항 — 승인 제목 |", "| S03 | 정적 모델 |", "| S05 | 동적 관점 |",
  ].join("\n"));
  const body = 'Session 명: 03. 정적 모델\n\n## 01. 개념\n\n"세션 02. 요구사항 — 승인 제목"의 「02. 유스케이스」와 "세션 05. 동적 관점"을 본다.';
  assert.deepEqual(checkReferences(p, body), { errors: [], warnings: [], notes: [] });
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

// 인라인 코드는 경로·파일·폴더 이름이다. 배포 폴더 이름에 S01이 들어가도 세션 참조가 아니다 --
// 프로즈에 그대로 쓴 S0x는 그대로 오류다(2026-11-26).
test('인라인 코드 안의 S0x는 경로 이름이므로 세션 참조가 아니다',()=>{
 const root=course(),p=path.join(root,'sessions','s03.md');
 const head='## 01. 세션 목표\n\n**강사 노트**\n\n';
 assert.deepEqual(checkReferences(p,head+'- 배포 폴더는 `Downloads\\TrainingMaterials-S01`이다.\n').errors,[]);
 assert.deepEqual(checkReferences(p,head+'- 원본은 `code/s01/setup.sh`이고 `sessions/s01.md`가 가리킨다.\n').errors,[]);
 assert.ok(checkReferences(p,head+'- S01의 내용을 본다.\n').errors.some(e=>/S0x/.test(e)),'프로즈의 S0x는 오류다');
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
  assert.deepEqual(checkReferences(p, add), { errors: [], warnings: [], notes: [] });
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

// `foo.md`의 「…」는 **그 문서의 항목**이다 — 세션의 topic 참조가 아니다. 지침·과정 문서의 이름을
// 코드에 적지 않고 형태로 가른다(2026-11-27).
test('백틱으로 감싼 문서 뒤의 겹낫표는 그 문서의 항목이다', () => {
  const root = course(), p = path.join(root, 'sessions', 's03.md');
  const head = '--------------------\nSession 명: 03. 정적 모델\n--------------------\n\n## 목차\n\n01. 세션 목표\n\n## 01. 세션 목표\n\n';
  for (const line of [
    '주제별 지정은 `course-design.md`의 「12. 기준 원전과 참고 자료」가 소유한다.',
    '확인하지 못한 것은 `../course-design.md` 「12. 원전 적용 결정」에 적었다.',
    '제작 지침의 「S03 제작 기준」을 적용한다.',
  ]) assert.deepEqual(checkReferences(p, head + line + '\n').errors, [], line);
  // 문서 이름이 없으면 그대로 세션의 topic 참조로 읽는다.
  assert.ok(checkReferences(p, head + '「12. 기준 원전과 참고 자료」를 본다.\n').errors.some(e => /주제 참조/.test(e)));
});

// 별첨은 **현행 세션**이 쓰는 레이블을 담는다. 편성이 바뀌기 전의 원고는 대조 대상이 아니며, 그
// 사실은 경고가 아니라 미검사로 적는다 — 고칠 수 없는 경고는 완료 기준을 막는다(2026-11-27).
test('별첨의 레이블 대조는 Curriculum과 세션명이 다른 원고를 빼고 미검사로 적는다', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tm-appendix-'));
  fs.mkdirSync(path.join(root, 'sessions'));
  fs.writeFileSync(path.join(root, 'curriculum.md'),
    '## 세션 목록\n\n| 세션 | 제목 |\n|---|---|\n| S01 | 개요 |\n| S02 | 요구사항 |\n');
  const session = (no, name, label) => ['--------------------', 'Session 명: ' + no + '. ' + name,
    '--------------------', '', '## 목차', '', '01. 세션 목표', '', '## 01. 세션 목표', '',
    '확인한 **기준**을 따른다, "Verified.", [' + label + ']', ''].join('\n');
  fs.writeFileSync(path.join(root, 'sessions', 's01.md'), session('01', '개요', 'Current 2026'));
  // 편성이 바뀌기 전의 원고 — 세션명이 Curriculum과 다르다.
  fs.writeFileSync(path.join(root, 'sessions', 's02.md'), session('02', '옛 제목', 'Retired 2020'));
  const appendix = path.join(root, 'sessions', 'references.md');
  const list = '--------------------\nSession 명: 별첨. 참고 자료\n--------------------\n\n## 참고 자료\n\n'
    + '1. **[Current 2026]**  현행 자료, 2026\n';
  fs.writeFileSync(appendix, list);
  const result = checkReferences(appendix, list);
  assert.deepEqual(result.errors, [], '옛 원고의 레이블은 별첨에 요구하지 않는다');
  assert.ok(result.notes.some(n => /s02\.md/.test(n)), result.notes.join(' / '));
  // 원고가 없는 세션이 있으면 "아무도 쓰지 않는 레이블" 검사는 돌리지 않고 미검사로 적는다.
  assert.deepEqual(result.warnings, []);
  assert.ok(result.notes.some(n => /원고가 없는 세션\(02\)/.test(n)), result.notes.join(' / '));
});

test('과정의 세션 원고가 다 있으면 아무도 쓰지 않는 레이블을 경고한다', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tm-appendix-full-'));
  fs.mkdirSync(path.join(root, 'sessions'));
  fs.writeFileSync(path.join(root, 'curriculum.md'),
    '## 세션 목록\n\n| 세션 | 제목 |\n|---|---|\n| S01 | 개요 |\n');
  fs.writeFileSync(path.join(root, 'sessions', 's01.md'), ['--------------------', 'Session 명: 01. 개요',
    '--------------------', '', '## 목차', '', '01. 세션 목표', '', '## 01. 세션 목표', '',
    '확인한 **기준**을 따른다, "Verified.", [Current 2026]', ''].join('\n'));
  const appendix = path.join(root, 'sessions', 'references.md');
  const list = '--------------------\nSession 명: 별첨. 참고 자료\n--------------------\n\n## 참고 자료\n\n'
    + '1. **[Current 2026]**  현행 자료, 2026\n2. **[Unused 2026]**  아무도 쓰지 않는 자료, 2026\n'
    + '3. **[Reading 2026]**  읽을거리, 2026 (읽을거리)\n';
  fs.writeFileSync(appendix, list);
  const result = checkReferences(appendix, list);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 1, result.warnings.join(' / '));
  assert.match(result.warnings[0], /\[Unused 2026\]/);
});
