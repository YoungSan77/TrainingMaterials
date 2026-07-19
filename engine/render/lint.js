'use strict';
// lint.js — 빌드 자가 점검(계약 위반 탐지). pptx도 밴드도 쓰지 않는다. DECK+skeleton+DRAFT만.
module.exports = (ctx) => {
  const { DECK, DRAFT, FREE, isFree, requiredFields } = ctx;
  const { hint } = require('../skeleton.js');
  const ST = require('../session_types.js');          // 세션 유형 요건 단일 소스(verify와 공유)

    const TYPES = ['boxes', 'table', 'steps', 'versus', 'takeaways', 'bullets', 'statement',
                   'flow', 'pipeline', 'loop', 'share', 'magnitude', 'pyramid', 'quadrant'];
    const NUMERIC = ['share', 'magnitude'];
    const lint = () => {
        const S = DECK.session.slides, fatal = [], warn = [];
        // 인용 4필드(id/ko/en/author) 중 하나라도 없으면 대조가 불가능하거나 undefined가 찍힌다 → 치명
        const qBad = (q) => !q || !q.id || !q.ko || !q.en || !q.author;
        const used = new Map();                       // 인용 id → 사용한 슬라이드 번호(세션 내 중복 금지)
        // 시각화 트리거 — 엔진이 아는 것은 '형태'뿐이다(언어·도메인 무관).
        //   어휘 트리거는 도메인 자산이므로 데이터(meta.visualTriggers)에서 주입받는다.
        const VTRIG = (DECK.meta && DECK.meta.visualTriggers) || {};
        const claim = (sl) => [sl.sub, sl.question, sl.lead && sl.lead.text, sl.foot && sl.foot.body].filter(Boolean).join(' ');
        const hasRatio = (t) => /\d+\s*:\s*\d+/.test(t) || (t.match(/\d+\s*%/g) || []).length >= 2;

        S.forEach((sl, i) => {
            const id = sl.head || `${sl.kind} — ${sl.title}`, tag = `슬라이드 ${i + 1} (${id})`;
            const free = isFree(sl);
            // 골격 필수 필드는 skeleton.js가 정한다(verify와 같은 소스) — statement는 빈 목록.
            requiredFields(sl).forEach(f => { if (!sl[f]) fatal.push(`${tag}: ${f} 누락${hint(f)}`); });
            if (free && !(sl.visual.text || (sl.visual.quote && sl.visual.quote.ko)))
                fatal.push(`${tag}: statement에 text도 quote도 없다 — 보여줄 문장이 없다`);
            // 강사 노트는 모든 본문 슬라이드에 쓴다. 슬라이드에 넣지 않은 것(질문·반론·시간 배분)이 여기 남는다.
            // 개수가 아니라 존재만 본다 — 길이 하한은 두지 않는다(그건 쿼터이고, 쿼터는 채우기를 부른다).
            if (!sl.notes) warn.push(`${tag}: notes(강사 노트)가 없다 — 던질 질문·흔한 반론·시간 배분을 남긴다`);
            const qs = [sl.quote, sl.visual && sl.visual.quote].filter(Boolean);
            qs.forEach((q, k) => {
                if (qBad(q)) fatal.push(`${tag}: 인용 ${k + 1}번에 id/ko/en/author 중 누락 — 인용은 자산 id와 함께 적는다`);
                if (q.id) {                            // 같은 세션 안에서의 중복은 금지(세션 간 재사용은 허용)
                    const prev = used.get(q.id);
                    if (prev === i + 1) fatal.push(`${tag}: 인용 '${q.id}'를 같은 슬라이드에서 두 번 쓴다 — 오버레이와 전용 슬라이드에 같은 인용을 넣지 않는다`);
                    else if (prev) fatal.push(`${tag}: 인용 '${q.id}'가 슬라이드 ${prev}에서 이미 쓰였다 — 같은 세션 내 중복 금지`);
                    else used.set(q.id, i + 1);
                }
            });
            const v = sl.visual;
            if (v) {
                if (!TYPES.includes(v.type)) fatal.push(`${tag}: 알 수 없는 visual.type '${v.type}'`);
                if (NUMERIC.includes(v.type) && !v.caption)
                    warn.push(`${tag}: ${v.type}에 caption이 없다 — 숫자를 명제로 올렸으면 출처·한계를 밝힌다`);
            }
            // 트리거: 명제 자리(sub/question/lead/foot)에 신호가 있는데 시각화가 그것을 그리지 않는다.
            // 오탐은 반드시 난다 → 오류가 아니라 경고이고, visualNote로 사유를 남기면 꺼진다.
            if (!sl.visualNote) {
                const t = claim(sl), ty = v && v.type;
                if (hasRatio(t) && !NUMERIC.includes(ty))
                    warn.push(`${tag}: 명제에 비율·배수가 있는데 시각화가 '${ty || '없음'}'이다 — share/magnitude를 검토한다 (근거 수치일 뿐이면 visualNote에 사유를 남긴다)`);
                Object.entries(VTRIG).forEach(([type, words]) => {
                    if ((words || []).some(w => t.includes(w)) && ty !== type)
                        warn.push(`${tag}: 명제가 '${type}' 신호를 담고 있는데 시각화가 '${ty || '없음'}'이다 — ${type}을 검토한다`);
                });
            }
        });
        // 세션 유형이 요건을 정한다. 미선언이면 설명형.
        const sType = DECK.session.type || ST.DEFAULT;
        const sSpec = ST.spec(sType);
        if (!sSpec) fatal.push(`알 수 없는 세션 유형 '${sType}' — ${ST.names().join(' | ')} 중 하나`);
        const OK = sSpec ? ST.kinds(sType) : [];
        if (sSpec) S.forEach((sl, i) => {
            if (!OK.includes(sl.kind)) fatal.push(`슬라이드 ${i + 1}: kind '${sl.kind}'는 ${sType}에 없다 — ${OK.join(' | ')}`);
        });
        if (sSpec) sSpec.fixed.forEach(k => {
            if (!S.some(sl => sl.kind === k)) fatal.push(`${sType}의 고정 장 '${k}'가 없다`);
        });
        // 분류별 최소 1장 — 단, '인용'은 뺀다. 인용은 자산이 있을 때만 성립하며 개수를 강제하지 않는다.
        // statement로는 분류 요건을 채울 수 없다. 명제만 던지고 논증이 없는 장으로 분류를 때우면 교재가 빈다.
        const arg = (sl) => !(sl.visual && FREE.includes(sl.visual.type));
        (sSpec ? sSpec.required : []).forEach(k => {
            if (!S.some(sl => sl.kind === k && arg(sl))) fatal.push(`분류 '${k}'의 논증 슬라이드가 없다 — statement(단문)는 분류 요건을 채우지 못한다`);
        });
        // 아래는 경고 — 산출물은 성립하지만 정본 규격에서 벗어난다.
        // 장수 범위 검사는 없다. 장수는 커리큘럼 명제 수에서 파생되고(verify가 대조),
        // 범위를 두면 하한이 목표가 된다 — 실제로 다섯 덱이 전부 하한 12장에 붙었다.
        const nStmt = S.filter(sl => sl.visual && FREE.includes(sl.visual.type)).length;
        if (nStmt > 3) warn.push(`statement(단문) ${nStmt}장 — 2~3장이 적정하다. 인용 하나에 단문 한 장씩 만들고 있는지 점검한다(인용의 기본 자리는 논증 슬라이드의 quote 오버레이다)`);
        const nVis = S.filter(sl => sl.visual && ['table', 'boxes'].includes(sl.visual.type)).length;
        const nAll = S.filter(sl => sl.visual && !FREE.includes(sl.visual.type)).length;
        if (nAll && nVis / nAll > 0.6) warn.push(`시각화의 ${Math.round(nVis / nAll * 100)}%가 table/boxes다 — 관계·수치 타입을 회피하고 있는지 점검한다`);

        if (warn.length) { console.log('[경고] 진행하되 확인이 필요하다:'); warn.forEach(w => console.log('   - ' + w)); }
        if (fatal.length) {
            console.log(DRAFT ? '[치명→강등] --draft 이므로 진행한다:' : '[치명] 계약 위반:');
            fatal.forEach(f => console.log('   - ' + f));
            if (!DRAFT) {
                console.error(`[중단] 치명 ${fatal.length}건 — pptx를 생성하지 않는다. 수정 후 다시 실행한다. (초안 확인만 필요하면 --draft)`);
                process.exit(1);
            }
        }
        if (!fatal.length && !warn.length) console.log('[점검] 필수 항목 이상 없음');
    };

  return { lint };
};
