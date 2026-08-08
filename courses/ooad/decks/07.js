// 07.js — 교시 7 (부 1 · 분석(OOA) 마지막 · 동적 모델 실습)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 1
//       도메인 소재: program-design/order-domain-definition.md §6(상태 머신)
// 아크(부1): 교시6에서 강의로 본 상태 머신을 손으로 상태도로 옮기고, 정적 모델(구조)과 대조한다.
//   상태 머신은 새로 만들지 않는다 — order-domain-definition.md에 이미 있어 재사용만 한다(공짜).
//   부 1(분석)의 마지막 교시 — 다음은 부 2(OO 기초, 교시8)로 넘어간다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'Order 상태 머신을 상태도로 그리고, 정적 모델과 대조할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'R6 전이표를 상태도(노드+간선)로 옮기고, 클래스 모델과 무엇이 같고 다른지 말할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '1단계', text: '상태를 노드로 나열한다.' },
      { head: '2단계', text: '허용 전이만 간선으로 긋는다.' },
      { head: '대조', text: '정적 모델과 나란히 놓고 관점 차이를 짚는다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시6에서 강의로 본 상태·전이표가 이 교시의 재료다 — 새로 만들지 않는다.' },
    notes: '부1(분석)의 마지막 교시다. 실습 시간이 대부분. 배분 3분.'
  },

  // 02. 현상 — 표만으로는 한눈에 안 들어온다
  {
    kind: '현상',
    title: '표는 전체를 한눈에 안 보여준다',
    sub: '전이표를 줄 단위로 읽으면 "이 상태에서 어디까지 갈 수 있는지"가 한눈에 안 들어온다.',
    question: 'PAID 상태에서 갈 수 있는 곳을 표에서 바로 짚을 수 있는가?',
    lead: { label: '관찰', text: '표는 전이 하나하나를 정확히 담지만, 한 상태를 기준으로 전체 그림을 보려면 줄을 다시 훑어야 한다.' },
    visual: { type: 'boxes', data: [
      { title: '표의 한계', body: ['한 상태 기준으로 흩어진 줄을 다시 모아야 한다.'] },
      { title: '상태도의 이점', body: ['한 상태에서 나가는 화살표를 한눈에 본다.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: '같은 정보라도 표현이 바뀌면 놓치던 것이 보인다 — 상태도가 그 표현이다.' },
    notes: '상태도가 새 정보가 아니라 같은 정보의 다른 표현임을 분명히 한다. 배분 4분.'
  },

  // 03. 원칙 — 상태도의 구성 요소
  {
    kind: '원칙',
    title: '상태도 = 노드 + 간선',
    sub: '상태는 노드, 이벤트는 간선 — 표에 없는 전이는 간선을 긋지 않는다.',
    question: '상태도는 무엇으로 이루어지는가?',
    lead: { label: '구조', text: '노드=상태, 간선=이벤트에 의한 전이. 간선이 없는 두 상태 사이는 곧 "그 전이는 불법"이라는 뜻이다(R6).' },
    visual: { type: 'boxes', data: [
      { title: '노드', body: ['상태 하나(PENDING·PAID 등)를 원 하나로.'] },
      { title: '간선', body: ['허용된 전이만 화살표로 긋는다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: '"혹시 몰라서" 화살표를 추가로 긋지 않는다 — 표에 없으면 긋지 않는 것 자체가 R6의 표현이다.' },
    notes: '상태도 그리기의 유일한 함정은 "빠진 것 같아서" 임의로 화살표를 추가하는 것 — 미리 경고. 배분 4분.'
  },

  // 04. 적용 — Step 1: 상태를 노드로
  {
    kind: '적용',
    title: 'Step 1 — 상태를 노드로',
    sub: '5개 상태를 노드로 나열하고 종료 상태를 표시한다.',
    question: '노드는 몇 개이고, 어느 것이 끝인가?',
    lead: { label: '재료', text: 'order-domain-definition.md §6의 5개 상태를 그대로 노드로 옮긴다.' },
    visual: { type: 'boxes', data: [
      { title: '진행 노드', body: ['PENDING · PAID · SHIPPED.'] },
      { title: '종료 노드', body: ['DELIVERED · CANCELLED(이중 테두리로 표시).'] },
    ]},
    foot: { kw: '표기', color: 'teal', body: '종료 상태는 나가는 화살표가 없는 노드로 그리면 R6가 자연히 눈에 보인다.' },
    notes: '손으로 5개 원을 그리게 한다. 배분 6분.'
  },

  // 05. 적용 — Step 2: 허용 전이만 간선으로
  {
    kind: '적용',
    title: 'Step 2 — 전이를 간선으로',
    sub: '전이표(R6)의 5개 줄을 화살표 5개로 옮긴다.',
    question: '몇 개의 화살표가 필요한가?',
    lead: { label: '재료', text: '§6 전이표를 한 줄도 빠짐없이, 한 줄도 더하지 않고 옮긴다.' },
    visual: { type: 'boxes', data: [
      { title: 'PENDING·PAID에서', body: ['각각 취소 화살표 → CANCELLED(R5).'] },
      { title: '진행 화살표', body: ['PENDING→PAID→SHIPPED→DELIVERED.'] },
    ]},
    foot: { kw: '검산', color: 'teal', body: '화살표 총 5개(§6과 정확히 일치)가 아니면 표를 다시 대조한다.' },
    notes: '화살표 개수를 세게 해서 누락·과다를 스스로 검산하게 한다. 배분 6분.'
  },

  // 06. 적용 — 정적 모델과 대조
  {
    kind: '적용',
    title: '같은 Order, 두 관점',
    sub: '클래스 모델은 무엇이 있는지, 상태도는 무엇이 어떻게 바뀌는지 보여준다.',
    question: '두 모델을 나란히 놓으면 무엇이 다른가?',
    lead: { label: '대조', text: '클래스 모델의 status: OrderStatus 한 줄이, 상태도에서는 5개 노드와 5개 화살표로 펼쳐진다.' },
    visual: { type: 'versus', data: [
      { title: '정적 모델(교시4~5)', body: ['status라는 속성 하나로 표시된다.', '구조(무엇이 있는지)를 담는다.'] },
      { title: '동적 모델(교시6~7)', body: ['그 속성이 가질 수 있는 값·전이가 펼쳐진다.', '행동(어떻게 바뀌는지)을 담는다.'], negative: false },
    ]},
    foot: { kw: '통합', color: 'navy', body: '두 모델은 경쟁하지 않는다 — 정적 모델의 속성 하나가 동적 모델에서 자세히 펼쳐진 것뿐이다.' },
    notes: '"두 산출물이 서로 다른 도구가 아니라 같은 대상의 다른 확대율"이라는 감각을 남긴다. 배분 6분.'
  },

  // 07. 요약
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '분석(부 1)은 여기서 끝난다 — 요구사항에서 정적·동적 모델까지 손으로 만들었다.',
    question: '무엇을 가지고 다음 부로 가는가?',
    lead: { label: '회수', text: '교시2~7에서 만든 유스케이스·정적 모델·상태도가 이후 모든 부(GRASP·SOLID·DDD)의 재료가 된다.' },
    visual: { type: 'takeaways', data: [
      { title: '노드·간선', body: ['상태=노드, 허용 전이=간선, 표에 없으면 안 긋는다.'] },
      { title: '대조', body: ['정적=구조, 동적=행동, 같은 대상의 다른 관점.'] },
      { title: '재사용', body: ['부 1의 산출물은 부 3·5에서 코드로 다시 등장한다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '부 2에서 객체 개념(추상화·캡슐화·다형성·상속)을 짧게 정리하고, 부 3(GRASP)으로 간다.' },
    next: '객체가 무엇으로 되어 있는지 개념만 빠르게 정리하면, 왜 그것으로 충분한가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 2(교시 8 "추상화·캡슐화·다형성·상속")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 7,
  title: '동적 모델 실습',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
