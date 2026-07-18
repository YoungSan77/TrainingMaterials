// ============================================================================
// verify.js — 덱 데이터 사전 검증기
//   사용법:  node verify.js ./01.js  [--detail]
//   PPTX를 만들지 않고 데이터만 검사한다. 출력을 그대로 복사해 보내면 된다.
//
//   [설계 원칙 1] 문자폭은 measure.js 하나만 쓴다. 이 파일에 폭 상수를 두지 않는다.
//   엔진(master_render.js)과 같은 함수를 쓰므로 "엔진이 그리는 줄 수 = 여기서 세는 줄 수"가
//   성립한다. 레이아웃 상수도 엔진 소스에서 직접 읽는다(복제하지 않는다).
//
//   [설계 원칙 2] 개수를 세지 않는다. 있는 것의 정합성을 잰다.
//   인용 하한(3장)·인용 전용 슬라이드 필수는 폐기했다. 개수 게이트는 내용과 무관하게
//   만족시킬 수 있어서, 자산에 없는 인용을 억지로 채우게 만든다(주객전도).
//   인용에서 기계가 막아야 할 실패는 '부족'이 아니라 '환각'과 '의역'이다 → 자산 대조.
//
//   [설계 원칙 3] 도메인을 모른다. 이 파일에는 특정 교재의 어휘가 없다.
//   형태 트리거(n:m 비율, % 두 개 이상)만 내장하고, 어휘 트리거는 데이터가 주입한다
//   (meta.visualTriggers). 인용 자산 경로도 데이터가 선언한다(meta.quotes).
//
//   [등급]
//     오류(exit 1) — 산출물이 깨지거나 신뢰를 훼손한다:
//                    필수 필드 누락 / 시각화가 밴드를 넘어 잘림 / 인용 id·필드 누락 /
//                    자산에 없는 인용(환각) / 자산과 다른 문구(의역) / 같은 세션 내 중복 / 대괄호
//     경고         — 규격에서 벗어날 뿐 산출물은 성립한다:
//                    밀도 과다 / caption 누락 / 시각화 트리거 회피 / 세션 태그 밖 인용
// ============================================================================
const fs = require('fs');
const path = require('path');
const { IN, textW, avail, lineCount } = require('./measure.js');
const QA = require('./quotes.js');
const { norm } = QA;                                  // 인용 자산 파서(엔진과 공유 — 두 벌이면 어긋난다)
const { isFree, requiredFields } = require('./skeleton.js');   // 골격 규칙 단일 소스(엔진과 공유)

