// 결함: statement 문장이 3줄 초과(20pt에서 두 줄을 넘김) → verify "statement 문장이 N줄이다"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '단문 과다']], slides: [
    { kind: '원칙', title: '단문 과다', sub: '한 문장이어야 할 자리에 문단을 넣는다',
      visual: { type: 'statement',
        text: '이 문장은 한 문장으로 끝나야 할 단문 슬라이드에 문단을 통째로 밀어 넣어 스무 포인트에서 세 줄을 훌쩍 넘기도록 일부러 아주 길고 장황하게 늘여 쓴 잘못된 예시 문장이다.' },
      notes: 'n' }
  ] }
};
