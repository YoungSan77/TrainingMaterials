# Modern SWQM — Verified Sources

> **Course ID:** swqm
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-c 구조를 따른다.
> **Schema Authority:** `portfolio/evidence-policy.md`(Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification의 정본 — 여기서 재정의하지 않는다).
> **Source:** `context/course-portfolio-unified-v2.6/support/03_source-evidence/06_swqm-source-evidence-v2.0.md`(Source & Evidence Baseline v2.0) — 원문을 요약하지 않고 그대로 흡수했다. claim·quote·locator·teaching correction 문장은 원본 그대로다.
> **Curriculum pointer (read-only, 정본 아님):** 실제 커리큘럼의 인용 자산(`Q-DEMING-94-6`, `Q-CROSBY-FREE`, `Q-GREENLEAF-SERVANT`, `Q-CROSBY-CONFORM`, `Q-DEMING-INSPECT`, `Q-DIJKSTRA-TESTING`, `Q-CONWAY-STRUCTURE`, `Q-STRATHERN-MEASURE`, `Q-DEMING-SLOGANS`, `Q-DEMING-IMPROVE` 등)는 `courses/swqm/swqm_커리큘럼.md` 자체의 "인용 자산" 절이 이미 소유한다. 이 문서는 그 절을 복제하지 않는다 — 이중 SSOT를 피하기 위함이다(`과정_설계_지침.md` §2-a). 아래 내용은 그와 별도로 존재하는 **Source/Evidence Baseline** 문서(수치·claim의 검증 상태와 최신성을 다루는 자산)를 그대로 보존한 것이다.
> **Legacy 표기:** 이 문서에 옛 slide placement·font·display 권고는 없다. 전체가 현재도 normative한 evidence classification이다.

---

## 0. Course Alignment (원문)

> Modern SWQM 8h. DORA는 DevOps/Delivery 성과 측정과의 접점으로만 다루며 QM의 고유 Metric Set으로 소유하지 않는다.

> **주의:** 이 표기(`8h`)는 원본 Source/Evidence Baseline이 대상으로 삼은 baseline 문서(`context/.../courses/06_swqm.md`)의 시간 단위다. 실제 `courses/swqm/swqm_커리큘럼.md`는 16h·2일·11세션이며 이 값이 우선한다(`courses/swqm/design/course-context.md` 헤더 규칙과 동일). 아래 evidence classification·claim·teaching correction 내용 자체는 시간 단위와 무관하게 유효하므로 그대로 흡수한다.

---

## 1. Portfolio Evidence Classification (원문, 표 그대로 보존)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| DORA delivery-performance research | Empirical | Research-Empirical Program | Strong | Broad/Conditional | Supporting | Not classified |
| Testing Pyramid principle | Established Practice-Pattern | Cross-source practitioner lineage | Strong | Broad/Conditional | Core | Not classified |
| Google 70/20/10 | Practitioner Heuristic | Organizational Primary | Limited | Conditional | Example-Heuristic | Not classified |
| Deming system view / 94% statement | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Goodhart attribution | Foundational/Core | Original/Authoritative attribution | Moderate | Broad | Supporting | Not classified |
| Boehm defect-cost multiplier | Empirical/Historical | Original research pending direct verification | Pending | Conditional | Hold | Not classified |
| ISO quality-management material | Standard-Reference | Standard-Official Specification | Strong for definition/reference | Broad | Reference | Not classified |
| CMMI current model | Standard-Reference | Official Specification | Strong for model definition | Broad/Conditional | Reference | Not classified |

`evidence-policy.md` §2.6 규칙대로 BP Classification 기본값은 전부 **Not classified**이며, 이 원문에서도 별도 BP/WP label을 부여하지 않았다.

---

## 2. DORA — Delivery Metric Awareness, not QM-owned Metrics

### Q01 — Five software delivery performance metrics

- **Verification Status:** Verified
- **Source:** DORA official guide, updated 2026-01-05.
- **Evidence Role:** Empirical
- **Source Provenance:** Research-Empirical Program
- **Evidence Strength:** Strong
- **Transferability:** Broad/Conditional
- **Curriculum Use:** Supporting
- **BP Classification:** Not classified

**Claim (원문):**

Current five:

**Throughput**
1. Change lead time
2. Deployment frequency
3. Failed deployment recovery time

