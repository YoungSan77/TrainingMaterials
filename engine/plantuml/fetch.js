'use strict';
// ============================================================================
// fetch.js — PlantUML jar를 오프라인 캐시에 한 번 받아 둔다.
//
//   패턴은 portfolio/lab-environment.md의 "온라인 1회 캐시 굽기 → 이후 오프라인"과 같다.
//   jar는 저장소에 커밋하지 않는다(guides/교재_작성_지침.md §14 "산출물은 저장소에 커밋하지
//   않는다"와 같은 정신: 이 jar도 소스가 아니라 재취득 가능한 빌드 의존성이다).
//   engine/.cache/(.gitignore)에 받아 두고, 있으면 재다운로드하지 않는다.
//
//   좌표 함정(중요): net.sourceforge.plantuml:plantuml(이름만 보고 받기 쉬운 좌표)은
//   Maven Central에서 2017년 빌드(8059)에 멈춰 있다 — Smetana(Graphviz 없이 그리는 순수
//   자바 레이아웃 엔진) 이전 버전이라 못 쓴다. 실제 유지되는 좌표는 plantuml-mit(MIT
//   재라이선스 이후 메인라인)이다. plantuml-mit-light는 같은 렌더 결과(클래스·유스케이스·
//   시퀀스·상태·패키지·액티비티 6종 다 확인)를 절반 이하 용량(~7.7MB)으로 내어 이걸 쓴다.
//
//   버전 함정(중요, 2026-08 확인): plantuml-mit-light 1.2026.6은 클래스 박스의 빈 연산
//   칸(맨 아래 칸)을 짧게 렌더해 하단 테두리를 잘라낸다 — scale·밀도·폰트와 무관, 그 버전
//   자체의 렌더 결함이다(같은 소스를 1.2026.0으로 그리면 테두리가 온전하고 여백 23px가
//   남는다, 픽셀로 확인함). 그래서 1.2026.x 라인의 최초 빌드인 1.2026.0으로 고정한다 —
//   더 올릴 때는 반드시 클래스 박스(빈 연산 칸 포함) 하단 테두리를 픽셀로 재확인한다.
// ============================================================================
const fs = require('fs');
const path = require('path');
const https = require('https');

const VERSION = '1.2026.0';
const ARTIFACT = 'plantuml-mit-light';
const URL = `https://repo1.maven.org/maven2/net/sourceforge/plantuml/${ARTIFACT}/${VERSION}/${ARTIFACT}-${VERSION}.jar`;

const CACHE_DIR = path.join(__dirname, '..', '.cache', 'plantuml');
const JAR_PATH = path.join(CACHE_DIR, `${ARTIFACT}-${VERSION}.jar`);

// 지정 URL을 파일로 받는다. 리다이렉트를 따라간다(Maven Central은 CDN이라 흔하다).
function download(url, destPath, redirectsLeft = 5) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
                res.resume();
                return resolve(download(res.headers.location, destPath, redirectsLeft - 1));
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`다운로드 실패: HTTP ${res.statusCode} — ${url}`));
            }
            const tmp = destPath + '.part';
            const out = fs.createWriteStream(tmp);
            res.pipe(out);
            out.on('finish', () => out.close(() => { fs.renameSync(tmp, destPath); resolve(destPath); }));
            out.on('error', reject);
        });
        req.on('error', reject);
        req.setTimeout(60000, () => req.destroy(new Error('다운로드 타임아웃(60s)')));
    });
}

// jar가 캐시에 있으면 그 경로를 즉시 반환(오프라인 경로 — 네트워크 호출 없음).
// 없으면 온라인에서 한 번 받는다. 오프라인인데 캐시도 없으면 명확한 에러로 멈춘다.
async function ensureJar() {
    if (fs.existsSync(JAR_PATH)) return JAR_PATH;
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`[plantuml] 캐시에 jar 없음 — 온라인에서 1회 받는다: ${ARTIFACT} ${VERSION}`);
    try {
        await download(URL, JAR_PATH);
    } catch (e) {
        throw new Error(
            `PlantUML jar를 받지 못했다(오프라인이거나 네트워크 문제) — ${e.message}\n` +
            `  해결: 온라인 환경에서 한 번 'node engine/plantuml/fetch.js'를 실행해 캐시를 굽는다.\n` +
            `  캐시 위치: ${JAR_PATH}`
        );
    }
    console.log(`[plantuml] 캐시 완료: ${JAR_PATH}`);
    return JAR_PATH;
}

module.exports = { ensureJar, JAR_PATH, CACHE_DIR, VERSION, ARTIFACT };

if (require.main === module) {
    ensureJar().then((p) => console.log(`[완료] ${p}`)).catch((e) => { console.error(`[중단] ${e.message}`); process.exit(1); });
}