// ── 엔진 레이아웃 상수를 엔진 소스에서 읽는다(복제하지 않는다) ──
//   분할 후 상수는 render/context.js, TYPES는 render/lint.js에 있다. master_render.js(선두 형식 헤더)와
//   render/*.js 전부를 이어 붙여 파싱한다 — 단일 소스가 어느 파일로 옮겨가도 여기 한 곳만 따라간다.
//   master_render.js를 맨 앞에 둔다(DOC의 ^ 앵커가 선두 형식 헤더를 잡도록).
const ENGINE = path.join(__dirname, 'master_render.js');
const RENDER_DIR = path.join(__dirname, 'render');
const SRC_FILES = [ENGINE].concat(
    fs.existsSync(RENDER_DIR) ? fs.readdirSync(RENDER_DIR).filter(f => f.endsWith('.js')).sort().map(f => path.join(RENDER_DIR, f)) : []
);
const SRC = SRC_FILES.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const grab = (re, name) => {
    const m = SRC.match(re);
    if (!m) { console.error(`[중단] 엔진 소스에서 ${name}를 찾지 못했다 — 검증기의 레이아웃 가정이 엔진과 어긋났다.`); process.exit(2); }
    return parseFloat(m[1]);
};
const CW      = grab(/\bCW\s*=\s*([\d.]+)/, 'CW');
const CTX_TOP = grab(/\bCTX_TOP\s*=\s*([\d.]+)/, 'CTX_TOP');
const VB      = grab(/\bVB\s*=\s*([\d.]+)/, 'VB');
const PAD     = grab(/\bPAD\s*=\s*([\d.]+)/, 'PAD');
const F_IN    = grab(/\bF_IN\s*=\s*(\d+)/, 'F_IN');
const F_BODY  = grab(/\bF_BODY\s*=\s*(\d+)/, 'F_BODY');
const F_HEAD  = grab(/\bF_HEAD\s*=\s*(\d+)/, 'F_HEAD');
const F_QKO   = grab(/\bF_QKO\s*=\s*(\d+)/, 'F_QKO');
const F_QEN   = grab(/\bF_QEN\s*=\s*(\d+)/, 'F_QEN');
const SP      = grab(/\bSP\s*=\s*(\d+)/, 'SP');
const F_CAP   = grab(/\bF_CAP\s*=\s*(\d+)/, 'F_CAP');
const F_STMT  = grab(/\bF_STMT\s*=\s*(\d+)/, 'F_STMT');
const F_ELAB  = grab(/\bF_ELAB\s*=\s*(\d+)/, 'F_ELAB');
const CAP_LH  = grab(/\bCAP_LH\s*=\s*([\d.]+)/, 'CAP_LH');
const CAP_MAX = grab(/\bCAP_MAX\s*=\s*(\d+)/, 'CAP_MAX');
// 엔진이 지원하는 타입 목록도 소스에서 읽는다 — 타입을 추가하고 검증기를 안 고치는 사고를 막는다.
const TYPES = (SRC.match(/const TYPES = \[([\s\S]*?)\];/) || [, ''])[1].match(/'([a-z]+)'/g)?.map(s => s.replace(/'/g, '')) || [];
if (!TYPES.length) { console.error('[중단] 엔진에서 TYPES 목록을 읽지 못했다.'); process.exit(2); }
const NUMERIC = ['share', 'magnitude'];
if (/charCodeAt\(0\)\s*>\s*255/.test(SRC))
    console.log('[주의] master_render.js에 자체 문자폭 계산이 남아 있다 — measure.js로 일원화해야 한다.\n');
// 계약(엔진 헤더 주석)이 엔진과 어긋나면 생성기가 함정에 빠진다 — 계약만 읽는 생성기는 그것을 알 수 없다.
// 실제로 v4.2에서 폐기한 'quotes' 타입이 문서 블록에 남아, 계약대로 쓴 덱이 "알 수 없는 visual.type"으로 중단됐다.
// 규격 이탈 가드 — 문단 간격은 전 슬라이드 공통(SP=3pt)이다. 엔진에 다른 리터럴이 박히면 규격이 조용히 무너진다.
// (실제로 목차 그룹 헤더에 8pt/2pt가 들어가 있었고, 아무도 그것을 재지 않았다)
const spBad = [...SRC.matchAll(/paraSpace(?:Before|After)\s*:\s*(\d+(?:\.\d+)?)/g)]
    .map(m => m[1]).filter(x => Number(x) !== 0);      // 0은 '붙인다'는 명시적 의도다(한 개체의 두 줄) → 이탈이 아니다
if (spBad.length) console.log(`[규격 경고] master_render.js의 문단 간격에 리터럴 ${[...new Set(spBad)].join('·')}이 박혀 있다 — SP(${SP}pt) 상수를 써야 한다.\n`);
const DOC = (SRC.match(/^\/\*[\s\S]*?\*\//) || [''])[0];
['quotes', 'mermaid'].forEach(t => {                     // 폐기된 타입 이름
    if (new RegExp(`(type\\s*:\\s*'${t}'|visual\\s*:\\s*${t}\\b)`).test(DOC))
        console.log(`[계약 경고] 문서 블록에 폐기된 타입 '${t}'가 남아 있다 — 계약만 읽는 생성기가 이 함정에 빠진다.\n`);
});

// ── 엔진과 동일한 기하 계산 ──
const BULLET = { boxes: 10, steps: 10, versus: 12, quotes: 16 };
const colWidth = (type, n) => {
    if (type === 'boxes')  return (CW - 0.20 * (n - 1)) / n;
    if (type === 'steps')  return (CW - (n > 4 ? 0.10 : 0.16) * (n - 1)) / n;
    if (type === 'versus') return (CW - 0.30 * (n - 1)) / n;
    return CW;
};
const L = (t, w, bullet = 10, fs = F_IN) =>
    String(t).split('\n').reduce((n, p) => n + lineCount(p, bullet === false ? w - PAD * 2 : avail(w, bullet), fs), 0);
const budget = (w, bullet = 10, fs = F_IN) => Math.floor((bullet === false ? w - PAD * 2 : avail(w, bullet)) / (IN(fs) * 1.05));
const lineH = (fs) => IN(fs * 1.2);
const textH = (lines, paras, fs = F_IN) => lines * lineH(fs) + paras * (2 * SP / 72) + PAD * 2;
const SLACK = 0.06;

const quoteH = (q) => Math.max(0.78,
    L(`\u201C${q.ko}\u201D`, CW, false, F_QKO) * 0.24 + L(`${q.en} — ${q.author}`, CW, false, F_QEN) * 0.18 + PAD * 2);

const tableGeom = (rows) => {
    const cell = (c) => (typeof c === 'object' && c !== null && c.text !== undefined) ? String(c.text) : String(c ?? '');
    const maxW = new Array(rows[0].length).fill(0);
    rows.forEach(r => r.forEach((c, i) => { maxW[i] = Math.max(maxW[i], textW(cell(c), F_IN)); }));
    const sum = maxW.reduce((a, b) => a + b, 0);
    const tableW = Math.min(CW - 0.70, 8.6);
    let colW = sum === 0 ? maxW.map(() => tableW / maxW.length) : maxW.map(w => Math.max((w / sum) * tableW, 1.6));
    const tot = colW.reduce((a, b) => a + b, 0);
    if (tot > tableW) colW = colW.map(w => w * tableW / tot);
    const lns = rows.map(r => r.map((c, i) => lineCount(cell(c), colW[i] - PAD * 2, F_IN)));
    const rowH = lns.map(r => Math.max(0.45, Math.max(...r) * 0.28 + PAD * 2));
    return { colW, lns, rowH, h: rowH.reduce((a, b) => a + b, 0), cell };
};

// ── 덱 로드 ──
const deckPath = process.argv[2] || './01.js';
const DETAIL = process.argv.includes('--detail');
const DECK = require('./load_deck.js')(deckPath);    // 순수 덱 + config 병합 + meta.quotes 절대경로화
const S = DECK.session.slides;
const NO = DECK.session.no;
const frontMatter = NO === 1 ? 3 : 1;
const P = (i) => frontMatter + i + 1;

const err = [], warn = [], detail = [];

// 인용 자산 — 경로는 데이터가 선언한다(검증기가 특정 교재를 알지 않는다).
let ASSETS = null;
const qPath = DECK.meta && DECK.meta.quotes;
if (qPath) {
    const abs = path.resolve(qPath);                 // loadDeck이 선언 파일 기준 절대경로로 이미 고정했다
    if (!fs.existsSync(abs)) err.push(`meta.quotes 경로에 파일이 없다: ${qPath}`);
    else { const r = QA.parse(abs); ASSETS = r.assets; r.bad.forEach(b => err.push(b)); }
}

// ── 슬라이드 검사 ──
const VTRIG = (DECK.meta && DECK.meta.visualTriggers) || {};
const claim = (sl) => [sl.sub, sl.question, sl.lead && sl.lead.text, sl.foot && sl.foot.body].filter(Boolean).join(' ');
const hasRatio = (t) => /\d+\s*:\s*\d+/.test(t) || (t.match(/\d+\s*%/g) || []).length >= 2;
const used = new Map();

S.forEach((sl, i) => {
    const tag = `p${P(i)}`;
    const v = sl.visual;

    // 1) 필수 필드 — skeleton.js가 정한다(엔진과 같은 소스). statement는 골격 예외라 빈 목록.
    const free = isFree(sl);
    requiredFields(sl).forEach(f => { if (!sl[f]) err.push(`${tag} 필수 필드 누락: ${f}`); });
    if (!free && sl.question && !/[?？]\s*$/.test(sl.question)) warn.push(`${tag} question이 물음표로 끝나지 않는다`);
    if (!sl.notes) warn.push(`${tag} notes(강사 노트)가 없다 — 던질 질문·흔한 반론·시간 배분을 남긴다`);

    // 2) 인용 — 개수를 세지 않고 출처를 대조한다
    const qs = [sl.quote, v && v.quote].filter(Boolean);
    qs.forEach((q, k) => {
        ['id', 'ko', 'en', 'author'].forEach(f => { if (!q[f]) err.push(`${tag} 인용 ${k + 1}번 ${f} 누락 — 인용은 자산 id와 함께 적는다`); });
        if (!q.id) return;
        const prev = used.get(q.id);
        if (prev === i + 1) err.push(`${tag} 인용 '${q.id}'를 같은 슬라이드에서 두 번 쓴다`);
        else if (prev) err.push(`${tag} 인용 '${q.id}'가 p${P(prev - 1)}에서 이미 쓰였다 — 같은 세션 내 중복 금지`);
        else used.set(q.id, i + 1);
        if (!ASSETS) { err.push(`${tag} 인용 '${q.id}'를 대조할 자산이 없다 — meta.quotes로 자산 경로를 선언한다`); return; }
        const a = ASSETS.get(q.id);
        if (!a) { err.push(`${tag} 인용 '${q.id}'가 자산에 없다 — 창작·변형된 인용이다`); return; }
        ['ko', 'en'].forEach(f => {
            if (norm(a[f]) !== norm(q[f]))
                err.push(`${tag} 인용 '${q.id}'의 ${f.toUpperCase()}가 자산과 다르다(의역·변형 금지)\n        자산: ${a[f]}\n        덱  : ${q[f]}`);
        });
        if (norm(a.author) !== norm(q.author))
            err.push(`${tag} 인용 '${q.id}'의 저자가 자산과 다르다 — 자산: ${a.author} / 덱: ${q.author}`);
        if (a.sessions.length && !a.sessions.includes(NO))
            warn.push(`${tag} 인용 '${q.id}'는 세션 ${a.sessions.join('·')} 태그다 — 이 세션(${NO})에서 쓸 근거가 있는지 확인한다`);
        if (a.grade === 'WIDELY-CITED' && !(v && v.caption) && !sl.quoteNote)
            detail.push(`${tag} 인용 '${q.id}'는 WIDELY-CITED(원전 미확인)다 — 한계 표기를 검토한다`);
    });

    // 3) 밴드 계산 — 엔진과 동일
    const ln = (sl.question ? L(sl.question, CW, false, F_BODY) : 0)
             + (sl.lead ? L(`${sl.lead.label}: ${sl.lead.text}`, CW, false, F_BODY) : 0);
    const ctxH = Math.max(0.52, ln * 0.28 + PAD * 2 + 0.10);
    const VT = free ? (CTX_TOP + 0.10) : (CTX_TOP + ctxH + 0.16);
    const QH = (!free && sl.quote && sl.quote.ko) ? quoteH(sl.quote) + 0.04 : 0;
    let VH = Math.max(0.8, ((free ? VB + 0.90 - 0.20 : VB) - QH) - VT);   // statement는 하단 결론이 없어 밴드를 더 쓴다
    if (v && v.caption) {                                     // caption이 밴드에서 먼저 가져간다
        // caption에 인용 원문을 밀어넣으면 그림이 주가 되고 말이 종이 된다(8pt 각주에 명제가 파묻힌다).
        // 원문·출처·URL은 엔진이 강사 노트에 자동으로 붙인다 → caption은 근거·한계만.
        const cap = String(v.caption);
        if (/["\u201C][A-Za-z][^"\u201D]{40,}/.test(cap))
            warn.push(`${tag} caption에 인용 원문(영문)이 들어 있다 — caption은 근거·한계 전용(8pt)이다. 원문은 강사 노트(자동)나 quote 오버레이로 보낸다`);
        const cl = lineCount(cap, CW - PAD * 2, F_CAP);
        if (cl > CAP_MAX) err.push(`${tag} caption이 ${cl}줄이다(최대 ${CAP_MAX}줄) — 핵심만 남기고 '…'로 줄인다`);
        VH = Math.max(0.8, VH - (Math.min(cl, CAP_MAX) * CAP_LH + 0.06));
    }

    // 4) 트리거 — 명제 자리에 신호가 있는데 시각화가 그것을 그리지 않는다(경고, visualNote로 억제)
    if (!sl.visualNote) {
        const t = claim(sl), ty = v && v.type;
        if (hasRatio(t) && !NUMERIC.includes(ty))
            warn.push(`${tag} 명제에 비율·배수가 있는데 시각화가 '${ty || '없음'}'이다 — share/magnitude를 검토한다 (근거 수치일 뿐이면 visualNote에 사유를 남긴다)`);
        Object.entries(VTRIG).forEach(([type, words]) => {
            if ((words || []).some(w => t.includes(w)) && ty !== type)
                warn.push(`${tag} 명제가 '${type}' 신호를 담고 있는데 시각화가 '${ty || '없음'}'이다`);
        });
    }
    if (!v) return;
    if (!TYPES.includes(v.type)) { err.push(`${tag} 알 수 없는 visual.type '${v.type}' — 엔진이 렌더하지 못한다`); return; }
    if (NUMERIC.includes(v.type) && !v.caption)
        warn.push(`${tag} ${v.type}에 caption이 없다 — 숫자를 명제로 올렸으면 출처·한계를 밝힌다`);

    let need = null;

    // 5) 시각화별 필요 높이 + 규격 점검
    if (['boxes', 'steps', 'versus'].includes(v.type)) {
        const n = v.data.length, w = colWidth(v.type, n), b = BULLET[v.type];
        const budg = budget(w, b), head = v.type === 'versus' ? 0.44 : 0.42;
        const needMax = Math.max(...v.data.map(x => textH((x.body || []).reduce((a, t) => a + L(t, w, b), 0), (x.body || []).length)));
        need = head + needMax + SLACK;
        const alloc = Math.min(VH, need) - head;
        v.data.forEach(box => {
            const body = box.body || [];
            const lns = body.reduce((a, t) => a + L(t, w, b), 0);
            const real = textH(lns, body.length);
            if (real > alloc + 1e-6)
                err.push(`${tag} ${v.type} "${box.title}" 박스에서 글자가 넘친다(필요 ${real.toFixed(2)}in > 배정 ${alloc.toFixed(2)}in) — 문장을 한글 ${budg}자로 줄이거나 항목을 뺀다`);
            body.forEach(t => {
                const l = L(t, w, b);
                if (l >= 3) warn.push(`${tag} ${v.type} ${n}열 ${l}줄: "${String(t).slice(0, 20)}…" — 밀도 과다 (1줄 = 한글 ${budg}자)`);
            });
        });
    } else if (v.type === 'table') {
        const g = tableGeom(v.data);
        need = g.h;
        v.data.forEach((row, r) => row.forEach((c, ci) => {
            const txt = g.cell(c);
            if (/^\[.*\]$/.test(txt.trim())) err.push(`${tag} 표 셀에 대괄호: ${txt}`);
            if (g.lns[r][ci] >= 3) warn.push(`${tag} 표 셀 ${g.lns[r][ci]}줄: "${txt.slice(0, 20)}…" (열폭 ${g.colW[ci].toFixed(2)}in = 한글 ${budget(g.colW[ci], false)}자)`);
        }));
    } else if (v.type === 'statement') {
        const av = CW - 1.20;
        const isQ = !!(v.quote && v.quote.ko);
        const text = isQ ? `\u201C${v.quote.ko}\u201D` : String(v.text || '');
        const tl = lineCount(text, av, F_STMT);
        if (tl > 2) err.push(`${tag} statement 문장이 ${tl}줄이다 — 20pt에서 2줄(한글 약 ${Math.floor(av / (IN(F_STMT) * 1.05)) * 2}자)을 넘으면 문장이 아니라 문단이다`);
        const srcTxt = isQ ? `${v.quote.en}\n— ${v.quote.author}` : (v.source || '');
        const sl2 = srcTxt ? srcTxt.split('\n').reduce((a, p) => a + lineCount(p, av, F_QEN), 0) : 0;
        const nl2 = v.note ? lineCount(String(v.note), av, F_BODY) : 0;
        if (nl2 > 2) warn.push(`${tag} statement note가 ${nl2}줄이다 — 해설도 한두 문장이다`);
        // caption은 근거·한계 전용이다. 해설을 8pt에 넣으면 슬라이드의 논지가 각주로 강등된다.
        if (!v.note && v.caption && !/원전|귀속|추정|편차|출처|미확인|WIDELY|통용|기반/.test(String(v.caption)))
            warn.push(`${tag} statement에 note가 없고 caption만 있다 — 해설이라면 note(14pt)로 올린다. caption(8pt)은 근거·한계 전용이다`);
        if (v.figure) err.push(`${tag} statement에 figure는 없다 — 단문에는 그림을 넣지 않는다(넣으려면 논증 슬라이드로 만든다)`);
        need = tl * 0.34 + (sl2 ? sl2 * 0.20 + 0.16 : 0) + (nl2 ? nl2 * 0.26 + 0.24 : 0);
        // WIDELY-CITED 인용을 단정하지 않으려면 한계 표기가 필요하다.
        if (isQ && ASSETS) {
            const a = ASSETS.get(v.quote.id);
            if (a && a.grade === 'WIDELY-CITED' && !v.caption)
                warn.push(`${tag} '${v.quote.id}'는 WIDELY-CITED(원전 미확인)인데 caption이 없다 — 한계를 밝힌다`);
            // 저자·출처는 문장 아래 10pt 줄이 이미 달고 있다. caption(8pt)에 또 쓰면 중복이고 한계가 파묻힌다.
            const srcHead = a && a.src ? a.src.split(/[(—]/)[0].trim() : '';
            if (a && v.caption && (v.caption.includes(a.author) || (srcHead && v.caption.includes(srcHead))))
                warn.push(`${tag} caption에 저자·출처가 들어 있다 — 원문·저자·출처는 문장 아래 10pt 줄이 자동으로 붙인다. caption은 한계 전용이다`);
        }
    } else if (v.type === 'takeaways') {
        const n = v.data.length, gap = n >= 5 ? 0.08 : 0.12;
        const hRaw = Math.max(...v.data.map(it => textH(L(it.body, CW - 3.2, false), 1))) + SLACK;
        const alloc = Math.min((VH - gap * (n - 1)) / n, Math.max(0.52, hRaw));
        v.data.forEach(it => {
            const l = L(it.body, CW - 3.2, false), real = textH(l, 1);
            if (real > alloc + 1e-6) err.push(`${tag} takeaways 항목이 행을 넘는다(${l}줄, 필요 ${real.toFixed(2)}in > 배정 ${alloc.toFixed(2)}in): "${String(it.body).slice(0, 20)}…"`);
            else if (l > 2) warn.push(`${tag} takeaways 본문 ${l}줄: "${String(it.body).slice(0, 20)}…" — 밀도 과다`);
        });
        need = null;
    }

    // ── 관계 계열: 노드·간선을 잰다(엔진 renderChain / renderLoop과 같은 식) ──
    else if (v.type === 'flow' || v.type === 'pipeline') {
        const d = v.data || {}, ns = d.nodes || [];
        const n = ns.length;
        if (n < 2) err.push(`${tag} ${v.type} 노드가 ${n}개다 — 관계를 그리려면 최소 2개가 필요하다`);
        if (n > 8) warn.push(`${tag} ${v.type} 노드 ${n}개 — 7개를 넘으면 4:3에서 읽히지 않는다. steps/table을 검토한다`);
        const idx = {}; ns.forEach((x, k) => idx[x.id] = k);
        (d.edges || []).forEach(e => {
            if (!(e.from in idx)) err.push(`${tag} ${v.type} 간선의 from '${e.from}'이 노드에 없다`);
            if (!(e.to in idx)) err.push(`${tag} ${v.type} 간선의 to '${e.to}'가 노드에 없다`);
        });
        if (n >= 2 && !err.some(e => e.startsWith(`${tag} ${v.type} 간선`))) {
            const edges = (d.edges && d.edges.length) ? d.edges : ns.slice(1).map((x, k) => ({ from: ns[k].id, to: x.id }));
            const H = String(d.dir || 'LR').toUpperCase() !== 'TD';
            const fwd = edges.filter(e => idx[e.to] > idx[e.from]);
            const col = {}; ns.forEach(x => col[x.id] = 0);
            for (let k = 0; k < n; k++) fwd.forEach(e => { if (col[e.to] < col[e.from] + 1) col[e.to] = col[e.from] + 1; });
            const levels = []; ns.forEach(x => { (levels[col[x.id]] = levels[col[x.id]] || []).push(x.id); });
            const lv = levels.length, hasBack = edges.length > fwd.length;
            const chanH = hasBack ? 0.45 : 0.0;
            const widest = Math.max(...levels.map(l => l.length));
            const mainSpan = H ? (CW - 0.20) : (VH - chanH), mainStep = mainSpan / lv;
            // 간선 라벨 실폭에 맞춘 간격(엔진과 동일 식)
            const labW = Math.max(0, ...edges.filter(e => e.label).map(e => textW(String(e.label), F_ELAB) * 1.05 + 0.20));
            const eGap = labW ? Math.min(1.70, Math.max(1.05, labW + 0.30)) : 0.55;
            const nodeW = H ? Math.min(2.25, Math.max(1.10, mainStep - eGap)) : Math.min(2.40, (CW - 0.20) / widest - 0.30);
            const nl = (t) => String(t).replace(/\\n/g, '\n').split('\n').reduce((a, p) => a + lineCount(p, nodeW - PAD * 2, F_HEAD), 0);
            const maxLines = Math.max(1, ...ns.map(x => nl(x.label)));
            const nodeH = Math.min(1.50, Math.max(0.60, 0.34 + maxLines * 0.26));
            // 세로(TD)도 반드시 잰다. 가로만 재면, 가로에서 밴드를 넘은 생성기가 세로로 돌려 오류를 지운다
            // (실제로 그런 일이 있었다 — 검증되지 않는 선택지는 탈출구가 된다).
            need = H ? (widest * nodeH + (widest - 1) * 0.34 + chanH)
                     : (lv * nodeH + (lv - 1) * 0.24 + chanH);
            if (!H) warn.push(`${tag} flow가 세로(TD)다 — 기본은 가로(LR)다. 좌우가 단계의 방향이라면 dir을 LR로 되돌린다`);
            // 간선 라벨은 노드 사이 간격(최대 1.70in) 안에 한 줄로 들어가야 한다 — 넘으면 접힌다.
            const ELAB_MAX = Math.floor((1.70 - 0.20) / (IN(F_ELAB) * 1.05));
            edges.filter(e => e.label).forEach(e => {
                if (textW(String(e.label), F_ELAB) * 1.05 + 0.20 > 1.70)
                    warn.push(`${tag} ${v.type} 간선 라벨 "${e.label}"이 길다 — 한글 ${ELAB_MAX}자 안으로 줄인다(넘으면 두 줄로 접힌다)`);
            });
            ns.forEach(x => {
                const l = nl(x.label);
                if (l > 2) err.push(`${tag} ${v.type} 노드 "${String(x.label).slice(0, 14)}…" 라벨이 ${l}줄이다 — 노드 폭 ${nodeW.toFixed(2)}in(한글 ${budget(nodeW, false)}자) 안으로 줄인다`);
                else if (l === 2) warn.push(`${tag} ${v.type} 노드 "${String(x.label).slice(0, 14)}…" 라벨 2줄 — 1줄(한글 ${budget(nodeW, false)}자)이 읽기 좋다`);
            });
            if (maxLines >= 2 && lv >= 4) warn.push(`${tag} ${v.type} 노드가 ${lv}단계인데 라벨이 2줄이다 — 단계를 줄이거나 라벨을 줄인다`);
        }
    } else if (v.type === 'loop') {
        const d = v.data || {}, ns = d.nodes || [], n = ns.length;
        if (n < 3) err.push(`${tag} loop 노드가 ${n}개다 — 순환은 최소 3개가 필요하다(2개면 flow의 되돌림이다)`);
        if (n > 6) warn.push(`${tag} loop 노드 ${n}개 — 5개를 넘으면 원형 배치가 뭉갠다`);
        const idx = {}; ns.forEach((x, k) => idx[x.id] = k);
        (d.edges || []).forEach(e => {
            if (!(e.from in idx) || !(e.to in idx)) err.push(`${tag} loop 간선이 없는 노드를 가리킨다: ${e.from}→${e.to}`);
        });
        if (n >= 3) {
            // 타원 노드다 — 내접 사각형은 폭의 70%뿐이다. 사각형 기준으로 재면 글자가 타원 밖으로 나간다.
            const LOOP_IN = 0.70;
            const nodeW = Math.min(2.40, Math.max(1.60, CW / (n <= 3 ? 3.2 : 3.9)));
            const inW = nodeW * LOOP_IN;
            const nl = (t) => String(t).replace(/\\n/g, '\n').split('\n').reduce((a, p) => a + lineCount(p, inW, F_ELAB), 0);
            const maxLines = Math.max(1, ...ns.map(x => nl(x.label)));
            const nodeH = Math.min(1.30, Math.max(0.80, 0.42 + maxLines * 0.24));
            need = 2 * Math.max(0.55, (VH - nodeH) / 2 - 0.06) + nodeH;
            const budg = Math.floor(inW / (IN(F_ELAB) * 1.05));
            ns.forEach(x => {
                const l = nl(x.label);
                if (l > 1) err.push(`${tag} loop 노드 "${String(x.label).slice(0, 14)}…"가 타원에 안 들어간다(${l}줄) — 한글 ${budg}자 안으로. 넘으면 라벨을 잘못 뽑은 것이다(명제가 아니라 문장을 넣고 있다)`);
            });
        }
    }

    // ── 수치 계열 ──
    else if (v.type === 'share') {
        const items = v.data || [], n = items.length;
        const tot = items.reduce((a, it) => a + Number(it.value), 0);
        if (Math.abs(tot - 100) > 0.5) err.push(`${tag} share 합계가 ${tot}이다 — 구성비는 100이어야 한다(합이 100이 아니면 share가 아니다)`);
        if (n < 2) err.push(`${tag} share 항목이 ${n}개다 — 구성비는 최소 2개`);
        if (n > 4) warn.push(`${tag} share 항목 ${n}개 — 4개를 넘으면 조각이 읽히지 않는다`);
        const barW = CW * 0.80;
        items.forEach(it => {
            const w = barW * (Number(it.value) / (tot || 100));
            const txt = `${it.value}%`;
            if (textW(txt, F_IN) + 0.04 > w)
                detail.push(`${tag} share "${it.label}"(${it.value}%) 조각 폭 ${w.toFixed(2)}in — 숫자가 바에 안 들어가 범례에서만 읽힌다`);
        });
        const barH = Math.min(0.95, Math.max(0.70, VH * 0.30));
        const legLn = items.reduce((a, it) => a + L(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, CW - 0.60, false), 0);
        need = barH + 0.14 + legLn * 0.26 + PAD;
    } else if (v.type === 'magnitude') {
        const items = v.data || [], n = items.length;
        if (n < 2) err.push(`${tag} magnitude 항목이 ${n}개다 — 격차를 보이려면 최소 2개`);
        if (n > 5) warn.push(`${tag} magnitude 항목 ${n}개 — 5개를 넘으면 행이 눌린다`);
        const labW = Math.min(3.00, Math.max(1.60, Math.max(...items.map(it => textW(it.label, F_IN))) + PAD * 2 + 0.10));
        const gapY = 0.16;
        const rowH = Math.min(0.70, Math.max(0.46, (VH - gapY * (n - 1)) / n));
        need = rowH * n + gapY * (n - 1);
        items.forEach(it => {
            const l = lineCount(it.label, labW - PAD * 2, F_IN);
            if (textH(l, 1) > rowH + 1e-6)
                err.push(`${tag} magnitude 라벨이 행을 넘는다(${l}줄): "${String(it.label).slice(0, 20)}…" — 한글 ${budget(labW, false)}자 안으로 줄인다`);
            if (it.value === undefined || it.value === null || it.value === '')
                err.push(`${tag} magnitude "${it.label}"에 value가 없다 — 비례를 포기한 대신 숫자를 반드시 병기한다`);
        });
    } else if (v.type === 'pyramid') {
        const items = v.data || [], n = items.length;
        if (n < 2) err.push(`${tag} pyramid 층이 ${n}개다 — 계층은 최소 2층`);
        if (n > 5) warn.push(`${tag} pyramid 층 ${n}개 — 5층을 넘으면 폭 차이가 사라진다`);
        const gapY = 0.10;
        const rowH = Math.min(0.92, Math.max(0.46, (VH - gapY * (n - 1)) / n));
        need = rowH * n + gapY * (n - 1);
        const wMin = CW * 0.26, wMax = CW * 0.66;
        items.forEach((it, k) => {
            const w = n === 1 ? wMax : wMin + (wMax - wMin) * (k / (n - 1));
            const l = lineCount(it.label, w - PAD * 2, F_HEAD);
            if (textH(l, 1, F_HEAD) > rowH + 1e-6)
                err.push(`${tag} pyramid ${k + 1}층 라벨이 층을 넘는다(${l}줄, 층 폭 ${w.toFixed(2)}in = 한글 ${budget(w, false, F_HEAD)}자): "${String(it.label).slice(0, 20)}…"`);
        });
    } else if (v.type === 'quadrant') {
        const d = v.data || {}, cells = d.cells || [];
        const at = cells.map(c => String(c.at).toUpperCase());
        ['TL', 'TR', 'BL', 'BR'].forEach(p => { if (!at.includes(p)) err.push(`${tag} quadrant 사분면 '${p}'이 없다 — 네 칸을 모두 채운다(빈 칸이 있으면 2축이 아니다)`); });
        at.forEach((p, k) => { if (at.indexOf(p) !== k) err.push(`${tag} quadrant 사분면 '${p}'이 중복이다`); });
        if (!d.x || !d.x.low || !d.x.high) err.push(`${tag} quadrant x축(low/high)이 없다 — 축이 없으면 사분면이 아니라 4개의 상자다`);
        if (!d.y || !d.y.low || !d.y.high) err.push(`${tag} quadrant y축(low/high)이 없다`);
        const gh = Math.min(VH - 0.30 - 0.06, 4.30);
        const cw = (CW - 0.42 - 0.06 - 0.10) / 2, ch = (gh - 0.10) / 2;
        need = gh + 0.30;
        cells.forEach(c => {
            const body = Array.isArray(c.body) ? c.body : (c.body ? [c.body] : []);
            const lns = body.reduce((a, t) => a + L(t, cw, 10), 0);
            const real = textH(lns, body.length);
            if (real > ch - 0.40 + 1e-6)
                err.push(`${tag} quadrant "${c.title}" 칸에서 글자가 넘친다(필요 ${real.toFixed(2)}in > 배정 ${(ch - 0.40).toFixed(2)}in) — 한글 ${budget(cw, 10)}자 기준으로 줄인다`);
        });
    }

    // 6) 밴드 초과 = 잘림 = 오류
    // 단, 밴드에 맞춰 스스로 줄어드는 타입(loop·magnitude·pyramid·quadrant)은 '여유 0'이 정상이다.
    // 이들은 하한(행 높이·반지름 최소값)에 걸릴 때만 밴드를 넘는다 → 초과만 본다. 근접 경고는 오탐이다.
    const FILL = ['loop', 'magnitude', 'pyramid', 'quadrant'];
    if (need != null) {
        const slack = VH - need;
        detail.push(`${tag} ${String(v.type).padEnd(9)} VH=${VH.toFixed(2)} 필요=${need.toFixed(2)} 여유=${slack.toFixed(2)}${sl.quote ? '  [quote]' : ''}${v.caption ? '  [caption]' : ''}`);
        if (slack < -1e-6) err.push(`${tag} ${v.type}가 밴드를 넘는다(필요 ${need.toFixed(2)}in > 밴드 ${VH.toFixed(2)}in) — 하단이 잘린다. 항목·행을 줄이거나 문장을 축약한다`);
        else if (slack < 0.15 && !FILL.includes(v.type)) warn.push(`${tag} ${v.type} 밴드 여유 ${slack.toFixed(2)}in — 한 줄만 늘어도 잘린다`);
    }
});

// ── 덱 구조(슬라이드 밖) 검사 ──
// verify가 slides만 보던 사이, 과정 목차에 'undefined'와 'Session 01.'이 찍혔는데도 "이상 없음"이 나왔다.
// 슬라이드에 렌더되는 것은 전부 검사 대상이다.
const BADWORD = /(session|세션)\s*\d|(^|[^가-힣])세션([^가-힣]|$)/i;
(DECK.curriculum || []).forEach((d, i) => {
    if (!d || d.day === undefined || d.day === null || String(d.day).trim() === '')
        err.push(`curriculum[${i}].day 없음 — 과정 목차 그룹 라벨이 'undefined'로 찍힌다`);
    else if (/^\s*Day\s*\d+\s*$/i.test(String(d.day)))
        err.push(`curriculum[${i}].day가 'Day N'뿐이다 — 유형 제목을 붙인다(예: 'Day 1 — 품질의 본질과 표준'). 엔진이 'Day N' 접두어만 벗기고 유형 제목을 남긴다`);
    // 엔진의 stripNo가 'Session 01.' 접두어를 벗기므로 산출물은 정상이다 → 오류가 아니라 경고다.
    // (검증기가 엔진이 이미 고치는 것을 막아 세우면, 고칠 필요 없는 것을 고치게 만든다)
    (d.items || []).forEach((t, k) => {
        if (BADWORD.test(String(t)))
            warn.push(`curriculum[${i}].items[${k}]에 'Session/세션' 표기가 있다: "${t}" — 엔진이 벗기지만, 데이터에는 제목만 쓴다`);
    });
    if (!(d.items || []).length) err.push(`curriculum[${i}].items 비어 있음`);
});
if (!DECK.curriculum || !DECK.curriculum.length) err.push(`curriculum 없음 — 과정 목차를 그릴 수 없다`);
(DECK.session.toc || []).forEach((row, i) => {
    const t = Array.isArray(row) ? row[1] : row;
    if (BADWORD.test(String(t))) err.push(`session.toc[${i}]에 'Session/세션' 표기가 있다: "${t}"`);
});
if ((DECK.session.toc || []).length !== S.length)
    err.push(`session.toc ${(DECK.session.toc || []).length}줄 ≠ 본문 ${S.length}장 — toc는 slides에서 파생시킨다`);
if (BADWORD.test(String(DECK.session.title || ''))) err.push(`session.title에 'Session/세션' 표기가 있다`);
if (!DECK.meta || !DECK.meta.quotes) warn.push(`meta.quotes 없음 — 인용 원문 대조와 강사 노트 출처 자동 첨부가 동작하지 않는다`);

// ── 덱 전체 규칙 ──
// 인용 개수는 세지 않는다. 자산에 맞는 인용이 없으면 0장이 정답이다.
if (!S.some(s => s.kind === '학습 목표')) err.push(`학습 목표 슬라이드 없음`);
const arg = (sl) => !isFree(sl);                      // statement는 논증이 아니다(skeleton.js와 같은 소스)
['현상', '원인', '원칙', '적용', '타협'].forEach(k => {
    if (!S.some(s => s.kind === k && arg(s))) err.push(`분류 '${k}'의 논증 슬라이드 없음 — statement(단문)로는 분류 요건을 채울 수 없다`);
});
if (!S.some(s => s.head)) warn.push(`세션 요약 슬라이드(head 지정) 없음`);
if (S.length < 12 || S.length > 17) warn.push(`본문 ${S.length}장 — 권장 12~17장`);
// 회피 감지: 타입은 늘었는데 여전히 표·박스로만 그리고 있으면 계약이 아니라 습관이 이긴 것이다.
const nStmt = S.filter(isFree).length;
if (nStmt > 3) warn.push(`statement(단문) ${nStmt}장 — 2~3장이 적정하다. 인용 하나에 단문 한 장씩 만들고 있는지 점검한다 (인용의 기본 자리는 논증 슬라이드의 quote 오버레이다)`);
const nAll = S.filter(s => s.visual && !isFree(s)).length;
const nTB = S.filter(s => s.visual && ['table', 'boxes'].includes(s.visual.type)).length;
if (nAll && nTB / nAll > 0.6) warn.push(`시각화의 ${Math.round(nTB / nAll * 100)}%가 table/boxes다 (${nTB}/${nAll}) — 관계·수치 타입을 회피하고 있는지 점검한다`);

// ── 리포트 ──
console.log(`── VERIFY: ${path.basename(deckPath)} | 세션 ${NO} | 본문 ${S.length}장 (총 ${frontMatter + S.length}p) ──`);
if (ASSETS) console.log(`   인용 자산: ${path.basename(qPath)} (${ASSETS.size}개) | 이 덱에서 사용: ${used.size}개`);
else if (used.size) console.log(`   인용 자산: 선언 없음 (meta.quotes)`);
if (DETAIL) { console.log(`\n[상세]`); detail.forEach(d => console.log('  ' + d)); }
if (err.length)  { console.log(`\n[오류 ${err.length}]`);  err.forEach(e => console.log('  ✗ ' + e)); }
if (warn.length) { console.log(`\n[경고 ${warn.length}]`); warn.forEach(w => console.log('  · ' + w)); }
if (!err.length && !warn.length) console.log('이상 없음');
console.log(`\n요약: 오류 ${err.length} / 경고 ${warn.length}`);
process.exit(err.length ? 1 : 0);
