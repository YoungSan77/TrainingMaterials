# OOAD S01–S06 Post-Patch Audit + Upward Feedback

- **감사 대상:** `courses/ooad/review-s01-s06/`의 6개 patch 파일 + `courses/ooad/course-design.md`
- **기준선:** [ooad-s01-s06-integration-review-v1.md](ooad-s01-s06-integration-review-v1.md), [ooad-s01-s06-approved-patch-report-v1.md](ooad-s01-s06-approved-patch-report-v1.md)
- **성격:** post-patch audit + minimal upward feedback. 승인된 patch를 재작성하지 않았고, 승인되지 않은 residual issue는 손대지 않았다.

---

# Post-Patch Verdict

**PASS WITH MINOR ISSUES**

1차 patch(승인 1~6)의 구조적 결정은 실제로 지켜지고 있었다(S05 Boundary Question은 이미 2개로 축소돼 있었고, S05→S06 Before/After 연결도 이미 충분히 명시돼 있었다). 다만 승인 2("S02 5개 메시지 = 본편 1장")가 이전 라운드에서 문자 그대로 지켜지지 않고 "기존 5개 section 유지 + 공통 결론 section 추가" 상태로 남아 있었다. 이번 audit에서 이를 실제로 통합했고, Course Design에 4개 상위 결정을 최소 patch로 반영했다. 새로운 구조적 결함은 발견되지 않았다.

---

# Verified Corrections

## S02 five-message one-slide consolidation

- **문제:** 이전 patch 라운드는 "공통 결론" slide를 신설했지만, `Brooks + Bezos`(Bezos 인용 포함), `개발자도 모른다 — John von Neumann`(전체 quote+설명), `Lean Software Development`(전체 quote+설명) 3개 section을 그대로 남겨둬 5개 메시지가 실질적으로 두 번 가르쳐지고 있었다.
- **changed section:** `ooad-s02-detailed-design-revised-v8.md`의 `Brooks + Bezos —…`(Brooks만 남기고 Bezos 문단 제거), `개발자도 모른다 — John von Neumann`(section 삭제, 1문장으로 축약), `Lean Software Development —…`(section 삭제, 1문장으로 축약), `공통 결론`(제목을 "다섯 근거를 한 장에 모은다"로 보강하고 Bezos/von Neumann 원문 quote와 Lean의 `Decide as Late as Possible` 표현을 실제로 옮겨옴, Slide Notes로 provenance 안내 추가), 권장 슬라이드 표(47~48장→43~45장, 제거된 2개 행 반영해 전체 renumbering).
- **exact intent:** Boehm/Standish/Bezos/von Neumann/Lean 다섯 근거를 개별 본문 section이 아니라 하나의 통합 slide에서 함께 제시해 "요구사항은 빨리 많이 확정하는 것이 목적이 아니다"라는 하나의 결론을 강화한다. 기존 수치·인용은 새로 만들지 않고 그대로 옮겼다(Bezos/von Neumann은 원문 영어 인용 그대로, Boehm/Standish는 S01의 기존 데이터를 재호출한다고만 명시하고 새 수치를 만들지 않았다).
- **why Course Design owns it 아님(Session Detailed Design 소관):** 이 결정은 S02 한 Session 내부의 slide 밀도·구성 문제이므로 Course Design이 아니라 Session Detailed Design 수준에서 완결한다. (그래서 Course Design에는 반영하지 않았다.)

## ISO requirement levels

- **확인 결과:** 이미 올바른 상태였다. `Business Requirement → Stakeholder/User Requirement → System/Software Requirement` 구분이 그대로 유지돼 있었고, ISO/IEC/IEEE 29148과 ISO/IEC 25010은 이전 라운드에서 이미 9개 항목 나열 대신 대표 항목 요약 문장으로 축소돼 있었다.
- **changed section:** 없음(수정하지 않음).
- **exact intent / why it matters:** 목적은 ISO 표준 교육이 아니라 "지금 이야기하는 Requirement가 어느 수준인가"를 구분하는 것이라는 원칙이 이미 지켜지고 있어 추가 수정이 불필요했다.

## S05 Before snapshot

