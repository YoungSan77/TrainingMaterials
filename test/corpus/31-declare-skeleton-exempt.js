// 특성화 ②: 선언 장은 sub/question/lead/foot가 없어도 '필수 필드 누락' 오류가 없어야 한다
// (골격 면제 회귀 가드). isFree()는 kind가 아니라 visual.type만 본다 — statement면 이미
// 면제된다. 그래서 이 사실은 kind '선언'을 신설하기 전에도 이미 참이다(다른 오류는 나도
// 이 오류만은 안 난다). 즉 '나중에 해소될 gap'이 아니라 항상 참이어야 하는 회귀 가드이지만,
// gap 메커니즘(문자열 부재 판정)을 그대로 재사용한다 — 부재를 확인하는 유일한 방법이다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 91, title: '코퍼스', toc: [['01', '선언']], slides: [
    { kind: '선언', title: '선언', visual: { type: 'statement', text: '선언문' } }
  ] }
};
