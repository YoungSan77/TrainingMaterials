# S04. 분석 동적 모델 — 상세 설계 최종본

- **시간:** 75분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **문제영역에서 어떤 Event가 발생하고, 복잡하거나 미묘한 행위 구간에서 무엇이 어떤 순서·조건·상태로 변하는지를 어떻게 동적으로 분석하며, 현재 판단에 필요한 모델만 어떻게 선택할 것인가?**

---

## 1. Session Position

S02에서는 요구를 기능 목록에서 시작하지 않고 `Event-centered requirement analysis`로 구조화했다.

```text
Problem / Business Need
        ↓
용어집
        ↓
Meaningful Event
        ↓
Context / Condition
        ↓
Required Response
        ↓
Outcome / Domain State Change
        ↓
Stakeholder Value
```

S03에서는 같은 Problem을 정적 관점으로 보았다.

```text
Problem Understanding
        │
        ├─ Static View — S03
        │    Concept
        │    Attribute / Value Domain
        │    Relationship
        │    Multiplicity / Constraint
        │
        └─ Dynamic View — S04
             Event
             Flow
             Interaction
             State / Transition
```

S04는 새로운 Problem을 다루는 Session이 아니다.

> **S02에서 발견한 Event와 S03에서 이해한 구조를 시간과 행위라는 관점에서 다시 검토한다.**

S03과 S04는 단계가 아니라 같은 Problem Understanding의 상호보완 관점이다.

---

# 2. Session Outcome

학습자는 S04 종료 시 다음을 할 수 있어야 한다.

- S02의 Event-centered requirement analysis와 S04 Dynamic Analysis의 관계를 설명한다.
- 용어집을 Event·State·Interaction 모델에서도 일관되게 사용한다.
- Analysis Event를 UI/API/message/DB operation과 구분한다.
- Event를 Problem/Domain에서 의미 있는 사건으로 표현한다.
- 전체 E2E flow보다 현재 판단이 어려운 **Analysis Slice**를 선택한다.
- Sequence, Communication, Activity, State Machine Diagram이 각각 어떤 질문에 적합한지 구분한다.
- 현재 질문에 필요한 Dynamic Model만 선택한다.
- Sequence Diagram으로 시간 순서 중심 interaction을 표현한다.
- Communication Diagram의 위치와 용도를 설명한다.
- Activity Diagram의 위치와 용도를 설명한다.
- State Machine Diagram으로 lifecycle과 transition rule을 표현한다.
- Event, State, Transition, Guard를 구분한다.
- Static/Dynamic Model을 상호 검증한다.
- 모델에서 발견한 불확실성을 Requirement와 용어집으로 feedback한다.
- Dynamic Analysis와 S05 이후 Responsibility Design의 경계를 지킨다.
- 모델의 목적이 충족되면 Just-enough 수준에서 멈춘다.

---

# 3. Opening — Event는 기능보다 먼저 문제를 드러낸다

다음처럼 시작하면 요구가 쉽게 기능 목록이 된다.

```text
주문 생성 기능
결제 기능
주문 조회 기능
알림 기능
```

하지만 이것만으로는 알기 어렵다.

```text
왜 필요한가?
언제 필요한가?
무엇이 이 행위를 촉발하는가?
어떤 조건에서 반응이 달라지는가?
결과는 무엇이어야 하는가?
```

S02에서는 그래서 Event에서 출발했다.

```text
Order Requested
        ↓
Item In Stock?
        ↓
Payment Completed?
        ↓
Required Response
        ↓
Order Confirmed / Rejected
```

S04의 Dynamic Analysis는 이 질문을 더 깊게 파고든다.

---

# 4. Analysis Event는 Domain-semantic Event다

S04에서 Event를 다룰 때 가장 먼저 경계를 잡는다.

```text
주문하기 button clicked
        ≠
Order Requested
```

```text
REST endpoint called
        ≠
Order Requested
```

```text
Kafka message received
        ≠
Payment Confirmed
```

```text
DB row updated
        ≠
Order Placed
```

왼쪽은 Event를 **어떻게 전달·표현·구현했는가**에 가깝다.

오른쪽은 Problem/Domain에서 **무엇이 일어났는가**를 표현한다.

핵심 질문:

> **이것은 Domain에서 의미 있는 Event인가, 아니면 그 Event를 전달하거나 구현하는 기술적 mechanism인가?**

---

# 5. UI도 Analysis Event가 아니다

예:

```text
사용자가 주문하기 버튼을 누른다
```

보다:

```text
Customer places order
```

이 Analysis에 적합하다.

왜냐하면 주문 요청은:

- Web Button
- Mobile Gesture
- Voice Interface
- Call Center
- External API

어떤 방식으로도 들어올 수 있기 때문이다.

Analysis 단계에서 중요한 것은 UI가 아니라:

> **무슨 의도가 Domain에 전달되었는가?**

다.

---

# 6. 단, 실제 Constraint는 제거하지 않는다

기술적 요소라고 해서 무조건 제거하는 것은 아니다.

예:

- 법률상 특정 방식의 confirmation이 필수
- 특정 의료장치에서 physical switch 사용이 안전 요건
- 외부 표준 protocol 자체가 계약상의 제약
- 시간 제한이 외부 시스템과의 계약조건

이라면 Problem을 실제로 제약한다.

따라서:

```text
Technology Detail?
        ↓
Chosen Solution인가?
        또는
Legitimate Constraint인가?
```

를 판단한다.

---

# 7. Event의 Source

Event는 사람 Actor에 한정되지 않는다.

### Human / Business Event

```text
Customer places order
```

### External System Event

```text
Payment provider confirms payment
Inventory system confirms stock reserved
```

### Temporal Event

```text
Payment deadline expires
Reservation expires
```

따라서 질문은:

> **Who triggered?**

가 아니라 더 넓게:

> **Who or What caused this meaningful Event?**

이다.

---

# 8. 용어집과 Dynamic Analysis

S04에서도 새로운 이름을 임의로 만들지 않는다.

S02·S03에서 유지한 용어집을 계속 사용한다.

예:

```text
Order Requested
Payment Confirmed
Order Paid
Order Confirmed
```

Dynamic Model을 그리다가:

```text
Payment Confirmed
Payment Completed
Payment Succeeded
Payment Settled
```

같은 표현이 섞였다면 먼저 물어야 한다.

> **같은 의미인가, 다른 의미인가?**

Diagram을 고치기 전에 용어집을 확인한다.

---

# 9. Scenario는 출발점이지 모델링 범위 전체가 아니다

S02 Scenario:

```text
1. Customer가 상품을 선택해 주문을 요청한다.
2. 선택한 상품의 재고를 확인한다.
3. 재고가 없으면 주문 요청을 거부한다.
4. 주문을 생성하고 총액을 계산한다.
5. 결제를 요청하고 결제 완료를 반영한다.
6. Customer에게 결과가 제공된다.
```

이 전체를 반드시 하나의 Diagram으로 만들 필요는 없다.

Scenario는:

> **Dynamic Analysis가 필요한 지점을 찾기 위한 입력**

이다.

---

# 10. 가장 중요한 보완 — E2E 전체를 그리지 않는다

복잡한 Domain에서 다음 시도는 흔하다.

```text
Use Case 시작
   ↓
모든 Actor
   ↓
모든 업무 단계
   ↓
모든 예외
   ↓
모든 상태
   ↓
모든 외부 시스템
   ↓
끝까지 하나의 Diagram
```

이것은 완전해 보이지만 오히려 판단하기 어려워질 수 있다.

문제:

- Diagram이 너무 길어진다.
- 핵심 규칙이 묻힌다.
- 예외가 본 흐름을 압도한다.
- 여러 lifecycle이 한 그림에 섞인다.
- 변경하기 어렵다.
- 검토자가 어디를 봐야 하는지 알기 어렵다.
- completeness와 understanding을 혼동한다.

따라서:

> **Dynamic Modeling의 목적은 Domain 전체의 E2E behavior를 완전하게 기록하는 것이 아니다.**

---

# 11. Analysis Slice

현재 판단이 어렵거나 위험한 부분만 잘라 본다.

```text
전체 Scenario
        ↓
Complex / Ambiguous / Risky Behavior
        ↓
Analysis Slice
        ↓
Question
        ↓
필요한 Dynamic Model
```

예:

```text
Place Order 전체
```

대신:

```text
재고 확인
        ↕
동시 주문 경쟁
        ↓
재고 차감 처리
```

이 구간만 모델링할 수 있다.

---

# 12. 어떤 부분을 Slice로 선택하는가?

다음 중 하나라도 크면 우선 분석 대상이 된다.

- 업무 규칙이 복잡하다.
- 순서가 결과에 영향을 준다.
- 상태에 따라 결과가 달라진다.
- 동시에 발생할 수 있는 Event가 있다.
- 예외가 많다.
- 용어 의미가 모호하다.
- 이해관계자가 다르게 해석한다.
- 오류 비용이 높다.
- 변경 가능성이 높다.
- Requirement가 불완전하다.

즉:

> **길기 때문에 모델링하는 것이 아니라 판단하기 어렵기 때문에 모델링한다.**

---

# 13. S03과 대칭되는 원칙

S03:

> **현실 전체의 Domain Dictionary를 만들지 않는다.**

S04:

> **Domain 전체의 E2E behavior를 그리지 않는다.**

따라서:

```text
Static Analysis
현재 질문에 필요한 Structure Slice

Dynamic Analysis
현재 질문에 필요한 Behavior Slice
```

로 대칭된다.

---

# 14. Dynamic Model Landscape

Analysis Slice가 정해진 뒤 질문에 맞는 모델을 고른다.

| 질문 | 적합한 모델 |
|---|---|
| interaction이 어떤 시간 순서로 일어나는가? | Sequence Diagram |
| participant 간 연결과 message 구조는 어떤가? | Communication Diagram |
| flow가 어디서 분기·병합·병렬화되는가? | Activity Diagram |
| 한 대상의 lifecycle과 상태 변화는 어떤가? | State Machine Diagram |

핵심:

> **Diagram을 먼저 선택하지 않는다. 질문이 Diagram을 선택한다.**

---

# 15. Sequence Diagram

핵심 질문:

> **어떤 participant가 어떤 순서로 interaction하는가?**

강점:

- temporal order
- event sequence
- interaction dependency
- alternative interaction

약점:

- 복잡한 workflow 전체 표현
- 다수 participant 구조 비교
- 한 Concept의 전체 lifecycle 표현

---

# 16. Analysis Sequence ≠ Software Call Sequence

S04에서는 다음처럼 그리지 않는다.

```text
OrderController
    ↓
OrderService
    ↓
ShippingRepository
    ↓
PaymentClient
```

이는 Software Design에 가깝다.

S04에서 보는 것은:

```text
Order Requested
        ↓
재고 상태가 판단에 필요
        ↓
Payment 상태가 판단에 필요
        ↓
Order 총액 확정
        ↓
Order State Change
```

다.

---

# 17. SSD와의 관계

S02 SSD:

```text
Customer → System : placeOrder
```

System은 Black Box다.

S04에서는 Black Box를 바로 software component로 분해하지 않는다.

```text
S02
Actor
→ System

        ↓

S04
Problem-domain behavior

        ↓

S05/S06
Object responsibility / collaboration
```

---

# 18. Sequence Diagram의 Analysis Participant

S04에서는 participant를 다음 수준에서 사용할 수 있다.

```text
Customer
Order
OrderItem
Payment
```

하지만 이는:

> **현재 Scenario를 이해하기 위한 problem-domain participant**

이지 곧바로 최종 Software Object를 의미하지 않는다.

---

# 19. Communication Diagram

핵심 질문:

> **어떤 participant들이 연결되어 있고 어떤 message 관계가 존재하는가?**

Sequence와 같은 interaction을 표현할 수 있지만 강조점이 다르다.

```text
Sequence
→ Time Ordering 중심

Communication
→ Participant Connection + Message Structure 중심
```

---

# 20. Communication Diagram의 위치

예:

```text
Customer
   |
   | place order request
   v
Order
 /   \
OrderItem Payment
```

S04에서는 이것을 상세 설계도로 발전시키지 않는다.

목적:

> **같은 Interaction을 관계 구조 관점에서 볼 수 있다는 것을 이해한다.**

직접 실습의 중심은 Sequence로 둔다.

---

# 21. Activity Diagram

핵심 질문:

> **Flow가 어떻게 진행되고 어디에서 분기·병합·병렬화되는가?**

예:

```text
Order Requested
        ↓
Item In Stock?
   ┌────┴─────┐
  No          Yes
   ↓           ↓
Reject      Payment Attempted
                ↓
          Payment Completed?
                ↓
            Confirm
```

---

# 22. Activity Diagram의 Guardrail

Activity Diagram은 특히 E2E Process Map으로 팽창하기 쉽다.

따라서:

> **Activity Diagram은 전체 Business Process를 완전하게 문서화하기 위한 기본 산출물이 아니다.**

현재 질문이:

- branching
- parallelism
- workflow dependency

일 때만 필요한 구간을 모델링한다.

---

# 23. State Machine Diagram

핵심 질문:

> **한 Concept이 어떤 상태를 가지며 어떤 Event에 의해 어떻게 변하는가?**

예:

```text
Draft
  |
  | Order Submitted
  v
Placed
  |
  | Payment Requested
  v
Payment Pending
  |
  | Payment Confirmed
  v
Paid
```

---

# 24. State ≠ Status 값 목록

S03에서는:

```text
status : OrderStatus
```

를 정의할 수 있었다.

S04에서는 다음을 묻는다.

```text
어떤 상태가 업무적으로 의미 있는가?
어떤 Event가 상태를 바꾸는가?
어떤 Transition이 허용되는가?
어떤 Transition이 금지되는가?
```

즉:

```text
Value Domain
        ↓
State Semantics
        ↓
Transition Rules
```

이다.

---

# 25. Event / State / Transition / Guard

### Event

무엇이 발생했는가?

```text
Payment Confirmed
```

### State

현재 어떤 의미 있는 상황인가?

```text
Paid
```

### Transition

무엇이 어떻게 달라지는가?

```text
Placed → Paid
```

### Guard

어떤 조건에서 가능한가?

```text
[Payment Amount Matches Order Total]
```

---

# 26. State Machine 예

```text
Placed
  |
  | Payment Confirmed
  | [Payment Amount Matches Order Total]
  v
Paid
```

핵심은 UML notation이 아니다.

> **어떤 Event와 Condition이 어떤 상태 변화를 허용하거나 금지하는가?**

를 명시하는 것이다.

---

# 27. State Machine도 전체 lifecycle을 강제로 그리지 않는다

Order 전체 lifecycle이:

```text
Draft
Placed
Payment Pending
Paid
Payment Failed
...
```

처럼 여러 상태를 가진다고 하자.

현재 질문이 결제 결과에 따른 주문 상태 변화라면 필요한 상태만 잘라볼 수 있다.

```text
Placed
Payment Pending
Paid
Payment Failed
```

즉 State Machine도 Analysis Slice를 적용한다.

---

# 28. Dynamic Model 선택 순서

정확한 순서는 다음이다.

```text
Problem / Scenario
        ↓
Meaningful Event
        ↓
Complex / Ambiguous / Risky Area
        ↓
Analysis Slice
        ↓
Question
        ↓
Needed View
        ↓
Dynamic Model
```

Diagram 종류가 출발점이 아니다.

---

# 29. Static + Dynamic Cross-check

S03:

```text
Order
OrderItem
Product
Payment
```

S04:

```text
Order Requested
Payment Confirmed
Order Paid
Order Confirmed
```

두 모델을 연결한다.

```text
Static Structure
        ↕
Dynamic Behavior
        ↕
Requirement
        ↕
용어집
```

---

# 30. Dynamic이 Static을 수정한다

예:

S03에서는:

```text
Order — Payment
```

관계를 단순하게 봤다.

S04에서 분할 결제(split payment) 사례를 보면:

```text
Order
    ↓
Payment #1
Payment #2
```

가 가능하다는 사실이 드러날 수 있다.

그러면:

- Multiplicity
- Concept
- Constraint
- Requirement

를 다시 검토한다.

---

# 31. Static이 Dynamic을 수정한다

반대도 가능하다.

Dynamic Model에서:

```text
Split Payment Requested
```

를 표현했는데 Static Model에:

```text
Order — Payment의 1..* Multiplicity
```

이 전혀 없다면 질문해야 한다.

