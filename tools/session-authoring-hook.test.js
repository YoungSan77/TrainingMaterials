"use strict";
// PreToolUse(Write|Edit) 안내 훅의 회귀 검사. 훅을 그대로 실행하되 stdin·stdout·exit를 가짜로 주어
// 실제 기록을 건드리지 않는다(TM_HOOK_TEST=1). 발화 조건과 단계별 승인 입력의 구분을 고정한다.
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
    require: (name) => assert.fail("안내 훅은 모듈을 읽지 않는다: " + name),
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

test("세션 원고에서만 발화한다 — 다른 경로와 고장난 입력은 침묵한다", () => {
  assert.ok(edit("courses/ai-native/sessions/s05.md"));
  assert.ok(edit("courses/ooad/sessions/s01.md"));
  assert.ok(edit("/Users/x/dev/TrainingMaterials/courses/ai-native/sessions/s12.md"));
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

test("Session DD 작성은 승인 Course Design과 Session Architecture를 입력으로 안내한다", () => {
  const dd = edit("courses/ai-native/sessions/s05-detailed-design.md");
  assert.match(dd, /^Session DD 편집 안내\n/);
  assert.match(dd, /승인 Course Design을 확인한다 — courses\/ai-native\/course-design\.md/);
  assert.match(dd, /승인 Session Architecture를 확인한다 — courses\/ai-native\/curriculum\.md/);
  assert.match(dd, /guides\/curriculum-dd-guide\.md/);
  assert.match(dd, /Human에게 DD 승인을 받는다/);
  // DD 단계는 Deck의 입력(승인 DD·통합 승인 Curriculum)과 제작 검사를 요구하지 않는다.
  assert.doesNotMatch(dd, /통합 승인 Curriculum을 확인한다/);
  assert.doesNotMatch(dd, /session-authoring-guide\.md/);
  assert.doesNotMatch(dd, /cli\.js --check/);
  // 접미사가 더 붙은 DD 변형도 DD 단계로 안내한다.
  assert.match(edit("courses/ai-native/sessions/s05-detailed-design-v2.md"), /^Session DD 편집 안내\n/);
});

test("Deck 저작은 대상 DD와 통합 승인 Curriculum을 입력으로 안내하고 DD가 없으면 보류한다", () => {
  const deck = edit("courses/ai-native/sessions/s05.md");
  assert.match(deck, /^Deck Authoring 편집 안내\n/);
  assert.match(deck, /대상 Session DD와 승인 근거를 확인한다 — 기본 경로 courses\/ai-native\/sessions\/s05-detailed-design\.md/);
  assert.match(deck, /통합 승인 Curriculum을 확인한다 — courses\/ai-native\/curriculum\.md/);
  assert.match(deck, /대상 DD가 아직 없거나 승인 근거가 부족하면 Deck 저작을 보류하고 필요한 입력을 보고한다/);
  assert.match(deck, /DD 작성은 승인 Course Design과 Session Architecture를 입력으로 하는 별도 단계다/);
  assert.match(deck, /guides\/session-authoring-guide\.md와 guides\/production-guide\.md/);
  assert.match(deck, /node tools\/verify-quote\.js/);
  assert.match(deck, /cli\.js --check <원고>.*오류 0 · 경고 0/);
});

test("안내는 과정 경로를 그대로 쓰고 다른 과정을 가리키지 않는다", () => {
  const ooad = edit("courses/ooad/sessions/s03.md");
  assert.match(ooad, /courses\/ooad\/sessions\/s03-detailed-design\.md/);
  assert.match(ooad, /courses\/ooad\/checks\//);
  assert.doesNotMatch(ooad, /ai-native/);
});

test("안내는 승인을 판정하거나 대신하지 않는다", () => {
  for (const file of ["courses/ai-native/sessions/s05.md", "courses/ai-native/sessions/s05-detailed-design.md"]) {
    const text = edit(file);
    // 기존 훅처럼 막지 않는다 — permissionDecision이나 block을 내지 않는다.
    assert.doesNotMatch(text, /permissionDecision|deny|block/);
    assert.match(text, /Human 승인 근거·대상 버전\(커밋 또는 SHA-256\)·변경 허용 범위를 대조한다/);
    assert.match(text, /원고는 파일에 쓴다/);
  }
});
