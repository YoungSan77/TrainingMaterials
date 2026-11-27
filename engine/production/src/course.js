"use strict";
// 과정명은 Course Design, 세션 편성은 Curriculum에서 읽는다.
// Curriculum이 없는 과정은 기존 Course Design 제목을 계속 사용한다.
const fs = require("fs");
const path = require("path");

const NAME = /^-\s*\*\*과정명:\*\*\s*(.+?)\s*$/m;
const LEGACY_SESSION = /^### S(\d\d) — (.+?) \([^)]*\)\s*$/gm;

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

function courseInfo(inputPath) {
  const design = courseFile(inputPath, "course-design.md");
  if (!fs.existsSync(design)) return null;
  const text = fs.readFileSync(design, "utf-8");
  const m = NAME.exec(text);
  // The slug in backticks is the folder name, not part of the title: "AI-native SW 공학 (`ai-native`)".
  const name = m ? m[1].replace(/\s*\(`[^`]*`\)\s*$/, "").trim() : "";
  if (!name) return null;
  const { sessions, fromCurriculum } = courseSessions(inputPath, text);
  // 과정 이름으로 조판을 가르지 않는다 — renderer는 어느 과정인지 모른 채 원고의 표식만 따른다
  // (2026-11-27에 `productionProfile`을 지웠다. 과정 폴더 이름이 코드에 적혀 있었다).
  return {
    name, sessions,
    ...(fromCurriculum ? { firstSession: sessions[0].number } : {}),
  };
}

module.exports = { courseInfo, courseSessions, hasNextSession };
