# OOAD Verified Sources & References

> **Course ID:** ooad
> **소유 문서:** `guides/과정_설계_지침.md` §2-c에 따라 이 문서가 source/evidence 원문·claim/quote/locator·evidence metadata·legacy reference asset을 소유한다.
> **스키마 정본:** `portfolio/evidence-policy.md` (Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification).
> **원형 보존 원칙:** 이 문서는 원출처(`context/course-portfolio-unified-v2.6/support/03_source-evidence/01_ooad-source-evidence-v2.0.md`, `.../support/02_course-assets/01_ooad/02_course-design-reference-v2.1.md`)를 요약본으로 다시 쓰지 않는다. evidence-policy 스키마에 맞춰 재배열하되 내용은 원형 그대로 보존한다.
> **Copyright:** 각 원출처에서 짧은 문장만 사용하며 긴 본문을 복제하지 않는다.
> **Display:** Korean translation 14pt Bold 권장 / English 8–9pt / Author + Source 8pt.
> **Important:** paraphrase는 따옴표를 사용하지 않는다.

---

# Part A — Verified Principles & Quote Sources (from `01_ooad-source-evidence-v2.0.md`)

## A.0 Verification Status — 정의

- **Verified:** 원저자/공식 출판/직접 확인 가능한 본문 수준에서 claim 또는 quote를 검증했다.
- **Traceable:** 신뢰 가능한 출판 excerpt와 locator가 있으나 최종 출판본 교차 확인이 유익하다.
- **Hold:** attribution 또는 locator가 불충분하다. 강의 quote/claim 근거로 사용하지 않는다.

## A.1 Portfolio Evidence Classification (family 단위)

`portfolio/evidence-policy.md` 스키마 기준. Verification Status는 A.2의 각 Q-항목에서 개별 판정한다.

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Alan Kay / messaging lineage | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Wirfs-Brock / RDD | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Meyer / DbC, CQS | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Larman / GRASP | Established Practice-Pattern | Original/Authoritative Secondary | Strong | Broad | Core | Not classified |
| Parnas / Information Hiding | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| GoF / design principles & patterns | Established Practice-Pattern | Original-Foundational Authors | Strong | Broad | Core | Not classified |
| Fowler / Refactoring | Established Practice-Pattern | Original-Foundational Author | Strong | Broad | Supporting | Not classified |
| Evans / DDD boundary clarification | Foundational/Core | Original-Foundational Author | Moderate | Conditional | Supporting | Not classified |

## A.2 Verified / Traceable Quote Items

각 항목은 A.1의 family classification을 상속하며(Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification), 항목별 Verification Status를 개별 명시한다.

---

### Q01 — Alan Kay / Messaging

**Verification Status:** Verified
**Evidence Role:** Foundational/Core · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Object = Message + Local State Protection + Late Binding
**Recommended (legacy session anchor — 비정본, §B 참고):** S01, S06, S11

**KO**
> 객체지향의 핵심은 메시징, 상태·프로세스의 지역적 보존과 보호, 그리고 극단적인 지연 바인딩에 있다.

**EN**
> "OOP to me means only messaging ... and extreme late-binding of all things."

**Author:** Alan Kay
**Source:** Email to Stefan Ram, 23 July 2003, "Clarification of object-oriented"
**Locator:** email body
**Source URL:** https://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_de

**Usage note:** `inheritance/polymorphism/encapsulation = OOP definition`으로 단순화하는 데 대한 counter-anchor로 사용.
번역은 educational paraphrase이며 영문 축자문과 구분한다.

---

### Q02 — Rebecca Wirfs-Brock / Responsibility-Driven Design

**Verification Status:** Verified
**Evidence Role:** Foundational/Core · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Responsibility before implementation
**Recommended (legacy session anchor — 비정본, §B 참고):** S11, S12

**KO**
> 구현을 너무 일찍 바라보는 데이터 중심 설계 대신 책임 중심 설계로 캡슐화를 강화한다.

**EN**
> "We propose an alternative object-oriented design method which takes a responsibility-driven approach."

**Authors:** Rebecca Wirfs-Brock, Brian Wilkerson
**Source:** "Object-Oriented Design: A Responsibility-Driven Approach," OOPSLA 1989
**Locator:** Abstract
**Source URL:** https://wirfs-brock.com/rebecca/papers/

