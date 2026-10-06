#!/usr/bin/env node
// 인용문이 원전에 실제로 있는지 PC에서 확인하고, 결과만 한두 줄로 출력한다(LLM이 원문을 읽지 않게).
//
// 사용: node tools/verify-quote.js [--check] <원전> "<영문 인용>" ["<영문 인용>" ...]
//   인용을 여러 개 주면 원전을 한 번만 읽고 인용마다 결과 한 줄을 출력한다. 하나라도 "없음"이면 종료 코드 1.
//   원전: PDF 경로 | 텍스트 경로 | URL | 캐시 이름(references/sources/<이름>.txt, 예: larman-2004)
//   인용의 "…" 또는 "..."는 생략 표시로 보고, 나눈 조각이 순서대로 모두 있으면 "있음"이다.
//   조각 끝의 문장부호(. , ; : ! ?)와 줄표(—·–)와 그 둘레 공백은 비교하지 않는다(원문이 문장을
//   이어 가거나, PDF 추출에서 줄표가 빠진 경우).
//   --check: 원고에 쓰지 않을 조사용 조회 — "있음"이어도 기록하지 않는다.
// 원전 텍스트는 references/sources/에 한 번만 추출·저장한다(git 제외 — 저작물 원문).
// "있음"이면 references/verified.json에 기록한다(Production이 미확인 인용을 경고).
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const { quoteKey } = require("../engine/production/src/quoteKey");

const CACHE = path.join(__dirname, "..", "references", "sources");
// "있음"으로 확인한 인용의 기록. Production은 세션의 영문 인용이 여기에 없으면 경고한다.
const LEDGER = path.join(__dirname, "..", "references", "verified.json");

function record(quote, source) {
  const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf-8")) : {};
  ledger[quoteKey(quote)] = { source, date: new Date().toISOString().slice(0, 10) };
  const sorted = Object.fromEntries(Object.entries(ledger).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(LEDGER, JSON.stringify(sorted, null, 2) + "\n");
}

function cached(source) {
  fs.mkdirSync(CACHE, { recursive: true });
  const named = path.join(CACHE, source + ".txt");
  if (!/[\/.]/.test(source) && fs.existsSync(named)) return named;
  if (/^https?:\/\//.test(source)) {
    const out = path.join(CACHE, "url-" + crypto.createHash("sha1").update(source).digest("hex").slice(0, 12) + ".txt");
    if (!fs.existsSync(out)) {
      const raw = execFileSync("curl", ["-sL", "--max-time", "60", "-A", "Mozilla/5.0", source], { maxBuffer: 64 << 20 });
      const isPdf = raw.subarray(0, 5).toString() === "%PDF-";
      if (isPdf) {
        const tmp = out.replace(/\.txt$/, ".pdf");
        fs.writeFileSync(tmp, raw);
        execFileSync("pdftotext", ["-layout", tmp, out]);
        fs.unlinkSync(tmp);
      } else {
        const text = raw.toString("utf-8").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
          .replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;|&ndash;/g, "-");
        fs.writeFileSync(out, source + "\n" + text);
      }
    }
    return out;
  }
  if (!fs.existsSync(source)) throw new Error("원전이 없다: " + source);
  if (/\.pdf$/i.test(source)) {
    const out = path.join(CACHE, path.basename(source).replace(/\.pdf$/i, "").replace(/[^\w.-]+/g, "_") + ".txt");
    if (!fs.existsSync(out)) execFileSync("pdftotext", ["-layout", source, out]);
    return out;
  }
  return source;
}

// 대소문자·따옴표·대시·줄끝 하이픈·공백(괄호 안쪽 포함) 차이를 없앤다. 원문 위치를 되찾도록 인덱스 표도 만든다.
function normalize(text) {
  const src = text.replace(/-\s*\n\s*/g, "").replace(/­/g, "");
  let out = "", map = [], dash = false;
  for (let i = 0; i < src.length; i++) {
    let ch = src[i].toLowerCase();
    if ("‘’`´".includes(ch)) ch = "'";
    else if ("“”«»".includes(ch)) ch = '"';
    else if ("‐‑".includes(ch)) ch = "-";
    // 줄표는 둘레 공백과 함께 지운다: "project — must"·"project—must"·"projectmust"가 같다.
    if ("–—".includes(ch)) {
      if (out.endsWith(" ")) { out = out.slice(0, -1); map.pop(); }
      dash = true; continue;
    }
    if (/\s/.test(ch)) { if (dash || out.endsWith(" ") || out.endsWith("(")) continue; ch = " "; }
    // 괄호 안쪽 공백은 비교하지 않는다: HTML 추출의 "( white diamond )"와 "(white diamond)"가 같다.
    if (ch === ")" && out.endsWith(" ")) { out = out.slice(0, -1); map.pop(); }
    dash = false;
    out += ch; map.push(i);
  }
  return { text: out, map, src };
}

function main() {
  const args = process.argv.slice(2);
  const check = args[0] === "--check";
  const [source, ...quotes] = check ? args.slice(1) : args;
  if (!source || !quotes.length) { console.error('사용: node tools/verify-quote.js [--check] <원전> "<영문 인용>" ["<영문 인용>" ...]'); process.exit(2); }
  const file = cached(source);
  const doc = normalize(fs.readFileSync(file, "utf-8"));
  let missing = 0;
  for (const quote of quotes) if (!verify(doc, file, source, quote, check)) missing++;
  if (missing) process.exit(1);
}

// One quote against the normalized source: prints one line, records it when found (unless --check).
function verify(doc, file, source, quote, check) {
  const parts = quote.split(/…|\.\.\./).map((p) => normalize(p).text.trim().replace(/[.,;:!?]+$/, "").trim()).filter(Boolean);
  // 생략(…)으로 나눈 조각은 앞 조각 뒤 GAP자 안에서 이어져야 한다.
  const GAP = 600;
  const tryFrom = (start) => {
    let at = start;
    for (let k = 1; k < parts.length; k++) {
      const i = doc.text.indexOf(parts[k], at);
      if (i < 0 || i - at > GAP) return -1;
      at = i + parts[k].length;
    }
    return at;
  };
  let first = doc.text.indexOf(parts[0]), end = -1;
  while (first >= 0 && (end = tryFrom(first + parts[0].length)) < 0) first = doc.text.indexOf(parts[0], first + 1);
  if (first < 0) {
    const p = parts.reduce((a, b) => (b.length > a.length ? b : a));
    let n = p.length;
    while (n > 10 && doc.text.indexOf(p.slice(0, n)) < 0) n = Math.floor(n * 0.8);
    const j = n > 10 ? doc.text.indexOf(p.slice(0, n)) : -1;
    const near = j >= 0 ? doc.src.slice(doc.map[j], doc.map[Math.min(j + Math.min(p.length, 200), doc.map.length - 1)]).replace(/\s+/g, " ") : "";
    console.log("없음: " + path.basename(file) + (j >= 0 ? ` — 가장 긴 조각의 앞 ${n}/${p.length}자만 일치, 원문: "${near}"` : ` — "${quote.slice(0, 60)}"`));
    return false;
  }
  const s = doc.map[Math.max(0, first - 40)], e = doc.map[Math.min(doc.map.length - 1, Math.min(end, first + 240) + 40)];
  if (!check) record(quote, source);
  console.log((check ? "있음(기록 안 함): " : "있음: ") + path.basename(file) + ` — "…${doc.src.slice(s, e).replace(/\s+/g, " ")}…"`);
  return true;
}

main();
