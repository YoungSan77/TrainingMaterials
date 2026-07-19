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
const OUT_TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'corpus-'));   // 엔진 케이스의 산출 격리
const DIR    = path.join(__dirname, 'corpus');
const ASSET  = path.join(DIR, 'quotes.corpus.md');
const ASSET_ID = 'Q_ALPHA';

// 결함 → 기대 진단(부분 문자열). 문자열은 verify.js의 메시지에서 그대로 가져온다.
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
];

// 검사기를 돌려 표준출력을 통째로 돌려준다(오류 시 exit≠0로 throw → e.stdout에서 회수).
//   기본은 verify. runner:'engine'인 케이스는 엔진을 돌린다 — 렌더 앞단 게이트는 verify로 잴 수 없다.
//   (게이트가 검사 뒤에 있어 'verify 초록 + 렌더러 사망'이 났던 사고의 회귀 방어)
function runCheck(deckAbs, runner) {
    const bin = runner === 'engine' ? RENDER : VERIFY;
    const args = runner === 'engine' ? [bin, deckAbs, '--out', OUT_TMP] : [bin, deckAbs];
    try {
        return execFileSync('node', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
        return (e.stdout || '') + (e.stderr || '');
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
    console.log(`── CORPUS: ${CASES.length}개 결함 · 검증기 탐지 확인 ──\n`);
    for (const c of CASES) {
        const out = runCheck(path.join(DIR, c.file), c.runner);
        const hit = out.includes(c.expect);
        if (!hit) missed++;
        console.log(`[${hit ? '✓' : '✗'}] ${c.name.padEnd(20)} 기대 진단 ${hit ? '나옴' : '안 나옴'}: "${c.expect}"`);
        if (!hit) {
            const lines = out.split('\n').filter(l => /[✗·]/.test(l)).slice(0, 8);
            lines.forEach(l => console.log('        실제│ ' + l.trim()));
        }
    }
    console.log(`\n요약: 탐지 ${CASES.length - missed}/${CASES.length}`);
    if (missed) { console.error(`[실패] ${missed}개 결함을 검증기가 놓쳤다.`); process.exit(1); }
    fs.rmSync(OUT_TMP, { recursive: true, force: true });
    console.log('[통과] 모든 결함을 검증기가 잡았다.');
})();
