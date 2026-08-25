# AI-Native Software Engineering — Course Context

> **Course ID:** ai-native
> **Pipeline stage:** Course Design (Stage 1) — `guides/과정_설계_지침.md`
> **Status:** Draft, greenfield (no existing `courses/ai-native/curriculum.md` yet)
> **Authority:** `portfolio/*.md`(정의·소유·용어·근거 정본) + `guides/과정_설계_지침.md`(구조 규정) + 이 Course Design. legacy context v2.6은 migration provenance이며 현재 입력·권위가 아니다.
> **Duration reference (from baseline):** 16h 운영 기준 / 총 운영 960분 이내 / 권장 순수 학습 800분. 세션 번호·시간표·명제 배치는 이 문서가 아니라 Stage 2 `커리큘럼_작성_지침.md`와 향후 `courses/ai-native/curriculum.md`가 소유한다 — 여기서는 만들지 않는다.

---

## 1. Course Purpose / Target Learner / Capability Gap / Typical Failure / Target Capability

이 절은 migration 당시 legacy context v2.6의 Learner & Context Fit을 흡수한 현재 Course Design 내용이다.

- **Audience / Work Context:** LLM/Agent를 SW Engineering 업무에 실제 위임·통제하려는 개발자·리더·아키텍트.
- **Current Capability / Failure Mode:** 모델 capability나 prompt에 집중하고 specification·context·guardrail·verification 비용을 약하게 본다.
- **Target Capability:** 가장 단순하고 적합한 AI 실행형태를 선택하고 delegation을 evidence 기반으로 통제한다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

**Capability Gap(도출):** 학습자는 이미 LLM을 어느 정도 사용해 봤지만, 그 사용을 "더 좋은 prompt"의 문제로 오인한다. 실제 격차는 **책임 배분·명세·컨텍스트·통제 구조·증거**를 설계하지 않고 모델 능력에 의존한다는 데 있다 — 이는 Course Thesis(§2)와 직결된다.

---

## 2. Course Thesis / Narrative

> **Course Thesis:** AI의 능력을 활용하되 책임·Specification·Context·Constraint·Control·Evidence를 설계하여 확률적 실행을 공학적으로 통제한다.

**Core Narrative (Baseline §3, 그대로 인용):**

```text
Intent → Responsibility Allocation → Specification → Stage Contract
→ Context → Constraint/Permission → Guardrail → Harness
→ Agent/Workflow → Evaluation/Evidence → Feedback → Autonomy Adjustment
```

**Problem It Owns (Baseline §2):**
- 무엇을 AI에 위임하고 무엇을 Human이 보유하는가?
- Intent를 어떤 Specification으로 바꾸는가?
- 필요한 Context와 Permission은 무엇인가?
- Guardrail과 Harness로 실행 범위를 어떻게 통제하는가?
- 언제 HITL이 필요한가?
- 결과를 Deterministic/Probabilistic Evidence로 어떻게 검증하는가?
- Capability 증가에 따라 Autonomy를 어떻게 조정하는가?

이 과정은 "AI 사용법" 과정이 아니다. Prompt Engineering은 Context Engineering의 부분집합으로 축소되며(`portfolio/terminology.md` §G), 핵심은 **위임 전 판단**(책임·명세·컨텍스트·통제)과 **위임 후 검증**(증거·관찰·자율성 재조정)이다.

---

## 3. Decisions Learner Must Make

Baseline §4를 그대로 옮긴다 — 이것이 이 과정의 실제 Curriculum Spine 근거(요구사항)다.

1. 어떤 Responsibility를 Agent에 위임할 것인가?
2. Risk/Reversibility/Observability/Verification Cost를 고려한 Autonomy 폭은?
3. Specification에 무엇을 명시해야 하는가?
4. 어떤 Context가 필요하고 무엇은 Noise인가?
5. Guardrail과 Tool Permission을 어디에 둘 것인가?
6. Workflow Stage의 Contract/Gate/Failure Path는 무엇인가?
7. Deterministic Gate와 LLM Evaluation을 어떻게 배분할 것인가?
8. 어떤 Evidence로 Reliability를 판단할 것인가?

---

## 4. Foundational Decision Lens Fit

