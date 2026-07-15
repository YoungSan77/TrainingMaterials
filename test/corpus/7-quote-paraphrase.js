// 결함: 인용 의역(자산 id는 실재하나 KO 원문을 변형) → verify "인용 'Q_ALPHA'의 KO가 자산과 다르다"
// KO만 바꾸고 EN/author는 자산과 동일하게 두어 의역 하나만 격리한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 2, title: '코퍼스', toc: [['01', '의역 인용']], slides: [
    { kind: '현상', title: '의역 인용', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      quote: { id: 'Q_ALPHA', ko: '알파 원문을 살짝 바꿔 의역한 문장이다.',
               en: 'The alpha original sentence must be preserved verbatim.', author: 'Q. Author' },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
