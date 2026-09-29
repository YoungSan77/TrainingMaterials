"use strict";
// Direct port of LecturePpt.parse(): heading-depth auto-detection, then a single left-to-right
// pass that classifies each line into heading/bullet/text/code/tree/table blocks.
const { need } = require("./xml");
const { linesOf, HEADING, BULLET, INDENT, separator, cells } = require("./text");

function block(kind, text, depth = 0, rows = [], meta = null) {
  return { kind, text, rows, depth, meta };
}

function isNotesHeading(line) {
  return line.trim() === "**강사 노트**";
}

// TM parser extension (NOT present in lecture-ppt-java): a leading
// "--------------------\nSession 명: <값>\n--------------------" block declares the session
// name shown at each slide's top-right corner. It is not a topic, not slide-title content, and
// is never passed via CLI -- it is read straight from the manuscript. Absent entirely when the
// manuscript has no such header (e.g. the lecture-ppt-java baseline input), preserving old parse().
function extractSession(lines) {
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (!/^-{3,}$/.test((lines[i] || "").trim())) return { session: null, rest: lines };
  const m = /^Session\s*명\s*:\s*(.+)$/.exec((lines[i + 1] || "").trim());
  if (!m) return { session: null, rest: lines };
  if (!/^-{3,}$/.test((lines[i + 2] || "").trim())) return { session: null, rest: lines };
  return { session: m[1].trim(), rest: lines.slice(i + 3) };
}

