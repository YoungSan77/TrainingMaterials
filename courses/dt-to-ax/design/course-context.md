# DT→AX — Course Context

> **Course ID:** dt-to-ax
> **Stage:** Course Design (Stage 1 of 3) — 이 문서는 `guides/과정_설계_지침.md` §2-a 구조를 따른다.
> **Authority:** `portfolio/practice-standard.md` · `portfolio/evidence-policy.md` · `portfolio/concept-ownership.md` "### DT→AX"(Current Concept Owners) · `portfolio/principles.md` §C11(AX-01~05) · `portfolio/terminology.md`("Digital Transformation (DT)", "AX / AI Transformation") — portfolio-wide 정본.
> **Migration provenance:** legacy context v2.6에서 progression/priority/rationale/coverage-intent만 흡수했다. 현재 권위는 위 Portfolio 정본과 이 Course Design에 있다.
> **Greenfield note:** 이 과정은 저장소에 기존 `curriculum.md`가 없다(11개 과정 중 Course Design을 처음 저작하는 과정). 따라서 `guides/과정_설계_지침.md` §6의 Curriculum Authoring Gate가 그대로 적용된다 — 이 Course Design 승인 전에는 curriculum/session 재작성, source/deck 생성, renderer 변경을 하지 않는다.

---

## 1. Course Purpose

DT와 AI Transformation을 기술 목록으로 가르치지 않고, 조직이 기술 변화로 인해 가치창출 방식·업무·의사결정·운영모델을 어떻게 재설계할지 판단하도록 한다. `AX`는 이 과정에서 **AI Transformation을 지칭하는 교육용 약칭**으로 사용하며, 업계 전체에 단일 표준 명칭이 확립되어 있다고 가정하지 않는다(baseline §1, `portfolio/terminology.md`).

## 2. Target Learner

- 조직의 DT/AX 전략과 실행 우선순위를 정해야 하는 리더·기획자·아키텍트.
- Decision Level: **Decide / Govern.**

## 3. Capability Gap

학습자는 현재 기술 도입 목록을 transformation으로 오해하거나, 전사 roadmap에서 실제 bottleneck과 사용자/업무 문제를 놓친다(baseline "Learner & Context Fit").

## 4. Typical Failure

baseline §24 Anti-Patterns와 각 Topic의 Failure/Anchor에서 추출:

- DT를 Cloud migration이나 새 시스템 구축과 동일시한다(§24-1,2).
- AX를 특정 Chat AI 도입이나 모든 업무 자동화와 동일시한다(§24-3,4).
- Agent를 무조건 더 성숙한 AI 형태로 취급한다(§24-5, T05).
- AI 적용건수·PoC 수·AI 사용량을 성과·혁신·직원 KPI로 사용한다(§24-6,7,15, T12 anchor "AI Adoption은 결과가 아니다").
- 기존 프로세스를 그대로 둔 채 AI assistant만 추가한다(§24-8).
- 데이터 품질 문제를 모델로 해결하려 하거나 책임이 불명확한 상태에서 자동 의사결정을 확대한다(§24-9,10).
- Governance를 승인위원회 추가로 취급한다(§24-11, T09 anchor).
- Pilot 성공 후 운영 준비 없이 Scale하거나, 실패한 Pilot을 중단하지 못한다(§24-19,20).
- Technology Roadmap을 Transformation Roadmap과 동일시한다(§24-17).

## 5. Target Capability

business/process/decision change를 중심으로 transformation opportunity를 발견하고 pilot evidence로 scale/stop을 결정한다(baseline "Learner & Context Fit").

---

## 6. Course Thesis

> **디지털 전환은 기술을 도입하는 프로젝트가 아니라 디지털 역량을 이용해 가치창출 방식과 운영체계를 바꾸는 조직 변화이며, AI 전환은 그 위에서 사람과 AI 사이의 업무·판단·책임 배분까지 다시 설계하는 다음 단계의 전환이다.** (baseline §1)

## 7. Course Narrative

역사·기술 축(baseline §1):

```text
Computerization → Digitization → Digitalization → Digital Transformation
→ AI-enabled Transformation → AI-native Operating Model
```

이는 단순 기술 세대 교체가 아니라 다음 인과 사슬이다:

```text
Technology Change → Capability Change → Process / Decision Change
→ Operating Model Change → Value Model Change
```

