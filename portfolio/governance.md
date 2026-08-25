# Portfolio Governance — Structure, Change Protocol & Quality Gate v2.6

> **Status:** Portfolio Canon
> **Legacy migration provenance:** legacy context v2.6의 File Structure & Authority, Change & Extension Protocol, Quality Gate를 하나로 흡수했다. 현재 운영 거버넌스의 유일한 정본은 이 문서이며 legacy 자료는 Git history에만 보존된다.
> 개념 정의·소유권은 이 문서가 아니라 `terminology.md`·`concept-ownership.md`가 소유한다.

---

# Part A — Portfolio File Structure & Authority Standard v1.2

> **Purpose:** 모든 파일이 하나의 책임과 예측 가능한 위치를 갖도록 하여, 과정이 늘거나 자산이 추가되어도 구조가 무너지지 않게 한다.

## A1. Structural Principle

Portfolio는 **Authority 축**과 **Course ID 축** 두 개만 사용한다.

- Authority 축: `Governance → Course Baseline → Course Asset / Source Evidence → Audit`
- Course ID 축: `01 OOAD → ... → 11 DT→AX`

새로운 임의 분류축을 만들지 않는다.

## A2. Directory Classes

| Location | Responsibility | Canon | Numbering |
|---|---|---|---|
| `courses/<slug>/design/` | 현재 Course Baseline(Course Context/Practice Design/References) | Course-level Yes | Course slug 고정 |
| Portfolio-wide 원칙·용어·Ownership·Change Protocol·Quality Gate | `portfolio/` | Portfolio-level Yes | — |
| Course-specific instructor/design 재사용 자산 | 해당 `courses/<slug>/design/` 내부 | No | — |
| 과정별 근거·출처·최신성 검증 | `courses/<slug>/design/references/` | No | — |

> 이 표는 원문(context ZIP 기준 `support/02_course-assets/`·`support/03_source-evidence/`·`support/04_audit/` 4분류)을 이 저장소의 실제 구조(`courses/<slug>/design/`)에 맞게 재배치한 것이다. 원문 4분류 자체는 아래 원본 규칙(A3~A9)에서 그대로 보존한다.

## A3. Authority Order

```text
Portfolio Governance
→ Course Baseline
→ Course Asset / Source Evidence
→ Audit / External or Legacy Material
```

- Course Asset은 Course Baseline을 보완하지만 재정의하지 않는다.
- Source Evidence는 근거를 제공하지만 개념의 Owner가 아니다.
- Audit은 오류를 발견·기록하지만 Canon을 대신하지 않는다.

## A4. Numbering Rule

1. 파일을 직접 포함하는 모든 관리 폴더는 `00_MANIFEST.md`를 둔다(Portfolio-wide governance ZIP 원문 기준 — 이 저장소에서는 폴더 수가 적어 `00_MANIFEST.md`를 강제하지 않되, 원칙은 유지한다: 각 폴더의 index 역할은 해당 폴더의 README나 최상위 파일이 겸한다).
2. Course 관련 번호는 어느 폴더에서도 Course ID `01–11`을 유지한다(원 ZIP 기준. 이 저장소에서는 slug 기반 디렉터리명을 사용한다).
3. placeholder 파일을 만들지 않는다. 번호 공백은 오류가 아니라 **아직 필요 없는 자산**을 뜻한다.
4. 이미 의미가 부여된 Course ID를 다른 과정에 재사용하지 않는다.

## A5. Course Asset Admission Rule

자산은 다음 질문에 모두 YES일 때만 course design 자산으로 둔다.

1. 특정 과정에서 반복 재사용되는가?
2. Course Baseline에 넣기에는 지나치게 상세하거나 Instructor-only인가?
3. Governance 또는 Source Evidence와 책임이 겹치지 않는가?
4. 수업 운영·설계·검증에 실제로 필요한가?
5. 일회성 작업지시·migration note·revision log가 아닌가?

하나라도 NO이면 기존 파일에 흡수하거나 제외한다.

## A6. LLM Practice Asset Rule

모든 LLM-integrated Practice Pack은 동일 metadata와 Operating Rules를 사용한다. Practice별 필수 필드는 `practice-standard.md`가 정한다.

