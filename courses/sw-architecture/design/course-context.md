# SW Architecture — Course Context

> **Pipeline position:** `Portfolio Design(portfolio/) + 과정 설계 지침(guides/과정_설계_지침.md) + References + Human↔LLM → Course Design(courses/sw-architecture/design/)`
> **Owns:** 왜 가르치는지의 뼈대(Course Context)만. 세션·시간표·구체적 커리큘럼 구조는 `courses/sw-architecture/curriculum.md`(정본, 실제 16교시 구조)가 소유한다 — 이 문서는 그 커리큘럼을 설명하는 상위 문서로 병행 작성됐고, 이중 SSOT를 피하기 위해 세션 번호를 복제하지 않는다.
> **Source status:** `context/course-portfolio-unified-v2.6/courses/03_sw-architecture.md`(Unified Baseline)에서 progression/priority/rationale/coverage-intent만 추출했다. Portfolio-wide 정의·용어·개념 소유는 `portfolio/*.md`가 정본이며 이 문서는 그것을 SW Architecture 과정에 구체화한다.

---

## 1. Course Purpose

중요한 Quality Attribute와 Constraint를 만족하도록 시스템 구조와 의존성을 선택하고, 중요한 Policy를 volatile detail로부터 보호하며, 그 선택을 Evidence로 검증하고 변화에 따라 지속적으로 진화시키는 판단력을 기른다.

## Target Learner / Capability Gap / Typical Failure / Target Capability

- **Target Learner:** 시스템 수준의 구조적 결정을 내려야 하는 개발 리더·아키텍트·설계자.
- **Capability Gap:** pattern/diagram을 architecture로 오해하거나 quality driver 없이 구조를 선택하는 상태에서, driver·quality·constraint를 근거로 구조적 대안을 비교·검증·진화시키는 상태로.
- **Typical Failure:** 기술/Style을 먼저 고른다. Dependency가 Framework/DB에 끌려간다. "고성능/고가용" 같은 형용사만으로 품질 요구를 다룬다. Diagram Review만으로 결정을 평가한다. Evolution을 무계획 변경으로 사용한다.
- **Target Capability:** driver를 QA Scenario로 구체화하고, 후보 구조를 Trade-off로 비교하며, Policy를 Detail로부터 보호하는 Dependency Rule을 설계하고, ADR/Evaluation으로 근거를 남기며, Fitness Function으로 Architecture Intent를 지속 검증한다.

## Learner & Context Fit

> 이 절은 `context/course-portfolio-unified-v2.6/courses/03_sw-architecture.md`의 Learner & Context Fit을 그대로 가져온다(요약·재작성하지 않는다) — 과정 설계 지침 §3.

- **Audience / Work Context:** 시스템 수준의 구조적 결정을 내려야 하는 개발 리더·아키텍트·설계자.
- **Current Capability / Failure Mode:** pattern/diagram을 architecture로 오해하거나 quality driver 없이 구조를 선택한다.
- **Target Capability:** driver·quality·constraint를 근거로 구조적 대안을 비교하고 검증·진화시킨다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Fit

> `context/.../support/04_audit/01_portfolio-integrity-audit-v2.6.md` §4의 판정을 그대로 옮긴다 — 과정 설계 지침 §4.

- **APPLY:** Systems Thinking (SYS-01 Optimize the Whole / SYS-02 Structure Produces Behavior); Empiricism / Scientific Thinking (EMP-01~05).
- **Why:** Architecture 판단은 competing quality attribute 사이의 상호작용을 전체로 보아야 하고(Systems), Architecture Decision을 hypothesis로 다루어 evidence/fitness function으로 계속 검증해야 한다(Empiricism).
- **Rule:** 관련 없는 Lens(Lean/ToC/Design Thinking)를 형식상 억지로 추가하지 않는다. Lens는 SW Architecture OWNER 개념을 재정의하지 않고 판단을 강화한다.

---

## 2. Course Thesis / Narrative

> **Thesis (canon-stance.md와 동일):** Architecture는 중요한 Quality Attribute와 Constraint를 만족하도록 정책과 세부사항의 경계·의존성을 선택하고, 그 선택을 evidence로 검증하며 변화에 따라 지속적으로 진화시키는 일이다.

**Core Narrative:**
`Drivers → Quality/Constraints → Policy vs Detail → Decomposition → Dependency → Boundary/Interface → Style/Tactic/Alternative → Decision/Trade-off → Enforcement → Evaluation → Evolution`