**Usage note:** RDD를 단순 class-finding technique이 아니라 encapsulation을 높이는 design approach로 정박.

---

### Q03 — Bertrand Meyer / Design by Contract

**Verification Status:** Verified
**Evidence Role:** Foundational/Core · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Responsibilities need explicit expectations and guarantees
**Recommended (legacy session anchor — 비정본, §B 참고):** S11, S12

**KO**
> 협력은 각 당사자의 기대와 보장을 명확히 기술한 계약에 기반해야 한다.

**EN**
> "their cooperation should be based on precise specifications — contracts — describing each party's expectations and guarantees."

**Author:** Bertrand Meyer / Eiffel method
**Source:** Eiffel Documentation, "Design by Contract™, Assertions and Exceptions"
**Locator:** Design by Contract basics
**Source URL:** https://www.eiffel.org/doc/eiffel/ET-_Design_by_Contract_%28tm%29%2C_Assertions_and_Exceptions

**Usage note:** Precondition / Postcondition / Class Invariant 설명 직전의 anchor.

---

### Q04 — Craig Larman / Information Expert

**Verification Status:** Traceable
**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Original/Authoritative Secondary · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Assign responsibility to the information expert
**Recommended (legacy session anchor — 비정본, §B 참고):** S11, S12

**KO**
> 책임 수행에 필요한 정보를 가진 객체를 우선 책임 후보로 둔다.

**EN**
> "Assign a responsibility to the information expert—the class that has the information necessary to fulfill the responsibility."

**Author:** Craig Larman
**Source:** *Applying UML and Patterns*, 2nd ed., §16.6 "Information Expert (or Expert)"
**Locator:** Chapter 16, §16.6
**Source URL:** https://www.oreilly.com/library/view/applying-uml-and/0130925691/0130925691_ch16lev1sec7.html

**Usage note:** Expert는 단독 법칙이 아니다. Low Coupling / High Cohesion / variation과 함께 판단.

---

### Q05 — David Parnas / Information Hiding

**Verification Status:** Traceable
**Evidence Role:** Foundational/Core · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Hide likely-to-change design decisions
**Recommended (legacy session anchor — 비정본, §B 참고):** S08

**KO**
> 모듈은 변경될 가능성이 있거나 어려운 설계 결정을 다른 부분으로부터 감추도록 나눈다.

**EN**
> "Each module is then designed to hide such a decision from the others."

**Author:** D. L. Parnas
**Source:** "On the Criteria To Be Used in Decomposing Systems into Modules," CACM 15(12), 1972
**Locator:** concluding design criterion; pp. 1053–1058
**DOI:** 10.1145/361598.361623
**Source record:** https://doi.org/10.1145/361598.361623

**Usage note:** `module = function/procedure grouping`이 아니라 change-sensitive decision hiding으로 연결.

---

### Q06 — Gang of Four / Interface

**Verification Status:** Traceable
**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Original-Foundational Authors · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Program to an interface
**Recommended (legacy session anchor — 비정본, §B 참고):** S08 or S11

**KO**
> 구체 구현이 아니라 필요한 인터페이스에 의존하라.

**EN**
> "Program to an interface, not an implementation."

**Authors:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
**Source:** *Design Patterns: Elements of Reusable Object-Oriented Software*
**Locator:** Introduction, p. 18 (1995 printing)
**Verification note:** page locator independently corroborated by multiple book references; use owned copy for final publishing proof if available.

**Usage note:** Java `interface` keyword로 축소하지 않는다. 계약/abstraction에 의존한다는 설계 원칙으로 설명.

---

### Q07 — Gang of Four / Composition

**Verification Status:** Traceable
**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Original-Foundational Authors · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Core · **BP Classification:** Not classified
**Principle:** Favor composition over inheritance
**Recommended (legacy session anchor — 비정본, §B 참고):** S08 or S11

**KO**
> 클래스 상속보다 객체 합성을 우선 검토하라.

**EN**
> "Favor object composition over class inheritance."

**Authors:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
**Source:** *Design Patterns: Elements of Reusable Object-Oriented Software*
**Locator:** Introduction, p. 20
**Verification source:** Erich Gamma interview and book reproductions confirm wording.

**Usage note:** `inheritance 금지`로 가르치지 않는다. 변경 가능 협력과 결합 비용의 trade-off로 설명.

---

