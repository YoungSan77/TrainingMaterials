'use strict';
// 자동 생성(build_split.js). 원본 master_render.js에서 본문을 그대로 옮겼다.
// 손으로 고치지 말 것 — 규칙은 원본과 골든이 정본이다.
const makeLayout = require('../layout.js');            // 기하 측정 단일 소스(verify와 공유)
module.exports = (ctx) => {
  const LO = makeLayout(ctx);
  const {
    pres, DECK, ASSETS, noteTail, band, DRAFT, C, FF,
    LM, CW, Y_START, Y_LINE, Y_BOT, CTX_TOP, VB, F_BODY,
    F_IN, F_HEAD, F_QKO, F_QEN, PAD, MG, SP, LH,
    SLACK, F_CAP, F_ELAB, F_STMT, F_SRC, F_NUM, CAP_LH, CAP_MAX,
    LOOP_IN, PAL, NN, RN, SF, AT, IN, textW,
    avail, lineCount, FREE, isFree, requiredFields, lines, lineH, textH,
    hdrFS, quoteH, capLines, capH, onDark, nodesOf, edgesOf, hdr,
    sub, ftr, dL, addQuote, sec, tocT, K, hC,
    td, seg, eLab, nodeBox, addCaption, addCover, stripNo, stripDay,
    listBlock, addFullToc, addSessionToc, addFrontMatter, buildIntro, toTable, addContext, renderBody,
    addNotes,
  } = ctx;

    const autoTable = (s, y, tblData, opts = {}) => {
        const cellTxt = (cell) => (typeof cell === 'object' && cell !== null && cell.text !== undefined) ? String(cell.text) : String(cell ?? '');
        // 1) 열폭 — 각 열에서 가장 넓은 셀의 실제 텍스트 폭 비율로 배분한다.
        const maxW = new Array(tblData[0].length).fill(0);
        tblData.forEach(row => row.forEach((cell, i) => { maxW[i] = Math.max(maxW[i], textW(cellTxt(cell), F_IN)); }));
        const sumW = maxW.reduce((a, b) => a + b, 0);
        const tableW = Math.min(CW - (LM * 2), 8.6);
        let colW = sumW === 0 ? new Array(maxW.length).fill(tableW / maxW.length)
                              : maxW.map(w => Math.max((w / sumW) * tableW, 1.6));
        const scale = colW.reduce((a, b) => a + b, 0) > tableW ? tableW / colW.reduce((a, b) => a + b, 0) : 1;
        colW = colW.map(w => w * scale);
        // 2) 행 높이 — 그 행에서 가장 많이 흐르는 셀의 줄 수로 정한다(최소 0.45in).
        const rowH = tblData.map(row => Math.max(0.45,
            Math.max(...row.map((cell, i) => lineCount(cellTxt(cell), colW[i] - PAD * 2, F_IN))) * 0.28 + PAD * 2));
        const tblH = rowH.reduce((a, b) => a + b, 0);
        const finalY = y === 'auto' ? band.VT + (band.VH - Math.min(tblH, band.VH)) / 2 : y;
        const formattedTbl = tblData.map((row, rIdx) => row.map((cell, cIdx) => {
            const isHeader = rIdx === 0 || (cell && cell.isHeader);
            const bdr = isHeader ? [ { pt: 1, color: C.navy },
                                     cIdx === row.length - 1 ? { pt: 1, color: C.navy } : { pt: 1, color: C.white },
                                     { pt: 1, color: C.navy },
                                     cIdx === 0 ? { pt: 1, color: C.navy } : { pt: 0, color: C.navy } ]
                                 : { pt: 1, color: C.lineL };
            return { text: cellTxt(cell), options: { bold: isHeader || (cell && cell.options?.bold),
                color: isHeader ? C.white : C.dark, fill: { color: isHeader ? C.navy : C.white },
                align: isHeader || cIdx === 0 ? 'center' : 'left', valign: 'middle',
                fontSize: F_IN, fontFace: FF, margin: [MG, MG, MG, MG],
                paraSpaceBefore: SP, paraSpaceAfter: SP, border: bdr } };
        }));
        s.addTable(formattedTbl, { x: LM, y: finalY, w: tableW, colW, rowH, ...opts });
    };


    const renderAutoBoxes = (s, y, boxes) => {
        const g = LO.item('boxes', boxes, band.VH);                      // 치수는 layout.js가 잰다
        const { n, gap, w, h } = g;
        const top = y === 'auto' ? band.VT + (band.VH - h) / 2 : y;      // 밴드 수직 중앙
        boxes.forEach((b, i) => {
            const x = LM + i * (w + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            // 제목 — box에 내장 (12 bold)
            s.addText(b.title, { x, y: top, w, h: g.head, fill: { color: C.navy }, color: C.white, bold: true, fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            // 본문 — box에 내장 (12), 문장 간 전후 3pt
            s.addText(b.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark, bullet: { indent: g.bullet }, breakLine: k < b.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + g.head, w, h: g.alloc, valign: 'top', margin: [MG, MG, MG, MG] });
        });
    };

    // ========================================================================
    // 시각화 모듈 — 데이터 표면은 7종이지만 내부 구현은 2개다.
    //   관계 계열(flow·pipeline·loop) → 노드·간선 배치 하나를 공유한다. 배치 모드만 다르다.
    //   수치 계열(share·magnitude·pyramid) → 막대 기하 하나를 공유한다.
    //   quadrant만 별도(2축 격자).
    // 선언 데이터만 받는다. 코드 문자열(mermaid)은 받지 않는다 — 문법 실패가 없고,
    // verify가 노드 수·라벨 폭을 잴 수 있어 다른 타입과 같은 등급의 검증을 받는다.
    // ========================================================================


    const renderChain = (s, d) => {
        const ns = nodesOf(d), edges = edgesOf(d, ns);
        const idx = {}; ns.forEach((n, i) => idx[n.id] = i);
        const H = String(d.dir || 'LR').toUpperCase() !== 'TD';
        const fwd = edges.filter(e => idx[e.to] > idx[e.from]);
        const col = {}; ns.forEach(n => col[n.id] = 0);
        for (let k = 0; k < ns.length; k++) fwd.forEach(e => { if (col[e.to] < col[e.from] + 1) col[e.to] = col[e.from] + 1; });
        const levels = []; ns.forEach(n => { (levels[col[n.id]] = levels[col[n.id]] || []).push(n.id); });
        const L = levels.length, hasBack = edges.length > fwd.length;
        // 노드 블록 + (되돌림) 채널 전체를 밴드 중앙에 둔다.
        const chanH = hasBack ? 0.45 : 0.0;
        const usable = band.VH - chanH, uMid = band.VT + usable / 2;
        const widest = Math.max(...levels.map(l => l.length));
        const rowGap = 0.34;
        const mainStart = H ? (LM + 0.10) : (uMid - usable / 2), mainSpan = H ? (CW - 0.20) : usable;
        const mainStep = mainSpan / L;
        // 노드 크기를 먼저 확정한다. 블록 높이를 추정치(가정된 노드 높이)로 잡으면
        // 라벨이 2줄이 되는 순간 실제 블록이 커져 밴드를 벗어난다 → 추정하지 않고 잰다.
        // 간선 라벨이 있으면 노드 간격을 넓힌다 — 라벨이 놓일 자리가 없으면 노드를 침범한다.
        // 간선 라벨이 있으면 노드 간격을 라벨 실폭에 맞춰 넓힌다. 고정값(1.05)으로 잡으면 라벨이 길 때 노드를 침범한다.
        const labW = Math.max(0, ...edges.filter(e => e.label).map(e => textW(String(e.label), F_ELAB) * 1.05 + 0.20));
        const eGap = labW ? Math.min(1.70, Math.max(1.05, labW + 0.30)) : 0.55;
        const nodeW = H ? Math.min(2.25, Math.max(1.10, mainStep - eGap)) : Math.min(2.40, (CW - 0.20) / widest - 0.30);
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW - PAD * 2, F_HEAD), 0);
        const maxLines = Math.max(1, ...ns.map(n => nLines(n.label)));
        const nodeH = Math.min(1.50, Math.max(0.60, 0.34 + maxLines * 0.26));
        const blockH = H ? (widest * nodeH + (widest - 1) * rowGap) : usable;   // 실제 노드 높이로 계산
        const crossStart = H ? (uMid - blockH / 2) : (LM + 0.10);
        const crossSpan = H ? blockH : (CW - 0.20);
        const chan = H ? (crossStart + crossSpan + chanH * 0.55) : (band.VT + band.VH - chanH * 0.45);
        // 배치는 blockH를 만든 것과 같은 식(노드 높이 + rowGap)으로 한다.
        // 예전에는 blockH를 rowGap으로 계산해 놓고 배치는 균등 분할로 해서, 실제 간격이 0.17in까지 좁아졌다.
        const R = {}, blockMid = crossStart + crossSpan / 2;
        levels.forEach((lvl, li) => { lvl.forEach((id, ri) => {
            const mainC = mainStart + mainStep * (li + 0.5);
            const lvlH = H ? (lvl.length * nodeH + (lvl.length - 1) * rowGap) : (lvl.length * nodeW + (lvl.length - 1) * 0.24);
            const lvlStart = crossStart + (crossSpan - lvlH) / 2;
            const crossC = H ? (lvlStart + ri * (nodeH + rowGap) + nodeH / 2)
                             : (lvlStart + ri * (nodeW + 0.24) + nodeW / 2);
            const cx = H ? mainC : crossC, cy = H ? crossC : mainC;
            R[id] = { x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH, cx, cy };
        }); });
        edges.forEach(e => {
            const a = R[e.from], b = R[e.to]; if (!a || !b) return;
            const back = idx[e.to] <= idx[e.from];
            if (!back) {
                const x1 = H ? a.x + a.w : a.cx, y1 = H ? a.cy : a.y + a.h, x2 = H ? b.x : b.cx, y2 = H ? b.cy : b.y;
                seg(s, x1, y1, x2, y2, true);
                const my = (y1 + y2) / 2;
                eLab(s, (x1 + x2) / 2, my, e.label, x2 - x1, y2 - y1, my <= blockMid ? -1 : 1);  // 위쪽 간선은 위로, 아래쪽은 아래로
            } else if (H) {                                    // 되돌림 — 노드 블록 아래 채널로 우회
                const x1 = a.cx, y1 = a.y + a.h, x2 = b.cx, y2 = b.y + b.h;
                seg(s, x1, y1, x1, chan, false, C.failT); seg(s, x1, chan, x2, chan, false, C.failT);
                seg(s, x2, chan, x2, y2, true, C.failT); eLab(s, (x1 + x2) / 2, chan, e.label, 1, 0, 1);
            } else {
                const cX = LM + CW - 0.15, y1 = a.cy, y2 = b.cy;
                seg(s, a.x + a.w, y1, cX, y1, false, C.failT); seg(s, cX, y1, cX, y2, false, C.failT);
                seg(s, cX, y2, b.x + b.w, y2, true, C.failT); eLab(s, cX, (y1 + y2) / 2, e.label, 0, 1, -1);
            }
        });
        ns.forEach(n => nodeBox(s, R[n.id], n.label, n.gate));   // 간선 위에 노드를 얹는다
    };

    // loop — 원형 배치 + 타원 노드. 사각형으로 그리면 원형으로 놓아도 순환으로 읽히지 않는다.
    //   대가: 타원은 내접 사각형이 폭의 70%뿐이다 → 라벨 예산이 준다(10pt 기준 한글 8자).
    //   8자를 넘으면 라벨을 잘못 뽑은 것이다(명제가 아니라 문장을 넣고 있다). verify가 오류로 잡는다.

    const renderLoop = (s, d) => {
        const ns = nodesOf(d), n = ns.length;
        const edges = (d.edges && d.edges.length) ? d.edges
                    : ns.map((x, i) => ({ from: x.id, to: ns[(i + 1) % n].id }));   // 생략 시 고리로 잇는다
        const nodeW = Math.min(2.40, Math.max(1.60, CW / (n <= 3 ? 3.2 : 3.9)));
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW * LOOP_IN, F_ELAB), 0);
        const nodeH = Math.min(1.30, Math.max(0.80, 0.42 + Math.max(1, ...ns.map(x => nLines(x.label))) * 0.24));
        const cx = LM + CW / 2, cy = band.VT + band.VH / 2;
        const rx = Math.min((CW - nodeW) / 2 - 0.10, 3.30);
        const ry = Math.max(0.55, (band.VH - nodeH) / 2 - 0.06);
        const R = {};
        ns.forEach((x, i) => {
            const th = -Math.PI / 2 + (2 * Math.PI * i) / n;     // 12시에서 시계방향
            const px = cx + rx * Math.cos(th), py = cy + ry * Math.sin(th);
            R[x.id] = { x: px - nodeW / 2, y: py - nodeH / 2, w: nodeW, h: nodeH, cx: px, cy: py };
        });
        // 간선: 노드 경계에서 경계로 직선. 고리가 다각형으로 보인다.
        const trim = (a, b) => {                                  // 중심선을 노드 경계까지 자른다
            const dx = b.cx - a.cx, dy = b.cy - a.cy, L = Math.hypot(dx, dy) || 1;
            const cut = (r) => Math.min(r.w / 2 / (Math.abs(dx) / L || 1e-6), r.h / 2 / (Math.abs(dy) / L || 1e-6));
            const ca = Math.min(cut(a), Math.max(a.w, a.h)) + 0.04, cb = Math.min(cut(b), Math.max(b.w, b.h)) + 0.04;
            return [a.cx + (dx / L) * ca, a.cy + (dy / L) * ca, b.cx - (dx / L) * cb, b.cy - (dy / L) * cb];
        };
        edges.forEach(e => {
            const a = R[e.from], b = R[e.to]; if (!a || !b) return;
            const [x1, y1, x2, y2] = trim(a, b);
            seg(s, x1, y1, x2, y2, true);
            const my = (y1 + y2) / 2;
            eLab(s, (x1 + x2) / 2, my, e.label, x2 - x1, y2 - y1, my <= cy ? -1 : 1);
        });
        ns.forEach(x => { const r = R[x.id];
            s.addText(x.label, { shape: pres.shapes.OVAL, x: r.x, y: r.y, w: r.w, h: r.h,
                fill: { color: C.navyLight }, line: { color: C.navy, width: 1.25 },
                color: C.navy, bold: true, fontSize: F_ELAB, fontFace: FF,
                align: 'center', valign: 'middle', margin: 0 }); });
    };

    // ── 수치 계열 ────────────────────────────────────────────────────────────
    // share — 100% 스택 바. 비례가 곧 메시지다(면적 = 값). 비례는 절대 건드리지 않는다.

    const renderShare = (s, items) => {
        const tot = items.reduce((a, it) => a + Number(it.value), 0) || 100;
        const barW = CW * 0.80, barX = LM + (CW - barW) / 2;   // 화면을 꽉 채우면 큰 조각이 위압한다 → 폭을 줄이고 가운데로
        const barH = Math.min(0.95, Math.max(0.70, band.VH * 0.30));
        const legLn = items.reduce((a, it) => a + lines(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, CW - 0.60, false), 0);
        const legH = legLn * 0.26 + PAD;
        const h = Math.min(band.VH, barH + 0.14 + legH);
        const top = band.VT + (band.VH - h) / 2;
        let x = barX;
        items.forEach((it, i) => {
            const w = barW * (Number(it.value) / tot), fill = PAL[i % PAL.length];
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h: barH, fill: { color: fill }, line: { color: C.white, width: 1 } });
            // 숫자는 조각 폭을 '재서' 넣는다. 고정 임계로 자르면 들어갈 숫자도 밖으로 밀려난다.
            const txt = `${it.value}%`;
            const fsz = textW(txt, F_NUM) + 0.06 <= w ? F_NUM : (textW(txt, F_IN) + 0.04 <= w ? F_IN : 0);
            if (fsz) s.addText(txt, { x, y: top, w, h: barH, fontSize: fsz, bold: true, fontFace: FF,
                    color: onDark(fill) ? C.white : C.dark, align: 'center', valign: 'middle', margin: 0 });
            x += w;
        });
        // 범례 — 색 조각 + 라벨(+주석). 좁은 조각의 숫자는 여기서 읽힌다.
        const parts = [];
        items.forEach((it, i) => {
            const last = i === items.length - 1;
            parts.push({ text: `■ `, options: { fontSize: F_IN, fontFace: FF, color: PAL[i % PAL.length], paraSpaceBefore: SP } });
            parts.push({ text: `${it.value}% `, options: { fontSize: F_IN, bold: true, fontFace: FF, color: C.dark, paraSpaceBefore: SP } });
            parts.push({ text: it.note ? `${it.label} — ${it.note}` : it.label,
                options: { fontSize: F_IN, fontFace: FF, color: C.dark, breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } });
        });
        // 범례는 '블록을 가운데, 글자는 왼쪽'이다. 여러 줄을 가운데 정렬하면 좌측이 들쭉날쭉해 읽기 어렵다.
        const legW = Math.min(CW, Math.max(...items.map(it =>
            textW(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, F_IN))) + 0.20);
        s.addText(parts, { x: LM + (CW - legW) / 2, y: top + barH + 0.10, w: legW, h: h - barH - 0.10,
                           align: 'left', valign: 'top', margin: 0 });
    };

    // magnitude — 자릿수 격차. 면적 비례를 포기하고 계단형으로 그린 뒤 숫자를 병기한다.
    // (1:10:100을 비례로 그리면 1은 1픽셀이 되어 사라지고, 로그 축은 청중이 오독한다.)

    const renderMagnitude = (s, items) => {
        const n = items.length;
        const labW = Math.min(3.00, Math.max(1.60, Math.max(...items.map(it => textW(it.label, F_IN))) + PAD * 2 + 0.10));
        const numW = 1.30, gapX = 0.12;
        const barMax = CW - labW - numW - gapX * 2;
        const gapY = 0.16;
        // 행 높이 상한을 낮게 둔다. 밴드가 남는다고 행을 키우면 그림이 뚱뚱해진다 — 여백은 낭비가 아니다.
        const rowH = Math.min(0.70, Math.max(0.46, (band.VH - gapY * (n - 1)) / n));
        const blockH = rowH * n + gapY * (n - 1);
        const top = band.VT + (band.VH - blockH) / 2;
        items.forEach((it, i) => {
            const y = top + i * (rowH + gapY);
            const w = barMax * ((i + 1) / n);                  // 계단형 — 값이 아니라 순위로 자란다
            const fill = i === n - 1 ? C.navy : (i === 0 ? C.lineL : C.teal);
            s.addText(it.label, { x: LM, y, w: labW, h: rowH, fontSize: F_IN, fontFace: FF, color: C.dark,
                bold: true, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addShape(pres.shapes.RECTANGLE, { x: LM + labW + gapX, y, w, h: rowH,
                fill: { color: fill }, line: { color: C.navy, width: 0.75 } });
            if (it.note && w >= 1.40)
                s.addText(it.note, { x: LM + labW + gapX, y, w, h: rowH, fontSize: F_IN, fontFace: FF,
                    color: onDark(fill) ? C.white : C.dark, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(`${it.value}${it.unit || ''}`, { x: LM + labW + gapX + w + gapX, y, w: numW, h: rowH,
                fontSize: F_NUM, bold: true, fontFace: FF, color: C.navy, align: 'left', valign: 'middle', margin: 0 });
        });
    };

    // pyramid — 폭이 곧 양인 계층. items[0]이 꼭대기(좁은 층)다.

    const renderPyramid = (s, items) => {
        const n = items.length, gapY = 0.10;
        const rowH = Math.min(0.92, Math.max(0.46, (band.VH - gapY * (n - 1)) / n));
        const blockH = rowH * n + gapY * (n - 1);
        const top = band.VT + (band.VH - blockH) / 2;
        const wMin = CW * 0.26, wMax = CW * 0.66, cx = LM + CW / 2;
        items.forEach((it, i) => {
            const w = n === 1 ? wMax : wMin + (wMax - wMin) * (i / (n - 1));
            const y = top + i * (rowH + gapY), x = cx - w / 2;
            const fill = PAL[i % PAL.length];
            s.addText(it.label, { shape: pres.shapes.RECTANGLE, x, y, w, h: rowH,
                fill: { color: fill }, line: { color: C.navy, width: 1 },
                color: onDark(fill) ? C.white : C.dark, bold: true, fontSize: F_HEAD, fontFace: FF,
                align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            if (it.note) {                                     // 주석은 층 오른쪽 여백에 붙인다
                const nx = x + w + 0.12, nw = LM + CW - nx;
                if (nw > 1.0) s.addText(it.note, { x: nx, y, w: nw, h: rowH, fontSize: F_IN, fontFace: FF,
                    color: C.muted, align: 'left', valign: 'middle', margin: 0 });
            }
        });
    };

    // quadrant — 두 축의 사분면. 축이 사라지면 의미가 사라지므로 축 라벨을 반드시 그린다.

    const renderQuadrant = (s, d) => {
        const axX = 0.30, axY = 0.42;                          // 축 라벨이 쓰는 여백(좌·하)
        const gw = CW - axY - 0.06, gh = Math.min(band.VH - axX - 0.06, 4.30);   // 밴드를 최대한 쓴다 — 칸이 좁으면 문장이 명사구로 깎인다
        const top = band.VT + (band.VH - (gh + axX)) / 2;
        const left = LM + axY;
        const gap = 0.10, cw = (gw - gap) / 2, ch = (gh - gap) / 2;
        const pos = { TL: [0, 0], TR: [1, 0], BL: [0, 1], BR: [1, 1] };
        (d.cells || []).forEach(c => {
            const p = pos[String(c.at).toUpperCase()] || [0, 0];
            const x = left + p[0] * (cw + gap), y = top + p[1] * (ch + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            s.addText(c.title, { x, y, w: cw, h: 0.40, fill: { color: C.navy }, color: C.white, bold: true,
                fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            if (c.body) s.addText(Array.isArray(c.body)
                ? c.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark,
                    bullet: { indent: 10 }, breakLine: k < c.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } }))
                : c.body,
                { x, y: y + 0.40, w: cw, h: ch - 0.40, fontSize: F_IN, fontFace: FF, color: C.dark,
                  align: 'left', valign: 'top', margin: [MG, MG, MG, MG] });
        });
        // x축: 한 줄을 3등분한다(왼쪽=low, 가운데=축 이름, 오른쪽=high). 셋을 같은 폭에 겹쳐 그리면 글자가 포개진다.
        const ax = (t, o) => { if (t) s.addText(t, { fontSize: F_CAP, fontFace: FF, color: C.muted, margin: 0, ...o }); };
        const t3 = gw / 3, ay = top + gh + 0.02;
        ax(`◀ ${d.x?.low || ''}`, { x: left, y: ay, w: t3, h: axX, align: 'left', valign: 'middle' });
        ax(d.x?.label, { x: left + t3, y: ay, w: t3, h: axX, align: 'center', valign: 'middle', bold: true });
        ax(`${d.x?.high || ''} ▶`, { x: left + 2 * t3, y: ay, w: t3, h: axX, align: 'right', valign: 'middle' });
        // y축: 회전 라벨은 상자 중심을 기준으로 돌아간다 → 좌측 여백의 중심(yCx)에 상자 중심을 맞춘다.
        const yCx = LM + axY / 2, yBoxW = Math.max(0.60, Math.min(ch, 2 * (yCx - 0.02)));
        const yAx = (t, cy) => { if (t) ax(t, { x: yCx - yBoxW / 2, y: cy - 0.15, w: yBoxW, h: 0.30, align: 'center', valign: 'middle', rotate: 270 }); };
        yAx(d.y?.high, top + ch / 2);
        yAx(d.y?.low, top + ch + gap + ch / 2);
    };

    // ===== 프론트매터 모듈 (도메인 독립: 세션1 커버/전체목차/세션목차, 세션2+ 세션목차) =====

    const renderSteps = (s, items) => {
        // 높이: 제목 1줄 + 본문 줄 수 (0.2cm 여백 포함). 밴드를 넘으면 밴드에 맞춰 자른다.
        const g = LO.item('steps', items, band.VH);                  // 치수는 layout.js가 잰다
        const { n, gap, w, h } = g;
        const top = band.VT + (band.VH - h) / 2;                     // 밴드 수직 중앙
        const fT = F_HEAD, fB = F_IN;
        items.forEach((it, i) => {
            const x = LM + i * (w + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            // 제목 헤더 — box에 내장(12 bold)
            s.addText(`${i + 1}. ${it.title}`, { x, y: top, w, h: g.head, fill: { color: C.navy }, color: C.white, bold: true, fontSize: fT, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            // 본문 — box에 내장(12), 문장 간 전후 3pt
            s.addText(it.body.map((t, k) => ({ text: t, options: { fontSize: fB, fontFace: FF, color: C.dark, bullet: { indent: g.bullet }, breakLine: k < it.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + g.head, w, h: g.alloc, valign: 'top', margin: [MG, MG, MG, MG] });
        });
        // 진행 화살표는 그리지 않는다 — 순서는 제목의 번호(1. 2. 3. …)로만 표기한다.
    };

    // versus: 2열 대비 (좌=대비 대상, 우=지향 대상)

    const renderVersus = (s, data) => {
        const cols = data;
        const g = LO.item('versus', cols, band.VH);                   // 치수는 layout.js가 잰다
        const { n, gap, w, h } = g;
        const top = band.VT + (band.VH - h) / 2;
        cols.forEach((c, i) => {
            const x = LM + i * (w + gap);
            const neg = c.negative !== undefined ? c.negative : (i === 0 && n === 2);   // 기본: 2열일 때 좌=대비
            const bar = neg ? C.failT : C.teal;
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: bar, width: 1.25 } });
            s.addText(c.title, { x, y: top, w, h: g.head, fill: { color: bar }, color: C.white, bold: true, fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(c.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark, bullet: { indent: g.bullet }, breakLine: k < c.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + g.head, w, h: g.alloc, valign: 'top', margin: [MG, MG, MG, MG] });
        });
    };

    // statement: 단문 슬라이드 — 한 문장만 크게 보여준다.
    //   교재의 모든 장이 같은 밀도(질문+리드+시각화+결론)면 강조가 사라진다. 호흡을 만드는 장이다.
    //   질문·리드·결론이 없다(계약이 예외를 판다). 대신 문장 하나가 슬라이드 전체를 쓴다.
    //   인용이면 영문 원문·저자를 10pt로 아래에 붙인다. 근거·한계는 caption, 나머지는 강사 노트로 간다.
    //   세 개체는 성격이 다르다 — 크기로 구분한다.
    //     text/quote.ko  20pt  이 슬라이드가 하려는 말
    //     note           14pt  해설. 그 말이 무슨 뜻인지(본문과 같은 크기다 — 각주가 아니다)
    //     quote.en/저자  10pt  원문·출처
    //     caption         8pt  근거·한계만. 해설을 여기 넣지 않는다(그러면 논지가 각주로 강등된다).
    //   그림은 넣지 않는다. 단문의 힘은 비어 있음에서 나온다 — 채우면 5단 슬라이드로 되돌아간다.

    const renderStatement = (s, v) => {
        const av = CW - 1.20;                              // 좌우 여백을 크게 준다 — 여백이 강조를 만든다
        // 문장은 text가 우선이다(우리말 명제). text가 없으면 인용 원문(ko)을 그대로 띄운다.
        const q = v.quote;
        const text = v.text ? String(v.text) : (q && q.ko ? `\u201C${q.ko}\u201D` : '');
        const tl = lineCount(text, av, F_STMT);
        // 인용을 근거로 한 메시지는 영문 원문 · 저자 · 출처가 따라붙는다(10pt). 이것이 인용 메시지의 기본형이다.
        // 출처는 자산에서 끌어온다 — 생성기가 쓰지 않으므로 지어낼 수 없다.
        const asset = q && q.id ? ASSETS.get(q.id) : null;
        const by = q ? `— ${q.author}${asset && asset.src ? `, ${asset.src.split(/[(—]/)[0].trim()}` : ''}` : '';
        const srcTxt = q ? `${q.en}\n${by}` : (v.source || '');
        const sl = srcTxt ? srcTxt.split('\n').reduce((a, p) => a + lineCount(p, av, F_SRC), 0) : 0;
        const nl = v.note ? lineCount(String(v.note), av, F_BODY) : 0;
        const tH = tl * 0.34, sH = sl ? sl * 0.20 + 0.10 : 0, nH = nl ? nl * 0.26 : 0;
        // 밴드에 고르게 나눈다: 위 여백 · 문장(+원문) · 사이 여백 · 해설 · 아래 여백.
        // 가운데로 몰면 위아래가 텅 비고 글이 한 덩어리로 뭉친다.
        const gap = Math.max(0.24, (band.VH - (tH + sH + nH)) / 3);
        const y1 = band.VT + gap;
        s.addText(text, { x: LM + 0.60, y: y1, w: av, h: tH, fontSize: F_STMT, bold: true, fontFace: FF,
                          color: C.navy, align: 'center', valign: 'middle', margin: 0 });
        if (srcTxt) s.addText(srcTxt, { x: LM + 0.60, y: y1 + tH + 0.10, w: av, h: sH - 0.10, fontSize: F_SRC, fontFace: FF,
                          color: C.muted, align: 'center', valign: 'top', margin: 0 });
        if (nl) s.addText(String(v.note), { x: LM + 0.60, y: y1 + tH + sH + gap, w: av, h: nH,
                          fontSize: F_BODY, fontFace: FF, color: C.dark, align: 'center', valign: 'top',
                          paraSpaceBefore: SP, paraSpaceAfter: SP, margin: 0 });
    };

    // takeaways: 세션 요약 번호 리스트 (요약 슬라이드 전용)

    const renderTakeaways = (s, items) => {
        const g = LO.takeaways(items, band.VH);                        // 치수는 layout.js가 잰다
        const { n, gap, h, blockH } = g;
        const top = band.VT + (band.VH - blockH) / 2;
        items.forEach((it, i) => {
            const y = top + i * (h + gap);
            s.addShape(pres.shapes.RECTANGLE, { x: LM, y, w: CW, h, fill: { color: C.white }, line: { color: C.lineL, width: 0.75 } });
            s.addText(`${i + 1}. ${it.title}`, { x: LM, y, w: g.titleW, h, fill: { color: C.navyLight }, fontSize: F_HEAD, fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(it.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark, breakLine: k < it.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })),
                { x: LM + g.titleW, y, w: CW - g.titleW, h, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
        });
    };


  return { autoTable, renderAutoBoxes, renderChain, renderLoop, renderShare, renderMagnitude, renderPyramid, renderQuadrant, renderSteps, renderVersus, renderStatement, renderTakeaways };
};
