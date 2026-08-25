# SW Proposal — Verified Sources

> **Course ID:** sw-proposal
> **Schema Authority:** `portfolio/evidence-policy.md` (Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification), `portfolio/governance.md` (Verification Status 요구)
> **Source (transcribed in full, not summarized):** `context/course-portfolio-unified-v2.6/support/03_source-evidence/10_sw-proposal-source-evidence-v2.0.md` — SW 제안 전략과 제안서 작성 실무 · Source & Evidence Baseline v2.0
> **Related Precedence Rule:** `portfolio/evidence-policy.md` §13 "Course Source Precedence — Current → SW Proposal"

---

## 0. Proposal Exception — Governing Frame for This Course's Evidence (READ FIRST)

`portfolio/evidence-policy.md` §10 "Proposal Exception — Customer Decision Context"가 이 과정에 적용된다. 다른 9개 과정과 달리 SW Proposal에서는 **Global Baseline이 목적이 아니라 viable customer decision을 만들기 위한 도구**다:

```text
Understand customer intent
→ satisfy explicit requirements
→ identify material feasibility/risk issues
→ propose acceptable alternatives where needed
→ maximize probability of a viable customer decision
```

- 고객 RFP를 교정하거나 비판하는 것이 제안의 목적이 아니다.
- Engineering truth / feasibility / material risk가 문제라면 고객이 받아들일 수 있는 assumption, option, risk, alternative로 완곡하게 제시한다.
- 수용 불가능한 조건이면 **제안하지 않는 판단(No-Bid)** 도 이 exception이 포함하는 범위다.

이 exception의 실무적 함의: 아래 §2 "Evidence Hierarchy"에서 **Customer-provided RFP/evaluation criteria가 최상위**에 오는 것은 우연이 아니라, 다른 과정의 "Global Baseline 우선" 원칙과 SW Proposal에서 의도적으로 달라지는 지점이다. Source Strategy(baseline 원문, §1)가 이를 명시한다:

> 이 과정은 특정 입찰제도나 특정 회사의 Proposal Methodology를 보편적 기준으로 삼지 않는다.

즉, "특정 회사 방법론에 종속되지 않는다"는 원칙(Global Baseline의 vendor-independence 정신)은 유지하되, "이 과정의 evidence 정점이 고객 그 자체"라는 점에서 다른 과정과 다르다. 핵심은 보편적인 **B2B / SW proposal decision logic**이다.

---

## 1. Portfolio Evidence Classification (baseline 원문 표, 그대로 보존)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Customer RFP / evaluation criteria / confirmed discovery | Contextual Adaptation / Direct Decision Evidence | Organizational Primary | Strong for that opportunity | Local/Opportunity-specific | Core | Not classified |
| Contract / legal / compliance requirements | Standard-Reference / Direct Constraint | Official/Authoritative Source | Strong | Local/Conditional | Core | Not classified |
| Verified delivery/reference evidence | Case/Example | Organizational Primary | Strong for credibility, limited for generalization | Conditional | Core/Supporting | Not classified |
| Established capture/proposal literature | Established Practice-Pattern | Authoritative Secondary / Professional Literature | Moderate | Conditional | Supporting | Not classified |
| Generic marketing claims | Commentary/Tertiary | Organizational/Vendor | Limited | Product/Company-specific | Hold/Example | Not classified |

### Verification Status (본 과정 추가 필드 — `portfolio/governance.md` p.174 요구, baseline 원문에 없던 필드를 evidence-policy 스키마에 맞춰 부여)

각 row는 성격상 사전 검증 가능한 "정본"이 아니라 **개별 기회(opportunity)마다 재확인이 필요한 증거 유형**이다. 따라서 Verification Status는 "완료" 여부가 아니라 검증 책임 소재로 판단한다.

| Source/Claim Family | Verification Status |
|---|---|
| Customer RFP / evaluation criteria / confirmed discovery | Verified-per-opportunity — 매 기회마다 실제 RFP 원문·확인된 discovery로 재검증. 포트폴리오 차원에서 사전 검증할 대상이 아니다. |
| Contract / legal / compliance requirements | Pending — 법무·계약 검토는 실제 사업 적용 시 별도 검증 필요(baseline "16. Explicit Non-Scope"에 "계약법" 명시 — 이 과정은 계약법 자체를 소유하지 않는다). |
| Verified delivery/reference evidence | Verified-per-opportunity — 사용하는 case/reference마다 내부적으로 검증된 것만 사용(baseline Evidence Hierarchy 규칙 4). |
| Established capture/proposal literature | Verified — APMP/Shipley 계열은 업계에 정착된 established practice-pattern으로 포트폴리오 baseline 채택 시점 기준 확인됨. §5 "Currency Rule"에 따라 detailed slide production 전 용어 최신성 재확인 필요. |
| Generic marketing claims | Not verified / Hold — Curriculum Use가 Hold/Example이므로 애초에 교재 주장 근거로 사용하지 않는다. |

---

## 2. Source Categories (baseline 원문, 그대로 보존)

### 1. Opportunity / Capture / Proposal Management
- APMP Body of Knowledge 계열
- Shipley proposal / capture management 계열
- 조직별 bid governance practices

Use for:
- Bid / No-Bid
- Capture
- Win Strategy
- Compliance
- Proposal review
- Proposal production

### 2. Project / Delivery Feasibility
- PMBOK principles
- estimation / scheduling / sourcing / risk management

