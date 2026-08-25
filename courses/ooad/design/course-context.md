# OOAD Course Context

> **Course ID:** ooad
> **파이프라인 자리:** `Portfolio Design(portfolio/) + 과정 설계 지침(guides/과정_설계_지침.md) + References + Human↔LLM → Course Design(courses/ooad/design/)`.
> **권위 순서:** `portfolio/*.md`(Portfolio Canon) > 이 Course Design. legacy context v2.6은 migration provenance이며 현재 권위·입력이 아니다.
> **경계:** 이 문서는 세션 번호·시간표·구체 커리큘럼 구조를 소유하지 않는다. 그것은 `courses/ooad/ooad-curriculum.md`(실제 정본 커리큘럼)가 소유한다. 이 문서는 Baseline에서 intended progression / topic priority / sequencing rationale / coverage intent만 프로즈로 가져온다.

---

## 1. Course Purpose

OOAD는 **현실의 문제를 모델·책임·계약·협력으로 구조화하고, 이를 구현 가능한 설계로 발전시키며 코드와 피드백을 통해 지속 개선**하는 판단 역량을 가르친다(Course Thesis, Baseline §1). 이 과정이 소유하는 문제는 다음이다(Baseline §2 / Design Reference §2):

- 현실 문제를 어떤 개념과 책임으로 나눌 것인가?
- 어떤 객체가 무엇을 알고 무엇을 수행해야 하는가?
- 어떤 메시지와 계약으로 협력해야 하는가?
- Analysis Model과 Design Model을 어떻게 구분·연결하는가?
- Cohesion을 높이고 Coupling을 낮추며 change impact를 국소화하려면 무엇을 숨길 것인가?

## 2. Target Learner

**Learner & Context Fit** (Baseline "Learner & Context Fit" 절 그대로 가져옴 — 요약·재작성하지 않음):

- **Audience / Work Context:** SW 개발자·설계자·분석가 등 객체지향 분석/설계 결정을 실제 모델과 코드 구조로 연결해야 하는 학습자.
- **Current Capability / Failure Mode:** 요구를 class/diagram으로 바로 변환하거나 책임·협력·계약보다 표기법/패턴에 의존하기 쉽다.
- **Target Capability:** 현실 문제를 개념·책임·협력·계약으로 모델링하고 설계 대안을 근거와 함께 선택한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 3. Capability Gap

학습자는 대체로 다음 격차를 갖고 수강을 시작한다:

- 요구사항을 곧바로 class/diagram으로 변환하려는 습관 — 분석과 설계를 구분하지 못한다.
- 책임·협력·계약보다 UML 표기법이나 GoF 패턴 이름 자체에 의존한다.
- Class 목록부터 만들고 Behavior를 나중에 붙이는 순서로 설계한다 — Responsibility before Class가 뒤집힌다.

## 4. Typical Failure

- **모델 층위 붕괴:** Analysis Model ≠ Design Model ≠ Code 구분이 사라지고, Concept를 Class로 1:1 변환한다.
- **책임 누수:** 책임이 객체 밖(Service)으로 새어 나가 객체가 데이터 주머니(anemic)가 된다.
- **표기법 완결주의:** 판단이 필요한 지점 없이 모든 diagram을 의무 산출물로 만든다(Just Enough Modeling 실패).
- **캡슐화 오인:** Encapsulation을 `private` keyword나 getter/setter로 축소한다.
- **원칙의 카탈로그화:** SOLID/GRASP/Pattern을 암기형 checklist로 전부 적용하려 한다(실제 변경 압력이 있는 곳만 개선해야 한다).
- **계약과 테스트 혼동:** Contract를 Test case와 동일시한다.

## 5. Target Capability

수강 후 학습자는(Baseline §7 Learning Outcomes):

1. Use Case/Scenario에서 분석 개념과 interaction을 선택적으로 모델링한다.
2. Behavior에서 Responsibility를 도출하고 적절한 Owner를 선택한다.
3. Message/Collaboration/Contract로 객체 협력을 설계한다.
4. GRASP/SOLID/Information Hiding을 Trade-off 판단에 사용한다.
5. Design Pattern을 이름이 아니라 Problem/Forces/Collaboration 관점에서 선택한다.
6. Test/Refactoring Feedback으로 Object Design을 개선한다.

## 6. Course Thesis / Narrative

> 현실의 문제를 모델·책임·계약·협력으로 구조화하고, 이를 구현 가능한 설계로 발전시키며 코드와 피드백을 통해 지속 개선한다.

**Core Narrative** (Baseline §3 / Design Reference §3):

