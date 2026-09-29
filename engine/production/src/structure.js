"use strict";
// Session structure checks (session-authoring-guide.md, "세션 목표와 요약"):
//   - "01. 세션 목표" fits one slide and lists at most 7 goals.
//   - The last topic "요약" fits one slide and has a "다음 세션" group, unless the course design
//     lists no later session (the course's last session).
//   - A practice topic ("NN. 실습 — …", not its "검토 예시") and a text answer "NN. … (안)" each fit
//     one slide ("사례·가정·실습").
const fs = require("fs");
const path = require("path");
const { columnWidths, isPractice, isAnswer } = require("./builder");
const { estimate } = require("./text");

const MAX_GOALS = 7;

function hasNextSession(inputPath, session) {
  const m = /^(\d\d)\./.exec(String(session || ""));
  if (!m) return true;
  const design = path.join(path.dirname(path.resolve(inputPath)), "..", "course-design.md");
  if (!fs.existsSync(design)) return true;
  const next = String(Number(m[1]) + 1).padStart(2, "0");
  return new RegExp("^### S" + next + " — ", "m").test(fs.readFileSync(design, "utf-8"));
}

function checkStructure(inputPath, session, sections, pages) {
  const errors = [];
  if (/^(s\d\d)-add\.md$/i.test(path.basename(inputPath))) return errors; // review decks hold only some topics
  const pageCount = (title) => pages.filter((p) => String(p.heading || "").split("\n")[0].replace(/ \(\d+\/\d+\)$/, "") === title).length;
  const goals = sections.find((s) => /^01\. 세션 목표$/.test(s.title));
  if (goals) {
    const count = goals.blocks.filter((b) => b.kind === "bullet" && b.depth === 0).length;
    if (count > MAX_GOALS) errors.push(`세션 목표가 ${count}개다. ${MAX_GOALS}개 이하로 압축한다.`);
    if (pageCount(goals.title) > 1) errors.push("세션 목표가 한 슬라이드를 넘는다.");
  }
  for (const s of sections) {
    if (isPractice(s.title) && pageCount(s.title) > 1) errors.push(`실습 "${s.title}"이 한 슬라이드를 넘는다. 과제를 줄이거나 검토 기준을 강사 노트로 옮긴다.`);
    const textOnly = s.blocks.every((b) => ["text", "bullet", "heading"].includes(b.kind));
    if (isAnswer(s.title) && textOnly && pageCount(s.title) > 1) errors.push(`답 "${s.title}"이 한 슬라이드를 넘는다. 대표가 아닌 규칙을 "......"로 생략하거나 (안)을 나눈다.`);
  }
  const summary = sections[sections.length - 1];
  if (summary && /^\d\d\. 요약$/.test(summary.title)) {
    if (pageCount(summary.title) > 1) errors.push("요약이 한 슬라이드를 넘는다. 핵심과 다음 세션을 한 장으로 압축한다.");
    const hasNext = summary.blocks.some((b) => b.kind === "heading" && /^다음 세션/.test(b.text.trim()));
    if (!hasNext && hasNextSession(inputPath, session)) errors.push("요약에 \"### 다음 세션\"이 없다.");
  }
  return errors;
}

// A table cell that does not fit one line breaks the uniform 0.8cm rows (production-guide.md
// "표의 행 높이와 열 너비"). Warning only.
function wrappingCells(sections) {
  const warnings = [];
  for (const section of sections) for (const block of section.blocks) {
    if (block.kind !== "table") continue;
    const widths = columnWidths(block.rows, block.rows[0].length);
    for (const row of block.rows) row.forEach((cell, i) => {
      const lines = String(cell).split("\v").reduce((n, line) => n + estimate(line, widths[i], 10), 0);
      if (lines > 1) warnings.push(`표 셀이 한 줄을 넘는다: "${section.title}"의 "${String(cell).slice(0, 30)}"`);
    });
  }
  return warnings;
}

// A topic number inside a diagram label ("48. 사용자 스토리") goes stale when topics move, and a
// diagram names concepts, not slides (session-authoring-guide.md "참조 형식"). Warning only.
function numberedDiagramLabels(sections) {
  const warnings = [];
  for (const section of sections) for (const block of section.blocks) {
    if (!["mermaid", "plantuml", "svg"].includes(block.kind)) continue;
    for (const m of String(block.text).matchAll(/(?:^|["\[>(:]\s*)(\d\d\. [가-힣][^"\]<\n]{0,20})/gm)) {
      warnings.push(`도식 라벨에 topic 번호가 있다: "${section.title}"의 "${m[1].trim()}"`);
    }
  }
  return warnings;
}

// A body sentence or bullet with no bold keyword (session-authoring-guide.md "강조(bold)").
// Numbered steps (use-case flows, procedures), quoted requests (`>`, “…”) and short noun lists are
// exempt.
// Warning only.
function unboldedText(sections) {
  const warnings = [];
  for (const section of sections) for (const block of section.blocks) {
    if (!["text", "bullet"].includes(block.kind)) continue;
    if (block.meta && (block.meta.quote || block.meta.anchor)) continue;
    const text = String(block.text).trim();
    if (text.includes("**") || text.length < 25) continue;
    if (/^(?:\d+\.|\(\d+\)|[“"「>])/.test(text)) continue;
    warnings.push(`굵게 표시한 핵심어가 없다: "${section.title}"의 "${text.slice(0, 30)}"`);
  }
  return warnings;
}

// Every topic carries an instructor note (session-authoring-guide.md "강사 노트"). Warning only.
function missingNotes(sections) {
  return sections.filter((s) => !(s.notes && s.notes.length)).map((s) => `강사 노트가 없다: "${s.title}"`);
}

module.exports = { checkStructure, wrappingCells, numberedDiagramLabels, unboldedText, missingNotes, MAX_GOALS };
