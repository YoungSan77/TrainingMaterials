# S03. 분석 정적 모델 — 상세 설계 초안 v0.3

- **시간:** 75분
- **상태:** 사용자 승인본
- **핵심 질문:**  
  **문제영역의 본질적 구조를 어떻게 정적 분석 모델로 표현하고, 구현 결정과 분리된 Problem Understanding을 어떻게 명확히 하는가?**

---

## 1. Session Position

S01에서는 OOAD 전체의 사고 구조를 세웠다.

```text
Problem / Requirement
        ↓
Analysis Thinking
        ↓
Design Thinking
        ↓
Implementation
        ↓
Feedback
        ↺
```

여기서 Analysis와 Design은 반드시 별도 lifecycle phase를 의미하지 않는다.

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

S02에서는 이 원칙을 Requirement Engineering에 적용했다.

```text
Customer Need / Problem
        ↓
Discovery / Analysis / Validation
        ↓
Requirement
        ↓
Use Case
        ↓
Use Case Specification
        ↓
SSD
        ↓
System Operation
        ↓
Operation Contract
        ↓
Required Domain State Change
```

S03은 여기서 출발한다.

> **그 상태 변화가 의미를 가지려면 문제영역에는 무엇이 존재하고, 어떤 정보를 가지며, 서로 어떤 관계를 이루고 있어야 하는가?**

---

# 2. Session Outcome

학습자는 S03 종료 시 다음을 할 수 있어야 한다.

- Analysis를 별도의 phase가 아니라 **Problem을 Solution과 구분하여 이해하는 사고 활동**으로 설명한다.
- Requirement/Scenario를 Static·Dynamic 관점으로 검토하는 것이 Problem Understanding을 강화하는 이유를 설명한다.
- Brooks의 `Essence / Accident`를 Problem Understanding과 Solution Decision의 경계에 적용한다.
- S02에서 시작한 **용어집을 정적 분석 관점에서 정제**하고, Concept·Attribute·Value Domain·Relationship과 의미를 일치시킨다.
- ER/Logical Data Model, Ontology, OO Analysis Static Model의 관계를 큰 수준에서 구분한다.
- OOAD의 모델 기반 흐름과 MDD/MDA, DDD의 연결 관계를 설명한다.
- S02의 Operation Contract와 Domain State Change에서 Concept 후보를 발견한다.
- Concept과 Attribute를 구분한다.
- 필요한 경우 Attribute에 **analysis-level type / value domain**을 정의한다.
- Relationship과 Multiplicity를 업무 의미와 제약으로 해석한다.
- Whole–Part 관계를 의미 중심으로 판단하고 Aggregation/Composition 표기를 남용하지 않는다.
- Conceptual/Analysis Domain Model을 작성한다.
- Analysis Concept와 Software Class를 구분한다.
- 모델을 통해 Requirement의 누락·모순·불확실성을 발견한다.
- 현재 문제에 필요한 만큼만 모델링하고 멈출 수 있다.
- 정적 모델이 답하는 질문과 동적 모델이 필요한 질문을 구분한다.

---

# 3. Opening — Requirement를 정의했다고 Problem을 다 이해한 것은 아니다

S02에서 Requirement를 정제하고 Operation Contract까지 작성했다.

예:

```text
placeOrder(items)

Postconditions

- Order가 생성된다.
- 선택된 OrderItem들이 Order와 연관된다.
- Order 총액이 결정되고 Payment가 요청된다.
```

이것만으로도 필요한 System Behavior는 상당히 명확해졌다.

하지만 새로운 질문이 생긴다.

```text
Order란 정확히 무엇인가?

Order와 OrderItem은 어떤 관계인가?

OrderItem과 Product는 어떤 관계인가?

한 Order에 Payment는 하나만 가능한가?
```

(Order Cancellation·Refund처럼 이후 변화 요구에서 다시 검토할 관계도 있지만, S03의 기본 범위는 아니다.)

즉:

```text
Requirement / Scenario
        ↓
Required Behavior
        ↓
Domain State Change
        ↓
새로운 구조적 질문
```

이 질문을 푸는 것이 S03이다.

---

# 4. Analysis는 Phase가 아니라 사고 프로세스다

S03에서 `Analysis Static Model`이라는 표현을 사용하지만 다음을 명확히 한다.

> **Analysis Model이라고 해서 별도의 Analysis Phase를 전제하지 않는다.**

논리적 질문은 구분한다.

```text
Analysis
무엇을 해결해야 하는가?
문제영역은 어떻게 구성되는가?

Design
어떤 책임과 구조로 해결할 것인가?

Implementation
그 설계를 어떤 기술로 실현할 것인가?
```

실제 프로세스에서는:

### Predictive

```text
Analyze → Design → Implement
```

### Iterative / Incremental / Agile

```text
Analyze ↔ Design ↔ Implement ↔ Test
            ↑                 ↓
            └── Feedback ─────┘
```

처럼 수행될 수 있다.

따라서 핵심은:

> **Analysis를 설계와 시간적으로 분리하는 것이 아니라 Problem과 Solution을 사고에서 구분하는 것이다.**

---

# 5. Problem Understanding — Static + Dynamic

Requirement text 하나로 복잡한 문제를 모두 이해하기 어렵다.

Problem Understanding에는 서로 다른 질문이 존재한다.

```text
               Problem Understanding
                        │
             ┌──────────┴──────────┐
             │                     │
        Static View           Dynamic View
             │                     │
무엇이 존재하는가?        무엇이 일어나는가?
어떤 정보가 필요한가?     무엇과 무엇이 상호작용하는가?
어떤 관계인가?           상태가 어떻게 변하는가?
```

둘은 서로 다른 phase가 아니다.

> **같은 문제를 보는 상호보완적 관점이다.**

S03에서는 Static View를 다룬다.

S04에서는 Dynamic View를 다룬다.

---

# 6. Requirement Baseline과의 관계

Formal baseline을 만드는 방법을 가르치는 것이 이 세션의 목적은 아니다.

그러나 중요한 원칙은 있다.

```text
Requirement / Scenario
        +
Static Understanding
        +
Dynamic Understanding
        ↓
Problem Understanding
        ↓
Design / Commitment에 필요한 Evidence
```

Predictive에서는 이런 분석 결과가 Requirement Baseline의 신뢰도를 높일 수 있다.

Iterative/Agile에서는 작은 범위에서:

```text
Story
+ Acceptance Criteria
+ 필요한 Analysis
        ↓
Implementation Commitment
```

의 근거가 될 수 있다.

즉:

> **Baseline의 형식보다 중요한 것은 구현 결정을 내릴 만큼 Problem을 충분히 이해했는가이다.**

---

# 7. Brooks — Essence / Accident

S01과 S02에서 사용한 Brooks Anchor를 S03에서 다시 적용한다.

SW의 핵심 어려움 중 상당 부분은 문제 자체가 가진 conceptual complexity에 있다.

예:

```text
Order
OrderItem
Product
Payment

주문 총액 계산 규칙
재고와 주문 수량의 관계
결제 성공/실패에 따른 처리
```

이것들은 문제영역의 본질에 속할 수 있다.

반면:

```text
OrderController
OrderRepository
REST API
orders table
JPA Entity
DTO
framework annotation
```

은 현재 선택된 구현 방식에서 파생된 solution detail일 수 있다.

S03의 원칙:

> **분석 모델은 essential complexity를 없애는 것이 아니라 명시적으로 드러내고 이해하는 도구다.**

그리고:

> **Accidental 또는 premature solution detail이 Problem Understanding을 대신하거나 조기에 왜곡·제약하지 않도록 구분한다.**

단, 모든 기술적 정보가 무조건 배제되는 것은 아니다.

예:

- 외부 규제
- 필수 기존 시스템
- 법적 제약
- 물리적·운영상 제약

이 Problem 자체를 제한한다면 legitimate constraint다.

```text
Legitimate Constraint
        ↓
Problem Understanding에 영향 가능

Premature Solution Decision
        ↓
Problem Understanding을 대신하면 안 됨
```

---

# 8. Domain이란 무엇인가

S02에서 `Domain State Change`라는 용어를 사용했다.

S03에서는 `Domain`을 명확하게 정의한다.

> **Domain은 SW가 해결하려는 문제와 업무의 세계다.**

예:

주문 시스템에서 Domain은 단순히:

```text
orders table
payment API
shipping API
```

가 아니다.

오히려:

```text
Customer
Order
OrderItem
Product
Payment

주문
결제
총액 계산

그리고 그 관계와 업무 규칙
```

이 포함된 문제의 세계다.

---

# 9. 용어집 — S02에서 시작한 공통 언어를 정적 모델로 정제한다

모델링은 빈 Class Diagram에서 시작하지 않는다.

S02의 Requirement Discovery부터 **용어집**을 만들기 시작했다. S03에서는 새 산출물을 만드는 것이 아니라, 이미 등장하고 합의된 업무 언어를 **Concept·Attribute·Value Domain·Relationship을 판단할 수 있도록 정제**한다.

입력:

- Requirement
- Use Case
- Main / Alternative / Exception Flow
- Acceptance Criteria
- BDD Example
- SSD
- Operation Contract

Place Order → Payment에서 다음 단어가 나타날 수 있다.

