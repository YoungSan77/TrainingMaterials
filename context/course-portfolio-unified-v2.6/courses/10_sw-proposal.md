# SW 제안 전략과 제안서 작성 실무
## Unified Baseline v2.6

> **Status:** Baseline  

> **Course ID:** sw-proposal  
> **Duration:** 8h 운영 기준, 최대 480분  
> **Instructional time:** 약 400분 + 휴식 약 80분  
> **Time rule:** Topic은 동일 50분 단위가 아니다. 중요도·난이도·의사결정 밀도에 따라 시간을 다르게 배분한다.  
> **Purpose:** 문서 편집이나 발표기법이 아니라, 고객의 사업 문제를 이해하고 수주 가능성이 있는 전략·솔루션·실행계획·상업조건·Evidence를 하나의 설득 논리로 통합하는 능력을 기른다.

---

# 1. Course Thesis

> **좋은 SW 제안서는 많은 내용을 담은 문서가 아니라, 고객의 의사결정 기준을 정확히 이해하고 우리가 왜 가장 낮은 위험으로 가장 높은 가치를 제공할 수 있는지를 Evidence와 실행 가능한 약속으로 증명하는 의사결정 문서다.**

따라서 제안의 핵심 흐름은 다음이다.

```text
Opportunity
→ Bid / No-Bid
→ Customer Problem
→ Decision Criteria
→ Win Strategy
→ Solution
→ Delivery / Commercial
→ Evidence
→ Storyline
→ Review
→ Submission / Presentation
```

제안서는 마지막 표현물이다.

```text
Proposal ≠ Document Production

Proposal
= Business Decision
+ Win Strategy
+ Solution
+ Delivery Commitment
+ Commercial Logic
+ Evidence
+ Persuasive Communication
```

---

## Learner & Context Fit

- **Audience / Work Context:** 고객 문제·의사결정 구조를 이해하고 제안 전략을 수립해야 하는 제안 리더·아키텍트·PM.
- **Current Capability / Failure Mode:** 자사 capability와 문서 완성도 중심으로 제안하고 고객 outcome/decision criteria를 뒤늦게 맞춘다.
- **Target Capability:** 고객 context·pain·buying decision을 먼저 이해하고 bid/no-bid와 solution/value proposition을 근거 있게 선택한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Design Thinking; Systems Thinking; Empiricism / Scientific Thinking.
- **Why:** 고객 문제를 먼저 framing하고 stakeholder/decision system을 본 뒤 가정을 evidence로 검증한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

# 2. Problem It Owns

이 과정이 소유하는 문제는 **어떻게 SW 사업 기회를 수주 가능한 제안으로 전환할 것인가**다.

대표 실패:

- RFP 내용을 요약한 문서가 제안서가 됨
- 요구사항에 모두 “가능”이라고 답함
- 고객의 실제 평가 기준을 모름
- 경쟁사와 차별화되지 않음
- 기술적 장점은 많지만 고객 가치와 연결되지 않음
- Solution과 일정·인력·가격이 서로 맞지 않음
- 과도한 약속으로 수주 후 프로젝트가 위험해짐
- 레퍼런스는 많지만 주장과 Evidence가 연결되지 않음
- 작성자가 여러 명이라 문서 전체 논리가 깨짐
- Executive Summary가 본문 요약에 그침
- 디자인과 표현을 마지막에 보완하지만 전략 자체가 없음
- 평가표 점수는 맞추지만 “왜 우리인가?”가 남지 않음

핵심 질문:

> **고객은 무엇을 사는 것이며, 왜 우리에게 맡겨야 하는가?**

---

# 3. Course Ownership & Boundaries

## 이 과정이 소유

- Opportunity qualification
- Bid / No-Bid
- Customer / stakeholder / buying-center analysis
- RFP / requirement interpretation
- Evaluation criteria analysis
- Win themes / Win strategy
- Competitive positioning
- Value proposition
- Solution proposal integration
- Delivery / transition commitment
- Commercial logic at proposal level
- Risk / assumption / dependency framing
- Evidence strategy
- Proposal architecture / storyline
- Compliance matrix
- Proposal review
- Executive Summary
- Oral presentation / Q&A strategy orientation

