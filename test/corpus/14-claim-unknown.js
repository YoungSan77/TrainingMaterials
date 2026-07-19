// 결함: 슬라이드의 claim이 커리큘럼 명제 목록에 없다(오타·환각).
// 커리큘럼이 '무엇을 말할지'를 정하고 덱이 '어떻게 말할지'를 정한다 — 그 연결을 재지 않으면
// 생성기가 커리큘럼과 무관한 교재를 만들어도 아무도 모른다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 2, title: '코퍼스', toc: [['01', '명제 불일치']], slides: [
    { kind: '현상', claim: 'C404', title: '명제 불일치', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [
        { title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] } ] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