```text
Customer
Order
Order Item
Product
Payment
Status
Quantity
```

이것을 **용어집의 후보 용어**로 본다.

하지만:

> **용어집 ≠ Class List**

이다.

---

# 10. 정적 모델의 더 큰 위치

S03의 모델링은 OOAD만의 독립된 발명이 아니다.

문제의 구조를 명시적으로 표현하려는 SW Engineering의 긴 흐름 안에 있다.

## Information Engineering / ER / Logical Model

핵심 질문:

> **어떤 데이터가 존재하며 어떻게 관계되는가?**

주요 요소:

```text
Entity
Attribute
Relationship
Cardinality
```

데이터 구조를 명확하게 표현하는 데 강하다.

---

## Ontology

핵심 질문:

> **무엇이 무엇이며, 어떤 의미와 의미적 관계를 가지는가?**

관심:

```text
Concept
Category
Meaning
Relationship
Constraint
```

---

## OO Analysis Static Model

핵심 질문:

> **OO 설계로 이어질 Problem Domain에 어떤 Concept·Attribute·Relationship이 존재하는가?**

```text
Concept
Attribute
Relationship
Multiplicity
```

따라서:

```text
ER / Logical Model
→ Data Structure

Ontology
→ Concept / Meaning Structure

OO Analysis Static Model
→ OO Analysis를 위한 Problem-Domain Structure
```

로 좌표화한다.

어느 하나가 다른 것을 대체하거나 우월하다는 의미가 아니다.

> **같은 현실을 다른 engineering concern과 목적에서 모델링한다.**

---

# 11. OOAD와 MDD/MDA

OOAD에는 이미 다음 모델 기반 흐름이 존재한다.

```text
Requirement
    ↓
Analysis Model
    ↓
Design Model
    ↓
Implementation
```

MDD/MDA는 이것과 무관하게 새롭게 등장한 별도 사고라기보다:

> **기존 모델 기반 분석 → 설계 → 구현 흐름에서 Model과 Transformation의 역할을 더 체계화·정형화·표준화한 흐름**

으로 위치시킨다.

```text
OOAD

Analysis Model
      ↓
Design Model
      ↓
Implementation

        ↓
모델 기반 흐름의
체계화·정형화·표준화

MDD / MDA

Model
  ↓
Transformation
  ↓
Implementation
```

S03에서는 MDD/MDA 기법을 가르치지 않는다.

이 연결의 목적은:

> **Analysis Model이 UML 연습용 그림이 아니라 SW Engineering의 중요한 개발 artifact라는 맥락을 제공하는 것**

이다.

---

# 12. OOAD와 DDD

OOAD에서 이미 Domain과 Domain Model을 다룬다.

DDD는 이 기반을 버리고 새로운 것을 시작하는 것이 아니다.

연결 관계는:

```text
OOAD
Problem Domain을 분석하고
객체 설계로 전환
        ↓
DDD
Domain과 Domain Model을
SW 개발의 중심에 더 강하게 위치
```

DDD에서는:

- Domain Expert와의 협력
- Ubiquitous Language
- Domain Model의 지속적 정제
- Bounded Context
- Aggregate

등으로 훨씬 깊어진다.

하지만 S03에서 배우지 않는다.

S03에서는:

> **Domain과 Domain Model의 기본적인 의미 연결**

까지만 한다.

---

# 13. 한 번에 좌표화

```text
                   Problem / Business Reality
                             ↓
                           Domain
                             ↓
              ┌──────────────┼──────────────┐
              │              │              │
          Meaning        Data Structure   OO Analysis
              │              │              │
          Ontology      ER / Logical      Static Model
                                            │
                                      Dynamic Model
                                            ↓
                                      Design Model
                                            ↓
                                     Implementation
                                            │
                           ┌────────────────┴───────────────┐
                           │                                │
                       MDD / MDA                           DDD
                 모델 기반 흐름의               Domain Model 중심성의
              체계화·정형화·표준화                     강화
```

이 그림은 계보와 관계를 이해하기 위한 좌표다.

세부 이론을 여기서 가르치지 않는다.

---

# 14. S02 Operation Contract → S03 Static Model

S02의 Operation Contract:

```text
placeOrder(items)

Postconditions

1. Order가 생성된다.
2. 선택된 OrderItem들이 Order와 연관된다.
3. Order 총액이 결정되고 Payment가 요청된다.
```

여기에는 이미 정적 모델을 발견할 강한 clue가 있다.

### Object/Instance Creation

```text
Order가 생성된다.
```

→ `Order`라는 Concept을 검토해야 한다.

### Attribute Modification

```text
Order 총액이 결정된다.
```

→ `Order`라는 Concept  
→ 총액을 표현할 Attribute/Value가 필요할 수 있다.

