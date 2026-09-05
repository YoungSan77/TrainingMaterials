# UML Component Baseline

Component는 replaceable/modular unit이며 component icon 또는 `«component»` rectangle이다. Provided Interface는 lollipop, Required Interface는 socket이고 assembly connector로 결합할 수 있다. Dependency는 supplier 쪽 dashed arrow다. Port는 boundary의 small square이며 interaction point가 실제로 중요할 때만 쓴다.

```notation-reference
{"id":"uml-component","meaning":"component와 interface/dependency relationship.","canonicalRepresentation":{"kind":"component","source":"component OrderComponent\ninterface PaymentAPI\nOrderComponent ..> PaymentAPI"},"commonProhibitedRealization":"class/node/service boundary를 의미 구분 없이 component로 만드는 것."}
```
```notation-reference
{"id":"uml-component-interface-port","meaning":"provided/required interface와 선택적 port.","canonicalRepresentation":{"kind":"component","source":"component OrderComponent\n() PaymentAPI\nOrderComponent -- PaymentAPI"},"commonProhibitedRealization":"lollipop/socket/port를 장식으로 쓰는 것."}
```
```notation-reference
{"id":"uml-component-required-interface","meaning":"Component가 환경에 요구하는 Interface를 socket으로 표현한다.","canonicalRepresentation":{"kind":"component","source":"component OrderComponent\ninterface PaymentAPI\nOrderComponent -( PaymentAPI"},"commonProhibitedRealization":"required socket을 provided lollipop으로 뒤집어 표현하는 것."}
```
```notation-reference
{"id":"uml-component-port","meaning":"Component boundary에 있는 명시적 interaction point인 Port.","canonicalRepresentation":{"kind":"component","source":"component OrderComponent {\n portout paymentPort\n}"},"commonProhibitedRealization":"interaction point 의미 없이 boundary square를 장식으로 추가하는 것."}
```
