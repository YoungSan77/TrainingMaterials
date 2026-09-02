// ============================================================================
// shape.js — visual.data의 형태 단일 소스 (엔진·verify 공유)
//
//   measure.js가 '폭'의 단일 소스이듯, 이 파일은 '형태'의 단일 소스다.
//   두 벌이면 어긋난다 — 실제로 어긋났다:
//     · verify는 takeaways의 body를 배열로 가정하고(문자열이면 .reduce로 죽었다),
//       렌더러는 문자열을 요구했다(배열이면 pptxgenjs가 죽었다).
//     · 그 사이 계약(엔진 헤더)은 body:[...] 와 body 의 대괄호 유무로만 둘을 구분했다.
//       계약만 읽는 생성기는 그 차이를 신호로 읽지 못한다 → 두 번 다 크래시로만 알 수 있었다.
//
//   [설계 원칙 1] 크래시는 검증 결과가 아니라 사고다.
//   형태가 틀린 데이터는 '재기 전에' 걸러 등급 있는 메시지로 보고한다. 재면 죽는다.
//
//   [설계 원칙 2] 엔진이 고칠 수 있는 것은 오류가 아니다(stripNo 선례).
//   문자열↔배열처럼 뜻이 보존되는 차이는 conform이 보정하고 '보정했다'고 알린다(경고).
//   뜻을 복원할 수 없는 것만 오류다 — data 없음, 항목이 객체가 아님, id·라벨 없음.
//
//   [설계 원칙 3] 타입을 늘리면 여기에도 등록해야 한다.
//   verify가 엔진 TYPES와 이 표를 대조해, 등록 없는 타입은 중단시킨다(드리프트 가드).
// ============================================================================

// 필드 종류
//   'lines'  : 문자열 배열  — 항목 안에서 문단이 나뉜다(엔진이 문단마다 줄을 잡는다)
//   'text'   : 문자열       — 한 덩어리로 그린다
//   'number' : 숫자
const SHAPES = {
    // 항목 계열 — body는 전부 문단 배열(string[])이다. 타입마다 다르지 않다.
    //   (2026-07 이전에는 takeaways만 문자열이었다. 같은 계열에서 형태가 갈리면 생성기는 반드시 틀린다)
    boxes:     { data: 'list', min: 2, item: { title: 'text', body: 'lines' } },
    steps:     { data: 'list', min: 2, item: { title: 'text', body: 'lines' } },
    versus:    { data: 'list', min: 2, item: { title: 'text', body: 'lines' } },
    takeaways: { data: 'list', min: 2, item: { title: 'text', body: 'lines' } },
    // 거버닝 메시지를 받치는 근거 나열. 메시지 자체는 골격의 lead에 있으므로 여기엔 본문만 둔다.
    //   head는 선택 — 이름이 붙는 항목이면 head, 그냥 근거면 text만.
    //   boxes와의 구분은 커리큘럼의 '시각 지정'이 정한다(기계는 '명확한 앞머리'를 못 잰다).
    //   2줄 미만은 목록이 아니고(한 줄이면 lead나 statement가 맡는다), 6줄 초과는 슬라이드가 아니라 문서다.
    bullets:   { data: 'list', min: 2, max: 6, item: { text: 'richtext' }, opt: { head: 'text' } },
    table:     { data: 'rows' },
    // 단문 — data가 없다(text 또는 quote가 내용이다)
    statement: { data: 'none' },
    // 관계 계열
    flow:      { data: 'graph' },
    pipeline:  { data: 'graph' },
    loop:      { data: 'graph' },
    // 수치 계열
    share:     { data: 'list', min: 2, item: { label: 'text', value: 'number' } },
    magnitude: { data: 'list', min: 2, item: { label: 'text', value: 'number' } },
    pyramid:   { data: 'list', min: 2, item: { label: 'text' } },
    quadrant:  { data: 'quadrant' },
    // 코드 대조(N벌, 2~3) — 스니펫/통짜 대조 랩용. data = { versions:[{label,code,marks?,blanks?}], prompt? }.
    //   marks: R# 등 규칙 짚기(줄 강조) — { line, tag }. blanks: 코더 빈칸 줄 번호 배열.
    //   code는 monospace로 줄바꿈 없이 그대로 그린다(다른 타입의 'lines'처럼 문단으로 재배치하지 않는다).
    codepair:  { data: 'codepair' },
    // UML 다이어그램(PlantUML 렌더, 표준 표기) — data = { kind, source, caption? }.
    //   kind ∈ class|usecase|sequence|collaboration|state|package. source는 PlantUML 본문
    //   (@startuml/@enduml 없이 — engine/plantuml/render.js가 감싼다). 렌더는 이미지 삽입이라
    //   codepair처럼 문자열만으로 치수를 재지 못한다 — 실제로 한 번 그려 픽셀 치수를 얻는다
    //   (engine/plantuml/render.js, 결과를 캐싱해 두 번째부터는 즉시 반환).
    uml:       { data: 'uml' },
};

