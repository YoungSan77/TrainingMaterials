// 결함: sub(명제)가 한 줄 상한을 넘는다.
//   sub는 한 줄 높이 박스이고 바로 아래(y=1.35)에 구분선이 있다. 두 줄이 되면 글자가 선을 침범한다.
//   렌더해서 눈으로 봐야만 보이던 결함이라 저자가 못 본다 — 그래서 verify가 잰다.
//   고치는 방법은 둘: 명제를 상한 이내로 줄이거나, 뒷문장을 lead로 내린다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'sub 오버플로']], slides: [
    { kind: '원칙', title: 'sub 오버플로',
      sub: '시스템은 조직과 부서와 팀과 개인 수준으로 나뉘고 각 수준마다 바꿀 수 있는 영역이 서로 다르며 조직 수준은 경영진의 몫이다.',
      question: '왜?', lead: { label: '리드', text: '텍스트' },
      visual: { type: 'bullets', data: [{ text: '항목 하나' }, { text: '항목 둘' }] },
      foot: { kw: '키워드', color: 'navy', body: '결론' }, notes: '노트' }
  ] }
};
