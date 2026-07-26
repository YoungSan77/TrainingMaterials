// 결함: 골격 필수 필드(foot) 누락.
// '엔진 직접 실행 경로'(node NN.js / node engine/master_render.js)가 이 결함을 fatal로
// 잡는지 고정한다. lint.js 통합 이전엔 이 경로가 render/lint.js만 거쳐 verify.js를
// 건너뛰었다 — 지금은 master_render.js가 verify.js의 verifyDeck()을 그대로 받는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 90, title: '코퍼스', toc: [['01', '필드 누락']], slides: [
    { kind: '현상', title: '필드 누락', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      notes: 'n' }
      // foot 누락
  ] }
};
