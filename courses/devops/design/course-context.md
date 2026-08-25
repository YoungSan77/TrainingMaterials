# DevOps Course Context

> **Course ID:** devops
> **파이프라인 자리:** `Portfolio Design(portfolio/) + 과정 설계 지침(guides/과정_설계_지침.md) + References + Human↔LLM → Course Design(courses/devops/design/)`.
> **권위 순서:** `portfolio/*.md`(Portfolio Canon) > 이 Course Design. legacy context v2.6은 migration provenance이며 현재 권위·입력이 아니다.
> **경계:** 이 문서는 세션 번호·시간표·구체 커리큘럼 구조를 소유하지 않는다. `courses/devops/`에는 아직 실제 curriculum.md가 존재하지 않는다 — 이 Course Design(course-context.md·practice-design.md)이 승인되기 전에는 `guides/과정_설계_지침.md` §6에 따라 curriculum/session 작성, source/deck 생성, renderer/course-specific logic 변경이 금지된다. 이 문서는 Baseline에서 intended progression / topic priority / sequencing rationale / coverage intent만 프로즈로 가져오며, Baseline의 Topic 시간표(§21 T01–T09)를 그대로 복제하지 않는다.

---

## 1. Course Purpose

DevOps는 **개발과 운영 사이에 도구를 추가하는 활동이 아니라, SW 변경이 개발에서 운영까지 빠르고 안전하게 흐르고, 운영에서 얻은 Feedback이 다시 개발로 돌아오도록 Delivery System을 설계하고 지속 개선하는 접근**이다(Course Thesis, Baseline §1). 핵심은 Tool이 아니라 다음 세 가지다.

```text
Flow
→ Feedback
→ Learning / Improvement
```

이 과정이 소유하는 문제는 **End-to-End Software Delivery Flow**다(Baseline §3). 대표 문제:

- 개발 완료 후 통합이 늦다.
- 통합과 테스트에서 결함이 한꺼번에 발견된다.
- Build / Test / Deploy가 수동이다.
- 환경 차이 때문에 동일한 artifact가 다르게 동작한다.
- Release/Deploy가 위험 이벤트가 된다.
- 변경 승인과 대기가 실제 작업보다 길다.
- Production 상태와 장애 정보가 개발로 늦게 돌아온다.
- 같은 장애와 배포 실패가 반복된다.
- 도구는 많지만 Lead Time과 Delivery Instability가 개선되지 않는다.

과정의 첫 질문(Baseline §3):

> **우리 SW Delivery Flow에서 가장 큰 지연과 위험은 어디인가?**

## 2. Target Learner

**Learner & Context Fit** (Baseline "Learner & Context Fit" 절 그대로 가져옴 — 요약·재작성하지 않음):

- **Audience / Work Context:** SW delivery flow와 운영 신뢰성을 개선해야 하는 개발·운영·리더.
- **Current Capability / Failure Mode:** CI/CD tool 설치나 자동화율을 DevOps 성과로 오해하고 실제 bottleneck과 내부 engineering maturity를 놓친다.
- **Target Capability:** 현재 delivery constraint를 진단하고 flow·feedback·quality·recovery를 단계적으로 개선한다.
- **Decision Level:** Apply / Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 3. Capability Gap

학습자는 대체로 다음 격차를 갖고 수강을 시작한다(Baseline §2.3, §8, §23 종합):

- CI Server/Pipeline/Kubernetes 같은 도구의 **존재**를 Continuous Integration·DevOps·Safe Delivery의 **증거**로 착각한다(Cargo Cult Engineering, Baseline §2.3).
- Dev 성숙도와 Ops 성숙도를 별도로 진단하지 않고 "DevOps 팀을 만든다"거나 "도구를 확대한다"는 처방으로 곧장 건너뛴다.
- Continuous Delivery를 "Production에 자주 배포해야 하는 의무"로 오해하거나, 반대로 규제·계약상 수동 배포 환경에서는 CI/CD 자체가 무의미하다고 단정한다.
- DORA metric을 시스템 진단 Evidence가 아니라 개인/팀 평가 KPI나 순위표로 사용하려 한다.
- Quality Gate(무엇을 검증해야 하는가, SWQM OWNER)와 Delivery Pipeline 실행(언제·어디서 자동 실행하는가, DevOps OWNER)을 구분하지 못한다.

