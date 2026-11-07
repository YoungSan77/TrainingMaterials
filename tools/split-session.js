#!/usr/bin/env node
// 세션 하나를 설계의 두 세션으로 가른다. 옮기는 장은 **글자 하나도 고치지 않고** 그대로 들고 가고,
// 새로 쓸 자리는 `<<NEW:이름>>` 표식만 남긴다 — 글은 사람이 쓴다.
//
// 사용: node tools/split-session.js <과정> [--apply]
//   붙이지 않으면 만들 목차와 새로 쓸 자리만 보여 준다(dry run).
//
// 왜 도구인가 — 900줄에서 장 스무 개를 손으로 옮기면 한둘이 빠지거나 겹친다. 장을 **제목으로**
// 집어 옮기면 빠진 장은 "찾지 못했다"로 즉시 드러나고, 옮긴 글이 바뀌지 않았음은 git diff가 보인다.
//
// PLAN은 지금 할 한 걸음이다. 적용·커밋한 뒤에는 비운다(기록은 git 이력에 남는다).
// 2026-11-07: "08. 위임"을 설계의 08 과제와 맥락, 09 권한과 경계로 가른다
//   (`course-design.md`의 「세션이 성립하는 조건」 — 위임에는 결정이 둘이다).
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const PLAN = {
  from: "s08",
  sessions: [
    {
      file: "s08",
      name: "08. 위임 — 과제와 맥락",
      topics: [
        ["세션 목표", ["new:s08-목표"]],
        ["위임 계약", ["sub:4가지를 정한다", "sub:맡기는 것은 작업 단위 하나"]],
        ["작업 지시문", ["sub:무엇을 하라", "sub:무엇을 가리킬 것인가?", "sub:주문한다의 작업 지시문", "sub:시연 — 실제로 준 지시문"]],
        ["맥락", ["sub:미리 넣을 것과 찾아 읽게 할 것", "sub:점진적 공개", "sub:긴 작업의 압축과 기록", "new:s08-패키지"]],
        ["도구와 연결의 표준", ["body:도구와 연결의 표준"]],
        ["언제 끝이고 언제 멈춰 묻는가?", ["body:언제 멈추나"]],
        ["빈 저장소에서 시작하기", ["sub:저장소와 빌드 구성을 맡긴다"]],
        ["돌아온 결과를 본다", ["sub:돌아온 구현 코드", "sub:완료 주장과 증거"]],
        ["잘못된 관행", ["sub:프롬프트에 모든 규칙"]],
        ["실습 8 — 위임과 구현", ["new:s08-실습"]],
        ["요약", ["new:s08-요약"]],
      ],
      appendix: ["sub:주문한다 — 위임 기록"],
    },
    {
      file: "s09",
      name: "09. 위임 — 권한과 경계",
      topics: [
        ["세션 목표", ["new:s09-목표"]],
        ["글로 적은 금지는 통과했다", ["body:환경이 거절한 것과 하지 않은 것"]],
        ["강제와 부탁 — 가드레일의 실체", ["body:강제와 지시"]],
        ["최소 권한", ["sub:최소 권한", "sub:주문한다의 권한"]],
        ["위험과 피해 범위", ["sub:위험을 확률과 크기로", "sub:치명적 삼박자", "sub:프롬프트 주입", "sub:피해 범위와 되돌림"]],
        ["되돌리기 어려운 자리에 확인 지점을 둔다", ["body:되돌리기 어려운 자리"]],
        ["권한을 설정한다", ["body:권한을 설정한다"]],
        ["추적과 내구성", ["sub:추적 — 무엇을 보고 무엇을 했나", "sub:재시도와 상한"]],
        ["잘못된 관행", ["sub:모든 권한 허용"]],
        ["실습 9 — 권한을 좁힌다", ["new:s09-실습"]],
        ["요약", ["new:s09-요약"]],
      ],
      appendix: ["new:s09-별첨"],
    },
  ],
};

const pad = (n) => String(n).padStart(2, "0");

function parse(text) {
  const blocks = [];
  for (const part of text.split(/^(?=## )/m)) {
    const m = /^## (.+?)\n/.exec(part);
    if (!m) continue;
    const title = m[1].trim();
    // 번호가 붙은 것은 topic이고, 나머지가 옮길 장이다. 번호를 뗀 뒤에는 둘을 가릴 수 없으므로
    // 여기서 표시해 둔다 — 빠뜨린 장을 찾는 검사가 그 표시로 돈다.
    blocks.push({ title: title.replace(/^\d\d\. /, ""), numbered: /^\d\d\. /.test(title), body: part.trimEnd() });
  }
  return blocks;
}

function build(plan, blocks) {
  const pick = (title) => {
    const b = blocks.find((x) => x.title === title);
    if (!b) throw new Error(`장을 찾지 못했다: ${title}`);
    return b.body;
  };
  const render = (item) => {
    if (item.startsWith("sub:")) return pick(item.slice(4));
    if (item.startsWith("body:")) return pick(item.slice(5)).replace(/^## .+?\n\n?/, "");
    return `<<NEW:${item.slice(4)}>>`;
  };

  const out = [
    "--------------------",
    `Session 명: ${plan.name}`,
    "--------------------",
    "",
    "## 목차",
    "",
    plan.topics.map(([t], i) => `${pad(i + 1)}. ${t}`).join("\n"),
    "",
  ];
  plan.topics.forEach(([title, items], i) => {
    out.push("---", "", `## ${pad(i + 1)}. ${title}`, "");
    items.forEach((item) => out.push(render(item), ""));
  });
  out.push("---", "", "## 별첨. 실습 답", "");
  plan.appendix.forEach((item) => out.push(render(item), ""));
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

function main() {
  const [course, ...rest] = process.argv.slice(2);
  if (!course) {
    console.error("사용: node tools/split-session.js <과정> [--apply]");
    process.exit(2);
  }
  const apply = rest.includes("--apply");
  const dir = path.join(ROOT, "courses", course, "sessions");
  const blocks = parse(fs.readFileSync(path.join(dir, PLAN.from + ".md"), "utf-8"));

  for (const plan of PLAN.sessions) {
    const text = build(plan, blocks);
    const names = (text.match(/<<NEW:[^>]+>>/g) || []).join(", ");
    console.log(`${plan.file}.md — ${plan.topics.length} topic · 새로 쓸 자리: ${names || "없음"}`);
    if (apply) fs.writeFileSync(path.join(dir, plan.file + ".md"), text);
  }

  const used = new Set();
  for (const plan of PLAN.sessions)
    for (const [, items] of plan.topics)
      for (const item of items) if (!item.startsWith("new:")) used.add(item.replace(/^(sub|body):/, ""));
  for (const plan of PLAN.sessions) for (const item of plan.appendix) if (!item.startsWith("new:")) used.add(item.replace(/^(sub|body):/, ""));
  const left = blocks.filter((b) => !used.has(b.title) && !b.numbered);
  if (left.length) console.log("\n옮기지 않은 장(확인하라): " + left.map((b) => b.title).join(" · "));
  console.log(apply ? "\n고쳤다 — <<NEW:…>> 자리를 글로 채운다." : "\n세어 본 것이다(--apply로 적용)");
}

main();
