"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { inspect } = require("../inspect");

const { TEMPLATE_DIR: TEMPLATE } = require("../template");

// validateToc() requires one numbered-bullet TOC entry per section, text-identical to that
// section's own title -- these synthetic tests build sections directly (never through parse()),
// so the matching toc has to be built by hand too, same as parse() would for a real "## 목차".
function tocFor(sections) {
  return sections.map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0, meta: null }));
}

async function rendered(sections, name) {
  const output = path.join(os.tmpdir(), `tm-phase2-${name}-${process.pid}-${Date.now()}.pptx`);
  try {
    const manifest = await render(sections, TEMPLATE, output, "Composition Test", tocFor(sections));
    const report = await inspect(output, manifest);
    assert.deepEqual(report.errors, []);
    return manifest;
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
}

function topic(heading, blocks, notes = [{ kind: "text", text: "speaker-only", rows: [], depth: 0, meta: null }]) {
  return { heading, title: heading, blocks, notes };
}

const text = (value) => ({ kind: "text", text: value, rows: [], depth: 0, meta: null });
const bullet = (value) => ({ kind: "bullet", text: value, rows: [], depth: 0, meta: null });
const visual = (kind, source) => ({ kind, text: source, rows: [], depth: 0, meta: null });

test("visuals and notes do not create slides or expose authored source", async () => {
  const sections = [
    topic("A", [text("mermaid prose"), visual("mermaid", "flowchart LR; A-->B")]),
    topic("B", [text("plantuml prose"), visual("plantuml", "@startuml\nA -> B\n@enduml")]),
    topic("C", [text("chart prose"), visual("chart", '{"type":"bar","labels":["A"],"series":[{"name":"Count","values":[1]}]}')]),
    topic("E", [bullet("1. ordered item")]),
  ];
  const m = await rendered(sections, "visuals");
  assert.equal(m.pages.length, 1 + sections.length, "one TOC plus one slide per topic");
  assert.equal(m.unsupportedVisuals.length, 0);
  assert.equal(m.images, 3);
  assert.deepEqual(m.imageCounts, { mermaid: 1, plantuml: 1, chart: 1, svg: 0 });
  const visible = m.pages.flatMap((p) => p.items.map((item) => item.text)).join("\n");
  for (const hidden of ["flowchart LR", "@startuml", '"type":"bar"', "speaker-only"]) {
    assert.equal(visible.includes(hidden), false);
  }
  assert.equal(visible.includes("1. ordered item"), true);
});

test("table keeps a fitting lead on the same logical slide and excludes notes", async () => {
  const table = { kind: "table", text: "", depth: 0, meta: null, rows: [["Key", "Value"], ["A", "1"]] };
  const m = await rendered([topic("D", [text("table introduction"), table])], "table");
  assert.equal(m.pages.length, 2, "one TOC plus one topic slide");
  assert.equal(m.pages[1].items.some((item) => item.text.includes("table introduction")), true);
  assert.equal(m.pages[1].items.some((item) => item.kind === "table"), true);
});

test("real prose overflow still creates continuation slides without content loss", async () => {
  const blocks = Array.from({ length: 12 }, (_, i) => text(`paragraph-${i} ` + "content ".repeat(18)));
  const m = await rendered([topic("F", blocks)], "overflow");
  assert.ok(m.pages.length > 2, "one topic must continue after the first content slide");
  const visible = m.pages.slice(1).flatMap((p) => p.items.map((item) => item.text)).join("\n");
  for (let i = 0; i < blocks.length; i++) assert.equal(visible.includes(`paragraph-${i}`), true);
  assert.match(m.pages[1].heading, /\(1\/\d+\)$/);
});

test("the reference session composes its topics without visual or notes slides", async () => {
  const source = fs.readFileSync(path.join(__dirname, "fixtures/reference-session.md"), "utf8");
  const { session, sections, toc } = parse(source);
  assert.equal(sections.length, 35);
  const output = path.join(os.tmpdir(), `tm-phase2-s01-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE, output, session, toc);
    const report = await inspect(output, m);
    assert.deepEqual(report.errors, []);
    // These figures belong to the frozen fixture (fixtures/reference-session.md), not to the live
    // course: editing the course never changes them.
    assert.equal(m.pages.length, 45, "TOC 2 + 43 content slides (split and overflowing topics)");
    assert.equal(m.unsupportedVisuals.length, 0);
    assert.equal(m.images, 17);
    assert.deepEqual(m.imageCounts, { mermaid: 9, plantuml: 7, chart: 1, svg: 0 });
    assert.equal(m.pages.filter((p) => p.items.length === 0).length, 2, "only the two TOC slides have no body items");
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});
