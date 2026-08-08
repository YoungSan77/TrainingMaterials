// 08.js — 교시 8 (부 2 · OO 기초 — 추상화·캡슐화·다형성·상속)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 2
//       탈신비화 서술 원칙: concept-ownership-map.md §교과 계보·서술 원칙(이미 하던 것의 명명)
// 아크(부2): 부1(분석)까지 이미 써 온 개념(캡슐화=교시1 원칙, 다형성=forward-ref)에 공식 이름을 붙인다.
//   선수가 아니어도 1교시로 충분하다(커리큘럼 무게 배분) — 정의는 짧게, 다음 부에서 다시 쓰일 자리를 남긴다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '추상화·캡슐화·다형성·상속 네 개념의 이름과 뜻을 안다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: '이미 부1에서 써 온 개념 네 가지에 이름을 붙이고, 상속과 조합의 차이를 코드로 짚을 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '이름', text: '추상화·캡슐화·다형성·상속 각각의 뜻을 한 문장으로 말한다.' },
      { head: '선택', text: '상속과 조합 중 언제 무엇을 쓰는지 코드로 본다.' },
      { head: '연결', text: '이 넷이 부 3(GRASP) 이후 어디서 다시 등장하는지 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '새 개념이 아니다 — 부1에서 이미 쓴 것에 이름을 붙이는 교시다.' },
    notes: '무게 배분상 1교시로 충분(커리큘럼 §무게 배분). 배분 3분.'
  },

  // 02. 현상 — 이미 쓰고 있는데 이름이 없다
  {
    kind: '현상',
    title: '이름 없이도 이미 쓰고 있었다',
    sub: '교시1의 "객체의 동기"는 사실 캡슐화였다 — 이름을 몰랐을 뿐이다.',
    question: '왜 이제 와서 이름을 붙이는가?',
    lead: { label: '관찰', text: '이름이 없으면 판단을 남에게 전달할 수 없다 — "그 방식"이라고만 말하면 다음 사람이 못 알아듣는다.' },
    visual: { type: 'boxes', data: [
      { title: '이름이 없을 때', body: ['같은 판단을 매번 처음부터 설명해야 한다.'] },
      { title: '이름이 있을 때', body: ['"캡슐화했다"는 한 마디로 판단을 공유한다.'] },
    ]},
    foot: { kw: '탈신비화', color: 'navy', body: '이 넷은 새 지식이 아니다 — 이미 하던 판단에 붙는 이름이다(GRASP·디자인 패턴과 같은 결).' },
    notes: 'concept-ownership-map.md §교과 계보·서술 원칙과 같은 톤을 유지한다. 배분 4분.'
  },

  // 03. 원칙 — 네 개념
  {
    kind: '원칙',
    title: '네 개념, 네 이름',
    sub: '추상화·캡슐화·다형성·상속 — 각각 다른 질문에 답한다.',
    question: '넷은 각각 무엇을 다루는가?',
    lead: { label: '지도', text: '넷을 한 가지로 뭉치지 않는다 — 감출 것(캡슐화)과 공통으로 볼 것(추상화)과 재사용할 것(상속)과 갈아 끼울 것(다형성)은 다른 질문이다.' },
    visual: { type: 'boxes', data: [
      { title: '추상화', body: ['복잡한 것에서 필요한 것만 남긴다.'] },
      { title: '캡슐화', body: ['데이터와 그것을 지키는 규칙을 한 곳에 감춘다.'] },
      { title: '다형성', body: ['타입마다 다른 동작을 같은 이름으로 부른다.'] },
    ]},
    foot: { kw: '넷째', color: 'navy', body: '상속은 다음 장에서 조합과 나란히 코드로 본다 — 정의만으로는 언제 쓸지 안 갈리기 때문이다.' },
    notes: '상속을 이 장의 boxes에서 빼고 다음 장(코드 대조)으로 미룬다 — "정의는 짧게" 원칙. 배분 5분.'
  },

  // 04. 적용 — 상속 vs 조합
  {
    kind: '적용',
    title: '상속인가 조합인가',
    sub: '할인 정책을 코드로 얹는 두 가지 방법.',
    question: 'VIP 할인을 어떻게 얹는가?',
    lead: { label: '물음', text: 'Order를 상속해 만들 것인가, Order 안에 정책을 부품으로 끼워 넣을 것인가.' },
    visual: { type: 'codepair', data: {
      prompt: '할인 정책이 바뀌면 어느 쪽이 덜 흔들리나',
      versions: [
        { label: '상속', code: 'class VipOrder extends Order {\n  Money total() {\n    return super.total().times(0.9);\n  }\n}',
          marks: [{ line: 1, tag: '상위 구현에 결합' }] },
        { label: '조합', code: 'class Order {\n  DiscountPolicy discount;\n  Money total() {\n    return discount.apply(rawTotal());\n  }\n}',
          marks: [{ line: 2, tag: '정책을 부품으로 교체' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '할인 종류가 늘면 상속은 클래스가 늘고, 조합은 정책 구현체만 늘어난다 — "합성 우선"이 여기서 나온다.' },
    notes: 'GoF "상속보다 합성을 선호하라"의 최소 예. R1(합계) 규칙 자체는 안 바꾼다 — 정책은 R1 위에 얹는 예시일 뿐. 배분 6분.'
  },

  // 05. 적용 — 캡슐화로 데이터를 감춘다
  {
    kind: '적용',
    title: '캡슐화 다시 보기',
    sub: 'Order의 라인 목록을 밖에 그대로 노출하면 무엇이 깨지나.',
    question: '왜 lines를 public으로 두지 않는가?',
    lead: { label: '재확인', text: '교시1에서 세운 동기(데이터와 규칙을 한 곳에)를 여기서 "캡슐화"라는 이름으로 다시 확인한다.' },
    visual: { type: 'versus', data: [
      { title: '노출하면', body: ['바깥에서 라인을 직접 추가·삭제한다.', 'R2(수량)·R3(최소구성)를 아무도 안 지킨다.'] },
      { title: '감추면', body: ['addLine() 하나로만 바꾼다.', 'R2·R3를 그 메서드 하나가 지킨다.'], negative: false },
    ]},
    foot: { kw: '연결', color: 'teal', body: '이게 부3의 Information Expert가 하는 일이다 — 캡슐화된 데이터를 가진 자가 그 데이터를 다루는 책임도 가진다.' },
    notes: '교시1의 원칙 장(절차 vs 객체)과 같은 예를 다른 이름(캡슐화)으로 다시 짚는다 — 반복이 아니라 이름 붙이기. 배분 5분.'
  },

  // 06. 적용 — 다음 부에서 다시 쓰인다
  {
    kind: '적용',
    title: '이 넷은 여기서 끝나지 않는다',
    sub: '부 3~5에서 같은 개념이 다른 이름의 도구로 다시 나온다.',
    question: '오늘 배운 이름은 어디서 다시 만나는가?',
    lead: { label: '지도', text: '넷 다 이후 부에서 더 정밀한 도구로 재등장한다 — 오늘은 그 이름만 미리 심어 둔다.' },
    visual: { type: 'boxes', data: [
      { title: '캡슐화·추상화', body: ['부3 Information Expert · Low Coupling.'] },
      { title: '다형성', body: ['부3 Polymorphism · Protected Variations.'] },
      { title: '상속·조합', body: ['부3 Creator(복잡 생성) · 부5 DDD 전술.'] },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: '지금은 이름만 — 각 도구가 "왜" 그렇게 판단하는지는 해당 부에서 정식으로 다룬다.' },
    notes: '부3(교시9)로 넘어가기 전 마지막 다리. 배분 4분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '넷 다 이미 쓰던 판단이었다 — 오늘은 그 판단에 이름을 붙였다.',
    question: '무엇을 가지고 다음 부로 가는가?',
    lead: { label: '회수', text: '이름이 붙은 네 개념을 가지고, 이제 "책임을 어디 둘지"를 판단하는 도구(GRASP)로 들어간다.' },
    visual: { type: 'takeaways', data: [
      { title: '이름', body: ['추상화·캡슐화·다형성·상속, 넷의 뜻.'] },
      { title: '선택', body: ['상속보다 조합이 나은 경우를 코드로 짚었다.'] },
      { title: '재등장', body: ['넷은 부3~5에서 더 정밀한 도구로 다시 나온다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '책임을 어디 둘지 판단하는 도구(RDD·GRASP)로 들어간다 — OOAD의 진짜 난관이 시작된다.' },
    next: '책임은 무엇으로 판단해서 배치하는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 3(교시 9 "RDD·GRASP 원칙")으로 이어진다 — 이미 만들어져 있다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 8,
  title: 'OO 기초',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
