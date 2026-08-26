# AI-Native Software Engineering — Course Design

## Identity

- **Slug:** `ai-native`
- **Confirmed duration:** 16h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

AI가 포함된 software engineering work를 specification·context·delegation·guardrail·harness·evaluation으로 설계하고 책임 있게 운영하게 한다.

## Target Learner

LLM coding 도구를 사용하지만 prompt 품질과 engineering reliability를 구분하지 못하거나 agentic automation을 검토하는 engineer·tech lead

## Capability Gap

- 더 강한 model이나 prompt가 reliability를 자동 해결한다고 본다
- context·권한·state·tool·failure contract 없이 task를 위임한다
- demo 성공을 production evidence로 오해한다
- human review와 자동 harness의 책임을 구분하지 않는다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- 문제를 manual/assisted/workflow/agent 중 적절한 실행형태로 선택한다
- intent를 검증 가능한 specification과 stage contract로 만든다
- 필요 context와 tool/permission/state를 설계한다
- guardrail·harness·evaluation·observability·HITL을 위험에 맞게 배치한다
- capability drift와 failure에서 통제 구조를 갱신한다

## Course Thesis

> AI-native engineering의 핵심은 model 호출이 아니라 불확실한 생성 능력을 책임 있는 execution boundary와 검증 evidence 안에 배치하는 것이다.

## Core Learning Scope

- execution-form selection
- specification과 acceptance evidence
- context engineering
- tool·permission·state contract
- guardrail와 autonomy boundary
- deterministic harness와 semantic evaluation
- workflow/agent orchestration와 HITL
- trace·observability·recovery
- security/privacy/vendor independence
- capability/evaluation drift

## Ownership

- **Owns:** AI delegation·specification·context·guardrail·harness·evaluation·autonomy mechanics

### Non-scope

- 다른 과정의 전문 판단 재정의
- 특정 vendor SDK 사용법
- foundation model 학습 이론
- prompt trick catalog
- 조직 AI transformation portfolio

### Cross-course Boundary / Handoff

- 각 전문 과정이 제공한 artifact와 judgment를 input으로 사용한다
- quality evidence는 SWQM과 연결한다
- 조직 adoption·operating model은 DT→AX로 넘긴다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 이 작업에 AI가 필요한가, 어떤 실행형태가 가장 단순한가
- 무엇을 specification과 acceptance evidence로 고정할 것인가
- 어떤 context·tool·permission·state를 제공할 것인가
- 어디서 자동 차단·semantic review·human approval이 필요한가
- failure와 capability change를 어떻게 관찰·복구할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. AI use case와 실행형태를 선택한다
2. intent를 specification으로 만든다
3. context와 execution boundary를 설계한다
4. guardrail과 harness를 배치한다
5. workflow/agent·HITL을 위험에 맞게 구성한다
6. evaluation·observability·recovery로 운영한다

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Execution-form decision | manual/assist/workflow/agent 중 최소 충분 형태 판단 | decision matrix와 rejected options | agent 사용을 목표로 두는 경우 |
| Specification and context | 모호한 task를 acceptance evidence와 context package로 바꿈 | stage contract·context map | 긴 prompt만 만들고 성공 조건이 없는 경우 |
| Guardrail/harness design | 위험별 예방·탐지·승인 위치 판단 | control map과 test cases | 모든 검사를 prompt에 넣거나 human review만 의존하는 경우 |
| Agent boundary | tool·permission·state·HITL·recovery 설계 | execution boundary와 failure transitions | 권한과 rollback 없이 자율성만 높이는 경우 |
| Evaluation and drift | 품질·안전·비용·latency evidence 선택 | evaluation set·trace plan·change trigger | single score나 demo success로 승인하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [AGENT][DEFINITION][ANCHOR] | Agent | “Agents are systems that independently accomplish tasks on your behalf.” | OpenAI, A practical guide to building agents | — | [Agent를 단순 chatbot/LLM call과 구분하는 최소 정의. (OpenAI)](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/?utm_source=chatgpt.com "A practical guide to building agents") |
| [AGENT][DEFINITION][ANCHOR] | Workflow vs. Agent | “Agents ... are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.” | Anthropic, “Building Effective AI Agents” | https://www.anthropic.com/engineering/building-effective-agents?via=aitoolhunt | Agentic system의 핵심을 model-directed process/tool use로 고정. predefined workflow와 구분. (Anthropic) |
| [CONTEXT][DEFINITION][ANCHOR] | Context Engineering | “Context engineering refers to the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference” | Anthropic, “Effective context engineering for AI agents”, 2025 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Prompt Engineering보다 넓은 Context Engineering의 직접 정의. (Anthropic) |
| [ENGINEERING][QUOTE][ANCHOR] | Engineer's Role Changes | “a software engineering team’s primary job is no longer to write code, but to design environments, specify intent, and build feedback loops” | Ryan Lopopolo / OpenAI, “Harness engineering: leveraging Codex in an agent-first world”, 2026 | — | [AI-native 개발에서 인간의 중심 업무가 code typing에서 environment + intent + feedback system design으로 이동한다는 직접적 경험 문구. (OpenAI)](https://openai.com/index/harness-engineering/?utm_source=chatgpt.com "Harness engineering: leveraging Codex in an agent-first world") |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [HARNESS][REFERENCE][CORE] | Harness Engineering | OpenAI, “Harness engineering: leveraging Codex in an agent-first world” | — | [Repository knowledge, architecture enforcement, tools, tests, feedback loop, observability, autonomy를 하나의 engineering environment로 다루는 핵심 contemporary reference. (OpenAI)](https://openai.com/index/harness-engineering/?utm_source=chatgpt.com "Harness engineering: leveraging Codex in an agent-first world") |
| [HARNESS][REFERENCE] | Harness Design | Anthropic, “Harness design for long-running application development” | https://www.anthropic.com/engineering/harness-design-long-running-apps | Harness를 고정된 framework가 아니라 model capability와 함께 계속 검증·단순화해야 하는 execution system으로 다룰 reference. (Anthropic) |
| [STANDARD][REFERENCE] | AI Risk Management Framework | NIST, AI RMF 1.0 및 GenAI Profile | — | AI risk/governance가 필요한 지점의 authoritative reference. 과정의 engineering spine으로 사용하지 않음 |
