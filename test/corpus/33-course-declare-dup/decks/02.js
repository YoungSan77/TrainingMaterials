// 특성화 ④: 과정 전체 선언 개수 ≤1 검사용 — 세션 2에도 선언 1장(과정 전체로는 2개).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '세션2', toc: [['01', '선언']], slides: [
    { kind: '선언', title: '선언', visual: { type: 'statement', text: '선언문' } }
  ] }
};
