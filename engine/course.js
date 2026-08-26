#!/usr/bin/env node
'use strict';
// ============================================================================
// course.js — 과정 단위 검사기.
//
//   지금까지의 도구는 전부 '덱 하나'를 본다(verify=슬라이드, 골든=기하).
//   그런데 실제로 지켜야 할 규칙의 상당수는 과정 단위다 —
//   시간 예산 합계, 세션 간 균일성, 명제 총량, 개념 이중 소유.
//   덱 하나를 아무리 봐도 "모든 세션이 똑같이 생겼다"는 보이지 않는다.
//
//   [왜 임계가 아니라 표인가]
//   03이 얇다는 것은 임계가 아니라 219·213·185를 나란히 놓아서 알았다.
//   타입마다 정상값이 다르므로(flow 4노드 16자 vs bullets 5줄 200자)
//   절대 기준은 반드시 하나를 오측정한다. 그래서 여기서는 재고 늘어놓기만 한다.
//   판정하는 것은 둘뿐이다 — 시간 예산 초과, 세션 번호 충돌. 둘 다 산술이다.
//
//   [시간 예산이 왜 필요한가]
//   8시간이니 8세션이라는 계산은 관리 편의이지 교육적 근거가 아니다.
//   그 고정이 모든 세션을 50분으로 만들었고, 그것이 모든 덱을 12장으로 만들었다.
//   판단 근거가 없는 축은 균일화된다 — 그래서 분량을 커리큘럼이 선언하고
//   합계가 예산에 드는지를 기계가 본다. 선언과 검사는 한 몸이다:
//   검사가 없으면 반드시 초과하고, 초과분은 언제나 마지막 세션에서 잘린다.
//
//   node engine/course.js courses/qm
// ============================================================================
const fs = require('fs');
const path = require('path');
const QA = require('./quotes.js');
const ST = require('./session_types.js');
const loadDeck = require('./load_deck.js');

const dir = path.resolve(process.argv[2] || 'courses/qm');
if (!fs.existsSync(dir)) { console.error(`[중단] 과정 폴더가 없다: ${dir}`); process.exit(2); }

const cfgPath = path.join(dir, 'global_config.js');
if (!fs.existsSync(cfgPath)) { console.error(`[중단] global_config.js가 없다: ${cfgPath}`); process.exit(2); }
const CFG = require(cfgPath);

const deckDir = path.join(dir, 'decks');
const files = fs.existsSync(deckDir) ? fs.readdirSync(deckDir).filter(f => /^\d{2}\.js$/.test(f)).sort() : [];
if (!files.length) { console.error(`[중단] decks/에 덱이 없다: ${deckDir}`); process.exit(2); }

const err = [], warn = [];
const qPath = CFG.meta && CFG.meta.quotes ? path.resolve(dir, CFG.meta.quotes) : null;
const hasCur = qPath && fs.existsSync(qPath);

// ── 덱마다 재기 ──
const rows = files.map((f) => {
    const abs = path.join(deckDir, f);
    let D;
    try { D = loadDeck(abs); } catch (e) { err.push(`${f}: 로드 실패 — ${e.message}`); return null; }
    const S = D.session.slides || [];
    const type = D.session.type || ST.DEFAULT;
    const claims = hasCur ? QA.parseClaims(qPath, D.session.no) : null;
    const node = hasCur ? QA.parseSessionMeta(qPath, D.session.no) : null;
    const kinds = {};
    S.forEach(sl => { if (sl.visual) kinds[sl.visual.type] = (kinds[sl.visual.type] || 0) + 1; });
    const chars = S.reduce((a, sl) => {
        let n = 0;
        const walk = (x) => {
            if (x == null) return;
            if (typeof x === 'string' || typeof x === 'number') { n += String(x).length; return; }
            if (Array.isArray(x)) { x.forEach(walk); return; }
            if (typeof x === 'object') Object.entries(x).forEach(([k, y]) => { if (!['id', 'type', 'at'].includes(k)) walk(y); });
        };
        walk(sl.visual);
        return a + n;
    }, 0);
    const used = new Set(S.flatMap(sl => Array.isArray(sl.claim) ? sl.claim : sl.claim ? [sl.claim] : []));
    const parts = [...new Set(S.map(sl => sl.part).filter(Boolean))];
    const nDecl = S.filter(sl => ST.isUnclaimed(type, sl.kind)).length;
    return { file: f, no: D.session.no, title: D.session.title, type, n: S.length,
             minutes: node && node.minutes, claims: claims ? claims.size : null, hit: used.size,
             chars, kinds, parts: parts.length, nDecl };
}).filter(Boolean);

// ── 세션 번호 충돌 ──
const byNo = new Map();
rows.forEach(r => { byNo.set(r.no, [...(byNo.get(r.no) || []), r.file]); });
byNo.forEach((fs2, no) => { if (fs2.length > 1) err.push(`세션 번호 ${no}가 겹친다: ${fs2.join(', ')}`); });

