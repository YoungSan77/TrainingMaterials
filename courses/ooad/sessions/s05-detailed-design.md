# S05. 분석에서 객체 설계로 — 상세 설계 최종본

- **시간:** 70분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **S03·S04의 전체 분석 모델을 보고, 아직 RDD/GRASP를 체계적으로 배우기 전에 자신의 설계 경험으로 객체 경계와 책임을 어떻게 1차 할당할 것인가?**

---

## 1. Session Position

S02~S04까지는 **Problem Understanding**을 만들었다.

```text
S02
용어집
+
Event-centered Requirement Analysis
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
Event
Interaction
State
Transition
Guard
```

여기까지의 질문은 주로:

> **Problem Domain에서 무엇이 존재하고 무엇이 일어나는가?**

였다.

S05부터 질문이 바뀐다.

> **그 상태와 행위를 어떤 객체 경계 안에 두어야 하는가?**

즉 S05가 **Analysis → Object Design의 명시적 전환점**이다.

---

## S05의 교육적 역할 — 경험 기반 Initial Design

S05는 RDD/GRASP의 정답을 먼저 제공하는 Session이 아니다.

```text
S03 Static Analysis Model
        +
S04 Dynamic Analysis Model
        ↓
수강생의 기존 설계 경험
        ↓
Initial Responsibility Assignment
        ↓
Initial Design Class Diagram
```

수강생은 먼저 자신의 경험으로 전체 분석 모델을 설계 모델로 전환한다. 이 결과는 S06·S07에서 RDD 관점으로 보완하기 위한 **Before 모델**이다.

따라서 S05 실습에서는 Information Expert, Creator, Controller 등 GRASP Pattern 목록을 제공하지 않고, 정답 Class 구조를 먼저 보여주지 않으며, LLM에도 아직 배우지 않은 RDD/GRASP Pattern을 적용하도록 요청하지 않는다. 먼저 독립적으로 Initial Design을 만들고 snapshot을 보존한다.

S05 본문의 Encapsulation, Information Hiding, Change Reason은 수강생의 초기 선택을 되돌아보게 하는 관점으로 사용하되, **체계적인 Responsibility Assignment는 S06·S07이 소유한다.**

# 2. 가장 중요한 경계

S03의 Concept을 그대로 Class로 바꾸지 않는다.

```text
Analysis Concept
        ≠
Design Class
```

그리고 S04 Sequence의 participant도 그대로 Software Object가 되는 것이 아니다.

```text
Analysis Participant
        ≠
Design Object
```

Analysis는 Problem을 이해하기 위한 모델이다.

Design은:

> **그 Problem을 어떤 책임 구조로 구현할 것인가를 결정하는 활동**

이다.

---

# 3. Session Outcome

학습자는 S05 종료 시 다음을 할 수 있어야 한다.

- Analysis Model과 Design Model의 목적 차이를 설명한다.
- Analysis Concept을 기계적으로 Class로 변환하지 않는다.
- S03의 구조와 S04의 행위를 함께 사용하여 object boundary 후보를 찾는다.
- 객체를 단순 데이터 묶음이 아니라 **State + Behavior + Responsibility**의 단위로 판단한다.
- Encapsulation을 단순 field hiding 이상으로 설명한다.
- Information Hiding을 변경 가능성이 높은 design decision을 숨기는 원칙으로 적용한다.
- 함께 변하는 상태와 행위를 같은 경계에 둘 후보를 찾는다.
- 서로 다른 변경 이유가 있는 책임을 분리할 후보를 찾는다.
- 객체 경계를 명사 기준보다 **responsibility와 change reason**으로 검토한다.
- 전체 Static/Dynamic Model을 근거로 자신의 경험에 따라 Responsibility를 **1차 배치**하고 Initial Design을 만든다.
- 하나의 Analysis Concept이 여러 Design Object로 나뉘거나 여러 Concept이 하나의 책임 경계로 재구성될 수 있음을 설명한다.
- 기술 객체를 너무 일찍 도입하지 않는다.
- S05의 Initial Design은 경험 기반 Before 모델이며, 체계적인 RDD/GRASP Responsibility Assignment와 Collaboration refinement는 S06·S07로 넘긴다.

