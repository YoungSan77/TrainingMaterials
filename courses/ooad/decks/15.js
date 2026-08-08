// 15.js — 교시 15 (부 5 · DDD 전술(개념) — 구성요소 개관 · Entity·VO·Aggregate)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/ddd-tactics-source.md (즉석 생성 금지)
// 도메인 소재: order-domain-definition.md §5(R1·R2·R3)·§4(애그리거트 경계)
// 서술 원칙(정본 §서두): 탈신비화 3단 — ①개발자가 이미 풀던 문제 → ②이름 없어 일관성 없던 것 →
//   ③에반스의 명명·패턴화. concept-ownership-map.md §교과 계보·서술 원칙과 같은 톤(GRASP·SOLID와 같은 결).
// VO 코드 대조(원시타입 vs VO)는 정본 §B의 "Money를 int로 다루면?" 문제에서 codepair로 구성했다
// (정본엔 위반 코드가 없다 — 문제 서술을 코드로 옮긴 것, 새 내용 아님). Aggregate 코드는 정본 §C
// 축자(Order 루트) + "루트 없이 직접 변경"이라는 위반 대조를 문제 서술("따로 저장하면 깨진다")에서 구성.
// Entity는 정본 §E대로 "VO와의 대비로 한 줄"만 — 별도 장을 만들지 않는다(OO 기초에서 이미 닿음).
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'VO·Aggregate의 뜻과, 애그리거트 경계를 정하는 기준(불변식)을 안다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'GRASP가 안 준 질문("무엇을 하나의 경계로 볼까")에 VO·Aggregate가 어떻게 답하는지 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: 'VO', text: '식별자 없는 값에 왜 클래스를 씌우는지 안다.' },
      { head: 'Aggregate', text: '불변식이 애그리거트 경계를 어떻게 정하는지 안다.' },
      { head: '탈신비화', text: '이 개념들이 새 이론이 아니라 이미 하던 판단의 명명임을 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '부3(GRASP)에서 배치는 정했다 — 부5는 그 배치가 사는 "경계" 자체를 본다.' },
    notes: '정본: ddd-tactics-source.md §A~C. 배분 3분.'
  },

  // 02. 현상 — GRASP가 안 준 질문
  {
    kind: '현상',
    title: '어디까지가 한 단위인가',
    sub: 'GRASP는 "누가 책임지나"는 줬어도 "무엇이 한 경계인가"는 안 줬다.',
    question: 'Order와 OrderLine을 왜 따로 저장하면 깨지는가?',
    lead: { label: '관찰', text: '연관된 데이터를 한 트랜잭션으로 묶어야 하는 경우가 있다 — 개발자는 늘 감으로 "이건 같이 묶어야 해"를 해 왔다.' },
    visual: { type: 'boxes', data: [
      { title: '이름 없을 때', body: ['팀마다·개발자마다 경계가 달라 일관성이 없다.'] },
      { title: '이름이 필요한 이유', body: ['경계를 판단하는 공통 기준이 있어야 합의가 된다.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: 'GRASP·SOLID로는 답이 없다 — 이 공백을 에반스가 메웠다.' },
    notes: '정본: ddd-tactics-source.md §A. 배분 4분.'
  },

  // 03. 원칙 — 탈신비화 3단
  {
    kind: '원칙',
    title: '탈신비화 3단으로 읽는다',
    sub: '이미 하던 문제 → 이름 없어 흩어졌던 것 → 명명·패턴화, 세 걸음.',
    question: '이번 부는 앞의 부들과 무엇이 다른가?',
    lead: { label: '방식', text: '이 교시의 모든 개념은 같은 세 걸음으로 연다 — 새 지식 암기가 아니라 이미 하던 판단에 이름을 붙이는 과정이다.' },
    visual: { type: 'boxes', data: [
      { title: '① 이미 풀던 문제', body: ['개발자는 이 문제를 늘 다뤄 왔다.'] },
      { title: '② 이름 없던 것', body: ['팀마다 다르게 풀어 일관성이 없었다.'] },
      { title: '③ 명명·패턴화', body: ['에반스가 이름을 붙여 공통 어휘로 만들었다.'] },
    ]},
    foot: { kw: '계보', color: 'navy', body: 'Larman(OOAD)이 안 다룬 것을 에반스가 얹었다 — 이 교시가 그 이음매다.' },
    notes: '정본: ddd-tactics-source.md 서두. 배분 4분.'
  },

  // 04. 적용 — VO
  {
    kind: '적용',
    title: 'Value Object',
    sub: '식별자 없이 값 자체로 의미를 갖는 것 — 돈·수량처럼.',
    question: 'Money를 그냥 정수로 다루면 무엇이 문제인가?',
    lead: { label: '탈신비화', text: '① 돈·수량은 늘 다뤄 온 값이다. ② 팀마다 원시 타입·유틸로 제각각 다뤄 일관성이 없었다. ③ 에반스가 "식별자 없음·값 동등성·불변"으로 VO를 명명했다.' },
    visual: { type: 'codepair', data: {
      prompt: '규칙(R1·R2)이 어디에 살 수 있는가',
      versions: [
        { label: '원시 타입', code: 'int money = 10000;\nint total = money + orderId;',
          marks: [{ line: 2, tag: '의미 없는 연산도 컴파일됨' }] },
        { label: 'VO', code: 'final class Money {\n  private final long cents;\n  Money add(Money o) {\n    requireSameCurrency(o); ...\n  }\n}',
          marks: [{ line: 1, tag: 'VO — 불변·값 동등성' }] },
      ] } },
    foot: { kw: '한계·대비', color: 'failT', body: '모든 것을 VO로 만들면 과잉이다 — 식별자로 추적해야 하는 것(Order·Customer)은 Entity다(OO 기초에서 이미 다룸).' },
    notes: '정본: ddd-tactics-source.md §B(코드 축자, 위반 예는 문제 서술에서 구성). R2(수량)도 VO 생성자가 강제한다. 배분 6분.'
  },

  // 05. 적용 — Aggregate 경계
  {
    kind: '적용',
    title: 'Aggregate — 경계는 불변식이 정한다',
    sub: '즉시 지켜야 할 규칙은 안, 결과적이면 밖.',
    question: 'Order·OrderLine·재고, 어디까지가 한 애그리거트인가?',
    lead: { label: '탈신비화', text: '① "이건 같이 묶어야 해"는 늘 하던 감이다. ② 경계 기준이 없어 팀마다 달랐다. ③ 에반스가 "불변식을 공유하는 묶음, 루트를 통해서만 접근"으로 명명했다.' },
    visual: { type: 'versus', data: [
      { title: '즉시(애그리거트 안)', body: ['R1(합계)·R3(최소 1라인) — Order 내부, 한 트랜잭션.'] },
      { title: '결과적(애그리거트 밖)', body: ['재고 ≥ 주문량 — Order·Inventory에 걸침, 최종 일관성.'], negative: false },
    ]},
    foot: { kw: '판단', color: 'navy', body: '불변식이 경계를 정한다 — 즉시 지켜야 하면 안, 결과적이면 밖이다.' },
    notes: '정본: ddd-tactics-source.md §C 문제·추론. 배분 5분.'
  },

  // 06. 적용 — Aggregate 코드와 한계
  {
    kind: '적용',
    title: '루트를 통해서만 접근한다',
    sub: '바깥이 라인을 직접 만지면 불변식이 무방비해진다.',
    question: '경계를 정했으면 어떻게 코드로 지키는가?',
    lead: { label: '재료', text: 'order-domain-definition.md §4: OrderLine을 외부에서 직접 바꾸는 경로는 없다 — Order를 통해서만 변경된다.' },
    visual: { type: 'codepair', data: {
      prompt: '불변식을 누가 지키는가',
      versions: [
        { label: '위반', code: 'List<OrderLine> lines = order.getLines();\nlines.add(new OrderLine(...));\nrepo.saveLines(lines);',
          marks: [{ line: 2, tag: '루트 없이 직접 변경' }] },
        { label: 'Aggregate', code: 'class Order {              // Aggregate Root\n  List<OrderLine> lines;   // 루트를 통해서만 접근\n  void addLine(...) { /* R4 강제 */ }\n  Money total() { /* R1 */ }\n}',
          marks: [{ line: 1, tag: '불변식을 여기서만 강제' }] },
      ] } },
    foot: { kw: '한계(DDD 복선)', color: 'failT', body: '경계를 어디 긋느냐가 진짜 어려운 판단이다 — 이 소개는 "불변식이 정한다"까지, 실제 경계 설계는 DDD 1일 과정이 판다.' },
    notes: '정본: ddd-tactics-source.md §C(코드 축자)·한계. "아 이게 어렵겠다"는 감각이 DDD 과정 동기다. 배분 6분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: 'VO는 값에, Aggregate는 경계에 이름을 붙였다 — 둘 다 이미 하던 판단이다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: 'Entity(식별자 있음)는 VO(식별자 없음)의 반대편이다 — 이미 OO 기초·Order 소개에서 닿은 개념이라 오늘은 대비로만 확인했다.' },
    visual: { type: 'takeaways', data: [
      { title: 'VO', body: ['식별자 없음·값 동등성·불변.'] },
      { title: 'Aggregate', body: ['불변식이 경계를 정한다, 루트를 통해서만 접근.'] },
      { title: '한계', body: ['경계 설계 자체는 이 교시에서 안 한다 — DDD 과정의 몫.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '경계 안(Aggregate)에서 애매한 로직과 저장은 누가 맡는가.' },
    next: '계좌 이체처럼 한 객체에 안 맞는 로직, 그리고 저장은 누가 갖는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 5(교시 16 "Domain Service·Repository·Factory")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 15,
  title: 'DDD 전술 개관 · Entity·VO·Aggregate',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