`guides/과정_설계_지침.md` §4에 따라 migration 당시 흡수·검증된 Foundational Decision Lens Alignment를 현재 기준선으로 유지한다.

- **APPLY:** Systems Thinking; Design Thinking; Empiricism / Scientific Thinking.
- **Why:** 업무 context와 전체 socio-technical control을 보고(Systems), Intent를 검증 가능한 Specification/Stage Contract로 구조화하고(Design), AI 결과를 assertion이 아니라 evidence로 검증한다(Empiricism).
- **Rule:** Lean/ToC Lens는 이 과정의 실제 판단을 강화하지 않으므로 형식상 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화하는 역할만 한다.

이는 `portfolio/principles.md` §C5(AI Delegation & Control — AI-Native SE)의 **Primary Parent Lenses: Systems Thinking / Design Thinking / Empiricism**와 정확히 일치한다.

---

## 5. Course Scope — OWNER / APPLY / RECAP / EXTEND / BRIDGE / FORWARD / NON-SCOPE

출처: `portfolio/concept-ownership.md` §2(Current Portfolio Coverage Matrix) §7(AI-Native Ownership) §8(Ontology Bridge Ownership), Baseline §5.

### OWNER
Human–AI R&R · AI-assisted Development(경계 내) · Specification Engineering · Context Engineering(Task/Knowledge/Tool/State/Domain-Policy Context; Prompt Engineering은 그 하위 활동) · Guardrail · Harness · Agent · Agentic Workflow / Stage Contract · Tool Contract · HITL · Autonomy Boundary · AI Evaluation / AI Observability / Cost(-Latency-Reliability Trade-off).

### APPLY
OWNER 정의를 재정의하지 않고 이 과정의 문제에 적용한다.
- OOAD Responsibility / Encapsulation / Contract
- DDD Domain Model / Ubiquitous Language / Invariant / Entity·VO·Aggregate / Domain Service·Repository·Domain Event / Bounded Context
- SWA Architecture Rule / Gate / Decision / Quality Attribute / Module·Component·Dependency / Port·Adapter / Fitness
- MSA Failure / Observability principles(distributed communication·consistency·failure, distributed observability·operation)
- Modeling fundamentals, Cohesion/Coupling, SOLID/DIP (Coverage Matrix상 AI-Native = APPLY)

### RECAP
독립 수강을 위한 최소 의미 복구 — DDD가 OWNER인 개념을 이 과정 맥락에서 다시 정의하지 않고 짧게 복구한다.
- "Domain semantics가 왜 필요한가" (Ontology Bridge Ownership §8)
- "Domain Model ≠ Ontology" (Ontology Bridge Ownership §8)

### EXTEND
같은 원리를 다른 수준으로 확장한다.
- Object / Responsibility / Collaboration → Human/Agent Responsibility (Cross-Course Re-anchor Map, `portfolio/cross-course-framework.md` §4 Responsibility Lineage: `Object Responsibility → Domain Responsibility → Component Responsibility → Service Ownership → Human/Agent Responsibility`)

### BRIDGE
두 과정이 동일 정의를 공유하되 다른 적용 질문을 담당한다.
- **Explicit Semantics / Ontology need** — DDD와 AI-Native가 BRIDGE. "Ontology 도입/기각 조건"은 양쪽 BRIDGE. "Ontology를 AI Context로 제공"과 "Retrieval/Tool/Agent semantic alignment"는 AI-Native **OWNER**(§8 Ontology Bridge Ownership). Ontology를 DDD나 AI의 필수 구현물로 만들지 않는다.

### FORWARD (이 과정이 예고만 하고 소유하지 않는 것)
- AI Evaluation / Deterministic Gate의 산출은 Modern SWQM의 Quality Evidence / Audit / Improvement Loop로 이어진다(`portfolio/cross-course-framework.md` §7 Evidence/Feedback Lineage: `... → AI Evaluation / Deterministic Gate → Quality Evidence / Audit / Improvement Loop`). AI-Native는 이 evidence를 만드는 실행/평가 gate까지만 소유하고, 품질 시스템 전체로의 통합·감사·개선 루프는 Modern SWQM OWNER다.

### NON-SCOPE
Prompt Cookbook · 특정 LLM 제품 교육 · Agent Framework Catalog · MCP 제품 교육 · Ontology 구현 기술 · Generic PM Automation.

