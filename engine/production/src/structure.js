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
  for (const section of sections.filter(s => !s.verbatimResponse)) section.blocks.forEach((block, i) => {
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

// A body sentence that describes the slide's own furniture instead of teaching ("표는 넷을 나란히 둔
// 것이다", "표의 왼쪽은 …", "지금까지 넷이 나왔다", "셋째 줄이 이 세션이다"). The sentence before a
// table or diagram says what the reader must pick or decide, not how to read the columns
// (session-authoring-guide.md "6. 표와 목록", "문체와 용어"). Warning only.
const SLIDE_TALK = [
  { re: /(?:표|도식|그림)(?:는|은|이|가)[^.\n]{0,50}(?:둔|놓은|모은|정리한|나열한|적은|보인)\s*것이다/, what: "표·도식을 무엇으로 만들었는지 말하는 문장" },
  { re: /(?:표|도식|그림)의\s*(?:왼쪽|오른쪽|가운데|첫|둘째|셋째|넷째|마지막)\s*(?:열|칸|줄|행)/, what: "표의 열·행 위치로 대신하는 설명" },
  { re: /(?:첫째|둘째|셋째|넷째|마지막)\s*줄이\s/, what: "줄 번호로 내용을 가리키는 말" },
  { re: /지금까지\s*\S{0,8}\s*(?:나왔다|보았다|다뤘다)/, what: "진행 순서를 말하는 문장" },
  { re: /나란히\s*(?:둔|놓은|적은)\s*것이다/, what: "배치를 설명하는 문장" },
];
function slideTalk(sections) {
  const warnings = [];
  for (const section of sections) for (const block of section.blocks || []) {
    if (!["text", "bullet"].includes(block.kind)) continue;
    if (block.meta && (block.meta.quote || block.meta.anchor)) continue;
    const text = String(block.text).replace(/\*\*/g, "").trim();
    // 「표 — 제목」·「도식 — …」 표식과 코드·경로 표기는 본문 문장이 아니다.
    if (/^(?:표|도식|다이어그램|인용문|주석|문서 형식|배치|페이지 분할|강사 노트)\s*(?:—|$)/.test(text)) continue;
    for (const rule of SLIDE_TALK) {
      if (!rule.re.test(text)) continue;
      warnings.push(`슬라이드를 설명하는 문장(${rule.what}): "${section.title}"의 "${text.slice(0, 34)}"`);
      break;
    }
  }
  return warnings;
}

// A lead that counts ("막을 위험은 여섯이다") against the table under it: the two drift apart when a
// row is added later (session-authoring-guide.md "세션 목표와 요약": 개수를 센 말은 목표·본문·요약
// ·별첨에서 같아야 한다). Only checked when the topic has exactly one table. Warning only.
// "열"(column·열다)과 "둘"(둘러싸다)은 세는 말이 아닌 쓰임이 많아 넣지 않는다.
const COUNT_WORDS = { 셋: 3, 넷: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9 };
function countsMatchTable(sections) {
  const warnings = [];
  for (const section of sections) {
    const blocks = section.blocks || [];
    const tables = blocks.filter((b) => b.kind === "table");
    if (tables.length !== 1) continue;
    const rows = tables[0].rows.length - 1;
    const lead = blocks.find((b) => ["text", "bullet"].includes(b.kind) && !/^\*\*/.test(String(b.text).trim()));
    if (!lead) continue;
    const text = String(lead.text).replace(/\*\*/g, "");
    const found = [];
    for (const [word, n] of Object.entries(COUNT_WORDS)) {
      // 세는 말로 쓰인 꼴만 본다 — "…는 여섯이다", "여섯 가지", "여섯 개".
      if (new RegExp("(?:는|은|이|가)\\s*" + word + "(?:이다|다)|" + word + "\\s*(?:가지|개)(?![가-힣])").test(text)) found.push([word, n]);
    }
    if (!found.length || found.some(([, n]) => n === rows)) continue;
    warnings.push(`센 개수와 표의 행 수가 다르다(${found.map(([w, n]) => w + "=" + n).join("·")} ↔ ${rows}행): "${section.title}"`);
  }
  return warnings;
}

// A bullet that starts with its own number ("- **① 승인**") shows a bullet glyph and a number
// together; ordered items are a numbered list ("1. ") instead (session-authoring-guide.md "6. 표와
// 목록"). Warning only.
function numberedBullets(sections) {
  const warnings = [];
  for (const section of sections) for (const block of section.blocks) {
    // A "+ " line (practice prompt) has no glyph: its ①·② steps are allowed.
    if (block.kind !== "bullet" || (block.meta && block.meta.noGlyph)) continue;
    const text = String(block.text).trim().replace(/^\*\*/, "");
    if (/^[\u2460-\u2473\u2776-\u277F]/.test(text)) warnings.push(`bullet과 번호가 겹친다 — 번호 목록(1.)으로 쓴다: "${section.title}"의 "${text.slice(0, 20)}"`);
  }
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

// A practice topic has a fixed shape (session-authoring-guide.md "사례·가정·실습"): 투입물 (or 서비스
// 개요 for the first one), 프롬프트, 점검 항목, 결과물. Without this check a practice written in some
// other shape -- 과제/평가 기준/구성 요소 -- renders cleanly and the gap only shows in review.
// 실습은 사슬이다 — 앞 실습의 산출물이 다음 실습의 투입물이다. 그래서 투입물은 프롬프트 문장
// 안이 아니라 제 항목으로 있어야 하고, 결과물은 다음 실습이 가리킬 **파일 이름**을 밝혀야 한다
// (session-authoring-guide.md 「사례·가정·실습」). 앞 실습이 없는 첫 실습만 투입물이 없다.
const FIRST_PRACTICE = /^\d\d\. 실습 1 — /;
const PRACTICE_PARTS = [
  { label: "투입물", re: /\*\*(?:투입물|서비스 개요)\*\*/, skipFirst: true },
  { label: "프롬프트", re: /\*\*프롬프트(?: — 요청사항 포함)?\*\*/ },
  { label: "점검 항목 또는 진행 방법", re: /\*\*(?:점검 항목|진행 방법)\*\*/ },
  { label: "결과물", re: /\*\*결과물\*\*/ },
  { label: "결과물의 파일 이름", re: /\*\*결과물\*\*[\s\S]*?`[^`\s]+\.md`/ },
];
function practiceShape(sections) {
  const warnings = [];
  for (const s of sections) {
    if (!isPractice(s.title)) continue;
    const text = (s.blocks || []).map((b) => b.text || "").join("\n");
    const first = FIRST_PRACTICE.test(s.title.trim());
    const missing = PRACTICE_PARTS.filter((p) => !(p.skipFirst && first) && !p.re.test(text)).map((p) => p.label);
    if (missing.length) warnings.push(`실습 "${s.title}"에 ${missing.join("·")}이(가) 없다.`);
  }
  return warnings;
}

// 세션마다 요약의 강사 노트가 **그 세션이 모델에 더한 것**을 한 줄로 밝힌다(course-design.md의
// 「세 칸이 과정의 형식이다」 — 세션 순서가 개발 절차가 아니라 반복임을 보이는 줄이다). 경고만.
function missingModelUpdate(sections) {
  const summary = sections.find((s) => /^(?:\d\d\.\s*)?요약$/.test(String(s.title).trim()));
  if (!summary) return [];
  const notes = (summary.notes || []).map((b) => b.text || "").join("\n");
  if (/모델에서 보완된/.test(notes)) return [];
  return [`요약의 강사 노트에 "모델에서 보완된 것 — …" 줄이 없다.`];
}

// Every topic carries an instructor note (session-authoring-guide.md "강사 노트"). Warning only.
function missingNotes(sections) {
  // A group with no body of its own (its sub-topics follow) has no slide, so no note.
  return sections.filter((s) => (!s.blocks || s.blocks.length) && !(s.notes && s.notes.length)).map((s) => `강사 노트가 없다: "${s.title}"`);
}

module.exports = { checkStructure, wrappingCells, numberedDiagramLabels, unboldedText, slideTalk, countsMatchTable, numberedBullets, unmarkedQuestionTitles, missingNotes, answersOutsideAppendix, practiceShape, missingModelUpdate, MAX_GOALS };
