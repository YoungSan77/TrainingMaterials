# S02. 문제 발견과 요구 이해

- **시간:** 90분
- **권장 슬라이드:** 43장 전후
- **허용 범위:** 40~46장

## 과정 목표

학습자는 이 세션을 통해 다음을 이해하고 적용한다.

- 고객의 요구와 요구사항을 명확하게 구분한다.
- 고객과 개발자 모두 처음부터 완전한 요구사항을 알고 있지 않음을 이해한다.
- 요구를 발견·분석·검증하여 요구사항으로 구체화한다.
- 문제의 본질적 복잡성과 solution detail을 구분하여 요구를 이해한다.
- Analysis를 별도 단계가 아니라 Problem과 Solution을 구분하는 사고 활동으로 적용한다.
- 요구사항 문장뿐 아니라 필요한 정적·동적 분석 관점이 Problem Understanding의 신뢰도를 높인다는 것을 이해한다.
- 좋은 요구사항의 자격과 주요 요구사항 유형을 구분한다.
- 기능 요구사항과 품질 요구사항을 함께 고려한다.
- Interview, Observation, Workshop, Prototype을 목적에 맞게 선택한다.
- Requirement Discovery부터 **용어집**을 만들고 용어의 의미·동의어·금칙어·경계를 합의하며 지속적으로 갱신한다.
- **Event-centered requirement analysis**로 의미 있는 Event → Context / Condition → Required Response → Observable Outcome / Domain State Change → Stakeholder Value를 추적하고, Event–Response List·Use Case·User Story·Domain Event가 이 관점을 서로 다른 방식으로 활용한다는 것을 설명한다.
- Use Case의 본질과 구성요소를 이해하고 Diagram과 Specification을 작성한다.
- Use Case Specification → SSD → System Operation → Operation Contract로 요구를 분석한다.
- User Story와 Use Case의 역할을 구분한다.
- Acceptance Criteria와 BDD Example을 통해 요구를 검증 가능한 형태로 구체화한다.

---

# 1. 고객 요구에서 요구사항으로

**목표:** 고객이 말한 요구와 분석·검증된 요구사항을 구분하고, 요구사항 정의를 학습 과정으로 이해한다.

## 고객 요구 ≠ 요구사항

고객이 말하는 것은 중요한 출발점이지만 그 자체가 곧 Requirement는 아니다.

```text
Customer Need / Request
        ↓
Discovery
        ↓
Analysis
        ↓
Validation
        ↓
Requirement
```

고객이 말하는 것은 다음과 같은 형태일 수 있다.

- 해결하고 싶은 문제
- 불편
- 기대
- 아이디어
- 원하는 기능
- 기대하는 결과

여기에는 아직 다음과 같은 불확실성이 존재할 수 있다.

- 정말 필요한가?
- 실제 문제를 해결하는가?
- 다른 요구와 모순되지 않는가?
- 현실적으로 가능한가?
- 사용자가 실제로 어떻게 사용할 것인가?
- 더 나은 solution은 없는가?

핵심:

> **고객의 요구는 Requirement의 정답이 아니라 Requirement Discovery의 입력이다.**

## Brooks — 고객도 처음부터 완전한 요구를 모른다

Frederick P. Brooks Jr.의 문제의식을 Anchor로 사용한다.

> **“The client does not know what he wants.”**

핵심은 고객의 능력 부족이 아니다. 복잡한 SW에서는 고객도 실제 solution을 보고 사용하고 경험하기 전까지 자신이 정말 필요한 것이 무엇인지 완전히 알기 어렵다.

```text
What customer says
        ≠
What customer actually needs
        ≠
Best solution
```

(Bezos·von Neumann·Lean의 관련 메시지는 이 Session 뒤쪽의 "공통 결론" 슬라이드에서 함께 다룬다.)

따라서 요구사항은 처음부터 완전한 형태로 존재하는 답을 받아 적는 것이 아니라:

> **발견하고, 시험하고, 학습하고, 정제하는 대상**

이다.

## Brooks — Essential Problem과 Solution Detail을 분리한다

S01에서 소개한 Brooks의 `Essence / Accident` 관점을 요구 분석에 적용한다.

고객이 말하는 문장에는 다음이 섞여 있을 수 있다.

```text
Problem / Need
+ Business Rule
+ Expected Result
+ Suggested Solution
+ UI / Technology Detail
```

분석의 목적은 이들을 모두 없애는 것이 아니다. 먼저 구분하여 **무엇이 반드시 해결되어야 하는 본질적 문제인지**를 확인하는 것이다.

예:

```text
"고객이 주문하기 버튼을 눌러
orders 테이블에 새 row를 INSERT한다."
```

이 문장을 그대로 Requirement로 확정하면 다음이 결합된다.

```text
Essential Need
고객은 원하는 상품을 주문할 수 있어야 한다.

        +

Solution Detail
주문하기 Button
orders table
INSERT
```

핵심:

> **Requirement를 구체화한다는 것은 Solution을 일찍 고정하는 것이 아니라 Essential Problem을 더 정확하게 이해하는 것이다.**

S02에서 Use Case, SSD, Operation Contract를 사용하는 중요한 이유도 **외부에서 필요한 행위와 결과를 내부 구현 결정으로부터 분리하기 위해서**다.

요구사항 문제를 고객에게만 돌릴 수도 없다. 개발자도 처음에는 업무와 예외를 충분히 모르고, 자신의 assumption을 사실처럼 받아들일 수 있다(von Neumann의 관련 메시지도 "공통 결론" 슬라이드에서 다룬다).

---

