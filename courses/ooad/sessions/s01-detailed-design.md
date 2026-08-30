# S01. OOAD 개요

- **시간:** 60분
- **권장 슬라이드:** 24장 전후
- **허용 범위:** 22~26장

## 과정 목표

학습자는 이 세션을 통해 다음을 이해한다.

- 왜 분석과 설계가 필요한가.
- 분석과 설계가 각각 무엇을 하는가.
- 분석과 설계를 고정된 단계가 아니라 서로 다른 질문과 사고 활동로 구분한다.
- 문제의 본질적 복잡성과 구현 과정에서 추가되는 복잡성을 구분한다.
- 문제영역을 정적·동적 관점으로 이해하는 이유를 설명한다.
- 왜 객체지향이라는 접근이 필요한가.
- OOA와 OOD가 무엇이며 어떻게 연결되는가.
- Analysis/Architecture/Design/Technical Design이 서로 다른 Engineering Judgment이며, 독립된 lifecycle phase가 아니라는 것을 설명한다.
- 이 과정의 Session 순서(Learning Sequence)가 실제 개발의 Engineering Lifecycle을 의미하지 않는다는 것을 구분한다.
- 실제 delivery가 `Define ↔ Build ↔ Test`처럼 반복되며, Test/구현 evidence가 앞선 판단을 다시 열 수 있다는 것을 설명한다.
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

### Iterative / Incremental / Agile — Define ↔ Build ↔ Test

```text
Define ↔ Build ↔ Test
```

- **Define** — 문제/요구 이해, 필요한 Analysis/Architecture/Design 판단
- **Build** — Technical Design·구현·통합, 그 과정에서 재발생하는 Analysis/Architecture/Design 재판단
- **Test** — 실행 결과와 evidence 확인, 필요하면 Define 또는 Build로 되돌리는 feedback

`Analysis = Define`, `Design = Build`, `Test = 마지막 단계`처럼 1:1로 고정하지 않는다. Build 중에도 Analysis/Design 판단이 다시 필요할 수 있고, Test evidence가 Define/Build의 판단을 다시 열 수 있다.

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
- items
- totalAmount

OrderService.calculateTotal()
CheckoutService.calculateTotal()
PaymentService.validateAmount()
```

여러 Service가 `OrderItem.quantity`와 금액 정보를 읽어 주문 총액을 각각 계산하고 있다.

문제:

> **같은 주문 총액 규칙이 여러 곳에 퍼져 있어 한 규칙 변경이 여러 Service에 파급된다.**

질문:

> **주문 총액을 알고 계산하는 책임은 어디에 있어야 하는가?**

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

# 5. Engineering Judgment / Abstraction Map

**목표:** Analysis/Architecture/Design/Technical Design이 서로 다른 질문을 판단하는 Engineering Judgment이며, 이 과정의 Session 순서가 실제 개발 lifecycle과 같지 않다는 것을 구분한다.

## Engineering Judgment / Abstraction Map

```text
Intent            — 무엇을 이루려는가
        ↓
Requirement       — 무엇이 필요한가
        ↓
Analysis          — 문제·의미·규칙을 어떻게 이해하는가
        ↓
Architecture      — 시스템 수준 경계·구조·제약을 어떻게 판단하는가
        ↓
Design            — 책임·협력·구조를 어떻게 배치하는가
        ↓
Technical Design  — 기술 환경과 구현 제약에 맞게 어떻게 구체화하는가
        ↓
Code              — 실행 가능한 구현
```

> **이 Map은 lifecycle phase diagram이 아니라 서로 다른 질문을 구분하는 Engineering Judgment 지도다.** 화살표는 순서를 강제하지 않으며, 실제 개발에서는 필요한 시점에 반복하고 판단 수준 사이를 왕복한다.

Architecture는 이 과정이 새로 가르치는 주제가 아니다. OOAD는 Analysis와 Design에 집중하며, Architecture의 상세 판단(구조 대안, quality trade-off)은 SW Architecture 과정이 소유한다. 이 Map에서는 Architecture가 Analysis와 Design 사이에 존재하는 별개의 judgment라는 위치만 확인한다.

Define ↔ Build ↔ Test(§2)는 이 Map과 다른 관점이다. Judgment Map은 **어떤 질문을 판단하는가**를 구분하고, Define ↔ Build ↔ Test는 **그 판단들이 실제 delivery에서 어떻게 반복되는가**를 보여준다. 두 관점을 `Analysis=Define`처럼 1:1로 대응시키지 않는다.

## Course Sequence ≠ Engineering Lifecycle

다음 절 "과정 지도"는 위 Engineering Judgment Map 전체를 다시 그리는 것이 아니다.

> **이 과정의 Session 순서는 Analysis와 Design 중심으로 판단 유형을 나누어 가르치기 위한 Learning Sequence다. 실제 개발이 밟아야 하는 Engineering Lifecycle을 의미하지 않는다.**

Learning Sequence 안에서는 앞선 Session의 판단으로 되돌아가지 않고 다음 Session으로 진행하지만, 실제 engineering에서는 후속 evidence가 앞선 Analysis/Architecture/Design 판단을 다시 열 수 있다.

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

**Engineering Judgment Map과 이 과정의 Session 순서는 같은가?**

아니다. Map은 Analysis/Architecture/Design/Technical Design이라는 서로 다른 judgment를 구분하고, Session 순서는 그중 Analysis와 Design을 가르치기 위한 Learning Sequence다. 실제 delivery는 `Define ↔ Build ↔ Test`로 반복되며, Test/구현 evidence가 앞선 판단을 다시 열 수 있다.

다음 질문:

> **그렇다면 우리가 해결해야 할 문제와 요구를 어떻게 제대로 발견하고 정의할 것인가?**

→ **S02. 문제 발견과 요구 이해**

---

# 권장 24장 구성

추가된 `Essence / Accident`, `Analysis ≠ Phase`, 정적·동적 관점, `Engineering Judgment / Abstraction Map`, `Define ↔ Build ↔ Test`는 별도 지식 항목이 아니라 기존 논증을 명확히 하는 핵심 Anchor다. §2의 Iterative/Agile 설명을 Define/Build/Test로 통합해 별도 slide를 늘리지 않았고, §5(Engineering Judgment Map, Course Sequence ≠ Engineering Lifecycle)만 신규 2장으로 추가했다. 60분 안에서 설명을 압축하여 **24장 전후**, 허용 범위 **22~26장**을 권장한다.

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
| 10 | 2 | Predictive vs Iterative / Agile — **Define ↔ Build ↔ Test 반복 flow** |
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
| 22 | 5 | **Engineering Judgment / Abstraction Map** |
| 23 | 5 | **Course Sequence ≠ Engineering Lifecycle** |
| 24 | Closing | **과정 지도 + 과정 요약** |
