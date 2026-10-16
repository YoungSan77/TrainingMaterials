#!/usr/bin/env node
// 원고의 topic 제목과 lead 문장만 차례로 보여 준다(session-authoring-guide.md 「검토 절차」).
// lead만 이어 읽어 세션의 논지가 성립하면 통과다. 슬라이드를 설명하는 문장이나 제목과 어긋난
// 문장은 여기서 바로 드러난다.
//
// 사용: node tools/read-leads.js <원고.md> [원고.md ...]
"use strict";
const fs = require("fs");
const path = require("path");
const { parse } = require(path.join(__dirname, "..", "engine", "production", "src", "parse"));

// 그 topic의 첫 본문 문장: 인용으로 여는 topic은 인용의 한글 부분을 lead로 본다.
function lead(section) {
  for (const block of section.blocks || []) {
    if (!["text", "bullet"].includes(block.kind)) continue;
    const text = String(block.text).replace(/\*\*/g, "").trim();
    if (!text || /^(?:표|도식|다이어그램|인용문|주석|문서 형식|배치|페이지 분할)\s*(?:—|$)/.test(text)) continue;
    return { text, quote: !!(block.meta && block.meta.quote), bullet: block.kind === "bullet" };
  }
  return null;
}

for (const file of process.argv.slice(2)) {
  const { sections } = parse(fs.readFileSync(file, "utf-8"));
  console.log("\n=== " + path.basename(file));
  for (const section of sections) {
    const l = lead(section);
    if (!l) { console.log("\n[" + section.title + "] — 본문 없음(그룹)"); continue; }
    const mark = l.quote ? " (인용)" : l.bullet ? " (bullet — lead 문장이 없다)" : "";
    console.log("\n[" + section.title + "]" + mark + "\n  " + l.text);
  }
}
