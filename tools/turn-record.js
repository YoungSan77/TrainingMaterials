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
    fs.appendFileSync(file, `- ${stamp} — ${text}\n`);
  } catch {
    /* 기록은 턴을 막지 않는다 */
  }
}

// 쌓인 일을 "렌더링 2번 · 검사 1번 · 거절 1번"처럼 묶는다. 없는 종류는 적지 않는다.
function summary(events) {
  const label = { render: "렌더링", check: "검사", test: "테스트", deny: "환경이 거절" };
  const order = ["render", "check", "test", "deny"];
  const count = {};
  for (const e of events) count[e.kind] = (count[e.kind] || 0) + 1;
  return order.filter((k) => count[k]).map((k) => `${label[k]} ${count[k]}번`).join(" · ");
}

module.exports = { note, drain, logTurn, summary, activeCourse, EVENTS };