---

## 6. Key Distinctions

`portfolio/terminology.md` §H(반드시 구분할 쌍) 중 이 과정에 해당하는 것 + Baseline §6.

| A | B | 핵심 차이 |
|---|---|---|
| Intent | Prompt | 목적/기대 결과 vs 모델에 전달되는 명시적 지시 표현의 일부 |
| Specification | Prompt | 결과·행위·제약·계약·완료 조건의 명시 vs Prompt는 그 표현의 일부일 뿐 |
| Prompt | Context | instruction representation vs 판단·생성을 조건짓는 정보 전체(Prompt ⊂ Context) |
| Prompt Engineering | Context Engineering | prompt 표현 설계 vs Task/Knowledge/Tool/State/Domain-Policy를 포함한 execution context 설계(전자는 후자의 부분 활동) |
| **Context** | **Guardrail** | information vs behavioral constraint/control — Context는 판단을 조건짓는 정보, Guardrail은 허용 범위 통제 |
| **Guardrail** | **Harness** | control rule vs execution/control structure 전체 — Guardrail은 판정 규칙, Harness는 Context 공급·Tool·State·Workflow·Gate·Retry·Evaluation·Logging·HITL을 포함한 구조 |
| **Agent** | **Harness** | execution actor vs surrounding execution system — Agent는 실행 주체, Harness는 그 주변 통제 구조 |
| Agent | LLM Call | 목표·Context·Tool·State·허용범위 안에서 여러 단계를 수행하는 실행 주체 vs 단순 모델 호출 |
| Tool | Agent | 외부 세계 조회/변경을 위한 명시적 capability vs 그것을 사용하는 실행 주체 |
| Evaluation | Testing Only | 요구·제약·품질 기준 충족을 측정·판정하는 활동 전체 vs 테스트는 그 일부(deterministic) 수단 |
| Autonomy | Capability | risk allocation 결정 vs 모델의 능력 — 능력이 높다는 이유로 승인을 제거하지 않는다 |
| Deterministic Evidence | Probabilistic Score | compiler/schema/test/static analysis/policy check 같은 자동 판정 vs LLM reviewer의 확률적 판정 |
| Ontology | Knowledge Base | semantic structure vs knowledge content |
| **Saga** | **Agent rollback** | distributed business transaction pattern vs generic workflow recovery — "재사용" 표현 금지, **failure/recovery 사고의 유사성**으로만 제한(`portfolio/concept-ownership.md` §7 CHANGE) |
| Quality Gate | Harness | 판정 지점/기준 vs 실행·통제 구조 전체 |
| Design by Contract | Stage Contract | OO object collaboration 원칙 vs AI workflow 단계 계약(동일 개념 아님, 계약 기반 사고의 확장) |

---

## 7. Course-owned Principles (Child of Systems / Design Thinking / Empiricism)

출처: `portfolio/principles.md` §C5(AI Delegation & Control — AI-Native SE). **Primary Parent Lenses: Systems Thinking / Design Thinking / Empiricism.** 이 과정은 이 10개 원칙을 재정의하지 않고 그대로 소유·교육한다.

