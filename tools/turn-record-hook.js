#!/usr/bin/env node
// PostToolUse(Read|Grep|Bash) hook: 턴 중에 무엇을 몇 번 돌렸고 어느 지침을 읽었는지 기록한다.
// 아무것도 막지 않는다.
//
// 비용을 재자던 목적에는 "바뀐 파일 수"만으로는 모자란다 — 같은 원고를 세 번 렌더링했는지,
// 한 번에 끝냈는지가 다시 만들기의 비용이다(`AGENTS.md`의 「작업 운영」). 명령이 끝난 뒤에
// 기록하므로 실제로 돈 횟수를 센다.
//
// 지침을 읽은 것도 센다. 맥락의 설계는 "입구는 AGENTS.md 하나, 나머지는 찾아 읽게 한다"인데,
// 어느 문서를 실제로 열었는지가 남지 않으면 그 설계가 맞는지 확인할 수 없다
// (`guides/agentic-repository-guide.md` 2·6절).
"use strict";

const { note } = require("./turn-record");

// `AGENTS.md`와 `guides/<이름>.md`만 지침으로 센다. 과정의 설계·원고는 지침이 아니다.
const GUIDE = /(?:^|[\/\s"'])(AGENTS\.md|guides\/([A-Za-z0-9._-]+)\.md)/;

// 도구 호출 하나를 기록할 일로 바꾼다. 셀 것이 없으면 null이다.
function classify(tool, ti) {
  const text =
    tool === "Bash"
      ? ti.command
      : [ti.file_path, ti.path, ti.notebook_path].filter((v) => typeof v === "string").join(" ");
  if (typeof text !== "string" || !text) return null;

  if (tool === "Bash") {
    if (/production\/src\/cli\.js|\bsrc\/cli\.js/.test(text))
      return { kind: /--check\b/.test(text) ? "check" : "render", detail: text.slice(0, 200) };
    if (/node\s+--test\b/.test(text)) return { kind: "test", detail: text.slice(0, 200) };
  }

  const m = GUIDE.exec(text);
  // 지침의 이름만 남긴다 — 몇 줄을 읽었는지가 아니라 어느 계약을 열었는지가 맥락의 사용이다.
  if (m) return { kind: "guide", detail: m[2] ? m[2].replace(/-guide$/, "") : "AGENTS" };

  return null;
}

module.exports = { classify };

if (require.main === module) {
  let raw = "";
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    let input = {};
    try {
      input = JSON.parse(raw || "{}");
    } catch {
      process.exit(0);
    }
    const found = classify(input.tool_name || "", input.tool_input || {});
    if (found) note(found.kind, found.detail);
    process.exit(0);
  });
}
