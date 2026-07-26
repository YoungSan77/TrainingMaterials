// 결함: 골격 필수 필드(foot) 누락.
// verify.js도 같은 결함을 잡지만(skeleton.js 공유), 이 케이스는 그 검사를 verify가 아니라
// '엔진 직접 실행 경로'(master_render.js → lint())에서도 동일하게 잡는지 고정한다.
// node NN.js / node engine/master_render.js 경로는 verify를 거치지 않으므로, lint 자신의
// fatal 문구·exit 코드가 별도로 특성화돼 있어야 한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 90, title: '코퍼스', toc: [['01', '필드 누락']], slides: [
    { kind: '현상', title: '필드 누락', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      notes: 'n' }
      // foot 누락
  ] }
};
