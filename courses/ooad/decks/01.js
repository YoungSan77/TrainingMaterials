// 01.js — 교시 1 (부 0 · 오리엔테이션)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 0
// 자세·명제는 program-design/canon-stance.md를 축자 인용한다(authoring-convention.md §4 규약).
// 아크: 왜 OOAD인가 + 프로그램 자세를 세우고 Order를 깐다. (교시 핵심: 절차지향의 한계·객체의 동기.
//   프로그램 자세 선언. Order 소개)
// 본문 7장: 학습목표1 · 현상1(절차지향의 한계) · 원칙1(객체의 동기) · 선언1(proposition.governing) ·
//           원칙1(프로그램 자세 3항목) · 적용1(Order 소개) · 요약1
// book·curriculum·meta는 courses/ooad/global_config.js가 소유한다 — 로더가 병합한다.

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '객체가 왜 필요한지 알고, 이 과정이 어떻게 판단력을 키우는지 안다.',
    question: '이 교시가 끝나면 무엇을 설명할 수 있는가?',
    lead: { label: '도달점', text: '절차지향의 한계를 구체적으로 짚고, 이 과정의 자세·Order 도메인을 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '한계', text: '절차지향 코드에서 무엇이 왜 깨지기 쉬운지 짚는다.' },
      { head: '동기', text: '객체가 그 문제를 어떻게 다루는지 한 문장으로 말한다.' },
      { head: '자세', text: '이 과정이 전제하는 세 가지 자세(정본)를 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '이 교시는 코드를 짜는 자리가 아니라 왜 이 과정을 듣는지 세우는 자리다.' },
    notes: '첫 교시다. 청중 대부분이 왜 이 과정이 필요한지 확신 없이 앉아 있다. 배분 5분.'
  },

  // 02. 현상 — 절차지향의 한계
  {
    kind: '현상',
    title: '절차지향의 한계',
    sub: '한 함수가 검증·계산·저장·응답을 전부 떠맡는다.',
    question: '이런 코드는 왜 손대기 무서워지는가?',
    lead: { label: '관찰', text: '데이터와 그것을 다루는 절차가 따로 논다 — 로직 하나를 바꾸면 관련 없어 보이던 동작이 함께 깨진다.' },
    visual: { type: 'boxes', data: [
      { title: '숨은 결합', body: ['같은 데이터를 여러 함수가 각자 다르게 손댄다.', '한쪽만 고치면 다른 쪽과 어긋난다.'] },
      { title: '책임 실종', body: ['이 값을 누가 지켜야 하는지 코드 어디에도 안 적혀 있다.', '지키는 사람은 코드가 아니라 사람의 기억이다.'] },
    ]},
    foot: { kw: '대가', color: 'failT', body: '규칙을 코드가 지키지 않으면, 규칙을 지키는 일이 사람의 몫으로 남는다.' },
    notes: '아직 "객체가 답이다"라고 말하지 않는다. 문제만 세운다. 청중에게 최근에 고치기 무서웠던 함수 하나를 떠올려 보라고 물으면 다음 장으로 넘어가기 쉽다. 배분 6분.'
  },

  // 03. 원칙 — 객체의 동기
  {
    kind: '원칙',
    title: '객체의 동기',
    sub: '데이터와 그 데이터를 지키는 규칙을 한 곳에 묶는다.',
    question: '규칙은 코드의 어디에 살아야 하는가?',
    lead: { label: '동기', text: '객체는 데이터를 감추고 그 데이터를 바꾸는 방법만 공개한다 — 규칙이 코드 한곳에 산다.' },
    visual: { type: 'versus', data: [
      { title: '절차', body: ['데이터는 어디서나 열려 있다.', '규칙은 절차마다 따로 적힌다.', '규칙이 하나 바뀌면 모든 절차를 찾아 고친다.'] },
      { title: '객체', body: ['데이터는 객체 안에 감춰진다.', '규칙은 그 객체의 메서드 하나에 산다.', '규칙이 바뀌면 그 메서드만 고친다.'], negative: false },
    ]},
    foot: { kw: '전환', color: 'teal', body: '책임을 어디에 둘지 정하는 것이 이 과정 전체의 훈련이다 — 부 3에서 손으로 반복한다.' },
    notes: '"캡슐화"라는 용어를 아직 강조하지 않는다(부 2에서 정식으로 다룬다). 여기서는 동기만 남긴다. 배분 6분.'
  },

  // 04. 선언 — 프로그램 명제(canon-stance.md: proposition.governing, 축자 인용)
  {
    kind: '선언',
    title: '선언',
    visual: { type: 'statement',
      text: 'LLM은 우발 복잡도를 걷어낸다. 남는 본질 복잡도는 대부분 암묵지 — 요구사항·도메인 규칙·불변식·경계 — 이고, LLM은 이를 확률로 추론할 뿐 명세하지 못한다. 그 명세는 인간의 몫이며, 명세하지 못한 격차는 개발자가 메운다. 이 프로그램이 가르치는 요구공학·도메인 모델링·아키텍처가 바로 그 명세 기술이다. 도구가 강해질수록 이 역량은 덜 필요해지지 않고 더 드러난다. 용어는 새로워도 문제는 Brooks(essence/accidental)·에반스(VO·Aggregate)가 정리한 그것이다.' },
    notes: '정본: canon-stance.md `proposition.governing`(concept-ownership-map.md §프로그램 명제). 반론 대응(REBUTTAL, 정본 축자): "LLM이 결국 명세까지 충분히 잘하게 되면?" — 그런 도메인은 늘 늘어난다. 그러나 "LLM이 명세를 잘한다"는 곧 "그 도메인의 암묵지가 이미 명시화됐다"는 뜻이다. LLM은 명세를 창조하지 않고 명시화된 것을 재생한다. 명세 노동은 사라지지 않고 프런티어로 이동한다 — 아직 암묵인 도메인, 그리고 확률적 산출이 옳은지 통제하는 자리로. 개발자의 역할은 명세자→검증자로 올라갈 뿐, 판단은 항구적이다. 배분 4분.'
  },

  // 05. 원칙 — 프로그램 자세(canon-stance.md: stance.* 3항목, SHORT 축자 인용 — §4 규약)
  //   반복 인용(세 항목이 한 슬라이드를 나눠 쓴다)이라 TEXT 전문이 아니라 SHORT를 쓴다.
  //   전문은 canon-stance.md가 정본이고 여기서 다시 쓰지 않는다.
  {
    kind: '원칙',
    title: '프로그램 자세',
    sub: '이 활동들은 완벽한 코드가 불가능해서 도입된 보정이다.',
    question: '이 활동에 들이는 시간을 무엇으로 정당화하는가?',
    lead: { label: '정본', text: '아래 세 문장은 여섯 과정이 공유하는 정본이다(canon-stance.md) — 과정마다 다시 쓰지 않는다.' },
    visual: { type: 'bullets', data: [
      { head: 'stance.necessary-evil', text: '완벽한 코드가 불가능해서 도입된 보정이다 — 목적에 맞게 쓰면 도움, 오용하면 필요악이다.' },
      { head: 'stance.just-enough', text: '사전 활동은 코드가 요구하는 만큼만 — 모자라면 부채(무지), 넘치면 그 자체가 부채(과잉)다.' },
      { head: 'stance.prevent-repay', text: '사전 활동 = 부채 예방, 사후 유지보수 = 부채 상환 — 서론의 자세는 예방이다.' },
    ]},
    foot: { kw: '적용', color: 'navy', body: '이 세 문장은 이후 모든 부의 판단 기준이다 — 특히 부 3(GRASP)에서 "얼마나 설계할까"로 돌아온다.' },
    notes: '전문(TEXT)은 canon-stance.md가 정본이다 — 궁금하면 강사가 그 문서를 펴서 보여준다. id를 화면에 남기는 이유는 이 문서 밖에서도 정본을 추적할 수 있게 하기 위해서다. 배분 5분.'
  },

  // 06. 적용 — Order 소개
  {
    kind: '적용',
    title: 'Order 소개',
    sub: '이 과정 16교시가 전부 같은 도메인(Order)을 쓴다.',
    question: '앞으로 계속 볼 예제는 무엇인가?',
    lead: { label: '소개', text: '쇼핑몰 주문(Order) — 애그리거트 하나와 그 상태 전이, 직접 규칙만 다룬다(결제·재고·배송은 협력자로만 참조).' },
    visual: { type: 'boxes', data: [
      { title: '구성', body: ['Order(루트) · OrderLine(다수) · Money·Quantity(값 객체).', '결제·재고·배송은 포트 너머 협력자다.'] },
      { title: '규칙 7개', body: ['R1 합계·R2 수량·R3 최소구성·R4 변경시점.', 'R5 취소조건·R6 전이규칙·R7 결제선행.'] },
      { title: '상태 머신', body: ['PENDING → PAID → SHIPPED → DELIVERED.', '취소는 PENDING·PAID에서만(→ CANCELLED).'] },
    ]},
    foot: { kw: '재사용', color: 'navy', body: '이 규칙과 상태 머신은 정의를 바꾸지 않는다 — 바뀌는 것은 이 규칙을 코드 어디에 두는가뿐이다.' },
    notes: '정본: program-design/order-domain-definition.md. 지금은 이름과 규칙 번호(R1~R7)만 익힌다 — 애그리거트 경계·포트의 의미는 부 5(DDD 전술)에서 다시 연다. 상태 머신은 부 1 동적 모델 실습에서 상태도로 다시 그린다(재사용, 새로 만들지 않는다). 배분 6분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '절차의 한계는 숨은 결합이고, 객체의 답은 책임을 데이터 옆에 두는 것이다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '이 교시에서 세운 세 가지(한계·동기·자세)를 이후 전 교시에서 계속 쓴다.' },
    visual: { type: 'takeaways', data: [
      { title: '한계', body: ['절차지향은 데이터와 규칙이 따로 놀아 숨은 결합을 만든다.'] },
      { title: '동기', body: ['객체는 데이터와 그 데이터를 지키는 규칙을 한 곳에 묶는다.'] },
      { title: '자세', body: ['조건부 필요악·Just Enough·예방 중심 — 이 세 자세로 이 과정 전체를 잰다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '오늘 세운 동기를 다음 교시부터 요구사항으로 구체화한다.' },
    next: '요구사항을 어떻게 유스케이스로 옮기는가.',
    notes: '다음 연결은 program-design/ooad-curriculum-2day.md 부 1(교시 2 "요구사항 → 유스케이스")로 그대로 이어진다. 배분 3분.'
  }
];

module.exports = { session: {
  no: 1,
  title: '오리엔테이션',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