| ID | Principle | Trade-off / Failure(원문 명시분) |
|---|---|---|
| AI-01 | Specification before Delegation | AI에게 더 큰 책임을 위임할수록 Intent/Input/Constraint/Acceptance/Verification을 더 명시한다. **Trade-off:** 자율성을 얻고 specification/evaluation 비용을 부담한다. |
| AI-02 | Context Is More Than Prompt | Prompt는 Context의 일부다. 최소 관점: Task / Knowledge / Tool / State / Domain-Policy. **실패 조건:** Context 문제를 문구 튜닝만으로 해결. |
| AI-03 | Reuse Engineering Assets as AI Context | Requirement, Domain Model, Architecture Rule, Test, ADR 같은 기존 공학 자산을 AI가 소비 가능한 Context로 만든다. AI용 별도 진실을 만들지 않는다. |
| AI-04 | Guardrail before Autonomy | 허용 범위·금지 범위·권한·승인·검증을 먼저 설계한 뒤 자율성을 넓힌다. **계보:** Encapsulation → Domain Boundary → Architecture Policy → AI Guardrail. |
| AI-05 | Harness, not Model Alone, Determines Engineering Reliability | Context 공급, Tool, State, Workflow, Gate, Retry, Evaluation, Logging, HITL을 포함한 실행 구조가 실제 품질을 결정한다. **Trade-off:** 재현성과 통제를 얻고 orchestration complexity를 부담한다. |
| AI-06 | Autonomy Is a Risk Allocation Decision | 자율성은 모델 capability만으로 결정하지 않는다. 최소 판단축: risk × reversibility × observability × verification cost. 높은 위험/낮은 가역성은 HITL 또는 deterministic gate를 강화한다. |
| AI-07 | Probabilistic Generation Requires Deterministic Evidence where Possible | Test, schema, compiler, static analysis, policy check처럼 자동 판정 가능한 것은 확률적 reviewer에게만 맡기지 않는다. 인간/LLM 판단은 자동화하기 어려운 의미·Trade-off 영역에 집중한다. |
| AI-08 | Agent Is a Responsible Execution Boundary, not an LLM Call | Agent에는 목표, 허용 범위, Context, Tool, State, 완료 조건, 실패 처리, 관찰 가능성이 필요하다. **실패 조건:** API call 하나에 Agent라는 이름만 붙인다. |
| AI-09 | Agentic Workflow Must Have Stage Contracts | 단계마다 Input / Output / Constraint / Gate / Failure path를 명시한다. **Trade-off:** 추적성과 복구성을 얻고 workflow 설계 비용을 부담한다. |
| AI-10 | Capability Growth Requires Control Redesign | 모델/Agent 능력이 높아지면 기존 gate를 제거하는 것이 아니라 risk와 evidence에 따라 자율 폭과 통제를 재배치한다. |

---

## 8. Course-level Trade-offs / Failure Conditions

Baseline §8을 그대로 옮긴다(§7의 AI-01~10과 상호 보완 — 이쪽은 과정 수준 판단표).

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Responsibility before Agent | 설계 시간이 들지만 무분별한 Agent화 방지 | Agent부터 정의 |
| Specification before Delegation | 작성 비용 증가, 재작업/오해 감소 | Prompt 한 줄로 위임 |
| Reuse Engineering Context | Context 정리 비용 필요 | AI용 별도 진실 생성 |
| Guardrail + Harness | 통제 비용 증가, Reliability 향상 | 모델 능력만 신뢰 |
| Deterministic Evidence First | 일부 속도 저하, 검증 신뢰성 향상 | 자동 판정 가능 항목도 LLM Reviewer만 사용 |
| Risk-based Autonomy | 완전자율화 속도 저하 | Capability가 높다는 이유로 승인 제거 |

---

## 9. Cross-course Interfaces

### Uses (이 과정이 앞선 과정에서 소비하는 것)
- **OOAD** Responsibility / Encapsulation / Contract — Human/Agent Responsibility 배분 판단의 기초.
- **DDD** Domain Model / Ubiquitous Language / Invariant / Bounded Context — AI Context의 Domain 축과 Explicit Semantics 판단의 기초.
- **SW Architecture** Architecture Rule / Policy / Gate / Fitness — Guardrail/Deterministic Gate 설계의 기초(`portfolio/cross-course-framework.md` §5 Contract Lineage: `... → Interface/Port/Component Contract → Service/API/Event/Schema Contract → AI Stage Contract/Tool Contract → Quality Evidence/Gate`; §6 Boundary Lineage: `... → Architecture Boundary → Deployment/Failure Boundary → Context/Permission/Autonomy Boundary`).
- **MSA** Failure / Observability principles — Agentic Workflow의 Failure/Recovery Path 설계에 원리 재사용(패턴 동일성이 아니라 원리 재사용, `portfolio/cross-course-framework.md` §Cross-Course Re-anchor Map: `MSA Failure/Observability → AI Agentic Workflow (principle reuse, not pattern identity)`).

### Bridges Forward (이 과정 이후로 이어지는 것)
- AI Evaluation / Deterministic Gate → **Modern SWQM**의 Quality Evidence / Audit / Improvement Loop(§5 FORWARD 참조). Rollout 순서상 AI-Native 다음이 Modern SWQM이다(`portfolio/practice-standard.md` §15 Portfolio Rollout Rule).
- Enterprise AI transformation / operating-model redesign은 이 과정의 범위가 아니라 **DT→AX**의 경계다(Baseline "Portfolio Alignment v2.6 — Boundary").