### Architecture Spine — 3축 (cross-course-framework.md §13, canon-stance.md §2 원문 그대로)

SW Architecture 과정은 세 축을 결합한다. 셋 중 하나로 Architecture 전체를 대체하지 않는다.

```text
1. Decision Basis (Why)
Architecture Drivers / Quality Attribute Scenarios / Constraints
        ↓
2. Structural Baseline (Structure)
Clean Architecture as baseline lens
Policy vs Detail / Dependency Rule / Boundaries
        ↓
3. Time Dimension (Time)
Evolutionary Architecture
Fitness Functions / Guided Incremental Change / Continuous Evaluation
```

- **Decision Basis:** Quality Attribute Scenario / Constraint / Trade-off — `Driver → Scenario → Options → Trade-off → Decision`.
- **Structural Baseline:** Policy vs Detail / Dependency Rule / Clean Architecture lens.
- **Time Dimension:** Fitness Function / Conformance / Evolutionary Architecture — `Decision → Implement → Measure → Fitness → Adapt`.

### Course Spine (canon-stance.md §3, 원문)

```text
Why
Drivers / Quality / Constraints
        ↓
Protect
Policy vs Detail
        ↓
Structure
Boundary / Dependency / Port / Adapter
        ↓
Choose
Style / Pattern / Alternative / Trade-off
        ↓
Enforce
Rule / Fitness / Conformance
        ↓
Evaluate
Scenario / Evidence / Risk
        ↓
Evolve
Incremental Change / Re-decision
```

---

## 3. Decisions Learner Must Make

1. 어떤 Driver가 Architecture Decision을 중요하게 만드는가?
2. Quality Attribute를 검증 가능한 Scenario로 어떻게 바꾸는가?
3. 어떤 Policy를 어떤 Detail로부터 보호하는가?
4. Dependency는 어느 방향으로 흐르고 왜 그런가?
5. 후보 구조의 Gain/Cost/Risk는 무엇인가?
6. 어떤 Architecture Characteristic을 지속 보호해야 하는가?
7. 무엇을 자동/반자동 Fitness Function으로 검증할 것인가?
8. 새로운 Evidence가 생기면 어떤 결정을 바꿀 것인가?

---

## 4. Course Scope — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

> `portfolio/concept-ownership.md` §5 (SW Architecture Ownership)의 구체화.

### OWNER

Software Architecture, Architecture Driver, Quality Attribute / Scenario, Architectural Characteristic, System decomposition, Module / Component, System-level Dependency Rule, **Clean Architecture — Policy/Detail separation과 Dependency Rule의 기본 구조적 기준점**, Architectural style 선택, Evolutionary Architecture / Architectural Characteristic / Fitness Function, Application Service / application boundary, Port / Adapter, Architecture Decision / Trade-off, Architecture Evaluation, Fitness Function / Enforcement / Governance, Architecture Evolution.

### APPLY (RECAP where the learner lacks the prerequisite)

- OOAD의 DIP / Cohesion / Coupling — 이 과정에서 **EXTEND**되어 System-level Dependency Rule로 승격된다(`concept-ownership.md` §2 matrix: SWA는 Cohesion/Coupling·SOLID/DIP에서 EXTEND).
- DDD의 Domain Model / Repository / Domain Event — 이미 정의된 Domain Model을 재정의하지 않고 **구조적으로 보호·배치**하는 데 집중한다.
- Modern SWQM의 Evidence 개념 — architecture fitness/conformance gate 안에서 사용.

### RECAP (실수강자 절반 이상이 OOAD 미보유 — 실제 커리큘럼의 전제)

Cohesion / Coupling / DIP / Domain Model의 최소 의미. 없는 경우 교육으로, 있는 경우 아키텍처 렌즈로의 격상으로 다룬다(재정박이 아니라 격상).

### NON-SCOPE / FORWARD

DDD Tactical 정의(Entity/Aggregate/Domain Modeling의 정본 설명 — DDD OWNER), MSA Distributed Pattern Catalog(Service Boundary/Sync-Async/Saga 등 — MSA OWNER), CI/CD 운영, Platform Engineering 상세, AI Guardrail/Harness 정의(AI-Native OWNER).

### Migration Note — MOVE/REDUCE, ADD/STRENGTHEN (concept-ownership.md §5 원문 보존)