## 4. Typical Failure

Baseline §23 Failure Conditions(형식화 신호) 및 §15 Cargo Cult Examples 종합:

- Tool 설치 완료를 성공 기준으로 삼는다.
- Pipeline이 수동이거나 일정 압박 시 자주 우회된다.
- Long-lived branch로 integration delay가 유지된다.
- CI 실패를 방치한다.
- Local validation 없이 CI를 dumping ground로 사용한다.
- 모든 quality check를 중앙 pipeline으로 올려 feedback을 느리게 만든다.
- Environment마다 artifact를 다시 build한다.
- Production deploy가 특정 영웅 한 명에게 의존한다(Hero Engineering, Baseline §T01).
- Observability tool은 있으나 delivery/recovery decision에 사용되지 않는다.
- DORA metric을 개인/팀 KPI로 사용한다.
- 현재 bottleneck과 무관하게 Kubernetes/Platform tool을 먼저 도입한다.
- Deployment automation만 하고 Feedback/Recovery를 설계하지 않는다.
- DevOps 전담팀이 새로운 handoff silo가 된다.
- 성숙도 label(Dev L3 + Ops L3 같은 Gate)을 이유로 개선을 시작하지 않는다.

대표 사례(Baseline §1 Core Case): Jenkins/SonarQube가 이미 존재하는 조직에서도 납품 직전 Crunch가 반복되고, 경영진은 "Jenkins와 Kubernetes를 확대해서 DevOps를 강화하자"고 제안한다 — 학습자의 최종 판단은 **Tool 확대 전에 Delivery Flow를 진단하고 가장 큰 Bottleneck을 먼저 개선하는 것**이어야 한다.

## 5. Target Capability

수강 후 학습자는(Baseline §20 Learning Outcomes):

1. End-to-End Delivery Flow를 그리고 병목을 식별한다.
2. Dev와 Ops의 capability를 별도로 진단하고 개선 우선순위를 결정한다.
3. CI를 Tool이 아닌 frequent integration + fast feedback practice로 설명한다.
4. Continuous Delivery와 Continuous Deployment를 구분한다.
5. Pipeline에 들어갈 검증과 Local feedback의 역할을 구분한다.
6. Deployable artifact / environment reproducibility의 의미를 설명한다.
7. Deployment risk에 맞는 기본 전략을 선택한다.
8. Observability와 Recovery를 Delivery Feedback Loop에 연결한다.
9. DORA 지표를 KPI가 아닌 system improvement evidence로 사용한다.
10. 조직 유형과 제약에 맞는 첫 90일 improvement plan을 만든다.

## 6. Course Thesis / Narrative

> **DevOps는 개발과 운영 사이에 도구를 추가하는 활동이 아니라, SW 변경이 개발에서 운영까지 빠르고 안전하게 흐르고, 운영에서 얻은 Feedback이 다시 개발로 돌아오도록 Delivery System을 설계하고 지속 개선하는 접근이다.** (Baseline §1)

**Core Flow (Baseline §4):**

```text
Change
→ Local Verification
→ Integration
→ Build / Test
→ Deployable Artifact
→ Delivery / Deployment
→ Operate / Observe
→ Feedback
→ Recovery / Improvement
```

조직 개선 관점:

```text
Diagnose
→ Stabilize
→ Integrate
→ Make Deployable
→ Automate Delivery
→ Observe / Recover
→ Measure
→ Improve
```

**Intended Progression (baseline coverage intent — 세션 번호 아님, 서술적 진행 의도만, Baseline §2.1 "4막 학습 서사"):**

과정은 크게 네 국면(막)으로 진행된다는 것이 Baseline의 의도다.