### Relationship Change

```text
선택된 OrderItem들이 Order와 연관되고, Payment가 요청된다.
```

→ `Order`  
→ `OrderItem`, `Payment`  
→ Order와 OrderItem, Order와 Payment 사이 Relationship

따라서:

```text
Operation Contract
        ↓
Required Domain State Change
        ↓
Concept Discovery Clue
Attribute Discovery Clue
Relationship Discovery Clue
        ↓
Static Analysis Model
```

중요:

이것은 기계적인 1:1 변환 규칙이 아니다.

> **Domain State Change는 Concept·Attribute·Relationship을 발견하는 강한 입력이다.**

---

# 15. Concept

Concept은 다음처럼 정의한다.

> **현재 Problem을 이해하기 위해 독립적으로 구분하여 생각할 가치가 있는 Domain의 의미 있는 대상 또는 개념**

Order 사례:

```text
Customer
Order
OrderItem
Product
Payment
```

중요한 경계:

```text
Concept
≠
Software Class
```

---

# 16. Noun Extraction ≠ Concept Modeling

다음 방식은 사용하지 않는다.

```text
Requirement
    ↓
명사 추출
    ↓
Class 생성
```

예:

> 고객이 주문하기 Button을 눌러 Order Number로 상품을 주문한다.

명사:

```text
Customer
주문하기 Button
Order Number
Order
```

그러나:

- Customer → Concept 가능
- Order → Concept 가능
- Order Number → Order의 Attribute 가능
- 주문하기 Button → UI Solution

이다.

따라서 질문은:

> **명사인가?**

가 아니라:

> **현재 Domain을 이해하기 위해 독립적인 의미를 가지는가?**

이다.

---

# 17. Concept 식별 질문

다음 질문을 사용한다.

### 업무 자체가 다루는 중요한 대상인가?

```text
Order
Payment
OrderItem
```

### 중요한 상태 변화의 대상인가?

```text
Order becomes paid
```

### 새로 생성되거나 제거되는 의미 있는 대상인가?

```text
OrderItem is created
```

### 다른 Concept과 의미 있는 관계를 가지는가?

```text
Order ↔ Payment
```

### 현재 Requirement를 설명하기 위해 독립적으로 구분해야 하는가?

이 질문에 근거가 있어야 한다.

---

# 18. Concept vs Attribute

모든 값을 Concept으로 만들지는 않는다.

예:

```text
Order
OrderNumber
OrderDate
OrderStatus
```

보다:

```text
Order
-----------------
orderNumber
orderDate
status
```

가 더 적절할 수 있다.

판단 질문:

> **독립적인 업무 의미와 관계를 가지는 대상인가, 아니면 다른 Concept을 설명하는 값인가?**

그러나 이것도 절대 규칙은 아니다.

어떤 값이 독립적인 규칙·관계·의미를 갖게 되면 별도 Concept으로 볼 수도 있다.

---

# 19. Attribute

Attribute:

> **현재 문제를 이해하기 위해 Concept에 대해 알아야 하는 의미 있는 정보**

Place Order → Payment라면:

```text
Order.status
Payment.status
OrderItem.quantity
```

가 중요할 수 있다.

반면:

```text
createdTimestamp
updatedTimestamp
versionColumn
databaseSequence
```

가 현재 질문과 무관하면 제외한다.

핵심:

> **Attribute는 모든 가능한 field를 수집하는 것이 아니다.**

---

# 20. Attribute의 Type / Value Domain

분석 모델에서 Type을 모두 금지하지 않는다.

업무 의미를 명확하게 만드는 기본적인 Type이나 Value Domain은 사용할 수 있다.

예:

```text
Order
--------------------------
orderDate : Date
status    : OrderStatus

OrderItem
--------------------------
quantity  : WholeNumber

Payment
--------------------------
amount    : Money
paid      : Boolean
```

이것의 목적은 Programming Language를 설계하는 것이 아니다.

> **이 Attribute가 어떤 종류의 값을 의미하는지 명확하게 하는 것**

이다.

### Analysis-level로 사용할 수 있는 예

```text
Text
Number
WholeNumber
Date
Time
Boolean
Money
Percentage
OrderStatus
```

### 보통 제외하는 구현 파생 Type

```text
String(255)
Long
BigDecimal(18,2)
LocalDateTime
VARCHAR(255)
DECIMAL(18,2)
Optional<String>
```

단 Requirement 자체가 특정 representation을 요구한다면 legitimate constraint일 수 있다.

판단 기준:

> **이 Type이 Domain 의미나 제약을 명확히 하는가, 아니면 특정 구현 기술에서 파생된 것인가?**

---

# 21. Value Domain

