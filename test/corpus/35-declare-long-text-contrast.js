// 특성화 ⑤(b) 대조: 34번과 똑같은 선언문 원문을 kind '선언'이 아니라 일반 statement(kind '현상')에
// 넣으면 여전히 'statement 문장이 N줄이다' 오류가 나야 한다 — 길이 면제는 kind '선언' 전용이지
// statement 전체에 대한 완화가 아니다. gap이 아니다 — 지금도, 구현 후에도 계속 참이어야 하는
// 영구 회귀 가드다(기존 3번 케이스와 검사 대상은 같지만, 34번과 문장을 맞춰 대조로 읽는다).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 94, title: '코퍼스', toc: [['01', '현상']], slides: [
    { kind: '현상', title: '단문', visual: { type: 'statement',
      text: '품질 문제는 시스템에서 주로 발생한다. 결함 예방이 우선이고, 발생하면 바로 찾아 고친다. 시스템은 조직 영역이지만, 개선은 각자의 자리에서 시작한다.' },
      notes: 'n' }
  ] }
};
