# 객체지향 분석과 설계 실무 (OOA/D) — Unified Baseline v2.6

> **Course ID:** ooad  
> **Duration:** 16h 운영 기준  
> **Instructional time:** 약 800분 + 휴식 약 160분  
> **Status:** Baseline  
> **Portfolio Category:** Engineering Foundations  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 16시간 / 총 운영 960분 이내 / 권장 순수 학습 800분
- **세션 원칙:** 주제 단위 14세션. 동일 시간으로 맞추지 않는다.
- **Portfolio:** Engineering Foundations

## 1. Course Thesis
> 현실의 문제를 모델·책임·계약·협력으로 구조화하고, 이를 구현 가능한 설계로 발전시키며 코드와 피드백을 통해 지속 개선한다.

## Learner & Context Fit

- **Audience / Work Context:** SW 개발자·설계자·분석가 등 객체지향 분석/설계 결정을 실제 모델과 코드 구조로 연결해야 하는 학습자.
- **Current Capability / Failure Mode:** 요구를 class/diagram으로 바로 변환하거나 책임·협력·계약보다 표기법/패턴에 의존하기 쉽다.
- **Target Capability:** 현실 문제를 개념·책임·협력·계약으로 모델링하고 설계 대안을 근거와 함께 선택한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Empiricism / Scientific Thinking.
- **Why:** 객체 하나가 아니라 협력 전체를 보고, 모델·계약·테스트 evidence로 설계를 교정한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 현실 문제를 어떤 개념과 책임으로 나눌 것인가?
- 어떤 객체가 무엇을 알고 무엇을 수행해야 하는가?
- 어떤 메시지와 계약으로 협력해야 하는가?
- Analysis Model과 Design Model을 어떻게 구분·연결하는가?
- cohesion을 높이고 coupling을 낮추며 change impact를 국소화하려면 무엇을 숨길 것인가?

## 3. Core Narrative
`Problem → Requirement/Use Case → Analysis Model → Responsibility → Contract → Collaboration → Design Model → Code → Feedback/Refactoring`

UML 표기법의 순서가 Backbone이 아니다.

## 4. Decisions Learner Must Make
1. 무엇을 Concept/Object로 볼 것인가?
2. 누가 해당 Responsibility를 소유해야 하는가?
3. 어떤 Collaboration이 필요한가?
4. 호출자와 객체 사이 Contract는 무엇인가?
5. 어떤 변경을 Encapsulation/Information Hiding으로 국소화할 것인가?
6. 어떤 모델링 표현이 현재 판단에 실제로 필요한가?
7. Code/Test Feedback을 보고 설계를 언제 바꿀 것인가?

## 5. Course Scope
### OWNER
- Model / Modeling fundamentals
- Analysis Model / Design Model
- Object / Class / Message / State / Behavior
- Encapsulation
- Responsibility / Collaboration / RDD
- GRASP / Information Expert
- Cohesion / Coupling / Information Hiding
- SOLID / OO-level DIP
- Design Pattern fundamentals
- Tell, Don't Ask / Law of Demeter / CQS
- Design by Contract / Precondition / Postcondition / Object Invariant
- TDD / Refactoring as design feedback

### RECAP / APPLY
- Requirement / Use Case
- BDD / example-based clarification
- Static/Dynamic modeling notation

### NON-SCOPE / FORWARD
- DDD의 Domain Model, Entity/VO/Aggregate, Bounded Context
- SW Architecture의 Driver, Quality Attribute, Port/Adapter 상세
- MSA의 Service/Distribution/Consistency
- AI-Native의 Context/Guardrail/Harness

## 6. Key Distinctions
- OOAD ≠ UML
- Concept ≠ Class
- Analysis Model ≠ Design Model ≠ Code
- Encapsulation ≠ private keyword
- DIP ≠ DI Framework
- Contract ≠ Test
- Object Invariant ≠ Domain Invariant

## 7. Learning Outcomes
수강 후 학습자는:
1. Use Case/Scenario에서 분석 개념과 interaction을 선택적으로 모델링한다.
2. Behavior에서 Responsibility를 도출하고 적절한 Owner를 선택한다.
3. Message/Collaboration/Contract로 객체 협력을 설계한다.
4. GRASP/SOLID/Information Hiding을 Trade-off 판단에 사용한다.
5. Design Pattern을 이름이 아니라 Problem/Forces/Collaboration 관점에서 선택한다.
6. Test/Refactoring Feedback으로 Object Design을 개선한다.

## 8. Principles / Trade-off / Failure
| Principle | Trade-off | Failure Condition |
|---|---|---|
| Responsibility before Class | 초기 설계가 느려 보일 수 있으나 책임 누수를 줄인다 | Class 목록부터 만들고 Behavior를 나중에 붙임 |
| Just Enough Modeling | 문서 완성도는 낮아지나 판단 비용이 줄어든다 | 모든 Diagram을 의무 산출물로 만듦 |
| Information Hiding | 간접계층이 늘 수 있으나 변경 파급을 줄인다 | 모든 것을 추상화하거나 getter/setter로만 캡슐화 |
| Contract Thinking | 명시 비용이 들지만 협력과 검증 기준이 선명해진다 | Contract를 Test case와 동일시 |
| Feedback-driven Design | 초기 설계를 고정하지 않으나 지속 개선이 필요하다 | Refactoring 없이 최초 설계를 정답으로 취급 |

