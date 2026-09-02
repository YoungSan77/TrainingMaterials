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
    sub, ftr, origin, dL, addQuote, sec, tocT, K, hC,
    td, seg, eLab, nodeBox, addCaption, autoTable, renderAutoBoxes, renderChain,
    renderLoop, renderShare, renderMagnitude, renderPyramid, renderQuadrant, renderSteps, renderVersus, renderStatement,
    renderTakeaways, renderBullets, renderCodePair, renderUml,
  } = ctx;

    const addCover = () => {
        const s = pres.addSlide(); s.background = { color: C.navy };
        s.addText(DECK.book.title, { x: LM, y: 2.2, w: CW, h: 0.8, fontSize: 32, fontFace: FF, color: C.white, bold: true, align: 'center', margin: 0 });
        s.addShape(pres.shapes.LINE, { x: 3.50, y: 3.2, w: 3.0, h: 0, line: { color: C.white, width: 1.5 } });  // 중심 5.00
        s.addText(DECK.book.subtitle, { x: LM, y: 3.5, w: CW, h: 0.5, fontSize: 16, fontFace: FF, color: C.white, align: 'center', margin: 0 });
    };
    // 과정 목차: 1열로 쌓는다. 2열로 나누면 열 폭이 좁아 제목이 줄바꿈되고 목록이 지저분해진다.
    // 그룹(일자) 라벨의 'Day N —' 접두어는 벗기고 유형 제목만 남긴다(PPT 표기에 Day/세션 단어를 쓰지 않는다).
    // 세션 번호는 데이터가 아니라 위치에서 나온다 → day 순서 × items 순서 = 전역 세션 번호, 로마자로 붙인다.
    // 데이터에 번호가 이미 붙어 있어도(01. / 1) / I.) 벗기고 다시 붙인다. 번호 체계는 엔진 한 곳에서만 정한다.
    // 번호 접두어를 벗긴다. 'Session 01.' / '세션 01.' 형태도 함께 벗긴다(PPT 표기에 그 단어를 쓰지 않는다).

    const stripNo  = (t) => String(t)
        .replace(/^\s*(?:Session|세션)\s*\d+\s*[.):-]?\s*/i, '')
        .replace(/^\s*(?:[IVXLC]+|\d+)\s*[.)]\s*/i, '');

    // 'Day 1 — ' / '1일차 — ' / '1일 차 - ' 모두 벗긴다. 영어 라벨만 벗기면 한글 과정에서 접두어가 그대로 남는다.
    const stripDay = (t) => String(t)
        .replace(/^\s*Day\s*\d+\s*[—\-:.]?\s*/i, '')
        .replace(/^\s*\d+\s*일\s*차\s*[—\-:.]?\s*/, '')
        .trim();
    // 목록 블록은 내용 폭에 맞춰 잡고 가운데(살짝 왼쪽)에 놓는다. 글자는 왼쪽 정렬 — 그래야 번호가 세로로 선다.

    const listBlock = (rows, fs) => {
        const w = Math.max(...rows.map(r => textW(r, fs))) + 0.70;   // 가로 여유(글자 좌우 숨통)
        return { w: Math.min(CW, w), x: LM + Math.max(0, (CW - Math.min(CW, w))) * 0.40 };
    };

    const addFullToc = (pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        hdr(s, `과정 목차`); ftr(s, pg, '');   // 과정 목차는 특정 세션에 귀속되지 않는다 → 세션 표기 없음
        const cur = DECK.curriculum;
        const flat = [];                        // [그룹 라벨 | 세션 항목] 한 줄씩
        let sno = 0;
        cur.forEach(d => {
            flat.push({ group: stripDay(d.day) });
            d.items.forEach(t => flat.push({ no: ++sno, title: stripNo(t) }));
        });
        // 밴드를 넓게 쓴다: 구분선(0.80) 아래 한 줄 ~ 페이지 번호 위 한 줄.
        // 세로를 늘리면 규격(줄 전후 3pt)을 지키면서도 14pt가 들어간다 — 폰트를 낮출 이유가 없어진다.
        const BAND = 5.95, y0 = 1.00;
        // 줄 간격은 전 슬라이드 공통 규격(SP = 3pt 전후)을 그대로 쓴다. 목차만 예외를 두지 않는다.
        // 항목이 많으면 그때 폰트를 낮춘다. 잘라내지 않는다 — 목차는 전체가 보여야 목차다.
        let fs = F_BODY, need;
        for (const f of [F_BODY, 13, 12, 11, 10]) {
            fs = f;
            need = flat.length * (f / 72 * 1.25 + 2 * SP / 72);   // 줄 높이 + 문단 전후 간격
            if (need <= BAND) break;
        }
        const rows = flat.map(r => r.group ? r.group : `${r.no}. ${r.title}`);
        const B = listBlock(rows, fs);
        const parts = [];
        flat.forEach((r, i) => {
            const last = i === flat.length - 1;
            // 문단 간격은 전 슬라이드 공통 규격(SP = 3pt)이다. 여기만 다른 값을 쓰면 규격이 무너진다.
            if (r.group) parts.push({ text: r.group, options: { bold: true, fontSize: fs, fontFace: FF, color: C.navy,
                breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } });
            else {
                // 문단 속성은 문단을 '여는' 런(번호)에만 준다. pptxgenjs는 문단 속성을 가진 런마다
                // 그 런 앞에 <a:pPr>를 쓴다. 한 문단에 <a:pPr>가 둘이면 뷰어는 앞의 것만 읽는다
                // — 닫는 런(제목)에 주면 그 <a:pPr>가 두 번째가 되어 버려지고 3pt 간격이 사라진다.
                parts.push({ text: `${r.no}. `, options: { bold: true, fontSize: fs, fontFace: FF, color: C.navy,
                    paraSpaceBefore: SP, paraSpaceAfter: SP } });
                parts.push({ text: r.title, options: { fontSize: fs, fontFace: FF, color: C.dark, breakLine: !last } });
            }
        });
        s.addText(parts, { x: B.x, y: y0, w: B.w, h: BAND, align: 'left', valign: 'top', margin: 0 });
    };


    // 세션 목차. 슬라이드에 part가 있으면 그 라벨로 묶어 그린다.
    //   부 구분 슬라이드는 만들지 않는다 — 한 장을 넘기는 비용에 비해 얻는 게 적고,
    //   목차의 그룹 헤더와 각 장의 헤더 연번으로 위치는 충분히 전달된다.
    //   그룹 헤더 서식은 과정 목차(addFullToc)의 일자 그룹과 같다.
    const addSessionToc = (pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        hdr(s, `${RN}. ${DECK.session.title} 목차`); ftr(s, pg, SF);   // 세션 번호(1.) vs 슬라이드 연번(01.)
        const toc = DECK.session.toc || [];
        const parts = (DECK.session.slides || []).map(sl => sl.part || null);
        const hasPart = parts.some(Boolean);
        if (!hasPart) {
            const B0 = listBlock(toc.map(([n, t]) => `${n}. ${t}`), F_BODY);
            s.addText(tocT(toc), { x: B0.x, y: 1.12, w: B0.w, h: 5.62, align: 'left', valign: 'top', margin: 0 });
            return;
        }
        const rows = [];                                  // {group} | {no, title}
        let cur = null;
        toc.forEach(([n, t], i) => {
            const pt = parts[i];
            if (pt && pt !== cur) { rows.push({ group: pt }); cur = pt; }
            rows.push({ no: n, title: t });
        });
        const B = listBlock(rows.map(r => r.group ? r.group : `${r.no}. ${r.title}`), F_BODY);
        const parts2 = [];
        rows.forEach((r, i) => {
            const last = i === rows.length - 1;
            if (r.group) parts2.push({ text: r.group, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.navy,
                breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } });
            else {
                // 과정 목차(addFullToc)와 같은 규칙 — 문단 속성은 여는 런에만.
                parts2.push({ text: `${r.no}. `, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.navy,
                    paraSpaceBefore: SP, paraSpaceAfter: SP } });
                parts2.push({ text: r.title, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, breakLine: !last } });
            }
        });
        s.addText(parts2, { x: B.x, y: 1.12, w: B.w, h: 5.62, align: 'left', valign: 'top', margin: 0 });
    };
    // 세션 번호로 분기 렌더링 후, 소비한 페이지 수(본문 시작 오프셋)를 반환한다.

    const addFrontMatter = () => {
        if (DECK.session.no === 1) { addCover(); addFullToc(2); addSessionToc(3); return 3; } // 커버=p1(표기없음)/전체목차=p2/세션목차=p3
        addSessionToc(1); return 1;                                                           // 세션목차=p1
    };

    // ===== 본문 렌더러 (도메인 독립: 슬라이드 스펙 → 시각화) =====
    // 스펙: { head|kind, sub?, question?, lead?{label,text}, intro?, visual?, quote?, foot }
    // visual.type ∈ TYPES (항목: boxes|table|steps|versus|takeaways · 단문: statement
    //                  · 관계: flow|pipeline|loop · 수치: share|magnitude|pyramid|quadrant · 코드: codepair)

    const buildIntro = (intro) => sec(intro.title, C.navy, intro.items.map(([label, text]) => [
        { text: label + ': ', options: { bold: true, color: C.dark } },
        { text }
    ]));

    const toTable = (rows) => rows.map((row, r) => row.map((cell, c) =>
        r === 0 ? hC(cell) : td(cell, c === 0 ? { bold: true } : {})));

    // 질문 + 리드(라벨 문장) — 정본 패턴: 모든 본문 슬라이드 상단
    // 질문 + 리드를 하나의 배경 밴드에 내장한다(독립 텍스트 개체를 만들지 않는다).

    // lead.text가 rich-run 배열(Anchor Citation)이면 한글은 F_BODY, small:true인 run(영어 원문·
    //   저자)은 F_SRC(10pt)로 같은 문단 안에서 섞어 그린다 — 하위호환: 평문이면 기존 그대로.
    // lead.label이 빈 문자열이면 'label: ' prefix를 그리지 않는다(Anchor Message가 저자명을
    //   문장 끝에 이미 포함하면 앞쪽 label이 중복이다 — 기존 decks는 항상 비지 않은 label을
    //   쓰므로 하위호환이다).
    const addContext = (s, q, lead) => {
        const parts = []; let ln = 0;
        if (q) { parts.push({ text: q, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.navy, breakLine: !!lead, paraSpaceAfter: SP } }); ln += lines(q, CW, false, F_BODY); }
        if (lead) {
            const hasLabel = !!lead.label;
            const labelPrefix = hasLabel ? `${lead.label}: ` : '';
            if (hasLabel) parts.push({ text: labelPrefix, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.teal, paraSpaceBefore: SP } });
            if (Array.isArray(lead.text)) {
                lead.text.forEach((run) => parts.push({ text: String(run.text), options: { fontSize: run.small ? F_SRC : F_BODY, fontFace: FF, color: C.dark, paraSpaceBefore: hasLabel ? undefined : SP } }));
                ln += LO.richLineCount(lead.text, CW - PAD * 2, labelPrefix);
            } else {
                parts.push({ text: lead.text, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, paraSpaceBefore: hasLabel ? undefined : SP } });
                ln += lines(labelPrefix + lead.text, CW, false, F_BODY);
            }
        }
        if (!parts.length) return CTX_TOP;
        const h = Math.max(0.52, ln * 0.28 + PAD * 2 + 0.10);
        s.addText(parts, { shape: pres.shapes.RECTANGLE, x: LM, y: CTX_TOP, w: CW, h,
            fill: { color: C.navyLight }, line: { color: C.lineL, width: 0.75 },
            align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
        return CTX_TOP + h;
    };

    // steps: 번호 진행 박스 (절차·국면의 순차 전개)

    const renderBody = (slide, pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        // 헤더 연번: 본문 슬라이드 위치 기반 순차 번호(01부터). 분류(kind)는 데이터에만 남고 헤더에 찍지 않는다.
        // head를 직접 지정한 슬라이드(요약)도 번호를 받는다 → 'NN. {head}'.
        const seq = DECK.session.slides.indexOf(slide) + 1;
        const head = `${String(seq).padStart(2, '0')}. ${slide.head || slide.title}`;
        hdr(s, head); ftr(s, pg, SF); origin(s, slide.origin);
        const v = slide.visual;
        const free = v && FREE.includes(v.type);            // statement — 5단 골격을 쓰지 않는다
        if (slide.sub && !free) sub(s, slide.sub, slide.kind);   // statement는 헤더 아래 한 줄을 두지 않는다(한 문장이 전부다)
        // 질문/리드 밴드를 그리고 그 하단 y를 받는다.
        const ctxBottom = (free ? CTX_TOP : (addContext(s, slide.question, slide.lead) || CTX_TOP));
        if (slide.intro) s.addText(buildIntro(slide.intro), { x: LM, y: Y_START, w: CW, h: 1.0, valign: 'top', margin: 0 });
        // 시각화 밴드 = 문맥 밴드 마지막 라인 아래 ~ 하단 수평선 위. 인용이 있으면 그만큼 위로 줄인다.
        // 밴드는 layout.js가 잰다(verify와 같은 소스). statement는 하단 결론이 없으니 밴드를 더 쓰고,
        // caption(출처·한계)은 밴드에서 자기 몫을 먼저 가져간다 → 시각화가 caption을 덮지 않는다.
        const QH = slide.quote ? quoteH(slide.quote.ko, slide.quote.en, slide.quote.author) + 0.04 : 0;
        const B = LO.band({ free, question: slide.question, lead: slide.lead, QH, caption: v && v.caption });
        band.VT = B.VT; band.VH = B.VH;
        if (v) {
            if (v.type === 'boxes') renderAutoBoxes(s, 'auto', v.data);
            else if (v.type === 'table') autoTable(s, 'auto', toTable(v.data));
            else if (v.type === 'steps') renderSteps(s, v.data);
            else if (v.type === 'versus') renderVersus(s, v.data);
            else if (v.type === 'takeaways') renderTakeaways(s, v.data);
            else if (v.type === 'bullets') renderBullets(s, v.data);
            else if (v.type === 'statement') renderStatement(s, v);
            else if (v.type === 'flow' || v.type === 'pipeline') renderChain(s, v.data);
            else if (v.type === 'loop') renderLoop(s, v.data);
            else if (v.type === 'share') renderShare(s, v.data);
            else if (v.type === 'magnitude') renderMagnitude(s, v.data);
            else if (v.type === 'pyramid') renderPyramid(s, v.data);
            else if (v.type === 'quadrant') renderQuadrant(s, v.data);
            else if (v.type === 'codepair') renderCodePair(s, v.data);
            else if (v.type === 'uml') renderUml(s, v.data);
            if (v.caption) addCaption(s, v.caption);
        }
        if (slide.quote && !free) addQuote(s, slide.quote.ko, slide.quote.en, slide.quote.author);
        if (!free) {
            dL(s, Y_LINE);
            // slide.next(선택) — 커리큘럼 노드의 '다음 연결'을 저작 시점에 그대로 옮긴 문장.
            // 요약 장에서만 의미가 있지만 필드 자체는 kind를 가리지 않는다(스키마 강제 안 함).
            // foot과 같은 박스 안 새 문단으로 붙인다 — 별도 박스를 만들면 ftr(7.10)까지 남는
            // 0.20in 안에 욱여넣어야 해서 더 좁다. 이 박스는 layout.js 기하 검증을 받지 않으므로
            // (foot는 유일한 예외 밴드) 길이가 길면 verify.js의 별도 경고(§2 구현 2단계)가 잡는다.
            const nextRun = slide.next ? [
                { text: '다음: ', options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.teal, paraSpaceBefore: SP } },
                { text: slide.next, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, breakLine: true, paraSpaceBefore: SP, paraSpaceAfter: SP } },
            ] : [];
            // foot은 선택 필드다(skeleton.js 2026-09 완화) — 없으면 그리지 않는다. next만 있으면 그것만 그린다.
            const footRun = slide.foot ? K(slide.foot.kw, C[slide.foot.color] || C.navy, slide.foot.body) : [];
            if (footRun.length || nextRun.length) s.addText([...footRun, ...nextRun], { x: LM, y: Y_BOT, w: CW, h: 1.0, valign: 'top', margin: 0 });
        }
        addNotes(s, slide);
    };

    // 강사 노트 — 데이터의 notes + 인용 출처·URL(엔진이 자산에서 끌어온다).
    // 생성기는 URL을 쓰지 않는다 → 지어낼 수 없다. 인용 id 하나로 출처가 따라온다.

    const addNotes = (s, slide) => {
        const parts = [];
        if (slide.notes) parts.push(String(slide.notes).trim());
        const q = slide.quote || (slide.visual && slide.visual.quote);
        const tail = q && q.id ? noteTail(ASSETS.get(q.id)) : '';
        if (tail) parts.push(tail);
        if (parts.length) s.addNotes(parts.join('\n\n'));
    };

    // ===== 자가 점검(lint): 치명(FATAL)이면 중단하고, 경고(WARN)면 진행한다 =====
    // 기능이 "사라지는" 원인은 엔진이 아니라 데이터의 필드 누락이다. 렌더 전에 잡는다.
    //   치명 : 산출물이 계약을 위반한다 → pptx를 만들지 않는다(피드백 루프에서 놓치는 것을 막는다).
    //   경고 : 품질이 떨어질 뿐 산출물은 성립한다 → 출력하고 진행한다.
    //   --draft : 치명을 경고로 강등해 초안을 렌더한다. 파일명에 _DRAFT가 붙어 최종본과 섞이지 않는다.

  return { addCover, stripNo, stripDay, listBlock, addFullToc, addSessionToc, addFrontMatter, buildIntro, toTable, addContext, renderBody, addNotes };
};
