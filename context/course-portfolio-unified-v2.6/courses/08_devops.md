# DevOps 개요와 SW Delivery 실무 — Unified Baseline v2.6

> **Status:** Baseline  
> **Duration:** 8h 운영 기준 — 총 480분 이내  
> **Instructional time:** 약 400분 + 휴식 약 80분  
> **Time rule:** Topic은 동일 50분 단위가 아니다. Topic별 학습 난이도·토론·진단·실무 밀도에 따라 시간을 달리한다.  
> **Legacy lineage:** 이전 DevOps deck의 유효한 진단·도입 서사는 본 Baseline에 이미 흡수되어 있으며, 원본 PPT는 이 Package의 실행 의존성이 아니다.  
> **Purpose:** 기존 자료의 현장성·진단 구조·도입 로드맵을 보존하면서, CI/CD 정의·DevOps 범위·DORA 최신성·SWQM/Agile 경계를 정리하여 Portfolio Canon에 맞춘다.

---

## 1. Identity

- **Course ID:** devops
- **Course Name:** DevOps 개요와 SW Delivery 실무
- **Portfolio Category:** Delivery & Operations
- **Course Thesis:**

> **DevOps는 개발과 운영 사이에 도구를 추가하는 활동이 아니라, SW 변경이 개발에서 운영까지 빠르고 안전하게 흐르고, 운영에서 얻은 Feedback이 다시 개발로 돌아오도록 Delivery System을 설계하고 지속 개선하는 접근이다.**

핵심은 Tool이 아니라 다음 세 가지다.

```text
Flow
→ Feedback
→ Learning / Improvement
```

---

## Learner & Context Fit

- **Audience / Work Context:** SW delivery flow와 운영 신뢰성을 개선해야 하는 개발·운영·리더.
- **Current Capability / Failure Mode:** CI/CD tool 설치나 자동화율을 DevOps 성과로 오해하고 실제 bottleneck과 내부 engineering maturity를 놓친다.
- **Target Capability:** 현재 delivery constraint를 진단하고 flow·feedback·quality·recovery를 단계적으로 개선한다.
- **Decision Level:** Apply / Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Lean Thinking; Systems Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** value stream의 대기·batch와 현재 constraint를 먼저 보고 delivery evidence로 개선 효과를 확인한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Retained Legacy Strengths — Already Incorporated

기존 PPT의 가장 강한 자산은 다음이다.

### 2.1 4막 학습 서사

```text
1막 공감
왜 같은 고통이 반복되는가
        ↓
2막 진단
우리 조직의 병목은 어디인가
        ↓
3막 실무
어떤 Engineering / Delivery Capability가 필요한가
        ↓
4막 전략
어디서 시작하고 무엇으로 개선을 증명할 것인가
```

이 구조는 유지한다.

### 2.2 진단 → 행동의 연결

기존 자료의 핵심 연결:

```text
Dev × Ops 진단
       ↓
현재 Bottleneck 식별
       ↓
도입 경로 선택
       ↓
첫 90일 Pilot
       ↓
Evidence
       ↓
다음 개선
```

`진단 없는 처방은 없다`는 과정을 관통하는 원칙으로 유지한다.

### 2.3 Cargo Cult Engineering

도구·절차·산출물의 존재를 성과로 착각하는 문제를 DevOps 도입 실패의 대표 lens로 유지한다.

예:

```text
Jenkins 설치       ≠ Continuous Integration
Kubernetes 도입    ≠ DevOps
Pipeline 존재      ≠ Safe Delivery
Metric 수집        ≠ Improvement
문서 작성          ≠ Engineering Quality
```

단, Cargo Cult 자체가 독립 mini-course가 되지 않도록 압축하고 전체 과정에서 반복되는 진단 lens로 사용한다.

### 2.4 Outsourcing / Contract 현실성

외부 개발, 운영 이관, 계약 경계 때문에 DevOps가 불가능하다고 단정하지 않는다.

핵심 질문은:

- 현재 계약에서 바꿀 수 있는 것은 무엇인가?
- Development-side CI부터 시작할 수 있는가?
- Staging Feedback을 단축할 수 있는가?
- 다음 계약에 어떤 Delivery Capability를 요구할 것인가?

