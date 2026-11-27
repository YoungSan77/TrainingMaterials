"use strict";
// Cross-reference check for Session Source Markdown (session-authoring-guide.md, "참조 형식").
//
//   - A session is referenced by its exact name in double quotes: "03. 정적 모델 — 도메인 개념과 관계".
//   - A topic is referenced in corner brackets: 「NN. 제목」. It points into the current session,
//     unless it directly follows a session reference: "02. 요구 분석과 유스케이스"의 「44. …」
//     (several topics may be chained: 「…」·「…」, 「…」과 「…」).
//
// Curriculum owns session names in migrated courses. Topic headings come from sibling sources.
const fs = require("fs");
const path = require("path");
const { courseSessions } = require("./course");

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

function knownSessions(inputPath) {
  const dir = path.dirname(path.resolve(inputPath));
  const { sessions: listedSessions, fromCurriculum } = courseSessions(inputPath);
  const sessions = Object.fromEntries(listedSessions.map(({ number, name }) => [number, { name, headings: null }]));
  for (const f of fs.readdirSync(dir)) {
    if (!/\.md$/i.test(f)) continue;
    const text = fs.readFileSync(path.join(dir, f), "utf-8");
    const s = sessionOf(text);
    if (!s) continue;
    if (fromCurriculum && !sessions[s.number]) continue;
    const name = fromCurriculum ? sessions[s.number].name : s.name;
    sessions[s.number] = { name, headings: headingsOf(text) };
  }
  return { sessions, fromCurriculum };
}

// A session is quoted with the word 세션 in front of its number: "세션 02. 요구 분석과 유스케이스".
// Without it a bare "02. …" reads like a topic of the session at hand.
const SESSION_REF = /"(세션 )?(\d\d)\. ([^"\n]+)"/g;
const BARE_SESSION = /"(?:세션 )?(\d\d)\.\s*"/g;
const TOPIC_REF = /「(\d\d)\. ([^」\n]+)」/g;
// 문서의 항목 참조 — `foo.md`의 「…」, 제작 지침의 「…」. 세션의 topic 참조와 가른다.
const DOC_ITEM = /(?:`[^`\n]*\.md`|제작 지침)\s*(?:의|에서|에)?\s*「[^」\n]+」/g;
// A topic reference targets another session when it follows `"NN. 세션명"의` directly, possibly
// after other topic references joined by ·, 쉼표, 과/와, 및, 또는 -- each of which may name a
// sub-topic of its group: `"04. …"의 「06. 시퀀스 다이어그램」의 「주문 취소 시퀀스」·「08. …」`.
const TARGET = /"세션 (\d\d)\. [^"\n]+"의\s*(?:「[^」\n]*」(?:의\s*「[^」\n]*」)*\s*(?:·|,|과|와|및|또는)?\s*)*$/;

// Reference labels (session-authoring-guide.md "인용과 출처", production-guide.md "별첨 — 참고 자료"):
// a citation or reference in a session is "[저자 연도]" (or "[Wikipedia: 항목]"), and every label
// is an entry "N. **[레이블]** …" of the course appendix references.md next to the sessions.
const APPENDIX = "references.md";
const { quoteKey, findLedger } = require("./quoteKey");
const { citationParts, summaryParts, LABEL_TAIL } = require("./paragraphs");

// A summary citation counts only when its tail is a reference label, so ordinary prose that happens
// to carry a quoted phrase and a bracket is not reported as an unverified quote.
function summaryWithLabel(text) {
  const parts = summaryParts(text);
  return parts && LABEL_TAIL.test(parts[3]) ? parts : null;
}
// A label starts with a capital (author, organization, "Wikipedia: …") and carries the year when it
// is known: [Larman 2004], [Ambler], [Jacobson 1992, 재인용]. A markdown link text "[…](url)" is not one.
const LABEL = /\[([A-Z][^\[\]\n()"]*?)(?:, 재인용)?\](?!\()/g;
// Literal identifiers such as `[H]` are not bibliography labels. Match complete,
// same-line code spans with equal backtick runs; leave unmatched delimiters alone.
const INLINE_CODE = /(?<!`)(`+)(?!`)(.*?)(?<!`)\1(?!`)/g;
const ENTRY = /^\d+\.\s+\*\*\[([^\]]+)\]\*\*/;
// The old citation tail "…", 저자, 년도 (before labels).
const OLD_TAIL = /"\s*,\s*[A-Z][^"\[\]\n]*,\s*\d{4}(?:,\s*www)?\s*$/;

function labelsIn(text) {
  const out = [];
  stripCode(text).forEach((line, i) => {
    const prose = line.replace(INLINE_CODE, " ");
    let m;
    LABEL.lastIndex = 0;
    while ((m = LABEL.exec(prose))) out.push({ label: m[1], line: i + 1 });
  });
  return out;
}