Practice Pack은 Instructor-only다. 학습자에게는 실습 시작 시 Problem/Context/Inputs/Deliverable/Timebox만 제공하고, Intervention과 Recommended Prompt는 정해진 시점에 공개한다.

## A7. Keep / Remove Rule

**Keep**
- 현재 11개 Course Baseline
- Portfolio-wide Governance Canon
- 현재 과정별 Source Evidence
- 현재 수업에서 반복 사용하는 Course Asset
- 현재 릴리스에 대한 단일 Audit

**Exclude**
- 이미 반영된 revision directive / migration note / temporary checklist
- 폐기 과정 또는 과거 후보 구조 비교문서
- 존재하지 않는 외부 repository를 현재 dependency처럼 전제한 파일
- 동일 내용을 다른 status로 반복하는 candidate spec
- 과거 릴리스 Audit

## A8. Change Decision

새 파일을 만들기 전 우선 판단한다.

- 기존 Owner 문서에 넣는 것이 더 자연스러운가? → 새 파일을 만들지 않는다.
- 독립적으로 반복 재사용되는가? → 적절한 Course Asset 또는 Governance로 분리한다.
- 단지 변경 과정을 기록하기 위한 것인가? → Canon 밖의 작업/아카이브 영역(Git history)에서 관리한다.

## A9. Change / Extension Governance

신규 과정, Course Scope 변경, Principle/Ownership 변경, 중요 Course Asset 추가는 아래 **Part B**를 따른다.

- 구조만 맞춘 뒤 내용을 사후 정렬하지 않는다.
- Learner & Context Fit과 Required Decision을 먼저 확인한다.
- Portfolio-wide 변경은 상위 Governance부터 하위 Course/Asset 순으로 반영한다.
- 릴리스 전 **Part C(Quality Gate)**와 현재 Audit을 통과한다.

---

# Part B — Portfolio Change & Extension Protocol v1.0

> **Purpose:** 신규 과정 추가, 기존 과정 변경, Course Asset 추가가 발생할 때 동일한 판단 순서와 Authority 경계를 강제해 Canon drift와 중복을 방지한다.

## B1. Governing Rule

변경은 **Content-first가 아니라 Need → Learner → Decision → Ownership → Content** 순서로 진행한다.

```text
Learner / Customer Context
→ Desired Outcome
→ Capability Gap
→ Required Decisions
→ Existing Canon Coverage
→ Ownership Impact
→ Course / Curriculum Change
→ Practice / Asset / Evidence
→ Cross-course Impact Review
→ Quality Gate
→ Audit
→ Release
```

새 Topic, Framework, Tool, Standard가 등장했다는 이유만으로 Course나 Curriculum을 먼저 만들지 않는다.

## B2. Learner & Context Fit Gate

모든 신규 과정과 의미 있는 과정 변경은 먼저 다음을 명시한다.

- **Audience:** 실제 어떤 역할/책임을 가진 학습자인가?
- **Current Capability:** 현재 무엇을 할 수 있고 무엇을 못하는가?
- **Work Context:** 어떤 업무·결정 상황에서 사용할 것인가?
- **Pain / Failure Mode:** 현재 어떤 잘못된 판단·실패·비용이 발생하는가?
- **Target Capability:** 교육 후 무엇을 더 잘 판단하거나 수행해야 하는가?
- **Required Decisions:** 실제 업무에서 어떤 결정을 내릴 수 있어야 하는가?
- **Constraints:** 시간·조직·기술·규제·운영 제약은 무엇인가?
- **Transfer Context:** 수업 이후 어디에서 재사용되는가?

### Core Rule

> Course design starts from the learner's required decisions and capability gap, not from the body of knowledge we want to teach.

`Customer-centered ≠ Customer-request-driven`이다. 고객이 요청한 과정명이나 기술을 그대로 Curriculum Spine으로 사용하지 않고, 실제 Capability Gap에 적합한지 검증한다.

## B3. Foundational Decision Lens Review

내용 설계 전에 다음 5개 Lens를 검토한다. 모든 Lens를 억지로 넣지 않고, 해당 Course Decision에 실제로 필요한 것만 APPLY한다.

