"use strict";
// production-guide.md "별첨 — 참고 자료": the course appendix references.md (its own document) lists
// numbered entries "N. **[레이블]** …" in one alphabetical list at 8pt in two columns; sessions cite
// by label and every label must be listed. 글자 크기는 7pt다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { checkLabels } = require("../references");

const entry = (n, label) => `${n}. **[${label}]**  A Book Title That Runs Long Enough To Wrap Once, 2nd ed., Author ${n}, Publisher, 2004`;
function appendix(count) {
  return ["## 참고 자료", "", "**참고 자료 목록**", "",
    ...Array.from({ length: count }, (_, i) => entry(i + 1, `Author ${1900 + i}`)), "", "**강사 노트**", "", "- 노트.", ""].join("\n");
}

async function pagesOf(md) {
  const { sections, toc } = parse(md);
  const out = path.join(os.tmpdir(), `tm-appendix-${process.pid}-${Date.now()}.pptx`);
  try {
    return (await render(sections, TEMPLATE_DIR, out, "별첨. 참고 자료", toc)).pages;
  } finally {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

test("the appendix needs no table of contents and sets its entries at 7pt", async () => {
  const pages = await pagesOf(appendix(12));
  assert.equal(pages.filter((p) => p.isToc).length, 0);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].columns, 1, "왼쪽 단을 채우지 못하는 짧은 목록은 한 단이다");
  const body = [...pages[0].doc.getElementsByTagName("a:p")].filter((p) => /Author/.test(p.textContent));
  const sizes = new Set(body.flatMap((p) => [...p.getElementsByTagName("a:rPr")].map((r) => r.getAttribute("sz"))).filter(Boolean));
  assert.deepEqual([...sizes], ["700"]);
  const text = pages[0].items.map((it) => it.text).join("\n");
  assert.equal(text.includes("참고 자료 목록"), false, "the marker never shows");
});

test("entries fill the left column to its bottom before the right one starts", async () => {
  const pages = await pagesOf(appendix(40));
  assert.equal(pages.length, 1);
  assert.equal(pages[0].columns, 2);
  const [left, right] = pages[0].fillParts;
  assert.ok(left > 0.9, `왼쪽 단이 아래까지 찬다 (${left.toFixed(2)})`);
  assert.ok(left > right, "오른쪽 단은 왼쪽이 찬 뒤에 받는다");
});

test("a long list continues on numbered slides", async () => {
  const pages = await pagesOf(appendix(120));
  assert.ok(pages.length > 1);
  pages.forEach((p, i) => assert.ok(p.heading.endsWith(`(${i + 1}/${pages.length})`)));
});

function course(sessionBody, appendixBody) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tm-labels-"));
  fs.writeFileSync(path.join(dir, "s01.md"), sessionBody);
  if (appendixBody != null) fs.writeFileSync(path.join(dir, "references.md"), appendixBody);
  return dir;
}

test("every label a session uses must be an appendix entry", () => {
  const body = '"한글", "English.", [Larman 2004]\n\n유스케이스 템플릿 [Cockburn 2001]과 [Wikipedia: Use case]. 링크 [문서](https://x.y)는 레이블이 아니다.\n';
  const dir = course(body, "1. **[Larman 2004]** Craig Larman, Applying UML and Patterns, 3rd ed., 2004\n2. **[Wikipedia: Use case]** Wikipedia, \"Use case\"\n");
  const r = checkLabels(path.join(dir, "s01.md"), body);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /\[Cockburn 2001\]/);
  const a = checkLabels(path.join(dir, "references.md"), fs.readFileSync(path.join(dir, "references.md"), "utf-8"));
  assert.ok(a.errors.some((e) => e.includes("[Cockburn 2001]")), "the appendix reports a label it lacks");
});

test("labels without an appendix are an error; the old author, year tail is a warning", () => {
  const body = '"한글", "English.", Craig Larman, 2004\n\n참조 [Larman 2004]\n';
  const dir = course(body, null);
  const r = checkLabels(path.join(dir, "s01.md"), body);
  assert.match(r.errors[0], /references\.md/);
  assert.match(r.warnings[0], /레이블/);
});

