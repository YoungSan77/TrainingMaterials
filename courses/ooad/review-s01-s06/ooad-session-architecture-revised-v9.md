# OOAD Curriculum — Session Architecture

## 1. Course Overview

### 과정명
**객체지향 분석과 설계 실무 — OOAD**

### 교육시간
**16시간 / 800분**

### 대상
**객체지향 분석·설계 역량을 체계적으로 익히거나 강화하려는 SW 개발자, 설계자, 분석가(BA)**

특히 다음과 같은 문제를 경험한 학습자를 고려한다.

- 요구를 충분히 분석하지 않고 바로 구현으로 넘어간다.
- 요구나 Use Case를 곧바로 Class 목록으로 변환한다.
- 데이터와 행위가 분리되어 업무 규칙과 책임이 여러 곳에 흩어진다.
- 변경 시 여러 객체·서비스·호출부를 함께 수정해야 한다.
- UML이나 SOLID·Pattern의 이름을 실제 설계 판단보다 앞세운다.

Course Design의 capability gap과 연결된다.

### 과정 목적

> **업무 요구와 변경 요구를 정의하고, 분석·설계를 통해 이를 객체의 책임·협력·계약으로 변환하며, 그 분석과 설계 결정을 코드와 테스트까지 원활하게 연결할 수 있는 판단 능력을 기른다.**

Course Design은 요구와 변경 압력을 객체의 책임·협력·계약으로 변환하여 코드로 이어가는 것을 과정 목적으로 정의한다.

---

## 2. 왜 분석과 설계인가

SW 개발의 문제는 구현 단계에서만 발생하지 않는다.

> **잘못 이해한 문제 → 필요 없는 기능·잘못된 기능 → 뒤늦은 발견 → 시간 낭비·재작업 → 변경 파급**

따라서 구현 전에 무엇을 해결해야 하는지 이해하고, 그것을 어떤 구조와 책임으로 해결할지 결정해야 한다.

**분석(Analysis)**은 **Problem을 Solution과 구분하여 무엇을 해결해야 하는가를 이해하고 명확히 하는 사고 활동**이다.

**설계(Design)**는 분석된 문제를 **어떤 책임과 구조로 해결할 것인가를 결정하는 사고 활동**이다.

Analysis와 Design은 고정된 lifecycle phase를 뜻하지 않는다. Predictive에서는 명시적인 단계로 보일 수 있고, Iterative/Incremental/Agile에서는 같은 iteration 안에서 반복·통합될 수 있다.

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

Brooks의 Essence / Accident 관점에서 문제영역의 essential conceptual complexity를 이해하고, accidental 또는 premature solution detail이 Problem Understanding을 대신하거나 조기에 왜곡·제약하지 않도록 구분한다.

Course Design도 분석 문제와 구현 결정을 구분하는 능력을 Target Capability로 요구한다.

---

## 3. 왜 객체지향인가

분석과 설계가 필요하다는 사실이 객체지향을 자동으로 정답으로 만들지는 않는다.

이 과정은 객체지향을 **복잡성과 변경을 어떻게 조직할 것인가**라는 문제에서 출발해 설명한다.

```text
복잡성과 변화 증가
        ↓
변경 파급과 책임 분산
        ↓
구조화 / 모듈화 / 정보 은닉
        ↓
상태와 행위를 어디에 둘 것인가?
        ↓
객체 경계
        ↓
누가 무엇을 책임질 것인가?
        ↓
객체 간 메시지와 협력
        ↓
책임을 어떻게 보장할 것인가?
```

따라서 객체를 단순한 데이터 구조나 현실 명사의 Class 표현으로 보지 않는다.

> **객체는 상태와 행위를 소유하고 책임을 수행하며, 다른 객체와 메시지로 협력하는 설계 단위다.**

과정의 중심 질문은 다음으로 압축된다.

