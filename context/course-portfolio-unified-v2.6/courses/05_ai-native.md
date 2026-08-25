# AI-Native Software Engineering — Unified Baseline v2.6

> **Course ID:** ai-native  
> **Duration:** 16h 운영 기준  
> **Instructional time:** 약 800분 + 휴식 약 160분  
> **Status:** Baseline  
> **Portfolio Category:** AI Engineering  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 16시간 / 총 운영 960분 이내 / 권장 순수 학습 800분
- **Portfolio:** AI Engineering

## 1. Course Thesis
> AI의 능력을 활용하되 책임·Specification·Context·Constraint·Control·Evidence를 설계하여 확률적 실행을 공학적으로 통제한다.

## Learner & Context Fit

- **Audience / Work Context:** LLM/Agent를 SW Engineering 업무에 실제 위임·통제하려는 개발자·리더·아키텍트.
- **Current Capability / Failure Mode:** 모델 capability나 prompt에 집중하고 specification·context·guardrail·verification 비용을 약하게 본다.
- **Target Capability:** 가장 단순하고 적합한 AI 실행형태를 선택하고 delegation을 evidence 기반으로 통제한다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Design Thinking; Empiricism / Scientific Thinking.
- **Why:** 업무 context와 전체 socio-technical control을 보고 AI 결과를 assertion이 아니라 evidence로 검증한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 무엇을 AI에 위임하고 무엇을 Human이 보유하는가?
- Intent를 어떤 Specification으로 바꾸는가?
- 필요한 Context와 Permission은 무엇인가?
- Guardrail과 Harness로 실행 범위를 어떻게 통제하는가?
- 언제 HITL이 필요한가?
- 결과를 Deterministic/Probabilistic Evidence로 어떻게 검증하는가?
- Capability 증가에 따라 Autonomy를 어떻게 조정하는가?

## 3. Core Narrative
`Intent → Responsibility Allocation → Specification → Stage Contract → Context → Constraint/Permission → Guardrail → Harness → Agent/Workflow → Evaluation/Evidence → Feedback → Autonomy Adjustment`

## 4. Decisions Learner Must Make
1. 어떤 Responsibility를 Agent에 위임할 것인가?
2. Risk/Reversibility/Observability/Verification Cost를 고려한 Autonomy 폭은?
3. Specification에 무엇을 명시해야 하는가?
4. 어떤 Context가 필요하고 무엇은 Noise인가?
5. Guardrail과 Tool Permission을 어디에 둘 것인가?
6. Workflow Stage의 Contract/Gate/Failure Path는 무엇인가?
7. Deterministic Gate와 LLM Evaluation을 어떻게 배분할 것인가?
8. 어떤 Evidence로 Reliability를 판단할 것인가?

## 5. Course Scope
### OWNER
Human–AI R&R, AI-assisted Development, Specification Engineering, Context Engineering, Prompt as subset, Task/Knowledge/Tool/State/Domain-Policy Context, Guardrail, Harness, Agent, Stage/Tool Contract, HITL, Autonomy Boundary, Agentic Workflow, AI Evaluation/Observability, Cost/Latency/Reliability Trade-off.

### APPLY
OOAD Responsibility/Contract, DDD Domain Model/Invariant, SWA Boundary/Policy/Gate, MSA Failure/Observability.

### NON-SCOPE
Prompt Cookbook, 특정 LLM 제품 교육, Agent Framework Catalog, MCP 제품 교육, Ontology 구현 기술, Generic PM Automation.

## 6. Key Distinctions
- Intent ≠ Prompt
- Specification ≠ Prompt
- Prompt ⊂ Context
- Context ≠ Guardrail
- Guardrail ≠ Harness
- Agent ≠ LLM Call
- Tool ≠ Agent
- Evaluation ≠ Testing Only
- Autonomy ≠ Capability
- Deterministic Evidence ≠ Probabilistic Score

## 7. Learning Outcomes
1. Human/Agent Responsibility를 Risk 기반으로 배분한다.
2. Delegation을 위한 Specification/Stage Contract를 작성한다.
3. Context를 Task/Knowledge/Tool/State/Policy 관점으로 구성한다.
4. Guardrail/Harness/Tool Permission을 설계한다.
5. Agentic Workflow와 Failure/Recovery Path를 설계한다.
6. Deterministic Gate와 Probabilistic Evaluation을 결합한다.
7. Observability/Cost/Evidence를 기반으로 Autonomy를 조정한다.

