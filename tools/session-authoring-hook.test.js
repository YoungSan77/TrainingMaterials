"use strict";
// PreToolUse(Write|Edit) 안내 훅의 회귀 검사. 훅을 그대로 실행하되 stdin·stdout·exit를 가짜로 주어
// 실제 기록을 건드리지 않는다(TM_HOOK_TEST=1). 발화 조건과 세 가지 출력(침묵·계약·진단)을 고정한다.
// 훅이 저장소의 실제 경로를 보므로 고정 입력은 실재하는 과정 폴더를 쓴다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "session-authoring-hook.js"), "utf8");

// 훅을 한 번 돌리고 발화한 안내를 돌려준다. 발화하지 않으면 null이다.
function run(raw) {
  const handlers = {};
  const exit = {};
  let stdout = "";
  vm.runInNewContext(source, {
    __dirname,
    // 훅은 경로의 존재만 본다 — fs·path 밖의 모듈은 읽지 않는다.
    require: (name) =>
      name === "fs" ? fs : name === "path" ? path : assert.fail("훅이 읽지 않을 모듈: " + name),
    process: {
      env: { TM_HOOK_TEST: "1" },
      stdin: { on: (name, fn) => { handlers[name] = fn; } },
      stdout: { write: (s) => { stdout += s; } },
      exit: () => { throw exit; },
    },
  });
  handlers.data(raw);
  try { handlers.end(); } catch (error) { if (error !== exit) throw error; }
  if (!stdout) return null;
  const decision = JSON.parse(stdout);
  assert.equal(decision.hookSpecificOutput.hookEventName, "PreToolUse");
  assert.equal(decision.suppressOutput, true);
  return decision.hookSpecificOutput.additionalContext;
}

function edit(file_path) {
  return run(JSON.stringify({ tool_name: "Edit", tool_input: { file_path } }));
}

test("세션 원고 경로에서만 발화한다 — 다른 경로와 고장난 입력은 침묵한다", () => {
  assert.ok(edit("courses/ai-native/sessions/s13.md"));
  assert.ok(edit("/Users/x/dev/TrainingMaterials/courses/ai-native/sessions/s13.md"));
  for (const quiet of [
    "courses/ai-native/curriculum.md",
    "courses/ai-native/course-design.md",
    "courses/ai-native/sessions/s05.pptx",
    "courses/ai-native/sessions/references.md",
    "courses/ai-native/sessions/s5.md",
    "courses/ai-native/sessions/code/s05/Order.java",
    "guides/governance.md",
    "",
  ]) {
    assert.equal(edit(quiet), null, quiet);
  }
  assert.equal(run(""), null);
  assert.equal(run("not json"), null);
  assert.equal(run("{}"), null);
  assert.equal(run(JSON.stringify({ tool_input: {} })), null);
});

// 실제 저장소의 원고로 확인한다 — 어느 원고가 있는지는 과정의 진행에 따라 바뀌므로 지금 있는
// 것을 찾아 쓴다. 특정 파일 이름을 적어 두면 그 원고가 옮겨지는 날 검사가 깨진다(2026-11-27).
test("이미 있는 원고를 고치는 중에는 침묵한다 — 같은 안내를 Edit마다 되풀이하지 않는다", () => {
  const dir = "courses/ai-native/sessions";
  const existing = fs.readdirSync(dir).filter((f) => /^s\d\d\.md$/.test(f)).map((f) => dir + "/" + f);
  assert.ok(existing.length, "현행 세션 원고가 하나는 있어야 이 검사가 뜻이 있다");
  for (const manuscript of existing) assert.equal(edit(manuscript), null, manuscript);
});

test("아직 없는 원고를 쓰기 시작할 때만 계약을 낸다", () => {
  const start = edit("courses/ai-native/sessions/s13.md");
  assert.match(start, /^Session Authoring 시작 — 계약\n/);
  assert.match(start, /승인 Course Design을 확인한다 — courses\/ai-native\/course-design\.md/);
  assert.match(start, /승인 Session Architecture를 확인한다 — courses\/ai-native\/curriculum\.md의 s13/);
  assert.match(start, /구성안을 먼저 만든다/);
  assert.match(start, /구성안을 별도 파일로 만들지 않는다/);
  assert.match(start, /guides\/session-authoring-guide\.md/);
  assert.match(start, /node tools\/verify-quote\.js/);
  assert.match(start, /cli\.js --check <원고>.*오류 0 · 경고 0/);
  assert.match(start, /원고는 파일에 쓴다/);
  assert.match(start, /묻지 않고 수행한 뒤 보고한다/);
  // 별도 Session DD 단계는 없다 — 계약이 DD 산출물을 입력으로 요구하지 않는다.
  assert.doesNotMatch(start, /detailed-design/);
  assert.doesNotMatch(start, /Session DD/);
});

test("승인 입력이 없으면 계약 대신 진단을 낸다", () => {
  // courses/ddd에는 course-design.md만 있고 curriculum.md가 없다.
  const miss = edit("courses/ddd/sessions/s01.md");
  assert.match(miss, /^Session Authoring 입력 진단/);
  assert.match(miss, /승인 Session Architecture가 없다 — courses\/ddd\/curriculum\.md/);
  assert.doesNotMatch(miss, /승인 Course Design이 없다/);
  assert.doesNotMatch(miss, /ai-native/);
  assert.match(miss, /해당 변경을 보류하고 필요한 판단을 보고한다/);
  // 진단일 때는 계약을 함께 내지 않는다.
  assert.doesNotMatch(miss, /Session Authoring 시작 — 계약/);
});

test("별도 Session DD 정본 경로는 계약 위반으로 진단한다", () => {
  for (const dd of [
    "courses/ai-native/sessions/s05-detailed-design.md",
    "courses/ai-native/sessions/s05-detailed-design-v2.md",
  ]) {
    const text = edit(dd);
    assert.match(text, /^Session Authoring 입력 진단/, dd);
    assert.match(text, /별도 Session DD 정본을 두지 않는다/, dd);
    assert.match(text, /원고는 courses\/ai-native\/sessions\/s05\.md에 쓴다/, dd);
  }
});

test("안내는 승인을 판정하거나 대신하지 않는다", () => {
  for (const file of [
    "courses/ai-native/sessions/s13.md",
    "courses/ddd/sessions/s01.md",
    "courses/ai-native/sessions/s05-detailed-design.md",
  ]) {
    const text = edit(file);
    // 기존 훅처럼 막지 않는다 — permissionDecision이나 block을 내지 않는다.
    assert.doesNotMatch(text, /permissionDecision|deny|block/, file);
  }
});
