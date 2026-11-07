"use strict";
// viewBox 밖으로 나간 내용은 rsvg-convert가 그리지 않는다. 슬라이드 배치는 맞는데 도식 자신이
// 잘려 보이므로, 눈으로만 드러나지 않게 Production이 경고한다(2026-11-04).
const test = require("node:test");
const assert = require("node:assert/strict");
const { outsideViewBox } = require("../svgAdapter");

const svg = (h, rows) => [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 ${h}" width="960" height="${h}">`,
  ...rows.map((y) => `  <rect x="6" y="${y}" width="948" height="74" rx="8" fill="#ffffff" stroke="#64748b"/>`),
  "</svg>",
].join("\n");

test("마지막 띠가 viewBox를 넘으면 넘친 양을 알려 준다", () => {
  const over = outsideViewBox(svg(380, [58, 142, 226, 310]));
  assert.ok(over, "넘침을 찾지 못했다");
  assert.equal(Math.round(over.bottom), 4);
});

test("viewBox 안에 들어가면 넘침이 없다", () => {
  assert.equal(outsideViewBox(svg(392, [58, 142, 226, 310])), null);
  assert.equal(outsideViewBox(svg(340, [10, 94, 178, 262])), null);
});

test("오른쪽으로 나간 글도 찾는다", () => {
  const source = '<svg viewBox="0 0 400 200"><text x="460" y="40" font-size="13">밖</text></svg>';
  const over = outsideViewBox(source);
  assert.ok(over && over.right > 0, "오른쪽 넘침을 찾지 못했다");
});

test("viewBox가 없는 SVG는 검사하지 않는다", () => {
  assert.equal(outsideViewBox('<svg width="100" height="100"><rect x="0" y="0" width="200" height="200"/></svg>'), null);
});