> 새 Concept인가?  
> Requirement 누락인가?  
> 모델이 잘못됐는가?

---

# 32. 용어집 Feedback

Dynamic Analysis 중 다음이 발견됐다고 하자.

```text
Payment Confirmed
Payment Authorized
Payment Completed
```

이들은 같을 수도 있고 다를 수도 있다.

Diagram 안에서 임의로 합치지 않는다.

```text
Dynamic Model
        ↓
Semantic Ambiguity
        ↓
용어집
        ↓
Meaning / Boundary 재합의
```

---

# 33. Requirement Feedback

예:

Dynamic Analysis 중:

```text
Payment Declined by Provider
```

라는 Event가 새로 드러났다.

S02에는 이 Requirement가 없었다.

그러면:

```text
Payment Declined by Provider
        ↓
Context?
        ↓
Required Response?
        ↓
Outcome?
        ↓
Stakeholder Value?
```

를 다시 분석한다.

즉:

```text
S02 Requirement
        ↕
S03 Static Model
        ↕
S04 Dynamic Model
```

은 pipeline이 아니라 feedback loop다.

---

# 34. Brooks — Essence / Accident

S04에서도 S03과 동일한 Anchor를 사용한다.

Essential Dynamic Complexity:

```text
Order Requested
Payment Confirmed
Order Total Calculated
Temporal Dependency
State Transition
Business Constraint
```

Premature Solution Detail:

```text
REST
Kafka
Saga
Retry
DB Transaction
Callback
Thread
Framework State Machine
```

핵심:

> **Problem Domain의 어려움을 모델링해야지 기술 solution의 복잡성을 Analysis Model에 끌어오지 않는다.**

---

# 35. Just-enough는 두 가지를 통제한다

Just-enough를 단순히 Diagram의 상세도만 줄이는 것으로 보지 않는다.

### Scope

```text
어디까지 모델링할 것인가?
```

### Detail

```text
얼마나 상세하게 모델링할 것인가?
```

따라서:

```text
Just-enough
= Right Scope
+ Right Detail
```

이다.

---

# 36. Stop Condition

다음 질문에 충분히 답할 수 있으면 멈춘다.

- 현재 어려운 behavior가 무엇인지 설명되는가?
- 주요 Event가 Domain 의미로 표현됐는가?
- Event의 Context/Condition이 명확한가?
- 필요한 Response/Outcome이 설명되는가?
- 중요한 ordering/dependency가 드러나는가?
- 중요한 State/Transition이 설명되는가?
- Guard/Constraint가 Requirement에서 추적 가능한가?
- Static Model과 일관되는가?
- 용어집과 의미가 일치하는가?
- 새로운 Requirement 질문이 드러났는가?
- UI/API/DB 등의 solution detail이 섞이지 않았는가?
- 추가 Diagram을 그리는 것이 실제 판단을 더 개선하는가?

---

# 36A. 수강생 이해용 완성 Dynamic Model 예제

S04에서는 Dynamic Model의 종류를 단순 목록으로 설명하지 않는다. 동일한 Order 맥락을 사용해 **완성된 예제 Diagram을 본편 슬라이드에 제공**하고, 각 모델이 답하는 질문의 차이를 비교한다.

### 제공 예제 1 — Order State Machine Diagram

```text
Draft → Placed → Paid
```

- State / Event / Transition / Guard의 의미
- `status` 값 목록과 State Machine의 차이

### 제공 예제 2 — Place Order Communication Diagram

- 동일한 interaction을 participant 연결과 message 관계 중심으로 본다.
- Sequence Diagram과 정보 내용은 겹칠 수 있으나 강조점이 다르다.

### 제공 예제 3 — Place Order Activity Diagram

```text
상품/수량 확인
→ 주문 생성
→ 총액 결정
→ 결제
→ 성공/실패 분기
```

- workflow, branch, merge 관점
- 객체 message 순서와 workflow 표현의 차이

이 세 Diagram은 **수강생 실습 산출물이 아니다.** 모델 선택과 표현 차이를 이해시키기 위한 강사 제공 예제다.

# 37. [실습] Place Order Analysis Sequence Diagram 작성 (20~25분)