## SW Architecture owns
- 실제 architecture design
- architecture decision / trade-off
- quality attribute design

제안 과정에서는:

> **아키텍처를 어떻게 설계하는가가 아니라, 왜 이 아키텍처가 고객의 평가기준·위험·가치에 적합한지를 제안 논리로 설명하는 방법**

을 다룬다.

## PM owns
- 상세 프로젝트관리 방법
- Scope / Schedule / Finance / Risk 관리 정본

제안 과정에서는:

> **수행 가능성을 어떻게 설득력 있게 약속하고, 그 약속이 Solution 및 Commercial과 일관되는지**

를 다룬다.

## Agile / DevOps / SWQM owns
각 방법론의 정본.

제안 과정에서는 필요 시:

- 왜 이 Delivery Approach를 선택했는가?
- 어떤 고객 Risk를 줄이는가?
- 무엇을 Evidence로 보여주는가?

정도만 적용한다.

---

# 4. Course Decision Model

```text
                   CUSTOMER DECISION
                          │
             ┌────────────┴────────────┐
             │                         │
         VALUE                      RISK
             │                         │
             └────────────┬────────────┘
                          │
                    WIN STRATEGY
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
    SOLUTION          DELIVERY          COMMERCIAL
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                       EVIDENCE
                          │
                       STORYLINE
                          │
                 COMPLIANT PROPOSAL
```

좋은 제안은 세 가지를 동시에 만족해야 한다.

```text
Customer Relevance
+ Competitive Differentiation
+ Delivery Credibility
```

---

# 5. Part I — Opportunity Before Proposal

## Topic 01. 제안의 본질 — 문서가 아니라 고객의 의사결정 — 25m

### 핵심 내용
- Proposal의 역할
- Buyer vs User vs Evaluator
- Procurement requirement vs business need
- Stated requirement vs underlying problem
- Value / Risk / Trust
- 제안과 영업·Pre-sales·Solution·Delivery의 관계

### 핵심 구분

```text
What customer asks
≠
Why customer buys
```

### Decision Question

> **고객은 이번 사업에서 무엇을 결정하려는가?**

### Failure Condition
- RFP 목차를 그대로 제안 논리로 사용
- 모든 요구사항을 동등한 중요도로 다룸
- 기술 특징을 고객 가치로 착각

---

## Topic 02. Bid / No-Bid — 제안하기 전에 수주 가능성을 판단한다 — 25m

모든 기회에 제안하지 않는다.

### Qualification Dimensions
- Strategic fit
- Customer access
- Problem understanding
- Decision criteria visibility
- Competitive position
- Solution fit
- Delivery capability
- Resource availability
- Commercial viability
- Contract / legal exposure
- Reference / evidence
- Probability of win
- Cost of pursuit

### Simple Decision Frame

```text
Attractiveness
      ×
Win Probability
      ×
Delivery Feasibility
      ↓
Bid / No-Bid / Conditional Bid
```

### Decision Questions
- 우리가 이겨야 할 이유가 있는가?
- 우리가 실제로 이길 수 있는가?
- 이겨도 수행할 가치가 있는가?

### Failure Condition
- 매출 목표 때문에 무조건 Bid
- 제안 비용을 sunk cost처럼 확대
- 수행 불가능한 조건을 수주 후 해결하려 함

---

# 6. Part II — Understand the Customer

## Topic 03. Customer / Stakeholder / Decision Analysis — 30m

### 분석 대상
- Sponsor
- Economic buyer
- Business owner
- End users
- IT / Architecture
- Security / Compliance
- Procurement
- Finance
- Operations
- Influencers
- Evaluators

### 질문
- 누가 예산을 통제하는가?
- 누가 기술적으로 평가하는가?
- 누가 운영 위험을 지는가?
- 누가 변화에 저항하는가?
- 누가 최종 승인을 하는가?

### Buying Criteria

```text
Explicit Criteria
+ Implicit Criteria
+ Political / Organizational Constraints
```

### Core Output
- Decision map
- Stakeholder concern map
- Evaluation hypothesis

### Anchor

