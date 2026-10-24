#!/usr/bin/env node
// PreToolUse(Write|Edit|Bash) hook: 지금 작업하는 과정이 아닌 과정의 파일을 고치는 것을 막는다.
//
// 2026-10-24: "S06 시작"이라는 지시를 다른 과정의 진행 기록으로 추정해, ai-native를 작업해야 할
// 세션에서 ooad의 원고·과정 설계 27개 파일을 고친 일이 있었다. 사람이 알아차릴 때까지 한 세션이
// 통째로 엉뚱한 과정에 쓰였다. 그래서 기계로 막는다.
//
// 기준은 `courses/ACTIVE` 한 줄이다. 그 과정이 아닌 `courses/<다른 과정>/` 아래를 **쓰려고 하면**
// 거절한다. 읽기는 막지 않는다 — 다른 과정을 참고하는 것은 정상이다.
//
// 과정을 바꾸려면 `courses/ACTIVE`를 고친다. 그 파일은 **사용자의 지시로만** 바꾼다
// (AGENTS.md 「작업 운영」).
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.env.CLAUDE_PROJECT_DIR || ".";

function activeCourse() {
  try {
    return fs.readFileSync(path.join(root, "courses/ACTIVE"), "utf8").trim();
  } catch {
    return "";
  }
}

// 파일을 바꾸는 낌새. 읽기 전용 명령(cat·sed -n·grep·ls·find·head·wc·--check)은 통과시킨다.
const WRITE_HINT =
  /(^|[^<>])>{1,2}[^>]|\brm\b|\bmv\b|\bcp\b|\bmkdir\b|\btee\b|\btouch\b|\bsed\b[^|]*-i|\bgit\s+(checkout|restore|apply|rm|mv)\b|open\([^)]*['"]w|writeFileSync|\.write\(/;

function offendingCourse(text, active) {
  const re = /courses\/([A-Za-z0-9._-]+)\//g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== active && m[1] !== "ACTIVE") return m[1];
  }
  return "";
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
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

  const active = activeCourse();
  if (!active) process.exit(0); // 표식이 없으면 막지 않는다

  const tool = input.tool_name || "";
  const ti = input.tool_input || {};

  let target = "";
  if (tool === "Write" || tool === "Edit") {
    target = offendingCourse(ti.file_path || "", active);
  } else if (tool === "Bash") {
    const cmd = ti.command || "";
    if (WRITE_HINT.test(cmd)) target = offendingCourse(cmd, active);
  }
  if (!target) process.exit(0);

  deny(
    [
      `지금 작업하는 과정은 "${active}"인데 "${target}" 과정의 파일을 고치려 한다.`,
      "",
      "다른 과정을 고쳐야 하는 일이라면, 사용자에게 어느 과정인지 확인받고",
      "`courses/ACTIVE`를 그 과정으로 바꾼 뒤에 한다. 읽기는 막지 않는다.",
      "",
      "세션 번호만 있는 지시(\"S06 시작\")는 과정을 확정한 뒤에 시작한다 —",
      "근거는 `courses/ACTIVE`와 그 과정의 `checks/` 진행 파일이다(AGENTS.md 「작업 운영」).",
    ].join("\n")
  );
});