> **누가 무엇을 책임지고, 누구와 어떻게 협력하며, 무엇을 보장해야 하는가?**

이는 Course Design의 thesis와 직접 연결된다.

---

## 4. 분석 모델에서 객체 설계로

OOAD의 논리적 흐름은 **문제영역을 이해하는 Analysis concern**과 그 이해를 **책임 있는 객체 설계로 변환하는 Design concern**을 구분한다. 이는 전반부·후반부라는 고정 lifecycle phase를 뜻하지 않으며 실제 개발에서는 반복적으로 왕복할 수 있다.

```text
Problem / Business Need
        ↓
**용어집**
        ↓
**Event-centered requirement analysis**
Meaningful Event
→ Context / Condition
→ Required Response / Outcome
→ Stakeholder Value
        ↓
Requirement / Scenario
        ↓
Problem Understanding
        ↓
┌──────────────────────┐
│      분석 모델        │
│                      │
│  분석 정적 모델       │
│  +                   │
│  분석 동적 모델       │
└──────────────────────┘
        ↓
분석에서 객체 설계로
        ↓
┌──────────────────────┐
│      객체 설계        │
│                      │
│  객체 경계            │
│  책임                 │
│  메시지 / 협력        │
│  계약                 │
│  의존성과 변화 대응   │
└──────────────────────┘
        ↓
Code / Test
        ↓
Feedback / Refactoring
```

**분석 정적 모델**은 문제영역의 개념·속성·관계와 구조를 이해한다.

**분석 동적 모델**은 같은 문제영역의 행위·상호작용·상태 변화와 시간적 흐름을 이해한다.

둘은 서로 다른 단계가 아니라 **동일한 Problem Understanding을 정적·동적 관점에서 명시하고 검토하는 상호보완적 분석 모델**이다. 복잡하거나 위험한 요구에서는 이 두 관점이 Requirement/Scenario의 누락·모순·모호함을 드러내고 구현 결정을 내릴 충분한 이해인지 검증하는 evidence가 된다.

그 결과를 구현 Class로 기계적으로 변환하지 않는다. S05부터 상태·행위·변경 이유를 기준으로 객체 경계를 찾고, 책임·협력·계약을 배치하면서 **객체 설계**로 전환한다.

Course Design도 분석 모델과 설계 모델을 구분하고, 정적·동적 모델 뒤에 책임·계약·응집도·결합도 판단을 두고 있다.

---

## 5. 과정 전체의 핵심 판단 질문

1. **무엇을 해결해야 하며, 어떤 공통 언어로 어떤 Event와 Response / Outcome을 정의할 것인가?**
2. **현재 문제를 이해하기 위해 어떤 분석 모델이 필요한가?**
3. **어떤 상태와 행위를 어느 객체가 책임져야 하는가?**
4. **객체들은 누구와 어떻게 협력하고 무엇을 보장해야 하는가?**
5. **이 설계가 변경 영향을 실제로 줄이는가?**

GRASP, SOLID, Pattern, UML, Test, Refactoring은 이 질문에 답하기 위한 **수단과 판단 도구**이지 과정의 목적이 아니다.

Course Design 역시 모델 선택, 책임 owner, coupling/change impact, 추상화·Pattern·Refactoring 비용을 핵심 설계 판단으로 정의한다.

---

## 6. Scope / Boundary

### OOAD가 소유하는 핵심 영역

> **객체 책임·협력·계약과 분석 → 객체 설계 전환**

### OOAD 판단을 위해 사용하는 주요 수단

- Use Case
- SSD / Operation Contract
- 분석 정적·동적 모델
- UML
- RDD / GRASP
- Design by Contract
- SOLID
- Interface / Composition
- Design Pattern
- Test / Refactoring

이들을 독립된 지식 카탈로그로 가르치지 않고 실제 설계 판단에 필요한 수준으로 사용한다.

### 다른 과정으로 넘기는 영역

