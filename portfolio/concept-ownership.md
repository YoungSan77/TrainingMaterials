# 04. Concept Ownership Map v2.6

> **Structure:** Concept registry + current Portfolio snapshot
> **Current portfolio:** OOAD · DDD · SW Architecture · MSA · AI-Native SE · Modern SWQM · Agile · DevOps · SW Project Management · SW Proposal · DT→AX
> **Cross-cutting:** Modern SWQM
> **Bridge:** Ontology / Explicit Semantics
> **Scalability rule:** 새 과정이 추가되어도 전체 matrix를 정본 구조로 고정하지 않는다. Concept별 OWNER와 Consumer 관계가 정본이며, matrix는 현재 Portfolio의 snapshot이다.
> **Foundational Lens rule:** Systems / Lean / ToC / Design / Empiricism은 Course Concept OWNER 경쟁 대상이 아닌 Portfolio-wide Parent Lens다.
> **Purpose:** 개념의 정의·정본 교육(OWNER)과 재정박·적용(CONSUMER)을
> 분리해 중복과 drift를 막는다.

------------------------------------------------------------------------

## 1. Ownership Modes

  -----------------------------------------------------------------------
  Mode                                의미
  ----------------------------------- -----------------------------------
  **OWNER**                           정의·기원·판단·적용
                                      조건·Trade-off·실패 조건까지 정본
                                      교육

  **RECAP**                           독립 수강을 위한 최소 의미 복구

  **APPLY**                           OWNER 정의를 바꾸지 않고 해당 과정
                                      문제에 적용

  **EXTEND**                          같은 원리를 더 큰/다른 수준으로
                                      확장

  **FORWARD**                         후속 과정에서 다룰 개념의 필요성만
                                      예고

  **BRIDGE**                          두 과정 사이에서 동일 정의를
                                      공유하되 서로 다른 적용 질문을 담당
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Current Portfolio Coverage Matrix

  --------------------------------------------------------------------------------
  Concept Family   OOAD        DDD          SWA          MSA          AI-Native
  ---------------- ----------- ------------ ------------ ------------ ------------
  Modeling         **OWNER**   APPLY        APPLY        RECAP        APPLY
  fundamentals                                                        

  Object /         **OWNER**   APPLY        EXTEND       RECAP        EXTEND
  Responsibility /                                                    
  Collaboration                                                       

  Cohesion /       **OWNER**   APPLY        **EXTEND**   **EXTEND**   APPLY
  Coupling                                                            

  SOLID / DIP      **OWNER**   APPLY        **EXTEND**   RECAP        APPLY

  Domain /         FORWARD     **OWNER**    APPLY        APPLY        APPLY
  Ubiquitous                                                          
  Language                                                            

  Entity / VO /    FORWARD     **OWNER**    APPLY        APPLY        APPLY
  Aggregate /                                                         
  Invariant                                                           

  Domain Service / FORWARD     **OWNER**    APPLY        EXTEND       APPLY
  Repository /                                                        
  Domain Event                                                        

  Bounded Context  FORWARD     **OWNER**    APPLY        **APPLY**    APPLY
  / Context                                                           
  Mapping                                                             

  Architecture     FORWARD     APPLY        **OWNER**    APPLY        APPLY
  Drivers /                                                           
  Quality                                                             
  Attributes                                                          

  Module /         APPLY       APPLY        **OWNER**    EXTEND       APPLY
  Component /                                                         
  Dependency                                                          

  Port / Adapter / FORWARD     APPLY        **OWNER**    APPLY        APPLY
  Application                                                         
  Boundary                                                            

  Architecture     FORWARD     APPLY        **OWNER**    APPLY        APPLY
  Decision /                                                          
  Evaluation /                                                        
  Fitness                                                             

  Modular Monolith ---         FORWARD      FORWARD      **OWNER**    ---

  Service Boundary ---         FORWARD      FORWARD      **OWNER**    ---
  / Extraction                                                        

  Distributed      ---         ---          FORWARD      **OWNER**    APPLY
  communication /                                                     
  consistency /                                                       
  failure                                                             

  Distributed      ---         ---          FORWARD      **OWNER**    APPLY
  observability /                                                     
  operation                                                           

  Explicit         ---         **BRIDGE**   APPLY        APPLY        **BRIDGE**
  Semantics /                                                         
  Ontology need                                                       

  Specification    ---         ---          APPLY        ---          **OWNER**
  Engineering                                                         

  Context          ---         ---          APPLY        ---          **OWNER**
  Engineering                                                         

  Prompt           ---         ---          ---          ---          **OWNER**
  Engineering                                                         

  Guardrail /      ---         ---          APPLY        APPLY        **OWNER**
  Harness                                                             

  Agent / HITL /   ---         ---          APPLY        APPLY        **OWNER**
  Autonomy                                                            

  AI Evaluation /  ---         ---          APPLY        APPLY        **OWNER**
  Observability /                                                     
  Cost                                                                
  --------------------------------------------------------------------------------

