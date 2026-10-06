"use strict";
// session-authoring-guide.md "사례·가정·실습", production-guide.md "Session 명": practice answers sit
// after the summary under "## 별첨. 실습 답" -- outside the TOC, their slides labelled "별첨: <세션명>".
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { checkStructure, answersOutsideAppendix } = require("../structure");

const md = (answers) => ["## 목차", "", "01. 세션 목표", "02. 실습 — 모델", "03. 요약", "",
  "## 01. 세션 목표", "", "**목표**를 본다.", "", "**강사 노트**", "", "- 노트", "", "---", "",
  "## 02. 실습 — 모델", "", "**모델**을 만든다.", "", "**강사 노트**", "", "- 노트", "", "---", "",
  "## 03. 요약", "", "**요약**이다.", "", "### 다음 세션", "", "- 다음", "", "**강사 노트**", "", "- 노트", "", "---", "", ...answers].join("\n");
const appendix = ["## 별첨. 실습 답", "", "---", "", "## 모델 (안)", "", "**답**이다.", "", "**강사 노트**", "", "- 노트", ""];

test("the appendix is outside the TOC, keeps a single answer as its own topic and follows the summary", () => {
  const { sections } = parse(md(appendix));
  const answer = sections.find((s) => s.title === "모델 (안)");
  assert.ok(answer && answer.appendix && answer.group === "별첨. 실습 답");
  assert.deepEqual(answersOutsideAppendix(sections), []);
  assert.deepEqual(checkStructure("x.md", "01. 시험", sections, []), []);
});

test("an answer left in the body is reported", () => {
  const { sections } = parse(md([]).replace("## 03. 요약", "## 모델 (안)\n\n**답**.\n\n---\n\n## 03. 요약"));
  assert.equal(answersOutsideAppendix(sections).length, 1);
});

test("appendix slides read 별첨: <세션명> at the top right", async () => {
  const { sections, toc } = parse(md(appendix));
  const out = path.join(os.tmpdir(), `tm-answers-${process.pid}.pptx`);
  try {
    const { pages } = await render(sections, TEMPLATE_DIR, out, "01. 시험", toc);
    const answer = pages.find((p) => /^모델 \(안\)/.test(p.heading));
    assert.equal(answer.appendix, true);
    assert.ok(pages.filter((p) => !p.isToc && !p.appendix).length >= 3);
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
});
