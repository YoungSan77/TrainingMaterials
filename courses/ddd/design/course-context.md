# DDD — Course Context

> **Course ID:** ddd
> **Pipeline stage:** Course Design (Stage 1) — `guides/과정_설계_지침.md`가 정하는 절차의 산출물.
> **Authority order:** `portfolio/*.md`(Portfolio Canon) → 이 문서 → `courses/ddd/curriculum.md`(실제 8교시 커리큘럼, 이 문서가 대체하지 않음).
> **Source of Learner & Context Fit / Lens Alignment:** `context/course-portfolio-unified-v2.6/courses/02_ddd.md`(Unified Baseline v2.6) — §3 규칙에 따라 그대로 가져오며 요약·재작성하지 않는다.
> **Non-goal:** 이 문서는 `courses/ddd/curriculum.md`의 세션 번호·시간표·교시 구성을 재정의하지 않는다. Curriculum이 이미 그 정보의 SSOT다. 아래 "Known Gap" 절은 서술로만 존재하며 curriculum.md를 직접 수정하지 않는다.

---

## 1. Course Purpose

도메인의 개념·규칙·언어·경계를 명시적인 모델로 만들고, 모델과 구현이 함께 진화하도록 설계하는 판단을 훈련한다. DDD는 OOAD의 대체물이 아니라, OOAD가 세운 책임·협력·계약 사고 위에서 domain meaning, model-driven design, invariant, aggregate, bounded context를 심화하는 과정이다.

## 2. Target Learner

도메인 복잡성을 모델과 코드로 다루는 개발자·설계자·아키텍트. (Baseline `Audience / Work Context` verbatim — 아래 §3 참조)

## 3. Learner & Context Fit

> `context/course-portfolio-unified-v2.6/courses/02_ddd.md`의 "Learner & Context Fit"에서 그대로 가져온다 (지침 §3: 기존 baseline이 이미 채운 절이므로 요약/재작성하지 않는다).

- **Audience / Work Context:** 도메인 복잡성을 모델과 코드로 다루는 개발자·설계자·아키텍트.
- **Current Capability / Failure Mode:** 데이터 구조나 기술 구조 중심으로 모델링하고 언어·불변식·경계의 의미가 분산된다.
- **Target Capability:** 도메인 의미·규칙·경계를 명시하고 모델링 선택을 실제 사례와 evidence로 수정한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 4. Capability Gap / Typical Failure

Baseline "2. Problem It Owns"에서 그대로 가져온 문제 정의:

- 같은 용어가 조직/시스템마다 다른 의미를 갖는다.
- 중요한 Business Rule이 코드·문서·DB·서비스에 흩어진다.
- 모델과 구현이 분리되어 시간이 갈수록 의미가 붕괴한다.
- 어떤 Rule을 함께 즉시 보호해야 하는지 불분명하다.
- 조직/시스템 간 Model Meaning이 충돌한다.

**Typical Failure Mode (Current Capability 관점):** 학습자는 데이터 구조나 기술 구조를 중심으로 모델링하며, 그 결과 언어·불변식·경계의 의미가 코드·문서·DB·서비스 여러 곳에 흩어진 채로 방치된다.

## 5. Target Capability

교육 후 학습자는:
1. Domain Discovery와 공통 Vocabulary를 통해 핵심 의미를 드러낸다.
2. Domain Model과 Implementation을 연결한다.
3. Invariant를 근거로 Entity/VO/Aggregate를 설계한다.
4. Domain Service/Repository/Domain Event의 필요 여부를 판단한다.
5. Bounded Context와 Context Relationship을 식별한다.
6. Model Change를 Code/Design에 반영하며 진화시킨다.

(Baseline "7. Learning Outcomes" verbatim)

## 6. Course Thesis

> 도메인의 개념·규칙·언어·경계를 명시적인 모델로 만들고, 모델과 구현이 함께 진화하도록 설계한다.

(Baseline "1. Course Thesis" verbatim)

## 7. Core Narrative

`Domain Discovery → Ubiquitous Language → Domain Model → Model-Driven Design → Entity/VO → Invariant → Aggregate → Domain Interaction → Bounded Context → Context Relationship → Model Evolution`

이 Narrative는 **intended coverage/sequencing rationale**을 나타내는 것이지, `courses/ddd/curriculum.md`의 실제 8교시 목차를 대체하지 않는다. 실제 커리큘럼의 세션 배치·교시 수·시간 배분은 curriculum.md가 SSOT다. (지침 §2-a: "세션 번호·시간표·구체적 커리큘럼 구조는 옮기지 않는다.")

