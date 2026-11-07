"use strict";
// 과정 — 첫 세션 덱의 표지와 과정 목차에 쓰는 과정명과 세션 목록이다(production-guide.md 「표지와
// 과정 목차」). 원고 옆의 `../course-design.md`가 원천이며, 원고는 둘 다 적지 않는다.
//
//   - **과정명:** AI-native SW 공학 (`ai-native`)
//   ### S01 — 사람의 일과 AI의 일 (1시간 30분)
//
// 과정 설계가 없는 입력(테스트 fixture, 과정 밖의 참조 덱)은 과정이 없고 두 장도 만들지 않는다.
const fs = require("fs");
const path = require("path");

const NAME = /^-\s*\*\*과정명:\*\*\s*(.+?)\s*$/m;
// 세션 목록은 references.js가 세션명을 확인할 때 쓰는 heading과 같은 것이다.
const SESSION = /^### S(\d\d) — (.+?) \([^)]*\)\s*$/gm;
// 과정 목표 슬라이드 — 표지 다음 장에 그대로 그릴 문단과 목록이다. 없으면 그 장을 만들지 않는다.
const GOAL = /^### 과정 목표 슬라이드\s*$/m;

function goalSlide(text) {
  const m = GOAL.exec(text);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const end = rest.search(/^#{1,3} /m);
  const lines = (end < 0 ? rest : rest.slice(0, end)).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const first = lines.findIndex((l) => /^-\s+/.test(l));
  if (first < 0) return null;
  const goals = lines.slice(first).filter((l) => /^-\s+/.test(l)).map((l) => l.replace(/^-\s+/, ""));
  // 목록 바로 앞 문단이 슬라이드의 lead다 — 그 위에 저자용 설명이 더 있어도 끌어오지 않는다.
  const lead = first > 0 ? lines[first - 1] : "";
  return { lead, goals };
}

function courseInfo(inputPath) {
  const design = path.join(path.dirname(path.resolve(inputPath)), "..", "course-design.md");
  if (!fs.existsSync(design)) return null;
  const text = fs.readFileSync(design, "utf-8");
  const m = NAME.exec(text);
  // The slug in backticks is the folder name, not part of the title: "AI-native SW 공학 (`ai-native`)".
  const name = m ? m[1].replace(/\s*\(`[^`]*`\)\s*$/, "").trim() : "";
  if (!name) return null;
  const sessions = [];
  SESSION.lastIndex = 0;
  let s;
  while ((s = SESSION.exec(text))) sessions.push({ number: s[1], name: s[1] + ". " + s[2].trim() });
  return { name, sessions, goal: goalSlide(text) };
}

module.exports = { courseInfo };
