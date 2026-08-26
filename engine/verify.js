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
//   [회귀 불변식] qm·swqm은 다른 11개 과정 작업과 무관하게 계속 굴러가는 실제 산출물이다.
//   이 파일(과 shape.js·layout.js·session_types.js)을 건드리는 모든 작업은:
//     1. 기존 kind·세션 유형·visual.type을 고치지 않고 항상 *추가*로만 넣는다.
//     2. 매 변경 직후 `npm test`(코퍼스 전건 + 골든 스냅샷 기하 불변)로 회귀를 확인한다.
//     3. `node engine/cli.js course courses/qm`·`courses/swqm`도 오류 0/경고 0을 유지해야 한다 —
//        확장이 새 경고를 내면 그 확장이 QM 어휘에 잘못 걸린 것이다.
//
//   [등급]
//     오류(exit 1) — 산출물이 깨지거나 신뢰를 훼손한다:
//                    필수 필드 누락 / 시각화가 밴드를 넘어 잘림 / 인용 id·필드 누락 /
//                    자산에 없는 인용(환각) / 자산과 다른 문구(의역) / 같은 세션 내 중복 / 대괄호
//     경고         — 규격에서 벗어날 뿐 산출물은 성립한다:
//                    밀도 과다 / caption 누락 / 시각화 트리거 회피 / 세션 태그 밖 인용
//
//   [구조] 핵심 로직은 verifyDeck(DECK)로 내보낸다(module.exports) — master_render.js가
//   렌더 경로에서 이 함수를 그대로 불러 lint.js를 대신한다(엔진 직접 실행 경로도 이 검사를
//   받는다). CLI로 직접 실행하면(require.main === module) 아래에서 deck을 읽고 리포트를
//   찍고 exit한다 — 이 파일 하나가 라이브러리와 CLI 둘 다다(master_render.js와 같은 패턴).
// ============================================================================
const fs = require('fs');
const path = require('path');
const { IN, textW, avail, lineCount } = require('./measure.js');
const QA = require('./quotes.js');
const { norm } = QA;                                  // 인용 자산 파서(엔진과 공유 — 두 벌이면 어긋난다)
const { isFree, requiredFields, hint } = require('./skeleton.js');   // 골격 규칙 단일 소스(엔진과 공유)
const shape = require('./shape.js');                           // visual.data 형태 단일 소스(엔진과 공유)
const ST = require('./session_types.js');                      // 세션 유형 요건 단일 소스(엔진과 공유)
const { claimText: claim, hasRatio } = require('./triggers.js');   // 트리거 판정 단일 소스(엔진과 공유)
const PLANTUML = require('./plantuml/render.js');               // uml 다이어그램 렌더 단일 소스(엔진과 공유)

// ============================================================================
// Tier 1 게이트(노테이션 무관) 상수 — 정본은 CLAUDE.md '규율'·'Tier 1 게이트' 절.
//   여기는 기계 검사만 싣는다 — 규율 서술은 CLAUDE.md에, 판정 로직은 여기 한 곳에.
// ============================================================================
// 내부 구조어 — 학습자 필드(title·sub·lead·foot·next)에 0. 단어 매칭('주기' 포함)이 아니라
// 형태 매칭이다 — '주기'는 '생애 주기'·'반복 주기'처럼 도메인 용어에도 흔히 쓰이는 일반
// 명사라, 통짜로 금지하면 그 정상 용례까지 오탐한다(2026-08, ooad06·11·12·swqm08에서 실측).
// 차단 대상은 나선형 구조 저작 라벨뿐이다 — 숫자가 바로 붙은 'N주기'(1주기·2주기…)와
// '이후 주기'(라벨을 대명사로 받는 관용구)로 형태를 좁힌다.
const GLOBAL_FORBIDDEN_PATTERNS = [
    { re: /\d+\s*주기/, label: 'N주기(나선형 구조 라벨)' },
    { re: /이후\s*주기/, label: '이후 주기(나선형 구조 라벨 대명사)' },
];
const UML_BOTTOM_MARGIN_MIN = 8;                 // px — PNG 하단 배경 여백 하한. 슬라이드 좌표가 아니라 실제 픽셀로 잰다(bottomMargin).

// ============================================================================
// Tier 2 노테이션 프로파일 — 정본은 CLAUDE.md '노테이션 프로파일' 절.
//   프로파일 = 그 노테이션에서만 유효한 금지 토큰 + 매칭 규칙(어떤 uml 슬라이드에 적용되는가).
//   전역(Tier 1)에 두지 않는 이유: 화살표(-->)는 클래스(도메인 모델)에서는 금지지만 시퀀스
//   다이어그램에서는 정상 표기다 — 노테이션마다 뜻이 다른 규칙은 프로파일로 격리한다.
// ============================================================================
const PROFILES = {
    class: {
        match: (v) => !!(v && v.type === 'uml' && v.data && v.data.kind === 'class'),
        forbiddenTokens: ['-->', '<--', '..>', '<..'],   // 방향 화살표 — 도메인 모델 연관은 양방향, 방향은 설계 결정(OOD)의 몫
    },
    // 시퀀스·협업·상태 프로파일은 동적 모델 세션이 세울 때 여기에 추가한다.
};