이다.

---

## 3. Problem It Owns

이 과정이 소유하는 문제는 **End-to-End Software Delivery Flow**다.

대표 문제:

- 개발 완료 후 통합이 늦다.
- 통합과 테스트에서 결함이 한꺼번에 발견된다.
- Build / Test / Deploy가 수동이다.
- 환경 차이 때문에 동일한 artifact가 다르게 동작한다.
- Release/Deploy가 위험 이벤트가 된다.
- 변경 승인과 대기가 실제 작업보다 길다.
- Production 상태와 장애 정보가 개발로 늦게 돌아온다.
- 같은 장애와 배포 실패가 반복된다.
- 도구는 많지만 Lead Time과 Delivery Instability가 개선되지 않는다.

과정의 첫 질문:

> **우리 SW Delivery Flow에서 가장 큰 지연과 위험은 어디인가?**

---

## 4. Course Core Flow

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

조직 개선 관점에서는:

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

---

## 5. Key Distinctions

- DevOps ≠ Toolchain
- DevOps ≠ CI/CD only
- CI Server ≠ Continuous Integration
- Continuous Integration ≠ nightly build
- Continuous Delivery ≠ Continuous Deployment
- Continuous Delivery ≠ production deployment frequency mandate
- Deployment ≠ Release
- Pipeline ≠ Quality
- Automation ≠ Improvement
- Observability ≠ Logging
- Monitoring ≠ Observability
- Infrastructure as Code ≠ Cloud only
- Container ≠ Kubernetes
- DevOps Team ≠ DevOps
- DORA Metric ≠ KPI target
- High maturity label ≠ DevOps readiness certificate
- Agile ≠ DevOps
- SWQM ≠ DevOps

---

## 6. Agile ↔ DevOps Boundary

### Agile owns

> **무엇을 만들 것인지 작은 Increment와 고객 Feedback을 통해 학습하고 적응하는 방법**

```text
Need
→ Increment
→ Customer Feedback
→ Adapt
```

### DevOps owns

> **그 변경을 Production 또는 사용 가능한 환경까지 빠르고 안전하게 전달하고 운영 Feedback을 다시 개발로 돌려보내는 Delivery System**

```text
Change
→ Integrate
→ Verify
→ Deliver
→ Operate
→ Feedback
```

### Bridge

```text
Agile
Small Increment
      ↓
DevOps
Small Safe Change Flow
      ↓
Production / User Feedback
      ↓
Agile Adaptation
```

DevOps를 “Agile의 필수 전제조건”으로 단정하지 않는다.

대신:

> **짧은 제품 학습주기를 실제 Delivery까지 연결하려면 DevOps Capability가 중요해진다.**

---

## 7. SWQM ↔ DevOps Boundary

### SWQM OWNER

- Quality Risk
- Prevention
- Verification strategy
- Quality Evidence
- Quality Gate
- Quality measurement / improvement

질문:

> **이 변경을 신뢰할 Evidence가 충분한가?**

### DevOps OWNER

- Delivery Flow
- Integration cadence
- Pipeline execution
- Deployable Artifact
- Environment / Delivery automation
- Deployment / Release flow
- Operations Feedback
- Recovery Flow
- Delivery Performance

질문:

> **이 변경을 얼마나 빠르고 안전하게 흘려보낼 수 있는가?**

같은 Test / Static Analysis / Security Gate를 보더라도 목적이 다르다.

---

## 8. Dev × Ops Diagnosis — Revised Position

기존 Dev × Ops Matrix는 유지하되 **성숙도 Gate가 아니라 Diagnosis Framework**로 사용한다.

### Do not teach

```text
Dev L3 + Ops L3
→ DevOps 가능
그 이전
→ DevOps 불가
```

### Teach

```text
Dev Capability
      ×
Ops Capability
      ↓
현재 Bottleneck
      ↓
다음에 투자할 Capability
```

예:

| 현재 병목 | 우선 개선 |
|---|---|
| Version control / branching 혼란 | SCM / integration discipline |
| Build 재현 불가 | Build automation |
| 기본 test 부족 | Local test / automated verification |
| 통합 지연 | CI / small batch |
| 환경 차이 | artifact / configuration / environment reproducibility |
| 수동 deploy | deployment automation |
| 장애 원인 불명 | observability |
| 반복 장애 | recovery / postmortem / learning |

핵심:

> **완성된 성숙도를 기다리지 않는다. 현재 가장 큰 Delivery Bottleneck부터 개선한다.**

---

## 9. Continuous Integration — Foundational Position

CI는 제품명이 아니다.

> **작은 변경을 자주 mainline에 통합하고, 각 변경에 대해 빠른 자동 Feedback을 받아 시스템을 항상 통합 가능한 상태로 유지하는 개발 practice다.**

핵심 구조:

```text
Small Change
→ Local Check
→ Integrate Frequently
→ Automated Build / Fast Tests
→ Visible Feedback
→ Fix / Revert Immediately
```

### Essential Practices

- Version control
- Repeatable build
- Small batch
- Frequent integration
- Automated fast verification
- Visible status
- Broken build immediate recovery
- Short-lived branches / reduced divergence

### Local Shift-Left

기존 PPT의 강점을 유지한다.

```text
IDE / Local
→ Pre-commit
→ CI
```

CI를 모든 오류가 처음 발견되는 장소로 만들지 않는다.

> **가능한 오류는 발생 지점에 가까운 곳에서 먼저 찾고, CI는 통합 상태를 빠르게 확인한다.**

### Failure Conditions

- CI Server만 설치
- Manual trigger
- Long-lived branch
- Build 실패를 방치
- Slow feedback
- Flaky tests
- Quality Gate가 합의 없이 추가
- 일정 압박 시 Pipeline 우회
- 중앙 CI가 개발자의 Local Verification을 대신함

---

## 10. Continuous Delivery / Deployment — Revised Foundational Position

### Continuous Delivery

> **모든 변경을 필요할 때 Production 또는 사용자에게 빠르고 안전하게 Release할 수 있도록 SW를 지속적으로 deployable 상태로 유지하는 능력**

```text
Integrated Change
→ Verified Artifact
→ Repeatable Delivery
→ Deployable State
→ On-demand Release Decision
```

### Continuous Deployment

> **검증된 변경을 자동으로 Production까지 배포하는 별도의 practice**

따라서:

```text
Continuous Delivery
≠
Continuous Deployment
```

### Outsourcing / Waterfall Context

운영 이관이 프로젝트 종료 시 한 번뿐인 환경에서도:

- CI 강화
- Staging 자동 반영
- 고객/QA Feedback 단축
- 동일 artifact 승격
- 배포 절차 자동화
- 환경 재현성

은 충분히 가치가 있다.

그러나 이를:

> “CI/CD는 운영 배포 빈도를 늘리지 않는다.”

라고 일반화하지 않는다.

정확한 메시지:

> **DevOps/CI/CD 도입이 Production 배포 빈도 증가를 의무화하는 것은 아니다. 배포 빈도는 Product/Contract/Control 맥락에 따라 결정하되, 언제든 안전하게 배포할 수 있는 Capability를 높이는 것이 핵심이다.**

---

## 11. Artifact / Environment / Reproducibility

기존 `Build Once, Deploy Anywhere` 메시지는 유지하되 특정 Container 방식으로 한정하지 않는다.

```text
Source
→ Reproducible Build
→ Versioned Artifact
→ Verify
→ Promote Same Artifact
```

핵심:

- Build reproducibility
- Artifact immutability where appropriate
- Versioning / traceability
- Configuration separation
- Environment consistency
- Promotion rather than rebuild

Container는 대표 구현수단일 뿐 필수 전제는 아니다.

---

## 12. Deployment Strategy

Core는 원리다.

- Risk reduction
- Small change
- Reversibility
- Progressive exposure
- Fast detection
- Recovery

### Awareness — 1~5분

- Blue/Green
- Canary
- Rolling
- Feature Flag
- Progressive Delivery
- GitOps

세부 도구 조작은 비범위.

---

## 13. Observability / Operations Feedback

