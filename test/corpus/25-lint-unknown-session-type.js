// 결함: session.type이 session_types.js에 없는 값이다.
// engine 경로에서 lint.js가 내는 문구·exit 코드를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 96, title: '코퍼스', type: '유령형', toc: [['01', '미등록 유형']], slides: [
    { kind: '현상', title: '미등록 유형', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