### Q08 — Martin Fowler / Refactoring

**Verification Status:** Verified
**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Strong · **Transferability:** Broad · **Curriculum Use:** Supporting · **BP Classification:** Not classified
**Principle:** Improve internal structure without observable behavior change
**Recommended (legacy session anchor — 비정본, §B 참고):** S13

**KO**
> 외부에서 관찰되는 동작을 바꾸지 않고 내부 구조를 더 이해하기 쉽고 변경하기 쉽게 만든다.

**EN**
> "a change made to the internal structure of software ... without changing its observable behavior."

**Author:** Martin Fowler
**Source:** "Definition Of Refactoring," martinfowler.com, 1 Sep 2004
**Locator:** noun definition
**Source URL:** https://martinfowler.com/bliki/DefinitionOfRefactoring.html

**Usage note:** Refactoring = cleanup 일반이 아니라 behavior-preserving structural change라는 경계에 사용.

---

### Q09 — Eric Evans / DDD is not replacement OO design

**Verification Status:** Traceable
**Evidence Role:** Foundational/Core · **Source Provenance:** Original-Foundational Author · **Evidence Strength:** Moderate · **Transferability:** Conditional · **Curriculum Use:** Supporting · **BP Classification:** Not classified
**Principle:** DDD builds on established OO design
**Recommended (legacy session anchor — 비정본, §B 참고):** S14 forward / DDD opening

**KO**
> DDD는 객체지향 설계 입문이나 새로운 설계 기초의 제안이 아니라 기존 OO 설계 위에서 초점을 이동한다.

**EN**
> "This book is not an introduction to object-oriented design. Nor does it propose radical design fundamentals."

**Author:** Eric Evans
**Source:** *Domain-Driven Design*, final manuscript, 15 Apr 2003
**Locator:** Part II opening, manuscript p. 49
**Reference evidence:** manuscript text also states reliance on Responsibility-Driven Design, Design by Contract, and Larman's OO design practices.

**Usage note:** OOAD → DDD lineage를 설명할 때 사용. DDD를 OOAD 대체물처럼 표현하지 않는다.

---

## A.3 HOLD / Do Not Use Yet

### H01 — Grady Booch exact definition

Booch의 OOA/OOD 정의와 static/dynamic model 문구는 다수의 2차 출처에서 page locator까지
일치하지만, 현재 검증 세션에서는 원저작의 공식/소유 원문을 직접 확인하지 못했다.

**Action:** 소유한 *Object-Oriented Analysis and Design with Applications*에서 문구/page를 확인한 뒤 APPROVED로 승격.
그 전까지는 Booch의 이름을 `lineage / educational paraphrase`에 사용할 수 있으나 축자 인용 slide에는 사용하지 않는다.

**Verification Status:** Hold · **Curriculum Use:** Hold

### H02 — Tell, Don't Ask attribution

특정 한 명의 축자 quote로 고정하지 않는다.
OO design heuristic으로 사용한다.

**Verification Status:** Hold (attribution) · **Curriculum Use:** Example/Heuristic만 허용

### H03 — Law of Demeter = "one dot per line"

사용 금지.
Law of Demeter의 정의가 아니라 후대의 heuristic과 혼동될 수 있다.

**Verification Status:** Hold · **Curriculum Use:** Hold

---

## A.4 Principle-to-Session Map (legacy — 비정본)

> **Non-normative notice:** 아래 세션 번호(S01–S14)는 원 소스팩 작성 시점의 legacy anchor다. `guides/과정_설계_지침.md` §2-c 및 §2-a에 따라 세션 번호·시간표·정확한 커리큘럼 구조는 `courses/ooad/ooad-curriculum.md`가 소유하는 정본이며, 이 문서는 그것을 대체하지 않는다. 아래 매핑은 quote/principle이 원래 어떤 학습 지점을 겨냥해 만들어졌는지 보여주는 legacy 참고 자료로만 보존한다.

| Session (legacy) | Primary Anchor |
|---|---|
| S01 | Alan Kay — Messaging / local state / late binding |
| S04 | Booch lineage — model/static/dynamic, quote HOLD until primary verification |
| S08 | Parnas — Information Hiding; GoF — Composition / Interface |
| S10 | DIP — principle, verbatim quote asset은 별도 primary verification 후 추가 |
| S11 | Wirfs-Brock — RDD; Larman — Information Expert; Meyer — DbC |
| S12 | Larman + Meyer applied in Order responsibility/contract workshop |
| S13 | Fowler — Refactoring |
| S14 | Evans — DDD builds on OO design |