# 2. 요구사항은 언제 확정할 것인가

**목표:** 너무 늦은 발견과 너무 이른 확정이 모두 재작업을 만든다는 것을 이해한다.

## Too Late vs Too Early

S01에서 다룬 Boehm을 짧게 회수한다.

```text
Too Late
Late Discovery
     ↓
Downstream Change
     ↓
Rework
     ↓
Higher Cost
```

반대쪽 문제도 있다.

```text
Too Early
정보가 부족하다
        ↓
추측을 상세하게 정의한다
        ↓
Requirement로 확정한다
        ↓
개발하면서 새롭게 알게 된다
        ↓
Requirement Change
        ↓
Rework
```

따라서 문제는 단순히 “빨리 정하느냐 늦게 정하느냐”가 아니다.

> **충분한 정보를 얻기 전에 확정하지 않고, 필요한 정보를 얻은 뒤에는 책임 있게 결정한다.**

(Lean Software Development의 `Decide as Late as Possible` 관련 메시지도 "공통 결론" 슬라이드에서 함께 다룬다.)

## Requirement Change의 두 종류

모든 요구 변경을 하나로 보지 않는다.

### 실제 환경 변화

- 시장 변화
- 법규 변경
- 정책 변경
- 경쟁 환경 변화
- 새로운 Business Goal

### 학습에 의한 변화

- 실제 사용 후 새로운 필요를 발견
- Prototype을 보고 잘못된 가정을 발견
- 개발 과정에서 새로운 제약을 발견
- 고객과 개발자가 문제를 더 잘 이해하게 됨

따라서:

> **Requirement Change = 고객 변심**

으로 단순화하면 안 된다.

## Predictive vs Iterative / Agile — Analysis는 사라지지 않는다

Predictive lifecycle에서는 분석이 명시적인 단계와 baseline 활동으로 보일 수 있다.

```text
Elicit → Analyze → Specify → Validate → Baseline → Design / Build
```

요구가 충분히 알려져 있고 안정적이라면 명확한 baseline은 유용하다.

문제는 높은 불확실성에서도 **아직 모르는 것을 완전히 알고 있는 것처럼 상세화하고 확정하는 경우**다.

Iterative / Agile에서는 분석·설계·구현이 작은 범위에서 함께 반복된다.

```text
Discover
   ↓
Analyze ↔ Design ↔ Build ↔ Test / Use
   ↑                         ↓
   └──── Feedback / Learn ───┘
```

여기서 중요한 것은 `Analysis Phase`의 존재 여부가 아니다.

> **Analysis는 Problem을 Solution과 구분하여 이해하는 사고 활동이며, iteration 안에 설계와 통합되어도 그 질문은 사라지지 않는다.**

따라서:

> **Process에서는 Analysis와 Design을 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

핵심 차이는 요구 변경을 허용하느냐가 아니라 **현재 구현 결정을 내릴 만큼 문제에 관한 지식이 충분한가를 어떻게 확인하는가**다.

## Requirement Baseline과 Problem Understanding

Requirement 문장을 작성하고 승인했다고 해서 문제 이해가 충분하다고 볼 수는 없다.

복잡하거나 위험한 요구에서는 최소한 다음 질문이 일관되어야 한다.

```text
Requirement / Scenario
        ↓
What must happen?
        ↓
What exists and is related?
        ↓
What changes and interacts?
```

이를 과정의 논리로 표현하면:

```text
Requirement / Scenario
        +
Static Understanding
        +
Dynamic Understanding
        ↓
Problem Understanding
        ↓
Sufficient Evidence for Commitment / Baseline
```

여기서 `Problem Understanding`은 별도 문서 세트를 반드시 만들라는 뜻이 아니다.

> **구현과 독립적으로 무엇을 해결해야 하는지에 대해 검토 가능한 공통 이해를 확보한 상태**

를 의미한다.

Predictive에서는 formal requirement baseline의 일부 evidence가 될 수 있고, Iterative / Agile에서는 refined backlog item, acceptance criteria, 필요한 분석 모델과 함께 현재 iteration의 commitment 근거가 될 수 있다.

S02에서는 필요한 System Behavior와 Domain State Change까지 명확히 한다. 그 상태 변화가 일어나는 **정적 구조와 동적 행위를 구체적으로 모델링하는 것은 S03·S04에서 이어간다.**

## 공통 결론 — 다섯 근거를 한 장에 모은다

Boehm·Standish·Bezos·von Neumann·Lean을 각각 별도 section으로 다시 가르치지 않고, 이미 사용한 근거를 한 슬라이드에 모아 하나의 결론으로 묶는다.

- **Boehm** — 결함을 늦게 발견할수록 재작업 비용이 커질 수 있다(S01에서 다룬 재작업 비용 데이터를 다시 부른다).
- **Standish** — 요구된 기능이 곧 필요한 기능은 아니다(S01에서 다룬 미사용 기능 비율을 다시 부른다).
- **Bezos** — **“Even when they don’t yet know it, customers want something better.”**
- **von Neumann** — **“There’s no sense in being precise when you don’t even know what you’re talking about.”**
- **Lean** — 요구사항 변경은 그것을 너무 일찍 작성했기 때문에 발생하기도 한다 (`Decide as Late as Possible`).

> **요구사항은 가능한 한 빨리 많이 확정하는 것이 목적이 아니다. 필요한 것을 발견하고 불확실성을 관리하며, 필요한 시점에 필요한 수준으로 구체화한다.**

