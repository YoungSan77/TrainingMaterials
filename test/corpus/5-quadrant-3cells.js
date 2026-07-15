// 결함: quadrant 4칸 미충족(BR 없음) → verify "quadrant 사분면 'BR'이 없다"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'quadrant 부족']], slides: [
    { kind: '적용', title: 'quadrant 부족', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'quadrant', data: {
        x: { label: 'x', low: '저', high: '고' }, y: { label: 'y', low: '소', high: '대' },
        cells: [ { at: 'TL', title: 'A', body: ['a'] }, { at: 'TR', title: 'B', body: ['b'] },
                 { at: 'BL', title: 'C', body: ['c'] } ] } },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
