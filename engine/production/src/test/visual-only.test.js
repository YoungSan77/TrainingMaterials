"use strict";
// production-guide.md "Visual layout 및 가독성": a diagram that would read below MIN_PT while
// sharing its slide gets a slide of its own at the full body area before it is ever shrunk below
// MIN_PT; below MIN_PT stays only when even that slide cannot hold it.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render, pictureTextPt, MIN_PT } = require("../builder");
const { TEMPLATE_DIR } = require("../template");

// An authored SVG whose text reads at 10pt when it is 8in x 6.7in -- too tall to share a slide
// with its text at MIN_PT, small enough to fit a slide of its own.
const TALL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="768" height="640" viewBox="0 0 768 640">'
  + '<rect width="768" height="640" fill="#fff" stroke="#000"/><text x="20" y="40" font-size="10">도식</text></svg>';

function topic(svg) {
  const lines = Array.from({ length: 6 }, (_, i) => `- **${i + 1}번째** 설명 문장은 도식 앞의 본문을 한 줄씩 채운다.`);
  return "## 01. 도식\n\n도식 앞에 **본문**이 길게 이어진다.\n\n" + lines.join("\n") + "\n\n**도식 — SVG**\n\n```svg\n" + svg + "\n```\n";
}

async function pages(md) {
  const { sections } = parse(md);
  const toc = [{ kind: "bullet", text: sections[0].title, rows: [], depth: 0, meta: null }];
  const out = path.join(os.tmpdir(), `tm-visual-only-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, "테스트", toc)).pages.filter((p) => !p.isToc);
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

test("a diagram too small beside its text moves to a slide of its own at MIN_PT or more", async () => {
  const ps = await pages(topic(TALL_SVG));
  const withPic = ps.filter((p) => (p.pictures || []).length);
  assert.equal(withPic.length, 1);
  const [p] = withPic;
  assert.equal(p.visualLayout, "visual-only");
  assert.ok(p.items.every((it) => !(it.text && it.text.trim())), "the diagram's slide carries no text");
  assert.ok(pictureTextPt(p.pictures[0], p.pictures[0].bounds) >= MIN_PT - 0.05);
  assert.ok(ps.length >= 2, "the text keeps its own slide");
});

test("a diagram that cannot reach MIN_PT even alone stays beside its text (and is reported)", async () => {
  const huge = TALL_SVG.replace(/768/g, "3072").replace(/640/g, "2560");
  const ps = await pages(topic(huge));
  const withPic = ps.filter((p) => (p.pictures || []).length);
  assert.equal(withPic.length, 1);
  assert.notEqual(withPic[0].visualLayout, "visual-only");
  assert.ok(pictureTextPt(withPic[0].pictures[0], withPic[0].pictures[0].bounds) < MIN_PT);
});