Type보다 Domain 의미가 더 중요한 경우가 있다.

예:

```text
status : OrderStatus
```

그리고:

```text
OrderStatus =
PENDING
PAID
SHIPPED
CANCELLED
```

처럼 값의 가능한 범위를 정의할 수 있다.

단 여기서 상태 전이를 설계하지 않는다.

```text
PENDING → PAID → SHIPPED
```

같은 시간적 변화는 S04의 Dynamic View로 넘긴다.

S03은:

> **어떤 상태값이 의미 있게 존재하는가**

까지만 본다.

---

# 22. Relationship

Concept은 서로 독립된 목록이 아니다.

예:

```text
Customer places Order
Order contains OrderItem
OrderItem refers to Product
Order is paid by Payment
```

Relationship은:

> **Domain에서 Concept 사이에 지속적으로 의미 있는 연결**

을 표현한다.

---

# 23. Relationship은 선보다 의미가 먼저다

다음 모델:

```text
Order -------- Payment
```

만으로는 충분하지 않다.

무슨 관계인가?

```text
Order is paid by Payment
```

처럼 말로 설명할 수 있어야 한다.

따라서:

> **Association line보다 업무 의미가 먼저다.**

---

# 24. Multiplicity

Multiplicity는 UML 기호 암기가 아니다.

```text
Customer 1 ------- 0..* Order
```

이 표현은 업무 질문을 만든다.

```text
Customer 없이 Order가 존재할 수 있는가?

한 Customer는 여러 Order를 가질 수 있는가?

Order 하나에 Payment는 하나인가 여러 개인가?

Order 하나에 OrderItem은 몇 개까지 가능한가?
```

즉:

> **Multiplicity는 관계에 숨겨진 업무 제약을 발견하는 분석 도구다.**

---

# 25. 모르면 그리지 않는다

예:

```text
Order ----- Payment
```

에서 정확한 multiplicity를 모른다면 추측해서:

```text
Order 1 ----- 1 Payment
```

라고 그리지 않는다.

대신:

```text
Multiplicity unresolved
Need clarification
```

이라는 분석 결과를 남긴다.

> **Unknown을 발견한 것도 Analysis의 성과다.**

---

# 26. 모델은 Requirement를 다시 질문하게 한다

정적 모델을 만들면 Requirement가 충분하지 않다는 사실이 드러날 수 있다.

예:

```text
Order -------- Payment
```

를 그리는 순간:

- 하나의 Order에 Payment가 여러 번 발생할 수 있는가(분할 결제)?
- 결제 실패 후 재시도는 같은 Payment인가 새 Payment인가?
- Payment 없이 Order가 존재할 수 있는가?

라는 질문이 생긴다.

따라서:

```text
Requirement
    ↓
Analysis Model
    ↓
Question
    ↓
Missing / Ambiguous Requirement
    ↓
Requirement Refinement
```

핵심:

> **좋은 분석 모델은 알고 있는 것을 표현할 뿐 아니라 아직 모르는 것을 드러낸다.**

---

# 27. Whole–Part

Order와 OrderItem은 Whole–Part 후보가 될 수 있다.

```text
Order
 └─ OrderItem
```

하지만 diamond부터 그리지 않는다.

먼저 의미를 질문한다.

- OrderItem은 무엇의 일부인가?
- Order 없이 같은 OrderItem이 독립적으로 의미가 있는가?
- 하나의 OrderItem이 여러 Order에 동시에 속할 수 있는가?
- Whole과 Part의 생애가 어느 정도 결합되는가?

---

# 28. Rumbaugh — Aggregation Anchor

Rumbaugh의 Aggregation에 대한 문제의식을 여기서 사용한다.

교육적 핵심:

> **Aggregation notation 자체가 Whole–Part의 의미를 정의해 주지 않는다.**

따라서:

```text
Domain Meaning
      ↓
Relationship Understanding
      ↓
필요한 경우 notation 선택
```

이다.

명확한 의미가 없다면 일반 Association으로 표현하는 것이 낫다.

---

# 29. Conceptual / Analysis Domain Model

이제 지금까지 발견한 것을 통합한다.

예:

```text
Customer
    |
    | places
    v
Order
----------------
orderNumber : Text
orderDate   : Date
status      : OrderStatus
    |
    | contains
    v
OrderItem
----------------
quantity : WholeNumber
    |
    | refers to
    v
Product


Order
    |
    | paid by
    v
Payment
----------------
amount : Money
status : PaymentStatus
```

목적:

> **현재 Problem을 이해하는 데 필요한 Concept·Attribute·Value Domain·Relationship을 하나의 일관된 구조로 표현한다.**

---

# 30. Domain Model이라는 용어