Course spine(source evidence pack v2.0 §6, `courses/dt-to-ax/design/references/verified-sources.md` §8과 동일):

```text
Value → Capability → Work / Decision Redesign → Foundation
→ Governance → Pilot → Evidence → Scale / Stop
```

AX에서는 Transformation Reference Model(baseline §7)에 다음 축이 추가된다:

```text
Who does the work? — Human / AI / Human + AI
```

---

## 8. Learner & Context Fit

> baseline(`11_dt-to-ax.md` "Learner & Context Fit")이 이미 채운 절이므로 요약하거나 다시 짓지 않고 그대로 가져온다(`guides/과정_설계_지침.md` §3).

- **Audience / Work Context:** 조직의 DT/AX 전략과 실행 우선순위를 정해야 하는 리더·기획자·아키텍트.
- **Current Capability / Failure Mode:** 기술 도입 목록을 transformation으로 오해하거나 전사 roadmap에서 실제 bottleneck과 사용자/업무 문제를 놓친다.
- **Target Capability:** business/process/decision change를 중심으로 transformation opportunity를 발견하고 pilot evidence로 scale/stop을 결정한다.
- **Decision Level:** Decide / Govern.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## 9. Foundational Decision Lens Fit

> `portfolio/principles.md` §A의 5개 Lens 중 이 과정에 실제로 강화되는 것만 채택한다. migration 당시 흡수·검증된 판정("11 DT→AX | Design, Systems, Lean, ToC, Empiricism | transformation problem/value flow/constraint/pilot-scale 판단에 모두 실제 필요하다. 적절함.")을 현재 기준선으로 유지한다.

- **APPLY:** Design Thinking; Systems Thinking; Lean Thinking; Theory of Constraints; Empiricism / Scientific Thinking (baseline "Foundational Decision Lens Alignment", `portfolio/principles.md` §C11 Primary Parent Lenses와 일치).
- **Why:** 문제와 value stream을 먼저 보고 whole system과 constraint를 진단한 뒤 pilot을 통해 학습하고 확대한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.
- 이 과정은 11개 과정 중 5개 Lens를 모두 APPLY하는 유일한 과정이다(감사 결과 §4 표 참조) — transformation 진단(Systems/ToC)·문제 정의(Design Thinking)·flow/waste(Lean)·pilot evidence(Empiricism)가 모두 실제 판단축이기 때문이며, 형식상 채택이 아니다.

---

## 10. Decisions Learner Must Make

baseline의 Topic 판단 질문(T01/T03/T05/T06)과 Integrated Case 최종 판단(§20), Course Ownership(§5)에서 추출 — 새로 짓지 않는다.

1. 우리가 원하는 것은 새로운 기술인가, 다른 사업 결과인가?(T01)
2. 이 Initiative가 기존 일을 더 빠르게 하는가, 아니면 가치창출 방식을 바꾸는가?(T03)
3. 현재 transformation을 막는 실제 bottleneck은 Strategy/Process/Data/Technology/People/Governance/Learning 중 어디에 있는가?(T04, 7-capability readiness)
4. 어떤 업무·의사결정 문제가 있고, AI가 그 문제의 economics를 실제로 바꾸는가?(T06)
5. AI use case를 value/실행가능성/risk로 어떻게 portfolio화(Start/Governed Pilot/Opportunistic/Avoid)할 것인가?(T06)
6. 어떤 task/decision을 Human, AI, Human+AI에 배치하고 decision rights(recommend/decide/execute/escalate)를 어디에 둘 것인가?(T08)
7. 어떤 지점에서 human oversight가 필수인가(high-impact, ambiguity, exception, irreversible action, ethical/legal risk, confidence threshold breach)?(T08)
8. AI governance를 무엇을 막기 위해서가 아니라 위험 허용범위 안에서 무엇을 더 빠르게 하기 위해 설계할 것인가?(T09)
9. 조직·리더십·인센티브·역할을 기술변화와 어떻게 함께 바꿀 것인가?(T10)
10. 어떤 pilot을 어떤 evidence(Outcome/Flow/Quality/Economics/Risk/Learning)로 scale/adapt/stop할 것인가?(T11/T12)
11. DT debt는 무엇이며, DT가 미성숙한 상태에서 AI를 확대하면 그 불안정성이 증폭되는 지점은 어디인가?(§4 "중요한 결론")

---