- **1막 공감:** 왜 같은 고통(납품 직전 crunch, Hero Engineering)이 반복되는가 — System problem으로서 Cargo Cult Engineering을 도입한다.
- **2막 진단:** 우리 조직의 병목은 어디인가 — Dev × Ops Diagnosis는 성숙도 Gate가 아니라 Bottleneck Diagnosis Framework로 다룬다(Baseline §8). 이 국면이 기존 자료의 핵심 자산으로 유지된다.
- **3막 실무:** 어떤 Engineering / Delivery Capability가 필요한가 — Continuous Integration(작은 변경·frequent mainline integration·fast feedback), Continuous Delivery(deployable state 유지, Continuous Deployment와 구분), Artifact/Environment Reproducibility, Deployment Risk, Observability/Recovery를 순서대로 다룬다. Baseline은 CI(60m)와 CD(55m)를 이 국면에서 가장 무거운 topic priority로 지정한다(Baseline §21).
- **4막 전략:** 어디서 시작하고 무엇으로 개선을 증명할 것인가 — Constraint별 첫 90일 도입 원칙(Ownership/Contract/Engineering/Operations/Legacy/Compliance Constraint로 추상화, 특정 시장 관행으로 고정하지 않음)과 DORA를 system improvement evidence로 사용하는 Measure & Improve로 과정을 닫는다.

이 진행 순서(sequencing rationale)는 "진단 없는 처방은 없다"는 과정을 관통하는 원칙(Baseline §2.2)을 시간 축으로 구현한 것이다. **세션 번호·정확한 시간 배분·실제 topic 개수는 향후 `courses/devops/`의 정본 curriculum이 소유하며, 이 문서는 이를 복제하지 않는다.**

**Topic Priority (Baseline이 명시한 무게 배분 의도, §21):** Continuous Integration(60m)과 Continuous Delivery(55m)가 가장 무겁고, Dev × Ops Diagnosis(55m)가 그다음이다. Measure & Improve(25m)와 Observe·Recover·Learn(35m)은 상대적으로 가볍지만 Feedback Loop를 닫는 필수 역할을 한다. Tool 세부 조작(Jenkins/Kubernetes/Terraform 실습 등)은 Awareness 1–5분 또는 Appendix로만 다루며 Core에 포함하지 않는다(Baseline §18, §26).

## 7. Decisions Learner Must Make

(Baseline §19 Core Decision Questions, 원문 그대로)

1. 우리 Delivery Flow에서 실제 작업보다 Waiting이 큰 곳은 어디인가?
2. 어떤 문제는 Local에서 발견하고 어떤 문제를 CI에서 확인해야 하는가?
3. 현재 변경 크기와 Integration cadence가 Feedback을 늦추고 있지 않은가?
4. Software가 지속적으로 deployable 상태인가?
5. Artifact와 환경을 재현 가능하게 만드는 데 가장 큰 제약은 무엇인가?
6. Production deployment 위험을 줄이기 위해 automation, approval, progressive exposure를 어떻게 배분할 것인가?
7. 운영 상태에서 무엇을 관찰해야 빠른 detection/recovery가 가능한가?
8. 현재 Bottleneck은 Dev Capability인가, Ops Capability인가, 두 영역의 연결인가?
9. 어떤 Delivery metric이 현재 병목 개선을 증명할 수 있는가?
10. Tool을 추가하는 것보다 제거하거나 단순화해야 할 절차는 무엇인가?

## 8. OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

`portfolio/concept-ownership.md` "Current Concept Owners § DevOps"(2행 599–612)와 Baseline §6/§7의 구체화다.

### OWNER (정의·기원·판단·적용조건·Trade-off·실패조건까지 정본 교육)

- End-to-End Software Delivery Flow
- Continuous Integration as frequent integration + fast feedback (CI Server ≠ Continuous Integration)
- Continuous Delivery / Continuous Deployment distinction
- Deployable Artifact / Environment reproducibility
- Deployment / Release flow, Deployment Strategy 원리(Blue/Green, Canary, Rolling, Feature Flag 등은 Awareness 수준으로 다루되 risk-reduction 판단축 자체는 OWNER)
- Operations Feedback / Recovery (Observability를 delivery feedback loop에 연결, Blameless Postmortem)
- Software Delivery Performance (DORA를 진단 Evidence로 사용하는 판단 — metric 자체의 통계적 정의는 DORA가 원 출처)
- Dev × Ops Bottleneck Diagnosis(성숙도 인증이 아니라 다음 투자 우선순위 판단)
- Cargo Cult Engineering을 DevOps 도입 실패 진단 lens로 적용