**MOVE/REDUCE:** Entity/Aggregate/Domain Modeling의 정본 설명 → DDD OWNER로 이관. Architecture에서는 "이미 정의된 Domain Model을 구조적으로 보호·배치"하는 데 집중한다.

**ADD/STRENGTHEN:** Architecture Driver / Quality Attribute Scenario, 대안 비교와 Trade-off / Architecture Decision, Clean Architecture의 Dependency Rule을 구조적 spine으로 명확화, Evolutionary Architecture / Fitness Function / continuous evolution, Evaluation / Conformance.

### Critical Gap (concept-ownership.md §5, 원문 보존 — 실제 커리큘럼과의 격차 인지용)

> 현재(실제) 커리큘럼은 Clean/Hexagonal 구조와 domain-rich refactoring에는 강하지만 **"왜 이 Architecture인가?"를 quality driver로 판단하는 축이 약하다.**

이 gap은 `courses/sw-architecture/curriculum.md`(정본, 16교시)가 Structural Baseline 축(Spaghetti→TS→Rich Domain→DIP)에서는 강하되, Decision Basis 축(QA Scenario·대안 비교·ADR)의 실습 밀도가 상대적으로 얕다는 뜻이다. Practice Pack(P1·P2·P4·P5)이 이 축을 LLM-integrated practice로 보강하는 이유이기도 하다 — `practice-design.md` 참조.

---

## 5. Key Distinctions

> `context/.../courses/03_sw-architecture.md` §7 + `portfolio/terminology.md` §D, §H 중 이 과정에 해당하는 쌍.

- Architecture ≠ Diagram
- Clean Architecture ≠ Architecture 전체
- Dependency Rule ≠ DI Framework
- Style ≠ Tactic
- Quality Attribute ≠ 모호한 형용사
- QA Scenario ≠ Functional Use Case
- Module ≠ Runtime Service
- Fitness Function ≠ Generic KPI
- Evolutionary Architecture ≠ No Upfront Architecture
- **Domain Service ≠ Application Service** (terminology.md §D): Domain rule vs use-case orchestration. Domain Service는 DDD OWNER, Application Service(orchestration 역할)는 SWA OWNER.
- **Port ≠ Adapter** (terminology.md §H): contract vs technology implementation.
- **DIP ≠ DI**(terminology.md §H): design principle vs implementation mechanism. DI Framework 사용을 DIP 준수로 착각하지 않는다.
- **Object Contract ≠ API Contract**(terminology.md 추가 구분): 객체 내부 협력 계약 vs 원격 소비자와의 외부 계약. SWA는 전자를 interface/port 수준으로 확장하고, 원격 서비스 계약은 MSA OWNER다.
- **Bounded Context ≠ Microservice**: semantic boundary vs deployment/operation boundary. SWA의 Module/Component는 이 둘 중 어느 것도 자동으로 같지 않다.

---

## 6. Course-owned Principles (Child of Parent Lens)

> `portfolio/principles.md` C3(Architecture Decisions — SW Architecture)의 원문. Primary Parent Lenses: Systems Thinking / Empiricism.

### ARCH-01. Architecture Is a Set of Consequential Decisions
Architecture는 그림이 아니라 변경 비용이 크고 품질에 영향을 주는 구조적 결정이다. **판단:** 이 결정이 어떤 driver/constraint 때문에 중요한가?

### ARCH-02. Quality Attributes Drive Structure
기능 요구만으로 Architecture를 결정하지 않는다. 성능·가용성·변경용이성·보안·운영성 등 **얼마나 잘** 해야 하는지가 구조를 바꾼다. **실패 조건:** Quality Attribute를 "좋아야 한다" 수준의 형용사로만 둔다.

### ARCH-03. Every Architecture Choice Buys Something and Pays Something
Architecture에는 무료 해법이 없다. 선택은 `Context → Options → Gain → Cost/Risk → Decision`으로 설명한다. **실패 조건:** Pattern/Style 이름을 근거로 선택.

### ARCH-04. Stable Policy Should Not Depend on Volatile Detail
**Structural anchor:** Clean Architecture / Dependency Rule 계보. Domain/Use Case 같은 정책을 Framework/DB/API 세부사항에서 보호한다. Clean Architecture의 핵심 가치는 동심원 그림 자체가 아니라 **Policy와 Detail의 분리 및 inward dependency**다. Port/Adapter는 이 목적을 위한 수단이지 목표가 아니다. **실패 조건:** Clean Architecture의 layer/package 이름을 복제했지만 실제 dependency가 외부 detail을 향한다.

