# DT→AX — Verified Sources

> **Course ID:** dt-to-ax
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-c 구조를 따른다.
> **Authority:** `portfolio/evidence-policy.md`(스키마 정본) · `portfolio/evidence-policy.md` §13 "DT→AX"(Course Source Precedence, portfolio canon).
> **Source (원형 보존):** `context/course-portfolio-unified-v2.6/support/03_source-evidence/11_dt-to-ax-source-evidence-v2.0.md`(Source & Evidence Baseline v2.0). 이 문서는 해당 pack을 요약본으로 다시 쓰지 않고 원형을 보존한다(`guides/과정_설계_지침.md` §2-c: "source/evidence 원문을 요약본으로 다시 쓰지 않는다 — 원형 보존").
> **No fabrication:** 이 문서는 source evidence pack v2.0에 없는 quote·claim·수치를 추가하지 않는다. Pack에 없는 세부(예: 특정 기업 사례, 특정 수치)는 여기서도 채우지 않는다.

---

## 1. Course Source Precedence (portfolio canon — `portfolio/evidence-policy.md` §13 "DT→AX", 원문 그대로 인용)

1. stable transformation/business/operating-model principles
2. architecture/data/process fundamentals
3. necessary AI governance/reference sources
4. verified cases
5. technology/vendor examples

> **Common rule**(evidence-policy.md §13 하단, 전체 과정 공통): Current legal/regulatory claims, benchmark numbers, DORA metrics, AI governance status, product/vendor claims는 detailed deck publication 시 재검증한다.

이는 source evidence pack v2.0 §1 "Source Strategy"의 6단계 순서(아래 §2)와 정합한다 — pack이 세부화한 버전이며 서로 다른 우선순위가 아니다.

---

## 2. Source Strategy (source evidence pack v2.0 §1, 원문 그대로)

> 이 과정은 특정 Consulting Firm의 Transformation Framework를 보편적 기준으로 삼지 않는다.

정본은 다음 순서로 둔다.

1. stable transformation principles
2. business / operating model evidence
3. architecture / data / process fundamentals
4. current authoritative AI governance sources
5. current verified cases
6. technology examples

---

## 3. Portfolio Evidence Classification (source evidence pack v2.0, 분류표 원문 그대로)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Transformation / operating-model principles | Foundational/Core | Cross-source foundational literature | Moderate/Strong by claim | Broad/Conditional | Core | Not classified |
| Architecture / data / process fundamentals | Foundational/Core | Established engineering lineage | Strong | Broad | Core | Not classified |
| NIST AI RMF / GenAI Profile | Standard-Reference | Standard-Official Specification | Strong for reference framework | Broad/Conditional | Reference | Not classified |
| ISO/IEC 42001 | Standard-Reference | Standard-Official Specification | Strong for standard definition | Broad/Conditional | Reference | Not classified |
| ISP / ISMP | Contextual Adaptation / Institutional Context | Local-Institutional Source | Context-specific | Local-Institutional | Course-owned Context/Reference | Not classified |

**BP Classification 기본값:** 전 항목 `Not classified` — `portfolio/evidence-policy.md` §2.6("기본값은 Not classified다. BP/WP label 자체가 교육목적일 때만 사용한다")과 일치. 이 pack에는 BP/WP label을 도입할 교육상 필요가 확인되지 않았으므로 여기서도 새로 분류하지 않는다.

**Local Context 처리(evidence-policy.md §7.1, `course-context.md` §11.5와 상호 참조):** ISP/ISMP 행의 Evidence Role은 "Contextual Adaptation / Institutional Context"이며 Transferability는 "Local-Institutional"이다. 이는 한국 제도·조달·계획 체계에 특유한 조건이며, global engineering principle로 제시하지 않는다.

---

## 4. Legacy Topics Retained in Current Baseline (source evidence pack v2.0 §2, 원문 그대로)

이전 DT 교재에서 유효성을 인정해 현재 Baseline에 흡수한 주제:
- ISP / ISMP 공공 가이드
- BPR
- Enterprise Architecture
- Digital Transformation strategy
- Change management
- Business Model Generation
- Lean Startup / pilot logic

이들은 역사/방법론 lineage로 사용하며, 이전 PPT 자체는 현재 Package의 필수 dependency가 아니다.

**Legacy asset 상태 참고:** 이는 옛 slide placement·font·display 권고 같은 legacy 자료가 아니라 방법론 lineage 자료다 — `guides/과정_설계_지침.md` §2-c의 legacy 처리 규칙("legacy 자료는 삭제하지 않되 지금은 normative instruction이 아님을 명시")이 적용될 만한 normative 서식 지침은 이 pack에 없다. 해당 사항 없음(N/A).

---

## 5. Current AI Governance Sources (source evidence pack v2.0 §3, 원문 그대로 + Verification Status 추가)

### NIST AI RMF 1.0

**Purpose:**
- risk management across design, development, deployment, use
- trustworthy / responsible AI
- use-case agnostic

**Course use:**
- Governance / Map / Measure / Manage orientation
- risk-based use-case selection
- lifecycle thinking

**Important (pack 원문):**
- NIST states AI RMF 1.0 is being revised as of 2026.
- detailed slides must check latest status before publication.

**Verification Status:** Pending re-verification — 시점 의존적 claim(개정 진행 중). Curriculum Use: Reference(위 분류표). Detailed deck publication 시 최신 상태 재확인 필수(evidence-policy.md §13 Common rule과 일치).

### NIST AI RMF: Generative AI Profile

Published July 2024; updated by NIST page in 2026.

**Course use:**
- generative AI risk awareness
- lifecycle risk
- governance action examples

