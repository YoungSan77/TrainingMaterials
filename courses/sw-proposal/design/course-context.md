# SW Proposal — Course Context

> **Course ID:** sw-proposal
> **Course Title (source baseline):** SW 제안 전략과 제안서 작성 실무
> **Duration:** 8h 운영 기준, 최대 480분 (Instructional time 약 400분 + 휴식 약 80분)
> **Pipeline Stage:** Course Design (Stage 1) — `guides/과정_설계_지침.md` §2-a에 따른 뼈대 문서
> **Migration provenance:** legacy context v2.6에서 progression/priority/rationale/coverage-intent를 흡수했다. 현재 권위는 Portfolio 정본과 이 Course Design에 있다.
> **Status:** 신규 흡수 — 이 저장소에 기존 curriculum.md 없음. 본 문서는 Course Design만 정의하며 커리큘럼 세션·시간표를 재정의하지 않는다.

---

## 1. Course Purpose

문서 편집이나 발표기법이 아니라, 고객의 사업 문제를 이해하고 수주 가능성이 있는 전략·솔루션·실행계획·상업조건·Evidence를 하나의 설득 논리로 통합하는 능력을 기른다.

## 2. Target Learner & Context Fit

과정 흡수 대상이므로 baseline의 "Learner & Context Fit"을 요약·재작성 없이 그대로 가져온다 (`guides/과정_설계_지침.md` §3).

- **Audience / Work Context:** 고객 문제·의사결정 구조를 이해하고 제안 전략을 수립해야 하는 제안 리더·아키텍트·PM.
- **Current Capability / Failure Mode:** 자사 capability와 문서 완성도 중심으로 제안하고 고객 outcome/decision criteria를 뒤늦게 맞춘다.
- **Target Capability:** 고객 context·pain·buying decision을 먼저 이해하고 bid/no-bid와 solution/value proposition을 근거 있게 선택한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 3. Capability Gap & Typical Failure

이 과정이 소유하는 문제는 **어떻게 SW 사업 기회를 수주 가능한 제안으로 전환할 것인가**다.

핵심 질문:

> **고객은 무엇을 사는 것이며, 왜 우리에게 맡겨야 하는가?**

대표 실패 (baseline "2. Problem It Owns"):

- RFP 내용을 요약한 문서가 제안서가 됨
- 요구사항에 모두 "가능"이라고 답함
- 고객의 실제 평가 기준을 모름
- 경쟁사와 차별화되지 않음
- 기술적 장점은 많지만 고객 가치와 연결되지 않음
- Solution과 일정·인력·가격이 서로 맞지 않음
- 과도한 약속으로 수주 후 프로젝트가 위험해짐
- 레퍼런스는 많지만 주장과 Evidence가 연결되지 않음
- 작성자가 여러 명이라 문서 전체 논리가 깨짐
- Executive Summary가 본문 요약에 그침
- 디자인과 표현을 마지막에 보완하지만 전략 자체가 없음
- 평가표 점수는 맞추지만 "왜 우리인가?"가 남지 않음

## 4. Target Capability (Learning Outcomes)

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

## 5. Course Thesis / Narrative

> **좋은 SW 제안서는 많은 내용을 담은 문서가 아니라, 고객의 의사결정 기준을 정확히 이해하고 우리가 왜 가장 낮은 위험으로 가장 높은 가치를 제공할 수 있는지를 Evidence와 실행 가능한 약속으로 증명하는 의사결정 문서다.**

제안의 핵심 흐름:

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

좋은 제안은 세 가지를 동시에 만족해야 한다.

```text
Customer Relevance
+ Competitive Differentiation
+ Delivery Credibility
```

### Sequencing Rationale — Course Learning Flow

baseline의 "Course Learning Flow"(의도된 진행 순서 — 세션/시간표가 아니라 판단의 인과 순서)를 그대로 가져온다:

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

### Topic Priority / Coverage Intent (Part 구조 — 세션 시간표 아님)

baseline은 7개 Part로 구성된다. 각 Part의 무게와 다루는 범위(coverage intent)만 옮긴다 — 세션 번호·분 단위 시간표는 실제 curriculum.md의 몫이다.

