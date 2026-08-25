# Portfolio Integrity & Reviewer Audit v2.6

> **Scope:** Unified Portfolio v2.6 current release  
> **Reviewer stance:** 구조·내용·근거·확장성 관점에서 원점 재검토  
> **Verdict:** **PASS — Approve as current Portfolio Canon baseline**

## 1. Review Question

이번 Audit은 단순 파일 존재 여부가 아니라 다음을 검토한다.

1. 지금까지 합의한 Governance가 실제 파일에 반영되었는가?
2. 11개 과정이 Learner/Customer Context에서 출발하는가?
3. Foundational Decision Lens가 상위 판단 기준으로 작동하는가?
4. Course Ownership과 Parent–Child Principle이 충돌하지 않는가?
5. LLM-integrated Practice가 Course 판단을 강화하고 특정 LLM에 종속되지 않는가?
6. Source/Evidence가 Global Baseline, Local/System Constraint, Vendor Independence 원칙을 지키는가?
7. 향후 신규 과정/변경 시 같은 체계가 유지될 수 있는가?

## 2. Agreed Governance — Applied

다음 합의사항은 모두 반영되었다.

- `Learner & Context Fit`을 Curriculum Content보다 앞선 설계 입력으로 둔다.
- `Customer-centered ≠ Customer-request-driven`을 명시한다.
- Foundational Decision Lens는 **Systems / Lean / Theory of Constraints / Design / Empiricism** 5개로 제한한다.
- Risk & Uncertainty, Trade-off/Decision은 별도 Foundational Lens로 만들지 않는다.
- Engineering Economics, risk-proportional rigor, simplicity, reversibility, evidence는 Cross-cutting Engineering Principle로 둔다.
- Portfolio Parent → Course-owned Child Principle 구조를 사용한다.
- Principle ID는 영역 prefix 방식으로 관리한다.
- `09_portfolio-change-and-extension-protocol.md`가 신규 과정과 변경 작업의 authoritative workflow를 소유한다.
- 변경은 `Need → Learner → Decision → Ownership → Content` 순서로 수행한다.
- Global Baseline과 Source Governance를 Change Protocol에 포함한다.
- `Canon`은 Portfolio/Course 승인 기준선 authority 의미로만 사용한다.
- concept/principle/work/source 성격에는 `Foundational / Established / Authoritative / Reference / Core` 등을 문맥에 맞게 사용한다.

## 3. Learner / Customer Review — 11 Courses

모든 Course Baseline에 다음 추적 구조가 존재한다.

`Audience/Work Context → Current Capability/Failure Mode → Target Capability → Decision Level → Transfer`

판정:

- **PASS:** 단순 persona가 아니라 Curriculum scope와 난이도를 결정하는 engineering input으로 사용된다.
- **PASS:** 고객이 요청한 기술명/과정명을 그대로 Course Spine으로 삼지 않는다.
- **PASS:** SW Proposal은 예외적으로 고객의 viable decision이 목적이며, engineering baseline은 고객을 교정하기 위한 목적이 아니라 실행 가능한 대안을 만드는 도구로 사용한다.

## 4. Foundational Decision Lens Reverse Audit

| Course | Strong APPLY Lenses | Reviewer Verdict |
|---|---|---|
| 01 OOAD | Systems, Empiricism | 협력 전체와 설계 feedback을 강화한다. 적절함. |
| 02 DDD | Systems, Design, Empiricism | domain discovery, meaning, boundary, model hypothesis와 직접 연결된다. 적절함. |
| 03 SW Architecture | Systems, Empiricism | quality interaction과 evolutionary evidence를 강화한다. 적절함. |
| 04 MSA | Systems, Lean, ToC, Empiricism | distribution cost, flow, constraint, operational evidence와 직접 연결된다. 적절함. |
| 05 AI-Native | Systems, Design, Empiricism | 업무 context, socio-technical control, evaluation을 강화한다. 적절함. |
| 06 Modern SWQM | Systems, Lean, ToC, Empiricism | prevention, system behavior, quality constraint, evidence와 직접 연결된다. 적절함. |
| 07 Agile | Lean, Systems, Empiricism | small batch, feedback, adaptation, whole value delivery와 직접 연결된다. 적절함. |
| 08 DevOps | Lean, Systems, ToC, Empiricism | flow, bottleneck, feedback, DORA evidence와 직접 연결된다. 적절함. |
| 09 Project Management | Systems, ToC, Empiricism | holistic project view, constraint, re-planning evidence를 강화한다. 적절함. |
| 10 SW Proposal | Design, Systems, Empiricism | customer problem, stakeholder decision system, evidence를 강화한다. 적절함. |
| 11 DT→AX | Design, Systems, Lean, ToC, Empiricism | transformation problem/value flow/constraint/pilot-scale 판단에 모두 실제 필요하다. 적절함. |

