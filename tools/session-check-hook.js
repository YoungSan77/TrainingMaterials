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

function changedManuscripts() {
  const out = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf-8" });
  const files = [];
  for (const line of out.split("\n")) {
    // "XY path" -- a rename shows "R  old -> new"; take the destination.
    const file = line.slice(3).trim().split(" -> ").pop();
    if (file && TARGET.test(file) && !/-add\.md$/.test(file)) files.push(file);
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
  if (!files.length) process.exit(0);

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
  if (!bad.length) process.exit(0);
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