function appendixEntries(text) {
  return stripCode(text).map((line, i) => ({ m: ENTRY.exec(line), line: i + 1, text: line })).filter((e) => e.m).map((e) => ({ label: e.m[1], line: e.line, text: e.text }));
}

function checkLabels(inputPath, text) {
  const errors = [];
  const warnings = [];
  // 돌리지 못한 검사는 **경고가 아니라 미검사**다. 경고로 내면 고칠 수 없는 것이 완료 기준(경고
  // 0개)을 막고, 아무 말도 하지 않으면 검사가 꺼진 것을 알 수 없다(2026-11-27).
  const notes = [];
  const dir = path.dirname(path.resolve(inputPath));
  if (path.basename(inputPath) === APPENDIX) {
    const entries = appendixEntries(text);
    const seen = new Set();
    for (const e of entries) {
      if (seen.has(e.label)) errors.push("원고 " + e.line + "행: 참고 자료 레이블 [" + e.label + "]이 중복된다.");
      seen.add(e.label);
    }
    // 별첨은 **현행 세션**이 쓰는 레이블을 담는다. 승인 Curriculum의 세션명과 다른 세션명을 단
    // 원고는 현행 세션 원고가 아니다 — 편성이 바뀌기 전의 원고가 폴더에 남아 있는 것이고, 그 원고
    // 자체의 검사가 세션명 불일치를 오류로 보고한다. 그것이 쓰던 옛 레이블까지 별첨에 남겨 두면
    // 지금 어느 세션도 쓰지 않는 자료가 목록에 쌓인다(2026-11-27).
    const { sessions, fromCurriculum } = courseSessions(inputPath);
    const approved = new Map(sessions.map((s) => [s.number, s.name]));
    const used = new Set();
    const stale = [];
    const written = new Set();
    for (const f of fs.readdirSync(dir)) {
      if (!/^s\d\d\.md$/i.test(f)) continue;
      const body = fs.readFileSync(path.join(dir, f), "utf-8");
      const own = /^Session 명:\s*(.+)$/m.exec(body)?.[1].trim();
      const number = /^(\d\d)\./.exec(String(own || ""))?.[1];
      if (fromCurriculum && number && approved.get(number) !== own) { stale.push(f); continue; }
      if (number) written.add(number);
      for (const u of labelsIn(body)) used.add(u.label);
    }
    if (stale.length) notes.push(`승인 Curriculum의 세션명과 다른 원고는 레이블 대조에서 뺐다: ${stale.sort().join("·")}`);
    for (const u of used) if (!seen.has(u)) errors.push("세션이 쓰는 레이블 [" + u + "]이 별첨에 없다.");
    // 반대 방향 — 목록에만 있고 어느 세션도 쓰지 않는 레이블. 인용하지 않기로 한 자료는 항목 끝의
    // "(읽을거리)"가 그 사실을 밝히므로 넘긴다(session-authoring-guide.md 「별첨 — 참고 자료」).
    //
    // 이 방향은 **과정의 세션 원고가 다 있을 때만** 뜻이 있다. 목록은 과정 수준에서 선정하므로
    // 아직 쓰지 않은 세션이 있으면 그 세션이 쓸 자료가 "아무도 쓰지 않는 것"으로 잡힌다 — 집필
    // 중에는 그것이 정상이고, 경고로 내면 지울 수 없는 경고가 쌓인다(2026-11-27).
    const missing = fromCurriculum ? sessions.filter((s) => !written.has(s.number)) : [];
    if (missing.length) {
      notes.push(`원고가 없는 세션(${missing.map((s) => s.number).join("·")})이 있어 "어느 세션도 쓰지 않는 레이블" 검사는 돌리지 않았다.`);
    } else {
      for (const e of entries) {
        if (used.has(e.label) || /\(읽을거리\)/.test(e.text)) continue;
        warnings.push("원고 " + e.line + "행: 레이블 [" + e.label + "]을 어느 세션도 쓰지 않는다. 인용하지 않을 자료면 항목 끝에 (읽을거리)를 붙인다.");
      }
    }
    return { errors, warnings, notes };
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
    const bare = line.trim().replace(/^-\s+/, "");
    // Either form of citation (session-authoring-guide.md "5. 인용과 출처"): a quoted Korean
    // translation, or an unquoted Korean summary. The summary form used to escape this check.
    const quoted = citationParts(bare);
    const parts = quoted && quoted[2] !== undefined ? quoted : summaryWithLabel(bare);
    if (!parts || parts[2] === undefined || !/\[/.test(parts[3])) return;
    if (!ledger[quoteKey(parts[2])]) warnings.push("원고 " + (i + 1) + "행: 영문 인용이 원문 확인 기록에 없다 — node tools/verify-quote.js <원전> \"" + parts[2].slice(0, 40) + "…\"");
  });
  stripCode(text).forEach((line, i) => {
    if (OLD_TAIL.test(line)) warnings.push("원고 " + (i + 1) + "행: 인용 출처를 \"저자, 년도\"가 아니라 레이블 [저자 연도]로 쓴다.");
  });
  return { errors, warnings };
}

