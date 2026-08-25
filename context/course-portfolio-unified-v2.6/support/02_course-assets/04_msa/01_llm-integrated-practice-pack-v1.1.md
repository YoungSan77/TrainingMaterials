# MSA — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/04_msa.md`
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

## P1. Should We Distribute?

- **Placement:** T01/T03
- **Timebox:** 20분
- **Course Ownership:** Distribution Economics
- **Decision Practiced:** 분산이 실제로 비용을 지불할 가치가 있는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 모놀리스 유지/모듈화/서비스 분리 대안을 비교한다.

### Initial Instruction
모놀리스 유지/모듈화/서비스 분리 대안을 비교한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
독립 배포 필요성과 운영 인력 부족을 동시에 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
독립 배포·확장·소유 이득과 network/operation 비용을 비교해 가장 단순한 배치 형태를 선택하라.
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

## P2. Service Boundary & Data Ownership

- **Placement:** T04
- **Timebox:** 25분
- **Course Ownership:** Service Boundary
- **Decision Practiced:** 서비스 경계와 데이터 소유를 어디에 둘 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 후보 capability를 서비스로 추출할지와 데이터 소유를 결정한다.

### Initial Instruction
후보 capability를 서비스로 추출할지와 데이터 소유를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
공유 DB를 유지해야 한다는 기존 제약을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
경계의 autonomy가 공유 데이터로 훼손되는지 분석하고 module/service 대안을 trade-off로 비교하라.
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

## P3. Contract, Compatibility & Consistency

- **Placement:** T05/T06
- **Timebox:** 25분
- **Course Ownership:** Distributed Contract
- **Decision Practiced:** 변경 호환성과 consistency 요구를 어떻게 함께 설계할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** API/event 변화와 동기/비동기 consistency 대안을 설계한다.

### Initial Instruction
API/event 변화와 동기/비동기 consistency 대안을 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
중복 메시지와 지연 허용시간을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
contract evolution, idempotency, consistency time bound를 함께 고려하고 반드시 즉시 일관적이어야 하는 invariant만 분리하라.
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

## P4. Failure + Observability + Ops Cost

- **Placement:** T07/T08
- **Timebox:** 20분
- **Course Ownership:** Operational Reality
- **Decision Practiced:** 장애 설계와 관찰성, 운영비용을 어떻게 한 결정으로 볼 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 모듈러 모놀리스가 성장하면서 팀 자율성·변경 독립성 요구와 분산시스템 비용 사이에서 서비스 분리를 판단하는 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** timeout/retry/observability/runbook 후보를 설계하고 MSA 유지 여부를 재판단한다.

### Initial Instruction
timeout/retry/observability/runbook 후보를 설계하고 MSA 유지 여부를 재판단한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
재시도 폭주와 on-call 부담 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
failure mode별 대응과 관측 evidence를 연결하고 운영 복잡도가 분산의 가치보다 큰지 최종 판단하라.
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