> **제안은 한 명의 고객에게 쓰는 문서가 아니라 서로 다른 이해관계자의 판단을 동시에 통과해야 하는 문서다.**

---

## Topic 04. RFP / 요구사항 분석 — Compliance에서 Insight까지 — 30m

### 4단계

```text
1. Extract
2. Classify
3. Interpret
4. Prioritize
```

### 요구 분류
- Mandatory
- Scored
- Differentiating
- Contractual
- Operational
- Technical
- Commercial
- Ambiguous
- Risk-bearing

### Compliance Matrix

단순 Yes/No 표가 아니다.

```text
Requirement
→ Response Location
→ Owner
→ Evidence
→ Risk / Assumption
→ Status
```

### 핵심 질문

> **이 요구사항은 무엇을 요구하는가보다, 고객이 왜 이것을 요구하는가?**

### Failure Condition
- RFP paraphrasing
- 요구 누락
- 모호한 요구를 임의 해석
- 평가 가중치와 작성 분량 불일치

---

# 7. Part III — Win Strategy

## Topic 05. Win Strategy와 Competitive Positioning — 50m

과정의 핵심 Topic 중 하나.

### Win Strategy

```text
Customer Priority
+ Competitor Weakness
+ Our Strength
+ Evidence
= Win Theme
```

### 좋은 Win Theme의 조건

1. 고객에게 중요하다.
2. 경쟁사와 구분된다.
3. 우리가 증명할 수 있다.
4. Solution / Delivery / Commercial에서 일관되게 반복된다.

### Example Structure

```text
Customer Concern:
기존 시스템 전환 중 업무중단 위험

Win Theme:
단계 전환과 병행운영으로 전환위험 최소화

Proof:
유사 규모 전환 경험
+ 검증된 migration approach
+ rollback / transition criteria
```

### Competitive Positioning

```text
Do not ask:
경쟁사보다 우리가 무엇을 더 많이 제공하는가?

Ask:
고객 의사결정 기준에서
어떤 Trade-off를 우리가 가장 유리하게 만든는가?
```

### Value Proposition

```text
Capability
→ Customer Outcome
→ Business Value
→ Evidence
```

### Failure Conditions
- “최고의 기술”
- “풍부한 경험”
- “최적의 솔루션”
- “차별화된 방법론”

증거와 고객 의미가 없으면 모두 Generic Claim.

### Anchor

> **차별화는 우리가 다른 것이 아니라 고객이 중요하게 생각하는 기준에서 다르게 평가받는 것이다.**

---

# 8. Part IV — Build a Credible Offer

## Topic 06. Solution Strategy — 고객 문제에서 해결 구조로 — 35m

상세 설계과정이 아니다.

### 제안 Solution의 구성

```text
Customer Problem
→ Design Drivers
→ Solution Principles
→ Major Components / Capabilities
→ Integration
→ Migration / Transition
→ Operations
→ Expected Outcomes
```

### 반드시 보여줄 것
- 문제와 Solution의 추적성
- 주요 결정과 이유
- 고객 환경과의 적합성
- 기존 자산 활용
- 변경 / 확장 가능성
- 주요 Risk와 대응
- 제약과 가정

### Core Decision

> **이 Solution이 기술적으로 가능한가보다, 고객의 핵심 가치와 위험에 가장 적합한가?**

### Failure Conditions
- 제품 기능 목록
- architecture diagram만 제시
- 최신 기술 사용이 차별화라고 주장
- 고객 제약 무시

---

## Topic 07. Delivery Strategy — “할 수 있다”를 실행 가능한 약속으로 — 35m

### 핵심 구조

```text
Scope
→ Work Structure
→ Delivery Approach
→ Milestones
→ Resources
→ Dependencies
→ Acceptance
→ Transition
```

### 포함
- Predictive / Adaptive / Hybrid 선택 이유
- 단계 / Release / Milestone
- 고객 역할
- 주요 인력
- Governance
- Quality / acceptance
- Migration / cutover
- knowledge transfer
- transition to operations

### Key Principle

> **Proposal Delivery Plan은 PM 계획서가 아니라 “이 제안이 실제로 수행 가능하다”는 신뢰의 Evidence다.**

