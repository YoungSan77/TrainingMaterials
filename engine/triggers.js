// ============================================================================
// triggers.js — 시각화 트리거 판정의 단일 소스 (엔진 lint·verify 공유).
//
//   measure.js=폭 / skeleton.js=골격 / shape.js=데이터 형태 / session_types.js=세션 요건 /
//   layout.js=기하 / quotes.js=인용 파서 에 이은 여섯 번째.
//
//   이 파일 이전에는 verify.js와 render/lint.js가 claim()·hasRatio() 두 함수와
//   VTRIG(어휘 트리거) 순회 로직을 각자 복사해 갖고 있었다 — 두 벌이면 언젠가 어긋난다는
//   원칙(다른 단일 소스 파일들과 같은 이유)이 이 두 함수에는 적용돼 있지 않았다.
//
//   claimText(sl) : 이 슬라이드의 '명제 자리' 텍스트를 모은다(sub/question/lead.text/foot.body).
//                   트리거는 이 텍스트에 신호(비율·어휘)가 있는데 시각화가 그걸 안 그리면 운다.
//   hasRatio(t)    : 형태 트리거 — n:m 비율, 또는 % 두 개 이상. 도메인을 모른다.
//   어휘 트리거(VTRIG)는 도메인 자산이므로 여기 두지 않는다 — 호출부가 데이터(meta.visualTriggers)를
//   그대로 순회한다(엔진이 아는 것은 형태뿐이라는 verify.js/lint.js의 기존 설계 원칙 그대로).
// ============================================================================
const claimText = (sl) => [sl.sub, sl.question, sl.lead && sl.lead.text, sl.foot && sl.foot.body].filter(Boolean).join(' ');
const hasRatio = (t) => /\d+\s*:\s*\d+/.test(t) || (t.match(/\d+\s*%/g) || []).length >= 2;

module.exports = { claimText, hasRatio };