| Part | Coverage Intent |
|---|---|
| I. Opportunity Before Proposal | 제안의 본질(문서가 아니라 고객 의사결정) + Bid/No-Bid 판단 |
| II. Understand the Customer | Stakeholder/Decision 분석, RFP/요구사항 분석(Compliance→Insight) |
| III. Win Strategy | Win Strategy와 Competitive Positioning — baseline에서 가장 비중이 큰 단일 Topic(가장 무거움) |
| IV. Build a Credible Offer | Solution Strategy, Delivery Strategy, Commercial·Risk·Assumption |
| V. Evidence and Proposal Architecture | Evidence Strategy, Proposal Architecture/Storyline |
| VI. Proposal Production & Review | 다수 작성자 통합(Production System), Review(수주가능성 검증) |
| VII. Presentation and Final Integration | Oral Proposal/Q&A, Integrated Proposal Case(누적 적용 통합사례) |

> Part III(Win Strategy)이 baseline에서 topic priority가 가장 높다 — Solution/Delivery보다 먼저 다루며, 차별화 판단이 Offer 설계보다 선행한다는 sequencing rationale을 반영한다.

### Course Decision Model

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

## 6. Decisions Learner Must Make

1. Bid / No-Bid — 이 기회를 추구할 것인가?
2. 고객의 실제 buying/business decision은 무엇인가? (What customer asks ≠ Why customer buys)
3. Stakeholder decision system에서 누가 무엇을 결정하는가?
4. RFP 요구를 어떻게 분류·해석·우선순위화할 것인가?
5. Win Theme과 Competitive Positioning을 어떻게 설계할 것인가?
6. Solution을 고객 문제·위험·제약과 어떻게 연결할 것인가?
7. Delivery 약속을 어떻게 실행 가능한 수준으로 만들 것인가?
8. Commercial 조건(Scope↔Effort↔Schedule↔Price↔Risk)의 정합성을 어떻게 검증할 것인가?
9. 어떤 Claim에 어떤 Evidence가 필요하며 무엇을 삭제해야 설득력이 높아지는가?
10. Executive Summary와 Proposal Storyline을 어떻게 구조화할 것인가?
11. 여러 작성자의 산출물을 하나의 논리로 어떻게 통합·리뷰할 것인가?

## 7. Course Ownership & Boundaries (OWNER / APPLY / RECAP / FORWARD / NON-SCOPE)

### OWNER — 이 과정이 소유

(`portfolio/concept-ownership.md` "### SW Proposal"과 baseline "3. Course Ownership & Boundaries"를 통합)

- Opportunity Qualification / Bid–No-Bid
- Customer Decision / Evaluation Criteria (Customer / stakeholder / buying-center analysis)
- Win Strategy / Competitive Positioning (win themes, value proposition)
- Proposal-level Solution + Delivery + Commercial alignment
- Claim–Evidence strategy
- Compliance + Persuasion
- Proposal Storyline / Review
- RFP / requirement interpretation, Compliance matrix
- Risk / assumption / dependency framing (제안 수준)
- Proposal architecture, Executive Summary
- Oral presentation / Q&A strategy orientation
- Proposal Production System(다수 작성자 통합) 자체의 운영 구조

### APPLY — 다른 과정이 소유한 개념을 판단 없이 재정의하지 않고 사용

- **SW Architecture owns** 실제 architecture design / architecture decision·trade-off / quality attribute design.
  이 과정에서는 **"아키텍처를 어떻게 설계하는가"가 아니라 "왜 이 아키텍처가 고객의 평가기준·위험·가치에 적합한지를 제안 논리로 설명하는 방법"**만 다룬다.
- **PM owns** 상세 프로젝트관리 방법 / Scope·Schedule·Finance·Risk 관리 정본.
  이 과정에서는 **"수행 가능성을 어떻게 설득력 있게 약속하고, 그 약속이 Solution 및 Commercial과 일관되는지"**만 다룬다.
- **Agile / DevOps / SWQM owns** 각 방법론의 정본.
  이 과정에서는 필요 시 "왜 이 Delivery Approach를 선택했는가 / 어떤 고객 Risk를 줄이는가 / 무엇을 Evidence로 보여주는가" 정도만 적용한다.

### RECAP

이 과정 baseline·concept-ownership.md에는 별도의 RECAP 대상(다른 과정 개념을 이 과정이 짧게 복습하는 지점)이 명시되어 있지 않다. Architecture/PM/Agile/DevOps/SWQM 개념은 모두 위 APPLY 수준에서만 참조하며 재교육하지 않는다 — baseline "16. Explicit Non-Scope"에 "PMBOK 재교육", "Agile/Scrum 재교육", "DevOps/SWQM 정본 교육"이 명시적으로 제외되어 있다.

### FORWARD — 이 과정이 다음 단계로 넘기는 것

