'use strict';
// 자동 생성(build_split.js). 원본 master_render.js에서 본문을 그대로 옮겼다.
// 손으로 고치지 말 것 — 규칙은 원본과 골든이 정본이다.
module.exports = (ctx) => {
  const {
    pres, DECK, ASSETS, noteTail, band, DRAFT, C, FF,
    LM, CW, Y_START, Y_LINE, Y_BOT, CTX_TOP, VB, F_BODY,
    F_IN, F_HEAD, F_QKO, F_QEN, PAD, MG, SP, LH,
    SLACK, F_CAP, F_ELAB, F_STMT, F_SRC, F_NUM, CAP_LH, CAP_MAX,
    LOOP_IN, PAL, NN, RN, SF, AT, IN, textW,
    avail, lineCount, FREE, isFree, requiredFields, lines, lineH, textH,
    hdrFS, quoteH, capLines, capH, onDark, nodesOf, edgesOf, autoTable,
    renderAutoBoxes, renderChain, renderLoop, renderShare, renderMagnitude, renderPyramid, renderQuadrant, renderSteps,
    renderVersus, renderStatement, renderTakeaways, addCover, stripNo, stripDay, listBlock, addFullToc,
    addSessionToc, addFrontMatter, buildIntro, toTable, addContext, renderBody, addNotes,
  } = ctx;

    const hdr = (s, t) => { s.addText(t, { x: LM, y: 0.20, w: CW, h: 0.50, fontSize: hdrFS(t), fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'middle', margin: 0 }); s.addShape(pres.shapes.LINE, { x: LM, y: 0.80, w: CW, h: 0, line: { color: C.navy, width: 1.5 } }); };

    // sub — 명제의 주장 한 문장. 분류가 있으면 '[원인] ' 형태로 앞에 붙인다(흐린 색·보통 굵기로 명제와 구분).
    //   문단 속성은 어느 런에도 주지 않는다 — 한 문단에 <a:pPr>이 둘이면 뷰어가 문단 분리로 읽는다.
    const SUB_KINDS = ['현상', '원인', '원칙', '적용', '타협', '연결', '준비', '진행', '산출'];
    const sub = (s, t, kind) => { const body = { x: LM, y: 0.95, w: CW, h: 0.30, fontSize: 14, fontFace: FF, color: C.dark, bold: true, align: 'center', margin: 0 };
        const parts = SUB_KINDS.includes(kind)
            ? [{ text: `[${kind}] `, options: { fontSize: 14, fontFace: FF, color: C.muted, bold: false } },
               { text: t,            options: { fontSize: 14, fontFace: FF, color: C.dark,  bold: true  } }]
            : t;
        s.addText(parts, body); s.addShape(pres.shapes.LINE, { x: LM, y: 1.35, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } }); };
    // title에 ''를 넘기면 좌측 세션 표기를 생략한다(과정 목차처럼 세션에 귀속되지 않는 페이지).

    const ftr = (s, pg, title) => { s.addShape(pres.shapes.LINE, { x: LM, y: 7.10, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } }); s.addText(title ?? SF, { x: LM, y: 7.15, w: 4.0, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, margin: 0 }); s.addText(`${pg}`, { x: 4.5, y: 7.15, w: 1.0, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, align: 'center', margin: 0 }); s.addText(AT, { x: 5.0, y: 7.15, w: 4.65, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, align: 'right', margin: 0 }); };

    const dL = (s, y) => s.addShape(pres.shapes.LINE, { x: LM, y, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } });
    // 인용 오버레이: 한글 14 / 영문·저자 10. 직각 배경 밴드에 내장(0.2cm 여백, 3pt 간격).
    // 높이는 실제 줄 수로 정한다. 긴 인용이 오면 밴드가 커진다(고정 높이면 글자가 밴드를 넘친다).

    const addQuote = (s, ko, en, author) => {
        const h = quoteH(ko, en, author), y = VB - h;
        s.addText([
            { text: `“${ko}”`, options: { fontSize: F_QKO, bold: true, color: C.dark, fontFace: FF, breakLine: true, paraSpaceAfter: 0 } },
            { text: `${en} — ${author}`, options: { fontSize: F_QEN, color: C.muted, fontFace: FF, paraSpaceBefore: 0 } }
        ], { shape: pres.shapes.RECTANGLE, x: LM, y, w: CW, h,
             fill: { color: C.navyLight }, line: { color: C.lineL, width: 0.75 },
             align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
    };

    const sec = (title, tc, items) => { const out = [ { text: title, options: { bold: true, fontSize: 14, fontFace: FF, color: tc || C.navy, breakLine: true, paraSpaceBefore: SP, paraSpaceAfter: SP } } ]; items.forEach((it) => { it.forEach((part, k) => { out.push({ text: part.text, options: { bullet: k === 0 ? { indent: 14 } : undefined, fontSize: 14, fontFace: FF, color: part.options?.color || C.dark, bold: part.options?.bold || false, breakLine: k === it.length - 1, paraSpaceBefore: k === 0 ? SP : 0, paraSpaceAfter: k === it.length - 1 ? SP : 0 } }); }); }); return out; };

    const tocT = (arr) => { const out = []; arr.forEach((a, i) => { const last = i === arr.length - 1; out.push({ text: a[0] + `. `, options: { bold: true, color: C.navy, fontSize: F_BODY, fontFace: FF, paraSpaceBefore: SP, paraSpaceAfter: SP } }); out.push({ text: a[1], options: { color: C.dark, fontSize: F_BODY, fontFace: FF, breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } }); }); return out; };

    const K = (kw, kc, body) => [ { text: kw + `:  `, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: kc, paraSpaceBefore: SP, paraSpaceAfter: SP } }, { text: body, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, breakLine: true, paraSpaceBefore: SP, paraSpaceAfter: SP } } ];

    const hC = (t) => ({ text: t, isHeader: true });

    const td = (t, o = {}) => ({ text: t, options: o });

    // 표: 열폭은 실제 텍스트 폭 비율로, 행 높이는 실제 줄 수로 정한다.
    // (구버전은 열폭을 자체 상수 2.0/1.1로 재고, 행 높이를 무조건 0.45in로 두어
    //  셀이 2줄로 흐르면 표가 밴드를 넘겼다.)

    const seg = (s, x1, y1, x2, y2, arrow, color) => s.addShape(pres.shapes.LINE, {
        x: Math.min(x1, x2), y: Math.min(y1, y2),
        w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
        line: { color: color || C.muted, width: 1.25, endArrowType: arrow ? 'triangle' : 'none' },
        flipH: x2 < x1, flipV: y2 < y1 });
    // 간선 라벨은 배경 없이 선 '바깥'에 둔다. 선의 법선 방향으로 밀어내므로 대각선 간선도 겹치지 않는다.
    // (예전에는 흰 배경 상자 1.5in을 선 한가운데 얹어 화살표를 덮었고, 그 다음엔 대각선 선을 라벨이 뚫었다)
    //   dir: 라벨을 밀 방향(+1 아래 / -1 위). 호출부가 그래프의 위/아래를 보고 정한다.

    const eLab = (s, x, y, t, dx = 1, dy = 0, dir = -1) => { if (!t) return;
        // 폭은 실측 + 여유다. 딱 맞춰 잡으면 렌더러의 자간 오차만큼 넘쳐 두 줄로 접힌다(SAFE 1.05를 여기서도 쓴다).
        const w = Math.min(1.70, Math.max(0.60, textW(String(t), F_ELAB) * 1.05 + 0.20)), h = 0.24;   // 상한은 노드 간격(eGap)과 같다
        const L = Math.hypot(dx, dy) || 1;
        let nx = -dy / L, ny = dx / L;                     // 선의 법선
        if ((ny > 0 ? 1 : -1) !== dir) { nx = -nx; ny = -ny; }   // 지정한 쪽(위/아래)으로 뒤집는다
        // 상자는 회전하지 않으므로, 법선 방향 반경 = (w/2)|nx| + (h/2)|ny| 만큼 밀어야 선과 닿지 않는다.
        // 수평선이면 h/2, 기울수록 커진다. 고정 오프셋을 쓰면 대각선에서 라벨 모서리가 선을 스친다.
        // 여기에 숨통(0.12)을 더한다 — 선에 붙으면 읽기 어렵다. (x,y)는 화살표선의 중점이다.
        const off = (w / 2) * Math.abs(nx) + (h / 2) * Math.abs(ny) + 0.12;
        s.addText(t, { x: x + nx * off - w / 2, y: y + ny * off - h / 2, w, h, fontSize: F_ELAB, fontFace: FF,
                       color: C.teal, bold: true, align: 'center', valign: 'middle', margin: 0 }); };

    const nodeBox = (s, r, label, gate) => s.addText(label, { shape: pres.shapes.RECTANGLE,
        x: r.x, y: r.y, w: r.w, h: r.h,
        fill: { color: gate ? C.white : C.navyLight }, line: { color: gate ? C.teal : C.navy, width: 1.25 },
        color: gate ? C.teal : C.navy, bold: true, fontSize: F_HEAD, fontFace: FF,
        align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });

    // flow / pipeline — 레벨 배치(최장 경로). 역방향 간선은 하단 채널로 우회한다.

    const addCaption = (s, text) => {
        s.addText(text, { x: LM, y: band.VT + band.VH + 0.04, w: CW, h: capH(text) - 0.04, fontSize: F_CAP, fontFace: FF,
                          color: C.muted, align: 'center', valign: 'top', margin: 0 });
    };

    // ── 관계 계열 공통: 노드·간선 배치 ────────────────────────────────────────
    // mode: 'flow' | 'pipeline'(게이트 강조 + 되돌림) | 'loop'(원형 배치)

  return { hdr, sub, ftr, dL, addQuote, sec, tocT, K, hC, td, seg, eLab, nodeBox, addCaption };
};