### Related Courses / Position
- **Portfolio Category:** AI Engineering.
- **Primary Focus(비교):** `portfolio/cross-course-framework.md` "Portfolio Focus — Current" 표에서 AI-Native SE = *Delegation / Context / Guardrail / Harness / Evaluation*, 인접 과정과 축이 겹치지 않도록 구분한다(OOAD=Meaning/Responsibility/Object Contract, DDD=Domain Meaning/Invariant/Model Boundary, SWA=Structural Boundary/Quality Decision/Evolution, MSA=Distribution/Service Contract/Failure/Operation).

---

## 10. Learning Outcomes (Baseline §7)

1. Human/Agent Responsibility를 Risk 기반으로 배분한다.
2. Delegation을 위한 Specification/Stage Contract를 작성한다.
3. Context를 Task/Knowledge/Tool/State/Policy 관점으로 구성한다.
4. Guardrail/Harness/Tool Permission을 설계한다.
5. Agentic Workflow와 Failure/Recovery Path를 설계한다.
6. Deterministic Gate와 Probabilistic Evaluation을 결합한다.
7. Observability/Cost/Evidence를 기반으로 Autonomy를 조정한다.

## 11. Exercise Evidence Categories (Baseline §9)

Human vs Agent R&R · Specification · Context Set · Stage Contract · Tool Permission Model · Guardrail · Harness Flow · Deterministic Gate · Probabilistic Evaluation · HITL Point · Failure Path · Observability Fields · Autonomy Rationale.

이 카테고리는 `practice-design.md`의 8개 Practice가 남기는 Evidence of Learning과 연결된다(§14 참조).

---

## 12. Course Narrative Arc — Progression / Topic Priority / Sequencing Rationale

`guides/과정_설계_지침.md` §2-a는 세션 번호·시간표를 옮기지 말고 **의도된 진행 순서·무엇이 무거운가·왜 이 순서인가·무엇을 다뤄야 하는가**만 추출하라고 규정한다. 아래는 Baseline "10. Curriculum Backbone"(16 Topics/Part 구조)에서 그 네 가지만 추출한 것이며, 세션 번호·분 배분·구체적 Topic 순번은 Stage 2(curriculum.md)의 몫이다.

1. **AI as Engineering Actor** — AI-assisted에서 AI-Native로의 전환, Human–AI Responsibility/Risk, Specification Engineering, Context Engineering을 먼저 다룬다. *Rationale:* 책임과 명세를 정하지 않고 통제 메커니즘(Guardrail/Harness)부터 가르치면 "왜 통제가 필요한가"가 사후 합리화된다(§1의 파이프라인 원칙과 동일).
2. **Control** — Prompt를 Context의 일부로 재배치한 뒤 Guardrail → Harness → Stage/Tool Contract 순으로 무겁게 다룬다. *Rationale:* Guardrail(판정 규칙)과 Harness(구조 전체)를 먼저 구분해야 이후 Agent 정의가 "API call + 이름"으로 얕아지지 않는다.
3. **Agentic Execution** — Agent Definition/Boundary, Agentic Workflow, HITL/Autonomy, Failure/Recovery를 다룬다. *Rationale:* Agent는 Harness 위에서만 의미가 있으므로 Part 2 이후에 배치한다. Failure/Recovery는 MSA 원리를 재사용하되 Saga를 Agent rollback과 동일시하지 않는다(§6 Key Distinctions).
4. **Evidence & Evolution** — Evaluation Strategy, AI Observability/Cost, Explicit Semantics/Ontology Use, Integrated Workflow/Capability Change로 마무리한다. *Rationale:* Evidence가 없으면 Autonomy 조정(AI-10)이 근거를 잃는다. Ontology는 마지막 근처에 Optional 성격으로 배치되며 필수 구현 기술로 무겁게 다루지 않는다(NON-SCOPE).

