# Agile — Course Context

> **Course ID:** agile
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-a 구조를 따른다.
> **Authority:** `portfolio/practice-standard.md` · `portfolio/evidence-policy.md` · `portfolio/concept-ownership.md` §16A (Agile Ownership) · `portfolio/cross-course-framework.md` §15 (Adaptive Delivery Lineage) · `portfolio/terminology.md` §H2 (Agile / Adaptive Delivery) — portfolio-wide 정본.
> **Migration provenance:** legacy context v2.6에서 progression/priority/rationale/coverage-intent만 흡수했다. 현재 권위는 위 Portfolio 정본과 이 Course Design에 있다.
> **Status:** Greenfield — 이 저장소에 기존 `courses/agile/curriculum.md`가 없다. 이 문서는 Course Design 단계 산출물이며 Curriculum(Stage 2)을 생성하지 않는다.

---

## 1. Course Purpose

Agile은 미숙한 개발을 대신하는 방법론이 아니다. SW Engineering의 기본 역량을 갖추면서, 불확실성을 작은 단위의 실행과 빠른 Feedback으로 관리하여 지속적으로 학습하고 적응하는 개발 방식이다.

과정의 목표는 Scrum 용어를 아는 것이 아니라 **현재 조직의 문제를 진단하고, Agile이 필요한 조건과 도입 순서를 판단하며, 작은 Pilot에서 Evidence를 만든 뒤 확대할 수 있게 하는 것**이다.

Agile은 adaptive-delivery/adoption reasoning을 소유하되, engineering-practice의 세부(OOAD/QM/DevOps가 소유하는 설계·품질·delivery practice)나 DevOps의 delivery/deployment flow 자체는 소유하지 않는다(`concept-ownership.md` §16A).

## 2. Target Learner

- 불확실성과 변화가 있는 환경에서 adaptive delivery를 개선해야 하는 팀·리더·PM.
- Decision Level: **Apply / Decide.**

## 3. Capability Gap

학습자는 현재 framework ceremony를 도입하면 agility가 생긴다고 생각하거나, engineering capability 없이 feedback만 강조하는 경향이 있다. `Waterfall인가 Agile인가?`를 첫 질문으로 삼는 대신, 문제가 Engineering Capability / Uncertainty / Feedback / Organization / Governance 중 무엇에서 발생하는지 분리하지 못한다.

## 4. Typical Failure

- 모든 실패를 Waterfall 탓으로 돌리고 문제를 정확히 진단하지 않는다.
- Ceremony(Standup, Sprint, Board)만 도입하고 Engineering Discipline은 보강하지 않는다.
- Sprint만 짧게 만들고 실제 Feedback Cycle은 장주기로 남긴다.
- Task 완료율을 실제 진척(Working Increment)으로 착각한다.
- Product Owner에게 실제 우선순위 결정 권한이 없다.
- 준비 없이 전사 단위로 Big-Bang Transformation을 시도한다.
- Scrum/SAFe 같은 특정 Framework를 모든 상황에 적용 가능한 정답으로 사용한다.
- 외부 개발/계약 환경에서 `Fixed detailed scope + change suppression + late acceptance + Scrum`을 동시에 요구해 구조적 충돌을 만든다.

## 5. Target Capability

작은 increment와 feedback으로 uncertainty를 줄이고, framework 도입·확대 여부를 evidence로 판단한다. 구체적으로 학습자는:

1. 현재 개발 문제를 Engineering / Uncertainty / Feedback / Organization / Governance로 진단한다.
2. Predictive/Iterative/Incremental/Adaptive 접근의 적용 맥락을 구분한다.
3. Agile 도입 전에 필요한 최소 Engineering Capability를 평가한다.
4. 큰 요구를 작은 Vertical Slice와 Working Increment로 나눈다.
5. Scrum의 Accountabilities/Events/Artifacts를 해결하려는 문제와 연결한다.
6. 외부 개발/계약 제약에서 현실적인 Agile 적용 범위를 결정한다.
7. Pilot Outcome을 Evidence로 평가하여 확대·수정·중단한다.

---

## 6. Course Thesis

> Agile은 미숙한 개발을 대신하는 방법론이 아니다. SW Engineering의 기본 역량을 갖추면서, 불확실성을 작은 단위의 실행과 빠른 Feedback으로 관리하여 지속적으로 학습하고 적응하는 개발 방식이다.

## 7. Course Narrative

```text
Diagnose → Stabilize → Shorten → Apply → Adapt
```

- **Diagnose:** 문제를 정확히 분리한다(Engineering / Uncertainty / Feedback / Organization / Governance).
- **Stabilize:** 반복 개발이 가능한 최소 Engineering Foundation을 만든다.
- **Shorten:** Work Batch와 Feedback Delay를 줄인다.
- **Apply:** Scrum 등 적합한 Framework/Practice를 적용한다.
- **Adapt:** Evidence를 보고 개선·유지·확대·중단한다.

Scrum은 출발점이 아니라 Apply 단계에서 적용하는 Framework다.