1. **Systems Thinking** — 전체·상호작용·feedback·delay·local optimization을 보는가?
2. **Lean Thinking** — value flow·waste·batch·built-in quality 관점이 필요한가?
3. **Theory of Constraints** — 현재 전체 성과를 제한하는 핵심 constraint를 식별해야 하는가?
4. **Design Thinking** — solution보다 problem/context를 먼저 이해하고 가설을 싸게 검증해야 하는가?
5. **Empiricism / Scientific Thinking** — fact/hypothesis/evidence/feedback으로 판단을 수정해야 하는가?

Lens 정의와 child principle은 `principles.md`가 소유한다.

## B4. Global Baseline & Source Governance Review

Course content를 만들거나 바꾸기 전에 해당 판단의 근거가 `evidence-policy.md`를 만족하는지 확인한다.

- 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작, 일반화 가능한 실무를 기본 기준으로 삼는다.
- 특정 국가·조직·벤더 사례가 보편 원칙을 대신하지 않는다.
- Primary/Official 여부와 Evidence Strength를 분리한다.
- 국제표준은 Course Decision의 직접 대상이 아닌 한 Reference로 사용한다.
- Local/System Constraint가 있으면 제거 가능성을 먼저 보고, 당장 제거하기 어렵다면 그 제약 안에서 전체 성과를 최적화하는 Contextual Adaptation을 설명한다.
- `현재 constraint에서의 현실적 최적해`와 `constraint 제거 후 preferred state`를 구분한다.
- 특정 LLM/vendor/model/UI/API가 사라져도 Course Concept·Practice·Artifact가 유지되어야 한다.

Source Evidence에는 Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use를 분리하고, BP Classification은 필요한 경우에만 사용한다.

## B5. Change Classification

### A. Content Enhancement
기존 Course Thesis / Ownership / Required Decision은 유지되고 설명·사례·실습만 개선되는 경우.

`Course Baseline → 필요 시 Course Asset → Source Evidence → Quality Gate`

### B. Decision / Scope Change
학습자가 내려야 할 결정이나 Course Scope가 변하는 경우.

`Learner Fit → Principles → Concept Ownership → Cross-course Framework → Course Baseline → Related Courses → Practice → Evidence → Audit`

### C. New Course Admission
독립 Capability Gap과 독립 Decision Ownership이 필요한 경우에만 허용한다.

## B6. Existing Canon Check

새 개념·주제·과정을 만들기 전에 반드시 묻는다.

1. 기존 OWNER가 있는가?
2. RECAP / APPLY / EXTEND / BRIDGE / FORWARD로 충분한가?
3. 기존 과정의 Topic/Module 보완으로 해결 가능한가?
4. 새 OWNER가 정말 필요한가?
5. Tool/Vendor 이름이 사라져도 독립 문제가 남는가?

기존 Owner가 있으면 정의를 복제하지 않는다.

## B7. Course Admission Gate

신규 과정은 다음 조건을 모두 만족해야 한다.

- 독립 Learner Capability Gap이 있다.
- 실제 업무에서 반복되는 독립 Required Decision이 있다.
- 기존 Course의 RECAP/APPLY/EXTEND로 충분하지 않다.
- 새 OWNER 또는 충분히 큰 독립 EXTEND 영역이 있다.
- 기존 Owner 정의를 복제하지 않는다.
- Tool/Vendor가 사라져도 Course Identity가 남는다.
- Trade-off / Failure Condition / Evidence를 정의할 수 있다.
- 독립 수강자를 위한 Minimum Recap을 설계할 수 있다.

> **현재 Portfolio는 11개 과정으로 확정돼 있다(portfolio-context.md 참조).** 이 Gate는 향후 12번째 과정 후보가 등장했을 때 적용한다 — 지금 이 저장소 구조를 만드는 작업(11개 course design 흡수)에는 적용 대상이 아니다.

## B8. Change Order by Authority

Ownership 또는 Portfolio-wide principle이 바뀌는 변경은 아래 순서를 지킨다.

```text
reference-frame
→ principles
→ terminology
→ concept-ownership
→ cross-course-framework
→ (course-spec template, guides/과정_설계_지침.md)
→ affected Course Baselines
→ Course Assets / Source Evidence
→ Quality Gate (Part C)
→ Audit
```

