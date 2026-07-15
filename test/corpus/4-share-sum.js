// 결함: share 합계 ≠ 100(70+20=90) → verify "share 합계가 90이다"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'share 합계']], slides: [
    { kind: '원칙', title: 'share 합계', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'share', data: [ { label: '가', value: 70 }, { label: '나', value: 20 } ],
        caption: '근거·한계' },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