### RECAP / APPLY (OWNER 정의를 바꾸지 않고 DevOps 문제에 사용)

- Quality Gate 통과 기준 자체(무엇을 검증해야 신뢰할 수 있는가)는 SWQM RECAP — DevOps는 그 기준이 Pipeline의 어느 cadence/location에서 자동 실행되는지만 OWNER로 판단한다(Baseline §7, §T04 SWQM bridge).
- Small Increment / Customer Feedback(Agile OWNER)은 RECAP — DevOps는 그 변경을 Production까지 전달하는 뒷단만 OWNER로 이어받는다(Baseline §6).
- CALMS(Culture/Automation/Lean/Measurement/Sharing)는 Awareness/Supporting Lens로만 RECAP — 표준 성숙도 모델이나 필수 checklist로 쓰지 않는다(Baseline §17).

### FORWARD (후속/인접 과정에서 상세 소유 — DevOps는 필요성만 예고)

- SRE full course, Platform Engineering full course, Team Topologies 상세, DevSecOps full course → 별도 전문 영역(Baseline §26)
- 특정 CI/CD Tool·Cloud vendor product 사용법 → vendor-independent 원칙으로 예시화(evidence-policy.md §9)

### NON-SCOPE (이 과정이 정본 교육하지 않음 — Baseline §26 Explicit Non-Scope)

- Jenkins / GitHub Actions / Kubernetes / Terraform / Argo CD 실습
- SRE full course, Platform Engineering full course, Team Topologies 상세, DevSecOps full course
- SWQM의 Test Strategy 정본 재교육
- Agile/Scrum 정본 재교육
- MSA / distributed system design 재교육
- Cloud vendor product training

**Boundary rule(concept-ownership.md §DevOps Boundary):**
- SWQM owns Quality Risk / Evidence / Quality Gate criteria(무엇을 검증하고 언제 통과시키는가).
- Agile owns customer/product adaptation(무엇을 만들 것인지 학습·적응).
- DevOps owns delivery/deployment/operations feedback(그 변경을 얼마나 빠르고 안전하게 흘려보내는가).

## 9. Key Distinctions

`portfolio/terminology.md`의 CI/CD 정의(Portfolio Terminology Expansion v2.2) + Baseline §5 Key Distinctions 중 이 과정에 해당하는 쌍:

| A | B | 핵심 차이 |
|---|---|---|
| DevOps | Toolchain | Delivery System 설계·개선 접근 vs 도구 집합 |
| DevOps | CI/CD only | Flow·Feedback·Learning 전체 vs 파이프라인 일부 |
| CI Server | Continuous Integration | 제품/도구 vs "작은 변경을 자주 mainline에 통합하고 각 변경에 빠른 자동 Feedback을 받아 통합 가능한 상태를 유지하는 개발 practice"(terminology.md) |
| Continuous Integration | nightly build | 상시 frequent integration vs 하루 1회 배치 통합 |
| **Continuous Delivery** | **Continuous Deployment** | "Software를 lifecycle 전반에서 deployable 상태로 유지하여 필요할 때 빠르고 안전하게 release할 수 있는 capability"(terminology.md) vs "검증된 변경을 자동으로 Production까지 배포하는 별도의 practice" — 동일어가 아니다(terminology.md) |
| Continuous Delivery | production deployment frequency mandate | deployable capability 확보 vs 배포 빈도 의무화(운영 배포 빈도는 Product/Contract/Control 맥락의 선택) |
| Deployment | Release | artifact를 환경에 설치 vs 사용자에게 기능을 노출하는 결정(Feature Flag로 분리 가능) |
| Pipeline | Quality | 실행 메커니즘 vs 검증 기준(Quality Gate는 SWQM OWNER) |
| Automation | Improvement | 수행 방식 자동화 vs 실제 outcome 개선 — 자동화 자체가 목표가 아니다 |
| Observability | Logging | 시스템 상태 이해·탐지·복구 목적 전체 vs 하나의 신호 유형 |
| Monitoring | Observability | 사전에 정의한 지표 감시 vs 예상치 못한 질문에 답할 수 있는 능력 |
| Infrastructure as Code | Cloud only | 재현 가능한 환경 정의 원리 vs 특정 배포 대상 |
| Container | Kubernetes | Artifact/실행 단위 vs 특정 orchestration 도구 |
| DevOps Team | DevOps | 조직 단위(새 handoff silo가 될 위험) vs 접근/역량 |
| DORA Metric | KPI target | system improvement evidence vs 개인/팀 평가 보상 지표 |
| High maturity label | DevOps readiness certificate | 진단 결과 서술 vs 통과/불합격 인증 |
| Agile | DevOps | 무엇을 만들지 학습·적응(Agile) vs 그 변경을 안전하게 전달·운영 Feedback을 되돌림(DevOps) |
| SWQM | DevOps | 이 변경을 신뢰할 Evidence가 충분한가(SWQM) vs 이 변경을 얼마나 빠르고 안전하게 흘려보낼 수 있는가(DevOps) |