**Reviewer conclusion:** 모든 Course에 5개 Lens를 형식적으로 삽입하지 않았으며, APPLY 관계가 Course-owned 전문개념을 재정의하지 않는다.

## 5. Principle Architecture Review

### Foundational Parents
- SYS — Systems Thinking
- LEAN — Lean Thinking
- TOC — Theory of Constraints
- DT — Design Thinking
- EMP — Empiricism / Scientific Thinking

### Cross-cutting Parents
- Outcome over Activity
- Engineering Economics / Just Enough Engineering
- Risk-proportional Rigor
- Simplest Adequate Solution
- Reversibility
- Evidence Proportional to Claim
- One Concept, One Owner

### Course Child Families
`OOAD / DDD / ARCH / MSA / AI / QM / AGILE / DEVOPS / PM / PROP / AX`

판정:

- **PASS:** Parent는 방향을 제공하고 Child는 전문영역 판단을 소유한다.
- **PASS:** Principle ID 중복이 없다.
- **PASS:** Socio-technical, causality, complexity, resilience 등은 별도 Lens 남발 없이 Systems/Risk/Empiricism 등의 하위 원리로 흡수된다.

## 6. Global Baseline / Source Governance Review

작성 기준은 다음으로 통일되었다.

> 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작 및 일반화 가능한 실무를 교재 구성의 기본 기준으로 삼는다.

판정:

- **PASS:** 특정 국가·회사·벤더를 출처라는 이유만으로 배격하거나 승격하지 않는다.
- **PASS:** Foundational/Influential Work를 주요 curriculum evidence로 사용할 수 있다.
- **PASS:** DORA 장기 empirical research를 DevOps의 강한 empirical foundation으로 인정한다.
- **PASS:** Testing Pyramid 원칙과 Google 70/20/10 heuristic을 구분한다.
- **PASS:** 국제표준은 Course Decision의 직접 대상이 아닌 한 `Reference, not curriculum backbone` 원칙을 따른다.
- **PASS:** 특정 회사 소속 저자의 영향력 있는 전문 저작은 회사 marketing collateral과 분리해 평가한다.
- **PASS:** Local/System Constraint를 무시하고 이상적 practice를 실무자에게 강요하지 않는다.
- **PASS:** Contextual Adaptation을 설명할 때 `현재 constraint에서의 현실적 최적해`와 `constraint 제거 후 Preferred State`를 구분한다.
- **PASS:** WP catalog나 특정 산업/집단 비판을 교육목적으로 만들지 않는다.
- **PASS:** ISP/ISMP 같은 특정 한국 제도/용어는 해당 Course가 필요에 따라 소유하며 억지로 global terminology에 동일시하지 않는다.

## 7. Evidence Metadata Migration

11개 Source Evidence Pack을 모두 **v2.0 schema**로 승격했다.

분리된 표준 속성:

- Verification Status
- Evidence Role
- Source Provenance
- Evidence Strength
- Transferability
- Curriculum Use
- BP Classification

원칙:

- `Primary / Official ≠ Strong Evidence ≠ Generalizable Practice`
- BP Classification 기본값은 `Not classified`
- `Contextual/Korea BP`, `Korea WP`는 실제 교육상 필요한 경우에만 사용한다.
- Source Evidence 자체는 Course authority가 아니다.

## 8. LLM / Vendor Independence Review

- **PASS:** Course Concept / Principle / Practice / Artifact는 특정 LLM vendor/model/UI/API에 종속되지 않는다.
- **PASS:** AI-Native의 vendor 자료는 product-specific implementation example/reference로 격리된다.
- **PASS:** 다른 LLM, local model, enterprise gateway, API 기반 실행으로 바뀌어도 Course Spine과 Practice Decision은 유지된다.
- **PASS:** Prompt Engineering은 학습목표가 아니라 Course-owned professional judgment를 수행하기 위한 수단이다.

