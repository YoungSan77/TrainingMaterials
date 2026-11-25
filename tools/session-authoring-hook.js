#!/usr/bin/env node
// PreToolUse(Write|Edit): 편집 대상의 제작 단계와 확인할 승인 입력을 안내한다.
// 발화는 편집 권한이나 승인 상태를 판정하지 않는다.
"use strict";

const TARGET = /(courses\/[^/]+)\/sessions\/(s\d\d)([^/]*)\.md$/;

// 두 단계에 공통인 작업 방식. 기존 훅의 안내 항목을 유지한다.
const WRITING = "원고는 파일에 쓴다 — 전문을 채팅에 늘어놓거나 조각내어 매번 계속할지 묻지 않는다.";

function guidance(course, session, suffix) {
  // DD는 Governance의 `sNN-detailed-design.md`가 기본 경로다. 접미사가 더 붙은 변형(개정본·분할본)도
  // DD 단계이므로 Deck 안내로 떨어지지 않게 접두로 판정한다.
  const isDD = suffix === "-detailed-design" || suffix.startsWith("-detailed-design-");
  const dd = `${course}/sessions/${session}-detailed-design.md`;
  const curriculum = `${course}/curriculum.md`;
  const common = [
    isDD ? "Session DD 편집 안내" : "Deck Authoring 편집 안내",
    `AGENTS.md와 guides/governance.md를 읽고 ${course}/checks/ 등 기존 기록에서 Human 승인 근거·대상 버전(커밋 또는 SHA-256)·변경 허용 범위를 대조한다.`,
    `1. 승인 Course Design을 확인한다 — ${course}/course-design.md.`,
    `2. 승인 Session Architecture를 확인한다 — ${curriculum}의 해당 세션 편성과 승인 범위.`,
  ];
  if (isDD) {
    return common.concat([
      `3. guides/curriculum-dd-guide.md에 따라 ${dd}의 판단 질문·교수 흐름·실습 계약을 작성하거나 보완하고 Human에게 DD 승인을 받는다.`,
      "4. 해당 DD 승인 뒤 다음 DD로 진행한다. DD를 연결한 통합 Curriculum이 Human 승인을 받으면 Deck Authoring에 넘긴다.",
      WRITING,
      "승인 입력이나 근거가 부족하거나 허용 범위와 충돌하면 해당 변경을 보류하고 필요한 판단을 보고한다.",
    ]).join("\n");
  }
  return common.concat([
    `3. 대상 Session DD와 승인 근거를 확인한다 — 기본 경로 ${dd}. 과정 기록에 별도 경로가 있으면 그 승인본을 대조한다.`,
    `4. 통합 승인 Curriculum을 확인한다 — ${curriculum}의 편성 승인과 DD를 연결한 통합 승인 범위를 구분한다.`,
    "5. 승인된 입력과 허용 범위 안에서 guides/session-authoring-guide.md와 guides/production-guide.md에 따라 Markdown Deck을 작성한다. 지침을 읽는 일을 기존 원고를 눈으로 흉내 내는 것으로 대신하지 않는다. 인용은 node tools/verify-quote.js로 원문을 확인한다.",
    WRITING,
    "대상 DD가 아직 없거나 승인 근거가 부족하면 Deck 저작을 보류하고 필요한 입력을 보고한다. DD 작성은 승인 Course Design과 Session Architecture를 입력으로 하는 별도 단계다.",
    "Deck은 node engine/production/src/cli.js --check <원고>로 사전 검사한다(오류 0 · 경고 0). 검사 결과와 Human의 Deck 버전 승인을 구분하고, 최종 제작은 승인 Deck을 입력으로 진행한다.",
  ]).join("\n");
}

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }
  const file = (input.tool_input && input.tool_input.file_path) || "";
  const target = TARGET.exec(file);
  if (!target) process.exit(0);
  const [, course, session, suffix] = target;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: guidance(course, session, suffix) },
      suppressOutput: true,
    })
  );
});
