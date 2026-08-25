# SW Proposal — Practice Design (LLM-Integrated Practice)

> **Course ID:** sw-proposal
> **Standard:** `portfolio/practice-standard.md` (12. LLM-Integrated Practice Design Standard v1.1)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1을 축약 없이 전문 흡수했다. 원출처는 Git history에 보존된다.
> **Asset Class:** Instructor-only Course Asset (Practice Pack 전체는 실습 전 학습자에게 배포하지 않는다 — `portfolio/practice-standard.md` §2)
> **Practice Count:** 4 (Portfolio Cadence Rule: 8h 과정 → 3–4개, 본 과정은 4개)
> **Cadence:** 1일 4개, 약 2시간 간격
> **Total Practice Time:** 약 90분 (20 + 25 + 25 + 20), 기존 instructional time(400분) 안에 포함 — 추가 운영시간 아님
> **Operating Flow:** Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt

## Operating Rules (Pack 원문)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.

## Common Work Context (모든 Practice 공통)

기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황.

## Common Preconditions (모든 Practice 공통)

해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.

## Common Inputs (모든 Practice 공통)

공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence.

## Common Trade-off / Failure Condition / Transfer (Pack 원문 — 4개 Practice 공통)

- **Trade-off:** 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다.
- **Failure Condition:** LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때.
- **Transfer:** 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다.

## Common Evidence of Learning (Pack 원문 — 4개 Practice 공통)

- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

## Common Prompt Design Intent (Pack 원문 — 4개 Practice 공통)

Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다.

---

## Practice Overview Table

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T02/T03 | Bid / No-Bid with Customer Decision Map | 20분 | 기회를 추구할지와 실제 구매 의사결정자는 누구인지 어떻게 판단할 것인가 |
| P2 | T04/T05 | RFP Insight → Win Strategy | 25분 | compliance 요구를 넘어 고객의 buying criteria와 win theme을 어떻게 도출할 것인가 |
| P3 | T06/T08 | Credible Solution / Delivery / Risk Promise | 25분 | 무엇을 약속하고 무엇을 assumption/constraint로 남길 것인가 |
| P4 | T09/T12/T14 | Claim–Evidence Storyline & Review | 20분 | 어떤 주장에 어떤 evidence가 필요하고 무엇을 삭제해야 설득력이 높아지는가 |

---

## P1. Bid / No-Bid with Customer Decision Map

| Field | Content |
|---|---|
| **Practice ID / Title** | P1. Bid / No-Bid with Customer Decision Map |
| **Placement** | T02 (Bid/No-Bid) / T03 (Customer/Stakeholder/Decision Analysis) |
| **Course Ownership** | Opportunity / Stakeholder — OWNER (Opportunity Qualification / Bid–No-Bid, Customer Decision) |
| **Decision Practiced** | 기회를 추구할지와 실제 구매 의사결정자는 누구인지 어떻게 판단할 것인가 |
| **Work Context** | 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황 |
| **Preconditions** | 해당 Placement(T02/T03)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우 — P1은 최초 Practice이므로 해당 없음), 강사가 제공한 제약·Evidence |
| **Deliverable** | qualification과 decision map을 만들고 bid/no-bid를 결정한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | qualification과 decision map을 만들고 bid/no-bid를 결정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. (Recommended Prompt는 제공하지 않는다.) |
| **Intervention** (5–10분 후 공개) | 관계는 좋지만 경쟁우위 evidence가 약하다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PROP-01, PROP-02, PROP-03)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | Debrief에서만 공개 — 아래 별도 블록 참조 |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Recommended Prompt (Debrief에서만 공개):**

```text
매출 규모만 보지 말고 fit, win probability, access, differentiation, delivery risk, opportunity cost로 판단하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

---

## P2. RFP Insight → Win Strategy

| Field | Content |
|---|---|
| **Practice ID / Title** | P2. RFP Insight → Win Strategy |
| **Placement** | T04 (RFP/요구사항 분석) / T05 (Win Strategy와 Competitive Positioning) |
| **Course Ownership** | Win Strategy — OWNER (Win Strategy / Competitive Positioning, RFP/requirement interpretation) |
| **Decision Practiced** | compliance 요구를 넘어 고객의 buying criteria와 win theme을 어떻게 도출할 것인가 |
| **Work Context** | 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황 |
| **Preconditions** | 해당 Placement(T04/T05)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice(P1) 산출물, 강사가 제공한 제약·Evidence |
| **Deliverable** | RFP를 분류하고 2~3개 win theme과 경쟁 positioning을 만든다. |
| **Timebox** | 25분 |
| **Initial Instruction** | RFP를 분류하고 2~3개 win theme과 경쟁 positioning을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. (Recommended Prompt는 제공하지 않는다.) |
| **Intervention** (5–10분 후 공개) | 명시 요구와 실제 평가자의 우려가 다르다는 evidence를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PROP-04)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | Debrief에서만 공개 — 아래 별도 블록 참조 |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Recommended Prompt (Debrief에서만 공개):**

```text
요구 충족표와 별도로 decision driver, competitor alternative, discriminating evidence를 연결한 win themes를 제안하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