- 제안 단계에서 확정된 Solution/Delivery/Commercial 수준의 커밋먼트는 **수주 이후 실제 SW Architecture 설계**와 **PM의 상세 프로젝트 계획**의 입력 가정(assumption)이 된다 — 단, 그 설계·계획 자체는 이 과정이 아니라 SW Architecture·PM 과정이 소유한다.
- `portfolio/concept-ownership.md`의 Cross-Course Bridge Summary: SW Proposal(Customer Decision/Commitment)은 Architecture / PM / Quality / Delivery로부터 evidence를 **applies**한다 — 방향은 주로 이 과정으로 들어오는 evidence 소비이며, 확정된 제안 커밋먼트가 실행 단계로 나가는 관계다.

### NON-SCOPE (Explicit Non-Scope)

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

## 8. Key Distinctions

`portfolio/terminology.md` "H. 반드시 구분할 쌍"에는 SW Proposal 전용 항목이 등재되어 있지 않다. 대신 baseline 본문이 명시적으로 요구하는 course-internal 구분을 여기서 과정 소유 Key Distinction으로 확정한다:

| A | B | 핵심 차이 |
|---|---|---|
| What customer asks (Stated requirement) | Why customer buys (Underlying/business decision) | 고객이 명시적으로 요청한 것 vs 고객이 실제로 해결하려는 사업 문제 |
| Procurement requirement | Business need | 조달 절차상 요구 vs 사업적 필요 |
| Requirement Compliance | Requirement Insight / Differentiation | "요구를 충족했다"는 사실 vs "왜 이 요구가 존재하는가"를 이해해 차별화로 연결하는 것 |
| Compliance Review | Persuasion Review | 요구·평가기준 충족 여부 검증 vs 고객이 선택할 충분한 이유를 제공하는지 검증 — 둘 다 필요하며 서로 대체하지 않는다 |
| Bid | Win | 제안에 참여하는 결정 vs 실제로 수주하는 결과 — Bid/No-Bid는 Win Probability를 포함한 사전 판단이다 |

`portfolio/terminology.md`에 등재된 이 과정 소유 용어:

- **Bid / No-Bid:** 사업기회의 매력도, 수주 가능성, 수행 가능성·상업성을 근거로 제안 참여 여부를 결정하는 의사결정.
- **Win Strategy:** 고객의 중요한 의사결정 기준, 경쟁구도, 자사의 차별화 가능한 강점과 Evidence를 연결하여 선택받을 이유를 설계하는 전략.

## 9. Course-specific Principles

### Foundational Decision Lens Fit

`portfolio/principles.md` §A 중 이 과정의 실제 판단을 강화하는 Lens만 선택한다. migration 당시 흡수·검증된 판정을 현재 기준선으로 유지한다:

- **Design Thinking** — 고객 문제를 먼저 framing한다(Problem before Solution).
- **Systems Thinking** — stakeholder/decision system을 전체로 본다.
- **Empiricism** — 가정을 evidence로 검증한다.

Audit reviewer verdict: "customer problem, stakeholder decision system, evidence를 강화한다. 적절함." 관련 없는 Lens(Lean, ToC)는 이 과정 형식상 추가하지 않는다.

### Course-owned Child Principles — C10. Customer Decision & Proposal (`portfolio/principles.md`)

**Primary Parent Lenses:** Design Thinking / Systems Thinking / Empiricism.

- **PROP-01. Customer Decision before Proposal Document** — RFP 목차나 자사 capability보다 고객이 실제로 내려야 할 buying/business decision을 먼저 이해한다.
- **PROP-02. Bid only when Value, Win Probability, and Delivery Feasibility Align** — 모든 기회를 pursuit하지 않고 attractiveness, win probability, delivery feasibility와 evidence를 함께 본다.
- **PROP-03. Model the Stakeholder Decision System** — Sponsor, buyer, evaluator, user, procurement, operations의 서로 다른 concern과 influence를 하나의 decision system으로 본다.
- **PROP-04. Requirement Compliance Is Necessary but Not Sufficient** — stated requirement와 underlying problem을 구분하고 compliance를 insight와 differentiation으로 연결한다.
- **PROP-05. Credibility Requires Evidence** — 주장과 promise는 reference, proof, delivery plan, acceptance evidence 등 신뢰 가능한 근거와 연결한다.

## 10. Trade-offs / Failure Conditions

### Topic-level Trade-offs / Failure Conditions (baseline 발췌)