---

# 4. Opening — Class 목록으로 바꾸면 설계가 아니다

S03에서 다음 Concept을 찾았다.

```text
Order
Payment
OrderItem
Product
Customer
```

가장 쉬운 변환은:

```text
Order → Order class
Payment → Payment class
OrderItem → OrderItem class
Product → Product class
Customer → Customer class
```

이다.

하지만 이것만으로는 중요한 질문에 답하지 못한다.

```text
누가 Order 총액을 계산하는가?

누가 Order 상태를 변경할 수 있는가?

Payment 요청 여부는 어디에서 판단하는가?

OrderItem 수량이 바뀌었을 때
누가 그 영향을 알아야 하는가?

어떤 Rule이 어디에 있어야
변경 영향이 최소화되는가?
```

즉:

> **Class를 만드는 것이 Object Design이 아니라 Responsibility Boundary를 결정하는 것이 Object Design이다.**

---

# 5. Analysis와 Design의 질문이 다르다

### Analysis

```text
무엇이 존재하는가?
어떤 의미인가?
무엇이 일어나는가?
어떤 상태가 변하는가?
```

### Design

```text
누가 알아야 하는가?
누가 해야 하는가?
누가 변경을 통제해야 하는가?
무엇을 숨겨야 하는가?
누구와 협력해야 하는가?
```

이 질문 변화가 S05의 핵심이다.

---

# 6. Analysis Model은 설계의 입력이지 정답이 아니다

S03/S04:

```text
Order
OrderItem
Product
Payment

Order Requested
Payment Confirmed
Order Paid
Order Confirmed
```

는 Design의 강한 evidence다.

그러나:

```text
Analysis Model
        ↓
1:1 Mapping
        ↓
Design Class
```

로 변환하지 않는다.

더 정확한 흐름:

```text
Analysis Evidence
        ↓
State
Behavior
Rule
Change Reason
        ↓
Object Boundary Candidates
        ↓
Responsibility Candidates
```

---

# 7. 객체의 본질 — State와 Behavior를 함께 본다

객체를 다음처럼 보면 부족하다.

```text
Object
= Data Container
```

OO 관점에서는 최소한:

```text
Object
= State
+ Behavior
+ Identity / Boundary
+ Responsibility
```

로 본다.

특히 S05에서는:

> **어떤 상태를 누가 알고, 그 상태와 관련된 행위를 누가 통제해야 하는가?**

를 묻는다.

---

# 8. 상태와 행위의 분리가 만드는 문제

예:

```text
Order
- status
- totalAmount
- paymentStatus
```

그리고 모든 행위가:

```text
OrderService
PricingService
PaymentService
NotificationService
```

에 있다면:

```text
Data
      ← separate →
Behavior
```

가 된다.

그 결과 Rule이 여러 곳으로 퍼질 수 있다.

---

# 9. Tell, Don't Ask의 문제의식으로 연결

예:

```text
if order.status == PENDING
   and orderItem.quantity <= product.stock
   and payment.status == NONE
then ...
```

외부 객체가 Order 내부 상태를 계속 꺼내 판단하면:

```text
Ask state
→ External decision
→ Set state
```

형태가 된다.

OO 설계에서는 우선:

> **그 판단을 상태를 가장 잘 아는 경계 안으로 이동할 수 있는가?**

를 검토한다.

S05에서는 아직 최종 책임을 확정하지 않고 **후보를 찾는다.**

---

# 10. Encapsulation

Encapsulation을:

```text
private field
+
getter/setter
```

로 축소하지 않는다.

더 중요한 질문은:

> **어떤 상태와 그것을 변화시키는 규칙을 하나의 경계 안에서 통제할 것인가?**

이다.

예:

```text
Order
    items / quantities
    total calculation rule
    order state transition
```

