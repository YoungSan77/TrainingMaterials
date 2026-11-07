#!/usr/bin/env node
// Stop hook: 고친 세션 원고가 실제로 오류 0 · 경고 0인지 턴이 끝나기 전에 확인한다.
//
// 완료 기준(AGENTS.md 「Session Authoring Baseline」)은 자동 검사의 오류·경고 0개다. 이것을 사람이
// 기억에 의존해 보고하면 "통과했다"는 말이 검증 없이 나간다. 작업 트리에서 바뀐 세션 원고만 골라
// `--check`로 돌리고, 남은 오류·경고를 그대로 되돌려 준다(덱은 만들지 않는다).
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const { drain, logTurn, summary } = require("./turn-record");

const ROOT = path.join(__dirname, "..");
const TARGET = /^courses\/[^/]+\/sessions\/s\d\d[^/]*\.md$/;
// Warnings that only the user can clear (an original we do not have) would otherwise block every
// turn with the same message. They stay warnings in Production -- the completion bar is unchanged
// -- but this hook does not repeat them. Each entry carries the reason and what it waits on.
const PENDING = path.join(ROOT, "references", "pending-sources.json");

function pendingQuotes() {
  try {
    return JSON.parse(fs.readFileSync(PENDING, "utf-8")).pending.map((p) => p.quote);
  } catch {
    return [];
  }
}

// 과정을 전면 보완하는 동안에는 아직 다시 쓰지 않은 원고가 "헤더는 새 세션명, 본문은 옛 축"으로
// 남는다 — 참조 검사가 같은 폴더의 헤더를 함께 보므로 헤더를 먼저 바꿔야 다시 쓴 세션의 참조가
// 성립한다. 그 원고를 courses/<course>/checks/rewrite-pending.json에 적어 두면 이 훅이 검사
// 대상에서 뺀다. 세션을 다시 쓸 때 목록에서 지우고, 끝나면 파일을 지운다. 지금 고치는 원고의
// 완료 기준은 그대로 오류 0 · 경고 0이다.
function rewritePending(file) {
  const course = file.split("/")[1];
  const list = path.join(ROOT, "courses", course, "checks", "rewrite-pending.json");
  try {
    return (JSON.parse(fs.readFileSync(list, "utf-8")).pending || []).some((p) => file.endsWith(p));
  } catch {
    return false;
  }
}

// 턴마다 한 줄을 남긴다. 무엇을 보고 무엇을 했는지가 git 이력과 사람의 기억에만 있으면, "다시
// 만들기가 작업 비용의 대부분이었다" 같은 판단을 재는 근거가 없다. 턴 중에 쌓인 일(렌더링·검사·
// 거절)을 비우고 바뀐 파일·검사 판정과 함께 한 줄로 묶는다
// (`guides/agentic-repository-guide.md` 6절, AGENTS.md 「작업 운영」).
function log(verdict) {
  const done = summary(drain());
  logTurn([`바뀐 파일 ${changedCount()}개`, done, verdict].filter(Boolean).join(" · "));
}

// 2026-11-07: 기록 자신을 세면 안 된다. 한 턴에 Stop이 두 번 들어올 때, 첫 번째가 남긴 줄이
// turn-log.md를 바꿔 두 번째의 "바뀐 파일 수"가 1 늘고, 그러면 줄의 내용이 달라져 겹침 막기가
// 통하지 않는다(19:41·19:42가 그렇게 둘이 됐다). 기록 파일은 세지 않는다.
function changedCount() {
  try {
    const out = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf-8" });
    return out
      .split("\n")
      .filter((l) => l.trim() && !/checks\/turn-log\.md$/.test(l))
      .length;
  } catch {
    return 0;
  }
}

function changedManuscripts() {
  const out = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf-8" });
  const files = [];
  for (const line of out.split("\n")) {
    // "XY path" -- a rename shows "R  old -> new"; take the destination.
    const file = line.slice(3).trim().split(" -> ").pop();
    // "-add.md"는 원고의 추가분, "-…-check.md"는 렌더링 검토 기록이다. 둘 다 Session Source가
    // 아니므로 "Session 명:" 헤더가 없고, 검사 대상이 아니다.
    // 지운 원고(전면 보완에서 없어진 세션)는 작업 트리에 없다. 검사에 넘기면 "입력 파일이 없다"로
    // 턴이 막히므로, 디스크에 없는 경로는 건너뛴다.
    if (file && TARGET.test(file) && !/-add\.md$/.test(file) && !/-[^/]*check\.md$/.test(file)
        && fs.existsSync(path.join(ROOT, file)) && !rewritePending(file))
      files.push(file);
  }
  return files;
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
  // Already looping back from a previous block -- say it once, then let the turn end.
  if (input.stop_hook_active) process.exit(0);

  let files = [];
  try {
    files = changedManuscripts();
  } catch {
    process.exit(0);
  }
  if (!files.length) {
    log("원고 0개 — 자동 검사 안 함");
    process.exit(0);
  }

  let out = "";
  try {
    out = execFileSync("node", [path.join("engine", "production", "src", "cli.js"), "--check", ...files], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (ex) {
    out = String((ex.stdout || "") + (ex.stderr || ""));
  }
  const waived = pendingQuotes();
  const bad = out
    .split("\n")
    .filter((l) => /^(생성 중단|경고):/.test(l.trim()))
    .filter((l) => !waived.some((q) => l.includes(q.slice(0, 40))));
  if (!bad.length) {
    log(`원고 ${files.length}개 — 오류·경고 0`);
    process.exit(0);
  }
  log(`원고 ${files.length}개 — 오류·경고 ${bad.length}건으로 막음`);
  process.stdout.write(
    JSON.stringify({
      decision: "block",
      reason:
        "고친 세션 원고에 자동 검사의 오류·경고가 남아 있다(완료 기준은 0개다). 아래를 원고에서 고치고 다시 렌더링한다.\n\n" +
        bad.join("\n") +
        "\n\n검사한 원고: " +
        files.join(", "),
    })
  );
});