---

## 8. Learner & Context Fit

> baseline(`07_agile.md`)이 이미 채운 절이므로 요약하거나 다시 짓지 않고 그대로 가져온다(`guides/과정_설계_지침.md` §3).

- **Audience / Work Context:** 불확실성과 변화가 있는 환경에서 adaptive delivery를 개선해야 하는 팀·리더·PM.
- **Current Capability / Failure Mode:** framework ceremony를 도입하면 agility가 생긴다고 생각하거나 engineering capability 없이 feedback만 강조한다.
- **Target Capability:** 작은 increment와 feedback으로 uncertainty를 줄이고 framework 도입·확대 여부를 evidence로 판단한다.
- **Decision Level:** Apply / Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 9. Foundational Decision Lens Fit

> `portfolio/principles.md` §A의 5개 Lens 중 이 과정에 실제로 강화되는 것만 채택한다. 판정은 baseline(`07_agile.md` "Foundational Decision Lens Alignment")의 기존 판단을 그대로 옮긴 것이며, 여기서 새로 판정하지 않는다.

- **APPLY:** Lean Thinking; Systems Thinking; Empiricism / Scientific Thinking.
- **Why:** batch와 feedback delay를 줄이고 팀 local metric보다 전체 value delivery를 보며 실험으로 적응한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.
- (Theory of Constraints / Design Thinking Lens는 이 과정에서 채택하지 않는다 — baseline이 명시한 3개 외 추가하지 않는다.)

---

## 10. Decisions Learner Must Make

1. 우리 문제는 Agile로 해결할 문제인가, Engineering/Governance 문제인가?
2. Prediction과 Adaptation 중 어디에 더 많은 비용을 투자해야 하는가?
3. Agile 시작 전에 필요한 최소 Engineering Capability는 무엇인가?
4. Requirement/Work를 얼마나 작게 나눌 수 있는가?
5. 누가 Product Value/Priority를 결정하고 누가 Feedback을 제공하는가?
6. Scrum의 각 요소가 어떤 문제를 해결해야 하는가?
7. 외부 개발/계약 환경에서 무엇을 고정하고 무엇을 변화 가능하게 둘 것인가?
8. Pilot을 언제 확대·유지·수정·중단할 것인가?

---

## 11. Course Scope — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

### 11.1 OWNER

Agile은 다음을 **자체 소유 판단**으로 가르친다(`concept-ownership.md` §16A, `07_agile.md` §5, `cross-course-framework.md` §15와 일치):

- Agile adoption condition / readiness
- Predictive / Iterative / Incremental / Adaptive 구분
- Small Batch / Short Feedback
- Working Increment as learning evidence
- Product Decision / Feedback 구조
- Scrum application as problem-solving framework
- Pilot-based adoption / adaptation
- Agile anti-pattern / failure condition
- 외주/계약/Governance constraints from Agile adoption perspective

### 11.2 APPLY / RECAP ONLY (다른 과정의 OWNER 개념 — 재정의 금지)

- Requirement/User Story details beyond adaptive work slicing.
- Engineering practices owned by OOAD/QM/DevOps 또는 다른 engineering courses(Version Control, Build, Test, Review, DoD의 세부 실행은 RECAP/APPLY만, Agile Readiness 진단의 입력으로만 사용).
- DevOps delivery/deployment flow.

### 11.3 Awareness Only

XP / Kanban / SAFe / LeSS / Nexus / Jira / Story Point mechanics / Burn charts — 각 1~5분 원칙으로 짧게 다루며 Core를 압도하지 않는다(`07_agile.md` §12).

### 11.4 NON-SCOPE / FORWARD

- Scrum Certification 대비
- Kanban/XP/SAFe/LeSS/Nexus 상세 방법론
- Jira 사용법
- Story Point/Velocity 운영 심화
- Agile Coach/조직설계 상세
- DevOps Toolchain

### 11.5 Ownership Boundary Risk — 명시적 경고

> **`portfolio/concept-ownership.md` §16A가 명시적으로 경계를 긋는다:**
> Agile은 **engineering-practice의 세부(OOAD/QM/DevOps가 소유하는 설계·품질·delivery practice)**와 **DevOps의 delivery/deployment flow**를 자체 OWNER 개념으로 재정의하지 않는다. Agile 과정에서 Version Control/Build/Test/Review/DoD를 다룰 때는 어디까지나 "Agile 도입 전 최소 Engineering Foundation이 있는가"를 진단하는 RECAP/APPLY 관점이며, 각 practice의 정본 정의는 OOAD/QM/DevOps가 소유한다.
>
> `cross-course-framework.md` §15도 동일하게 확인한다: QM은 quality evidence/gate를 소유하고 Sprint flow를 소유하지 않으며, DevOps는 software delivery/deployment/operation flow를 소유하고 Agile product feedback을 소유하지 않는다.

---

## 12. Key Distinctions