이 표에서 **APPLY가 많다고 해당 과정이 개념을 다시 정의해서는 안 된다.**

------------------------------------------------------------------------

## 3. OOAD Ownership

### OWNER

-   Model / Modeling 기초
-   Analysis Model / Design Model
-   Object / Class / Message / State / Behavior
-   Responsibility / Collaboration
-   Encapsulation
-   Static / Dynamic Modeling
-   GRASP / Information Expert
-   객체 수준 Cohesion / Coupling
-   SOLID
-   Design Pattern fundamentals
-   Tell Don't Ask / LoD / CQS 등 OO heuristic
-   Design by Contract / Precondition / Postcondition / Object Invariant
-   TDD / Refactoring의 설계 피드백

### FORWARD

-   Domain Model / DDD tactical concepts
-   Architecture Driver / Dependency Rule
-   System boundary
-   MSA / AI는 과정 지도 수준

### Migration from Current

기존 OOAD S09 `아키텍처 지향`은 유지하되 SWA의 상세 내용을 소유하지
않는다.\
기존 S14 `DDD·MSA 진화`는 DDD 전술 교육을 내려놓고 **OO 모델의 한계 →
Domain 중심 → 시스템/배포 경계**의 forward view로 재구성한다.

------------------------------------------------------------------------

## 4. DDD Ownership

### OWNER

-   Domain / Subdomain
-   Ubiquitous Language
-   Domain Model
-   Entity / Value Object
-   Invariant
-   Aggregate / Aggregate Root
-   Domain Service
-   Repository concept
-   Domain Event
-   Event Storming / discovery
-   Bounded Context
-   Context Mapping

### BRIDGE

-   Semantic Model / Ontology 필요성
-   Domain Model과 Ontology의 차이

### Migration from Current

기존 8교시 workshop의 강점은 **KEEP**한다. - Event Storming - Aggregate
boundary - Aggregate trade-off - Context Mapping

그러나 기존 "전술=OOAD, DDD=craft" 소유 구조는 폐기한다. 독립 과정이
되도록 **Domain Model + Tactical + Strategic**의 최소 정본 교육을
앞부분에 추가/재편한다.

------------------------------------------------------------------------

## 5. SW Architecture Ownership

### OWNER

-   Software Architecture
-   Architecture Driver
-   Quality Attribute / Scenario
-   System decomposition
-   Module / Component
-   Dependency Rule
-   Architecture style 선택
-   Clean Architecture — Policy/Detail separation과 Dependency Rule의 기본 구조적 기준점
-   Evolutionary Architecture / Architectural Characteristic / Fitness Function
-   Application Service / application boundary
-   Port / Adapter
-   Architecture Decision / Trade-off
-   Architecture Evaluation
-   Fitness Function / Enforcement / Governance
-   Architecture Evolution

### APPLY

-   OOAD의 DIP / cohesion / coupling
-   DDD의 Domain Model / Repository / Domain Event

### Migration from Current

**KEEP** - 최소 OO 재정박 -
`Spaghetti → TS → Rich Domain → Dependency Inversion` 실습 -
Port/Adapter - ArchUnit / encapsulation gate - MSA teaser

**MOVE / REDUCE** - Entity/Aggregate/Domain Modeling의 정본 설명 → DDD
OWNER - Architecture에서는 "이미 정의된 Domain Model을 구조적으로
보호·배치"하는 데 집중

