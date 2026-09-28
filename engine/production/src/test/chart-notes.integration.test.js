"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { renderChart, pngSize } = require("../chartAdapter");
const { render } = require("../builder");
const { parse } = require("../parse");
const { readZip } = require("../zip");
const { parseXml, all, children, P, A } = require("../xml");
const { plain } = require("../text");

const { TEMPLATE_DIR: TEMPLATE } = require("../template");

test("matplotlib chart adapter emits a valid PNG and rejects bad specifications", async () => {
  const png = await renderChart({ type: "bar", labels: ["A", "B"], series: [{ name: "Count", values: [1, 2] }], title: "Test" });
  assert.equal(png.data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.deepEqual(pngSize(png.data), { width: png.width, height: png.height });
  await assert.rejects(() => renderChart("{"), /JSON 오류/);
  await assert.rejects(() => renderChart({ type: "pie", labels: ["A"], values: [1] }), /Chart 렌더 실패/);
});

test("the reference session packages its charts and one notes slide per authored topic", async () => {
  const source = fs.readFileSync(path.join(__dirname, "fixtures/reference-session.md"), "utf8");
  const { session, sections, toc } = parse(source);
  const output = path.join(os.tmpdir(), `tm-chart-notes-s01-${process.pid}-${Date.now()}.pptx`);
  try {
    const manifest = await render(sections, TEMPLATE, output, session, toc);
    const expectedQuotes = [];
    for (const section of sections) for (let i = 0; i < section.blocks.length - 1; i++) {
      if (section.blocks[i].text.trim() !== "**인용문**") continue;
      // the reference session authors quotes with straight ASCII double quotes ("..."), not curly ones -- the
      // renderer preserves whatever quote glyph is in the source, so the check must match that.
      const match = /^"([^"]+)"\s*,\s*(?:"([^"]+)"\s*,\s*)?(.+?)\s*$/.exec(section.blocks[i + 1].text);
      assert.ok(match, `quote syntax: ${section.heading}`);
      const korean = `"${match[1]}"`;
      const english = match[2] ? `"${match[2]}"` : null;
      const source = match[3];
      expectedQuotes.push({
        korean: plain(korean),
        english: english ? plain(english) : null,
        source: plain(source),
        full: plain(korean + ", " + (english ? english + ", " : "") + source),
      });
    }
    // TOC slides + at least one slide per topic, in order -- the reference session fixture
    // (AGENTS.md) and may split a topic (**페이지 분할**), so this tracks topics, not a fixed count.
    assert.deepEqual([...new Set(manifest.pages.filter((p) => !p.isToc).map((p) => String(p.heading).split("\n")[0].replace(/ \(\d+\/\d+\)$/, "")))], sections.map((s) => s.heading));
    const expectedCounts = Object.fromEntries(["mermaid", "plantuml", "chart", "svg"].map((kind) => [kind, sections.flatMap((s) => s.blocks).filter((b) => b.kind === kind).length]));
    assert.deepEqual(manifest.imageCounts, expectedCounts);
    assert.equal(manifest.pages.filter((page) => page.notes && page.notes.length).length, sections.filter((s) => s.notes.length).length);
    assert.equal(manifest.pages.filter((page) => page.visualLayout === "stacked" && (page.pictures || []).some((p) => p.kind === "chart")).length, expectedCounts.chart);
    // Prose visuals stack below the text; diagram–code pairs ("code-stacked") put the diagram above the code.
    assert.equal(manifest.pages.filter((page) => page.pictures && page.pictures.length).every((page) => ["stacked", "code-stacked"].includes(page.visualLayout)), true);
    for (const page of manifest.pages.filter((page) => page.visualLayout === "stacked" && page.pictures && page.pictures.length)) {
      for (const picture of page.pictures) assert.ok(picture.bounds.y >= 3.05);
    }

    const zip = await readZip(output);
    assert.equal(Array.from(zip.keys()).filter((name) => /^ppt\/media\/chart-\d+\.png$/.test(name)).length, expectedCounts.chart);
    assert.equal(Array.from(zip.keys()).filter((name) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name)).length, sections.filter((s) => s.notes.length).length);
    assert.ok(zip.has("ppt/notesMasters/notesMaster1.xml"));

    let chartPictures = 0, chartRelationships = 0, notesRelationships = 0;
    const renderedParagraphs = [];
    for (let i = 1; i <= manifest.pages.length; i++) {
      const slide = parseXml(zip.get(`ppt/slides/slide${i}.xml`));
      chartPictures += all(slide, P, "cNvPr").filter((e) => /^chart Diagram /.test(e.getAttribute("name"))).length;
      const rels = children(parseXml(zip.get(`ppt/slides/_rels/slide${i}.xml.rels`)).documentElement);
      chartRelationships += rels.filter((e) => /\/image$/.test(e.getAttribute("Type")) && /chart-/.test(e.getAttribute("Target"))).length;
      notesRelationships += rels.filter((e) => /\/notesSlide$/.test(e.getAttribute("Type"))).length;
      for (const paragraph of all(slide, A, "p")) {
        const runs = all(paragraph, A, "r").map((r) => ({
          text: all(r, A, "t").map((t) => t.textContent).join(""),
          size: Number(all(r, A, "rPr")[0] && all(r, A, "rPr")[0].getAttribute("sz")),
        }));
        if (runs.length) renderedParagraphs.push(runs);
      }
    }
    assert.equal(chartPictures, expectedCounts.chart);
    assert.equal(chartRelationships, expectedCounts.chart);
    assert.equal(notesRelationships, sections.filter((s) => s.notes.length).length);
    for (const quote of expectedQuotes) {
      // The Korean 18pt zone is rendered with richInline (see paragraphs.js), so authored
      // **bold** emphasis inside it splits into several runs -- no single run holds the whole
      // Korean string. Match the paragraph by its full joined text instead, then walk runs from
      // the front until they've accumulated the Korean text, asserting each of those is 1800pt,
      // and everything after (the flat English-original+source 10pt zone) is 1000pt.
      const runs = renderedParagraphs.find((items) => items.map((r) => r.text).join("") === quote.full);
      assert.ok(runs, `missing quote: ${quote.korean}`);
      let cursor = 0;
      let koreanText = "";
      while (cursor < runs.length && koreanText.length < quote.korean.length) {
        const run = runs[cursor];
        // runPlainParen shrinks parenthetical spans within the 18pt zone to 14pt (size-4),
        // Korean or English alike -- a legitimate typography rule, not a defect. Anything else
        // in this zone must be the full 18pt.
        const isParenSpan = /^\(.*\)$/.test(run.text);
        assert.equal(run.size, isParenSpan ? 1400 : 1800, `korean-zone run wrong size: "${run.text}"`);
        koreanText += run.text;
        cursor++;
      }
      assert.equal(koreanText, quote.korean);
      for (; cursor < runs.length; cursor++) {
        assert.equal(runs[cursor].size, 1000, `citation-zone run not 10pt: "${runs[cursor].text}"`);
      }
    }

    for (let i = 0; i < sections.length; i++) {
      const pageNumber = manifest.pages.findIndex((page) => page.notes === sections[i].notes) + 1;
      assert.ok(pageNumber > 1);
      const notes = parseXml(zip.get(`ppt/notesSlides/notesSlide${pageNumber}.xml`));
      const actual = all(notes, A, "t").map((e) => e.textContent).join("\n");
      for (const block of sections[i].notes) assert.ok(actual.includes(plain(block.text)));
    }

    const visible = Array.from(zip.entries())
      .filter(([name]) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .map(([, data]) => data.toString("utf8")).join("\n");
    assert.equal(visible.includes('"type": "bar"'), false);
    assert.equal(visible.includes("**Chart — matplotlib**"), false);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});