**Sequencing rationale (baseline "6. Recommended Authoring Use"에서 계보만 인용):**
`Discovery → UL → Domain Model → Model-Driven Design → Entity/VO → Invariant/Aggregate → Domain Interaction → BC/Context Map → Model Evolution → Explicit Semantics`

**Topic priority (baseline "10. Curriculum Backbone"이 부여한 상대적 비중 — 무게 배분만 인용, 세션 번호는 curriculum.md 소관):** Aggregate(Consistency Boundary와 Trade-off)가 baseline 상 가장 무거운 단일 topic이며, Bounded Context/Context Mapping이 그다음으로 무겁다. 이는 `courses/ddd/curriculum.md`가 이미 "무게 중심은 애그리거트 경계 설계"로 독립적으로 도달한 결론과 방향이 일치한다.

## 8. Decisions Learner Must Make

(Baseline "4. Decisions Learner Must Make" verbatim)

1. 핵심 Domain Concept와 Vocabulary는 무엇인가?
2. 어떤 Business Rule을 Model 안에서 보호해야 하는가?
3. Entity와 Value Object를 어떻게 구분하는가?
4. 어떤 Invariant가 Aggregate Boundary를 정당화하는가?
5. Domain Service/Repository/Domain Event가 언제 필요한가?
6. 하나의 Language/Model이 더 이상 일관되지 않는 Boundary는 어디인가?
7. Context 간 Translation/Protection이 어디에 필요한가?

## 9. Course Scope — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

`portfolio/concept-ownership.md` §4 (DDD Ownership)와 §2 (Coverage Matrix)를 이 과정에 구체화한다. 이것이 **canonical target state**다 — 아래 §14 "Known Gap"에서 다루듯, 현재 `courses/ddd/curriculum.md`는 이 중 일부(전술 어휘)를 아직 교육하지 않는다. 이 절은 그 좁은 현재 범위에 맞춰 축소하지 않는다.

### OWNER (canonical, `concept-ownership.md` §4)

- Domain / Subdomain
- Ubiquitous Language
- Domain Model
- Entity / Value Object
- (Domain) Invariant
- Aggregate / Aggregate Root
- Domain Service
- Repository concept
- Domain Event
- Event Storming / discovery
- Bounded Context
- Context Mapping

Coverage Matrix(§2)의 세부 항목: `Domain / Ubiquitous Language`, `Entity / VO / Aggregate / Invariant`, `Domain Service / Repository / Domain Event`, `Bounded Context / Context Mapping` — 4개 concept family 모두 DDD가 **OWNER**다.

### RECAP (from OOAD)

- OOAD Responsibility
- Design by Contract (Precondition/Postcondition/Object Invariant)
- GRASP
- Cohesion/Coupling

`portfolio/terminology.md` §B "Object Invariant ≠ Domain Invariant" 구분에 따라, RECAP되는 것은 **Object Invariant**(OOAD OWNER)이고 DDD가 새로 OWNER로 가르치는 것은 **Domain Invariant**다 — 이름이 겹치는 다른 개념이므로 recap 시점에 명시적으로 구분한다.

### BRIDGE

- Semantic Model / Ontology 필요성
- Domain Model과 Ontology의 차이

(`concept-ownership.md` §4 BRIDGE, terminology.md §H "Domain Model ≠ Ontology")

### APPLY (DDD가 소비하는 타 과정 OWNER 개념)

- Coverage Matrix(§2)상 DDD는 `Modeling fundamentals`, `Object/Responsibility/Collaboration`, `Cohesion/Coupling`, `SOLID/DIP`에서 OOAD를 APPLY한다 — 정의를 재정의하지 않고 domain 문제에 적용한다.

### FORWARD (DDD가 이후 과정으로 예고만 하는 것)

- Architecture Drivers/Quality Attributes, Module/Component/Dependency, Port/Adapter/Application Boundary, Architecture Decision/Evaluation/Fitness → SW Architecture
- Distributed communication/consistency/failure, Modular Monolith, Service Boundary/Extraction → MSA
- Guardrail/Harness, Agent/HITL/Autonomy → AI-Native

### NON-SCOPE

(Baseline "5. Course Scope — NON-SCOPE / FORWARD" verbatim)

- Bounded Context = Microservice 결정 금지
- Application/Infrastructure Dependency Rule 상세 → SW Architecture
- Distributed Transaction/Saga/Outbox → MSA
- AI Context/Guardrail/Harness → AI-Native
- Ontology 구현 기술 → 별도/AI 연계

## 10. Key Distinctions

`portfolio/terminology.md` §H "반드시 구분할 쌍" 중 DDD가 해당하는 쌍 + baseline "6. Key Distinctions"를 합성한다.

