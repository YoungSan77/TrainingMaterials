# OOAD S01–S06 승인 항목 최소 수정 보고서

- **평가 기준선:** [ooad-s01-s06-integration-review-v1.md](ooad-s01-s06-integration-review-v1.md)
- **적용 범위:** Human이 승인한 6개 항목만. 그 외 발견된 문제는 source를 수정하지 않고 `Residual Issues`에만 기록했다.
- **원칙:** 기존 철학·Session Boundary·승인 내용 보존, 최소 수정, 구조 전면개편 금지.

---

# Applied Findings

## 승인 1 — Running Example 정합성

- **변경 파일:** `ooad-s02-detailed-design-revised-v8.md`, `ooad-s03-detailed-design-revised-v4.md`, `ooad-s04-detailed-design-approved-v3.md`, `ooad-s05-detailed-design-approved-v2.md`
- **변경 section:**
  - S02: 고객요구≠요구사항 예시(§1), Event-centered normalize 예시, External/Business Event 예시, Event–Response List 표, Domain Event 연결 예시, SSD/System Event/Operation Contract 예시, Acceptance Criteria/BDD 예시
  - S03: Opening Operation Contract 예시, 용어집 후보 예시, Brooks Essence/Accident 예시, Domain 정의 예시, §14 S02→S03 Concept 발견 예시, §15 Order 사례, §16 Noun Extraction 예시, §17 Concept 식별 질문 예시, §19 Attribute 예시, §22·§24·§25·§26 Relationship/Multiplicity 예시, §29 통합 Domain Model 다이어그램(Refund/Shipment 블록 제거), §31 Analysis Concept≠Software Class 예시, §32 Operation/Method 예시, §34 Just-enough 예시
  - S04: Opening 기능 목록·Event 흐름, §4 normalize 4예, §5 UI 예시, §7 Event Source 예시, §8 용어집/동의어 예시, §9 Scenario, §11 Analysis Slice 예시, §16 Analysis Sequence 예시, §17 SSD 예시, §18 Sequence Participant 목록, §20 Communication Diagram 예시, §21 Activity Diagram 예시, §25·§26 State/Transition/Guard 예시, §29~§34 Static/Dynamic Cross-check·Feedback 예시들, §34(Essence/Accident) Dynamic Complexity 목록
  - S05: §4 Opening Concept/질문 목록, §6 S03/S04 recap 목록, §8 Service 목록, §9 Tell-Don't-Ask 예시, §11 상태/권한 목록, §13 무엇을 숨겨야 하는가 예시, §14 Change Reason 예시, §15·§16·§18·§19·§20 각 예시, §26(구 §30) Application Flow 예시, §27(구 §31~34 병합) Candidate 예시
- **변경 이유:** 공식 baseline인 Place Order→Payment 대신 Order Cancellation/Refund가 4개 세션 본문의 지배적 worked example로 남아 있었다(평가 보고서 F1). S07 전용 변화 요구를 선행 소비하는 문제였다.
- **최소 수정 내용:** 각 worked example의 도메인 대상만 Cancellation/Refund→Order/OrderItem/Product/Payment로 치환했다. 설명 구조·논증 흐름·형식(코드블록 모양, 질문 개수, 대비 구조)은 그대로 유지했다. S07 예고 목적의 문맥(예: S02 §10 별첨 해설 "Order Cancellation과 Refund는 후반 variation/change request에서 사용한다", S03 §36 실습 제외 안내, S06 §19 "S07로 넘기는 질문")은 원문 그대로 보존했다. S04의 "현재 질문이 취소 가능성이라면…" 문단은 명시적 가정형 예고 문맥이라 보존했다.

## 승인 2 — S02 과밀 축소(핵심 근거 보존)

