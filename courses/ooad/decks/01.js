const slides = [
  {
    kind: '학습 목표', title: 'OOAD를 보는 기준',
    sub: 'OOAD가 변경을 다루는 방식을 객체 경계와 책임으로 설명한다',
    question: 'OOAD는 복잡한 코드를 어떤 관점으로 다루는가?',
    lead: { label: '학습 목표', text: '코드 조직의 한계에서 객체 경계가 필요한 이유까지 연결한다.' },
    visual: { type: 'bullets', data: [
      { head: '진화', text: '코드 조직 방식이 해결해 온 한계를 구분한다.' },
      { head: '객체', text: '메시지·지역 상태·책임의 관계를 설명한다.' },
      { head: '판단', text: '필요악·Just Enough·예방과 상환을 적용한다.' }
    ] },
    foot: { kw: '관점', color: 'navy', body: '표기법보다 변경을 국소화하는 경계와 책임에 집중한다.' },
    notes: '4분. 오늘의 범위는 과정 안내가 아니라 OOAD의 개념·필요성·관점이다.'
  },
  {
    kind: '선언', title: '명세 역량의 자리', proposition: 'proposition.governing',
    visual: { type: 'statement', text: 'LLM은 우발 복잡도를 걷어낸다. 남는 본질 복잡도는 대부분 암묵지 — 요구사항·도메인 규칙·불변식·경계 — 이고, LLM은 이를 확률로 추론할 뿐 명세하지 못한다. 그 명세는 인간의 몫이며, 명세하지 못한 격차는 개발자가 메운다. 이 프로그램이 가르치는 요구공학·도메인 모델링·아키텍처가 바로 그 명세 기술이다. 도구가 강해질수록 이 역량은 덜 필요해지지 않고 더 드러난다. 용어는 새로워도 문제는 Brooks(essence/accidental)·에반스(VO·Aggregate)가 정리한 그것이다.' },
    notes: '4분. 프로그램 명제를 축자 선언하고 요구사항·규칙·경계를 명시하는 OOAD의 역할로 연결한다.'
  },
  {
    kind: '현상', title: '코드 조직의 진화', claim: 'C1',
    sub: '코드 조직은 앞선 접근의 한계를 줄이는 방향으로 진화했다',
    question: '각 접근은 바로 앞 방식의 어떤 한계를 줄였는가?',
    lead: { label: '연속된 보정', text: '새 접근은 이전 방식을 지우기보다 통제하기 어려운 지점을 보정한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'spaghetti', label: '스파게티' }, { id: 'structured', label: '구조화' },
      { id: 'modular', label: '모듈화' }, { id: 'oo', label: '객체 경계' }
    ], edges: [
      { from: 'spaghetti', to: 'structured', label: '제어 흐름' },
      { from: 'structured', to: 'modular', label: '기능 분해' },
      { from: 'modular', to: 'oo', label: '변경 파급' }
    ] } },
    foot: { kw: '진화', color: 'navy', body: 'OO는 데이터와 행위의 분리에서 생긴 변경 파급을 경계와 책임으로 줄인다.' },
    notes: '3분. 역사 연표가 아니라 제어 흐름→기능 분해→변경 국소화라는 문제 전환만 설명한다.'
  },
  {
    kind: '현상', title: '나란한 두 관점', claim: ['C2', 'C3'],
    sub: '객체와 함수형은 상태를 다루는 서로 다른 축이다',
    question: '함수형은 객체지향 다음 단계인가?',
    lead: { label: '병렬 관계', text: '실무에서는 두 관용구가 섞이지만 이 과정은 객체의 경계와 협력에 집중한다.' },
    visual: { type: 'versus', data: [
      { title: '객체 관점', body: ['상태를 경계 안에 보호', '메시지와 책임으로 협력'], negative: false },
      { title: '함수형 관점', body: ['불변 값으로 상태를 다룸', '순수 함수로 변환을 표현'], negative: false }
    ] },
    foot: { kw: '경계', color: 'teal', body: '함수형은 우열 비교 대상이 아니라 나란한 상태 규율이며 이 세션의 비중심 축이다.' },
    notes: '3분. 객체 다음에 함수형이 온다는 선형 계보를 만들지 않고 과정의 범위를 밝힌다.'
  },
  {
    kind: '현상', title: '분리된 데이터와 함수', claim: ['C4', 'C5'],
    sub: '공유 상태와 절차가 따로 커지면 규칙의 자리가 흩어진다',
    question: 'Order 취소 가능 여부는 어디에서 판단되는가?',
    lead: { label: '절차적 Order', text: 'create·pay·ship·cancel이 같은 Order 상태를 읽으면 하나의 규칙에 여러 판단 지점이 생긴다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'services', label: '서비스 함수' }, { id: 'order', label: '공유 Order' },
      { id: 'callers', label: '여러 호출부' }
    ], edges: [
      { from: 'services', to: 'order', label: '상태 읽기' },
      { from: 'order', to: 'callers', label: '취소 판단 분산' }
    ] } },
    foot: { kw: '분산', color: 'failL', body: '취소 규칙이 procedure·service와 호출부로 퍼지면 변경할 곳도 함께 늘어난다.' },
    notes: '4분. 구현 코드를 만들지 않고 shared data와 네 procedure의 관계만 보여준다. 취소 조건은 SHIPPED 이전이다.'
  },
  {
    kind: '현상', title: '요구 변경의 파급', claim: 'C6',
    sub: '흩어진 규칙은 한 요구 변경을 여러 코드 변경으로 증폭시킨다',
    question: '취소 정책 하나가 바뀌면 몇 곳을 함께 고쳐야 하는가?',
    lead: { label: '산탄총 수정', text: '변경 이유는 하나지만 수정 지점과 누락 위험은 여러 곳에 생긴다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'policy', label: '정책 변경' }, { id: 'search', label: '판단 탐색' },
      { id: 'edits', label: '동시 수정' }, { id: 'risk', label: '누락 위험', gate: true }
    ] } },
    foot: { kw: '파급', color: 'failT', body: '규칙의 위치를 모르면 변경 작업은 검색과 동기화 문제가 된다.' },
    notes: '3분. C5의 구조가 요구 변경 시 어떤 작업 비용으로 나타나는지 연결한다.'
  },
  {
    kind: '원인', title: '넓어진 지식의 범위', claim: 'C7',
    sub: '지식이 공유 상태로 새면 변경의 영향 범위도 넓어진다',
    question: '왜 관련 없어 보이는 함수까지 같은 변경에 흔들리는가?',
    lead: { label: '원인', text: '업무 지식이 소유자 없이 공유 자료구조에 노출되어 있기 때문이다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'rule', label: '취소 지식' }, { id: 'shared', label: '공유 상태' },
      { id: 'callers', label: '여러 호출부' }, { id: 'blast', label: '넓은 파급' }
    ], edges: [
      { from: 'rule', to: 'shared', label: '누출' }, { from: 'shared', to: 'callers', label: '직접 판단' },
      { from: 'callers', to: 'blast', label: '동시 영향' }
    ] } },
    foot: { kw: '소유', color: 'navy', body: '문제는 함수 개수가 아니라 규칙을 책임지는 경계가 없다는 데 있다.' },
    notes: '3분. C6의 결과를 C7의 원인으로 되짚고 다음 객체 경계로 연결한다.'
  },
  {
    kind: '원칙', title: '객체의 핵심 구성', claim: 'C8',
    sub: '객체는 상태를 보호하며 메시지로 협력하고 책임지는 단위다',
    question: '데이터와 함수를 한곳에 두는 것만으로 객체가 되는가?',
    lead: { label: '객체', text: '경계 안의 상태를 직접 노출하지 않고 메시지로 책임 수행을 요청한다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'message', label: '메시지' }, { id: 'boundary', label: '보호 경계' },
      { id: 'state', label: '지역 상태' }, { id: 'change', label: '변경 국소화' }
    ], edges: [
      { from: 'message', to: 'boundary', label: '책임 요청' }, { from: 'boundary', to: 'state', label: '보호' },
      { from: 'state', to: 'change', label: '영향 제한' }
    ] } },
    foot: { kw: '객체', color: 'teal', body: '상태·메시지·책임이 함께 있을 때 경계가 변경을 국소화한다.' },
    notes: '4분. [Sources] Q01 — Alan Kay, Email to Stefan Ram, 23 July 2003, email body. 메시징·지역 상태 보호·늦은 바인딩 계보를 교육용 paraphrase로 설명하며 축자 인용하지 않는다.'
  },
  {
    kind: '원칙', title: '경계와 책임의 연결', claim: ['C9', 'C10'],
    sub: 'OOAD는 경계를 찾아 책임의 주인을 정하는 활동이다',
    question: '분석의 대상은 어떻게 설계의 책임 주체가 되는가?',
    lead: { label: '두 질문', text: '분석은 무엇이 존재하는지 찾고, 설계는 그 일을 누가 맡을지 정한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'what', label: '무엇인가' }, { id: 'boundary', label: '경계 설정' },
      { id: 'who', label: '누가 하나' }, { id: 'owner', label: '책임 주체' }
    ], edges: [
      { from: 'what', to: 'boundary', label: '분석' }, { from: 'boundary', to: 'who', label: '설계' },
      { from: 'who', to: 'owner', label: '배치' }
    ] } },
    foot: { kw: 'OOAD', color: 'navy', body: '객체 경계는 “이 일은 누구 책임인가”라는 설계 질문에 답할 자리를 만든다.' },
    notes: '3분. 분석=무엇, 설계=누가라는 경계를 연속된 판단으로 설명한다.'
  },
  {
    kind: '원칙', title: '필요악으로서의 설계', claim: 'C11',
    sub: '분석과 설계는 완벽하지 않은 코드를 보정하기 위한 활동이다',
    question: '분석과 설계는 언제 도움이 되고 언제 오버헤드가 되는가?',
    lead: { label: '필요악', text: '완벽한 코드가 불가능해 도입한 보정이므로 목적과 비용을 함께 판단한다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'imperfect', label: '불완전한 코드' }, { id: 'correction', label: '보정 활동' },
      { id: 'fit', label: '목적 적합' }, { id: 'overhead', label: '오용·과잉' }
    ], edges: [
      { from: 'imperfect', to: 'correction', label: '필요' }, { from: 'correction', to: 'fit', label: '아는 채 적용' },
      { from: 'correction', to: 'overhead', label: '모르거나 과잉' }
    ] } },
    foot: { kw: '필요악', color: 'navy', body: '완벽한 코드가 불가능해서 도입된 보정이다 — 목적에 맞게 쓰면 도움, 오용하면 필요악이다.' },
    notes: '3분. stance.necessary-evil SHORT를 foot에 축자 사용한다.'
  },
  {
    kind: '원칙', title: 'Just Enough의 두 부채', claim: 'C12',
    sub: '사전 활동은 부족과 과잉이 만드는 두 부채 사이에서 조절한다',
    question: '분석과 설계는 많을수록 좋은가?',
    lead: { label: 'Just Enough', text: '코드가 요구하는 만큼만 수행하고 나머지는 반복적으로 배운다.' },
    visual: { type: 'versus', data: [
      { title: '모자람', body: ['규칙과 경계를 모름', '무지 부채가 누적'], negative: true },
      { title: '넘침', body: ['쓰지 않을 결정을 선점', '과잉 부채가 누적'], negative: true }
    ] },
    foot: { kw: 'Just Enough', color: 'teal', body: '사전 활동은 코드가 요구하는 만큼만 — 모자라면 부채, 넘치면 그 자체가 부채다.' },
    notes: '3분. stance.just-enough SHORT의 의미를 유지하고 가운데 판단 기준은 lead로 제시한다.'
  },
  {
    kind: '원칙', title: '예방과 상환의 순환', claim: 'C13',
    sub: '사전 활동은 부채를 예방하고 리팩토링은 발생한 부채를 상환한다',
    question: '설계는 코딩 전에 끝나는 활동인가?',
    lead: { label: '시간 축', text: '예방과 상환은 대립이 아니라 코드에서 배우며 반복하는 한 순환이다.' },
    visual: { type: 'loop', data: { nodes: [
      { id: 'prevent', label: '사전 예방' }, { id: 'code', label: '코드 피드백' }, { id: 'repay', label: '리팩토링' }
    ], edges: [
      { from: 'prevent', to: 'code' }, { from: 'code', to: 'repay' }, { from: 'repay', to: 'prevent' }
    ] } },
    foot: { kw: '예방·상환', color: 'teal', body: '사전 활동은 부채 예방, 사후 유지보수는 부채 상환을 맡는다.' },
    notes: '3분. stance.prevent-repay SHORT를 바탕으로 예방→코드 피드백→상환의 시간 관계를 보여준다.'
  },
  {
    kind: '원칙', title: '목표와 언어의 나침반', claim: 'C14',
    sub: '유스케이스와 도메인 어휘가 분석과 설계의 방향을 고정한다',
    question: '경계와 책임은 무엇을 기준으로 찾아야 하는가?',
    lead: { label: '두 기준', text: '사용자 목표를 겨누고 같은 업무 언어로 개념과 규칙을 표현한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'goal', label: '사용자 목표' }, { id: 'usecase', label: '유스케이스' },
      { id: 'language', label: '도메인 어휘' }, { id: 'boundary', label: '경계·책임' }
    ], edges: [
      { from: 'goal', to: 'usecase', label: '흐름' }, { from: 'usecase', to: 'language', label: '업무 표현' },
      { from: 'language', to: 'boundary', label: '설계 기준' }
    ] } },
    foot: { kw: 'FORWARD', color: 'navy', body: '다음 유스케이스부터 적용하며, 언어 정합성은 DDD에서 더 깊게 다룬다.' },
    notes: '3분. OOAD의 사용자 목표와 도메인 어휘까지만 설명하고 Ubiquitous Language는 DDD forward boundary로 남긴다.'
  },
  {
    kind: '적용', title: 'Order 경계로의 이동', claim: 'C16',
    sub: 'S01의 Order 사례는 흩어진 판단을 책임 경계로 옮기는 전환을 보여준다',
    question: '취소 가능 판단의 주인은 어디에 있어야 하는가?',
    lead: { label: '주 사례', text: 'SHIPPED 이전에만 취소 가능하다는 규칙을 Order가 책임지게 한다.' },
    visual: { type: 'versus', data: [
      { title: '절차적 구조', body: ['공유 상태를 여러 함수가 읽음', '취소 판단이 호출부에 분산'], negative: true },
      { title: '객체 경계', body: ['Order가 상태와 규칙을 보호', 'cancel 요청에 책임으로 응답'], negative: false }
    ] },
    foot: { kw: 'Order', color: 'teal', body: '상태와 규칙은 같고, 달라지는 것은 그 규칙을 책임지는 경계다.' },
    notes: '4분. Common Standard §5 R5와 §6 상태 머신만 사용한다. PENDING·PAID는 취소 가능하고 SHIPPED 이후는 불가하다. NewPOS는 사용하지 않는다.'
  },
  {
    kind: '요약', title: 'OOAD 개요 요약', head: '요약',
    sub: 'OOAD는 변경을 국소화할 경계와 책임을 찾는 활동이다',
    question: '오늘의 관점을 한 문장으로 어떻게 연결할 수 있는가?',
    lead: { label: '회수', text: '분산된 지식을 객체 경계 안의 책임으로 옮기고 필요한 만큼 반복한다.' },
    visual: { type: 'takeaways', data: [
      { title: '문제', body: ['공유 상태와 흩어진 규칙은 변경 파급을 넓힌다.'] },
      { title: '원칙', body: ['객체는 상태를 보호하고 메시지로 책임을 수행한다.'] },
      { title: '판단', body: ['필요악·Just Enough·예방과 상환으로 비용을 조절한다.'] }
    ] },
    foot: { kw: 'OOAD', color: 'navy', body: '분석은 무엇을 찾고, 설계는 그 책임을 누가 맡을지 정한다.' },
    notes: '3분. 세션의 문제→원인→원칙→적용 흐름을 회수한다.'
  }
];

module.exports = { session: {
  no: 1, title: 'OOAD 개요', type: '설명형', slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
} };
