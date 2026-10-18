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
  return { name, sessions };
}

module.exports = { courseInfo };
