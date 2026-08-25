# DevOps — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/08_devops.md`
> **Standard:** `support/01_governance/12_llm-integrated-practice-standard.md`
> **Practice Count:** 4
> **Cadence:** 1일 4개
> **Practice Time:** 약 90분, 기존 instructional time에 포함
> **Authority:** 과정 Baseline과 공통 Governance에 종속; 충돌 시 상위 Canon 우선

## Operating Rules

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.

## P1. Dev × Ops Bottleneck Diagnosis

- **Placement:** T03
- **Timebox:** 20분
- **Course Ownership:** Delivery Diagnosis
- **Decision Practiced:** 현재 delivery bottleneck이 Dev/Ops/link 중 어디에 있는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 사례의 wait/rework/failure를 진단하고 첫 개선점을 정한다.

### Initial Instruction
사례의 wait/rework/failure를 진단하고 첫 개선점을 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
개발 내부 build/test 불안정과 운영 수동배포가 동시에 있다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
Dev, Ops, handoff를 분리 진단하고 가장 큰 flow/feedback constraint 하나를 evidence와 함께 선택하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

### Prompt Design Intent
Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다.

### Trade-off
빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다.
### Failure Condition
LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때.
### Transfer
동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다.

---

## P2. CI Feedback Path Design

- **Placement:** T04
- **Timebox:** 25분
- **Course Ownership:** Continuous Integration
- **Decision Practiced:** 어떤 검증을 IDE/local/pre-commit/CI 어디에 둘 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** build/test/static/security check를 가장 싼 feedback 지점에 배치한다.

### Initial Instruction
build/test/static/security check를 가장 싼 feedback 지점에 배치한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
CI가 30분 걸리고 개발자가 로컬 검증을 거의 하지 않는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
오류를 가능한 가장 이른 싼 지점에서 잡되 중복 비용을 줄이는 local→pre-commit→CI feedback design을 제안하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

### Prompt Design Intent
Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다.

### Trade-off
빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다.
### Failure Condition
LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때.
### Transfer
동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다.

---

## P3. Deployable State / Release Risk

- **Placement:** T05/T06
- **Timebox:** 25분
- **Course Ownership:** Continuous Delivery
- **Decision Practiced:** artifact/environment/deployment risk를 어떻게 줄여 항상 deployable state를 만들 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** immutable artifact, environment consistency, rollout 후보를 설계한다.

### Initial Instruction
immutable artifact, environment consistency, rollout 후보를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
고객 승인 때문에 실제 production deployment는 수동이어야 한다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
continuous delivery와 continuous deployment를 구분하고 수동 승인 제약 안에서도 deployable state와 repeatability를 높일 방법을 설계하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

### Prompt Design Intent
Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다.

### Trade-off
빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다.
### Failure Condition
LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때.
### Transfer
동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다.

---

## P4. Observe → Recover → 90-day Improvement

- **Placement:** T07/T08/T09
- **Timebox:** 20분
- **Course Ownership:** Operations Feedback
- **Decision Practiced:** 운영 evidence를 어떤 복구/학습/개선 우선순위로 연결할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 배포 주기가 길고 CI 피드백이 늦으며 수동 배포와 운영 장애가 반복되는 서비스 팀의 delivery 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** incident evidence와 DORA 지표로 90일 개선안을 만든다.

### Initial Instruction
incident evidence와 DORA 지표로 90일 개선안을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
배포 빈도는 높지만 change fail rate와 recovery time이 악화된 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
metric을 목표로 최적화하지 말고 flow/instability evidence로 constraint와 90일 action, success/failure criteria를 정하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

### Prompt Design Intent
Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다.

### Trade-off
빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다.
### Failure Condition
LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때.
### Transfer
동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다.

---

## Course Practice Quality Gate

- 4개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
