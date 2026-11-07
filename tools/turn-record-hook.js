#!/usr/bin/env node
// PostToolUse(Bash) hook: 턴 중에 무엇을 몇 번 돌렸는지 기록한다. 아무것도 막지 않는다.
//
// 비용을 재자던 목적에는 "바뀐 파일 수"만으로는 모자란다 — 같은 원고를 세 번 렌더링했는지,
// 한 번에 끝냈는지가 다시 만들기의 비용이다(`AGENTS.md`의 「작업 운영」). 명령이 끝난 뒤에
// 기록하므로 실제로 돈 횟수를 센다.
//
// 세는 것은 렌더링·검사·테스트 세 가지다. 기록은 `tools/turn-record.js`가 모으고 턴이 끝날 때
// Stop hook이 한 줄로 묶는다(`guides/agentic-repository-guide.md` 6절).
"use strict";

const { note } = require("./turn-record");

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }
  const cmd = (input.tool_input && input.tool_input.command) || "";
  if (typeof cmd !== "string" || !cmd) process.exit(0);

  if (/production\/src\/cli\.js|\bsrc\/cli\.js/.test(cmd)) {
    // 같은 명령이 --check면 검사이고, 아니면 덱을 만든 것이다.
    note(/--check\b/.test(cmd) ? "check" : "render", cmd.slice(0, 200));
  } else if (/node\s+--test\b/.test(cmd)) {
    note("test", cmd.slice(0, 200));
  }
  process.exit(0);
});