## 9. LLM-Integrated Practice Review

- Course Asset folders: **11**
- Practice Packs: **11**
- Total Practices: **57**
- 8h courses: **4 practices each**
- 16h courses: **7–8 practices**
- Timebox: **15–30분 범위, 현재 20–25분 중심**
- Required specification fields: **15 / 누락 0**
- Recommended Prompt 사전 공개 금지 유지
- 5–10분 후 Intervention → Keep Going → 종료 후 Recommended Prompt 공개 구조 유지

판정: **PASS**.

## 10. Change / Extension Sustainability Review

신규 과정 또는 의미 있는 변경은 다음 순서를 따른다.

`Learner/Customer Context → Desired Outcome → Capability Gap → Required Decisions → Existing Canon Coverage → Foundational Lens Review → Global Baseline/Source Review → Ownership Impact → Course/Curriculum → Practice/Asset/Evidence → Cross-course Review → Quality Gate → Audit → Release`

판정:

- **PASS:** 신규 기술/도구/표준 출현이 곧바로 신규 Course가 되는 것을 방지한다.
- **PASS:** 하위 Course를 먼저 수정한 뒤 Governance를 사후 합리화하는 drift를 방지한다.
- **PASS:** 새 Course Asset은 course-scoped 구조와 Admission Rule을 따라야 한다.

## 11. Controlled Open Items — Non-blocking

다음은 릴리스 차단 문제가 아니라 향후 자료 확장 시 관리할 항목이다.

1. Source Evidence의 깊이는 과정별로 다르다. OOAD/DevOps/SWQM은 상대적으로 풍부하고 Proposal/DT→AX는 얇다. 향후 상세 교재를 확장할 때 필요한 source를 추가하되 현재 Global Baseline 규칙을 유지한다.
2. DORA metric, AI governance, vendor/product behavior 등 시점 의존 근거는 상세 deck 출판 시 Currency Gate를 다시 통과한다.
3. ISP/ISMP 등 한국 제도 특화 내용은 DT→AX Course Owner가 필요 범위와 설명방식을 결정한다. Portfolio Governance가 임의로 global equivalent를 강제하지 않는다.
4. Contextual/Korea BP/WP label은 필요성이 발생할 때만 사용하며, 빈 taxonomy를 채우기 위해 사례를 추가하지 않는다.

## 12. Mechanical Validation

- Markdown files: **67**
- Course Baselines: **11**
- Course Asset folders: **11**
- Source Evidence Packs: **11 / schema v2.0**
- LLM Practice Packs: **11**
- LLM-integrated Practices: **57**
- Principle IDs: **94 / duplicate 0**
- Governance numbered documents: **00–12 continuous**
- Deprecated concept/source-quality adjective occurrences: **0**
- Deprecated BP-baseline terminology occurrences: **0**
- Legacy mixed provenance/verification status occurrences: **0**
- Product-specific LLM names outside Source Evidence: **0**
- Broken internal `.md` references: **0**
- Stale prior-package version references: **0**
- Validation errors: **0**

## 13. Final Reviewer Verdict

### **PASS — Approve v2.6 as the current Portfolio Canon baseline**

판정 근거:

- 구조 원칙이 명확하고 신규 Course/Asset 추가에도 확장 가능하다.
- Learner/Customer Context가 content보다 앞선다.
- 5개 Foundational Decision Lens가 과도하지 않으면서 11개 Course를 실질적으로 관통한다.
- Course Ownership과 Parent–Child Principle 경계가 유지된다.
- Global Baseline, Local/System Constraint, Contextual Adaptation, Proposal 예외가 서로 모순되지 않는다.
- Source provenance, evidence strength, transferability, curriculum use를 분리해 특정 조직·벤더·국가 자료가 부당하게 일반화되는 위험을 통제한다.
- LLM Practice는 특정 모델/제품이 아니라 전문적 판단과 재사용 가능한 업무 산출물에 초점을 둔다.

이 판정은 **모든 교재 내용이 더 이상 확장될 필요가 없다는 의미가 아니다.** 현재 Portfolio를 앞으로 추가·변경 작업의 기준선으로 사용해도 구조·원칙·근거 체계가 흔들리지 않는다는 의미다.
