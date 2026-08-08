// 03.js — 교시 3 (부 1 · 분석(OOA) · BDD)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 1
//       실습 소재: program-design/ooad-lab-design.md 부 1 (BDD 문단), R6는 order-domain-definition.md §5·6
// 아크(부1): 교시2에서 만든 CancelOrder 유스케이스를 Given-When-Then으로 실행 가능한 시나리오로 옮긴다.
//   여기서 쓰는 취소 시나리오는 부5 애그리거트 실습(교시15~16)에서 규칙 검증으로 재사용된다(고아 방지).
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '유스케이스를 Given-When-Then 시나리오로 옮겨 실행 가능하게 만들 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'CancelOrder 유스케이스를 정상·거부 두 시나리오로 Given-When-Then으로 쓸 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '진단', text: '유스케이스 글만으로는 검증되지 않는 격차를 짚는다.' },
      { head: '구조', text: 'Given-When-Then 각 절이 무엇을 담는지 안다.' },
      { head: '적용', text: 'R6 전이 규칙을 정상·거부 두 시나리오로 옮긴다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시2에서 만든 CancelOrder 유스케이스가 이 교시의 재료다.' },
    notes: 'BDD를 도구(Cucumber 등) 이야기로 빠지지 않게 한다 — 오늘은 문장 구조까지만. 배분 4분.'
  },

  // 02. 현상 — 텍스트와 코드 사이의 검증되지 않는 격차
  {
    kind: '현상',
    title: '글과 코드 사이의 틈',
    sub: '유스케이스 글은 "취소가 언제 허용되는지"를 코드가 지키는지 검증하지 않는다.',
    question: '유스케이스 문서가 맞다는 걸 무엇으로 아는가?',
    lead: { label: '관찰', text: '문서는 사람이 읽고, 코드는 기계가 실행한다 — 둘이 어긋나도 아무도 자동으로 알려주지 않는다.' },
    visual: { type: 'boxes', data: [
      { title: '문서만 있을 때', body: ['문서가 바뀌어도 코드는 그대로 남는다.', '어긋남은 결함 리포트로만 드러난다.'] },
      { title: '필요한 것', body: ['글이 곧 실행 가능한 검증이 되는 형식.', '규칙(R6)이 시나리오 그대로 코드에 남는 형식.'] },
    ]},
    foot: { kw: '대가', color: 'failT', body: '검증되지 않는 문서는 시간이 지나면 코드와 어긋난 거짓말이 된다.' },
    notes: 'BDD의 동기 — TDD와 다르다(유닛 단위가 아니라 유스케이스 단위 시나리오). 배분 5분.'
  },

  // 03. 원칙 — Given-When-Then 구조
  {
    kind: '원칙',
    title: 'Given-When-Then',
    sub: 'Given=상태, When=행위, Then=기대 결과 — 셋이 한 시나리오다.',
    question: '시나리오는 무엇으로 구성되는가?',
    lead: { label: '구조', text: 'Given은 시작 상태, When은 그 상태에서 벌어지는 행위, Then은 행위 뒤 반드시 성립해야 하는 결과다.' },
    visual: { type: 'boxes', data: [
      { title: 'Given', body: ['시나리오가 시작되는 상태를 고정한다.'] },
      { title: 'When', body: ['그 상태에서 실행되는 행위 하나.'] },
      { title: 'Then', body: ['행위 뒤 반드시 참이어야 하는 결과.'] },
    ]},
    foot: { kw: '재료', color: 'navy', body: '세 절 각각의 내용은 지어내지 않는다 — 상태는 상태 머신에서, 결과는 도메인 규칙(R#)에서 온다.' },
    notes: '"시나리오는 새 지식이 아니라 이미 있는 상태 머신·규칙을 형식으로 옮긴 것"이라는 프레임을 세운다. 배분 5분.'
  },

  // 04. 적용 — 시나리오1: 정상 취소
  {
    kind: '적용',
    title: '시나리오 — 정상 취소',
    sub: 'PENDING 상태의 주문은 취소되면 CANCELLED가 된다.',
    question: '허용되는 취소를 어떻게 시나리오로 쓰는가?',
    lead: { label: '규칙', text: 'R5(취소 조건): SHIPPED 이전 상태에서만 취소를 허용한다.' },
    visual: { type: 'boxes', data: [
      { title: 'Given', body: ['주문이 PENDING 상태다.'] },
      { title: 'When', body: ['고객이 취소를 요청한다.'] },
      { title: 'Then', body: ['주문 상태가 CANCELLED로 바뀐다.'] },
    ]},
    foot: { kw: '짚기', color: 'teal', body: 'Then의 근거는 R6 전이표의 "PENDING → 취소 → CANCELLED" 한 줄이다 — 새로 정한 게 아니다.' },
    notes: '정본: order-domain-definition.md §6 전이표. R5·R6를 다시 짚는다. 배분 6분.'
  },

  // 05. 적용 — 시나리오2: 거부되는 취소
  {
    kind: '적용',
    title: '시나리오 — 거부되는 취소',
    sub: 'SHIPPED 이후 상태의 주문은 취소가 거부된다.',
    question: '허용되지 않는 취소는 어떻게 시나리오로 쓰는가?',
    lead: { label: '대안흐름', text: '정상 시나리오만 쓰면 절반이다 — 거부되는 경로도 같은 형식으로 검증 가능하게 만든다.' },
    visual: { type: 'boxes', data: [
      { title: 'Given', body: ['주문이 SHIPPED 상태다.'] },
      { title: 'When', body: ['고객이 취소를 요청한다.'] },
      { title: 'Then', body: ['취소가 거부되고 주문 상태는 그대로다.'] },
    ]},
    foot: { kw: '짚기', color: 'teal', body: '두 시나리오는 같은 R5·R6에서 나온 앞뒤 짝이다 — 규칙 하나가 시나리오 두 개를 낳는다.' },
    notes: '"규칙 하나 = 시나리오 여러 개"라는 감각을 남긴다. 배분 6분.'
  },

  // 06. 적용 — 왜 이게 나중에 재사용되는가
  {
    kind: '적용',
    title: '이 시나리오는 버려지지 않는다',
    sub: '지금 쓴 Given-When-Then이 부 5 애그리거트 실습에서 규칙 검증으로 재사용된다.',
    question: '오늘 쓴 시나리오는 언제 다시 쓰는가?',
    lead: { label: '재사용', text: '애그리거트가 자기 불변식을 지키는지 검증할 때, 오늘 쓴 시나리오가 그대로 검증 케이스가 된다.' },
    visual: { type: 'versus', data: [
      { title: '지금(교시3)', body: ['시나리오를 글로 쓴다.', '상태·행위·결과를 R5·R6에서 가져온다.'] },
      { title: '나중(부 5)', body: ['같은 시나리오로 애그리거트 코드를 검증한다.', '새로 쓰지 않는다 — 고아 시나리오를 만들지 않는다.'], negative: false },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: '애그리거트·불변식이라는 용어는 부 5(DDD 전술)에서 정식으로 다룬다 — 오늘은 재사용될 자리만 예고한다.' },
    notes: '부5 forward-ref. 지금 용어를 앞당겨 정의하지 않는다. 배분 5분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: 'Given-When-Then은 상태 머신과 도메인 규칙을 실행 가능한 문장으로 옮긴 것이다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '오늘 쓴 두 시나리오(정상·거부 취소)는 상태 머신 한 조각이다 — 다음은 그 전체 구조를 정적 모델로 본다.' },
    visual: { type: 'takeaways', data: [
      { title: '구조', body: ['Given=상태, When=행위, Then=결과.'] },
      { title: '재료', body: ['상태는 상태 머신, 결과는 R#에서 온다.'] },
      { title: '재사용', body: ['오늘 시나리오는 부 5 애그리거트 검증에서 다시 쓴다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '유스케이스 텍스트에서 개념 모델(클래스 후보)을 뽑는다.' },
    next: 'Order·OrderLine·Money 같은 개념이 텍스트 어디에서 후보로 드러나는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 1(교시 4 "정적 모델")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 3,
  title: 'BDD',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
