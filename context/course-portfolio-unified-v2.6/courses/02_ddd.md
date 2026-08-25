# 도메인 주도 설계 개요와 실무 (DDD) — Unified Baseline v2.6

> **Course ID:** ddd  
> **Duration:** 8h 운영 기준  
> **Instructional time:** 약 400분 + 휴식 약 80분  
> **Status:** Baseline  
> **Portfolio Category:** Engineering Foundations  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 8시간 / 총 운영 480분 이내 / 권장 순수 학습 400분
- **Portfolio:** Engineering Foundations

## 1. Course Thesis
> 도메인의 개념·규칙·언어·경계를 명시적인 모델로 만들고, 모델과 구현이 함께 진화하도록 설계한다.

## Learner & Context Fit

- **Audience / Work Context:** 도메인 복잡성을 모델과 코드로 다루는 개발자·설계자·아키텍트.
- **Current Capability / Failure Mode:** 데이터 구조나 기술 구조 중심으로 모델링하고 언어·불변식·경계의 의미가 분산된다.
- **Target Capability:** 도메인 의미·규칙·경계를 명시하고 모델링 선택을 실제 사례와 evidence로 수정한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Design Thinking; Empiricism / Scientific Thinking.
- **Why:** 사용 맥락과 의미를 먼저 발견하고, 경계/상호작용을 전체로 보며 모델 가설을 사례로 검증한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 같은 용어가 조직/시스템마다 다른 의미를 갖는다.
- 중요한 Business Rule이 코드·문서·DB·서비스에 흩어진다.
- 모델과 구현이 분리되어 시간이 갈수록 의미가 붕괴한다.
- 어떤 Rule을 함께 즉시 보호해야 하는지 불분명하다.
- 조직/시스템 간 Model Meaning이 충돌한다.

## 3. Core Narrative
`Domain Discovery → Ubiquitous Language → Domain Model → Model-Driven Design → Entity/VO → Invariant → Aggregate → Domain Interaction → Bounded Context → Context Relationship → Model Evolution`

## 4. Decisions Learner Must Make
1. 핵심 Domain Concept와 Vocabulary는 무엇인가?
2. 어떤 Business Rule을 Model 안에서 보호해야 하는가?
3. Entity와 Value Object를 어떻게 구분하는가?
4. 어떤 Invariant가 Aggregate Boundary를 정당화하는가?
5. Domain Service/Repository/Domain Event가 언제 필요한가?
6. 하나의 Language/Model이 더 이상 일관되지 않는 Boundary는 어디인가?
7. Context 간 Translation/Protection이 어디에 필요한가?

## 5. Course Scope
### OWNER
Domain/Subdomain, Ubiquitous Language, Domain Model, Model-Driven Design, Entity, Value Object, Domain Invariant, Aggregate, Domain Service, Repository Concept, Domain Event, Event Storming, Bounded Context, Context Mapping, Model Evolution.

### RECAP / APPLY
OOAD Responsibility, DbC, GRASP, Cohesion/Coupling.

### NON-SCOPE / FORWARD
- Bounded Context = Microservice 결정 금지
- Application/Infrastructure Dependency Rule 상세 → SW Architecture
- Distributed Transaction/Saga/Outbox → MSA
- AI Context/Guardrail/Harness → AI-Native
- Ontology 구현 기술 → 별도/AI 연계

## 6. Key Distinctions
- DDD ≠ OOAD 대체물
- Domain ≠ Application
- Subdomain ≠ Bounded Context
- Analysis Model ≠ Domain Model
- Entity ≠ ORM Entity
- Value Object ≠ DTO
- Aggregate ≠ Object Graph
- Domain Service ≠ Application Service
- Repository ≠ DAO
- Domain Event ≠ Integration Event
- Bounded Context ≠ Microservice

