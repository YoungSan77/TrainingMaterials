// ============================================================================
// layout.js — 시각화 기하(치수·배치)의 단일 소스. 엔진·verify 공유.
//
//   measure.js = 문자폭 / skeleton.js = 골격 / shape.js = 데이터 형태 에 이은 네 번째.
//   여기 오기 전까지 기하는 두 벌이었다: 엔진이 그릴 때 재고, verify가 검사할 때 같은 식을
//   다시 구현했다. verify 주석이 세 곳에서 자백했다 — "엔진과 동일한 기하 계산" /
//   "엔진 renderChain과 같은 식" / "엔진과 동일 식".
//   그리고 이미 갈라져 있었다: statement에서 엔진은 text를 그리는데 verify는 인용 ko를 쟀고,
//   여백 상수도 서로 달랐다(0.10↔0.16 / 0↔0.24). 아무도 그것을 재지 않았다.
//
//   [원칙 1] 재는 것과 그리는 것을 나눈다.
//     이 파일은 '얼마나 필요하고 어디에 놓이는가'만 답한다.
//     색을 칠하는 것은 renderer, '넘쳤는가'를 판정하는 것은 verify.
//   [원칙 2] 기하 상수는 여기에만 둔다.
//     열 간격·제목 높이·불릿·축 여백·행 높이 상한은 그리기의 세부가 아니라 기하의 입력이다.
//   [원칙 3] 환경은 주입받는다.
//     makeLayout(env) — 엔진은 ctx를, verify는 자기 측정 함수를 넘긴다.
//     둘 다 measure.js에서 온 같은 함수라 결과가 같다. band는 전역이 아니라 인자다.
// ============================================================================

