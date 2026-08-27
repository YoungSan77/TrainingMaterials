# S01. OOAD 개요

- **시간:** 60분
- **권장 슬라이드:** 22장 전후
- **허용 범위:** 20~24장

## 과정 목표

학습자는 이 세션을 통해 다음을 이해한다.

- 왜 분석과 설계가 필요한가.
- 분석과 설계가 각각 무엇을 하는가.
- 분석과 설계를 고정된 단계가 아니라 서로 다른 질문과 사고 활동로 구분한다.
- 문제의 본질적 복잡성과 구현 과정에서 추가되는 복잡성을 구분한다.
- 문제영역을 정적·동적 관점으로 이해하는 이유를 설명한다.
- 왜 객체지향이라는 접근이 필요한가.
- OOA와 OOD가 무엇이며 어떻게 연결되는가.
- 이후 OOAD 과정이 어떤 흐름으로 진행되는가.

---

# 1. 왜 분석·설계인가?

**목표:** 구현 이전에 문제와 요구를 올바르게 이해해야 하는 이유를 인식한다.

핵심 흐름:

> **잘못 이해한 문제 → 필요 없는 기능·잘못된 기능 → 뒤늦은 발견 → 시간 낭비·재작업 → 변경 파급**

SW 개발의 문제는 코드에서만 시작되지 않는다. 요구 자체를 잘못 이해하면 구현을 아무리 잘해도 잘못된 결과를 만들 수 있다.

## Boehm — 재작업과 늦은 수정 비용

Boehm과 Basili는 당시 SW 프로젝트에서 약 **40~50%의 노력이 avoidable rework에 사용된다**고 보고했으며, delivery 이후 문제 수정 비용이 requirements/design 단계보다 **종종 100배까지 높아질 수 있다**고 정리했다.

다만 저자들은 작은 비핵심 시스템에서는 그 차이가 약 5:1 수준일 수 있다고 명시한다. 따라서 100배를 보편 법칙으로 사용하지 않는다.

한 슬라이드에서 두 메시지를 함께 보여준다.

> **재작업 자체가 상당한 개발 노력을 소비하며, 문제를 늦게 발견할수록 그 재작업 비용은 더 커질 수 있다.**

## Standish — 사용되지 않는 기능

2002년 Jim Johnson이 소개한 Standish 자료에서는 기능의 **45%가 never used**, 그리고 **20%만 often 또는 always used**된 것으로 제시됐다.

교육적 핵심은 특정 비율 자체가 아니다.

> **요구된 기능 ≠ 실제로 필요한 기능**

따라서 분석의 목적은 요구사항을 많이 만드는 것이 아니라 **실제로 해결해야 할 문제와 필요한 기능을 이해하는 것**이다.

## Brooks — Essence와 Accident

Brooks의 *No Silver Bullet* 문제의식을 과정 전체의 상위 Anchor로 사용한다.

SW의 어려움에는 서로 다른 두 종류가 있다.

- **Essence** — 해결해야 할 문제 자체가 가진 개념, 규칙, 관계, 상태, 행위와 그 상호작용에서 오는 본질적 복잡성
- **Accident** — 특정 기술, 도구, 표현, 구현 방식과 개발 환경 때문에 추가되는 부수적 복잡성

이 구분의 교육적 목적은 특정 복잡성을 완전히 분류하는 데 있지 않다.

핵심 질문은 다음이다.

> **지금 어려운 이유가 문제 자체를 충분히 이해하지 못했기 때문인가, 아니면 선택한 구현 방식 때문에 추가된 것인가?**

OOAD에서 Analysis의 우선 과제는 **essential problem을 구현 결정과 분리하여 이해하는 것**이다.

```text
Problem / Requirement
        ↓
Essential Concepts / Rules / Behavior
        ↓
Analysis
        ↓
Design Decisions
        ↓
Implementation
```

분석 모델은 essential complexity를 없애는 도구가 아니다.

> **본질적 복잡성을 명시적으로 드러내고 이해하여, accidental solution detail이 문제 이해를 대신하지 않게 하는 도구다.**

## Block 1 결론

> **잘못된 문제를 제대로 구현하는 것은 성공이 아니다.**

---

# 2. 분석과 설계 정의

**목표:** 분석과 설계가 서로 다른 질문에 답한다는 것을 구분한다.

## 분석 Analysis

> **정의된 요구사항에서 무엇을 해결해야 하는가를 이해하고 명확히 하는 활동**

주요 질문:

- 사용자가 해결하려는 문제는 무엇인가?
- 어떤 목표를 달성하려 하는가?
- 어떤 개념과 관계가 존재하는가?
- 어떤 행위와 상태 변화가 일어나는가?
- 어떤 규칙과 제약이 존재하는가?

## 설계 Design

> **분석된 문제를 어떤 책임과 구조로 해결할 것인가를 결정하는 활동**

주요 질문:

- 어떤 객체가 필요한가?
- 상태와 행위는 누가 책임지는가?
- 객체들은 어떻게 협력하는가?
- 무엇을 계약으로 보장해야 하는가?
- 변경 영향을 어디에 국소화할 것인가?

