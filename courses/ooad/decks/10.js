// 10.js — 교시 10 (부 3 · 책임 주도 설계(GRASP) 첫 실습 교시)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 3(교시 10~12 중 첫 교시)
//       실습 소재: program-design/ooad-lab-design.md 부 3 (a)스니펫 쌍 O-1~O-3
// 아크(부3): OOAD의 진짜 난관. 책임을 어디 둘지 손으로 여러 번 정한다.
// 렌즈: 아키텍처(규칙이 레이어를 가로질러 이동)와 다르다 — OOAD는 "절차 → 객체"로 책임이 이동한다.
//       codepair의 marks.tag에 R#(규칙 번호) 대신 GRASP 원칙 이름을 쓴다 — codepair가 QM 도메인
//       (아키텍처 R#) 밖에서도 태그 어휘가 자유로운지 이 교시에서 처음 확인한다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1(GRASP 개관) · 적용3(O-1·O-2·O-3, codepair) · 요약1
// 교시9(강의: RDD·GRASP 원칙)를 아직 안 뽑아 이 교시가 GRASP 정의를 짧게 재도입한다 — 순서상
// 원래는 교시9 다음이다(부0/부3 사이 순서 미해결은 authoring-convention.md 회귀 불변식과 무관,
// 저작 순서 문제라 별도 결함으로 취급하지 않는다 — 부1 확산 때 교시9를 채우면 자연히 메워진다).

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '같은 절차적 코드를 여러 번 객체 협력으로 옮겨 보고, 책임이 어디로 가는지 손으로 짚는다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'Information Expert·Creator·Low Coupling·High Cohesion 네 원칙으로 코드 두 벌을 보고 책임이 어디로 갔는지 짚을 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '관찰', text: '절차 코드에서 책임이 실제로 어디 놓여 있는지 짚는다.' },
      { head: '원칙', text: 'GRASP 네 원칙의 이름과 뜻을 안다.' },
      { head: '적용', text: '세 쌍의 코드 대조에서 책임 이동을 손가락으로 짚는다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '부 0에서 세운 동기(데이터와 규칙을 한 곳에)를 손으로 확인하는 자리다.' },
    notes: '교시9(GRASP 강의)를 아직 안 만들어 이 교시 03번 장이 정의를 짧게 재도입한다. 배분 3분.'
  },

  // 02. 현상 — 책임이 잘못 놓인 코드
  {
    kind: '현상',
    title: '책임이 잘못 놓인 코드',
    sub: '계산도 생성도 역할 구분도 전부 바깥 코드가 떠맡는다.',
    question: '이 코드에서 "누가 담당인지"를 어떻게 알 수 있는가?',
    lead: { label: '관찰', text: '데이터를 가진 객체가 스스로 하지 않으면, 그 데이터를 아는 모든 바깥 코드가 각자 다시 그 일을 한다.' },
    visual: { type: 'boxes', data: [
      { title: '계산이 바깥에', body: ['합계를 서비스 함수가 라인을 순회하며 계산한다.', '계산 로직이 필요한 곳마다 복제된다.'] },
      { title: '역할이 안 나뉨', body: ['한 클래스가 주문·결제·배송을 전부 안다.', '하나를 고치면 나머지도 흔들린다.'] },
    ]},
    foot: { kw: '증상', color: 'failT', body: '이 셋(계산·생성·역할)은 부 3에서 그대로 세 쌍의 대조가 된다.' },
    notes: '부 0의 "절차지향의 한계"를 GRASP 렌즈로 다시 연다 — 같은 현상, 더 정밀한 어휘. 배분 4분.'
  },

  // 03. 원칙 — GRASP 개관
  {
    kind: '원칙',
    title: 'GRASP 개관',
    sub: '책임을 어디 둘지는 네 가지 질문으로 정한다.',
    question: '이 책임은 누가 맡아야 하는가?',
    lead: { label: '지도', text: 'GRASP는 책임 배치를 위한 질문 모음이다 — 정답표가 아니라 판단 도구다.' },
    visual: { type: 'boxes', data: [
      { title: 'Information Expert', body: ['필요한 데이터를 가진 자가 그 일을 한다.'] },
      { title: 'Creator', body: ['조립에 필요한 데이터를 가장 많이 가진 자가 생성한다.'] },
      { title: 'Low Coupling / High Cohesion', body: ['적게 알수록 낮은 결합, 한 가지만 하면 높은 응집.'] },
    ]},
    foot: { kw: '적용', color: 'navy', body: '다음 세 장에서 이 네 원칙을 실제 코드 두 벌씩 대조해 확인한다.' },
    notes: '정의는 짧게만 던진다(교시9에서 정식으로 다룰 자리). 여기서는 "질문 도구"라는 프레임만 세운다. 배분 5분.'
  },

  // 04. 적용 — 쌍 O-1: 합계 계산의 책임 (Information Expert)
  {
    kind: '적용',
    title: '합계 계산의 책임',
    sub: '데이터를 가진 자가 스스로 계산하게 한다.',
    question: '합계를 누가 계산해야 하는가?',
    lead: { label: 'GRASP', text: 'Information Expert — 필요한 데이터를 가장 잘 아는 객체가 그 일을 한다.' },
    visual: { type: 'codepair', data: {
      prompt: '계산 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'Money total = Money.ZERO;\nfor (var line : order.getLines())\n    total = total.add(\n        line.getPrice().times(line.getQty()));',
          marks: [{ line: 2, tag: '남의 데이터 순회' }] },
        { label: '객체', code: 'Money total = order.total();\n\n// Order.total():\n// lines가 스스로 subtotal을 알고 합산',
          marks: [{ line: 1, tag: 'Information Expert' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '바깥 절차가 라인을 순회하던 계산이 order.total() 하나로 줄었다 — 계산 지식이 데이터를 가진 쪽으로 옮겨갔다.' },
    notes: '정본: ooad-lab-design.md 쌍 O-1(축자). 손가락으로 "누가 라인을 순회하나"를 짚게 한다. 배분 6분.'
  },

  // 05. 적용 — 쌍 O-2: 생성의 책임 (Creator)
  {
    kind: '적용',
    title: '생성의 책임',
    sub: '조립에 필요한 데이터를 가장 많이 가진 자가 만든다.',
    question: '새 라인은 누가 만들고 검증해야 하는가?',
    lead: { label: 'GRASP', text: 'Creator — Order가 자기 라인의 구성·검증 규칙을 가장 잘 안다.' },
    visual: { type: 'codepair', data: {
      prompt: '생성·검증 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'if (qty < 1)\n    throw new IllegalArgumentException("qty");\nOrderLine line =\n    new OrderLine(productId, qty, price);\norder.getLines().add(line);',
          marks: [{ line: 3, tag: '바깥이 조립' }] },
        { label: '객체', code: 'order.addLine(productId, qty, price);\n\n// Order.addLine():\n// 검증 + 생성을 한곳에서 소유(Creator)',
          marks: [{ line: 1, tag: 'Creator' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '검증과 생성이 바깥 두 줄에서 order.addLine() 하나로 — 잘못된 라인을 만들 방법이 사라졌다.' },
    notes: '쌍 O-1은 lab-design.md 축자, 이 코드는 그 설명("절차: 바깥에서 new OrderLine 조립 → 객체: Order.addLine이 생성·검증 소유")에서 이번에 지었다. 배분 6분.'
  },

  // 06. 적용 — 쌍 O-3: 결합/응집 (Low Coupling · High Cohesion)
  {
    kind: '적용',
    title: '결합과 응집',
    sub: '한 클래스가 다 아는 것과, 각자 하나만 아는 것의 차이.',
    question: '한 클래스가 주문·결제·배송을 다 알아야 하는가?',
    lead: { label: 'GRASP', text: 'Low Coupling·High Cohesion — 적게 알수록 결합이 낮고, 한 가지만 하면 응집이 높다.' },
    visual: { type: 'codepair', data: {
      prompt: '역할이 왜 나뉘어야 하나 — 결제 방식이 바뀌면 어느 쪽이 덜 흔들리나',
      versions: [
        { label: '절차', code: 'class OrderManager {\n  void placeOrder(...) { ... }\n  void chargePayment(...) { ... }\n  void arrangeShipping(...) { ... }\n}',
          marks: [{ line: 1, tag: '저응집·고결합' }] },
        { label: '객체', code: 'class Order { void addLine(...) {..} }\nclass PaymentPort { Result charge(...) {..} }\nclass ShippingPort { void ship(...) {..} }',
          marks: [{ line: 1, tag: 'High Cohesion' }, { line: 2, tag: 'Low Coupling' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '한 클래스가 셋을 다 알던 것이 셋으로 나뉘었다 — 결제 방식이 바뀌어도 PaymentPort만 흔들린다.' },
    notes: '정본: ooad-lab-design.md 쌍 O-3의 설명에서 이번에 코드를 지었다(원문엔 코드가 없었다). 다음 교시(11)의 통짜 대조(PlaceOrder 2벌)가 이 세 쌍을 한 유스케이스로 합친다. 배분 6분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '책임은 데이터를 가장 잘 아는 자에게 간다 — 계산도, 생성도, 역할도.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '이 교시에서 짚은 세 쌍(계산·생성·응집)을 다음 교시의 통짜 대조에서 한 유스케이스로 합친다.' },
    visual: { type: 'takeaways', data: [
      { title: 'Information Expert', body: ['합계는 order.total()이 스스로 안다.'] },
      { title: 'Creator', body: ['라인 생성·검증은 order.addLine()이 함께 갖는다.'] },
      { title: 'Low Coupling·High Cohesion', body: ['주문·결제·배송은 각자의 클래스로 나뉜다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '세 쌍을 한 유스케이스(PlaceOrder)로 합쳐서 통짜로 대조한다.' },
    next: '절차 버전과 객체 협력 버전, PlaceOrder 하나를 통짜로 대조하면 무엇이 다른가.',
    notes: '다음 연결은 ooad-lab-design.md 부3 (b) 통짜 대조(PlaceOrder 2벌)로 이어진다(교시 11 예정). 배분 3분.'
  }
];

module.exports = { session: {
  no: 10,
  title: '책임 분배 실습 (GRASP 1)',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
