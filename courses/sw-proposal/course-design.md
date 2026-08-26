# SW 제안 전략과 제안서 작성 실무 — Course Design

## Identity

- **Slug:** `sw-proposal`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

기회를 추구할지, 고객이 무엇으로 구매를 결정하는지, 어떤 약속을 evidence로 신뢰시킬지를 판단해 설득력 있고 실행 가능한 제안을 만들게 한다.

## Target Learner

RFP 응답과 기술제안 작성 경험은 있지만 compliance 중심 문서와 win strategy를 구분하기 어려운 proposal lead·PM·architect

## Capability Gap

- RFP를 다시 쓰는 것을 고객 이해로 오해한다
- 모든 기회에 입찰하고 solution을 먼저 만든다
- 주장·차별점·delivery 약속에 evidence가 없다
- 설득력과 실행 가능성을 분리한다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- bid/no-bid를 가치·승산·실행가능성으로 판단한다
- stakeholder와 buying criteria를 모델링한다
- compliance를 넘어 win theme과 discriminators를 만든다
- solution·delivery·risk promise를 evidence와 연결한다
- review에서 약한 주장과 과잉 약속을 제거한다

## Course Thesis

> 좋은 SW 제안은 문서를 잘 쓰는 기술이 아니라 고객의 구매결정을 이해하고, 이길 이유와 실행 가능한 약속을 evidence로 설계하는 일이다.

## Core Learning Scope

- opportunity qualification와 bid/no-bid
- customer/stakeholder decision system
- RFP requirement·evaluation criteria·ambiguity
- win strategy·theme·discriminator
- solution/delivery approach의 proposal-level framing
- assumption·constraint·risk·dependency
- claim–evidence storyline
- compliance·quality review와 red-team reasoning

## Ownership

- **Owns:** opportunity qualification·customer decision·win strategy·proposal credibility

### Non-scope

- 상세 architecture design
- project execution governance
- 영업 negotiation 전체
- 문서 디자인 도구
- 허위 certainty나 근거 없는 capability claim

### Cross-course Boundary / Handoff

- architecture/delivery feasibility는 SW Architecture·DevOps·PM에서 받는다
- 수주 후 integrated governance는 PM으로 넘긴다
- transformation proposal이면 DT→AX outcome을 입력으로 사용한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 이 기회를 추구해야 하는가
- 실제 decision maker와 buying criteria는 무엇인가
- 어떤 win theme이 중요하고 방어 가능한가
- 무엇을 약속하고 assumption/risk로 남길 것인가
- 어떤 claim에 어떤 evidence가 필요하며 무엇을 삭제할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 기회를 qualify한다
2. 고객 decision system과 RFP를 분석한다
3. win strategy와 storyline을 만든다
4. credible solution/delivery/risk promise를 구성한다
5. claim–evidence review로 제안을 강화한다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Bid/no-bid | value·win probability·feasibility 판단 | decision memo·assumptions | 매출 가능성만으로 bid하는 경우 |
| RFP to win strategy | compliance와 buying criteria를 구분 | requirement map·win themes | RFP 문구를 제목으로 바꾸는 데 그치는 경우 |
| Credible promise | solution/delivery/risk 약속의 한계를 판단 | promise/assumption/evidence matrix | 확인되지 않은 capability를 확정 약속하는 경우 |
| Claim–evidence review | 핵심 주장과 evidence 충분성 판단 | storyline·삭제/보강 목록 | 장식적 수치와 일반론으로 분량을 채우는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [CUSTOMER][QUOTE][ANCHOR] | Write for the Customer | “As a proposal writer, you must always remember you are writing for the customer, not for yourself or your management.” | Shipley, Proposal Writer Playbook, §1.3 | https://digital.shipleywins.com/view/320547 | 제안서를 자사 소개서로 만드는 오류를 차단. Customer가 문서의 중심이라는 가장 직접적인 Anchor. (Shipley) |
| [BENEFIT][QUOTE][ANCHOR] | Benefits Before Features | “Customers buy benefits, not features. They buy what your product or service will do for them, not its features.” | Shipley, “Seven Rules for Writing Winning Proposals” | https://www.shipleywins.com/blogs/seven-rules-for-writing-winning-proposals | 기술·기능 나열형 SW 제안서를 막고 customer outcome/value 중심으로 전환. (Shipley Wins) |
| [NEED][QUOTE][ANCHOR] | Benefit Requires Customer Need | “No Product/Service Benefits without a Customer Need.” | Shipley, “Seven Rules for Writing Winning Proposals” | https://www.shipleywins.com/blogs/seven-rules-for-writing-winning-proposals | Benefit도 고객의 실제 problem/opportunity와 연결되지 않으면 의미가 없다는 판단 기준. (Shipley Wins) |
| [THEME][DEFINITION][ANCHOR] | Theme Statement | “Theme statements in proposals link benefits for the customer to features of the solution in your offer.” | Shipley, Proposal Writer Playbook | https://digital.shipleywins.com/view/320547/34/ | Theme을 slogan이 아니라 customer benefit ↔ solution feature 연결로 정의. (Shipley) |
| [EVIDENCE][QUOTE][ANCHOR] | Claims Require Evidence | “Quantified benefits must be supportable, and you should provide evidence soon after in the proposal. If you cannot support your claims, change your theme statement.” | APMP, Body of Knowledge – Bid & Proposal Writing | https://www.apmp.org/assets/BoK-BW-M.v4.pdf | 숫자·성과·우월성 주장에 proof가 따라야 한다는 강한 Anchor. (APMP) |
| [VALUE][DEFINITION][ANCHOR] | Value Proposition | “A value proposition is an offer demonstrating value or worth to the customer.” | Shipley, Proposal Writer Playbook | https://digital.shipleywins.com/view/320547/34/ | Value proposition을 자사 강점 소개가 아니라 customer에게 제공하는 가치로 고정. (Shipley) |
| [WIN][QUOTE][ANCHOR] | Win Strategy | “Win strategies perform four key functions: Leverage your strengths; Mitigate your weaknesses and risks; Neutralize your competitors’ strengths; Exploit your competitors’ weaknesses.” | Shipley, Proposal Writer Playbook | https://digital.shipleywins.com/view/320547 | Win Strategy가 화려한 문구가 아니라 경쟁 상황에 대한 선택과 집중임을 설명. (Shipley) |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][BACKBONE] | Shipley Proposal Guide | Shipley Associates, Shipley Proposal Guide, v5 | https://www.shipleywins.com/tools-and-guidebooks/digital-proposal-guide | 과정의 핵심 실무 backbone. Proposal Strategy, Customer Focus, Bid/No-Bid, Compliance, Theme, Review, Document Design 등을 연결. (Shipley Wins) |
| [REFERENCE][CORE] | APMP Body of Knowledge | APMP, Body of Knowledge – Bid & Proposal Writing | https://www.apmp.org/assets/BoK-BW-M.v4.pdf | Capture/Proposal professional practice와 customer-focused proposal writing의 권위 있는 Reference. (APMP) |
| [EVIDENCE][REFERENCE][CORE] | Customer / Opportunity Evidence | 실제 RFP, evaluation criteria, Q&A, customer discovery, contract/compliance sources | — | 특정 opportunity에서는 일반 best practice보다 고객이 제공한 source가 우선. 과정에서 evidence hierarchy를 적용하는 실무 Reference |
| [EVIDENCE][REFERENCE] | Past Performance / Proof | 실제 조직의 검증 가능한 delivery evidence | — | “우수하다”, “최고다” 같은 adjective 대신 비교 가능한 실적과 proof로 신뢰를 만드는 Reference |
