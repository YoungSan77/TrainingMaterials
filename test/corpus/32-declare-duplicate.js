// 특성화 ③: 한 세션에 선언 장이 2개면 verify가 신규 오류를 내야 한다(구현 후).
// 구현 전 지금은 kind '선언' 자체가 인식되지 않아("kind '선언'는 설명형에 없다"만 두 번 뜬다)
// 이 신규 문구가 안 뜬다 — gap:true로 기록한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 92, title: '코퍼스', toc: [['01', '선언'], ['02', '선언']], slides: [
    { kind: '선언', title: '선언1', visual: { type: 'statement', text: '선언문 하나' } },
    { kind: '선언', title: '선언2', visual: { type: 'statement', text: '선언문 둘' } }
  ] }
};