Observability의 목적:

> **Production에서 실제 시스템이 어떤 상태인지 이해하고, 문제를 빠르게 탐지·격리·복구하며, 그 Evidence를 개발로 돌려보내는 것**

기본 신호:

- Logs
- Metrics
- Traces
- Events / deployment context

중요한 연결:

```text
Deployment
→ Observe
→ Detect
→ Diagnose
→ Recover
→ Learn
→ Change
```

Monitoring dashboard 자체가 목적이 아니다.

---

## 14. Recovery / Learning

DevOps의 목표를 “장애 0”으로 두지 않는다.

대신:

- Failure detection
- Blast radius reduction
- Rollback / roll-forward
- Recovery
- Postmortem
- Recurrence prevention

을 다룬다.

### Blameless Postmortem

도덕 규범이 아니라 학습 메커니즘으로 설명한다.

> **실패 정보를 숨기지 않고 시스템 개선에 사용할 수 있어야 Feedback Loop가 닫힌다.**

---

## 15. Cargo Cult Engineering — Reduced but Persistent Lens

독립 설명은 짧게 하고, 과정 전반에 반복 적용한다.

### Diagnostic Questions

1. 이 활동은 어떤 실제 문제를 해결하는가?
2. 이 활동이 없으면 어떤 결과가 나빠지는가?
3. 성공을 어떤 Evidence로 판단하는가?
4. 결과가 개선되지 않는데도 형식만 유지하고 있지는 않은가?

### DevOps Examples

- Jenkins Pipeline 존재 → Lead Time 변화 없음
- Kubernetes 도입 → Deployment safety 변화 없음
- Quality Gate 증가 → Feedback delay만 증가
- DORA dashboard → 개선 action 없음
- IaC 도입 → manual exception이 계속 존재

---

## 16. DORA — Current Position

DORA metric은 성과 순위표가 아니라 Delivery System 진단 Evidence로 사용한다.

### Software Delivery Throughput

- Change lead time
- Deployment frequency
- Failed deployment recovery time

### Software Delivery Instability

- Change failure rate
- Rework rate

핵심은 숫자 5개 암기가 아니다.

```text
Throughput
      ↕
Instability
```

를 함께 본다.

### Important

- 특정 과거 연도의 Elite / High / Low benchmark 수치를 일반 법칙으로 고정하지 않는다.
- Metric을 개인/팀 평가 KPI로 사용하지 않는다.
- Deployment Frequency만 높이는 것을 목표로 삼지 않는다.
- Measurement는 다음 improvement decision을 위한 Evidence다.

```text
Measure
→ Diagnose
→ Improve
→ Measure Again
```

---

## 17. CALMS / Three Ways — Position

### Three Ways

DevOps를 보는 교육적 Anchor로 사용한다.

- Flow
- Feedback
- Continual Learning & Experimentation

과정의 Core Narrative와 직접 연결한다.

### CALMS

Awareness / Supporting Lens로 사용한다.

- Culture
- Automation
- Lean
- Measurement
- Sharing

CALMS를 표준 성숙도 모델이나 필수 checklist처럼 사용하지 않는다.

---

## 18. Tool Depth Policy

### Core
- Flow
- Feedback
- CI
- Continuous Delivery
- Artifact
- Deployment
- Environment reproducibility
- Observability
- Recovery
- Delivery measurement
- Improvement

### Practice
- Pipeline reasoning
- CI failure handling
- Deployment automation reasoning
- Environment / configuration thinking
- Delivery bottleneck diagnosis
- 90-day improvement plan

### Awareness 1–5분
- Jenkins / GitHub Actions / GitLab CI
- SonarQube
- Artifact Repository
- Docker
- Kubernetes
- Terraform
- Ansible
- Argo CD
- GitOps
- Blue/Green
- Canary
- Feature Flag
- SRE
- Platform Engineering
- Team Topologies
- DevSecOps

Tool을 Stage maturity의 정답처럼 가르치지 않는다.

---

## 19. Core Decision Questions

수강생은 다음 질문에 답할 수 있어야 한다.

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

---

## 20. Learning Outcomes