```text
Problem → Requirement/Use Case → Analysis Model → Responsibility → Contract
→ Collaboration → Design Model → Code → Feedback/Refactoring
```

UML 표기법의 순서는 이 과정의 Backbone이 아니다. Diagram completeness가 아니라 decision usefulness가 기준이다.

**Intended Progression (baseline coverage intent — 세션 번호 아님, 서술적 진행 의도만):**

과정은 크게 세 국면으로 진행된다는 것이 Baseline의 의도다.

- **Analysis 국면:** Requirement/Use Case에서 출발해 구현을 성급히 끌어들이지 않는 Analysis Concept Model과 필요한 최소 Dynamic Model을 만드는 판단을 먼저 세운다. 이 국면의 우선순위는 "무엇을 모델에 넣지 않을 것인가"이며, notation 생산이 목적이 아니다.
- **Object Design 국면:** Modularity/Information Hiding/Cohesion/Coupling으로 변경 국소화 판단을 다진 뒤, SOLID와 Responsibility-Driven Design(GRASP)·Design by Contract·Pattern을 하나의 decision chain(Responsibility → Owner → Contract → Collaboration → Pattern)으로 연결한다. 이 국면이 시간·비중에서 가장 무겁다 — Baseline은 이 블록을 과정의 핵심 anchor로 명시한다.
- **Feedback/Evolution 국면:** Test/Refactoring을 설계 피드백 압력으로 다루고, Object Model의 한계에서 DDD/SW Architecture/MSA로의 forward view로 과정을 닫는다.

이 진행 순서(sequencing rationale)는 "구현 결정보다 문제 이해가 먼저, Class보다 Responsibility가 먼저, 설계 고정보다 지속 피드백이 먼저"라는 Course Thesis를 시간 축으로 구현한 것이다. **세션 번호·정확한 시간 배분·실제 topic 개수는 `courses/ooad/ooad-curriculum.md`가 소유하는 정본이며, 이 문서는 이를 복제하지 않는다.**

**Topic Priority (Baseline이 명시한 무게 배분 의도):** Object Design 블록(모듈화·SOLID·RDD/GRASP/DbC/Pattern·핵심 통합 실습)이 과정에서 가장 무거운 topic priority를 가진다. Analysis 국면은 "판단 하나당 최소 필요한 모델"만 다루도록 의도되어 있어 상대적으로 가볍다. Feedback 국면은 짧지만 과정을 닫는 필수 forward-linkage 역할을 한다.

## 7. Decisions Learner Must Make

(Baseline §4, 원문 그대로)

1. 무엇을 Concept/Object로 볼 것인가?
2. 누가 해당 Responsibility를 소유해야 하는가?
3. 어떤 Collaboration이 필요한가?
4. 호출자와 객체 사이 Contract는 무엇인가?
5. 어떤 변경을 Encapsulation/Information Hiding으로 국소화할 것인가?
6. 어떤 모델링 표현이 현재 판단에 실제로 필요한가?
7. Code/Test Feedback을 보고 설계를 언제 바꿀 것인가?

## 8. OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

`portfolio/concept-ownership.md` §3 (OOAD Ownership)의 구체화다.

### OWNER (정의·기원·판단·적용조건·Trade-off·실패조건까지 정본 교육)

- Model / Modeling fundamentals, Concept
- Analysis Model / Design Model
- Object / Class / Message / State / Behavior
- Encapsulation
- Responsibility / Collaboration / Responsibility-Driven Design
- GRASP / Information Expert
- Cohesion / Coupling / Information Hiding
- SOLID / OO-level Dependency Inversion
- Design Pattern fundamentals
- Tell, Don't Ask / Law of Demeter / Command–Query Separation
- Program to an Interface / Favor Composition over Inheritance
- Design by Contract / Precondition / Postcondition / **Object Invariant**
- TDD / Refactoring as design feedback (test engineering 자체는 비소유)

### RECAP / APPLY (OWNER 정의를 바꾸지 않고 OOAD 문제에 사용)

- Requirement / Use Case
- BDD / example-based requirement clarification
- Static/Dynamic modeling notation

### FORWARD (후속 과정에서 다룰 개념의 필요성만 예고, 정본 교육하지 않음)

- Domain Model / DDD tactical concepts (Entity/VO/Aggregate/Domain Service/Repository/Domain Event) → DDD
- Architecture Driver / Quality Attribute / Dependency Rule / Port / Adapter 상세 → SW Architecture
- Service/Distribution/Consistency → MSA
- AI Context/Guardrail/Harness → AI-Native

### NON-SCOPE (이 과정이 정본 교육하지 않음 — Design Reference §5)

