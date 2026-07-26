#!/usr/bin/env node
// ============================================================================
// corpus.js — 실패 코퍼스 러너
//   test/corpus/의 "깨진 덱" 하나하나에 대해 verify를 돌려, 그 결함을 겨냥한
//   기대 진단이 실제로 뜨는지 확인한다. 하나라도 놓치면(검증기가 못 잡으면) exit 1.
//
//   node test/corpus.js
//
//   각 덱은 결함 1종만 담는다. 러너는 verify의 '전체 출력'에서 기대 문자열을
//   찾는다 — 다른 부수 오류가 함께 떠도 무방하다(격리가 아니라 '탐지'를 본다).
//   엔진·검증기는 읽기만 한다.
//
//   [자산 의존 케이스] 환각/의역/caption 저자·출처 3종은 인용 자산과 대조해야
//   재현된다. 이 자산(quotes.corpus.md)은 저장소의 실제 quotes.js 파서 형식에
//   맞아야 하며, 아래 preflight가 파싱 여부를 먼저 검사해 어긋나면 고칠 지점을
//   알려준다(코드가 아니라 fixture 한 파일만 손보면 된다).
// ============================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT   = path.resolve(__dirname, '..');
const VERIFY = path.join(ROOT, 'engine', 'verify.js');
const RENDER = path.join(ROOT, 'engine', 'master_render.js');
const COURSE = path.join(ROOT, 'engine', 'course.js');
const OUT_TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-'));   // 엔진 케이스의 산출 격리
const DIR    = path.join(__dirname, 'corpus');
const ASSET  = path.join(DIR, 'quotes.corpus.md');
const ASSET_ID = 'Q_ALPHA';

