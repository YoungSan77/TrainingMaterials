# SW 아키텍처 설계 실무 — Unified Baseline v2.6

> **Course ID:** sw-architecture  
> **Duration:** 16h 운영 기준  
> **Instructional time:** 약 800분 + 휴식 약 160분  
> **Status:** Baseline  
> **Portfolio Category:** Architecture & Evolution  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 16시간 / 총 운영 960분 이내 / 권장 순수 학습 800분
- **Portfolio:** Architecture & Distribution

## 1. Course Thesis
> 중요한 Quality Attribute와 Constraint를 만족하도록 시스템 구조와 의존성을 선택하고, 중요한 Policy를 volatile detail로부터 보호하며, 그 선택을 Evidence로 검증하고 변화에 따라 지속적으로 진화시킨다.

## Learner & Context Fit

- **Audience / Work Context:** 시스템 수준의 구조적 결정을 내려야 하는 개발 리더·아키텍트·설계자.
- **Current Capability / Failure Mode:** pattern/diagram을 architecture로 오해하거나 quality driver 없이 구조를 선택한다.
- **Target Capability:** driver·quality·constraint를 근거로 구조적 대안을 비교하고 검증·진화시킨다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Empiricism / Scientific Thinking.
- **Why:** 전체 quality interaction을 보고 architecture hypothesis를 evidence/fitness로 계속 검증한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 시스템을 어떤 구조 단위로 나눌 것인가?
- 어떤 Dependency Direction이 중요한 Policy를 보호하는가?
- 기능적으로 가능한 여러 대안 중 무엇을 선택할 것인가?
- Performance/Availability/Modifiability/Security 등 competing quality를 어떻게 Trade-off할 것인가?
- Architecture Intent가 시간이 지나도 유지되는지 어떻게 검증할 것인가?

## 3. Core Narrative
`Drivers → Quality/Constraints → Policy vs Detail → Decomposition → Dependency → Boundary/Interface → Style/Tactic/Alternative → Decision/Trade-off → Enforcement → Evaluation → Evolution`

## 4. Three Anchors
1. **Decision Basis:** Quality Attribute Scenario / Constraint / Trade-off
2. **Structural Baseline:** Policy vs Detail / Dependency Rule / Clean Architecture lens
3. **Time Dimension:** Fitness Function / Conformance / Evolutionary Architecture

## 5. Decisions Learner Must Make
1. 어떤 Driver가 Architecture Decision을 중요하게 만드는가?
2. Quality Attribute를 검증 가능한 Scenario로 어떻게 바꾸는가?
3. 어떤 Policy를 어떤 Detail로부터 보호하는가?
4. Dependency는 어느 방향으로 흐르고 왜 그런가?
5. 후보 구조의 Gain/Cost/Risk는 무엇인가?
6. 어떤 Architecture Characteristic을 지속 보호해야 하는가?
7. 무엇을 자동/반자동 Fitness Function으로 검증할 것인가?
8. 새로운 Evidence가 생기면 어떤 결정을 바꿀 것인가?

## 6. Course Scope
### OWNER
Architecture Driver, Quality Attribute/Scenario, Architectural Characteristic, Decomposition, Module/Component, System-level Dependency Rule, Clean Architecture, Application Boundary, Port/Adapter, Style/Tactic Selection, ADR, Trade-off, Evaluation, Fitness Function, Conformance, Evolutionary Architecture, Change Impact.

### APPLY
OOAD Responsibility/Cohesion/Coupling/DIP, DDD Domain Model/BC, QM Evidence.

### NON-SCOPE / FORWARD
DDD Tactical 정의, MSA Distributed Pattern Catalog, CI/CD 운영, Platform Engineering 상세, AI Guardrail/Harness 정의.

## 7. Key Distinctions
- Architecture ≠ Diagram
- Clean Architecture ≠ Architecture 전체
- Dependency Rule ≠ DI Framework
- Style ≠ Tactic
- Quality Attribute ≠ 모호한 형용사
- QA Scenario ≠ Functional Use Case
- Module ≠ Runtime Service
- Fitness Function ≠ Generic KPI
- Evolutionary Architecture ≠ No Upfront Architecture

## 8. Learning Outcomes
1. Business/Technical Driver를 Architecture Driver로 정리한다.
2. QA Scenario를 작성하고 후보 구조를 비교한다.
3. Policy/Detail과 Dependency Direction을 설계한다.
4. Style/Tactic을 Trade-off와 함께 선택한다.
5. ADR과 Lightweight Evaluation으로 결정 근거를 남긴다.
6. Fitness/Conformance를 통해 Architecture Intent를 보호한다.
7. Change Request에 따라 Architecture를 점진적으로 진화시킨다.

