# DevOps — Source & Evidence Baseline v2.0


## Portfolio Evidence Classification

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Lean / flow / feedback lineage | Foundational/Core | Foundational/Influential Works | Strong | Broad | Core | Not classified |
| Continuous Integration / Continuous Delivery | Established Practice-Pattern | Foundational/Influential Works + practitioner lineage | Strong | Broad/Conditional | Core | Not classified |
| DORA longitudinal research | Empirical | Research-Empirical Program | Strong | Broad/Conditional | Core/Supporting | Not classified |
| Current DORA metrics/capability guidance | Empirical / Reference | Research-Empirical Program | Strong for current framework | Conditional/Time-bound | Supporting/Reference | Not classified |
| Vendor/tool documentation | Vendor-Product Implementation | Vendor-Product Documentation | Limited for universal claims | Product-specific | Example/Reference | Not classified |

## 1. Source Strategy

DevOps 과정은 특정 Vendor Toolchain이나 특정 maturity model을 보편적 기준으로 삼지 않는다.

정본 우선순위:

1. software delivery / operations의 stable engineering principles
2. DORA의 current capability / measurement guidance
3. Continuous Delivery / Continuous Integration practitioner lineage
4. observability / reliability primary technical guidance
5. vendor documentation — implementation example only

## 2. Core Claims

### Continuous Integration
과정에서는 CI를 **small batch + frequent mainline integration + fast automated feedback + immediate repair**의 개발 practice로 정의한다.

Current official DORA capability guidance:
- changes are integrated regularly into trunk/mainline
- each change triggers automated build/tests
- feedback should arrive quickly
- broken builds are fixed immediately
- small changes and short-lived branches reduce integration pain

### Continuous Delivery
과정에서는 Continuous Delivery를 **software를 lifecycle 전반에서 deployable 상태로 유지하고 필요할 때 production/end user에게 빠르고 안전하게 release할 수 있는 capability**로 정의한다.

Continuous Deployment와 구분한다.

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

> **Current-source nuance:** DORA의 보수적으로 갱신되는 `Core Model` 페이지는 여전히 Four Key Metrics를 표시할 수 있지만, 2026-01에 갱신된 DORA metric guide와 2025 research/Quick Check는 current practitioner measurement를 5개 metric으로 명시한다. 상세 교재에서는 출처의 날짜와 목적을 함께 표시한다.

## 3. Primary Sources

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

## 4. Stable Practitioner Lineage

- Jez Humble & David Farley — *Continuous Delivery*
- Nicole Forsgren, Jez Humble, Gene Kim — *Accelerate*
- Gene Kim et al. — *The DevOps Handbook*

이들은 원리·역사·practice lineage를 위해 사용하며, 특정 과거 benchmark 숫자는 현재 일반 법칙으로 재사용하지 않는다.

## 5. Evidence Rules

- CI product installation does not prove Continuous Integration.
- Pipeline existence does not prove safe delivery.
- Tool adoption is implementation evidence, not outcome evidence.
- DORA metrics are system-improvement evidence, not individual/team productivity targets.
- Historical Elite/High/Low numeric benchmarks must retain year/source context.
- Local regulatory/outsourcing constraints may change release cadence without invalidating Continuous Delivery principles.
- Quality Gate definition belongs to SWQM; DevOps owns delivery-flow execution/cadence/location.

## 6. Course Baseline Alignment

```text
Delivery Flow
→ Fast Feedback
→ Deployable State
→ Operations Feedback
→ Recovery
→ Measurement
→ Improvement
```

## 7. Currency Gate

Before detailed slide production:
- re-check current DORA metric model
- re-check DORA capability wording
- verify vendor/product examples
- verify GitOps / platform-engineering claims if used
- date any benchmark numbers
