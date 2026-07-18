// ============================================================================
// layout.js — 시각화 기하(치수 측정)의 단일 소스. 엔진·verify 공유.
//
//   measure.js = 문자폭 / skeleton.js = 골격 / shape.js = 데이터 형태 에 이은 네 번째.
//   여기 오기 전까지 기하는 두 벌이었다: 엔진이 그릴 때 한 번 재고, verify가 검사할 때
//   같은 식을 다시 구현했다. verify 주석이 세 곳에서 그것을 자백한다 —
//   "엔진과 동일한 기하 계산" / "엔진 renderChain과 같은 식" / "엔진과 동일 식".
//   두 벌이면 언젠가 어긋난다. 폭에서 한 번 겪었고(→ measure.js), 형태에서 또 겪었다(→ shape.js).
//
//   [설계 원칙 1] 재는 것과 그리는 것을 나눈다.
//   이 파일은 '얼마나 필요한가'만 답한다. 좌표를 찍고 색을 칠하는 것은 renderer의 일이고,
//   '넘쳤는가'를 판정하는 것은 verify의 일이다. 같은 수를 두 곳이 받아 각자의 일을 한다.
//
//   [설계 원칙 2] 상수는 여기에만 둔다.
//   열 간격·제목 높이·불릿 들여쓰기는 그리기의 세부가 아니라 기하의 입력이다.
//   renderer가 자기 파일에서 다시 정의하면 그 순간 단일 소스가 깨진다.
//
//   [설계 원칙 3] 환경은 주입받는다(도메인·전역 상태를 모른다).
//   makeLayout({CW, PAD, SP, F_IN, lines, textH, SLACK}) — 엔진은 ctx를, verify는 자기
//   측정 함수를 넘긴다. 두 쪽이 같은 measure.js에서 온 함수를 넘기므로 결과가 같다.
// ============================================================================

module.exports = function makeLayout(env) {
    const { lines, textH, SLACK } = env;
    const CW = env.CW;

    // ── 항목 계열(boxes·steps·versus) 기하 상수 ──
    //   gap  : 열 사이 간격. steps만 열 수에 따라 좁아진다(5열부터 0.10).
    //   head : 제목 띠 높이. versus만 0.44(색 띠가 굵다).
    //   bullet: 본문 불릿 들여쓰기(pt) — 폭 계산에 들어간다.
    const ITEM = {
        boxes:  { gap: () => 0.20, head: 0.42, bullet: 10 },
        steps:  { gap: (n) => (n > 4 ? 0.10 : 0.16), head: 0.42, bullet: 10 },
        versus: { gap: () => 0.30, head: 0.44, bullet: 12 },
    };
    const isItem = (type) => Object.prototype.hasOwnProperty.call(ITEM, type);
    const colWidth = (type, n) => (CW - ITEM[type].gap(n) * (n - 1)) / n;

    // 항목 계열 한 덩어리를 잰다.
    //   VH  : 시각화 밴드 높이
    //   반환 { n, gap, w, head, bullet, need, h, alloc, per:[{ln, real}] }
    //     need  : 밴드 제약이 없을 때 필요한 높이(= 제목 + 가장 큰 본문 + 여유)
    //     h     : 실제 박스 높이(밴드에 맞춰 자른다)
    //     alloc : 본문에 배정되는 높이(h - head). per[i].real이 이것을 넘으면 글자가 넘친다.
    const item = (type, items, VH) => {
        const n = items.length;
        const gap = ITEM[type].gap(n), head = ITEM[type].head, bullet = ITEM[type].bullet;
        const w = colWidth(type, n);
        const per = items.map((it) => {
            const body = it.body || [];
            const ln = body.reduce((a, t) => a + lines(t, w, bullet), 0);
            return { ln, real: textH(ln, body.length) };
        });
        const need = head + Math.max(...per.map((p) => p.real)) + SLACK;
        const h = Math.min(VH, need);
        return { n, gap, w, head, bullet, need, h, alloc: h - head, per };
    };

    // ── takeaways(요약 번호 리스트) ──
    //   본문은 좌측 번호·제목 칸(2.85in)을 뺀 폭을 쓰고, 불릿이 없다.
    //   행 높이는 밴드를 n등분한 것과 '실제 필요'를 비교해 작은 쪽을 쓴다(하한 0.52).
    const TAKE = { titleW: 2.85, min: 0.52 };
    const takeaways = (items, VH) => {
        const n = items.length, gap = n >= 5 ? 0.08 : 0.12;
        const bw = CW - 3.2;                                   // 본문 폭(번호 칸 + 여백을 뺀 값)
        const per = items.map((it) => {
            const body = it.body || [];
            const ln = body.reduce((a, t) => a + lines(t, bw, false), 0);
            return { ln, real: textH(ln, body.length) };
        });
        const hRaw = Math.max(...per.map((p) => p.real)) + SLACK;
        const h = Math.min((VH - gap * (n - 1)) / n, Math.max(TAKE.min, hRaw));
        return { n, gap, bw, titleW: TAKE.titleW, hRaw, h, blockH: h * n + gap * (n - 1), per };
    };

    return { ITEM, isItem, colWidth, item, takeaways };
};