- **변경 파일:** `ooad-s02-detailed-design-revised-v8.md`
- **변경 section:** `개발자도 모른다 — John von Neumann`(불릿 축약), `ISO/IEC/IEEE 29148`(9개 항목 목록→요약 문장), `ISO/IEC 25010:2023`(9개 항목 목록→요약 문장), `요구사항 수집·발견`(Interview/Observation/Workshop 중복 불릿 제거, 바로 아래 표로 대체), 신설 `공통 결론 — 빨리 많이 확정하는 것이 목적이 아니다`, 권장 슬라이드 구성표
- **변경 이유:** 90분 세션에 9개에 가까운 독립 Anchor·프레임워크가 밀집돼 있었다(평가 보고서 F2). 단 Boehm/Standish/Bezos/von Neumann/Lean 핵심 메시지는 삭제하지 않고 보존해야 한다는 것이 승인 조건이었다.
- **최소 수정 내용:** von Neumann의 6개 불릿을 1문장으로 축약하되 인용문·"모르는 것을 자세히 쓰는 것은 분석이 아니다" 메시지는 그대로 두었다. ISO 29148/25010은 9개 항목 나열을 각각 대표 5개 인라인 요약 문장으로 축약했다(핵심 결론 문장은 그대로 보존). Interview/Observation/Workshop을 설명하는 중복 불릿 목록을 제거하고 바로 이어지는 비교 표(더 상세한 정보 포함)만 남겼다. `Boehm/Standish/Bezos/von Neumann/Lean`의 기존 메시지를 한 곳에 모으는 "공통 결론" 절을 새로 추가해 승인 지침의 "가능하면 하나의 통합 slide" 요청을 반영했다 — 기존 개별 section은 그대로 두고 요약만 추가했으므로 구조 전면개편은 아니다. `Business Requirement → Stakeholder/User Requirement → System/Software Requirement` 구분은 그대로 보존했다.

## 승인 3 — Use Case 용어 통일

- **변경 파일:** `ooad-s02-detailed-design-revised-v8.md`
- **변경 section:** Use Case Specification 필드 목록, `Main Success Flow + 좋은 Flow 작성법`(제목·본문), `Alternative Flow / Exception Flow`, `Flow와 Scenario`, 권장 슬라이드 구성표
- **변경 이유:** 문서 본문(§`Flow와 Scenario`)이 "이 과정에서는 `Main Success Scenario` 대신 `Main Success Flow`를 사용한다"고 선언했지만, 정작 실습 슬라이드는 이미 `Main Success Scenario`를 쓰고 있어 같은 문서 안에서 용어가 충돌했다(평가 보고서 F4). 이번 승인에서는 반대로 `Main Success Scenario`를 공식 용어로 확정했다.
- **최소 수정 내용:** 필드 목록·section 제목·본문의 `Main Success Flow`를 모두 `Main Success Scenario`로 교체했다. `Flow와 Scenario`의 개념 구분(Flow=정의된 경로, Scenario=한 번의 구체적 실행)은 그대로 두고, 결론 문장만 "Use Case Specification의 주 경로를 가리키는 고유 명칭으로 Main Success Scenario를 사용한다"로 뒤집었다. `Alternative Flow`/`Exception Flow`라는 용어는 승인 범위 밖이므로 손대지 않았다. 표 축약형 `Main Success`는 그대로 유지했다.

## 승인 4 — S05 역할 축소/명확화

- **변경 파일:** `ooad-s05-detailed-design-approved-v2.md`
- **변경 section:** 구 §22~§26(Boundary Question 1~5, 5개 절)을 §22 "Object Boundary를 판단하는 질문" 1개로 병합, 구 §31~§34(Candidate A/B/C, 위험 신호, Boundary Evaluation, 좋은 후보의 특징, 4개 절)을 §27 "여러 후보를 비교하고 위험 신호를 확인한다" 1개로 병합, 이후 §23~§30 번호 재정렬
- **변경 이유:** GRASP 이름을 쓰지 않을 뿐 사실상 GRASP와 동일한 수준의 체계적 책임배치 절차(5개의 개별 Boundary Question, 3개 Candidate 비교, 별도의 평가 checklist, 별도의 "좋은 후보" checklist)가 S05 본문에 상세히 존재해 S06의 학습효과를 희석할 위험이 있었다(평가 보고서 F6, 승인 지침의 "owner 판단 heuristic의 체계적 적용/복잡한 대안 평가 framework 축소").
- **최소 수정 내용:** 승인 지침이 "반드시 유지"로 명시한 요소(Analysis Concept≠Design Class, Static+Dynamic evidence, Object Boundary, State+Behavior, Encapsulation, Information Hiding, Change Reason, Initial Responsibility Assignment, Initial Design Class Diagram)를 다루는 §4~§21은 전혀 손대지 않았다(단, 승인 1의 Running Example 치환은 적용). 5개 Boundary Question 중 "누가 상태를 소유하는가"와 "어떤 불변조건을 보호해야 하는가" 2개만 남기고 나머지 3개(Rule 소유자 후보, 판단·실행 분리, 외부 노출 최소화)는 제거했다. Candidate A/B/C 비교와 4개 위험 신호(Data-only/God Service/Rule Duplication/State Exposure)는 유지하되 별도 평가 checklist·긍정적 특징 목록과 통합해 한 절로 축약했다. GRASP Pattern 목록은 실습에서도 여전히 제공하지 않았고, "체계적인 GRASP 적용은 S06에서 다룬다"는 문장을 새로 추가해 경계를 재확인했다. 응집도/결합도 예고(구 §35, 현 §28)는 원문 그대로 유지했다(이미 "예고만 한다"로 충분히 절제돼 있었음).