**Slide Notes:** Boehm·Standish의 정확한 수치와 출처는 S01에서 이미 확정했으므로 여기서 새 수치를 만들지 않고 재호출만 한다. Bezos·von Neumann·Lean 인용은 이 Session에서 처음 사용하는 원문 그대로이며 별도 수치를 추가하지 않는다. 각 근거의 배경 설명은 강사 구두 설명으로 보완하고, 본 슬라이드는 다섯 근거를 나열해 하나의 결론으로 묶는 데 집중한다.

---

# 3. 좋은 요구사항이란 무엇인가

## ISO/IEC/IEEE 29148 — 개별 요구사항의 자격

ISO/IEC/IEEE 29148은 개별 요구사항이 갖춰야 할 자격을 정의한다. 대표적으로 **Necessary·Unambiguous·Complete·Feasible·Verifiable**을 꼽을 수 있다.

핵심:

> **좋은 요구사항은 많이 쓰거나 자세하게 쓰는 것이 아니라, 필요하고 명확하며 검증 가능하게 쓰는 것이다.**

## 요구사항의 유형

```text
Business Requirement
        ↓
Stakeholder / User Requirement
        ↓
System / Software Requirement
        ├─ Functional Requirement
        ├─ Quality Requirement
        └─ Constraint
```

핵심:

> **Use Case는 모든 Requirement를 표현하는 도구가 아니다.**

주로 Actor Goal과 Functional Behavior를 분석하는 데 사용한다.

## ISO/IEC 25010:2023 — Product Quality Model

ISO/IEC 25010은 **Functional Suitability, Performance Efficiency, Reliability, Security, Maintainability** 등 9개 품질 특성으로 Quality Requirement의 범위를 넓게 확인하게 한다.

S02에서는 품질속성을 놓치지 않기 위한 요구사항 관점까지만 다룬다. 품질속성의 정량화, architectural driver, trade-off는 SW Architecture 과정으로 넘긴다.

---

# 4. 요구사항 수집과 발견

## 요구사항 수집·발견

먼저 확인한다.

- 무엇을 모르는가?
- 누가 알고 있는가?
- 누구에게 물어야 하는가?
- 무엇을 직접 봐야 하는가?
- 무엇을 만들어 보여줘야 하는가?

핵심:

> **기법을 먼저 선택하지 말고 줄여야 할 불확실성을 먼저 찾는다.**

## 수집 방법의 선택

| 방법 | 잘 알 수 있는 것 | 주의할 점 |
|---|---|---|
| Interview | 목표, 규칙, 예외, 판단 이유 | 말한 내용과 실제 행동이 다를 수 있음 |
| Observation | 실제 업무, 암묵지, 우회 절차 | 관찰만으로 의도를 알기 어려울 수 있음 |
| Workshop | 이해관계 충돌, 범위, 용어, 우선순위 | 강한 이해관계자에게 논의가 편향될 수 있음 |
| Prototype | 표현하기 어려운 요구와 interaction | Prototype을 확정 solution으로 오해할 수 있음 |

## Prototype — 보여주면서 요구를 발견한다

> **말과 문서만으로 알 수 없는 Requirement를 보면서 발견하고 검증하는 것**

```text
Assumption → Prototype → See / Use → Feedback → Learn → Requirement Refinement
```

## Wireframe + 복잡한 업무 화면

### Wireframe
- 정보 구조
- 주요 입력/출력
- Navigation
- 주요 Action
- Interaction Flow

### 복잡한 업무 화면
- 동시에 필요한 정보
- 업무 판단 순서
- 상태별 가능한 Action
- Exception
- 정보 간 관계

핵심 질문:

> **실제로 이 화면으로 업무를 수행할 수 있는가?**

## Report Prototype

확인 항목:

- 지표
- 산식
- 집계 기준
- 기간
- 비교 기준
- Drill-down
- 정렬·필터
- 의사결정 목적

> **Sample Report / Mock Report 자체가 Requirement Discovery 도구가 된다.**



## 용어집 — 요구사항 정의의 기본 자산

Requirement를 정의할 때는 기능이나 Diagram보다 먼저 **같은 말을 같은 의미로 쓰는가**를 확인해야 한다.

Interview, Observation, Workshop, Prototype, 기존 문서와 업무 대화에서 반복되는 용어를 수집하여 용어집을 시작한다.

예:

```text
Order
Customer
OrderItem
Product
Payment
Order Status
Payment Status
```

단순 단어 목록으로 끝내지 않는다.

최소한 다음을 합의한다.

| 항목 | 질문 |
|---|---|
| Term | 우리가 실제로 사용하는 핵심 용어는 무엇인가? |
| Meaning | 이 Context에서 정확히 무엇을 뜻하는가? |
| Synonym / Alias | 같은 의미로 다른 표현을 쓰고 있는가? |
| Ambiguous / Forbidden Term | 여러 의미로 쓰여 피해야 할 표현은 무엇인가? |
| Boundary / Context | 이 용어의 의미가 적용되는 범위는 어디까지인가? |
| Example / Counterexample | 무엇이 해당되고 무엇이 해당되지 않는가? |

핵심:

> **용어집은 문서 끝에 붙이는 사전이 아니라 Requirement Discovery와 Analysis를 가능하게 하는 공통 언어 자산이다.**

관련 개념은 조직과 방법론에 따라 `Glossary`, `Data Dictionary`, `Domain Vocabulary`, `Ubiquitous Language` 등으로 불릴 수 있다. **이 과정에서는 학습자 혼란을 줄이기 위해 공통 산출물 명칭을 `용어집`으로 통일한다.** 다른 명칭은 해당 방법론이나 역사적 맥락을 설명할 때만 소개한다.