## A.5 Production Rules (원문 그대로 보존)

1. 세션당 quote 수를 강제하지 않는다.
2. 같은 quote를 여러 세션에서 장식적으로 반복하지 않는다.
3. `Problem → Principle → Decision → Example → Trade-off → Failure`의 판단 지점에서만 사용한다.
4. 한글은 교육용 번역이며, 축자 원문은 영어 필드가 소유한다.
5. 번역을 따옴표로 표시할 경우 반드시 원문과 함께 제공한다.
6. `Traceable` 항목도 출판 직전 owned primary copy가 있으면 최종 교차 확인한다.
7. 출처·locator가 renderer에 표시되지 않아도 source asset에는 반드시 보존한다.

## A.6 Source Pack — Portfolio Alignment Footer (원문 보존)

이 절은 원 소스팩(`01_ooad-source-evidence-v2.0.md`) 하단의 alignment 정보를 원형 그대로 보존한다. Portfolio-wide 시간·과정 목록의 정본은 `portfolio/`가 소유하며, 아래는 소스팩 작성 시점의 스냅샷이다.

> **Unified Portfolio Alignment v2.6**
> - 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
> - 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
> - 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
> - 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.
>
> **Unified Baseline v2.6 Usage**
> Quote는 Session 장식이 아니라 `Principle → Decision → Trade-off`의 근거로만 사용한다. OOAD 16h/14-topic 가변 시간 구조와 동일하게 유지한다.

---

# Part B — OOAD Course Design Reference v2.1 (preserved reference, from `02_course-design-reference-v2.1.md`)

> **Non-normative notice:** 이 Part B는 `context/course-portfolio-unified-v2.6/support/02_course-assets/01_ooad/02_course-design-reference-v2.1.md`의 원문을 삭제 없이 보존한 것이다. 원문 상단이 명시하는 authority 순서(Program Governance / agreed discussion > 기존 OOAD curriculum) 및 "Status: Supporting design reference — subordinate to `courses/01_ooad.md`"는 이 통합 포트폴리오 체제에서 다음으로 대체되어 읽는다: **정본 순서는 `portfolio/*.md`(Portfolio Canon) > `courses/ooad/design/course-context.md` > 이 Part B(legacy supporting reference)**. 특히 §21의 KEEP/REFINE/REMOVE 계획, §24의 14-Session Backbone, §25–27은 `courses/ooad/ooad-curriculum.md`(정본 커리큘럼)와 `courses/ooad/design/course-context.md`(Course Design)가 이미 구체화·흡수한 내용을 담고 있다 — 세션 번호·시간 배분의 최종 권위는 그 두 문서에 있으며, 아래는 그 결정이 나온 legacy 설계 근거로만 보존한다.

## 1. Identity

- **Course ID:** ooad
- **Course Name:** 객체지향 분석과 설계 실무 (OOA/D)
- **Duration:** 16h / 800분
- **Session Policy:** 14 topic sessions, variable duration; equal 50-minute allocation is not required.
- **Portfolio Category:** Engineering Foundations
- **Course Thesis:**

> 현실의 문제를 모델·책임·계약·협력으로 구조화하고,
> 이를 구현 가능한 설계로 발전시키며 코드와 피드백을 통해 지속 개선한다.

## 2. Problem It Owns

OOAD가 소유하는 핵심 문제는 다음이다.

- 현실 문제를 어떤 개념과 책임으로 나눌 것인가?
- 어떤 객체가 무엇을 알고 무엇을 수행해야 하는가?
- 객체는 어떤 메시지와 계약으로 협력해야 하는가?
- 분석 모델과 설계 모델을 어떻게 구분하고 연결할 것인가?
- 정보와 책임을 어디에 배치해야 cohesion이 높고 coupling이 낮아지는가?
- change를 국소화하려면 무엇을 숨기고 어떤 interface를 노출해야 하는가?
- 객체 설계가 procedural data bag으로 퇴행하지 않게 어떻게 피드백할 것인가?

## 3. Core Flow

```text
Problem
→ Requirement / Use Case
→ Analysis Model
→ Object / Responsibility
→ Contract
→ Collaboration
→ Design Model
→ Code
→ Feedback / Refactoring
```

