// 05.js — 교시 5 (부 1 · 분석(OOA) · 정적 모델 실습)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 1
//       도메인 소재: program-design/order-domain-definition.md §3~5, 유스케이스는 §7(PlaceOrder)
// 아크(부1): 교시4에서 강의로 본 절차(명사 추출 → 관계 → 승격)를 PlaceOrder 유스케이스로 손수 반복한다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'PlaceOrder 유스케이스에서 개념·관계·클래스를 손으로 직접 뽑을 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'PlaceOrder 유스케이스 텍스트에서 명사 후보를 뽑고, 관계를 긋고, 클래스로 승격할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '1단계', text: '텍스트에서 명사 후보를 뽑는다.' },
      { head: '2단계', text: '후보 사이 관계·다중성을 정한다.' },
      { head: '3단계', text: '속성·연산을 더해 클래스로 승격한다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시4의 절차를 그대로 따라가되, 이번엔 강사가 아니라 손이 한다.' },
    notes: '실습 시간이 대부분 — 절차 설명은 짧게. 배분 3분.'
  },

  // 02. 현상 — 절차를 봤다고 손이 되는 건 아니다
  {
    kind: '현상',
    title: '본 것과 할 수 있는 것은 다르다',
    sub: '강의에서 Order 예를 봤다고 PlaceOrder를 스스로 뽑을 수 있는 건 아니다.',
    question: '무엇을 놓치기 쉬운가?',
    lead: { label: '관찰', text: '후보 명사를 너무 많이 뽑거나(과잉), 너무 적게 뽑는다(무지) — Just Enough(부0 자세)가 여기서 처음 손으로 시험된다.' },
    visual: { type: 'boxes', data: [
      { title: '과잉', body: ['범위 밖 개념(재고·결제 내부)까지 끌어들인다.'] },
      { title: '무지', body: ['Money·Quantity 같은 값 개념을 속성 하나로 뭉갠다.'] },
    ]},
    foot: { kw: '기준', color: 'failT', body: '범위는 order-domain-definition.md §2가 이미 그어 놨다 — 새로 판단하지 않는다.' },
    notes: '부0 stance.just-enough를 실습에서 처음 손으로 확인하는 자리라고 짚는다. 배분 4분.'
  },

  // 03. 원칙 — 실습 절차
  {
    kind: '원칙',
    title: '3단계 절차',
    sub: '명사 뽑기 → 관계 긋기 → 클래스로 승격, 순서를 건너뛰지 않는다.',
    question: '어떤 순서로 진행하는가?',
    lead: { label: '절차', text: '교시4에서 본 순서를 그대로 따른다 — 개념부터 합의하고 나서 구현 세부(타입·메서드)로 간다.' },
    visual: { type: 'boxes', data: [
      { title: 'Step 1', body: ['유스케이스 텍스트에서 명사 후보를 표시한다.'] },
      { title: 'Step 2', body: ['후보 사이 관계·다중성을 긋는다.'] },
      { title: 'Step 3', body: ['속성에 타입을, 필요한 곳에 연산을 붙인다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: '3단계를 뒤섞지 않는다 — 타입부터 정하면 개념 합의 없이 구현으로 건너뛴다.' },
    notes: '3분 개별 → 짝 대조 방식으로 진행 가능. 배분 4분.'
  },

  // 04. 적용 — Step 1: 명사 후보 뽑기
  {
    kind: '적용',
    title: 'Step 1 — 명사 후보',
    sub: 'PlaceOrder 유스케이스 텍스트에서 후보를 표시한다.',
    question: 'PlaceOrder 텍스트에서 무엇이 명사 후보인가?',
    lead: { label: '재료', text: '유스케이스: "고객이 상품·수량을 골라 주문을 생성한다"(order-domain-definition.md §7).' },
    visual: { type: 'boxes', data: [
      { title: '뽑히는 후보', body: ['고객(Customer) · 주문(Order) · 상품 · 수량(Quantity).'] },
      { title: '뽑히지 않는 것', body: ['"고른다"는 행위 — 명사가 아니라 관계·연산 후보다.'] },
    ]},
    foot: { kw: '짚기', color: 'teal', body: '동사("고른다","생성한다")는 이 단계에서 명사 후보가 아니다 — 다음 단계(관계·연산)의 재료로 남겨둔다.' },
    notes: '동사와 명사를 섞어 뽑는 흔한 실수를 미리 짚는다. 배분 7분(개별 작업 포함).'
  },

  // 05. 적용 — Step 2: 관계·다중성
  {
    kind: '적용',
    title: 'Step 2 — 관계 긋기',
    sub: '뽑은 후보 사이에 관계와 다중성을 정한다.',
    question: 'Order는 상품과 직접 관계를 갖는가?',
    lead: { label: '재료', text: '애그리거트 경계(§4)를 다시 쓴다 — Order는 상품을 직접 참조하지 않고 OrderLine을 통해서만 관계한다.' },
    visual: { type: 'versus', data: [
      { title: '틀린 그음', body: ['Order가 상품을 직접 참조·조회한다.', '애그리거트 경계(§4)를 넘는다.'] },
      { title: '맞는 그음', body: ['Order — OrderLine(1 대 다).', 'OrderLine — 상품은 식별자만 참조(§2).'], negative: false },
    ]},
    foot: { kw: '경계', color: 'navy', body: '"Order가 상품을 직접 안다"고 그으면 애그리거트 경계를 넘는다 — 여기서 걸러야 부5에서 다시 안 틀린다.' },
    notes: '흔한 오답(Order-상품 직접 연결)을 미리 예상하고 짚는다. 배분 7분(개별 작업 포함).'
  },

  // 06. 적용 — Step 3: 클래스로 승격
  {
    kind: '적용',
    title: 'Step 3 — 클래스로 승격',
    sub: '속성에 타입을 매기고, 필요한 연산을 붙인다.',
    question: 'Order 클래스에 무엇을 더하는가?',
    lead: { label: '결과', text: '개념 모델의 "Order — 라인들을 가진다"가 클래스 모델에서 속성·연산으로 구체화된다.' },
    visual: { type: 'boxes', data: [
      { title: '속성', body: ['lines: OrderLine[] · status: OrderStatus.'] },
      { title: '연산(이름만)', body: ['total(): Money — 계산 방법은 아직 안 정한다.'] },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: 'total()을 누가 계산하는지(책임 배치)는 부 3(GRASP)에서 정식으로 다룬다.' },
    notes: '연산은 "이름만" — 몸통(구현)은 부3까지 미룬다는 걸 분명히 한다. 배분 6분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '명사 → 관계 → 승격, 세 단계로 PlaceOrder를 손으로 모델링했다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '오늘 그린 정적 모델(구조)에 다음 교시부터 동적 모델(행동)을 얹는다.' },
    visual: { type: 'takeaways', data: [
      { title: '명사', body: ['텍스트에서 뽑되 동사와 섞지 않는다.'] },
      { title: '관계', body: ['애그리거트 경계를 넘지 않게 긋는다.'] },
      { title: '승격', body: ['연산은 이름만 — 몸통은 부3으로 미룬다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '같은 Order가 시간에 따라 어떻게 상태를 바꾸는지 본다.' },
    next: 'Order가 정적으로 무엇을 가졌는지는 봤다 — 언제 무엇이 바뀌는지는 어떻게 보는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 1(교시 6 "동적 모델")로 이어진다. 배분 3분.'
  }
];

module.exports = { session: {
  no: 5,
  title: '정적 모델 실습',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
