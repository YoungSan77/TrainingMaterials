# 12. LLM-Integrated Practice Design Standard v1.1

> **Status:** Portfolio Canon — applies to all 11 current courses.
> **Purpose:** LLM을 별도 도구 과목으로 추가하지 않고, 각 과정이 소유하는 전문적 판단을 실제 업무형 문제에서 연습하도록 통합한다.
> **Priority:** Course Thesis / Ownership / Decision Quality가 Prompt 기법보다 우선한다.

## 1. Core Principle

LLM-integrated Practice의 목적은 **Prompt Engineering 숙련**이 아니다.

학습자는 다음 순환을 경험해야 한다.

```text
Professional Problem
→ Learner Judgment
→ Learner-written Prompt / Context
→ LLM Output
→ Critique / Evidence Check
→ Instructor Intervention
→ Keep Going
→ Revised Decision / Artifact
→ Recommended Prompt Reveal
→ Compare / Adapt / Reject
```

LLM은 판단을 대신하는 정답 생성기가 아니라 **분석·대안 생성·검토·반증을 가속하는 작업 파트너**로 사용한다.

## 2. Distribution / Reveal Rule

- Practice Pack은 **Instructor asset**이다. Recommended Prompt와 Intervention을 포함한 전체 Pack을 실습 전에 학습자에게 배포하지 않는다.
- 학습자용 자료에는 `Problem / Deliverable / Inputs / Timebox`까지만 제공한다.
- Intervention은 첫 실행 후 5–10분 시점에 공개하고, Recommended Prompt는 Debrief 단계에서만 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.

## 3. Portfolio Quantity / Cadence Rule

| Course Duration | Required LLM Practices | Operating Guidance |
|---|---:|---|
| 8h | 3–4 | 약 2시간마다 1개, 1일 3–4개 |
| 16h | 6–8 | 약 2시간마다 1개, 1일 3–4개 |

- 각 Practice는 **15–30분**, 기본값은 **20–25분**이다.
- Practice 시간은 기존 instructional time 안에 포함한다. 추가 운영시간으로 붙이지 않는다.
- 8h 과정은 총 운영시간 480분, 16h 과정은 960분을 넘지 않는다.
- Topic은 50분 고정 단위가 아니다. Practice 위치 때문에 Topic을 기계적으로 50분에 맞추지 않는다.
- 시간이 부족하면 Practice를 삭제하기보다 상세 설명·추가 사례·도구 소개를 `Optional / Reference / Appendix`로 이동한다.

## 4. What Makes a Valid Practice

모든 Practice는 다음 5개를 만족해야 한다.

1. **Real Work Reuse** — 실제 업무에 다시 사용할 수 있는 문제를 다룬다.
2. **Decision or Artifact** — 최종 결과가 판단 또는 재사용 가능한 산출물로 남는다.
3. **Course-owned Judgment** — 해당 과정의 OWNER 판단을 중심으로 한다.
4. **Critique Required** — LLM 출력의 채택/수정/폐기 이유를 학습자가 설명한다.
5. **Evidence Visible** — 최초안과 개선안 사이에 무엇이 달라졌는지 확인할 수 있다.

단순 요약, 용어 퀴즈, 문장 다듬기, “좋은 Prompt 만들기”만을 목적으로 한 활동은 Core Practice로 계산하지 않는다.

## 5. Standard Practice Flow

### Phase A — Problem & Deliverable (2–3분)
강사는 다음만 제공한다.
- 업무 상황 / 문제
- 필요한 최종 판단 또는 산출물
- 최소 입력자료
- 시간 제한

**Recommended Prompt는 제공하지 않는다.**

### Phase B — Learner Prompt & First Run (5–10분)
학습자가 직접:
- 필요한 Context를 선택하고,
- Prompt를 작성하며,
- LLM과 첫 결과를 만든다.

강사는 Prompt 문구를 즉시 교정하지 않는다.

### Phase C — Instructor Intervention (2–5분)
첫 결과가 나온 뒤 강사는 추가 관점 중 일부를 공개한다.

Intervention 후보:
- 누락된 stakeholder / scenario
- 제약조건
- trade-off
- failure condition
- boundary / ownership
- evidence / acceptance criterion
- counterexample
- change impact
- cost / reversibility / risk

Intervention은 정답을 주는 것이 아니라 **판단 공간을 확장하거나 검증 기준을 강화**해야 한다.