이 흐름이 Course Backbone이다.

UML 표기법의 순서가 backbone이 아니다.

## 4. Ownership Integrity

### OWNER
- Model / Modeling fundamentals
- Concept
- Analysis Model
- Design Model
- Object / Class / Message / State / Behavior
- Encapsulation
- Responsibility / Collaboration
- Responsibility-Driven Design
- GRASP / Information Expert
- Cohesion / Coupling
- Information Hiding
- SOLID
- Dependency Inversion at OO level
- Design Pattern fundamentals
- Tell, Don't Ask
- Law of Demeter
- Command–Query Separation
- Program to an Interface
- Favor Composition over Inheritance
- Design by Contract
- Precondition / Postcondition / Object Invariant
- TDD / Refactoring as design feedback

### APPLY / RECAP
- Requirement / Use Case
- BDD/example-based requirement clarification
- static/dynamic modeling notation

### FORWARD
- Domain Model / Entity / VO / Aggregate / Domain Service / Repository / Domain Event → DDD
- Architecture Driver / Quality Attribute / Dependency Rule / Port / Adapter → SW Architecture
- service/distribution → MSA
- responsibility / contract → AI-Native delegation/stage contract

## 5. Explicit Non-Scope

OOAD는 다음을 정본 교육하지 않는다.

- Ubiquitous Language OWNER
- Domain Model OWNER
- Entity / Value Object / Aggregate
- Domain Service / Repository의 DDD 의미
- Bounded Context / Context Mapping
- Architecture Driver / Quality Attribute Scenario
- Clean Architecture 상세
- Port / Adapter / Application Service 상세
- Microservice / Saga / distributed consistency
- AI Context / Guardrail / Harness

이 개념들은 필요성을 예고하거나 최소 forward reference만 한다.

## 6. Object-Oriented Lineage

과정의 역사적·개념적 계보는 다음을 기준으로 한다.

```text
Simula
Class / Object / Inheritance roots
        ↓
Alan Kay
Message / Local State / Late Binding
        ↓
Booch / Rumbaugh / Jacobson
OO Analysis & Design / static & dynamic modeling / Use Case
        ↓
Wirfs-Brock
Responsibility-Driven Design
        ↓
Larman
GRASP / Responsibility Assignment
        ↓
Meyer
Design by Contract / CQS
        ↓
GoF / Parnas / Martin
Patterns / Information Hiding / DIP
        ↓
Code + Test + Refactoring Feedback
```

이 계보는 인물 중심 역사가 아니라 설계 사고의 진화를 설명하기 위한 anchor다.

## 7. OOAD ≠ UML

UML은 notation이다.

OOAD는 다음 질문을 해결하는 사고 과정이다.

- 무엇을 모델링할 것인가?
- 누가 책임질 것인가?
- 어떤 메시지로 협력할 것인가?
- 어떤 계약을 보장할 것인가?
- 어떤 변경을 숨길 것인가?

따라서 diagram completeness보다 decision usefulness를 우선한다.

## 8. Analysis vs Design

### Analysis Model

목적:
- 문제와 domain concept를 이해
- implementation choice를 가능한 한 늦춤

포함 가능:
- actor / goal / use case
- concept / association
- state / scenario
- system interaction

### Design Model

목적:
- 책임·협력·interface·dependency를 구현 가능한 구조로 구체화

포함:
- software object
- responsibility
- message
- collaboration
- interface
- design pattern
- dependency

### Non-negotiable

```text
Concept ≠ Class
Analysis Model ≠ Design Model
Analysis Model ≠ Code Skeleton
```

Analysis concept를 그대로 class로 1:1 변환하는 방식으로 가르치지 않는다.

## 9. Use Case / Requirement Role

Use Case는 OOAD의 출발 입력 중 하나다.

핵심:
- actor goal
- black-box behavior
- success / extension
- scenario
- system boundary

User Story와 구분한다.

### Important
Use Case를 Application Layer 자체와 동일시하지 않는다.
Use Case는 requirement/interaction view이고 Application Service는 SW Architecture에서 정박한다.

## 10. Static Modeling

목적:
> 현실 의미와 관계를 이해하는 데 필요한 구조를 선택적으로 표현한다.

다룰 것:
- Concept
- Association
- Multiplicity
- Attribute vs Concept
- Generalization when useful

