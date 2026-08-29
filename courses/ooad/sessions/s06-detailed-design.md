# S06. 책임 설계 ① — RDD로 책임과 협력 보완

- **시간:** 85분
- **상태:** 검토용 초안 v0.2
- **핵심 질문:**  
  **S05에서 자신의 경험으로 만든 Initial Design을 Responsibility-Driven Design 관점에서 어떻게 설명·검증·재배치하고, 객체 간 Message와 Collaboration으로 정제할 것인가?**

---

## 1. Session Position

S05의 결과는 정답 모델이 아니다.

```text
S03 Static Analysis
        +
S04 Dynamic Analysis
        ↓
S05
Experience-based Initial Design
        ↓
S06
Responsibility → Message → Object Contract
→ Role / Collaboration → RDD / GRASP
→ Refined Design
        ↓
S07
New Change → Existing Contract Stress
→ Variation Refinement
```

S05: **“내 경험으로 이 책임을 여기에 배치했다.”**  
S06: **“RDD 관점에서 왜 이 객체가 이 책임을 가져야 하는지 설명할 수 있는가? 다른 배치가 더 나은가?”**

---

## 2. Responsibility

객체 설계를 Class/Attribute/Method 목록부터 시작하지 않고, 객체가 맡아야 할 의미 있는 의무인 Responsibility에서 시작한다.

핵심 질문:

- 이 객체는 무엇을 알아야 하는가?
- 이 객체는 무엇을 해야 하는가?
- 누구와 협력해야 하는가?

---

## 3. Responsibility ≠ Method

Responsibility는 객체가 맡아야 하는 의미 있는 의무이고, Method는 그 책임을 구현하는 하나의 구체 표현이다.

S06에서는 Responsibility와 Message/Collaboration을 설계하되 구현 signature로 너무 빨리 내려가지 않는다.

---

## 4. Knowing / Doing Responsibility

### Knowing

- 자신의 상태
- 관련 객체/구성요소
- 책임 수행에 필요한 Domain knowledge

### Doing

- 계산/판단
- 상태 변화
- 다른 객체에 작업 요청
- 협력 조정

Knowing과 Doing은 암기 항목이 아니라 Responsibility owner를 검토하는 질문이다.

---

## 5. Message

Message는 다른 객체에게 Responsibility 수행을 요청하는 의미 있는 통신이다.

Message를 method syntax로 곧바로 고정하지 않는다.

---

## 6. Object Contract — Message가 지켜야 할 약속

Responsibility와 Message를 정했다면, 호출 가능한 이름만 적지 않고 그 Message가 성립하고 끝난 뒤 무엇을 보장해야 하는지 명시한다.

- **Precondition:** 수신 객체가 Message를 수행하기 전에 호출 측과 협력이 만족해야 할 조건
- **Postcondition:** Message가 정상 완료된 뒤 수신 객체가 보장해야 할 관찰 가능한 상태 변화나 결과
- **Invariant:** 특정 Message 하나를 넘어 객체가 유효한 동안 계속 지켜야 할 일관성

`Place Order → Payment`의 핵심 Message 하나를 예로 본다.

```text
Order.place()

Precondition
- Order에 하나 이상의 OrderItem이 있고 각 quantity가 0보다 크다.
- Order가 아직 place되지 않았다.

Postcondition
- Order total이 각 OrderItem subtotal의 합으로 확정된다.
- Order는 placed 상태가 된다.

Invariant
- Order total은 OrderItem subtotal 합과 일치한다.
- placed Order의 item 구성과 확정 total은 서로 모순되지 않는다.
```

이는 S02의 **System Operation Contract**와 수준이 다르다. S02는 System을 black box로 보고 `placeOrder` 완료 뒤 문제영역에서 무엇이 달라져야 하는지를 기록했다. S06의 **Object Contract**는 설계 안의 특정 수신 객체와 Message가 협력에서 무엇을 요구하고 보장하는지 기록한다.