## 10. Course-specific Principles

`portfolio/principles.md` §C8 (Delivery Flow & Operations — DevOps)의 Child Principle 목록. **Primary Parent Lenses: Lean Thinking / Systems Thinking / Theory of Constraints / Empiricism**(principles.md §C8, Baseline "Foundational Decision Lens Alignment"와 일치).

| Principle | 핵심 판단 | Baseline 연결 |
|---|---|---|
| DEVOPS-01. Diagnose before Automating | 도구나 pipeline을 먼저 도입하지 않고 실제 delivery bottleneck과 engineering capability를 진단한다 | §8 Dev × Ops Diagnosis("성숙도 Gate가 아니라 Diagnosis Framework"), §15 Cargo Cult |
| DEVOPS-02. Optimize End-to-End Delivery Flow | 개발·운영의 개별 utilization보다 change가 build, verify, release, operate, recover를 통과하는 전체 flow를 최적화한다 | §4 Course Core Flow |
| DEVOPS-03. Small Batch and Fast Feedback Reduce Delivery Risk | 작은 변경과 빠른 feedback은 학습비용과 blast radius를 줄인다 | §9 Continuous Integration Essential Practices |
| DEVOPS-04. Reproducibility before Deployment Sophistication | 복잡한 배포 전략보다 먼저 same artifact, environment consistency, repeatable build/deploy를 확보한다 | §11 Artifact/Environment/Reproducibility, §12 Deployment Strategy("Core는 원리다") |
| DEVOPS-05. Recovery and Learning Are Part of Delivery | 실패를 완전히 제거할 수 없으면 detect, contain, recover, learn을 delivery capability에 포함한다 | §14 Recovery/Learning, §13 Observability |

## 11. Trade-offs / Failure Conditions

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Diagnose before Automating | 즉각적인 도구 도입보다 진단 시간이 먼저 들지만, 잘못된 곳에 투자하는 낭비를 줄인다 | 현재 bottleneck과 무관하게 Kubernetes/Platform tool을 먼저 도입(Baseline §23-11) |
| Optimize End-to-End Delivery Flow | 팀별 국지적 편의보다 전체 flow 조율 비용을 먼저 지불한다 | 모든 quality check를 중앙 pipeline으로 올려 feedback을 느리게 만듦(Baseline §23-6) |
| Small Batch and Fast Feedback | 통합 빈도를 늘리는 초기 습관 비용이 들지만 통합 지연·결함 몰림을 줄인다 | Long-lived branch로 integration delay를 유지, CI 실패를 방치(Baseline §9 Failure Conditions, §23-3/4) |
| Reproducibility before Deployment Sophistication | Blue/Green·Canary 같은 정교한 전략보다 재현성 확보를 먼저 투자한다 | Environment마다 artifact를 다시 build(Baseline §23-7) |
| Recovery and Learning Are Part of Delivery | "장애 0"을 목표로 삼지 않고 detect/recover/learn에 투자한다 | Observability tool은 있으나 delivery/recovery decision에 사용되지 않음(Baseline §23-9) |

## 12. Cross-course Interfaces

### Bridges Forward / Position (`portfolio/concept-ownership.md` "Cross-Course Bridge Summary", Baseline §6/§7)

```text
Agile
Product / Customer Feedback
        ↓
DevOps
Delivery / Operations Feedback

SWQM
Quality Evidence / Gate Governance
        ↕
DevOps
Pipeline Execution / Delivery Flow

PM
Project Governance / Integrated Control
        ↕
Agile / DevOps
Delivery Execution
```

