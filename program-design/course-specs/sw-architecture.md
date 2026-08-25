# SW Architecture Course Specification v1.0

> **Status:** Pre-curriculum specification candidate
> **Basis:** Program Governance v2.2.2
> **Purpose:** Claude의 curriculum authoring 전에 SW Architecture 과정의 문제·판단·소유권·범위를 고정한다.

## 1. Identity

- **Course ID:** sw-architecture
- **Course Name:** Software Architecture
- **Portfolio Category:** Architecture & Distribution
- **Course Thesis:**

> 중요한 Quality Attribute와 Constraint를 만족하도록 시스템 구조와 의존성을 선택하고,
> 중요한 policy를 volatile detail로부터 보호하며, 그 선택을 evidence로 검증하고
> 변화에 따라 지속적으로 진화시킨다.

## 2. Problem It Owns

OOAD/DDD만으로는 다음 질문에 충분히 답하기 어렵다.

- 시스템을 어떤 구조 단위로 나눌 것인가?
- 어떤 dependency direction이 중요한 policy를 보호하는가?
- 기능이 같은 여러 architecture 대안 중 무엇을 선택할 것인가?
- 성능·가용성·변경용이성·보안·운영성 등 competing qualities를 어떻게 trade-off할 것인가?
- architecture가 시간이 지나도 의도한 특성을 유지하는지 어떻게 검증할 것인가?
- 새로운 evidence와 변화에 architecture를 어떻게 점진적으로 진화시킬 것인가?

## 3. Three Canonical Anchors

### A. Decision Basis — Quality Attribute Reasoning

```text
Business / Functional Drivers
+ Quality Attribute Scenarios
+ Constraints
        ↓
Options / Tactics / Styles
        ↓
Trade-off / Risk
        ↓
Architecture Decision
```

SEI의 scenario-based reasoning과 ATAM 계보를 근거로 한다.

**Teaching rule:** 구조 이름보다 먼저 `왜 이 선택인가?`를 묻는다.

### B. Structural Baseline — Clean Architecture

Clean Architecture를 **기본 structural lens**로 사용한다.

핵심:
- Separation of Concerns
- Policy vs Detail
- Dependency Rule
- Application / Use Case Boundary
- Interface / Port
- Replaceable external mechanisms

**Not:**
- 동심원 암기
- package 이름 복사
- 무조건 4-layer
- Clean Architecture = Software Architecture 전체
- DDD Domain Model 정의 재교육

### C. Time Dimension — Evolutionary Architecture

```text
Architecture Decision
→ Implement
→ Observe / Measure
→ Fitness Function
→ Evidence
→ Guided Incremental Change
→ Re-evaluate
```

핵심:
- guided incremental change
- architectural characteristics
- fitness functions
- continuous evaluation
- multiple dimensions of change

## 4. Course Spine

```text
Drivers
→ Quality / Constraints
→ Policy vs Detail
→ Decomposition
→ Dependency
→ Boundary / Interface
→ Style / Tactic / Alternative
→ Decision / Trade-off
→ Enforcement
→ Evaluation
→ Evolution
```

## 5. Canonical Ownership

### OWNER
- Software Architecture purpose/scope
- Architecture Driver
- Quality Attribute / Quality Attribute Scenario
- Architectural Characteristic
- System decomposition
- Module / Component
- System-level Dependency Rule
- Clean Architecture
- Application boundary
- Port / Adapter
- Architecture Style selection
- Architecture Tactic
- Architecture Decision / rationale / ADR
- Architecture Trade-off
- Architecture Evaluation
- Architecture Fitness Function
- Architecture Conformance / Enforcement
- Evolutionary Architecture
- Architecture Evolution / Change Impact

### APPLY
- OOAD: Responsibility / Cohesion / Coupling / DIP
- DDD: Domain Model / Repository / Domain Event / Bounded Context
- QM: evidence / quality governance principles

### FORWARD
- MSA: distribution decision / service boundary / distributed failure
- AI-Native: architecture policy as guardrail/context/evidence
- DevOps candidate: delivery/deployment flow and operational pipeline

## 6. Explicit Non-Scope

Do not own:
- Entity / Value Object / Aggregate canonical definitions
- Bounded Context canonical teaching
- Event Storming
- MSA distributed pattern catalog
- CI/CD pipeline operation as DevOps curriculum
- Platform Engineering as a major unit
- Team Topologies as a major unit
- AI Guardrail/Harness canonical definitions

Conway/organization may appear only as an architecture driver/constraint and forward reference.

## 7. Key Distinctions

- Architecture ≠ Diagram
- Clean Architecture ≠ all Architecture
- Dependency Rule ≠ DI framework
- Architecture Style ≠ Architecture Tactic
- Quality Attribute ≠ vague adjective
- Quality Attribute Scenario ≠ functional use case
- Module ≠ Runtime Service
- Bounded Context ≠ Microservice
- Port ≠ Adapter
- Architecture Fitness Function ≠ generic business KPI
- Evolutionary Architecture ≠ “no upfront architecture”
- Evolution ≠ uncontrolled change

## 8. Decision Questions Learner Must Be Able to Answer