- **확인 결과:** 이미 충분히 명시돼 있었다. §1B 실습 슬라이드에 "먼저 독립적으로 완성한 Initial Design snapshot을 저장한 뒤 LLM에 검토"가 필수 산출물로 명시돼 있고, §1 Session Position에 "이 결과는 S06·S07에서 RDD 관점으로 보완하기 위한 **Before 모델**이다"라는 문장이 있으며, §54 Session Summary에도 "S05의 Initial Design은 경험 기반 Before 모델"이라고 재확인한다.
- **changed section:** 없음(수정하지 않음).
- **exact intent:** 새 산출물을 강제하지 않고 기존 표현을 그대로 인정했다.

## S06 After/refinement linkage

- **확인 결과:** 이미 충분히 명시돼 있었다. §10 "S05 Initial Design 회수"가 "새 모델을 만드는 것이 아니라 Before 모델의 문제를 관찰하는 단계"라고 명시하고, 실습 입력에 "자신의 S05 Initial Design Class Diagram"을 직접 지정하며, `[별첨]`에 "Before — S05에서 흔히 나오는 형태"와 "After — 가능한 RDD 보완 방향"을 나란히 비교한다.
- **changed section:** 없음(수정하지 않음). (직전 라운드에서 추가한 "Existing Model Refinement" 문구가 이 연결을 더 명확히 했고, 이번 audit에서 재확인만 했다.)
- **exact intent:** Before/After 비교가 실제로 가능한 구조임을 재확인했다.

## S05 Boundary Question 실제 개수

- **확인 결과:** 현재 S05 §22 "Object Boundary를 판단하는 질문" 1개 section 안에 **질문 2개**("누가 상태를 소유하고 통제해야 하는가?", "어떤 불변조건을 보호해야 하는가?")만 있다. 본문이 명시적으로 "S05에서는 다음 두 질문만 확인한다"고 선언한다.
- **이전 두 요약("5개→1개"와 "5개→2개")이 동시에 나온 이유:** 서로 다른 것을 세고 있었다 — "5개 절(§22~§26)→1개 절(§22)"은 **section 개수**, "5개 질문→2개 질문"은 그 **1개 절 안의 질문 개수**. 실제 파일은 모순 없이 "1개 절, 2개 질문" 상태였다.
- **판정:** 숫자를 맞추기 위한 추가 수정 없음(요청대로 조정하지 않았다). 2개 질문(상태 소유·불변조건 보호)은 GRASP의 Information Expert/Creator/Controller에 대응하는 판단(누가 Rule을 아는가, 판단과 실행을 누가 나누는가, 외부 노출을 어떻게 최소화하는가)을 포함하지 않으므로, S06의 systematic Responsibility Assignment를 선행 소비하지 않을 만큼 충분히 단순하다고 판정한다(PASS).

---

# Course Design Upward Feedback

## A. Running Example Strategy

- **changed section:** `course-design.md`에 `## Running Example Strategy` 신설(`## Learning Progression`과 `## Change as Learning Device` 사이).
- **exact intent:** Requirement → Static Problem Understanding → Dynamic Problem Understanding → Initial Design → Refined Design을 관통하는 하나의 공통 progression을 기본 예로 쓴다는 것, Shipment는 필수 concept이 아니라는 것, Order Cancellation/Refund는 기본 설계 이후의 variation/change request라는 것을 명시했다. 구체적 시나리오 명칭("Place Order → Payment")과 실습 산출물은 Session Architecture/Detailed Design에 남겨뒀다.
- **why Course Design owns it:** 이 결정은 한 Session의 예시 선택이 아니라 S02~S07 전체가 공유하는 시나리오 전략이며, S07 이후 Session이 생성될 때도 지켜야 하는 상위 제약이므로 Session 수준이 아니라 Course Design이 소유해야 한다.

## B. Analysis → Design Progression

- **changed section:** `## Learning Progression`의 항목 5·6을 재작성.
- **exact intent:** 기존 항목 5("분석 모델을 구현 Class로 기계 변환하지 않고 객체 경계·책임·메시지 관점으로 전환한다")는 Before 모델의 존재를 명시하지 않았다. "학습자 자신의 기존 경험으로 먼저… initial design(before model)을 만든다"로 보강하고, 항목 6을 "그 initial design을 계약·응집도·결합도 같은 공학적 판단 기준으로 다시 검토해… 정제한다(refined design)"로 재작성해 S05(경험 기반 Before)→S06(공학적 판단 기반 After)의 구분이 Course Design 레벨에서도 드러나게 했다.
- **why Course Design owns it:** Before/After 두 단계로 나누어 가르친다는 결정은 Session 경계를 정의하는 상위 교육 전략이므로 Course Design의 Learning Progression이 소유해야 한다.