function parse(input) {
  const raw = linesOf(input.replace(/^﻿/, ""));
  const { session, rest } = extractSession(raw);
  const lines = rest;
  let top = 7;
  let fence = false;
  for (const line of lines) {
    if (line.startsWith("```")) { fence = !fence; continue; }
    const m = HEADING.exec(line);
    if (!fence && m) top = Math.min(top, m[1].length);
  }
  need(top <= 6, "Markdown 구조를 인식하지 못했다. 제목·본문·표 경계가 복사 과정에서 사라졌을 수 있다. 원본 Markdown을 사용하거나 --structure 원본.md로 내용 일치 검증 후 구조를 복원해라.");

  const sections = [];
  let current = null;
  let inNotes = false;
  let i = 0;
  // TM parser extension (NOT present in lecture-ppt-java): every topic is a single logical unit
  // of text/list/table/visual/notes -- notes are collected separately (section.notes) so they
  // never leak into slide body content, but visual/text/code blocks all stay in one flat
  // section.blocks list. Splitting that list into slides is a builder/renderer concern (Phase 2+
  // of the Golden-core migration), not something decided at parse time.
  function push(b) {
    (inNotes ? current.notes : current.blocks).push(b);
  }
  // Per guides/session-authoring-guide.md ("목차와 Topic 번호 규칙") and guides/production-guide.md
  // ("목차 생성 및 검증"): "## 목차" is the author's manual table of contents, not a topic. It is
  // collected separately (never pushed to `sections`) so the renderer uses its items verbatim
  // instead of deriving a TOC from body headings, and so it never becomes its own content slide.
  const TOC_HEADING = "목차";
  let toc = null;
  while (i < lines.length) {
    const line = lines[i++];
    if (line.trim() === "") continue;
    // Per session-authoring-guide.md ("의미 표식과 블록 경계"): notes run "until the next
    // horizontal rule or the next `## NN. 제목`" -- whichever comes first. A horizontal rule
    // that isn't inside notes is just an ordinary topic separator (unchanged behavior).
    if (line.trim() === "---") { inNotes = false; continue; }
    const h = HEADING.exec(line);
    if (h && h[1].length === top) {
      if (h[2].trim() === TOC_HEADING) {
        need(toc === null, "`## 목차`는 한 번만 존재해야 한다.");
        current = { heading: h[2], title: h[2], blocks: [], notes: [] };
        toc = current;
        inNotes = false;
        continue;
      }
      // `title` is retained as a compatibility alias for the current renderers/callers.
      current = { heading: h[2], title: h[2], blocks: [], notes: [] };
      sections.push(current);
      inNotes = false;
      continue;
    }
    need(current != null, "첫 주제 제목 앞의 본문은 허용하지 않는다.");
    // TM parser extension (NOT present in lecture-ppt-java): "**강사 노트**" switches the rest of
    // the current topic (until the next top-level heading) into section.notes instead of
    // section.blocks. The marker line itself is consumed, never emitted as a block, so it can
    // never show up as slide body text.
    if (isNotesHeading(line)) { inNotes = true; continue; }
    // TM parser extension (NOT present in lecture-ppt-java): "**페이지 분할**" is an explicit,
    // author-placed page break -- unlike every other split point in this pipeline (which the
    // builder infers from an estimated content-height budget), this one is guaranteed. It forces
    // whatever's pending on the current page to close right there, so a topic's multi-page split
    // lands exactly where the author intends instead of wherever the estimate happens to overflow.
    if (line.trim() === "**페이지 분할**") { push(block("pagebreak", "", 0)); continue; }
    // TM parser extension: "**다이어그램 — 시퀀스 다이어그램**" names the diagram a topic explains
    // when the topic title itself doesn't. It is slide-title metadata, not body content: the
    // builder shows it as an 11pt second title line, and the TOC (matched 1:1 against the
    // heading) is unaffected.
    const diagramMarker = /^\*\*다이어그램\s*[—:-]\s*(.+?)\*\*$/.exec(line.trim());
    if (diagramMarker) { current.diagram = diagramMarker[1].trim(); continue; }
    if (h) {
      push(block("heading", h[2], 0));
      continue;
    }
    if (line.trim() === "**디렉토리 구조**" || line.trim() === "**주요 구현 코드**") continue;
    if (line.startsWith("```")) {
      const info = line.slice(3).trim();
      const raw = [];
      while (i < lines.length && !lines[i].startsWith("```")) raw.push(lines[i++]);
      need(i < lines.length, "닫히지 않은 코드 fence");
      i++;
      const value = raw.join("\n");
      // TM parser extension (NOT present in lecture-ppt-java): mermaid/plantuml/chart fences get
      // their own explicit block kind instead of falling through to "code" -- so the source/spec
      // text is never treated as literal code-slide content by a renderer. Convention matches the
      // pre-migration markdown.js: ```mermaid, ```plantuml or ```plantuml:<kind>, ```chart.
      const uml = /^plantuml(?::(\w+))?$/i.exec(info);
      let kind, meta;
      if (/^mermaid$/i.test(info)) { kind = "mermaid"; meta = null; }
      else if (uml) { kind = "plantuml"; meta = { uml: uml[1] ? uml[1].toLowerCase() : null }; }
      else if (/^(chart|matplotlib)$/i.test(info)) { kind = "chart"; meta = null; }
      else if (/^svg(?::uml)?$/i.test(info)) { kind = "svg"; meta = /:uml$/i.test(info) ? { uml: "svg" } : null; }
      else if (/^(tree|plaintext|text)$/.test(info) || /[├└]─/.test(value)) { kind = "tree"; meta = null; }
      else { kind = "code"; meta = null; }
      push(block(kind, value, 0, [], meta));
      continue;
    }
    if (["Java", "SQL", "Plaintext", "Python", "JavaScript"].includes(line.trim())) {
      let j = i;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && lines[j].startsWith("```")) continue;
    }
    if (line.startsWith("|")) {
      need(i < lines.length && separator(lines[i]), "표 구분선이 없다.");
      i++;
      const rows = [cells(line)];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(cells(lines[i++]));
      const cols = rows[0].length;
      need(rows.every((r) => r.length === cols), "표 열 수가 일치하지 않는다.");
      push(block("table", "", 0, rows));
      continue;
    }
    const b = BULLET.exec(line);
    if (b) {
      need(b[1].length % 2 === 0, "목록 들여쓰기는 2칸 단위다.");
      push(block("bullet", b[2], Math.min(b[1].length / 2, 2)));
      continue;
    }
    const ind = INDENT.exec(line);
    if (ind) {
      need(ind[1].length % 2 === 0, "들여쓰기는 2칸 단위다.");
      push(block("bullet", ind[2], Math.min(ind[1].length / 2, 2), [], { noGlyph: true }));
      continue;
    }
    // TM parser extension (NOT present in lecture-ppt-java): a blockquote line is accepted as
    // a plain "text" block for emphasis. No dedicated quote visual style yet -- it renders exactly
    // like ordinary body text. The original line (including the leading ">") is kept verbatim, so
    // no text or ordering is lost. Single-line only (matches this parser's other minimal additions).
    if (line.startsWith(">")) {
      push(block("text", line, 0));
      continue;
    }
    // TM parser extension (NOT present in lecture-ppt-java): an ordered-list item ("1. ", "2. ", ...)
    // is accepted as a "bullet" block, reusing the existing bullet depth/typography rules (size,
    // spacing). The numeral is kept as part of the text verbatim -- it is never stripped or replaced
    // with a generic bullet glyph, so authored numbering is preserved exactly as written.
    // An indented one ("  1. ") nests under the list item above it, like an indented bullet.
    const ordered = /^( *)(\d+\.\s.*)$/.exec(line);
    if (ordered) {
      need(ordered[1].length % 2 === 0, "목록 들여쓰기는 2칸 단위다.");
      push(block("bullet", ordered[2], Math.min(ordered[1].length / 2, 2)));
      continue;
    }
    need(!/^(!\[|<).*/.test(line), "지원하지 않는 Markdown: " + line);
    let value = line;
    while (i < lines.length && lines[i].trim() !== "" && !isNotesHeading(lines[i]) && !/^(#|\s*[-+] |\s*\d+\.\s|\||```)/.test(lines[i])) {
      value += " " + lines[i++].trim();
    }
    push(block("text", value, 0));
  }
  return { session, toc: toc ? toc.blocks : null, sections };
}

module.exports = { parse, block };