const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const isStr = (x) => typeof x === 'string';

// 값 하나를 선언된 종류로 맞춘다. 보정하면 사유를 fixes에 남긴다.
function conformField(host, key, kind, where, out) {
    const val = host[key];
    if (val === undefined || val === null || val === '') return;   // 선택 필드는 여기서 판정하지 않는다

    if (kind === 'lines') {
        if (Array.isArray(val)) {
            if (!val.every(isStr)) host[key] = val.map(x => String(x));
            return;
        }
        if (isStr(val)) {
            host[key] = [val];
            out.fixes.push(`${where}.${key}가 문자열이다 — 이 타입의 ${key}는 문자열 배열이다. 엔진이 [ ... ] 하나로 감싸 그린다`);
            return;
        }
        out.errors.push(`${where}.${key}의 형태를 알 수 없다(${typeof val}) — 문자열 배열이어야 한다`);
        return;
    }

    if (kind === 'text') {
        if (isStr(val)) return;
        if (Array.isArray(val)) {
            if (!val.every(isStr)) { out.errors.push(`${where}.${key} 배열에 문자열이 아닌 값이 있다`); return; }
            host[key] = val.join('\n');
            out.fixes.push(`${where}.${key}가 배열이다 — 이 타입의 ${key}는 문자열 하나다. 엔진이 줄바꿈으로 이어 그린다`);
            return;
        }
        host[key] = String(val);
        return;
    }

    if (kind === 'number') {
        if (typeof val === 'number' && isFinite(val)) return;
        const n = Number(val);
        if (!isFinite(n)) { out.errors.push(`${where}.${key}가 숫자가 아니다: ${JSON.stringify(val)}`); return; }
        host[key] = n;
        out.fixes.push(`${where}.${key}가 문자열 숫자다 — 숫자로 읽었다`);
        return;
    }

    // richtext — 'text'의 상위호환. 평문 문자열(기존 동작 그대로)이거나,
    //   [{ text, small?, break? }] run 배열이면 한 문단 안에서 run별로 다른 폰트 크기를 허용하고,
    //   break:true인 run 뒤에서 강제 줄바꿈한다(같은 bullet item 안에서 여러 줄로 나눌 때 — 예:
    //   section label을 본문과 분리하거나, 두 항목 사이에 빈 줄로 여백을 둘 때). break:true인
    //   run은 text를 생략하거나 빈 문자열로 둘 수 있다(빈 줄 전용 run).
    //   small:true인 run만 작게 그린다(엔진이 정확한 pt를 정한다 — 데이터는 pt를 지정하지 않는다).
    //   Anchor Citation(한글 정상 크기 + 영어 원문·저자 10pt)이 같은 논리적 text block이어야 하는데
    //   이전에는 이 능력이 없어 영어·저자를 별도 caption(8pt, visual 아래)으로 쪼갤 수밖에 없었다
    //   — 그 결과 caption·label 규칙과 무관하게 "하나의 Anchor Message"라는 요구 자체를 못 지켰다.
    if (kind === 'richtext') {
        if (isStr(val)) return;                              // 기존 평문 동작과 100% 동일
        if (Array.isArray(val)) {
            if (val.every(isStr)) {                           // 기존 'text'의 배열 auto-fix와 동일하게 처리
                host[key] = val.join('\n');
                out.fixes.push(`${where}.${key}가 문자열 배열이다 — 줄바꿈으로 이어 그린다`);
                return;
            }
            const bad = val.find(r => {
                if (!isObj(r)) return true;
                if (r.text !== undefined && !isStr(r.text)) return true;
                return !(r.text || r.break);                   // text 없으면 break:true(빈 줄 전용)여야 한다
            });
            if (bad !== undefined) { out.errors.push(`${where}.${key}의 각 run은 { text, small?, break? } 형태여야 한다(text는 비어있지 않은 문자열이거나, break:true인 빈 줄이어야 한다)`); return; }
            return;                                            // 유효한 run 배열 — 그대로 둔다
        }
        out.errors.push(`${where}.${key}의 형태를 알 수 없다(${typeof val}) — 문자열 또는 { text, small? } run 배열이어야 한다`);
    }
}

