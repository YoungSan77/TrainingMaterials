"use strict";
// production-guide.md "주석": "**주석**" and the paragraph after it render as an 8pt footnote at
// the bottom of the topic's slides, outside the body flow; the body never shows the marker.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { unboldedText } = require("../structure");

const MD = "## 01. 패키지 원칙\n\n**응집** 원칙은 셋이다.\n\n- **CCP** — 함께 바뀌는 것을 묶는다.\n\n"
  + "**주석**\n\nCCP — Common Closure Principle(공통 폐쇄 원칙) · CRP — Common Reuse Principle(공통 재사용 원칙)\n";

test("a footnote is its own 8pt item on the slide and stays out of the body text", async () => {
  const { sections } = parse(MD);
  const toc = [{ kind: "bullet", text: sections[0].title, rows: [], depth: 0, meta: null }];
  const out = path.join(os.tmpdir(), `tm-footnote-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE_DIR, out, "테스트", toc);
    const [p] = m.pages.filter((pg) => !pg.isToc);
    const notes = p.items.filter((it) => it.kind === "footnote");
    assert.equal(notes.length, 1);
    assert.match(notes[0].text, /^CCP — Common Closure Principle/);
    for (const it of p.items.filter((x) => x.kind !== "footnote")) {
      assert.equal(it.text.includes("Common Closure"), false, "footnote text is not repeated in the body");
      assert.equal(it.text.includes("주석"), false, "the marker never shows");
    }
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

test("a footnote reserves the bottom strip for a two-column answer", async () => {
  const answer = "## 01. 요구사항 명세서 (안)\n\n" + Array.from({ length: 20 }, (_, i) =>
    `- **R${i + 1} 규칙** — 주석이 본문을 가리지 않도록 충분히 긴 설명을 둔다.`).join("\n")
    + "\n\n**주석**\n\n이 수치와 정책은 교육용 가정이다.\n";
  const { sections } = parse(answer);
  const toc = [{ kind: "bullet", text: sections[0].title, rows: [], depth: 0, meta: null }];
  const out = path.join(os.tmpdir(), `tm-footnote-answer-${process.pid}-${Date.now()}.pptx`);
  try {
    const m = await render(sections, TEMPLATE_DIR, out, "테스트", toc);
    const [p] = m.pages.filter((pg) => !pg.isToc);
    assert.equal(p.answerColumns, 2);
    const note = p.items.find((it) => it.kind === "footnote");
    assert.ok(note);
    const { A, P, child, shape } = require("../xml");
    const bounds = (id) => {
      const xf = child(child(shape(p.doc, id), P, "spPr"), A, "xfrm");
      const off = child(xf, A, "off"), ext = child(xf, A, "ext");
      return { y: Number(off.getAttribute("y")), h: Number(ext.getAttribute("cy")) };
    };
    const noteTop = bounds(note.id).y;
    const bodies = p.items.filter((x) => x.kind === "body").map((x) => bounds(x.id));
    assert.equal(bodies.length, 2);
    assert.ok(bodies.every((box) => box.y + box.h < noteTop), "answer columns end above the footnote");
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});

test("the footnote paragraph is exempt from the bold-keyword warning", () => {
  const { sections } = parse(MD);
  assert.deepEqual(unboldedText(sections), []);
});
