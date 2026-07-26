// 결함: 같은 인용을 세션 안 다른 두 슬라이드에서 재사용(같은 세션 내 중복 금지 위반).
// engine 경로에서 lint.js가 내는 문구·exit 코드를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 94, title: '코퍼스', toc: [['01', '인용 재사용 1'], ['02', '인용 재사용 2']], slides: [
    { kind: '현상', title: '인용 재사용 1',
      visual: { type: 'statement', quote: { id: 'Q_LINT3', ko: '가', en: 'a', author: 'A' } }, notes: 'n' },
    { kind: '원칙', title: '인용 재사용 2',
      visual: { type: 'statement', quote: { id: 'Q_LINT3', ko: '가', en: 'a', author: 'A' } }, notes: 'n' }
  ] }
};
