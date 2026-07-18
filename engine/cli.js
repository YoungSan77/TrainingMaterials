#!/usr/bin/env node
'use strict';
// ============================================================================
// cli.js — 저작 운영 단일 진입점 (얇은 디스패처).
//   기존 verify.js / master_render.js 를 자식 프로세스로 부를 뿐, 계약 로직을
//   복제하지 않는다 — 검증/렌더의 정본은 여전히 verify·엔진·골든 한 곳뿐이다.
//   (CLI가 검증을 베끼면 세 번째 정본이 생겨 드리프트한다 → 금지.)
//
//   node engine/cli.js new   courses/qm/decks/03.js         새 순수 데이터 덱 골격
//   node engine/cli.js check courses/qm/decks/03.js [--log] verify (--log면 ②지표 기록)
//   node engine/cli.js build courses/qm/decks/03.js [--draft] verify 게이트 → 렌더
//
//   설계 원칙:
//   - build 는 게이트다: verify가 치명(exit≠0)이면 pptx를 만들지 않는다. 엔진 내부
//     lint에는 없는 '인용 자산 대조'를 verify가 앞단에서 하므로, 렌더 전에 세운다.
//     --draft면 게이트를 건너뛰고 엔진 --draft로 렌더(치명→경고 강등, 파일명 _DRAFT).
//   - 지표는 ②(verify 오류·경고)만 자동이다. ①왕복·③계약결함·④사람분은 수기.
//     --log는 opt-in — 매 check가 아니라 '기록할 때만' 붙인다(재검증 오염 방지).
// ============================================================================
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ENGINE_DIR = __dirname;
const VERIFY = path.join(ENGINE_DIR, 'verify.js');
const RENDER = path.join(ENGINE_DIR, 'master_render.js');

const [, , cmd, ...rest] = process.argv;
const flags = rest.filter(a => a.startsWith('--'));
const args = rest.filter(a => !a.startsWith('--'));
const deck = args[0];

function usage(code = 1) {
    console.log(`사용법:
  node engine/cli.js new course <name>          새 과정 골격(global_config + 커리큘럼 스텁 + decks/)
  node engine/cli.js new deck   <deck.js>       새 순수 데이터 덱 골격(verify 통과)
  node engine/cli.js check <deck.js> [--log]    verify 실행 (--log: ②지표 1행 기록)
  node engine/cli.js build <deck.js> [--draft]  verify 게이트 통과 시 렌더

  npm run new|check|build -- ... 로도 부른다.`);
    process.exit(code);
}

// verify를 돌려 { code, out } 반환 (출력은 그대로 화면에도 보여준다)
function runVerify(deckPath) {
    try {
        const out = execFileSync('node', [VERIFY, deckPath], { encoding: 'utf8' });
        process.stdout.write(out);
        return { code: 0, out };
    } catch (e) {
        const out = (e.stdout || '') + (e.stderr || '');
        process.stdout.write(out);
        return { code: e.status || 1, out };
    }
}

// verify 요약 '오류 N / 경고 M' → {err, warn}. 못 읽으면 null.
function parseSummary(out) {
    const m = out.match(/오류\s*(\d+)\s*\/\s*경고\s*(\d+)/);
    return m ? { err: Number(m[1]), warn: Number(m[2]) } : null;
}

// courses/<과정>/metrics.tsv 에 ②는 채우고 ①③④는 빈칸으로 1행 append.
function logMetric(deckPath, sum) {
    const courseDir = path.resolve(deckPath, '..', '..');   // decks/NN.js → 과정 폴더
    const NN = path.basename(deckPath).replace(/\.js$/, '');
    const file = path.join(courseDir, 'metrics.tsv');
    const cols = ['date', 'session', 'round_trips', 'verify_err', 'verify_warn', 'contract_defects', 'human_min', 'note'];
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file,
            `# 생성 루프 지표. ②(verify_err/warn)만 자동. ①round_trips·③contract_defects·④human_min은 수기 편집.\n` +
            `# --log는 '기록할 때만' 붙인다(매 check가 아님). 대시보드 없음 — 이 파일이 원장이다.\n` +
            cols.join('\t') + '\n');
    }
    const date = new Date().toISOString().slice(0, 10);
    const row = [date, NN, '?', sum ? sum.err : '?', sum ? sum.warn : '?', '?', '?', ''];
    fs.appendFileSync(file, row.join('\t') + '\n');
    console.log(`\n[지표 기록] ${path.relative(process.cwd(), file)} ← ②오류 ${sum ? sum.err : '?'}·경고 ${sum ? sum.warn : '?'} (①③④는 수기 채움)`);
}