### Phase D — Keep Going / Revision (5–10분)
학습자는 새 채팅으로 리셋하지 않는 것을 기본으로 하고 현재 작업을 이어간다.
- Prompt / Context를 보완
- LLM에 반론·검증·대안 요청
- 결과를 수정
- 최종 선택과 폐기 항목 명시

필요하면 새 세션을 사용해 “Context를 잃었을 때 결과가 어떻게 달라지는가”를 비교할 수 있으나, 이는 학습목표가 있을 때만 사용한다.

### Phase E — Recommended Prompt Reveal & Debrief (3–5분)
마지막에 강사가 Recommended Prompt를 공개하고 다음을 설명한다.
- 왜 이런 Context와 제약을 넣었는가
- 무엇을 의도적으로 넣지 않았는가
- 어떤 검증 질문을 사용했는가
- 어떤 Course Principle을 반영했는가

반드시 명시한다.

> **Recommended Prompt는 정답이 아니다.** 문제 구조와 판단 기준을 드러내기 위한 하나의 설계 예시다. 학습자는 자신의 Context에 맞게 유지·삭제·수정한다.

## 6. Required Practice Specification

각 Practice 정의에는 최소 다음 필드를 포함한다.

| Field | Required Content |
|---|---|
| Practice ID / Title | 과정 내 식별자와 업무형 제목 |
| Course Ownership | OWNER / RECAP / APPLY / FORWARD 경계 |
| Decision Practiced | 학습자가 실제로 내려야 할 판단 |
| Work Context | 현실적 업무 상황 |
| Preconditions | 실습이 유효하기 위한 사전 지식·입력·권한·도구 조건 |
| Inputs | 제공 자료 / 기존 산출물 |
| Deliverable | 재사용 가능한 결과물 |
| Timebox | 15–30분 |
| Initial Instruction | Prompt 없이 주는 문제 설명 |
| Intervention | 5–10분 후 추가할 관점/제약/검증조건 |
| Evidence of Learning | 최초안→개선안에서 관찰할 변화 |
| Recommended Prompt | 종료 시 공개할 예시 Prompt |
| Prompt Design Intent | Prompt 구조가 Course Judgment를 어떻게 지원하는지 |
| Trade-off | 선택으로 얻고 잃는 것 |
| Failure Condition | 이 접근을 쓰면 안 되거나 실패하는 상황 |
| Transfer | 실제 업무에서 재사용하는 방법 |

## 7. Prompt Design Rule

Recommended Prompt는 “멋진 Prompt 문구”가 아니라 **전문 판단을 외부화한 작업 명세**여야 한다.

권장 구조:

```text
Goal / Decision
Context / Inputs
Constraints / Boundaries
Required Analysis
Trade-offs / Alternatives
Verification / Evidence
Output Form
```

모든 요소를 매번 넣을 필요는 없다. 필요한 것만 사용한다.

금지:
- 역할극 문구만 길게 쓰기
- “최고의 전문가처럼” 같은 품질 대체 표현
- 근거 없는 certainty 요구
- 출력 format을 과도하게 고정해 사고를 제한
- Course-specific 판단을 LLM의 권위에 위임

## 8. Evidence Standard

Practice의 학습 Evidence는 Prompt 길이나 문장 품질이 아니다.

최소 하나 이상을 확인한다.
- 누락된 조건을 찾아 Context에 추가했다.
- LLM 제안을 근거로 채택/거절했다.
- 대안과 Trade-off를 비교했다.
- Boundary/Ownership 오류를 수정했다.
- 검증조건 또는 acceptance criterion을 추가했다.
- 과도한 산출물을 제거했다.
- 최초 설계보다 change impact / risk / clarity가 개선되었다.

권장 제출 형태:

```text
Initial Prompt / Request
→ Initial Output excerpt or summary
→ Intervention received
→ Revised Prompt / Follow-up
→ Final Decision / Artifact
→ Keep / Delete / Modify rationale
```

전체 대화 로그 제출을 기본 요구하지 않는다. 판단 Evidence만 남긴다.

## 9. Course Ownership Rule

LLM을 사용한다는 이유로 Concept OWNER가 AI-Native로 이동하지 않는다.

- OOAD Practice에서 Responsibility를 판단하면 **OOAD OWNER**다.
- DDD Practice에서 Aggregate boundary를 판단하면 **DDD OWNER**다.
- SW Architecture Practice에서 quality-driven structure를 판단하면 **SWA OWNER**다.
- AI-Native는 Context / Guardrail / Harness / Agent mechanics와 실행형태 선택을 소유한다.

