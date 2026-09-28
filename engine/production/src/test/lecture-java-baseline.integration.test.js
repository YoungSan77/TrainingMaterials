"use strict";
// Regression coverage for the "auto" (builder.js) pipeline against the original
// lecture-java-baseline manuscript (fixtures/lecture-java-baseline/input.md) -- the
// content this whole renderer was ported from (see parse.js/builder.js's "Direct port of
// LecturePpt..." comments). That file predates the Session/TOC header convention the "auto"
// pipeline now requires, so this test wraps it with a synthetic header + TOC derived from its own
// "### N. Title" headings, rather than editing the reference file itself.
//
// This test exists because manually exercising this manuscript surfaced a real defect: the
// checked-in template's code prototype slide once carried a leftover shape (id=50, "Code
// continuation 50") baked in from a stale renderer run against this exact input -- every code
// block silently inherited that garbage text
// alongside its real content. See the "no stray shapes" test below, which guards against that
// class of template corruption recurring.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { render } = require("../builder");
const { parse } = require("../parse");
const { readZip } = require("../zip");
const { parseXml, all, P, A, shape, text } = require("../xml");

const { TEMPLATE_DIR: TEMPLATE } = require("../template");
const RAW_INPUT = fs.readFileSync(path.join(__dirname, "fixtures/lecture-java-baseline/input.md"), "utf8");

// The known-good set of shape ids/names for each template origin page, captured from a template
// with no stray shapes. Anything beyond this on a rendered "code" page is leftover corruption
// (see header comment), not legitimate content -- the renderer only ever writes to id=31.
const EXPECTED_CODE_SHAPE_IDS = new Set(["2", "3", "5", "6", "7", "31"]);

function wrapWithSessionHeader(raw) {
  const headings = Array.from(raw.matchAll(/^### (.+)$/gm), (m) => m[1]);
  assert.ok(headings.length > 0, "lecture-java-baseline input.md must have at least one '### N. Title' heading");
  const toc = headings.map((h) => h).join("\n");
  const body = raw.replace(/^### /gm, "## ").replace(/^#### /gm, "### ");
  return {
    headings,
    source: [
      "--------------------",
      "Session 명: 테스트. lecture-java-baseline 회귀",
      "--------------------",
      "",
      "## 목차",
      "",
      toc,
      "",
      body,
    ].join("\n"),
  };
}

test("lecture-java-baseline input.md renders end to end through the auto pipeline without loss", async () => {
  const { headings, source } = wrapWithSessionHeader(RAW_INPUT);
  const { session, sections, toc } = parse(source);
  assert.equal(sections.length, headings.length, "every '### N. Title' topic in the manuscript must become its own section");

  const output = path.join(os.tmpdir(), `tm-lecture-baseline-${process.pid}-${Date.now()}.pptx`);
  try {
    const manifest = await render(sections, TEMPLATE, output, session, toc);
    assert.ok(manifest.pages.length > 0, "must produce at least one slide");

    const zip = await readZip(output);
    const slideKeys = Array.from(zip.keys()).filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a, b) => {
      const na = Number(a.match(/(\d+)/)[1]);
      const nb = Number(b.match(/(\d+)/)[1]);
      return na - nb;
    });
    assert.equal(slideKeys.length, manifest.pages.length);

    // -- No stray/leftover shapes on any generated "code" slide (regression guard: see header). --
    let codeSlidesChecked = 0;
    for (const [slideIndex, key] of slideKeys.entries()) {
      const doc = parseXml(zip.get(key));
      const hasCodeShape = (() => { try { shape(doc, 31); return true; } catch (e) { return false; } })();
      if (!hasCodeShape) continue;
      codeSlidesChecked++;
      // Shapes the renderer authored on purpose (e.g. the lead text above source code) are recorded
      // in the page manifest; anything else beyond the template set is leftover corruption.
      const authored = new Set(manifest.pages[slideIndex].items.map((it) => String(it.id)));
      const ids = all(doc, P, "sp").map((sp) => sp.getElementsByTagNameNS(P, "cNvPr")[0].getAttribute("id"));
      for (const id of ids) {
        assert.ok(EXPECTED_CODE_SHAPE_IDS.has(id) || authored.has(id), `slide ${key} has an unexpected shape id=${id} beyond the known template set -- likely leftover template corruption, not authored content`);
      }
    }
    assert.ok(codeSlidesChecked > 0, "the manuscript's Java/SQL code blocks must actually reach the code template (id=31)");

    // -- LaTeX arrow macros ($\rightarrow$) in the comparison table must normalize to "→", never leak raw. --
    const allText = slideKeys.map((k) => all(parseXml(zip.get(k)), A, "t").map((t) => t.textContent).join("")).join("\n");
    assert.equal(allText.includes("\\rightarrow"), false, "raw LaTeX arrow macro must never appear in rendered slide text");
    assert.ok(allText.includes("MVC → Service → DB"), "the comparison table's arrow chains must render with a real arrow glyph");

    // -- Content fidelity spot checks: representative code identifiers from each topic must survive intact. --
    for (const needle of ["ProductMapper", "OrderService", "PlaceOrderUseCase", "OrderRepository", "PlaceOrderInteractor", "src/main/java/com/example/order"]) {
      assert.ok(allText.includes(needle), `expected "${needle}" to survive into the rendered deck`);
    }

    // -- "Java"/"SQL"/"Plaintext" language-label lines are stripped, never rendered as literal body text. --
    for (const label of ["SQL", "Java", "Plaintext"]) {
      const asOwnLine = new RegExp(`(?:^|\\n)${label}(?:\\n|$)`);
      assert.equal(asOwnLine.test(allText), false, `the "${label}" language-label line must be consumed by the parser, not shown as slide text`);
    }

    // -- "**디렉토리 구조**"/"**주요 구현 코드**" markers are consumed, never rendered as literal text. --
    assert.equal(allText.includes("디렉토리 구조"), false);
    assert.equal(allText.includes("주요 구현 코드"), false);
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test("the template's code prototype carries no leftover shapes beyond the ones the renderer writes to", () => {
  // A direct check on the checked-in template itself (not just a rendered clone of it), so this
  // fails immediately and specifically if the corruption described in the header comment recurs,
  // rather than only showing up indirectly via the end-to-end test above.
  const { readTemplate, slideParts, ORIGIN } = require("../template");
  const data = readTemplate(TEMPLATE);
  const codeOriginKey = slideParts(data)[ORIGIN.code];
  const doc = parseXml(data.get(codeOriginKey));
  const ids = all(doc, P, "sp").map((sp) => sp.getElementsByTagNameNS(P, "cNvPr")[0].getAttribute("id"));
  for (const id of ids) {
    assert.ok(EXPECTED_CODE_SHAPE_IDS.has(id), `template's own code origin (${codeOriginKey}) has an unexpected shape id=${id}`);
  }
});
