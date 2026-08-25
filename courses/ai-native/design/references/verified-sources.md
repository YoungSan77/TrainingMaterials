# AI-Native Software Engineering — Verified Sources

> **Course ID:** ai-native
> **Owns (`guides/과정_설계_지침.md` §2-c):** source/evidence 원문(요약본으로 다시 쓰지 않는다) · claim/quote/locator · Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use(`portfolio/evidence-policy.md` 스키마) · BP Classification.
> **Source (원형 보존, 요약하지 않음):** `context/course-portfolio-unified-v2.6/support/03_source-evidence/05_ai-native-source-evidence-v2.0.md`
> **Purpose (원문 그대로):** 빠르게 변하는 AI implementation과 오래 유지될 engineering principle을 분리한다.
> **Legacy 자료 안내:** 이 근거 팩에는 옛 slide placement·font·display 권고 등 normative 지시가 포함되어 있지 않다 — `guides/과정_설계_지침.md` §2-c의 legacy 처리 규정은 해당 사항 없음(N/A).

---

## Portfolio Evidence Classification (원문 표, 그대로)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Stable SE principles applied to AI delegation | Foundational/Core | Cross-source SW engineering lineage | Strong | Broad | Core | Not classified |
| Evaluation / control / explicit semantics principles | Foundational/Core | Research + engineering lineage | Moderate/Strong by claim | Broad/Conditional | Core | Not classified |
| OpenAI agent/guardrail/tracing/sandbox docs | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |
| Other model/API implementation material | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |

---

## 1. Two-Layer Evidence Model (원문 그대로)

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

---

## 2. Vendor Implementation Examples — Replaceable (원문 그대로 + Evidence Metadata)

이 4개 항목은 위 Portfolio Evidence Classification 표의 **"OpenAI agent/guardrail/tracing/sandbox docs"** family에 속한다. 이 family의 Evidence Role/Provenance/Strength/Transferability/Curriculum Use/BP는 각 항목에 동일하게 적용된다(원문에 항목별로 반복 기재되어 있지 않으므로 family 표에서 매핑한 값이며, 새로 판단·추가한 값이 아니다).

### AI01 — Agentic systems require orchestration beyond the model
- **Verification Status:** Verified
- **Source:** OpenAI, "New tools for building agents."
- **Evidence:** Agents SDK explicitly separates agents, handoffs, guardrails, tracing/observability as system concerns.
- **Evidence Role:** Vendor-Product Implementation
- **Source Provenance:** Vendor-Product Documentation
- **Evidence Strength:** Limited for universal claims
- **Transferability:** Product-specific
- **Curriculum Use:** Example/Reference
- **BP Classification:** Not classified

### AI02 — Guardrails are explicit checks
- **Verification Status:** Verified
- **Source:** OpenAI Agents SDK announcement.
- **Principle:** input/output validation/safety checks are explicit control elements, not equivalent to all Context or Harness.
- **Evidence Role:** Vendor-Product Implementation
- **Source Provenance:** Vendor-Product Documentation
- **Evidence Strength:** Limited for universal claims
- **Transferability:** Product-specific
- **Curriculum Use:** Example/Reference
- **BP Classification:** Not classified

### AI03 — Tracing/observability is part of agent engineering
- **Verification Status:** Verified
- **Source:** OpenAI.
- **Principle:** execution trace is needed to debug and optimize agentic workflows.
- **Evidence Role:** Vendor-Product Implementation
- **Source Provenance:** Vendor-Product Documentation
- **Evidence Strength:** Limited for universal claims
- **Transferability:** Product-specific
- **Curriculum Use:** Example/Reference
- **BP Classification:** Not classified

### AI04 — Execution environment / sandbox matters
- **Verification Status:** Verified
- **Source:** OpenAI Agents SDK 2026 update.
- **Principle:** long-running tool-using agents need controlled execution environment; reliability is a system property, not model-only property.
- **Evidence Role:** Vendor-Product Implementation
- **Source Provenance:** Vendor-Product Documentation
- **Evidence Strength:** Limited for universal claims
- **Transferability:** Product-specific
- **Curriculum Use:** Example/Reference
- **BP Classification:** Not classified

> **Curriculum Use 판단 근거(`portfolio/evidence-policy.md` §9 Vendor/Product/LLM Independence):** 특정 vendor, model, UI, SDK, API가 Course Concept/Principle/Practice/Exercise/Artifact의 본질을 정의하지 않는다. 위 4개는 replaceable implementation reference로만 사용하며, API 기반·local model·enterprise gateway·다른 LLM으로 전환해도 Course Spine이 유지되어야 한다.

---

## 3. Engineering Reference Flow (원문 그대로)

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

**Evidence Metadata:** Evidence Role = Foundational/Core; Source Provenance = Cross-source SW engineering lineage; Evidence Strength = Strong; Transferability = Broad; Curriculum Use = Core; BP = Not classified (Portfolio Evidence Classification 표의 "Stable SE principles applied to AI delegation" family).

---

## 4. Specification (원문 그대로)

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

