// 결함: curriculum.day 누락 → verify "curriculum[0].day 없음"
module.exports = {
  curriculum: [{ items: ['제목만 있고 day가 없다'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'day 누락']], slides: [
    { kind: '현상', title: 'day 누락', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
