# OOAD S01–S06 Rule Harvest — Intermediate Review 상향 반영

- **성격:** 3-Session 단위 Periodic Authoring Rule Harvest(커리큘럼 작성 지침 Working Procedure 7항)의 실행. 새 Curriculum 내용을 작성하지 않았고 S07 상세설계를 시작하지 않았다.

---

# Review Scope

- **기준선:** commit `3689faf`
- **읽은 문서:** `guides/커리큘럼_작성_지침.md`, `courses/ooad/course-design.md`, `courses/ooad/review-s01-s06/ooad-session-architecture-revised-v9.md`, `courses/ooad/review-s01-s06/ooad-s01-s06-post-patch-review-v1.md`
- **범위:** S01~S06 Intermediate Review(2차례 patch 라운드)에서 실제로 관찰된 authoring 판단만을 대상으로 하며, 이번 3-Session harvest 시점 이전에 이미 처리된 개별 세션 내용(S02 running example, S05 Boundary Question 등)은 재작성하지 않고 그 판단에서 "범용화할 수 있는 것"만 추출했다.

---

# Harvested Candidate Rules

| Candidate | Universal / OOAD-specific | Existing Coverage | Decision | Reason |
|---|---|---|---|---|
| **A. Running Example Lifecycle** | Universal | 없음 | **PROMOTE** | Whole-Curriculum Integration Review의 "핵심 concept의 최초 소개, 반복, 심화와 회수"는 개념 반복을 다루지만, "후속 Session의 change/variation을 baseline에서 미리 소비하지 않는다"는 authoring-time 원칙은 지침 어디에도 없었다. S02~S05가 Cancellation/Refund를 조기에 소비했던 실패 패턴에서 직접 추출된, 다른 과정의 Running Example에도 재사용 가능한 원칙이다. |
| **B. Before → Framework → After** | Universal(단, 기존 문장 일부와 중첩) | 부분적으로 존재함 | **PROMOTE(기존 문장에 통합)** | 기존 문장은 "경험 기반 초기 설계 실습에서 LLM에 Pattern을 선행 주입하지 않는다"는 LLM 사용 제약만 다뤘다. "배우기 전 Before 결과를 먼저 확보하고 이후 학습한 기준으로 다시 정제해 비교한다"는 더 넓은 세션 구조 원칙, 그리고 "모든 Session에 강제하는 template이 아니다"라는 제약은 없었다. S05→S06 설계에서 검증된 구조를 일반화했다. |
| **C. Teach ≠ Practice Everything** | Universal(단, 기존 문장 일부와 중첩) | 부분적으로 존재함 | **PROMOTE(기존 문장에 통합)** | 기존 문장은 "실습은 미니 프로젝트가 아니라 제한된 Practice"까지만 말했다. "나머지 중요한 모델/기법은 완성 예제·walkthrough·비교·discussion으로 제공할 수 있다"는 대안 제시가 없었다. S04의 State/Communication/Activity 완성예제 처리에서 검증된 패턴이다. |
| **D. Small Scope, Complete Artifact** | Universal | **이미 충분히 존재함** | **ALREADY COVERED** | "실습 범위는 15~30분 안에 수행할 수 있도록 제한하되, 선택한 산출물 자체의 핵심 구성요소는 생략하지 않는다"가 이미 이 규칙 자체이며, 정적 분석 모델 예시까지 포함한다. 표현을 바꾸지 않았다. |
| **E. Non-redundant Deliverables** | Universal | 없음 | **PROMOTE** | 지침에 "필수 산출물"을 정의하는 문장은 많지만 "중간 사고 도구가 최종 산출물과 동일 정보를 반복하면 선택적으로 둔다"는 원칙은 없었다. S06의 Responsibility–Owner Table을 선택적 도구로 남긴 판단에서 추출했다. |
| **F. Framework/Pattern Is Not Checklist** | Universal | **이미 충분히 존재함** | **ALREADY COVERED** | "Pattern을 적용하는 실습에서는… 전부 적용하는 checklist로 사용하지 않는다. 수강생은 현재 문제에 필요한 것만 선택하고 선택·비선택 이유를 설명할 수 있어야 한다"가 문구 수준까지 거의 동일하다. 표현을 바꾸지 않았다. |
| **G. Upward Feedback Ownership** | Universal | **이미 충분히 존재함** | **ALREADY COVERED** | Working Procedure 3항(Upward Feedback)과 7항(Periodic Authoring Rule Harvest)이 "Course Design/Session Architecture/Curriculum Guide/Common Standard 중 적절한 owner로 상향 반영한다"는 절차를 이미 정의하고 있다. 이번 harvest 자체가 그 절차의 실행이다. 새 규칙을 추가하지 않았다. |

---

# Promoted Authoring Rules

`guides/커리큘럼_작성_지침.md`의 `## Responsibility` 목록에 최소 patch로 반영했다(새 section 신설 없음).

