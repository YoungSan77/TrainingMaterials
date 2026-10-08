"use strict";
// Session structure checks (session-authoring-guide.md, "세션 목표와 요약"):
//   - "01. 세션 목표" fits one slide and lists at most 7 goals.
//   - The last topic "요약" fits one slide and has a "다음 세션" group, unless the course design
//     lists no later session (the course's last session).
//   - A practice topic ("NN. 실습 — …", not its "검토 예시") and a text answer "NN. … (안)" each fit
//     one slide ("사례·가정·실습").
//   - The appendix ("## 별첨. 실습 답", the practice answers) comes after the summary and nothing
//     numbered follows it.
const fs = require("fs");
const path = require("path");
const { columnWidths, isPractice, isAnswer } = require("./builder");
const { estimate } = require("./text");

const MAX_GOALS = 7;

function hasNextSession(inputPath, session) {
  const m = /^(\d\d)\./.exec(String(session || ""));
  if (!m) return true;
  const design = path.join(path.dirname(path.resolve(inputPath)), "..", "course-design.md");
  // A deck outside a course (a reference deck such as references/sw-engineering-approach/) has no
  // course design, so no next session to name.
  if (!fs.existsSync(design)) return false;
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
  const firstAppendix = sections.findIndex((s) => s.appendix);
  if (firstAppendix >= 0 && sections.slice(firstAppendix).some((s) => !s.appendix)) errors.push("별첨 뒤에 본문 topic이 있다. `## 별첨. …`은 요약 뒤 맨 끝에 둔다.");
  const body = firstAppendix >= 0 ? sections.slice(0, firstAppendix) : sections;
  const summary = body[body.length - 1];
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

// A topic number inside a diagram label ("48. 유저 스토리") goes stale when topics move, and a
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
  for (const section of sections) section.blocks.forEach((block, i) => {
    if (!["text", "bullet"].includes(block.kind)) return;
    if (block.meta && (block.meta.quote || block.meta.anchor)) return;
    // A footnote (the paragraph after "**주석**") is reference text, not a sentence to emphasize.
    const prev = section.blocks[i - 1];
    if (prev && prev.kind === "text" && /^\*\*주석\*\*$/.test(prev.text.trim())) return;
    const text = String(block.text).trim();
    if (text.includes("**") || text.length < 25) return;
    if (/^(?:\d+\.|\(\d+\)|[“"「>])/.test(text)) return;
    warnings.push(`굵게 표시한 핵심어가 없다: "${section.title}"의 "${text.slice(0, 30)}"`);
  });
  return warnings;
}

// A topic title or a table cell that is a question ("유저 스토리란", "무엇을 얼마나 넣는가")
// ends with "?" (session-authoring-guide.md "문체와 용어"). Warning only.
const QUESTION_END = /(?:란|인가|는가|은가|할까|일까|는지)$/;
function unmarkedQuestionTitles(sections) {
  const warnings = [];
  for (const section of sections) {
    const t = String(section.title).replace(/^\d\d\.\s*/, "").trim();
    if (QUESTION_END.test(t)) warnings.push(`의문문 제목에 "?"가 없다: "${t}"`);
    for (const block of section.blocks || []) {
      if (block.kind !== "table") continue;
      for (const row of block.rows) for (const cell of row) {
        const c = String(cell).replace(/\*\*/g, "").trim();
        if (QUESTION_END.test(c)) warnings.push(`의문문 표 칸에 "?"가 없다: "${section.title}"의 "${c.slice(0, 30)}"`);
      }
    }
  }
  return warnings;
}

// A practice answer "(안)" belongs to the appendix after the summary, so the lecture runs straight to
// its summary (session-authoring-guide.md "사례·가정·실습"). Warning only.
function answersOutsideAppendix(sections) {
  return sections.filter((s) => isAnswer(s.title) && !s.appendix).map((s) => `실습 답 "${s.title}"은 요약 뒤 \`## 별첨. 실습 답\`의 서브 항목으로 둔다.`);
}

// Every topic carries an instructor note (session-authoring-guide.md "강사 노트"). Warning only.
function missingNotes(sections) {
  // A group with no body of its own (its sub-topics follow) has no slide, so no note.
  return sections.filter((s) => (!s.blocks || s.blocks.length) && !(s.notes && s.notes.length)).map((s) => `강사 노트가 없다: "${s.title}"`);
}

module.exports = { checkStructure, wrappingCells, numberedDiagramLabels, unboldedText, unmarkedQuestionTitles, missingNotes, answersOutsideAppendix, MAX_GOALS };
