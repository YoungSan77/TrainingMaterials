// 12.js — 교시 12 (부 3 · 책임 주도 설계(GRASP) 마지막 실습 · 부 종합)
// 계약: guides/교재_작성_지침.md / 내용: program-design/ooad-curriculum-2day.md 부 3
//       도메인 소재: program-design/order-domain-definition.md §5(R5~R7)·§8(협력자 실패 경계 —
//       "판단(외부 실패 대응)=유스케이스, 상태 불변식(전이 정당성)=도메인", markPaid()/markPaymentFailed())
// 아크(부3): 교시11이 PlaceOrder 하나를 통짜로 봤다면, 이 교시는 Order 생애 주기 전체
//   (생성→결제→취소)로 넓혀 같은 GRASP 판단이 유스케이스마다 반복되는 패턴을 확인한다.
//   커리큘럼 지정대로 "마지막 실습이 부 종합을 겸한다" — 부0(자세)·부1(모델)·부2(개념)까지 회수한다.
// 본문 7장: 학습목표1 · 현상1 · 원칙1 · 적용3 · 요약1

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'Pay·CancelOrder에도 같은 GRASP 판단이 반복되는 패턴을 확인하고, 부3을 회수할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'Order 생애 주기 전체에서 "자기 상태를 아는 자가 전이를 결정한다"는 패턴이 반복됨을 코드로 확인한다.' },
    visual: { type: 'bullets', data: [
      { head: '확장', text: 'Pay·CancelOrder에 GRASP을 적용해 본다.' },
      { head: '패턴', text: '유스케이스마다 반복되는 판단(정보 소재 추론)을 알아본다.' },
      { head: '회수', text: '부0(자세)~부2(개념)까지 부3에서 어떻게 만나는지 정리한다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시11의 PlaceOrder 통짜 대조가 이 교시의 출발점이다 — 생애 주기 나머지로 넓힌다.' },
    notes: '부3 마지막 교시 — 종합을 겸한다. 배분 3분.'
  },

  // 02. 현상 — 하나의 유스케이스만 보면 반복이 안 보인다
  {
    kind: '현상',
    title: 'PlaceOrder 하나로는 부족하다',
    sub: '생성 하나만 보고 "이게 GRASP 전부"라고 결론 내리면 틀린다.',
    question: '결제·취소에서도 같은 판단이 적용되는가?',
    lead: { label: '관찰', text: 'PlaceOrder에서 본 패턴(자기 상태를 아는 자가 처리)이 우연인지 반복되는 원칙인지는 다른 유스케이스로 확인해야 안다.' },
    visual: { type: 'boxes', data: [
      { title: '한 유스케이스만', body: ['이 패턴이 PlaceOrder만의 특수 사정인지 알 수 없다.'] },
      { title: '생애 주기 전체', body: ['Pay·Cancel까지 봐야 반복되는 원칙인지 확인된다.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: '원칙은 한 예로 증명되지 않는다 — 여러 유스케이스에서 반복돼야 원칙이라 부를 수 있다.' },
    notes: '"일반화의 위험"을 짚고 왜 더 봐야 하는지 세운다. 배분 4분.'
  },

  // 03. 원칙 — 반복되는 질문
  {
    kind: '원칙',
    title: '매 유스케이스마다 같은 질문',
    sub: '"이 판단(전이 정당성)을 누가 갖는가"는 유스케이스가 바뀌어도 같은 질문이다.',
    question: '유스케이스가 바뀌면 GRASP 질문도 바뀌는가?',
    lead: { label: '경계(정본)', text: 'order-domain-definition.md §8: 외부 실패 대응은 유스케이스가, 상태 불변식(전이 정당성)은 도메인(Order)이 갖는다 — 규칙 누수가 아니라 역할 분리다.' },
    visual: { type: 'boxes', data: [
      { title: '유스케이스가 갖는 것', body: ['결제 실패·재고 부족 같은 외부 상호작용의 결과 판단.'] },
      { title: 'Order가 갖는 것', body: ['그 결과를 받아 전이가 정당한지(R6·R7)를 스스로 확인.'] },
    ]},
    foot: { kw: '재사용', color: 'navy', body: '이 경계는 새로 정하지 않는다 — order-domain-definition.md §8이 이미 확정한 것을 GRASP 어휘로 다시 읽을 뿐이다.' },
    notes: '정본: order-domain-definition.md §8(markPaid/markPaymentFailed). 배분 4분.'
  },

  // 04. 적용 — Pay에 GRASP 적용
  {
    kind: '적용',
    title: 'Pay: 결제 뒤 전이',
    sub: '결제 성공 여부를 안 뒤, 상태를 누가 바꾸는가.',
    question: '결제가 끝나면 상태 전이는 누가 결정하나?',
    lead: { label: 'GRASP', text: 'Information Expert — 전이 정당성(R7: 결제 선행)을 아는 자는 Order 자신이다.' },
    visual: { type: 'codepair', data: {
      prompt: '결제 뒤 상태 전이 책임이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'if (order.getStatus() != PENDING)\n    throw new IllegalStateException();\nboolean ok = gateway.charge(order.getTotal());\nif (ok) order.setStatus(PAID);',
          marks: [{ line: 4, tag: '바깥이 상태를 직접 바꿈' }] },
        { label: '적용', code: 'PaymentResult r = paymentPort.charge(order.total());\norder.markPaid(r);\n// Order.markPaid(): R6·R7 전이 정당성을 스스로 확인',
          marks: [{ line: 2, tag: 'Order가 전이 소유(R6·R7)' }] },
      ] } },
    foot: { kw: '경계', color: 'teal', body: '결제 성공·실패 "판단"은 유스케이스가, "전이가 정당한가"는 Order가 — §8 경계 그대로다.' },
    notes: '정본: order-domain-definition.md §8(markPaid 예). 배분 6분.'
  },

  // 05. 적용 — CancelOrder에 GRASP 적용
  {
    kind: '적용',
    title: 'Cancel: 취소 조건',
    sub: 'SHIPPED 이후면 거부, 그 전이면 허용 — 이 판단은 누가 하는가.',
    question: '취소 가능 여부는 누가 판단하나?',
    lead: { label: 'GRASP', text: '교시3의 Given-When-Then 시나리오가 여기서 코드가 된다 — Order가 자기 상태(R5)를 보고 스스로 결정한다.' },
    visual: { type: 'codepair', data: {
      prompt: '취소 조건 판단이 어디에서 어디로 갔나',
      versions: [
        { label: '절차', code: 'if (order.getStatus() == SHIPPED\n    || order.getStatus() == DELIVERED)\n    throw new IllegalStateException();\norder.setStatus(CANCELLED);',
          marks: [{ line: 1, tag: '바깥이 조건을 판단' }] },
        { label: '적용', code: 'order.cancel();\n// Order.cancel(): 자기 상태로 R5(취소 조건)를\n// 스스로 확인하고 거부하거나 전이한다',
          marks: [{ line: 1, tag: 'Order가 취소 조건 소유' }] },
      ] } },
    foot: { kw: '회수', color: 'teal', body: '교시3에서 쓴 시나리오(Given=PENDING/SHIPPED, When=취소 요청, Then=허용/거부)가 그대로 이 코드의 사양이다 — 고아가 되지 않았다.' },
    notes: '정본: order-domain-definition.md §5(R5)·§6. 교시3의 G-W-T 재사용을 명시적으로 짚는다(lab-design.md가 예고한 그대로). 배분 6분.'
  },

  // 06. 적용 — 부3 종합: 반복되는 패턴
  {
    kind: '적용',
    title: '세 유스케이스, 같은 패턴',
    sub: 'PlaceOrder·Pay·Cancel 모두 "자기 상태를 아는 자가 처리"로 수렴한다.',
    question: '세 유스케이스를 나란히 놓으면 무엇이 반복되는가?',
    lead: { label: '수렴', text: '유스케이스는 다르지만 원칙 적용은 같다 — Information Expert가 매번 "누가 아는가"로 답을 준다.' },
    visual: { type: 'boxes', data: [
      { title: 'PlaceOrder', body: ['addLine()이 생성·검증(Creator+Expert)을 갖는다.'] },
      { title: 'Pay', body: ['markPaid()가 전이 정당성(Expert)을 갖는다.'] },
      { title: 'Cancel', body: ['cancel()이 취소 조건(Expert)을 갖는다.'] },
    ]},
    foot: { kw: '결론', color: 'navy', body: '세 메서드 이름은 다르지만 판단 절차(정보 소재 추론)는 하나다 — 이게 원칙이 도구인 이유다.' },
    notes: '부3 종합의 핵심 장 — "코드는 다르지만 판단은 같다"는 감각을 남긴다. 배분 6분.'
  },

  // 07. 요약 — 부3 종합
  {
    kind: '요약',
    head: '요약',
    title: '요약 — 부 3 종합',
    sub: 'GRASP는 매 유스케이스마다 같은 질문(정보가 어디 있나)을 되묻는 도구다.',
    question: '부 0~3을 가지고 다음 부로 무엇을 들고 가는가?',
    lead: { label: '회수', text: '부0의 자세(Just Enough)·부1의 모델(정적·동적)·부2의 이름(캡슐화 등)이 부3에서 GRASP 판단 하나로 합류했다.' },
    visual: { type: 'takeaways', data: [
      { title: '부0 회수', body: ['필요악·Just Enough — GRASP도 판단 도구지 정답표가 아니다.'] },
      { title: '부1 회수', body: ['정적 모델의 클래스·동적 모델의 상태 전이가 GRASP 판단의 재료였다.'] },
      { title: '부3 결론', body: ['원칙은 여럿이지만 판단 절차(정보 소재 추론)는 하나다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '배치를 원칙으로 다듬고(SOLID) 테스트로 설계 압력을 앞당긴다.' },
    next: 'GRASP로 배치한 책임이 변화에 정말 견디는지, 무엇으로 다시 확인하는가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 4(교시 13 "SOLID")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 12,
  title: '책임 분배 실습 (부 3 종합)',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
