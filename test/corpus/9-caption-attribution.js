// 결함: caption에 저자·출처(문장 아래 10pt가 이미 다는 것을 8pt caption에 중복) → verify "caption에 저자·출처가 들어 있다"
// 인용 원문은 자산과 정확히 일치시키고(의역 아님), caption에 저자명만 넣어 이 경고 하나를 격리한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 2, title: '코퍼스', toc: [['01', 'caption 저자']], slides: [
    { kind: '원칙', title: 'caption 저자', sub: '인용을 크게 던지는 단문',
      visual: { type: 'statement',
        quote: { id: 'Q_ALPHA', ko: '알파 원문 문장은 이대로 보존되어야 한다.',
                 en: 'The alpha original sentence must be preserved verbatim.', author: 'Q. Author' },
        caption: '출처 확인: Q. Author, Alpha Source' },
      notes: 'n' }
  ] }
};
