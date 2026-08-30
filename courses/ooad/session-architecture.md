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
- `Order Cancellation`과 `Refund`는 S02~S06의 **주 running example과 실습 대상에서는 제외**하고, 필요한 개념 설명의 짧은 예로만 사용할 수 있다. S07에서는 이를 기존 책임·계약·협력에 가해지는 teaching용 change request로 사용하되, Formal Practice input은 Payment variation으로 구분한다.
- S05는 RDD/GRASP를 체계적으로 적용하기 전 수강생 경험에 기반한 **Initial Design**을 만든다.
- S06·S07은 S05 Initial Design을 RDD 관점에서 단계적으로 보완한다.

# 7. Session Architecture

> **Recommended Slides는 Architecture 단계의 초기 추정값이다. 상세 설계의 제약이 아니며, 각 Session Detailed Design에서 실제 claim·설명 밀도·interaction·practice·feedback을 근거로 재산정하고 이 표를 갱신한다.**

Formal `[실습]`은 기본적으로 Session 후반의 `Teaching → Practice → Feedback → Summary → Transition` 흐름에 둔다. 실제 section 배치는 Session Detailed Design에서 확정한다.

| Session | Title | Time | Core Question / Outcome | Main Learning Flow | Practice | Main Anchors / References | Recommended Slides |
|---|---|---:|---|---|---|---|---:|
| **S01** | **OOAD 개요** | **60분** | 왜 분석·설계인가? 왜 객체지향인가? Analysis를 phase가 아닌 사고 활동으로 구분하고, Brooks Essence/Accident와 Static/Dynamic 관점을 포함해 OOAD가 해결하려는 문제와 전체 판단 흐름을 설명한다. | 문제 오해 → 재작업·변경 파급 → **Brooks Essence/Accident** → **Analysis ≠ Phase** → Problem/Solution 구분 → Static/Dynamic Problem Understanding 예고 → 복잡성·모듈화·정보 은닉 → 객체지향 → OOA/OOD → 과정 지도 | **도입 Mini Exercise:** Order 변경의 파급 위치 찾기 → **Discussion:** 어느 질문/판단에서 예방할 수 있었는가? | **Brooks Essence/Accident**, Alan Kay OOP, Booch OOA/OOD, Larman Design Principles over UML / *Applying UML and Patterns* | **20~24 (상세설계 반영)** |
| **S02** | **문제 발견과 요구 이해** | **90분** | 무엇을 만들어야 하는지 발견하고 Essential Problem과 Solution Detail을 구분하며, Event-centered requirement analysis와 Use Case를 통해 요구를 구조화할 수 있는가? | 문제·목표 → Essential Problem/Solution Detail → Discovery/Analysis/Validation → Interview/Observation/Workshop/Prototype → 용어집 → EventStorming → Event-centered requirement analysis → Use Case → Use Case Specification → SSD/System Event/System Operation/Operation Contract → User Story/Acceptance Criteria/BDD → 접근별 선택 | **[실습] Place Order Use Case 작성 (25~30분, 본편 1장):** Input은 “고객은 하나 이상의 물건을 고르고 Card 또는 Bank Transfer로 결제하여 주문한다.”와 Use Case Specification Template이다. 수강생이 Use Case Diagram, Specification, Main Success Flow와 필요한 Alternative/Exception Flow를 작성하며 상세 정상 Event Flow는 미리 제공하지 않는다. `LLM용 추천 프롬프트`는 누락·임의 가정·Solution Detail을 검토한다. 답안은 `[별첨]`; 후속 Session 진행이 어려운 수강생에게만 Diagram/Specification을 Recovery Baseline으로 제공할 수 있다. | **Brooks Essence/Accident, Yourdon Event–Response, Jacobson Use Case** / *Applying UML and Patterns* | **44** |
| **S03** | **분석 정적 모델** | **75분** | 문제영역의 essential structure를 정적 분석 모델로 표현하고 구현 결정과 분리된 Problem Understanding을 어떻게 명확히 하는가? | S01/S02 회수 → Static/Dynamic Problem Understanding → Brooks Essence/Accident → 정적 모델의 위치 → S02 용어집 정제 → Concept → Attribute / analysis-level type → Association/Relationship → Multiplicity / Whole-Part → Conceptual/Analysis Domain Model → 구현 Class와 구분 → Requirement 재질문 | **[실습] Order Conceptual Domain Model 작성 (25~30분, 본편 1장):** 자신의 S02 Use Case Diagram/Specification을 Input으로, Place Order→Payment 범위의 Concept, Attribute, Type/Value Domain, Association, Multiplicity와 필요한 Whole-Part를 포함한 Conceptual Domain Model 1개를 작성한다. S02 실습 미완료자에게만 S02 `[별첨]` 2장을 Recovery Baseline으로 제공할 수 있다. 답안은 `[별첨]`. | **Brooks Essence/Accident, Booch OOA, Rumbaugh Aggregation, DDD Domain** / *Applying UML and Patterns* | **상세설계에서 재산정** |
| **S04** | **분석 동적 모델** | **75분** | 문제영역의 행위·상호작용·상태 변화를 어떻게 분석하고 질문에 맞는 동적 모델을 선택하는가? | Scenario/Event → Dynamic Model Landscape(Sequence·Communication·Activity·State Machine) → 질문에 따른 모델 선택 → **Place Order Sequence 중심 설명** → **Order State / Communication / Activity 완성 예제 제공** → Static/Dynamic Cross-check → Just-enough | **[실습] Place Order Analysis Sequence Diagram 작성 (20~25분, 본편 1장):** S02 Use Case 산출물과 S03 Conceptual Domain Model을 Input으로 Analysis-level participant/message/조건을 표현한다. Output은 Place Order Analysis Sequence Diagram이며 Software Call Sequence나 design/implementation object를 선행 도입하지 않는다. State/Communication/Activity는 실습 산출물이 아닌 제공 예제다. 답안은 `[별첨]`. | **Brooks Essence/Accident, Booch OOA, Larman / *Applying UML and Patterns*** | **상세설계에서 재산정** |
| **S05** | **분석에서 객체 설계로 — 경험 기반 Initial Design** | **70분** | 전체 정적·동적 분석 모델을 보고, 아직 RDD/GRASP를 체계적으로 배우기 전에 자신의 설계 경험으로 객체 경계와 책임을 어떻게 1차 할당하는가? | S03 Static + S04 Dynamic 회수 → Analysis Model≠Design Model → **경험 기반 1차 Responsibility Assignment** → Initial Design Class Diagram → 이후 Encapsulation / Information Hiding / Change Reason 관점으로 자신의 선택을 되돌아봄 → S06 입력 고정 | **[실습] Analysis Model → Initial Design (25~30분, 본편 1장):** S02 Use Case, S03 Static Model과 S04 Dynamic Model을 Input으로 수강생 경험에 따라 주요 Responsibility를 객체에 1차 배치하고 Initial Design Class Diagram을 작성한다. Requirement → Static/Dynamic Problem Understanding → Initial Design 연결을 유지하고, 독립적으로 작성한 snapshot을 보존한 뒤 `LLM용 추천 프롬프트`로 누락/모호한 Responsibility만 검토하며 RDD/GRASP 선행 주입은 금지한다. 답안은 `[별첨]`. | **Parnas Information Hiding, Alan Kay OOP** | **상세설계에서 재산정** |
| **S06** | **책임 설계 ① — RDD로 책임과 협력 보완** | **85분** | S05의 경험 기반 Initial Design을 핵심 Message의 Object Contract와 RDD 관점에서 어떻게 설명·검증·재배치하고 Collaboration으로 정제하는가? | S05 Initial Design → Responsibility/Message → **Object Contract(precondition/postcondition/invariant)** → Role/Collaboration → RDD(Knowing/Doing) → CRC 관점 → **GRASP 기본과 중첩 가능한 Responsibility Assignment 관점** → 책임 재배치 → Class↔Sequence feedback → Refined Design | **[실습] RDD Responsibility & Collaboration Refinement (25~30분, 본편 1장):** S02 Use Case와 S03 Conceptual Domain Model을 판단 evidence로 유지하면서 S05 Initial Design Class Diagram을 수정하고 S04 Sequence의 핵심 구간 하나를 Design Sequence로 발전시키는 **Existing Model Refinement**다. 필수 산출물과 핵심 Message 하나의 Object Contract는 유지한다. **검토 GRASP 관점:** Information Expert · Creator · Controller · High Cohesion · Low Coupling. 이들을 상호배타적인 선택지나 checklist로 적용하지 않고 하나의 Responsibility Assignment를 여러 관점에서 검토하며, 현재 판단에 의미 있는 관점과 그 근거를 설명한다. Responsibility–Owner Table은 선택적 사고 도구이며 답안은 `[별첨]`. | **Meyer Design by Contract, Responsibility-Driven Design, CRC, GRASP / *Applying UML and Patterns*** | **상세설계에서 재산정** |
| **S07** | **책임 설계 ② — 계약과 변화 대응** | **70분** | 새로운 change request가 S06에서 세운 기존 Object Contract와 책임·협력에 주는 압력을 어떻게 확인하고, variation-oriented GRASP 관점과 필요한 설계 mechanism으로 local refinement한 뒤 대표 GoF Pattern과 연결하는가? | S06 Refined Design/기존 Object Contract 회수 → **Order Cancellation/Refund teaching change 투입** → Existing Contract/Collaboration Stress → Variation Point / Stable Boundary → **GRASP 후반 관점(Polymorphism · Pure Fabrication · Indirection · Protected Variations)의 중첩 관계** → Object Composition 등 필요한 구조 → **Payment variation Practice** → Local Refinement → **GoF Design Pattern Bridge(cheat sheet + 대표 3~4개)** → S08 전환 | **[실습] Payment Variation Local Refinement (15~30분, 본편 1장):** **A—Payment Method Variation:** CardPayment/BankTransferPayment에 PointPayment를 추가하고, 부분 Point+Card 결제처럼 여러 PaymentMethod collaborator가 behavior를 구성하는 Object Composition까지 검토한다. **B—Payment Provider Variation:** CardPayment의 Provider A 직접 의존에 Provider B와 API 차이를 추가하고 PaymentGateway role과 provider-specific implementation으로 local refinement한다. **검토 GRASP 관점:** Polymorphism · Pure Fabrication · Indirection · Protected Variations. 상호배타적으로 고르지 않고 하나의 local refinement를 여러 관점에서 설명하며, Object Composition은 별도의 객체 설계 관점으로 사용한다. Pattern 이름은 실습 해결을 선행하지 않으며 답안은 `[별첨]`. | **Meyer Design by Contract, GRASP / *Applying UML and Patterns*, GoF / *Design Patterns*** | **상세설계에서 재산정** |
| **S08** | **객체 설계의 판단 기준** | **80분** | 여러 Design Alternative를 평가하고, 실제 change evidence와 비용·효과를 근거로 하나를 선택할 수 있는가? | Change Impact → Cohesion/Coupling → Dependency → Abstraction Cost → SOLID/Pattern → Trade-off → **Design Decision**. SOLID와 Pattern은 checklist나 적용 목표가 아니라 대안 평가 언어로 사용하고, abstraction·interface·Pattern 추가 비용과 얻는 효과를 함께 판단한다. 필요한 주요 원칙은 Detailed Design에서 Before/After와 짧은 sample code로 설명한다. | **[실습] S07 설계를 활용한 두 설계 대안 비교 (20~30분, 본편 1장):** change impact·cohesion/coupling·dependency·abstraction cost와 필요한 SOLID/Pattern 관점으로 두 대안을 비교하고 LLM으로 반론을 검토한다. **산출물:** 선택한 설계 + 짧은 판단 근거. | DIP, Interface/Composition / SOLID Principles, *Design Patterns* | **18** |
| **S09** | **Order 통합 설계 Workshop** | **90분** | 요구·분석 모델·객체 설계를 하나의 일관된 설계 판단으로 통합할 수 있는가? | 요구 → 현재 판단에 필요한 분석 evidence 선택 → 객체 경계 → 책임 → 협력 → 계약 → variation → 대안 비교 → 불일치 부분의 최소 refinement → Change Impact | **[실습] Order 통합 설계 Workshop (30분):** 모델 선택·책임표·협력 sketch·객체 계약·대안 비교·change-impact → LLM으로 누락·대안·trade-off 검증. 모든 이전 모델을 다시 만들지 않고 현재 integrated design 판단에 필요한 evidence만 사용한다. | RDD, GRASP, Information Hiding, DbC, Interface/Composition | **8~11** |
| **S10** | **Test·Refactoring과 설계 Feedback** | **70분** | 변경 요청과 Test evidence로 객체 설계를 어떻게 검증하고 개선하는가? | 변경/Test Failure → 설계 문제 관찰 → 책임·계약 재검토 → 최소 책임 이동 → observable behavior 보존 → Refactoring → 재검증. Code/Test feedback이 요구하면 앞선 responsibility·contract·design 판단으로 돌아가 반복적으로 정제한다. | **[실습] Test·Refactoring Feedback (20~30분):** before/after 책임 구조와 최소 Refactoring 근거 작성 → LLM으로 대안·회귀 위험 검증 | Fowler Refactoring, DIP / SOLID Principles, *Design Patterns* | **12~15** |
| **S11** | **OOAD 종합과 Handoff** | **35분** | OOAD가 결정한 것과 다음 전문 영역으로 넘길 판단을 구분할 수 있는가? | `Intent → Requirement → Analysis → Architecture → Design → Technical Design → Code`에서 OOAD의 판단을 회수하되 이를 rigid lifecycle로 해석하지 않는다. 요구 → 분석 모델 → 객체 설계 → Code/Test → Feedback → OOAD 경계 → DDD/Architecture/MSA/AI-Native | **Closing Review:** Order 설계를 전체 판단 흐름으로 설명하고 남은 문제를 owner 과정으로 분류. AI는 analysis/design judgment를 제거하기보다 abstraction 사이의 반복적 translation·generation·verification 비용을 낮출 수 있다는 수준으로만 AI-Native에 forward한다. | Evans OO Design→DDD / *Applying UML and Patterns* | **7~9** |
|  | **Total** | **800분** |  |  |  |  | **전체 상세설계 후 통합 재산정** |

