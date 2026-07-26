// 결함: 알 수 없는 visual.type. shape.js는 미등록 타입을 "호출자가 이미 잡는다"며 통과시키므로
// (형태 게이트에서 오류가 안 난다) lint.js의 TYPES 목록 검사가 실제로 잡는지 engine 경로에서 확인한다.
// verify.js도 같은 결함을 잡지만 문구가 다르다("— 엔진이 렌더하지 못한다" 접미사가 붙는다) —
// lint.js 자신의 문구(접미사 없음)를 따로 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 95, title: '코퍼스', toc: [['01', '미등록 타입']], slides: [
    { kind: '현상', title: '미등록 타입', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'ghosttype', data: {} },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