Object Contract는 별도 문서 양식을 채우는 것이 목적이 아니다. 조건을 지나치게 구현 detail로 쓰거나, 호출 측이 알 수 없는 내부 상태를 precondition으로 떠넘기거나, 실제 owner가 보장할 수 없는 postcondition을 붙이면 계약이 책임 배치를 감추게 된다.

따라서 다음 질문으로 RDD/GRASP 판단을 시작한다.

> **이 precondition을 확인하고 postcondition·invariant를 보장할 knowledge와 authority를 가진 Responsibility owner는 누구인가?**

## 7. Role과 Collaboration — 계약을 협력에 배치하기

Responsibility와 Object Contract를 실제 협력에 배치할 때 조직의 직원 R&R을 비유로 사용할 수 있다.

```text
조직                         Software System
직원                         Object
→ Role                       → Role
→ Responsibility             → Responsibility
→ 필요한 Knowledge/Authority → State/Knowledge
→ Collaboration              → Message/Collaboration
```

> **직원=Object, 부서=Class로 1:1 모델링하자는 뜻이 아니다. 조직에서 R&R을 배치할 때 사용하는 판단 방식이 Responsibility Assignment를 이해하는 데 유사하다는 비유다.**

Role은 객체가 특정 Collaboration에서 수행하는 역할이며, 관련 Responsibility의 묶음으로 이해할 수 있다. 한 직원이 상황에 따라 "결재자" 역할과 "검토자" 역할을 각각 수행하듯, 하나의 객체도 Collaboration 맥락에 따라 여러 Role을 수행할 수 있다.

Collaboration은 각 객체가 자신의 Responsibility를 수행하기 위해 다른 객체의 Responsibility를 사용하는 협력 구조다.

## 8. Responsibility-Driven Design

```text
Responsibility
        ↓
Role / Object
        ↓
Collaboration
```

RDD는 앞에서 명확히 한 Responsibility와 Object Contract를 어떤 Role/Object가 맡고 누구와 협력할지 검토한다.

## 9. CRC 관점

CRC는 Class, Responsibility, Collaborator를 함께 본다.

S06에서는 CRC Card 자체를 별도 산출물로 만들지 않는다. Class Diagram과 Sequence Diagram을 보완하기 위한 사고 관점으로 사용한다.

---

## 10. GRASP 기본 — 실습에 사용할 판단 언어

### Information Expert

> Responsibility 수행에 필요한 의미 있는 정보를 가장 자연스럽게 가진 객체는 누구인가?

DB나 Repository에 데이터가 있다는 뜻이 아니다.

`Order` 총액 계산 책임을 비교한다.

```text
Before
OrderService.calculateTotal(order)
    total = 0
    for item in order.items
        total += item.product.price * item.quantity

After 후보
Order.total()
    sum(item.subtotal())

OrderItem.subtotal()
    quantity * unitPrice
```

`OrderService`가 계산을 위해 OrderItem의 quantity·price 구조까지 알아야 했다면, 그 정보를 이미 자연스럽게 가진 Order·OrderItem이 더 나은 owner 후보일 수 있다. 핵심은 method 위치 자체가 아니라 **그 Responsibility 수행에 필요한 정보를 자연스럽게 아는 객체가 누구인가**이다.

흔한 오용:

- DB/Repository에 데이터가 있다는 이유만으로 Repository를 Expert로 본다.
- Expert라는 이유로 관련된 모든 Responsibility를 한 객체에 몰아넣는다.
- 정보를 가장 많이 아는 객체를 기계적으로 찾고 cohesion·collaboration 비용을 고려하지 않는다.

Information Expert는 강한 출발점이지 자동 정답은 아니다. 다른 Responsibility와의 cohesion, 필요한 collaboration, 실제 change reason과 함께 비교해 최종 배치를 판단한다.

### Creator

> 어떤 객체가 다른 객체의 생성과 lifecycle을 자연스럽게 책임질 수 있는가?

포함/소유, 긴밀한 사용, 초기화 정보, lifecycle 관계를 clue로 본다.