// ── 선언(manifesto) 장 — 과정 전체 상한과 위치 ──
//   덱 하나만 봐서는 "과정 전체에 선언이 몇 개인가"가 안 보인다(verify는 세션당 상한만 잰다).
//   상한은 판정(오류)하고, 위치(첫 세션인가)는 판정하지 않는다 — course.js의 다른 규칙과 같은
//   원칙이다: 산술로 확정되는 것만 오류, 관례로 보이는 것은 경고로 눈에만 띄게 한다. 프로그램을
//   재구성하며 특정 세션을 의도적으로 여는 경우가 있을 수 있어 강제하지 않는다.
{
    const declRows = rows.filter(r => r.nDecl > 0);
    const totalDecl = declRows.reduce((a, r) => a + r.nDecl, 0);
    if (totalDecl > 1) err.push(`선언 장이 과정 전체에서 ${totalDecl}개다(${declRows.map(r => r.file).join(', ')}) — 과정당 최대 1개(보통 첫 세션에서 연다)`);
    const firstNo = rows.length ? Math.min(...rows.map(r => r.no)) : null;
    declRows.forEach(r => { if (r.no !== firstNo) warn.push(`선언 장이 ${r.file}(세션 ${r.no})에 있다 — 과정 첫 세션(세션 ${firstNo})에서 여는 관례다`); });
}

// ── 시간 예산 ──
// course: { hours, days, breakMin, bufferPct } — 선언이 없으면 검사를 건너뛴다(구 형식).
const B = CFG.course || null;
let budget = null;
if (B && B.hours) {
    const total = B.hours * 60;
    const breakMin = B.breakMin == null ? 10 : B.breakMin;
    const bufferPct = B.bufferPct == null ? 10 : B.bufferPct;
    const declared = rows.filter(r => r.minutes).reduce((a, r) => a + r.minutes, 0);
    const missing = rows.filter(r => !r.minutes).length;
    const breaks = Math.max(0, rows.length - (B.days || 1)) * breakMin;
    const buffer = Math.round(total * bufferPct / 100);
    const need = declared + breaks + buffer;
    budget = { total, declared, missing, breaks, buffer, need };
    if (missing) warn.push(`분량이 선언되지 않은 세션 ${missing}개 — 예산 검사가 불완전하다`);
    else if (need > total) err.push(`시간 예산 초과: 강의 ${declared}분 + 휴식 ${breaks}분 + 버퍼 ${buffer}분 = ${need}분 > 예산 ${total}분`);
}

// ── 출력 ──
console.log(`── COURSE: ${path.basename(dir)} | ${CFG.book ? CFG.book.title : '(제목 없음)'} | 세션 ${rows.length}개 ──\n`);
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
console.log(`  ${pad('덱', 6)}${pad('유형', 8)}${padL('분량', 5)}${padL('장', 4)}${padL('명제', 6)}${padL('내용', 6)}${padL('부', 3)}  시각 분포`);
rows.forEach(r => {
    const cl = r.claims == null ? '  —' : `${r.hit}/${r.claims}`;
    console.log(`  ${pad(r.file, 6)}${pad(r.type, 8)}${padL(r.minutes ? r.minutes + '분' : '—', 5)}${padL(r.n, 4)}${padL(cl, 6)}${padL(r.chars + '자', 6)}${padL(r.parts || '—', 3)}  ${Object.entries(r.kinds).map(([k, v]) => k + v).join(' ')}`);
});

// 균일성은 판정하지 않고 눈에 보이게만 한다 — 규칙으로 만들면 그것도 채우기를 부른다.
const uniq = new Set(rows.map(r => r.n));
console.log(`\n  장수 분포: ${[...uniq].sort((a, b) => a - b).join(' · ')}${uniq.size === 1 && rows.length > 2 ? '   ← 전 세션이 같은 장수다. 주제의 무게가 정말 같은지 본다' : ''}`);
const types = {};
rows.forEach(r => { types[r.type] = (types[r.type] || 0) + 1; });
console.log(`  유형 분포: ${Object.entries(types).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

if (budget) {
    console.log(`\n  시간: 강의 ${budget.declared}분 + 휴식 ${budget.breaks}분 + 버퍼 ${budget.buffer}분 = ${budget.need}분 / 예산 ${budget.total}분` +
                (budget.missing ? `  (분량 미선언 ${budget.missing}개 제외)` : ''));
} else {
    console.log(`\n  시간: global_config의 course:{hours,days,breakMin,bufferPct} 미선언 — 예산 검사 없음`);
}

if (warn.length) { console.log('\n[경고]'); warn.forEach(w => console.log('  · ' + w)); }
if (err.length) { console.log('\n[오류]'); err.forEach(e => console.log('  ✗ ' + e)); }
console.log(`\n요약: 오류 ${err.length} / 경고 ${warn.length}`);
process.exit(err.length ? 1 : 0);
