# 09. Portfolio Change & Extension Protocol v1.0

> **Status:** Portfolio Canon
> **Purpose:** 신규 과정 추가, 기존 과정 변경, Course Asset 추가가 발생할 때 동일한 판단 순서와 Authority 경계를 강제해 Canon drift와 중복을 방지한다.

## 1. Governing Rule

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

## 2. Learner & Context Fit Gate

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

## 3. Foundational Decision Lens Review

내용 설계 전에 다음 5개 Lens를 검토한다. 모든 Lens를 억지로 넣지 않고, 해당 Course Decision에 실제로 필요한 것만 APPLY한다.

1. **Systems Thinking** — 전체·상호작용·feedback·delay·local optimization을 보는가?
2. **Lean Thinking** — value flow·waste·batch·built-in quality 관점이 필요한가?
3. **Theory of Constraints** — 현재 전체 성과를 제한하는 핵심 constraint를 식별해야 하는가?
4. **Design Thinking** — solution보다 problem/context를 먼저 이해하고 가설을 싸게 검증해야 하는가?
5. **Empiricism / Scientific Thinking** — fact/hypothesis/evidence/feedback으로 판단을 수정해야 하는가?

Lens 정의와 child principle은 `02_principles.md`가 소유한다.

## 4. Global Baseline & Source Governance Review

Course content를 만들거나 바꾸기 전에 해당 판단의 근거가 `07_evidence-source-localization-policy.md`를 만족하는지 확인한다.

- 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작, 일반화 가능한 실무를 기본 기준으로 삼는다.
- 특정 국가·조직·벤더 사례가 보편 원칙을 대신하지 않는다.
- Primary/Official 여부와 Evidence Strength를 분리한다.
- 국제표준은 Course Decision의 직접 대상이 아닌 한 Reference로 사용한다.
- Local/System Constraint가 있으면 제거 가능성을 먼저 보고, 당장 제거하기 어렵다면 그 제약 안에서 전체 성과를 최적화하는 Contextual Adaptation을 설명한다.
- `현재 constraint에서의 현실적 최적해`와 `constraint 제거 후 preferred state`를 구분한다.
- 특정 LLM/vendor/model/UI/API가 사라져도 Course Concept·Practice·Artifact가 유지되어야 한다.

Source Evidence에는 Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use를 분리하고, BP Classification은 필요한 경우에만 사용한다.

## 5. Change Classification

### A. Content Enhancement
기존 Course Thesis / Ownership / Required Decision은 유지되고 설명·사례·실습만 개선되는 경우.

`Course Baseline → 필요 시 Course Asset → Source Evidence → Quality Gate`

### B. Decision / Scope Change
학습자가 내려야 할 결정이나 Course Scope가 변하는 경우.

`Learner Fit → Principles → Concept Ownership → Cross-course Framework → Course Baseline → Related Courses → Practice → Evidence → Audit`

### C. New Course Admission
독립 Capability Gap과 독립 Decision Ownership이 필요한 경우에만 허용한다.

## 6. Existing Canon Check

새 개념·주제·과정을 만들기 전에 반드시 묻는다.

1. 기존 OWNER가 있는가?
2. RECAP / APPLY / EXTEND / BRIDGE / FORWARD로 충분한가?
3. 기존 과정의 Topic/Module 보완으로 해결 가능한가?
4. 새 OWNER가 정말 필요한가?
5. Tool/Vendor 이름이 사라져도 독립 문제가 남는가?

기존 Owner가 있으면 정의를 복제하지 않는다.

## 7. Course Admission Gate

신규 과정은 다음 조건을 모두 만족해야 한다.

- 독립 Learner Capability Gap이 있다.
- 실제 업무에서 반복되는 독립 Required Decision이 있다.
- 기존 Course의 RECAP/APPLY/EXTEND로 충분하지 않다.
- 새 OWNER 또는 충분히 큰 독립 EXTEND 영역이 있다.
- 기존 Owner 정의를 복제하지 않는다.
- Tool/Vendor가 사라져도 Course Identity가 남는다.
- Trade-off / Failure Condition / Evidence를 정의할 수 있다.
- 독립 수강자를 위한 Minimum Recap을 설계할 수 있다.

## 8. Change Order by Authority

Ownership 또는 Portfolio-wide principle이 바뀌는 변경은 아래 순서를 지킨다.

```text
01_reference-frame
→ 02_principles
→ 03_terminology
→ 04_concept-ownership-map
→ 05_cross-course-framework
→ 06_course-spec-template
→ affected Course Baselines
→ Course Assets / Source Evidence
→ 11_governance-quality-gate
→ 04_audit
```

하위 문서를 먼저 바꾸고 상위 Governance를 뒤에서 맞추지 않는다.

## 9. Principle Parent–Child Rule

- Foundational Lens와 Cross-cutting Engineering Principle은 Portfolio-wide Parent다.
- Course-owned Principle은 특정 전문영역에서 Parent를 구체화하는 Child다.
- Child는 Parent 정의를 재정의하지 않는다.
- Course Principle에는 관련 Parent가 있을 때 이를 추적할 수 있어야 한다.
- 새 Principle을 추가하기 전에 기존 Parent/Child로 표현 가능한지 먼저 검토한다.

## 10. Curriculum & Practice Change Rule

- Topic은 50분 고정 단위가 아니다.
- 8h/16h instructional budget을 유지한다.
- Core Practice는 설명 세부사항보다 우선한다.
- 시간이 부족하면 상세 내용은 Optional / Reference / Appendix로 이동한다.
- Practice는 Course-owned professional judgment를 강화해야 한다.
- Prompt Engineering 자체가 Curriculum 목적이 되지 않는다.

## 11. Course Asset Change Rule

새 Course Asset은 `08_portfolio-structure-and-authority.md`의 Admission Rule을 통과해야 한다.

- 반복 재사용되지 않는 작업 메모는 Canon ZIP에 넣지 않는다.
- Baseline을 재정의하는 내용을 Course Asset에 숨기지 않는다.
- 과정별 자산은 동일 Course ID 폴더 안에서 관리한다.

## 12. Cross-course Impact Review

변경 후 최소 다음을 확인한다.

- OWNER / RECAP / APPLY / EXTEND / BRIDGE / FORWARD drift
- Parent Lens / Child Principle 정합성
- Learner Capability와 Course Thesis의 불일치
- 중복 Topic / 중복 Practice
- Terminology drift
- 시간예산 위반
- Source / Evidence 최신성

## 13. Release Rule

변경은 `11_governance-quality-gate.md`를 통과하고 현재 릴리스 Audit이 생성된 후에만 Unified Portfolio release로 본다.