module.exports = function makeLayout(env) {
    const { lines, textH, textW, lineCount, IN, SLACK, CW, LM, PAD, SP,
            F_IN, F_HEAD, F_BODY, F_ELAB, F_STMT, F_SRC, F_CAP,
            CAP_LH, CAP_MAX, CTX_TOP, VB, Y_LINE, LOOP_IN } = env;

    // ── 항목 계열(boxes·steps·versus) ──
    const ITEM = {
        boxes:  { gap: () => 0.20, head: 0.42, bullet: 10 },
        steps:  { gap: (n) => (n > 4 ? 0.10 : 0.16), head: 0.42, bullet: 10 },
        versus: { gap: () => 0.30, head: 0.44, bullet: 12 },
    };
    const isItem = (t) => Object.prototype.hasOwnProperty.call(ITEM, t);
    const colWidth = (t, n) => (CW - ITEM[t].gap(n) * (n - 1)) / n;

    const item = (type, items, band) => {
        const n = items.length;
        const gap = ITEM[type].gap(n), head = ITEM[type].head, bullet = ITEM[type].bullet;
        const w = colWidth(type, n);
        const per = items.map((it) => {
            const body = it.body || [];
            const ln = body.reduce((a, t) => a + lines(t, w, bullet), 0);
            return { ln, real: textH(ln, body.length) };
        });
        const need = head + Math.max(...per.map((p) => p.real)) + SLACK;
        const h = Math.min(band.VH, need);
        return { n, gap, w, head, bullet, need, h, alloc: h - head, per,
                 top: band.VT + (band.VH - h) / 2 };
    };

    // ── takeaways ──
    const TAKE = { titleW: 2.85, bodyPad: 3.2, min: 0.52 };
    const takeaways = (items, band) => {
        const n = items.length, gap = n >= 5 ? 0.08 : 0.12;
        const bw = CW - TAKE.bodyPad;
        const per = items.map((it) => {
            const body = it.body || [];
            const ln = body.reduce((a, t) => a + lines(t, bw, false), 0);
            return { ln, real: textH(ln, body.length) };
        });
        const hRaw = Math.max(...per.map((p) => p.real)) + SLACK;
        const h = Math.min((band.VH - gap * (n - 1)) / n, Math.max(TAKE.min, hRaw));
        const blockH = h * n + gap * (n - 1);
        return { n, gap, bw, titleW: TAKE.titleW, hRaw, h, blockH, per,
                 top: band.VT + (band.VH - blockH) / 2 };
    };

    // ── table ── 열폭은 실제 텍스트 폭 비율로, 행 높이는 실제 줄 수로.
    const TBL = { maxW: 8.6, colMin: 1.60, rowMin: 0.45, lineH: 0.28 };
    const cellText = (c) => (typeof c === 'object' && c !== null && c.text !== undefined) ? String(c.text) : String(c ?? '');
    const table = (rows, band) => {
        const nCol = rows[0].length;
        const wide = new Array(nCol).fill(0);
        rows.forEach((r) => r.forEach((c, i) => { wide[i] = Math.max(wide[i], textW(cellText(c), F_IN)); }));
        const sum = wide.reduce((a, b) => a + b, 0);
        const tableW = Math.min(CW - LM * 2, TBL.maxW);
        let colW = sum === 0 ? wide.map(() => tableW / nCol)
                             : wide.map((w) => Math.max((w / sum) * tableW, TBL.colMin));
        const tot = colW.reduce((a, b) => a + b, 0);
        if (tot > tableW) colW = colW.map((w) => w * tableW / tot);
        const lns = rows.map((r) => r.map((c, i) => lineCount(cellText(c), colW[i] - PAD * 2, F_IN)));
        const rowH = lns.map((r) => Math.max(TBL.rowMin, Math.max(...r) * TBL.lineH + PAD * 2));
        const h = rowH.reduce((a, b) => a + b, 0);
        return { cellText, colW, lns, rowH, h, tableW, need: h,
                 top: band.VT + (band.VH - Math.min(h, band.VH)) / 2 };
    };

    // ── statement(단문) ──
    //   문장은 text가 우선이다(우리말 명제). text가 없을 때만 인용 원문(ko)을 띄운다.
    //   srcHead: 자산에서 끌어온 출처 머리말(없으면 ''). 엔진·verify가 같은 값을 넘긴다.
    const STMT = { pad: 0.60, tLH: 0.34, sLH: 0.20, sGap: 0.10, nLH: 0.26, minGap: 0.24 };
    const statement = (v, band, srcHead) => {
        const av = CW - STMT.pad * 2;
        const q = v.quote;
        const text = v.text ? String(v.text) : (q && q.ko ? `\u201C${q.ko}\u201D` : '');
        const tl = lineCount(text, av, F_STMT);
        const by = q ? `— ${q.author}${srcHead ? `, ${srcHead}` : ''}` : '';
        const srcTxt = q ? `${q.en}\n${by}` : (v.source || '');
        const sl = srcTxt ? srcTxt.split('\n').reduce((a, p) => a + lineCount(p, av, F_SRC), 0) : 0;
        const nl = v.note ? lineCount(String(v.note), av, F_BODY) : 0;
        const tH = tl * STMT.tLH, sH = sl ? sl * STMT.sLH + STMT.sGap : 0, nH = nl ? nl * STMT.nLH : 0;
        const gap = Math.max(STMT.minGap, (band.VH - (tH + sH + nH)) / 3);
        return { av, pad: STMT.pad, text, srcTxt, tl, sl, nl, tH, sH, nH, gap,
                 y1: band.VT + gap, sGap: STMT.sGap, need: tH + sH + nH + STMT.minGap * 3 };
    };

    // ── 관계 계열 공통: 노드·간선 정규화 ──
    const nodesOf = (d) => (d.nodes || []).map((n) => ({ ...n, label: String(n.label).replace(/\\n|<br\s*\/?>/gi, '\n') }));
    const chainEdges = (d, ns) => (d.edges && d.edges.length) ? d.edges
                                : ns.slice(1).map((n, i) => ({ from: ns[i].id, to: n.id }));
    const loopEdges = (d, ns) => (d.edges && d.edges.length) ? d.edges
                               : ns.map((x, i) => ({ from: x.id, to: ns[(i + 1) % ns.length].id }));

    // ── flow / pipeline ── 레벨 배치(최장 경로). 역방향 간선은 하단 채널로 우회한다.
    const CHAIN = { rowGap: 0.34, chanH: 0.45, pad: 0.10,
                    eGapMin: 1.05, eGapMax: 1.70, eGapNone: 0.55,
                    wMax: 2.25, wMin: 1.10, wTD: 2.40, colGapTD: 0.24,
                    hMin: 0.60, hMax: 1.50, hBase: 0.34, hLine: 0.26 };
    const chain = (d, band) => {
        const ns = nodesOf(d), edges = chainEdges(d, ns);
        const idx = {}; ns.forEach((n, i) => idx[n.id] = i);
        const H = String(d.dir || 'LR').toUpperCase() !== 'TD';
        const fwd = edges.filter((e) => idx[e.to] > idx[e.from]);
        const col = {}; ns.forEach((n) => col[n.id] = 0);
        for (let k = 0; k < ns.length; k++) fwd.forEach((e) => { if (col[e.to] < col[e.from] + 1) col[e.to] = col[e.from] + 1; });
        const levels = []; ns.forEach((n) => { (levels[col[n.id]] = levels[col[n.id]] || []).push(n.id); });
        const L = levels.length, hasBack = edges.length > fwd.length;
        const chanH = hasBack ? CHAIN.chanH : 0;
        const usable = band.VH - chanH, uMid = band.VT + usable / 2;
        const widest = Math.max(...levels.map((l) => l.length));
        const mainStart = H ? (LM + CHAIN.pad) : (uMid - usable / 2);
        const mainSpan = H ? (CW - CHAIN.pad * 2) : usable;
        const mainStep = mainSpan / L;
        const labW = Math.max(0, ...edges.filter((e) => e.label).map((e) => textW(String(e.label), F_ELAB) * 1.05 + 0.20));
        const eGap = labW ? Math.min(CHAIN.eGapMax, Math.max(CHAIN.eGapMin, labW + 0.30)) : CHAIN.eGapNone;
        const nodeW = H ? Math.min(CHAIN.wMax, Math.max(CHAIN.wMin, mainStep - eGap))
                        : Math.min(CHAIN.wTD, (CW - CHAIN.pad * 2) / widest - 0.30);
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW - PAD * 2, F_HEAD), 0);
        const maxLines = Math.max(1, ...ns.map((n) => nLines(n.label)));
        const nodeH = Math.min(CHAIN.hMax, Math.max(CHAIN.hMin, CHAIN.hBase + maxLines * CHAIN.hLine));
        const blockH = H ? (widest * nodeH + (widest - 1) * CHAIN.rowGap) : usable;
        const crossStart = H ? (uMid - blockH / 2) : (LM + CHAIN.pad);
        const crossSpan = H ? blockH : (CW - CHAIN.pad * 2);
        const chan = H ? (crossStart + crossSpan + chanH * 0.55) : (band.VT + band.VH - chanH * 0.45);
        const R = {}, blockMid = crossStart + crossSpan / 2;
        levels.forEach((lvl, li) => lvl.forEach((id, ri) => {
            const mainC = mainStart + mainStep * (li + 0.5);
            const lvlH = H ? (lvl.length * nodeH + (lvl.length - 1) * CHAIN.rowGap)
                           : (lvl.length * nodeW + (lvl.length - 1) * CHAIN.colGapTD);
            const lvlStart = crossStart + (crossSpan - lvlH) / 2;
            const crossC = H ? (lvlStart + ri * (nodeH + CHAIN.rowGap) + nodeH / 2)
                             : (lvlStart + ri * (nodeW + CHAIN.colGapTD) + nodeW / 2);
            const cx = H ? mainC : crossC, cy = H ? crossC : mainC;
            R[id] = { x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH, cx, cy };
        }));
        // 필요 높이: 가로 배치는 노드 블록 + 채널, 세로 배치는 레벨을 쌓은 높이 + 채널.
        const need = H ? (blockH + chanH) : (L * nodeH + (L - 1) * CHAIN.rowGap + chanH);
        return { ns, edges, idx, H, levels, hasBack, chanH, chan, nodeW, nodeH, blockH, blockMid, R, need, nLines,
                 labelBudget: Math.floor((nodeW - PAD * 2) / (IN(F_HEAD) * 1.05)) };
    };

    // ── loop ── 노드를 타원 궤도에 배치하고 고리로 잇는다.
    const LOOP = { wMax: 2.40, wMin: 1.60, hMin: 0.80, hMax: 1.30, hBase: 0.42, hLine: 0.24,
                   rxMax: 3.30, ryMin: 0.55 };
    const loop = (d, band) => {
        const ns = nodesOf(d), n = ns.length, edges = loopEdges(d, ns);
        const nodeW = Math.min(LOOP.wMax, Math.max(LOOP.wMin, CW / (n <= 3 ? 3.2 : 3.9)));
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW * LOOP_IN, F_ELAB), 0);
        const nodeH = Math.min(LOOP.hMax, Math.max(LOOP.hMin, LOOP.hBase + Math.max(1, ...ns.map((x) => nLines(x.label))) * LOOP.hLine));
        const cx = LM + CW / 2, cy = band.VT + band.VH / 2;
        const rx = Math.min((CW - nodeW) / 2 - 0.10, LOOP.rxMax);
        const ry = Math.max(LOOP.ryMin, (band.VH - nodeH) / 2 - 0.06);
        const R = {};
        ns.forEach((x, i) => {
            const th = -Math.PI / 2 + (2 * Math.PI * i) / n;          // 12시에서 시계방향
            const px = cx + rx * Math.cos(th), py = cy + ry * Math.sin(th);
            R[x.id] = { x: px - nodeW / 2, y: py - nodeH / 2, w: nodeW, h: nodeH, cx: px, cy: py };
        });
        return { ns, edges, R, nodeW, nodeH, rx, ry, cx, cy, nLines, need: 2 * ry + nodeH,
                 labelBudget: Math.floor((nodeW * LOOP_IN) / (IN(F_ELAB) * 1.05)) };
    };

    // ── share ── 100% 스택 바 + 범례.
    const SHARE = { barWRatio: 0.80, barHMin: 0.70, barHMax: 0.95, barHRatio: 0.30,
                    legGap: 0.14, legLH: 0.26, legW: 0.60 };
    const share = (items, band) => {
        const tot = items.reduce((a, it) => a + Number(it.value), 0) || 100;
        const barW = CW * SHARE.barWRatio, barX = LM + (CW - barW) / 2;
        const barH = Math.min(SHARE.barHMax, Math.max(SHARE.barHMin, band.VH * SHARE.barHRatio));
        const legLn = items.reduce((a, it) => a + lines(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, CW - SHARE.legW, false), 0);
        const legH = legLn * SHARE.legLH + PAD;
        const need = barH + SHARE.legGap + legH;
        const h = Math.min(band.VH, need);
        let x = barX;
        const seg = items.map((it) => { const w = barW * (Number(it.value) / tot), s = { x, w }; x += w; return s; });
        return { tot, barW, barX, barH, legLn, legH, legGap: SHARE.legGap, need, h, seg,
                 top: band.VT + (band.VH - h) / 2 };
    };

    // ── magnitude ── 면적 비례를 포기하고 계단형으로 그린다(숫자를 병기한다).
    const MAG = { numW: 1.30, gapX: 0.12, gapY: 0.16, labMin: 1.60, labMax: 3.00,
                  rowMin: 0.46, rowMax: 0.70, noteMin: 1.40 };
    const magnitude = (items, band) => {
        const n = items.length;
        const labW = Math.min(MAG.labMax, Math.max(MAG.labMin, Math.max(...items.map((it) => textW(it.label, F_IN))) + PAD * 2 + 0.10));
        const barMax = CW - labW - MAG.numW - MAG.gapX * 2;
        const rowH = Math.min(MAG.rowMax, Math.max(MAG.rowMin, (band.VH - MAG.gapY * (n - 1)) / n));
        const blockH = rowH * n + MAG.gapY * (n - 1);
        const top = band.VT + (band.VH - blockH) / 2;
        const rows = items.map((it, i) => ({ y: top + i * (rowH + MAG.gapY), w: barMax * ((i + 1) / n),
                                             ln: lineCount(it.label, labW - PAD * 2, F_IN) }));
        return { n, labW, numW: MAG.numW, gapX: MAG.gapX, gapY: MAG.gapY, barMax, rowH, blockH, top, rows,
                 noteMin: MAG.noteMin, need: blockH,
                 labelBudget: Math.floor((labW - PAD * 2) / (IN(F_IN) * 1.05)) };
    };

    // ── pyramid ── 폭이 곧 양인 계층.
    const PYR = { gapY: 0.10, rowMin: 0.46, rowMax: 0.92, wMinRatio: 0.26, wMaxRatio: 0.66, noteGap: 0.12 };
    const pyramid = (items, band) => {
        const n = items.length;
        const rowH = Math.min(PYR.rowMax, Math.max(PYR.rowMin, (band.VH - PYR.gapY * (n - 1)) / n));
        const blockH = rowH * n + PYR.gapY * (n - 1);
        const top = band.VT + (band.VH - blockH) / 2;
        const wMin = CW * PYR.wMinRatio, wMax = CW * PYR.wMaxRatio, cx = LM + CW / 2;
        const rows = items.map((it, i) => {
            const w = n === 1 ? wMax : wMin + (wMax - wMin) * (i / (n - 1));
            return { w, x: cx - w / 2, y: top + i * (rowH + PYR.gapY),
                     ln: lineCount(it.label, w - PAD * 2, F_HEAD),
                     budget: Math.floor((w - PAD * 2) / (IN(F_HEAD) * 1.05)) };
        });
        return { n, gapY: PYR.gapY, rowH, blockH, top, rows, noteGap: PYR.noteGap, need: blockH };
    };

    // ── quadrant ── 두 축의 사분면. 칸이 좁으면 문장이 명사구로 깎인다 → 밴드를 최대한 쓴다.
    const QUAD = { axX: 0.30, axY: 0.42, gap: 0.10, ghMax: 4.30, titleH: 0.40,
                   pos: { TL: [0, 0], TR: [1, 0], BL: [0, 1], BR: [1, 1] } };
    const quadrant = (d, band) => {
        const gw = CW - QUAD.axY - 0.06;
        const gh = Math.min(band.VH - QUAD.axX - 0.06, QUAD.ghMax);
        const top = band.VT + (band.VH - (gh + QUAD.axX)) / 2;
        const left = LM + QUAD.axY;
        const cw = (gw - QUAD.gap) / 2, ch = (gh - QUAD.gap) / 2;
        const cells = (d.cells || []).map((c) => {
            const body = Array.isArray(c.body) ? c.body : (c.body ? [c.body] : []);
            const ln = body.reduce((a, t) => a + lines(t, cw, 10), 0);
            const p = QUAD.pos[String(c.at).toUpperCase()] || [0, 0];
            return { at: c.at, title: c.title, body, ln, real: textH(ln, body.length),
                     x: left + p[0] * (cw + QUAD.gap), y: top + p[1] * (ch + QUAD.gap) };
        });
        return { gw, gh, top, left, gap: QUAD.gap, cw, ch, titleH: QUAD.titleH, cells,
                 alloc: ch - QUAD.titleH, axX: QUAD.axX, axY: QUAD.axY, need: gh + QUAD.axX,
                 budget: Math.floor((cw - PAD * 2 - IN(10)) / (IN(F_IN) * 1.05)) };
    };

    // ── caption ── 시각화 하단 출처·한계(8pt). 밴드에서 자기 몫을 먼저 가져간다.
    const capLines = (t) => Math.min(CAP_MAX, lineCount(String(t), CW - PAD * 2, F_CAP));
    const capH = (t) => t ? capLines(t) * CAP_LH + 0.06 : 0;

    // ── 슬라이드 밴드 ── 질문/리드 밴드 아래 ~ 하단 구분선 위. 인용·caption이 먼저 가져간다.
    const BAND = { ctxMin: 0.52, ctxLH: 0.28, ctxPad: 0.10, gapFree: 0.10, gap: 0.16,
                   freeBottom: 0.20, min: 0.8 };
    const contextH = (question, lead) => {
        const ln = (question ? lines(question, CW, false, F_BODY) : 0)
                 + (lead ? lines(`${lead.label}: ${lead.text}`, CW, false, F_BODY) : 0);
        if (!ln) return 0;
        return Math.max(BAND.ctxMin, ln * BAND.ctxLH + PAD * 2 + BAND.ctxPad);
    };
    // free = statement(하단 결론이 없어 밴드를 더 쓴다) / QH = 인용 밴드 높이(0이면 없음)
    const band = ({ free, question, lead, QH = 0, caption }) => {
        const ctxH = contextH(question, lead);
        const ctxBottom = free ? CTX_TOP : (CTX_TOP + ctxH);
        const VT = ctxBottom + (free ? BAND.gapFree : BAND.gap);
        let VH = Math.max(BAND.min, ((free ? Y_LINE - BAND.freeBottom : VB) - QH) - VT);
        if (caption) VH = Math.max(BAND.min, VH - capH(caption));
        return { VT, VH, ctxH };
    };

    return { ITEM, isItem, colWidth, item, takeaways, table, statement,
             chain, loop, share, magnitude, pyramid, quadrant,
             nodesOf, chainEdges, loopEdges, cellText, capLines, capH, contextH, band,
             CHAIN, LOOP, SHARE, MAG, PYR, QUAD, STMT, TBL, TAKE, BAND };
};