DDD의 `Ubiquitous Language`는 `용어집`과 동일한 명칭으로 취급하지 않고, 이후 DDD 과정에서 별도의 핵심 개념으로 더 엄격하게 다룬다. S02에서는 먼저 **요구를 이해하고 합의하기 위한 공통 언어를 지속적으로 관리한다**는 원칙에 집중한다.

용어집은 고정 산출물이 아니다.

```text
Discovery
   ↓
용어 후보
   ↓
Requirement / Scenario
   ↓
Static / Dynamic Analysis
   ↓
의미 충돌·누락 발견
   ↓
용어집 수정
```

따라서 S03·S04에서 모델이 새로운 의미 차이 또는 모호함을 드러내면 용어집도 다시 수정한다.


## Event-centered requirement analysis — Event에서 요구를 구조화한다

복잡한 Problem을 처음부터 기능 목록으로 나열하지 않고, 의미 있는 Event를 중심으로 다음 질문을 추적하여 요구를 구조화한다.

```text
Who / What triggers?
        ↓
Meaningful Event
        ↓
Condition / Context
        ↓
Required Response
        ↓
Observable Outcome / Domain State Change
        ↓
Stakeholder Value
```

이를 이 과정에서는 **Event-centered requirement analysis**라고 부른다.

목적은 **기능 이름을 먼저 만드는 것이 아니라, 어떤 사건에 대해 System/Domain이 왜 어떤 반응을 해야 하며 어떤 Outcome/Value가 필요해지는지 발견하는 것**이다.

### Analysis Event는 Domain-semantic Event다

Event-centered requirement analysis에서 Event는 **현재 선택된 UI·API·message mechanism·database operation이 아니라 Problem / Domain에서 의미 있는 사건**으로 표현한다.

```text
주문하기 button clicked
        ↓ normalize
Customer places order

REST endpoint called
        ↓ normalize
Order requested

Kafka message received
        ↓ normalize
Payment confirmed

DB row updated
        ↓ normalize
Order became paid
```

따라서 다음을 구분한다.

```text
Meaningful Event
≠ UI Gesture
≠ API Call
≠ Message / Protocol
≠ DB Change

Meaningful Event
= Problem / Domain에서 의미 있는 사건
```

핵심 질문:

> **이것은 Domain에서 의미 있는 Event인가, 아니면 그 Event를 전달·표현·구현하기 위해 현재 선택한 UI 또는 기술 mechanism인가?**

단, 특정 UI·장치·protocol 자체가 법적·물리적·운영상 Requirement/Constraint라면 무조건 제거하지 않는다. 그 경우에는 **선택된 구현 detail인지, Problem을 실제로 제약하는 legitimate constraint인지**를 구분한다.

### Yourdon — Event List / Event–Response의 기반

Structured Analysis의 essential requirements 관점에서는 System이 반응해야 하는 Event를 먼저 식별하고 Event와 Response를 연결한다.

Event는 사람 Actor의 요청에만 한정되지 않는다.

- **External / Business Event** — Customer가 상품을 주문하기로 결정한다.
- **Signal / External System Event** — 결제 시스템이 결제 완료를 알린다.
- **Temporal Event** — 결제 기한이 만료된다.

따라서 공통 질문은 `특정 사용자`보다 넓게 잡는다.

> **누가 또는 무엇이 의미 있는 Event를 발생시키며, 그때 System/Domain은 어떤 Response를 해야 하는가?**

간단한 Event–Response List:

| Event | Context / Condition | Required Response / Outcome |
|---|---|---|
| Customer requests order | Selected item in stock | 주문을 생성하고 총액을 계산한다 |
| Customer requests order | Selected item out of stock | 주문 생성을 거부하고 재고 부족을 알린다 |
| Order total determined | Order created | Payment를 요청한다 |
| Payment completed | Payment requested | Payment 완료 상태를 반영한다 |

이 표는 상세 설계가 아니다. **Essential Problem을 행동 단위로 빠르게 훑고 누락 Event를 찾는 분석 도구**다.

### Use Case와의 연결

Use Case는 Event–Response를 그대로 표로 유지하는 대신 **Primary Actor의 Goal**을 중심으로 관련 Event와 System Behavior를 하나의 가치 있는 흐름으로 조직한다.

```text
Primary Actor
    ↓
Goal
    ↓
Initial Event
    ↓
Main / Alternative / Exception Flow
    ↓
Observable Result of Value
```

따라서 Event List와 Use Case는 동일한 기법이 아니지만 다음 질문을 공유한다.

> **누가 무엇을 계기로 System과 상호작용하며, System은 어떤 가치 있는 결과를 제공해야 하는가?**

### User Story와의 연결

User Story의 본질은 Event–Response 명세가 아니라 **Role · Value · Conversation을 위한 작은 요구 단위**다.

그러나 Story를 구체화할 때 다음 질문은 유용하다.

```text
어떤 Role에게?
어떤 Event / Situation에서?
무엇이 필요하며?
어떤 Outcome / Value가 기대되는가?
```

즉 User Story를 Event–Response 기법과 동일시하지 않되, **Trigger와 기대 결과를 묻는 관점으로 Story의 모호함을 줄일 수 있다.**

### Domain Event와의 연결

`Domain Event`는 요구사항 표현 형식 자체가 아니라 **Domain에서 의미 있게 발생한 사건**을 나타내는 개념이다.

S02에서는 DDD Pattern을 가르치지 않는다. 다만:

```text
External / Business Event
        ↓
Required System Response
        ↓
Domain에서 의미 있는 사건·상태 변화
```