- Ubiquitous Language OWNER, Domain Model OWNER
- Entity / Value Object / Aggregate
- Domain Service / Repository의 DDD 의미
- Bounded Context / Context Mapping
- Architecture Driver / Quality Attribute Scenario, Clean Architecture 상세
- Port / Adapter / Application Service 상세
- Microservice / Saga / distributed consistency
- AI Context / Guardrail / Harness

**Migration note (concept-ownership.md §3):** 기존 OOAD S09 "아키텍처 지향"은 유지하되 SW Architecture의 상세 내용을 소유하지 않는다. 기존 S14 "DDD·MSA 진화"는 DDD 전술 교육을 내려놓고 **OO 모델의 한계 → Domain 중심 → 시스템/배포 경계**의 forward view로 재구성한다.

## 9. Key Distinctions

`portfolio/terminology.md` §B/§H 중 OOAD에 해당하는 쌍(Baseline §6 그대로):

| A | B | 핵심 차이 |
|---|---|---|
| OOAD | UML | 판단 과정 vs notation |
| Concept | Class | 현실 의미 vs 구현 타입 |
| Analysis Model | Design Model | 문제 이해 모델 vs 구현 가능한 책임·협력·구조 모델 |
| Analysis Model | Code | 문제 이해 모델 vs 실행 가능한 구현 |
| Encapsulation | `private` keyword | 정보 은닉 원리 vs 언어 문법 |
| DIP | DI Framework | design principle vs implementation mechanism |
| Contract | Test | 명시적 계약 vs 계약 충족의 evidence |
| **Object Invariant** | **Domain Invariant** | 객체가 안정 상태로 노출될 때의 유효성 조건(OOAD OWNER) vs domain business consistency rule(DDD OWNER) — 겹칠 수 있으나 관점이 다르다 |

추가(terminology.md §H2 Additional Distinctions에서 OOAD 관련):
- **Object Contract ≠ API Contract:** 객체 내부 협력 계약 vs 원격 소비자와의 외부 계약(API Contract는 MSA OWNER).
- **Design by Contract ≠ Stage Contract:** OO object collaboration 원칙(OOAD OWNER) vs AI workflow 단계 계약(AI-Native OWNER).

## 10. Course-specific Principles

`portfolio/principles.md` §C1 (Modeling & Object Responsibility — OOAD)의 Child Principle 목록. **Primary Parent Lenses: Systems Thinking / Empiricism**(principles.md §C1, Baseline "Foundational Decision Lens Alignment"와 일치).

| Principle | Lineage | 핵심 판단 |
|---|---|---|
| OOAD-01. Object = State + Behavior + Message + Responsibility | Alan Kay messaging/state/late binding | 객체가 자신의 상태와 규칙을 보호하며 협력하는가? |
| OOAD-02. Model before Notation | Booch OOA/OOD 계보 | UML은 표현 수단이지 모델 자체가 아니다 |
| OOAD-03. Responsibility before Class | Responsibility-Driven Design / GRASP | "어떤 클래스가 필요한가"보다 "이 책임을 누가 지는가"가 먼저 |
| OOAD-04. Information Expert | Larman / GRASP | 정보를 가장 잘 아는 객체가 우선 후보, 단독 법칙은 아님 |
| OOAD-05. Tell, Don't Ask | OO 실천 전통(특정 인물 축자 명언으로 고정하지 않음) | 상태를 꺼내 판단하지 말고 행위를 요청 |
| OOAD-06. Law of Demeter / Least Knowledge | Ian Holland | 협력에 필요한 최소한의 이웃만 안다 |
| OOAD-07. Command–Query Separation | Bertrand Meyer | Command와 Query의 의미를 분리 |
| OOAD-08. High Cohesion / Low Coupling | — | 함께 변하는 책임은 모으고 독립적으로 변하는 책임은 분리 |
| OOAD-09. Program to an Interface, not an Implementation | GoF | 변동성 있는 협력 상대는 구체 구현이 아니라 계약에 의존 |
| OOAD-10. Favor Composition over Inheritance | GoF | 진짜 is-a인지, 독립적 변화가 필요한지 판단 |
| OOAD-11. Dependency Inversion | Robert C. Martin | 정책이 세부 구현에 끌려가지 않도록 의존 방향 제어 (→ SW Architecture Dependency Rule로 확장) |
| OOAD-12. Design by Contract | Bertrand Meyer / Eiffel | Precondition/Postcondition/Invariant로 책임 경계 명시 |

> DDD는 Design by Contract를 다시 소유하지 않는다. OOAD의 계약 사고를 Domain Invariant와 Aggregate consistency에 적용·심화한다(principles.md §C1 note).