// ── 엔진 레이아웃 상수를 엔진 소스에서 읽는다(복제하지 않는다) ──
//   분할 후 상수는 render/context.js에 있다. master_render.js(선두 형식 헤더)와
//   render/*.js 전부를 이어 붙여 파싱한다 — 단일 소스가 어느 파일로 옮겨가도 여기 한 곳만 따라간다.
//   master_render.js를 맨 앞에 둔다(DOC의 ^ 앵커가 선두 형식 헤더를 잡도록).
//   TYPES는 더 이상 소스 스크래핑으로 읽지 않는다 — shape.js의 SHAPES 키가 이미 '엔진이 형태를
//   아는 타입 목록'의 단일 소스라 그걸 그대로 쓴다(아래). 두 목록을 따로 유지하며 정합성만
//   검사하던 방식(구 noShape 체크)은 목록이 하나가 되며 필요 없어졌다.
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
const LM      = grab(/\bLM\s*=\s*([\d.]+)/, 'LM');
const Y_LINE  = grab(/\bY_LINE\s*=\s*([\d.]+)/, 'Y_LINE');
const F_SRC   = grab(/\bF_SRC\s*=\s*(\d+)/, 'F_SRC');
const LOOP_IN = grab(/\bLOOP_IN\s*=\s*([\d.]+)/, 'LOOP_IN');
// sub(명제) 규격 — primitives.js의 sub 정의에서 직접 읽는다. 상수 이름이 없으므로 리터럴을 잡는다.
//   sub는 한 줄 높이 박스이고 바로 아래에 구분선이 있다 → 두 줄이 되면 선을 침범한다.
const F_SUB   = grab(/const sub\s*=[\s\S]{0,300}?fontSize:\s*(\d+)/, 'sub fontSize');
const SUB_KINDS = (SRC.match(/SUB_KINDS\s*=\s*\[([^\]]*)\]/) || [,''])[1]
    .split(',').map(x => x.trim().replace(/^['\"]|['\"]$/g, '')).filter(Boolean);
const SUB_MAX = (() => { let n = 0; for (let i = 1; i <= 200; i++) {
    if (lineCount('가'.repeat(i), CW - PAD * 2, F_SUB) === 1) n = i; else break; } return n; })();
// 엔진이 아는 타입 목록 = shape.js가 형태를 등록해 둔 타입 목록. 이 둘은 정의상 같아야 하므로
// (형태 없는 타입은 렌더러가 그릴 방법이 없다) 따로 유지하지 않고 하나에서 파생시킨다 —
// 타입을 늘리고 형태를 등록하지 않으면 shape.SHAPES에 없으니 TYPES에도 자동으로 없다.
const TYPES = Object.keys(shape.SHAPES);
if (!TYPES.length) { console.error('[중단] shape.js에서 타입 목록을 읽지 못했다.'); process.exit(2); }
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

// ── 기하 계산 ──
// '엔진과 동일한 식'을 여기 다시 쓰지 않는다. layout.js가 재고, 여기서는 판정만 한다.
// (같은 식을 두 곳에 두면 언젠가 갈라진다 — 폭에서 한 번, 형태에서 한 번 겪었다)
const L = (t, w, bullet = 10, fs = F_IN) =>
    String(t).split('\n').reduce((n, p) => n + lineCount(p, bullet === false ? w - PAD * 2 : avail(w, bullet), fs), 0);
const budget = (w, bullet = 10, fs = F_IN) => Math.floor((bullet === false ? w - PAD * 2 : avail(w, bullet)) / (IN(fs) * 1.05));
const lineH = (fs) => IN(fs * 1.2);
const textH = (lines, paras, fs = F_IN) => lines * lineH(fs) + paras * (2 * SP / 72) + PAD * 2;
const SLACK = 0.06;
// 엔진과 같은 측정 함수를 넘긴다 → 엔진이 그리는 치수 = 여기서 재는 치수.
const LO = require('./layout.js')({ CW, LM, PAD, SP, SLACK, CTX_TOP, VB, Y_LINE, LOOP_IN,
    F_IN, F_HEAD, F_BODY, F_ELAB, F_STMT, F_SRC, F_CAP, CAP_LH, CAP_MAX,
    lines: L, textH, textW, lineCount, IN });

const quoteH = (q) => Math.max(0.78,
    L(`“${q.ko}”`, CW, false, F_QKO) * 0.24 + L(`${q.en} — ${q.author}`, CW, false, F_QEN) * 0.18 + PAD * 2);

// 시각 데이터에 실제로 들어간 글자 수. 타입에 중립적이다 —
// 도형 수는 타입마다 배율이 달라(boxes 3개=9~12도형, bullets 5줄=2도형) 대리 지표로 쓸 수 없다.
const visualChars = (v) => {
    if (!v) return 0;
    let n = 0;
    const walk = (x) => {
        if (x == null) return;
        if (typeof x === 'string') { n += x.length; return; }
        if (typeof x === 'number') { n += String(x).length; return; }
        if (Array.isArray(x)) { x.forEach(walk); return; }
        if (typeof x === 'object') Object.entries(x).forEach(([k, y]) => { if (!['id', 'type', 'at'].includes(k)) walk(y); });
    };
    walk(v.text); walk(v.note); walk(v.data);
    return n;
};

// ============================================================================
// verifyDeck(DECK) — 덱 하나를 검사해 { err, warn, detail, ... }를 돌려준다.
//   부수효과(console.log·process.exit) 없음 — CLI 래퍼(아래)와 master_render.js가
//   각자의 방식으로 이 결과를 소비한다. DECK은 load_deck.js가 병합한 형태를 기대한다
//   (meta.quotes가 절대경로로 고정돼 있어야 한다).
// ============================================================================
function verifyDeck(DECK, opts = {}) {
    const S = DECK.session.slides;
    const NO = DECK.session.no;
    const SESSION_TYPE = DECK.session.type || ST.DEFAULT;
    const frontMatter = NO === 1 ? 3 : 1;
    const P = (i) => frontMatter + i + 1;

    const err = [], warn = [], detail = [];

    // ── Tier 1/2 게이트 집계 — 정본은 CLAUDE.md. profile을 인자로 받는다(opts.profile) —
    //   지정하면 그 프로파일만, 생략하면 매칭되는 프로파일을 전부 자동 적용한다(auto).
    const profileArg = opts.profile || null;
    const gate = {
        umlSourceCount: 0, umlRenderedCount: 0,          // (a) 소스 다이어그램 수 = 렌더 pic 수
        umlMarginMinPx: null,                            // (b) 전 다이어그램 중 최소 하단 여백(px)
        bandOverflowCount: 0,                            // (c) 슬라이드/밴드 경계 초과 수
        forbiddenTokenHits: [],                           // (d) 학습자 필드의 내부 구조어 검출
        profileViolations: [],                            // Tier 2 — 프로파일 금지 토큰 검출
    };

    // 인용 자산 — 경로는 데이터가 선언한다(검증기가 특정 교재를 알지 않는다).
    let ASSETS = null, CLAIMS = null, NODE = null;
    const qPath = DECK.meta && DECK.meta.quotes;
    if (qPath) {
        const abs = path.resolve(qPath);                 // loadDeck이 선언 파일 기준 절대경로로 이미 고정했다
        if (!fs.existsSync(abs)) err.push(`meta.quotes 경로에 파일이 없다: ${qPath}`);
        else {
            const r = QA.parse(abs); ASSETS = r.assets; r.bad.forEach(b => err.push(b));
            // 커리큘럼 세션 노드의 '명제' 목록. 없으면 null — 구 형식 세션은 검사를 건너뛴다.
            CLAIMS = QA.parseClaims(abs, NO);
            NODE = QA.parseSessionMeta(abs, NO);
        }
    }

    // ── 슬라이드 검사 ──
    const VTRIG = (DECK.meta && DECK.meta.visualTriggers) || {};
    const used = new Map();
    const claimHit = new Map();          // 명제 id → 그 명제를 맡은 슬라이드 번호들
    const fillOf = new Map();            // 슬라이드 → 시각이 밴드를 차지한 비율

    S.forEach((sl, i) => {
        const tag = `p${P(i)}`;
        const v = sl.visual;

        // 0) 명제 대조 — 커리큘럼이 정한 주장을 이 장이 실제로 맡고 있는가.
        //    커리큘럼이 '무엇을 말할지'를 정하고 덱이 '어떻게 말할지'를 정한다. 그 연결이 데이터로 남아야
        //    누가 만들어도 같은 뼈대가 나온다 — 연결을 재지 않으면 생성기가 조용히 다른 교재를 만든다.
        if (CLAIMS) {
            // 고정 장(회수·예고)과 선언(manifesto)은 명제를 갖지 않는다
            const ARG = !ST.isFixed(SESSION_TYPE, sl.kind) && !ST.isUnclaimed(SESSION_TYPE, sl.kind);
            if (sl.claim) {
                const ids = Array.isArray(sl.claim) ? sl.claim : [sl.claim];
                if (!ids.length) err.push(`${tag} claim 배열이 비어 있다`);
                if (new Set(ids).size !== ids.length) err.push(`${tag} claim 배열에 같은 id가 중복됐다: ${ids.join(', ')}`);
                ids.forEach(id => {
                    const c = CLAIMS.get(id);
                    if (!c) err.push(`${tag} claim '${id}'이 커리큘럼 S${String(NO).padStart(2, '0')} 명제 목록에 없다`);
                    else {
                        if (c.kind !== sl.kind) err.push(`${tag} claim '${id}'의 분류는 '${c.kind}'인데 이 장의 kind는 '${sl.kind}'이다`);
                        // 명제 하나는 1:N장으로 펴질 수 있고, 같은 분류의 호환되는
                        // 명제 여러 개는 한 장에서 자연스러운 논증을 이룰 때 N:1로 묶을 수 있다.
                        claimHit.set(id, [...(claimHit.get(id) || []), i + 1]);
                    }
                });
            } else if (ARG) {
                warn.push(`${tag} claim이 없다 — 이 장이 커리큘럼의 어느 명제를 맡는지 밝힌다`);
            }
        }

        // 1) 필수 필드 — skeleton.js가 정한다(엔진과 같은 소스). statement는 골격 예외라 빈 목록.
        const free = isFree(sl);
        requiredFields(sl).forEach(f => { if (!sl[f]) err.push(`${tag} 필수 필드 누락: ${f}${hint(f)}`); });
        // statement(골격 예외)는 위 requiredFields가 빈 목록이라 통과한다 — 대신 내용 자체가 있는지 본다.
        //   text도 quote.ko도 없으면 보여줄 문장이 없는 빈 단문이다.
        //   (render/lint.js에서 옮김 — verify에는 없던 검사였다. lint.js와 verify.js를 한 곳으로 합치며 이관)
        if (free && !(v.text || (v.quote && v.quote.ko)))
            err.push(`${tag} statement에 text도 quote도 없다 — 보여줄 문장이 없다`);
        // sub 오버플로 — 명제가 두 줄이 되면 아래 구분선을 침범한다.
        //   렌더해서 눈으로 봐야만 보이던 결함이라 저자가 못 본다. 여기서 잰다.
        if (!free && sl.sub) {
            // 렌더되는 실제 문자열로 잰다 — 분류가 있으면 '[원인] '이 앞에 붙는다.
            const shown = SUB_KINDS.includes(sl.kind) ? `[${sl.kind}] ${sl.sub}` : sl.sub;
            const sn = lineCount(shown, CW - PAD * 2, F_SUB);
            if (sn > 1) err.push(`${tag} sub(명제)가 ${sn}줄이다 — 아래 구분선을 침범한다. 한글 ${SUB_MAX}자 이내로 줄이거나 뒷문장을 lead로 내린다`);
        }
        if (!free && sl.question && !/[?？]\s*$/.test(sl.question)) warn.push(`${tag} question이 물음표로 끝나지 않는다`);
        if (!sl.notes) warn.push(`${tag} notes(강사 노트)가 없다 — 던질 질문·흔한 반론·시간 배분을 남긴다`);
        // (d) Tier 1 — 전역 금지 형태: 나선형 구조 저작 라벨이 학습자 필드(title·sub·lead·foot·next)에
        //   새면 저작 과정의 어휘가 학습자에게 그대로 노출된다. 단어 통짜가 아니라 형태로 좁힌다
        //   (GLOBAL_FORBIDDEN_PATTERNS 주석 참조) — '생애 주기'·'반복 주기' 같은 도메인 용어는
        //   숫자도 '이후'도 붙지 않으므로 걸리지 않는다. notes(강사 노트)는 학습자 노출이 아니므로 검사하지 않는다.
        {
            const learnerText = [sl.title, sl.sub, sl.lead && sl.lead.text, sl.foot && sl.foot.body, sl.next]
                .filter(Boolean).join(' ');
            GLOBAL_FORBIDDEN_PATTERNS.forEach(({ re, label }) => {
                const m = learnerText.match(re);
                if (m) {
                    err.push(`${tag} 학습자 필드에 내부 구조어 "${m[0]}"가 있다(${label}) — title·sub·lead·foot·next에서 뺀다`);
                    gate.forbiddenTokenHits.push({ slide: tag, token: m[0] });
                }
            });
        }
        // foot(+next) 오버플로 — foot는 layout.js 기하 검증을 안 받는 유일한 밴드다(박스 h가
        //   render/pages.js에 리터럴 1.0으로 고정돼 있다). ftr 구분선(render/primitives.js의
        //   y=7.10 — 이름 없는 리터럴이라 다른 상수처럼 소스에서 못 긁는다)까지 Y_BOT(5.90)에서
        //   남는 여유를 실측하면 1.20in. slide.next(다음 연결 예고)가 foot과 같은 박스를 나눠
        //   쓰므로 둘을 합쳐서 잰다. 처음 도입하는 검사라 오류가 아니라 경고로 둔다.
        if (!free && sl.foot) {
            const FOOT_BAND = 1.20;
            const footLines = lineCount(sl.foot.body, CW - PAD * 2, F_BODY) + (sl.next ? lineCount(`다음: ${sl.next}`, CW - PAD * 2, F_BODY) : 0);
            const footH = footLines * lineH(F_BODY);
            if (footH > FOOT_BAND)
                warn.push(`${tag} foot가 박스를 넘는다(${footLines}줄, 약 ${footH.toFixed(2)}in > 여유 ${FOOT_BAND}in) — 하단 페이지 표기와 겹칠 수 있다. foot.body나 next를 줄인다`);
        }

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

        // 3) 밴드 — layout.js가 잰다(엔진과 같은 소스).
        //    예전에는 여기서 다시 구현했고, statement의 밴드 하한을 VB+0.90으로 잡아 엔진(Y_LINE)보다
        //    0.86in 넓게 알고 있었다. 아무도 그 어긋남을 재지 않았다.
        const QH = (sl.quote && sl.quote.ko) ? quoteH(sl.quote) + 0.04 : 0;
        const B = LO.band({ free, question: sl.question, lead: sl.lead, QH, caption: v && v.caption });
        const VT = B.VT;
        let VH = B.VH;
        if (v && v.caption) {                                     // caption 내용 점검(밴드 몫은 layout이 이미 뺐다)
            // caption에 인용 원문을 밀어넣으면 그림이 주가 되고 말이 종이 된다(8pt 각주에 명제가 파묻힌다).
            // 원문·출처·URL은 엔진이 강사 노트에 자동으로 붙인다 → caption은 근거·한계만.
            const cap = String(v.caption);
            if (/["“][A-Za-z][^"”]{40,}/.test(cap))
                warn.push(`${tag} caption에 인용 원문(영문)이 들어 있다 — caption은 근거·한계 전용(8pt)이다. 원문은 강사 노트(자동)나 quote 오버레이로 보낸다`);
            const cl = lineCount(cap, CW - PAD * 2, F_CAP);
            if (cl > CAP_MAX) err.push(`${tag} caption이 ${cl}줄이다(최대 ${CAP_MAX}줄) — 핵심만 남기고 '…'로 줄인다`);
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

        // 4.5) 형태 검사 — 측정 '앞'이다.
        //   이 검사가 없던 동안 형태가 어긋난 data는 아래 측정식에서 TypeError로 검증기를 죽였다.
        //   (문자열에 .reduce를 걸었다) 검증기가 죽으면 생성기는 무엇을 고쳐야 하는지 알 수 없다.
        //   보정 가능한 차이는 엔진도 보정하므로 경고다(엔진이 고치는 것을 막아 세우지 않는다 — stripNo 선례).
        const conf = shape.conform(v);
        conf.fixes.forEach(m => warn.push(`${tag} ${m}`));
        conf.errors.forEach(m => err.push(`${tag} ${m}`));
        if (conf.errors.length) return;                   // 형태가 깨진 데이터는 재지 않는다

        let need = null;

        // 5) 시각화별 필요 높이 + 규격 점검
        if (LO.isItem(v.type)) {
            const g = LO.item(v.type, v.data, { VT, VH });            // 치수는 엔진과 같은 소스에서 받는다
            const budg = budget(g.w, g.bullet);
            need = g.need;
            v.data.forEach((box, k) => {
                const p = g.per[k], body = box.body || [];
                if (p.real > g.alloc + 1e-6)
                    err.push(`${tag} ${v.type} "${box.title}" 박스에서 글자가 넘친다(필요 ${p.real.toFixed(2)}in > 배정 ${g.alloc.toFixed(2)}in) — 문장을 한글 ${budg}자로 줄이거나 항목을 뺀다`);
                body.forEach(t => {
                    const l = L(t, g.w, g.bullet);
                    if (l >= 3) warn.push(`${tag} ${v.type} ${g.n}열 ${l}줄: "${String(t).slice(0, 20)}…" — 밀도 과다 (1줄 = 한글 ${budg}자)`);
                });
            });
        } else if (v.type === 'bullets') {
            const g = LO.bullets(v.data, { VT, VH });
            need = g.need;
            g.per.forEach((p2, k) => {
                if (p2.ln >= 3) warn.push(`${tag} bullets ${k + 1}번이 ${p2.ln}줄이다: "${p2.text.slice(0, 20)}…" — 한 줄에 한 근거가 읽힌다 (1줄 = 한글 ${g.budget}자)`);
            });
        } else if (v.type === 'table') {
            const g = LO.table(v.data, { VT, VH });
            need = g.need;
            v.data.forEach((row, r) => row.forEach((c, ci) => {
                const txt = g.cellText(c);
                if (/^\[.*\]$/.test(txt.trim())) err.push(`${tag} 표 셀에 대괄호: ${txt}`);
                if (g.lns[r][ci] >= 3) warn.push(`${tag} 표 셀 ${g.lns[r][ci]}줄: "${txt.slice(0, 20)}…" (열폭 ${g.colW[ci].toFixed(2)}in = 한글 ${budget(g.colW[ci], false)}자)`);
            }));
        } else if (v.type === 'statement') {
            // 엔진은 text를 우선해 그린다. 예전 verify는 인용 ko를 먼저 쟀다 — 둘 다 있으면 다른 것을 재고 있었다.
            const isQ = !!(v.quote && v.quote.ko);
            const aQ = isQ && ASSETS ? ASSETS.get(v.quote.id) : null;
            const g = LO.statement(v, { VT, VH }, aQ && aQ.src ? aQ.src.split(/[(—]/)[0].trim() : '');
            const av = g.av, tl = g.tl, nl2 = g.nl;
            // 선언(kind '선언')은 이 상한을 면제한다 — 한 문장이 아니라 여러 문장으로 된 단언문이
            // 그 형식이다. 밴드 기하 자체(need/VH, 아래 469행)는 면제하지 않는다 — 길어도 슬라이드
            // 밖으로 넘치면 그건 잡아야 한다. 여기서만 '문장이 아니라 문단이다'라는 판단을 뺀다.
            if (tl > 2 && !ST.isUnclaimed(SESSION_TYPE, sl.kind))
                err.push(`${tag} statement 문장이 ${tl}줄이다 — 20pt에서 2줄(한글 약 ${Math.floor(av / (IN(F_STMT) * 1.05)) * 2}자)을 넘으면 문장이 아니라 문단이다`);
            if (nl2 > 2) warn.push(`${tag} statement note가 ${nl2}줄이다 — 해설도 한두 문장이다`);
            // caption은 근거·한계 전용이다. 해설을 8pt에 넣으면 슬라이드의 논지가 각주로 강등된다.
            if (!v.note && v.caption && !/원전|귀속|추정|편차|출처|미확인|WIDELY|통용|기반/.test(String(v.caption)))
                warn.push(`${tag} statement에 note가 없고 caption만 있다 — 해설이라면 note(14pt)로 올린다. caption(8pt)은 근거·한계 전용이다`);
            if (v.figure) err.push(`${tag} statement에 figure는 없다 — 단문에는 그림을 넣지 않는다(넣으려면 논증 슬라이드로 만든다)`);
            need = g.need;
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
            const g = LO.takeaways(v.data, { VT, VH });               // 치수는 엔진과 같은 소스에서 받는다
            v.data.forEach((it, k) => {
                const p = g.per[k], head = String((it.body || [])[0] || '');
                if (p.real > g.h + 1e-6) err.push(`${tag} takeaways 항목이 행을 넘는다(${p.ln}줄, 필요 ${p.real.toFixed(2)}in > 배정 ${g.h.toFixed(2)}in): "${head.slice(0, 20)}…"`);
                else if (p.ln > 2) warn.push(`${tag} takeaways 본문 ${p.ln}줄: "${head.slice(0, 20)}…" — 밀도 과다`);
            });
            need = null;
        }

        // ── 관계 계열: 노드·간선 검증. 치수는 layout.js가 재고 여기서는 판정만 한다 ──
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
                // 레벨 배치·노드 치수는 layout.js가 잰다(엔진과 같은 소스).
                // 세로(TD)도 반드시 잰다. 가로만 재면, 가로에서 밴드를 넘은 생성기가 세로로 돌려 오류를 지운다
                // (실제로 그런 일이 있었다 — 검증되지 않는 선택지는 탈출구가 된다).
                const g = LO.chain(d, { VT, VH });
                const { H, nodeW, levels, edges } = g, lv = levels.length, nl = g.nLines;
                const maxLines = Math.max(1, ...ns.map(x => nl(x.label)));
                need = g.need;
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
                const g = LO.loop(d, { VT, VH });
                const nl = g.nLines, budg = g.labelBudget;
                need = g.need;
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
            const g = LO.share(items, { VT, VH });
            items.forEach((it, k) => {
                const w = g.seg[k].w;
                const txt = `${it.value}%`;
                if (textW(txt, F_IN) + 0.04 > w)
                    detail.push(`${tag} share "${it.label}"(${it.value}%) 조각 폭 ${w.toFixed(2)}in — 숫자가 바에 안 들어가 범례에서만 읽힌다`);
            });
            need = g.need;
        } else if (v.type === 'magnitude') {
            const items = v.data || [], n = items.length;
            if (n < 2) err.push(`${tag} magnitude 항목이 ${n}개다 — 격차를 보이려면 최소 2개`);
            if (n > 5) warn.push(`${tag} magnitude 항목 ${n}개 — 5개를 넘으면 행이 눌린다`);
            const g = LO.magnitude(items, { VT, VH });
            const { labW, rowH } = g;
            need = g.need;
            items.forEach((it, k) => {
                const l = g.rows[k].ln;
                if (textH(l, 1) > rowH + 1e-6)
                    err.push(`${tag} magnitude 라벨이 행을 넘는다(${l}줄): "${String(it.label).slice(0, 20)}…" — 한글 ${budget(labW, false)}자 안으로 줄인다`);
                if (it.value === undefined || it.value === null || it.value === '')
                    err.push(`${tag} magnitude "${it.label}"에 value가 없다 — 비례를 포기한 대신 숫자를 반드시 병기한다`);
            });
        } else if (v.type === 'pyramid') {
            const items = v.data || [], n = items.length;
            if (n < 2) err.push(`${tag} pyramid 층이 ${n}개다 — 계층은 최소 2층`);
            if (n > 5) warn.push(`${tag} pyramid 층 ${n}개 — 5층을 넘으면 폭 차이가 사라진다`);
            const g = LO.pyramid(items, { VT, VH });
            const rowH = g.rowH;
            need = g.need;
            items.forEach((it, k) => {
                const { w, ln: l } = g.rows[k];
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
            const g = LO.quadrant(d, { VT, VH });
            need = g.need;
            g.cells.forEach(c => {
                if (c.real > g.alloc + 1e-6)
                    err.push(`${tag} quadrant "${c.title}" 칸에서 글자가 넘친다(필요 ${c.real.toFixed(2)}in > 배정 ${g.alloc.toFixed(2)}in) — 한글 ${budget(g.cw, 10)}자 기준으로 줄인다`);
            });
        }

        // ── codepair — N벌(2~3) 코드 대조. 배치·폰트는 layout.js가 정한다(엔진과 같은 소스).
        else if (v.type === 'codepair') {
            const g = LO.codepair(v.data || {}, { VT, VH });
            need = g.need;
            if (g.mode === 'stack' && g.tooWide)
                warn.push(`${tag} codepair 코드 한 줄이 전폭·최소 폰트(${LO.CODE.fMin}pt)에서도 안 들어간다(최장 ${g.maxChars}자) — 그 줄을 줄이거나 두 벌로 나눈다`);
        }

        // ── uml — PlantUML 다이어그램(engine/plantuml/render.js). codepair와 달리 문자열만으론
        //    치수를 못 재 실제로 한 번 렌더한다(해시 캐시라 재호출은 즉시 반환). 렌더 자체가
        //    실패하면(문법 오류·jar 없음 등) 오류로 잡는다 — 형태는 맞아도 그릴 수 없는 경우다.
        else if (v.type === 'uml') {
            gate.umlSourceCount++;
            try {
                const img = PLANTUML.renderDiagram(v.data);
                gate.umlRenderedCount++;
                const g = LO.uml(v.data, { VT, VH }, img);
                need = g.need;
                if (g.scale < LO.UML.minScale)
                    warn.push(`${tag} uml 다이어그램이 밴드에 비해 커서 ${Math.round(g.scale * 100)}%로 축소된다 — 항목을 줄이거나 더 단순화한다`);

                // (b) Tier 1 — PNG 하단 배경 여백을 실제 픽셀로 잰다. 슬라이드 좌표(밴드 안에
                //   드는지)는 이미지 내부가 잘렸는지 못 잡는다 — 이미지 자체가 테두리를 그리다
                //   만 채로 끝나도 배치 좌표는 멀쩡하다(2026-08, plantuml 렌더러 결함으로 실증).
                const margin = PLANTUML.bottomMargin(fs.readFileSync(img.path));
                if (margin != null) {
                    if (gate.umlMarginMinPx == null || margin < gate.umlMarginMinPx) gate.umlMarginMinPx = margin;
                    if (margin < UML_BOTTOM_MARGIN_MIN)
                        err.push(`${tag} uml PNG 하단 여백 ${margin}px — 최소 ${UML_BOTTOM_MARGIN_MIN}px 미만이면 짤림 의심(픽셀 직접 검사, 슬라이드 좌표 아님)`);
                }

                // Tier 2 — 노테이션 프로파일 금지 토큰. profileArg 지정 시 그 프로파일만, 아니면
                //   매칭되는 프로파일을 자동 적용한다(노테이션 종류는 v.data.kind로 판정).
                Object.entries(PROFILES).forEach(([name, prof]) => {
                    if (profileArg && profileArg !== name) return;
                    if (!prof.match(v)) return;
                    const src = String((v.data && v.data.source) || '');
                    prof.forbiddenTokens.forEach(tok => {
                        if (src.includes(tok)) {
                            err.push(`${tag} 프로파일 '${name}' 금지 토큰 "${tok}"가 uml source에 있다`);
                            gate.profileViolations.push({ slide: tag, profile: name, token: tok });
                        }
                    });
                });
            } catch (e) {
                err.push(`${tag} uml 렌더 실패 — ${String(e.message || e).split('\n')[0]}`);
            }
        }

        // 6) 밴드 초과 = 잘림 = 오류
        // 단, 밴드에 맞춰 스스로 줄어드는 타입(loop·magnitude·pyramid·quadrant)은 '여유 0'이 정상이다.
        // 이들은 하한(행 높이·반지름 최소값)에 걸릴 때만 밴드를 넘는다 → 초과만 본다. 근접 경고는 오탐이다.
        const FILL = ['loop', 'magnitude', 'pyramid', 'quadrant'];
        if (need != null) {
            fillOf.set(sl, Math.min(1, need / VH));
            const slack = VH - need;
            detail.push(`${tag} ${String(v.type).padEnd(9)} VH=${VH.toFixed(2)} 필요=${need.toFixed(2)} 여유=${slack.toFixed(2)}${sl.quote ? '  [quote]' : ''}${v.caption ? '  [caption]' : ''}`);
            if (slack < -1e-6) { err.push(`${tag} ${v.type}가 밴드를 넘는다(필요 ${need.toFixed(2)}in > 밴드 ${VH.toFixed(2)}in) — 하단이 잘린다. 항목·행을 줄이거나 문장을 축약한다`); gate.bandOverflowCount++; }
            else if (slack < 0.15 && !FILL.includes(v.type)) warn.push(`${tag} ${v.type} 밴드 여유 ${slack.toFixed(2)}in — 한 줄만 늘어도 잘린다`);
        }
    });

    // (a) Tier 1 — 소스 다이어그램 수 = 렌더 pic 수. 슬라이드별로 이미 렌더 실패를 오류로
    //   잡지만(캐치 블록), 집계 불일치를 별도로 한 번 더 확인한다 — 누락을 세는 게이트는
    //   개별 실패 목록과 다른 관점의 안전망이다.
    if (gate.umlSourceCount !== gate.umlRenderedCount)
        err.push(`uml 다이어그램 소스 ${gate.umlSourceCount}개 중 ${gate.umlRenderedCount}개만 렌더됐다 — 누락 ${gate.umlSourceCount - gate.umlRenderedCount}개(위 개별 렌더 실패 참조)`);

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
    // ── 세션 유형 ── 요건도 장수도 유형이 정한다.
    const SESSION_SPEC = ST.spec(SESSION_TYPE);
    if (!SESSION_SPEC) err.push(`알 수 없는 세션 유형 '${SESSION_TYPE}' — ${ST.names().join(' | ')} 중 하나`);
    else {
        const OK = ST.kinds(SESSION_TYPE);
        S.forEach((s2, i) => { if (!OK.includes(s2.kind)) err.push(`슬라이드 ${i + 1}: kind '${s2.kind}'는 ${SESSION_TYPE}에 없다 — ${OK.join(' | ')}`); });
        SESSION_SPEC.fixed.forEach(k => { if (!S.some(s2 => s2.kind === k)) err.push(`${SESSION_TYPE}의 고정 장 '${k}'가 없다`); });
        // 선언(unclaimed) — 명제도 고정 장도 아니라 파생값 계산엔 안 들어가지만, 세션당 상한은 잰다.
        //   왜 세션당 1개인가: 선언은 이 세션 전체를 여는 단언이다. 둘이면 어느 쪽이 진짜 선언인지
        //   흐려진다 — 필요하면 하나로 합치거나 lead/foot로 눌러 담는다.
        const nDecl = S.filter(s2 => ST.isUnclaimed(SESSION_TYPE, s2.kind)).length;
        if (nDecl > 1) err.push(`선언 장이 세션 안에 ${nDecl}개다 — 세션당 최대 1개`);
        if (NODE && NODE.requiredDeclaration) {
            const matched = S.filter(s2 => ST.isUnclaimed(SESSION_TYPE, s2.kind) && s2.proposition === NODE.requiredDeclaration);
            if (!matched.length)
                err.push(`커리큘럼 필수 선언 '${NODE.requiredDeclaration}'을 맡은 선언 장이 없다 — kind:'선언'과 proposition id를 일치시킨다`);
        }
        // 장수 == 명제 수 + 고정 장(1:1) 등식은 없다. 대신 완전 커버리지를 오류로 잡는다(아래 ⑥ 참조).
    }
    const arg = (sl) => !isFree(sl);                      // statement는 논증이 아니다(skeleton.js와 같은 소스)
    (SESSION_SPEC ? SESSION_SPEC.required : []).forEach(k => {
        if (!S.some(s => s.kind === k && arg(s))) err.push(`분류 '${k}'의 논증 슬라이드 없음 — statement(단문)로는 분류 요건을 채울 수 없다`);
    });
    // 커리큘럼 노드가 유형·분량을 선언하면 덱과 대조한다. 커리큘럼이 정본이다.
    if (NODE) {
        if (NODE.type && NODE.type !== SESSION_TYPE)
            err.push(`세션 유형이 커리큘럼과 다르다 — 노드는 '${NODE.type}', 덱은 '${SESSION_TYPE}'`);
        if (NODE.minutes && SESSION_SPEC) {
            // 분량과 명제 수는 서로를 견제한다: 80분이라 써놓고 명제가 다섯이면 그 자리에서 어긋남이 드러난다.
            const want = Math.round(NODE.minutes / SESSION_SPEC.minPerSlide);
            const noteTimes = S.map(s2 => Number((String(s2.notes || '').match(/배분\s*(\d+(?:\.\d+)?)\s*분/) || [])[1]));
            const allTimed = noteTimes.length > 0 && noteTimes.every(Number.isFinite);
            const noteTotal = allTimed ? noteTimes.reduce((a, n) => a + n, 0) : null;
            const timeFits = allTimed && Math.abs(noteTotal - NODE.minutes) <= 1;
            if (timeFits)
                detail.push(`notes 배분 ${noteTotal}분이 세션 분량 ${NODE.minutes}분과 일치 — 장수 heuristic 경고를 생략한다`);
            else if (allTimed && Math.abs(noteTotal - NODE.minutes) > Math.max(2, NODE.minutes * 0.1))
                warn.push(`notes 배분 합계 ${noteTotal}분 ≠ 세션 분량 ${NODE.minutes}분 — 설명·실습·토론 시간을 다시 배분한다`);
            if (!timeFits && Math.abs(S.length - want) > Math.max(2, want * 0.3))
                warn.push(`분량 ${NODE.minutes}분에 본문 ${S.length}장 — ${SESSION_TYPE}은 장당 약 ${SESSION_SPEC.minPerSlide}분이라 ${want}장 안팎이 맞다. 분량이나 명제 수를 조정한다`);
        }
    }

    // 부(part)는 연속이어야 한다 — 흩어지면 목차 그룹이 같은 라벨을 두 번 그린다.
    // 부는 요건이 걸리는 단위를 바꾸는 장치이지 장식이 아니다.
    {
        const seq = S.map(s2 => s2.part || null).filter(Boolean);
        const seen = new Set(); let prev = null;
        S.forEach((s2, i) => {
            const pt = s2.part || null;
            if (pt && pt !== prev) {
                if (seen.has(pt)) err.push(`슬라이드 ${i + 1}: 부 '${pt}'가 떨어져서 다시 나온다 — 같은 부의 장은 붙어 있어야 한다`);
                seen.add(pt);
            }
            prev = pt;
        });
        if (seq.length && seen.size < 2) warn.push(`부가 '${[...seen][0]}' 하나뿐이다 — 부는 둘 이상으로 나눌 때 쓴다`);
    }

    // 요약 장은 유형이 정한다 — 워크숍형의 마지막 장은 '디브리프'이지 '요약'이 아니다.
    if (ST.isFixed(SESSION_TYPE, '요약') && !S.some(s => s.head))
        warn.push(`세션 요약 슬라이드(head 지정) 없음`);
    // 명제 목록이 없으면 장수를 파생할 수 없다. 참고 범위는 설명형에만 의미가 있다
    // (워크숍형은 네댓 장이 정상이고, 종합형도 다르다).
    if (!CLAIMS && SESSION_TYPE === ST.DEFAULT && (S.length < 12 || S.length > 17))
        warn.push(`본문 ${S.length}장 — 커리큘럼에 명제 목록이 없어 장수를 파생하지 못한다(구 형식). 참고 범위 12~17장`);
    // 시각 없는 본문 장은 이제 골격 누락(오류)으로 잡는다 — skeleton.js가 정본이다.
    // 경고로 두던 때에는 03에서 세 장이 그 상태로 남았고, 경고는 읽히지 않았다.
    // 회피 감지: 타입은 늘었는데 여전히 표·박스로만 그리고 있으면 계약이 아니라 습관이 이긴 것이다.
    const nStmt = S.filter(isFree).length;
    if (nStmt > 3) warn.push(`statement(단문) ${nStmt}장 — 2~3장이 적정하다. 인용 하나에 단문 한 장씩 만들고 있는지 점검한다 (인용의 기본 자리는 논증 슬라이드의 quote 오버레이다)`);
    const nAll = S.filter(s => s.visual && !isFree(s)).length;
    const nTB = S.filter(s => s.visual && ['table', 'boxes'].includes(s.visual.type)).length;
    if (nAll && nTB / nAll > 0.6) warn.push(`시각화의 ${Math.round(nTB / nAll * 100)}%가 table/boxes다 (${nTB}/${nAll}) — 관계·수치 타입을 회피하고 있는지 점검한다`);

    // ⑥ 커리큘럼 명제 중 어느 장도 맡지 않은 것 — claim 완전 커버리지 계약.
    //   1:1 장수 등식을 없앤 대신(위 참조), "선언된 claim은 반드시 최소 1장에 덮인다"를
    //   오류로 잡는다 — claim 없는 장(§0 ARG else 분기, L235)의 경고와는 정반대 방향이다:
    //   그쪽은 "장에 claim이 없다", 여기는 "claim에 장이 없다".
    if (CLAIMS && CLAIMS.size) {
        const miss = [...CLAIMS.keys()].filter(k => !claimHit.has(k));
        miss.forEach(k => err.push(`커리큘럼 명제 '${k}'(${CLAIMS.get(k).kind})를 맡은 장이 없다: "${CLAIMS.get(k).text.slice(0, 30)}…"`));
    }

    return { err, warn, detail, S, NO, SESSION_TYPE, frontMatter, ASSETS, qPath, used, CLAIMS, claimHit, fillOf, gate };
}

module.exports = verifyDeck;

// ============================================================================
// CLI 래퍼 — node verify.js <deck> [--detail]
// ============================================================================
if (require.main === module) {
    const deckPath = process.argv[2] || './01.js';
    const DETAIL = process.argv.includes('--detail');
    const profileFlag = process.argv.find(a => a.startsWith('--profile='));
    const profile = profileFlag ? profileFlag.slice('--profile='.length) : undefined;
    const DECK = require('./load_deck.js')(deckPath);    // 순수 덱 + config 병합 + meta.quotes 절대경로화
    const { err, warn, detail, S, NO, SESSION_TYPE, frontMatter, ASSETS, qPath, used, CLAIMS, claimHit, fillOf, gate } = verifyDeck(DECK, { profile });

    // ── 리포트 ──
    console.log(`── VERIFY: ${path.basename(deckPath)} | 세션 ${NO} | ${SESSION_TYPE} | 본문 ${S.length}장 (총 ${frontMatter + S.length}p) ──`);
    if (ASSETS) console.log(`   인용 자산: ${path.basename(qPath)} (${ASSETS.size}개) | 이 덱에서 사용: ${used.size}개`);
    else if (used.size) console.log(`   인용 자산: 선언 없음 (meta.quotes)`);
    if (DETAIL) { console.log(`\n[상세]`); detail.forEach(d => console.log('  ' + d)); }
    if (err.length)  { console.log(`\n[오류 ${err.length}]`);  err.forEach(e => console.log('  ✗ ' + e)); }
    if (warn.length) { console.log(`\n[경고 ${warn.length}]`); warn.forEach(w => console.log('  · ' + w)); }
    if (!err.length && !warn.length) console.log('이상 없음');
    if (gate.umlSourceCount)
        console.log(`\n게이트(Tier 1/2): uml 소스=${gate.umlSourceCount} 렌더=${gate.umlRenderedCount} · 하단여백 최소=${gate.umlMarginMinPx}px(하한 ${UML_BOTTOM_MARGIN_MIN}px) · 밴드초과=${gate.bandOverflowCount} · 금지토큰=${gate.forbiddenTokenHits.length} · 프로파일위반=${gate.profileViolations.length}`);
    // ── 밀도 보고 ── 합격/불합격이 아니라 기록이다.
    //   verify가 보장하는 것은 바닥(구조·형식·인용 진위)이고 논증의 두께는 보장하지 않는다.
    //   그래서 최소한 '얼마나 실었는가'를 눈에 보이게 남긴다 — 재지 않으면 조용히 얇아진다.
    {
        // 밀도는 판정이 아니라 기록이다. 임계를 두지 않는다 —
        // 타입마다 정상값이 달라(flow 4노드 16자 vs bullets 5줄 200자) 절대 기준은 반드시 하나를 오측정한다.
        // 편차는 임계가 아니라 전 덱 비교로 드러낸다.
        const nVis = S.filter(sl => sl.visual && !isFree(sl)).length;
        const nFree = S.filter(sl => isFree(sl)).length;
        const nBare = S.filter(sl => !sl.visual).length;
        const kinds = {};
        S.forEach(sl => { if (sl.visual) kinds[sl.visual.type] = (kinds[sl.visual.type] || 0) + 1; });
        const chars = S.reduce((a, sl) => a + JSON.stringify(sl).length, 0);
        const notes = S.reduce((a, sl) => a + String(sl.notes || '').length, 0);
        const vChars = S.reduce((a, sl) => a + visualChars(sl.visual), 0);
        const fl = S.map(sl => fillOf.get(sl)).filter(x => typeof x === 'number');
        const fill = fl.length ? Math.round(fl.reduce((a, b) => a + b, 0) / fl.length * 100) : 0;
        console.log(`\n밀도: 시각 ${nVis}장 · 단문 ${nFree}장 · 시각 없음 ${nBare}장 | 시각 내용 ${vChars}자 · 밴드 점유 ${fill}% | 본문 ${chars}자 · 노트 ${notes}자`);
        console.log(`      시각 분포: ${Object.entries(kinds).map(([k, v]) => k + v).join(' ') || '없음'}`);
        if (CLAIMS) console.log(`      커리큘럼 명제: ${claimHit.size}/${CLAIMS.size} 반영`);
    }
    console.log(`\n요약: 오류 ${err.length} / 경고 ${warn.length}`);
    process.exit(err.length ? 1 : 0);
}
