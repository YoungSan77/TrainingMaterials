"use strict";
// production-guide.md "Visual layout 및 가독성": SVG corrections for what the smetana layout
// draws wrong or cannot configure (association classes, fixed-size actors, use-case ellipses).
const test = require("node:test");
const assert = require("node:assert/strict");
const { fixAssociationClasses, shrinkUsecaseActors, fitUsecaseEllipses, cropTop } = require("../umlSvgFix");
const { svgFixes } = require("../plantumlAdapter");

const ASSOC = '<svg height="400px" style="width:800px;height:400px;" viewBox="0 0 800 400">'
  + '<g class="entity" id="ent2"><rect x="28" y="50" width="100" height="80"/></g>'
  + '<g class="entity" id="ent3"><rect x="700" y="50" width="100" height="80"/></g>'
  + '<g class="entity" id="ent4"><rect x="300" y="232" width="200" height="120"/></g>'
  + '<ellipse cx="394" cy="74" fill="#1B3A6B" rx="8" ry="8"/>'
  + '<g class="link" data-entity-1="ent2" data-entity-2="ent7" id="l8"><path d="M137,114 C207,114 330,114 385,114"/><text>0..*</text></g>'
  + '<g class="link" data-entity-1="ent7" data-entity-2="ent3" id="l9"><path d="M450,114 C505,114 628,114 699,114"/><text>1..*</text></g>'
  + '<g class="link" data-entity-1="ent7" data-entity-2="ent4" id="l10"><path d="M418,162 C418,185 418,208 418,232" style="stroke-dasharray:28,28;"/></g>'
  + '</svg>';

test("fixAssociationClasses joins the association, drops the stray dot, and hangs the dashed line from its midpoint", () => {
  const out = fixAssociationClasses(ASSOC);
  assert.ok(out.includes('d="M137,114 L699,114"'), "one continuous A–B line");
  assert.ok(!out.includes("C505,114"), "the second half's line is gone");
  assert.ok(out.includes("<text>1..*</text>"), "the second half's multiplicity survives");
  assert.ok(out.includes('d="M418,114 L418,232"'), "dashed line from the midpoint to the class");
  assert.ok(!/<ellipse\b/.test(out), "stray midpoint dot removed");
});

test("fixAssociationClasses leaves a diagram without an association class unchanged", () => {
  const svg = '<svg viewBox="0 0 10 10"><g class="entity" id="a"><rect/></g><g class="link" data-entity-1="a" data-entity-2="a"><path d="M1,1 L2,2"/></g></svg>';
  assert.equal(fixAssociationClasses(svg), svg);
});

test("shrinkUsecaseActors scales the figure about its feet and pulls side links onto it", () => {
  const svg = '<svg height="480px" style="width:800px;height:480px;" viewBox="0 0 800 480">'
    + '<g class="entity" id="ent2"><ellipse cx="78" cy="156" rx="32" ry="32"/><path d="M78,188 L78,296 M26,220 L130,220 M78,296 L26,356 M78,296 L130,356"/>'
    + '<text font-size="52" textLength="89.96" x="33.02" y="412">고객</text></g>'
    + '<g class="entity" id="ent4"><ellipse cx="513" cy="175" rx="139" ry="55"/><text font-size="52" textLength="180" x="423" y="191">주문한다</text></g>'
    + '<g class="link" data-entity-1="ent2" data-entity-2="ent4" id="l6"><path d="M132.7779,260.6106 C191,247 291,225 373.2265,206.6782"/></g></svg>';
  const out = shrinkUsecaseActors(svg, 0.5);
  assert.ok(out.includes('<g transform="translate(78,356) scale(0.5) translate(-78,-356)"><ellipse'));
  // side endpoint -> new figure edge (78 + 52*0.5 + 6 = 110), y mapped about the feet
  assert.ok(out.includes("M110,308.3053"), out.match(/d="([^"]+)"/g).join(" | "));
});

test("fitUsecaseEllipses centers the padded label and snaps a short link end onto the outline", () => {
  const svg = '<svg viewBox="0 0 800 400"><g class="entity" id="u"><ellipse cx="500" cy="200" rx="200" ry="50"/>'
    + '<text font-size="52" lengthAdjust="spacing" textLength="300" x="320" y="215">&#160;&#160;주문한다&#160;&#160;</text></g>'
    + '<g class="link" data-entity-1="a" data-entity-2="u"><path d="M100,200 L290,200"/></g></svg>';
  const out = fitUsecaseEllipses(svg);
  assert.ok(out.includes('x="500" text-anchor="middle"'));
  assert.ok(out.includes(">주문한다</text>"));
  assert.ok(!out.includes("textLength"));
  assert.ok(out.includes("M100,200 L300,200"), "endpoint snapped to the ellipse's left vertex");
});

test("cropTop removes the empty band above the highest drawn element", () => {
  const svg = '<svg height="400px" style="width:100px;height:400px;" viewBox="0 0 100 400"><rect x="0" y="150" width="10" height="10"/></svg>';
  const out = cropTop(svg, [200]);
  assert.ok(out.includes('viewBox="0 130 100 270"'));
});

test("svgFixes routes only the diagrams that need an SVG correction", () => {
  assert.equal(svgFixes("class", 'class "A" as A').length, 0);
  assert.equal(svgFixes("class", "(A, B) .. C").length, 1);
  assert.equal(svgFixes("usecase", 'usecase "주문한다" as U').length, 1);
  assert.equal(svgFixes("usecase", 'actor "고객" as C\nusecase "주문한다" as U').length, 2);
  assert.equal(svgFixes("sequence", 'participant "주문" as O').length, 0);
  assert.equal(svgFixes("sequence", 'actor "고객" as C').length, 1);
});