가 함께 있어야 하는지 검토한다.

---

# 11. Encapsulation의 판단 단위

다음 두 질문이 중요하다.

### 누가 이 상태를 알고 있는가?

```text
Order status
Payment state
OrderItem quantity
```

### 누가 이 상태를 바꿀 권한을 가져야 하는가?

```text
Create
AddItem
Pay
Confirm
```

State와 Behavior 사이의 강한 의미 관계가 object boundary의 후보가 된다.

---

# 12. Information Hiding — Parnas

S05의 핵심 Anchor다.

Information Hiding의 핵심을:

> 데이터를 숨긴다

로만 이해하지 않는다.

Parnas의 핵심 문제의식은:

> **변경될 수 있는 설계 결정을 다른 부분으로부터 숨긴다.**

이다.

따라서 객체 경계 질문이 바뀐다.

```text
무슨 데이터를 숨길까?
```

보다:

```text
어떤 변경 이유를
어떤 경계 안에 숨길까?
```

를 묻는다.

---

# 13. 무엇을 숨겨야 하는가?

예:

Order 총액 계산 Rule이:

```text
수량 × 단가를 모두 더하고
+
할인/부가 정책을 반영한다
```

라고 하자.

이 Rule이 바뀔 가능성이 높다면:

```text
UI
Service
Controller
Repository
```

여러 곳이 그 Rule을 알아서는 안 된다.

숨겨야 할 것은 단순 total field가 아니라:

> **총액 계산 규칙 자체**

다.

---

# 14. Change Reason

객체 경계를 찾는 강한 질문:

> **무엇 때문에 이 코드가 바뀌는가?**

예:

### Order

```text
주문 lifecycle rule이 바뀐다.
주문 총액 계산 규칙이 바뀐다.
주문 completion rule이 바뀐다.
```

### Payment

```text
결제 상태 rule이 바뀐다.
결제 승인 실패 처리 규칙이 바뀐다.
결제 authorization rule이 바뀐다.
```

변경 이유가 다르면 같은 객체에 억지로 묶을 필요가 없다.

---

# 15. 함께 변하는 것은 가까이 둔다

Object Boundary 후보:

```text
State
+
Behavior
+
Invariant
+
Change Reason
```

이 함께 움직이는지를 본다.

예:

```text
Order State
+
Order Completion Eligibility
+
Order Transition
```

가 함께 바뀐다면 같은 경계를 강하게 의심할 수 있다.

---

# 16. 다르게 변하는 것은 분리 후보다

반대로:

```text
Order 총액 계산 rule
```

과:

```text
Payment gateway protocol
```

은 변경 이유가 다르다.

따라서 같은 객체 안에 넣는 것이 자연스럽지 않을 수 있다.

S05에서 기술 infrastructure를 설계하지는 않지만:

> **같이 변하지 않는 책임을 무리하게 한 경계에 넣지 않는다.**

는 원칙을 잡는다.

---

# 17. 객체 경계는 명사에서 나오지 않는다

잘못된 접근:

```text
Requirement에서 명사 추출
        ↓
Class 생성
```

더 나은 접근:

```text
Concept
+
State
+
Behavior
+
Rule
+
Change Reason
        ↓
Responsibility Boundary Candidate
```

명사는 clue일 뿐이다.

---

# 18. 하나의 Concept이 여러 객체로 나뉠 수 있다

Analysis에서:

```text
Order
```

하나였다고 하자.

Design에서 필요하다면:

```text
Order
OrderLine
PricingPolicy
PaymentCoordinator
```

등으로 나뉠 수 있다.

단 S05에서 Pattern이나 Policy object를 미리 만들라는 뜻은 아니다.

핵심은:

> **Analysis Concept와 Design Object의 cardinality가 1:1이라고 가정하지 않는다.**

---

# 19. 여러 Analysis Concept이 하나의 책임 경계로 묶일 수도 있다

반대도 가능하다.

Analysis에서는:

```text
Pricing
Discount
Tax
```

