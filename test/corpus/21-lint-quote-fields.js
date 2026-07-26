// 결함: 인용 4필드(id/ko/en/author) 중 author 누락.
// '엔진 직접 실행 경로'가 이 결함을 fatal로 잡는지 고정한다. verify.js는 필드별로
// 개별 메시지를 낸다("인용 1번 author 누락") — lint.js 시절엔 한 메시지로 뭉뚱그렸지만
// 통합 후 verify.js가 정본이라 더 정밀한 이 문구가 그대로 engine 경로에도 나온다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 92, title: '코퍼스', toc: [['01', '인용 필드 누락']], slides: [
    { kind: '현상', title: '인용 필드 누락',
      visual: { type: 'statement', quote: { id: 'Q_LINT1', ko: '가', en: 'a' } }, // author 누락
      notes: 'n' }
  ] }
};