## 7. Learning Outcomes
수강 후 학습자는:
1. Domain Discovery와 공통 Vocabulary를 통해 핵심 의미를 드러낸다.
2. Domain Model과 Implementation을 연결한다.
3. Invariant를 근거로 Entity/VO/Aggregate를 설계한다.
4. Domain Service/Repository/Domain Event의 필요 여부를 판단한다.
5. Bounded Context와 Context Relationship을 식별한다.
6. Model Change를 Code/Design에 반영하며 진화시킨다.

## 8. Principles / Trade-off / Failure
| Principle | Trade-off | Failure Condition |
|---|---|---|
| Model-Driven Design | 모델 유지 비용 증가, 의미 일관성 향상 | 모델은 문서에만 있고 Code는 별개 |
| Ubiquitous Language | 합의 비용 증가, 의미 충돌 감소 | 용어집 작성으로 축소 |
| Aggregate = Consistency Boundary | 접근 편의성 감소, Invariant 보호 | Object Graph 묶음으로 설계 |
| Bounded Context | Translation 비용 발생, 모델 충돌 국소화 | 조직도/서비스 목록을 그대로 BC로 사용 |
| DDD Selectively | 복잡한 Domain에 집중 가능 | 단순 CRUD에 전면 적용하여 과설계 |

## 9. Exercise Evidence
Order Domain 기준:
- Domain Vocabulary
- 핵심 Domain Model
- Entity/VO 구분
- Domain Invariant 2개 이상
- Aggregate Boundary와 근거
- Domain Service 필요 여부
- Domain Event
- Bounded Context Candidate
- Context Relationship
- Model Evolution Scenario

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **4개**, 1일 4개, 총 약 **90분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/02_ddd/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T02 | Domain Language from Messy Requirements | 20분 | 어떤 용어·개념을 공유 언어로 채택하고 무엇을 질문으로 남길 것인가 |
| P2 | T04 | Entity / Value Object / Invariant Decision | 25분 | 정체성·값·불변식 기준으로 모델 요소를 어떻게 구분할 것인가 |
| P3 | T05 | Aggregate Boundary under Consistency Pressure | 25분 | 어떤 규칙이 즉시 함께 지켜져야 하며 aggregate 경계를 어디에 둘 것인가 |
| P4 | T07/T08 | Bounded Context & Model Evolution | 20분 | 의미 충돌을 어떤 context 경계로 보호하고 통합 관계를 어떻게 둘 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 10. Curriculum Backbone — 8 Topics / 권장 순수 학습 400분
1. Why DDD — OOAD 계보와 DDD가 필요한 문제 — **35분**
2. Domain / Subdomain / Ubiquitous Language / Discovery — **50분**
3. Domain Model & Model-Driven Design — **50분**
4. Entity / Value Object / Domain Invariant — **50분**
5. Aggregate — Consistency Boundary와 Trade-off — **60분**
6. Domain Service / Repository / Domain Event — **45분**
7. Bounded Context / Context Mapping — **65분**
8. Integrated Modeling Workshop — Model Evolution + MSA/AI Forward — **45분**

### Awareness 1~5분
Event Storming 확장 기법, Supple Design 주요 개념, Explicit Semantics/Ontology Bridge.

## 11. Source Baseline
Eric Evans의 저작을 DDD의 Foundational Work로 두고 Martin Fowler, Vaughn Vernon 등은 보완 설명과 확장 관점에 사용한다. OO Foundation은 Wirfs-Brock, Meyer, Larman 계보를 재사용한다.

## 12. Quality Gate
- Pattern Catalog로 축소되지 않는가?
- UL이 Glossary로 축소되지 않는가?
- Aggregate가 Object Grouping으로 오해되지 않는가?
- BC를 Microservice와 동일시하지 않는가?
- Domain Event와 Integration Event를 구분하는가?

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## Portfolio Alignment v2.6
- **OWNER:** Ubiquitous Language, rich Domain Model, Entity/Value Object/Aggregate/Invariant, Domain Service/Repository/Domain Event, Bounded Context/Context Mapping.
- **Key Inputs:** OOAD modeling and responsibility concepts.
- **Boundary:** Architecture structure is SW Architecture; distributed service operation is MSA.
