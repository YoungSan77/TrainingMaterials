// ============================================================================
// skeleton.js — 슬라이드 '5단 골격' 규칙의 단일 소스.
//   master_render.js(렌더 + build lint)와 verify.js가 함께 import한다.
//   measure.js(문자폭)·quotes.js(인용 파서)와 같은 이유다: 규칙이 두 벌이면
//   언젠가 어긋난다. 실제로 statement의 필수 골격 필드가 엔진 lint(빈 목록)와
//   verify('sub')에서 갈라져, sub 없는 정상 단문이 verify에서만 오류로 떴다.
//   이 파일로 일원화하면 그 드리프트가 물리적으로 불가능해진다.
//
//   골격 = sub / question / lead / foot. 논증 슬라이드는 넷을 모두 갖는다.
//   statement(단문)는 골격을 쓰지 않는다 — 한 문장이 전부다(엔진이 sub도 렌더하지 않는다).
// ============================================================================
const FREE = ['statement'];   // 5단 골격을 요구하지 않는 visual.type

// 이 슬라이드가 골격 예외(statement 등)인가.
const isFree = (slide) => !!(slide && slide.visual && FREE.includes(slide.visual.type));

// 이 슬라이드가 반드시 가져야 하는 골격 필드 목록. 예외 슬라이드는 없음(빈 배열).
const requiredFields = (slide) => isFree(slide) ? [] : ['sub', 'question', 'lead', 'foot'];

module.exports = { FREE, isFree, requiredFields };