`OrderItem` 생성 책임을 비교한다.

```text
Before
OrderService.addItem(order, product, quantity)
    item = new OrderItem(product, quantity)
    order.items.add(item)

After 후보
Order.addItem(product, quantity)
    item = new OrderItem(product, quantity)
    items.add(item)
```

Order가 OrderItem을 포함하고 lifecycle과 초기화 정보를 자연스럽게 관리한다면 생성 책임을 가까이 두어 일관성을 국소화할 수 있다. 반면 생성이 단순하거나 자연스러운 owner가 없고, 책임 이동이 owner의 dependency와 복잡성만 늘린다면 Creator 기준을 억지로 적용하지 않는다. 단순 생성을 위해 별도 Factory/Creator abstraction을 추가할 필요도 없다.

### Controller

> System Event를 받고 Use Case/System Operation의 흐름을 시작·조정할 책임은 누구에게 둘 것인가?

Framework `Controller` Class와 동일시하지 않는다. Controller가 Domain Rule owner가 되는 것도 아니다.

```text
Before
PlaceOrderController가 total 계산, Payment 판단,
Order 상태 변경까지 모두 수행

After 후보
application/use-case boundary가 요청을 받고 협력을 조정
Order와 Payment가 각자의 Domain Rule과 상태를 책임
```

별도 Controller role이 항상 필요한 것은 아니다. 이미 자연스러운 application/use-case boundary가 System Event를 받고 협력을 시작한다면 Controller 객체를 추가하는 것은 불필요한 indirection이 될 수 있다. 어느 경우에도 Controller는 Domain Rule owner가 아니다.

### High Cohesion

> 한 객체의 Responsibility들이 같은 목적과 변경 이유를 중심으로 얼마나 잘 모여 있는가?

```text
Before
OrderService
- createOrder / addItem / calculateTotal
- requestPayment / updatePaymentStatus
- sendReceipt / saveOrder

After 후보
Order      : 주문 구성, total, 주문 상태
OrderItem  : item subtotal
Payment    : 결제 상태와 결과
coordination role : Place Order 협력 시작·조정
```

서로 다른 의미와 change reason을 가진 책임을 한 Service에 몰지 않는다. 다만 cohesion을 높인다는 이유로 책임을 지나치게 잘게 분리하면 객체 수, collaboration과 indirection 비용이 증가한다. 독립된 역할과 변경 이유가 그 비용을 정당화할 때만 분리한다.

### Low Coupling

> 필요한 Collaboration을 유지하면서 불필요한 knowledge/dependency를 얼마나 줄이는가?

`Place Order` 흐름에서 Controller/Application object가 협력이 필요하다는 이유로 Order·OrderItem·Payment의 내부 상태를 직접 탐색하면, 그 대상들의 내부 구조가 바뀔 때마다 변경이 전파된다.

```text
Before
PlaceOrderController
    items = order.getItems()
    for item in items
        price = item.getUnitPrice()
        qty = item.getQuantity()
    payment.setAmount(total)
    order.setPaymentStatus(payment.getStatus())

After 후보
amount = order.total()
payment = paymentResponsibility.request(amount)
order.reflectPayment(payment.result)
```

Controller가 Order/OrderItem/Payment 내부 구조를 직접 알아야 했던 것을, 의미 있는 message 몇 개로 국소화한다.

판단 질문:

- 이 dependency가 책임 수행에 정말 필요한가?
- 상대 객체의 내부 표현까지 알아야 하는가?
- 더 의미 있는 message 하나로 협력할 수 있는가?
- coupling을 줄이기 위해 추가한 abstraction/중간 객체의 비용이 더 크지 않은가?

흔한 오용:

- dependency 수가 0에 가까울수록 좋다고 생각한다.
- coupling을 줄인다는 이유로 무조건 abstraction/중간 객체를 추가한다.
- collaboration 자체를 없애려고 한 객체에 모든 일을 몰아넣는다.