## 11. Course Scope — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

### 11.1 OWNER

DT→AX는 다음을 **자체 소유 판단**으로 가르친다(`portfolio/concept-ownership.md` "### DT→AX" OWNER 목록, baseline §5와 일치):

- Transformation Strategy / Diagnosis
- Value / Capability / Operating Model redesign
- Portfolio prioritization
- DT → AI Transformation transition
- AI Use-case Portfolio
- Human / AI work and decision allocation
- Organization / leadership / capability change
- AI Governance orientation
- Transformation Roadmap / Pilot / Evidence / Scale–Stop
- Measurement (adoption이 아닌 value evidence)

### 11.2 APPLY / RECAP ONLY (다른 과정의 OWNER 개념 — 재정의 금지)

baseline §6 "다른 과정과의 경계"에서 그대로 옮김:

- **AI-Native SW Engineering:** AI를 활용한 SW Engineering, Context / Guardrail / Agent / Harness, AI-assisted development lifecycle은 AI-Native SE가 OWNER다. 본 과정은 "기업/조직이 어디에 AI를 적용하고 어떤 Operating Model로 전환할 것인가"만 다루며, AI-assisted/agentic software engineering mechanics는 다루지 않는다(`portfolio/practice-standard.md` §9 Course Ownership Rule: "AI-Native는 Context / Guardrail / Harness / Agent mechanics와 실행형태 선택을 소유한다. 다른 과정에서 AI-Native 개념이 필요할 경우 최소 RECAP/APPLY만 사용한다").
- **SW Architecture / EA:** 상세 architecture design은 비범위. Enterprise Architecture는 transformation의 구조적 제약/전환 맵으로만 APPLY(§14 "EA는 그림을 만드는 활동이 아니라 AI가 접근할 시스템·데이터·경계·의존성을 관리하는 구조적 기반이 될 수 있다").
- **Agile:** 작은 실행·Feedback 원리는 APPLY. Scrum 상세는 비범위.
- **DevOps:** delivery capability를 transformation enabling capability로만 참조(APPLY). CI/CD 상세는 비범위.
- **PM:** transformation portfolio / roadmap 수준까지만 APPLY. PMBOK 상세는 비범위.

### 11.3 NON-SCOPE / FORWARD

baseline §25 Explicit Non-Scope 전체(축약하지 않음):

- ISP / ISMP 수행방법 상세
- EA Framework 상세
- TOGAF 교육
- BPR 방법론 상세
- Cloud architecture
- ML model development
- Prompt engineering
- Agent 구현
- AI-Native SW Engineering 상세
- AI 법규 전문교육
- ISO/IEC 42001 인증교육
- NIST AI RMF 상세 implementation
- 조직설계 전문과정
- Change Management 자격과정
- 산업별 사례 catalog

### 11.4 Ownership Boundary Risk — 명시적 경고

> **`portfolio/concept-ownership.md` "### DT→AX" Boundary와 `portfolio/practice-standard.md` §9가 명시적으로 금지한다:**
> DT→AX는 **AI-assisted/agentic software engineering mechanics**(Context Engineering, Guardrail, Harness, Agent 실행 mechanics, AI-assisted development lifecycle)를 자체 OWNER 개념으로 재정의하지 않는다. 이 과정이 다루는 "Human/AI work and decision allocation"은 **업무·조직 차원의 배치 판단**이며, AI-Native SE가 소유하는 **SW Engineering 실행 mechanics**(어떤 Context를 어떻게 구성하고 어떤 Harness로 Agent를 통제하는가)를 재정의하는 것이 아니다.
>
> baseline §12(Topic 05, AI 4-Level: Assist/Augment/Automate/Agentic)와 §15(Topic 08, Human+AI Operating Model)는 "AI가 무엇을 하는가"의 **조직적 배치**를 다루지, "Agent를 어떻게 구현/제어하는가"의 **엔지니어링 mechanics**를 다루지 않는다 — 이는 §25 Non-Scope("Agent 구현", "AI-Native SW Engineering 상세")로 명시적으로 제외되어 있다. 향후 이 과정의 Curriculum이 "Guardrail"이나 "Harness"라는 용어를 AI-Native와 무관하게 독자 정의하려 한다면, 그것은 ownership violation이다 — AI-Native SE RECAP/APPLY로만 인용해야 한다.