### Avoid
- class box 완성도 경쟁
- 모든 개념을 class로 변환
- 모든 관계를 diagram에 넣기
- implementation detail 조기 도입

## 11. Dynamic Modeling

핵심 질문:
> 책임 주체들이 시간에 따라 어떻게 협력하는가?

가능한 notation:
- System Sequence Diagram
- Sequence Diagram
- State Machine
- Activity Diagram
- Communication Diagram

### Just Enough Rule
모든 scenario에 모든 notation을 만들지 않는다.

- interaction ordering이 핵심 → sequence
- object lifetime/state transition이 핵심 → state machine
- workflow/branch가 핵심 → activity
- high-level black-box interaction → SSD

notation production이 목적이 아니다.

## 12. Responsibility-Driven Design

Class를 먼저 찾지 않는다.

```text
Behavior / Goal
→ Responsibility
→ Candidate Owner
→ Collaboration
→ Contract
→ Object Design
```

Knowing / Doing responsibility를 사용할 수 있다.

질문:
- 누가 이 정보를 가장 잘 알고 있는가?
- 누가 이 변경의 영향을 가장 잘 국소화할 수 있는가?
- 누가 이 behavior를 수행할 때 coupling이 최소인가?

## 13. GRASP

필수:
- Information Expert
- Creator
- Controller
- Low Coupling
- High Cohesion

필요 시:
- Polymorphism
- Pure Fabrication
- Indirection
- Protected Variations

### Teaching rule
GRASP pattern 이름 암기보다 responsibility allocation trade-off를 우선한다.

## 14. Design by Contract

OOAD에서 정식 OWNER로 다룬다.

```text
Responsibility
→ Precondition
→ Postcondition
→ Object Invariant
→ Collaboration
→ Verification
```

### Decision Question
> 이 책임을 맡은 객체는 호출자에게 무엇을 요구하고,
> 수행 후 무엇을 보장하며,
> 외부에 안정된 상태로 노출될 때 무엇이 항상 참이어야 하는가?

### Example — Order.cancel()

예:
- Precondition: 취소 가능한 상태
- Postcondition: 상태가 Cancelled
- Object Invariant: 이미 완료된 주문과 취소 상태의 모순 방지

정확한 Order domain rule은 shared Order definition을 따른다.

### Important
- DbC를 Eiffel syntax 교육으로 만들지 않는다.
- Domain Invariant와 Object Invariant를 구분한다.
- Contract는 test와 동일하지 않다.
- test는 contract/specification 충족의 evidence가 될 수 있다.

## 15. Message / Collaboration

Alan Kay 계보를 살린다.

객체를:
> data + methods 묶음

으로만 설명하지 않는다.

핵심:
- local state
- behavior
- message
- responsibility
- collaboration

Tell, Don't Ask는 이 흐름에서 소개한다.

## 16. Information Hiding

Parnas의 핵심 질문을 사용한다.

> 무엇을 module/object 안에 숨겨야 change impact가 국소화되는가?

Encapsulation을:
- private keyword
- getter/setter
로 축소하지 않는다.

## 17. Cohesion / Coupling

공식 숫자 최적화가 아니라 변경 관점에서 판단한다.

- 함께 변하는 책임은 모은다.
- 독립적으로 변하는 책임은 분리한다.
- coupling 0은 목표가 아니다.
- 필요한 collaboration은 존재한다.

이 원리는 이후:
- Module
- Component
- Service
- Agent boundary
로 확장된다.

## 18. SOLID

SOLID는 catalog가 아니라 responsibility/dependency 개선 원칙으로 다룬다.

### SRP
`한 클래스에는 하나의 역할`처럼 단순화하지 않는다.
변경 책임/이유 관점으로 설명한다.

### OCP
변화 지점을 예측해 모든 곳을 abstraction으로 만들지 않는다.

### LSP
substitutability 관점.

### ISP
consumer가 필요하지 않은 dependency 강제 방지.

### DIP
stable policy가 detail에 끌려가지 않도록 dependency direction을 제어.

**DI framework ≠ DIP**

## 19. Design Patterns

목적:
> 반복되는 collaboration/design problem을 해결하기 위한 검증된 design vocabulary.

필수 후보:
- Strategy
- Factory
- Adapter
- Observer 등