하위 문서를 먼저 바꾸고 상위 Governance를 뒤에서 맞추지 않는다.

## B9. Principle Parent–Child Rule

- Foundational Lens와 Cross-cutting Engineering Principle은 Portfolio-wide Parent다.
- Course-owned Principle은 특정 전문영역에서 Parent를 구체화하는 Child다.
- Child는 Parent 정의를 재정의하지 않는다.
- Course Principle에는 관련 Parent가 있을 때 이를 추적할 수 있어야 한다.
- 새 Principle을 추가하기 전에 기존 Parent/Child로 표현 가능한지 먼저 검토한다.

## B10. Curriculum & Practice Change Rule

- Topic은 50분 고정 단위가 아니다.
- 8h/16h instructional budget을 유지한다.
- Core Practice는 설명 세부사항보다 우선한다.
- 시간이 부족하면 상세 내용은 Optional / Reference / Appendix로 이동한다.
- Practice는 Course-owned professional judgment를 강화해야 한다.
- Prompt Engineering 자체가 Curriculum 목적이 되지 않는다.

## B11. Course Asset Change Rule

새 Course Asset은 **Part A(A5 Admission Rule)**를 통과해야 한다.

- 반복 재사용되지 않는 작업 메모는 Canon에 넣지 않는다.
- Baseline을 재정의하는 내용을 Course Asset에 숨기지 않는다.
- 과정별 자산은 동일 Course 폴더 안에서 관리한다.

## B12. Cross-course Impact Review

변경 후 최소 다음을 확인한다.

- OWNER / RECAP / APPLY / EXTEND / BRIDGE / FORWARD drift
- Parent Lens / Child Principle 정합성
- Learner Capability와 Course Thesis의 불일치
- 중복 Topic / 중복 Practice
- Terminology drift
- 시간예산 위반
- Source / Evidence 최신성

## B13. Release Rule

변경은 **Part C(Quality Gate)**를 통과하고 현재 릴리스 Audit이 생성된 후에만 Unified Portfolio release로 본다.

---

# Part C — Portfolio Governance Quality Gate v2.6

> **Use:** 새 과정, 구조 변경, LLM Practice 변경, 지원자산 추가 시 릴리스 전에 적용한다.

## C1. Structure Gate

- [ ] 모든 관리 폴더에 index(README 또는 MANIFEST 역할 파일)가 있다.
- [ ] Course 관련 파일/폴더는 동일 Course slug를 사용한다.
- [ ] Governance / Course Baseline / Course Asset / Source Evidence / Audit 역할이 섞이지 않는다.
- [ ] 임시 작업지시, migration note, 과거 audit가 현재 정본에 남지 않는다(Git history로 이관).
- [ ] 내부 참조가 실제 파일 경로와 일치한다.

## C2. Learner & Context Fit Gate

- [ ] Audience / Current Capability / Work Context가 명확하다.
- [ ] Pain / Failure Mode가 실제 업무 문제로 설명된다.
- [ ] Target Capability와 Required Decisions가 연결된다.
- [ ] 난이도와 상세도가 Decision Level(Recognize / Apply / Decide / Govern)에 맞는다.
- [ ] `Customer-centered ≠ Customer-request-driven` 원칙을 지켜 요청된 기술/과정명을 그대로 Spine으로 쓰지 않았다.
- [ ] Practice와 Evidence가 실제 업무 Transfer를 확인할 수 있다.

## C3. Foundational Decision Lens Gate

- [ ] Systems / Lean / ToC / Design / Empiricism 5개 Lens를 검토했다.
- [ ] 관련 없는 Lens를 억지로 삽입하지 않았다.
- [ ] Course-owned Principle이 관련 Parent Lens/Principle과 충돌하지 않는다.
- [ ] Local optimization, activity-over-outcome, solution-first, non-bottleneck optimization, assertion-without-evidence 같은 대표 실패를 필요한 과정에서 다룬다.

## C4. Course Canon Gate

- [ ] Course Thesis와 Problem Ownership이 명확하다.
- [ ] OWNER / RECAP / APPLY / FORWARD 경계가 기존 Portfolio와 충돌하지 않는다.
- [ ] Topic은 50분 고정이 아니며 내용과 Practice에 따라 시간이 배분된다.
- [ ] 8h는 400분, 16h는 800분 instructional baseline을 유지한다.
- [ ] 시간 부족 시 Core Practice를 우선하고 세부 설명은 Optional / Reference / Appendix로 이동한다.