## 9. Principles / Trade-off / Failure
| Principle | Trade-off | Failure Condition |
|---|---|---|
| Driver before Structure | 분석 시간이 들지만 Fashion-driven Architecture 방지 | 기술/Style을 먼저 고름 |
| Policy protected from Detail | 경계/간접성 비용 증가 | Dependency가 Framework/DB에 끌림 |
| Scenario-based Quality | 작성 비용 증가, 검증 가능성 향상 | “고성능/고가용” 같은 형용사만 사용 |
| Evaluate Decisions | 초기 비용 증가, 큰 재작업 감소 | Diagram Review만으로 평가 |
| Guided Evolution | 지속 측정 비용 필요 | Evolution을 무계획 변경으로 사용 |

## 10. Evidence of Learning
- Architecture Drivers
- Quality Attribute Scenarios 2개 이상
- 후보 Architecture Options
- 선택과 Trade-off
- Dependency/Boundary Model
- Architecture Rule 1개 이상
- Fitness Function 1개 이상
- Change Impact/Evolution Decision

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **7개**, Day 1 3개 / Day 2 4개, 총 약 **160분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/03_sw-architecture/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T03 | Quality Attribute Scenario | 20분 | 막연한 품질 요구를 검증 가능한 scenario로 어떻게 바꿀 것인가 |
| P2 | T04/T05 | Structure Alternatives & Trade-offs | 25분 | driver에 대해 어떤 구조 대안이 무엇을 사고 무엇을 지불하는가 |
| P3 | T07 | Policy vs Detail Dependency | 20분 | 어떤 정책을 volatile detail에서 보호해야 하는가 |
| P4 | T10 | ADR from Decision Evidence | 20분 | 어떤 의사결정을 ADR로 남길 가치가 있는가 |
| P5 | T11/T12 | Scenario-based Architecture Evaluation | 25분 | 설계가 주요 scenario에서 어디서 깨질 수 있는가 |
| P6 | T13/T14 | Fitness Function / Conformance Rule | 25분 | 어떤 아키텍처 특성을 자동 검증할 가치가 있는가 |
| P7 | T15/T16 | Evolution Decision under New Evidence | 25분 | 새 evidence가 나왔을 때 어떤 결정을 유지/변경할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 11. Curriculum Backbone — 16 Topics / 권장 순수 학습 800분

### Part 1 — Why / Decide
1. Architecture as Decisions, not Diagrams — **35분**
2. Drivers / Constraints — **45분**
3. Quality Attributes & Scenarios — **55분**
4. Trade-offs / Tactics / Alternatives — **50분**

### Part 2 — Structure
5. From Object Responsibility to System Structure — **40분**
6. Policy vs Detail / Dependency Inversion — **50분**
7. Clean Architecture / Dependency Rule — **55분**
8. Application Boundary / Port / Adapter — **50분**

### Part 3 — Evaluate
9. Styles and Tactics — Selection, not Catalog — **45분**
10. Architecture Decision / ADR / Trade-off — **55분**
11. Scenario-based Evaluation / ATAM Orientation — **60분**
12. Lab — Architecture Decision & Evaluation — **70분**

### Part 4 — Enforce & Evolve
13. Architecture Rules / Conformance / Fitness Functions — **55분**
14. Evolutionary Architecture — **50분**
15. Change Impact / Evolution Lab — **45분**
16. Integrated Review / MSA Forward — **40분**

## 12. Source Baseline
SEI/CMU Quality Attribute·ATAM 계보, Robert C. Martin의 Dependency Rule/Clean Architecture, Ford/Parsons/Kua의 Evolutionary Architecture를 주요 기준으로 사용한다.

## 13. Quality Gate
Driver가 Structure보다 먼저인가, QA Scenario가 실제 판단에 사용되는가, Style Catalog가 아닌가, Evaluation/Fitness/Evolution이 포함되는가, MSA/DevOps OWNER를 침범하지 않는가를 확인한다.

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## Portfolio Alignment v2.6
- **OWNER:** Architecture drivers, quality-attribute decisions, structural boundaries/dependencies, architecture evaluation/fitness/evolution.
- **Key Consumers:** MSA, AI-Native, DevOps, DT→AX.
- **Boundary:** Domain semantics belong to DDD; delivery flow belongs to DevOps.