### 11.5 Local Context / Institutional Content — 명시적 처리 방침

ISP(정보화전략계획) / ISMP(정보시스템 마스터플랜)는 baseline §2.3에서 "DT 이전의 낡은 산출물 체계"로 폐기하지 않고 오늘날에도 필요하다고 명시하지만, 이는 **한국 공공/기업 조달·투자 정렬 제도의 Local Context**이지 global engineering principle이 아니다(`portfolio/evidence-policy.md` §7.1, source evidence pack v2.0의 분류표 — Evidence Role: Contextual Adaptation / Institutional Context, Transferability: Local-Institutional). 이 과정에서 ISP/ISMP를 다룰 때는:

- **Global Principle**(전략↔투자 정렬이 필요하다)과 **Local/System Constraint**(한국 조달·계획 제도가 특정 산출물 체계를 요구한다)를 분리한다.
- ISP/ISMP를 보편적 DT/AX 방법론으로 제시하지 않는다 — Course-owned Context/Reference로만 사용한다(source evidence pack 분류표 Curriculum Use 열).
- 상세 수행방법(공정도, 산출물 목록)은 §25 Non-Scope이며, baseline §9(Topic 02) "Reduce" 지침대로 Appendix/awareness로만 유지한다.

---

## 12. Key Distinctions

`portfolio/terminology.md` §H "반드시 구분할 쌍"에는 이 과정에 해당하는 기존 pair가 없다(해당 목록은 OOAD/DDD/Architecture/Agile 개념쌍 중심). 대신 baseline의 Anchor/Anti-Pattern에서 이 과정이 실제로 요구하는 구분을 그대로 옮긴다:

- **Digitization / Digitalization / DT / AX** — 정보의 디지털화 vs 프로세스 연결·데이터 기반 운영 vs 가치창출 방식·운영모델 재설계 vs 사람·AI 업무/판단/책임 재배치(baseline §1, §9).
- **Technology Adoption ≠ Business Transformation** — "시스템을 새로 만드는 것과 조직이 달라지는 것은 다른 일이다"(T01 anchor). Technology Roadmap ≠ Transformation Roadmap(§24-17).
- **Transformation Maturity Score ≠ Bottleneck** — "성숙도 점수가 아니라 다음 Bottleneck을 찾는 것이 목적이다"(T04 anchor).
- **Higher AI Level(Agentic) ≠ Better** — Assist/Augment/Automate/Agentic은 성숙도 사다리가 아니다. "높은 Level이 더 좋은 것은 아니다"(T05).
- **"무엇을 자동화할 것인가?" ≠ "어떤 판단과 행동을 누구에게 맡기고 어디에서 사람이 개입해야 하는가?"**(T05) — AX가 실제로 바꾸는 질문.
- **AI Governance ≠ 승인위원회** — "AI Governance의 목적은 AI 사용을 막는 것이 아니라, 위험 허용범위 안에서 더 빠르게 사용할 수 있게 하는 것이다"(T09 anchor, §24-11).
- **Pilot ≠ Showcase** — pilot은 중요한 transformation assumption을 검증하는 learning device다(`portfolio/principles.md` AX-04).
- **AI Adoption ≠ Value Evidence** — "AI Adoption은 결과가 아니다"(T12 anchor). AI 사용자 수·Prompt 수·PoC 개수는 Evidence가 아니다(§24-6,7,15).
- **ISP/ISMP/EA = 낡은 산출물 체계 ≠ 폐기 대상** — 오늘날에도 필요하나, "산출물을 만드는 것이 목적이 되면 다시 Cargo Cult가 된다"(§2.3).

---

## 13. Course-specific Principles / Trade-offs / Failure Conditions

Parent Lens(§9)를 이 과정에서 구체화한 Child principle이다 — `portfolio/principles.md` §C11 AX-01~05(portfolio canon)을 그대로 인용하고, Precondition/Trade-off/Failure Condition은 baseline의 해당 Topic 근거로 채운다.