## 승인 5 — S06 실습 범위 현실화

- **변경 파일:** `ooad-s06-detailed-design-draft-v0.2.md`, `ooad-session-architecture-revised-v9.md`
- **변경 section:** `[실습] RDD Responsibility & Collaboration Refinement`의 과제 목록·필수 산출물·Slide Notes 시간 배분, Session Architecture S06 행의 Practice 셀
- **변경 이유:** 25~30분 실습이 Refined Design Class Diagram과 Design Sequence Diagram 2개를 요구했는데, "새 Diagram 2개를 처음부터 작성"으로 해석될 위험이 있었다(평가 보고서 F5).
- **최소 수정 내용:** 과제 1을 "S05 Class Diagram을 수정한다(새로 그리지 않는다)"로, 과제 2를 "S04 Sequence 중 핵심 구간 하나만 발전시킨다(전체를 다시 그리지 않는다)"로 명확화했다. 필수 산출물 표기에 각각 "S05를 수정한 결과", "핵심 구간 하나를 발전시킨 결과"라는 범위 한정 문구를 추가했다. Slide Notes 시간 배분 항목 이름에 "(기존 Diagram 수정)", "(핵심 구간 1개로 한정)"을 추가했다. 필수 산출물 자체(Refined Design Class Diagram + Design Sequence Diagram), 25~30분, 고려할 Pattern 목록, Responsibility–Owner Table의 선택적 지위는 전혀 바꾸지 않았다. Session Architecture의 S06 Practice 셀에도 동일한 "Existing Model Refinement" 문구를 반영해 두 문서가 어긋나지 않게 했다.

## 승인 6 — S06 Role 개념 보강

- **변경 파일:** `ooad-s06-detailed-design-draft-v0.2.md`
- **변경 section:** `2. 조직의 R&R 비유` (새 하위 절 "Role이란 무엇인가" 추가)
- **변경 이유:** Session Architecture와 S06 핵심 질문이 "Responsibility/Role/Collaboration"을 명시했지만, S06 본문에서 Role은 조직 비유의 화살표 항목으로만 5회 반복될 뿐 정의·예시가 없었다(평가 보고서 F7).
- **최소 수정 내용:** 기존 조직 R&R 비유 절 끝에 3문장짜리 하위 절을 추가했다: Role은 특정 Collaboration에서 수행하는 역할이며 관련 Responsibility의 묶음이라는 정의, 결재자/검토자 비유로 확장, 한 객체가 여러 Role을 수행할 수 있다는 설명. 별도 대형 section을 만들지 않았고 기존 조직 비유 문맥 안에서만 보강했다.

---

# Preserved Decisions