function checkReferences(inputPath, text) {
  const excerpt=require('./responseExcerpts').verifyResponseExcerpts(inputPath,text);
  const errors = [...excerpt.errors];
  const warnings = [];
  const own = sessionOf(text);
  const { sessions, fromCurriculum } = knownSessions(inputPath);
  if (fromCurriculum && own) {
    const approved = sessions[own.number];
    if (!approved) errors.push(`원고 세션 "${own.name}"이 Curriculum에 없다.`);
    else if (approved.name !== own.name) errors.push(`원고 세션명 "${own.name}"이 Curriculum의 "${approved.name}"과 다르다.`);
  }
  // A review deck "sNN-add.md" holds only the added/changed topics of the full candidate
  // "sNN.md" next to it; its own-session references resolve against that full candidate.
  const review = /^(s\d\d)-add\.md$/i.exec(path.basename(inputPath));
  const full = review && path.join(path.dirname(path.resolve(inputPath)), review[1] + ".md");
  const ownHeadings = full && fs.existsSync(full) ? headingsOf(fs.readFileSync(full, "utf-8")) : headingsOf(text);
  const lines = stripCode(text);
  let inToc = false;
  lines.forEach((raw, i) => {
    if (/^## 목차\s*$/.test(raw)) { inToc = true; return; }
    if (HEADING.test(raw)) inToc = false;
    if (inToc || /^Session 명:/.test(raw)||excerpt.verifiedLines.has(i+1)) return;
    // `foo.md`의 「…」 — 백틱으로 감싼 문서 뒤의 겹낫표는 **그 문서의 항목**을 가리킨다. 세션의
    // topic 참조가 아니므로 참조 해석에서 뺀다. 지침·과정 문서의 이름을 코드에 적지 않는다 —
    // 규칙은 형태다. 경로 없이 "제작 지침의 「…」"이라고 쓴 꼴도 같다(2026-11-27).
    const line = raw.replace(DOC_ITEM, "문서 항목");
    const where = "원고 " + (i + 1) + "행: ";
    let m;
    SESSION_REF.lastIndex = 0;
    while ((m = SESSION_REF.exec(line))) {
      const s = sessions[m[2]];
      const ref = m[2] + ". " + m[3];
      if (!s) warnings.push(where + "세션 참조 \"" + ref + "\"를 확인할 수 없다(" + (fromCurriculum ? "Curriculum" : "과정 설계") + "에 없음).");
      else if (s.name !== ref) errors.push(where + "세션 참조 \"" + ref + "\"가 세션명 \"" + s.name + "\"과 다르다. 주제 참조라면 「」를 쓴다.");
      else if (!m[1]) errors.push(where + "세션 참조에 \"세션\"이 없다 — \"세션 " + s.name + "\"처럼 쓴다.");
    }
    // A quoted number without the session name ("02.") says nothing about which session it is,
    // and the guide requires the exact name here as much as in the prose around it.
    BARE_SESSION.lastIndex = 0;
    while ((m = BARE_SESSION.exec(line))) {
      const s = sessions[m[1]];
      errors.push(where + "세션 참조 \"" + m[1] + ".\"에 세션명이 없다" + (s ? ". \"" + s.name + "\"로 쓴다." : "."));
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
    // 인라인 코드(`…`)는 경로·파일·폴더 이름이므로 세션 참조가 아니다 — 배포 폴더 이름처럼 S01이
    // 들어간 경로를 프로즈의 세션 참조로 오인하지 않는다(2026-11-26).
    const sessionText=line.replace(/`[^`]*`/g,'`코드`');
    if (/(^|[^A-Za-z0-9])S\d\d(?![0-9])/.test(sessionText)) {
      errors.push(where + "파일명식 세션 참조(S0x)를 쓰지 않는다. 정확한 세션명을 쓴다.");
    }
  });
  const labels = checkLabels(inputPath, text);
  errors.push(...labels.errors);
  warnings.push(...labels.warnings);
  const result={errors,warnings,notes:labels.notes??[]};Object.defineProperty(result,'responseExcerpts',{value:excerpt});return result;
}

module.exports = { checkReferences, checkLabels };