// 케이스 → 기대 진단(부분 문자열). 대부분은 '결함을 잡는가'이고, 17번만 '정상 경로가 살아 있는가'다.
//  문자열은 verify.js의 메시지에서 그대로 가져온다.
const CASES = [
  { file: '1-deprecated-type.js',       name: '폐기 타입 사용',          expect: "알 수 없는 visual.type 'quotes'" },
  { file: '2-flow-overflow.js',         name: 'flow 밴드 초과',          expect: 'flow가 밴드를 넘는다' },
  { file: '3-statement-3lines.js',      name: 'statement 3줄 초과',      expect: 'statement 문장이' },
  { file: '4-share-sum.js',             name: 'share 합계 ≠ 100',        expect: 'share 합계가' },
  { file: '5-quadrant-3cells.js',       name: 'quadrant 4칸 미충족',      expect: "사분면 'BR'이 없다" },
  { file: '6-quote-hallucination.js',   name: '인용 id 환각',            expect: '자산에 없다',  asset: true },
  { file: '7-quote-paraphrase.js',      name: '인용 의역',               expect: '자산과 다르다', asset: true },
  { file: '8-curriculum-day-missing.js', name: 'curriculum.day 누락',     expect: '.day 없음' },
  { file: '9-caption-attribution.js',   name: 'caption에 저자·출처',      expect: 'caption에 저자·출처', asset: true },
  // 형태(shape) 계열 — 2026-07 크래시 2건의 회귀 방어.
  //   verify가 죽거나(스택), verify가 통과시킨 것을 렌더러가 거부하면 이 셋이 잡는다.
  { file: '10-shape-body-string.js',    name: '항목 body 문자열(보정)',   expect: 'body가 문자열이다' },
  { file: '11-shape-item-not-object.js', name: '항목이 객체가 아님',       expect: '객체가 아니다' },
  { file: '12-shape-render-gate.js',    name: '엔진 형태 게이트',         expect: '형태가 어긋났다', runner: 'engine' },
  // 골격 계열 — 본문 슬라이드의 가운데가 비는 퇴행(2026-07)의 회귀 방어.
  { file: '13-bare-body-slide.js',      name: '시각 없는 본문 장',        expect: '가운데가 빈 채로 렌더된다' },
  // 커리큘럼 연결 계열 — 덱이 커리큘럼 명제를 실제로 맡고 있는지.
  { file: '14-claim-unknown.js',        name: '명제 id 불일치',          expect: '명제 목록에 없다', asset: true },
  { file: '15-bullets-overflow.js',     name: 'bullets 상한 초과',       expect: '최대 6개' },
  { file: '16-session-type.js',         name: '유형에 없는 kind',        expect: '설명형에 없다' },
  // 정상 경로 케이스 — 결함이 아니라 '살아 있어야 하는 것'을 지킨다.
  //   계약이 선언한 시각 타입 중 어느 덱도 쓰지 않는 것이 있으면 그 렌더 경로는 아무도 검사하지 않는다.
  //   실제로 share·quadrant 렌더러에 미정의 식별자가 남아 있었고(모듈 분리 때 지역 변수가 사라진 자리),
  //   verify·골든·코퍼스 어디에도 걸리지 않다가 새 과정이 그 타입을 쓰자 렌더가 죽었다.
  { file: '17-all-visual-types.js',     name: '전 시각 타입 렌더',       expect: '[성공]', runner: 'engine' },
  // 골격 계열 — 명제가 길어 sub 박스를 넘고 아래 구분선을 침범하는 결함(2026-07).
  { file: '18-sub-overflow.js',         name: 'sub 오버플로',           expect: 'sub(명제)가' },
  // ── engine 직접 실행 경로 특성화 계열 ────────────────────────────────────
  //   원래 이 10건은 render/lint.js 자신의 fatal 문구를 고정하려고 만들었다(engine 직접 실행
  //   경로, node NN.js / node engine/master_render.js는 그때 verify.js를 거치지 않고 lint()만
  //   거쳤다). lint.js는 verify.js와 검사가 대부분 중복이라 verify.js로 통합하고 삭제했다 —
  //   지금은 이 경로도 verify.js의 verifyDeck()을 그대로 받는다. 그래서 문구는 verify.js
  //   기준으로 갱신했다(예: 필드별 개별 메시지처럼 verify 쪽이 더 정밀한 경우가 있었다).
  //   케이스 자체는 남겨 둔다 — "engine 직접 실행 경로가 이 결함들을 여전히 fatal로 잡는가"는
  //   lint.js가 사라진 지금도 유효한 회귀 방어다.
  { file: '19-lint-required-field.js',              name: '[lint] 필수 필드 누락',        expect: '필수 필드 누락: foot',           runner: 'engine', exitCode: 1 },
  { file: '20-lint-statement-empty.js',             name: '[lint] 빈 statement(전용)',    expect: 'statement에 text도 quote도 없다', runner: 'engine', exitCode: 1 },
  { file: '21-lint-quote-fields.js',                name: '[lint] 인용 필드 누락',        expect: '인용 1번 author 누락',          runner: 'engine', exitCode: 1 },
  { file: '22-lint-quote-dup-slide.js',             name: '[lint] 인용 슬라이드 내 중복', expect: '같은 슬라이드에서 두 번 쓴다',   runner: 'engine', exitCode: 1 },
  { file: '23-lint-quote-dup-session.js',           name: '[lint] 인용 세션 내 중복',     expect: '이미 쓰였다 — 같은 세션 내 중복 금지', runner: 'engine', exitCode: 1 },
  { file: '24-lint-unknown-type.js',                name: '[lint] 미등록 visual.type',    expect: "알 수 없는 visual.type 'ghosttype'", runner: 'engine', exitCode: 1 },
  { file: '25-lint-unknown-session-type.js',        name: '[lint] 미등록 세션 유형',      expect: "알 수 없는 세션 유형 '유령형'",  runner: 'engine', exitCode: 1 },
  { file: '26-lint-kind-not-allowed.js',            name: '[lint] 유형 밖 kind',          expect: "kind '유령분류'는",              runner: 'engine', exitCode: 1 },
  { file: '27-lint-fixed-missing.js',               name: '[lint] 고정 장 누락',          expect: "고정 장 '학습 목표'가 없다",     runner: 'engine', exitCode: 1 },
  { file: '28-lint-required-kind-statement-only.js', name: '[lint] 필수 분류 statement뿐', expect: "분류 '현상'의 논증 슬라이드 없음",  runner: 'engine', exitCode: 1 },
  // foot(+next) 오버플로 — 원래 gap:true(미검출을 기록하는 케이스)였다. verify.js에 foot(+next)
  // 길이 경고를 추가하면서(§2 PoC 구현 2단계) 해소돼 정상 탐지 케이스로 승격했다. gap:true 메커니즘
  // 자체(뒤집힌 판정)는 test/corpus.js의 main 루프에 남겨 둔다 — 다음에 같은 종류의 사각지대를
  // 발견하면 재사용한다.
  { file: '29-foot-overflow-gap.js', name: 'foot 오버플로(+next 합산)', expect: 'foot가 박스를 넘는다' },
  // ── 기능 1(선언 장) 특성화 — engine 무변경 상태에서 먼저 고정한다. ──
  //   kind '선언'이 아직 없으므로 ①②③⑤(a)는 전부 gap:true다(구현되면 뒤집혀 승격된다).
  //   ②는 사실 항상 참인 회귀 가드지만 '문자열 부재' 판정에 gap 메커니즘을 그대로 쓴다.
  //   ⑤(b)는 gap이 아니다 — 지금도 구현 후에도 계속 참이어야 하는 대조 가드다.
  { file: '30-declare-clean.js',              name: '[선언①] 정상 덱 exit 0',        expect: '오류 0' },
  { file: '31-declare-skeleton-exempt.js',    name: '[선언②] 골격 면제 회귀 가드',     expect: '필수 필드 누락', gap: true },
  { file: '32-declare-duplicate.js',          name: '[선언③] 세션 내 선언 2장',       expect: '세션당 최대 1개' },
  { file: '33-course-declare-dup',            name: '[선언④] 과정 전체 선언 2개',     expect: '과정당 최대 1개', runner: 'course' },
  { file: '34-declare-long-text-exempt.js',   name: '[선언⑤a] 선언문 길이 면제',      expect: '오류 0', gap: true },
  { file: '35-declare-long-text-contrast.js', name: '[선언⑤b] 일반 statement 대조',   expect: 'statement 문장이' },
];