function conformList(v, spec, out) {
    if (!Array.isArray(v.data)) {
        out.errors.push(`data가 배열이 아니다(${v.data === undefined ? '없음' : typeof v.data}) — ${v.type}의 data는 항목 배열이다`);
        return;
    }
    if (spec.min && v.data.length < spec.min)
        out.errors.push(`data 항목이 ${v.data.length}개다 — ${v.type}은 최소 ${spec.min}개`);
    if (spec.max && v.data.length > spec.max)
        out.errors.push(`data 항목이 ${v.data.length}개다 — ${v.type}은 최대 ${spec.max}개. 넘으면 두 장으로 나누거나 table을 쓴다`);
    v.data.forEach((it, i) => {
        const where = `data[${i}]`;
        if (!isObj(it)) { out.errors.push(`${where}가 객체가 아니다(${Array.isArray(it) ? '배열' : typeof it}) — { ${Object.keys(spec.item).join(', ')} } 형태여야 한다`); return; }
        Object.entries(spec.item).forEach(([k, kind]) => conformField(it, k, kind, where, out));
        Object.entries(spec.opt || {}).forEach(([k, kind]) => conformField(it, k, kind, where, out));   // 선택 필드는 있을 때만 맞춘다
        // 필수 필드: 이 표에 적힌 것은 있어야 한다(빈 문자열도 없는 것으로 본다)
        Object.keys(spec.item).forEach(k => {
            const val = it[k];
            const empty = val === undefined || val === null || val === '' || (Array.isArray(val) && !val.length);
            if (empty && !(v.type === 'pyramid' && k === 'note'))
                out.errors.push(`${where}.${k}가 없다 — ${v.type} 항목에는 ${Object.keys(spec.item).join('·')}가 필요하다`);
        });
    });
}

function conformGraph(v, out) {
    const d = v.data;
    if (!isObj(d)) { out.errors.push(`data가 객체가 아니다 — ${v.type}의 data는 { nodes, edges? }이다`); return; }
    if (!Array.isArray(d.nodes)) { out.errors.push(`data.nodes가 배열이 아니다 — 노드를 선언한다`); return; }
    const ids = new Set();
    d.nodes.forEach((n, i) => {
        if (!isObj(n)) { out.errors.push(`data.nodes[${i}]가 객체가 아니다 — { id, label } 형태여야 한다`); return; }
        if (!n.id) out.errors.push(`data.nodes[${i}].id가 없다 — 간선이 노드를 가리킬 수 없다`);
        else if (ids.has(n.id)) out.errors.push(`data.nodes[${i}].id '${n.id}'가 중복이다`);
        else ids.add(n.id);
        if (!n.label) out.errors.push(`data.nodes[${i}].label이 없다 — 빈 도형이 그려진다`);
        else conformField(n, 'label', 'text', `data.nodes[${i}]`, out);
    });
    if (d.edges !== undefined && !Array.isArray(d.edges)) { out.errors.push(`data.edges가 배열이 아니다`); return; }
    (d.edges || []).forEach((e, i) => {
        if (!isObj(e)) { out.errors.push(`data.edges[${i}]가 객체가 아니다 — { from, to, label? } 형태여야 한다`); return; }
        if (!e.from) out.errors.push(`data.edges[${i}].from이 없다`);
        if (!e.to) out.errors.push(`data.edges[${i}].to가 없다`);
    });
}

function conformRows(v, out) {
    if (!Array.isArray(v.data) || !v.data.length) { out.errors.push(`data가 행 배열이 아니다 — table의 data는 [ [헤더...], [행...] ]이다`); return; }
    if (!v.data.every(Array.isArray)) { out.errors.push(`data의 모든 행이 배열이어야 한다 — [ [헤더...], [행...] ]`); return; }
    const w = v.data[0].length;
    v.data.forEach((r, i) => { if (r.length !== w) out.errors.push(`data[${i}]의 칸이 ${r.length}개다 — 첫 행(${w}개)과 같아야 한다`); });
}

function conformCodepair(v, out) {
    const d = v.data;
    if (!isObj(d)) { out.errors.push(`data가 객체가 아니다 — codepair의 data는 { versions, prompt? }이다`); return; }
    if (!Array.isArray(d.versions)) { out.errors.push(`data.versions가 배열이 아니다`); return; }
    const n = d.versions.length;
    if (n < 2 || n > 3) out.errors.push(`codepair 벌 수가 ${n}개다 — 대조는 2~3벌이어야 한다`);
    d.versions.forEach((ver, i) => {
        const where = `data.versions[${i}]`;
        if (!isObj(ver)) { out.errors.push(`${where}가 객체가 아니다 — { label, code, marks?, blanks? } 형태여야 한다`); return; }
        if (!ver.label) out.errors.push(`${where}.label이 없다 — 이 벌이 무엇인지(예: 스파게티·TS·리치) 밝힌다`);
        conformField(ver, 'code', 'text', where, out);          // 문자열 또는 줄 배열(엔진이 \n으로 이어붙임) 둘 다 허용
        if (!ver.code) out.errors.push(`${where}.code가 없다 — 대조할 코드가 없다`);
        const nLines = String(ver.code || '').split('\n').length;
        if (ver.marks !== undefined) {
            if (!Array.isArray(ver.marks)) out.errors.push(`${where}.marks는 배열이어야 한다 — [{ line, tag }]`);
            else ver.marks.forEach((m, k) => {
                if (!isObj(m) || !m.line || !m.tag) out.errors.push(`${where}.marks[${k}]은 { line, tag } 형태여야 한다`);
                else if (m.line < 1 || m.line > nLines) out.errors.push(`${where}.marks[${k}].line(${m.line})이 코드 줄 범위(1~${nLines}) 밖이다`);
            });
        }
        if (ver.blanks !== undefined) {
            if (!Array.isArray(ver.blanks)) out.errors.push(`${where}.blanks는 배열이어야 한다 — 줄 번호 배열`);
            else ver.blanks.forEach((ln, k) => {
                if (typeof ln !== 'number' || ln < 1 || ln > nLines) out.errors.push(`${where}.blanks[${k}](${JSON.stringify(ln)})이 코드 줄 범위(1~${nLines}) 밖이다`);
            });
        }
    });
}

