// ============================================================================
// load_deck.js — 덱 로더. 환경 위상(경로·config 병합)을 여기 한 곳에서 해결한다.
//   덱은 순수 session 데이터만 emit한다 → 덱이 경로를 emit하지 않으므로 생성기가
//   경로를 틀릴 자리가 없다(require 경로 실패는 전부 '덱이 위상을 emit'해서 났다).
//
//   두 모드:
//     · 순수 덱 = { session:{…} }                  → 상위에서 global_config.js를 찾아 병합한다.
//     · 자립 덱 = { curriculum, session, meta? }    → 그대로 쓴다(코퍼스 fixture·구식 덱).
//   meta.quotes는 '그것을 선언한 파일' 기준으로 절대경로로 고정해 주입한다.
//   그래서 엔진·verify는 경로 계산을 하지 않는다(이미 절대경로다).
//
//   레이아웃 규약: courses/<과정>/{ global_config.js, <커리큘럼>.md, decks/NN.js }.
//   순수 덱은 decks/ 바로 위(과정 폴더)에서 global_config.js를 찾는다.
// ============================================================================
const fs = require('fs');
const path = require('path');

// 덱 위치에서 위로 올라가며 global_config.js를 찾는다(과정 폴더에 있다).
const findConfig = (startDir) => {
    let dir = startDir;
    for (let i = 0; i < 8; i++) {
        const p = path.join(dir, 'global_config.js');
        if (fs.existsSync(p)) return p;
        const up = path.dirname(dir);
        if (up === dir) break;                     // 파일시스템 루트
        dir = up;
    }
    return null;
};

const loadDeck = (deckPath) => {
    const deckAbs = path.resolve(deckPath);
    const deckDir = path.dirname(deckAbs);
    const raw = require(deckAbs);
    if (!raw || !raw.session) throw new Error(`덱에 session이 없다: ${deckPath}`);

    let merged, declDir;
    if (raw.curriculum) {                          // 자립 덱: 그대로. meta는 덱이 선언 → 덱 기준.
        merged = raw;
        declDir = deckDir;
    } else {                                       // 순수 덱: config를 찾아 병합. meta는 config가 선언 → config 기준.
        const cfg = findConfig(deckDir);
        if (!cfg) throw new Error(
            `global_config.js를 찾지 못했다(덱 위 8단계까지): ${deckPath}\n` +
            `  순수 session 덱은 courses/<과정>/global_config.js 아래 decks/에 둔다.`);
        merged = { ...require(cfg), session: raw.session };
        declDir = path.dirname(cfg);
    }
    // 경로는 로더 한 곳에서 정한다. meta.quotes는 선언 파일 기준 절대경로로, 산출은 과정 폴더 out/으로.
    const meta = { ...(merged.meta || {}) };
    if (meta.quotes && !path.isAbsolute(meta.quotes)) meta.quotes = path.resolve(declDir, meta.quotes);
    if (!raw.curriculum) meta.outDir = path.join(declDir, 'out');   // 순수 덱만(declDir=과정 폴더). 자립 덱은 cwd.
    merged = { ...merged, meta };
    return merged;
};

module.exports = loadDeck;
