// 16.js — 교시 16 (부 5 · DDD 전술(개념) 마지막 — Domain Service·Repository·Factory, OOAD 종합)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/ddd-tactics-source.md (즉석 생성 금지)
// 도메인 소재: order-domain-definition.md §8(OrderRepository) · 정본 §D·E·F
// 코드 배치 판단: 정본 §E는 Entity·Factory를 "묶어 1장"으로 지시하지만, 커리큘럼(ooad-curriculum-
//   2day.md)은 Entity를 교시15, Factory를 교시16 항목으로 이미 분리해 뒀다 — 커리큘럼의 교시별
//   배정이 상위 결정이라 그걸 따랐다(Entity는 15에서 이미 처리). Factory만 이 교시에서 다룬다.
// Domain Service·Repository 코드는 정본에 코드가 없다 — §D의 문제 서술(계좌 이체, 저장·조회)을
//   코드로 옮겼다(새 내용 아님). Repository는 order-domain-definition.md §8의 OrderRepository를
//   그대로 재사용.
// Domain Event는 정본에 없지만 커리큘럼이 "존재만" 언급을 요구해 요약 장에 forward-ref 한 줄로만
//   추가했다(소소한 보완 — 구조 변경 아님, open-issues 대상 아님).
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1(부5·OOAD 16교시 종합 겸)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'Domain Service·Repository·Factory를 설명하고 OOAD 16교시를 회수할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: '경계(Aggregate) 안팎에서 애매한 로직·저장·복잡 생성을 누가 맡는지 설명하고, OOAD 전체를 회수할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: 'Service', text: '한 엔티티에 안 맞는 로직을 어디에 두는지 안다.' },
      { head: 'Repository', text: '저장을 도메인 뒤로 숨기는 방법을 안다.' },
      { head: '종합', text: 'OOAD 16교시가 다음 부(아키텍처)로 어떻게 이어지는지 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '부5 마지막이자 OOAD 전체 마지막 교시다 — 종합을 겸한다.' },
    notes: '정본: ddd-tactics-source.md §D~F. 배분 3분.'
  },

  // 02. 현상 — 경계 안에도 애매한 자리가 있다
  {
    kind: '현상',
    title: '누구의 메서드도 아닌 로직',
    sub: '두 계좌 간 이체는 어느 계좌의 메서드인가?',
    question: '한 객체에 넣기 애매한 로직은 어디에 두는가?',
    lead: { label: '관찰', text: 'from.transfer(to)면 to를 왜 from이 알아야 하나, to.receiveFrom(from)이면 반대다 — 어느 쪽도 자연스럽지 않다.' },
    visual: { type: 'boxes', data: [
      { title: '이름 없을 때', body: ['억지로 한쪽에 욱여넣거나 유틸 함수로 흩뿌린다.'] },
      { title: '필요한 것', body: ['엔티티가 아닌, 로직만 담는 자리.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: 'Aggregate 경계를 정했어도, 경계에 안 맞는 로직은 여전히 남는다.' },
    notes: '정본: ddd-tactics-source.md §D 도입. 배분 4분.'
  },

  // 03. 원칙 — Domain Service
  {
    kind: '원칙',
    title: 'Domain Service',
    sub: '도메인 로직이지만 한 엔티티·VO에 안 맞는 것 — 무상태.',
    question: '이체 로직은 어디에 사는가?',
    lead: { label: '탈신비화', text: '① 애매한 연산은 늘 있었다. ② 이름이 없어 아무 데나 욱여넣었다. ③ 에반스가 "Domain Service"로 명명했다 — 관계의 로직만 담는 무상태 자리.' },
    visual: { type: 'boxes', data: [
      { title: '코드', body: ['TransferService.transfer(from, to, amt)', '— 어느 계좌도 아닌 관계 자체가 로직을 갖는다.'] },
      { title: 'forward-ref', body: ['Domain Service ≠ Application Service(유스케이스 층) — 이 구분은 아키텍처 과정에서 재정박된다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: 'Domain Service는 도메인 로직만 담는다 — 유스케이스 조율(트랜잭션 시작 등)은 다른 층의 몫이다.' },
    notes: '정본: ddd-tactics-source.md §D(Domain Service). concept-ownership-map.md §DDD 전술 경계와 일치. 배분 5분.'
  },

  // 04. 적용 — Repository
  {
    kind: '적용',
    title: 'Repository',
    sub: '애그리거트를 메모리 컬렉션처럼 다루는 인터페이스.',
    question: '저장을 도메인이 몰라도 되게 하려면?',
    lead: { label: '탈신비화', text: '① 저장·조회는 DAO·매퍼로 늘 해 왔다. ② 도메인이 SQL을 직접 알거나 계층이 제각각이었다. ③ 에반스가 "Repository"로 명명 — 영속성을 도메인 뒤로 숨긴다.' },
    visual: { type: 'boxes', data: [
      { title: '코드', body: ['OrderRepository.save(order) · findById(id)', '— Order는 SQL·연결을 모른다.'] },
      { title: 'forward-ref', body: ['인터페이스/구현 분리와 레이어링(어디에 둘지)은 아키텍처 과정이 확정한다.'] },
    ]},
    foot: { kw: '재료', color: 'teal', body: 'OrderRepository는 새로 짓지 않았다 — order-domain-definition.md §8이 이미 정의한 그 포트다.' },
    notes: '정본: ddd-tactics-source.md §D(Repository). 재료: order-domain-definition.md §8. 배분 5분.'
  },

  // 05. 적용 — Factory
  {
    kind: '적용',
    title: 'Factory',
    sub: '복잡한 생성을 캡슐화한다 — Creator의 한계가 부른 것.',
    question: '생성이 복잡해지면 Creator만으로 충분한가?',
    lead: { label: '회수', text: '교시9에서 이미 복선을 남겼다 — Creator가 억지가 될 때(생성 로직이 복잡하거나 재료가 흩어질 때) Factory로 간다.' },
    visual: { type: 'versus', data: [
      { title: 'Creator만(한계)', body: ['생성 로직이 복잡하거나 재료가 흩어지면 억지가 된다(교시9 회수).'] },
      { title: 'Factory로', body: ['그 복잡한 조립 절차 자체를 별도 객체로 캡슐화한다.'], negative: false },
    ]},
    foot: { kw: '연결', color: 'navy', body: 'Factory는 새 원칙이 아니다 — 교시9에서 예고된 GRASP Creator의 한계가 여기서 이름을 받은 것이다.' },
    notes: '정본: ddd-tactics-source.md §E(Factory). 교시9 B-2(Creator) 한계와 직접 연결. 배분 4분.'
  },

  // 06. 적용 — 여섯 개념, 하나의 계보
  {
    kind: '적용',
    title: '여섯 개념, 하나의 계보',
    sub: 'Larman이 안 준 것을 에반스가 얹었다 — 전부 이미 하던 판단의 이름이다.',
    question: '이 여섯 개념을 한 줄로 정리하면?',
    lead: { label: '총괄', text: 'Entity·VO·Aggregate·Domain Service·Repository·Factory 전부 "개발자가 이미 풀던 문제"에 에반스가 붙인 이름이다.' },
    visual: { type: 'boxes', data: [
      { title: '경계·값', body: ['Entity·VO·Aggregate — 무엇이 하나의 단위인가.'] },
      { title: '로직·저장', body: ['Domain Service·Repository — 경계 안팎의 역할.'] },
      { title: '생성', body: ['Factory — 복잡한 조립을 캡슐화.'] },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: 'Domain Event(도메인 안에서 벌어진 일의 알림)는 존재만 여기서 언급한다 — 인프로세스 처리는 아키텍처·MSA의 몫이다.' },
    notes: '정본: ddd-tactics-source.md §F. Domain Event는 curriculum 요구로 존재만 추가(정본에 없던 한 줄, 소소한 보완). 배분 5분.'
  },

  // 07. 요약 — OOAD 16교시 종합
  {
    kind: '요약',
    head: '요약',
    title: '요약 — OOAD 16교시 종합',
    sub: '절차의 한계에서 시작해, 책임(GRASP)·내구성(SOLID)·경계(DDD)까지 왔다.',
    question: '16교시를 가지고 다음 과정으로 무엇을 들고 가는가?',
    lead: { label: '회수', text: '부0(동기·자세) → 부1(모델) → 부2(이름) → 부3(배치) → 부4(내구성·안전망) → 부5(경계) — 전 부가 한 방향으로 쌓였다.' },
    visual: { type: 'takeaways', data: [
      { title: '개념까지', body: ['DDD 전술은 여기서 개념까지 — craft(경계 설계)는 DDD 1일 과정.'] },
      { title: 'DIP·전술', body: ['오늘 본 경계·포트가 리치 도메인의 재료다 — 다음은 그 재료를 레이어로 조립한다.'] },
      { title: '판단은 항구적', body: ['용어는 새로워도(부0 명제) 판단은 여전히 사람의 몫이다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: 'OOAD가 준 개념(책임·경계)을 레이어로 조립하는 것이 SW 아키텍처 과정이다 — OOAD는 그 강제 선수다.' },
    next: '오늘 본 포트(PaymentPort 등)와 리치 도메인이 실제 레이어에서 어떻게 조립되는가.',
    notes: '정본: ddd-tactics-source.md §F(닫기). concept-ownership-map.md §선수 체인(OOAD→아키텍처)과 일치. OOAD 16교시 완결. 배분 5분.'
  }
];

module.exports = { session: {
  no: 16,
  title: 'Domain Service·Repository·Factory (OOAD 종합)',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
