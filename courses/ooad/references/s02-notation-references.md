# S02 Domain Reference Applications

> **Role:** shared Software Engineering references를 S02 running example에 적용할 때 필요한 course-local 결정만 소유한다.
>
> **Shared authority (language):**
> - `references/sw-engineering/uml/use-case.md`
> - `references/sw-engineering/larman/ssd.md`
> - `references/sw-engineering/larman/operation-contract.md`
> - `references/sw-engineering/modeling-conventions.md`

## Place Order SSD

Shared `larman-ssd-black-box` convention을 Place Order에 적용한다. 이번 S02 teaching example은 System Event 식별에 집중하므로 request-only SSD를 사용하며 response/return line을 넣지 않는다.

```notation-reference
{
  "id": "s02-ssd-example",
  "meaning": "S02 Place Order에서 Customer의 의미 있는 request만 보여주는 request-only SSD 예시.",
  "canonicalRepresentation": {
    "kind": "sequence",
    "source": "participant Customer\nparticipant \"Order System\" as OS\nCustomer -> OS: placeOrder(items)"
  },
  "commonProhibitedRealization": "System 내부 구현 participant나 System→Customer response/return line을 이 S02 예시에 추가하는 것."
}
```

## Order Use Case Diagram Values

S02의 integrated diagram은 shared UML vocabulary를 그대로 사용하고 값만 다음과 같이 적용한다.

- Actor: `Customer`, `Administrator`
- Use Case: `Place Order`, `Check Order Status`, `Manage Order`
- System Boundary: `Order System`
- Association: plain undirected line

Card/Bank Transfer는 `Place Order` Flow의 variation이며 별도 Use Case로 자동 승격하지 않는다. 외부 결제 사업자를 Actor로 둘지는 확인된 System Boundary에 따라 결정한다.

## S02-specific constraints

- Actor, Use Case, System Boundary를 generic card/box로 바꾸지 않고 `Goal`을 ellipse 이름으로 쓰지 않는다.
- S02 request-only SSD에는 response/return 또는 내부 participant를 추가하지 않는다.
- Operation Contract는 shared semantics를 적용해 `placeOrder(items)` flow의 중요하거나 복잡한 operation만 선택하며 별도 `State Change` deliverable을 만들지 않는다.