## 9. LLM-Integrated Practice Design

공통 표준 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다.

- **총 7개:** Day 1 3개 / Day 2 4개
- **Practice time:** 총 약 160분, 기존 800분 instructional time 안에 포함
- **기본 timebox:** 20–25분
- **운영:** Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt
- **평가:** Prompt 문장력이 아니라 OOAD의 모델링·책임·계약·설계 판단
- **상세 Practice Pack:** `support/02_course-assets/01_ooad/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | S02 | Black-box Requirement → Use Case / Scenario | 20분 | 외부 행위와 내부 설계를 어디서 나눌 것인가 |
| P2 | S05 | Concept before Class | 25분 | 무엇을 분석 Concept로 남기고 구현 요소를 제외할 것인가 |
| P3 | S07 | Just Enough Dynamic Modeling | 25분 | 현재 질문에 필요한 동적 모델 하나는 무엇인가 |
| P4 | S08 | Hide the Change | 20분 | 어떤 변화를 어디에 숨길 것인가 |
| P5 | S10 | SOLID/DIP — Improve Only Where Pressure Exists | 20분 | 실제 변경 압력이 있는 곳만 어떻게 개선할 것인가 |
| P6 | S11 | Responsibility → Owner → Contract → Pattern | 25분 | 핵심 behavior의 책임·owner·contract·collaboration을 어떻게 결정할 것인가 |
| P7 | S13 | Test Evidence → Design Feedback → Refactoring | 25분 | test/evidence를 어떤 설계 개선 판단으로 연결할 것인가 |

S12의 100분 Order Responsibility & Contract Workshop은 유지한다. P6 결과를 입력 가설로 사용하되, S12는 사람 중심의 통합 설계·critique workshop으로 운영한다.

## 10. Exercise Evidence
공통 Order Domain에서:
- Use Case / Scenario
- Analysis Concept Model
- 선택된 Dynamic Model
- Responsibility와 Candidate Owner
- Collaboration
- Object Contract 1개 이상
- GRASP rationale
- SOLID/DIP 개선
- Pattern 선택과 Trade-off
- Test/Refactoring Feedback

## 11. Curriculum Backbone — 14 Topics / 권장 순수 학습 800분
### Part 1 — Analysis / Modeling
1. OOAD Orientation — Object, Message, Responsibility — **45분**
2. Requirement → Use Case — **55분** — P1 포함
3. Example / BDD for Requirement Clarification — **35분**
4. Static Modeling — Concept before Class — **55분**
5. Static Modeling Workshop — **65분** — P2 포함
6. Dynamic Modeling — Collaboration over Notation — **60분**
7. Dynamic Modeling Workshop — Just Enough Modeling — **65분** — P3 포함

### Part 2 — Object Design
8. Modularity / Information Hiding / Cohesion / Coupling — **60분** — P4 포함
9. Object Design → Architecture Forward View — **30분**
10. SOLID / Dependency Principles — **60분** — P5 포함
11. Responsibility-Driven Design / GRASP / DbC / Patterns — **80분** — P6 포함
12. Order Responsibility & Contract Workshop — **100분** — 장시간 핵심 실습

### Part 3 — Feedback / Evolution
13. TDD / Refactoring as Design Feedback — **55분** — P7 포함
14. Object Model Limits → DDD / Architecture / MSA Forward — **35분**

## 12. Source Baseline
Alan Kay, Rebecca Wirfs-Brock, Bertrand Meyer, Craig Larman, David Parnas, GoF, Martin Fowler 등 OO/설계 원전과 검증된 자료를 우선한다.

## 13. Quality Gate
- UML 과정으로 축소되지 않는가?
- Responsibility가 Class보다 먼저인가?
- Analysis/Design/Code가 분리되는가?
- Message/Contract/Collaboration이 충분히 강조되는가?
- DDD/SWA/MSA OWNER를 침범하지 않는가?
- SOLID/Pattern이 암기형 Catalog가 아닌가?
- 7개 LLM-integrated Practice가 Analysis → Design → Feedback 전반에 분산되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 OOAD 판단 Evidence를 평가하는가?
- Practice 때문에 DDD/SWA/MSA/AI-Native OWNER 경계가 이동하지 않는가?
- 상세 내용은 삭제보다 Optional/Reference/Appendix로 보존하는가?

---

## Portfolio Alignment v2.6
- **OWNER:** Object/Responsibility/Collaboration, analysis/design modeling, cohesion/coupling, SOLID/DIP, design contracts.
- **Key Consumers:** DDD, SW Architecture, MSA, AI-Native.
- **Boundary:** Domain-specific strategic modeling is DDD; architecture-wide structural decisions are SW Architecture.
