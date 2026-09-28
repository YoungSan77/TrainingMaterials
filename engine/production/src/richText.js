"use strict";
// Port of LecturePpt.rich()/run() (bold-span + parenthetical splitting) and
// ReferenceRenderer.canonical() (whitespace-insensitive, quote-preserving comparison key).
const { A, el, children, need } = require("./xml");
const { plain } = require("./text");

const TOKENS = /\/\/.*$|"(?:\\.|[^"\\])*"|\b[A-Za-z_][A-Za-z_0-9]*\b/gm;
const BOLD_MD = /\*\*(.*?)\*\*/g;
// Any non-nested parenthetical, Korean or English -- both shrink the same way (see runParen).
const PAREN = /\([^()]*\)/g;
// Inline code span: `Order.cancel()`'s "()" is call syntax, not a parenthetical aside, so its
// content is exempt from the PAREN rule below. Backticks are stripped either way (see run()).
const CODE_SPAN = /`([^`]*)`/g;
// First "—" in a line not split into its own heading+sub-bullet: everything after it is the
// inline explanation, so it renders 2pt under the line's base size (see rich()).
const DASH = "\u2014";

function run(p, text, size, bold) {
  if (text === "") return;
  const d = p.ownerDocument;
  const r = el(d, A, "r");
  const pr = el(d, A, "rPr", "sz", String(size * 100), "b", bold ? "1" : "0");
  const fill = el(d, A, "solidFill");
  fill.appendChild(el(d, A, "srgbClr", "val", "000000"));
  pr.appendChild(fill);
  pr.appendChild(el(d, A, "latin", "typeface", "\ub9d1\uc740 \uace0\ub515"));
  pr.appendChild(el(d, A, "ea", "typeface", "\ub9d1\uc740 \uace0\ub515"));
  r.appendChild(pr);
  const t = el(d, A, "t");
  t.textContent = text;
  r.appendChild(t);
  p.appendChild(r);
}

// The PAREN pass proper, run on text already known to contain no inline code spans.
function runPlainParen(p, text, size, bold) {
  PAREN.lastIndex = 0;
  let pos = 0, m;
  while ((m = PAREN.exec(text))) {
    run(p, text.slice(pos, m.index), size, bold);
    run(p, m[0], size - 4, bold);
    pos = m.index + m[0].length;
  }
  run(p, text.slice(pos), size, bold);
}

// Appends `text` as one or more runs at `size`, shrinking every parenthetical span -- Korean
// or English alike -- to size-4, except inside a backtick-delimited code span (see CODE_SPAN).
// Exported so callers that build a paragraph run-by-run (citations, titles) can reuse the same
// parenthetical rule as rich()'s segment loop below, without rich()'s child-clearing.
function runParen(p, text, size, bold) {
  CODE_SPAN.lastIndex = 0;
  let pos = 0, m;
  while ((m = CODE_SPAN.exec(text))) {
    runPlainParen(p, text.slice(pos, m.index), size, bold);
    run(p, m[1], size, bold);
    pos = m.index + m[0].length;
  }
  // Any backtick left outside a matched pair is stripped defensively, same as the rest of the
  // codebase's plain() convention -- it was never meant to survive into rendered text.
  runPlainParen(p, text.slice(pos).replace(/`/g, ""), size, bold);
}

// Splits `value` into **bold** spans and appends each through runParen (paren rule), without
// clearing the paragraph and without rich()'s "—" dash-split rule. Used by citations: their
// Korean 18pt zone should honor authored **bold** emphasis (guides/session-authoring-guide.md's
// "인용문 안의 bold는 강조만 뜻한다") the same way body text does, but a citation is a single quoted
// sentence, not a "라벨 — 설명" bullet, so it must not pick up the dash rule too.
function richInline(p, value, size, bold) {
  const segments = [];
  let pos = 0;
  BOLD_MD.lastIndex = 0;
  let m;
  while ((m = BOLD_MD.exec(value))) {
    if (m.index > pos) segments.push({ text: value.slice(pos, m.index), bold });
    segments.push({ text: m[1], bold: true });
    pos = m.index + m[0].length;
  }
  if (pos < value.length) segments.push({ text: value.slice(pos), bold });
  for (const s of segments) runParen(p, s.text, size, s.bold);
}

