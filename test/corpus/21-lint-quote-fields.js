// 결함: 인용 4필드(id/ko/en/author) 중 author 누락.
// verify.js도 같은 결함을 필드별로 개별 메시지로 잡지만, lint.js는 한 메시지로 묶어서 낸다
// (문구가 서로 다르다) — 엔진 직접 실행 경로에서 실제로 뜨는 lint 자신의 문구를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 92, title: '코퍼스', toc: [['01', '인용 필드 누락']], slides: [
    { kind: '현상', title: '인용 필드 누락',
      visual: { type: 'statement', quote: { id: 'Q_LINT1', ko: '가', en: 'a' } }, // author 누락
      notes: 'n' }
  ] }
};
