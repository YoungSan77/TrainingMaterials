# UML Use Case Baseline

Actor는 System과 상호작용하는 외부 **Role**(stick figure)이다. Actor는 달성하려는 Goal을 가지며, 그 Goal을 달성하기 위해 Subject가 제공해야 하는 externally observable behavior를 Use Case로 식별한다. **Goal과 Use Case는 동일 개념이 아니다.** Use Case name은 Goal을 드러내는 동사구로 표현하는 것이 일반적이며, ellipse 안에는 `Goal` 같은 generic category label이 아니라 `Place Order` 같은 실제 Use Case name을 쓴다.

```text
Actor Goal: 주문을 완료한다
Use Case: Place Order
```

System Boundary는 System 이름을 표시한 rectangle이다. Boundary 자체를 설명할 때는 Actor, Use Case, Association이 없는 이름 있는 rectangle만으로 충분하다. Integrated Use Case Diagram에서는 Actor를 boundary 밖에, Use Case를 안에 두고 association으로 연결한다. Association은 참여를 나타내는 plain undirected line이지 workflow/dataflow/call direction이 아니다.

```notation-reference
{"id":"uml-actor","meaning":"System과 상호작용하는 외부 Role.","canonicalRepresentation":{"kind":"usecase","source":"actor Customer"},"commonProhibitedRealization":"Actor를 System 내부 box로 표현하는 것."}
```
```notation-reference
{"id":"uml-use-case","meaning":"Actor Goal 달성을 위해 Subject가 제공하는 externally observable behavior; Goal 자체가 아니다.","canonicalRepresentation":{"kind":"usecase","source":"usecase \"Place Order\" as PlaceOrder"},"commonProhibitedRealization":"Goal을 ellipse 이름으로 쓰거나 ellipse를 box/text로 대체하는 것."}
```
```notation-reference
{"id":"uml-system-boundary","meaning":"분석 대상 System 범위 자체를 나타내는 이름 있는 rectangle.","canonicalRepresentation":{"kind":"usecase","source":"rectangle \"Order System\" {\n}"},"commonProhibitedRealization":"이름 없는 box나 artificial responsibility card로 대체하는 것."}
```
```notation-reference
{"id":"uml-use-case-association","meaning":"Actor의 Use Case 참여를 나타내는 무방향 association.","canonicalRepresentation":{"kind":"usecase","source":"actor Customer\nusecase \"Place Order\" as PlaceOrder\nCustomer -- PlaceOrder"},"commonProhibitedRealization":"방향 흐름으로 표현하는 것."}
```

```notation-reference
{"id":"uml-integrated-use-case-diagram","meaning":"Actor는 Subject boundary 밖, 실제 이름의 Use Case는 안에 두고 participation association으로 연결한 통합 Use Case Diagram.","canonicalRepresentation":{"kind":"usecase","source":"left to right direction\nactor Customer\nrectangle \"Order System\" {\n usecase \"Place Order\" as PlaceOrder\n}\nCustomer -- PlaceOrder"},"commonProhibitedRealization":"Actor를 boundary 안에 두거나 Goal을 ellipse 이름으로 쓰거나 association을 방향 흐름으로 표현하는 것."}
```

`«include»`는 base가 포함 behavior를 항상 재사용하며 base→included dashed arrow다. `«extend»`는 extension point/condition에서 선택적으로 추가하며 extending→base dashed arrow다. 절차 순서나 단순 subtask 분해에 쓰지 않는다. Generalization은 specialized Actor/Use Case에서 general element 쪽 hollow triangle이다.

```notation-reference
{"id":"uml-use-case-include","meaning":"필수 behavior 재사용.","canonicalRepresentation":{"kind":"usecase","source":"PlaceOrder ..> ValidateCustomer : <<include>>"},"commonProhibitedRealization":"선택 behavior나 순서에 쓰는 것."}
```
```notation-reference
{"id":"uml-use-case-extend","meaning":"조건부 behavior 추가.","canonicalRepresentation":{"kind":"usecase","source":"ApplyCoupon ..> PlaceOrder : <<extend>>"},"commonProhibitedRealization":"항상 수행되는 behavior에 쓰는 것."}
```
```notation-reference
{"id":"uml-use-case-generalization","meaning":"Actor/Use Case specialization.","canonicalRepresentation":{"kind":"usecase","source":"actor Customer\nactor Member\nMember --|> Customer"},"commonProhibitedRealization":"association/call을 inheritance로 표현하는 것."}
```