test("inline code identifiers are not sources, while adjacent prose labels are still checked", () => {
  const body = [
    "- **`[H]` 비회원:** 미정이다. [Known 2024]",
    "- ``[B]``와 `` `[G]` ``도 식별자다. [Missing 2025]",
    "- [E]는 코드 밖이므로 출처 검사를 받는다.",
  ].join("\n");
  const ap = "1. **[Known 2024]** Existing source\n";
  const dir = course(body, ap);
  const expected = checkLabels(path.join(dir, "s01.md"), body);
  assert.equal(expected.errors.length, 2);
  assert.match(expected.errors[0], /2행.*\[Missing 2025\]/);
  assert.match(expected.errors[1], /3행.*\[E\]/);
  assert.deepEqual(expected.warnings, []);
  const appendixCheck = checkLabels(path.join(dir, "references.md"), ap);
  assert.equal(appendixCheck.errors.length, 2);
  assert.ok(appendixCheck.errors.every((e) => /\[Missing 2025\]|\[E\]/.test(e)));
});

test("literal code needs no bibliography, but an unmatched backtick does not hide a source", () => {
  const body = "**`[H]`**와 ``[B]``는 미정 식별자다.\n";
  const dir = course(body, null);
  assert.deepEqual(checkLabels(path.join(dir, "s01.md"), body), { errors: [], warnings: [] });
  assert.match(checkLabels(path.join(dir, "s01.md"), "닫히지 않은 `[Missing 2025]").errors[0], /references\.md/);
});

// 반대 방향 — 목록에만 있고 아무도 쓰지 않는 레이블. 인용하지 않기로 한 자료는 (읽을거리)로 밝힌다.
test("an entry no session uses is a warning unless it is marked 읽을거리", () => {
  const ap = "1. **[Used 2000]**  A\n2. **[Idle 2001]**  B\n3. **[Reading 2002]**  C (읽을거리)\n";
  const dir = course("본문에서 [Used 2000]을 쓴다.\n", ap);
  const r = checkLabels(path.join(dir, "references.md"), ap);
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 1);
  assert.match(r.warnings[0], /\[Idle 2001\]/);
});

test("a duplicated appendix label is an error", () => {
  const ap = "1. **[Larman 2004]** A\n2. **[Larman 2004]** B\n";
  const dir = course("본문\n", ap);
  assert.match(checkLabels(path.join(dir, "references.md"), ap).errors[0], /중복/);
});

test("an entry starts at the left edge, wraps after \"N. \", and has 1pt before and after", async () => {
  const pages = await pagesOf(appendix(12));
  const paras = [...pages[0].doc.getElementsByTagName("a:p")].filter((x) => /Author/.test(x.textContent));
  const marL = (x) => Number(x.getElementsByTagName("a:pPr")[0].getAttribute("marL"));
  for (const x of paras) {
    const pr = x.getElementsByTagName("a:pPr")[0];
    assert.ok(marL(x) > 0);
    assert.equal(Number(pr.getAttribute("indent")), -marL(x), "first line at the left edge");
    for (const tag of ["a:spcBef", "a:spcAft"]) assert.equal(pr.getElementsByTagName(tag)[0].getElementsByTagName("a:spcPts")[0].getAttribute("val"), "100");
  }
  const one = paras.find((x) => /^1\. /.test(x.textContent)), twelve = paras.find((x) => /^12\. /.test(x.textContent));
  assert.ok(marL(twelve) > marL(one), "the wrap starts after the number's own width");
});

test("an English quote not recorded in references/verified.json is a warning", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tm-ledger-"));
  fs.mkdirSync(path.join(root, "references"));
  const { quoteKey } = require("../quoteKey");
  fs.writeFileSync(path.join(root, "references", "verified.json"), JSON.stringify({ [quoteKey("Checked “one”.")]: { source: "x" } }));
  const dir = path.join(root, "sessions");
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "references.md"), "1. **[A 2000]**  T, A, 2000\n");
  const body = '"한글", "Checked \\"one\\".", [A 2000]\n\n  - "한글", "Not checked.", [A 2000]\n';
  const r = checkLabels(path.join(dir, "s01.md"), body);
  assert.equal(r.warnings.length, 1);
  assert.match(r.warnings[0], /원고 3행: 영문 인용이 원문 확인 기록에 없다/);
});