Use for:
- delivery credibility
- assumption
- dependency
- risk
- transition
- commercial alignment

### 3. Solution / Architecture
- Architecture decision and trade-off principles
- requirements traceability
- quality attributes

Use for:
- customer problem → solution logic
- solution rationale
- evidence

### 4. Persuasive Communication
- executive communication
- evidence-based claims
- information design

Use for:
- executive summary
- storyline
- section messaging
- visual structure

---

## 3. Evidence Hierarchy (baseline 원문, 그대로 보존)

1. Customer-provided RFP / evaluation criteria
2. Customer discovery / confirmed stakeholder information
3. Contract / legal / compliance requirements
4. Internal verified delivery data
5. Comparable reference cases
6. Product / technical evidence
7. External benchmark
8. Generic marketing claim

---

## 4. Important Rules (baseline 원문, 그대로 보존)

- Customer source outranks generic best practice.
- Evaluation criteria outrank writer preference.
- Verified evidence outranks adjective.
- Comparable reference outranks unrelated large reference.
- Proposal must not invent customer pain that discovery/RFP does not support.
- Assumptions must be visible where they affect solution, schedule, price, or risk.
- Compliance and persuasion are separate dimensions; both are required.
- No framework name becomes the course spine.

---

## 5. Currency Rule (baseline 원문, 그대로 보존)

Before detailed slide production:
- verify current APMP terminology if cited
- verify procurement / public bidding rules if a specific jurisdiction is discussed
- verify vendor/product claims
- verify reference metrics

> 위 4개 항목은 이 Source Evidence Baseline이 승인된 시점 이후 재검증이 필요한 항목으로, 아직 course-context.md/practice-design.md 저작 단계에서는 수행하지 않았다. 실제 deck/slide 저작 단계(Stage 3)에서 반드시 재확인한다 — `guides/과정_설계_지침.md` §6 Curriculum Authoring Gate 이후의 책임.

---

## 6. Course Source Precedence — SW Proposal (`portfolio/evidence-policy.md` §13, 그대로 보존)

1. customer RFP / evaluation criteria / confirmed discovery
2. contract/legal/compliance requirements
3. verified internal delivery/reference evidence
4. established proposal/capture guidance
5. generic marketing claims last

**Common rule** (evidence-policy.md §13 하단, 전 과정 공통이나 SW Proposal에도 적용): Current legal/regulatory claims, benchmark numbers, DORA metrics, AI governance status, product/vendor claims는 detailed deck publication 시 재검증한다.

---

## 7. Cross-reference — Concept & Terminology Sources Used in Course Design

이 과정의 course-context.md·practice-design.md 저작에 사용한 portfolio-canon 출처(원문 그대로 인용, 요약 없이 옮김):

| Claim / Concept | Locator | Verification Status | Evidence Role | Curriculum Use |
|---|---|---|---|---|
| SW Proposal OWNER 목록(Opportunity Qualification/Bid-No-Bid, Customer Decision/Evaluation Criteria, Win Strategy/Competitive Positioning, Proposal-level Solution+Delivery+Commercial alignment, Claim-Evidence strategy, Compliance+Persuasion, Proposal Storyline/Review) | `portfolio/concept-ownership.md` "### SW Proposal" (OWNER, Boundary) | Verified — Portfolio Canon | Foundational/Core (Governance) | Core |
| "Bid / No-Bid" 정의: 사업기회의 매력도, 수주 가능성, 수행 가능성·상업성을 근거로 제안 참여 여부를 결정하는 의사결정 | `portfolio/terminology.md` "### Bid / No-Bid" | Verified — Portfolio Canon | Foundational/Core | Core |
| "Win Strategy" 정의: 고객의 중요한 의사결정 기준, 경쟁구도, 자사의 차별화 가능한 강점과 Evidence를 연결하여 선택받을 이유를 설계하는 전략 | `portfolio/terminology.md` "### Win Strategy" | Verified — Portfolio Canon | Foundational/Core | Core |
| Foundational Decision Lens Fit: Design Thinking / Systems Thinking / Empiricism (10 SW Proposal row) | `context/course-portfolio-unified-v2.6/support/04_audit/01_portfolio-integrity-audit-v2.6.md` §4 "Strong APPLY Lenses" 표 | Verified — Portfolio Audit v2.6 | Standard/Reference (internal governance decision) | Core |
| PROP-01~05 Course-owned Child Principles (C10. Customer Decision & Proposal) | `portfolio/principles.md` "## C10. Customer Decision & Proposal — SW Proposal" | Verified — Portfolio Canon | Foundational/Core | Core |
| Proposal Exception — Customer Decision Context (evidence precedence 예외) | `portfolio/evidence-policy.md` §10 | Verified — Portfolio Canon | Standard/Reference (governance exception) | Core |

BP Classification: 위 항목 전부 **Not classified**(기본값) — 포트폴리오 governance/terminology 정본 자체는 BP/WP 분류 대상이 아니다.

---

## Legacy / Non-normative Note

이 문서에는 옛 slide placement·font·display 권고 등 legacy 자료가 포함되어 있지 않다 — 본 과정은 신규 흡수(greenfield)이며 이전 slide/deck 자산이 없다. 향후 deck 저작 단계에서 그런 자료가 추가되면 이 절에 "지금은 normative instruction이 아님"을 명시한 채 보존한다(`guides/과정_설계_지침.md` §2-c).