## 11. Trade-offs / Failure Conditions

(Baseline §8, 원문 그대로)

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Responsibility before Class | 초기 설계가 느려 보일 수 있으나 책임 누수를 줄인다 | Class 목록부터 만들고 Behavior를 나중에 붙임 |
| Just Enough Modeling | 문서 완성도는 낮아지나 판단 비용이 줄어든다 | 모든 Diagram을 의무 산출물로 만듦 |
| Information Hiding | 간접계층이 늘 수 있으나 변경 파급을 줄인다 | 모든 것을 추상화하거나 getter/setter로만 캡슐화 |
| Contract Thinking | 명시 비용이 들지만 협력과 검증 기준이 선명해진다 | Contract를 Test case와 동일시 |
| Feedback-driven Design | 초기 설계를 고정하지 않으나 지속 개선이 필요하다 | Refactoring 없이 최초 설계를 정답으로 취급 |

## 12. Cross-course Interfaces

### Bridges Forward (concept-ownership.md §3 FORWARD, §9 Cross-Course Re-anchor Map)

```text
OOAD Responsibility ───────────────→ DDD Domain Responsibility
      │
      ├───────────────────────────→ SWA Component Responsibility
      └───────────────────────────→ AI Human/Agent Responsibility

OOAD DIP ─────────────────────────→ SWA Dependency Rule
```

- **→ DDD:** Domain Model / Entity / VO / Aggregate / Domain Service / Repository / Domain Event / Bounded Context는 OOAD가 다루지 않고 DDD가 OWNER다. OOAD의 Responsibility·Object Invariant 사고가 DDD의 Domain Responsibility·Domain Invariant로 심화된다.
- **→ SW Architecture:** OOAD의 DIP는 SW Architecture의 Dependency Rule로 확장된다. Cohesion/Coupling은 SWA에서 Module/Component 수준으로 EXTEND된다. OOAD S09(아키텍처 지향)는 forward-ref 수준만 다루고 정본은 SWA가 소유한다.
- **→ MSA:** Cohesion/Coupling 원리는 Service Boundary 판단까지 반복 확장된다(원리 자체는 OOAD가 최초 정박).
- **→ AI-Native:** OOAD Responsibility/Encapsulation은 AI-Native의 Human/Agent Responsibility에 APPLY 대상으로 재사용된다. Design by Contract는 AI-Native의 Stage Contract와 "계약 기반 사고를 새로운 실행 주체에 확장"하는 관계이나 동일 개념은 아니다.

### Uses (RECAP/APPLY로 소비하는 개념)

- Requirement/Use Case, BDD는 OOAD 자체 OWNER가 아니라 분석 입력으로 RECAP/APPLY한다.

### Related Courses

- **Prerequisite:** 없음(`concept-ownership.md` §11 Prerequisite Policy) — OOAD는 Portfolio의 진입 과정이다.
- **Key Consumers:** DDD, SW Architecture, MSA, AI-Native (Baseline "Portfolio Alignment").

## 13. Foundational Decision Lens Fit

`portfolio/principles.md` §A 5개 Lens 중 OOAD의 실제 판단을 강화하는 것만 적용한다. 아래는 migration 당시 흡수·검증된 판정을 현재 기준선으로 유지한 것이다:

- **APPLY:** Systems Thinking(SYS-01/02) — 객체 하나가 아니라 협력 전체(collaboration)를 본다; Empiricism/Scientific Thinking(EMP 계열) — 모델·계약·테스트 evidence로 설계를 교정한다.
- **Rule:** 관련 없는 Lens를 형식상 억지로 추가하지 않는다. Lean/ToC/Design Thinking Lens는 이 과정의 핵심 판단을 강화하지 않으므로 적용하지 않는다.

## 14. Source Baseline

Alan Kay, Rebecca Wirfs-Brock, Bertrand Meyer, Craig Larman, David Parnas, GoF(Gamma/Helm/Johnson/Vlissides), Martin Fowler, Eric Evans 등 OO/설계 원전과 검증된 자료를 우선한다(Baseline §12). 상세 근거·인용·locator는 `courses/ooad/design/references/verified-sources.md`가 소유한다.

## 15. Curriculum Authoring Gate

`guides/과정_설계_지침.md` §6에 따라, 이 Course Design 문서는 이미 실제 Curriculum(`courses/ooad/ooad-curriculum.md`)과 공존하는 과정의 상위 설명 문서로 병행 작성되었다. 이 문서의 승인이 기존 curriculum/session 재작성, source/deck 생성, renderer/course-specific logic 변경을 자동으로 허가하지 않는다.