- **S01은 수정하지 않았다.** `git status`에서 `ooad-s01-detailed-design-revised.md`는 변경 목록에 없다. 승인된 6개 항목 중 S01 본문을 직접 요구하는 항목이 없었고, S01의 "Order Mini Exercise"(취소 가능 여부 판단 책임을 묻는 예시)는 Running Example 대상 세션(S02~S06)이 아니므로 건드리지 않았다.
- **S02의 Boehm/Standish/Bezos/von Neumann/Lean 핵심 메시지는 삭제하지 않고 유지했다.** 기존 개별 section(Boehm 회수 문장, Standish는 S01 소유이므로 S02에 새로 만들지 않음, Bezos 인용, von Neumann 인용, Lean 인용)이 모두 그대로 남아 있고, 신설된 "공통 결론" 절은 이 메시지들을 요약해 한 곳에 다시 나열했을 뿐 원문을 대체하지 않았다.
- **ISO 요구사항 수준 구분(Business Requirement → Stakeholder/User Requirement → System/Software Requirement)은 그대로 유지했다.** 축소 대상은 ISO 29148의 9개 자격 목록과 ISO 25010의 9개 품질특성 목록뿐이었다.
- **S03 정적 모델의 핵심 구성요소(Concept·Attribute·analysis-level Type/Value Domain·Association/Relationship·Multiplicity·Whole-Part)는 축소하지 않았다.** 예시의 도메인 대상만 바꿨고, 각 개념을 설명하는 절 자체·판단 기준·Failure Conditions·실습 산출물 요건은 그대로다. ER/Ontology/MDD-MDA/DDD 좌표 밀도 문제(평가 보고서 F8)는 이번 승인 범위가 아니므로 건드리지 않았다.
- **S04의 State/Communication/Activity 완성 예제(§36A)는 그대로 유지했다.** 이 절은 이미 baseline(Draft→Placed→Paid)과 정합적이어서 수정 대상이 아니었다.
- **S05는 여전히 경험 기반 Before 모델이다.** GRASP Pattern 목록을 실습에 제공하지 않는 원칙, LLM에 GRASP/RDD를 요청하지 않는 제약, "S05 Initial Design은 S06의 BEFORE 모델"이라는 문장 모두 그대로 남아 있다.
- **S06/S07 Pattern은 checklist가 아니라는 원칙을 유지했다.** S06 "Pattern은 Checklist가 아니다" 절, S07 미리보기의 "이 목록도 checklist가 아니다" 문장 모두 수정하지 않았다.
- **Session Architecture의 S05/S06/S07 progression 제목**(경험 기반 Initial Design → RDD 기반 Responsibility & Collaboration Refinement → Contract/Variation refinement)과 **S06/S07의 고려할 Pattern/원칙 목록**은 이미 승인 지침과 정확히 일치해 수정하지 않았다.

---

# Validation Results

| 항목 | 결과 | 근거 |
|---|---|---|
| A. Running Example | **PASS** | S02~S05 본문 worked example이 Place Order/Order/OrderItem/Product/Payment 중심으로 정렬됨. S06은 원래부터 Place Order 중심이었고 이번에도 유지됨(§Cancellation Leakage 표 참조). |
| B. Cancellation Leakage | **PASS (잔존 항목 전부 허용 범주)** | 잔존 occurrence 목록은 아래 표 참조. 전부 "후반 예고" 또는 "실습 제외 명시" 또는 Architecture 원본 규정문이며, 깊은 도메인 모델링으로 이어지는 지배적 예제는 남아있지 않음. |
| C. Session Boundary | **PASS** | `rg GRASP\|Information Expert\|Creator\|Controller\|High Cohesion\|Low Coupling` on S05 → 전부 "S05에서는 다루지 않는다/S06에서 다룬다"는 경계 진술뿐, 실제 적용 없음. `rg Design by Contract\|Polymorphism\|Protected Variations\|Pure Fabrication\|Indirection` on S06 → §19 "S07로 넘기는 질문"의 예고 문장 1건뿐, 본문 적용 없음. |
| D. Practice | **PASS** | S02~S06 각각 `[실습]` 1개, 본편 1장, 15~30분(S02 25~30, S03 25~30, S04 20~25, S05 25~30, S06 25~30), Slide Notes, `[별첨]`이 모두 존재함(grep 결과 각 파일에서 확인). |
| E. S06 Feasibility | **PASS** | S06 실습 슬라이드와 Slide Notes에 "Existing Model Refinement", "새 Diagram을 처음부터 작성하는 것이 아니라", "핵심 구간 하나"라는 범위 한정 문구가 명시됨. Session Architecture S06 행에도 동일 문구 반영됨. |
| F. Terminology | **PASS** | `Main Success Flow` 잔존 0건, `Main Success Scenario`로 통일(6건). `Problem Understanding`, `용어집`, `Communication Diagram` 표기는 이번 수정으로 건드리지 않았으며 기존 일관성이 유지됨(수정 전 평가에서도 PASS였던 항목). |

