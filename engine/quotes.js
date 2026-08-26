// ============================================================================
// quotes.js — 인용 자산(커리큘럼 부록 A) 파서. 단일 소스.
//   master_render.js : 강사 노트에 출처·URL을 자동 첨부한다(생성기가 URL을 쓰지 않는다 → 지어낼 수 없다).
//   verify.js        : 덱의 인용을 자산 원문과 대조한다(환각·의역 차단).
//   폭 모델을 measure.js 하나로 모은 것과 같은 이유다. 파서가 두 벌이면 언젠가 어긋난다.
//
//   [자산 형식 = 계약]  이 형식을 바꾸면 대조가 깨진다.
//     - `Q-DEMING-BADSYS` [PRIMARY] S01, S02, S13
//       EN: A bad system will beat a good person every time.
//       KO: 나쁜 시스템은 언제나 좋은 사람을 이긴다.
//       AUTHOR: W. Edwards Deming
//       SRC: Out of the Crisis
//       URL: https://...            ← 검증에 실제로 쓴 출처. 없으면 생략한다(지어내지 않는다).
//   등급: PRIMARY(원전 확인) | WIDELY-CITED(원전 미확인·널리 통용 → 슬라이드에 한계 표기)
// ============================================================================
const fs = require('fs');

const GRADES = ['PRIMARY', 'WIDELY-CITED'];
// 문구 대조용 정규화 — 따옴표 종류와 공백만 흡수한다. 단어는 건드리지 않는다(의역을 통과시키면 안 된다).
const norm = (s) => String(s == null ? '' : s)
    .replace(/[\u201C\u201D\u2018\u2019"']/g, '').replace(/\s+/g, ' ').trim();

const parse = (mdPath) => {
    const lines = fs.readFileSync(mdPath, 'utf8').split(/\r?\n/);
    const assets = new Map(), bad = [];
    let cur = null;
    lines.forEach((ln, i) => {
        const h = ln.match(/^\s*[-*]\s*`([^`]+)`\s*\[([A-Z-]+)\]\s*(.*)$/);
        if (h) {
            cur = { id: h[1].trim(), grade: h[2].trim(), sessions: (h[3].match(/\d+/g) || []).map(Number), line: i + 1 };
            if (!GRADES.includes(cur.grade)) bad.push(`자산 ${cur.id}: 알 수 없는 등급 '${cur.grade}' (${GRADES.join(' | ')})`);
            assets.set(cur.id, cur);
            return;
        }
        if (!cur) return;
        const f = ln.match(/^\s+(EN|KO|AUTHOR|SRC|URL):\s*(.+)$/);
        if (f) cur[f[1].toLowerCase()] = f[2].trim();
        else if (/^\s*$/.test(ln)) cur = null;               // 빈 줄 = 항목 끝
    });
    assets.forEach(q => { if (!q.ko || !q.en || !q.author) bad.push(`자산 ${q.id}: KO/EN/AUTHOR 중 누락 (${q.line}행)`); });
    return { assets, bad };
};

// 세션 노드의 '명제' 목록 파서. 커리큘럼이 '무엇을 주장할지'를 정하고 덱이 그것을 참조한다.
//   형식(계약):  - `C1` [현상] 명제 한 줄
//   덱은 슬라이드마다 claim: 'C1' 또는 claim: ['C1','C2']로 가리키고,
//   verify가 id 존재·분류 일치·커버리지를 대조한다.
//   이 절이 없는 세션(구 형식)은 null을 돌려준다 — 검사를 건너뛴다.
const parseClaims = (mdPath, no) => {
    const src = fs.readFileSync(mdPath, 'utf8');
    const tag = 'S' + String(no).padStart(2, '0');
    // m 플래그를 쓰지 않는다 — m에서 $는 '줄 끝'이라 섹션이 첫 줄에서 잘린다.
    const sec = src.match(new RegExp(`\\n###\\s*${tag}\\.[\\s\\S]*?(?=\\n#{2,3}\\s|$)`));
    if (!sec) return null;
    const body = sec[0];
    if (!/\*\*명제:?\*\*/.test(body)) return null;
    const claims = new Map();
    const re = /^\s*-\s*`([A-Za-z][A-Za-z0-9_-]*)`\s*\[([^\]]+)\]\s*(.+)$/gm;
    let m;
    while ((m = re.exec(body))) claims.set(m[1].trim(), { kind: m[2].trim(), text: m[3].trim() });
    return claims;
};

// 세션 노드의 메타(분량·유형). 커리큘럼이 '이 세션이 얼마나 무거운가'를 정하고
//   덱과 과정 검사기가 그것을 대조한다. 없으면 null 필드로 돌려준다(구 형식 호환).
//   형식:  - **분량:** 50분   /   - **유형:** 설명형
//          - **필수 선언:** `proposition.governing`
const parseSessionMeta = (mdPath, no) => {
    const src = fs.readFileSync(mdPath, 'utf8');
    const tag = 'S' + String(no).padStart(2, '0');
    const sec = src.match(new RegExp(`\\n###\\s*${tag}\\.[\\s\\S]*?(?=\\n#{2,3}\\s|$)`));
    if (!sec) return null;
    const body = sec[0];
    const mMin = body.match(/\*\*분량:?\*\*\s*(\d+)\s*분/);
    const mType = body.match(/\*\*유형:?\*\*\s*([^\n]+)/);
    const mDecl = body.match(/\*\*필수 선언:?\*\*\s*`([^`]+)`/);
    const mTitle = body.match(/^\s*###\s*S\d+\.\s*(.+)$/m);
    return { minutes: mMin ? Number(mMin[1]) : null,
             type: mType ? mType[1].trim() : null,
             requiredDeclaration: mDecl ? mDecl[1].trim() : null,
             title: mTitle ? mTitle[1].trim() : null };
};

// 강사 노트 꼬리 — 엔진이 인용 슬라이드에 자동으로 붙인다.
const noteTail = (a) => {
    if (!a) return '';
    const L = [`출처: ${a.src || '(미기재)'} [${a.grade}]`];
    if (a.grade === 'WIDELY-CITED') L.push(`주의: 원전 문구가 확인되지 않은 인용이다. 단정하지 말고 한계를 함께 말한다.`);
    if (a.en) L.push(`원문: ${a.en}`);
    if (a.url) L.push(`URL: ${a.url}`);
    return L.join('\n');
};

module.exports = { parse, parseClaims, parseSessionMeta, norm, noteTail, GRADES };
