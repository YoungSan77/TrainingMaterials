"use strict";
// Cross-reference check for Session Source Markdown (session-authoring-guide.md, "참조 형식").
//
//   - A session is referenced by its exact name in double quotes: "03. 정적 모델 — 도메인 개념과 관계".
//   - A topic is referenced in corner brackets: 「NN. 제목」. It points into the current session,
//     unless it directly follows a session reference: "02. 요구 분석과 유스케이스"의 「44. …」
//     (several topics may be chained: 「…」·「…」, 「…」과 「…」).
//
// Session names are known from sibling Session Sources in the same directory and from the
// course's course-design.md ("### SNN — 세션명 (시간)"); topic headings from sibling sources.
const fs = require("fs");
const path = require("path");

const HEADING = /^## (\d\d)\. (.+)$/;

function stripCode(text) {
  const out = [];
  let fence = false;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("```")) { fence = !fence; out.push(""); continue; }
    out.push(fence ? "" : line);
  }
  return out;
}

function sessionOf(text) {
  const m = /^Session 명:\s*(\d\d)\.\s*(.+?)\s*$/m.exec(text);
  return m ? { number: m[1], name: m[1] + ". " + m[2] } : null;
}

function headingsOf(text) {
  const map = new Map();
  for (const line of stripCode(text)) {
    const h = HEADING.exec(line);
    if (h) map.set(h[1] + ". " + h[2].trim(), true);
  }
  return map;
}

// { "03": { name: "03. …", headings: Map|null } }
function knownSessions(inputPath) {
  const dir = path.dirname(path.resolve(inputPath));
  const sessions = {};
  const design = path.join(dir, "..", "course-design.md");
  if (fs.existsSync(design)) {
    const re = /^### S(\d\d) — (.+?) \([^)]*\)\s*$/gm;
    let m;
    const text = fs.readFileSync(design, "utf-8");
    while ((m = re.exec(text))) sessions[m[1]] = { name: m[1] + ". " + m[2], headings: null };
  }
  for (const f of fs.readdirSync(dir)) {
    if (!/\.md$/i.test(f)) continue;
    const text = fs.readFileSync(path.join(dir, f), "utf-8");
    const s = sessionOf(text);
    if (!s) continue;
    sessions[s.number] = { name: s.name, headings: headingsOf(text) };
  }
  return sessions;
}

const SESSION_REF = /"(\d\d)\. ([^"\n]+)"/g;
const TOPIC_REF = /「(\d\d)\. ([^」\n]+)」/g;
// A topic reference targets another session when it follows `"NN. 세션명"의` directly, possibly
// after other topic references joined by ·, 쉼표, 과/와, 및, 또는.
const TARGET = /"(\d\d)\. [^"\n]+"의\s*(?:「[^」\n]*」\s*(?:·|,|과|와|및|또는)?\s*)*$/;