핵심 관계:

```text
Analysis
무엇을 해결해야 하는가?
        ↓
Design
어떤 책임과 구조로 해결할 것인가?
        ↓
Implementation
그 결정을 코드로 실현한다
```

분석과 설계는 문서를 만드는 별개의 절차가 아니라 **문제 이해를 구현 가능한 해결책으로 전환하는 연속적인 판단 활동**이다.

## Analysis ≠ Analysis Phase

이 과정에서 `Analysis`는 특정 lifecycle의 고정된 단계를 뜻하지 않는다.

> **Analysis와 Design은 단계의 구분보다 질문의 구분이다.**

논리적으로는 다음 질문을 구분한다.

```text
Analysis
무엇을 해결해야 하는가?

Design
어떤 책임과 구조로 해결할 것인가?

Implementation
그 결정을 어떻게 실현할 것인가?
```

실제 개발 프로세스에서는 이 활동들이 다른 방식으로 배치될 수 있다.

### Predictive

```text
Analyze → Design → Implement
```

### Iterative / Incremental / Agile

```text
Understand
   ↕
Analyze ↔ Design ↔ Implement ↔ Test
   ↑                         ↓
   └──────── Feedback ───────┘
```

따라서:

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

분석이 설계와 같은 iteration 안에서 수행된다고 해서 분석 질문이 사라지는 것은 아니다. 오히려 구현 결정을 성급하게 문제 정의에 섞지 않기 위해 이 구분이 더 중요해진다.

---

# 3. 왜 객체지향인가?

**목표:** 객체지향을 Class 문법이 아니라 복잡성과 변경을 조직하는 설계 접근으로 이해한다.

핵심 흐름:

```text
SW 규모와 복잡성 증가
        ↓
분할과 구조화
        ↓
모듈화
        ↓
Information Hiding
        ↓
상태와 행위를 어디에 둘 것인가?
        ↓
객체의 경계
        ↓
Responsibility
        ↓
Message / Collaboration
```

객체지향은 절차적 접근이 잘못되었기 때문에 등장한 것이 아니다.

문제의 규모와 변화가 커질수록:

- 데이터와 이를 다루는 행위가 여러 곳으로 분산되고,
- 동일한 업무 판단이 여러 호출부에 반복되고,
- 상태 변경 규칙의 owner가 불명확해지며,
- 작은 변경도 넓은 영역으로 전파될 수 있다.

따라서 중요한 설계 질문은 다음으로 이동한다.

> **상태와 행위를 어디에 두어야 하는가?**

## Information Hiding

모듈은 단순히 코드를 나누는 단위가 아니다.

Parnas의 Information Hiding 관점에서는 **변경될 가능성이 있는 설계 결정을 다른 부분으로부터 숨기는 경계**가 중요하다.

이 관점은 이후 객체의 Encapsulation과 Responsibility로 연결한다.

## 객체의 관점

이 과정에서 객체는 단순한 데이터 구조나 현실의 명사에 대응하는 Class가 아니다.

> **객체는 상태와 행위를 소유하고 책임을 수행하며, 다른 객체와 메시지로 협력하는 설계 단위다.**

Alan Kay의 OOP Anchor는 객체지향의 중심을 Class hierarchy가 아니라 **messaging과 local state**에 두는 근거로 사용한다.

## Order Mini Exercise

상황:

```text
Order
- status
- paymentStatus

OrderService.cancel()
ShippingService.ship()
PaymentService.refund()
```

여러 Service가 `order.status`를 읽어 취소 가능 여부를 판단하고 있다.

새 요구:

> **배송이 시작된 주문은 취소할 수 없다.**

질문:

> **취소 가능 여부를 판단하는 책임은 누구에게 있어야 하는가?**

이 단계에서는 해결책을 설계하지 않는다.

학습자가 다음 문제를 발견하면 충분하다.

> **동일한 업무 판단의 owner가 불명확하면 변경이 여러 곳으로 퍼질 수 있다.**

Pattern이나 Class를 먼저 추가하는 것은 이 실습의 목적이 아니다.

---

# 4. OOA와 OOD 정의

**목표:** 객체 관점이 분석과 설계에서 각각 무엇을 의미하는지 구분한다.

## OOA — Object-Oriented Analysis

Booch의 OOA 정의를 Anchor로 사용한다.

핵심 의미:

> **문제영역을 객체 관점에서 이해한다.**

```text
Requirements
     ↓
OOA
     ↓
Problem-Domain Understanding
     ↓
Analysis Model
```

분석 모델은 이후 과정에서 같은 문제영역을 두 관점으로 구체화한다.

- **분석 정적 모델** — 무엇이 존재하며 어떤 속성과 관계를 가지는가?
- **분석 동적 모델** — 무엇이 일어나며 어떻게 상호작용하고 상태가 변하는가?

```text
Problem-Domain Understanding
        │
        ├─ Static View
        │   Concept / Attribute / Relationship
        │
        └─ Dynamic View
            Interaction / State Change
```

둘은 서로 다른 단계가 아니라 **같은 문제를 이해하기 위한 상호보완적 관점**이다.

