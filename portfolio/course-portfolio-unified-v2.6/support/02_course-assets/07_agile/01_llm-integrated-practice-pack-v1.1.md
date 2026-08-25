# Agile — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/07_agile.md`
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

## P1. Diagnose before Agile

- **Placement:** T01/T02
- **Timebox:** 20분
- **Course Ownership:** Agile Diagnosis
- **Decision Practiced:** 문제가 uncertainty/feedback/engineering/governance 중 무엇이며 Agile이 무엇을 해결하지 못하는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 사례를 분류하고 Agile 적용/비적용 범위를 결정한다.

### Initial Instruction
사례를 분류하고 Agile 적용/비적용 범위를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
약한 build/test 자동화와 긴 승인 체계를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
framework를 추천하기 전에 문제를 uncertainty, feedback, engineering capability, organization, governance로 분리하고 Agile이 해결 못할 항목을 명시하라.
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

## P2. Slice for Value & Feedback

- **Placement:** T04
- **Timebox:** 25분
- **Course Ownership:** Increment / Feedback
- **Decision Practiced:** 큰 요구를 어떤 vertical increment로 쪼개야 빠른 학습이 가능한가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 기능 묶음을 2~3개 vertical slice로 분해하고 feedback question을 만든다.

### Initial Instruction
기능 묶음을 2~3개 vertical slice로 분해하고 feedback question을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
UI만/DB만 나누는 layer slice 제안을 거절하는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
각 slice가 end-to-end value와 검증 가능한 feedback을 만들도록 분해하고 dependency와 non-sliceable 제약을 표시하라.
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

## P3. Scrum Mechanism Repair

- **Placement:** T05/T06
- **Timebox:** 25분
- **Course Ownership:** Scrum Application
- **Decision Practiced:** Scrum 요소가 왜 무력화됐고 최소 어떤 구조를 고칠 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 보고회화/발표회화/권한 부족 사례를 진단해 intervention을 정한다.

### Initial Instruction
보고회화/발표회화/권한 부족 사례를 진단해 intervention을 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
Sprint Goal과 DoD가 형식적으로만 존재한다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
Scrum 이벤트/역할 이름을 바꾸기보다 transparency-inspection-adaptation loop가 막힌 원인을 찾아 최소 변경을 제안하라.
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

## P4. Pilot / Scale / Stop Decision

- **Placement:** T07/T08
- **Timebox:** 20분
- **Course Ownership:** Agile Adoption
- **Decision Practiced:** 어떤 pilot을 하고 어떤 evidence로 확대·수정·중단할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 제품팀이 큰 요구, 늦은 피드백, 불안정한 개발 규율 속에서 Agile/Scrum 적용 방식을 재설계하는 실제 개선 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 외부 개발·다중팀 환경에서 90일 pilot과 scale gate를 설계한다.

### Initial Instruction
외부 개발·다중팀 환경에서 90일 pilot과 scale gate를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
조직이 SAFe 같은 scaling부터 요구한다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
single-team feedback이 먼저 작동하는 pilot을 설계하고 outcome/evidence로 scale, adapt, stop 조건을 명시하라.
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
