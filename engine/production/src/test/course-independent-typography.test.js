"use strict";
// 조판은 **과정 이름이나 세션 이름으로 갈리지 않는다**(AGENTS.md 「규칙의 원천」).
//
// 2026-11-27까지는 renderer가 과정 폴더 이름(`ai-native`)과 세션명 세 개(`03. 요구사항`,
// `04. 도메인 모델 — 정적 관점`, `05. 도메인 모델 — 동적 관점`)를 보고 문단 간격(3pt↔6pt)·인용의
// 표시 따옴표·번호 내어쓰기·코드 들여쓰기·표 배치를 바꾸었다. 그 세션명들은 개편된 Curriculum에
// 더는 없어서, 번호가 하나 밀린 다른 세션에 엉뚱하게 걸릴 상태였다 — 원고는 그대로인데 조판이
// 바뀌는 고장이다. 분기를 지웠고, 이 검사가 다시 들어오는 것을 막는다.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("../parse");
const { render } = require("../builder");
const { TEMPLATE_DIR } = require("../template");
const { A, all, child } = require("../xml");

const md = String.raw`## 01. 인용

**인용문**

확인한 **기준**을 따른다, "Follow the \"verified\" criterion.", [Example 2026]

## 02. 요구와 요구사항

**요구**와 조건을 구별한다.

- **요구** — 결과를 원한다.
### 요구사항

- **기능** — 주문한다.

## 03. 사용자 스토리

### 카드와 대화

**인용문**

확인한 문장이다, "A verified sentence.", [Example 2026]
`;

async function deck(session, course) {
  const p = parse(md);
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tm-independent-")), "out.pptx");
  const toc = p.sections.map((s) => ({ kind: "bullet", text: s.title, rows: [], depth: 0 }));
  return render(p.sections, TEMPLATE_DIR, out, session, toc, course);
}
// 장마다 글·크기·문단 간격을 적어 둔다 — 두 덱이 같은지 이것으로 비교한다. 세션명과 목차 제목은
// 과정·세션 이름 자체이므로 비교에서 뺀다. 남는 것이 조판이다.
const shapeOf = (m, session) => m.pages.map((page) => ({
  space: page.paragraphSpace,
  text: all(page.doc, A, "p").map((p) => all(p, A, "t").map((t) => t.textContent).join(""))
    .filter((t) => t.trim() && t.trim() !== session.trim() && !/목차$/.test(t.trim())),
  sizes: all(page.doc, A, "r").map((r) => child(r, A, "rPr")?.getAttribute("sz")),
}));

test("같은 원고는 과정과 세션 이름이 달라도 똑같이 조판된다", async () => {
  const session0 = "02. 요구사항";
  const base = shapeOf(await deck(session0, { name: "어떤 과정", sessions: [] }), session0);
  for (const [session, course] of [
    ["03. 요구사항", { name: "AI-native SW 공학", sessions: [] }],
    ["04. 도메인 모델 — 정적 관점", { name: "AI-native SW 공학", sessions: [] }],
    ["05. 도메인 모델 — 동적 관점", { name: "AI-native SW 공학", sessions: [] }],
    ["99. 테스트", undefined],
  ]) {
    const other = shapeOf(await deck(session, course), session);
    assert.deepEqual(other, base, `"${session}"의 조판이 다르다`);
  }
});

test("문단 앞뒤 간격의 기본값은 모든 세션에서 6pt다", async () => {
  const m = await deck("03. 요구사항", { name: "AI-native SW 공학", sessions: [] });
  assert.ok(m.pages.length > 0);
  for (const page of m.pages) assert.equal(page.paragraphSpace, 6, `${page.heading}의 문단 간격`);
});

test("요약형 인용의 한글에는 따옴표를 두지 않고 영문 원문만 표시 따옴표로 감싼다", async () => {
  const m = await deck("99. 테스트", undefined);
  const texts = m.pages.flatMap((p) => all(p.doc, A, "p")).map((p) => all(p, A, "t").map((t) => t.textContent).join(""));
  // 한글이 원문의 번역이 아니라 요약이므로 따옴표를 두지 않는다. 원문 **안**의 따옴표(`\"`)는 남는다.
  assert.ok(texts.includes('확인한 기준을 따른다, “Follow the "verified" criterion.”, [Example 2026]'),
    texts.join(" / "));
  assert.ok(texts.includes("확인한 문장이다, “A verified sentence.”, [Example 2026]"));
});