라는 연결만 소개한다.

예:

```text
Customer places order
        ↓
System must process order
        ↓
Order created / Payment required
```

이 연결은 S02의 `System Event → System Operation → Operation Contract → Required Domain State Change`와 S04의 Dynamic Analysis를 자연스럽게 잇는다.

### 교육적 정리

Event–Response List, Use Case, User Story, Domain Event는 서로 같은 기법이나 동일 계보가 아니다.

그러나 **Event-centered requirement analysis**라는 공통 관점에서 요구를 기능 목록으로 시작하지 않고 다음 질문으로 구조화할 수 있다.

> **어떤 Event가 발생했는가? 어떤 Context에서인가? 무엇이 반응해야 하는가? 어떤 결과와 가치가 필요해지는가?**


---

# 5. Use Case — 필요한 기능에 집중한다

## 왜 Use Case인가

기능 중심 질문:

> **“우리 시스템에는 어떤 기능이 있어야 하는가?”**

Use Case 질문:

> **“이 Actor는 시스템을 이용하여 어떤 Goal을 달성하려 하는가?”**

```text
Specific Actor
      ↓
Actor's Goal
      ↓
필요한 Event
      ↓
필요한 System Behavior
      ↓
필요한 기능
```

따라서 특정 Actor의 관점에서 Goal 달성에 필요한 Event와 System Behavior를 추적하여 **사용 목적과 직접 관계없는 기능을 최소화할 수 있다.**

## Use Case 정의

> **Actor가 System을 사용하여 가치 있는 Goal을 달성하기 위해 필요한 System Behavior**

핵심 요소:

- Actor
- Goal
- System
- Behavior

## Use Case의 본질은 Text다 — Larman

> **Use Case ≠ Use Case Diagram**

```text
Use Case Diagram
= Overview / Map

Use Case Text
= Behavior / Requirement Detail
```

Diagram을 그리는 것이 Use Case 분석의 본질이 아니다.

## Actor — 정의와 식별

Actor는 **System과 상호작용하는 외부 Role**이다.

예:

- Customer
- Administrator
- Payment Gateway
- External System
- Scheduler

식별 질문:

- 누가 시스템을 사용하는가?
- 누가 정보를 제공하는가?
- 누가 결과를 받는가?
- 어떤 외부 시스템과 상호작용하는가?
- 어떤 외부 사건이 System Behavior를 시작하는가?
- 누가 어떤 Goal을 달성하려 하는가?

## System Boundary

> **무엇을 우리가 분석하고 만들 System으로 볼 것인가?**

Boundary 안은 분석 대상 System의 책임, Boundary 밖은 Actor와 External System이다.

## Association

> **어떤 Actor가 어떤 Use Case에 참여하는가**

를 보여준다. 업무 흐름, 데이터 흐름, 호출 순서를 의미하지 않는다.

## Use Case Diagram

```text
Actor
   │
   │ Association
   ▼
┌─────────────────────────┐
│      System Boundary    │
│                         │
│       (Use Case)        │
│                         │
└─────────────────────────┘
```

목적:

- System Boundary 확인
- 주요 Actor 확인
- Actor Goal 확인
- 전체 Use Case 범위 확인

## Order Use Case Diagram

예:

- Customer → Place Order
- Customer → Check Order Status
- Customer → Pay Order 또는 결제 interaction
- Payment Gateway → 결제 결과 전달
- Administrator → Manage Order

핵심은 각 Actor에게 실제 필요한 Goal이 무엇인가를 확인하는 것이다.

## Use Case Diagram 작성 방법

```text
1. System Boundary 결정
2. Actor 식별
3. Actor Goal 식별
4. Goal을 Use Case로 정의
5. Association 연결
6. Scope / Level 검토
```

좋은 Use Case인지 확인한다.

- Actor에게 가치 있는 결과인가?
- Actor의 Goal인가?
- 단순 UI action은 아닌가?
- 내부 implementation operation은 아닌가?
- 너무 작은 기능으로 잘게 쪼갠 것은 아닌가?

좋은 예:
- Place Order
- Check Order Status
- Pay Order

부적절한 수준:
- Click Submit Button
- Validate Product ID
- Insert Order Row

---

# 6. Use Case Specification — Text로 요구를 정의한다

## Use Case Specification

> **Use Case Diagram을 완성했다고 Use Case 분석이 끝난 것이 아니다.**

필요에 따라 다음을 정의한다.

- Use Case Name
- Scope
- Primary Actor
- Stakeholders / Interests
- Preconditions
- Trigger
- Main Success Scenario
- Alternative Flows
- Exception Flows
- Postconditions

## Main Success Scenario + 좋은 Scenario 작성법

예: `Place Order`

1. Customer가 상품과 수량을 선택하여 주문을 요청한다.
2. System은 선택된 상품과 수량을 확인한다.
3. System은 주문을 생성하고 총액을 계산한다.
4. System은 결제를 요청한다.
5. System은 결제 성공을 반영한다.
6. System은 주문 완료 결과를 Customer에게 알린다.

```text
Actor Action → System Response → Actor Action → System Response
```

다음은 쓰지 않는다.

- Controller
- Service
- Repository
- Database
- Table
- Design Pattern

> **Use Case Text는 구현 방법이 아니라 외부에서 관찰 가능한 System Behavior를 기술한다.**

## Alternative Flow / Exception Flow

Main Success Scenario와 다른 의미 있는 경로를 정의한다.

예:

- 재고가 부족한 상품이 포함됨
- 결제가 실패함
- 유효하지 않은 상품이 포함됨