S06에서는 필요한 collaboration을 유지하면서 불필요한 knowledge/dependency를 줄이는 것까지만 다룬다. 변화 지점을 보호하기 위한 Polymorphism·Pure Fabrication·Indirection·Protected Variations와 이들의 중첩 관계는 S07에서 다룬다.

---

## 11. GRASP는 서로 배타적인 해법 목록이 아니다

```text
Information Expert ✓
Creator ✓
Controller ✓
High Cohesion ✓
Low Coupling ✓
```

처럼 적용 여부를 채우거나 하나만 고르는 것이 목표가 아니다. GRASP는 **Responsibility Assignment를 바라보는 서로 다른 판단 관점**이며, 하나의 설계 결정에 여러 관점이 동시에 성립할 수 있다. 관점끼리 trade-off가 충돌할 수도 있고, 반대로 같은 책임 배치를 함께 지지할 수도 있다.

예를 들어 `Order.total()`과 `OrderItem.subtotal()`에 계산 책임을 배치하는 하나의 결정은 다음처럼 동시에 설명될 수 있다.

- **Information Expert:** 계산에 필요한 주문 항목과 수량·가격 정보를 자연스럽게 가진 곳에 책임을 둔다.
- **High Cohesion:** 주문 계산 책임을 주문 의미와 가까운 객체에 모은다.
- **Low Coupling:** Controller/Service가 OrderItem 내부 구조를 직접 탐색하지 않게 한다.

> **세 개의 GRASP를 각각 적용한 것이 아니라, 하나의 Responsibility Assignment를 세 관점에서 검토한 것이다.**

S06에서는 이 중첩 가능성을 먼저 이해한다. S07에서는 `PaymentGateway` 같은 하나의 설계 결정이 Low Coupling·Pure Fabrication·Indirection·Protected Variations·Polymorphism 등 여러 관점에서 동시에 설명되는 사례로 확장한다.

---

## 12. S05 Initial Design 회수

수강생은 자신의 S05 Initial Design Class Diagram을 다시 연다.

먼저 다음을 표시한다.

- Data-only Class
- Behavior가 집중된 Service/Manager
- owner 근거가 약한 Responsibility
- 여러 객체 내부 state를 알아야 하는 Responsibility
- Sequence와 Class 책임이 맞지 않는 부분

이 단계는 새 모델을 만드는 것이 아니라 Before 모델의 문제를 관찰하는 단계다.

---

## 13. Class Diagram과 Sequence Diagram의 왕복

```text
Design Class Diagram
        ↓ responsibility/message
Design Sequence Diagram
        ↓ 발견된 collaboration 문제
Design Class Diagram 수정
        ↓
다시 Sequence로 검증
```

Class Diagram은 Responsibility의 정적 배치를 보여주고, Sequence Diagram은 그 Responsibility가 실제 Interaction에서 어떻게 협력하는지 검증한다.

---

## 14. Responsibility–Owner Table의 위치

Responsibility–Owner Table은 설명·사고 도구로 사용할 수 있다.

| Responsibility | Candidate Owner | 판단 관점 |
|---|---|---|
| Order total 계산 | Order / OrderItem | Expert, Cohesion |
| Order 생성 | ? | Creator |
| Place Order 요청 수신 | ? | Controller |
| Payment 처리 요청 | ? | Collaboration |

그러나 **실습 필수 산출물은 아니다.** 최종 설계에서 동일 정보를 Class Diagram과 Sequence Diagram이 더 직접적으로 보여주기 때문이다.

---

## 15. Just-enough RDD

S06의 목표는 모든 Class/Method를 확정하는 것이 아니다.

충분한 결과:

- 주요 Responsibility가 적절한 owner에 배치됨
- 주요 Message와 Collaborator가 식별됨
- 핵심 Message 하나의 Object Contract와 그 보장 owner가 명확함
- Class Diagram과 Sequence Diagram이 서로 일관됨
- Responsibility 이동의 이유를 RDD/GRASP 관점에서 설명 가능
- S07 change가 기존 Contract/Collaboration에 주는 압력을 검토할 질문이 남아 있음

