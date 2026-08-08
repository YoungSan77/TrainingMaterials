// 14.js — 교시 14 (부 4 · 설계 원칙과 테스트 압력 — TDD로 설계 압력, 부4 마지막)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 4
//       ("TDD로 설계 압력 | 테스트 우선이 인터페이스·협력을 앞에서 정한다. Order에 적용")
// 도메인 소재: order-domain-definition.md §5(R2 수량)·§8(PaymentPort)
// 범위 판단: GRASP·SOLID와 달리 TDD는 원칙 카탈로그가 아니라 절차(Red-Green-Refactor)라
//   전용 소스 없이 진행했다 — Order의 기존 규칙(R2)·기존 포트(PaymentPort)에 그대로 적용한다.
// 아크(부4): 교시13(SOLID)에서 "배치가 변화에 견디나"를 봤다면, 이 교시는 "테스트가 그 배치를
//   먼저 강제하는가"를 본다 — 부4를 닫는 교시다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '테스트를 먼저 쓰면 설계 판단(검증·인터페이스)이 앞당겨짐을 코드로 확인할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'Red-Green-Refactor로 Order.addLine()을 만들고, 테스트가 PaymentPort 같은 인터페이스를 어떻게 앞당겨 요구하는지 안다.' },
    visual: { type: 'bullets', data: [
      { head: '절차', text: 'Red-Green-Refactor 세 단계를 안다.' },
      { head: '검증', text: '테스트 먼저 쓰면 R2 같은 규칙이 구현 전에 드러남을 본다.' },
      { head: '협력', text: '테스트가 어떻게 DIP(포트)를 먼저 요구하는지 본다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시13(SOLID)의 "변화에 견디나"를 이제 "테스트가 처음부터 강제하는가"로 확인한다.' },
    notes: '부4 마지막 교시. 배분 3분.'
  },

  // 02. 현상 — 구현부터 하면 놓친다
  {
    kind: '현상',
    title: '구현부터 하면 검증을 놓친다',
    sub: '먼저 만들고 나중에 테스트를 채우면, 놓친 규칙은 테스트도 안 짠다.',
    question: '구현이 먼저면 무엇을 놓치기 쉬운가?',
    lead: { label: '관찰', text: '검증을 깜빡하고 구현하면, 그 사실 자체를 모르니 테스트도 그 구멍을 그대로 통과한다.' },
    visual: { type: 'boxes', data: [
      { title: '구현이 먼저', body: ['머릿속에 있는 것만 구현하고, 빠진 건 나중에 버그로 발견한다.'] },
      { title: '테스트가 먼저', body: ['"이 규칙이 지켜지는가"를 먼저 물어야 구현할 게 뭔지 안다.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: '순서를 뒤집으면 테스트가 사후 확인이 아니라 사전 질문이 된다.' },
    notes: '부0 자세(예방/상환)와 연결 — 테스트 우선은 예방 쪽 활동이다. 배분 4분.'
  },

  // 03. 원칙 — Red-Green-Refactor
  {
    kind: '원칙',
    title: 'Red-Green-Refactor',
    sub: '실패하는 테스트 → 최소 구현으로 통과 → 정리, 순서를 지킨다.',
    question: '세 단계는 각각 무엇을 하는가?',
    lead: { label: '절차', text: 'Red(실패하는 테스트로 요구를 명세) → Green(딱 통과할 만큼만 구현) → Refactor(중복·설계 정리).' },
    visual: { type: 'boxes', data: [
      { title: 'Red', body: ['아직 없는 동작을 테스트로 먼저 요구한다.'] },
      { title: 'Green', body: ['테스트를 통과할 최소한만 구현한다.'] },
      { title: 'Refactor', body: ['테스트가 지켜주는 채로 구조를 정리한다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: 'Green에서 필요 이상 만들지 않는다 — 이것도 Just Enough(부0)의 한 적용이다.' },
    notes: '"Green에서 과잉 구현 금지"를 강조 — Just Enough 재확인. 배분 4분.'
  },

  // 04. 적용 — Red: 실패가 요구를 앞당긴다
  {
    kind: '적용',
    title: 'Red — 실패가 규칙을 드러낸다',
    sub: 'addLine()에 수량 검증(R2)이 필요하다는 걸 테스트가 먼저 말한다.',
    question: '구현 전에 무엇을 먼저 물어야 하는가?',
    lead: { label: '재료', text: 'R2(수량): 모든 라인 수량 ≥ 1 — 이 규칙을 테스트로 먼저 적어 본다.' },
    visual: { type: 'codepair', data: {
      prompt: '검증이 구현 전에 드러나는가, 구현 후에 드러나는가',
      versions: [
        { label: '구현 먼저', code: 'void addLine(ProductId id, int qty, Money price) {\n    lines.add(new OrderLine(id, qty, price));\n    // 검증을 깜빡한다\n}',
          marks: [{ line: 3, tag: '검증 없이 먼저 구현 — R2 놓침' }] },
        { label: 'Red', code: '@Test void 수량_0이면_예외() {\n  assertThrows(IllegalArgumentException.class,\n    () -> order.addLine(id, 0, price));\n}',
          marks: [{ line: 1, tag: 'Red — 실패가 R2를 먼저 드러냄' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '이 테스트가 실패한다는 사실 자체가 "검증이 아직 없다"는 걸 구현 전에 알려준다.' },
    notes: '정본: order-domain-definition.md §5(R2). Green 단계(검증 추가)는 교시9 B-1 코드와 사실상 같은 모양이 된다 — 언급만. 배분 6분.'
  },

  // 05. 적용 — 테스트가 인터페이스를 요구한다
  {
    kind: '적용',
    title: '테스트가 포트를 앞당긴다',
    sub: 'pay()를 테스트하려면 PaymentPort가 먼저 인터페이스여야 한다.',
    question: '결제를 테스트하는데 왜 실제 결제사를 부르면 안 되는가?',
    lead: { label: '추론', text: '테스트에서 실제 게이트웨이를 부르면 느리고 비결정적이다 — 목(mock)으로 대체하려면 PaymentPort가 이미 인터페이스여야 한다.' },
    visual: { type: 'boxes', data: [
      { title: '테스트 코드', body: ['PaymentPort를 mock으로 넣어 order.pay(port)를 검증한다.'] },
      { title: '강제되는 것', body: ['PaymentPort가 인터페이스가 아니면 이 테스트 자체를 못 짠다 — DIP가 테스트로 강제된다.'] },
    ]},
    foot: { kw: '연결', color: 'teal', body: '교시13에서 "개념으로" 뒤집은 의존 방향(DIP)을, 테스트가 "짤 수 있냐 없냐"로 강제한다.' },
    notes: '정본: order-domain-definition.md §8(PaymentPort). 교시13 DIP 장과 직접 연결. 배분 6분.'
  },

  // 06. 적용 — 테스트하기 어려우면 설계가 나쁜 신호
  {
    kind: '적용',
    title: '못 짜지는 테스트가 신호다',
    sub: '테스트가 어려우면 대개 설계(SRP·DIP)가 이미 깨져 있다.',
    question: '테스트를 짜기 어려운 코드는 무엇을 말해 주는가?',
    lead: { label: '판단', text: '한 클래스를 테스트하려는데 준비할 게 너무 많다면, SRP가 깨져 변경 이유가 여럿 섞여 있다는 신호다.' },
    visual: { type: 'versus', data: [
      { title: '테스트가 쉬우면', body: ['한 가지 책임만 준비하면 검증된다.', 'SRP·DIP가 대체로 지켜져 있다.'] },
      { title: '테스트가 어려우면', body: ['DB·네트워크까지 다 띄워야 검증된다.', '책임이 뒤섞였거나 구체에 의존한다.'], negative: false },
    ]},
    foot: { kw: '결론', color: 'navy', body: '"테스트하기 쉬운가"가 설계 원칙(SRP·DIP) 준수의 실측 지표가 된다.' },
    notes: '교시13 요약("변화에 견디나")을 "테스트로 짤 수 있나"로 구체화해 닫는다. 배분 5분.'
  },

  // 07. 요약 — 부4 마무리
  {
    kind: '요약',
    head: '요약',
    title: '요약 — 부 4 마무리',
    sub: '테스트 우선은 설계 판단을 구현보다 앞으로 당긴다.',
    question: '무엇을 가지고 다음 부로 가는가?',
    lead: { label: '회수', text: '부3(GRASP)의 배치, 부4(SOLID·TDD)의 내구성·검증을 거쳐, 다음은 그 배치의 "경계"를 정하는 DDD 전술이다.' },
    visual: { type: 'takeaways', data: [
      { title: 'Red-Green-Refactor', body: ['실패가 요구를, 최소 구현이 설계를, 리팩터가 정리를 담당한다.'] },
      { title: '앞당김', body: ['검증(R2)도 인터페이스(포트)도 테스트가 먼저 요구한다.'] },
      { title: '지표', body: ['테스트하기 어려움이 SRP·DIP 위반의 신호다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '책임을 어디 둘지(GRASP)는 정했다 — 이제 무엇을 하나의 모델 경계로 볼지를 본다.' },
    next: 'Order라는 경계 자체는 무엇이 정하는가 — Entity·VO·Aggregate는 무엇이 다른가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 5(교시 15 "구성요소 개관·Entity·VO·Aggregate")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 14,
  title: 'TDD로 설계 압력',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