을 별도 Concept으로 이해했더라도,

Design에서는 특정 책임 경계 안에 함께 들어갈 수 있다.

즉:

```text
Analysis Structure
        ≠
Final Object Structure
```

이다.

---

# 20. S04의 Dynamic Model이 중요해지는 이유

정적 모델만 보면:

```text
Order
Payment
OrderItem
Product
```

가 보인다.

하지만 S04에서:

```text
Order Requested
        ↓
재고 상태 확인
        ↓
Payment state 확인
        ↓
Order Total 확정
        ↓
Order State Change
```

를 보면:

> **어떤 상태와 규칙이 어떤 행위에 함께 필요해지는가**

가 드러난다.

이것이 객체 경계 판단의 핵심 evidence다.

---

# 21. Static + Dynamic → Object Boundary

```text
Static
Concept / Relationship
        +
Dynamic
Event / State / Behavior
        ↓
Object Boundary Candidate
```

정적 또는 동적 모델 하나만 보고 설계하지 않는다.

---

# 22. Object Boundary를 판단하는 질문

체계적인 GRASP 적용은 S06에서 다룬다. S05에서는 지금까지 정리한 State·Behavior·Change Reason을 근거로 다음 두 질문만 확인한다.

### 누가 상태를 소유하고 통제해야 하는가?

예:

```text
Order.status
```

를 누가 변경할 수 있는가?

### Option A

```text
OrderService sets Order.status
```

### Option B

```text
Order controls its own state transition
```

S05에서는 즉시 답을 확정하지 않고:

> **어느 쪽이 변경과 invariant를 더 잘 국소화하는가?**

를 비교한다.

### 어떤 불변조건을 보호해야 하는가?

예:

```text
Order 총액은 OrderItem 합계와 항상 일치해야 한다
```

이 Rule이 Domain invariant라면 누구도 임의로 이 둘을 어긋나게 만들 수 없어야 한다. 이 질문은 object boundary를 강하게 제한한다.

S05에서는 이 두 질문으로 후보만 만든다. 외부에 무엇을 숨길지, 판단과 실행 책임을 누구에게 나눌지 같은 세부 배치와 근거는 S06의 RDD/GRASP에서 다룬다.

---

# 23. Alan Kay — Message 관점의 연결

Alan Kay의 OOP 관점에서 중요한 요소:

- messaging
- local state
- protection/hiding
- late binding

S05에서는 특히:

```text
local state
+
protection
+
message boundary
```

를 객체 경계 판단에 연결한다.

핵심:

> **객체 외부가 내부 상태 구조를 직접 다루기보다 의미 있는 요청을 보내고, 객체가 자신의 상태와 규칙을 통제하는 방향을 검토한다.**

---

# 24. Message는 아직 상세 설계하지 않는다

S05에서:

```text
addItem()
calculateTotal()
pay()
```

같은 구체 method signature를 만드는 데 집중하지 않는다.

질문은 더 상위다.

```text
누가 총액 계산 책임을 가져야 하는가?
누가 상태 전이를 통제해야 하는가?
```

실제 Message/Collaboration 설계는 S06에서 깊어진다.

---

# 25. Domain Object와 Technical Object를 구분

S05에서 다음을 너무 일찍 끌어오지 않는다.

```text
Controller
Service
Repository
DAO
DTO
API Client
Database Adapter
Message Consumer
```

현재 핵심 질문은:

> **Problem behavior를 어떤 responsibility boundary에 둘 것인가?**

다.

기술 협력 객체는 필요할 수 있지만 아직 중심이 아니다.

---

# 26. Application Flow와 Domain Responsibility를 섞지 않는다

예:

```text
Place Order Use Case
```

전체 흐름을 조정하는 책임과:

```text
Order 총액이 올바른지 판단
```

하는 Domain Rule은 다른 종류의 책임일 수 있다.

S05에서는 이 차이를 예고한다.

```text
Flow Coordination
        ≠
Domain Decision
```

다만 Layer Architecture를 본격적으로 가르치지는 않는다.