## C5. LLM-Integrated Practice Gate

- [ ] 8h 과정은 3–4개, 현재 기준 4개를 사용한다.
- [ ] 16h 과정은 6–8개를 사용한다.
- [ ] 각 Practice는 15–30분, 기본 20–25분이다.
- [ ] Practice 시간은 기존 instructional budget 안에 포함된다.
- [ ] 시작 시 Recommended Prompt를 제공하지 않는다.
- [ ] 5–10분 후 Intervention을 제공하고 같은 작업을 Keep Going한다.
- [ ] 종료 시 Recommended Prompt와 설계 의도를 공개한다.
- [ ] Recommended Prompt가 정답이 아님을 명시한다.
- [ ] Prompt Engineering이 아니라 Course-owned decision과 실무 산출물을 평가한다.
- [ ] Practice별 필수 specification이 `practice-standard.md`와 일치한다.

## C6. Course Asset Gate

- [ ] 모든 과정 폴더는 최소 course-context/practice-design/references 구조를 갖는다.
- [ ] 추가 자산은 해당 과정에서 반복 재사용될 때만 추가한다.
- [ ] placeholder 자산을 만들지 않는다.
- [ ] 추가 자산은 Course Baseline을 재정의하지 않는다.
- [ ] Instructor-only 자산의 Intervention/Recommended Prompt가 학습자에게 조기 노출되지 않는다.

## C7. Evidence / Source / Localization Gate

- [ ] Course별 Source Evidence 파일이 존재한다.
- [ ] 교재의 기본 기준이 `evidence-policy.md`의 Global Baseline과 일치한다.
- [ ] Source Provenance / Evidence Strength / Transferability / Curriculum Use를 서로 혼동하지 않는다.
- [ ] Source Evidence의 claim/source family에 표준 metadata가 적용되어 있다.
- [ ] BP Classification 기본값은 Not classified이며, 필요한 경우에만 Contextual/Korea BP 또는 Korea WP를 사용한다.
- [ ] Primary/Official source라는 이유만으로 generalizable practice로 승격하지 않는다.
- [ ] Foundational/Influential Work의 Concept / Principle / Pattern / Applicability를 구분한다.
- [ ] empirical research, framework definition, organizational heuristic, vendor implementation을 동일한 claim type으로 취급하지 않는다.
- [ ] 특정 조직/벤더 사례가 일반 SW공학 원칙을 단독으로 정의하지 않는다.
- [ ] 한글/한국 자료는 가능한 범위에서 원출처와 Global Baseline을 역검토한다.
- [ ] Contextual/Korea BP를 사용할 경우 Local/System Constraint와 Adaptation, Trade-off, Preferred State를 설명할 수 있다.
- [ ] Korea WP는 popularity나 비판이 아니라 명확한 failure mechanism이 있고 교육상 필요한 경우에만 사용한다.
- [ ] 국제표준은 Course Decision의 직접 대상이 아닌 한 Reference 역할을 넘어서 Curriculum Spine을 지배하지 않는다.
- [ ] 시점 의존 정보는 최신성 검증이 가능하다.
- [ ] 특정 LLM/vendor/model/UI/API에 Course Concept·Practice·Artifact가 종속되지 않는다.
- [ ] Concept / Principle / Source의 품질·권위를 `Canon` 계열 형용사로 표현하지 않는다. 문맥에 따라 Foundational / Established / Authoritative / Reference / Core로 구체화한다.
- [ ] `Canon`은 Portfolio/Course의 승인된 정본·기준선 authority 의미로만 사용한다.

## C8. Release Gate

릴리스는 다음을 모두 만족해야 한다.

1. 구조 오류 0
2. broken internal reference 0
3. Course 식별 불일치 0
4. Practice count/timebox 위반 0
5. Practice 필수 field 누락 0
6. Course Ownership 충돌이 미해결 상태로 남지 않음
7. 현재 릴리스 Audit 1개만 존재
8. Learner Fit / Lens reverse audit 미해결 gap 0
