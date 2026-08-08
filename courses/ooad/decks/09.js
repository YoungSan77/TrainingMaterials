// 09.js — 교시 9 (부 3 · 책임 주도 설계(GRASP) 강의)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/grasp-source.md (즉석 생성 금지 — 이 소스를 옮긴다)
// 서술 원칙(정본 §서술 원칙 · concept-ownership-map.md §교과 계보): RDD가 주, GRASP·SOLID는 도구.
//   각 원칙 = 개념→문제→정보 소재 추론(코드)→한계→다음 연결. 탈신비화(이미 하던 것의 명명).
// 설명 예제는 NewPOS(Larman) — 실습(교시10)의 Order와 의도적으로 다른 도메인이다(정본 방침, 혼동 아님).
// codepair '절차' 쪽은 소스의 "문제" 문장에서 직접 도출한 최소 대조다 — 소스에 코드가 없는 항목
// (B-2·B-4·B-5)도 마찬가지로 그 항목의 산문 추론을 코드로 옮긴 것이지 새 내용을 지어내지 않았다.
// 분량: 소스 규모(RDD 본체 + 핵심6 + 개념3 + 닫기)가 통상 7장보다 훨씬 크다. 소스의 "1교시 넘으면
//   분할" 지침을 검토했으나, 이미 커밋된 교시10(실습)의 번호를 흔들지 않기 위해 한 교시로 유지했다
//   (판단 근거: swqm 세션도 21~24장까지 정상 렌더된 전례가 있어 장수 자체는 구조적 문제가 아니다).
//   이 판단은 결함으로 open-issues.md에 남긴다 — 시간 배분이 실제로 50분을 넘으면 재분할한다.
// 본문 11장: 학습목표1 · 현상1 · 원칙1 · 적용8(GRASP 핵심6+개념3) · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '책임을 어디 둘지 판단하는 도구(GRASP)를 정보 소재 추론으로 쓸 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'GRASP 핵심 6원칙과 의도적 조작 3원칙을 NewPOS 예로 설명하고, 각 원칙의 한계까지 말할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '본체', text: '설계가 곧 책임 배치이고, 그 판단을 GRASP가 돕는다는 관계를 안다.' },
      { head: '추론', text: '정보가 어디 있는지 추적해 책임을 배치하는 절차를 코드로 확인한다.' },
      { head: '한계', text: '각 원칙이 언제 억지가 되는지, 그 한계가 다음 원칙을 어떻게 부르는지 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시2~7(분석)에서 만든 모델에 이제 책임을 배치한다 — OOAD의 진짜 난관이 시작된다.' },
    notes: '정본: grasp-source.md §A~D. 배분 3분.'
  },

  // 02. 현상 — 설계란 무엇인가(A-1)
  {
    kind: '현상',
    title: '설계는 데이터 구조가 아니다',
    sub: '"무슨 클래스가 있나"가 아니라 "이 책임은 누가 지나"가 설계 질문이다.',
    question: '객체 설계에서 정하는 것은 무엇인가?',
    lead: { label: '정의', text: '객체 설계 = 역할(객체)에게 책임을 나눠 주고, 그 책임을 완수하도록 협력을 짜는 일이다.' },
    visual: { type: 'boxes', data: [
      { title: 'doing 책임', body: ['스스로 무언가를 하거나 다른 객체에 시킨다.'] },
      { title: 'knowing 책임', body: ['자기 데이터·파생값·관계를 안다.'] },
    ]},
    foot: { kw: '전환', color: 'navy', body: '같은 요구도 책임을 어디 두느냐로 설계가 갈린다 — 총액 계산을 바깥에 두면 절차적, Sale에 두면 객체적이다.' },
    notes: '정본: grasp-source.md §A-1·A-2. 부0에서 본 "절차 vs 객체" 동기를 책임이라는 구체적 단위로 좁힌다. 배분 4분.'
  },

  // 03. 원칙 — RDD를 하는 도구(A-3)
  {
    kind: '원칙',
    title: '책임 배치는 판단이다',
    sub: '정답표가 없어서, 판단을 돕는 도구가 필요하다 — GRASP·SOLID·DbC.',
    question: '무엇이 그 판단을 돕는가?',
    lead: { label: '관계', text: 'GRASP는 책임을 "어디" 둘지, SOLID(특히 SRP·DIP)는 그 배치가 "변화에 견디는지"를 본다 — 같은 설계를 두 각도에서 본다.' },
    visual: { type: 'boxes', data: [
      { title: 'GRASP', body: ['책임 할당 판단을 돕는 9개 관점(Larman).', 'SOLID처럼 정돈된 틀이지 유일 정답은 아니다.'] },
      { title: 'SOLID', body: ['그 배치가 변화에 견디는지(SRP·DIP 중심).'] },
      { title: 'DbC', body: ['책임에는 계약(사전·사후조건)이 따른다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: 'GRASP는 정답표가 아니다 — 이제부터 6원칙을 정보 소재 추론으로 하나씩 확인한다.' },
    notes: '정본: grasp-source.md §A-3. 배분 4분.'
  },

  // 04. 적용 — B-1 Information Expert
  {
    kind: '적용',
    title: 'Information Expert',
    sub: '정보 있는 곳에 행위를 — 책임을 그 정보를 가진 클래스에 준다.',
    question: 'Sale의 총액(grand total)은 누가 계산하나?',
    lead: { label: '추론', text: '모든 라인을 아는 자→Sale이 총액을, 수량을 아는 자→SalesLineItem이 소계를, 단가를 아는 자→ProductDescription이 가격을 각자 맡는다.' },
    visual: { type: 'codepair', data: {
      prompt: '계산 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'Money total = Money.ZERO;\nfor (var li : sale.getLineItems())\n    total = total.add(\n        li.getQty() * li.getPrice());',
          marks: [{ line: 2, tag: '바깥이 직접 순회' }] },
        { label: '적용', code: 'Money total = sale.getTotal();\n// Sale.getTotal(): 각 라인에 subtotal을 묻는다\n// SalesLineItem.getSubtotal(): qty×price',
          marks: [{ line: 1, tag: 'Information Expert' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '정보를 가졌다고 늘 책임을 주면 안 된다 — DB 저장을 Sale에 주면 응집이 무너지고 도메인이 인프라에 결합된다.' },
    notes: '정본: grasp-source.md §B-1(코드 축자, 3클래스 협력을 단가 압축). 이 한계가 다음 Pure Fabrication을 부른다. 배분 5분.'
  },

  // 05. 적용 — B-2 Creator
  {
    kind: '적용',
    title: 'Creator',
    sub: '집약·초기화 정보를 가장 많이 가진 자가 생성한다.',
    question: 'SalesLineItem을 누가 생성하나?',
    lead: { label: '추론', text: 'Sale이 SalesLineItem을 집약하고 생성에 필요한 정보를 안다 — 바깥이 조립하면 Sale의 내부 구성 규칙이 밖으로 샌다.' },
    visual: { type: 'codepair', data: {
      prompt: '생성 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'ProductDescription d = catalog.find(id);\nSalesLineItem li =\n    new SalesLineItem(d, qty);\nsale.getLineItems().add(li);',
          marks: [{ line: 2, tag: '바깥이 조립' }] },
        { label: '적용', code: 'sale.makeLineItem(id, qty);\n// Sale.makeLineItem():\n// 집약 정보로 생성 책임을 가짐',
          marks: [{ line: 1, tag: 'Creator' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '생성 로직이 복잡하거나(조건부 타입 선택) 재료가 여러 곳에 흩어지면 Creator가 억지가 된다.' },
    notes: '정본: grasp-source.md §B-2(코드는 산문 "Sale이 makeLineItem() 책임"에서 옮김). 다음: 복잡 생성 → Factory. 배분 5분.'
  },

  // 06. 적용 — B-3 Controller
  {
    kind: '적용',
    title: 'Controller',
    sub: '시스템 이벤트를 받을 첫 객체는 UI가 아니라 도메인 경계의 컨트롤러다.',
    question: 'enterItem 같은 시스템 연산을 누가 받나?',
    lead: { label: '추론', text: 'UI가 직접 도메인을 헤집으면 업무 로직이 UI로 샌다 — Register가 이벤트를 받아 도메인에 위임하면 UI와 도메인이 분리된다.' },
    visual: { type: 'codepair', data: {
      prompt: '이벤트 처리 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: '// UI 이벤트 핸들러\nProductDescription d = catalog.find(id);\nsale.makeLineItem(d, qty);   // UI가 직접 조작',
          marks: [{ line: 3, tag: 'UI가 업무 로직 소유' }] },
        { label: '적용', code: 'class Register {              // Controller\n  void enterItem(ItemID id, int qty) {\n    var d = catalog.find(id);\n    currentSale.makeLineItem(d, qty);\n  }\n}',
          marks: [{ line: 1, tag: 'Controller' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '한 컨트롤러가 모든 연산을 받으면 비대해진다(bloated controller) — 저응집이다.' },
    notes: '정본: grasp-source.md §B-3(Register 코드 축자). 다음: 유스케이스별 분리 → Application Service(아키텍처 forward-ref). 배분 5분.'
  },

  // 07. 적용 — B-4 Low Coupling
  {
    kind: '적용',
    title: 'Low Coupling',
    sub: '요소 간 의존을 낮게 — 한 곳의 변화가 번지지 않도록.',
    question: '결제 구현이 바뀌면 Sale도 흔들려야 하는가?',
    lead: { label: '추론', text: 'Sale이 결제 구현을 직접 의존하면 결제가 바뀔 때 Sale이 흔들린다 — Payment의 역할(인터페이스)만 알면 구현 교체가 무영향이다.' },
    visual: { type: 'codepair', data: {
      prompt: '결제 의존이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'class Sale {\n  CreditCardGateway gateway;   // 구체 구현 의존\n  void pay() { gateway.charge(total); }\n}',
          marks: [{ line: 2, tag: '구체 구현 의존' }] },
        { label: '적용', code: 'class Sale {\n  Payment payment;              // 역할만 의존\n  void pay() { payment.authorize(total); }\n}',
          marks: [{ line: 2, tag: 'Low Coupling' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '결합을 0으로 추구하면 오히려 인공 중개가 늘어 이해가 어려워진다 — 낮은 결합도 정도의 판단이다.' },
    notes: '정본: grasp-source.md §B-4(코드 없음 — 산문 추론을 코드로 옮김). 다음: Protected Variations·DIP(forward-ref). 배분 5분.'
  },

  // 08. 적용 — B-5 High Cohesion
  {
    kind: '적용',
    title: 'High Cohesion',
    sub: '한 요소는 밀접히 관련된 책임만 — 한 가지를 잘하게.',
    question: '한 클래스가 주문·결제·배송을 다 맡아야 하는가?',
    lead: { label: '추론', text: 'Low Coupling과 짝이다 — 책임을 응집 단위로 쪼갠다: Sale(주문), Payment(결제), Shipment(배송).' },
    visual: { type: 'codepair', data: {
      prompt: '역할이 왜 나뉘어야 하나',
      versions: [
        { label: '절차', code: 'class Sale {\n  void placeOrder() {...}\n  void processPayment() {...}\n  void arrangeShipment() {...}\n}',
          marks: [{ line: 1, tag: '저응집' }] },
        { label: '적용', code: 'class Sale { void placeOrder() {..} }\nclass Payment { void charge() {..} }\nclass Shipment { void ship() {..} }',
          marks: [{ line: 1, tag: 'High Cohesion' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '지나치게 잘게 쪼개면 협력 비용(객체 수·간접)이 커진다 — 응집도 정도의 판단이다.' },
    notes: '정본: grasp-source.md §B-5(코드 없음 — 산문 추론을 코드로 옮김). 다음: 도메인에 안 맞는 응집 덩어리 → Pure Fabrication. 배분 5분.'
  },

  // 09. 적용 — B-6 Polymorphism
  {
    kind: '적용',
    title: 'Polymorphism',
    sub: '타입에 따라 동작이 갈릴 때 조건 분기 대신 다형성으로.',
    question: '결제 수단마다 분기문이 곳곳에 번지면 무엇이 문제인가?',
    lead: { label: '추론', text: 'Payment를 다형 타입으로 만들면 새 결제 수단이 생겨도 분기문을 고치지 않고 타입만 추가한다.' },
    visual: { type: 'codepair', data: {
      prompt: '수단별 분기가 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'if (type == CASH) { ... }\nelse if (type == CREDIT) { ... }\n// 새 결제 수단마다 분기 추가',
          marks: [{ line: 1, tag: '조건 분기 번짐' }] },
        { label: '적용', code: 'interface Payment {\n  AuthResult authorize(Money amt);\n}\nclass CashPayment implements Payment {...}\nclass CreditPayment implements Payment {...}',
          marks: [{ line: 1, tag: 'Polymorphism' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '변형이 하나뿐이거나 안 늘면 다형성은 과잉(불필요한 계층)이다.' },
    notes: '정본: grasp-source.md §B-6(코드 축자). 다음: 변형을 인터페이스 뒤로 감추는 일반화 → Protected Variations·Strategy. 배분 5분.'
  },

  // 10. 적용 — C 개념 3(의도적 조작 부류)
  {
    kind: '적용',
    title: '의도적 조작 3원칙',
    sub: '정보에 충실한 배치가 결합·응집을 해칠 때, 일부러 인공물·간접층을 만든다.',
    question: '앞의 6원칙이 응집·결합을 해칠 때는 어떻게 하나?',
    lead: { label: '전환', text: '이 셋은 도메인에 없는 것을 일부러 만드는 조작이다(DIP처럼) — 지금까지의 한계 대부분이 이 셋으로 풀린다.' },
    visual: { type: 'boxes', data: [
      { title: 'Pure Fabrication', body: ['도메인 밖 인공 클래스(예: 저장을 맡는 Repository).', 'Expert 배치가 응집을 해칠 때 쓴다.'] },
      { title: 'Indirection', body: ['직접 결합을 피하는 중개자(Controller·Adapter).'] },
      { title: 'Protected Variations', body: ['변화 지점을 안정된 인터페이스로 감싼다.', 'DIP·OCP와 같은 뿌리.'] },
    ]},
    foot: { kw: '연결', color: 'navy', body: 'Protected Variations는 아키텍처의 의존성 규칙이 구조 수준에서 실현하는 바로 그 원칙이다.' },
    notes: '정본: grasp-source.md §C-1~C-3. B-1(저장)·B-5(응집 덩어리)의 한계가 Pure Fabrication으로 풀리는 연결을 짚는다. 배분 5분.'
  },

  // 11. 요약 — D 원칙에서 패턴으로
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '원칙은 단일 관점의 판단이다 — 여러 원칙의 긴장이 패턴이 된다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '단계논리', text: 'GRASP(원칙) → 디자인 패턴(Factory=복잡 Creator, Strategy=Polymorphism+PV) → 아키텍처 패턴. 원칙을 알면 패턴을 유도하고, 모르면 암기한다.' },
    visual: { type: 'takeaways', data: [
      { title: 'RDD가 주', body: ['GRASP·SOLID는 그 판단을 돕는 도구일 뿐이다.'] },
      { title: '정보 소재 추론', body: ['정보가 어디 있는지 추적하면 책임이 보인다.'] },
      { title: 'DDD 복선', body: ['GRASP는 "어디"는 주지만 "경계"는 안 준다 — 그 공백이 DDD를 부른다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '오늘 본 6원칙을 Order 도메인에서 손으로 여러 번 반복한다 — 코드는 다르지만 추론은 같다.' },
    next: '오늘 NewPOS에서 본 정보 소재 추론을 Order에 적용하면 책임이 똑같이 이동하는가.',
    notes: '정본: grasp-source.md §D. 다음 연결은 교시10(책임 분배 실습)으로 이어진다 — 도메인만 바뀐다(NewPOS→Order), 추론 절차는 같다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 9,
  title: '책임 주도 설계(GRASP) 강의',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