- **Agile → DevOps:** Agile owns "무엇을 만들 것인지 작은 Increment와 고객 Feedback을 통해 학습하고 적응하는 방법". DevOps owns "그 변경을 Production 또는 사용 가능한 환경까지 빠르고 안전하게 전달하고 운영 Feedback을 다시 개발로 돌려보내는 Delivery System"(Baseline §6). DevOps를 "Agile의 필수 전제조건"으로 단정하지 않는다 — 대신 "짧은 제품 학습주기를 실제 Delivery까지 연결하려면 DevOps Capability가 중요해진다."
- **SWQM ↔ DevOps:** 같은 Test / Static Analysis / Security Gate를 보더라도 목적이 다르다. SWQM은 "이 변경을 신뢰할 Evidence가 충분한가?"를, DevOps는 "이 변경을 얼마나 빠르고 안전하게 흘려보낼 수 있는가?"를 묻는다(Baseline §7). Quality Gate 통과 기준(SWQM OWNER)과 그 실행 cadence/location(DevOps OWNER)을 혼동하지 않는다.
- **PM ↔ Agile/DevOps:** Project Governance/Integrated Control은 PM이, Delivery Execution은 Agile/DevOps가 담당한다.

### Uses (RECAP/APPLY로 소비하는 개념)

- SWQM의 Quality Gate 기준을 Delivery Pipeline이 소비한다(무엇을 검증할지는 SWQM, 어디서/언제 자동 실행할지는 DevOps).
- Agile의 Small Increment/Customer Feedback을 delivery 뒷단의 입력으로 RECAP한다.

### Related Courses

- **Prerequisite:** 없음(portfolio 전체에서 DevOps 자체는 특정 선행 과정을 강제하지 않음).
- **Key Consumers / Adjacent:** Agile(제품 학습 루프의 뒷단), SWQM(Quality Gate의 실행 위치), SW Project Management(Delivery Execution의 governance 관점).

## 13. Foundational Decision Lens Fit

`portfolio/principles.md` §A 5개 Lens 중 DevOps의 실제 판단을 강화하는 것만 적용한다. migration 당시 흡수·검증된 판정은 "08 DevOps | Lean, Systems, ToC, Empiricism | flow, bottleneck, feedback, DORA evidence와 직접 연결된다. 적절함."이다:

- **APPLY:** Lean Thinking; Systems Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** value stream의 대기·batch와 현재 constraint를 먼저 보고 delivery evidence로 개선 효과를 확인한다(Baseline).
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Design Thinking Lens는 이 과정에서 채택하지 않는다 — Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 14. Source Baseline

정본 우선순위(Baseline §27, `evidence-policy.md` §13 "DevOps" precedence)는 1) stable Lean/flow/feedback/Continuous Delivery/DevOps engineering lineage, 2) DORA 장기 empirical research와 current capability/metric guidance, 3) vendor/tool docs(implementation example)다. 상세 근거·인용·locator·Evidence Strength/Transferability/Curriculum Use는 `courses/devops/design/references/verified-sources.md`가 소유한다.

**Legacy note(Baseline header):** 이전 DevOps deck의 진단·도입 서사는 이미 이 Baseline에 흡수되어 있으며, 원본 PPT는 이 Package의 실행 의존성이 아니다 — 원본 PPT의 개별 slide 배치·font·display 권고가 남아 있더라도 그것은 normative instruction이 아니다.

## 15. Curriculum Authoring Gate

`guides/과정_설계_지침.md` §6에 따라, DevOps는 아직 실제 Curriculum(`courses/devops/*curriculum*.md`)이 존재하지 않는 과정이다. 이 Course Design(course-context.md·practice-design.md)이 승인되기 전에는:

- curriculum/session 작성 금지
- source/deck 생성 금지
- renderer/course-specific logic 변경 금지

이 Course Design 문서 자체의 작성은 위 게이트의 대상이 아니다(Course Design을 만드는 것이 게이트가 막는 대상이 아니라, Course Design 다음 단계인 Curriculum Generation이 게이트의 대상이다).