## C. RDD 단계적 도입

- **changed section:** `## Core Learning Scope`의 bullet 목록 뒤에 1문단 추가.
- **exact intent:** "책임 할당 판단(정보 전문가·응집도·결합도·정보 은닉)을 먼저 정착시킨 뒤, 계약·변화 대응 원칙(precondition/postcondition/invariant, composition/interface/dependency)으로 이어간다"고 명시해 기존 bullet 순서(책임 할당류 항목이 계약류 항목보다 먼저 나열됨)에 이미 담겨 있던 순서를 문장으로 확정했다. "principle/pattern은 checklist가 아니라 heuristic"이라는 공통 원칙도 함께 명시했다. **GRASP 개별 패턴명(Information Expert/Creator/Controller 등)이나 S07 패턴명(Polymorphism/Protected Variations 등)은 나열하지 않았다** — 이는 사용자가 "Course Design에 넣지 않을 것"으로 명시한 "상세 GRASP 적용 절차"에 해당하므로 의도적으로 제외했다.
- **why Course Design owns it:** 책임 배치 판단과 계약/변화 대응 판단을 두 개의 뚜렷한 단계로 나눈다는 것은 S06/S07 경계를 정의하는 상위 결정이며, 개별 패턴 목록은 Session Architecture(이미 존재)와 Detailed Design이 소유한다.

## D. Change as Learning Device

- **changed section:** `## Change as Learning Device` 신설, `## 핵심 실습 방향` 표의 1번째·3번째 행 수정.
- **exact intent:** 기본 설계(정상 요구)를 먼저 완성한 뒤 change request를 투입해 설계가 흔들리는 지점을 관찰하고 보완한다는 교육적 장치를 명시했다. **부수적으로 발견한 불일치**: 기존 `핵심 실습 방향` 표의 1행이 "분산된 **취소 규칙**을 어떤 객체 책임과 계약으로 옮길지 판단"이라고 되어 있어, Cancellation을 마치 기본 설계의 대상인 것처럼 서술하고 있었다(A. Running Example Strategy와 정면으로 모순). 이를 "정상 흐름(주문→결제)에서 분산되기 쉬운 책임을 어떤 객체 책임과 계약으로 옮길지 판단"으로 수정하고, 3행("설계 feedback")에 "Order Cancellation/Refund 같은 change request"라는 구체적 연결을 추가해 change-as-learning-device 원칙이 표 안에서도 일관되게 하였다.
- **why Course Design owns it:** change request를 학습 장치로 사용한다는 결정과 그 대표 사례(Order Cancellation/Refund)의 위치(기본 설계 이후)는 A(Running Example Strategy)와 직접 연결된 상위 결정이며, 이를 Session 수준에만 남겨두면 향후 S07+ 생성 시 다시 어긋날 위험이 있다.

---

# Deliberately Deferred Issues

이번 audit에서도 다음은 source를 수정하지 않았다(승인 범위 밖).

1. **S03 ER/Ontology/MDD-MDA/DDD 밀도** — S01~S06 중간 통합 검토에서 별도로 판단하기로 이미 결정됨(사용자 명시).
2. **S04 State/Communication/Activity 완성예제 3종 밀도** — Human이 수강생 이해를 위해 의도적으로 유지하기로 결정함(사용자 명시).
3. **S05 이후 용어집 언급 빈도 감소** — 명백한 의미 불일치(용어 충돌)는 발견되지 않았다. S05·S06 어디에서도 S02~S04에서 확립한 용어(Order/OrderItem/Product/Payment/Customer, Order Requested/Payment Confirmed 등)와 다른 이름을 새로 만들어 쓰는 곳이 없어, 단순히 언급 빈도가 줄어든 것이지 용어집과의 의미 충돌은 아니다. → **source 수정 없음.** (residual로만 기록: 완전히 끊긴 것은 아니지만 S05·S06이 "용어집이 이미 안정화되었다"는 문장을 명시적으로 남기지는 않는다.)
4. **S02 Anchor Provenance(Boehm/Standish/Bezos/von Neumann/Lean/Yourdon/ISO가 course-design.md Anchors 표 미등재)** — 이번에도 Anchor 목록 전체를 옮기지 않았다. 사용자가 명시적으로 "이 5명을 Core Anchor 목록으로 추가하지 마라"고 지시했으므로, Course Design Anchors 표는 그대로 두었다(15개 Anchor, 변경 없음). S02의 5개 메시지는 Course Design의 Anchor가 아니라 **S02 한 Session의 evidence cluster**로만 규정된다는 점을 이번 패치의 "Verified Corrections" 절에 명시해 향후 오해를 줄였다.