**Topic priority(무엇이 무거운가):** Baseline의 상대적 분 배분(참고치이며 확정 시간표 아님)에서 Context Engineering(60분), Harness(60분), Agentic Workflow(60분), Evaluation Strategy(60분)가 가장 무겁다 — 이는 이 과정의 OWNER 개념 중 Context/Harness/Agent/Evaluation이 핵심 판단축임을 반영한다.

---

## 13. Source Policy Pointer

이 과정은 안정된 SW Engineering 원칙(Global Baseline)을 근거로 삼고, 특정 모델/Agent SDK 문서는 현재 구현 사례로만 격리한다(`portfolio/evidence-policy.md` §9 Vendor/Product/LLM Independence). 근거·출처의 원형과 검증 상태는 `courses/ai-native/design/references/verified-sources.md`가 소유한다 — 여기서 다시 요약하지 않는다.

## 14. Practice Design Pointer

LLM-integrated Practice(실제 실습 시나리오 8개, Practice ID/필드 전체)는 `courses/ai-native/design/practice-design.md`가 소유한다 — 여기서 다시 나열하지 않는다. 이 과정은 `portfolio/practice-standard.md`의 Portfolio Canon을 그대로 적용하며(16h 과정 기준 6–8개, 실제 8개), Course Ownership Rule(§9)에 따라 LLM을 사용한다는 이유로 Concept OWNER가 AI-Native로 이동하지 않는다 — AI-Native는 Context/Guardrail/Harness/Agent mechanics와 실행형태 선택만 소유한다.

---

## 15. Legacy Migration Note — AI-assisted / Agentic 흡수

이 저장소는 과거 `courses/ai-assisted/`와 `courses/agentic/`라는 두 개의 분리된 과정을 갖고 있었으나(커밋 `2c718f3`에서 삭제), Portfolio v2.6에서 **AI-Native Software Engineering 하나로 통합**됐다. 통합 판단은 이미 `portfolio/concept-ownership.md` §7 "Migration from Existing AI-assisted + Agentic"에 정본으로 박혀 있다:

- **KEEP:** 명세되지 않은 부분의 확률적 편차 관찰, Order 기능 생성 비교, 기존 engineering gate로 AI output 검증, feedback/re-prompt loop, Agent = system, stage boundary, HITL, autonomy width, observability/cost.
- **MERGE:** `AI-assisted → Specification/Context → Guardrail/Harness → Agentic`
- **CHANGE:** 기존 AI-assisted S03에서 context·constraint·harness를 한 번에 섞지 않는다. Harness는 Context와 Guardrail 뒤에서 별도 개념으로 정박한다. Agentic의 Saga/보상 "재사용" 표현은 제거하고 failure/recovery 사고의 유사성으로 제한한다(§6 Key Distinctions).
- **ADD/STRENGTHEN:** Knowledge/Tool/State context, reusable engineering assets as context, explicit semantics/ontology use, evaluation strategy, deterministic vs probabilistic gate allocation, tool permission/blast radius.

옛 `courses/ai-assisted/curriculum.md`·`lab-design.md`·`courses/agentic/curriculum.md`·`lab-design.md`(모두 `git show 2c718f3~1:<path>`로 참조 확인)의 핵심 아이디어 — "명세 안 된 것은 LLM이 확률로 메운다", "지시 대조/출력 대조 3층 실습", "통제 구조가 자율성보다 먼저다", "Saga·보상 재사용 표현 금지" — 는 이미 위 KEEP/MERGE/CHANGE/ADD와 `portfolio/terminology.md` §H(Saga ≠ Agent rollback)로 완전히 흡수되어 있다. 검토 결과 이 두 문서에서 **새롭게 추가할 만한, 아직 반영되지 않은 고유 아이디어는 없었다** — 세션 구조(2일 16교시, 3층 실습 형식)는 옛 과정의 구조이므로 옮기지 않는다(지침 명시 사항).

---
## Unified Portfolio Alignment v2.6
- 이 문서는 `portfolio/*.md`를 과정에 구체화하며 새 Portfolio 정의를 추가하지 않는다.
- 세션/시간표/명제는 Stage 2(`커리큘럼_작성_지침.md`, 향후 `courses/ai-native/curriculum.md`)의 몫이다.
- Conflict 시 `portfolio/*.md` > `guides/과정_설계_지침.md` > 이 문서 순으로 우선한다.
