// 결함: 세션 유형(설명형, 미선언 시 기본)에 없는 kind를 쓴다.
// 16-session-type.js와 결함은 같으나 그건 verify 경로(기본 runner)를 겨눈다.
// 이 케이스는 engine 경로에서 lint.js 자신의 문구·exit 코드를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 97, title: '코퍼스', toc: [['01', '유형 밖 kind']], slides: [
    { kind: '유령분류', title: '유형 밖 kind', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