**ADD / STRENGTHEN**
- Architecture Driver / Quality Attribute Scenario
- 대안 비교와 Trade-off / Architecture Decision
- Clean Architecture의 Dependency Rule을 구조적 spine으로 명확화
- Evolutionary Architecture / Fitness Function / continuous evolution
- Evaluation / Conformance

### Critical Gap

현재 커리큘럼은 Clean/Hexagonal 구조와 domain-rich refactoring에는
강하지만 **"왜 이 Architecture인가?"를 quality driver로 판단하는 축이
약하다.** v2에서 반드시 보강한다.

------------------------------------------------------------------------

## 6. MSA Ownership

### OWNER

-   Modular Monolith
-   Service Boundary Evaluation
-   Data Ownership
-   Service Extraction
-   Sync vs Async
-   Integration Event / Messaging
-   API / Event / Schema Contract와 compatibility / contract evolution
-   Distributed Consistency / Transaction
-   Saga / Outbox
-   Idempotency
-   Failure / Resilience
-   Distributed Observability
-   Deployment / Scaling / Operational Complexity
-   MSA adoption/rejection decision

### APPLY

-   DDD Bounded Context / Context Mapping
-   SWA Port / Adapter / Quality Trade-off

### Migration from Current

**KEEP** - 왜/언제 MSA -
`Bounded Context → Modular Monolith → boundary validation → extraction` -
Data ownership - Sync/Event 선택 - Saga/Outbox/Eventual Consistency -
YAGNI / distributed spaghetti

**CHANGE** - 기존 S02 `DDD 전략: BC·Context Mapping`은 OWNER 교육이
아니라 **DDD recap + service-boundary input**으로 축소

**ADD / STRENGTHEN** - Partial failure / timeout / retry / idempotency -
Observability - Deployment / operation / scaling cost

### Capacity Decision

현재 8교시를 유지하면 위 추가 내용을 모두 깊게 다룰 수 없다.

선택지는 둘이다. 1. **8교시 유지:** pattern breadth를 줄이고
`boundary + failure + operation`에 집중 2. **2일 확장:** distributed
patterns와 operation까지 실습

기본 권고는 **1일 과정의 정체성을 "MSA 도입·경계·핵심 분산 Trade-off
판단"으로 유지**하고, 심화 패턴은 부록/Advanced로 격리하는 것이다.

------------------------------------------------------------------------

## 7. AI-Native Ownership

### OWNER

-   Human--AI R&R
-   AI-assisted workflow
-   Specification Engineering
-   Context Engineering
-   Prompt Engineering
-   Task / Knowledge / Tool / State / Domain-Policy Context
-   Guardrail
-   Harness
-   Agent
-   Agentic Workflow / Stage Contract
-   HITL
-   Autonomy Boundary
-   Evaluation / AI Observability / Cost

### APPLY

-   OOAD Responsibility / Encapsulation
-   DDD Domain Model / Language / Invariant
-   SWA Architecture Rule / Gate / Decision
-   MSA Failure / Observability principles

### Migration from Existing AI-assisted + Agentic

**KEEP** - 명세되지 않은 부분의 확률적 편차 관찰 - Order 기능 생성
비교 - 기존 engineering gate로 AI output 검증 - feedback/re-prompt
loop - Agent = system - stage boundary - HITL - autonomy width -
observability / cost

**MERGE**
`AI-assisted → Specification/Context → Guardrail/Harness → Agentic`

**CHANGE** - 기존 AI-assisted S03에서 `context·constraint·harness`를 한
번에 섞지 않는다. - Harness는 Context와 Guardrail 뒤에서 별도 개념으로
정박한다. - Agentic의 Saga/보상 "재사용" 표현은 제거하고
**failure/recovery 사고의 유사성**으로 제한한다.

**ADD / STRENGTHEN** - Knowledge / Tool / State context - reusable
engineering assets as context - explicit semantics / ontology use -
evaluation strategy - deterministic vs probabilistic gate allocation -
tool permission / blast radius

------------------------------------------------------------------------