수강 후 학습자는:

- End-to-End Delivery Flow를 그리고 병목을 식별한다.
- Dev와 Ops의 capability를 별도로 진단하고 개선 우선순위를 결정한다.
- CI를 Tool이 아닌 frequent integration + fast feedback practice로 설명한다.
- Continuous Delivery와 Continuous Deployment를 구분한다.
- Pipeline에 들어갈 검증과 Local feedback의 역할을 구분한다.
- Deployable artifact / environment reproducibility의 의미를 설명한다.
- Deployment risk에 맞는 기본 전략을 선택한다.
- Observability와 Recovery를 Delivery Feedback Loop에 연결한다.
- DORA 지표를 KPI가 아닌 system improvement evidence로 사용한다.
- 조직 유형과 제약에 맞는 첫 90일 improvement plan을 만든다.

---

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **4개**, 1일 4개, 총 약 **90분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/08_devops/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T03 | Dev × Ops Bottleneck Diagnosis | 20분 | 현재 delivery bottleneck이 Dev/Ops/link 중 어디에 있는가 |
| P2 | T04 | CI Feedback Path Design | 25분 | 어떤 검증을 IDE/local/pre-commit/CI 어디에 둘 것인가 |
| P3 | T05/T06 | Deployable State / Release Risk | 25분 | artifact/environment/deployment risk를 어떻게 줄여 항상 deployable state를 만들 것인가 |
| P4 | T07/T08/T09 | Observe → Recover → 90-day Improvement | 20분 | 운영 evidence를 어떤 복구/학습/개선 우선순위로 연결할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 21. Topic-Based Curriculum — 400 Instructional Minutes

> **중요:** 아래 Topic은 운영상 50분 Session과 동일하지 않다.  
> 운영은 약 50분 학습 + 10분 휴식 리듬을 유지할 수 있으나 Topic은 필요하면 휴식을 가로질러 이어진다.

| Topic | 주제 | 권장 학습시간 |
|---|---|---:|
| T01 | 같은 고통은 왜 반복되는가 — Delivery System과 Cargo Cult | 40m |
| T02 | DevOps의 본질 — Flow, Feedback, Learning | 45m |
| T03 | Dev × Ops Diagnosis — 현재 병목 찾기 | 55m |
| T04 | Continuous Integration — Small Batch와 Fast Feedback | 60m |
| T05 | Continuous Delivery — Deployable State와 Delivery Automation | 55m |
| T06 | Artifact·Environment·Deployment Risk | 45m |
| T07 | Observe·Recover·Learn — Operations Feedback | 35m |
| T08 | 단계적 도입 — Constraint별 첫 90일 | 40m |
| T09 | Measure & Improve — DORA와 역할별 Action | 25m |
| **합계** |  | **400m** |

운영 예:

```text
Instruction 400m
+
Break 80m
=
Total 480m
```

---

## 22. Topic Detail

### T01. 같은 고통은 왜 반복되는가 — 40m

핵심:
- 납품 직전 integration / QA / deployment crunch
- Hero Engineering
- Waiting vs Working
- System problem
- Cargo Cult Engineering

줄일 것:
- Cargo Cult 역사 상세
- Goodhart 반복 설명
- Artifact 문제의 과도한 확장

Anchor:

> **사람을 더 빠르게 만드는 것보다 시스템의 대기와 반복 실패를 줄이는 것이 먼저다.**

---

### T02. DevOps의 본질 — 45m

핵심:
- DevOps emergence context
- Three Ways
- Flow
- Feedback
- Learning
- Agile bridge
- CALMS awareness

수정:
- “DevOps = 배포 공포 제거” → 대표 문제/효과로 하향
- “DevOps = Agile 전제조건” → Agile delivery를 production feedback까지 연결하는 핵심 capability로 수정

Anchor:

> **DevOps는 Dev와 Ops를 연결하는 조직도가 아니라 Change Flow와 Feedback Loop를 개선하는 Engineering System이다.**

---

### T03. Dev × Ops Diagnosis — 55m

기존 과정의 핵심 자산.