### Repository
DDD Repository 의미와 혼동되므로 OOAD pattern catalog에서 핵심 예제로 사용하지 않는다.

### Rule
pattern 이름보다:
- Problem
- Forces
- Collaboration
- Trade-off
를 먼저 설명한다.

## 20. TDD / Refactoring

OOAD에서는 Test Engineering을 소유하지 않는다.

다룰 것은:
> code/test feedback이 design quality에 압력을 주는 방식.

### TDD
categorical하게:
> TDD는 테스트 기술이 아니라 설계 기술이다

라고 단정하지 않는다.

대신:
> TDD는 verification technique이면서 design feedback pressure로 작동할 수 있다.

### Refactoring
observable behavior를 유지하면서 internal structure를 개선.

### Contract Link

```text
Contract / Specification
→ Test Evidence
→ Design Feedback
→ Refactoring
```

## 21. Existing OOAD Curriculum — Keep / Refine / Remove

> **Legacy status:** 아래 계획은 원문 작성 시점의 이관 계획이다. 실제 반영 여부와 최종 형태는 `courses/ooad/ooad-curriculum.md`(정본)와 `courses/ooad/design/course-context.md`를 따른다.

기존 자료의 강점은 보존한다.

### KEEP
- 2일 / 14-session backbone
- Use Case
- BDD/example clarification
- static/dynamic modeling
- responsibility workshop
- modularity
- SOLID
- RDD/GRASP
- TDD/refactoring
- Order domain
- workshop 중심
- forward linkage

### REFINE
- S01: `Object = data + behavior` → Message/Responsibility 포함
- S04: Conceptual Model → code skeleton 인상 제거
- S05: concept model과 design class model 단계 분리
- S06/S07: notation completeness → modeling decision 중심
- S09: Architecture 상세 → why/forward 수준
- S10: SOLID catalog → responsibility/dependency 관점
- S11: DbC / Message / Tell Don't Ask / CQS 강화
- S12: Order responsibility + contract workshop
- S13: Contract → Test Evidence → Refactoring
- S14: DDD/MSA 상세 → OO model limits / forward view

### REMOVE / MOVE
- Ubiquitous Language OOAD OWNER
- Repository DDD 의미
- DDD tactical teaching
- Bounded Context detail
- MSA service/deployment mechanics
- Application Layer / Port / Adapter detailed teaching

## 22. LLM-Integrated Practice Integration

> **Non-normative notice:** 상세 Practice specification의 정본은 이제 `courses/ooad/design/practice-design.md`다. 아래는 이 reference asset이 만들어질 당시의 legacy 설계 근거로 보존한다.

Portfolio 공통 `portfolio/practice-standard.md`를 적용한다.

- 16h 과정 기준 **7개 Practice**
- Day 1 3개 / Day 2 4개
- 각 20–25분 중심, 총 약 160분
- 기존 800분 instructional time 안에서 운영
- Recommended Prompt는 종료 전 제공하지 않는다.
- 5–10분 후 Instructor Intervention을 제공하고, 학습자는 같은 작업을 Keep Going한다.
- Prompt Engineering 자체는 학습목표가 아니다. OOAD의 모델링·responsibility·contract·collaboration·design feedback 판단이 학습목표다.

상세 Practice specification은 `support/02_course-assets/01_ooad/01_llm-integrated-practice-pack-v1.1.md`를 authoritative detailed specification으로 사용한다. (원문 표기 그대로 보존 — 현재 정본은 `courses/ooad/design/practice-design.md`.)

| ID | Topic | Decision Evidence |
|---|---|---|
| P1 | S02 Requirement → Use Case | black-box boundary / unresolved question |
| P2 | S05 Static Modeling Workshop | Concept ≠ Class / inclusion-exclusion rationale |
| P3 | S07 Dynamic Modeling Workshop | notation choice / just-enough rationale |
| P4 | S08 Information Hiding | volatility / hiding / change-impact rationale |
| P5 | S10 SOLID / DIP | evidence-based minimum design change |
| P6 | S11 RDD / GRASP / DbC / Patterns | responsibility owner / contract / optional pattern |
| P7 | S13 TDD / Refactoring Feedback | evidence diagnosis / minimum refactoring |

S12 Order Responsibility & Contract Workshop은 제거하지 않는다. P6의 결과를 입력 가설로 사용하고, S12에서 통합 consistency와 설계 trade-off를 사람 중심으로 검토한다.

