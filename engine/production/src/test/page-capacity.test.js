"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { overfullPages } = require("../generate");

test("overfull check uses the reduced text capacity of a page containing a diagram", () => {
  const pages = [
    { heading: "diagram", textCost: 240, capacity: 200 },
    { heading: "plain", textCost: 240, capacity: 450 },
    { heading: "exact fit", textCost: 200, capacity: 200 },
  ];
  const warnings = overfullPages({ pages });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /슬라이드 1.*20%/);
});

test("overfull check keeps the default capacity for legacy pages and skips cover/TOC", () => {
  const warnings = overfullPages({ pages: [
    { heading: "legacy", textCost: 495 },
    { isToc: true, textCost: 900, capacity: 200 },
    { isCover: true, textCost: 900, capacity: 200 },
  ] });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /10%/);
});