다른 과정에서 AI-Native 개념이 필요할 경우 최소 RECAP/APPLY만 사용한다.

## 10. AI-Native Execution-Form Selection Rule

AI-Native 과정의 Practice는 문제에 맞는 가장 단순한 실행형태를 선택하도록 해야 한다.

| Execution Form | 선택 기준 |
|---|---|
| Chat / Conversational AI | 짧은 탐색·질의·비정형 사고 보조, 사람이 대화를 직접 통제 |
| Code-oriented AI | 코드베이스/파일 변경, 테스트, 리팩터링 등 코드·repository 중심 작업 |
| Work / Cowork | 여러 문서·파일·업무 자산을 함께 다루는 지속적 지식작업 |
| Workflow | 단계가 명확하고 반복 가능하며 handoff/gate가 필요한 작업 |
| Agent | 목표를 주고 도구·상태·실패처리 안에서 자율 실행할 가치가 있는 작업 |
| App / Product | 반복 사용자와 안정된 UX, 정책, 운영, 평가가 필요한 제품화된 기능 |

이들은 **성숙도 단계가 아니다**.

선택 규칙:
> 필요한 통제·반복성·자율성·통합 수준을 만족하는 **가장 단순한 실행형태**를 선택한다.

고도화 자체가 목적이 아니며, Chat으로 충분한 문제에 Agent를 도입하지 않는다.

## 11. Time-pressure Rule

시간 부족 시 다음 순서로 보호한다.

```text
1. Core Decision Practice
2. Core Principle / Distinction
3. Debrief / Transfer
4. Essential Example
5. Additional Example
6. Detailed Framework / Tool Explanation
7. Reference / Appendix
```

Practice를 살리기 위해 강의 내용을 무조건 삭제하지 않는다. 핵심 Narrative는 유지하고, 강의 중 생략 가능한 상세도를 별도 계층으로 이동한다.

## 12. Instructor Intervention Design

좋은 Intervention은 최초 LLM 출력이 흔히 놓치는 지점을 겨냥한다.

예:
- “정상 흐름만 보았다. 취소/부분 실패를 포함하라.”
- “이 책임은 정보를 가진 객체와 변경을 숨길 객체가 다르다. 두 후보를 비교하라.”
- “성능만 최적화하면 운영 복잡도가 증가한다. 비용까지 비교하라.”
- “이 결정의 자동 검증 Evidence를 정의하라.”

나쁜 Intervention:
- 정답 Diagram 제공
- Recommended Prompt 조기 공개
- 특정 Tool 기능 사용 강제
- 단순히 “더 자세히” 요청

## 13. Practice Quality Gate

각 Practice 승인 전 모두 YES여야 한다.

- 실제 업무에서 재사용할 수 있는가?
- Course OWNER 판단이 중심인가?
- 15–30분 안에 완결 가능한가?
- Recommended Prompt 없이 시작하는가?
- 5–10분 후 의미 있는 Intervention이 있는가?
- Keep Going으로 결과를 개선하는가?
- Recommended Prompt가 마지막에만 공개되는가?
- Recommended Prompt가 정답이 아님을 명시하는가?
- 결과 채택/거절 근거가 Evidence로 남는가?
- Prompt Engineering 자체가 평가대상이 아닌가?
- 전체 과정 운영시간 한도를 넘기지 않는가?
- 상세 강의내용을 불필요하게 축약하지 않았는가?

## 14. Course-level Audit Gate

각 과정 개편 완료 시 확인한다.

1. 8h는 3–4개, 16h는 6–8개 Practice가 있는가?
2. 하루 3–4개, 대략 2시간 간격인가?
3. Practice가 Course Narrative 전반에 분산되어 있는가?
4. 한 개의 거대한 “AI 실습”으로 몰아넣지 않았는가?
5. 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
6. 기존 학습 Evidence와 LLM Practice Evidence가 연결되는가?
7. Optional/Reference/Appendix 이동이 Core 이해를 훼손하지 않는가?
8. AI-Native는 execution form을 maturity ladder로 가르치지 않는가?

## 15. Portfolio Rollout Rule

적용 순서는 다음과 같다.

```text
Common Standard Freeze
→ OOAD
→ DDD
→ SW Architecture
→ MSA
→ AI-Native
→ Modern SWQM
→ Agile
→ DevOps
→ SW Project Management
→ SW Proposal
→ DT→AX
→ 11-course Alignment Audit
→ New Unified Portfolio ZIP
```

각 과정은 개별 Quality Gate를 통과한 뒤 다음 과정으로 진행한다.