- Domain 의미, Aggregate, Bounded Context → **DDD**
- Architecture style, quality attribute trade-off → **SW Architecture**
- Service decomposition, distributed failure → **MSA**
- 특정 언어/framework 숙련
- Pattern catalog 암기

Course Design의 ownership과 non-scope를 따른다.

---

## 6.1 Running Example / Practice Baseline

S02~S06의 공통 기본 시나리오는 **Place Order → Payment**로 한다.

- 기본 분석·설계에서 `Customer`, `Order`, `OrderItem`, `Product`, `Payment`가 자연스럽게 발견·정제되도록 한다.
- `Shipment`는 기본 흐름의 필수 Concept으로 두지 않는다. Dynamic Model의 종류를 설명하는 완성 예제에서 필요하면 별도 예시로 사용할 수 있으나, S02~S06 공통 실습 산출물의 필수 요소로 강제하지 않는다.
- `Order Cancellation`과 `Refund`는 S02~S06의 **주 running example과 실습 대상에서는 제외**하고, 필요한 개념 설명의 짧은 예로만 사용할 수 있다. S07에서 이를 본격적인 variation/change request로 투입하여 기존 책임·계약·협력 구조가 변화에 어떻게 반응하는지 검증한다.
- S05는 RDD/GRASP를 체계적으로 적용하기 전 수강생 경험에 기반한 **Initial Design**을 만든다.
- S06·S07은 S05 Initial Design을 RDD 관점에서 단계적으로 보완한다.

# 7. Session Architecture

> **Recommended Slides는 Architecture 단계의 초기 추정값이다. 상세 설계의 제약이 아니며, 각 Session Detailed Design에서 실제 claim·설명 밀도·interaction·practice·feedback을 근거로 재산정하고 이 표를 갱신한다.**

