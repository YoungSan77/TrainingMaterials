const slide = (title) => ({ kind: '현상', claim: 'C1', title, sub: 's', question: '왜?',
  lead: { label: 'l', text: 't' },
  visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
  foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' });
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 5, title: '코퍼스', toc: [['01', '정의'], ['02', '예시']], slides: [slide('정의'), slide('예시')] }
};