| A | B | 핵심 차이 |
|---|---|---|
| Analysis Model | Domain Model | 문제 이해 모델 vs domain-centric rule/behavior model |
| Entity | ORM Entity | Domain identity vs persistence mechanism |
| Domain Service | Application Service | Domain rule vs use-case orchestration |
| Domain Model | Ontology | 문제 해결 모델 vs explicit semantic model |
| Subdomain | Bounded Context | problem space vs model boundary |
| Bounded Context | Microservice | semantic boundary vs deployment/operation boundary |
| Domain Event | Integration Event | domain fact vs cross-boundary contract |

추가(baseline에서만 등장, terminology.md §C 정의와 정합):
- DDD ≠ OOAD 대체물
- Domain ≠ Application
- Value Object ≠ DTO
- Aggregate ≠ Object Graph
- Repository ≠ DAO
- Object Invariant ≠ Domain Invariant (terminology.md §B, 위 §9 RECAP 참조)

## 11. Course-specific Principles (Child of `portfolio/principles.md` §C2)

**Primary Parent Lenses:** Systems Thinking / Design Thinking / Empiricism.

| Child Principle | Lineage | Statement |
|---|---|---|
| DDD-01 | Rich Domain Model / DDD | Put Domain Rules with the Model that Owns Them — Domain 상태와 불변식을 외부 Service에 흩뜨리지 않는다. 전제: 의미 있는 규칙과 상태 전이가 존재. 실패 조건: 단순 CRUD에 Rich Domain Model 강제. |
| DDD-02 | Eric Evans / DDD | Ubiquitous Language Is Executable Alignment — 대화·모델·코드에서 같은 Domain Language를 사용한다. 용어집만 만드는 것으로 끝나지 않는다. 실패 조건: 문서의 용어와 코드/대화가 분리. |
| DDD-03 | — | Invariants Define Consistency Boundaries — 함께 즉시 지켜야 할 규칙이 Aggregate boundary의 강한 근거다. Trade-off: 큰 Aggregate는 일관성을 단순화하지만 경합·확장 비용을 높인다. 실패 조건: 객체 참조 편의성으로 Aggregate를 정한다. |
| DDD-04 | — | Boundary Protects Meaning — Bounded Context는 특정 모델과 언어의 의미가 일관되는 경계다. 조직도나 서비스 목록을 그대로 복사하지 않는다. |
| DDD-05 | — | Domain Boundary ≠ Deployment Boundary — Bounded Context ≠ Microservice. Domain boundary는 의미를 보호하고, service boundary는 독립 실행·운영 비용까지 포함한다. 선택: Module / Modular Monolith / Service. |
| DDD-06 | — | Explicit Semantics before Ontology — Ontology 도구/형식보다 먼저 공유해야 할 Concept/Relation/Role/Constraint를 확인한다. 전제: 여러 시스템·조직·Agent 사이 의미 불일치 비용이 크다. 실패 조건: 단순 vocabulary에 formal ontology부터 도입. |

### Foundational Decision Lens Fit (`portfolio/principles.md` §A, DDD가 APPLY하는 것만)

`context/.../support/04_audit/01_portfolio-integrity-audit-v2.6.md` §4가 이미 확정한 판정을 그대로 가져온다 (지침 §4).

- **Systems (SYS-01/02):** domain interaction 전체와 boundary/interaction을 하나의 system으로 본다.
- **Design (DT-01/02):** domain discovery — 문제/의미를 먼저 이해한 뒤 모델을 만든다 (Prototype to Learn 정신은 모델 가설 검증에 대응).
- **Empiricism (EMP-01~05):** 모델을 가설로 다루고 실제 사례·evidence로 수정한다.

**Reviewer verdict (원문 인용):** "domain discovery, meaning, boundary, model hypothesis와 직접 연결된다. 적절함."

과정 형식상 5개 Lens를 모두 넣지 않는다. Lean/ToC는 DDD의 실제 판단(도메인 의미·경계)을 강화하지 않으므로 채택하지 않는다.

## 12. Trade-offs / Failure Conditions (Course-level)

Baseline "8. Principles / Trade-off / Failure" verbatim:

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Model-Driven Design | 모델 유지 비용 증가, 의미 일관성 향상 | 모델은 문서에만 있고 Code는 별개 |
| Ubiquitous Language | 합의 비용 증가, 의미 충돌 감소 | 용어집 작성으로 축소 |
| Aggregate = Consistency Boundary | 접근 편의성 감소, Invariant 보호 | Object Graph 묶음으로 설계 |
| Bounded Context | Translation 비용 발생, 모델 충돌 국소화 | 조직도/서비스 목록을 그대로 BC로 사용 |
| DDD Selectively | 복잡한 Domain에 집중 가능 | 단순 CRUD에 전면 적용하여 과설계 |

