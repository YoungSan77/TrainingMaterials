// 13.js — 교시 13 (부 4 · 설계 원칙과 테스트 압력 — SOLID)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 4
//       ("SOLID | DIP·SRP 중심. forward-ref: DIP → 의존성 규칙(아키텍처)")
// 범위 판단(정본 없이 진행 — grasp-source.md 같은 전용 소스가 없어 사용자와 합의한 축소 범위):
//   커리큘럼이 이미 "DIP·SRP 중심"으로 못박아 뒀다 — 5원칙을 균등히 깊게 가르치지 않는다.
//   OCP·LSP·ISP는 이름·한 줄 정의만(원칙 장에서). SRP·DIP만 codepair로 코드 추론까지 간다.
// 서술 원칙 재사용: SRP 예는 교시9 Pure Fabrication(§C-1, "DB 저장을 Sale에 주면 응집이 무너진다")과
//   같은 문제를 SOLID 이름으로 다시 본다(탈신비화). DIP 예는 교시9 Low Coupling(§B-4)·
//   order-domain-definition.md §8의 PaymentPort를 그대로 재사용 — 새 예제를 짓지 않는다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'SRP·DIP를 코드로 설명하고, 왜 이 둘을 먼저 보는지 말할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'SRP(변경 이유 하나)와 DIP(의존 방향 역전)를 Order 코드로 설명하고, DIP가 왜 아키텍처로 이어지는지 안다.' },
    visual: { type: 'bullets', data: [
      { head: '전환', text: 'GRASP(어디 둘까)에서 SOLID(견디나)로 질문이 바뀜을 안다.' },
      { head: 'SRP', text: '한 클래스가 변경 이유를 하나만 갖는지 코드로 짚는다.' },
      { head: 'DIP', text: '의존 방향이 구체에서 추상으로 뒤집히는 걸 코드로 짚는다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '부3(GRASP)에서 배치한 책임이 이제 "변화에 견디는가"라는 새 질문을 받는다.' },
    notes: '정본: ooad-curriculum-2day.md 부4("SOLID | DIP·SRP 중심"). 배분 3분.'
  },

  // 02. 현상 — 배치됐다고 끝이 아니다
  {
    kind: '현상',
    title: '배치가 끝이 아니다',
    sub: 'GRASP로 책임을 잘 나눴어도, 요구가 바뀌면 그 배치가 흔들릴 수 있다.',
    question: '책임을 어디 둘지 정했으면 그걸로 충분한가?',
    lead: { label: '관찰', text: '"누가 맡을까"(GRASP)를 정한 뒤에도 "이 배치가 변화에 견디나"라는 별도 질문이 남는다.' },
    visual: { type: 'boxes', data: [
      { title: 'GRASP가 답한 것', body: ['이 책임을 누가 맡는가.'] },
      { title: 'SOLID가 답할 것', body: ['그 배치가 다음 변경에도 버티는가.'] },
    ]},
    foot: { kw: '전환', color: 'navy', body: '같은 설계를 다른 질문(변화 내구성)으로 다시 검사하는 것이 이 교시다.' },
    notes: 'grasp-source.md §A-3("GRASP가 어디, SOLID가 변화 내구성")을 그대로 이어받는다. 배분 4분.'
  },

  // 03. 원칙 — SOLID 다섯, 오늘은 둘
  {
    kind: '원칙',
    title: 'SOLID 다섯 중 둘만 깊게',
    sub: '커리큘럼이 이미 정했다 — DIP·SRP 중심, 나머지는 이름만.',
    question: '오늘 무엇을 깊게 보고 무엇을 이름만 보는가?',
    lead: { label: '범위', text: 'OCP·LSP·ISP는 이름과 한 줄 정의만 남긴다 — 오늘의 코드 추론은 SRP·DIP 둘에만 쓴다.' },
    visual: { type: 'boxes', data: [
      { title: '오늘 깊게(코드)', body: ['SRP — 변경 이유는 하나여야 한다.', 'DIP — 상위가 하위 구현이 아니라 추상에 의존.'] },
      { title: '이름만', body: ['OCP — 확장엔 열리고 수정엔 닫힌다.', 'LSP — 하위 타입이 상위를 대체할 수 있다.', 'ISP — 쓰지 않는 메서드에 의존하지 않는다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: 'Just Enough(부0 자세) — 커리큘럼 무게가 SOLID를 "DIP·SRP 중심"으로 이미 정해 뒀다, 억지로 다섯을 다 채우지 않는다.' },
    notes: '이 범위 판단은 grasp-source.md 같은 전용 소스 없이 커리큘럼 표기를 그대로 따른 것 — open-issues 대상 아님(커리큘럼이 이미 명시적으로 정한 범위). 배분 4분.'
  },

  // 04. 적용 — SRP
  {
    kind: '적용',
    title: 'SRP — 변경 이유는 하나',
    sub: '업무 규칙이 바뀌는 이유와 저장 방식이 바뀌는 이유는 다르다.',
    question: 'Order가 계산도 저장도 다 하면 무엇이 문제인가?',
    lead: { label: '재확인', text: '이미 본 문제다 — 교시9 Pure Fabrication에서 "저장을 Sale에 주면 응집이 무너진다"고 했다. SOLID는 그걸 "변경 이유"라는 잣대로 다시 잰다.' },
    visual: { type: 'codepair', data: {
      prompt: '이 클래스가 바뀔 이유가 몇 개인가',
      versions: [
        { label: '위반', code: 'class Order {\n  void addLine(...) {...}\n  Money total() {...}\n  void saveToDb() { jdbc.execute(...); }\n}',
          marks: [{ line: 4, tag: '변경 이유 둘(업무규칙+저장방식)' }] },
        { label: '적용', code: 'class Order {\n  void addLine(...) {...}\n  Money total() {...}\n}\nclass OrderRepository {   // Pure Fabrication\n  void save(Order o) {...}\n}',
          marks: [{ line: 5, tag: 'SRP — 변경 이유 하나만' }] },
      ] } },
    foot: { kw: '연결', color: 'teal', body: '교시9의 Pure Fabrication(인공물로 응집 지키기)과 오늘의 SRP(변경 이유 분리)는 같은 판단을 다른 이름으로 부른 것이다.' },
    notes: '탈신비화 서술 원칙(concept-ownership-map §교과 계보) 그대로 적용 — 새 문제가 아니라 재명명. 배분 6분.'
  },

  // 05. 적용 — DIP
  {
    kind: '적용',
    title: 'DIP — 의존 방향의 역전',
    sub: '구체 구현에 의존하던 방향을, 추상(인터페이스)에 의존하도록 뒤집는다.',
    question: 'Order가 결제 게이트웨이를 직접 알면 무엇이 문제인가?',
    lead: { label: '재확인', text: '교시9 Low Coupling에서 본 그 예다 — 오늘은 "의존 방향"이라는 잣대로 같은 코드를 다시 읽는다.' },
    visual: { type: 'codepair', data: {
      prompt: '의존 화살표가 어느 쪽을 향하는가',
      versions: [
        { label: '위반', code: 'class Order {\n  CreditCardGateway gateway = new CreditCardGateway();\n  void pay() { gateway.charge(total()); }\n}',
          marks: [{ line: 2, tag: 'Order → 구체 구현' }] },
        { label: '적용', code: 'interface PaymentPort { Result charge(Money amt); }\nclass Order {\n  PaymentPort payment;\n  void pay() { payment.charge(total()); }\n}\n// CreditCardGateway implements PaymentPort',
          marks: [{ line: 1, tag: 'DIP — 구현이 추상에 의존' }] },
      ] } },
    foot: { kw: '재료', color: 'teal', body: 'PaymentPort는 새로 짓지 않았다 — order-domain-definition.md §8이 이미 정의한 그 포트다.' },
    notes: '정본: order-domain-definition.md §8. 코드는 교시9 B-4(Low Coupling)를 DIP 방향(화살표) 관점으로 재구성. 배분 6분.'
  },

  // 06. 적용 — DIP가 아키텍처로 이어진다
  {
    kind: '적용',
    title: 'DIP는 여기서 끝나지 않는다',
    sub: '오늘 뒤집은 화살표 하나가 다음 과정 전체의 골격이 된다.',
    question: '이 방향 역전은 다음에 어디서 다시 만나는가?',
    lead: { label: 'forward-ref', text: '해법(레이어링·의존성 규칙)은 여기서 안 가르친다 — 소유는 아키텍처 과정이다(concept-ownership-map.md §OOD↔아키텍처 이음매).' },
    visual: { type: 'boxes', data: [
      { title: '오늘(OOAD)', body: ['인터페이스 하나로 방향을 뒤집는다는 개념까지.'] },
      { title: '다음(아키텍처)', body: ['이 방향 역전이 "의존성 규칙"이라는 이름으로 레이어 전체에 적용된다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '오늘은 클래스 둘 사이의 화살표, 아키텍처에서는 레이어 전체의 화살표 — 같은 원칙, 다른 규모다.' },
    notes: '정본: concept-ownership-map.md §OOD ↔ 아키텍처 이음매(DIP → 의존성 규칙, 재정박 지점). 배분 5분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: 'SOLID는 GRASP가 배치한 책임을 "변화에 견디는가"로 다시 검사한다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: 'SRP·DIP 둘 다 이미 부3에서 본 판단(Pure Fabrication·Low Coupling)을 다른 잣대로 다시 읽은 것이다.' },
    visual: { type: 'takeaways', data: [
      { title: 'SRP', body: ['변경 이유가 하나인지로 응집을 다시 잰다.'] },
      { title: 'DIP', body: ['의존 방향이 추상을 향하는지로 결합을 다시 잰다.'] },
      { title: 'forward-ref', body: ['DIP는 아키텍처의 의존성 규칙으로 재정박된다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '이 배치를 테스트가 먼저 요구하게 만들면 설계 판단이 얼마나 앞당겨지는지 본다.' },
    next: '테스트를 먼저 쓰면 SRP·DIP가 저절로 강제되는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 4(교시 14 "TDD로 설계 압력")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 13,
  title: 'SOLID',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
