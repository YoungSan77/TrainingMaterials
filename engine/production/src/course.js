"use strict";
// 과정명·목표는 Course Design, 세션 편성은 Curriculum에서 읽는다.
// Curriculum이 없는 과정은 기존 Course Design 제목을 계속 사용한다.
const fs = require("fs");
const path = require("path");

const NAME = /^-\s*\*\*과정명:\*\*\s*(.+?)\s*$/m;
const LEGACY_SESSION = /^### S(\d\d) — (.+?) \([^)]*\)\s*$/gm;
// 과정 목표 슬라이드 — 표지 다음 장에 그대로 그릴 문단과 목록이다. 없으면 그 장을 만들지 않는다.
const GOAL = /^### 과정 목표 슬라이드\s*$/m;

function courseFile(inputPath, filename) {
  return path.join(path.dirname(path.resolve(inputPath)), "..", filename);
}

function tableCells(line) {
  const row = /^\s*\|(.*)\|\s*$/.exec(line);
  return row && row[1].split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

function readCurriculum(file) {
  const lines = fs.readFileSync(file, "utf-8").split(/\r?\n/);
  const headerIndex = lines.findIndex((line, i) => {
    const cells = tableCells(line);
    const separator = tableCells(lines[i + 1] || "");
    return cells && cells.includes("세션") && cells.includes("제목")
      && separator && separator.length === cells.length
      && separator.every((cell) => /^:?-{3,}:?$/.test(cell));
  });
  if (headerIndex < 0) throw new Error(file + ": 세션·제목 열이 있는 편성표가 없다.");
  const header = tableCells(lines[headerIndex]);
  const idColumn = header.indexOf("세션");
  const titleColumn = header.indexOf("제목");
  const sessions = [];
  const ids = new Set();
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const cells = tableCells(lines[i]);
    if (!cells) break;
    const number = /^S(\d\d)$/.exec(cells[idColumn] || "")?.[1];
    const title = cells[titleColumn];
    if (cells.length === header.length && cells[idColumn] === "" && /합계(?:\*\*)?$/.test(title)) continue;
    if (cells.length !== header.length || !number || !title || ids.has(number)) {
      throw new Error(file + ":" + (i + 1) + ": 편성표의 세션 ID·제목 누락, 형식 오류 또는 ID 중복.");
    }
    ids.add(number);
    sessions.push({ number, name: number + ". " + title });
  }
  if (!sessions.length) throw new Error(file + ": 편성표에 세션이 없다.");
  return sessions;
}

function courseSessions(inputPath, designText) {
  const file = courseFile(inputPath, "curriculum.md");
  if (fs.existsSync(file)) return { sessions: readCurriculum(file), fromCurriculum: true };
  const design = courseFile(inputPath, "course-design.md");
  const legacyText = designText ?? (fs.existsSync(design) ? fs.readFileSync(design, "utf-8") : "");
  const sessions = Array.from(legacyText.matchAll(LEGACY_SESSION), ([, number, title]) =>
    ({ number, name: number + ". " + title.trim() }));
  return { sessions, fromCurriculum: false, legacyText };
}

function hasNextSession(inputPath, number) {
  const { sessions, fromCurriculum, legacyText } = courseSessions(inputPath);
  if (fromCurriculum) {
    const index = sessions.findIndex((session) => session.number === number);
    return index >= 0 && index < sessions.length - 1;
  }
  const next = String(Number(number) + 1).padStart(2, "0");
  return new RegExp("^### S" + next + " — ", "m").test(legacyText);
}

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
  const design = courseFile(inputPath, "course-design.md");
  if (!fs.existsSync(design)) return null;
  const text = fs.readFileSync(design, "utf-8");
  const m = NAME.exec(text);
  // The slug in backticks is the folder name, not part of the title: "AI-native SW 공학 (`ai-native`)".
  const name = m ? m[1].replace(/\s*\(`[^`]*`\)\s*$/, "").trim() : "";
  if (!name) return null;
  const { sessions, fromCurriculum } = courseSessions(inputPath, text);
  const productionProfile = path.basename(path.dirname(design)) === 'ai-native' ? 'ai-native-s03' : null;
  return {
    name, sessions, goal: goalSlide(text),
    ...(fromCurriculum ? { firstSession: sessions[0].number } : {}),
    ...(productionProfile ? {productionProfile} : {}),
  };
}

module.exports = { courseInfo, courseSessions, hasNextSession };