// 새 과정 골격 — courses/<name>/ 아래 global_config.js + 인용자산 스텁 + decks/.
// 도메인 무관 생성기의 '두 번째 과정'을 여는 최소 세트. 덱은 만들지 않는다
// (커리큘럼을 먼저 채운 뒤 new deck으로 첫 덱을 뽑는다).
function scaffoldCourse(name) {
    if (!name) { console.error('[중단] new course에는 과정 이름이 필요하다. 예: new course qm2'); process.exit(1); }
    const dir = path.resolve(process.cwd(), 'courses', name);
    if (fs.existsSync(dir)) { console.error(`[중단] 이미 있다: courses/${name} — 덮어쓰지 않는다.`); process.exit(1); }
    const curFile = `${name}_커리큘럼.md`;
    const config = `module.exports = {
  book: {
    title: '(과정 제목)',
    subtitle: '(부제)'
  },
  // 구조화된 커리큘럼(요일·세션 목록). 세션 수만큼 items를 채운다.
  curriculum: [
    { day: 'Day 1 — (주제)', items: ['(세션1 제목)', '(세션2 제목)'] }
  ],
  meta: {
    quotes: '${curFile}',   // 같은 폴더의 인용 자산(engine/quotes.js 형식). 없으면 빈 파일이어도 된다.
    // 본문 키워드 → 시각 타입 자동 감지(선택). 채우면 생성이 타입을 덜 틀린다.
    visualTriggers: {
      loop: [], pipeline: [], share: [], magnitude: [], pyramid: [], quadrant: []
    }
  }
};
`;
    const asset = `# ${name} 인용 자산 — engine/quotes.js 파서 형식.
# 형식: 헤더  - \`ID\` [GRADE] S##   /   필드(들여쓰기 + 대문자 키): EN / KO / AUTHOR / SRC
# 인용이 없으면 이 파일은 이 주석만 있어도 된다(파서가 빈 자산으로 읽는다).
#
# 예)
# - \`Q_EXAMPLE\` [PRIMARY] S01
#   EN: The example sentence.
#   KO: 예시 문장.
#   AUTHOR: Author Name
#   SRC: Source (Year)
`;
    fs.mkdirSync(path.join(dir, 'decks'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'global_config.js'), config);
    fs.writeFileSync(path.join(dir, curFile), asset);
    console.log(`[생성] courses/${name}/ (global_config.js · ${curFile} · decks/)
  → 다음: global_config.js의 book·curriculum을 채운 뒤  node engine/cli.js new deck courses/${name}/decks/01.js`);
}

