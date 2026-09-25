"use strict";
// production-guide.md "Visual layout 및 가독성": boxes of the same kind inside one diagram share
// the widest box's width and the tallest box's height, instead of each hugging its own text.
//
// Renderers size each box from its own label, so this is done as a second pass: the adapter
// renders the diagram once to SVG, these helpers read the measured sizes back, and the source is
// rewritten so the renderer itself draws uniform boxes (no post-hoc image scaling -- every box's
// text keeps the diagram's one font size).
//
// - PlantUML class/enum: `skinparam minClassWidth` (measured widest box) + every body padded to
//   the same number of field/method lines. `sameClassWidth` is not implemented by the smetana
//   layout this renderer uses ("NOT YET IMPLEMENED"), so the width is set explicitly.
// - PlantUML state/usecase/sequence participants: no min-width option is honored for these under
//   smetana, so each quoted label is padded with no-break spaces up to the widest label's measured
//   text width (textLength). Equal text boxes give equal state/participant boxes and ellipses.
// - Mermaid: see mermaidAdapter.js (min-width/min-height on the HTML label).

const NBSP = " ";
// Measured: one U+00A0 advances 0.3164em in the renderer's font (맑은 고딕 bold) --
// 40 NBSP = 658.1 SVG units at font-size 52 (13pt x scale 4).
const NBSP_EM = 0.3164;

function decode(text) {
  return String(text)
    .replace(/&#(\d+);/g, (w, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (w, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

// text content -> widest measured textLength for that exact string (one entry per SVG <text>).
function textWidths(svg) {
  const widths = new Map();
  for (const m of String(svg).matchAll(/<text\b[^>]*\btextLength="([\d.]+)"[^>]*>([^<]*)<\/text>/g)) {
    const text = decode(m[2]).trim();
    widths.set(text, Math.max(widths.get(text) || 0, Number(m[1])));
  }
  return widths;
}

// Widest box among the class-like entities (entity groups when present, all rects otherwise).
function maxEntityRectWidth(svg) {
  const s = String(svg);
  const groups = [...s.matchAll(/<g class="entity"[^>]*>([\s\S]*?)<\/g>/g)].map((m) => m[1]);
  const scopes = groups.length ? groups : [s];
  let max = 0;
  for (const scope of scopes) {
    const rect = /<rect\b[^>]*\bwidth="([\d.]+)"/.exec(scope);
    if (rect) max = Math.max(max, Number(rect[1]));
  }
  return max;
}

// -- PlantUML class/enum ---------------------------------------------------------------------

const DECL = /^(\s*)((?:abstract\s+class|abstract|class|interface|enum|entity))\s+("[^"]*"|[^\s{]+)(\s+as\s+[^\s{]+)?(\s*<<[^>]*>>)?\s*(\{)?\s*$/;

// A method line has a name directly followed by "(" -- `취소()`, `저장(주문)`. A parenthesis after
// a space is a label annotation on a field (`고객번호 (FK)`), not a method.
function isMethod(line) {
  return /^\s*\{method\}/.test(line) || /[^\s(]\([^)]*\)/.test(line);
}

// Parses class/enum declarations. Returns { lines, decls } where each decl knows its line span.
function parseClassDecls(source) {
  const lines = String(source).split("\n");
  const decls = [];
  for (let i = 0; i < lines.length; i++) {
    const m = DECL.exec(lines[i]);
    if (!m) continue;
    const decl = { start: i, end: i, head: lines[i].replace(/\s*\{\s*$/, ""), indent: m[1], fields: [], methods: [] };
    if (m[6]) {
      let j = i + 1;
      for (; j < lines.length && !/^\s*\}\s*$/.test(lines[j]); j++) {
        const line = lines[j];
        if (!line.trim()) continue;
        (isMethod(line) ? decl.methods : decl.fields).push(line);
      }
      decl.end = j;
      i = j;
    }
    decls.push(decl);
  }
  return { lines, decls };
}

// A class box is never narrower than a MIN_CLASS_CHARS-character Korean name, so a two-letter
// class ("주문") doesn't shrink to a stub. Measured in the renderer's font: one Hangul syllable
// advances 0.865em (2 syllables = 89.96 at font-size 52), and the box adds 48 units (12 at
// scale 1) of padding around its widest line.
const MIN_CLASS_CHARS = 4;
const HANGUL_EM = 0.865;
const CLASS_PAD = 12;
function minClassWidth(fontSize) {
  return Math.ceil(MIN_CLASS_CHARS * HANGUL_EM * fontSize + CLASS_PAD);
}

// Rewrites a class-diagram source so every class/enum box has the same width (maxRectWidth, in the
// measuring SVG's units, divided by `scale` back into skinparam units, and at least
// minClassWidth(fontSize)) and the same height (all bodies padded to the same field and method
// line counts).
function uniformClassSource(source, maxRectWidth, scale, fontSize) {
  const floor = fontSize ? minClassWidth(fontSize) : 0;
  const width = Math.max(Math.ceil(maxRectWidth / scale), floor);
  const { lines, decls } = parseClassDecls(source);
  if (decls.length < 2) return (width > 0 ? `skinparam minClassWidth ${width}\n` : "") + String(source);
  const maxFields = Math.max(...decls.map((d) => d.fields.length));
  const maxMethods = Math.max(...decls.map((d) => d.methods.length));
  const out = [];
  let cursor = 0;
  for (const d of decls) {
    out.push(...lines.slice(cursor, d.start));
    const pad = d.indent + "  ";
    const body = [...d.fields];
    while (body.length < maxFields) body.push(pad + "<U+00A0>");
    const methods = [...d.methods];
    while (methods.length < maxMethods) methods.push(pad + "{method} <U+00A0>");
    out.push(d.head + " {", ...body, ...methods, d.indent + "}");
    cursor = d.end + 1;
  }
  out.push(...lines.slice(cursor));
  return (width > 0 ? `skinparam minClassWidth ${width}\n` : "") + out.join("\n");
}

// -- PlantUML state / usecase / sequence participants ---------------------------------------

const LABEL_DECL = {
  state: /^(\s*state\s+)"([^"]*)"(.*)$/,
  usecase: /^(\s*usecase\s+)"([^"]*)"(.*)$/,
  sequence: /^(\s*(?:participant|boundary|control|entity|database|collections|queue)\s+)"([^"]*)"(.*)$/,
};

