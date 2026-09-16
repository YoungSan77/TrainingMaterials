# UML Communication Diagram Baseline

Communication Diagram은 Sequence Diagram과 같은 interaction을 participant 연결 구조와 numbered message로 표현한다. 두 Diagram은 같은 interaction semantics를 공유하지만, Sequence Diagram은 시간 순서를 세로축으로 강조하고 Communication Diagram은 participant 사이의 link와 collaboration 구조를 강조한다.

participant는 현재 분석 질문에 필요한 Actor, System 또는 problem-domain role이다. link는 interaction에 참여하는 두 participant의 연결 가능성을 나타내며, message 번호가 실행 순서를 표현한다. 번호는 `1`, `1.1`, `1.2`, `2`처럼 중첩 호출과 후속 message의 순서를 드러낼 수 있다.

```notation-reference
{"id":"uml-communication-core","meaning":"participant link 위의 numbered message로 interaction 순서와 collaboration 구조를 함께 표현한다.","canonicalRepresentation":{"kind":"communication","source":"object Customer\nobject Order\nobject Payment\nCustomer -- Order : 1: placeOrder(items)\nOrder -- Payment : 1.1: requestPayment(total)\nPayment -- Order : 1.2: paymentConfirmed"},"commonProhibitedRealization":"message 번호 없이 단순 object network로 만들거나 link를 static association으로 해석하는 것."}
```

```notation-reference
{"id":"uml-communication-numbering","meaning":"message numbering은 interaction의 temporal order와 nested call을 표현한다.","canonicalRepresentation":{"kind":"communication","source":"Customer -- Order : 1: placeOrder(items)\nOrder -- OrderItem : 1.1: calculateSubtotal()\nOrder -- Payment : 2: requestPayment(total)"},"commonProhibitedRealization":"번호를 장식이나 목록 번호로 취급하거나 동일 interaction에서 순서가 충돌하게 쓰는 것."}
```

Communication Diagram을 최종 object topology나 class association 정본으로 사용하지 않는다. 같은 interaction에서 시간 흐름과 fragment가 핵심이면 Sequence Diagram을, participant 연결과 message routing이 핵심이면 Communication Diagram을 선택한다.
