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

// An authored SVG whose text reads at 10pt when it is 8in x 10.4in -- too tall to share a slide
// with its text at MIN_PT, small enough to fit a slide of its own.
// 2026-11-27: 띠가 남은 높이를 다 가져가게 바뀌어 예전 높이(640)는 본문 옆에서도 8pt로 읽혔다.
// 이 검사가 보는 것은 **그 문턱을 넘지 못하는 도식**이다. 실측으로 고른 높이다 — 800이면 본문
// 옆에서 7pt로 남고, 1200이면 제 장에서도 MIN_PT에 못 미쳐 타일로 간다.
const TALL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1000" viewBox="0 0 768 1000">'
  + '<rect width="768" height="1000" fill="#fff" stroke="#000"/><text x="20" y="40" font-size="10">도식</text></svg>';

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

test("a diagram that cannot reach MIN_PT even alone uses overlapping original-image viewports", async () => {
  const huge = TALL_SVG.replace(/768/g, "3072").replace(/1000/g, "2560");
  const ps = await pages(topic(huge));
  const withPic = ps.filter((p) => (p.pictures || []).length);
  assert.ok(withPic.length>1);
  for(const page of withPic){assert.equal(page.visualLayout,'visual-tiles');for(const pic of page.pictures){assert.ok(pic.crop);assert.ok(pictureTextPt(pic,pic.bounds)>=MIN_PT-0.05);}}
  assert.ok(withPic.some(page=>page.pictures.some(pic=>pic.crop.l===0 && pic.crop.t===0)));
  assert.ok(withPic.some(page=>page.pictures.some(pic=>pic.crop.r===0 && pic.crop.b===0)));
});

test("a wide diagram uses the full body band before separating from its governing message", async () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1456" height="160" viewBox="0 0 1456 160">'
    + '<rect width="1456" height="160" fill="#fff" stroke="#000"/><text x="20" y="40" font-size="16">도식</text></svg>';
  const ps = await pages('## 01. 도식\n\n첫 구간이다.\n\n**페이지 분할**\n\n### 작업 조건과 검증\n\n**확정한 조건**으로 작업하고 결과를 검사한다.\n\n**도식 — SVG — 작업 흐름**\n\n```svg\n' + svg + '\n```\n\n- 불일치 원인을 확인한다.\n- 기존 테스트를 참조한다.');
  assert.equal(ps.length, 2, 'the explicit two segments stay on two slides');
  assert.equal((ps[0].pictures || []).length, 0);
  const p = ps[1];
  assert.equal(p.pictures.length, 1);
  assert.ok(p.items.some(it => (it.text || '').includes('확정한 조건')));
  assert.ok(pictureTextPt(p.pictures[0], p.pictures[0].bounds) >= MIN_PT - 0.05);
  assert.notEqual(p.visualLayout, 'visual-only');
});