### ARCH-05. Architecture Must Be Enforceable
합의만 있고 검증이 없으면 시간이 지나며 구조는 붕괴한다. Test, lint, dependency rule, fitness function 등 가능한 부분은 자동 검증한다. **Trade-off:** 강제력을 얻지만 gate 유지 비용을 부담한다.

### ARCH-06. Architecture Evolves
**Lineage:** Evolutionary Architecture — guided, incremental change across multiple dimensions. 초기 설계를 고정하지 않는다. 새로운 evidence와 quality pressure에 따라 의사결정을 재평가한다. 중요한 architectural characteristic은 가능한 경우 **fitness function**으로 지속 관찰·검증한다. 변화는 무제한 자유가 아니라 중요한 특성을 보호하는 **guided incremental change**다. **실패 조건:** 미래의 모든 변화에 대비한 과잉 설계.

---

## 7. Structural Baseline — Clean Architecture (canon-stance.md + clean-layer-convention.md 정규 내용 흡수)

> `program-design/sw-architecture-canon-stance.md`와 `program-design/clean-layer-convention.md`는 portfolio-level에서는 superseded되었으나 SW-Architecture 고유 내용은 여전히 유효하다. 두 문서의 정규 핵심(Clean Architecture를 structural baseline으로, Policy vs Detail 분리, 두 문서가 나열한 실패 조건)을 여기에 흡수한다 — `program-design/`은 이 마이그레이션 게이트 통과 후 삭제될 예정이므로 링크만으로 남기지 않는다. Java package 구조의 상세본은 `references/verified-sources.md`에 원형 보존한다.

### 7.1 Clean Architecture를 사용하는 방식 (canon-stance.md §2.B, 원문)

Clean Architecture를 기본 structural lens로 사용한다.

핵심:
- Separation of Concerns
- Policy vs Detail
- Dependency Rule
- Use Case / Application boundary
- Framework / UI / DB를 replaceable detail로 취급

**가르치지 않을 방식:**
- 동심원 그림 암기
- 4개 layer 이름 강제
- 모든 시스템에 동일 package structure 강제
- Clean Architecture = 모든 Software Architecture

### 7.2 의존성 규칙 (clean-layer-convention.md §1, 원문 — 불변)

> **소스 코드 의존성은 오직 안쪽을 향한다. 안쪽 레이어는 바깥 레이어를 알지 못한다.**

이 한 줄이 전 과정의 축이다. 모든 패턴 문서는 "이 패턴이 의존성 규칙을 어떻게 지키는가"로 정당화된다. 위반 예: 도메인이 JPA·HTTP·프레임워크 타입을 import 하는 순간 규칙이 깨진다.

### 7.3 네 개의 레이어 (clean-layer-convention.md §2, 요지 보존 — 상세 패키지 규약은 references/verified-sources.md)

| 레이어 | 담는 것 | 아는 것 | 금지 |
|---|---|---|---|
| Domain (엔티티) | 엔티티, 값 객체, 도메인 서비스, 도메인 이벤트, 불변식 | 순수 언어·표준 라이브러리 | 프레임워크·영속성·전송·DI 어노테이션 일체 |
| Application (유스케이스) | 유스케이스 인터랙터, 입력·출력 포트, 리포지토리·협력자 인터페이스 | Domain | 규칙 로직(두면 빈혈 도메인이 된다) — 오케스트레이션만 |
| Interface Adapters (어댑터) | 컨트롤러, 프레젠터, 게이트웨이·리포지토리 구현, DTO, 매퍼 | Application·Domain | 프레임워크 배선 세부 |
| Frameworks & Drivers (인프라) | 웹 프레임워크, DB, 메시징, 외부 SDK, DI 배선(합성 루트) | 전부 | — (가장 자주 바뀌고 가장 바깥) |

### 7.4 경계 넘기 규칙 (clean-layer-convention.md §4, 원문)

- **데이터**: 레이어 경계는 DTO로만 넘긴다. 도메인 객체를 어댑터 밖으로 유출하지 않는다.
- **제어 흐름**: 밖 → 안(컨트롤러가 유스케이스를 호출).
- **의존성**: 안 ← 밖. 안쪽이 바깥을 필요로 하면 **안쪽에 인터페이스(포트)를 두고 바깥이 구현**한다(DIP).
- 인터페이스 소유 위치: 포트·리포지토리 인터페이스는 Application(안), 구현은 Adapters(밖).