## Flow와 Scenario

### Flow
Use Case Specification에 정의된 가능한 행동 경로.

### Scenario
정의된 Flow를 따라 실제 한 번 수행되는 **구체적인 실행 인스턴스**.

다만 이 과정에서는 Use Case Specification의 주 경로를 가리키는 고유 명칭으로 **Main Success Scenario**를 사용한다. 표 등 축약이 필요한 곳에서는 `Main Success`로 줄여 쓸 수 있다.

---

# 7. Use Case에서 분석 모델로

S01에서 Analysis를 Problem과 Solution을 구분하는 사고 활동으로 정의했다. 이제 Use Case의 외부 행위를 내부 구현으로 바로 변환하지 않고, **문제영역에서 어떤 변화가 요구되는지**까지 분석한다.

이때 `Domain`은 특정 DDD Pattern을 뜻하지 않는다.

> **Domain은 SW가 해결하려는 문제와 업무의 세계다.**

S02에서는 Domain의 개념 구조를 본격적으로 모델링하지 않는다. `Domain State Change`까지 식별하고, 그 의미 구조는 S03의 분석 정적 모델로 넘긴다.

## SSD — System Sequence Diagram

```text
Customer             Order System
   |                       |
   | placeOrder(items)     |
   |---------------------->|
   |                       |
   | orderConfirmation     |
   |<----------------------|
```

System은 하나의 **Black Box**다. 내부 객체 interaction을 그리지 않는다.

## System Event와 System Operation

`placeOrder(items)`와 같은 Actor의 의미 있는 요청을 System Event로 보고, 이에 대응해 System이 제공해야 하는 행위를 System Operation으로 식별한다.

아직 어떤 객체가 구현할지는 결정하지 않는다.

## Operation Contract

질문:

> **System Operation이 완료되면 문제영역에서 무엇이 달라져 있어야 하는가?**

예:

- Order가 생성된다.
- 선택된 OrderItem들이 Order와 연관된다.
- Order 총액이 결정되고 Payment가 요청된다.

> **What changed, not how implemented.**

이 구분은 Brooks의 `Essence / Accident`를 실무적으로 적용하는 지점이다.

- `What changed?` — 문제영역에서 필요한 결과와 상태 변화
- `How implemented?` — 객체, DB, API, framework와 같은 solution decision

S02에서는 전자를 먼저 명확히 하고 후자를 아직 결정하지 않는다.

## 요구 분석의 전체 연결

```text
Use Case Diagram
        ↓
Use Case Specification
        ↓
Main / Alternative / Exception Flow
        ↓
SSD
        ↓
System Event
        ↓
System Operation
        ↓
Operation Contract
        ↓
Required Domain State Change
        ↓
Analysis Model
 ├─ Static View — 무엇이 존재하고 어떤 관계인가?
 └─ Dynamic View — 무엇이 일어나고 어떻게 변하는가?
```

S02는 `Required Domain State Change`까지 도달한다. S03·S04의 정적·동적 모델은 별도의 Waterfall 단계가 아니라, **이 요구를 구현 결정과 분리해 충분히 이해했는지 검증하는 다음 분석 관점**이다.

---

# 8. User Story

## User Story의 역할

> **사용자 가치 중심의 작은 요구 단위이며 Conversation의 출발점**

```text
As a <role>
I want <goal>
so that <value>
```

템플릿보다 사용자 가치, 작은 요구 단위, Backlog, Conversation, 점진적 상세화가 핵심이다.

## Use Case와 User Story

| 관점 | Use Case | User Story |
|---|---|---|
| 중심 | Actor Goal과 System Behavior | 사용자 Value와 작은 요구 단위 |
| 본질 | Text Specification | Conversation을 위한 Backlog Item |
| 상세화 | Main/Alternative/Exception Flow | Acceptance Criteria |
| 적합 | 복잡한 interaction과 업무 흐름 | 점진적인 가치 전달 |
| 위험 | 과도한 문서화 | Story 한 줄을 완전한 Requirement로 착각 |

---

# 9. Acceptance Criteria와 BDD

## Acceptance Criteria

> **해당 Requirement 또는 Story가 충족됐다고 판단할 수 있는 조건**

예:

- 재고가 있는 상품만 주문할 수 있다.
- 결제가 완료되어야 주문이 확정된다.
- 결제가 실패하면 주문은 확정되지 않는다.

## BDD / Example

BDD는 `Given / When / Then` 문법을 배우는 것이 목적이 아니다.

```text
Given
재고가 있는 상품을 선택한 주문

When
고객이 결제를 완료하면

Then
주문은 결제 완료 상태가 된다
```

핵심:

> **Concrete Example을 통해 Requirement를 함께 이해하고 검증한다.**

---

# 10. [실습] Place Order Use Case 작성 (25~30분)

> **본편 실습 슬라이드는 1장만 사용한다.** 아래 세부 진행은 Slide Notes에 두고, 예시 답안·해설은 Session 마지막 `[별첨]`으로 분리한다.

## 실습 슬라이드 — 수강생에게 보이는 내용

**입력**

고객은 하나 이상의 상품과 수량을 선택하여 주문한다. 시스템은 주문을 생성하고 주문 총액을 계산한다. 고객은 주문 금액을 결제하며 결제가 성공하면 주문의 결제 완료 상태가 반영된다.

**과제**