## 8. Ontology Bridge Ownership

  Topic                                     DDD          AI-Native
  ----------------------------------------- ------------ ------------
  Domain semantics가 왜 필요한가            **OWNER**    RECAP
  Concept / Relation / Role / Constraint    **BRIDGE**   APPLY
  Domain Model ≠ Ontology                   **OWNER**    RECAP
  Ontology 도입/기각 조건                   **BRIDGE**   **BRIDGE**
  Ontology를 AI Context로 제공              FORWARD      **OWNER**
  Retrieval/Tool/Agent semantic alignment   ---          **OWNER**

Ontology를 DDD나 AI의 필수 구현물로 만들지 않는다.

------------------------------------------------------------------------

## 9. Cross-Course Re-anchor Map

``` text
OOAD
Responsibility ───────────────→ DDD Domain Responsibility
      │
      ├───────────────────────→ SWA Component Responsibility
      └───────────────────────→ AI Human/Agent Responsibility

OOAD DIP ─────────────────────→ SWA Dependency Rule

DDD Bounded Context ──────────→ MSA Service Boundary Evaluation
                    (≠ automatic mapping)

DDD Domain Model ─────────────→ SWA Protection/Placement
       │
       └─ Explicit Semantics ─→ AI Context / Ontology

SWA Policy / Fitness Gate ────→ AI Guardrail / Deterministic Gate

MSA Failure / Observability ──→ AI Agentic Workflow
                    (principle reuse, not pattern identity)
```

------------------------------------------------------------------------

## 10. Legacy Courses → Current Engineering Portfolio

  Existing          v2 Decision             Result
  ----------------- ----------------------- -----------------
  OOAD              **ADAPT**               Core OOAD
  DDD               **EXPAND/REBALANCE**    Core DDD
  SW Architecture   **KEEP + STRENGTHEN**   Specialized SWA
  MSA               **KEEP + FOCUS**        Specialized MSA
  AI-assisted       **MERGE**               AI-Native 전반
  Agentic           **MERGE**               AI-Native 후반

**DROP는 기본 전략이 아니다.** 중복 정의만 OWNER로 회수한다.

------------------------------------------------------------------------

## 11. Prerequisite Policy

**Prerequisite recommended, never assumed.**

  Course      Minimum Recap
  ----------- ------------------------------------------------------
  OOAD        없음
  DDD         Object / Responsibility / Encapsulation / Modeling
  SWA         Cohesion / Coupling / DIP / Domain Model의 최소 의미
  MSA         Bounded Context + Architecture Boundary / Port
  AI-Native   OOAD→DDD→SWA→Ontology 전체 지도와 필요한 최소 정의

------------------------------------------------------------------------

## 12. Ownership Violation

다음은 위반이다.

-   **Duplicate Definition:** OWNER 밖에서 다른 정의를 만든다.
-   **Ownership Drift:** 실습에서 많이 쓴다는 이유로 OWNER를 옮긴다.
-   **Boundary Collapse:** `BC=Microservice`, `Prompt=Context`,
    `Guardrail=Harness`처럼 인접 개념을 동일시한다.
-   **Prerequisite Leakage:** 앞 과정을 들었다고 가정해 핵심 연결을
    생략한다.
-   **Tool-driven Curriculum:** 제품 기능이 curriculum architecture를
    결정한다.
-   **Architecture Blindness:** 구조를 가르치면서
    driver/quality/trade-off를 설명하지 않는다.
-   **Distribution Blindness:** MSA를 가르치면서 failure/operation
    cost를 주변 주제로 취급한다.
-   **AI Autonomy First:** specification/context/control보다 agent
    autonomy를 먼저 가르친다.

------------------------------------------------------------------------

## 13. New Concept Admission

새 개념 X는 다음을 통과해야 한다.

1.  해결하는 문제가 무엇인가?
2.  Six Axes 중 어디에 속하는가?
3.  OWNER가 누구인가?
4.  기존 개념과 어떻게 다른가?
5.  어떤 선택/Trade-off를 바꾸는가?
6.  독립 수강자에게 어떤 recap이 필요한가?
7.  Tool/Vendor가 사라져도 남는가?
8.  기존 Portfolio로 충분한가, 별도 과정이 필요한가?


---

## 14. Scalable Concept Registry — v2.1

과정 수가 증가하면 넓은 matrix만으로 ownership을 관리하지 않는다.
정본은 Concept별 registry를 우선한다.

### Contract Family