## 7.1 S07 / S08 / S09 Ownership Boundary

- **S07 — Local refinement + Pattern handoff:** 실제 change가 기존 Object Contract와 책임·협력에 주는 압력을 확인하고, Formal Practice의 서로 연관된 두 Payment variation scenario에서 Polymorphism·Pure Fabrication·Indirection·Protected Variations를 **중첩 가능한 Responsibility Assignment 관점**으로 사용해 local refinement한다. Object Composition은 collaborator를 통한 behavior 구성 관점으로 필요한 경우 사용한다. 학습자는 먼저 Pattern 이름 없이 문제와 해결 구조를 설계하고 실습을 마친 뒤, GoF cheat sheet와 대표 3~4개 Pattern을 통해 반복되는 problem–solution structure와 vocabulary를 연결한다. GoF Pattern의 상세 적용·비교·조합이나 catalog 학습으로 확장하지 않으며 Object Contract/DbC도 여기서 새로 가르치지 않는다.
- **S08 — Alternative evaluation and design decision:** S07에서 만든 local refinement를 입력으로 여러 Design Alternative를 Change Impact, Cohesion/Coupling, Dependency, Abstraction Cost, SOLID/Pattern과 Trade-off 관점에서 비교하고 하나의 Design Decision을 내린다. SOLID·Pattern 적용 자체나 abstraction 수의 증가를 목표로 하지 않는다.
- **S09 — Integrated design workshop:** 요구·정적/동적 분석·책임·협력·계약·variation과 대안 평가를 하나의 일관된 설계 판단으로 통합한다. 모든 이전 모델을 다시 만드는 대신 현재 판단에 필요한 evidence를 선택하고 불일치가 있는 부분만 최소 refinement한다. S08의 alternative evaluation을 새로운 local refinement로 되돌리거나 S09 workshop을 선행하지 않는다.