**Instability**
4. Change fail rate
5. Deployment rework rate

**Teaching correction (원문):**
- "DORA 4대 지표"를 현재 정본처럼 표현하지 않는다.
- original four keys는 history로 설명 가능.
- MTTR 일반론 대신 Failed Deployment Recovery Time의 현재 범위를 설명한다.
- metric은 application/service context에서 시간에 따른 improvement에 사용하고 ranking/KPI gaming을 피한다.

---

## 3. Test Pyramid

### Q02 — 70/20/10 is a heuristic, not a target

- **Verification Status:** Verified
- **Source:** Google Testing Blog, 2015.
- **Evidence Role:** Practitioner Heuristic (70/20/10 자체) / Established Practice-Pattern (pyramid shape 원칙)
- **Source Provenance:** Organizational Primary
- **Evidence Strength:** Limited (수치) / Strong (pyramid 원칙)
- **Transferability:** Conditional
- **Curriculum Use:** Example-Heuristic (수치) / Core (pyramid 원칙)
- **BP Classification:** Not classified

**Claim (원문):**

Google은 70/20/10을 "good first guess"로 소개하며 exact mix는 team마다 다르다고 명시한다.

**Teaching correction (원문):**
- 70/20/10을 정책/KPI/보편적 고정 비율로 사용 금지.
- 핵심은 broad/slow tests보다 narrow/fast tests가 더 많은 pyramid shape와 feedback economics.

---

## 4. Deming 94%

### Q03 — 94% belongs to the system

- **Verification Status:** Verified
- **Source:** W. Edwards Deming Institute, citing *Out of the Crisis*.
- **Short source text:** "94% belongs to the system (responsibility of management)."
- **Evidence Role:** Foundational/Core
- **Source Provenance:** Original-Foundational Author
- **Evidence Strength:** Strong
- **Transferability:** Broad
- **Curriculum Use:** Core
- **BP Classification:** Not classified

**Teaching correction (원문):**
- 94%를 universal empirical constant로 가르치지 않는다.
- Deming 자신의 경험적 estimate와 system/common-cause reasoning의 교육적 anchor로 사용.
- 개인 책임이 존재하지 않는다는 literal claim으로 확장 금지.

---

## 5. Goodhart

### Q04 — Original vs popular paraphrase

- **Verification Status:** Verified
- **Evidence Role:** Foundational/Core
- **Source Provenance:** Original/Authoritative attribution
- **Evidence Strength:** Moderate
- **Transferability:** Broad
- **Curriculum Use:** Supporting
- **BP Classification:** Not classified

**Claim (원문):**

Charles Goodhart original form:
"Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes."

Popular phrase:
"When a measure becomes a target, it ceases to be a good measure."

후자는 Goodhart의 축자문이 아니라 Marilyn Strathern 1997의 formulation으로 다루는 것이 안전하다.

**Teaching correction (원문):**

Quote asset에서 author/status를 분리한다.

---

## 6. Defect Cost / Boehm

### Q05 — Avoid universal "100x rule"

- **Verification Status:** Pending
- **Evidence Role:** Empirical/Historical
- **Source Provenance:** Original research pending direct verification
- **Evidence Strength:** Pending
- **Transferability:** Conditional
- **Curriculum Use:** Hold
- **BP Classification:** Not classified

**Claim (원문):**

Late discovery/rework가 더 비쌀 수 있다는 engineering principle은 유지.
그러나 "운영에서 발견하면 정확히 100배"를 universal law로 쓰지 않는다.

Use:
- feedback delay
- rework propagation
- context-specific cost

Avoid:
- fixed multiplier as timeless empirical constant

**Teaching correction (원문):**

최종 textbook 수치 인용 전 Boehm original table/edition locator를 확인한다.

---

## 7. ISO Quality Management

### Q06 — QMS is system/process oriented

- **Verification Status:** Verified
- **Source:** ISO official ISO 9001 guidance.
- **Evidence Role:** Standard/Reference
- **Source Provenance:** Standard-Official Specification
- **Evidence Strength:** Strong for definition/reference
- **Transferability:** Broad
- **Curriculum Use:** Reference
- **BP Classification:** Not classified

**Claim (원문):**

Seven quality management principles include customer focus, leadership, engagement of people, process approach, improvement, evidence-based decision making, relationship management.

**Teaching rule (원문):**

