# UML Sequence Baseline

Participant header와 dashed lifeline은 actor/object/system participant와 시간에 따른 존재를 나타내며 message ordering은 위에서 아래다. synchronous와 asynchronous message를 구분한다. dashed return은 선택 사항이다. activation(execution specification)은 behavior 수행 기간이다. creation message는 lifeline 시작점으로, destruction은 끝의 `X`로 표현한다.

```notation-reference
{"id":"uml-sequence-core","meaning":"lifeline 사이 message의 시간 순서와 activation.","canonicalRepresentation":{"kind":"sequence","source":"actor Customer\nparticipant OrderService\nCustomer -> OrderService: placeOrder(items)\nactivate OrderService\nOrderService --> Customer: orderId\ndeactivate OrderService"},"commonProhibitedRealization":"return을 항상 강제하거나 arrow를 장식으로 쓰는 것."}
```
```notation-reference
{"id":"uml-sequence-async-message","meaning":"sender가 receiver의 완료를 기다리지 않는 asynchronous message.","canonicalRepresentation":{"kind":"sequence","source":"OrderService ->> EventBus: orderPlaced(orderId)"},"commonProhibitedRealization":"synchronous call과 구분 없이 같은 arrowhead를 사용하는 것."}
```
```notation-reference
{"id":"uml-sequence-lifecycle","meaning":"instance creation/destruction.","canonicalRepresentation":{"kind":"sequence","source":"create Order\nOrderService -> Order: <<create>>\nOrderService ->x Reservation: cancel"},"commonProhibitedRealization":"creation 전부터 lifeline을 존재시키는 것."}
```

Combined fragment의 `alt`는 guard별 대안, `opt`는 단일 선택, `loop`는 반복이다. 필요할 때 `par`는 병행, `break`는 나머지 interaction 중단을 뜻한다.

```notation-reference
{"id":"uml-sequence-fragment","meaning":"interaction control fragment.","canonicalRepresentation":{"kind":"sequence","source":"alt approved\n PaymentService -> Order: confirm()\nelse declined\n PaymentService -> Order: reject()\nend"},"commonProhibitedRealization":"단순 시각 그룹에 fragment를 쓰는 것."}
```
```notation-reference
{"id":"uml-sequence-opt","meaning":"guard가 참일 때만 실행하는 단일 선택 operand.","canonicalRepresentation":{"kind":"sequence","source":"opt coupon supplied\n Customer -> OrderSystem: applyCoupon(code)\nend"},"commonProhibitedRealization":"서로 배타적인 여러 대안을 하나의 opt로 표현하는 것."}
```
```notation-reference
{"id":"uml-sequence-loop","meaning":"guard 또는 반복 조건에 따라 operand를 반복한다.","canonicalRepresentation":{"kind":"sequence","source":"loop for each item\n Customer -> OrderSystem: addItem(itemId, quantity)\nend"},"commonProhibitedRealization":"반복 의미가 없는 message group에 loop를 쓰는 것."}
```
```notation-reference
{"id":"uml-sequence-par","meaning":"여러 operand가 병행될 수 있음을 표현한다.","canonicalRepresentation":{"kind":"sequence","source":"par reserve inventory\n OrderSystem -> Inventory: reserve(items)\nelse authorize payment\n OrderSystem -> Payment: authorize(total)\nend"},"commonProhibitedRealization":"서로 배타적인 대안을 par로 표현하는 것."}
```
```notation-reference
{"id":"uml-sequence-break","meaning":"guard가 참이면 enclosing interaction의 나머지를 중단하는 operand.","canonicalRepresentation":{"kind":"sequence","source":"break payment declined\n Payment -> OrderSystem: decline(reason)\nend"},"commonProhibitedRealization":"일반적인 optional behavior를 break로 표현하는 것."}
```