function rich(p, value, size, bold, code, names) {
  for (const c of children(p)) if (c.localName !== "pPr") p.removeChild(c);
  const segments = [];
  if (code) {
    let pos = 0;
    TOKENS.lastIndex = 0;
    let m;
    while ((m = TOKENS.exec(value))) {
      if (m.index > pos) segments.push({ text: value.slice(pos, m.index), bold: false });
      segments.push({ text: m[0], bold: names.has(m[0]) });
      pos = m.index + m[0].length;
    }
    if (pos < value.length) segments.push({ text: value.slice(pos), bold: false });
  } else {
    let pos = 0;
    BOLD_MD.lastIndex = 0;
    let m;
    while ((m = BOLD_MD.exec(value))) {
      if (m.index > pos) segments.push({ text: value.slice(pos, m.index), bold });
      segments.push({ text: m[1], bold: true });
      pos = m.index + m[0].length;
    }
    if (pos < value.length) segments.push({ text: value.slice(pos), bold });
  }
  // Dash lookup runs per-segment (after bold-span splitting), not on the raw value -- a "—"
  // can sit inside a **bold** span (e.g. "**본질적 어려움 — 주문 취소...**"), and splitting the
  // raw markdown there would sever one of the "**" pairs and leave literal asterisks in the text.
  let dashFound = false;
  for (const s of segments) {
    if (code) { run(p, s.text, size, s.bold); continue; }
    // Backticks are NOT stripped here -- runParen() needs them intact to find code spans and
    // exempt their "()" from the paren rule (e.g. "`Order.cancel()`"); it strips them itself.
    const text = s.text;
    if (dashFound) { runParen(p, text, size - 2, s.bold); continue; }
    const dashIdx = text.indexOf(DASH);
    if (dashIdx < 0) { runParen(p, text, size, s.bold); continue; }
    runParen(p, text.slice(0, dashIdx + 1), size, s.bold);
    runParen(p, text.slice(dashIdx + 1), size - 2, s.bold);
    dashFound = true;
  }
}

// Port of ReferenceRenderer.canonical(): strip whitespace outside quotes, keep quoted spacing.
function canonical(value) {
  value = plain(value);
  let out = "";
  let quote = false, escape = false;
  for (const c of value) {
    if (c === '"' && !escape) quote = !quote;
    if (quote || !/\s/.test(c)) out += c;
    escape = c === "\\" && !escape;
  }
  return out;
}

// Course source code (production-guide.md "소스 코드"): only declared names are bold -- the name
// after class/record/interface/enum, and a method or constructor name on its declaration line
// (a header followed by "{", or an interface/abstract method ending in ");"). Calls, field access
// and statements stay plain. Returns [start, end) spans within `line`.
const ID = "[A-Za-z_\\uAC00-\\uD7A3][\\w\\uAC00-\\uD7A3]*";
const TYPE_DECL = new RegExp("\\b(?:class|record|interface|enum)\\s+(" + ID + ")", "g");
const STATEMENT = /^\s*(?:if|for|while|switch|return|new|throw|else|catch|try|do|case|var)\b/;
const METHOD_HEAD = new RegExp("^(\\s*(?:(?:public|private|protected|static|final|abstract|default|synchronized)\\s+)*)"
  + "((?:[\\w\\uAC00-\\uD7A3<>\\[\\],.?]+\\s+)*)(" + ID + ")\\s*\\(");
function declaredNameSpans(line) {
  const spans = [];
  let m;
  TYPE_DECL.lastIndex = 0;
  while ((m = TYPE_DECL.exec(line))) spans.push([m.index + m[0].length - m[1].length, m.index + m[0].length]);
  if (!STATEMENT.test(line) && !/^\s*(?:class|record|interface|enum)\b/.test(line.replace(/^\s*(?:(?:public|private|protected|static|final|abstract)\s+)*/, ""))) {
    const h = METHOD_HEAD.exec(line);
    if (h) {
      const rest = line.slice(h[0].length);
      const typed = h[2].trim().length > 0;
      const body = /\)\s*(?:throws\s+[\w\s,]+)?\{/.test(rest);
      const abstractDecl = typed && /\);\s*$/.test(rest);
      if (body || abstractDecl) {
        const start = h[1].length + h[2].length;
        spans.push([start, start + h[3].length]);
      }
    }
  }
  return spans.sort((a, b) => a[0] - b[0]);
}

function richDeclarations(p, value, size) {
  for (const c of children(p)) if (c.localName !== "pPr") p.removeChild(c);
  let pos = 0;
  for (const [s, e] of declaredNameSpans(value)) {
    if (s < pos) continue;
    if (s > pos) run(p, value.slice(pos, s), size, false);
    run(p, value.slice(s, e), size, true);
    pos = e;
  }
  if (pos < value.length || value.length === 0) run(p, value.slice(pos), size, false);
}

module.exports = { declaredNameSpans, richDeclarations, rich, richInline, run, runParen, canonical, TOKENS };
