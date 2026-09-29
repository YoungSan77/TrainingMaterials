"use strict";
// Code excerpt check (session-authoring-guide.md, "10. 코드 매핑"): every ```java block of a
// session is an excerpt of the compiled source in `code/sNN/` beside the session file. A line
// "// ... <설명> 생략" marks an omission; each run of lines between omissions must appear verbatim
// in the source. A session with Java blocks but no source folder is reported as a warning.
const fs = require("fs");
const path = require("path");

const OMISSION = /^\s*\/\/ \.\.\. .*생략\s*$/;

// Every .java file under `dir`, package subfolders included (code/s05/주문/주문.java), in a stable order.
function javaFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".java")) out.push(p);
    }
  };
  walk(dir);
  return out;
}

function javaBlocks(markdown) {
  return Array.from(markdown.matchAll(/^```java[ \t]*\n([\s\S]*?)^```[ \t]*$/gm), (m) => m[1].replace(/\n$/, ""));
}

function runs(block) {
  const out = [];
  let cur = [];
  const flush = () => {
    while (cur.length && !cur[0].trim()) cur.shift();
    while (cur.length && !cur[cur.length - 1].trim()) cur.pop();
    if (cur.length) out.push(cur.join("\n"));
    cur = [];
  };
  for (const line of block.split("\n")) {
    if (OMISSION.test(line)) flush();
    else cur.push(line);
  }
  flush();
  return out;
}

function checkCodeSources(inputPath, markdown) {
  const errors = [], warnings = [];
  const blocks = javaBlocks(markdown);
  if (!blocks.length) return { errors, warnings };
  const m = /^(s\d\d)(?:-add)?\.md$/i.exec(path.basename(inputPath));
  if (!m) return { errors, warnings };
  const dir = path.join(path.dirname(path.resolve(inputPath)), "code", m[1].toLowerCase());
  const files = javaFiles(dir);
  if (!files.length) {
    warnings.push(`자바 코드 원본(code/${m[1].toLowerCase()}/*.java)이 없어 코드 발췌를 확인하지 않았다.`);
    return { errors, warnings };
  }
  const source = files.map((f) => fs.readFileSync(f, "utf-8").replace(/\r\n/g, "\n")).join("\n");
  blocks.forEach((block, i) => {
    for (const run of runs(block)) {
      if (!source.includes(run)) {
        errors.push(`자바 코드 ${i + 1}번째 블록이 code/${m[1].toLowerCase()}/의 원본과 다르다: "${run.split("\n")[0].trim()}"`);
        break;
      }
    }
  });
  return { errors, warnings };
}

// The running case keeps its identifiers across sessions (sw-engineering-principles.md "교재에
// 적용하기"): an enum declared in an earlier session's code/sNN keeps every value in later sessions.
// A later session may add values it discovered; renaming or dropping one is reported. Warning only.
function enumValues(dir) {
  const out = new Map();
  for (const f of javaFiles(dir)) {
    const text = fs.readFileSync(f, "utf-8");
    for (const m of text.matchAll(/\benum\s+([^\s{]+)\s*\{([^}]*)\}/g)) {
      out.set(m[1], m[2].split(";")[0].split(",").map((v) => v.trim()).filter(Boolean));
    }
  }
  return out;
}

function checkEnumConsistency(inputPath) {
  const warnings = [];
  const m = /^s(\d\d)(?:-add)?\.md$/i.exec(path.basename(inputPath));
  if (!m) return warnings;
  const base = path.join(path.dirname(path.resolve(inputPath)), "code");
  const mine = enumValues(path.join(base, "s" + m[1]));
  for (let n = 1; n < Number(m[1]); n++) {
    const earlier = enumValues(path.join(base, "s" + String(n).padStart(2, "0")));
    for (const [name, values] of earlier) {
      if (!mine.has(name)) continue;
      const missing = values.filter((v) => !mine.get(name).includes(v));
      if (missing.length) warnings.push(`enum ${name}의 값 ${missing.join(", ")}이 앞 세션(s${String(n).padStart(2, "0")})과 다르다.`);
    }
  }
  return warnings;
}

module.exports = { checkCodeSources, checkEnumConsistency, runs };
