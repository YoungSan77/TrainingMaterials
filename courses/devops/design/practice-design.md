# DevOps Practice Design — LLM-Integrated Practice

> **Course ID:** devops
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 4개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제·축약하지 않았다. Recommended Prompt는 원문을 유지하고 원출처는 Git history에 보존된다.
> **No lab-design.md:** DevOps는 `guides/과정_설계_지침.md` §2-b가 말하는 "lab-design.md가 없는 과정"에 해당한다. 따라서 이 Practice Pack이 실습 설계의 기준선이다(실습 대상·코드 대조쌍을 별도로 소유하는 lab-design.md는 존재하지 않는다).
> **Distribution:** Practice Pack은 Instructor-only asset이다(practice-standard.md §2). 학습자용 자료에는 각 Practice의 `Initial Instruction / Deliverable / Inputs / Timebox`까지만 배포하고, Intervention과 Recommended Prompt는 실습 진행 중 정해진 시점에만 공개한다.
>
> **Practice Count:** 4 (P1–P4) — Portfolio Quantity/Cadence Rule(practice-standard.md §3)의 8h 과정 기준 3–4개 범위 안, 1일 4개.
> **Total Practice Time:** 약 90분 — 기존 400분 instructional time 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황(Practice Pack 공통 Work Context).

## Operating Rules (practice-standard.md §2, §5 적용)

- Recommended Prompt는 실습 시작 시 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- Intervention은 시작 후 5–10분 시점에 공개한다(Phase C).
- 학습자는 새 채팅으로 재시작하지 않고 Keep Going하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며 학습자의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 DevOps의 flow·feedback·delivery·recovery 판단(Course-owned decision, evidence, trade-off, failure condition)이다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — 모든 Practice의 판단 OWNER는 DevOps다. Quality Gate 통과 기준 자체를 판단하면 SWQM 영역을 침범하는 것이므로, Practice 산출물은 "무엇을 검증할지"가 아니라 "언제·어디서·얼마나 빠르게 흘려보낼지"에 머문다(course-context.md §8 Boundary rule).

## Practice Index

| ID | Placement | Practice | Timebox | Core Decision |
|---|---|---|---:|---|
| P1 | T03 | Dev × Ops Bottleneck Diagnosis | 20분 | 현재 delivery bottleneck이 Dev/Ops/link 중 어디에 있는가 |
| P2 | T04 | CI Feedback Path Design | 25분 | 어떤 검증을 IDE/local/pre-commit/CI 어디에 둘 것인가 |
| P3 | T05/T06 | Deployable State / Release Risk | 25분 | artifact/environment/deployment risk를 어떻게 줄여 항상 deployable state를 만들 것인가 |
| P4 | T07/T08/T09 | Observe → Recover → 90-day Improvement | 20분 | 운영 evidence를 어떤 복구/학습/개선 우선순위로 연결할 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다(Baseline §LLM-Integrated Practice Design).

---

