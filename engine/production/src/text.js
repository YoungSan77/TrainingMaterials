"use strict";
// Port of LecturePpt.java's plain()/wide()/estimate()/splitCode()/lines()/table-cell parsing helpers.
const { need } = require("./xml");

function plain(t) {
  return t.replace(/\*\*/g, "").replace(/`/g, "").replace(/\$\\rightarrow\$/g, "→");
}

// Same 7 Unicode blocks LecturePpt.wide() checks — CJK/Hangul/Hiragana/Katakana/halfwidth-fullwidth
// are treated as "wide" glyphs (fixed-width estimate / fixed 10.2pt measured width).
function wide(cp) {
  return (
    (cp >= 0xac00 && cp <= 0xd7a3) || // Hangul syllables
    (cp >= 0x1100 && cp <= 0x11ff) || // Hangul jamo
    (cp >= 0x4e00 && cp <= 0x9fff) || // CJK unified ideographs
    (cp >= 0x3000 && cp <= 0x303f) || // CJK symbols and punctuation
    (cp >= 0x3040 && cp <= 0x309f) || // Hiragana
    (cp >= 0x30a0 && cp <= 0x30ff) || // Katakana
    (cp >= 0xff00 && cp <= 0xffef) // Halfwidth and fullwidth forms
  );
}

function codePoints(str) {
  return Array.from(str).map((ch) => ch.codePointAt(0));
}

function estimate(line, width, size) {
  let sum = 0;
  for (const cp of codePoints(line)) sum += wide(cp) ? size : size * 0.56;
  return Math.max(1, Math.ceil(sum / (width - 12)));
}

function linesOf(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function splitCode(value, width, height) {
  let lines = linesOf(value);
  const out = [];
  const limit = Math.max(1, Math.floor(height / 13) - 1);
  while (lines.length) {
    let cost = 0, end = 0;
    for (const line of lines) {
      const c = estimate(plain(line), width, 10);
      need(c <= limit, "코드 한 줄이 페이지를 초과한다.");
      if (cost + c > limit) break;
      end++;
      cost += c;
    }
    if (end < lines.length) {
      let best = 0;
      for (let i = Math.max(1, Math.floor(end / 2)); i <= end; i++) {
        if (lines[i - 1] === "" || lines[i - 1] === "}") best = i;
      }
      if (best > 0) end = best;
    }
    need(end > 0, "코드 분할 실패");
    out.push(lines.slice(0, end).join("\n"));
    lines = lines.slice(end);
  }
  need(out.join("\n") === value, "코드 분할 내용 손실");
  return out;
}

const HEADING = /^(#{1,6}) (.+)$/;
const BULLET = /^( *)- (.*)$/;
// A "+ " line is a bullet that renders indented (same marL/lvl machinery as "- ") but with no
// glyph in front of it -- for prose that needs visual indentation under a heading/lead-in without
// implying it's one item in an enumerated list (session-authoring-guide.md "의미 표식과 블록 경계").
const INDENT = /^( *)\+ (.*)$/;

function separator(line) {
  return /^\|[\s:|-]+\|$/.test(line);
}

function cells(line) {
  need(line.endsWith("|"), "표 행은 |로 끝나야 한다.");
  const inner = line.slice(1, -1);
  // Split on unescaped '|', mirroring the Java negative-lookbehind regex.
  const parts = inner.split(/(?<!\\)\|/);
  return parts.map((s) => plain(s.trim()).replace(/\\\|/g, "|").replace(/<br>/g, ""));
}

module.exports = { plain, wide, estimate, linesOf, splitCode, HEADING, BULLET, INDENT, separator, cells, codePoints };
