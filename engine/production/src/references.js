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

function checkReferences(inputPath, text) {
  const errors = [];
  const warnings = [];
  const own = sessionOf(text);
  const sessions = knownSessions(inputPath);
  const ownHeadings = headingsOf(text);
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
    if (/(^|[^A-Za-z0-9])S\d\d(?![0-9])/.test(line)) {
      errors.push(where + "파일명식 세션 참조(S0x)를 쓰지 않는다. 정확한 세션명을 쓴다.");
    }
  });
  return { errors, warnings };
}

module.exports = { checkReferences };
