"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { renderMermaid, pngSize } = require("../mermaidAdapter");
const { render } = require("../builder");
const { parse } = require("../parse");
const { readZip } = require("../zip");
const { parseXml, all, P, children } = require("../xml");

const ROOT = path.resolve(__dirname, "../../../..");
const TEMPLATE = path.join(ROOT, "references/production/lecture-java-baseline/templates/approved.pptx");

const text = (value) => ({ kind: "text", text: value, rows: [], depth: 0, meta: null });
const mermaid = (source) => ({ kind: "mermaid", text: source, rows: [], depth: 0, meta: null });

test("Mermaid source renders to a valid PNG", async () => {
  const png = await renderMermaid({ source: "flowchart LR\n A[Start] --> B[End]" });
  assert.equal(png.data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.deepEqual(pngSize(png.data), { width: png.width, height: png.height });
  assert.ok(png.width > 100 && png.height > 40);
});

test("two Mermaid diagrams with no separating text each get their own slide and produce valid OOXML image parts", async () => {
  const sourceA = "flowchart LR\n A[One] --> B[Two]";
  const sourceB = "flowchart TB\n C[Three] --> D[Four]";
  const section = { heading: "Multiple", title: "Multiple", blocks: [text("preserved prose"), mermaid(sourceA), mermaid(sourceB)], notes: [text("hidden note")] };
  const output = path.join(os.tmpdir(), `tm-mermaid-multiple-${process.pid}-${Date.now()}.pptx`);
  try {
    const toc = [{ kind: "bullet", text: section.title, rows: [], depth: 0, meta: null }];
    const manifest = await render([section], TEMPLATE, output, "Mermaid Test", toc);
    // With no flush text separating the two visuals, the second one can't share the first's
    // slide -- each gets its own slide. TOC + 2 topic slides.
    assert.equal(manifest.pages.length, 3, "TOC plus one slide per Mermaid diagram");
    assert.equal(manifest.imageCounts.mermaid, 2);
    const zip = await readZip(output);
    const templateZip = await readZip(TEMPLATE);
    assert.deepEqual(zip.get("ppt/media/image1.png"), templateZip.get("ppt/media/image1.png"), "template media is not overwritten");
    const media = Array.from(zip.keys()).filter((name) => /^ppt\/media\/mermaid-\d+\.png$/.test(name));
    assert.equal(media.length, 2);
    for (const name of media) assert.equal(zip.get(name).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    const slide2Xml = zip.get("ppt/slides/slide2.xml").toString("utf8");
    const slide3Xml = zip.get("ppt/slides/slide3.xml").toString("utf8");
    assert.equal(all(parseXml(slide2Xml), P, "pic").length, 1);
    assert.equal(all(parseXml(slide3Xml), P, "pic").length, 1);
    const bothSlides = slide2Xml + slide3Xml;
    assert.equal(bothSlides.includes(sourceA), false);
    assert.equal(bothSlides.includes(sourceB), false);
    assert.equal(bothSlides.includes("preserved prose"), true);
    assert.equal(bothSlides.includes("hidden note"), false);
    let imageRels = 0;
    for (const rel of ["ppt/slides/_rels/slide2.xml.rels", "ppt/slides/_rels/slide3.xml.rels"]) {
      const rels = parseXml(zip.get(rel));
      imageRels += children(rels.documentElement).filter((e) => e.getAttribute("Type").endsWith("/image")).length;
    }
    assert.equal(imageRels, 2);
    const types = zip.get("[Content_Types].xml").toString("utf8");
    assert.match(types, /Extension="png" ContentType="image\/png"/);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test("invalid Mermaid fails explicitly instead of falling back to source text", async () => {
  await assert.rejects(() => renderMermaid({ source: "flowchart LR\n A[broken" }), /Mermaid 렌더 실패/);
});

test("s01 packages all 14 Mermaid diagrams", async () => {
  const source = fs.readFileSync(path.join(ROOT, "courses/ooad/sessions/s01.md"), "utf8");
  const { session, sections, toc } = parse(source);
  const output = path.join(os.tmpdir(), `tm-mermaid-s01-${process.pid}-${Date.now()}.pptx`);
  try {
    const manifest = await render(sections, TEMPLATE, output, session, toc);
    const mermaidCount = sections.flatMap((s) => s.blocks).filter((b) => b.kind === "mermaid").length;
    assert.equal(manifest.imageCounts.mermaid, mermaidCount);
    // TOC(1) + one slide per topic -- s01.md is the Session Authoring baseline (AGENTS.md), so
    // this tracks its actual current topic count rather than an old fixed number.
    assert.equal(manifest.pages.length, sections.length + 1);
    const zip = await readZip(output);
    assert.equal(Array.from(zip.keys()).filter((name) => /^ppt\/media\/mermaid-\d+\.png$/.test(name)).length, mermaidCount);
    let imageRelationships = 0, pictures = 0;
    for (let i = 1; i <= manifest.pages.length; i++) {
      pictures += all(parseXml(zip.get(`ppt/slides/slide${i}.xml`)), P, "pic").length;
      imageRelationships += children(parseXml(zip.get(`ppt/slides/_rels/slide${i}.xml.rels`)).documentElement)
        .filter((e) => e.getAttribute("Type").endsWith("/image")).length;
    }
    assert.equal(pictures, manifest.images);
    assert.equal(imageRelationships, manifest.images);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});