1. 어떤 Driver가 이 Architecture 결정을 중요하게 만드는가?
2. Quality Attribute를 검증 가능한 scenario로 어떻게 바꿀 것인가?
3. 어떤 policy가 volatile detail로부터 보호되어야 하는가?
4. dependency는 어느 방향으로 흐르고 왜 그래야 하는가?
5. 후보 구조의 gain/cost/risk는 무엇인가?
6. 어떤 architecture characteristic을 지속 보호해야 하는가?
7. 무엇을 fitness function으로 자동/반자동 검증할 수 있는가?
8. 새로운 evidence가 생기면 어떤 결정을 유지/변경할 것인가?

## 9. Core Lab Spine

기존 강점을 보존한다.

```text
Spaghetti
→ Transaction Script
→ Responsibility / Rich Domain behavior
→ Dependency Inversion
→ Clean Boundary
→ Port / Adapter
→ Architecture Rule
→ Fitness / Conformance
→ Change Request
→ Evolution
```

### 중요한 수정
`Rich Domain`은 DDD 정본 설명이 아니다.
OOAD/DDD에서 이미 정의된 behavior/policy를 기술 detail로부터 보호해야 하는 필요를 보여주는 input이다.

Lab의 최종 목적:
> “Clean Architecture를 만들었다”가 아니라
> “driver가 바뀌어도 중요한 policy와 quality를 통제 가능한 구조로 보호하고 검증할 수 있다.”

## 10. Architecture Evaluation Depth

### Include
- Quality Attribute Scenario
- sensitivity / trade-off / risk 사고
- lightweight architecture evaluation
- ATAM의 목적과 구조
- QAW/ATAM이 왜 scenario와 stakeholder를 사용하는지

### Do not turn into
- 정식 ATAM facilitator certification course
- ATAM step 암기
- 모든 프로젝트에 formal ATAM 강제

16시간 과정에서는 **scenario-driven evaluation mindset**이 목표다.

## 11. Architecture Tactics

Style보다 한 단계 아래의 quality response mechanism으로 소개한다.

예:
- availability tactics
- performance tactics
- modifiability tactics
- security tactics

목적:
> `Quality Attribute → Tactic → Structural Consequence`

catalog 암기가 아니라 대안 선택 논리로 사용한다.

## 12. Evolutionary Architecture

### Must include
- architectural characteristic discovery
- automated/non-automated fitness functions
- static dependency/conformance check
- runtime metric/SLO examples
- fitness function의 scope/cadence
- incremental architectural change
- decision re-evaluation

### Failure conditions
- 모든 것을 자동 fitness function으로 만들기
- metric이 architecture intent를 대체
- 현재 필요 없는 미래 variation을 과설계
- “evolutionary”를 architecture decision 회피 명분으로 사용

## 13. Evidence of Learning

학습자는 Order domain 또는 공통 lab에서 다음을 제출/설명할 수 있어야 한다.

1. Architecture Drivers
2. 최소 2개 Quality Attribute Scenarios
3. 후보 architecture options
4. 선택과 trade-off
5. dependency/boundary model
6. 한 개 이상의 architecture rule
7. 한 개 이상의 fitness function
8. 새로운 change request가 왔을 때 impact/evolution decision

## 14. Suggested 16-Session Skeleton

이것은 curriculum 정본이 아니라 authoring constraint다.

### Part 1 — Why Architecture
S01 Architecture as Decisions, not Diagrams  
S02 Drivers / Constraints  
S03 Quality Attributes & Scenarios  
S04 Trade-offs / Tactics / Alternatives  

### Part 2 — Structure
S05 From Object Responsibility to System Structure  
S06 Policy vs Detail / Dependency Inversion  
S07 Clean Architecture / Dependency Rule  
S08 Application Boundary / Port / Adapter  

### Part 3 — Decide & Evaluate
S09 Styles and Tactics — Selection, not Catalog  
S10 Architecture Decision / ADR / Trade-off  
S11 Scenario-based Evaluation / ATAM orientation  
S12 Lab — Architecture Decision & Evaluation  

### Part 4 — Enforce & Evolve
S13 Architecture Rules / Conformance / Fitness Functions  
S14 Evolutionary Architecture  
S15 Change Impact / Evolution Lab  
S16 Integrated Review / MSA Forward  

Session 수/시간은 현재 curriculum과 실제 강의시간을 확인해 조정한다.

## 15. Primary Source Baseline

Global primary/authoritative sources 우선:
- Robert C. Martin — “The Clean Architecture” / *Clean Architecture*
- SEI / CMU — Quality Attribute / Scenario / ATAM / QAW research
- Neal Ford, Rebecca Parsons, Patrick Kua — *Building Evolutionary Architectures*

한글 자료는 원칙의 근거로 우선하지 않는다.

## 16. Quality Gate

Course curriculum 승인 전 모두 YES:
- Driver가 structure보다 먼저 등장하는가?
- Clean Architecture의 목적이 Dependency Rule/Policy protection으로 설명되는가?
- DDD 내용을 재교육하지 않는가?
- style catalog가 아니라 decision/trade-off 과정인가?
- Quality Attribute Scenario가 실제 판단에 사용되는가?
- Architecture Evaluation이 포함되는가?
- Fitness Function이 단순 도구 이름이 아닌가?
- Evolutionary Architecture가 architecture 무계획과 구분되는가?
- MSA/DevOps의 OWNER를 침범하지 않는가?
