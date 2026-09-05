# Larman System Sequence Diagram Baseline

SSD는 System을 black box로 본다. 외부 Actor와 **하나의 System lifeline**만 두고 Actor가 보내는 의미 있는 request인 System Event를 message로 표현한다. Controller/Service/Repository 등 내부 object는 넣지 않는다. 모든 Flow에 만들지 않고 복잡하거나 interaction을 명확히 볼 필요가 있는 Event Flow에 선택한다.

```notation-reference
{"id":"larman-ssd-black-box","meaning":"Actor와 하나의 black-box System 사이 System Event.","canonicalRepresentation":{"kind":"sequence","source":"actor Customer\nparticipant \"Order System\" as System\nCustomer -> System: placeOrder(items)"},"commonProhibitedRealization":"내부 object를 participant로 넣는 것."}
```

Response/return은 항상 필수가 아니며 context가 요구할 때만 표시한다. Actor request가 System Event이고 이를 처리하는 System-level behavior가 System Operation이다. `Event → Operation`은 별도 lifecycle deliverable sequence가 아니라 같은 interaction을 request와 behavior 관점에서 식별한 관계다.

```notation-reference
{"id":"larman-ssd-response","meaning":"필요할 때 선택하는 System response.","canonicalRepresentation":{"kind":"sequence","source":"Customer -> System: placeOrder(items)\nSystem --> Customer: orderNumber"},"commonProhibitedRealization":"모든 request에 return을 강제하는 것."}
```