// uml.source가 실제로 렌더되는지(문법이 유효한지)는 여기서 안 잰다 — 형태 검사는 '그리기
// 전에 죽지 않을 모양인가'만 본다. 렌더 실패(PlantUML 문법 오류)는 verify.js가 실제로
// 렌더를 시도할 때 오류로 잡는다(engine/plantuml/render.js가 예외를 던진다).
function conformUml(v, out) {
    const d = v.data;
    if (!isObj(d)) { out.errors.push(`data가 객체가 아니다 — uml의 data는 { kind, source, caption? }이다`); return; }
    const KINDS = ['class', 'usecase', 'sequence', 'collaboration', 'state', 'package'];
    if (!d.kind) out.errors.push(`data.kind가 없다 — ${KINDS.join('·')} 중 하나`);
    else if (!KINDS.includes(d.kind)) out.errors.push(`data.kind "${d.kind}"는 지원 범위 밖이다 — ${KINDS.join('·')} 중 하나`);
    if (!d.source || !String(d.source).trim()) out.errors.push(`data.source가 없다 — PlantUML 본문(@startuml/@enduml 없이)`);
    else conformField(d, 'source', 'text', 'data', out);
}

function conformQuadrant(v, out) {
    const d = v.data;
    if (!isObj(d)) { out.errors.push(`data가 객체가 아니다 — quadrant의 data는 { x, y, cells }이다`); return; }
    if (!Array.isArray(d.cells)) { out.errors.push(`data.cells가 배열이 아니다`); return; }
    d.cells.forEach((c, i) => {
        if (!isObj(c)) { out.errors.push(`data.cells[${i}]가 객체가 아니다 — { at, title, body? }`); return; }
        if (!c.at) out.errors.push(`data.cells[${i}].at이 없다 — TL|TR|BL|BR 중 하나`);
        if (!c.title) out.errors.push(`data.cells[${i}].title이 없다`);
        conformField(c, 'body', 'lines', `data.cells[${i}]`, out);
    });
}

// visual 하나를 선언된 형태로 맞춘다(제자리 수정).
//   반환 { errors, fixes } — errors가 있으면 재지도 그리지도 않는다.
function conform(v) {
    const out = { errors: [], fixes: [] };
    if (!isObj(v)) return out;                       // visual 없음은 형태 문제가 아니다
    const spec = SHAPES[v.type];
    if (!spec) return out;                           // 알 수 없는 타입은 호출자가 이미 잡는다
    if (spec.data === 'none') {
        if (v.data !== undefined) out.fixes.push(`${v.type}에는 data가 없다 — 무시된다(내용은 text 또는 quote로 준다)`);
        return out;
    }
    if (spec.data === 'list')     conformList(v, spec, out);
    else if (spec.data === 'graph')    conformGraph(v, out);
    else if (spec.data === 'rows')     conformRows(v, out);
    else if (spec.data === 'quadrant') conformQuadrant(v, out);
    else if (spec.data === 'codepair') conformCodepair(v, out);
    else if (spec.data === 'uml')      conformUml(v, out);
    return out;
}

// 덱 전체. 슬라이드 번호를 붙여 돌려준다(엔진·verify가 같은 표기로 보고하도록).
function conformDeck(slides, tagOf) {
    const errors = [], fixes = [];
    (slides || []).forEach((sl, i) => {
        const r = conform(sl && sl.visual);
        const tag = tagOf ? tagOf(i) : `slides[${i}]`;
        r.errors.forEach(m => errors.push(`${tag} ${m}`));
        r.fixes.forEach(m => fixes.push(`${tag} ${m}`));
    });
    return { errors, fixes };
}

module.exports = { SHAPES, conform, conformDeck };
