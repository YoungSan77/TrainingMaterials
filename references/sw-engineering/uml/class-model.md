# UML Class / Static Model Baseline

Class rectangle은 이름과 필요시 attribute/operation compartments를 가진다. Attribute는 `[visibility] name : Type`, operation은 `[visibility] name(parameters) : ReturnType` 형식이다. Conceptual model에는 operation을 넣지 않는다.

```notation-reference
{"id":"uml-class","meaning":"class name, attribute, operation compartments.","canonicalRepresentation":{"kind":"class","source":"class Order {\n -status : OrderStatus\n +total() : Money\n}"},"commonProhibitedRealization":"conceptual/design class를 구분하지 않는 것."}
```

Association은 solid line이며 의미가 있을 때 이름을 쓴다. end에는 role과 `1`, `0..1`, `*`, `1..*` 또는 필요한 range를 둘 수 있다. Navigability arrow는 명시적으로 의도할 때만 쓴다. Aggregation은 whole 쪽 hollow diamond, composition은 강한 lifecycle owner 쪽 filled diamond, generalization은 general classifier 쪽 hollow triangle, dependency는 supplier 쪽 dashed arrow다.

```notation-reference
{"id":"uml-class-association","meaning":"구조 관계와 role/multiplicity.","canonicalRepresentation":{"kind":"class","source":"Customer \"1 buyer\" -- \"0..* orders\" Order : places"},"commonProhibitedRealization":"무의미한 association이나 default navigability."}
```
```notation-reference
{"id":"uml-aggregation-composition","meaning":"shared whole-part와 lifecycle ownership.","canonicalRepresentation":{"kind":"class","source":"Team o-- Member\nOrder *-- OrderLine"},"commonProhibitedRealization":"diamond를 장식으로 쓰는 것."}
```
```notation-reference
{"id":"uml-generalization-dependency","meaning":"specialization과 supplier dependency.","canonicalRepresentation":{"kind":"class","source":"CardPayment --|> PaymentMethod\nOrderService ..> PaymentGateway"},"commonProhibitedRealization":"관계 의미를 화살표 모양만으로 교환하는 것."}
```

Interface는 `«interface»` classifier 또는 lollipop이다. Realization은 interface 쪽 hollow triangle의 dashed line이다. Package는 tabbed folder이고 package dependency는 supplier package 쪽 dashed arrow다.

```notation-reference
{"id":"uml-interface-realization","meaning":"interface contract와 realization.","canonicalRepresentation":{"kind":"class","source":"interface PaymentGateway\nProviderAGateway ..|> PaymentGateway"},"commonProhibitedRealization":"realization을 solid inheritance로 그리는 것."}
```
```notation-reference
{"id":"uml-package","meaning":"namespace/group와 package dependency.","canonicalRepresentation":{"kind":"class","source":"package Application\npackage Domain\nApplication ..> Domain"},"commonProhibitedRealization":"deployment node 대용으로 쓰는 것."}
```