> **본편 실습 슬라이드는 1장만 사용한다.** 단계별 모델링 가이드는 Slide Notes에 두고 예시 답안은 Session 마지막 `[별첨]`으로 분리한다.

## 실습 슬라이드 — 수강생에게 보이는 내용

**입력**

- S02 `Place Order` Use Case Specification
- S03 Order Conceptual / Analysis Domain Model
- 기본 범위: **Place Order → Payment**

**과제**

`Place Order`의 핵심 흐름을 **Analysis Sequence Diagram**으로 표현한다.

- 문제영역에서 의미 있는 participant를 선택한다.
- 시간 순서에 따라 의미 있는 message를 표현한다.
- 필요한 조건/대안만 표현한다.
- 전체 시스템 E2E가 아니라 현재 Use Case를 이해하는 데 필요한 범위까지만 모델링한다.
- LLM에게 누락 interaction, 과도한 participant, UI/API/DB 등 Solution Detail 혼입 여부를 검토하게 한다.

**필수 산출물**

- **Analysis Sequence Diagram 1개**

**판단 기준**

- participant가 Analysis/Domain 의미를 가지는가?
- message가 method call syntax가 아니라 의미 있는 interaction인가?
- S03 Static Model과 모순되지 않는가?
- 불필요한 Controller/Repository/API/DB 구현 요소가 들어오지 않았는가?

## Slide Notes — 진행 가이드

- 권장 시간: participant/핵심 message 10분 → 조건/대안 보완 5분 → LLM 검토 5~8분.
- State/Communication/Activity를 다시 작성하게 하지 않는다. 이들은 본편 제공 예제로 비교한다.
- 기본 실습 흐름은 `Place Order → Payment`로 유지한다.
- 분석 수준에서 필요한 외부 결제 역할을 participant로 표현할지는 시스템 경계 정의에 따라 판단하게 한다.
- message name을 `createOrder()`, `save()` 같은 구현 operation으로 빨리 고정하지 않게 한다.

## [별첨] 실습 해설 — Place Order Analysis Sequence Diagram

가능한 해설 흐름:

```text
Customer
  → Order Context : Place Order
  → Order         : Create/establish order
  → Order         : Add selected item(s)
  → Order         : Determine total
  → Payment       : Request payment
  ← Payment       : Payment confirmed
  → Order         : Reflect payment completion
```

해설 포인트:

- participant는 분석 목적에 따라 더 추상적이거나 구체적일 수 있다.
- `Order Context` 같은 경계 역할을 넣을지는 Analysis model의 목적과 System Event 표현 방식에 따라 달라질 수 있으며 framework Controller를 뜻하지 않는다.
- `Payment confirmed`는 Domain-semantic 의미로 표현하고 API callback, HTTP response 같은 mechanism으로 바꾸지 않는다.
- Static Model에 없는 새로운 participant가 등장하면 실제 Concept인지 단순 interaction role인지 재검토한다.
- 답안은 하나의 가능한 interaction 구조이며 message 의미와 Static/Dynamic 일관성이 더 중요하다.

# 50. Feedback 기준

1. **Event가 Domain-semantic한가?**
2. UI/API/message/DB mechanism을 Analysis Event로 사용하지 않았는가?
3. 용어집과 Event/State 이름이 일관되는가?
4. 전체 E2E를 무리하게 모델링하지 않았는가?
5. 복잡·모호·위험한 Analysis Slice를 선택했는가?
6. 질문에 맞는 Dynamic Model을 선택했는가?
7. Sequence를 Software Call Flow로 만들지 않았는가?
8. Communication/Activity/State의 역할을 구분하는가?
9. State와 단순 Status 값을 혼동하지 않았는가?
10. Trigger/Guard/Constraint가 Requirement에 근거하는가?
11. Static/Dynamic이 일관되는가?
12. 발견한 문제를 Requirement/용어집으로 feedback했는가?
13. 현재 판단에 필요한 만큼만 모델링했는가?

---

# 51. Failure Conditions

