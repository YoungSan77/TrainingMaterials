# AI-Native Software Engineering Course Specification v1.0

> **Status:** Pre-curriculum specification candidate
> **Basis:** Program Governance v2.2.2
> **Purpose:** AI-assisted와 Agentic 내용을 단순 합치는 대신, Delegation / Context / Control / Evidence의 공학 과정으로 재구성한다.

## 1. Identity

- **Course ID:** ai-native
- **Course Name:** AI-Native Software Engineering
- **Portfolio Category:** AI Engineering
- **Course Thesis:**

> AI의 능력을 활용하되 책임·Specification·Context·Constraint·Control·Evidence를
> 설계하여 확률적 실행을 공학적으로 통제한다.

## 2. Problem It Owns

AI가 단순 자동완성 도구를 넘어 실행 주체가 되면 다음 문제가 생긴다.

- 무엇을 AI에 위임하고 무엇을 인간이 보유할 것인가?
- 의도를 어떤 Specification으로 변환해야 하는가?
- 모델이 판단하는 데 필요한 Context는 무엇인가?
- 허용 범위와 권한을 어떻게 제한할 것인가?
- 여러 단계 실행을 어떤 Harness와 Stage Contract로 통제할 것인가?
- 언제 HITL이 필요한가?
- 생성 결과를 무엇으로 검증할 것인가?
- 확률적 평가와 deterministic evidence를 어떻게 배분할 것인가?
- capability 증가에 따라 control을 어떻게 재설계할 것인가?

## 3. Engineering Foundations It Consumes

### OOAD
- Responsibility
- Collaboration
- Encapsulation
- Contract thinking

### DDD
- Domain Model
- Ubiquitous Language
- Domain Invariant
- Explicit Semantics

### SWA
- Boundary
- Policy
- Dependency
- Quality Gate / Fitness
- Architecture Decision

### MSA
- Failure
- Retry / Idempotency
- Observability
- workflow/compensation 사고

MSA pattern을 AI에 그대로 복사하지 않는다.

## 4. Core Flow

```text
Intent
→ Responsibility Allocation
→ Specification
→ Stage Contract
→ Context
→ Constraint / Permission
→ Guardrail
→ Harness
→ Agent / Workflow
→ Evaluation / Evidence
→ Feedback
→ Autonomy Adjustment
```

## 5. Canonical Ownership

### OWNER
- Human–AI R&R
- AI-assisted Development
- Specification Engineering
- Context Engineering
- Prompt Engineering as subset
- Task / Knowledge / Tool / State / Domain-Policy Context
- Guardrail
- Harness
- Agent
- Stage Contract
- Tool Contract / Tool permission
- HITL
- Autonomy Boundary
- Agentic Workflow
- AI Evaluation
- AI Observability
- Cost / latency / reliability trade-off
- capability change → control redesign

### APPLY
- OOAD Responsibility / Contract
- DDD Domain Model / Invariant
- SWA Policy / Gate
- MSA Failure / Observability

## 6. Explicit Non-Scope

- Prompt cookbook
- 특정 LLM 제품 교육
- agent framework catalog
- MCP/tool protocol product training
- ontology implementation technology
- MSA Saga를 agent rollback으로 재정의
- generic project management automation course

## 7. Key Distinctions

- Intent ≠ Prompt
- Specification ≠ Prompt
- Prompt ⊂ Context
- Context ≠ Guardrail
- Guardrail ≠ Harness
- Agent ≠ LLM call
- Agent ≠ Harness
- Tool ≠ Agent
- Stage Contract ≠ Design by Contract
- Evaluation ≠ testing only
- AI Observability ≠ log collection only
- Autonomy ≠ capability
- Saga ≠ Agent rollback
- Ontology ≠ Knowledge Base
- probabilistic score ≠ deterministic evidence

## 8. Human–AI Responsibility

첫 질문은 “어떤 agent를 만들까?”가 아니다.

```text
Intent
→ Responsibility
→ Risk
→ Reversibility
→ Observability
→ Verification Cost
→ Delegation Level
```

판단:
- irreversible?
- regulated?
- external side effect?
- financial/security impact?
- easy to verify?
- easy to rollback?
- enough context?
- permission scope?

## 9. Specification Engineering

Specification은 문서 형식이 아니다.

최소:
- Intent
- Inputs
- Expected Output
- Constraints
- Acceptance Criteria
- Completion Criteria
- Failure Conditions
- Verification Method

핵심:
> 위임 폭이 커질수록 specification/evaluation 필요가 커진다.

## 10. Stage Contract

각 agent/workflow stage는 최소 다음을 가진다.

```text
Input
Output
Precondition
Constraint
Acceptance / Postcondition
Gate
Failure Path
```

DbC와 동일 개념이 아니다.
contract-based thinking을 새로운 execution boundary에 확장한다.

## 11. Context Engineering

Prompt보다 상위 개념으로 정박한다.

Context dimensions:
- Task
- Knowledge
- Tool
- State
- Domain / Policy

Engineering assets:
- requirement
- domain model
- architecture rule
- test
- ADR
- schema
- policy
- examples

원칙:
> AI를 위해 별도 진실을 만들지 말고 기존 engineering asset을 재사용한다.

## 12. Prompt Engineering

Prompt는 Context의 일부다.

다룰 것:
- instruction clarity
- output format
- examples
- decomposition
- constraints

