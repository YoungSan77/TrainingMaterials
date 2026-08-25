# AI-Native — LLM-Integrated Practice Pack v1.1

> **Asset Class:** Instructor-only Course Asset
> **Course:** `courses/05_ai-native.md`
> **Standard:** `support/01_governance/12_llm-integrated-practice-standard.md`
> **Practice Count:** 8
> **Cadence:** Day 1 4개 / Day 2 4개
> **Practice Time:** 약 180분, 기존 instructional time에 포함
> **Authority:** 과정 Baseline과 공통 Governance에 종속; 충돌 시 상위 Canon 우선

## Operating Rules

- 실습 시작 시 Recommended Prompt를 제공하지 않는다.
- 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다.
- 시작 후 5–10분에 Instructor Intervention을 제공한다.
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다.
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다.
- Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다.

## Execution-form Decision Matrix — Course Baseline Alignment

| Form | Use When | Do Not Escalate When |
|---|---|---|
| Chat / Conversational AI | 사람이 대화를 직접 통제하는 짧은 탐색·분석·질의 | 반복 workflow, repository 변경, 지속 state가 필요하지 않을 때 |
| Code-oriented AI | codebase/file 변경, test, refactoring, repository 탐색이 중심 | 업무 핵심이 문서/비코드 지식작업일 때 |
| Work / Cowork | 여러 문서·파일·업무 자산을 지속적으로 함께 다룸 | 한두 번의 짧은 질의로 충분할 때 |
| Workflow | 단계·handoff·gate가 명확하고 반복 가능 | 목표 자체가 열려 있고 단계가 매번 달라질 때 |
| Agent | goal 기반 자율 실행이 가치 있고 tool/state/failure 처리가 필요 | deterministic workflow로 충분하거나 risk/verification cost가 너무 클 때 |
| App / Product | 반복 사용자, 안정 UX, 정책, 운영, evaluation이 필요 | 개인/팀 내부의 일회성 작업일 때 |

**Rule:** 이들은 성숙도 단계가 아니다. 요구를 만족하는 가장 단순한 실행형태를 선택하고, 복잡한 형태로의 승격은 추가 가치가 통제·운영 비용을 초과할 때만 한다.

## P1. Choose the Simplest Execution Form

- **Placement:** T02
- **Timebox:** 20분
- **Course Ownership:** Execution-form Selection
- **Decision Practiced:** Chat/Code/Work/Workflow/Agent/App 중 무엇이 가장 단순하고 적합한가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 6개 업무 사례에 실행형태를 선택하고 과잉 자동화를 거절한다.

### Initial Instruction
6개 업무 사례에 실행형태를 선택하고 과잉 자동화를 거절한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
반복성·risk·repository access·multi-file context 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
각 업무를 통제성, 반복성, tool need, state, risk, UX 기준으로 비교하고 가장 단순한 실행형태를 선택하라.
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

## P2. Specification before Delegation

- **Placement:** T03
- **Timebox:** 25분
- **Course Ownership:** Specification Engineering
- **Decision Practiced:** AI에 위임하기 전에 어떤 intent/input/constraint/acceptance를 명시할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 모호한 작업 요청을 검증 가능한 delegation spec으로 바꾼다.

### Initial Instruction
모호한 작업 요청을 검증 가능한 delegation spec으로 바꾼다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
되돌리기 어려운 변경과 금지 범위를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
목표, 입력, 제약, 금지, 완료조건, 검증 evidence를 포함하되 구현 방법은 필요한 만큼만 제한하라.
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

## P3. Context, not Prompt Tuning

- **Placement:** T04/T05
- **Timebox:** 25분
- **Course Ownership:** Context Engineering
- **Decision Practiced:** 문구가 아니라 어떤 context 자산이 필요한가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 요구/도메인/ADR/test 중 필요한 context를 선택한다.

### Initial Instruction
요구/도메인/ADR/test 중 필요한 context를 선택한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
서로 충돌하는 문서 버전과 stale context를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
Task/Knowledge/Tool/State/Policy 관점으로 필요한 context와 제외할 context를 구분하고 source-of-truth 충돌을 표시하라.
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

## P4. Guardrail before Autonomy

- **Placement:** T06
- **Timebox:** 20분
- **Course Ownership:** Guardrail
- **Decision Practiced:** 허용·금지·승인·검증 경계를 어디에 둘 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** AI 코드 변경 작업의 권한과 deterministic gate를 설계한다.

### Initial Instruction
AI 코드 변경 작업의 권한과 deterministic gate를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
production credential 접근 요구를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
허용 범위, 금지 범위, approval point, deterministic checks, rollback 조건을 risk와 reversibility에 맞춰 설계하라.
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

## P5. Harness / Workflow Contract

- **Placement:** T07/T10
- **Timebox:** 25분
- **Course Ownership:** Harness / Workflow
- **Decision Practiced:** LLM call을 재현 가능한 실행 구조로 어떻게 감쌀 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 단계별 input/output/gate/failure path를 설계한다.

### Initial Instruction
단계별 input/output/gate/failure path를 설계한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
한 단계 실패 후 재시도와 partial result 복구 요구를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
stage contract, tool, state, retry, gate, logging을 포함한 최소 workflow/harness를 설계하고 불필요한 agent화를 피하라.
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

## P6. Agent or Workflow? Autonomy & HITL

- **Placement:** T09/T11
- **Timebox:** 20분
- **Course Ownership:** Agent / HITL
- **Decision Practiced:** 자율성의 이득이 risk allocation을 정당화하는가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** 동일 업무를 workflow와 agent로 비교하고 HITL 위치를 정한다.

### Initial Instruction
동일 업무를 workflow와 agent로 비교하고 HITL 위치를 정한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
낮은 가역성과 높은 검증비용을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
risk × reversibility × observability × verification cost로 autonomy를 결정하고 human approval을 어디에 둘지 설명하라.
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

## P7. Evaluation & Observability

- **Placement:** T13/T14
- **Timebox:** 25분
- **Course Ownership:** AI Evaluation
- **Decision Practiced:** 확률적 결과를 어떤 evidence로 평가·운영할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** deterministic/probabilistic evaluation set과 runtime signals를 정의한다.

### Initial Instruction
deterministic/probabilistic evaluation set과 runtime signals를 정의한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
quality drift와 비용 증가 조건을 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
자동 판정 가능한 것은 deterministic check로 우선하고 의미 판단용 eval과 운영 metric을 분리하라.
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

## P8. Integrated Execution-form Redesign

- **Placement:** T15/T16
- **Timebox:** 20분
- **Course Ownership:** Integrated AI-Native Decision
- **Decision Practiced:** capability 변화 후 실행형태와 control을 어떻게 재선택할 것인가
- **Preconditions:** 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다.
- **Work Context:** 조직이 코딩·문서·반복 업무·의사결정 지원을 AI에 위임하려 하며 실행형태와 통제 수준을 선택해야 하는 도입 상황
- **Inputs:** 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence
- **Deliverable:** Chat→Workflow/Agent/App 전환 후보를 재평가하고 필요 없는 승격을 거절한다.

### Initial Instruction
Chat→Workflow/Agent/App 전환 후보를 재평가하고 필요 없는 승격을 거절한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다.

### Intervention
사용자 수 증가와 tool permission 확대를 추가한다.

### Evidence of Learning
- 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다.
- Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다.
- 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다.

### Recommended Prompt
```text
maturity ladder를 가정하지 말고 현재 요구를 만족하는 가장 단순한 execution form과 필요한 control redesign을 선택하라.
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

- 8개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
