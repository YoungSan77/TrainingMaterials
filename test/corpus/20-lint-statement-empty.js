// 결함: statement에 text도 quote도 없다 — 보여줄 문장이 없는 빈 단문.
// [lint 전용] verify.js는 골격 예외(statement)의 requiredFields가 빈 목록이라 이 결함을
// 잡지 않는다(실측 확인됨). render/lint.js의 line 27-28만 이 결함을 잡는다 — 두 검사기가
// 완전한 부분집합 관계가 아니라는 증거이므로 반드시 특성화해 둔다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 91, title: '코퍼스', toc: [['01', '빈 단문']], slides: [
    { kind: '현상', title: '빈 단문', visual: { type: 'statement' }, notes: 'n' }
      // visual.text도 visual.quote.ko도 없다
  ] }
};