다루지 않을 것:
- magic phrase
- prompt template catalog
- prompt optimization을 AI engineering 전체로 확대

## 13. Guardrail

Guardrail은 행동 범위를 제한·검증하는 rule/control이다.

예:
- allowed input
- permission
- action restriction
- approval
- output policy
- schema validation

Guardrail은 Context 전체도 Harness 전체도 아니다.

## 14. Harness

Harness는 실행·통제 구조다.

포함 가능:
- Context supply
- Tool connection
- State
- Workflow
- Gate
- Retry
- Evaluation
- Logging/Tracing
- HITL
- Recovery

핵심:
> model capability보다 surrounding engineering system이 reliability를 결정한다.

## 15. Agent

Agent의 최소 요소:
- goal/task
- responsibility
- context
- tool
- state
- completion condition
- failure handling
- observation

단순 LLM call은 Agent가 아니다.

## 16. Agentic Workflow

```text
Stage
→ Contract
→ Execute
→ Gate
→ Evidence
→ Next / Retry / Escalate / Stop
```

중요:
- deterministic step과 AI step을 혼합할 수 있다.
- 모든 단계를 agent로 만들 필요 없다.
- 자동 판정 가능한 부분은 deterministic gate를 우선한다.

## 17. Evaluation

### Deterministic
- compiler
- test
- schema
- static analysis
- policy check
- exact constraint

### Probabilistic
- relevance
- reasoning quality
- style
- semantic completeness

원칙:
> deterministic evidence가 가능한 것을 LLM reviewer에게만 맡기지 않는다.

## 18. HITL / Autonomy

Autonomy는 capability가 아니라 risk allocation decision이다.

```text
risk × reversibility × observability × verification cost
```

높은 위험 + 낮은 가역성:
- narrower autonomy
- stronger approval
- deterministic gate
- human review

낮은 위험 + 높은 가역성:
- wider autonomy 가능

## 19. Failure / Recovery

MSA의 failure 사고는 참고하지만 pattern identity는 유지하지 않는다.

다룰 것:
- timeout
- retry
- duplicate action
- partial completion
- external side effect
- compensation
- escalation
- state corruption
- tool failure

`Saga = Agent rollback` 표현 금지.

## 20. AI Observability

관찰 대상:
- prompt/context version
- tool call
- state transition
- stage result
- approval
- retry
- latency
- token/cost
- evaluation score
- failure reason

목적:
- debugging
- quality improvement
- auditability
- autonomy tuning

## 21. Ontology / Explicit Semantics

Ontology는 선택지다.

Use when:
- multiple systems/agents share complex semantics
- vocabulary ambiguity cost high
- relation/constraint explicitness matters

Do not force when:
- simple CRUD
- narrow vocabulary
- single bounded team
- document context is sufficient

## 22. Capability Growth

새 모델이 더 강해지면:
- gate를 무조건 제거하지 않는다.
- verification cost와 error mode를 다시 평가한다.
- autonomy width를 조정한다.
- context/guardrail/harness를 재설계한다.

## 23. Exercise Evidence

Order domain / AI SW dev workflow에서:

1. Human vs Agent R&R
2. one Specification
3. Context set
4. Stage Contract
5. Tool permission model
6. Guardrail
7. Harness flow
8. deterministic gate
9. probabilistic evaluation
10. HITL point
11. failure path
12. observability fields
13. autonomy rationale

## 24. Suggested 16-Session Backbone

### Part 1 — AI as Engineering Actor
S01 AI-assisted → AI-Native  
S02 Human–AI Responsibility / Risk  
S03 Specification Engineering  
S04 Context Engineering  

### Part 2 — Control
S05 Prompt as Part of Context  
S06 Guardrail  
S07 Harness  
S08 Stage Contract / Tool Contract  

### Part 3 — Agentic Execution
S09 Agent Definition / Boundary  
S10 Agentic Workflow  
S11 HITL / Autonomy  
S12 Failure / Recovery  

### Part 4 — Evidence & Evolution
S13 Evaluation Strategy  
S14 AI Observability / Cost  
S15 Explicit Semantics / Ontology Use  
S16 Integrated Workflow / Capability Change  

기존 AI-assisted 16h + Agentic 16h 내용을 단순 합쳐 32h로 유지하지 않는다.
Course identity 기준으로 중복을 제거한 뒤 시간은 별도 결정한다.

## 25. Source Baseline

우선:
- 공식 모델/agent platform 문서 — current implementation example
- Software engineering primary principles — OOAD/DDD/SWA/MSA canon
- vendor-specific content는 rapidly changing example로 격리

최근 Agent SDK류 공식 문서는 agent, guardrail, tracing/observability의 실제 구현 예로 활용 가능하나
Canonical definition은 특정 vendor에 종속시키지 않는다.

## 26. Quality Gate

- AI-Native가 prompt course로 축소되지 않는가?
- Agent를 LLM call로 정의하지 않는가?
- Context / Guardrail / Harness를 구분하는가?
- Specification이 delegation보다 먼저인가?
- deterministic evidence를 우선하는가?
- HITL이 막연한 “인간이 최종 책임” 문구가 아닌가?
- autonomy가 risk-based decision인가?
- Saga/rollback 혼동이 없는가?
- Ontology를 필수화하지 않는가?
- vendor/framework가 curriculum spine이 아닌가?
