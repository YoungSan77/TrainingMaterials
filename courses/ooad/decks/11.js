// 11.js — 교시 11 (부 3 · 책임 주도 설계(GRASP) 실습 2 — 통짜 대조)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 3
//       실습 소재: program-design/ooad-lab-design.md 부 3 (b) 통짜 대조(2벌) · 유스케이스 = PlaceOrder
// 아크(부3): 교시10에서 짚은 세 스니펫 쌍(계산·생성·응집)이 흩어져 있었다 — 이 교시는 그 셋을
//   PlaceOrder 하나의 통짜 코드로 합쳐서, 절차 버전과 객체 버전이 한 유스케이스 전체에서 어떻게
//   다른지 본다. lab-design.md의 물음("요구가 바뀔 때 어느 버전이 덜 흔들리나")을 그대로 따른다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'PlaceOrder 전체를 절차 버전·객체 버전으로 대조하고 확장 요구에 견주어 볼 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: '교시10의 세 스니펫(계산·생성·응집)이 PlaceOrder 하나의 통짜 코드 안에서 함께 있을 때 무엇이 다른지 짚을 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '통짜', text: '스니펫이 아니라 유스케이스 전체를 놓고 대조한다.' },
      { head: '확장', text: '새 요구(할인)가 오면 어느 버전이 덜 흔들리는지 따진다.' },
      { head: '회수', text: '교시10의 세 원칙이 이 통짜 안 어디에 있는지 찾는다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시10의 세 스니펫 쌍(O-1~O-3)이 이 교시의 재료다 — 새 코드가 아니라 합친 코드다.' },
    notes: '정본: ooad-lab-design.md 부3 (b). 배분 3분.'
  },

  // 02. 현상 — 스니펫만 보면 전체가 안 보인다
  {
    kind: '현상',
    title: '스니펫은 흩어져 있었다',
    sub: '계산·생성·응집을 따로 보면 각각은 작아 보인다 — 합치면 다르다.',
    question: '세 스니펫을 한 유스케이스에 합치면 무엇이 달라지는가?',
    lead: { label: '관찰', text: '절차 버전은 스니펫 셋이 전부 한 함수 안에 쌓인다 — 그 함수 하나가 계산도 검증도 저장도 다 떠맡는다.' },
    visual: { type: 'boxes', data: [
      { title: '스니펫으로 볼 때', body: ['각 문제(계산·생성·응집)가 독립돼 보인다.'] },
      { title: '통짜로 볼 때', body: ['한 함수 안에서 세 문제가 서로 얽혀 쌓인다.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: '실제 코드에서 문제는 스니펫처럼 따로 오지 않는다 — 한 함수 안에 함께 쌓인다.' },
    notes: '교시10에서 본 세 쌍을 합친다는 프레임을 분명히 한다. 배분 4분.'
  },

  // 03. 원칙 — 통짜 대조가 보여주는 것
  {
    kind: '원칙',
    title: '통짜로 보는 이유',
    sub: '부분 대조는 원칙을 보여주고, 통짜 대조는 판단을 보여준다.',
    question: '왜 지금 통짜로 다시 보는가?',
    lead: { label: '전환', text: 'GRASP 여섯 원칙은 개별로 판단하는 도구다 — 실제 유스케이스에서는 그 여섯이 동시에, 서로 얽혀 판단된다.' },
    visual: { type: 'boxes', data: [
      { title: '부분(교시10)', body: ['원칙 하나씩 짚었다 — Information Expert, Creator, Cohesion.'] },
      { title: '전체(이 교시)', body: ['한 유스케이스 안에서 그 셋이 동시에 판단된다.'] },
    ]},
    foot: { kw: '종합 예고', color: 'navy', body: '다음 교시(12)가 부3 전체를 종합한다 — 이 교시는 그 다리다.' },
    notes: '부3 종합(교시12)으로 넘어가는 다리라는 위치를 분명히 한다. 배분 4분.'
  },

  // 04. 적용 — PlaceOrder 통짜 대조
  {
    kind: '적용',
    title: 'PlaceOrder, 절차 vs 객체',
    sub: '계산·검증·저장을 한 함수가 다 하는 것과, 각자에게 맡기는 것.',
    question: '요구가 바뀔 때(예: 라인 할인 추가) 어느 버전이 덜 흔들리나?',
    lead: { label: '재료', text: '교시10의 세 스니펫(O-1 계산·O-2 생성·O-3 응집)을 한 유스케이스로 합친다.' },
    visual: { type: 'codepair', data: {
      prompt: '이 함수 하나가 몇 가지 책임을 지고 있나',
      versions: [
        { label: '절차', code: 'Money total = Money.ZERO;\nfor (var it : items) {\n    if (it.qty() < 1) throw new IllegalArgumentException();\n    total = total.add(it.price().times(it.qty()));\n}\nrepo.save(new OrderRecord(id, items, total, PENDING));',
          marks: [{ line: 3, tag: '검증·계산·저장을 한 함수가 다 함' }] },
        { label: '객체', code: 'Order order = Order.create(id);\nitems.forEach(it ->\n    order.addLine(it.productId(), it.qty(), it.price()));\nrepo.save(order);',
          marks: [{ line: 2, tag: 'addLine이 검증+생성(Creator)' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '절차 버전의 5줄짜리 함수 하나가, 객체 버전에서는 order.addLine() 호출로 줄고 검증·계산은 Order 안에 산다.' },
    notes: '정본: ooad-lab-design.md 부3 (b), 코드는 교시10의 O-1~O-3을 한 유스케이스로 합쳐 지었다. 배분 6분.'
  },

  // 05. 적용 — 확장 요구: 라인 할인
  {
    kind: '적용',
    title: '할인이 추가되면',
    sub: '새 요구 하나로 두 버전이 얼마나 흔들리는지 견줘 본다.',
    question: '"라인마다 10% 할인"이 추가되면 어디를 고치나?',
    lead: { label: '물음', text: 'lab-design.md가 던진 바로 그 물음 — 새 요구가 왔을 때 변경 범위가 어디까지 번지는가.' },
    visual: { type: 'versus', data: [
      { title: '절차 버전', body: ['계산 로직이 있는 모든 함수를 찾아 고친다.', '빠뜨린 곳은 버그로 남는다.'] },
      { title: '객체 버전', body: ['Order.addLine() 한 곳만 고친다.', '호출부(PlaceOrder)는 그대로다.'], negative: false },
    ]},
    foot: { kw: '결론', color: 'teal', body: '변경 범위의 차이가 바로 응집·결합의 차이다 — 교시8에서 이름 붙인 개념이 여기서 수치로 느껴진다.' },
    notes: '교시8(캡슐화·결합)과의 연결을 명시적으로 짚는다. 배분 6분.'
  },

  // 06. 적용 — 교시10 세 쌍이 여기 다 있다
  {
    kind: '적용',
    title: '세 쌍을 다시 찾으면',
    sub: '통짜 코드 안에서 O-1·O-2·O-3이 어디 있는지 짚는다.',
    question: 'Information Expert·Creator·Cohesion은 이 코드 어디에 있는가?',
    lead: { label: '회수', text: '따로 배운 세 원칙이 한 코드 안에서 동시에 판단된 결과가 order.addLine()·order.total() 두 호출이다.' },
    visual: { type: 'boxes', data: [
      { title: 'Information Expert', body: ['order.total()이 라인들에게 물어 계산한다(O-1).'] },
      { title: 'Creator', body: ['order.addLine()이 생성·검증을 함께 갖는다(O-2).'] },
      { title: 'Low·High', body: ['PlaceOrder 함수 자체가 짧아져 응집이 올라간다(O-3).'] },
    ]},
    foot: { kw: '짚기', color: 'navy', body: '세 원칙은 따로 적용되지 않는다 — 한 설계 결정(책임을 Order로) 안에 셋이 동시에 들어 있다.' },
    notes: '"원칙은 따로, 판단은 하나"라는 감각을 남긴다 — 다음 교시(종합)의 전제다. 배분 5분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '통짜로 보면 원칙 여러 개가 한 판단 안에서 동시에 작동한다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '이 교시에서 합친 PlaceOrder를 다음(마지막 실습·부3 종합)에서 Order 전체 생애 주기로 넓힌다.' },
    visual: { type: 'takeaways', data: [
      { title: '통짜', body: ['부분 대조가 아니라 유스케이스 전체로 봐야 변경 범위가 보인다.'] },
      { title: '확장', body: ['새 요구 하나의 변경 범위가 곧 결합·응집의 실측이다.'] },
      { title: '동시성', body: ['GRASP 여섯 원칙은 한 판단 안에서 함께 작동한다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: 'PlaceOrder 하나가 아니라 Order의 생애 주기 전체(생성→결제→취소)로 GRASP 판단을 넓힌다.' },
    next: 'Pay·CancelOrder까지 넓히면 같은 여섯 원칙이 또 다르게 조합되는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 3(교시 12, 부 3 종합 겸 마지막 실습)으로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 11,
  title: '책임 분배 실습 (통짜 대조)',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