- 기능 이름에서 Dynamic Model을 시작한다.
- UI Event를 Domain Event처럼 취급한다.
- API 호출을 Analysis Event로 사용한다.
- message broker event를 그대로 Domain Event라고 부른다.
- DB update를 business state change와 동일시한다.
- Event를 사람 Actor의 요청으로만 한정한다.
- 용어집과 다른 이름을 Diagram에서 임의로 만든다.
- 전체 Use Case를 하나의 E2E Diagram으로 완전하게 표현하려 한다.
- 긴 Activity Diagram이 completeness를 보장한다고 생각한다.
- 모든 participant를 하나의 Sequence Diagram에 넣는다.
- 모든 Concept의 State Machine을 작성한다.
- Sequence Diagram을 Controller/Service/Repository call graph로 만든다.
- Communication Diagram을 최종 object network로 확정한다.
- Activity Diagram을 모든 Use Case에 의무적으로 만든다.
- State를 단순 enum 값 목록으로만 본다.
- Event/State/Transition/Guard를 혼동한다.
- Static/Dynamic 충돌을 무시한다.
- 새 Event를 발견하고도 Requirement로 feedback하지 않는다.
- 용어 모호성을 발견하고도 용어집을 수정하지 않는다.
- Dynamic Analysis 중 Responsibility를 조기에 배치한다.
- Analysis Model을 고정된 lifecycle phase의 mandatory artifact로 본다.
- 모델이 클수록 더 완전하고 좋은 모델이라고 생각한다.

---

# 52. Anchor / Reference

## Brooks — Essence / Accident

**S03과 동일한 Core Anchor**

역할:

> Problem Domain의 essential dynamic complexity와 solution mechanism에서 발생하는 accidental/premature complexity를 구분한다.

---

## Booch — OOA

**S03과 동일한 Core Anchor**

역할:

> Dynamic Model도 구현 객체 설계가 아니라 problem-domain vocabulary와 behavior를 이해하는 Analysis 활동이라는 경계를 유지한다.

---

## Larman — Applying UML and Patterns

**S03과 동일한 Core Anchor**

역할:

> UML Diagram을 산출물 checklist로 사용하지 않고 현재 판단 질문에 필요한 표현으로 사용한다.

---

# 53. Session Summary

```text
S02
용어집
+
Event-centered Requirement Analysis

Event
→ Context
→ Required Response
→ Outcome / Domain State Change
        ↓

S03
Static Problem Understanding

Concept
Attribute / Value Domain
Relationship
Multiplicity
        ↓

S04
Dynamic Problem Understanding

Domain-semantic Event
        ↓
Complex / Ambiguous / Risky Behavior
        ↓
Analysis Slice
        ↓
Question
        ↓
Sequence / Communication / Activity / State
        ↓
Static ↔ Dynamic ↔ Requirement ↔ 용어집
```

핵심 Claim:

> **Analysis Event는 UI나 기술 mechanism이 아니라 Problem/Domain에서 의미 있는 사건이다.**

> **Dynamic Analysis의 목적은 전체 E2E behavior를 완전하게 그리는 것이 아니라 현재 판단이 어려운 behavior를 충분히 이해하는 것이다.**

> **모델링 범위를 먼저 선택하고, 그다음 질문에 맞는 모델을 선택한다.**

> **Sequence, Communication, Activity, State Machine은 같은 Dynamic Problem을 서로 다른 관점에서 보는 도구다.**

> **Static과 Dynamic은 서로 검증하며 Requirement와 용어집까지 수정할 수 있다.**

> **가장 큰 모델이 아니라 현재 판단에 충분한 모델이 좋은 모델이다.**

---

# 54. S05로 넘기는 질문

S04까지는 다음을 이해했다.

```text
무엇이 존재하는가?
어떻게 관계되는가?

어떤 Event가 발생하는가?
어떤 Context에서인가?
무엇이 어떤 순서로 일어나는가?
어떤 State가 어떻게 변하는가?
```

그러나 아직 결정하지 않았다.

```text
누가 이 행위를 책임져야 하는가?

어떤 상태와 행위를
같은 객체 경계 안에 두어야 하는가?

무엇을 숨겨야 하는가?

어떤 변경 이유를
어디에 국소화해야 하는가?
```

따라서 S04의 마지막 질문은:

> **이렇게 이해한 상태와 행위를 어떤 객체 경계 안에 배치해야 변경이 국소화되는가?**

로 끝낸다.

이 질문부터 S05에서 **Analysis → Object Design**으로 넘어간다.