---

## 16. Anchor / Reference

### Design by Contract / Meyer

S06에서는 precondition, postcondition, invariant를 핵심 Message의 Object Contract로 사용해 Responsibility owner가 보장할 약속을 명확히 한다. S07은 이 개념을 새로 가르치지 않고 실제 change가 기존 계약에 주는 압력을 관찰한다.

### Responsibility-Driven Design / CRC

S06의 핵심 관점은 Responsibility, Role, Collaboration이다.

### GRASP / Larman

S06 실습의 기본 판단 언어:

- Information Expert
- Creator
- Controller
- High Cohesion
- Low Coupling

GRASP 항목 자체를 암기하거나 상호배타적으로 선택하는 것이 아니라 **하나의 Responsibility Assignment를 여러 관점에서 설명·검토하는 데 사용**한다.

---

# 17. [실습] Responsibility & Collaboration Refinement · 25~30분

> **본편 실습 슬라이드는 1장만 사용한다.** 세부 진행과 힌트는 Slide Notes, 예시 답안은 Session 마지막 `[별첨]`으로 분리한다.

## 실습 슬라이드 — 수강생에게 보이는 내용

> 이 실습은 새 Diagram을 처음부터 작성하는 것이 아니라, 기존 S05 Class Diagram과 S04 Sequence 중 핵심 구간을 수정·발전시키는 **Existing Model Refinement**다.

**입력**

- S02 **Place Order Use Case Diagram / Specification** — 요구 behavior evidence
- S03 **Conceptual Domain Model** — state/relationship evidence
- S04 **Place Order Analysis Sequence Diagram** — interaction evidence이자 핵심 구간의 직접 refinement 대상
- 자신의 S05 **Initial Design Class Diagram**
- 기본 범위: **Place Order → Payment**

**과제**

1. S05 Initial Design Class Diagram에서 Responsibility owner가 약한 부분을 찾아 **그 Class Diagram을 수정**한다(새 Diagram을 처음부터 그리지 않는다).
2. S04 Place Order Analysis Sequence Diagram 중 재배치된 Responsibility와 관련된 **핵심 구간 하나**를 Design Sequence로 발전시켜 Message/Collaboration을 검증한다(전체 interaction을 다시 그리지 않는다).
3. 그 핵심 구간의 Message 하나에 precondition/postcondition과 필요한 invariant를 간결하게 명시하고, 누가 이를 보장할지 확인한다.
4. Sequence와 Object Contract에서 발견된 문제를 Class Diagram에 feedback한다.
5. LLM에게 다른 Responsibility Assignment와 반론을 요청하고 자신의 안과 비교한다.
6. GRASP를 상호배타적으로 고르지 말고, 현재 Responsibility Assignment를 설명하는 데 의미 있는 관점과 각 관점의 근거를 기록한다.

**검토 GRASP 관점**

> **Information Expert · Creator · Controller · High Cohesion · Low Coupling**

**주의**

> 서로 배타적인 선택지가 아니다. 하나의 Responsibility Assignment가 여러 GRASP 관점에서 동시에 설명될 수 있다. 현재 판단에 의미 있는 관점과 각 관점이 무엇을 설명하는지 구분한다.

**필수 산출물**

- **Refined Design Class Diagram 1개** — S05 Initial Design을 수정한 결과
- **Design Sequence Diagram 1개** — S04 Sequence 중 재배치된 Responsibility가 드러나는 핵심 구간 하나를 발전시키고, 그 안의 핵심 Message 하나에 Object Contract를 함께 명시한 결과(전체 interaction이 아니다)

Object Contract를 별도 산출물로 만들지 않는다. `Responsibility–Owner Table`은 필요하면 중간 사고 도구로 사용할 수 있으나 제출 필수는 아니다.

**판단 기준**

