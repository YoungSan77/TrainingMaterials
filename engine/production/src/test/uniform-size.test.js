"use strict";
// production-guide.md "Visual layout 및 가독성": boxes of one kind inside a diagram share the
// widest/tallest box's size. These tests pin the source rewriting; the plantuml/mermaid
// integration tests cover the real renderers.
const test = require("node:test");
const assert = require("node:assert/strict");
const { textWidths, maxEntityRectWidth, parseClassDecls, uniformClassSource, uniformLabelSource, minClassWidth, NBSP_EM } = require("../uniformSize");
const { shrinkSequenceActors, assembled } = require("../plantumlAdapter");
const { styleSource, maxNodeLabelBox } = require("../mermaidAdapter");

test("uniformClassSource pads every class body to the same field/method counts and sets minClassWidth", () => {
  const source = [
    'class "고객" as Customer {', "  이름", "}",
    'class "주문" as Order {', "  주문 번호", "  주문 일시", "  취소()", "}",
    'class "상품" as Product',
    'Customer "1" -- "0..*" Order',
  ].join("\n");
  const out = uniformClassSource(source, 490.1, 4);
  assert.ok(out.startsWith("skinparam minClassWidth 123\n"));
  const { decls } = parseClassDecls(out);
  assert.equal(decls.length, 3);
  for (const d of decls) {
    assert.equal(d.fields.length, 2, d.head);
    assert.equal(d.methods.length, 1, d.head);
  }
  assert.ok(out.includes('Customer "1" -- "0..*" Order'), "relations are kept verbatim");
  assert.ok(out.includes("{method} <U+00A0>"), "method padding stays in the method compartment");
});

test("uniformClassSource leaves a single class's body alone but still applies the width", () => {
  const source = 'class "주문" as Order {\n  주문 번호\n}';
  assert.equal(uniformClassSource(source, 300, 4), "skinparam minClassWidth 75\n" + source);
});

test("class boxes are never narrower than a 4-character Korean name", () => {
  const source = 'class "고객" as A\nclass "주문" as B';
  // 2-letter names measure ~138 SVG units (35 at scale 1) -- below the 4-character floor.
  const out = uniformClassSource(source, 137.96, 4, 13);
  assert.equal(minClassWidth(13), Math.ceil(4 * 0.865 * 13 + 12));
  assert.ok(out.startsWith(`skinparam minClassWidth ${minClassWidth(13)}\n`));
  // A wider measured box wins over the floor.
  assert.ok(uniformClassSource(source, 800, 4, 13).startsWith("skinparam minClassWidth 200\n"));
});

test("maxEntityRectWidth reads the widest entity box", () => {
  const svg = '<g class="entity" id="a"><rect width="137.9" height="10"/></g><g class="entity" id="b"><rect width="490.1" height="10"/></g>';
  assert.equal(maxEntityRectWidth(svg), 490.1);
});

test("uniformLabelSource pads narrower state labels with no-break spaces toward the widest", () => {
  const svg = '<text textLength="44.98">&#44032;</text><text textLength="196.3731">&#44208;&#51228; &#50756;&#47308;</text>';
  const widths = textWidths(svg);
  const source = 'state "가" as A\nstate "결제 완료" as B\nA --> B : 가';
  const out = uniformLabelSource(source, "state", widths, 52);
  const side = Math.round((196.3731 - 44.98) / (2 * NBSP_EM * 52));
  assert.ok(side > 0);
  const pad = " ".repeat(side);
  assert.ok(out.includes(`state "${pad}가${pad}" as A`));
  assert.ok(out.includes('state "결제 완료" as B'), "the widest label is unchanged");
  assert.ok(out.endsWith("A --> B : 가"), "transition labels are not padded");
});

test("uniformLabelSource skips '-' split labels", () => {
  const widths = new Map([["a - b", 10], ["넓은 라벨", 300]]);
  const source = 'usecase "a - b" as A\nusecase "넓은 라벨" as B';
  assert.equal(uniformLabelSource(source, "usecase", widths, 52), source);
});

test("mermaid styleSource sizes node labels to the given box but not subgraph titles", () => {
  const source = 'flowchart LR\n  subgraph PS["문제 공간"]\n    A["후보"]\n  end';
  const out = styleSource(source, { w: 93.2, h: 48 });
  assert.ok(out.includes("min-width:94px;min-height:48px'><b>후보</b></span>"));
  assert.ok(out.includes('subgraph PS["<b>문제 공간</b>"]'));
});

test("maxNodeLabelBox reads the largest node label box", () => {
  const svg = '<g class="node default" id="a"><rect/><foreignObject width="27.6" height="24"></foreignObject></g>'
    + '<g class="node default" id="b"><rect/><foreignObject width="93.7" height="48"></foreignObject></g>';
  assert.deepEqual(maxNodeLabelBox(svg), { w: 93.7, h: 48 });
});

test("sequence diagrams hide the footbox", () => {
  assert.ok(assembled('participant "주문" as O', "sequence").includes("hide footbox"));
  assert.ok(!assembled('class "주문" as O', "class").includes("hide footbox"));
});

test("class and package diagrams hide the C·E·I·A spot; the source does not have to", () => {
  assert.ok(assembled('class "주문" as O', "class").includes("hide circle"));
  assert.ok(assembled('package "주문" {\n}', "package").includes("hide circle"));
  assert.ok(!assembled('state "결제 대기" as A', "state").includes("hide circle"));
});

test("package diagrams show class names only; class diagrams keep their members", () => {
  assert.ok(assembled('package "주문" {\n  class "주문" as O {\n    주문 번호\n  }\n}', "package").includes("hide members"));
  assert.ok(!assembled('class "주문" as O {\n  주문 번호\n}', "class").includes("hide members"));
});

test("shrinkSequenceActors scales the stick figure about its feet and crops the empty top band", () => {
  const svg = '<svg height="544px" style="width:464px;height:544px;" viewBox="0 0 464 544">'
    + '<g class="participant participant-head" id="part1-head"><text>고객</text>'
    + '<ellipse cx="76.98" cy="54" rx="32" ry="32"/><path d="M76.98,86 L76.98,194 M76.98,194 L24.98,254"/></g>'
    + '<g class="participant participant-head" id="part2-head"><rect height="117" width="145" x="296" y="200"/></g></svg>';
  const out = shrinkSequenceActors(svg, 0.5);
  assert.ok(out.includes('<g transform="translate(76.98,254) scale(0.5) translate(-76.98,-254)"><ellipse'));
  // new figure top = 254 - (254 - 22) * 0.5 = 138; crop to 20 above it -> 118 cut
  assert.ok(out.includes('viewBox="0 118 464 426"'));
  assert.ok(out.includes('height="426px"'));
  assert.ok(out.includes("height:426px"));
});

test("a parenthesized annotation after a space is a field, not a method", () => {
  const { decls } = parseClassDecls('entity "주문" as O {\n  * 주문번호\n  --\n  고객번호 (FK)\n  취소()\n}');
  assert.deepEqual(decls[0].fields.map((s) => s.trim()), ["* 주문번호", "--", "고객번호 (FK)"]);
  assert.deepEqual(decls[0].methods.map((s) => s.trim()), ["취소()"]);
});
