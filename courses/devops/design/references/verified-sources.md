# DevOps — Verified Sources

> **Course ID:** devops
> **Schema authority:** `portfolio/evidence-policy.md` (Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification — 이 문서는 그 스키마를 적용할 뿐 재정의하지 않는다)
> **Source:** `context/course-portfolio-unified-v2.6/support/03_source-evidence/08_devops-source-evidence-v2.0.md`(Source & Evidence Baseline v2.0) — 이 문서는 원본을 요약본으로 다시 쓰지 않고 원형을 보존한다. claim/quote는 원 문서의 표현을 그대로 옮기며, 재해석하지 않는다.
> **BP Classification default:** Not classified (evidence-policy.md §2.6 — Global Baseline의 일반화 가능한 지식에 BP label을 반복 부여하지 않는다. 아래 표에서 별도 표기가 없으면 모두 Not classified다).

---

## 1. Source Strategy (원문 §1)

DevOps 과정은 특정 Vendor Toolchain이나 특정 maturity model을 보편적 기준으로 삼지 않는다.

정본 우선순위:

1. software delivery / operations의 stable engineering principles
2. DORA의 current capability / measurement guidance
3. Continuous Delivery / Continuous Integration practitioner lineage
4. observability / reliability primary technical guidance
5. vendor documentation — implementation example only

## 2. Portfolio Evidence Classification

원본 §Portfolio Evidence Classification 표를 그대로 보존하고, `evidence-policy.md`가 요구하는 Verification Status 열을 추가한다.

| Source/Claim Family | Verification Status | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|---|
| Lean / flow / feedback lineage | Verified — foundational lineage, no single URL to check | Foundational/Core | Foundational/Influential Works | Strong | Broad | Core | Not classified |
| Continuous Integration / Continuous Delivery | Verified — definitions cross-checked against DORA capability pages (§5 URLs) and practitioner lineage books | Established Practice-Pattern | Foundational/Influential Works + practitioner lineage | Strong | Broad/Conditional | Core | Not classified |
| DORA longitudinal research | Verified — research program identity confirmed via dora.dev | Empirical | Research-Empirical Program | Strong | Broad/Conditional | Core/Supporting | Not classified |
| Current DORA metrics/capability guidance | Verified as of 2026-01(원문 §Core Claims 표기); **Pending re-verification before detailed slide production**(원문 §7 Currency Gate) | Empirical / Reference | Research-Empirical Program | Strong for current framework | Conditional/Time-bound | Supporting/Reference | Not classified |
| Vendor/tool documentation | Not verified in this pass — implementation example only, per-vendor check deferred to slide production | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |

## 3. Core Claims (원문 §2, 원형 보존)

### Continuous Integration

과정에서는 CI를 **small batch + frequent mainline integration + fast automated feedback + immediate repair**의 개발 practice로 정의한다.

Current official DORA capability guidance:
- changes are integrated regularly into trunk/mainline
- each change triggers automated build/tests
- feedback should arrive quickly
- broken builds are fixed immediately
- small changes and short-lived branches reduce integration pain

**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Foundational/Influential Works + practitioner lineage · **Evidence Strength:** Strong · **Transferability:** Broad/Conditional · **Curriculum Use:** Core.

### Continuous Delivery

과정에서는 Continuous Delivery를 **software를 lifecycle 전반에서 deployable 상태로 유지하고 필요할 때 production/end user에게 빠르고 안전하게 release할 수 있는 capability**로 정의한다.

Continuous Deployment와 구분한다.

**Evidence Role:** Established Practice-Pattern · **Source Provenance:** Foundational/Influential Works + practitioner lineage · **Evidence Strength:** Strong · **Transferability:** Broad/Conditional · **Curriculum Use:** Core.

### DORA Software Delivery Performance

2026-01 기준 DORA의 current practitioner guide는 5개 metric을 사용한다.

**Throughput**
1. Change lead time
2. Deployment frequency
3. Failed deployment recovery time

**Instability**
4. Change fail rate
5. Deployment rework rate

Historical Four Keys는 역사적 lineage로 설명한다.

> **Current-source nuance (원문 그대로 보존 — 절대 재해석·요약하지 않는다):**
> DORA의 보수적으로 갱신되는 `Core Model` 페이지는 여전히 Four Key Metrics를 표시할 수 있지만, 2026-01에 갱신된 DORA metric guide와 2025 research/Quick Check는 current practitioner measurement를 5개 metric으로 명시한다. 상세 교재에서는 출처의 날짜와 목적을 함께 표시한다.

**중요 — evidence-strength/currency caveat(authoring instruction 반영):** 이 5-metric current guidance는 시점 의존적(time-bound) Empirical/Reference claim이다. 이 문서의 다른 부분(예: 원문 §Core Claims 표)이 "Strong for current framework"라고 명시한 것과 "Conditional/Time-bound" Transferability를 동시에 부여한 이유가 여기에 있다 — DORA metric은 오랜 기간 축적된 장기 empirical research(Strong·Broad/Conditional)이지만, **그 위에 얹힌 "현재 5개 metric" 이라는 구체적 형태는 시점 의존적**이며 timeless fact로 제시하지 않는다. 상세 슬라이드 제작 전에는 원문 §7 Currency Gate에 따라 재확인이 필요하다(Pending re-verification).

