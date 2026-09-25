"use strict";
// Phase 1 verification (logical topic model): parse.js must classify Mermaid/PlantUML/Chart as
// explicit block kinds (never "code"), must route "**강사 노트**" content into section.notes
// (never section.blocks), and must not lose or reorder any topic/content while doing so. This is
// a parse-only check -- it never touches generate.js/builder.js/referenceRenderer.js, since Phase
// 1 does not modify any renderer.
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const { parse } = require("../parse");

const INPUT = path.resolve(__dirname, "../../../../courses/ooad/sessions/s01.md");
const raw = fs.readFileSync(INPUT, "utf-8");

function fenceCount(lang) {
  const re = new RegExp("^```" + lang + "\\s*$", "gm");
  return (raw.match(re) || []).length;
}

const { session, sections } = parse(raw);

assert.equal(session, "01. OOAD 개요");
assert.equal(sections.length, 26);
// "## 목차" is the manuscript's manual TOC heading, not a topic -- parse() correctly excludes it
// from `sections` (see parse.js's TOC_HEADING handling), so this raw-regex scan of "## " headings
// must exclude it too, or the two lists differ by one entry regardless of any real topic drift.
const expectedHeadings = Array.from(raw.matchAll(/^## (.+)$/gm), (m) => m[1]).filter((h) => h !== "목차");
assert.deepEqual(sections.map((s) => s.heading), expectedHeadings);
assert.deepEqual(sections.map((s) => s.title), expectedHeadings, "legacy title alias remains compatible");

// Every topic must carry a non-empty notes list (s01.md has exactly one "강사 노트" marker
// per topic, confirmed by `grep -c '강사 노트' s01.md` == 26 == topic count).
const notesMarkerCount = (raw.match(/^\*\*강사 노트\*\*$/gm) || []).length;
assert.equal(notesMarkerCount, sections.length);
let topicsWithNotes = 0;
for (const s of sections) if (s.notes.length > 0) topicsWithNotes++;
assert.equal(topicsWithNotes, sections.length);

// The marker itself must never survive as a block (in either blocks or notes), and no block's
// text may literally be the marker string -- it is consumed, not emitted.
let markerLeaked = false;
for (const s of sections) {
  for (const b of [...s.blocks, ...s.notes]) {
    if (b.text != null && String(b.text).trim() === "**강사 노트**") markerLeaked = true;
  }
}
assert.equal(markerLeaked, false);

// Kind counts, cross-checked against raw fence-language counts in the source file.
const kindCounts = { mermaid: 0, plantuml: 0, chart: 0, tree: 0, code: 0, table: 0, bullet: 0, text: 0, heading: 0 };
for (const s of sections) for (const b of s.blocks) kindCounts[b.kind] = (kindCounts[b.kind] || 0) + 1;

const expectedMermaid = fenceCount("mermaid");
const expectedChart = fenceCount("chart") + fenceCount("matplotlib");
const expectedPlantuml = fenceCount("plantuml(?::\\w+)?");
assert.equal(kindCounts.mermaid, expectedMermaid);
assert.equal(kindCounts.chart, expectedChart);
assert.equal(kindCounts.plantuml, expectedPlantuml);
assert.ok(kindCounts.text > 0);
assert.ok(kindCounts.bullet > 0);

// None of mermaid/plantuml/chart source text may be classified as "code" (the pre-Phase-1 defect).
let miscClassified = 0;
for (const s of sections) {
  for (const b of s.blocks) {
    if (b.kind === "code" && /^(flowchart|sequenceDiagram|classDiagram|graph |@startuml)/m.test(b.text)) miscClassified++;
  }
}
assert.equal(miscClassified, 0);

for (const s of sections) {
  const ordinarySource = s.blocks
    .filter((b) => b.kind === "text" || b.kind === "code")
    .map((b) => b.text);
  for (const visual of s.blocks.filter((b) => ["mermaid", "plantuml", "chart"].includes(b.kind))) {
    assert.equal(ordinarySource.includes(visual.text), false, `${s.heading}: visual source duplicated`);
  }
  const noteText = new Set(s.notes.map((b) => b.text));
  assert.equal(s.blocks.some((b) => noteText.has(b.text)), false, `${s.heading}: note leaked into blocks`);
}

// plantuml block must carry its declared subtype in meta.uml.
let plantumlMeta = null;
for (const s of sections) for (const b of s.blocks) if (b.kind === "plantuml") plantumlMeta = b.meta;
assert.equal(plantumlMeta && plantumlMeta.uml, "sequence");

// Compatibility fixture: legacy block kinds remain available; an inline occurrence and a
// code-fence occurrence of the marker must not switch the parser into notes mode.
const fixture = [
  "## Topic", "paragraph with **강사 노트** inline", "", "- bullet", "1. ordered", "",
  "> quote", "", "| A | B |", "|---|---|", "| 1 | 2 |", "", "```js",
  "const marker = '**강사 노트**';", "```", "**강사 노트**", "speaker note"
].join("\n");
const fixtureTopic = parse(fixture).sections[0];
assert.deepEqual(fixtureTopic.blocks.map((b) => b.kind), ["text", "bullet", "bullet", "text", "table", "code"]);
assert.equal(fixtureTopic.blocks[5].text, "const marker = '**강사 노트**';");
assert.deepEqual(fixtureTopic.notes.map((b) => b.text), ["speaker note"]);

console.log(JSON.stringify({
  session,
  topics: sections.length,
  mermaid: kindCounts.mermaid,
  plantuml: kindCounts.plantuml,
  chart: kindCounts.chart,
  topicsWithNotes
}));
