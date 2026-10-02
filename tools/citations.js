#!/usr/bin/env node
// 이미 확인한 인용문을 찾는다. 원천은 각 Session Source의 「**인용문**」과 강사 노트의 「인용 근거」이며,
// 이 도구는 그것을 모아 보여 줄 뿐 따로 저장하지 않는다(DRY).
// 새 인용을 찾기 전에 먼저 여기서 같은 원문·저자를 찾는다.
//
// 사용: node tools/citations.js <course 폴더> [검색어 ...]
//   예: node tools/citations.js courses/ooad Larman 21.1
//   검색어는 모두 포함해야 한다(대소문자 무시). 대상: 한글·원문·저자·근거.
"use strict";
const fs = require("fs");
const path = require("path");
const { citationParts, bulletCitation } = require("../engine/production/src/paragraphs");

const [course, ...terms] = process.argv.slice(2);
if (!course) {
  console.error("사용: node tools/citations.js <course 폴더> [검색어 ...]");
  process.exit(1);
}
const dir = path.join(course, "sessions");
const found = [];
for (const file of fs.readdirSync(dir).filter((f) => /^s\d\d\.md$/.test(f)).sort()) {
  const lines = fs.readFileSync(path.join(dir, file), "utf-8").split("\n");
  let topic = "", quotes = [], notes = [], inNotes = false;
  const flush = () => {
    for (const q of quotes) found.push({ session: file.slice(0, 3), topic, ...q, notes });
    quotes = []; notes = [];
  };
  lines.forEach((line, i) => {
    const h = /^## (\d\d\. .+)$/.exec(line);
    if (h) { flush(); topic = h[1]; inNotes = false; return; }
    if (/^\*\*인용문\*\*\s*$/.test(line)) {
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const text = lines[j] || "";
      const parts = citationParts(text);
      quotes.push(parts
        ? { korean: parts[1], english: parts[2] || "", source: parts[3], line: j + 1 }
        : { korean: text, english: "", source: "", line: j + 1 });
    }
    // 들여쓴 bullet 인용(session-authoring-guide.md 「5. 인용과 출처」)도 모은다. 강사 노트 안의 bullet은 제외한다.
    const bullet = /^\s*- (".+)$/.exec(line);
    const cite = bullet && !inNotes && bulletCitation(bullet[1]);
    if (cite) quotes.push({ korean: cite[1], english: cite[2], source: cite[3], line: i + 1 });
    if (/^\*\*강사 노트\*\*\s*$/.test(line)) inNotes = true;
    if (/^---\s*$/.test(line) || h) inNotes = false;
    if (/^- 인용 근거/.test(line)) notes.push(line.replace(/^- 인용 근거:\s*/, ""));
  });
  flush();
}
const match = (c) => terms.every((t) =>
  [c.korean, c.english, c.source, ...c.notes].join(" ").toLowerCase().includes(t.toLowerCase()));
const hits = found.filter(match);
for (const c of hits) {
  console.log(`${c.session}:${c.line} 「${c.topic}」 — ${c.source}`);
  if (c.english) console.log(`  원문: ${c.english}`);
  console.log(`  한글: ${c.korean.replace(/\*\*/g, "")}`);
  for (const n of c.notes) console.log(`  근거: ${n}`);
}
console.log(`\n${hits.length}건 / 전체 ${found.length}건`);
