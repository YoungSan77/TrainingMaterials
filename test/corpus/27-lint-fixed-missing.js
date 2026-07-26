// 결함: 설명형의 고정 장('학습 목표')이 없다.
// engine 경로에서 lint.js가 내는 문구·exit 코드를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 98, title: '코퍼스', toc: [['01', '고정 장 누락']], slides: [
    { kind: '현상', title: '고정 장 누락', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
      // '학습 목표' kind 슬라이드가 없다
  ] }
};