S03의 `Domain Model`은:

> **Conceptual Domain Model / Analysis Domain Model**

의 의미다.

이것은:

```text
Problem-Domain Concept
+ Attribute
+ Relationship
+ 필요한 Constraint
```

를 표현한다.

DDD의:

- Aggregate
- Aggregate Root
- Bounded Context
- Repository
- Domain Service

를 의미하지 않는다.

---

# 31. Analysis Concept ≠ Software Class

가장 중요한 경계 중 하나다.

```text
Analysis

Order
OrderItem
Payment
```

이 발견됐다고 해서:

```text
class Order
class OrderItem
class Payment
```

로 기계적으로 변환하지 않는다.

질문이 다르다.

### Analysis

> 무엇이 존재하고 어떤 의미와 관계를 가지는가?

### Design

> 어떤 객체 경계를 만들고 누가 어떤 책임을 가져야 하는가?

따라서:

> **Analysis Concept은 설계의 입력이지 Software Class 설계의 정답이 아니다.**

---

# 32. Operation/Method를 넣지 않는 이유

다음과 같이 그리면:

```text
Order
----------------
orderNumber
status
----------------
addItem()
calculateTotal()
pay()
```

이미 질문이 바뀐다.

```text
Problem Understanding
        ↓
Responsibility Assignment
```

`calculateTotal()`을 Order에 넣었다는 것은 이미:

> **총액 계산 책임은 Order가 가진다.**

라는 Design Decision을 내린 것이다.

이것은 이후 OOD에서 판단한다.

S03에서는:

```text
Concept
Attribute
Value Domain
Relationship
Constraint
```

에 집중한다.

---

# 33. 구현 요소 제거

다음은 S03 모델에서 제거 대상이다.

```text
OrderController
OrderService
OrderRepository
OrderDTO

REST endpoint
database table
ORM mapping

public/private
framework annotation

Java/C#/TypeScript-specific type
```

단 앞에서 설명했듯:

```text
Date
Money
OrderStatus
```

같은 analysis-level type/value domain은 업무 의미를 위해 사용할 수 있다.

---

# 34. Just-enough Static Model

목표는 현실 전체의 완전한 Domain Dictionary를 만드는 것이 아니다.

현재 질문이:

> **Place Order → Payment를 충분히 이해할 수 있는가?**

라면 다음은 필요할 수 있다.

```text
Order
OrderItem
Product
Payment
```

반면:

```text
MarketingCampaign
Employee
Supplier
WarehouseBuilding
AccountingPeriod
```

등은 현재 질문과 무관할 수 있다.

판단 질문:

> **이 요소가 현재 Requirement와 Domain State Change를 이해하거나 중요한 불확실성을 발견하는 데 필요한가?**

---

# 35. 언제 모델링을 멈출 것인가

다음 질문에 충분히 답할 수 있다면 멈출 수 있다.

- 중요한 Concept은 무엇인가?
- 필요한 Attribute와 Value Domain은 무엇인가?
- 핵심 Relationship은 무엇인가?
- 중요한 Multiplicity/Constraint는 무엇인가?
- Operation Contract의 Domain State Change를 설명할 수 있는가?
- 중요한 미결정 Requirement가 드러났는가?
- Implementation Decision이 섞이지 않았는가?

핵심:

> **가장 상세한 모델이 아니라 현재 판단에 충분한 모델이 좋은 모델이다.**

---

# 36. [실습] Order Conceptual Domain Model 작성 (25~30분)

> **본편 실습 슬라이드는 1장만 사용한다.** 모델 작성 단계·힌트는 Slide Notes에 두고, 예시 답안은 Session 마지막 `[별첨]`으로 분리한다.

## 실습 슬라이드 — 수강생에게 보이는 내용

**입력**

- S02 `Place Order` Use Case Diagram + Specification
- S02에서 유지한 용어집
- 기본 범위: **Place Order → Payment**
- `Shipment`, `Order Cancellation`, `Refund`는 이번 실습의 필수 범위가 아니다.

**과제**

`Place Order → Payment` 문제영역을 설명하는 **Conceptual / Analysis Domain Model**을 작성한다.

모델에는 현재 범위에서 필요한 다음 요소를 모두 표현한다.

- Concept
- Attribute
- analysis-level Type / Value Domain
- Association / Relationship와 의미
- Multiplicity
- 의미 있는 경우 Whole–Part

LLM에는 자신의 모델을 먼저 제시한 뒤 Use Case/용어집에서 놓친 Concept/Relationship, Concept-vs-Attribute 대안, 근거 부족 Multiplicity/Constraint, Solution Detail 혼입 여부만 검토하게 한다.

**필수 산출물**