1. **(신설, "각 Session의 학습 목표…" 바로 다음)** "여러 Session에 걸쳐 하나의 Running Example을 사용하는 경우, 후속 Session에서 다룰 새로운 change/variation을 이전 Session의 baseline 설명에서 미리 소비하지 않는다. Running Example은 단순 반복 소재가 아니라 baseline 형성 → 새로운 change/variation 투입 → 기존 결과 평가 → refinement로 이어지는 학습 progression을 지탱하는 teaching device로 설계·관리한다."
2. **(신설, "실습 범위는 15~30분…" 바로 다음)** "사고를 돕는 중간 도구(예: worksheet, 판단표)가 최종 산출물(model, diagram 등)에 이미 충분히 반영되어 동일한 판단 정보를 다시 옮겨 적는 수준이라면, 그 중간 도구를 별도의 필수 산출물로 강제하지 않고 선택적 사고 도구로 둘 수 있다."
3. **(기존 문장 확장)** "한 Session의 실습은… 제한된 Practice로 설계한다." 뒤에 "Session에서 설명하는 나머지 중요한 모델·기법·관점까지 모두 수강생 산출물로 요구할 필요는 없으며, 완성 예제·강사 walkthrough·비교·discussion으로 제공할 수 있다." 추가.
4. **(기존 문장 앞에 일반화 문장 추가)** "경험 기반 초기 설계를 의도한 실습에서는…" 문장 앞에 "후속 Session에서 배울 특정 원칙·framework·Pattern의 가치를 학습시키려는 경우, 가능하면 그 기준을 배우기 전에 학습자의 기존 경험이나 판단으로 Before 결과를 먼저 확보한 뒤 그 기준을 학습하고 다시 정제하게 하여 차이와 trade-off를 비교하게 할 수 있다. 모든 Session에 강제하는 template은 아니며 비교 효과가 있는 Session에서만 선택한다." 추가(기존 LLM 관련 문장은 그대로 보존).

별도의 "OOAD에서 배운 교훈" section이나 새 Rule 이름 header는 만들지 않았다. 각 항목은 기존 `## Responsibility` bullet 목록의 자연스러운 위치에 문장으로 통합했다.

---

# OOAD-Specific Decisions

다음은 범용화하지 않고 OOAD Course Design/Session Architecture에만 남긴다. 모두 확인 결과 이미 반영돼 있어 추가 patch를 하지 않았다.

| 결정 | 현재 반영 위치 |
|---|---|
| S02~S06 baseline = Place Order → Payment | `course-design.md` §Running Example Strategy; Architecture §6.1 "S02~S06의 공통 기본 시나리오는 Place Order → Payment로 한다" |
| Shipment는 baseline 필수 Concept 아님 | `course-design.md` §Running Example Strategy; Architecture §6.1 |
| Order Cancellation/Refund = S07 이후 change request | `course-design.md` §Running Example Strategy·§Change as Learning Device·핵심 실습 방향 표; Architecture §6.1, S07 행 |
| S05 = Experience-based Initial Design/Before | `course-design.md` §Learning Progression 항목 5; Architecture S05 행 제목·Main Learning Flow |
| S06 = RDD Responsibility & Collaboration Refinement | `course-design.md` §Learning Progression 항목 6; Architecture S06 행 제목·Main Learning Flow |
| S07 = Contract/Variation Refinement | Architecture S07 행 제목·Main Learning Flow(S07은 아직 상세설계 대상이 아니므로 Architecture 수준까지만 확인) |
| S06 기본 GRASP와 S07 variation-oriented 원칙의 ownership 구분 | `course-design.md` §Core Learning Scope 보강 문단("책임 할당 판단을 먼저 정착시킨 뒤 계약·변화 대응 원칙으로 이어간다", 개별 패턴명은 미기재); Architecture S06/S07 행의 "고려할 Pattern/원칙" 목록이 서로 겹치지 않게 분리돼 있음 |
| Static + Dynamic Problem Understanding → Design progression | `course-design.md` §Learning Progression 항목 3·4·5; Architecture S03/S04/S05 행 |

**누락 발견 여부:** 없음. 8개 항목 모두 이미 Course Design 또는 Architecture 중 적어도 한 곳에 명시적으로 존재함을 grep으로 확인했다. 따라서 이번 라운드에서 `course-design.md`·Architecture에 대한 추가 patch는 수행하지 않았다(직전 post-patch 라운드에서 이미 반영 완료됨).

---

# Deferred Issues

현재 S07 진행을 막지 않지만 후속 통합 검토(Whole-Curriculum Integration Review)에서 다시 볼 항목. 이번 라운드에서도 source를 수정하지 않았다.

- **S03 ER/Ontology/MDD-MDA/DDD 밀도** — S01~S06 중간 통합 검토에서 별도 판단하기로 이미 결정됨.
- **S04 동적 모델 완성예제 3종(State/Communication/Activity) 밀도** — Human이 수강생 이해를 위해 의도적으로 유지하기로 결정함.
- **S05 이후 용어집 회수 빈도 감소** — 명백한 의미 충돌은 발견되지 않았음(이전 post-patch audit에서 확인). 언급 빈도 자체는 residual로 유지.

---

# Readiness for S07

**PASS**

- 승인된 6개 patch(Running Example, S02 밀도, 용어 통일, S05 역할, S06 실습 범위, S06 Role)와 이후 post-patch audit(5개 메시지 실제 통합, Boundary Question 개수 확인, Before/After 연결 확인, Course Design 4개 상위 결정 반영)이 모두 실제 파일에 반영되어 있음을 이번 audit에서 재확인했다.
- 이번 harvest에서 새로 발견된 구조적 결함은 없다. 범용 규칙 4건을 지침에 최소 patch로 반영했고, OOAD 고유 8개 결정은 모두 이미 Course Design/Architecture에 존재함을 확인했다.
- Deferred Issues 3건은 S07의 progression(Contract/Variation Refinement)이나 Running Example 경계(Place Order→Payment baseline, Cancellation/Refund를 S07에서 처음 투입)에 영향을 주지 않는 항목이므로 S07 Detailed Design 착수를 막지 않는다.

---

*이번 작업에서 S07 상세설계는 작성하지 않았다. `guides/커리큘럼_작성_지침.md` 외의 파일은 검증만 수행하고 추가 수정하지 않았다. commit/push는 수행하지 않았다.*