## 23. Exercise Evidence

Order domain 기준 학습자는 다음을 수행해야 한다.

1. Use Case / scenario
2. Analysis concept model
3. selected dynamic model
4. responsibilities
5. candidate object owners
6. collaboration
7. one object contract
8. GRASP rationale
9. SOLID/DIP improvement
10. design pattern selection with trade-off
11. test/refactoring feedback
12. forward boundary: 무엇이 DDD/SWA에서 더 다뤄져야 하는지 설명

## 24. Recommended 14-Session Backbone

> **Non-normative notice:** 세션 번호·순서·시간 배분의 정본은 `courses/ooad/ooad-curriculum.md`다. 아래는 이 backbone이 처음 제안되었을 때의 legacy 원문이다.

기존 14-session 구조를 보존하면서 다음처럼 재정박한다.

### Part 1 — Analysis / Modeling
S01 OOAD Orientation — Object, Message, Responsibility
S02 Requirement → Use Case
S03 Example / BDD for Requirement Clarification
S04 Static Modeling — Concept before Class
S05 Static Modeling Workshop
S06 Dynamic Modeling — Collaboration over Notation
S07 Dynamic Modeling Workshop — Just Enough Modeling

### Part 2 — Object Design
S08 Modularity / Information Hiding / Cohesion / Coupling
S09 Object Design → Architecture Forward View
S10 SOLID / Dependency Principles
S11 Responsibility-Driven Design / GRASP / DbC / Patterns
S12 Order Responsibility & Contract Workshop

### Part 3 — Feedback / Evolution
S13 TDD / Refactoring as Design Feedback
S14 Object Model Limits → DDD / Architecture / MSA Forward

## 25. Primary Source / Quote Baseline

이미 검증된 `support/03_source-evidence/01_ooad-source-evidence-v2.0.md`를 사용한다. (이 문서 Part A로 흡수·보존됨.)

주요 anchor:
- Alan Kay
- Rebecca Wirfs-Brock
- Bertrand Meyer
- Craig Larman
- David Parnas
- GoF
- Martin Fowler
- Eric Evans

Booch exact quote는 primary verification 전 HOLD.

## 26. Global Baseline / Local Context Evidence Rule

원칙과 OO 계보는 Global primary source 중심.

한국 사례를 사용할 경우 Local/System Constraint와 Contextual Adaptation을 먼저 설명한다. BP/WP label은 교육상 필요한 경우에만 사용한다.

국내 관행은 Global Baseline의 OO principle과 비교해 재검토하되, 시스템 제약을 무시한 이상적 적용을 강요하지 않는다.

## 27. Quality Gate

> **Legacy status:** curriculum 승인 게이트의 현재 정본은 `guides/과정_설계_지침.md`와 `courses/ooad/design/course-context.md`다. 아래는 이 reference asset이 원래 정의한 gate 체크리스트를 원형 보존한 것이다.

curriculum 승인 전 모두 YES:

- OOAD가 UML 과정으로 축소되지 않는가?
- Object에 Message / Responsibility가 포함되는가?
- Analysis Model과 Design Model이 분리되는가?
- Concept → Class 1:1 변환 인상이 없는가?
- Responsibility가 Class보다 먼저인가?
- DbC가 OOAD OWNER로 포함되는가?
- Object Invariant와 Domain Invariant가 구분되는가?
- Message / Collaboration이 충분히 강조되는가?
- SOLID가 catalog가 아닌가?
- Repository DDD 의미를 OOAD가 소유하지 않는가?
- S09가 SW Architecture를 과도하게 가르치지 않는가?
- S14가 DDD/MSA를 과도하게 가르치지 않는가?
- TDD를 categorical하게 design-only로 정의하지 않는가?
- Just Enough Modeling이 적용되는가?
- 7개 LLM-integrated Practice가 기존 800분 안에 포함되는가?
- Day 1 3개 / Day 2 4개로 분산되는가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 OOAD 판단을 강화하고 정답을 직접 주지 않는가?
- Prompt 품질이 아니라 Decision Evidence를 평가하는가?
- Practice가 AI-Native OWNER를 OOAD로 끌어오지 않는가?

## Reference Asset — Portfolio Alignment Footer (원문 보존)

> **Unified Portfolio Alignment v2.2**
> - 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
> - 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
> - 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
> - 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.