1. `Place Order`를 중심으로 **Use Case Diagram**을 작성한다.
2. `Place Order`의 **Use Case Specification**을 작성한다: Use Case Name, Primary Actor, Trigger, Precondition, Main Success Scenario, 주요 Alternative/Exception, Postcondition.
3. LLM에게 누락된 Actor/interaction, 과도한 기능, UI/API/DB 등 Solution Detail 여부를 검토하게 한다.
4. Requirement 근거가 없는 LLM 제안은 제거한다.

**필수 산출물**

- Use Case Diagram 1개
- `Place Order` Use Case Specification 1개

**판단 기준**

- Actor Goal이 중심인가?
- Main Flow가 업무 의미 수준인가?
- Diagram과 Specification이 서로 일관적인가?
- Requirement에 없는 기능이나 Solution Detail을 임의로 추가하지 않았는가?

## Slide Notes — 진행 가이드

- 권장 시간: Diagram 8~10분 → Specification 10~12분 → LLM 검토·수정 5~8분.
- 먼저 수강생이 독립적으로 초안을 만든 뒤 LLM을 사용하게 한다.
- `Payment Gateway`, UI Button, REST API, DB Table을 Actor/Use Case/Flow에 섣불리 넣으면 “Problem인가 Solution인가?”를 질문한다.
- 모든 예외를 완전하게 쓰게 하지 않는다. 주요 Alternative/Exception 1~2개면 충분하다.
- SSD와 Operation Contract는 이 실습 산출물이 아니다. 본문에서 강사가 Place Order Use Case를 입력으로 어떻게 후속 분석하는지 설명한다.

## [별첨] 실습 해설 — Place Order Use Case Diagram

권장 구조:

```text
Customer
   |
   +---- Place Order
             |
             +---- Process Payment  (필요한 수준에서 관계 설명)
```

- Actor는 `Customer`를 중심으로 한다.
- 외부 결제 사업자를 Actor로 포함할지는 문제 정의/시스템 경계에 따라 달라질 수 있으므로 단일 정답으로 강제하지 않는다.
- Diagram의 목적은 구현 컴포넌트를 그리는 것이 아니라 Actor Goal과 System Boundary를 표현하는 데 있다.

## [별첨] 실습 해설 — Place Order Use Case Specification

| 항목 | 예시 |
|---|---|
| Use Case | Place Order |
| Primary Actor | Customer |
| Trigger | 고객이 선택한 상품을 주문하기로 결정한다 |
| Precondition | 주문 가능한 상품과 수량이 선택되어 있다 |
| Main Success | 주문 정보를 확인한다 → 주문을 생성한다 → 총액을 결정한다 → 결제를 요청한다 → 결제 성공을 반영한다 → 주문 완료 결과를 제공한다 |
| Alternative | 결제가 실패하면 주문 완료로 확정하지 않고 실패 결과를 제공한다 |
| Postcondition | 성공 시 Order가 생성되고 Payment 완료가 반영되어 있다 |

**해설 포인트**

- `Shipment`는 이 기본 실습의 필수 흐름에서 제외한다.
- `Order Cancellation`과 `Refund`는 후반 variation/change request에서 사용한다.
- 정답 문구보다 Diagram–Specification–Requirement 사이의 의미 일관성이 중요하다.

# 11. 요구사항 정의와 Analysis의 분리 문제

실무에서는 요구사항 정의 자체는 강조하면서도, **문제를 구현 결정과 분리하여 이해하는 Analysis 사고가 약해지는 경우**가 있다.

그 결과 다음과 같은 문제가 발생할 수 있다.

```text
Requirement Definition
        ↓
Solution Detail을 함께 확정
        ↓
Problem Understanding
        ≈
Chosen Solution
        ↓
Problem Understanding과
Implementation Baseline이 조기에 결합
```

대표적인 징후:

### 요구·문제 측

- 해결할 문제보다 원하는 기능이나 solution을 먼저 제시한다.
- 실제 사용자와 의사결정자의 관점 차이를 충분히 분석하지 않는다.
- 결과물을 보기 전에 상세 요구와 solution을 함께 확정한다.
- 문제에 관한 미결정 사항을 기술적 assumption으로 채운다.

### 개발·설계 측

- 고객 요청을 분석 없이 Requirement로 전환한다.
- 질문·관찰·Prototype보다 문서의 상세화 자체에 집중한다.
- Requirement와 Solution Design을 혼합한다.
- 문제 이해가 바뀐 것과 설계 대안이 바뀐 것을 모두 Requirement Change로 취급한다.
- Agile / Iterative를 이유로 Analysis를 생략하고 Story에서 바로 구현으로 이동한다.

이 문제의 핵심은 별도의 `Analysis Phase`가 없다는 데 있지 않다.

> **Analysis를 단계가 아니라 사고 프로세스로 유지하지 못하면, Problem Understanding이 특정 Solution에 조기에 종속된다.**

따라서 Requirement Engineering은 한쪽이 요구를 전달하고 다른 쪽이 받아 적는 작업이 아니라:

> **고객과 개발자가 Problem과 Solution을 구분하면서 불확실성을 함께 줄이는 분석 활동**

이어야 한다.

국가·산업별 현황을 정량적인 일반 사실로 제시하려면 별도의 검증된 조사·연구가 필요하다. Deck에서는 검증된 근거가 확보된 경우에만 특정 지역의 보편적 현상으로 단정한다.

---

# 과정 요약

```text
Customer Need / Problem
        ↓
Discovery
        ↓
Analysis / Validation
        ↓
Requirement
        ├─ Functional
        ├─ Quality
        └─ Constraint
        ↓
Actor / Goal
        ↓
Use Case
        ↓
Use Case Specification
        ↓
SSD
        ↓
System Operation
        ↓
Operation Contract
        ↓
Domain State Change
```