**Evidence Role:** Empirical/Reference · **Source Provenance:** Research-Empirical Program · **Evidence Strength:** Strong for current framework(장기 연구 프로그램 자체는 Strong; 특정 "5-metric" 구성은 시점 의존) · **Transferability:** Conditional/Time-bound · **Curriculum Use:** Supporting/Reference(개별 숫자·metric 목록); Core(Throughput↔Instability를 함께 보는 진단 원리 자체).

## 4. Primary Sources (원문 §3, URL 원형 보존)

- DORA — Continuous Integration capability
  https://dora.dev/capabilities/continuous-integration/
- DORA — Continuous Delivery capability
  https://dora.dev/capabilities/continuous-delivery/
- DORA — Software Delivery Performance Metrics
  https://dora.dev/guides/dora-metrics/
- DORA — History of software delivery metrics
  https://dora.dev/insights/dora-metrics-history/
- DORA — 2025 Research / measurement framework
  https://dora.dev/research/2025/

**Verification Status:** Verified — URL/provenance recorded in source pack v2.0. **Evidence Role:** Standard/Reference (capability/metric definition). **Source Provenance:** Research-Empirical Program. **Evidence Strength:** Strong. **Transferability:** Broad/Conditional(metric의 시점 의존 부분은 Conditional). **Curriculum Use:** Core/Reference.

## 5. Stable Practitioner Lineage (원문 §4, 원형 보존)

- Jez Humble & David Farley — *Continuous Delivery*
- Nicole Forsgren, Jez Humble, Gene Kim — *Accelerate*
- Gene Kim et al. — *The DevOps Handbook*

이들은 원리·역사·practice lineage를 위해 사용하며, 특정 과거 benchmark 숫자는 현재 일반 법칙으로 재사용하지 않는다.

**Verification Status:** Verified via publisher record(단행본, 별도 live URL 확인 대상 아님). **Evidence Role:** Foundational/Core + Established Practice-Pattern. **Source Provenance:** Foundational/Influential Works. **Evidence Strength:** Strong. **Transferability:** Broad. **Curriculum Use:** Core(원리·lineage); Hold(개별 과거 benchmark 숫자를 timeless rule로 사용하는 것은 금지).

## 6. Evidence Rules (원문 §5, 원형 보존)

- CI product installation does not prove Continuous Integration.
- Pipeline existence does not prove safe delivery.
- Tool adoption is implementation evidence, not outcome evidence.
- DORA metrics are system-improvement evidence, not individual/team productivity targets.
- Historical Elite/High/Low numeric benchmarks must retain year/source context.
- Local regulatory/outsourcing constraints may change release cadence without invalidating Continuous Delivery principles.
- Quality Gate definition belongs to SWQM; DevOps owns delivery-flow execution/cadence/location.

## 7. Course Baseline Alignment (원문 §6, 원형 보존)

```text
Delivery Flow
→ Fast Feedback
→ Deployable State
→ Operations Feedback
→ Recovery
→ Measurement
→ Improvement
```

## 8. Currency Gate (원문 §7, 원형 보존)

Before detailed slide production:
- re-check current DORA metric model
- re-check DORA capability wording
- verify vendor/product examples
- verify GitOps / platform-engineering claims if used
- date any benchmark numbers

**이 Course Design 시점(2026-08-25)에서의 상태:** 위 Currency Gate는 아직 실행되지 않았다. 이 항목들은 상세 슬라이드/deck 제작 착수 시 반드시 재수행해야 하며, 이 문서는 그 재확인을 대체하지 않는다. `courses/devops/`에 curriculum/deck가 아직 존재하지 않으므로(course-context.md §15 Curriculum Authoring Gate), 이 Gate의 재실행 시점은 Course Design 승인 이후 Curriculum Generation 단계로 넘어간다.

## 9. Legacy Note

원본 Course Baseline(`context/course-portfolio-unified-v2.6/courses/08_devops.md`) 헤더는 다음을 명시한다: "이전 DevOps deck의 유효한 진단·도입 서사는 본 Baseline에 이미 흡수되어 있으며, 원본 PPT는 이 Package의 실행 의존성이 아니다." 원본 PPT에 남아 있을 수 있는 개별 slide 배치·font·display 권고 등은 삭제하지 않되, **지금은 normative instruction이 아니다** — 이 verified-sources.md와 course-context.md/practice-design.md가 현재 정본이다.

## 10. Rule Summary (원문 §Rule, course-context.md §14와 동일 정본)

- Vendor Tool documentation은 implementation example.
- Tool이 Course Spine이 되지 않는다.
- DORA의 특정 연도 benchmark 숫자는 출처 연도를 명시하지 않고 일반 법칙처럼 사용하지 않는다.