- Responsibility owner를 근거로 설명할 수 있는가?
- Controller와 Domain Decision owner를 구분했는가?
- 핵심 Message의 precondition/postcondition/invariant와 이를 보장할 owner가 일치하는가?
- Data-only Object / God Service가 줄었는가?
- 필요한 Collaboration은 유지하면서 불필요한 Coupling을 줄였는가?
- Class와 Sequence가 같은 Responsibility 구조를 말하는가?

**LLM용 추천 프롬프트**

```text
이 Responsibility를 수행하는 데 필요한 정보를 가장 자연스럽게 가진 객체는 누구인가?
현재 배치 때문에 다른 객체의 내부 상태를 과도하게 알아야 하는 곳은 어디인가?
Controller가 Domain Rule까지 소유하고 있는가?
다른 Responsibility Assignment는 가능한가? 대안의 coupling/cohesion 비용은 무엇인가?
GRASP 이름을 checklist처럼 붙이지 말고 실제 Responsibility와 정보 근거로 반론을 제시하라. 하나의 배치가 여러 GRASP 관점에서 동시에 설명될 수 있음을 고려하라.
새로운 기능이나 S07 variation mechanism은 추가하지 마라.
...
```

## Slide Notes — 진행 가이드

권장 시간:

- S05 Before 모델 문제 표시: 5분
- Class Diagram Responsibility 재배치(기존 Diagram 수정): 7분
- Design Sequence 작성(핵심 구간 1개로 한정, 핵심 Message의 precondition/postcondition/invariant 확인 포함): 7분
- Class↔Sequence feedback: 3분
- LLM 대안/반론 검토: 5~8분

강사는 LLM이 GRASP 이름을 기계적으로 붙이거나 서로 배타적인 선택지처럼 취급하는지 확인하게 한다. 이름보다 실제 Responsibility/knowledge/change reason 근거가 우선이다.

---

## [별첨] 실습 해설 — RDD 적용 전/후 비교

### Before — S05에서 흔히 나오는 형태

```text
Order
- data 중심

OrderService
- createOrder
- addItem
- calculateTotal
- requestPayment
- updatePaymentStatus
```

관찰:

- Order가 Data Holder로 남을 수 있다.
- 하나의 Service에 서로 다른 Responsibility가 집중된다.
- 실제 Expert가 누구인지 드러나지 않는다.

### After — 가능한 RDD 보완 방향

```text
Order
- items : OrderItem[1..*]
+ addItem(product, quantity)
+ total()
+ reflectPayment(result)

OrderItem
- quantity
- unitPrice
+ subtotal()

Payment
- amount
- status
+ recordResult(result)

PlaceOrderController / Use-case role
+ placeOrder(items, paymentMethod)

Relations
Order 1 ── 1..* OrderItem : Order가 주문 항목을 포함하고 합계를 책임진다
OrderItem * ── 1 Product : 주문 항목이 선택 Product를 참조한다
Order 1 ── 0..1 Payment : 현재 baseline의 결제 결과를 반영한다
PlaceOrderController ──coordinates──> Order / Payment
```

핵심 Design Sequence:

```text
Customer → PlaceOrderController : placeOrder(items, paymentMethod)
PlaceOrderController → Order : addItem(product, quantity) [반복]
PlaceOrderController → Order : place()
Order → PlaceOrderController : confirmed total
PlaceOrderController → Payment : request(total, paymentMethod)
Payment → PlaceOrderController : paymentResult
PlaceOrderController → Order : reflectPayment(paymentResult)
```

핵심 Message Object Contract:

```text
Order.place()
Precondition  : Order에 하나 이상의 유효한 OrderItem이 있다.
Postcondition : Order가 placed 상태가 되고 확정 total은 각 OrderItem.subtotal()의 합과 같다.
Invariant     : placed Order의 item 구성과 확정 total은 서로 모순되지 않는다.
```

이름과 세부 구조는 정답이 아니다. 해설의 핵심은 다음을 비교하는 데 있다.

