# SW Proposal — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/10_sw-proposal.md`
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

## P1. Bid / No-Bid with Customer Decision Map

- **Placement:** T02/T03
- **Timebox:** 20분
- **Course Ownership:** Opportunity / Stakeholder
- **Decision Practiced:** 기회를 추구할지와 실제 구매 의사결정자는 누구인지 어떻게 판단할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** qualification과 decision map을 만들고 bid/no-bid를 결정한다.

### Initial Instruction
qualification과 decision map을 만들고 bid/no-bid를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
관계는 좋지만 경쟁우위 evidence가 약하다는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
매출 규모만 보지 말고 fit, win probability, access, differentiation, delivery risk, opportunity cost로 판단하라.
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

## P2. RFP Insight → Win Strategy

- **Placement:** T04/T05
- **Timebox:** 25분
- **Course Ownership:** Win Strategy
- **Decision Practiced:** compliance 요구를 넘어 고객의 buying criteria와 win theme을 어떻게 도출할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** RFP를 분류하고 2~3개 win theme과 경쟁 positioning을 만든다.

### Initial Instruction
RFP를 분류하고 2~3개 win theme과 경쟁 positioning을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
명시 요구와 실제 평가자의 우려가 다르다는 evidence를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
요구 충족표와 별도로 decision driver, competitor alternative, discriminating evidence를 연결한 win themes를 제안하라.
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

## P3. Credible Solution / Delivery / Risk Promise

- **Placement:** T06/T08
- **Timebox:** 25분
- **Course Ownership:** Offer Credibility
- **Decision Practiced:** 무엇을 약속하고 무엇을 assumption/constraint로 남길 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** solution/delivery/commercial risk를 통합해 credible offer를 만든다.

### Initial Instruction
solution/delivery/commercial risk를 통합해 credible offer를 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
고객 일정은 공격적이고 핵심 dependency는 고객 제공이라는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
과도한 약속을 피하고 solution value, delivery feasibility, assumption, dependency, risk response를 하나의 약속 구조로 연결하라.
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

## P4. Claim–Evidence Storyline & Review

- **Placement:** T09/T12/T14
- **Timebox:** 20분
- **Course Ownership:** Evidence / Review
- **Decision Practiced:** 어떤 주장에 어떤 evidence가 필요하고 무엇을 삭제해야 설득력이 높아지는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** executive storyline을 만들고 weak claim을 review해 수정/삭제한다.

### Initial Instruction
executive storyline을 만들고 weak claim을 review해 수정/삭제한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
좋은 사례가 있으나 현재 고객 context와 직접 일치하지 않는 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
각 핵심 claim에 decision relevance와 evidence strength를 매핑하고 근거 약한 주장은 완화·삭제·추가검증으로 처리하라.
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
