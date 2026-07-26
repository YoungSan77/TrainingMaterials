// 결함: 같은 인용을 한 슬라이드 안에서 두 번 쓴다(slide.quote와 slide.visual.quote가 같은 id).
// 오버레이와 전용 슬라이드에 같은 인용을 겹쳐 넣는 실수를 잡는 케이스 — engine 경로에서
// lint.js가 내는 문구를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 93, title: '코퍼스', toc: [['01', '인용 슬라이드 내 중복']], slides: [
    { kind: '현상', title: '인용 슬라이드 내 중복',
      quote: { id: 'Q_LINT2', ko: '가', en: 'a', author: 'A' },
      visual: { type: 'statement', text: '문장', quote: { id: 'Q_LINT2', ko: '가', en: 'a', author: 'A' } },
      notes: 'n' }
  ] }
};
