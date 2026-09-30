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

// The course's 영한 용어집 (course-design.md, "### 영한 용어집…"): analysis code names things in
// Korean (주문상태.결제대기), design code in English (OrderStatus.PENDING_PAYMENT). The table maps a
// Korean term, spaces ignored, to its English name so an enum can be followed across the switch.
function glossary(sessionsDir) {
  const out = new Map();
  const file = path.join(sessionsDir, "..", "course-design.md");
  if (!fs.existsSync(file)) return out;
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  const start = lines.findIndex((l) => /^###\s+영한 용어집/.test(l));
  if (start < 0) return out;
  const clean = (c) => c.replace(/\*\*|`/g, "").trim();
  for (const line of lines.slice(start + 1)) {
    if (/^#{2,3}\s/.test(line)) break;
    const cells = line.split("|").slice(1, -1).map(clean);
    if (cells.length < 2 || /^-+$/.test(cells[0])) continue;
    const ko = cells[0].split("/").map((c) => c.trim());
    const en = cells[1].split("/").map((c) => c.trim());
    if (ko.length !== en.length) continue;
    ko.forEach((k, i) => out.set(k.replace(/\s/g, ""), en[i]));
  }
  return out;
}

function checkEnumConsistency(inputPath) {
  const warnings = [];
  const m = /^s(\d\d)(?:-add)?\.md$/i.exec(path.basename(inputPath));
  if (!m) return warnings;
  const sessionsDir = path.dirname(path.resolve(inputPath));
  const base = path.join(sessionsDir, "code");
  const terms = glossary(sessionsDir);
  const english = (ko) => terms.get(ko.replace(/\s/g, ""));
  const mine = enumValues(path.join(base, "s" + m[1]));
  for (let n = 1; n < Number(m[1]); n++) {
    const tag = "s" + String(n).padStart(2, "0");
    const earlier = enumValues(path.join(base, tag));
    for (const [name, values] of earlier) {
      // Same name: same values. Korean name absent but its English name present: values through the glossary.
      const translated = !mine.has(name) && english(name) && mine.has(english(name));
      if (!mine.has(name) && !translated) continue;
      const target = mine.get(translated ? english(name) : name);
      const unmapped = translated ? values.filter((v) => !english(v)) : [];
      const missing = values.filter((v) => !unmapped.includes(v) && !target.includes(translated ? english(v) : v));
      if (missing.length) warnings.push(`enum ${name}의 값 ${missing.join(", ")}이 앞 세션(${tag})과 다르다.`);
      if (unmapped.length) warnings.push(`enum ${name}의 값 ${unmapped.join(", ")}이 영한 용어집에 없어 ${english(name)}과 대응을 확인할 수 없다.`);
    }
  }
  return warnings;
}

module.exports = { checkCodeSources, checkEnumConsistency, runs };