---

# 27. 여러 후보를 비교하고 위험 신호를 확인한다

한 번에 정답을 찾지 않는다. 예를 들어 Order 총액 계산 책임을 다음처럼 비교해볼 수 있다.

### Candidate A

```text
Order가 계산과 상태 변경 모두 담당
```

### Candidate B

```text
PricingPolicy가 계산
Order가 상태 변경
```

### Candidate C

```text
Application Service가 계산
Order는 data만 유지
```

다음 신호가 보이면 다른 대안을 의심한다.

- **Data-only Object** — Order가 getter/setter만 가진다.
- **God Service** — OrderService가 모든 Rule과 Flow를 가진다.
- **Rule Duplication** — UI/Service/Batch/API가 각자 총액을 계산한다.
- **State Exposure** — 외부가 객체 내부 상태 조합을 직접 알아야 한다.

좋은 후보는 대체로 자신의 상태와 직접 관련된 Rule을 알고, 유효한 상태 전이를 통제하며, 변경 이유가 비교적 응집돼 있다. 다만 모든 behavior를 Entity 하나에 몰아넣는다는 뜻은 아니다. 더 정교한 평가(Cohesion/Coupling 지표, GRASP 적용)는 S06·S08에서 이어간다.

---

# 28. 응집도와 결합도는 예고만 한다

S05에서 Cohesion/Coupling을 본격적으로 평가하지 않는다.

하지만 직관은 사용한다.

```text
함께 변하는 책임
→ 높은 응집 가능성

다른 객체 내부 상태를 많이 알아야 함
→ 높은 결합 가능성
```

정교한 판단은 S08에서 다룬다.

---

# 29. Just-enough Object Boundary

S03/S04와 같은 원칙을 이어간다.

목표는:

```text
완전한 Class Diagram
```

이 아니다.

목표:

> **다음 책임 설계를 진행할 만큼 object boundary 후보를 충분히 명확하게 만드는 것**

이다.

---

# 30. Stop Condition

다음에 답할 수 있으면 S06으로 넘어갈 수 있다.

- 핵심 State와 Behavior가 어디에 가까워야 하는가?
- 중요한 Domain Rule의 owner 후보가 있는가?
- 어떤 invariant를 보호해야 하는가?
- 어떤 변경 이유를 숨겨야 하는가?
- data-only object나 god service 위험이 보이는가?
- 1개 이상의 책임 배치 대안이 있는가?
- 아직 확정하지 않은 책임이 무엇인지 아는가?
- 기술 solution detail을 불필요하게 도입하지 않았는가?

---

# 31. Anchor / Reference

## Parnas — Information Hiding

**S05의 핵심 Anchor**

역할:

> 객체 경계를 단순 데이터 캡슐화가 아니라 **변경 가능한 design decision을 숨기는 경계**로 이해하게 한다.

적용 질문:

```text
무엇이 바뀔 가능성이 있는가?
그 판단을 누가 알고 있어야 하는가?
그 변경이 어디까지 퍼져야 하는가?
```

---

## Alan Kay — OOP

역할:

- local state
- messaging
- protection/hiding

을 통해 객체가 단순 record가 아니라 **자신의 상태를 보호하고 message를 통해 협력하는 boundary**임을 설명한다.

---

# 32. S04 Anchor와의 연결

S04까지의 Anchor:

```text
Brooks
Booch OOA
Larman
```

은 Problem Understanding을 고정했다.

S05에서는 질문이 Design으로 전환되므로:

```text
Parnas
+
Alan Kay
```

가 중심으로 이동한다.

즉 Anchor가 바뀌는 이유도 명확하다.

```text
S03/S04
같은 Problem을 Static/Dynamic으로 이해

        ↓

S05
그 이해를 Responsibility Boundary로 바꿈
```

---

# 33. [실습] Analysis Model → Initial Design · 25~30분

