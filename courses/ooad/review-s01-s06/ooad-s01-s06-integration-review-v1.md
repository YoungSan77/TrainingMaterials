# OOAD S01–S06 중간 통합 평가

- **평가 대상:** `courses/ooad/review-s01-s06/` 내 7개 파일 (Session Architecture v9, S01 revised, S02 revised-v8, S03 revised-v4, S04 approved-v3, S05 approved-v2, S06 draft-v0.2)
- **평가 기준:** 본 요청서에 명시된 Course Design 의도(Analysis/Design 비-phase화, Static/Dynamic 상보성, Brooks Essence/Accident, 용어집 통일, Running Example baseline) + `guides/커리큘럼_작성_지침.md` + `courses/ooad/course-design.md`(Anchor 검증 기준 참조)
- **평가 성격:** 통과/보류 판정이 아니라 결함 탐지. 강점은 "보존해야 할 것"으로만 기록한다.

---

## Executive Verdict

**PASS WITH REVISIONS** — Session 경계, Handoff 질문 체인, 실습 1장 원칙, LLM 사용 원칙 등 구조적 골격은 견고하다. 그러나 S02~S05 네 개 세션에 걸쳐 반복되는 Running Example 거버넌스 위반(Critical)과, 이를 방치할 경우 S07의 핵심 교육 장치(변화 요구의 신선도)가 무력화되는 문제가 있다. 이 Critical 항목과 아래 Major 항목들은 S07 상세설계 착수 전에 반드시 교정해야 한다. 구조 자체를 다시 설계할 필요는 없으며, 본문 예시 재작성·실습 범위 조정·용어 정정 수준의 수정으로 해결 가능하다.

### 가장 중요한 문제 3~5개

1. **[Critical] Running Example 거버넌스 붕괴** — S02·S03·S04·S05 본문의 핵심 설명 예시가 공식 baseline인 "Place Order → Payment"가 아니라 S07 전용으로 예약된 "Order Cancellation/Refund"에 지배적으로 의존한다. `Place Order`는 각 세션에서 실습 절(및 그 입력 설명)에만 등장하고(S02 3회, S03 3회, S04 8회 중 6회가 실습/제공예제 절, S05 2회), 취소·환불 관련 표현은 S02 24회, S03 45회, S04 50회, S05 40회로 본문 전체를 지배한다. 이는 Course Design 6.1절의 "Order Cancellation과 Refund는 S02~S06의 주 running example과 실습 대상에서는 제외하고, 필요한 개념 설명의 **짧은 예**로만 사용할 수 있다"는 명시적 제약을 넘어선다.
2. **[Major] S02 Content Density 과다 + Anchor Provenance 공백** — 90분 세션에 Boehm/Standish/Bezos/von Neumann/Lean SW Development/Yourdon/ISO 29148/ISO 25010/Larman 등 9개 가까운 독립 Anchor·프레임워크가 압축되어 있고, 이 중 Boehm, Standish, Bezos, von Neumann, Lean SW Development, Yourdon, ISO 29148, ISO 25010은 `course-design.md`의 승인된 Anchors/References 표에 존재하지 않는다.
3. **[Major] S06 실습의 산출물 불균형** — S02~S05는 25~30분(또는 20~25분) 안에 산출물 1개를 요구하는데, S06은 동일한 25~30분 안에 **Refined Design Class Diagram + Design Sequence Diagram 2개**를 요구하고 둘 사이의 상호 검증까지 요구한다.
4. **[Major] S05→S06 Before/After 학습효과 희석 위험** — S05 실습(1B)은 본문 이론화 이전에 배치되어 RDD/GRASP 오염을 구조적으로 잘 차단했지만, 실습 **이후** 본문(Boundary Question 1~5, Candidate A/B/C 비교)이 GRASP 이름만 감춘 채 사실상 책임배치 방법론 전체를 상세히 가르친다. S06이 여기에 GRASP 이름표만 부여하는 세션으로 읽힐 위험이 있다.
5. **[Major] S06 "Role" 개념의 실질적 미교육** — Session Architecture와 Course Design 의도 모두 S06 학습 흐름에 "Responsibility/**Role**/Collaboration, Knowing/Doing"을 명시하지만, S06 본문에서 Role은 조직 비유의 화살표 항목(`→ Role`)으로만 5회 등장할 뿐, Responsibility·Knowing/Doing·CRC·GRASP처럼 정의·판단 질문·예시를 가진 절이 없다.