#### Design by Contract
- **OWNER:** OOAD
- **DDD:** APPLY — Domain invariant와 domain responsibility에 적용
- **SWA:** EXTEND — interface/port/component contract
- **MSA:** APPLY — service contract 사고의 기초
- **AI-Native:** EXTEND — stage contract
- **Modern SWQM:** APPLY/VERIFY — 계약 충족 evidence와 gate

#### Object Invariant / Domain Invariant
- **Object Invariant OWNER:** OOAD — Design by Contract의 object validity
- **Domain Invariant OWNER:** DDD — domain rule / Aggregate consistency
- **SWA:** APPLY
- **MSA:** APPLY — consistency decision의 입력
- **AI-Native:** APPLY — constraint/context
- **Modern SWQM:** VERIFY — test/evidence 대상으로 사용

#### Interface / Port Contract
- **OOAD:** FORWARD
- **DDD:** APPLY
- **OWNER:** SW Architecture
- **MSA:** EXTEND
- **AI-Native:** APPLY — Tool/adapter interface
- **Modern SWQM:** VERIFY

#### API / Event / Schema Contract
- **DDD:** FORWARD — Domain Event와 외부 contract를 구분
- **SWA:** APPLY
- **OWNER:** MSA
- **AI-Native:** APPLY — Tool/API integration
- **Modern SWQM:** VERIFY

#### Stage Contract
- **SWA:** APPLY — gate/policy 원리
- **MSA:** APPLY — workflow/failure 원리
- **OWNER:** AI-Native
- **Modern SWQM:** VERIFY

#### Quality Evidence / Gate
- **Quality Evidence OWNER:** Modern SWQM — evidence-backed quality system과 continuous feedback
- **Quality Gate:** cross-course mechanism; 단일 OWNER로 고정하지 않음
- **OOAD:** APPLY — test/refactoring feedback
- **DDD:** APPLY — invariant/domain rule verification
- **SWA:** OWNER within architecture — fitness/conformance gate
- **MSA:** APPLY/EXTEND — resilience/contract verification
- **AI-Native:** OWNER within AI execution — deterministic/probabilistic evaluation gate
- **DevOps:** delivery pipeline gate ownership을 Course Admission에서 결정

## 15. Modern SWQM Cross-Cutting Ownership — v2.1

Modern SWQM은 OOAD/DDD/SWA/MSA/AI-Native의 기술 개념을 재정의하지 않는다.

### OWNER
- Quality as system property
- Shift-Left
- Prevention vs Detection
- Cost of Quality / Rework
- Quality governance / process
- Review / independent verification 관점
- Test strategy의 품질 관점
- CI quality pipeline / quality gate
- Metrics / Goodhart / quality measurement
- Audit / compliance evidence
- Organizational system / incentives
- Continuous improvement / Quality Operating Model
- Quality Evidence

### APPLY / RECAP ONLY
- OOAD object/design principles
- DDD Domain Model / Ubiquitous Language / Ontology need
- SWA Architecture / Quality Attribute의 정본 정의
- MSA distributed design patterns
- AI-Native Context / Guardrail / Harness / Agent definitions

특히 QM에서 `Context Engineering`, `Rich Domain Model`, `Ubiquitous Language`,
`Ontology`, `Guardrail`, `Harness`를 OWNER처럼 재정의하는 것은 ownership violation이다.

## 16A. Agile Ownership — v2.2

### OWNER
- Agile adoption condition / readiness
- Predictive / Iterative / Incremental / Adaptive distinctions
- Small Batch / Short Feedback
- Working Increment as learning evidence
- Product Decision / Feedback structure
- Scrum application as problem-solving framework
- Pilot-based adoption / adaptation
- Agile anti-pattern / failure condition
- Outsourcing/contract/governance constraints from Agile adoption perspective

### APPLY / RECAP ONLY
- Requirement/User Story details beyond adaptive work slicing
- Engineering practices owned by OOAD/QM/DevOps or other engineering courses
- DevOps delivery/deployment flow

### Awareness Only
XP / Kanban / SAFe / LeSS / Nexus / Jira / Story Point mechanics / Burn charts.

## 16. New Course Admission — v2.1

새 Course X는 다음을 통과해야 한다.