## Cancellation Leakage 잔존 occurrence 판정

| 파일 | 위치 | 판정 |
|---|---|---|
| `ooad-session-architecture-revised-v9.md` §6.1, S07 행 | Running Example 규정 자체, S07 실습 설명 | 후반 변화 예고(원본 규정문, 변경 대상 아님) |
| `ooad-s01-detailed-design-revised.md` Order Mini Exercise | "취소 가능 여부를 판단하는 책임" 예시 | S01은 승인 범위 밖 — 수정하지 않음(그대로 유지) |
| `ooad-s02-detailed-design-revised-v8.md` Use Case Diagram 개요, "좋은 예" 목록, 별첨 해설 | `Cancel Order`가 전체 Use Case 목록의 항목명으로만 등장 | 개요 수준 명명, 후반 예고 문맥 — 유지 |
| `ooad-s03-detailed-design-revised-v4.md` §Opening 후주, §36 실습 안내 | "이후 변화 요구에서 다시 검토", "이번 실습의 필수 범위가 아니다" | 후반 예고/실습 제외 명시 — 유지 |
| `ooad-s04-detailed-design-approved-v3.md` §27 | "현재 질문이 취소 가능성이라면…", Order 전체 lifecycle 목록의 `Refunding/Refunded` | 가정형 예고 문맥 + 완전한 lifecycle 예시의 일부(깊은 모델링 아님) — 유지 |
| `ooad-s06-detailed-design-draft-v0.2.md` §19 | "S07에서는 S06 Refined Design에 Order Cancellation/Refund 변화 요구를 투입" | S07 예고 — 유지 |

---

# Residual Issues

승인 범위 밖이라 이번에 수정하지 않은 문제. 평가 기준선 보고서에는 있었으나 이번 6개 승인 항목에 포함되지 않았다.

1. **S03 ER/Logical Model·Ontology·MDD/MDA·DDD 좌표의 밀도** — S03 문서 스스로 "Whole-Curriculum Integration 단계로 이관한 조정 항목"에 미해결로 남겨둔 문제(평가 보고서 F8). 이번 승인에 포함되지 않아 그대로 두었다.
2. **S04 완성 예제 3종 + 개념 밀도** — 75분 중 실습 제외 약 50~55분에 3개 완성 예제(State/Communication/Activity)와 Analysis Slice 개념을 모두 설명해야 하는 밀도 문제(평가 보고서 F9). 승인 범위 밖.
3. **S05 "자기 스냅샷 재적용" 지시 부재** — 본문의 Object Boundary 질문을 학생 자신의 S05 Initial Design 스냅샷에 명시적으로 다시 적용하라는 지시가 없는 문제(평가 보고서 F10). 승인 범위 밖.
4. **용어집 언급의 급격한 감소(S05 이후)** — S02~S04에서 활발히 언급되던 "용어집"이 S05·S06에서 거의 사라지는 것이 의도된 전환인지 불명확한 문제(평가 보고서 F11). 승인 범위 밖.
5. **S02 Anchor Provenance** — Boehm/Standish/Bezos/von Neumann/Lean/Yourdon/ISO 29148/ISO 25010이 `course-design.md`의 승인된 Anchors/References 표에 없는 문제(평가 보고서 F3). 이번 승인 항목(승인 2)은 "밀도 축소"만 다뤘고 Course Design Anchor 등재 여부는 범위 밖이라 `course-design.md`를 수정하지 않았다.

새로 발견된 문제는 없다. 위 5건은 모두 기존 평가 보고서에 이미 기록돼 있던 항목이며, 이번 라운드에서 사용자가 승인하지 않았으므로 source를 추가로 수정하지 않았다.