### 반드시 보존해야 할 강점 3~5개

1. **일관된 Handoff Chain** — S01~S06 모든 세션이 "S0X로 넘기는 질문"으로 끝나고 다음 세션이 그 질문을 "Session Position"에서 그대로 받는다. 세션을 넘길 때마다 질문이 명시적으로 이어지는 구조는 다른 무엇보다 먼저 보존해야 한다.
2. **실습 1장 + Slide Notes + 별첨 분리 원칙의 무결 준수** — S02~S06 5개 세션 전부 예외 없이 "본편 실습 슬라이드는 1장만 사용한다"를 지키고, 세부 진행은 Slide Notes, 예시 답안은 `[별첨]`으로 분리했다.
3. **정답 절대화 방지 문구의 일관된 삽입** — 모든 별첨이 "하나의 가능한 모델/답안이며 다른 대안도 근거가 있으면 허용한다"는 취지의 문장을 명시적으로 포함한다(S02 결제 Actor 여부, S03 Payment multiplicity, S04 participant 구조, S05 관찰 포인트, S06 이름/구조).
4. **LLM 사용 절차의 일관성** — "독립 작성 → 스냅샷 보존 → LLM은 누락/반론/검증만 → 근거 없는 제안 채택 금지"가 S02~S06 전 세션 Slide Notes에 반복 명시되어 있고, S05·S06은 "LLM에 GRASP/새 기능을 요청하지 마라"는 프롬프트 제한까지 명시한다.
5. **S05 실습의 배치 설계** — S05는 본문의 RDD 인접 개념(Encapsulation/Information Hiding/Boundary Question)보다 실습을 앞(섹션 1B)에 배치해, 최소한 실습 그 자체가 RDD/GRASP로 오염되는 것은 구조적으로 막았다. (단, 실습 이후 본문의 밀도는 위 Major #4에서 별도로 문제 삼는다.)

---

## Findings

| ID | Severity | Session | Finding | Why it matters | Minimal correction |
|---|---|---|---|---|---|
| F1 | Critical | S02, S03, S04, S05 | 본문 핵심 예시가 공식 baseline(Place Order→Payment)이 아니라 Order Cancellation/Refund에 지배적으로 의존. 근거: S02 `Cancel Order`가 Use Case Specification 교육 예시([ooad-s02-detailed-design-revised-v8.md:838](ooad-s02-detailed-design-revised-v8.md:838)), Event–Response List 전체([ooad-s02-detailed-design-revised-v8.md:585-590](ooad-s02-detailed-design-revised-v8.md:585)); S03 Concept 발견의 구동 예시가 `cancelOrder(orderId)` Operation Contract([ooad-s03-detailed-design-revised-v4.md:89](ooad-s03-detailed-design-revised-v4.md:89), [:592-651](ooad-s03-detailed-design-revised-v4.md:592)); S04 본문 전체 Scenario·State Machine·Essence/Accident 예시가 Cancellation([ooad-s04-detailed-design-approved-v3.md:288-297](ooad-s04-detailed-design-approved-v3.md:288), [:727-736](ooad-s04-detailed-design-approved-v3.md:727), [:973-996](ooad-s04-detailed-design-approved-v3.md:973)); S05 Change Reason·Boundary Question 예시가 취소 규칙([ooad-s05-detailed-design-approved-v2.md:497-522](ooad-s05-detailed-design-approved-v2.md:497), [:783-798](ooad-s05-detailed-design-approved-v2.md:783)). | Course Design 6.1절은 Cancellation/Refund를 "짧은 예"로만 허용하고 S07의 variation/change-request 전용으로 예약했다. 4개 세션 본문이 이를 주력 예시로 사용하면, 학생은 S07에서 처음 마주쳐야 할 변화 요구를 이미 4개 세션에 걸쳐 상태전이·책임후보·불변조건까지 분석한 뒤 맞이하게 되어, S07의 "미지의 변화에 설계가 버티는가"라는 핵심 학습장치가 무력화된다. 또한 실습(Place Order)과 본문 예시(Cancellation)가 매번 다른 시나리오를 오가면서 "지금 우리가 다루는 문제가 무엇인가"에 대한 인지 부하를 유발한다. | S02~S05 본문의 주요 worked example을 Place Order→Payment로 교체한다. Cancellation은 각 세션당 1~2회, "이 판단이 어려워지는 경우의 예"로만 짧게 언급하고 상세 분석(Operation Contract 전개, State Machine, Boundary Question 전체 적용)은 하지 않는다. |
| F2 | Major | S02 | 90분에 Boehm/Standish/Bezos/von Neumann/Lean SW Development/Yourdon/ISO 29148/ISO 25010/Larman 등 사실상 9개의 독립 Anchor·프레임워크가 들어있다(예: [ooad-s02-detailed-design-revised-v8.md:71-163](ooad-s02-detailed-design-revised-v8.md:71), [:320-368](ooad-s02-detailed-design-revised-v8.md:320)). 권장 47장 자체가 이를 반영한다. | 실습(25~30분)을 제외하면 실제 교육 시간은 60~65분인데, 그 안에서 9개의 별도 근거·출처를 각각 최소 1개 슬라이드로 소화해야 한다. 슬라이드 수가 아니라 서로 다른 저자·연도·맥락을 가진 근거를 학습자가 짧은 시간에 구분·흡수해야 하는 개념 밀도 문제이며, "더 추가"가 아니라 "정리"가 필요한 사례다. | ISO 25010 9개 특성과 ISO 29148 자격 9개를 각각 목록 슬라이드로 유지하되 상세 설명은 줄이거나, Bezos/von Neumann 인용 중 하나를 본문에서 제거하고 요약 문장으로만 남긴다. Lean SW Development 절은 "Too Early" 문제의식과 통합해 압축한다. |
| F3 | Major | S02 (및 S01) | F2에서 사용된 Anchor 중 Boehm, Standish, Bezos, von Neumann, Lean SW Development, Yourdon, ISO/IEC/IEEE 29148, ISO/IEC 25010이 `course-design.md`의 Anchors/Core References 표(총 16개 Anchor, 3개 Reference)에 없다. S01의 Boehm/Standish도 동일. | 커리큘럼 작성지침은 "검증되지 않은 Source를 확정 사실이나 축자 인용 근거로 승격하지 않는다"고 명시한다. Boehm의 "100배 비용", Standish의 "45% never used" 같은 수치는 학습 동기를 좌우하는 핵심 근거인데, Course Design의 승인 목록에 없다면 출처·인용 정확성이 검증되지 않은 채 강한 사실 주장으로 쓰이는 것이다. | Course Design의 Anchors 표에 이 8개 Anchor를 인용문·출처·locator와 함께 추가하고 사용자 승인을 받거나(Upward Feedback 절차), 승인이 어렵다면 S01·S02에서 수치 주장 대신 정성적 서술로 낮춘다. |
| F4 | Major | S02 | 본문에서 "이 과정에서는 `Main Success Scenario` 대신 **Main Success Flow**를 사용한다"([ooad-s02-detailed-design-revised-v8.md:880](ooad-s02-detailed-design-revised-v8.md:880))고 명시적으로 용어를 확정했지만, 바로 그 실습 슬라이드 과제 문구에서 "Main Success **Scenario**"를 사용한다([ooad-s02-detailed-design-revised-v8.md:1035](ooad-s02-detailed-design-revised-v8.md:1035)). | 같은 문서 안에서 스스로 정의한 용어 규칙을 40여 줄 뒤에 어기는 것은 용어 흔들림의 가장 분명한 사례이며, 수강생이 실습 과제를 읽을 때 "Flow와 Scenario는 다르다"고 방금 배운 구분을 실습 지시문이 다시 무너뜨린다. | 1035행의 "Main Success Scenario"를 "Main Success Flow"로 수정한다. |
| F5 | Major | S06 | 실습이 25~30분 안에 **Refined Design Class Diagram**과 **Design Sequence Diagram** 2개를 요구하고([ooad-s06-detailed-design-draft-v0.2.md:260-266](ooad-s06-detailed-design-draft-v0.2.md:260)), Slide Notes 시간 배분도 재배치 7분+Sequence 작성 7분+feedback 3분+LLM 5~8분으로 빡빡하다([ooad-s06-detailed-design-draft-v0.2.md:277-283](ooad-s06-detailed-design-draft-v0.2.md:277)). S02~S05는 동일 시간대에 산출물 1개만 요구한다. | 두 Diagram을 모두 새로 작성하고 서로 일관성까지 검증하는 작업은 S02~S05 대비 산출물 밀도가 2배이며, "실습 범위는 작게 제한하되 산출물 자체는 제대로 작성한다"는 지침과 충돌할 위험이 크다. 시간이 부족하면 Sequence Diagram이 형식적으로만 작성되어 Class↔Sequence 왕복 검증이라는 이 실습의 핵심 학습목표가 훼손된다. | Design Sequence Diagram의 범위를 "재배치된 책임과 관련된 3~4개 message로 한정"하도록 실습 슬라이드에 명시하거나, 실습 시간을 35~40분으로 확대한다. |
| F6 | Major | S05 (→S06 영향) | 실습(1B) 이후 본문 섹션 22~33(Boundary Question 1~5, Candidate A/B/C 비교, 좋은 후보의 특징)이 GRASP 이름을 쓰지 않을 뿐 Information Expert/Creator/Protected Variations에 해당하는 판단을 사실상 체계적으로 가르친다([ooad-s05-detailed-design-approved-v2.md:750-1090](ooad-s05-detailed-design-approved-v2.md:750)). | S06의 교육적 가치는 "S05의 직관적 배치를 RDD 언어로 재검토하며 근거를 얻는 것"인데, S05 본문이 이미 동일한 판단 절차(후보 비교, 불변조건 보호, 정보 은닉 경계)를 상세히 훈련시키면 S06은 새 판단력이 아니라 기존 판단에 이름표(Information Expert 등)만 붙이는 세션으로 축소될 위험이 있다. Before/After 학습효과(요청 항목 6)가 약해진다. | S05 섹션 22~33을 2~3개의 핵심 질문(예: "누가 상태를 소유하는가", "무엇을 숨겨야 하는가")으로 축소하고, 나머지는 S06에서 GRASP 이름과 함께 다루도록 이관한다. |
| F7 | Major | S06 | Session Architecture Main Learning Flow는 "RDD(Responsibility/**Role**/Collaboration, Knowing/Doing)"을 명시하지만([ooad-session-architecture-revised-v9.md:214](ooad-session-architecture-revised-v9.md:214)), S06 본문에서 Role은 조직 비유의 화살표 항목으로만 5회 등장([ooad-s06-detailed-design-draft-v0.2.md:41,52,69,389,413](ooad-s06-detailed-design-draft-v0.2.md:41))할 뿐, Responsibility·Knowing/Doing·CRC·GRASP처럼 정의·판단 질문·예시가 있는 절이 없다. | Role은 RDD에서 Responsibility와 구분되는 독립 개념(예: Wirfs-Brock의 역할 stereotype)인데 정의 없이 이름만 반복되면 학습자는 Role과 Responsibility를 같은 것으로 오인하거나 왜 Architecture가 Role을 별도로 강조했는지 알 수 없다. | S06에 "Role" 절을 추가하거나(예: Object가 특정 Collaboration 맥락에서 수행하는 역할이라는 정의 + 판단 질문), Architecture/Course Design에서 Role을 Responsibility에 통합해 표현을 정정한다. |
| F8 | Major | S03 | S03 문서 스스로 "Whole-Curriculum Integration 단계로 이관한 조정 항목"에서 "ER/Logical Model·Ontology·MDD/MDA·DDD 좌표의 밀도… 75분에서 어느 정도까지 압축할지"를 미해결로 남겨두었다([ooad-s03-detailed-design-revised-v4.md:1687-1699](ooad-s03-detailed-design-revised-v4.md:1687)). 섹션 10~13(4개 좌표계 비교)이 본문에 이미 상세히 존재한다. | 승인본(사용자 승인본)임에도 밀도 문제가 미해결로 이월되어 있어, 이번 중간 통합 평가 시점에 방치하면 다음 3-세션 구간 리뷰까지 계속 이월될 위험이 있다. | ER/Ontology/MDD-MDA/DDD 좌표(섹션 10~13, 약 4개 절)를 1개의 비교 슬라이드로 압축하고 세부 문단은 강사 노트로 이동한다. |
| F9 | Minor | S04 | 완성 예제 3종(State Machine/Communication/Activity, [ooad-s04-detailed-design-approved-v3.md:1051-1082](ooad-s04-detailed-design-approved-v3.md:1051))과 Analysis Slice·Dynamic Model Landscape 개념 설명을 실습 제외 약 50~55분 안에 모두 소화해야 한다. | 세 다이어그램을 각각 제대로 설명하면서 동시에 Analysis Slice, Event/State/Transition/Guard, Static/Dynamic Cross-check까지 다루면 시간이 빠듯하다(경계). Critical하지는 않지만 Deck 단계에서 실제 소요시간 검증이 필요하다. | 3개 완성 예제를 개별 상세 슬라이드 대신 1장의 비교표(질문↔모델↔예제 스니펫)로 묶어 설명 시간을 줄인다. |
| F10 | Minor | S05 | 실습 별첨("관찰할 것", [ooad-s05-detailed-design-approved-v2.md:121-142](ooad-s05-detailed-design-approved-v2.md:121))은 일반적인 초기설계 패턴만 나열할 뿐, 본문 섹션 4~36에 "이제 당신의 S05 스냅샷으로 돌아가 이 질문을 적용해보라"는 명시적 지시가 없다. | 본문의 Boundary Question들이 학생 자신의 산출물이 아니라 매번 새로운 일반 Order 예시로 설명되므로, 학생이 자기 설계에 그 질문을 적용해보는 다리(bridge)가 비어 있다. | 섹션 21(또는 그 인근)에 "자신의 Initial Design에 이 질문을 적용해 메모하라"는 1문장 지시를 추가한다. |
| F11 | Minor | S03→S06 | S02·S03·S04는 "용어집"을 각각 9회, 9회, 17회 언급하지만 S05는 1회, S06은 0회다. | 용어집이 "지속적으로 갱신되는 공통 언어 자산"으로 강조되다가 Design 단계 진입과 함께 아무 설명 없이 사라진다. 의도된 종료(용어가 안정화되어 더 이상 갱신 불필요)인지 누락인지 문서만으로는 판단할 수 없다. | S05 도입부에 "용어집은 S04까지 안정화되었으며 이후 세션은 Design 어휘로 전환한다"는 1문장을 명시해 의도된 전환임을 밝힌다. |

---

## Session-by-Session Review

### 학습 흐름 추적표 (S02→S06)

| Session | Input | New Judgment | Output | Handoff |
|---|---|---|---|---|
| S02 | S01의 Analysis≠Phase / Essence·Accident 사고 틀(문서 산출물 없음) | Customer Need≠Requirement, Essential Problem/Solution Detail 분리, Event-centered requirement analysis, Actor Goal 기반 Use Case 판단 | 용어집(초안), Place Order Use Case Diagram + Specification, Required Domain State Change(개념) | "그 상태 변화의 구조를 어떻게 표현하고 검증할 것인가?" → S03 |
| S03 | S02 Use Case/Operation Contract/용어집 | Concept vs Attribute vs Software Class 구분, analysis-level Type/Value Domain 판단, Multiplicity를 업무질문으로 사용 | Place Order→Payment Conceptual/Analysis Domain Model, 정제된 용어집 | "이 구조 안에서 사건이 발생할 때 무엇이 상호작용하고 상태가 변하는가?" → S04 |
| S04 | S02 Use Case Spec + S03 Static Model | Domain-semantic Event 판별, Analysis Slice 선택, 질문에 맞는 Dynamic Model 선택 | Place Order Analysis Sequence Diagram(실습), State/Communication/Activity 완성 예제(강사 제공, 비실습) | "어떤 객체 경계 안에 배치해야 변경이 국소화되는가?" → S05 |
| S05 | S03 전체 Static Model + S04 전체 Dynamic Model | State+Behavior+Invariant+Change Reason 기반 Object Boundary 후보 판단(경험 기반, GRASP 미적용) | Initial Design Class Diagram(+ 독립설계 스냅샷) | "이 책임 후보를 실제 객체에 어떻게 배치하고 협력해야 하는가?" → S06 |
| S06 | 자신의 S05 Initial Design + S04 Sequence | Responsibility owner를 GRASP 언어로 재검토, Class↔Sequence 왕복 검증, Pattern을 대안 비교 언어로 사용 | Refined Design Class Diagram + Design Sequence Diagram | "계약/변화 요구 앞에서 이 책임과 협력이 흔들리는가?" → S07 |

### S01. OOAD 개요
- **역할:** 과정 전체 사고 틀 설정(Analysis≠Phase, Brooks Essence/Accident, Static/Dynamic 예고, 객체=상태+행위+책임 정의)
- **Input:** 없음(과정 진입점)
- **New Judgment:** Problem/Solution을 사고에서 구분, Static/Dynamic 관점의 필요성 인식
- **Output:** 산출물(Diagram/Model) 없음 — 판단 틀 자체가 산출물
- **Handoff:** "그렇다면 우리가 해결해야 할 문제와 요구를 어떻게 제대로 발견하고 정의할 것인가?" → S02
- **문제점:** Boehm/Standish Anchor의 Course Design 미등재(F3와 연동). 그 외 구조적 결함 없음.
- **판정:** 적정 (Anchor Provenance 문제는 F3에서 별도 추적)

### S02. 문제 발견과 요구 이해
- **역할:** Problem 발견/구조화, 용어집 시작, Use Case 산출
- **Input:** S01 판단 틀(문서 없음)
- **New Judgment:** Event-centered requirement analysis, Actor Goal 중심 Use Case 판단, Domain State Change 식별
- **Output:** 용어집, Place Order Use Case Diagram+Specification
- **Handoff:** S03로 명확히 연결됨
- **문제점:** F1(Running Example, Cancel Order 중심 본문), F2(Content Density), F3(Anchor Provenance), F4(Main Success Scenario/Flow 자기모순)
- **판정:** 경계 — 구조는 견고하나 본문 예시·밀도·용어 정합성에서 다수의 수정이 필요

### S03. 분석 정적 모델
- **역할:** Concept/Attribute/Relationship/Multiplicity/Whole-Part로 정적 Problem Understanding 구축
- **Input:** S02 Use Case+Operation Contract+용어집
- **New Judgment:** Concept≠Attribute≠Software Class 구분, Multiplicity를 업무 질문化, Whole-Part 의미 우선 판단
- **Output:** Conceptual/Analysis Domain Model(Place Order→Payment 범위), 정제된 용어집
- **Handoff:** S04로 명확히 연결됨. Design으로 넘어가지 않음(섹션 32 "Operation/Method를 넣지 않는 이유"에서 명시적으로 차단) — **경계 준수 우수**
- **문제점:** F1(cancelOrder Operation Contract가 Concept 발견의 구동 예시), F8(ER/Ontology/MDD-MDA/DDD 좌표 밀도, 문서 스스로 미해결로 이월)
- **판정:** 경계 — Analysis/Design 경계는 모범적으로 지켰으나 예시 선택과 밀도 문제가 남아 있음

### S04. 분석 동적 모델
- **역할:** Event/Analysis Slice/Dynamic Model Landscape로 동적 Problem Understanding 구축
- **Input:** S02 Use Case Spec + S03 Static Model
- **New Judgment:** Domain-semantic Event 판별, "판단이 어려운 부분만" Analysis Slice 선택, 질문에 맞는 모델 선택
- **Output:** Place Order Analysis Sequence Diagram(실습), 완성 예제 3종(비실습)
- **Handoff:** S05로 명확히 연결됨. Software Call Sequence로 내려가지 않음(섹션 16에서 명시적으로 차단) — **경계 준수 우수**
- **문제점:** F1이 가장 심각하게 드러나는 세션(본문 전체 Scenario·State Machine·Essence/Accident 예시가 Cancellation), F9(3개 완성예제+개념 밀도, 경계)
- **판정:** 경계~과다 — Analysis/Implementation 경계는 우수하나 Running Example 불일치가 4개 세션 중 가장 심함

### S05. 분석에서 객체 설계로 — 경험 기반 Initial Design
- **역할:** Analysis→Design 전환점, GRASP/RDD 이전의 경험 기반 1차 책임 배치
- **Input:** S03 전체 Static + S04 전체 Dynamic Model
- **New Judgment:** State+Behavior+Invariant+Change Reason 기반 Object Boundary 후보 판단
- **Output:** Initial Design Class Diagram(+ 독립설계 스냅샷, S06 재사용)
- **Handoff:** S06으로 명확히 연결됨. 실습을 본문 이론화보다 앞(1B)에 배치해 GRASP 선행 주입을 실습 자체에서는 차단 — **설계 의도 준수 우수**
- **문제점:** F1(Change Reason/Boundary Question 예시가 취소 규칙 중심), F6(실습 이후 본문이 GRASP 없는 GRASP를 상세히 가르쳐 S06 학습효과 희석 위험), F10(자기 스냅샷 재적용 지시 부재)
- **판정:** 경계 — 실습 배치 설계는 훌륭하나 본문 밀도가 S06과의 차별성을 위협함

### S06. 책임 설계 ① — RDD로 책임과 협력 보완
- **역할:** GRASP/RDD 언어로 S05 책임 배치를 재검토·재배치, Class↔Sequence 왕복 검증
- **Input:** 자신의 S05 Initial Design + S04 Sequence
- **New Judgment:** GRASP(Information Expert/Creator/Controller/High Cohesion/Low Coupling)를 대안 비교 언어로 사용
- **Output:** Refined Design Class Diagram + Design Sequence Diagram
- **Handoff:** S07로 명확히 연결됨. S07 Contract/Variation을 미리 소비하지 않음(Failure Conditions에 명시) — **경계 준수 우수**. Running Example도 S02~S05와 달리 Place Order 중심으로 정확히 지켜짐 — **강점**
- **문제점:** F5(실습 산출물 2개, 시간 대비 과다), F7(Role 개념 미교육)
- **판정:** 경계~과다 — Session 경계·Running Example 준수는 5개 세션 중 가장 우수하지만 실습 부담과 개념 완결성에 결함이 있음

---

## Practice Feasibility Review

| Session | 실제 작업량 | 15~30분 가능성 | 판정 | 필요한 축소 |
|---|---|---|---|---|
| S02 | Use Case Diagram 1개 + Specification 전체 항목(Precondition/Trigger/Main Flow/Alt·Exception 1~2개/Postcondition) | 8~10분(Diagram)+10~12분(Spec)+5~8분(LLM)=23~30분, 가능 | 적정 | 없음 |
| S03 | Concept(~5개)+Attribute+Type/Value Domain+Association+Multiplicity+필요한 Whole-Part | 8분+8분+5분+5~8분=26~29분, 가능(범위가 Place Order→Payment로 명확히 제한됨) | 적정 | 없음 |
| S04 | Analysis Sequence Diagram 1개(Place Order 범위) | 10분+5분+5~8분=20~23분, 가능 | 적정 | 없음 |
| S05 | 전체 Static+Dynamic Model을 근거로 Initial Design Class Diagram(Attribute+Responsibility) 작성 | 독립설계 15분은 5개 개념(Customer/Order/OrderItem/Product/Payment) 전체에 책임을 1차 배치하기에 타이트함 | 경계 | 실습 슬라이드에 "우선 Order/OrderItem/Payment 3개 핵심 객체에 집중" 같은 범위 힌트를 명시하거나 독립설계 시간을 18~20분으로 확대 |
| S06 | Refined Design Class Diagram + Design Sequence Diagram 2개, 상호 일관성 검증, Pattern 선택 근거 기록 | 25~30분에 2개 Diagram 작성은 다른 세션 대비 산출물 밀도 2배 | 과다 | F5 참조: Sequence 범위를 3~4개 message로 한정하거나 실습 시간을 35~40분으로 확대 |

---

## Cross-Session Consistency

- **Terminology:** 대체로 일관되나 S02 내부에서 "Main Success Flow" 확정 직후 실습 문구가 "Main Success Scenario"로 되돌아가는 자기모순 발견(F4). "Problem Baseline" 미사용, "용어집" 통일, DDD Ubiquitous Language 분리 원칙은 전 세션에서 정확히 지켜짐. "Communication Diagram" 명칭도 S04에서 일관되게 사용되고 "Collaboration Diagram"이라는 구용어는 등장하지 않음(양호).
- **Running Example:** F1 참조. S02~S05 4개 세션이 공식 baseline(Place Order→Payment)을 실습에서는 지키지만 본문 설명에서는 대부분 Order Cancellation/Refund로 이탈한다. S06만 본문·실습 모두 Place Order 중심을 유지한다.
- **Static/Dynamic:** S03의 Static Model과 S04의 Dynamic Model은 개념적으로는 동일한 Problem(Order/Payment/Refund/Shipment)을 다루지만, 그 Problem이 정작 두 세션의 공식 practice 범위(Place Order→Payment)보다 넓은 Cancellation 시나리오 중심으로 전개된다는 점에서 "같은 Problem Understanding"이라는 주장 자체는 내적으로 일관되지만 baseline과는 어긋난다(F1과 동일 근본 원인).
- **Analysis→Design Transition:** S05는 Concept→Class 1:1 변환을 명시적으로 여러 차례 차단하고(섹션 2, 18, 19, Failure Conditions), Static+Dynamic evidence를 함께 사용하도록 요구한다. 설계 의도대로 "경험 기반 Initial Design"이 되도록 구성되어 있다 — 이 부분은 결함 없음.
- **S05→S06 Before/After:** 구조적 장치(스냅샷 보존, S06 도입부에서 S05 모델의 문제를 관찰하는 절차)는 존재하지만, F6에서 지적한 대로 S05 본문이 이미 상세한 판단 절차를 제공해 실질적 "AFTER" 효과가 희석될 위험이 있다.

---

## Duplication / Gap Matrix

| 유형 | 위치 | 내용 | 의도된 것인가 |
|---|---|---|---|
| Duplication 위험 | S05 섹션 22~33 vs S06 섹션 8(GRASP) | Boundary Question(누가 상태를 소유/누가 Rule을 아는가/누가 불변조건을 보호하는가)이 Information Expert/Creator/Protected Variations와 사실상 동일한 판단을 이름 없이 선행 | 아니오 — 설계 의도(S05는 GRASP 미적용)와 충돌 위험(F6) |
| Duplication(의도됨, 문제 없음) | S06 섹션 10 "S05 Initial Design 회수" | S05 모델의 문제(Data-only Class 등)를 다시 나열 | 예 — 명시적 recall이며 새로운 설계를 만들지 않음 |
| Gap | S05 본문 전체 | Boundary Question을 학생 자신의 S05 스냅샷에 적용하라는 명시적 지시 부재(F10) | 아니오 — 누락으로 판단 |
| Gap | S05(1회)→S06(0회) | 용어집 언급이 급격히 사라짐, 전환에 대한 설명 없음(F11) | 불명확 — 의도된 종료인지 확인 필요 |
| Gap(이월, 문서 자체 인지) | S03 "Whole-Curriculum Integration 단계로 이관한 조정 항목" | ER/Ontology/MDD-MDA/DDD 밀도, Value Domain 깊이, Generalization/Specialization 포함 여부, 75분 실제 진행 밀도 4건이 승인본임에도 미해결(F8) | 예 — 문서가 스스로 명시했으나 이번 중간평가 시점까지 미해결 |
| Gap | S06 | "Role" 개념이 Architecture/Course Design 상 약속되었으나 정의·판단질문 없이 이름만 반복(F7) | 아니오 — 누락으로 판단 |

---

## Recommended Minimal Patch Set

### 반드시 수정 (S07 착수 전 필수)

1. **F1** — S02(Event–Response List, Use Case Specification 예시), S03(Operation Contract 구동 예시, 용어집 예시), S04(Scenario, State Machine, Essence/Accident 예시), S05(Change Reason·Boundary Question 예시)의 본문 worked example을 Place Order→Payment로 교체하고, Cancellation은 세션당 1~2회 짧은 언급으로 축소한다.
2. **F4** — S02 1035행 "Main Success Scenario"를 "Main Success Flow"로 수정한다.
3. **F5** — S06 실습의 Design Sequence Diagram 범위를 제한하거나 실습 시간을 재산정한다.
4. **F7** — S06에 "Role" 정의 절을 추가하거나, Architecture/Course Design의 Role 표현을 Responsibility로 통합 정리한다.

### 선택적 개선

1. **F2/F3** — S02의 Anchor 수를 줄이거나 Course Design Anchors 표에 8개 Anchor를 정식 등재(Upward Feedback 절차)한다.
2. **F6** — S05 섹션 22~33을 2~3개 핵심 질문으로 압축하고 나머지는 S06으로 이관한다.
3. **F8** — S03의 ER/Ontology/MDD-MDA/DDD 좌표 절을 1개 비교 슬라이드로 압축한다.
4. **F9** — S04의 완성 예제 3종을 비교표 1장으로 통합한다.
5. **F10, F11** — S05에 자기 스냅샷 재적용 지시 1문장, S05 도입부에 용어집 전환에 대한 1문장을 각각 추가한다.

---

*Source 문서(7개 review 대상 파일, course-design.md, ooad-curriculum.md, 커리큘럼 작성 지침)는 수정하지 않았다. 본 보고서 파일만 신규 생성했다.*