> **본편 실습 슬라이드는 1장만 사용한다.** 세부 진행은 Slide Notes, 예시 Before Model은 Practice 뒤 `[별첨]`으로 분리하며 Practice 전에 공개하지 않는다.

## 실습 슬라이드 — 수강생에게 보이는 내용

**Input**

- S02 Place Order Use Case Diagram
- S02 Place Order Use Case Specification
- S03 Conceptual Domain Model
- S04 Place Order Analysis Sequence Diagram
- 기본 범위: **Place Order → Payment**

**Task**

1. Use Case에서 필요한 Behavior/Rule을 식별한다.
2. Static Model에서 state/relationship, Dynamic Model에서 interaction/behavior evidence를 확인한다.
3. 자신의 경험으로 첫 Responsibility Allocation을 수행한다.
4. 필요하면 Analysis Concept을 split/merge하거나 최소한의 Design Object를 추가한다.
5. 주요 Attribute와 Responsibility/Operation이 보이는 Initial Design Class Diagram을 작성하고 최초 snapshot을 보존한다.
6. LLM으로 누락·모호함만 검토하고 변경 내용을 간단히 기록한다.

**Required Output**

- Initial Design Class Diagram 1개
- 최초 독립 snapshot과 LLM 검토 후 변경 기록

**Review Criteria**

- Requirement와 Static/Dynamic evidence를 모두 사용했는가?
- Analysis Concept을 Design Class로 기계적으로 1:1 변환하지 않았는가?
- owner 없는 Behavior나 Data-only Object가 남아 있는가?
- 기술 객체가 Domain/Object Design을 압도하지 않는가?
- 아직 배우지 않은 RDD/GRASP를 정답처럼 적용하지 않았는가?

**LLM용 추천 프롬프트**

```text
Use Case에서 요구되는 Behavior 중 owner가 없는 것은 무엇인가?
Static/Dynamic Model에는 근거가 있는데 Design Class Diagram에서 빠진 Responsibility가 있는가?
Data만 있고 의미 있는 Behavior가 없는 객체가 있는가?
여러 종류의 Responsibility가 하나의 Service/Manager에 몰려 있는가?
Analysis Concept을 Design Class로 기계적으로 1:1 변환한 부분이 있는가?
구현 기술이나 Framework 객체를 너무 일찍 추가했는가?
GRASP나 Design Pattern을 적용한 정답 구조는 제시하지 마라.
...
```

## Slide Notes — 진행 가이드

- 권장 시간: 독립 설계 15분 → LLM 검토 5분 → 필요한 수정/기록 5~10분.
- Pattern 이름을 힌트로 주지 않는다. 목적은 현재 자신의 Responsibility Allocation 방식을 드러내는 것이다.
- S03의 모든 Concept가 같은 수의 Design Class가 될 필요는 없다고만 안내한다.
- 이 최초 snapshot을 S06의 직접 refinement input으로 보존한다.

## [별첨] Initial Design Class Diagram — S06 Before Model 예시

```text
Customer
- customerId

Order
- orderNo
- items
- paymentStatus

OrderItem
- quantity
- unitPrice

Product
- productId
- name

Payment
- amount
- status

OrderService
+ createOrder(customer, products)
+ addItem(order, product, quantity)
+ calculateTotal(order)
+ requestPayment(order, method)
+ updatePaymentStatus(order, result)

Relations
Customer 1 ── 0..* Order
Order 1 ── 1..* OrderItem
OrderItem * ── 1 Product
Order 1 ── 0..1 Payment
OrderService ──uses──> Order / OrderItem / Payment
```

이 모델은 final correct design이 아니라 S06의 **Before Model**이다. Use Case behavior는 보이지만 `OrderService`에 여러 Responsibility가 집중되고 `Order`·`OrderItem`·`Payment`가 Data Holder에 가까운 약점이 의도적으로 남아 있다. S06의 Information Expert·Cohesion/Coupling 적용 결과나 정답 구조는 여기서 제시하지 않는다.

## Practice Feedback

