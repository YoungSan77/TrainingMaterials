"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { renderPlantUml, pngSize } = require("../plantumlAdapter");
const { render } = require("../builder");
const { parse } = require("../parse");
const { readZip } = require("../zip");
const { parseXml, all, P, A, children } = require("../xml");

const { TEMPLATE_DIR: TEMPLATE } = require("../template");

test("reference session PlantUML renders and follows the shared OOXML picture path", async () => {
  const source = fs.readFileSync(path.join(__dirname, "fixtures/reference-session.md"), "utf8");
  const { session, sections, toc } = parse(source);
  const uml = sections.flatMap((section) => section.blocks).find((block) => block.kind === "plantuml");
  assert.ok(uml);
  const png = await renderPlantUml({ kind: uml.meta.uml, source: uml.text });
  assert.equal(png.data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.deepEqual(pngSize(png.data), { width: png.width, height: png.height });

  const output = path.join(os.tmpdir(), `tm-plantuml-s01-${process.pid}-${Date.now()}.pptx`);
  try {
    const manifest = await render(sections, TEMPLATE, output, session, toc);
    const expectedCounts = Object.fromEntries(["mermaid", "plantuml", "chart", "svg"].map((kind) => [kind, sections.flatMap((s) => s.blocks).filter((b) => b.kind === kind).length]));
    assert.deepEqual(manifest.imageCounts, expectedCounts);
    // TOC(1) + one slide per topic -- tracks s01.md's actual current topic count (see mermaid
    // integration test's comment: the reference session fixture, not a fixed fixture).
    assert.deepEqual([...new Set(manifest.pages.filter((p) => !p.isToc).map((p) => String(p.heading).split("\n")[0].replace(/ \(\d+\/\d+\)$/, "")))], sections.map((s) => s.heading));
    const zip = await readZip(output);
    assert.equal(Array.from(zip.keys()).filter((name) => /^ppt\/media\/plantuml-\d+\.png$/.test(name)).length, expectedCounts.plantuml);
    assert.equal(Array.from(zip.keys()).filter((name) => /^ppt\/media\/mermaid-\d+\.png$/.test(name)).length, expectedCounts.mermaid);
    let plantumlRelationships = 0, pictures = 0, sourceExposed = false, prosePreserved = false;
    for (let i = 1; i <= manifest.pages.length; i++) {
      const slide = zip.get(`ppt/slides/slide${i}.xml`).toString("utf8");
      const doc = parseXml(slide);
      pictures += all(doc, P, "pic").length;
      sourceExposed ||= slide.includes("@startuml") || slide.includes("Customer -&gt; OrderService");
      // Bold markdown ("**메시징**") splits its word into its own <a:t> run, so a raw-XML
      // substring check would never see "객체지향은 오직 메시징" contiguously -- concatenate
      // the actual text runs first, same as the lecture-java-baseline integration test does.
      const slideText = all(doc, A, "t").map((t) => t.textContent).join("");
      prosePreserved ||= slideText.includes("객체지향은 오직 메시징");
      plantumlRelationships += children(parseXml(zip.get(`ppt/slides/_rels/slide${i}.xml.rels`)).documentElement)
        .filter((e) => /\/image$/.test(e.getAttribute("Type")) && /plantuml-/.test(e.getAttribute("Target"))).length;
    }
    assert.equal(pictures, manifest.images);
    assert.equal(plantumlRelationships, expectedCounts.plantuml);
    assert.equal(sourceExposed, false);
    assert.equal(prosePreserved, true);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test("invalid PlantUML fails explicitly", async () => {
  await assert.rejects(() => renderPlantUml({ kind: "unsupported", source: "class A" }), /지원 범위 밖/);
  await assert.rejects(() => renderPlantUml({ kind: "sequence", source: "" }), /source가 비어/);
});