ISO를 문서 bureaucracy로 축소하지 않는다.

---

## 8. CMMI Currentness

### Q07 — CMMI v3.0 current model context

- **Verification Status:** Verified
- **Source:** CMMI Institute / ISACA v3.0 certification/adoption materials.
- **Evidence Role:** Standard/Reference
- **Source Provenance:** Official Specification
- **Evidence Strength:** Strong for model definition
- **Transferability:** Broad/Conditional
- **Curriculum Use:** Reference
- **BP Classification:** Not classified

**Claim (원문):**

Quality-related practice areas include:
- Peer Reviews (PR)
- Process Quality Assurance (PQA)
- Requirements Development & Management (RDM)
- Verification & Validation (VV)

**Teaching rule (원문):**

maturity/capability는 certification ladder 암기보다 improvement/value lens로 사용.

---

## 9. Modern SWQM Course Alignment (원문)

```text
Quality Risk
→ Prevention
→ Verification
→ Evidence
→ Gate
→ Feedback
→ System Improvement
```

QM consumes but does not own:
- DDD Domain Model / UL / Ontology
- AI Context / Guardrail / Harness
- SWA architecture definitions
- MSA patterns
- future DevOps delivery mechanics

이 boundary는 `courses/swqm/design/course-context.md` §11.2–§11.4의 OWNER/APPLY/RECAP 경계, `courses/swqm/design/practice-design.md` P4의 AI-Native 경계 서술과 일치한다.

---

## 10. Source URLs (원문)

- https://dora.dev/guides/dora-metrics/
- https://dora.dev/insights/dora-metrics-history/
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
- https://deming.org/quotes/
- https://www.iso.org/files/live/sites/isoorg/files/store/en/PUB100373.pdf
- https://cmmiinstitute.com/

---

## 11. Unified Portfolio Alignment v2.6 (원문)

- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.

---

## 12. 8h Curriculum Evidence Map (원문, baseline Topic 기준)

- T01–T02: Quality as system / Shift-Left / responsibility
- T03–T04: QMS / maturity / audit & evidence
- T05–T06: requirement quality / review & static verification
- T07–T08: test strategy / quality pipeline / evidence & gate
- T09: metrics / system incentives
- T10: AI output quality + QM operating model — AI-Native APPLY only
- Action planning is embedded in T10; 별도 workshop 없음.

### Boundary correction (원문)

- DORA/CI/CD/Deployment Flow 상세: future DevOps OWNER.
- Domain Model/UL/Ontology: DDD/AI-Native OWNER.
- Guardrail/Harness: AI-Native OWNER.

> **참고 (이 문서의 추가 주석, 원문 아님):** 위 T01–T10 번호는 baseline 8h 구조다. 실제 16h·11세션 `courses/swqm/swqm_커리큘럼.md`(S01–S11)와의 대응은 `courses/swqm/design/practice-design.md` §4 "Curriculum Placement Mapping"에서 다룬다. 이 문서(verified-sources.md)는 그 매핑을 다시 옮기지 않는다 — evidence 원문 보존이 이 문서의 역할이고, Placement 판단은 practice-design.md의 역할이기 때문이다.

---

## 13. Authoring Checklist Status (evidence-policy.md §12 대조)

- [x] Global Baseline 근거 유형 판단됨 (§1 표, Evidence Role 열)
- [x] Source Provenance와 Evidence Strength 분리 판단됨
- [x] Evidence Strength(Strong/Moderate/Limited/Pending)를 claim별로 판단함 (Q01–Q07 각 항목)
- [x] Transferability(Broad/Conditional/Local/Product-specific) 판단됨
- [x] Curriculum Use(Core/Supporting/Example/Reference/Hold) 명시됨
- [x] BP Classification은 기본값 Not classified 유지 (필요 사례 없음)
- [x] Foundational Work(Deming, Goodhart)의 개념·귀속·해석 여지를 구분함 (Q03, Q04)
- [x] organizational/vendor case(Google 70/20/10)를 general rule로 자동 승격하지 않음 (Q02 Teaching correction)
- [x] 특정 LLM/vendor 종속 없음 — 이 pack은 tool-agnostic
- [x] 국제표준(ISO/CMMI)은 Reference로만 사용, Course Spine을 차지하지 않음 (§7·§8 Curriculum Use = Reference)