### Failure Conditions
- 비현실적으로 짧은 일정
- 인력표와 WBS 불일치
- 고객 작업을 일정에서 누락
- Acceptance를 마지막 이벤트로만 배치
- 전환 / 운영 준비 누락

---

## Topic 08. Commercial · Risk · Assumption — 이겨도 실패하지 않는 제안 — 25m

### Commercial Alignment

```text
Solution
↔ Scope
↔ Effort
↔ Schedule
↔ Price
↔ Risk
```

### 다룰 것
- fixed / variable boundaries
- pricing assumptions
- exclusions
- customer dependencies
- contingency
- optional scope
- change mechanism
- acceptance condition
- risk allocation orientation

### 핵심 질문

> **낮은 가격이 아니라 이 가격으로 약속한 결과를 실제로 제공할 수 있는가?**

### Failure Condition
- 가격을 맞추기 위해 scope/effort를 숨김
- assumption을 문서 맨 뒤 면책조항으로 처리
- 위험을 고객에게 전가
- 수주 후 change request를 수익모델로 전제

---

# 9. Part V — Evidence and Proposal Architecture

## Topic 09. Evidence Strategy — 주장보다 증거 — 25m

### Evidence Types
- Reference
- Case
- Metric
- Benchmark
- Prototype / PoC
- Certification
- Architecture / design evidence
- Delivery track record
- Key personnel experience
- Customer testimonial
- Demonstration

### Claim–Evidence Model

```text
Claim
→ Why it matters
→ Evidence
→ Customer implication
```

### Evidence Quality
- Relevance
- Recency
- Similarity
- Verifiability
- Specificity

### Anchor

> **Evidence 없는 차별화는 광고다.**

---

## Topic 10. Proposal Architecture와 Storyline — 35m

제안서 목차와 사고 구조를 구분한다.

### Proposal Storyline

```text
We understand
      ↓
The real challenge is
      ↓
Our strategy is
      ↓
Our solution works because
      ↓
We can deliver it because
      ↓
The risk is controlled because
      ↓
Therefore choose us
```

### Executive Summary

본문 요약이 아니다.

포함:
- customer situation
- decision stakes
- recommended strategy
- differentiators
- value
- proof
- commitment

### Section Design Rule

각 장이 다음을 답해야 한다.

```text
So What?
Why Us?
Proof?
```

### Visual Principle
- 한 장 = 한 메시지
- diagram은 설명보다 관계를 보여줌
- 표는 비교/판단 지원
- 장식보다 Evidence

---

# 10. Part VI — Proposal Production & Review

## Topic 11. Proposal Production System — 여러 작성자를 하나의 제안으로 — 20m

### Roles
- Capture / Opportunity Lead
- Proposal Manager
- Solution Lead
- Delivery Lead
- Commercial
- Writer / Editor
- Reviewer
- Executive sponsor

### Production Controls
- outline
- section owner
- compliance matrix
- win-theme map
- content plan
- evidence register
- version control
- review calendar
- decision log

### Principle

> **여러 사람이 쓰더라도 한 사람이 말하는 것처럼 보여야 한다.**

---

## Topic 12. Review — 문장 교정이 아니라 수주 가능성 검증 — 25m

리뷰를 단순 색상 이름 암기로 가르치지 않는다.

### Review Levels

#### 1. Strategy Review
- 고객 이해가 맞는가?
- Win strategy가 있는가?
- 경쟁 우위가 있는가?

#### 2. Solution / Delivery Review
- 해결책이 요구와 연결되는가?
- 수행 가능한가?
- 위험이 통제되는가?

#### 3. Compliance Review
- 모든 요구에 답했는가?
- 평가기준을 충족하는가?

#### 4. Persuasion Review
- 핵심 메시지가 명확한가?
- Evidence가 있는가?
- Executive reader가 이해 가능한가?

#### 5. Final Quality Review
- consistency
- numbers
- terminology
- formatting
- submission requirements

### Review Question

> **이 문서가 틀리지 않았는가가 아니라, 고객이 우리를 선택할 충분한 이유를 제공하는가?**

