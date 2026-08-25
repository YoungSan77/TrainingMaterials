# AI-Native Software Engineering Source Baseline v2.0

> Purpose: 빠르게 변하는 AI implementation과 오래 유지될 engineering principle을 분리한다.


## Portfolio Evidence Classification

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Stable SE principles applied to AI delegation | Foundational/Core | Cross-source SW engineering lineage | Strong | Broad | Core | Not classified |
| Evaluation / control / explicit semantics principles | Foundational/Core | Research + engineering lineage | Moderate/Strong by claim | Broad/Conditional | Core | Not classified |
| OpenAI agent/guardrail/tracing/sandbox docs | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |
| Other model/API implementation material | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |

## 1. Two-Layer Evidence Model

### Stable Engineering Principle
- Responsibility
- Specification
- Contract
- Context
- Permission / Boundary
- Guardrail
- Harness
- Evidence
- Feedback
- Observability
- Reversibility
- Risk-based autonomy

### Current Implementation Example
- model/provider APIs
- agent SDKs
- tool protocols
- tracing products
- sandbox implementations

Vendor implementation은 Course definitions 또는 Global Baseline을 정의하지 않는다.

## 2. Vendor Implementation Examples — Replaceable

### AI01 — Agentic systems require orchestration beyond the model
**Verification Status:** Verified  
**Source:** OpenAI, “New tools for building agents.”  
**Evidence:** Agents SDK explicitly separates agents, handoffs, guardrails, tracing/observability as system concerns.

### AI02 — Guardrails are explicit checks
**Verification Status:** Verified  
**Source:** OpenAI Agents SDK announcement.  
**Principle:** input/output validation/safety checks are explicit control elements, not equivalent to all Context or Harness.

### AI03 — Tracing/observability is part of agent engineering
**Verification Status:** Verified  
**Source:** OpenAI.  
**Principle:** execution trace is needed to debug and optimize agentic workflows.

### AI04 — Execution environment / sandbox matters
**Verification Status:** Verified  
**Source:** OpenAI Agents SDK 2026 update.  
**Principle:** long-running tool-using agents need controlled execution environment; reliability is a system property, not model-only property.

## 3. Engineering Reference Flow

```text
Intent
→ Responsibility Allocation
→ Specification
→ Stage Contract
→ Context
→ Permission / Constraint
→ Guardrail
→ Harness
→ Agentic Execution
→ Evaluation / Evidence
→ Feedback
→ Autonomy Adjustment
```

## 4. Specification

Minimum engineering asset:
- Intent
- Input
- Output
- Constraint
- Acceptance criteria
- Completion criteria
- Failure condition
- Verification method

Prompt alone is not the specification.

## 5. Context

Dimensions:
- Task
- Knowledge
- Tool
- State
- Domain / Policy

Prompt ⊂ Context.

Reuse existing engineering assets:
requirements, domain model, tests, schemas, ADRs, policies.

## 6. Stage Contract

Minimum:
- Input
- Output
- Precondition
- Constraint
- Acceptance/Postcondition
- Gate
- Failure Path

Stage Contract is not literally OO DbC; it extends contract-based reasoning to probabilistic workflow execution.

## 7. Guardrail vs Harness

**Guardrail:** allowed/forbidden conditions and checks.

**Harness:** surrounding execution/control system that may include context loading, tools, state, workflow, gates, retry, evaluation, tracing, HITL, recovery.

Guardrail ≠ Harness.

## 8. Evaluation

Prefer deterministic evidence where possible:
- compiler
- schema
- unit/integration tests
- static analysis
- policy checks

Use probabilistic evaluation where judgment is unavoidable:
- semantic completeness
- relevance
- style
- reasoning quality

Do not replace deterministic oracle with an LLM reviewer merely because one is available.

## 9. Autonomy

Autonomy is a risk allocation decision, not a synonym for model capability.

Consider:
- impact
- permission
- reversibility
- blast radius
- observability
- verification cost

## 10. Drift / Capability Change

Monitor:
- model capability change
- prompt/spec drift
- context drift
- tool behavior/version
- evaluation drift

A better model does not automatically justify removing controls.

## 11. Explicit Semantics / Ontology

Ontology is optional.

Useful when:
- multi-system vocabulary ambiguity is material
- concepts/relations/constraints need stronger explicitness
- multiple agents/systems must share semantics

Not required for:
- narrow CRUD
- simple single-team vocabulary
- tasks already well served by documents/schemas/domain models

## 12. Source Policy

Global Baseline은 stable SW engineering principles, relevant empirical evidence, foundational/influential works, 필요한 reference framework로 구성한다.

Current vendor docs = product/implementation evidence, not universal engineering baseline.
Every fast-changing source should carry retrieval/update date in textbook authoring assets.

Replaceable implementation references:
- OpenAI Agents SDK documentation / release notes
- other vendor/model/tool documentation when the implementation itself is relevant

No single vendor, model, SDK, UI, or API owns the definitions of Agent, Guardrail, Harness, Context, Evaluation, or the Course Spine.


---
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.
