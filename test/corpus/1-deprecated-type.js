// 결함: 폐기된 visual.type 사용 → verify "알 수 없는 visual.type 'quotes'"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '폐기 타입']], slides: [
    { kind: '현상', title: '폐기 타입', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'quotes', data: [] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