- 고객 요구는 Requirement Discovery의 입력이다.
- Requirement를 구체화하는 것은 Solution을 일찍 고정하는 것이 아니라 Essential Problem을 더 정확하게 이해하는 것이다.
- Analysis는 고정된 단계가 아니라 Problem과 Solution을 구분하는 사고 활동이다.
- 고객도 개발자도 처음부터 완전한 답을 알고 있지 않다.
- 질문하고, 관찰하고, 보여주고, 만들어 보면서 학습한다.
- 좋은 요구사항은 필요하고, 적절하고, 명확하며, 완전하고, 단일하고, 실현 가능하며, 검증 가능해야 한다.
- Functional Requirement뿐 아니라 Quality Requirement와 Constraint도 확인한다.
- Use Case는 특정 Actor의 Goal에서 출발해 실제 필요한 Event와 System Behavior를 찾기 때문에 불필요한 기능을 최소화할 수 있다.
- Use Case의 본질은 Diagram이 아니라 Text다.
- 분석은 System Operation의 결과로 필요한 Domain State Change까지 명확하게 한다.
- 복잡하거나 위험한 요구에서는 Static / Dynamic Understanding이 Requirement를 구현과 독립적으로 이해했는지 검증하는 핵심 evidence가 된다.
- Predictive에서는 이것이 formal baseline을 강화하고, Iterative / Agile에서는 현재 범위의 commitment를 뒷받침한다.

다음 질문:

> **그 상태 변화를 구성하는 개념·속성·관계를 문제영역의 구조로 어떻게 표현하고, 현재 문제 이해가 충분한지 어떻게 검증할 것인가?**

→ **S03. 분석 정적 모델**

---

# 권장 43~45장 구성

추가된 내용은 `Analysis ≠ Phase`, Brooks `Essence / Accident`, Problem Understanding을 기존 요구분석 흐름에 연결하기 위한 핵심 설명이다. 실습은 본편 1장으로 통합하고 예시 답안은 별첨으로 분리했으므로 권장 slide 수는 Deck 단계에서 본문 밀도를 기준으로 다시 산정한다. ISO 29148/25010 상세 목록과 수집 방법 소개 bullet는 표/요약 문장으로 축약했고, Boehm/Standish/Bezos/von Neumann/Lean은 개별 section 대신 `공통 결론` 1개 슬라이드로 통합해 밀도를 낮췄다.

| # | Block | Slide |
|---:|---|---|
| 1 | Opening | 과정 목표 |
| 2 | 1 | 고객 요구 ≠ 요구사항 |
| 3 | 1 | Brooks — 고객도 처음부터 완전한 요구를 모른다 |
| 4 | 1 | **Brooks Essence / Accident — Essential Problem과 Solution 분리** |
| 5 | 2 | Too Late vs Too Early |
| 6 | 2 | Requirement Change의 두 종류 |
| 7 | 2 | **Predictive vs Iterative / Agile — Analysis는 사라지지 않는다** |
| 8 | 2 | **Requirement Baseline과 Problem Understanding** |
| 9 | 2 | **공통 결론 — Boehm/Standish/Bezos/von Neumann/Lean을 한 장에** |
| 10 | 3 | ISO/IEC/IEEE 29148 — 좋은 요구사항의 자격(축약) |
| 11 | 3 | 요구사항의 유형 |
| 12 | 3 | ISO/IEC 25010:2023 — Product Quality Model(축약) |
| 13 | 4 | 요구사항 수집·발견 |
| 14 | 4 | 수집 방법의 선택 — Interview / Observation / Workshop / Prototype |
| 15 | 4 | Prototype — 보여주면서 발견한다 |
| 16 | 4 | Wireframe + 복잡한 업무 화면 |
| 17 | 4 | Report Prototype |
| 18 | 5 | 왜 Use Case인가 — Actor Goal에서 필요한 기능을 찾는다 |
| 19 | 5 | Use Case 정의 |
| 20 | 5 | Use Case의 본질은 Text다 — Larman |
| 21 | 5 | Actor — 정의와 식별 |
| 22 | 5 | System Boundary |
| 23 | 5 | Association |
| 24 | 5 | Use Case Diagram |
| 25 | 5 | Order Use Case Diagram |
| 26 | 5 | Use Case Diagram 작성 방법 |
| 27 | 5 | 좋은 Use Case를 찾는 질문 |
| 28 | 6 | Use Case Specification |
| 29 | 6 | Main Success Scenario + 좋은 Scenario 작성법 |
| 30 | 6 | Alternative / Exception Flow |
| 31 | 6 | Flow와 Scenario 구분 |
| 32 | 7 | **Domain — 문제와 업무의 세계** |
| 33 | 7 | SSD — System Sequence Diagram |
| 34 | 7 | System Event → System Operation |
| 35 | 7 | Operation Contract — What changed, not how |
| 36 | 7 | **Domain State Change → Static / Dynamic Analysis View** |
| 37 | 8 | User Story |
| 38 | 8 | Use Case vs User Story |
| 39 | 9 | Acceptance Criteria |
| 40 | 9 | BDD / Example |
| 41 | 25~30 | **[실습] Place Order Use Case Diagram + Specification** |
| A1 | 별첨 | **[별첨] 실습 해설 — Place Order Use Case Diagram** |
| A2 | 별첨 | **[별첨] 실습 해설 — Place Order Use Case Specification** |
| 42 | 11 | **요구사항 정의와 Analysis의 분리 문제** |
| 43 | Closing | 과정 요약 + S03 연결 |