S01에서는 상세 모델링 방법까지 들어가지 않는다.

## OOD — Object-Oriented Design

Booch의 OOD 정의를 Anchor로 사용한다.

핵심 의미:

> **분석한 문제를 객체의 책임과 협력 구조로 설계한다.**

```text
Analysis Model
      ↓
OOD
      ↓
Object Boundary
Responsibility
Message / Collaboration
Contract
```

중요한 것은:

> **분석에서 발견한 개념을 그대로 Class로 변환하는 것이 객체 설계는 아니다.**

분석은 문제를 이해하고, 설계는 그 문제를 해결할 **책임 있는 객체 구조를 결정한다.**

## UML보다 솔루션 분석과 설계

UML은 OOAD의 목적이 아니다.

> **UML을 잘 그리는 것이 아니라, 올바른 솔루션을 분석하고 설계하는 것이 목적이다.**

UML은 분석과 설계의 결과를:

- 표현하고,
- 공유하고,
- 검토하기 위한 수단이다.

Larman의 `Design Principles over UML` Anchor를 여기에서 사용한다.

---

# 과정 지도

아래 흐름은 고정된 lifecycle phase를 뜻하지 않는다. 과정에서 익힐 **사고와 판단의 논리적 흐름**이다.

```text
Problem / Requirement
        ↓
Problem Understanding
        ↓
Analysis Thinking
 ├─ 분석 정적 모델
 └─ 분석 동적 모델
        ↓
Design Thinking
        ↓
분석에서 객체 설계로
        ↓
책임 설계
 ├─ 책임과 협력
 └─ 계약과 변화 대응
        ↓
객체 설계의 판단
        ↓
통합 설계
        ↓
Implementation / Test
        ↓
Feedback / Refactoring
        ↺
```

실제 Iterative / Agile 개발에서는 이 흐름을 작은 범위에서 반복하며 앞뒤로 왕복한다.

S01은 이 전체 과정에서 **왜 이 사고 흐름이 필요한가**를 이해하는 세션이다.

---

# 과정 요약

**왜 분석·설계인가?**  
잘못된 문제를 제대로 구현하지 않기 위해.

**분석이란?**  
무엇을 해결해야 하는지 이해하고 명확히 하는 사고 활동. 특정 lifecycle의 고정된 단계가 아니다.

**Essence와 Accident를 왜 구분하는가?**  
문제 자체의 본질적 복잡성을 구현 방식이 추가하는 복잡성과 분리하여 이해하기 위해.

**정적·동적 분석 모델은 무엇인가?**  
같은 문제영역을 구조와 행위라는 두 상호보완적 관점에서 이해하는 수단.

**설계란?**  
그 문제를 어떤 책임과 구조로 해결할지 결정하는 활동.

**왜 객체지향인가?**  
변화하는 상태와 행위를 책임 있는 객체의 경계 안에 두고 메시지와 협력으로 조직하기 위해.

**OOA와 OOD란?**  
문제영역을 객체 관점에서 이해하고, 그 이해를 책임 있는 객체 설계로 전환하는 활동.

다음 질문:

> **그렇다면 우리가 해결해야 할 문제와 요구를 어떻게 제대로 발견하고 정의할 것인가?**

→ **S02. 문제 발견과 요구 이해**

---

# 권장 22장 구성

추가된 `Essence / Accident`, `Analysis ≠ Phase`, 정적·동적 관점은 별도 지식 항목이 아니라 기존 논증을 명확히 하는 핵심 Anchor다. 60분 안에서 설명을 압축하여 **22장 전후**, 허용 범위 **20~24장**을 권장한다.

| # | Block | Slide |
|---:|---|---|
| 1 | Opening | 과정 목표 |
| 2 | 1 | 왜 분석·설계가 필요한가 |
| 3 | 1 | 잘못 이해한 문제의 연쇄 |
| 4 | 1 | **Boehm — Avoidable Rework + 늦은 수정 비용** |
| 5 | 1 | Standish — 요구된 기능 ≠ 필요한 기능 |
| 6 | 1 | **Brooks — Essence vs Accident** |
| 7 | 2 | 분석이란 무엇인가 |
| 8 | 2 | 설계란 무엇인가 |
| 9 | 2 | **Analysis ≠ Phase — 질문을 구분한다** |
| 10 | 2 | Predictive vs Iterative / Agile — Process에서는 통합, 사고에서는 구분 |
| 11 | 3 | 왜 객체지향인가 |
| 12 | 3 | 복잡성 → 구조화 → 모듈화 |
| 13 | 3 | Information Hiding |
| 14 | 3 | 상태와 행위를 어디에 둘 것인가 |
| 15 | 3 | 객체 = 상태 + 행위 + 책임 |
| 16 | 3 | Message와 Collaboration |
| 17 | 3 | Order Mini Exercise |
| 18 | 4 | OOA — 문제영역의 이해 |
| 19 | 4 | **Static View + Dynamic View** |
| 20 | 4 | OOD — 객체 설계 |
| 21 | 4 | **OOA → OOD / UML보다 솔루션 분석과 설계** |
| 22 | Closing | **과정 지도 + 과정 요약** |
