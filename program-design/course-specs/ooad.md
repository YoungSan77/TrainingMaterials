# OOAD Course Specification v1.0

> **Status:** Pre-curriculum specification candidate
> **Basis priority:** Program Governance / agreed discussion > existing OOAD curriculum
> **Reference use rule:** 기존 OOAD curriculum은 강점·실습·흐름을 참고하되, 기존 표현이 Canon과 충돌하면 본 Course Spec과 Program Governance를 우선한다.
> **Purpose:** OOAD 과정을 UML/패턴 카탈로그가 아니라 현실 문제를 책임·계약·협력으로 구조화하는 설계 과정으로 고정한다.

## 1. Identity

- **Course ID:** ooad
- **Course Name:** Object-Oriented Analysis & Design
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

## 4. Canonical Ownership

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

## 22. Exercise Evidence

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

## 23. Recommended 14-Session Backbone

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

## 24. Primary Source / Quote Baseline

이미 검증된 `ooad-verified-principles-quotes.md`를 사용한다.

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

## 25. Global / Korea Evidence Rule

원칙과 OO 계보는 Global primary source 중심.

한국 사례를 사용할 경우:
- Korea BP
- Korea WP
- Local Context
로 명시한다.

국내 관행이 OO principle과 충돌하면 Global Principle / Global BP를 우선한다.

## 26. Quality Gate

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
