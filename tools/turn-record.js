#!/usr/bin/env node
// 턴 기록의 공용 부분. hook과 다른 도구가 이 한 곳으로 기록한다
// (`guides/agentic-repository-guide.md` 6절).
//
// 턴 중에 생긴 일(렌더링·검사·환경의 거절)은 저장소 루트의 `.turn-events`에 한 줄씩 쌓이고,
// 턴이 끝날 때 Stop hook이 그것을 비우며 `courses/<과정>/checks/turn-log.md`에 한 줄로 묶는다.
// `.turn-events`는 턴 안에서만 쓰는 임시 파일이므로 git에서 뺀다.
//
// 기록은 작업을 깨뜨리지 않는다 — 모든 실패를 삼킨다.
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const EVENTS = path.join(ROOT, ".turn-events");

// 2026-11-07: hook을 직접 돌려 동작을 시험하면 그 거절이 실제 거절처럼 쌓여, 턴 기록이 "환경이
// 거절 7번"처럼 부풀었다. 시험은 `TM_HOOK_TEST=1`로 돌리고 그때는 기록하지 않는다 — 기록은 재는
// 근거이므로 시험과 실제를 섞지 않는다(`guides/agentic-repository-guide.md` 6절).
function note(kind, detail) {
  if (process.env.TM_HOOK_TEST) return;
  try {
    fs.appendFileSync(EVENTS, JSON.stringify({ kind, detail }) + "\n");
  } catch {
    /* 기록은 작업을 막지 않는다 */
  }
}

// 쌓인 일을 돌려주고 비운다. 비우지 않으면 다음 턴의 기록에 겹쳐 센다.
function drain() {
  try {
    const raw = fs.readFileSync(EVENTS, "utf-8");
    fs.unlinkSync(EVENTS);
    return raw
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function activeCourse() {
  try {
    return fs.readFileSync(path.join(ROOT, "courses/ACTIVE"), "utf-8").trim();
  } catch {
    return "";
  }
}

// 마지막 줄이 같은 내용이고 3분 안에 적힌 것인지 본다. 기록 파일이 없거나 읽히지 않으면 아니다.
function recentlySame(file, text, now) {
  try {
    const lines = fs.readFileSync(file, "utf-8").trimEnd().split("\n");
    const last = lines[lines.length - 1];
    const m = /^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) — (.*)$/.exec(last || "");
    if (!m || m[2] !== text) return false;
    // 적힌 시각은 이 PC의 시각이고 Date도 그렇게 읽으므로, 여기서 시간대를 다시 더하지 않는다.
    const then = new Date(m[1].replace(" ", "T") + ":00");
    return now.getTime() - then.getTime() < 3 * 60 * 1000;
  } catch {
    return false;
  }
}

// 지금 작업하는 과정의 checks/에 턴 한 줄을 남긴다. 사람이 고쳐 쓰는 기록이 아니다.
function logTurn(text) {
  try {
    const course = activeCourse();
    if (!course) return;
    const file = path.join(ROOT, "courses", course, "checks", "turn-log.md");
    if (!fs.existsSync(file)) {
      fs.writeFileSync(
        file,
        "# 턴 기록\n\n턴이 끝날 때 `tools/session-check-hook.js`가 한 줄씩 더한다 — 바뀐 파일,"
          + " 렌더링·검사 횟수, 환경이 거절한 횟수, 세션 원고 자동 검사의 판정이다."
          + " 사람이 고쳐 쓰는 기록이 아니다(`guides/agentic-repository-guide.md` 6절).\n\n"
      );
    }
    const now = new Date();
    // 사람이 읽는 기록이므로 UTC가 아니라 이 PC의 시각으로 적는다.
    const stamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16).replace("T", " ");
    // 2026-11-07: Stop이 한 턴에 두 번 들어와 같은 줄이 둘씩 남았고, 그러면 턴 수를 겹쳐 센다.
    // 바로 앞 줄과 **내용이 같고 3분 안**이면 덧붙이지 않는다. 내용이 다르면 그것은 다른 턴이다.
    if (recentlySame(file, text, now)) return;
    fs.appendFileSync(file, `- ${stamp} — ${text}\n`);
  } catch {
    /* 기록은 턴을 막지 않는다 */
  }
}

// 쌓인 일을 "렌더링 2번 · 검사 1번 · 거절 1번"처럼 묶는다. 없는 종류는 적지 않는다.
// 지침은 횟수가 아니라 **어느 것을 열었는지**가 맥락의 사용이므로 이름을 적는다.
function summary(events) {
  const label = { render: "렌더링", check: "검사", test: "테스트", deny: "환경이 거절" };
  const order = ["render", "check", "test", "deny"];
  const count = {};
  for (const e of events) count[e.kind] = (count[e.kind] || 0) + 1;
  const parts = order.filter((k) => count[k]).map((k) => `${label[k]} ${count[k]}번`);

  const guides = [...new Set(events.filter((e) => e.kind === "guide").map((e) => e.detail))].sort();
  if (guides.length) parts.push(`지침 ${guides.length}개 읽음(${guides.join(", ")})`);
  return parts.join(" · ");
}

module.exports = { note, drain, logTurn, summary, activeCourse, EVENTS };
