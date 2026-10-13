#!/usr/bin/env node
// PreToolUse(Write|Edit) hook: 세션 원고를 건드리기 전에 작업 순서를 맥락에 넣는다.
//
// 지침(AGENTS.md 「작업 운영」, guides/session-authoring-guide.md 「검토 절차」)은 파일을 열어야만
// 보인다. 열지 않고 기존 원고를 눈으로 흉내 내다 형식·인용·출처가 틀어진 일이 있어, 원고를 쓰는
// 순간에 순서를 다시 들이민다. 막지는 않는다 — 읽었는지는 기계가 알 수 없다.
"use strict";

const TARGET = /courses\/[^/]+\/sessions\/s\d\d[^/]*\.md$/;

const CHECKLIST = [
  "세션 원고를 수정한다. 작업 순서(AGENTS.md 「작업 운영」)를 확인한다.",
  "",
  "1. 지침을 읽었는가 — guides/session-authoring-guide.md(원고 형식·실습·별첨·인용)와 guides/production-guide.md(자동 검사). 기존 원고를 눈으로 흉내 내는 것으로 대신하지 않는다.",
  "2. 인용을 원문으로 확인했는가 — node tools/verify-quote.js <원전> \"<영문 인용>\". 검색 요약·기억으로 출처를 적지 않는다.",
  "3. 구성안을 승인받았는가 — 새 세션이나 큰 보완은 인용 → 구성안 → 원고 순서다.",
  "4. 원고는 파일에 쓴다 — 전문을 채팅에 늘어놓거나 조각내어 매번 계속할지 묻지 않는다.",
  "5. 끝에 렌더링한다 — node engine/production/src/cli.js <원고>. 완료 기준은 오류 0 · 경고 0이다.",
].join("\n");

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
  if (!TARGET.test(file)) process.exit(0);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: CHECKLIST },
      suppressOutput: true,
    })
  );
});
