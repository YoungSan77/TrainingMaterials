#!/usr/bin/env node
"use strict";
// 장 수·장당 글자 수·도식 수를 잰다. 품질을 눈으로 가늠하지 않고 수치로 확인하기 위한 것이다
// (session-authoring-guide.md 「완료 기준」). 이미지 한 장을 보기 전에 이것부터 본다.
//
//   node tools/slide-density.js courses/<course>/sessions/sNN.pptx …
//
// 목차·세션 목표·요약·실습·별첨은 내용 장이 아니므로 평균에서 뺀다.
const path = require("path");
const { readZip } = require(path.resolve(__dirname, "../engine/production/src/zip"));

// 내용 장 하나가 읽을 것을 담고 있는지의 바닥값이다. 리드가 한 줄이고 나머지가 표와 bullet인
// 장은 여기에 닿지 않는다. 위쪽은 한 장에 담을 수 있는 양의 한계다.
const TARGET_MIN = 350;
const TARGET_MAX = 800;
// 내용 장 몇 장마다 도식이 하나는 있어야 하는가(표만 이어지는 세션을 만들지 않는다).
const SLIDES_PER_VISUAL = 3;

function slideTexts(xml) {
  return [...xml.matchAll(/<a:t>(.*?)<\/a:t>/gs)].map((m) => m[1].trim());
}

const SKIP = /목차|세션 목표|요약|실습 \d|별첨|참고 자료/;

async function measure(file) {
  const data = await readZip(file);
  const names = [...data.keys()]
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));
  const media = [...data.keys()].filter((n) => n.startsWith("ppt/media/")).length;
  const rows = names.map((n) => {
    const xml = data.get(n).toString("utf8");
    const texts = slideTexts(xml);
    // 도식이 있는 장은 글자 수가 적어도 얇지 않다 — 그 장이 담은 것은 그림 안에 있다.
    return {
      head: texts.slice(0, 4).join(" ").slice(0, 60),
      chars: texts.reduce((s, t) => s + t.length, 0),
      visual: xml.includes("<p:pic>"),
    };
  });
  const body = rows.filter((r) => !SKIP.test(r.head));
  const avg = body.length ? Math.round(body.reduce((s, r) => s + r.chars, 0) / body.length) : 0;
  const thin = body.filter((r) => !r.visual && r.chars < TARGET_MIN);
  const need = Math.ceil(body.length / SLIDES_PER_VISUAL);
  console.log(path.basename(file));
  console.log(`  장 ${rows.length}(15~30)  내용 장 ${body.length}  도식 ${media}(${need} 이상)`);
  console.log(`  내용 장 장당 ${avg}자 (${TARGET_MIN}~${TARGET_MAX}) · 얇은 장 ${thin.length}개`);
  for (const r of thin) console.log(`    얇다 ${String(r.chars).padStart(4)}자  ${r.head}`);
  console.log(`  장별: ${rows.map((r) => r.chars).join(", ")}`);
}

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("사용법: node tools/slide-density.js <원고.pptx…>");
    process.exit(2);
  }
  for (const f of files) await measure(f);
})();
