// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 1
//       도메인 소재: program-design/order-domain-definition.md §3(유비쿼터스 용어)·§4(애그리거트 경계)
// 아크(부1): 유스케이스 텍스트에서 개념(명사)·관계를 뽑아 개념 모델로, 거기에 타입·연산을 얹어
//   클래스 모델로 승격한다. 이 교시는 강의 — 손으로 직접 하는 것은 다음 교시(5, 실습)다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '개념 모델이 클래스 모델로 승격되는 과정을 설명할 수 있다.',
    question: '이 교시가 끝나면 무엇을 설명할 수 있는가?',
    lead: { label: '도달점', text: '유스케이스 텍스트에서 개념·관계를 뽑고, 거기에 타입·연산을 더해 클래스 모델로 옮기는 과정을 설명한다.' },
    visual: { type: 'bullets', data: [
      { head: '추출', text: '텍스트에서 개념(후보 명사)이 어떻게 드러나는지 안다.' },
      { head: '관계', text: '개념 사이 관계·다중성을 어떻게 정하는지 안다.' },
      { head: '승격', text: '개념 모델과 클래스 모델의 차이를 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시2~3에서 만든 유스케이스·시나리오가 이 교시의 재료다.' },
    notes: '실습(교시5)에서 손으로 할 절차를 강의로 먼저 세운다. 배분 4분.'
  },

  // 02. 현상 — 텍스트만으로는 구조가 안 보인다
  {
    kind: '현상',
    title: '텍스트에는 구조가 없다',
    sub: '유스케이스 문장은 무엇이 개념이고 무엇이 관계인지 표시하지 않는다.',
    question: '문장만 읽고 클래스를 바로 그릴 수 있는가?',
    lead: { label: '관찰', text: '"주문은 라인을 가진다"는 문장에서 Order·OrderLine이 개념인지, has가 관계인지는 사람이 판단해서 뽑아야 한다.' },
    visual: { type: 'boxes', data: [
      { title: '숨은 것', body: ['후보 명사 중 어느 것이 개념이고 어느 것이 속성인지.', '관계의 방향·다중성.'] },
      { title: '결과', body: ['같은 텍스트를 읽고도 사람마다 다른 모델을 그린다.', '합의 없이 코드로 넘어가면 나중에 어긋난다.'] },
    ]},
    foot: { kw: '대가', color: 'failT', body: '구조를 명시하지 않으면 각자의 머릿속 모델이 코드 곳곳에서 충돌한다.' },
    notes: '정적 모델의 동기 — "구조를 명시적으로 합의하는 도구"라는 프레임. 배분 5분.'
  },

  // 03. 원칙 — 개념 모델 → 클래스 모델
  {
    kind: '원칙',
    title: '개념 모델에서 클래스 모델로',
    sub: '개념 모델은 명사·관계만, 클래스 모델은 타입·연산까지 더한다.',
    question: '두 모델은 무엇이 다른가?',
    lead: { label: '단계', text: '개념 모델(후보 명사 + 관계 + 속성) → 클래스 모델(타입·가시성·연산 추가) — 정보가 점점 구체화된다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델', body: ['후보 명사(개념)와 관계·다중성.', '속성은 이름만, 타입은 아직 없다.'] },
      { title: '클래스 모델', body: ['속성에 타입을 매긴다.', '행위(연산)를 더하고 가시성을 정한다.'] },
    ]},
    foot: { kw: '순서', color: 'navy', body: '개념부터 정하지 않고 클래스로 바로 가면, 구현 세부(타입·메서드)가 개념 합의를 가려버린다.' },
    notes: '"먼저 무엇이 있는지, 그다음 어떻게 구현할지" 순서를 강조한다. 배분 6분.'
  },

  // 04. 적용 — Order 개념 후보
  {
    kind: '적용',
    title: 'Order의 개념 후보',
    sub: '유비쿼터스 용어에서 후보 명사를 그대로 가져온다.',
    question: 'Order 도메인의 개념 후보는 무엇인가?',
    lead: { label: '재료', text: '새로 짓지 않는다 — order-domain-definition.md §3(유비쿼터스 용어)를 그대로 후보로 쓴다.' },
    visual: { type: 'boxes', data: [
      { title: '핵심 개념', body: ['Order(애그리거트 루트) · OrderLine(품목 한 줄).'] },
      { title: '값 개념', body: ['Money(금액) · Quantity(수량) — 값 객체.'] },
      { title: '참조 개념', body: ['Customer · OrderStatus — 식별자·상태만 참조.'] },
    ]},
    foot: { kw: '짚기', color: 'teal', body: '값 객체(Money·Quantity)는 나중에 따로 정의한다(부 5) — 지금은 "개념 후보"로만 표시한다.' },
    notes: '정본: order-domain-definition.md §3. 값 객체 개념은 여기서 이름만, 정식 정의는 부5 forward-ref. 배분 6분.'
  },

  // 05. 적용 — 관계·다중성
  {
    kind: '적용',
    title: '개념 사이 관계',
    sub: 'Order와 OrderLine은 몇 대 몇으로 엮이는가.',
    question: '관계의 방향과 다중성을 어떻게 정하는가?',
    lead: { label: '재료', text: '관계도 지어내지 않는다 — order-domain-definition.md §4(애그리거트 경계)의 "내부 구성"이 곧 관계다.' },
    visual: { type: 'boxes', data: [
      { title: 'Order — OrderLine', body: ['1 대 다(*) — 주문 하나가 라인 여러 개를 가진다.'] },
      { title: 'OrderLine — Money·Quantity', body: ['OrderLine이 단가(Money)·수량(Quantity)을 값으로 가진다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: 'OrderLine을 Order 밖에서 직접 바꾸는 관계는 없다 — 애그리거트 경계가 곧 관계의 제약이다.' },
    notes: 'R2(수량)·R3(최소구성)가 이 관계의 다중성 제약(예: 라인 최소 1개)으로 이어진다는 걸 살짝 짚는다. 배분 6분.'
  },

  // 06. 적용 — 개념 모델 vs 클래스 모델
  {
    kind: '적용',
    title: '같은 Order, 두 모델',
    sub: '같은 개념도 어느 단계냐에 따라 담는 정보가 다르다.',
    question: '개념 모델과 클래스 모델을 나란히 보면 무엇이 늘어나는가?',
    lead: { label: '대조', text: '개념 모델의 "Order — 총액을 가진다"가 클래스 모델에서 "Order.total(): Money"로 구체화된다.' },
    visual: { type: 'versus', data: [
      { title: '개념 모델', body: ['Order는 총액을 가진다(속성 이름만).', '타입·연산은 아직 없다.'] },
      { title: '클래스 모델', body: ['total: Money — 타입이 붙는다.', 'total(): Money — 연산이 붙는다.'], negative: false },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: 'total()을 누가 계산할지(책임)는 아직 정하지 않는다 — 그건 부 3(GRASP)의 몫이다.' },
    notes: '"지금은 무엇이 있는지만, 누가 할지는 나중"이라는 경계를 분명히 한다. 배분 5분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '텍스트의 명사가 개념이 되고, 개념에 타입·연산이 붙으면 클래스가 된다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '오늘 강의로 본 절차(명사 추출 → 관계 → 승격)를 다음 교시에서 손으로 직접 한다.' },
    visual: { type: 'takeaways', data: [
      { title: '재료', body: ['개념 후보는 유비쿼터스 용어에서 온다.'] },
      { title: '관계', body: ['관계·다중성은 애그리거트 경계에서 온다.'] },
      { title: '승격', body: ['타입·연산이 붙으면 클래스 모델이 된다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: 'Order를 개념 모델·클래스 모델로 직접 그려 본다.' },
    next: 'Order의 명사·관계·클래스를 손으로 직접 뽑으면 오늘 본 것과 얼마나 같은가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 1(교시 5 "정적 모델 실습")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 4,
  title: '정적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