---

## P3. Credible Solution / Delivery / Risk Promise

| Field | Content |
|---|---|
| **Practice ID / Title** | P3. Credible Solution / Delivery / Risk Promise |
| **Placement** | T06 (Solution Strategy) / T08 (Commercial·Risk·Assumption) |
| **Course Ownership** | Offer Credibility — OWNER (Proposal-level Solution + Delivery + Commercial alignment), APPLY-boundary respected(architecture design 자체는 SW Architecture owns, 상세 project planning은 PM owns) |
| **Decision Practiced** | 무엇을 약속하고 무엇을 assumption/constraint로 남길 것인가 |
| **Work Context** | 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황 |
| **Preconditions** | 해당 Placement(T06/T08)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice(P2) 산출물, 강사가 제공한 제약·Evidence |
| **Deliverable** | solution/delivery/commercial risk를 통합해 credible offer를 만든다. |
| **Timebox** | 25분 |
| **Initial Instruction** | solution/delivery/commercial risk를 통합해 credible offer를 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. (Recommended Prompt는 제공하지 않는다.) |
| **Intervention** (5–10분 후 공개) | 고객 일정은 공격적이고 핵심 dependency는 고객 제공이라는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PROP-05)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | Debrief에서만 공개 — 아래 별도 블록 참조 |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Recommended Prompt (Debrief에서만 공개):**

```text
과도한 약속을 피하고 solution value, delivery feasibility, assumption, dependency, risk response를 하나의 약속 구조로 연결하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

---

## P4. Claim–Evidence Storyline & Review

| Field | Content |
|---|---|
| **Practice ID / Title** | P4. Claim–Evidence Storyline & Review |
| **Placement** | T09 (Evidence Strategy) / T12 (Proposal Review) / T14 (Integrated Proposal Case) |
| **Course Ownership** | Evidence / Review — OWNER (Claim–Evidence strategy, Proposal Storyline / Review) |
| **Decision Practiced** | 어떤 주장에 어떤 evidence가 필요하고 무엇을 삭제해야 설득력이 높아지는가 |
| **Work Context** | 기업 SW 사업 RFP에 대응하면서 Bid/No-Bid, 고객 의사결정, Win Strategy, 솔루션·위험·Evidence를 통합해야 하는 제안 상황 |
| **Preconditions** | 해당 Placement(T09/T12/T14)까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice(P3) 산출물, 강사가 제공한 제약·Evidence |
| **Deliverable** | executive storyline을 만들고 weak claim을 review해 수정/삭제한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | executive storyline을 만들고 weak claim을 review해 수정/삭제한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. (Recommended Prompt는 제공하지 않는다.) |
| **Intervention** (5–10분 후 공개) | 좋은 사례가 있으나 현재 고객 context와 직접 일치하지 않는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle(PROP-05)에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | Debrief에서만 공개 — 아래 별도 블록 참조 |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

**Recommended Prompt (Debrief에서만 공개):**

```text
각 핵심 claim에 decision relevance와 evidence strength를 매핑하고 근거 약한 주장은 완화·삭제·추가검증으로 처리하라.
입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.
최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.
```

---

## Course Practice Quality Gate (Pack 원문)

- 4개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?

## Course-level LLM-integrated Practice Gate (baseline 원문)

- Course duration에 맞는 Practice 수와 cadence를 충족하는가? (8h → 3–4개 요구, 본 과정 4개 → 충족)
- 모든 Practice가 기존 instructional time 안에 포함되는가? (약 90분, 400분 instructional time 내)
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가? (LLM 사용 여부와 무관하게 Concept OWNER는 SW Proposal에 남는다 — `portfolio/practice-standard.md` §9)