**Evidence Metadata:** Foundational/Core · Cross-source SW engineering lineage · Strong · Broad · Core · Not classified.

---

## 5. Context (원문 그대로)

Dimensions:
- Task
- Knowledge
- Tool
- State
- Domain / Policy

Prompt ⊂ Context.

Reuse existing engineering assets:
requirements, domain model, tests, schemas, ADRs, policies.

**Evidence Metadata:** Foundational/Core · Cross-source SW engineering lineage · Strong · Broad · Core · Not classified.

---

## 6. Stage Contract (원문 그대로)

Minimum:
- Input
- Output
- Precondition
- Constraint
- Acceptance/Postcondition
- Gate
- Failure Path

Stage Contract is not literally OO DbC; it extends contract-based reasoning to probabilistic workflow execution.

**Evidence Metadata:** Foundational/Core · Cross-source SW engineering lineage · Strong · Broad · Core · Not classified.

---

## 7. Guardrail vs Harness (원문 그대로)

**Guardrail:** allowed/forbidden conditions and checks.

**Harness:** surrounding execution/control system that may include context loading, tools, state, workflow, gates, retry, evaluation, tracing, HITL, recovery.

Guardrail ≠ Harness.

**Evidence Metadata:** Foundational/Core · Cross-source SW engineering lineage · Strong · Broad · Core · Not classified.

---

## 8. Evaluation (원문 그대로)

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

**Evidence Metadata:** Foundational/Core · Research + engineering lineage · Moderate/Strong by claim · Broad/Conditional · Core · Not classified ("Evaluation / control / explicit semantics principles" family).

---

## 9. Autonomy (원문 그대로)

Autonomy is a risk allocation decision, not a synonym for model capability.

Consider:
- impact
- permission
- reversibility
- blast radius
- observability
- verification cost

**Evidence Metadata:** Foundational/Core · Research + engineering lineage · Moderate/Strong by claim · Broad/Conditional · Core · Not classified.

---

## 10. Drift / Capability Change (원문 그대로)

Monitor:
- model capability change
- prompt/spec drift
- context drift
- tool behavior/version
- evaluation drift

A better model does not automatically justify removing controls.

**Evidence Metadata:** Foundational/Core · Research + engineering lineage · Moderate/Strong by claim · Broad/Conditional · Core · Not classified.

---

## 11. Explicit Semantics / Ontology (원문 그대로)

Ontology is optional.

Useful when:
- multi-system vocabulary ambiguity is material
- concepts/relations/constraints need stronger explicitness
- multiple agents/systems must share semantics

Not required for:
- narrow CRUD
- simple single-team vocabulary
- tasks already well served by documents/schemas/domain models

**Evidence Metadata:** Foundational/Core · Research + engineering lineage · Moderate/Strong by claim · Broad/Conditional · Core · Not classified.

---

## 12. Source Policy (원문 그대로)

Global Baseline은 stable SW engineering principles, relevant empirical evidence, foundational/influential works, 필요한 reference framework로 구성한다.

Current vendor docs = product/implementation evidence, not universal engineering baseline.
Every fast-changing source should carry retrieval/update date in textbook authoring assets.

Replaceable implementation references:
- OpenAI Agents SDK documentation / release notes
- other vendor/model/tool documentation when the implementation itself is relevant

No single vendor, model, SDK, UI, or API owns the definitions of Agent, Guardrail, Harness, Context, Evaluation, or the Course Spine.

---

## Retrieval / Update Note

원 소스팩(§12)은 "빠르게 변하는 소스는 retrieval/update date를 함께 기재해야 한다"고 명시하지만, AI01–AI04 항목 자체에는 개별 조회일이 기재되어 있지 않다(원문 그대로 보존, 추가 조회일을 임의로 붙이지 않는다). Detailed deck publication 시 재검증한다 — `portfolio/concept-ownership.md` §13 Course Source Precedence의 공통 규칙("Current legal/regulatory claims, benchmark numbers, DORA metrics, AI governance status, product/vendor claims는 detailed deck publication 시 재검증한다")과 동일 원칙을 이 과정에도 적용한다.

---

## Cross-reference — course-context.md / practice-design.md

- `course-context.md` §13(Source Policy Pointer)가 이 문서를 가리킨다.
- Baseline "11. Source Policy"(`context/.../courses/05_ai-native.md`): "SW Engineering의 안정된 원칙을 engineering baseline으로 사용하고, 특정 모델/Agent SDK 문서는 현재 구현 사례로만 격리한다" — 이 문서의 §1(Two-Layer Evidence Model)·§2(Vendor Implementation Examples)와 동일한 구분이다.
- `portfolio/evidence-policy.md` §9(Vendor/Product/LLM Independence)가 이 문서 §2의 Curriculum Use 판단을 정본으로 통제한다.

---
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Design의 보조 근거이며 Curriculum Owner가 아니다(원문 그대로).
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다(원문 그대로).
- 다른 과정의 OWNER 개념은 재정의하지 않는다(원문 그대로).
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다(원문 그대로).