### 7.5 Time Dimension — Evolutionary Architecture (canon-stance.md §2.C, 원문)

Architecture는 고정 blueprint가 아니다.

핵심:
- guided incremental change
- architectural characteristics
- fitness functions
- continuous evaluation
- multiple dimensions of change

`Decision → Implement → Measure → Fitness → Adapt`

### 7.6 Failure Conditions (canon-stance.md §7, 원문 — 정규 실패 조건 목록 전체 보존)

- Clean Architecture package 이름만 복제하고 dependency direction은 위반
- Quality Attribute 없이 style을 먼저 선택
- Architecture Decision을 다이어그램으로 대체
- Fitness Function 없이 "evolutionary"라는 이름만 사용
- 미래 변화 전체를 예측하려는 과잉 추상화
- 변화 대응을 이유로 architecture governance를 제거

---

## 8. Trade-offs / Failure Conditions (Course-level, context baseline §9 표 원문)

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Driver before Structure | 분석 시간이 들지만 Fashion-driven Architecture 방지 | 기술/Style을 먼저 고름 |
| Policy protected from Detail | 경계/간접성 비용 증가 | Dependency가 Framework/DB에 끌림 |
| Scenario-based Quality | 작성 비용 증가, 검증 가능성 향상 | "고성능/고가용" 같은 형용사만 사용 |
| Evaluate Decisions | 초기 비용 증가, 큰 재작업 감소 | Diagram Review만으로 평가 |
| Guided Evolution | 지속 측정 비용 필요 | Evolution을 무계획 변경으로 사용 |

## 9. Evidence of Learning (context baseline §10, 원문)

- Architecture Drivers
- Quality Attribute Scenarios 2개 이상
- 후보 Architecture Options
- 선택과 Trade-off
- Dependency/Boundary Model
- Architecture Rule 1개 이상
- Fitness Function 1개 이상
- Change Impact/Evolution Decision

## 10. Learning Outcomes (context baseline §8, 원문)

1. Business/Technical Driver를 Architecture Driver로 정리한다.
2. QA Scenario를 작성하고 후보 구조를 비교한다.
3. Policy/Detail과 Dependency Direction을 설계한다.
4. Style/Tactic을 Trade-off와 함께 선택한다.
5. ADR과 Lightweight Evaluation으로 결정 근거를 남긴다.
6. Fitness/Conformance를 통해 Architecture Intent를 보호한다.
7. Change Request에 따라 Architecture를 점진적으로 진화시킨다.

---

## 11. Curriculum Progression / Priority / Rationale / Coverage Intent (서술 — 세션 번호·시간표는 curriculum.md 소유)

> 과정 설계 지침 §2-a 규칙에 따라 progression/priority/rationale/coverage-intent만 서술한다. 세션 번호·시간표는 `courses/sw-architecture/curriculum.md`(정본, 실제 16교시 구조)의 몫이며 여기서 복제하지 않는다.

**Progression 의도(context baseline Curriculum Backbone 4-Part 구조의 rationale):**
1. **Why/Decide** — Architecture를 Decision으로 정의하고, Driver/Constraint를 거쳐 Quality Attribute를 Scenario로 구체화한 뒤 Trade-off/Tactic/Alternative를 비교하는 순서로 시작한다. 구조 선택보다 판단 근거가 먼저다.
2. **Structure** — Object Responsibility에서 System Structure로 이어지는 최소 OO 재정박을 거쳐, Policy vs Detail/Dependency Inversion → Clean Architecture/Dependency Rule → Application Boundary/Port/Adapter 순으로 구조를 세운다.
3. **Evaluate** — Style/Tactic 선택(카탈로그가 아니라 선택 기준으로), Architecture Decision/ADR, Scenario-based Evaluation/ATAM Orientation, 그리고 결정과 평가를 통합하는 Lab으로 이어진다.
4. **Enforce & Evolve** — Architecture Rule/Conformance/Fitness Function으로 강제력을 만들고, Evolutionary Architecture와 Change Impact Lab을 거쳐 MSA로의 Forward로 마무리한다.