// 순수 데이터 덱 골격 — 과거 실패의 원인(잘못된 래퍼·require·self-run·문자열 필드)을
// 애초에 못 만들도록 찍어낸다. verify가 요구하는 최소 유효 형태 = 학습목표 + 5개 분류
// (현상·원인·원칙·적용·타협, 도메인 무관 계약) 각 1장 + 요약. 생성 직후 check가 초록이다.
// 저작은 '이 구조 그대로, 내용만 커리큘럼 S## 노드로' 교체하면 된다.
function scaffoldDeck(deckPath) {
    if (fs.existsSync(deckPath)) { console.error(`[중단] 이미 있다: ${deckPath} — 덮어쓰지 않는다.`); process.exit(1); }
    const NN = path.basename(deckPath).replace(/\.js$/, '');
    const no = parseInt(NN, 10) || 1;
    // 필수 4필드(sub·question·lead·foot)를 갖춘 논증 슬라이드 한 틀. visual은 분류마다 바꿔
    // '시각 단조' 경고까지 피한다. 내용은 전부 placeholder — 커리큘럼 노드로 교체 대상.
    const arg = (kind, vis) => `  {
    kind: '${kind}',
    title: '(${kind} 제목)',
    sub: '(한 줄 요약)',
    question: '(이 장이 답하는 질문)',
    lead: { label: '${kind}', text: '(핵심 한 문장)' },
    visual: ${vis},
    foot: { kw: '${kind}', color: 'navy', body: '(이 장의 결론 한 문장)' },
    notes: '(강사 노트) 배분 N분.'
  }`;
    const boxes = `{ type: 'boxes', data: [
      { title: '(가)', body: ['(설명)'] }, { title: '(나)', body: ['(설명)'] }, { title: '(다)', body: ['(설명)'] }
    ]}`;
    const versus = `{ type: 'versus', data: [
      { title: '(대비)', body: ['(부정적 축)'], negative: true }, { title: '(지향)', body: ['(긍정적 축)'], negative: false }
    ]}`;
    const compromise = `{ type: 'boxes', data: [
      { title: '전제', body: ['(이 선택이 유효한 환경)'] },
      { title: 'Trade-off', body: ['(얻는 것)', '(잃는 것)'] },
      { title: '실패 조건', body: ['(도입하면 안 되는 상황)'] }
    ]}`;
    const tpl = `// ${NN}.js — 세션 ${no} 덱 데이터 (순수 session 데이터 — 경로·병합·실행 로직 없음)
// 계약: 교재_작성_지침.md v1.3 / 내용: 커리큘럼 S${NN} 노드로 교체
// book·curriculum·meta는 courses/<과정>/global_config.js가 소유한다 — 로더가 병합한다.
// 이 골격은 verify 통과(오류 0)한다. '구조 그대로, 내용만' 채운다.

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',                       // 띄어쓰기 유지(붙이면 verify 중단)
    title: '(학습 목표 제목)',
    sub: '(한 줄 요약)',
    question: '(이 세션이 답하는 질문)',
    lead: { label: '무엇을 얻는가', text: '(핵심 한 문장)' },
    visual: ${boxes},
    foot: { kw: '핵심', color: 'navy', body: '(결론 한 문장)' },
    notes: '(강사 노트) 배분 N분.'
  },

  // 02. 현상  (verify: 5개 분류 각 최소 1장 필요)
${arg('현상', versus)},

  // 03. 원인
${arg('원인', boxes)},

  // 04. 원칙
${arg('원칙', boxes)},

  // 05. 적용
${arg('적용', boxes)},

  // 06. 타협  (전제·Trade-off·실패조건 = 의사결정 골격)
${arg('타협', compromise)},

  // 07. 요약  (head 지정 = 요약 슬라이드)
  {
    kind: '요약',
    head: '요약과 다음 연결',
    title: '요약과 다음 연결',
    sub: '(한 줄 요약)',
    question: '(다음으로 잇는 질문)',
    lead: { label: '정리', text: '(핵심 한 문장)' },
    visual: { type: 'takeaways', data: [
      { title: '(핵심1)', body: '(한 줄)' }, { title: '(핵심2)', body: '(한 줄)' }, { title: '(핵심3)', body: '(한 줄)' }
    ]},
    foot: { kw: '다음', color: 'navy', body: '(다음 세션 예고)' },
    notes: '(강사 노트) 배분 N분.'
  }

];

module.exports = { session: {
  no: ${no},
  title: '(제목을 여기에)',   // 'Session'/'세션' 단어는 넣지 않는다(verify 중단)
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
`;
    fs.mkdirSync(path.dirname(deckPath), { recursive: true });
    fs.writeFileSync(deckPath, tpl);
    console.log(`[생성] ${deckPath}\n  → 골격은 verify 통과한다. 내용을 커리큘럼 S${NN} 노드로 교체 후  node engine/cli.js check ${deckPath}`);
}

// ── dispatch ─────────────────────────────────────────────────────────────────
if (!cmd || cmd === '-h' || cmd === '--help') usage(0);
if (cmd !== 'new' && !deck) { console.error(`[중단] 덱 경로가 필요하다.`); usage(1); }

if (cmd === 'new') {
    const sub = args[0], target = args[1];
    if (sub === 'course') scaffoldCourse(target);
    else if (sub === 'deck') scaffoldDeck(target);
    else { console.error(`[중단] new 다음에 course 또는 deck을 지정한다.`); usage(1); }
} else if (cmd === 'check') {
    const r = runVerify(deck);
    if (flags.includes('--log')) logMetric(deck, parseSummary(r.out));
    process.exit(r.code);
} else if (cmd === 'build') {
    const draft = flags.includes('--draft');
    if (!draft) {
        const r = runVerify(deck);
        if (r.code !== 0) {
            console.error(`\n[게이트 중단] verify 치명 — pptx를 만들지 않는다. 고치거나 초안이면 --draft.`);
            process.exit(r.code);
        }
    }
    // 렌더 (엔진이 산출 위치 결정: --out → meta.outDir → cwd). --draft 전달.
    const engineArgs = [RENDER, deck, ...(draft ? ['--draft'] : [])];
    try {
        execFileSync('node', engineArgs, { stdio: 'inherit' });
    } catch (e) { process.exit(e.status || 1); }
} else {
    console.error(`[중단] 알 수 없는 명령: ${cmd}`);
    usage(1);
}
