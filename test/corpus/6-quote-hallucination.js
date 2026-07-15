// 결함: 인용 id 환각(자산에 없는 id) → verify "인용 '...'가 자산에 없다"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 2, title: '코퍼스', toc: [['01', '환각 인용']], slides: [
    { kind: '현상', title: '환각 인용', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      quote: { id: 'CORPUS_NOPE', ko: '자산에 없는 인용', en: 'A quote absent from the asset', author: 'Nobody' },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
