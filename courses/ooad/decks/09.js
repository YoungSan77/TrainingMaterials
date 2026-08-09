// 09.js — 교시 9 (부 3 · 책임 주도 설계(GRASP) 강의) — 개정판(grasp-source.md 개정판 반영)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/grasp-source.md 개정판(즉석 생성 금지)
// 개정 사유: 초판 소스가 RDD·정의를 얇게 적어 슬라이드가 "이름만" 남았다 — 개정 소스는 RDD 본체를
//   Wirfs-Brock 출전·데이터 주도 설계와의 대비·아는/하는 책임·역할 목록까지 두껍게 편다. 이번판은
//   그 두께를 그대로 옮기고, authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기
//   규약)을 새로 세워 따른다.
// 원작자·출전(slide.origin, engine 신설 필드): RDD는 A-1 슬라이드, GRASP·SOLID는 A-3 슬라이드에만
//   표시한다(개념 수준에만 — 개별 원칙엔 안 붙임, grasp-source.md §원작자·출전 표시 규약).
// 서술 원칙: RDD가 주, GRASP·SOLID는 도구. 탈신비화(이미 하던 것의 명명). 설명 예제는 NewPOS —
//   실습(교시10~12)의 Order와 의도적으로 다른 도메인이다(정본 방침).
// 분량 판단(OI-4 연장): A절이 두꺼워지며 본문이 계속 12장이다(A 3장은 유지, 내용만 깊어짐) — swqm
//   세션 전례(21~24장) 범위 안이라 구조적 문제로 보지 않지만, 실측 시간이 50분을 넘으면 분할이
//   다시 검토 대상이다(기록만, 번호 정리는 OOAD 완성 후 일괄).
// 본문 12장: 학습목표1 · 현상1(A-1) · 원칙2(A-2·A-3) · 적용6(B-1~B-6) · 적용1(C 개념3) · 요약1(D)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '책임을 어디 둘지 판단하는 도구를 정보 소재 추론으로 쓸 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: '책임 주도 설계(Responsibility-Driven Design, RDD)가 왜 필요한지 설명하고, 그 도구인 GRASP 여섯 원칙을 NewPOS 예로 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '본체', text: '설계가 곧 책임 배치이며, RDD가 그 판단의 이름임을 안다.' },
      { head: '추론', text: '정보가 어디에 있는지 추적해 책임을 배치하는 절차를 문장으로 설명한다.' },
      { head: '한계', text: '각 원칙이 언제 억지가 되는지, 그 한계가 다음 원칙을 어떻게 부르는지 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시2~7(분석)에서 만든 모델에 이제 책임을 배치한다 — OOAD의 진짜 난관이 시작된다.' },
    notes: '정본: grasp-source.md §A~D. 배분 3분.'
  },

  // 02. 현상 — 책임 주도 설계(RDD)란 무엇인가? (A-1)
  {
    kind: '현상',
    title: '책임 주도 설계(RDD)란 무엇인가?',
    sub: '데이터가 아니라 책임으로 객체를 정의하는 설계 기법이다.',
    question: '책임 주도 설계는 무엇을 다르게 보는가?',
    lead: { label: '정의', text: '책임 주도 설계(Responsibility-Driven Design, RDD)는 객체를 "데이터+알고리즘"이 아니라 "역할(role)+책임(responsibility)"으로 보고, 책임을 객체에 할당하며 협력을 설계하는 기법이다. Rebecca Wirfs-Brock이 1990년에 창시한, 객체 설계에 대한 최초의 행위 기반(behavioral) 접근이다.' },
    visual: { type: 'versus', data: [
      { title: '데이터 주도 설계', body: ['클래스의 행위를 그 클래스가 가진 데이터와 함께 정의한다.'] },
      { title: '책임 주도 설계(RDD)', body: ['무엇을 아는가가 아니라 무엇을 책임지는가로 객체를 정의한다.'], negative: false },
    ]},
    foot: { kw: '뿌리', color: 'navy', body: '이 대비가 뒤에 나올 빈혈 도메인(데이터+외부 로직)과 리치 도메인(책임 가진 객체)의 뿌리다.' },
    origin: 'RDD: Rebecca Wirfs-Brock (Object Design: Roles, Responsibilities, and Collaborations, 2003)',
    notes: '정본: grasp-source.md §A-1. 배분 4분.'
  },

  // 03. 원칙 — 왜 책임이 설계의 단위인가? (A-2)
  {
    kind: '원칙',
    title: '왜 책임이 설계의 단위인가?',
    sub: '설계 질문은 "이 책임을 누가 지는가?"이다.',
    question: '왜 "책임"이 설계의 기본 단위인가?',
    lead: { label: '두 종류의 책임', text: 'Wirfs-Brock은 책임을 둘로 나눈다. 아는 책임(knowing)은 자기 데이터·파생값·관련 객체를 아는 책임이고, 하는 책임(doing)은 스스로 무언가를 하거나 다른 객체에게 시키거나 활동을 조정하는 책임이다. 객체는 단순한 데이터 묶음이 아니라 역할을 맡는다.' },
    visual: { type: 'boxes', data: [
      { title: '아는 책임(knowing)', body: ['자기 데이터·파생값·관련 객체를 아는 책임이다.'] },
      { title: '하는 책임(doing)', body: ['스스로 하거나, 다른 객체에게 시키거나, 활동을 조정하는 책임이다.'] },
    ]},
    foot: { kw: '역할', color: 'navy', body: '객체가 맡는 역할은 정보 보유자·서비스 제공자·조정자·제어자·구조화자·외부 인터페이스다 — 각자 자기 몫을 알고 해야 한다.' },
    notes: '정본: grasp-source.md §A-2(책임 분류·역할 목록 모두 Wirfs-Brock). 배분 4분.'
  },

  // 04. 원칙 — 책임 할당은 판단이다 (A-3)
  {
    kind: '원칙',
    title: '책임 할당은 판단이다',
    sub: '정답표가 없어서, 그 판단을 돕는 도구가 필요하다.',
    question: '책임 배치를 판단할 때 무엇에 기댈 수 있는가?',
    lead: { label: '도구', text: '같은 요구도 책임을 어디 두느냐로 설계가 갈린다 — 총액 계산을 바깥 서비스에 두면 절차적, Sale에 두면 객체적이다. 책임 배치엔 정답표가 없다. GRASP는 책임 할당을 사고하는 아홉 개 패턴이고, SOLID는 그 배치가 변화에 견디는지 보는 다섯 개 원칙이다 — 둘 다 유일 정답이 아니라 정돈된 틀이다.' },
    visual: { type: 'boxes', data: [
      { title: '일반 책임 할당 소프트웨어 패턴(GRASP)', body: ['책임 할당을 사고하는 아홉 개 패턴이다.'] },
      { title: 'SOLID', body: ['그 배치가 변화에 견디는지 보는 다섯 개 원칙이다.'] },
      { title: '계약에 의한 설계(Design by Contract, DbC)', body: ['책임에는 사전조건과 사후조건이라는 계약이 따른다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: 'GRASP·SOLID 둘 다 정답표가 아니다 — 이제부터 GRASP 여섯 원칙을 정보 소재 추론으로 하나씩 확인한다.' },
    origin: 'GRASP: Craig Larman (Applying UML and Patterns, 3rd ed.) · SOLID: Robert C. Martin',
    notes: '정본: grasp-source.md §A-3. 배분 4분.'
  },

  // 05. 적용 — 정보 전문가(Information Expert)
  {
    kind: '적용',
    title: '정보 전문가(Information Expert)',
    sub: '필요한 정보를 가장 잘 아는 클래스에게 그 책임을 준다.',
    question: 'Sale의 총액(grand total)은 누가 계산해야 하는가?',
    lead: { label: '정보 소재 추론', text: '필요한 정보를 하나씩 따라가 보면 배치가 드러난다. 모든 판매 항목을 아는 것은 Sale이므로 총액 책임은 Sale이 진다. 수량을 아는 것은 SalesLineItem이므로 소계 책임은 그쪽이 진다. 단가를 아는 것은 ProductDescription이므로 가격 제공 책임은 거기가 진다. 셋은 각자 아는 만큼만 나눠 맡고 서로 협력한다 — 코드는 이 추론의 결론일 뿐이다.' },
    visual: { type: 'codepair', data: {
      prompt: '계산 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'Money total = Money.ZERO;\nfor (var li : sale.getLineItems())\n    total = total.add(\n        li.getQty() * li.getPrice());',
          marks: [{ line: 2, tag: '남의 데이터를 순회한다' }] },
        { label: '적용', code: 'Money total = sale.getTotal();\n// Sale.getTotal(): 각 라인에 subtotal을 묻는다\n// SalesLineItem.getSubtotal(): qty×price',
          marks: [{ line: 1, tag: '정보 전문가(Information Expert)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '정보를 가졌다고 늘 책임을 주면 안 된다 — 데이터베이스 저장 책임을 Sale에 주면 Sale이 SQL과 트랜잭션을 알게 되어 응집이 무너지고 도메인이 인프라에 결합된다. 이 한계가 다음 순수 창작물(Pure Fabrication)을 부른다.' },
    notes: '정본: grasp-source.md §B-1(코드 축자, 3클래스 협력을 압축). 배분 6분.'
  },

  // 06. 적용 — 창조자(Creator)
  {
    kind: '적용',
    title: '창조자(Creator)',
    sub: '조립·집약·초기화에 필요한 정보를 가장 많이 가진 자가 생성한다.',
    question: 'SalesLineItem을 누가 생성해야 하는가?',
    lead: { label: '정보 소재 추론', text: 'B(SalesLineItem)를 생성할 책임은 B를 담거나 집약하거나 긴밀히 쓰거나 초기화 정보를 가진 A에게 간다. Sale이 SalesLineItem을 집약하고 생성에 필요한 정보를 이미 알고 있으므로, 생성 책임은 Sale이 진다. 바깥이 대신 조립하면 Sale 내부의 구성 규칙이 밖으로 새어 나간다.' },
    visual: { type: 'codepair', data: {
      prompt: '생성 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'ProductDescription d = catalog.find(id);\nSalesLineItem li =\n    new SalesLineItem(d, qty);\nsale.getLineItems().add(li);',
          marks: [{ line: 2, tag: '바깥에서 조립한다' }] },
        { label: '적용', code: 'sale.makeLineItem(id, qty);\n// Sale.makeLineItem():\n// 집약 정보로 생성 책임을 가짐',
          marks: [{ line: 1, tag: '창조자(Creator)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '생성 로직이 복잡하거나(조건에 따라 타입을 골라야 하거나) 필요한 재료가 여러 곳에 흩어져 있으면 창조자(Creator) 배치가 억지가 된다 — 그럴 때는 복잡한 생성을 전담하는 팩토리(Factory) 패턴으로 넘어간다. GRASP가 디자인 패턴을 부르는 첫 지점이다.' },
    notes: '정본: grasp-source.md §B-2(코드는 산문 "Sale이 makeLineItem() 책임"에서 옮김). 배분 6분.'
  },

  // 07. 적용 — 제어자(Controller)
  {
    kind: '적용',
    title: '제어자(Controller)',
    sub: '시스템 이벤트를 받는 첫 객체는 UI가 아니라 도메인 경계의 제어자다.',
    question: 'enterItem 같은 시스템 연산은 누가 받아야 하는가?',
    lead: { label: '정보 소재 추론', text: 'UI가 시스템 이벤트를 직접 받아 도메인 객체를 헤집으면, 업무 로직이 UI 코드 안으로 새어 들어간다. Register(또는 유스케이스 처리기)가 이벤트를 받아 도메인에 위임하는 제어자(Controller) 역할을 맡으면, UI와 도메인이 분리된다 — 전체 시스템을 대표하는 객체이거나 유스케이스 하나를 처리하는 객체다.' },
    visual: { type: 'codepair', data: {
      prompt: '이벤트 처리 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: '// UI 이벤트 핸들러\nProductDescription d = catalog.find(id);\nsale.makeLineItem(d, qty);   // UI가 직접 조작',
          marks: [{ line: 3, tag: 'UI가 업무 로직을 대신 갖는다' }] },
        { label: '적용', code: 'class Register {              // Controller\n  void enterItem(ItemID id, int qty) {\n    var d = catalog.find(id);\n    currentSale.makeLineItem(d, qty);\n  }\n}',
          marks: [{ line: 1, tag: '제어자(Controller)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '한 제어자가 모든 연산을 받으면 비대해진다 — 책임이 뒤섞여 응집도가 낮아진다. 그럴 때는 유스케이스별로 제어자를 나눈다. 이 나뉜 자리가 아키텍처 과정의 유스케이스 처리기(Use Case Interactor)로 다시 자리 잡는다.' },
    notes: '정본: grasp-source.md §B-3(Register 코드 축자). 배분 6분.'
  },

  // 08. 적용 — 낮은 결합도(Low Coupling)
  {
    kind: '적용',
    title: '낮은 결합도(Low Coupling)',
    sub: '요소 사이의 의존을 낮게 유지해, 한 곳의 변화가 번지지 않게 한다.',
    question: '결제 구현이 바뀌면 Sale도 함께 흔들려야 하는가?',
    lead: { label: '정보 소재 추론', text: 'Sale이 결제를 직접 특정 구현에 의존하면, 결제 방식이 바뀔 때마다 Sale도 함께 흔들린다. Sale이 결제의 역할(인터페이스)만 알고 구체적인 구현은 모르게 하면, 결제 구현을 통째로 교체해도 Sale은 영향을 받지 않는다.' },
    visual: { type: 'codepair', data: {
      prompt: '결제 의존이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'class Sale {\n  CreditCardGateway gateway;   // 구체 구현 의존\n  void pay() { gateway.charge(total); }\n}',
          marks: [{ line: 2, tag: '구체적인 구현에 의존한다' }] },
        { label: '적용', code: 'class Sale {\n  Payment payment;              // 역할만 의존\n  void pay() { payment.authorize(total); }\n}',
          marks: [{ line: 2, tag: '낮은 결합도(Low Coupling)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '결합을 0으로 만들려고 하면 오히려 인공적인 중개 장치가 늘어나 이해하기 더 어려워진다 — 낮은 결합도는 정도의 문제이지 절대치가 아니다.' },
    notes: '정본: grasp-source.md §B-4(코드 없음 — 산문 추론을 코드로 옮김). 배분 5분.'
  },

  // 09. 적용 — 높은 응집도(High Cohesion)
  {
    kind: '적용',
    title: '높은 응집도(High Cohesion)',
    sub: '한 요소는 밀접히 관련된 책임만 맡아, 한 가지를 잘하게 한다.',
    question: '한 클래스가 주문·결제·배송을 다 맡아도 되는가?',
    lead: { label: '정보 소재 추론', text: '낮은 결합도(Low Coupling)와 짝을 이루는 원칙이다. 책임을 응집 단위로 쪼개면 Sale은 주문만, Payment는 결제만, Shipment는 배송만 맡게 된다. 두 원칙은 보통 함께 좋아지고 함께 판단된다 — 결합이 낮아지면 응집도 함께 높아지는 경우가 많다.' },
    visual: { type: 'codepair', data: {
      prompt: '역할이 왜 나뉘어야 하는가',
      versions: [
        { label: '절차', code: 'class Sale {\n  void placeOrder() {...}\n  void processPayment() {...}\n  void arrangeShipment() {...}\n}',
          marks: [{ line: 1, tag: '여러 책임이 뒤섞여 있다' }] },
        { label: '적용', code: 'class Sale { void placeOrder() {..} }\nclass Payment { void charge() {..} }\nclass Shipment { void ship() {..} }',
          marks: [{ line: 1, tag: '높은 응집도(High Cohesion)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '지나치게 잘게 쪼개면 객체 수와 그들 사이의 간접 호출이 늘어 협력 비용이 커진다 — 응집도 역시 정도의 판단이다.' },
    notes: '정본: grasp-source.md §B-5(코드 없음 — 산문 추론을 코드로 옮김). 배분 5분.'
  },

  // 10. 적용 — 다형성(Polymorphism)
  {
    kind: '적용',
    title: '다형성(Polymorphism)',
    sub: '타입에 따라 동작이 달라질 때, 조건 분기 대신 다형성을 쓴다.',
    question: '결제 수단마다 처리 방식이 다르면 무엇이 문제인가?',
    lead: { label: '정보 소재 추론', text: '결제 수단(현금·카드·수표)마다 처리가 다르면, if-else 분기문이 코드 곳곳에 번진다. Payment를 다형 타입으로 만들어 CashPayment·CreditPayment가 각자 자신의 authorize() 메서드를 구현하게 하면, 새 결제 수단이 추가돼도 기존 분기문을 고치지 않고 새 타입만 추가하면 된다.' },
    visual: { type: 'codepair', data: {
      prompt: '수단별 분기가 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'if (type == CASH) { ... }\nelse if (type == CREDIT) { ... }\n// 새 결제 수단마다 분기 추가',
          marks: [{ line: 1, tag: '조건 분기가 곳곳에 번진다' }] },
        { label: '적용', code: 'interface Payment {\n  AuthResult authorize(Money amt);\n}\nclass CashPayment implements Payment {...}\nclass CreditPayment implements Payment {...}',
          marks: [{ line: 1, tag: '다형성(Polymorphism)' }] },
      ] } },
    foot: { kw: '한계', color: 'failT', body: '변형이 하나뿐이거나 앞으로도 늘지 않는다면 다형성은 오히려 불필요한 계층을 만드는 과잉이 된다.' },
    notes: '정본: grasp-source.md §B-6(코드 축자). 배분 5분.'
  },

  // 11. 적용 — 원칙을 의도적으로 거스르는 세 원칙 (C)
  {
    kind: '적용',
    title: '원칙을 의도적으로 거스르는 세 원칙',
    sub: '정보를 충실히 따르는 배치가 결합·응집을 해칠 때, 일부러 인공물을 만든다.',
    question: '앞의 여섯 원칙이 응집이나 결합을 해치면 어떻게 하는가?',
    lead: { label: '전환', text: '지금까지 여섯 원칙은 정보가 있는 곳에 책임을 준다는 흐름을 따랐다. 이 세 원칙은 그 흐름을 일부러 거스른다 — 도메인에 없는 인공물이나 간접층을 의도적으로 만들어서라도 응집·재사용·낮은 결합을 지키려는 판단이다. 의존관계 역전 원칙(DIP)과 같은 성격의 조작이다.' },
    visual: { type: 'bullets', data: [
      { head: '순수 창작물(Pure Fabrication)', text: '도메인 개념이 아닌 인공 클래스를 지어 책임을 맡긴다 — 저장을 Sale에 두면 응집이 깨지므로 도메인 밖의 Repository에 맡긴다.' },
      { head: '간접화(Indirection)', text: '두 요소의 직접 결합을 피하려고 중개자를 둔다 — 제어자(Controller)가 UI와 도메인 사이에, 어댑터가 도메인과 외부 API 사이에 선다.' },
      { head: '보호된 변화(Protected Variations)', text: '변화가 예상되는 지점을 안정된 인터페이스로 감싸 밖으로 번지지 않게 한다 — 의존관계 역전 원칙과 뿌리가 같다.' },
    ]},
    foot: { kw: '연결', color: 'navy', body: '보호된 변화(Protected Variations)는 아키텍처 과정의 의존성 규칙이 구조 수준에서 실현하는 바로 그 원칙이다.' },
    notes: '정본: grasp-source.md §C-1~C-3. 배분 6분.'
  },

  // 12. 요약 — 원칙에서 패턴으로 (D)
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '원칙은 하나의 관점에서 보는 판단이다 — 여러 원칙의 긴장이 패턴이 된다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '원칙에서 패턴으로', text: '원칙은 한 가지 관점에서 내리는 판단이다. 현실 문제는 여러 관점이 얽혀 있어 원칙 하나만으로는 풀리지 않는다. 그 여러 원칙 사이의 긴장을 상황에 맞게 조합한 정형화된 해법이 디자인 패턴이다 — 팩토리(Factory)는 복잡해진 창조자(Creator), 전략(Strategy)은 다형성(Polymorphism)과 보호된 변화(Protected Variations)의 조합, 어댑터(Adapter)는 간접화(Indirection)의 한 형태다. 더 큰 조합이 아키텍처 패턴이 된다. 원칙을 알면 패턴을 스스로 유도할 수 있고, 모르면 외워야 한다.' },
    visual: { type: 'takeaways', data: [
      { title: '책임 주도 설계(RDD)가 주', body: ['GRASP·SOLID는 그 판단을 돕는 도구일 뿐이다.'] },
      { title: '정보 소재 추론', body: ['정보가 어디 있는지 문장으로 따라가면 책임이 드러난다.'] },
      { title: '도메인 주도 설계(DDD)로의 복선', body: ['경계는 안 준다 — 그 공백을 다음 부가 메운다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '오늘 NewPOS에서 본 정보 소재 추론을 Order 도메인에 적용한다 — 코드는 다르지만 추론 절차는 같다.' },
    next: '오늘 본 정보 소재 추론을 Order에 적용하면 책임이 똑같은 방식으로 이동하는가.',
    notes: '정본: grasp-source.md §D. 다음 연결은 교시10(책임 분배 실습)으로 이어진다 — 도메인만 바뀐다(NewPOS→Order), 추론 절차는 같다. 배분 5분.'
  }
];

module.exports = { session: {
  no: 9,
  title: '책임 주도 설계(GRASP) 강의',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