`portfolio/terminology.md` §H2(Agile / Adaptive Delivery)와 baseline(`07_agile.md` §6)이 공유하는, 이 과정이 반드시 구분해야 할 쌍:

- Agile ≠ Scrum
- Agile ≠ 무계획
- Waterfall ≠ 악 / Agile ≠ 선
- Iteration ≠ Feedback
- Task Completion ≠ Working Increment
- Scrum ≠ Engineering Practice
- Velocity ≠ Productivity KPI
- Product Owner ≠ 단순 요구 전달자
- 외주 ≠ Agile 불가
- Scaling Framework ≠ 팀 수준 문제 해결책
- Predictive ≠ Iterative ≠ Incremental ≠ Adaptive (네 개념은 서로 대체 가능한 동의어가 아니다 — `terminology.md` §H2)

---

## 13. Course-specific Principles / Trade-offs / Failure Conditions

Parent Lens(§9)를 이 과정에서 구체화한 Child principle이다(`07_agile.md` §8).

| Principle | Trade-off | Failure Condition | Parent Lens |
|---|---|---|---|
| Diagnose before Agile | 전환 속도는 느려 보이나 잘못된 처방을 줄인다 | 모든 실패를 Waterfall 탓으로 돌림 | Systems Thinking / Empiricism |
| Engineering Discipline enables Agility | 기본기 투자 필요, Change Cost 감소 | Ceremony만 도입 | Lean Thinking |
| Small Batch / Short Feedback | 계획·조정 빈도 증가, Risk 조기 노출 | Sprint만 짧고 Feedback은 장주기 | Lean Thinking / Empiricism |
| Working Software as Evidence | 문서 진척의 편의 감소 | Task 완료율을 실제 진척으로 봄 | Empiricism |
| Product Decision close to Team | Stakeholder 참여 비용 증가 | PO에게 실제 우선순위 권한 없음 | Systems Thinking |
| Pilot before Scale | 전사 확산이 느려 보임 | Big-Bang Transformation | Empiricism |
| Contextual Method Choice | 하나의 표준화는 약해짐 | Scrum/SAFe를 모든 상황의 답으로 사용 | Systems Thinking |

---

## 14. Cross-course Interfaces

### 14.1 Position (Adaptive Delivery Lineage — `cross-course-framework.md` §15)

```text
Uncertainty → Small Batch → Working Increment → Feedback → Learning → Adaptation
```

- Agile owns adaptive delivery/adoption reasoning.
- QM owns quality evidence/gate, not Sprint flow.
- DevOps owns software delivery/deployment/operation flow, not Agile product feedback.

Portfolio Focus(§15 table): Agile의 Primary Focus는 **Small Value Increment / Customer Feedback / Adaptation**이다.

### 14.2 Extended Evidence / Feedback Lineage

```text
Product Feedback (Agile)
→ Delivery & Operations Feedback (DevOps)
→ Project Forecast / Change Evidence (PM)
→ Customer Decision Evidence (Proposal)
→ Transformation Outcome Evidence (DT→AX)
```

이는 선형 maturity model이 아니라 서로 다른 decision scope다(`cross-course-framework.md` §15).

### 14.3 Uses (Related Course Boundaries)

| Course | Relationship | Boundary Rule |
|---|---|---|
| OOAD / DDD / SW Architecture / MSA | Engineering Foundation(Version Control/Build/Test/Review/DoD)을 Agile Readiness 진단 입력으로 RECAP/APPLY | 각 분야의 설계·구현 practice 정본은 해당 과정이 소유 |
| Modern SWQM | Definition of Done, Feedback 개념을 접점으로 사용 | Quality evidence/gate 설계는 SWQM이 소유 |
| DevOps | Small change를 delivery/operations feedback으로 확장(Key Bridge) | Delivery/Deployment/Operation Flow는 DevOps가 소유 |
| SW Project Management | Adaptive delivery mechanics를 PM의 integrated governance/tailoring 판단에 제공 | Project value/governance/통합 control은 PM이 소유 |

### 14.4 Forward (다른 과정이 Agile로부터 가져가는 것)

- DevOps는 Agile이 만든 작은 change 단위를 delivery/operations feedback loop로 확장한다(Key Bridge, `07_agile.md` §Portfolio Alignment).
- SW Project Management는 Agile의 adaptive delivery 판단을 project-level tailoring 결정에 통합한다(`concept-ownership.md` "SW Project Management — Boundary": Agile owns adaptive delivery mechanics).

---

## 15. Portfolio Alignment Summary

- **OWNER:** Adaptive delivery/adoption reasoning, small value increments, customer feedback, learning and adaptation; Scrum as one application framework.
- **Key Bridge:** DevOps extends small changes through delivery/operations feedback.
- **Boundary:** SWQM owns quality evidence/gates; PM owns integrated project governance/control.
- **Rollout order (portfolio-wide):** `practice-standard.md` §15 — OOAD → DDD → SW Architecture → MSA → AI-Native → Modern SWQM → **Agile** → DevOps → SW Project Management → SW Proposal → DT→AX.
