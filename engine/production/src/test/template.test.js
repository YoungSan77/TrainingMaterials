"use strict";
// The deck skeleton (engine/production/template/) is part of the renderer: builder.js clones one
// prototype slide per page kind and fills it. These checks keep it a skeleton -- the prototypes
// the renderer expects, and no content left over from any earlier deck.
const test = require("node:test");
const assert = require("node:assert/strict");
const { TEMPLATE_DIR, ORIGIN, readTemplate, slideParts } = require("../template");
const { parseXml, all, A, P } = require("../xml");

const data = readTemplate(TEMPLATE_DIR);
const origins = slideParts(data);

test("the template holds exactly one prototype slide per page kind", () => {
  assert.equal(origins.length, Object.keys(ORIGIN).length);
  for (const name of origins) assert.ok(data.has(name), name + " is listed in presentation.xml but missing");
  const slideFiles = [...data.keys()].filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k));
  assert.deepEqual(slideFiles.sort(), [...origins].sort(), "no slide part outside presentation.xml's list");
});

test("every prototype has a slide-number placeholder (builder.js numbers pages through it)", () => {
  for (const name of origins) {
    const doc = parseXml(data.get(name));
    assert.ok(all(doc, P, "ph").some((ph) => ph.getAttribute("type") === "sldNum"), name);
  }
});

test("prototype slides carry no leftover text", () => {
  for (const name of origins) {
    const leftover = all(parseXml(data.get(name)), A, "t").map((t) => t.textContent).filter((s) => s.trim() !== "");
    assert.deepEqual(leftover, [], name);
  }
});
