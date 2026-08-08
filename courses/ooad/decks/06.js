// 06.js — 교시 6 (부 1 · 분석(OOA) · 동적 모델)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 1
//       도메인 소재: program-design/order-domain-definition.md §6(상태 머신)·§7(유스케이스)·§8(포트)
// 아크(부1): 정적 모델(구조)에 이어 동적 모델(행동)을 본다 — 상호작용(누가 누구를 부르나)과
//   상태(무엇이 어떤 상태를 거치나) 두 관점. 상태 머신은 다음 실습(교시7)에서 상태도로 재사용된다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '유스케이스가 상호작용·상태 두 관점으로 어떻게 옮겨지는지 설명할 수 있다.',
    question: '이 교시가 끝나면 무엇을 설명할 수 있는가?',
    lead: { label: '도달점', text: 'PlaceOrder의 협력자 호출 순서와 Order의 상태 전이를 각각 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '상호작용', text: '유스케이스가 협력자 호출 순서로 어떻게 펼쳐지는지 안다.' },
      { head: '상태', text: '한 객체가 시간에 따라 거치는 상태를 안다.' },
      { head: '관점', text: '정적 모델과 동적 모델이 같은 대상의 다른 단면임을 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시4~5에서 그린 정적 모델(구조)이 이 교시의 재료다.' },
    notes: '"구조를 봤으니 이제 행동을 본다"는 전환을 분명히 한다. 배분 4분.'
  },

  // 02. 현상 — 구조만으로는 행동이 안 보인다
  {
    kind: '현상',
    title: '구조는 행동을 말하지 않는다',
    sub: 'Order가 어떤 속성을 가졌는지 알아도, 언제 무엇이 바뀌는지는 모른다.',
    question: '정적 모델만 보고 이 코드가 언제 어떻게 도는지 알 수 있는가?',
    lead: { label: '관찰', text: '클래스 다이어그램은 "무엇이 있는지"의 스냅샷이다 — 순서·시점·전이는 다른 표현이 필요하다.' },
    visual: { type: 'boxes', data: [
      { title: '빠진 것', body: ['PlaceOrder가 어떤 순서로 협력자를 부르는지.', 'Order가 어느 상태에서 어느 상태로 갈 수 있는지.'] },
      { title: '결과', body: ['정적 모델만으로 코드를 짜면 순서·조건을 다시 각자 판단한다.'] },
    ]},
    foot: { kw: '대가', color: 'failT', body: '구조 합의만으로는 "언제"가 합의되지 않는다 — 행동은 별도로 명시해야 한다.' },
    notes: '동적 모델의 동기. 배분 5분.'
  },

  // 03. 원칙 — 상호작용과 상태 두 관점
  {
    kind: '원칙',
    title: '두 관점, 상호작용과 상태',
    sub: '누가 누구를 부르는가(상호작용)와 무엇이 어떤 상태인가(상태)는 다른 질문이다.',
    question: '동적 모델은 무엇을 담는가?',
    lead: { label: '구조', text: '상호작용 관점은 호출 순서(시퀀스)를, 상태 관점은 한 객체의 생애 주기(상태 머신)를 담는다.' },
    visual: { type: 'boxes', data: [
      { title: '상호작용', body: ['한 유스케이스 안에서 누가 누구를 부르는 순서.'] },
      { title: '상태', body: ['한 객체가 시간에 따라 거치는 상태들과 전이.'] },
    ]},
    foot: { kw: '선택', color: 'navy', body: '모든 클래스가 상태를 가질 만큼 복잡하진 않다 — 상태가 의미 있는 대상(Order)에만 상태 관점을 쓴다.' },
    notes: '두 관점을 섞어서 한 다이어그램에 욱여넣지 않는다는 규율을 짚는다. 배분 5분.'
  },

  // 04. 적용 — 상호작용 관점: PlaceOrder 호출 순서
  {
    kind: '적용',
    title: 'PlaceOrder의 호출 순서',
    sub: '주문 생성이 어떤 협력자를 어떤 순서로 부르는가.',
    question: 'PlaceOrder는 무엇을 언제 부르는가?',
    lead: { label: '재료', text: '협력자는 새로 짓지 않는다 — order-domain-definition.md §8(포트)의 InventoryPort·OrderRepository를 그대로 쓴다.' },
    visual: { type: 'boxes', data: [
      { title: '호출 순서', body: ['1. InventoryPort로 재고 확인.', '2. Order 생성 후 OrderRepository로 저장.'] },
      { title: '주문이 아는 것', body: ['"재고 확보됨/부족"만 안다 — 창고 로직은 모른다(§8).'] },
    ]},
    foot: { kw: '짚기', color: 'teal', body: '포트는 결과만 돌려준다 — Order는 협력자 내부 구현을 모른 채로 순서만 조립한다.' },
    notes: '정본: order-domain-definition.md §8. 포트가 이미 아키텍처 과정의 재료임을 살짝 예고(forward-ref 아님, 이미 부0 확정). 배분 6분.'
  },

  // 05. 적용 — 상태 관점: Order의 상태들
  {
    kind: '적용',
    title: 'Order가 거치는 상태',
    sub: '한 주문은 생성부터 배송 완료까지 다섯 상태를 거친다.',
    question: 'Order는 어떤 상태를 가지는가?',
    lead: { label: '재료', text: '상태도 지어내지 않는다 — order-domain-definition.md §6의 5개 상태를 그대로 쓴다.' },
    visual: { type: 'versus', data: [
      { title: '진행 상태', body: ['PENDING → PAID → SHIPPED → DELIVERED.', '다음 상태로 계속 이동한다.'] },
      { title: '종료 상태', body: ['DELIVERED · CANCELLED.', '이후 전이가 없다(§6).'], negative: false },
    ]},
    foot: { kw: '짚기', color: 'teal', body: 'DELIVERED·CANCELLED는 종료 상태다 — 여기서 나가는 화살표는 없다.' },
    notes: '정본: order-domain-definition.md §6. 다음 교시(실습)에서 이 상태들을 상태도로 직접 그린다. 배분 6분.'
  },

  // 06. 적용 — 허용 전이 요약(R6)
  {
    kind: '적용',
    title: '허용되는 전이만',
    sub: '표에 없는 전이는 전부 거부한다(R6).',
    question: '상태와 상태 사이, 어떤 이동이 허용되는가?',
    lead: { label: '규칙', text: 'R6(전이 규칙): 6절 전이표에 정의된 것만 허용하고, 그 외는 모두 거부한다.' },
    visual: { type: 'boxes', data: [
      { title: 'PENDING에서', body: ['결제 완료 → PAID. 취소 → CANCELLED.'] },
      { title: 'PAID에서', body: ['배송 시작 → SHIPPED. 취소 → CANCELLED.'] },
      { title: 'SHIPPED에서', body: ['배송 완료 → DELIVERED. (취소 불가, R5)'] },
    ]},
    foot: { kw: '연결', color: 'navy', body: '이 표가 교시3의 취소 시나리오(Given-When-Then)가 나온 바로 그 근거다 — 같은 R6를 다른 형식으로 다시 본 것이다.' },
    notes: '교시3과의 연결을 명시적으로 짚는다 — "새 규칙이 아니라 같은 R6의 다른 표현". 배분 5분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '동적 모델은 상호작용(순서)과 상태(생애 주기) 두 관점으로 행동을 담는다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '오늘 본 상태 5개·전이표를 다음 교시에서 직접 상태도로 그리고 정적 모델과 대조한다.' },
    visual: { type: 'takeaways', data: [
      { title: '상호작용', body: ['PlaceOrder는 포트를 정해진 순서로 부른다.'] },
      { title: '상태', body: ['Order는 5개 상태, 종료 상태는 둘.'] },
      { title: '규칙', body: ['R6 전이표에 없는 전이는 전부 거부.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: 'Order 상태 머신을 상태도로 직접 그리고 정적 모델과 나란히 놓는다.' },
    next: '상태도로 그린 Order와 클래스 모델로 그린 Order는 같은 걸 말하는가, 다른 걸 말하는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 1(교시 7 "동적 모델 실습")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 6,
  title: '동적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