활동:
- Dev capability 진단
- Ops capability 진단
- Flow bottleneck 진단
- 현재 위치
- 다음 개선 1개 선정

출력:
- 현재 Bottleneck
- 첫 Capability Improvement

성숙도 수준 자체보다 **다음 decision**이 중요하다.

---

### T04. Continuous Integration — 60m

핵심:
- frequent integration
- small batch
- branch divergence
- local verification
- automated build / tests
- fast feedback
- broken build
- pipeline failure policy
- reference artifact

SWQM bridge:
- 어떤 evidence/gate를 요구할지는 SWQM
- 어떤 cadence/location에서 자동 실행할지는 DevOps

Awareness:
- Jenkins / GitHub Actions / GitLab CI
- static analysis tools
- artifact repository

---

### T05. Continuous Delivery — 55m

핵심:
- CD authoritative definition
- deployable state
- Continuous Delivery vs Deployment
- delivery pipeline
- staging
- promotion
- approval
- outsourcing/waterfall context
- release decision

Anchor:

> **자주 Production에 배포하는 것이 목적이 아니라 필요할 때 안전하게 배포할 수 있는 상태가 목적이다.**

---

### T06. Artifact·Environment·Deployment Risk — 45m

핵심:
- reproducible build
- versioned artifact
- same artifact promotion
- configuration
- environment consistency
- IaC orientation
- deployment strategy decision

Awareness:
- Docker
- Kubernetes
- Terraform
- Ansible
- Blue/Green
- Canary
- Feature Flag
- GitOps

Tool roadmap은 Appendix로 유지.

---

### T07. Observe·Recover·Learn — 35m

핵심:
- monitoring vs observability
- log / metric / trace
- deployment context
- detection
- recovery
- rollback / roll-forward
- blameless postmortem
- production feedback

Anchor:

> **Production은 Delivery의 끝이 아니라 Feedback의 시작이다.**

---

### T08. 단계적 도입 — Constraint별 첫 90일 — 40m

기존 자료의 두 번째 핵심 자산.

기존 유형은 예시로 유지:
- 자체 개발+운영
- 외부 개발
- 유지보수

그러나 특정 시장 관행으로 고정하지 않고 범용 constraint로 추상화한다.

예:

```text
Ownership Constraint
Contract Constraint
Engineering Constraint
Operations Constraint
Legacy Constraint
Compliance Constraint
```

도입 원칙:

1. 현재 Flow를 본다.
2. 가장 큰 Bottleneck 하나를 고른다.
3. 작은 Pilot으로 개선한다.
4. Evidence를 수집한다.
5. 다음 Bottleneck으로 이동한다.

---

### T09. Measure & Improve — 25m

핵심:
- DORA current metrics
- throughput vs instability
- Goodhart
- system diagnosis
- role-based action
- next iteration

최종 산출물:

> **현재 Bottleneck + 첫 개선 + Evidence + 90일 Review 조건**

---

## 23. Failure Conditions

다음 상태면 DevOps 도입이 형식화되고 있을 가능성이 높다.

1. Tool 설치 완료가 성공 기준
2. Pipeline이 수동 또는 자주 우회됨
3. Long-lived branch로 integration delay 유지
4. CI 실패를 방치
5. Local validation 없이 CI를 dumping ground로 사용
6. 모든 quality check를 중앙 pipeline으로 올려 feedback을 느리게 함
7. Environment마다 artifact를 다시 build
8. Production deploy가 특정 영웅 한 명에게 의존
9. Observability tool은 있으나 delivery/recovery decision에 사용되지 않음
10. DORA metric을 개인/팀 KPI로 사용
11. Kubernetes / Platform tool을 현재 bottleneck과 무관하게 먼저 도입
12. Deployment automation만 하고 Feedback/Recovery를 설계하지 않음
13. DevOps 전담팀이 새로운 handoff silo가 됨
14. 성숙도 label을 이유로 개선을 시작하지 않음

---

## 24. Exercise / Evidence

이 과정은 Tool 실습과정이 아니라 **진단·의사결정 실습 과정**으로 둔다.

학습자는 최소 다음을 만들어야 한다.

