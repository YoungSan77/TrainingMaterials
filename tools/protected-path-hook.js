#!/usr/bin/env node
// PreToolUse hook: 사용자의 자산을 환경이 거절한다.
//
// `AGENTS.md`에 글로 적힌 두 금지를 강제로 옮긴 것이다(`guides/agentic-repository-guide.md` 3절).
// 글로 적은 금지는 지켜질 확률이고, 스무 번 중 한 번 깨지는 것이 문제다 — 깨지면 사용자가
// 보관하는 원본이 비교 근거로 들어오거나 권한 설정이 LLM의 판단으로 바뀐다.
//
//   references/production/  — 접근 금지. 사용자가 참고로 보관하는 폴더(approved.pptx 원본)이며
//                             비교·복사·복원의 근거가 아니다. 읽기도 막는다.
//   .claude/settings.json   — 쓰기 금지. 권한과 hook을 바꾸는 권한은 사용자의 것이다.
//                             읽기는 막지 않는다 — 지금 무엇이 허용돼 있는지는 알아야 한다.
//
// 경로 같은 칸만 본다(file_path·path·notebook_path). 글 안에 그 경로가 **이름으로** 나오는 것은
// 막지 않는다 — 이 hook을 설명하는 지침 문서가 그 이름을 적어야 하기 때문이다. Bash는 명령 전체를
// 보므로, 경로를 글로만 다루는 일(문서에서 그 이름을 찾기)은 Grep 도구의 pattern으로 한다.
"use strict";

const { note } = require("./turn-record");
const { WRITE_HINT } = require("./hook-util");

const PROTECTED = [
  { path: "references/production", write: false, why: "사용자가 보관하는 원본이며 비교·복사·복원의 근거가 아니다. 읽기도 막는다" },
  { path: ".claude/settings.json", write: true, why: "권한과 hook은 사용자가 고친다. 필요한 줄은 보고한다. 읽기는 막지 않는다" },
];

function deny(rule, how) {
  // 환경이 막은 일은 턴 기록에 남긴다(`guides/agentic-repository-guide.md` 6절).
  note("deny", `${rule.path}을 ${how}`);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: [
          `\`${rule.path}\`을 ${how}. ${rule.why}.`,
          "",
          "환경이 거절했으므로 다른 방법으로 돌아가지 않는다. 이 경로의 내용이 필요하면",
          "사용자에게 무엇이 필요한지 말하고 사용자의 답을 근거로 쓴다",
          "(`AGENTS.md`의 「규칙의 원천」, `guides/agentic-repository-guide.md` 3절).",
        ].join("\n"),
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

  const tool = input.tool_name || "";
  const ti = input.tool_input || {};
  const writing = tool === "Write" || tool === "Edit" || tool === "NotebookEdit";
  // 경로 같은 칸만 본다. pattern·old_string·new_string은 글이므로 보지 않는다.
  const paths = [ti.file_path, ti.notebook_path, ti.path].filter((v) => typeof v === "string");
  const cmd = tool === "Bash" && typeof ti.command === "string" ? ti.command : "";

  for (const rule of PROTECTED) {
    const inPath = paths.some((p) => p.includes(rule.path));
    const inCmd = cmd.includes(rule.path);
    if (!inPath && !inCmd) continue;
    // write: true인 규칙은 쓰는 것만 막는다.
    if (rule.write) {
      if (writing) deny(rule, "고치려 한다");
      if (inCmd && WRITE_HINT.test(cmd)) deny(rule, "명령으로 고치려 한다");
      continue;
    }
    deny(rule, writing ? "고치려 한다" : "읽거나 고치려 한다");
  }
});