// Labels that are one plain line; a "-" label is split into two differently sized lines by
// styleLabel() and a "\n" label is multi-line, so padding either would skew its layout.
function paddable(label) {
  return !label.includes("-") && !label.includes("\\n");
}

function uniformLabelSource(source, kind, widths, fontPx) {
  const re = LABEL_DECL[kind];
  if (!re) return String(source);
  const lines = String(source).split("\n");
  const labels = lines.map((line) => re.exec(line)).filter(Boolean).map((m) => m[2]);
  const measured = labels.filter((label) => widths.has(label.trim()));
  if (measured.length < 2) return String(source);
  const target = Math.max(...measured.map((label) => widths.get(label.trim())));
  const nbspWidth = NBSP_EM * fontPx;
  return lines.map((line) => {
    const m = re.exec(line);
    if (!m || !paddable(m[2]) || !widths.has(m[2].trim())) return line;
    const side = Math.round((target - widths.get(m[2].trim())) / (2 * nbspWidth));
    if (side <= 0) return line;
    const pad = NBSP.repeat(side);
    return m[1] + '"' + pad + m[2] + pad + '"' + m[3];
  }).join("\n");
}

module.exports = {
  NBSP_EM, MIN_CLASS_CHARS, minClassWidth, decode, textWidths, maxEntityRectWidth, parseClassDecls, uniformClassSource, uniformLabelSource,
};