## 8. Principles / Trade-off / Failure
| Principle | Trade-off | Failure Condition |
|---|---|---|
| Responsibility before Agent | 설계 시간이 들지만 무분별한 Agent화 방지 | Agent부터 정의 |
| Specification before Delegation | 작성 비용 증가, 재작업/오해 감소 | Prompt 한 줄로 위임 |
| Reuse Engineering Context | Context 정리 비용 필요 | AI용 별도 진실 생성 |
| Guardrail + Harness | 통제 비용 증가, Reliability 향상 | 모델 능력만 신뢰 |
| Deterministic Evidence First | 일부 속도 저하, 검증 신뢰성 향상 | 자동 판정 가능 항목도 LLM Reviewer만 사용 |
| Risk-based Autonomy | 완전자율화 속도 저하 | Capability가 높다는 이유로 승인 제거 |

## 9. Exercise Evidence
- Human vs Agent R&R
- Specification
- Context Set
- Stage Contract
- Tool Permission Model
- Guardrail
- Harness Flow
- Deterministic Gate
- Probabilistic Evaluation
- HITL Point
- Failure Path
- Observability Fields
- Autonomy Rationale

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **8개**, Day 1 4개 / Day 2 4개, 총 약 **180분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/05_ai-native/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T02 | Choose the Simplest Execution Form | 20분 | Chat/Code/Work/Workflow/Agent/App 중 무엇이 가장 단순하고 적합한가 |
| P2 | T03 | Specification before Delegation | 25분 | AI에 위임하기 전에 어떤 intent/input/constraint/acceptance를 명시할 것인가 |
| P3 | T04/T05 | Context, not Prompt Tuning | 25분 | 문구가 아니라 어떤 context 자산이 필요한가 |
| P4 | T06 | Guardrail before Autonomy | 20분 | 허용·금지·승인·검증 경계를 어디에 둘 것인가 |
| P5 | T07/T10 | Harness / Workflow Contract | 25분 | LLM call을 재현 가능한 실행 구조로 어떻게 감쌀 것인가 |
| P6 | T09/T11 | Agent or Workflow? Autonomy & HITL | 20분 | 자율성의 이득이 risk allocation을 정당화하는가 |
| P7 | T13/T14 | Evaluation & Observability | 25분 | 확률적 결과를 어떤 evidence로 평가·운영할 것인가 |
| P8 | T15/T16 | Integrated Execution-form Redesign | 20분 | capability 변화 후 실행형태와 control을 어떻게 재선택할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 10. Curriculum Backbone — 16 Topics / 권장 순수 학습 800분

### Part 1 — AI as Engineering Actor
1. AI-assisted → AI-Native — **35분**
2. Human–AI Responsibility / Risk — **50분**
3. Specification Engineering — **55분**
4. Context Engineering — **60분**

### Part 2 — Control
5. Prompt as Part of Context — **30분**
6. Guardrail — **50분**
7. Harness — **60분**
8. Stage Contract / Tool Contract — **50분**

### Part 3 — Agentic Execution
9. Agent Definition / Boundary — **45분**
10. Agentic Workflow — **60분**
11. HITL / Autonomy — **50분**
12. Failure / Recovery — **55분**

### Part 4 — Evidence & Evolution
13. Evaluation Strategy — **60분**
14. AI Observability / Cost — **50분**
15. Explicit Semantics / Ontology Use — **40분**
16. Integrated Workflow / Capability Change — **50분**

## 11. Source Policy
SW Engineering의 안정된 원칙을 engineering baseline으로 사용하고, 특정 모델/Agent SDK 문서는 현재 구현 사례로만 격리한다.

## 12. Quality Gate
Prompt Course로 축소되지 않는가, Context/Guardrail/Harness가 구분되는가, Specification이 Delegation보다 먼저인가, deterministic evidence를 우선하는가, Autonomy가 Risk Decision인가를 확인한다.

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## Portfolio Alignment v2.6
- **OWNER:** AI-assisted/agentic SW engineering, Specification/Context Engineering, Guardrail, Agent, Harness, stage/tool contracts and evaluation.
- **Key Inputs:** OOAD/DDD/SW Architecture/MSA engineering semantics and boundaries.
- **Boundary:** Enterprise AI transformation/operating-model redesign belongs to DT→AX.
