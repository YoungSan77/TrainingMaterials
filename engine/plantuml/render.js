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
//   3. 기본 출력은 원본 픽셀이 아주 작다(예: 클래스 박스 하나 ~99x75px) — -density 플래그는
//      이 작은 원본 해상도에 영향을 주지 않는다(실측 확인, 150이든 600이든 같은 픽셀 수가
//      나온다). 슬라이드에 배치할 때는 이 작은 원본을 몇 배 더 크게 늘려 그리는데, 그러면
//      가장 얇은 선(클래스 박스 맨 아래 테두리 등)이 확대 보간에 씻겨 나가 "테두리가
//      잘렸다"처럼 보인다(2026-08, 실사용 보고로 발견 — 원본 PNG 자체엔 테두리가 있다,
//      scale 4로 렌더해 확인함). 해법은 소스에 `scale ${SCALE}`을 넣어 원본 픽셀 수 자체를
//      키우는 것 — 물리적 인치는 그대로고(SCALE로 나눠 되돌린다) 픽셀만 조밀해진다.
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
const DENSITY = 150;                                    // 원본(scale 1) 기준 px/inch 환산 상수
const SCALE = 4;                                        // 소스에 주입하는 'scale N' — 원본 픽셀을 N배 조밀하게(테두리 씻김 방지). 인치 환산은 DENSITY*SCALE로 나눠 되돌린다.
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

// SCALE을 해시에 넣는다 — 렌더 설정(scale·skinparam 등 assemble()의 조립 방식)이 바뀌면
// 캐시가 조용히 옛 픽셀을 돌려주지 않고 새로 그리게 한다.
function hashOf(kind, source) {
    return crypto.createHash('sha1').update(`${VERSION}\nscale${SCALE}\n${kind}\n${source}`).digest('hex').slice(0, 16);
}

// PlantUML 완전 소스를 조립한다. smetana pragma는 전 종류에 무조건 넣는다(시퀀스에는
// 무해한 공회전 — 실측 확인됨). scale은 원본 픽셀 밀도만 올린다(물리 크기는 그대로 —
// renderDiagram이 DENSITY*SCALE로 나눠 인치를 되돌린다). skinparam은 기존 슬라이드
// 팔레트(navy/teal)와 맞춘다.
function assemble(source) {
    return [
        '@startuml',
        '!pragma layout smetana',
        `scale ${SCALE}`,
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
        return { path: pngPath, wIn: w / (DENSITY * SCALE), hIn: h / (DENSITY * SCALE) };
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
        ], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 });
    } catch (e) {
        // stdout/stderr가 둘 다 빈 경우(예: 느린 콜드스타트 환경에서 timeout에 걸려 SIGTERM으로
        // 죽으면 아직 아무 출력도 못 낸 채 죽는다)가 있다 — 그러면 메시지가 텅 빈 채로 보였다.
        // exit code·signal·timeout 여부를 항상 덧붙여 "에러가 비어 있다"를 막는다.
        const out = (e.stderr || e.stdout || '').toString().trim().slice(0, 2000);
        const cause = e.signal ? `신호 ${e.signal}로 죽었다(60초 timeout일 수 있다)`
                    : e.code !== undefined ? `종료 코드 ${e.code}` : String(e.message || e);
        throw new Error(`PlantUML 렌더 실패(kind=${kind}) — ${cause}${out ? `: ${out}` : ' (출력 없음)'}`);
    } finally {
        fs.rmSync(pumlPath, { force: true });
    }

    if (!fs.existsSync(pngPath)) throw new Error(`PlantUML이 PNG를 만들지 않았다(kind=${kind}) — 소스 문법을 확인한다`);
    const { w, h } = pngSize(fs.readFileSync(pngPath));
    if (!w || !h) throw new Error(`PlantUML 출력이 유효한 PNG가 아니다(kind=${kind}) — Graphviz 에러 이미지일 수 있다, smetana pragma 확인`);
    return { path: pngPath, wIn: w / (DENSITY * SCALE), hIn: h / (DENSITY * SCALE) };
}

module.exports = { renderDiagram, KINDS, DIAG_CACHE, DENSITY };
