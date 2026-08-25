# SW Architecture — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/03_sw-architecture.md`
> **Standard:** `support/01_governance/12_llm-integrated-practice-standard.md`
> **Practice Count:** 7
> **Cadence:** Day 1 3개 / Day 2 4개
> **Practice Time:** 약 160분, 기존 instructional time에 포함
> **Authority:** 과정 Baseline과 공통 Governance에 종속; 충돌 시 상위 Canon 우선

## Operating Rules

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.

## P1. Quality Attribute Scenario

- **Placement:** T03
- **Timebox:** 20분
- **Course Ownership:** Architecture Drivers
- **Decision Practiced:** 막연한 품질 요구를 검증 가능한 scenario로 어떻게 바꿀 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** “빠르고 안정적” 요구를 stimulus/context/response/measure로 구체화한다.

### Initial Instruction
“빠르고 안정적” 요구를 stimulus/context/response/measure로 구체화한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
정상 부하와 peak 부하, 허용 가능한 degradation 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
품질 형용사를 측정 가능한 quality attribute scenario로 바꾸고 아직 모르는 수치를 질문으로 남겨라.
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

## P2. Structure Alternatives & Trade-offs

- **Placement:** T04/T05
- **Timebox:** 25분
- **Course Ownership:** Architecture Decision
- **Decision Practiced:** driver에 대해 어떤 구조 대안이 무엇을 사고 무엇을 지불하는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 2~3개 구조 대안을 비교하고 gain/cost/risk를 기록한다.

### Initial Instruction
2~3개 구조 대안을 비교하고 gain/cost/risk를 기록한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
운영 인력과 변경 빈도 제약을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
패턴 이름을 정답으로 고르지 말고 drivers와 constraints에 대해 대안별 gain/cost/risk를 비교하라.
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

## P3. Policy vs Detail Dependency

- **Placement:** T07
- **Timebox:** 20분
- **Course Ownership:** Dependency Rule
- **Decision Practiced:** 어떤 정책을 volatile detail에서 보호해야 하는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 의존성 구조를 분석하고 inward dependency를 위한 최소 경계를 제안한다.

### Initial Instruction
의존성 구조를 분석하고 inward dependency를 위한 최소 경계를 제안한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
DB 교체 가능성은 낮고 외부 결제 API 변동성은 높다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
변동 evidence가 있는 detail만 분리하고 불필요한 layer/interface를 만들지 않는 최소안을 제시하라.
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

## P4. ADR from Decision Evidence

- **Placement:** T10
- **Timebox:** 20분
- **Course Ownership:** ADR / Trade-off
- **Decision Practiced:** 어떤 의사결정을 ADR로 남길 가치가 있는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** context/options/decision/consequence를 담은 ADR 초안을 만든다.

### Initial Instruction
context/options/decision/consequence를 담은 ADR 초안을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
선택이 되돌리기 어렵고 migration cost가 크다는 정보를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
결론보다 context, considered options, trade-off, consequences, revisit trigger가 드러나는 ADR을 작성하라.
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

## P5. Scenario-based Architecture Evaluation

- **Placement:** T11/T12
- **Timebox:** 25분
- **Course Ownership:** Architecture Evaluation
- **Decision Practiced:** 설계가 주요 scenario에서 어디서 깨질 수 있는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 핵심 scenario로 architecture risk와 sensitivity point를 찾는다.

### Initial Instruction
핵심 scenario로 architecture risk와 sensitivity point를 찾는다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
장애 시나리오와 보안 제약을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
설계를 칭찬하지 말고 scenario별 risk, sensitivity, trade-off point와 필요한 evidence를 찾으라.
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

## P6. Fitness Function / Conformance Rule

- **Placement:** T13/T14
- **Timebox:** 25분
- **Course Ownership:** Architecture Enforcement
- **Decision Practiced:** 어떤 아키텍처 특성을 자동 검증할 가치가 있는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 중요 rule을 executable fitness/conformance check 후보로 만든다.

### Initial Instruction
중요 rule을 executable fitness/conformance check 후보로 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
모든 규칙 자동화 비용이 높다는 제약을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
가치·검증가능성·오탐비용 기준으로 자동화할 규칙과 사람 검토로 남길 규칙을 구분하라.
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

## P7. Evolution Decision under New Evidence

- **Placement:** T15/T16
- **Timebox:** 25분
- **Course Ownership:** Evolutionary Architecture
- **Decision Practiced:** 새 evidence가 나왔을 때 어떤 결정을 유지/변경할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 새 workload/조직/비용 evidence에 따라 기존 ADR을 재평가한다.

### Initial Instruction
새 workload/조직/비용 evidence에 따라 기존 ADR을 재평가한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
초기 예측과 실제 운영 데이터가 다르다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
기존 결정을 존중하되 새 evidence로 keep/change/reverse를 판단하고 migration cost와 trigger를 명시하라.
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

- 7개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