| Session | Title | Time | Core Question / Outcome | Main Learning Flow | Practice | Main Anchors / References | Recommended Slides |
|---|---|---:|---|---|---|---|---:|
| **S01** | **OOAD 개요** | **60분** | 왜 분석·설계인가? 왜 객체지향인가? Analysis를 phase가 아닌 사고 활동으로 구분하고, Brooks Essence/Accident와 Static/Dynamic 관점을 포함해 OOAD가 해결하려는 문제와 전체 판단 흐름을 설명한다. | 문제 오해 → 재작업·변경 파급 → **Brooks Essence/Accident** → **Analysis ≠ Phase** → Problem/Solution 구분 → Static/Dynamic Problem Understanding 예고 → 복잡성·모듈화·정보 은닉 → 객체지향 → OOA/OOD → 과정 지도 | **도입 Mini Exercise:** Order 변경의 파급 위치 찾기 → **Discussion:** 어느 질문/판단에서 예방할 수 있었는가? | **Brooks Essence/Accident**, Alan Kay OOP, Booch OOA/OOD, Larman Design Principles over UML / *Applying UML and Patterns* | **20~24 (상세설계 반영)** |
| **S02** | **문제 발견과 요구 이해** | **90분** | 무엇을 만들어야 하는지 발견하고 Essential Problem과 Solution Detail을 구분하며, Event-centered requirement analysis와 Use Case를 통해 요구를 구조화할 수 있는가? | 문제·목표 → Essential Problem/Solution Detail → Discovery/Analysis/Validation → Interview/Observation/Workshop/Prototype → 용어집 → Event-centered requirement analysis → Use Case → Use Case Specification → SSD/System Event/System Operation/Operation Contract → User Story/Acceptance Criteria/BDD → 접근별 선택 | **[실습] Place Order Use Case 작성 (25~30분, 본편 1장):** Use Case Diagram + Place Order Specification. LLM은 누락·과도한 기능·Solution Detail을 검토한다. 답안/해설은 Session 끝 `[별첨]`. | **Brooks Essence/Accident, Yourdon Event–Response, Jacobson Use Case** / *Applying UML and Patterns* | **상세설계에서 재산정** |
| **S03** | **분석 정적 모델** | **75분** | 문제영역의 essential structure를 정적 분석 모델로 표현하고 구현 결정과 분리된 Problem Understanding을 어떻게 명확히 하는가? | S01/S02 회수 → Static/Dynamic Problem Understanding → Brooks Essence/Accident → 정적 모델의 위치 → S02 용어집 정제 → Concept → Attribute / analysis-level type → Association/Relationship → Multiplicity / Whole-Part → Conceptual/Analysis Domain Model → 구현 Class와 구분 → Requirement 재질문 | **[실습] Order Conceptual Domain Model 작성 (25~30분, 본편 1장):** Place Order→Payment 범위에서 Concept, Attribute, Type/Value Domain, Association, Multiplicity, 필요한 Whole-Part를 포함한 완전한 정적 분석 모델 1개 작성. 답안은 `[별첨]`. | **Brooks Essence/Accident, Booch OOA, Rumbaugh Aggregation, DDD Domain** / *Applying UML and Patterns* | **상세설계에서 재산정** |
| **S04** | **분석 동적 모델** | **75분** | 문제영역의 행위·상호작용·상태 변화를 어떻게 분석하고 질문에 맞는 동적 모델을 선택하는가? | Scenario/Event → Dynamic Model Landscape(Sequence·Communication·Activity·State Machine) → 질문에 따른 모델 선택 → **Place Order Sequence 중심 설명** → **Order State / Communication / Activity 완성 예제 제공** → Static/Dynamic Cross-check → Just-enough | **[실습] Place Order Analysis Sequence Diagram 작성 (20~25분, 본편 1장):** S02 Use Case와 S03 정적 모델을 입력으로 Analysis-level participant/message/조건을 표현한다. State/Communication/Activity는 실습 산출물이 아니라 수강생 이해용 제공 예제. 답안은 `[별첨]`. | **Brooks Essence/Accident, Booch OOA, Larman / *Applying UML and Patterns*** | **상세설계에서 재산정** |
| **S05** | **분석에서 객체 설계로 — 경험 기반 Initial Design** | **70분** | 전체 정적·동적 분석 모델을 보고, 아직 RDD/GRASP를 체계적으로 배우기 전에 자신의 설계 경험으로 객체 경계와 책임을 어떻게 1차 할당하는가? | S03 Static + S04 Dynamic 회수 → Analysis Model≠Design Model → **경험 기반 1차 Responsibility Assignment** → Initial Design Class Diagram → 이후 Encapsulation / Information Hiding / Change Reason 관점으로 자신의 선택을 되돌아봄 → S06 입력 고정 | **[실습] Analysis Model → Initial Design (25~30분, 본편 1장):** 전체 Static/Dynamic Model을 입력으로 수강생 경험에 따라 주요 Responsibility를 객체에 1차 배치하고 Initial Design Class Diagram 작성. 먼저 독립적으로 작성한 snapshot을 보존한 뒤 LLM에는 누락/모호한 책임만 검토시키며 RDD/GRASP 선행 주입은 금지. 답안은 `[별첨]`. | **Parnas Information Hiding, Alan Kay OOP** | **상세설계에서 재산정** |
| **S06** | **책임 설계 ① — RDD로 책임과 협력 보완** | **85분** | S05의 경험 기반 Initial Design을 RDD 관점에서 어떻게 설명·검증·재배치하고 객체 간 Message/Collaboration으로 정제하는가? | S05 Initial Design → RDD(Responsibility/Role/Collaboration, Knowing/Doing) → CRC 관점 → GRASP 기본 → 책임 재배치 → Message/Collaboration → Class↔Sequence feedback → Refined Design | **[실습] RDD Responsibility & Collaboration Refinement (25~30분, 본편 1장):** S05 Initial Design을 보완하여 **Refined Design Class Diagram + Design Sequence Diagram** 작성. 고려할 Pattern/원칙: **Information Expert · Creator · Controller · High Cohesion · Low Coupling**. 필요한 것만 선택하고 이유를 설명한다. Responsibility–Owner Table은 선택적 사고 도구이며 필수 산출물이 아니다. 답안은 `[별첨]`. | **Responsibility-Driven Design, CRC, GRASP / *Applying UML and Patterns*** | **상세설계에서 재산정** |
| **S07** | **책임 설계 ② — 계약과 변화 대응** | **70분** | S06의 RDD 기반 책임·협력을 계약과 variation/change 관점에서 어떻게 더 안정적인 설계로 정제하는가? | S06 Refined Design 회수 → Design by Contract → 객체 일관성·협력 보장 → **Order Cancellation/Refund change request 투입** → GRASP 고급 → variation/change 대응 → 재정제 | **[실습] Contract & Variation Refinement (15~30분, 본편 1장):** S06 설계에 Order Cancellation 변화 요구를 적용해 계약·책임·협력을 재검토한다. 고려할 Pattern/원칙: **Polymorphism · Indirection · Protected Variations · Pure Fabrication · Design by Contract · 필요 시 Interface/Composition**. 전부 적용하지 않고 필요한 것만 선택한다. 답안은 `[별첨]`. | **Meyer Design by Contract, GRASP / *Applying UML and Patterns*** | **상세설계에서 재산정** |
| **S08** | **객체 설계의 판단 기준** | **80분** | 여러 설계 대안 중 무엇이 더 나은지 어떤 근거로 판단하는가? | Change Impact → Cohesion/Coupling → Dependency → Abstraction Cost → SOLID → Interface/Composition → Pattern → Trade-off | **[실습] 설계 대안 비교 (20~30분):** 두 설계를 change impact·dependency·abstraction cost로 먼저 비교 → LLM으로 반론·대안 검증 → 필요한 원칙/Pattern만 선택 | DIP, Interface/Composition / SOLID Principles, *Design Patterns* | **14~17** |
| **S09** | **Order 통합 설계 Workshop** | **90분** | 요구·분석 모델·객체 설계를 하나의 일관된 설계 판단으로 통합할 수 있는가? | 요구 → 필요한 분석 모델 → 객체 경계 → 책임 → 협력 → 계약 → variation → 대안 비교 → Change Impact | **[실습] Order 통합 설계 Workshop (30분):** 모델 선택·책임표·협력 sketch·객체 계약·대안 비교·change-impact → LLM으로 누락·대안·trade-off 검증 | RDD, GRASP, Information Hiding, DbC, Interface/Composition | **8~11** |
| **S10** | **Test·Refactoring과 설계 Feedback** | **70분** | 변경 요청과 Test evidence로 객체 설계를 어떻게 검증하고 개선하는가? | 변경/Test Failure → 설계 문제 관찰 → 책임·계약 재검토 → 최소 책임 이동 → observable behavior 보존 → Refactoring → 재검증 | **[실습] Test·Refactoring Feedback (20~30분):** before/after 책임 구조와 최소 Refactoring 근거 작성 → LLM으로 대안·회귀 위험 검증 | Fowler Refactoring, DIP / SOLID Principles, *Design Patterns* | **12~15** |
| **S11** | **OOAD 종합과 Handoff** | **35분** | OOAD가 결정한 것과 다음 전문 영역으로 넘길 판단을 구분할 수 있는가? | 요구 → 분석 모델 → 객체 설계 → Code/Test → Feedback → OOAD 경계 → DDD/Architecture/MSA | **Closing Review:** Order 설계를 전체 판단 흐름으로 설명하고 남은 문제를 owner 과정으로 분류 | Evans OO Design→DDD / *Applying UML and Patterns* | **7~9** |
|  | **Total** | **800분** |  |  |  |  | **전체 상세설계 후 통합 재산정** |
