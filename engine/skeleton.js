// ============================================================================
// skeleton.js — 슬라이드 '5단 골격' 규칙의 단일 소스.
//   master_render.js(렌더 + build lint)와 verify.js가 함께 import한다.
//   measure.js(문자폭)·quotes.js(인용 파서)와 같은 이유다: 규칙이 두 벌이면
//   언젠가 어긋난다. 실제로 statement의 필수 골격 필드가 엔진 lint(빈 목록)와
//   verify('sub')에서 갈라져, sub 없는 정상 단문이 verify에서만 오류로 떴다.
//   이 파일로 일원화하면 그 드리프트가 물리적으로 불가능해진다.
//
//   골격 = sub / question / lead / foot / visual. 논증 슬라이드는 다섯을 모두 갖는다.
//   statement(단문)는 골격을 쓰지 않는다 — 한 문장이 전부다(엔진이 sub도 렌더하지 않는다).
//
//   visual이 골격에 들어간 이유(2026-07): 시각이 없는 본문 슬라이드는 헤더·부제·질문 밴드와
//   하단 결론만 남고 가운데(y 2.3~5.7)가 통째로 빈 채 렌더된다. 실제로 그런 장이 세 개
//   만들어졌고, verify는 0/0을 냈다 — 규칙이 없으면 아무도 그 구멍을 못 본다.
//   경고로 두지 않는 이유: 경고는 쌓이면 읽히지 않고, 억제 필드를 주면 생성기가 그것을 배운다.
//   한 문장만 던질 자리라면 statement를 쓴다 — 그것이 이 예외의 용도다.
// ============================================================================
const FREE = ['statement'];   // 5단 골격을 요구하지 않는 visual.type

// 이 슬라이드가 골격 예외(statement 등)인가.
const isFree = (slide) => !!(slide && slide.visual && FREE.includes(slide.visual.type));

// 이 슬라이드가 반드시 가져야 하는 골격 필드 목록. 예외 슬라이드는 없음(빈 배열).
const requiredFields = (slide) => isFree(slide) ? [] : ['sub', 'question', 'lead', 'foot', 'visual'];

// 필드마다 '왜 필요한가'를 한 줄로. 진단이 무엇을 고쳐야 하는지까지 말해야 고쳐진다.
const HINT = {
    sub:      '헤더 아래 한 줄 요약이 빈다',
    question: '이 장이 답하는 질문이 없다',
    lead:     '핵심 한 문장(label·text)이 없다',
    foot:     '하단 결론이 빈다',
    visual:   '슬라이드 가운데가 빈 채로 렌더된다 — 한 문장만 던질 자리라면 statement를 쓴다',
};
const hint = (f) => HINT[f] ? ` — ${HINT[f]}` : '';

module.exports = { FREE, isFree, requiredFields, HINT, hint };
