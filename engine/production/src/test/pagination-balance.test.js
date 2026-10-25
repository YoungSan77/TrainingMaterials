"use strict";
// Pagination of a continuous text answer (the appendix after the summary): a sub-heading never
// ends a slide, and a slide is filled before the next one starts.
const test = require("node:test");
const assert = require("node:assert/strict");
const { Builder } = require("../builder");
const { shape, body } = require("../xml");
const { TEMPLATE_DIR } = require("../template");

const block = (kind, text) => ({ kind, text, rows: [], depth: 0, meta: null });
const textOf = (page) => (body(shape(page.doc, 8)).textContent || "").replace(/\s+/g, " ").trim();

async function builder() {
  const b = new Builder(TEMPLATE_DIR);
  await b.init("Pagination Test");
  return b;
}

test("a `###` heading never ends a slide; it moves down with the content it opens", async () => {
  const b = await builder();
  const blocks = [];
  for (let i = 0; i < 12; i++) blocks.push(block("bullet", "항목 " + i + " 설명이다."));
  blocks.push(block("heading", "다음 절"));
  blocks.push(block("bullet", "긴 항목 " + "설명이 계속 이어진다. ".repeat(6)));
  blocks.push(block("bullet", "이어지는 둘째 항목."));
  b.flush(blocks, "01. 문서");
  assert.equal(b.pages.length, 2);
  assert.ok(!textOf(b.pages[0]).includes("다음 절"), "the heading stays with what follows it");
  assert.ok(textOf(b.pages[1]).includes("다음 절"));
});

test("a slide is filled before the next one starts; the last takes the remainder", async () => {
  const b = await builder();
  const blocks = Array.from({ length: 16 }, (_, i) => block("bullet", "항목 " + i + " 설명이다."));
  b.flush(blocks, "01. 문서");
  assert.equal(b.pages.length, 2);
  const [first, last] = b.pages;
  const fill = (p) => (p.fillParts || [])[(p.fillParts || []).length - 1] || 0;
  // Balancing the tail is not allowed to empty the slide before it: a 98% slide followed by a
  // 30% one is the correct shape when the text simply ends there.
  assert.ok(fill(first) >= 0.9, "the first slide is filled before the second starts (" + Math.round(fill(first) * 100) + "%)");
  assert.ok(last.textItems.length > 0, "the remainder goes on the last slide");
  assert.ok(last.textCost < first.textCost, "the last slide carries the remainder, not a re-balanced copy");
});

test("the last slide of a topic may take a remainder that slightly exceeds the budget", async () => {
  const { overfullPages } = require("../generate");
  const page = (heading, cost) => ({ heading, items: [{ kind: "body" }], textCost: cost });
  const m = { pages: [
    page("01. 주제 (1/2)", 450),
    page("01. 주제 (2/2)", 470),
    page("02. 주제 (1/2)", 470),
  ] };
  const w = overfullPages(m);
  // The last page has nowhere to move its text to; the middle page has, so it is reported.
  assert.equal(w.length, 1);
  assert.match(w[0], /슬라이드 3/);
});