## P1. Dev × Ops Bottleneck Diagnosis

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Dev × Ops Bottleneck Diagnosis |
| **Course Ownership** | DevOps OWNER — Delivery Diagnosis(Dev × Ops Bottleneck Diagnosis는 DevOps가 정의하는 진단 프레임워크이며 성숙도 인증이 아니다; course-context.md §8, Baseline §8) |
| **Decision Practiced** | 현재 delivery bottleneck이 Dev/Ops/link 중 어디에 있는가 |
| **Work Context** | 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황 |
| **Preconditions** | 해당 Placement(T03)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 사례의 wait/rework/failure를 진단하고 첫 개선점을 정한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 사례의 wait/rework/failure를 진단하고 첫 개선점을 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 개발 내부 build/test 불안정과 운영 수동배포가 동시에 있다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DEVOPS-01 Diagnose before Automating, DEVOPS-02 Optimize End-to-End Delivery Flow)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nDev, Ops, handoff를 분리 진단하고 가장 큰 flow/feedback constraint 하나를 evidence와 함께 선택하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정(예: 무엇을 검증 기준으로 삼을지 같은 SWQM 영역)을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. CI Feedback Path Design

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — CI Feedback Path Design |
| **Course Ownership** | DevOps OWNER — Continuous Integration(frequent integration + fast feedback practice; 검증 항목의 존재 자체가 아니라 그 항목을 어디서 실행할지의 판단; course-context.md §8) |
| **Decision Practiced** | 어떤 검증을 IDE/local/pre-commit/CI 어디에 둘 것인가 |
| **Work Context** | 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황 |
| **Preconditions** | 해당 Placement(T04)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | build/test/static/security check를 가장 싼 feedback 지점에 배치한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | build/test/static/security check를 가장 싼 feedback 지점에 배치한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | CI가 30분 걸리고 개발자가 로컬 검증을 거의 하지 않는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DEVOPS-03 Small Batch and Fast Feedback Reduce Delivery Risk)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n오류를 가능한 가장 이른 싼 지점에서 잡되 중복 비용을 줄이는 local→pre-commit→CI feedback design을 제안하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정(예: 어떤 검증 기준/Gate 통과 조건이 옳은가 같은 SWQM 영역)을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Deployable State / Release Risk

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Deployable State / Release Risk |
| **Course Ownership** | DevOps OWNER — Continuous Delivery(Continuous Delivery와 Continuous Deployment의 구분, Deployable Artifact/Environment Reproducibility; course-context.md §8) |
| **Decision Practiced** | artifact/environment/deployment risk를 어떻게 줄여 항상 deployable state를 만들 것인가 |
| **Work Context** | 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황 |
| **Preconditions** | 해당 Placement(T05/T06)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | immutable artifact, environment consistency, rollout 후보를 설계한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | immutable artifact, environment consistency, rollout 후보를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 고객 승인 때문에 실제 production deployment는 수동이어야 한다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DEVOPS-04 Reproducibility before Deployment Sophistication)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\ncontinuous delivery와 continuous deployment를 구분하고 수동 승인 제약 안에서도 deployable state와 repeatability를 높일 방법을 설계하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, "CI/CD는 운영 배포 빈도를 늘려야 한다"는 식으로 Continuous Delivery 원칙을 일반화해 Course Ownership 밖의 결정을 대신 맡길 때(Baseline §10 참고 — 배포 빈도는 Product/Contract/Control 맥락의 선택이지 의무가 아니다). |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. Observe → Recover → 90-day Improvement

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — Observe → Recover → 90-day Improvement |
| **Course Ownership** | DevOps OWNER — Operations Feedback(Observability를 detection/recovery/learning으로 연결, DORA를 KPI가 아닌 system improvement evidence로 사용; course-context.md §8) |
| **Decision Practiced** | 운영 evidence를 어떤 복구/학습/개선 우선순위로 연결할 것인가 |
| **Work Context** | 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황 |
| **Preconditions** | 해당 Placement(T07/T08/T09)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | incident evidence와 DORA 지표로 90일 개선안을 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | incident evidence와 DORA 지표로 90일 개선안을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 배포 빈도는 높지만 change fail rate와 recovery time이 악화된 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(DEVOPS-05 Recovery and Learning Are Part of Delivery)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\nmetric을 목표로 최적화하지 말고 flow/instability evidence로 constraint와 90일 action, success/failure criteria를 정하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나, Deployment Frequency 단일 지표만 높이는 것을 목표로 삼아 Throughput/Instability를 함께 보지 않을 때(Baseline §16 참고). |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 4개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음):

- Deployment Strategy 세부 도구 조작(Blue/Green/Canary/Feature Flag/GitOps의 tool-level 실행)
- Jenkins/GitHub Actions/GitLab CI/SonarQube/Docker/Kubernetes/Terraform/Ansible/Argo CD 등 Tool Awareness 상세
- CALMS 각 항목의 부가 설명
- DORA 과거 Four Keys benchmark 수치의 연도별 상세 비교
- Cargo Cult Engineering의 역사적 배경

## DevOps LLM Practice Quality Gate

Practice Pack v1.1의 Course Practice Quality Gate를 그대로 유지한다:

- 4개 Practice가 과정 전반(T03/T04/T05·T06/T07·T08·T09)에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?(P1 20분, P2 25분, P3 25분, P4 20분 — 총 90분)
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가 — 특히 Quality Gate 기준(SWQM) 자체를 재정의하지 않는가?
- 기존 instructional time(400분) 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
- Prompt Engineering 자체가 아니라 flow/feedback/delivery/recovery 판단이 평가 대상인가?