**Topic Priority(무엇이 무거운가):** context baseline은 Quality Attribute & Scenarios, Clean Architecture/Dependency Rule, Scenario-based Evaluation/ATAM Orientation, Architecture Rules/Fitness Functions에 가장 큰 비중을 둔다 — 이 네 topic이 Course Thesis의 세 축(Decision Basis / Structural Baseline / Time Dimension)을 각각 담당하기 때문이다.

**실제 커리큘럼과의 관계:** `courses/sw-architecture/curriculum.md`(정본)는 이 progression을 Structural Baseline 축에 강하게 배분한다 — 최소 OO 재정박(부1) → Spaghetti 진단(부2) → TS 전환(부2) → Rich Domain 전환 + DIP/Port 도입(부3, "이 과정의 심장") → 캡슐화 게이트(ArchUnit)/도메인 이벤트/반례(부4) → MSA 티저(부5) → 종합(부6)의 순서다. 이는 context baseline의 Part 2(Structure)를 실제 코드 리팩토링 실습으로 심화 구현한 것이며, Decision Basis 축(QA Scenario·대안 비교·ADR)은 Practice Pack(§4 Critical Gap 참조)이 보강한다.

**Coverage Intent:** 학습자는 과정을 마칠 때 (1) Driver→QA Scenario→구조 대안 비교의 판단 축, (2) Policy/Detail 분리와 Dependency Rule을 실제 코드에서 식별·적용하는 능력, (3) Fitness Function/ADR로 결정을 검증 가능한 형태로 남기는 습관, 세 가지를 모두 갖추어야 한다. 어느 하나만으로는 Course Thesis를 충족하지 않는다.

**Source Baseline (context baseline §12, 원문):** SEI/CMU Quality Attribute·ATAM 계보, Robert C. Martin의 Dependency Rule/Clean Architecture, Ford/Parsons/Kua의 Evolutionary Architecture를 주요 기준으로 사용한다.

---

## 12. Cross-course Interfaces

### Bridges Forward

- **→ MSA:** SWA는 분산 여부의 구조·품질 trade-off를 준비한다. MSA가 Service Boundary, distributed contract, failure, operation을 소유한다(canon-stance.md §5). 실제 커리큘럼은 이를 MSA 티저(부5)로 명시적으로 예고하되 가르치지 않는다 — 이름만 예고.
- **→ AI-Native:** SWA Policy / Fitness Gate → AI Guardrail / Deterministic Gate(concept-ownership.md §9 Cross-Course Re-anchor Map).

### Uses (RECAP/APPLY from prior courses)

- **← OOAD:** Responsibility ───→ SWA Component Responsibility. OOAD DIP ───→ SWA Dependency Rule(concept-ownership.md §9). Cohesion/Coupling·SOLID/DIP는 SWA에서 EXTEND된다.
- **← DDD:** DDD Domain Model ───→ SWA Protection/Placement(concept-ownership.md §9). "DDD가 Domain Model을 소유한다. SWA는 이미 정의된 Domain Model / Use Case policy를 **어디에 배치하고 무엇으로부터 보호할지**를 다룬다"(canon-stance.md §4).

### Related Courses

- **Modern SWQM:** SWA가 Architecture Fitness / Conformance의 기술적 의미를 소유한다. QM은 이러한 evidence/gate가 조직의 quality system에서 지속 실행되는 방식을 다룬다(canon-stance.md §6). Quality Gate는 cross-course mechanism이며 SWA는 그중 "architecture fitness / conformance gate" 부분만 소유한다(concept-ownership.md §14).
- **Prerequisite Policy(concept-ownership.md §11):** Prerequisite recommended, never assumed. SWA의 Minimum Recap: Cohesion / Coupling / DIP / Domain Model의 최소 의미.

### Portfolio Alignment (context baseline, 원문)

- **OWNER:** Architecture drivers, quality-attribute decisions, structural boundaries/dependencies, architecture evaluation/fitness/evolution.
- **Key Consumers:** MSA, AI-Native, DevOps, DT→AX.
- **Boundary:** Domain semantics belong to DDD; delivery flow belongs to DevOps.

---

## 13. Course Quality Gate (context baseline §13, 원문 — self-check용, curriculum 승인 전 확인)

- Driver가 Structure보다 먼저인가?
- QA Scenario가 실제 판단에 사용되는가?
- Style Catalog가 아닌가?
- Evaluation/Fitness/Evolution이 포함되는가?
- MSA/DevOps OWNER를 침범하지 않는가?