**Verification Status:** Pending re-verification — 최신 업데이트 시점이 pack 작성 이후일 수 있으므로 publication 전 재확인 필요.

### ISO/IEC 42001:2023

AI Management System.

**Course use:**
- organization-wide AI governance
- policies / objectives / processes
- risk + opportunity management
- continual improvement
- accountability / transparency / traceability orientation

**Not used for:**
- certification preparation
- clause-by-clause training

**Verification Status:** 표준 자체의 정의(2023년 발행)는 안정적 Reference로 간주하되, 조항 상세는 Reference 용도로만 사용하고 Course Spine으로 확장하지 않는다(evidence-policy.md §6 "Reference, not curriculum backbone").

---

## 6. Evidence Rules (source evidence pack v2.0 §4, 원문 그대로 — 재작성하지 않음)

- Technology vendor claims are examples, not transformation evidence.
- AI adoption counts are not value evidence.
- Use case success must compare to baseline.
- Case studies must distinguish reported result from causal proof.
- Historical DT examples must be rechecked before slide reuse.
- Current legal/regulatory claims must be reverified at publication time.
- "AX" should not be described as a universally standardized framework.
- Agentic AI should not be presented as inherently superior to assistive AI.

---

## 7. Measurement Baseline (source evidence pack v2.0 §5, 원문 그대로)

Use evidence categories:

- Business Outcome
- Customer Outcome
- Flow
- Quality
- Economics
- Risk
- Learning

Avoid (standalone success measures로 사용 금지):
- prompt count
- AI user count
- number of PoCs
- number of deployed models

---

## 8. Course Baseline Alignment (source evidence pack v2.0 §6, 원문 그대로)

Course spine:

```text
Value
→ Capability
→ Work / Decision Redesign
→ Foundation
→ Governance
→ Pilot
→ Evidence
→ Scale / Stop
```

이 spine은 `course-context.md` §7 "Course Narrative"에서 동일하게 인용된다(이중 정의가 아니라 동일 정본을 두 문서가 각자의 관점에서 참조).

---

## 9. Quote / Attribution 점검 (evidence-policy.md §11)

Source evidence pack v2.0에는 특정 저자에게 귀속되는 verbatim quote(따옴표 인용문)가 없다 — 표준/프레임워크(NIST, ISO/IEC)에 대한 목적·용도 설명과 evidence rule 서술만 존재한다. 따라서 `ko / en / author / source / locator / status` quote-attribution 표는 해당 사항 없음(N/A)이다. 향후 상세 교재 작성 시 원전에서 직접 인용문을 채택하면, 그 시점에 원전·저자·locator를 확인하고 이 절을 확장한다(paraphrase와 quote를 구분).

---

## 10. Authoring Checklist 점검 (evidence-policy.md §12)

- [x] Global Baseline 근거 유형: Foundational/Core(transformation principles, architecture/data/process fundamentals), Standard-Reference(NIST/ISO), Contextual Adaptation(ISP/ISMP) — §3 분류표로 구분됨.
- [x] Source Provenance와 Evidence Strength를 혼동하지 않음 — §3 분류표에서 별도 열로 유지.
- [x] Evidence Strength(Strong/Moderate/Limited/Pending)는 claim family별로 판단됨(§3) — 개별 claim 단위 세분화는 상세 교재 작성 시 pack이 더 채워야 한다(현재 pack은 claim family 단위까지만 제공, §11 참고).
- [x] Transferability(Broad/Conditional/Local/Product-specific) 판단됨(§3) — ISP/ISMP는 Local-Institutional.
- [x] Curriculum Use(Core/Supporting/Example/Reference/Hold) 명시됨(§3).
- [x] BP Classification은 기본값 Not classified이며 필요한 경우에만 사용 — 현재 전 항목 Not classified(§3).
- [x] organizational/vendor case를 general rule로 자동 승격하지 않음 — Evidence Rules(§6) "Technology vendor claims are examples, not transformation evidence."
- [x] 한국 자료/사례(ISP/ISMP)는 Global Baseline 관점에서 역검토됨 — Local Context로 명시적 분리(§3, `course-context.md` §11.5).
- [x] Contextual Adaptation의 Local/System Constraint 명시 — ISP/ISMP 행(§3).
- [x] 특정 LLM/vendor에 교재 구조가 종속되지 않음 — Evidence Rules(§6) vendor claim 항목, `portfolio/evidence-policy.md` §9 Vendor/Product/LLM Independence 원칙 적용.
- [x] 국제표준(NIST/ISO)이 Course Spine을 차지하지 않음 — Curriculum Use: Reference로 한정(§3, §5).

---

## 11. Known Gaps — 향후 상세 교재 작성 시 보강 필요

`context/.../support/04_audit/01_portfolio-integrity-audit-v2.6.md` §1이 명시한 대로, DT→AX의 Source Evidence는 OOAD/DevOps/SWQM 대비 상대적으로 얇다("Proposal/DT→AX는 얇다"). 이 문서는 v2.0 pack의 원형을 보존할 뿐 새 근거를 추가하지 않는다. 상세 slide/deck 저작 단계에서 다음이 필요하다(추측이 아니라 pack이 이미 요구한 재검증 항목을 정리):

- NIST AI RMF 1.0 개정 상태 재확인(§5).
- NIST GenAI Profile 최신 업데이트 반영(§5).
- 특정 조직의 verified case(현재 pack에는 이름 붙은 사례가 없음 — 사용 시 baseline과 비교, causal proof와 reported result 구분, §6).
- Current legal/regulatory claims 재검증(§6, evidence-policy.md §13 Common rule).
- individual claim 단위 Evidence Strength 세분화(현재는 claim family 단위, §3).