// Reference labels (session-authoring-guide.md "인용과 출처", production-guide.md "별첨 — 참고 자료"):
// a citation or reference in a session is "[저자 연도]" (or "[Wikipedia: 항목]"), and every label
// is an entry "N. **[레이블]** …" of the course appendix references.md next to the sessions.
const APPENDIX = "references.md";
const { quoteKey, findLedger } = require("./quoteKey");
const { citationParts } = require("./paragraphs");
// A label starts with a capital (author, organization, "Wikipedia: …") and carries the year when it
// is known: [Larman 2004], [Ambler], [Jacobson 1992, 재인용]. A markdown link text "[…](url)" is not one.
const LABEL = /\[([A-Z][^\[\]\n()"]*?)(?:, 재인용)?\](?!\()/g;
const ENTRY = /^\d+\.\s+\*\*\[([^\]]+)\]\*\*/;
// The old citation tail "…", 저자, 년도 (before labels).
const OLD_TAIL = /"\s*,\s*[A-Z][^"\[\]\n]*,\s*\d{4}(?:,\s*www)?\s*$/;

function labelsIn(text) {
  const out = [];
  stripCode(text).forEach((line, i) => {
    let m;
    LABEL.lastIndex = 0;
    while ((m = LABEL.exec(line))) out.push({ label: m[1], line: i + 1 });
  });
  return out;
}

function appendixEntries(text) {
  return stripCode(text).map((line, i) => ({ m: ENTRY.exec(line), line: i + 1 })).filter((e) => e.m).map((e) => ({ label: e.m[1], line: e.line }));
}

function checkLabels(inputPath, text) {
  const errors = [];
  const warnings = [];
  const dir = path.dirname(path.resolve(inputPath));
  if (path.basename(inputPath) === APPENDIX) {
    const entries = appendixEntries(text);
    const seen = new Set();
    for (const e of entries) {
      if (seen.has(e.label)) errors.push("원고 " + e.line + "행: 참고 자료 레이블 [" + e.label + "]이 중복된다.");
      seen.add(e.label);
    }
    const used = new Set();
    for (const f of fs.readdirSync(dir)) {
      if (!/^s\d\d\.md$/i.test(f)) continue;
      for (const u of labelsIn(fs.readFileSync(path.join(dir, f), "utf-8"))) used.add(u.label);
    }
    for (const u of used) if (!seen.has(u)) errors.push("세션이 쓰는 레이블 [" + u + "]이 별첨에 없다.");
    return { errors, warnings };
  }
  const appendix = path.join(dir, APPENDIX);
  const known = fs.existsSync(appendix) ? new Set(appendixEntries(fs.readFileSync(appendix, "utf-8")).map((e) => e.label)) : null;
  for (const u of labelsIn(text)) {
    if (!known) { errors.push("원고 " + u.line + "행: 레이블 [" + u.label + "]을 확인할 별첨 " + APPENDIX + "이 없다."); break; }
    if (!known.has(u.label)) errors.push("원고 " + u.line + "행: 레이블 [" + u.label + "]이 별첨 " + APPENDIX + "에 없다.");
  }
  // An English original must be recorded as verified (tools/verify-quote.js), when the repository
  // keeps a ledger references/verified.json.
  const ledgerFile = findLedger(dir);
  const ledger = ledgerFile ? JSON.parse(fs.readFileSync(ledgerFile, "utf-8")) : null;
  if (ledger) stripCode(text).forEach((line, i) => {
    const parts = citationParts(line.trim().replace(/^-\s+/, ""));
    if (!parts || parts[2] === undefined || !/\[/.test(parts[3])) return;
    if (!ledger[quoteKey(parts[2])]) warnings.push("원고 " + (i + 1) + "행: 영문 인용이 원문 확인 기록에 없다 — node tools/verify-quote.js <원전> \"" + parts[2].slice(0, 40) + "…\"");
  });
  stripCode(text).forEach((line, i) => {
    if (OLD_TAIL.test(line)) warnings.push("원고 " + (i + 1) + "행: 인용 출처를 \"저자, 년도\"가 아니라 레이블 [저자 연도]로 쓴다.");
  });
  return { errors, warnings };
}

function checkReferences(inputPath, text) {
  const errors = [];
  const warnings = [];
  const own = sessionOf(text);
  const sessions = knownSessions(inputPath);
  // A review deck "sNN-add.md" holds only the added/changed topics of the full candidate
  // "sNN.md" next to it; its own-session references resolve against that full candidate.
  const review = /^(s\d\d)-add\.md$/i.exec(path.basename(inputPath));
  const full = review && path.join(path.dirname(path.resolve(inputPath)), review[1] + ".md");
  const ownHeadings = full && fs.existsSync(full) ? headingsOf(fs.readFileSync(full, "utf-8")) : headingsOf(text);
  const lines = stripCode(text);
  let inToc = false;
  lines.forEach((line, i) => {
    if (/^## 목차\s*$/.test(line)) { inToc = true; return; }
    if (HEADING.test(line)) inToc = false;
    if (inToc || /^Session 명:/.test(line)) return;
    const where = "원고 " + (i + 1) + "행: ";
    let m;
    SESSION_REF.lastIndex = 0;
    while ((m = SESSION_REF.exec(line))) {
      const s = sessions[m[1]];
      const ref = m[1] + ". " + m[2];
      if (!s) warnings.push(where + "세션 참조 \"" + ref + "\"를 확인할 수 없다(과정 설계에 없음).");
      else if (s.name !== ref) errors.push(where + "세션 참조 \"" + ref + "\"가 세션명 \"" + s.name + "\"과 다르다. 주제 참조라면 「」를 쓴다.");
    }
    TOPIC_REF.lastIndex = 0;
    while ((m = TOPIC_REF.exec(line))) {
      const ref = m[1] + ". " + m[2];
      const t = TARGET.exec(line.slice(0, m.index));
      const targetNo = t ? t[1] : own && own.number;
      const target = t ? sessions[targetNo] : { name: own && own.name, headings: ownHeadings };
      if (!target || !target.headings) {
        warnings.push(where + "주제 참조 「" + ref + "」의 세션 원고가 없어 확인할 수 없다.");
        continue;
      }
      if (!target.headings.has(ref)) {
        const sameTitle = [...target.headings.keys()].find((k) => k.slice(4) === m[2]);
        errors.push(where + "주제 참조 「" + ref + "」가 \"" + target.name + "\"에 없다" +
          (sameTitle ? ". 번호를 「" + sameTitle + "」로 고친다." : "."));
      }
    }
    // A bare number 「NN」 is not a reference form (session-authoring-guide.md "참조 형식"):
    // the title is what keeps the reference readable and checkable when topics move.
    const BARE = /「(\d\d)」/g;
    while ((m = BARE.exec(line))) {
      const t = TARGET.exec(line.slice(0, m.index));
      const heads = t ? sessions[t[1]] && sessions[t[1]].headings : ownHeadings;
      const full = heads && [...heads.keys()].find((k) => k.startsWith(m[1] + ". "));
      errors.push(where + "주제 참조 「" + m[1] + "」에 제목이 없다" + (full ? ". 「" + full + "」로 쓴다." : "."));
    }
    if (/(^|[^A-Za-z0-9])S\d\d(?![0-9])/.test(line)) {
      errors.push(where + "파일명식 세션 참조(S0x)를 쓰지 않는다. 정확한 세션명을 쓴다.");
    }
  });
  const labels = checkLabels(inputPath, text);
  errors.push(...labels.errors);
  warnings.push(...labels.warnings);
  return { errors, warnings };
}

module.exports = { checkReferences, checkLabels };
