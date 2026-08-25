# Program Governance v2.2.2 — Independent Quality Gate

## Verdict

**PASS WITH CORRECTIONS APPLIED**

현재 Governance는 6개 과정뿐 아니라 향후 Agile / DevOps / Proposal / DT / AT 추가를
수용할 수 있는 수준으로 안정화되었다. 다만 v2.2.1에서 발견된 네 가지 구조적 위험을
v2.2.2 후보에 선반영했다.

## 1. Findings and Actions

### QG-01 — Source Policy Duplication
**Severity:** HIGH  
**Finding:** Global/Korea evidence 규칙이 Reference Frame, Principles, Ownership,
Cross-Course Framework에 반복되어 `진실은 한 곳에만 산다` 원칙과 충돌했다.

**Action applied:**
- `07_evidence-source-localization-policy`를 SSOT로 확정.
- 다른 Canon은 비협상 principle 또는 pointer만 유지.
- 세부 source hierarchy / Korea BP/WP 판정은 07만 소유.

### QG-02 — Invariant Ownership Ambiguity
**Severity:** HIGH  
**Finding:** OOAD의 DbC invariant와 DDD의 Domain invariant가 같은 `Invariant` 이름 아래
OWNER 충돌 가능성이 있었다.

**Action applied:**
- `Invariant` = umbrella term.
- `Object Invariant` = OOAD OWNER.
- `Domain Invariant` = DDD OWNER.
- Aggregate consistency는 DDD에서 심화.

### QG-03 — Quality Gate Future Ownership Collision
**Severity:** HIGH  
**Finding:** `Quality Gate = Modern QM OWNER`로 고정하면 SWA의 fitness gate,
AI evaluation gate, 향후 DevOps delivery gate와 충돌한다.

**Action applied:**
- `Quality Evidence` = Modern QM OWNER.
- `Quality Gate` = cross-course mechanism.
- SWA / AI-Native / future DevOps가 자기 실행 경계의 gate를 소유.
- QM은 evidence-backed quality governance를 소유.

### QG-04 — Clean Architecture Overreach Risk
**Severity:** MEDIUM  
**Finding:** Clean Architecture를 SW Architecture의 근간으로 쓰는 것은 타당하지만
Architecture 전체와 동일시하면 Driver/QA/Trade-off를 약화시킬 위험이 있다.

**Current rule retained:**
```text
Decision Basis  = Architecture Driver / Quality Attribute Scenario
Structure Lens  = Clean Architecture / Dependency Rule / Policy vs Detail
Time Dimension  = Evolutionary Architecture / Fitness Function
```

세 축은 대체 관계가 아니라 보완 관계다.

### QG-05 — Course-Level Canon Proliferation
**Severity:** MEDIUM  
**Finding:** 과정별 stance 문서가 계속 늘어나면 Governance 자체가 비대해질 수 있다.

**Decision:**
- `08_sw-architecture-canon-stance`는 SWA 재구성 시점의 예외적 course-level stance로 유지.
- 향후 모든 과정에 stance 파일을 자동 생성하지 않는다.
- 기본은 `course-spec.md`; 별도 stance는 기존 Canon만으로 핵심 경계를 보호할 수 없을 때만 Admission.

### QG-06 — Global BP Terminology Risk
**Severity:** MEDIUM  
**Finding:** Best Practice를 절대법칙처럼 읽을 위험이 있다.

**Decision:**
- 사용자 결정에 따라 Global Principle / Global BP가 국내 충돌 관행보다 우선한다.
- 단, 법·규제·계약 등 적용 불가능 조건은 `Local Constraint`로 명시한다.
- Local Constraint가 Global Principle을 Global WP로 바꾸지는 않는다.
- Korea BP는 contextual adaptation이지 global canon replacement가 아니다.

## 2. Cross-Document Integrity

### Reference Frame
**PASS**
- Program vs Portfolio 분리 적절.
- Future courses admission 가능.
- QM cross-cutting 위치 적절.
- Source policy 세부사항은 SSOT pointer로 축소.

### Principles
**PASS**
- DbC 추가 적절.
- Contract lineage가 AI stage contract까지 자연스럽게 이어짐.
- Global-over-local principle 유지.
- Principle Usage Contract에 Evidence/Verification 포함 적절.

### Terminology
**PASS after correction**
- Object/Domain Invariant 분리.
- Quality Gate를 cross-course mechanism으로 변경.
- Contract family 경계 대체로 명확.

### Concept Ownership
**PASS after correction**
- Matrix는 snapshot, registry가 canonical이라는 방향 적절.
- 향후 과정 추가 시 matrix 폭발을 피할 수 있음.
- QM 기술 개념 침범 명시적으로 금지.

### Cross-Course Framework
**PASS**
- 과정들을 선형 maturity model로 만들지 않음.
- Responsibility / Contract / Boundary / Evidence lineage가 유효.
- source policy 중복 제거.

### Course Spec Template
**PASS**
- 신규 과정 admission에 충분.
- Global/Korea source gate 포함.
- tool/vendor-driven course 예방 가능.

### Evidence / Source / Localization Policy
**PASS — SSOT**
- Global Principle / Global BP precedence 명확.
- Korea BP / WP / Local Context 분리.
- 한글 secondary source 신중 사용 규칙 충분.
- 향후 교재의 근거 정책은 이 파일만 수정해야 함.

### SW Architecture Canon Stance
**PASS WITH GUARDRAIL**
- Clean Architecture structural baseline 적절.
- Evolutionary Architecture 반영 적절.
- SEI QA/Trade-off reasoning과 분리된 역할 유지 필요.
- Clean Architecture layer naming을 curriculum goal로 만들지 말 것.

## 3. Remaining Open Decisions — Not Blocking

1. SWA에서 ATAM을 본문 technique으로 어디까지 다룰지.
2. DDD Supple Design을 본편 vs Advanced로 어디까지 포함할지.
3. MSA 1일 과정에서 contract evolution과 distributed patterns의 깊이 배분.
4. AI-Native 전체 시간/세션 구성.
5. Future DevOps가 CI/CD delivery gate를 소유할 때 QM/SWA와의 exact boundary.
6. verified quote asset의 repository final location.

## 4. Governance Freeze Recommendation

이 Quality Gate 이후 Program Governance 자체는 **일단 Freeze**한다.

다음 변경은 다음 조건 중 하나일 때만:
- 새로운 Course Admission이 기존 OWNER와 실제 충돌
- curriculum 작성 중 canonical contradiction 발견
- primary source verification으로 현재 lineage/definition 오류 발견

그 외에는 Governance가 아니라 Course Spec / Curriculum에서 해결한다.

## 5. Next Work

1. OOAD Verified Principles & Quotes Pack
2. SW Architecture Course Spec
3. Modern QM Canon Audit
4. DDD Course Spec
5. Claude 복귀 후 curriculum revision