- **Conceptual / Analysis Domain Model 1개**

**판단 기준**

- 선택한 범위는 작지만 Diagram의 핵심 요소는 생략하지 않았는가?
- 모든 Concept/Attribute/Relationship/Multiplicity에 Requirement 또는 용어집 근거가 있는가?
- Analysis Concept와 Software Class를 혼동하지 않았는가?
- 모르는 Multiplicity를 임의로 만들지 않았는가?

## Slide Notes — 진행 가이드

- 권장 시간: Concept/Attribute 8분 → Relationship/Multiplicity 8분 → Diagram 정리 5분 → LLM 검토 5~8분.
- Concept 후보를 미리 정답처럼 제시하지 않는다. 막힌 경우 `Customer`, `Order`, `OrderItem`, `Product`, `Payment`가 Use Case에서 어떤 의미로 등장하는지 질문한다.
- 속성은 의미 수준에서 판단하되 기술 타입으로 내려가지 않는다.
- `Order–OrderItem`의 Whole–Part와 Multiplicity처럼 모델 의미에 중요한 요소는 생략하지 않게 한다.
- `Shipment`는 이번 공통 baseline에서 강제하지 않는다.

## [별첨] 실습 해설 — Order Conceptual Domain Model

예시 정답은 다음 의미를 포함한다.

```text
Customer 1 -------- 0..* Order
Order    1 -------- 1..* OrderItem
OrderItem * ------- 1 Product
Order    1 -------- 0..1 Payment
```

예시 Attribute / Value Domain:

```text
Customer
- customerId : Identifier

Order
- orderNo : Identifier
- orderedAt : DateTime
- status : OrderStatus

OrderItem
- quantity : WholeNumber
- unitPrice : Money

Product
- productId : Identifier
- name : Text

Payment
- amount : Money
- status : PaymentStatus
```

해설 포인트:

- `Order`와 `OrderItem`은 Whole–Part 의미가 있는지 확인한다.
- `Payment` Multiplicity는 Requirement의 결제 정책에 따라 달라질 수 있다. 예시 답안은 현재 단순화된 baseline의 한 선택일 뿐이다.
- 계산된 `total`을 Attribute로 둘지 derived value로 볼지는 모델 목적과 요구에 따라 설명할 수 있다.
- 구현 method/Controller/Repository/DB relation은 넣지 않는다.
- 답안은 하나의 가능한 모델이며 다른 모델도 Requirement 근거와 의미 일관성이 있으면 허용한다.

# 38. Feedback 기준

### 1. Domain 중심인가?

Problem/업무 Concept을 다루고 있는가?

### 2. Traceability가 있는가?

Requirement / Use Case / Operation Contract와 연결되는가?

### 3. Concept / Attribute 판단에 근거가 있는가?

명사를 기계적으로 Class 후보로 만들지 않았는가?

### 4. Type이 의미 중심인가?

`Money`, `Date`, `OrderStatus`처럼 Problem을 이해하기 위한 것인가?

아니면 구현 언어/DB에서 파생된 것인가?

### 5. Relationship을 업무 의미로 설명하는가?

단순 선이 아닌가?

### 6. Multiplicity를 추측하지 않았는가?

Unknown을 발견하면 질문으로 남겼는가?

### 7. Analysis / Design 경계를 지켰는가?

Method나 Responsibility를 미리 결정하지 않았는가?

### 8. Just-enough인가?

현재 질문에 불필요한 상세를 제거했는가?

### 9. Requirement Feedback이 발생했는가?

모델이 새로운 질문을 만들었는가?

---

# 39. Failure Conditions

다음을 실패로 본다.

- Requirement의 명사를 기계적으로 Class로 변환한다.
- Logical Data Model/ERD와 OO Analysis Model을 완전히 동일한 것으로 취급한다.
- DB Schema에서 Domain Model을 역으로 만든다.
- Controller, Service, Repository를 Concept로 넣는다.
- Programming Type을 analysis type처럼 사용한다.
- 반대로 유용한 기본 Type/Value Domain까지 무조건 제거한다.
- Method를 분석 모델에 배치해 Responsibility를 조기 결정한다.
- Association의 의미를 설명하지 못한다.
- Multiplicity를 근거 없이 채운다.
- 모든 Whole–Part에 Aggregation/Composition을 붙인다.
- 모델을 완전한 현실 사전으로 만들려 한다.
- 모델에서 발견한 Requirement 문제를 되돌리지 않는다.
- Agile이라는 이유로 Analysis 사고를 생략한다.
- Analysis Model을 별도 Waterfall phase가 필수라는 의미로 받아들인다.
- Solution Detail이 Problem Understanding을 대신하거나 조기에 제약하도록 둔다.

---