## 13. Cross-course Interfaces

### Bridges Forward (DDD → 후속 과정)
- SW Architecture: Bounded Context 이후의 구조적 dependency rule, module/component 설계.
- MSA: Bounded Context 후보 → Service 추출/분산 판단 (BC는 후보일 뿐, 이 과정에서 서비스로 자르지 않는다).
- AI-Native: Domain Model이 향후 AI Context/Guardrail의 truth source로 재사용될 수 있는 가능성만 예고, 구현은 다루지 않는다.

### Uses (DDD ← 선행 과정)
- OOAD: Object/Responsibility/Collaboration, Design by Contract(Precondition/Postcondition/Object Invariant), GRASP, Cohesion/Coupling를 최소 recap해 Domain 문제에 적용한다. `portfolio/cross-course-framework.md` §8 "DDD Lineage from OO Design" 참조.

### Related Courses
- SW Architecture / MSA: Bounded Context가 정렬될 수 있으나 동일하지 않은 두 개념(module boundary, service boundary)의 입력이 된다 (terminology.md §H).
- AI-Native: `Explicit Semantics / Ontology` BRIDGE 관계 (`concept-ownership.md` §2 Coverage Matrix, DDD-BRIDGE / AI-Native-BRIDGE).

## 14. Known Gap — Canonical Ownership vs Current Curriculum (surfaced, not fixed)

이 절은 **명시적으로 알려진 gap을 기록하기 위한 것**이며, `courses/ddd/curriculum.md`를 수정하는 작업이 아니다. Course Design은 canonical ownership을 축소해서 반영하지 않는다 (`guides/과정_설계_지침.md` 취지 및 이 작업의 명시적 지시).

**Gap:** `portfolio/concept-ownership.md` §4가 DDD를 **OWNER**로 확정한 개념 — Entity, Value Object, Domain Invariant, Aggregate/Aggregate Root, Domain Service, Repository concept, Domain Event — 의 정본 정의가 현재 `courses/ddd/curriculum.md`(8교시 modeling craft workshop)에는 없다.

현재 curriculum.md는 스스로를 다음과 같이 규정한다 (curriculum.md 원문, 읽기 전용 인용):
> "전술 문법(Entity·VO·Aggregate…)은 **OOAD 소유** — 여기선 안 가르친다."
> "소유: 모델링 craft — 이벤트 스토밍 · 애그리거트 경계 설계 · 컨텍스트 매핑(실습)."

그러나 `concept-ownership.md` §4 "Migration from Current"는 이 정확한 구조의 폐기를 이미 명시했다:
> "기존 '전술=OOAD, DDD=craft' 소유 구조는 폐기한다. 독립 과정이 되도록 **Domain Model + Tactical + Strategic**의 최소 정본 교육을 앞부분에 추가/재편한다."

그리고 OOAD 쪽(`concept-ownership.md` §3)도 이 전술 개념들을 OWNER로 갖지 않는다 — OOAD의 FORWARD 목록에 "Domain Model / DDD tactical concepts"가 있을 뿐이다. 즉 **두 과정 어느 쪽도 현재 이 개념군을 정본 교육하지 않는다.**

- 현재 커리큘럼이 **KEEP**하는 것(canon과 이미 정합): Event Storming(발견), Aggregate boundary 판단(경계 draw + trade-off), Context Mapping(그리기). 이 세 가지는 canon의 OWNER 범위 안에 있고 실습 품질도 유지된다.
- 현재 커리큘럼에 **없는** 것: Domain/Subdomain/Ubiquitous Language의 정본 정의, Domain Model/Model-Driven Design의 정본 도입, Entity/VO/Domain Invariant/Aggregate Root라는 **용어**의 정본 정의(판단 로직은 있으나 이름이 없음), Domain Service/Repository/Domain Event 세 tactical pattern 전체.

이 gap의 배경 분석은 `program-design/decisions/curriculum-canon-audit-v1.md`(HIGH priority, "없는 것이 아니라 완전히 빈 것")에 이미 기록되어 있다. 이 course-context.md는 그 audit의 결론을 반박하거나 무마하지 않고, canonical target(§9 OWNER)을 있는 그대로 명시하는 역할만 한다. **curriculum.md를 실제로 어떻게 확장할지(세션 추가, 1일 유지 vs 확장)는 Curriculum Authoring 단계(Stage 2)의 판단이며 이 문서의 범위 밖이다.**
