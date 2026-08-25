# DDD — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/02_ddd.md`
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

## P1. Domain Language from Messy Requirements

- **Placement:** T02
- **Timebox:** 20분
- **Course Ownership:** Ubiquitous Language / Discovery
- **Decision Practiced:** 어떤 용어·개념을 공유 언어로 채택하고 무엇을 질문으로 남길 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 요구·회의 메모에서 핵심 용어와 의미 충돌을 찾고 working glossary와 질문을 만든다.

### Initial Instruction
요구·회의 메모에서 핵심 용어와 의미 충돌을 찾고 working glossary와 질문을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
동일 단어가 영업과 운영에서 다른 의미를 가진다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
용어를 임의 통합하지 말고 의미 충돌·관계·미해결 질문을 구분해 제시하라.
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

## P2. Entity / Value Object / Invariant Decision

- **Placement:** T04
- **Timebox:** 25분
- **Course Ownership:** Tactical Domain Modeling
- **Decision Practiced:** 정체성·값·불변식 기준으로 모델 요소를 어떻게 구분할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 후보 개념을 Entity/VO로 판단하고 domain invariant를 명시한다.

### Initial Instruction
후보 개념을 Entity/VO로 판단하고 domain invariant를 명시한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
주소 변경과 가격 스냅샷처럼 identity와 immutability 요구가 다른 사례를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
각 후보를 identity, lifecycle, equality, mutability, invariant 관점으로 비교하고 선택 근거를 제시하라.
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

## P3. Aggregate Boundary under Consistency Pressure

- **Placement:** T05
- **Timebox:** 25분
- **Course Ownership:** Aggregate / Domain Invariant
- **Decision Practiced:** 어떤 규칙이 즉시 함께 지켜져야 하며 aggregate 경계를 어디에 둘 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 주문-결제-재고 후보 경계를 비교하고 aggregate와 consistency scope를 결정한다.

### Initial Instruction
주문-결제-재고 후보 경계를 비교하고 aggregate와 consistency scope를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
동시 주문 증가와 외부 결제 실패를 추가해 큰 aggregate 비용을 드러낸다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
즉시 일관성이 필요한 invariant와 나중에 맞춰도 되는 규칙을 분리하고 최소 aggregate 경계를 제안하라.
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

## P4. Bounded Context & Model Evolution

- **Placement:** T07/T08
- **Timebox:** 20분
- **Course Ownership:** Strategic DDD
- **Decision Practiced:** 의미 충돌을 어떤 context 경계로 보호하고 통합 관계를 어떻게 둘 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 주문·결제·배송 업무에서 용어 충돌과 복잡한 규칙이 발생해 도메인 모델과 경계를 정리해야 하는 제품 개발 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 판매·배송·정산의 모델 충돌을 분석해 BC 후보와 context relationship을 만든다.

### Initial Instruction
판매·배송·정산의 모델 충돌을 분석해 BC 후보와 context relationship을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
조직도와 현재 서비스 경계가 domain boundary와 다르다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
조직/서비스 구조를 복사하지 말고 언어·모델의 의미 일관성 기준으로 BC 후보와 관계를 비교하라.
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