// 검사기를 돌려 { out, code }를 돌려준다(오류 시 exit≠0로 throw → e.stdout/e.status에서 회수).
//   기본은 verify. runner:'engine'인 케이스는 엔진을 돌린다 — 렌더 앞단 게이트는 verify로 잴 수 없다.
//   (게이트가 검사 뒤에 있어 'verify 초록 + 렌더러 사망'이 났던 사고의 회귀 방어)
function runCheck(deckAbs, runner) {
    const bin = runner === 'engine' ? RENDER : runner === 'course' ? COURSE : VERIFY;
    const args = runner === 'engine' ? [bin, deckAbs, '--out', OUT_TMP] : [bin, deckAbs];
    try {
        const out = execFileSync('node', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { out, code: 0 };
    } catch (e) {
        return { out: (e.stdout || '') + (e.stderr || ''), code: e.status };
    }
}

// 자산 의존 케이스가 있으면, 실제 quotes.js로 fixture가 파싱되는지 먼저 확인한다.
function preflightAsset() {
    if (!CASES.some(c => c.asset)) return;
    let QA;
    try { QA = require(path.join(ROOT, 'engine', 'quotes.js')); }
    catch (e) { fail(`engine/quotes.js를 불러오지 못했다: ${e.message}`); }
    let r;
    try { r = QA.parse(ASSET); } catch (e) { fail(`quotes.js가 fixture 파싱 중 예외: ${e.message}`); }
    if (!r || !r.assets || !r.assets.has(ASSET_ID)) {
        fail(
`인용 fixture가 실제 quotes.js 형식과 어긋난다: ${path.relative(ROOT, ASSET)}
  → 자산 파서가 id '${ASSET_ID}'를 읽지 못했다. 환각/의역/caption 케이스는 자산 대조에
    의존하므로, 이 fixture를 저장소의 실제 인용 자산 형식에 맞춰 다시 쓰면 된다(코드 수정 아님).
    최소한 id '${ASSET_ID}'와 그 ko/en/author가 파서에 인식되어야 한다.`);
    }
}

function fail(msg) { console.error('[중단] ' + msg); process.exit(1); }

(function main() {
    for (const c of CASES) {
        if (!fs.existsSync(path.join(DIR, c.file))) fail(`코퍼스 덱이 없다: ${c.file}`);
    }
    preflightAsset();

    let missed = 0;
    console.log(`── CORPUS: ${CASES.length}개 케이스 · 검증기 탐지 확인 ──\n`);
    for (const c of CASES) {
        const { out, code } = runCheck(path.join(DIR, c.file), c.runner);
        const found = out.includes(c.expect);
        // gap:true는 판정이 뒤집힌다 — '아직 안 잡힌다'가 통과다. 문자열이 나타나면
        // gap이 해소된 것이므로 실패로 띄워 갱신(승격)을 유도한다.
        const hit = c.gap ? !found : found;
        // exitCode를 지정한 케이스만 코드까지 본다(기존 케이스는 그대로 문구만 검사 — 하위 호환).
        const codeOk = c.exitCode === undefined || code === c.exitCode;
        const ok = hit && codeOk;
        if (!ok) missed++;
        const why = c.gap
            ? (found ? '⚠ gap이 해소된 것으로 보인다 — 케이스를 갱신(승격)한다' : !codeOk ? `exit 코드 ${code} ≠ ${c.exitCode}` : '알려진 gap 그대로(미검출)')
            : (!hit ? '기대 진단 안 나옴' : !codeOk ? `exit 코드 ${code} ≠ ${c.exitCode}` : '기대 진단 나옴');
        console.log(`[${ok ? '✓' : '✗'}] ${c.name.padEnd(24)} ${why}: "${c.expect}"`);
        if (!ok) {
            const lines = out.split('\n').filter(l => /[✗·]/.test(l)).slice(0, 8);
            lines.forEach(l => console.log('        실제│ ' + l.trim()));
        }
    }
    console.log(`\n요약: 탐지 ${CASES.length - missed}/${CASES.length}`);
    if (missed) { console.error(`[실패] ${missed}개 결함을 검증기가 놓쳤다.`); process.exit(1); }
    fs.rmSync(OUT_TMP, { recursive: true, force: true });
    console.log('[통과] 모든 케이스가 기대대로 나왔다.');
})();