- **Topic 01 (제안의 본질):** Failure — RFP 목차를 그대로 제안 논리로 사용 / 모든 요구사항을 동등 중요도로 다룸 / 기술 특징을 고객 가치로 착각.
- **Topic 02 (Bid/No-Bid):** Failure — 매출 목표 때문에 무조건 Bid / 제안 비용을 sunk cost처럼 확대 / 수행 불가능한 조건을 수주 후 해결하려 함.
- **Topic 04 (RFP 분석):** Failure — RFP paraphrasing / 요구 누락 / 모호한 요구를 임의 해석 / 평가 가중치와 작성 분량 불일치.
- **Topic 05 (Win Strategy):** Failure — "최고의 기술" "풍부한 경험" "최적의 솔루션" "차별화된 방법론" 같은 Evidence 없는 Generic Claim.
- **Topic 06 (Solution Strategy):** Failure — 제품 기능 목록 / architecture diagram만 제시 / 최신 기술 사용이 차별화라고 주장 / 고객 제약 무시.
- **Topic 07 (Delivery Strategy):** Failure — 비현실적으로 짧은 일정 / 인력표와 WBS 불일치 / 고객 작업을 일정에서 누락 / Acceptance를 마지막 이벤트로만 배치 / 전환·운영 준비 누락.
- **Topic 08 (Commercial·Risk):** Failure — 가격을 맞추기 위해 scope/effort를 숨김 / assumption을 문서 맨 뒤 면책조항으로 처리 / 위험을 고객에게 전가 / 수주 후 change request를 수익모델로 전제.
- **Topic 11 (Production System):** Trade-off — 다수 작성자가 쓰더라도 한 사람이 말하는 것처럼 보여야 한다는 원칙과, 실제 여러 owner의 분업 사이의 통합 비용.
- **Topic 12 (Review):** Failure — Review를 문장 교정/오탈자 검사로 축소.

### Course-level Anti-Patterns (baseline "15. Anti-Patterns")

1. RFP 목차 = 제안 전략
2. 요구사항 복사 + "지원 가능"
3. 고객보다 우리 회사 소개가 앞에 나옴
4. Generic differentiator
5. 기술 특징을 비즈니스 가치로 착각
6. 최신 기술 = 좋은 Solution
7. 경쟁사 분석 없는 Win Theme
8. 근거 없는 "최고 / 최적 / 풍부"
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

## 11. Cross-course Interfaces

`portfolio/concept-ownership.md` "Cross-Course Bridge Summary"의 SW Proposal 관련 부분:

```text
SW Proposal
Customer Decision / Commitment
        ← applies evidence from Architecture / PM / Quality / Delivery
```

- **Uses (APPLY, 재정의 없이 사용):** SW Architecture(architecture design/trade-off), PM(project planning/control 정본), Agile/DevOps(delivery approach 선택 근거), Modern SWQM(quality evidence).
- **Bridges Forward (제안 커밋먼트가 실행 단계 입력이 됨):** 수주 후 실제 Architecture 설계와 PM 상세 계획은 이 과정에서 확정한 Solution/Delivery/Commercial 커밋먼트를 출발 가정으로 받는다 — 단 그 설계·계획의 정본은 각 과정이 소유한다.
- **Related Courses:** SW Architecture, SW Project Management, Agile, DevOps, Modern SWQM, DT→AX(사업/조직 수준 의사결정이라는 유사 구조를 공유하되 scope가 다름 — DT→AX는 enterprise transformation, SW Proposal은 단일 기회의 customer decision).

---

## Evidence Framing Note (Proposal Exception)

`portfolio/evidence-policy.md` §10 "Proposal Exception — Customer Decision Context"에 따라, 이 과정은 다른 과정과 달리 **Global Baseline 자체가 목적이 아니라 viable customer decision을 만들기 위한 도구**로 evidence를 사용한다:

```text
Understand customer intent
→ satisfy explicit requirements
→ identify material feasibility/risk issues
→ propose acceptable alternatives where needed
→ maximize probability of a viable customer decision
```

고객 RFP를 교정하거나 비판하는 것이 제안의 목적이 아니다. Engineering truth/feasibility/material risk가 문제라면 고객이 받아들일 수 있는 assumption, option, risk, alternative로 완곡하게 제시한다. 수용 불가능한 조건이면 제안하지 않는 판단도 포함한다. 이 예외는 §9(Vendor/Product/LLM Independence)나 §1(Global Baseline)을 무효화하지 않는다 — 다만 이 과정에서 evidence의 1차 목적은 "보편적으로 옳은 원칙 증명"이 아니라 "이 고객의 결정을 위한 근거"라는 점이 다르다. 상세 근거·출처 분류는 `courses/sw-proposal/design/references/verified-sources.md`를 따른다.