1. 기존 Portfolio로 충분히 다룰 수 없는 **독립적인 판단 문제**가 있는가?
2. 새 OWNER 개념 또는 기존 개념의 충분히 큰 EXTEND 영역이 있는가?
3. 독립 과정이 아니라 기존 과정의 module/advanced appendix로 충분하지 않은가?
4. 기존 OWNER 정의를 복제하지 않고 recap/apply로 소비할 수 있는가?
5. 학습자가 과정 후 실제로 내려야 할 decision이 무엇인가?
6. 그 decision의 Trade-off / Failure Condition / Evidence가 무엇인가?
7. Vendor/tool이 사라져도 과정 identity가 남는가?
8. `06_course-spec-template.md`를 채울 수 있는가?

DevOps, SW Project Management, SW Proposal, DT→AX는 이 gate를 통과했다. 이후 신규 과정은 이 gate를 통과한 뒤
`support/01_governance/10_course-catalog.md`에 등록한다.


---

## 17. Evidence / Localization Governance Pointer

Source hierarchy와 Global/Korea precedence는 `07_evidence-source-localization-policy.md`가
단일 authoritative owner가 소유한다.

Concept Ownership 관점의 규칙:
- 지역 사례의 사용 빈도가 Concept OWNER를 이동시키지 않는다.
- Local/System Constraint와 Contextual Adaptation은 concept definition이 아니라 evidence/application classification이다. BP/WP label은 필요한 경우에만 사용한다.
- Modern SWQM을 포함한 모든 과정이 동일 policy를 소비한다.


---
## Unified Portfolio Alignment v2.6
- 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
- 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
- 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
- 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.

---

## Current Concept Owners

### DevOps
**OWNER**
- End-to-End Software Delivery Flow
- Continuous Integration as frequent integration + fast feedback
- Continuous Delivery / Deployment distinction
- Deployable Artifact / Environment reproducibility
- Deployment / Release flow
- Operations Feedback / Recovery
- Software Delivery Performance

**Boundary**
- SWQM owns Quality Risk / Evidence / Quality Gate criteria.
- Agile owns customer/product adaptation.
- DevOps owns delivery/deployment/operations feedback.

### SW Project Management
**OWNER**
- Project value/governance/control
- PMBOK 8 Principle ↔ Performance Domain ↔ Focus Area ↔ Process reasoning
- Scope / Schedule / Finance / Resource / Risk integration
- Integrated change impact and forecast
- Project-context Tailoring

**Boundary**
- Agile owns adaptive delivery mechanics.
- DevOps owns software delivery flow.
- SWQM owns software-quality evidence and gate design.

### SW Proposal
**OWNER**
- Opportunity Qualification / Bid–No-Bid
- Customer Decision / Evaluation Criteria
- Win Strategy / Competitive Positioning
- Proposal-level Solution + Delivery + Commercial alignment
- Claim–Evidence strategy
- Compliance + Persuasion
- Proposal Storyline / Review

**Boundary**
- SW Architecture owns architecture design.
- PM owns detailed project planning/control.
- Proposal course owns how those commitments become a credible customer decision argument.

### DT→AX
**OWNER**
- Transformation Strategy / Diagnosis
- Value / Capability / Operating Model redesign
- DT → AI Transformation transition
- AI Use-case Portfolio
- Human / AI work and decision allocation
- AI Governance orientation
- Transformation Roadmap / Pilot / Evidence / Scale–Stop

**Boundary**
- AI-Native SE owns AI-assisted/agentic software engineering mechanics.
- DT→AX owns enterprise/business operating-model transformation.

### Cross-Course Bridge Summary

```text
Agile
Product / Customer Feedback
        ↓
DevOps
Delivery / Operations Feedback

SWQM
Quality Evidence / Gate Governance
        ↕
DevOps
Pipeline Execution / Delivery Flow

PM
Project Governance / Integrated Control
        ↕
Agile / DevOps
Delivery Execution

SW Proposal
Customer Decision / Commitment
        ← applies evidence from Architecture / PM / Quality / Delivery

DT→AX
Enterprise Transformation / Human+AI Operating Model
        ↕
AI-Native SE
AI-assisted / Agentic SW Engineering
```