- 최초 snapshot과 LLM 검토 후 변경을 구분했는가?
- LLM이 RDD/GRASP/Pattern 정답을 선행 주입하지 않았는가?
- 남은 책임 약점을 S06에서 다시 검토할 질문으로 기록했는가?

---

# 34. Feedback 기준

1. Analysis Concept를 그대로 Class로 변환하지 않았는가?
2. Static + Dynamic evidence를 함께 사용했는가?
3. 객체를 Data Holder로만 보지 않았는가?
4. State와 Behavior의 의미적 결합을 고려했는가?
5. Change Reason을 물었는가?
6. Information Hiding을 field visibility로 축소하지 않았는가?
7. 중요한 invariant를 보호할 boundary 후보가 있는가?
8. Rule이 여러 곳에 중복되지 않는가?
9. data-only object + god service 구조를 그대로 수용하지 않았는가?
10. 여러 object boundary 대안을 비교했는가?
11. 책임 owner를 너무 빨리 확정하지 않았는가?
12. Technical Object가 Domain 판단을 압도하지 않았는가?
13. S06에서 해결할 질문을 남겼는가?

---

# 35. Failure Conditions

- Requirement의 명사를 그대로 Class로 만든다.
- Analysis Concept와 Design Class를 1:1로 가정한다.
- S04 Sequence participant를 그대로 Software Object로 확정한다.
- Entity를 field + getter/setter의 데이터 구조로 만든다.
- 모든 behavior를 Service에 배치한다.
- Encapsulation을 `private` keyword로만 설명한다.
- Information Hiding을 단순 data hiding으로 축소한다.
- 변경 이유를 고려하지 않는다.
- 다른 변경 이유를 가진 책임을 하나의 객체에 몰아넣는다.
- 동일 Rule을 여러 객체/서비스에서 중복 판단한다.
- 외부가 객체 내부 state combination을 알아야 한다.
- invariant를 외부 코드가 유지하도록 둔다.
- Class Diagram부터 완성하려 한다.
- Controller/Repository/API 등의 기술 객체부터 설계한다.
- 하나의 정답 object model만 만들고 대안을 비교하지 않는다.
- S05에서 GRASP/Pattern으로 너무 빨리 책임을 확정한다.
- S06에서 다룰 Message/Collaboration을 미리 상세 설계한다.

---

# 36. Session Summary

```text
S03
Static Structure
        +
S04
Dynamic Behavior
        ↓
S05
Object Boundary Candidate
        ↓
State
+
Behavior
+
Invariant
+
Change Reason
+
Information Hiding
```

핵심 Claim:

> **Analysis Concept를 Class로 복사하는 것은 Object Design이 아니다.**

> **객체 경계는 명사보다 State·Behavior·Invariant·Change Reason을 함께 보고 판단한다.**

> **Encapsulation은 데이터를 감추는 것보다 상태와 그 상태를 변화시키는 규칙을 하나의 통제 경계 안에 두는 문제다.**

> **Information Hiding의 핵심은 변경될 가능성이 있는 design decision을 다른 부분으로부터 숨기는 것이다.**

> **Object Boundary는 하나의 정답을 바로 찾는 것이 아니라 여러 책임 후보를 만들고 비교하면서 정제한다.**

---

# 37. S06으로 넘기는 질문

S05까지는 다음을 만들었다.

```text
Object Boundary Candidates
+
Responsibility Candidates
```

하지만 아직 확정하지 않았다.

다음 질문이 남는다.

```text
어떤 객체가 실제로
어떤 책임을 가져야 하는가?

어떤 객체가
누구에게 Message를 보내야 하는가?

어떤 객체들이
어떻게 Collaboration해야 하는가?

여러 책임 배치 대안 중
무엇이 더 좋은가?
```

따라서 S05의 마지막 질문은:

> **이 책임 후보를 실제 객체에 어떻게 배치하고, 객체들은 어떤 Message로 협력해야 하는가?**

로 끝낸다.

이 질문부터 S06에서 **Responsibility / Message / Collaboration**을 본격적으로 설계한다.