| Principle | 전제 조건 | Trade-off | Failure Condition | Parent Lens |
|---|---|---|---|---|
| AX-01. Outcome before Technology Adoption | 기술 도입 전에 business/customer/process/decision outcome을 정의할 수 있음 | 기술 결정 속도 저하 / 사업 정렬 향상 | 신기술 도입률·시스템 구축 완료를 성과로 사용(§24-1,2,6,7,17) | Design Thinking(DT-01 Problem before Solution) |
| AX-02. Transformation Is Socio-Technical System Change | process/data/organization/governance/capability/decision right를 함께 다룰 권한이 있음 | 조정 비용 증가 / 기술 단독 최적화 방지 | 기존 프로세스를 그대로 둔 채 AI assistant만 추가(§24-8) | Systems Thinking(SYS-01/02) |
| AX-03. Find the Transformation Constraint | 7-Capability readiness 진단으로 실제 bottleneck을 식별할 수 있음 | 초기 진단 시간 증가 / 자원 낭비 감소 | 성숙도 점수 자체를 목표로 삼거나 constraint 진단 없이 AI capability부터 확대(T04 anchor) | Theory of Constraints(TOC-01) |
| AX-04. Pilot to Learn before Scaling | pilot을 bounded risk·short feedback cycle로 설계할 수 있음 | 확산 속도 저하 / 가정 검증 확보 | Pilot을 showcase로 사용하거나 실패한 Pilot을 중단하지 못함(§24-19,20) | Design Thinking(DT-02 Prototype to Learn) / Lean |
| AX-05. Scale only with Evidence | Outcome/Flow/Quality/Economics/Risk/Learning evidence를 수집할 수 있음 | 확장 속도 저하 / 잘못된 확산 방지 | Adoption count(사용자 수·Prompt 수·PoC 개수)를 Evidence로 사용(§24-6,7,15, T12 anchor) | Empiricism(EMP-04 Evidence Must Change Decisions) |

---

## 14. Cross-course Interfaces

### 14.1 Position

```text
DT→AX
Enterprise Transformation / Human+AI Operating Model
        ↕
AI-Native SE
AI-assisted / Agentic SW Engineering
```

(`portfolio/concept-ownership.md` Cross-Course Bridge Summary와 일치)

### 14.2 Uses (Related Course Boundaries) — baseline §6

| Course | Relationship | Boundary Rule |
|---|---|---|
| AI-Native SE | Human/AI work allocation 판단에서 AI capability level(Assist/Augment/Automate/Agentic) 개념을 조직 배치 관점으로 사용 | Context/Guardrail/Agent/Harness/AI-assisted development lifecycle은 AI-Native SE가 소유 |
| SW Architecture / EA | Enterprise Architecture를 transformation 구조적 제약/전환 맵으로 사용 | 상세 architecture design은 SWA가 소유, 비범위 |
| Agile | 작은 실행·Feedback 원리를 pilot 설계에 적용 | Scrum 상세는 Agile이 소유, 비범위 |
| DevOps | delivery capability를 transformation enabling capability로 참조 | CI/CD/Deployment 상세는 DevOps가 소유, 비범위 |
| PM | transformation portfolio/roadmap 수준의 governance를 다룸 | PMBOK 상세 project control은 PM이 소유, 비범위 |

### 14.3 Forward (다른 과정이 DT→AX로부터 가져가는 것)

- AI-Native SE는 DT→AX가 정의한 "어디에 AI를 적용할 것인가(Use Case Portfolio, Human/AI 배치)"를 입력으로 받아 "어떻게 구현할 것인가(Context/Guardrail/Harness/Agent)"를 소유한다 — DT→AX는 "왜/어디" evidence, AI-Native SE는 "어떻게" 실행을 소유한다(§6 경계와 대칭 구조).

---

## 15. Portfolio Alignment Summary

- **OWNER:** Transformation Strategy/Diagnosis, Value/Capability/Operating Model redesign, DT↔AX transition, AI Use-case Portfolio, Human/AI work and decision allocation, AI Governance orientation, Transformation Roadmap/Pilot/Evidence/Scale-Stop.
- **Boundary:** AI-Native SE owns AI-assisted/agentic software engineering mechanics; DT→AX owns enterprise/business operating-model transformation(`portfolio/concept-ownership.md` "### DT→AX" Boundary).
- **Rollout order (portfolio-wide):** `practice-standard.md` §15 — OOAD → DDD → SW Architecture → MSA → AI-Native → Modern SWQM → Agile → DevOps → SW Project Management → SW Proposal → **DT→AX** → 11-course Alignment Audit → New Unified Portfolio ZIP.
- **Duration:** 8h 운영 기준, 최대 480분(baseline). Instructional time 약 400분 + 휴식 약 80분.