- `Order` / `OrderItem`이 자신의 의미 있는 Responsibility를 가지는 이유
- Controller가 Domain Rule을 소유하지 않는 이유
- Payment 관련 Responsibility와 Order Responsibility를 어디까지 분리할지
- Class Diagram의 Responsibility가 Sequence Message와 일치하는지
- `PlaceOrderController`는 coordination role이며 total 계산이나 결제 규칙의 owner가 아닌 이유

---

## 18. Feedback 기준

1. S05 모델의 변경 이유를 설명할 수 있는가?
2. Responsibility를 Method name으로만 판단하지 않았는가?
3. Information Expert를 DB/Data location으로 오해하지 않았는가?
4. Creator를 자동 생성 규칙으로 쓰지 않았는가?
5. Controller를 framework class와 동일시하지 않았는가?
6. Controller에 Domain Rule을 몰아넣지 않았는가?
7. GRASP를 서로 배타적인 선택지나 checklist로 사용하지 않고, 하나의 Responsibility Assignment에 여러 관점이 중첩될 수 있음을 설명했는가?
8. 핵심 Message의 Object Contract와 이를 보장할 Responsibility owner가 일치하는가?
9. Class Diagram과 Sequence Diagram 사이의 feedback이 있었는가?
10. LLM이 만든 Pattern/객체를 근거 없이 채택하지 않았는가?
11. S07 change가 기존 Contract/Collaboration에 주는 압력을 검토할 질문이 남아 있는가?

---

## 19. Failure Conditions

- S05 모델을 거의 그대로 두고 Pattern 이름만 붙인다.
- GRASP를 checklist나 상호배타적인 Pattern 선택 문제로 적용한다.
- 모든 Responsibility를 `OrderService`에 둔다.
- 모든 Behavior를 Entity 하나에 몰아넣는다.
- Controller가 Domain Rule을 직접 판단한다.
- Repository가 Domain Expert가 된다.
- Sequence Diagram을 기존 Class Diagram을 정당화하는 그림으로만 사용한다.
- Sequence에서 드러난 문제를 Class 책임에 feedback하지 않는다.
- Class/Sequence/Responsibility Table에 같은 내용을 반복 작성하는 것을 산출물 품질로 착각한다.
- LLM이 제안한 Manager/Policy/Service를 근거 없이 추가한다.
- Object Contract를 별도 양식 산출물로 늘리거나 구현 signature 목록으로 축소한다.
- S07의 change/variation mechanism을 미리 소비한다.

---

## 20. Session Summary

```text
S05
Experience-based Initial Design
        ↓
S06
Responsibility / Message
        ↓
Object Contract
precondition / postcondition / invariant
        ↓
Role / Collaboration / RDD
        ↓
GRASP Basic
        ↓
Responsibility Reassignment
        ↓
Design Class Diagram
↔
Design Sequence Diagram
        ↓
Refined Design
```

> **S06의 목적은 S05 설계를 Pattern으로 장식하는 것이 아니라 Responsibility owner와 Collaboration을 근거 있게 다시 설계하는 것이다.**

> **Class Diagram은 책임의 정적 배치를, Sequence Diagram은 그 책임의 동적 협력을 검증한다.**

> **GRASP는 서로 배타적인 해법 목록이 아니라 Responsibility Assignment를 여러 각도에서 검토하는 중첩 가능한 판단 관점이다.**

---

## 21. S07로 넘기는 질문

S06에서 핵심 Message의 Object Contract는 이미 세웠다. S07에서는 새로운 change request를 투입해 다음을 묻는다.

```text
기존 precondition/postcondition/invariant 중 무엇이 흔들리는가?
새로운 variation이 생기면 어떤 책임과 협력이 흔들리는가?
변화를 어디에서 흡수해야 하는가?
```

다음 Session에서는 S06 Refined Design에 새로운 variation을 투입해 기존 Contract/Collaboration이 받는 압력과 variation point를 검토한다. 구체적인 variation 구조나 S07의 후반 GRASP(Polymorphism·Pure Fabrication·Indirection·Protected Variations), GoF Pattern vocabulary는 S06에서 선행 제시하지 않는다.