# 40. Anchor / Reference 사용

## Brooks — Essence / Accident

**위치:** Opening, Analysis/Solution 경계, 구현 요소 제거

**역할:**  
Problem Domain의 essential conceptual complexity와 accidental/premature solution detail을 구분한다.

---

## Booch — OOA

**위치:** Static Analysis Model 정의

**역할:**

OOA가 구현 Class 설계가 아니라 **문제영역의 용어와 의미 관점에서 Requirement를 이해하는 활동**임을 고정한다.

---

## Rumbaugh — Aggregation

**위치:** Whole–Part

**역할:**

Notation이 Domain Meaning을 대신하지 못한다는 경계를 제공한다.

---

## Larman — Domain Model / Conceptual Class

**위치:** Concept 식별, Conceptual Domain Model, Analysis Concept ≠ Software Class

**역할:**

Domain Model을 conceptual perspective에서 설명하고 implementation class와 분리한다.

---

## Brooks + OOAD + MDD/MDA

**위치:** 초반 모델링 좌표

**역할:**

Model이 단순 documentation artifact가 아니라 문제 이해에서 설계·구현으로 이어지는 engineering artifact임을 설명한다.

MDD/MDA 상세 자체는 가르치지 않는다.

---

## DDD — Domain

**위치:** `Domain이란 무엇인가`, 모델링 좌표

**역할:**

OOAD의 Domain/Domain Model과 DDD의 Domain Model 중심 접근 사이의 연결을 보여준다.

DDD Pattern은 다루지 않는다.

---

# 41. Session Summary

```text
S01
Problem ≠ Solution
Analysis ≠ Phase
Brooks Essence / Accident
Static + Dynamic 예고
        ↓

S02
Customer Need
→ Requirement
→ Use Case
→ SSD
→ Operation Contract
→ Required Domain State Change
        ↓

S03
Domain
→ S02 용어집 정제
→ Concept
→ Attribute
→ Type / Value Domain
→ Relationship
→ Multiplicity
→ Whole–Part
→ Conceptual / Analysis Domain Model
        ↓
Solution Detail 제거
        ↓
Requirement 재질문
        ↓
Static Problem Understanding
```

핵심 Claim:

> **Analysis는 단계가 아니라 Problem을 Solution과 구분하여 이해하는 사고 활동이다.**

> **정적 분석 모델은 Problem Domain의 essential structure를 Concept·Attribute·Value·Relationship으로 명시한다.**

> **Accidental 또는 premature solution detail이 Problem Understanding을 대신하거나 조기에 왜곡·제약하지 않도록 구분한다.**

> **Static Model은 Requirement를 복사하는 그림이 아니라 누락·모순·불확실성을 발견하는 사고 도구다.**

> **Analysis Concept은 Software Class가 아니다.**

> **가장 상세한 모델이 아니라 현재 판단에 충분한 모델이 좋은 모델이다.**

---

# 42. S04로 넘기는 질문

S03에서 다음은 설명할 수 있다.

```text
무엇이 존재하는가?

어떤 정보를 가지는가?

어떤 값의 종류가 필요한가?

어떤 관계와 구조를 가지는가?
```

하지만 다음은 아직 남는다.

```text
어떤 사건이 발생하는가?

무엇이 어떤 순서로 상호작용하는가?

어떤 상태가 어떤 사건에 의해 변하는가?

같은 구조가 시간에 따라 어떻게 행동하는가?
```

따라서 S03의 마지막 질문은:

> **이 구조 안에서 사건이 발생할 때 무엇이 어떻게 상호작용하고 상태가 어떻게 변하는가?**

로 끝낸다.

이 질문까지만 남기고 S04 내용을 S03에서 해결하지 않는다.

---

## Whole-Curriculum Integration 단계로 이관한 조정 항목

1. **ER/Logical Model·Ontology·MDD/MDA·DDD 좌표의 밀도**  
   내용적으로는 필요하다. 문제는 75분에서 어느 정도까지 압축할지다.

2. **Value Domain의 깊이**  
   `Date / Money / Boolean / OrderStatus`와 제한된 값 집합까지는 포함한다. 단위·범위·정밀도까지 어디까지 들어갈지는 조정할 수 있다.

3. **Generalization/Specialization**  
   현재 승인본에는 포함하지 않는다. 전체 Curriculum 완료 후 Integration Review에서 필요성을 다시 판단한다. 포함하더라도 inheritance/reuse 설계가 아니라 conceptual classification으로 한정한다.

4. **75분 실제 teaching progression**  
   전체 Curriculum 완료 후 Integration Review에서 설명·interaction·practice 밀도를 함께 검토하고, 그 결과에서 권장 slide 범위를 최종 산정한다.
