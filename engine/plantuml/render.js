'use strict';
// ============================================================================
// render.js — PlantUML 소스 → PNG. 동기(synchronous)로 동작한다 — verify.js·layout.js·
//   render/visuals.js가 전부 동기 파이프라인이라, 여기만 비동기면 그 셋을 다 async로
//   바꿔야 한다. child_process의 동기 API(execFileSync)로 java를 그대로 부른다.
//
//   [환경 검증 결과 — 2026-08, 재사용 시 아래 두 가지를 반드시 지킨다]
//   1. Graphviz(dot)는 안 깐다(정책 — 네이티브 의존성 금지, JVM 전용만). 기본값은 dot을
//      찾다가 실패하면 예외 대신 "Cannot find Graphviz" 안내문을 담은 PNG를 조용히
//      만들어낸다 — 렌더는 "성공"하는데 그림이 에러 메시지인 함정. 해법은 확인됨:
//      소스 맨 앞에 '!pragma layout smetana'를 넣으면 순수 자바 레이아웃으로 그린다.
//      클래스·유스케이스·상태·패키지·협업(커뮤니케이션) 5종 재확인. 시퀀스는 애초에
//      dot이 필요 없어 pragma가 무해한 공회전이다 — 그래서 전 종류에 무조건 넣는다.
//   2. PNG 추출은 Java 9+ 모듈 시스템 때문에 --add-opens 플래그가 필요하다
//      (java.desktop의 PNG 메타데이터 writer에 리플렉션으로 접근하는 옛 코드 때문).
//      이 플래그 없이 부르면 IllegalAccessError로 죽는다.
//
//   [캐시] engine/.cache/plantuml/diagrams/<hash>.png — kind+source+엔진판(pragma 삽입
//   방식)을 해시해 키로 쓴다. verify.js·render/visuals.js가 같은 다이어그램에 대해
//   각자 부르지만(검증 따로, 렌더 따로) 두 번째 호출은 파일 존재만 확인하고 끝난다
//   (java 재기동 없음) — codepair가 문자열만으로 재는 것과 달리 이미지는 실제로 한 번
//   그려봐야 치수를 알므로, "그리는 것과 재는 것을 나눈다"(layout.js 원칙)를 지키려면
//   렌더 자체는 여기(순수 I/O 모듈)에서 하고 layout.js는 이미 알려진 치수만 받는다.
// ============================================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { JAR_PATH, VERSION } = require('./fetch.js');

const DIAG_CACHE = path.join(__dirname, '..', '.cache', 'plantuml', 'diagrams');
const DENSITY = 150;                                    // PNG 출력 DPI — px/DENSITY = inch 변환에 쓴다
const ADD_OPENS = '--add-opens=java.desktop/com.sun.imageio.plugins.png=ALL-UNNAMED';

// 지원 6종 — 협업(커뮤니케이션)은 PlantUML에 전용 다이어그램 타입이 없어(Larman의 UML1
// 유물에 가깝다) 객체+번호 붙인 메시지로 표현한다. 문서(authoring-convention 확장)에서
// 저자에게 안내한다. 전부 스메타나 pragma가 필요하거나(무해하게) 필요없는 부류다.
const KINDS = new Set(['class', 'usecase', 'sequence', 'collaboration', 'state', 'package']);

function ensureCacheDir() { fs.mkdirSync(DIAG_CACHE, { recursive: true }); }

// PNG IHDR 청크에서 width/height를 직접 읽는다(외부 이미지 라이브러리 불필요 — 헤더 8+4+4+4바이트
// 뒤 폭·높이가 각 4바이트 빅엔디안으로 고정 위치에 있다. PNG 스펙 불변, 파서라 부를 것도 없다).
function pngSize(buf) {
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { w: 0, h: 0 };   // 매직 바이트 불일치 = PNG 아님
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function hashOf(kind, source) {
    return crypto.createHash('sha1').update(`${VERSION}\n${kind}\n${source}`).digest('hex').slice(0, 16);
}

// PlantUML 완전 소스를 조립한다. smetana pragma는 전 종류에 무조건 넣는다(시퀀스에는
// 무해한 공회전 — 실측 확인됨). skinparam은 기존 슬라이드 팔레트(navy/teal)와 맞춘다.
function assemble(source) {
    return [
        '@startuml',
        '!pragma layout smetana',
        'skinparam backgroundColor white',
        'skinparam defaultFontName 맑은 고딕',
        'skinparam defaultFontSize 13',
        'skinparam classFontColor #1B3A6B',
        'skinparam ArrowColor #1B3A6B',
        'skinparam ClassBorderColor #1B3A6B',
        'skinparam ClassBackgroundColor #EBF1F8',
        'skinparam StateBorderColor #1B3A6B',
        'skinparam StateBackgroundColor #EBF1F8',
        'skinparam PackageBorderColor #1B3A6B',
        'skinparam UsecaseBorderColor #1B3A6B',
        'skinparam UsecaseBackgroundColor #EBF1F8',
        'skinparam SequenceLifeLineBorderColor #1B3A6B',
        'skinparam SequenceParticipantBorderColor #1B3A6B',
        'skinparam SequenceParticipantBackgroundColor #EBF1F8',
        String(source),
        '@enduml',
    ].join('\n');
}

// { kind, source } → { path, wIn, hIn }. 동기. 캐시 있으면 즉시 반환(java 재기동 없음).
function renderDiagram({ kind, source }) {
    if (!KINDS.has(kind)) throw new Error(`uml.kind가 지원 범위 밖이다: "${kind}" — 지원: ${[...KINDS].join('·')}`);
    if (!source || !String(source).trim()) throw new Error('uml.source가 비어 있다');

    ensureCacheDir();
    const hash = hashOf(kind, source);
    const pngPath = path.join(DIAG_CACHE, `${hash}.png`);

    if (fs.existsSync(pngPath)) {
        const { w, h } = pngSize(fs.readFileSync(pngPath));
        return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
    }

    if (!fs.existsSync(JAR_PATH)) {
        throw new Error(
            `PlantUML jar가 캐시에 없다 — 온라인 환경에서 한 번만 실행: node engine/plantuml/fetch.js\n` +
            `  (이후로는 완전 오프라인으로 렌더된다. 캐시 위치: ${JAR_PATH})`
        );
    }

    const pumlPath = path.join(DIAG_CACHE, `${hash}.puml`);
    fs.writeFileSync(pumlPath, assemble(source), 'utf8');

    try {
        execFileSync('java', [
            ADD_OPENS,
            `-DPLANTUML_LIMIT_SIZE=8192`,
            '-Djava.awt.headless=true',
            '-jar', JAR_PATH,
            '-tpng', `-density`, String(DENSITY),
            '-charset', 'UTF-8',
            pumlPath, '-o', DIAG_CACHE,
        ], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 });
    } catch (e) {
        const msg = (e.stderr || e.stdout || e.message || '').toString().slice(0, 2000);
        throw new Error(`PlantUML 렌더 실패(kind=${kind}) — ${msg}`);
    } finally {
        fs.rmSync(pumlPath, { force: true });
    }

    if (!fs.existsSync(pngPath)) throw new Error(`PlantUML이 PNG를 만들지 않았다(kind=${kind}) — 소스 문법을 확인한다`);
    const { w, h } = pngSize(fs.readFileSync(pngPath));
    if (!w || !h) throw new Error(`PlantUML 출력이 유효한 PNG가 아니다(kind=${kind}) — Graphviz 에러 이미지일 수 있다, smetana pragma 확인`);
    return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
}

module.exports = { renderDiagram, KINDS, DIAG_CACHE, DENSITY };