---

# Cross-Layer Consistency

| 경로 | 결과 | 근거 |
|---|---|---|
| Course Design → Session Architecture | **PASS** | Architecture §6.1이 이미 "Place Order → Payment" baseline, "Shipment는 필수 Concept 아님", "Order Cancellation/Refund는 S07 variation"을 정확히 서술하고 있었고, 이번에 Course Design에 추가한 Running Example Strategy/Change as Learning Device 문장과 표현만 다를 뿐 내용이 완전히 일치한다. |
| Session Architecture → S02~S06 Detailed Design | **PASS** | S05 행 제목("경험 기반 Initial Design")·S06 행 제목("RDD로 책임과 협력 보완")·S07 행 제목("계약과 변화 대응")이 각 Detailed Design 파일의 자기 서술과 그대로 대응한다. S06 실습 셀의 "Existing Model Refinement / limited-scope Design Sequence Diagram" 문구도 S06 Detailed Design과 동일하다. |
| Course Design → S02~S06 Detailed Design (직접) | **PASS** | Course Design의 RDD 단계적 도입 문단(책임 할당류 먼저, 계약류 나중)과 S05→S06→S07 순서가 일치한다. Change as Learning Device 원칙과 S02~S06 본문의 Place Order/Payment 중심 서술 + S07 예고 문맥이 일치한다. |
| Course Design Anchors 표 ↔ S02 5-message cluster | **PASS(의도적 비대칭)** | Boehm/Standish/Bezos/von Neumann/Lean은 Course Design Core Anchor로 승격되지 않은 채로 남아 있으며, 이는 사용자가 의도한 상태다(S02 한 Session의 evidence cluster). Residual로 기록만 하고 구조는 바꾸지 않았다. |

---

# Diff Summary

| 파일 | 변경 |
|---|---|
| `courses/ooad/course-design.md` | +39 / -12 (Core Learning Scope 1문단 추가, Learning Progression 2개 항목 재작성, Running Example Strategy·Change as Learning Device 신설, 핵심 실습 방향 표 2개 행 수정) |
| `courses/ooad/review-s01-s06/ooad-s02-detailed-design-revised-v8.md` | 이번 audit에서 추가 변경: Bezos/von Neumann/Lean 개별 section 제거·축약, 공통 결론 slide 실질 강화, 권장 슬라이드 수 43~45장으로 재조정 및 전체 renumbering |
| `courses/ooad/review-s01-s06/ooad-s03-detailed-design-revised-v4.md` | 이번 audit에서 추가 변경 없음(이전 patch 그대로, 검증만 수행) |
| `courses/ooad/review-s01-s06/ooad-s04-detailed-design-approved-v3.md` | 이번 audit에서 추가 변경 없음(이전 patch 그대로, 검증만 수행) |
| `courses/ooad/review-s01-s06/ooad-s05-detailed-design-approved-v2.md` | 이번 audit에서 추가 변경 없음 — Boundary Question 2개 상태를 확인만 하고 수정하지 않음 |
| `courses/ooad/review-s01-s06/ooad-s06-detailed-design-draft-v0.2.md` | 이번 audit에서 추가 변경 없음(이전 patch 그대로, 검증만 수행) |
| `courses/ooad/review-s01-s06/ooad-session-architecture-revised-v9.md` | 이번 audit에서 추가 변경 없음(Course Design과 이미 일치, 검증만 수행) |

`git diff --stat` 전체 수치는 이번 세션 마지막 응답에 기록한다.

---

*Source 문서 중 이번에 실제로 추가 수정한 것은 `ooad-s02-detailed-design-revised-v8.md`와 `course-design.md` 2개뿐이다. 나머지 4개 review 파일과 Architecture 파일은 검증 결과 이미 올바른 상태였으므로 손대지 않았다. commit/push는 수행하지 않았다.*