---

# 11. Part VII — Presentation and Final Integration

## Topic 13. Oral Proposal / Q&A — 문서 이후의 의사결정 — 10m

### Awareness
- 발표는 문서 낭독이 아님
- key messages
- role allocation
- demo
- anticipated objections
- Q&A ownership
- answer discipline

### Answer Pattern

```text
Question
→ Intent
→ Direct Answer
→ Evidence
→ Impact
```

---

## Topic 14. Integrated Proposal Case — 30m

### Case
중견기업 핵심 업무 시스템 현대화.

조건:
- Legacy 교체
- 여러 사업부
- 일정 제약
- 운영중단 우려
- 일부 요구 불명확
- 내부 IT 역량 제한
- 경쟁사 2개
- 가격 경쟁
- 단계 전환 가능
- 외부 운영지원 필요

### 학습자 판단

1. Bid / No-Bid?
2. 고객의 Top 3 Decision Criteria?
3. Top 3 Risks?
4. Win Theme 3개?
5. Solution Strategy?
6. Delivery Approach?
7. Assumption / exclusion?
8. Evidence?
9. Executive Summary 핵심 메시지?
10. Review에서 가장 먼저 검증할 것은?

### Final Output

```text
Opportunity Decision
+ Customer Decision Map
+ Compliance Priorities
+ Win Strategy
+ Solution Strategy
+ Delivery Strategy
+ Commercial Assumptions
+ Evidence Map
+ Proposal Storyline
```

---

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **4개**, 1일 4개, 총 약 **90분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/10_sw-proposal/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T02/T03 | Bid / No-Bid with Customer Decision Map | 20분 | 기회를 추구할지와 실제 구매 의사결정자는 누구인지 어떻게 판단할 것인가 |
| P2 | T04/T05 | RFP Insight → Win Strategy | 25분 | compliance 요구를 넘어 고객의 buying criteria와 win theme을 어떻게 도출할 것인가 |
| P3 | T06/T08 | Credible Solution / Delivery / Risk Promise | 25분 | 무엇을 약속하고 무엇을 assumption/constraint로 남길 것인가 |
| P4 | T09/T12/T14 | Claim–Evidence Storyline & Review | 20분 | 어떤 주장에 어떤 evidence가 필요하고 무엇을 삭제해야 설득력이 높아지는가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

# 12. Topic-Based Curriculum — 400 Instructional Minutes

| # | Topic | Time |
|---:|---|---:|
| 01 | 제안의 본질 — 고객의 의사결정 | 25m |
| 02 | Bid / No-Bid | 25m |
| 03 | Customer / Stakeholder / Decision Analysis | 30m |
| 04 | RFP / 요구사항 분석 | 30m |
| 05 | Win Strategy와 Competitive Positioning | 50m |
| 06 | Solution Strategy | 35m |
| 07 | Delivery Strategy | 35m |
| 08 | Commercial · Risk · Assumption | 25m |
| 09 | Evidence Strategy | 25m |
| 10 | Proposal Architecture와 Storyline | 35m |
| 11 | Proposal Production System | 20m |
| 12 | Proposal Review | 25m |
| 13 | Oral Proposal / Q&A | 10m |
| 14 | Integrated Proposal Case | 30m |
|  | **Total** | **400m** |

> Integrated Case는 각 Topic에서 동일 Case를 누적 적용하고 마지막 30분에 최종 의사결정과 제안 논리의 정합성을 통합 검토한다.

운영:

```text
400m instruction
+ 약 80m break
= 480m / 8h
```

---

# 13. Course Learning Flow

```text
1. Should we bid?
       ↓
2. Why is the customer buying?
       ↓
3. How will the customer decide?
       ↓
4. How can we win?
       ↓
5. What should we offer?
       ↓
6. Can we deliver it?
       ↓
7. Can we make money without creating hidden risk?
       ↓
8. What proves our claims?
       ↓
9. How should the story be structured?
       ↓
10. Does the proposal deserve to win?
```

---

# 14. Learning Outcomes

수강 후 학습자는:

1. 사업기회를 Bid / No-Bid 관점으로 평가한다.
2. 고객의 명시 요구와 실제 의사결정 기준을 구분한다.
3. 이해당사자별 관심과 평가관점을 분석한다.
4. RFP 요구를 compliance / score / risk / differentiation 관점으로 분류한다.
5. 고객 Priority와 경쟁구도를 기반으로 Win Strategy를 만든다.
6. Solution을 고객 가치·위험·제약과 연결하여 설명한다.
7. 수행 가능성을 보여주는 Delivery Strategy를 구성한다.
8. Scope·Schedule·Price·Risk·Assumption 간 정합성을 점검한다.
9. Claim과 Evidence를 연결한다.
10. Executive Summary와 Proposal Storyline을 설계한다.
11. 여러 작성자의 산출물을 하나의 논리로 통합한다.
12. 제안서를 전략·솔루션·Compliance·설득력 관점에서 리뷰한다.

---

# 15. Anti-Patterns

1. RFP 목차 = 제안 전략
2. 요구사항 복사 + “지원 가능”
3. 고객보다 우리 회사 소개가 앞에 나옴
4. Generic differentiator
5. 기술 특징을 비즈니스 가치로 착각
6. 최신 기술 = 좋은 Solution
7. 경쟁사 분석 없는 Win Theme
8. 근거 없는 “최고 / 최적 / 풍부”
9. Reference 수량으로 Evidence 품질 대체
10. Solution / Delivery / Price 불일치
11. 수행 불가능한 일정
12. 핵심 인력 이름만 넣고 실제 가용성 미확인
13. Assumption을 숨김
14. Risk를 고객에게 전가
15. Executive Summary = 본문 요약
16. 작성자별 문체·논리 분리
17. Compliance만 통과하면 이긴다고 생각
18. Review = 오탈자 검사
19. 예쁜 디자인이 전략 부족을 보완한다고 생각
20. 수주 후 해결할 문제를 의도적으로 미룸

---

# 16. Explicit Non-Scope

- 영업 전 과정
- CRM 운영
- 계약법
- 상세 원가회계
- 상세 기술 아키텍처 설계
- PMBOK 재교육
- Agile/Scrum 재교육
- DevOps/SWQM 정본 교육
- PowerPoint 디자인 과정
- 제안 발표 스피치 집중훈련
- 정부/공공 입찰 규정 상세
- 특정 발주처 제안평가 지침
- AI writing tool 사용법

---

# 17. Quality Gate

과정 승인 전 모두 YES여야 한다.

- Proposal을 문서 작성 과정으로 축소하지 않는가?
- Bid / No-Bid가 앞에 있는가?
- Customer Decision Criteria가 과정 중심에 있는가?
- Win Strategy가 Solution보다 먼저 나오는가?
- 차별화가 고객 중요도와 경쟁구도에 연결되는가?
- Solution이 기능 목록이 아닌 문제 해결 구조인가?
- Delivery Credibility가 충분히 다뤄지는가?
- Commercial과 Risk가 Solution과 연결되는가?
- Evidence가 모든 주요 Claim과 연결되는가?
- Executive Summary가 본문 요약으로 축소되지 않는가?
- Compliance와 Persuasion이 둘 다 다뤄지는가?
- Review가 문장 교정이 아닌 수주 가능성 검증인가?
- SW Architecture / PM / Agile / DevOps / SWQM의 정본을 침범하지 않는가?
- Tool/Template보다 Decision을 우선하는가?
- Topic 시간이 동일 50분으로 강제되지 않는가?
- 총 instructional time이 약 400분인가?
- 총 운영시간이 480분 이내인가?

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
# 18. Final Course Message

> **좋은 제안서는 고객이 요구한 것을 많이 답한 문서가 아니라, 고객이 중요하게 생각하는 문제를 가장 낮은 위험으로 해결할 수 있는 선택이 왜 우리인지 명확하게 증명하는 문서다.**

최종 질문:

> **“무엇을 써야 하는가?”가 아니라  
> “고객은 무엇을 기준으로 결정하며, 우리는 어떤 전략·해결책·Evidence로 그 결정을 우리에게 유리하게 만들 것인가?”**