1. Current Delivery Flow
2. Waiting / Bottleneck
3. Dev capability diagnosis
4. Ops capability diagnosis
5. CI improvement decision
6. Delivery / deployment risk
7. Observability gap
8. First 90-day action
9. Success evidence / metric
10. Failure / stop condition

---

## 25. Core Case

기존 PPT의 현장성을 유지한다.

```text
기업 업무 시스템

개발: 내부 + 외부 혼합
Integration: 늦음
Build: 일부 수동
QA: 후반 집중
Staging: 수동 반영
Production: 승인 후 제한적 이관
운영: 별도 조직
장애: 운영 → 개발 전달까지 지연
도구: Jenkins / SonarQube 일부 존재
문제: 도구 존재에도 납품 직전 Crunch 반복
```

경영진 제안:

> “Jenkins와 Kubernetes를 확대해서 DevOps를 강화하자.”

학습자 최종 판단:

> **Tool 확대 전에 Delivery Flow를 진단하고 가장 큰 Bottleneck을 먼저 개선한다.**

---

## 26. Explicit Non-Scope

- Jenkins 실습
- GitHub Actions 실습
- Kubernetes 운영
- Terraform 실습
- Argo CD 실습
- SRE full course
- Platform Engineering full course
- Team Topologies 상세
- DevSecOps full course
- SWQM의 Test Strategy 정본 재교육
- Agile/Scrum 정본 재교육
- MSA / distributed system design 재교육
- Cloud vendor product training

필요 시 Awareness / Forward 수준으로만 소개한다.

---

## 27. Source / Currency Baseline

### Primary / authoritative
- DORA — Continuous Integration capability
- DORA — Continuous Delivery capability
- DORA — current Software Delivery Performance measures
- Agile / SWQM / SW Architecture Portfolio Canon

### Stable practitioner lineage
- Gene Kim et al. — *The DevOps Handbook*
- Jez Humble, David Farley — *Continuous Delivery*
- Forsgren, Humble, Kim — *Accelerate*

### Rule
- Vendor Tool documentation은 implementation example
- Tool이 Course Spine이 되지 않는다.
- DORA의 특정 연도 benchmark 숫자는 출처 연도를 명시하지 않고 일반 법칙처럼 사용하지 않는다.

---

## 28. Quality Gate

Curriculum 승인 전 모두 YES여야 한다.

- DevOps가 Toolchain 과정으로 축소되지 않는가?
- Flow / Feedback / Learning이 과정 중심인가?
- 기존 4막 서사가 유지되는가?
- Dev × Ops 진단이 maturity certificate가 아닌 bottleneck diagnosis인가?
- CI가 frequent integration + fast feedback으로 정의되는가?
- Local Shift-Left와 CI 역할이 구분되는가?
- Continuous Delivery와 Continuous Deployment가 구분되는가?
- “운영 배포 1회”를 일반 원칙으로 만들지 않는가?
- Same Artifact / Reproducibility 원칙이 특정 Container technology에 종속되지 않는가?
- Observability / Recovery가 부록으로 밀리지 않는가?
- DORA current 5-metric model이 반영되는가?
- DORA metric을 KPI target으로 사용하지 않는가?
- SWQM의 Evidence/Gate ownership을 침범하지 않는가?
- Agile 내용을 재교육하지 않는가?
- Tool은 Awareness/Appendix 수준을 지키는가?
- 첫 90일 계획이 current bottleneck에서 시작하는가?
- Topic 시간이 균등 50분으로 강제되지 않는가?
- 총 운영시간이 480분 이내인가?

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## 29. Final Course Message

> **DevOps의 목적은 더 많은 도구를 운영하는 것이 아니라, 작은 변경이 빠르고 안전하게 흐르고 그 결과를 즉시 학습할 수 있는 Delivery System을 만드는 것이다.**

그리고 수강생에게 남길 최종 질문은:

> **“우리 조직에 어떤 DevOps 도구가 부족한가?”가 아니라  
> “우리 Delivery Flow에서 가장 큰 지연과 위험은 어디이며, 다음 90일에 무엇을 바꾸고 어떤 Evidence로 개선을 증명할 것인가?”**

