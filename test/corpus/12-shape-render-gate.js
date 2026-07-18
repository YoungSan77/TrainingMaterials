// 결함: body가 문자열도 배열도 아니다(복원 불가).
// 이 케이스가 겨누는 것은 verify가 아니라 '엔진의 형태 게이트'다.
// 예전에는 verify가 통과시킨 데이터가 pptxgenjs 안에서 TypeError로 죽었다(게이트가 검사 뒤에 있었다).
// 지금은 렌더 전에 등급 있는 [중단] 메시지로 세운다 — 스택 트레이스로 되돌아가면 이 케이스가 잡는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '렌더 게이트']], slides: [
    { kind: '원칙', title: '렌더 게이트', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'takeaways', data: [
        { title: '가', body: 42 },
        { title: '나', body: ['정상 본문'] } ] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
