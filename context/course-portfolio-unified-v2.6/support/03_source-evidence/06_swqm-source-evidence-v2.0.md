# Modern SWQM Source & Evidence Baseline v2.0

> Purpose: Modern SWQM curriculum의 오래된/과장된 수치·인용·모델을 정리하고 Global-primary source 기준을 고정한다.

> **Course alignment:** Modern SWQM 8h. DORA는 DevOps/Delivery 성과 측정과의 접점으로만 다루며 QM의 고유 Metric Set으로 소유하지 않는다.


## Portfolio Evidence Classification

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

## 1. DORA — Delivery Metric Awareness, not QM-owned Metrics

### Q01 — Five software delivery performance metrics
**Verification Status:** Verified  
**Source:** DORA official guide, updated 2026-01-05.

Current five:
**Throughput**
1. Change lead time
2. Deployment frequency
3. Failed deployment recovery time

**Instability**
4. Change fail rate
5. Deployment rework rate

### Teaching correction
- “DORA 4대 지표”를 현재 정본처럼 표현하지 않는다.
- original four keys는 history로 설명 가능.
- MTTR 일반론 대신 Failed Deployment Recovery Time의 현재 범위를 설명한다.
- metric은 application/service context에서 시간에 따른 improvement에 사용하고 ranking/KPI gaming을 피한다.

## 2. Test Pyramid

### Q02 — 70/20/10 is a heuristic, not a target
**Verification Status:** Verified  
**Source:** Google Testing Blog, 2015.

Google은 70/20/10을 “good first guess”로 소개하며 exact mix는 team마다 다르다고 명시한다.

### Teaching correction
- 70/20/10을 정책/KPI/보편적 고정 비율로 사용 금지.
- 핵심은 broad/slow tests보다 narrow/fast tests가 더 많은 pyramid shape와 feedback economics.

## 3. Deming 94%

### Q03 — 94% belongs to the system
**Verification Status:** Verified  
**Source:** W. Edwards Deming Institute, citing *Out of the Crisis*.  
**Short source text:** “94% belongs to the system (responsibility of management).”

### Teaching correction
- 94%를 universal empirical constant로 가르치지 않는다.
- Deming 자신의 경험적 estimate와 system/common-cause reasoning의 교육적 anchor로 사용.
- 개인 책임이 존재하지 않는다는 literal claim으로 확장 금지.

## 4. Goodhart

### Q04 — Original vs popular paraphrase
**Verification Status:** Verified

Charles Goodhart original form:
“Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.”

Popular phrase:
“When a measure becomes a target, it ceases to be a good measure.”

후자는 Goodhart의 축자문이 아니라 Marilyn Strathern 1997의 formulation으로 다루는 것이 안전하다.

### Teaching correction
Quote asset에서 author/status를 분리한다.

## 5. Defect Cost / Boehm

### Q05 — Avoid universal “100x rule”
**Verification Status:** Pending

Late discovery/rework가 더 비쌀 수 있다는 engineering principle은 유지.
그러나 “운영에서 발견하면 정확히 100배”를 universal law로 쓰지 않는다.

Use:
- feedback delay
- rework propagation
- context-specific cost

Avoid:
- fixed multiplier as timeless empirical constant

최종 textbook 수치 인용 전 Boehm original table/edition locator를 확인한다.

## 6. ISO Quality Management

### Q06 — QMS is system/process oriented
**Verification Status:** Verified  
**Source:** ISO official ISO 9001 guidance.

Seven quality management principles include customer focus, leadership, engagement of people, process approach, improvement, evidence-based decision making, relationship management.

### Teaching rule
ISO를 문서 bureaucracy로 축소하지 않는다.

## 7. CMMI Currentness

### Q07 — CMMI v3.0 current model context
**Verification Status:** Verified  
**Source:** CMMI Institute / ISACA v3.0 certification/adoption materials.

Quality-related practice areas include:
- Peer Reviews (PR)
- Process Quality Assurance (PQA)
- Requirements Development & Management (RDM)
- Verification & Validation (VV)

### Teaching rule
maturity/capability는 certification ladder 암기보다 improvement/value lens로 사용.

## 8. Modern SWQM Course Alignment

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

## 9. Source URLs

- https://dora.dev/guides/dora-metrics/
- https://dora.dev/insights/dora-metrics-history/
- https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
- https://deming.org/quotes/
- https://www.iso.org/files/live/sites/isoorg/files/store/en/PUB100373.pdf
- https://cmmiinstitute.com/


---
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.


## 10. 8h Curriculum Evidence Map
- T01–T02: Quality as system / Shift-Left / responsibility
- T03–T04: QMS / maturity / audit & evidence
- T05–T06: requirement quality / review & static verification
- T07–T08: test strategy / quality pipeline / evidence & gate
- T09: metrics / system incentives
- T10: AI output quality + QM operating model — AI-Native APPLY only
- Action planning is embedded in T10; 별도 workshop 없음.

### Boundary correction
- DORA/CI/CD/Deployment Flow 상세: future DevOps OWNER.
- Domain Model/UL/Ontology: DDD/AI-Native OWNER.
- Guardrail/Harness: AI-Native OWNER.
