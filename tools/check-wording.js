#!/usr/bin/env node
"use strict";
// 짧은 토박이 동사를 기술 용어 자리에 쓴 곳을 찾는다
// (guides/session-authoring-guide.md 「널리 쓰는 말로 쓴다」의 교체쌍 표).
//
//   node tools/check-wording.js courses/ai-native/sessions/s01.md …
//
// 강사 노트·코드 블록·실제 LLM 응답(별첨)은 보지 않는다 — 저자가 쓴 학습자 본문만 본다.
// 기계가 뜻을 보지는 못하므로 결과는 "읽어 볼 자리"이며, 맞는 쓰임이면 그대로 둔다.
const fs = require("fs");

const RULES = [
  [/가른다|가르는|갈린다|갈린|가르면/, "구분한다·나뉜다·결정한다"],
  [/고른다|고르고|고르는(?! 법)/, "선택한다"],
  [/\b재는 |재고,|잰다|재지 못|재야/, "측정한다"],
  [/쌓는다|쌓아|쌓고/, "완성한다·갖춘다"],
  [/남는다|남았다/, "있다·유지된다"],
  [/것을 안다\.|를 안다\./, "이해한다·설명한다"],
  [/잘 듣지 않/, "적합하지 않다"],
  [/돌린다|돌려 본|돌려 볼/, "실행한다"],
  [/커진다/, "중요해진다"],
  [/을 적고|를 적고/, "확인한다"],
];

// 저자가 쓴 학습자 본문만 남긴다.
function bodyLines(text) {
  const out = [];
  let fence = false, skip = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^```/.test(line)) { fence = !fence; return; }
    if (fence) return;
    if (/^\*\*(강사 노트|실제 LLM 응답|기록 그대로)\*\*\s*$/.test(line.trim())) { skip = true; return; }
    if (/^## /.test(line) || /^---\s*$/.test(line)) { skip = false; }
    if (skip || !line.trim()) return;
    out.push({ no: i + 1, text: line });
  });
  return out;
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error("사용: node tools/check-wording.js <원고.md …>");
  process.exit(2);
}

let found = 0;
for (const file of files) {
  const hits = [];
  for (const { no, text } of bodyLines(fs.readFileSync(file, "utf-8"))) {
    for (const [re, better] of RULES) {
      const m = re.exec(text);
      if (m) hits.push(`  ${no}행: "${m[0].trim()}" → ${better}\n    ${text.trim().slice(0, 80)}`);
    }
  }
  if (hits.length) {
    found += hits.length;
    console.log(file);
    console.log(hits.join("\n"));
  }
}
console.log(found ? `\n${found}곳. 문맥에 맞으면 그대로 둔다.` : "교체할 말이 없다.");
