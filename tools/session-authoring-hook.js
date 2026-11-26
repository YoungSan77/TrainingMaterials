#!/usr/bin/env node
// PreToolUse(Write|Edit): 세션 원고 작업의 계약을 **시작할 때 한 번** 제시하고, 승인 입력이 없거나
// 계약을 어기는 경로일 때만 진단을 낸다. 이미 있는 원고를 고치는 중에는 침묵한다 — 같은 안내를
// Edit마다 되풀이하면 결정은 늘지 않고 맥락만 찬다.
// 발화는 편집 권한이나 승인 상태를 판정하지 않는다.
"use strict";

const fs = require("fs");
const path = require("path");

const TARGET = /(courses\/[^/]+)\/sessions\/(s\d\d)([^/]*)\.md$/;
const ROOT = path.join(__dirname, "..");
const has = (rel) => fs.existsSync(path.join(ROOT, rel));

// 기존 훅의 안내 항목을 유지한다.
const WRITING = "원고는 파일에 쓴다 — 전문을 채팅에 늘어놓거나 조각내어 매번 계속할지 묻지 않는다.";
const HOLD =
  "승인 입력이나 근거가 부족하거나 허용 범위와 충돌하면 해당 변경을 보류하고 필요한 판단을 보고한다.";

// 계약을 어기는 경로와 없는 승인 입력. 하나라도 있으면 계약 대신 이것만 낸다.
function problems(course, session, suffix) {
  const found = [];
  if (!has(`${course}/course-design.md`))
    found.push(`- 승인 Course Design이 없다 — ${course}/course-design.md`);
  if (!has(`${course}/curriculum.md`))
    found.push(`- 승인 Session Architecture가 없다 — ${course}/curriculum.md`);
  if (/^-detailed-design/.test(suffix))
    found.push(
      `- **별도 Session DD 정본을 두지 않는다**(guides/governance.md 「단계와 정본」). 상세 설계는 Session Authoring의 구성안 검토로 하고, 원고는 ${course}/sessions/${session}.md에 쓴다.`
    );
  return found;
}

// 아직 없는 원고를 쓰기 시작할 때의 계약.
function contract(course, session) {
  return [
    "Session Authoring 시작 — 계약",
    `1. 승인 Course Design을 확인한다 — ${course}/course-design.md의 목적·범위·공통 전제와 지정 출처.`,
    `2. 승인 Session Architecture를 확인한다 — ${course}/curriculum.md의 ${session} 편성·시간·목표·Anchor Message.`,
    "3. **구성안을 먼저 만든다** — guides/session-authoring-guide.md 「12. 검토 절차와 완료 기준」의 1~4(판단 질문, 핵심 주장과 순서, 인용, 용어, 표현 구성, 실습 계약)를 채팅으로 Human에게 승인받는다. 구성안을 별도 파일로 만들지 않는다.",
    "4. 구성안 승인 뒤 원고를 쓴다 — 같은 지침과 guides/production-guide.md를 따르고, 인용은 node tools/verify-quote.js로 원문을 확인한다.",
    "5. node engine/production/src/cli.js --check <원고>로 사전 검사한다(오류 0 · 경고 0). 검사 통과와 Human의 원고 승인을 구분한다.",
    WRITING,
    "승인 범위 안의 작성·수정·검사·오류 수정은 묻지 않고 수행한 뒤 보고한다(guides/governance.md 「책임과 승인」).",
  ].join("\n");
}

// 낼 것이 없으면 null — 훅은 침묵한다.
function guidance(course, session, suffix) {
  const found = problems(course, session, suffix);
  if (found.length)
    return ["Session Authoring 입력 진단 — 아래를 해결하기 전에는 원고를 쓰지 않는다."]
      .concat(found, [HOLD])
      .join("\n");
  if (!has(`${course}/sessions/${session}${suffix}.md`)) return contract(course, session);
  return null;
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
  const text = guidance(course, session, suffix);
  if (!text) process.exit(0);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: text },
      suppressOutput: true,
    })
  );
});
