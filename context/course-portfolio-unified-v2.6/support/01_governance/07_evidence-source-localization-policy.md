# 07. Evidence, Source & Localization Policy v2.1

> **Status:** Portfolio Canon
> **Scope:** 모든 현재/향후 과정, curriculum, source, quote, slide, exercise
> **Purpose:** 교재가 특정 국가·조직·벤더의 관행이나 마케팅 narrative에 끌려가지 않고, 전 세계적으로 축적된 SW공학 지식과 일반화 가능한 실무를 기준으로 유지되도록 한다.

## 1. Global Baseline — Non-Negotiable

교재는 다음을 기본 기준으로 구성한다.

> **Global Baseline:** 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작 및 일반화 가능한 실무를 교재 구성의 기본 기준으로 삼는다.

Global Baseline은 교재에 특정 BP label을 반복 사용하기 위한 분류가 아니다. 작성·검토 시 무엇을 기준으로 삼을지 정하는 내부 기준이다.

포함 가능한 근거의 성격:
- Foundational Theory / Principle
- Foundational or Influential Work
- Established Concept / Practice / Pattern
- Empirical Evidence / Finding
- Standard / Reference Model / Reference Framework
- 일반화 가능한 practitioner knowledge

특정 조직·국가·벤더의 사례와 관행은 이 기준을 대체하지 않는다. 일반화 가능한 원칙의 사례이거나, 명시된 제약조건에서의 Contextual Adaptation으로 사용한다.

## 2. Source Quality는 한 축으로 평가하지 않는다

`Primary Source`, `Authoritative Source`, `Evidence Strength`, `Transferability`는 서로 다른 속성이다.

> **Primary / Official ≠ Strong Evidence ≠ Generalizable Practice**

### 2.1 Evidence Role
- **Foundational / Core:** 분야를 형성하거나 핵심 판단을 지지하는 이론·원칙·저작
- **Empirical:** 반복 관찰, 연구, survey, longitudinal evidence
- **Standard / Reference:** scope, terminology, model, compliance/reference 확인
- **Established Practice / Pattern:** 여러 환경에서 재사용되어 정착된 실무·설계 방식
- **Contextual Adaptation:** 특정 제약조건 아래의 현실적 최적화
- **Case / Example:** 특정 조직/프로젝트의 사례
- **Vendor / Product Implementation:** 특정 제품·SDK·플랫폼의 현재 구현

### 2.2 Source Provenance
- Original / Foundational Author
- Standard / Official Specification
- Research / Empirical Program
- Authoritative Secondary
- Organizational Primary
- Vendor / Product Documentation
- Commentary / Tertiary

### 2.3 Evidence Strength
- **Strong:** 해당 claim을 직접 지지하는 원전·반복 연구·충분한 검증이 있다.
- **Moderate:** 신뢰 가능한 근거가 있으나 조건·범위·해석의 여지가 있다.
- **Limited:** 단일 사례·조직 heuristic·제한된 관찰에 주로 의존한다.
- **Pending:** 교육에 사용할 수 있는 수준의 검증이 아직 끝나지 않았다.

Evidence Strength는 출처의 유명세나 `Primary/Official` 여부와 별개로 **현재 claim을 얼마나 직접·충분하게 지지하는가**를 평가한다.

### 2.4 Transferability
- Broad / Generalizable
- Conditional
- Local / Institutional
- Product-specific

### 2.5 Curriculum Use
- **Core:** Course Thesis/Required Decision을 직접 지지한다.
- **Supporting:** Core 판단을 설명·보완한다.
- **Example / Heuristic:** 사례·비율·구현 예시로만 사용한다.
- **Reference:** 상세 학습이 아니라 확인·추가 탐색용이다.
- **Hold:** 검증 전에는 교재 주장에 사용하지 않는다.

### 2.6 BP Classification — Optional
기본값은 **Not classified**다. BP/WP label 자체가 교육목적일 때만 사용한다.

- Global Baseline의 일반화 가능한 지식이나 실무에 별도 BP label을 반복 부여하지 않는다.
- `Contextual/Korea BP`는 Local/System Constraint 안에서 효과적으로 최적화된 적응을 설명할 필요가 있을 때만 사용한다.
- `Korea WP`는 명확한 failure mechanism을 교육상 반드시 다뤄야 할 때만 사용한다.

Source가 원본이라는 사실만으로 일반화 가능성이 생기지 않는다. 반대로 회사 소속 엔지니어의 전문 저작이라는 이유만으로 가치가 낮아지지도 않는다. 저작의 내용·영향력·검증·전이 가능성을 본다.

## 3. Foundational / Influential Works

분야를 형성하고 오랜 기간 실무와 후속 연구·저작에 영향을 준 전문 저작은 교재의 주요 기준이 될 수 있다.

예:
- DDD의 Eric Evans 원전
- Evolutionary Architecture를 체계화한 전문 저작
- Continuous Delivery / DevOps의 주요 전문 저작과 장기 empirical research

이 경우 저자의 소속 회사보다 **저작 자체의 역할**을 우선한다.

`Foundational Work`는 해당 분야의 핵심 개념·원칙을 설명하는 주요 근거다. 그렇다고 모든 문장을 context-free rule로 승격시키지는 않는다. Concept / Principle / Pattern / Applicability를 구분한다.

## 4. Empirical Evidence

장기간·다수 조직·반복 연구에서 축적된 실증 근거는 강한 curriculum evidence가 될 수 있다.

- 연구 프로그램의 소속 기관만으로 vendor marketing과 동일 취급하지 않는다.
- 연구 결과와 normative principle은 구분한다.
- metric definition, benchmark, correlation, capability guidance를 동일한 claim type으로 취급하지 않는다.
- 시점 의존 결과는 최신성을 확인한다.

DORA와 같이 장기간 축적된 연구는 DevOps의 empirical foundation으로 사용할 수 있다. 단, DevOps 자체를 특정 연구 프로그램 하나로 정의하지 않는다.

## 5. Practitioner Heuristic / Organizational Example

특정 조직의 성공적 실무나 수치적 heuristic은 유용한 교육자료가 될 수 있다.

예:
- Testing Pyramid의 일반 원칙과 특정 조직의 70/20/10 같은 경험적 비율은 구분한다.

사용 규칙:
- underlying principle과 조직별 heuristic을 분리한다.
- 특정 수치를 universal rule로 만들지 않는다.
- 적용조건과 변동 가능성을 설명한다.

## 6. International Standards / Reference Frameworks

국제표준은 주로 다음 용도로 사용한다.
- terminology / scope 확인
- quality/reference model 확인
- external validation
- governance/compliance reference

> **Reference, not curriculum backbone.**

표준 자체가 Course Decision의 직접 대상이 아닌 한, 표준 세부 구조를 강의 Spine으로 만들지 않는다. 표준을 깊게 따라가느라 핵심 engineering judgment가 분산되지 않도록 한다.

## 7. Local / Korea Context

한국 자료·한국 기업 사례를 배제하지 않는다. 다만 Global Baseline 관점에서 재검토한다.

### 7.1 Local Context
법, 제도, 조달, 계약, 조직 구조, 시장 특성처럼 적용 판단을 바꾸는 조건이다. 좋고 나쁨의 분류가 아니다.

### 7.2 Contextual / Korea BP — 필요한 경우에만 사용
다음 구조일 때 사용할 수 있다.

```text
Global Engineering Principle
+ Local/System Constraint
+ Effective Adaptation
= Contextual/Korea BP
```

중요한 점:
- Local Constraint를 무시하고 실무자 개인에게 이상적 practice를 요구하지 않는다.
- 현재 constraint를 제거할 수 있는지 먼저 본다.
- 당장 제거할 수 없다면 constraint 안에서 전체 성과를 최적화한다.
- 교재에서는 `현재 현실에서의 최적해`와 `constraint 제거 후의 preferred state`를 구분한다.

권장 설명 형식:
1. Global Principle
2. Current Local/System Constraint
3. Practical Adaptation
4. Gain
5. Trade-off / Loss
6. Constraint 제거 시 Preferred State

### 7.3 Korea WP — 최소한으로만 사용
WP catalog나 특정 산업/집단 비판을 교재 목적으로 만들지 않는다.

필요할 때만 보편적인 failure mechanism으로 설명한다.

WP라고 부를 경우 최소한 다음이 있어야 한다.
- 어떤 principle을 훼손하는가
- 어떤 failure mechanism이 있는가
- 어떤 adverse outcome/evidence가 있는가
- 어떤 조건에서는 예외적으로 합리적인가

`한국에서 흔하다`, `오래 해왔다`, `내가 싫어한다`만으로 WP가 되지 않는다.

## 8. Korean Source Rules

1. 한글 자료가 편하다는 이유로 우선하지 않는다.
2. 원개념이 해외 원전이면 가능한 한 원전을 확인한다.
3. 번역된 quote는 원문과 attribution을 확인한다.
4. 국내 기사가 표준/보고서를 인용하면 원 표준/보고서를 확인한다.
5. 한국 기업/기관 사례는 Local/System Constraint와 transferability를 함께 본다.
6. 좋은 적응 사례를 일반 SW공학 원칙으로 자동 승격하지 않는다.
7. Global Baseline과 다른 현실적 적응을 곧바로 WP로 낮추지 않는다.
8. 법적/계약적/제도적 제약은 우선 constraint로 본다.
9. 특정 한국 제도·용어는 해당 과정이 필요에 따라 소유할 수 있으며, 억지로 global terminology에 동일시하지 않는다.

## 9. Vendor / Product / LLM Independence — Non-Negotiable

특정 vendor, model, UI, SDK, API가 Course Concept / Principle / Practice / Exercise / Artifact의 본질을 정의하지 않는다.

> **No course concept, principle, practice, exercise, prompt pattern, or artifact shall depend on a particular LLM vendor, model, UI, or product unless that vendor/product itself is the explicit subject of the lesson.**

- vendor 공식문서는 해당 product behavior의 Primary Source일 수 있다.
- 그 사실만으로 universal engineering claim의 강한 근거가 되지는 않는다.
- vendor implementation은 replaceable example로 사용한다.
- API 기반, local model, enterprise gateway, 다른 LLM으로 전환해도 Course Spine이 유지되어야 한다.
- 특정 LLM 이름을 작성자/도구 전제로 사용하지 않는다.

## 10. Proposal Exception — Customer Decision Context

SW Proposal에서는 Global Baseline이 목적이 아니라 **viable customer decision을 만들기 위한 도구**다.

```text
Understand customer intent
→ satisfy explicit requirements
→ identify material feasibility/risk issues
→ propose acceptable alternatives where needed
→ maximize probability of a viable customer decision
```

고객 RFP를 교정하거나 비판하는 것이 제안의 목적이 아니다. Engineering truth / feasibility / material risk가 문제라면 고객이 받아들일 수 있는 assumption, option, risk, alternative로 완곡하게 제시한다. 수용 불가능한 조건이면 제안하지 않는 판단도 포함한다.

## 11. Quote / Attribution Rule

- Principle과 verbatim quote를 분리한다.
- Quote는 `ko / en / author / source / locator / status`를 유지한다.
- paraphrase는 따옴표를 사용하지 않는다.
- `[원전]`과 `[귀속]`을 구분한다.
- 번역문은 교육용 자연스러움보다 의미 정확성을 우선한다.
- slide에서는 한글 번역을 주 메시지로, 영문 원문·저자·출처를 작은 글자로 표시한다.

## 12. Authoring Checklist

- [ ] 이 내용은 Global Baseline의 어떤 근거 유형에 해당하는가?
- [ ] Source Provenance와 Evidence Strength를 혼동하지 않았는가?
- [ ] Evidence Strength(Strong / Moderate / Limited / Pending)를 claim별로 판단했는가?
- [ ] 일반화 가능성(Broad / Conditional / Local / Product-specific)을 판단했는가?
- [ ] Curriculum Use(Core / Supporting / Example / Reference / Hold)를 명시했는가?
- [ ] BP Classification은 기본값 Not classified이며 필요한 경우에만 사용했는가?
- [ ] Foundational Work의 개념·원칙·패턴·적용조건을 구분했는가?
- [ ] organizational/vendor case를 general rule로 자동 승격하지 않았는가?
- [ ] 한국 자료/사례는 Global Baseline 관점에서 역검토했는가?
- [ ] Contextual Adaptation의 Local/System Constraint를 명시했는가?
- [ ] BP/WP라는 label이 실제 교육상 필요할 때만 사용되었는가?
- [ ] 특정 LLM/vendor에 교재 구조가 종속되지 않는가?
- [ ] 국제표준이 필요 이상으로 Course Spine을 차지하지 않는가?

## 13. Course Source Precedence — Current

### Agile
1. Agile Manifesto / Principles 등 foundational source
2. 관련 empirical / established practice evidence
3. Scrum Guide 등 framework definition은 해당 framework 설명에 사용
4. scaling/tool/vendor 자료는 필요한 경우 example/reference

### DevOps
1. stable Lean / flow / feedback / Continuous Delivery / DevOps engineering lineage
2. DORA 장기 empirical research와 current capability/metric guidance
3. vendor/tool docs는 implementation example

### SW Project Management
1. stable project-management principles and decision needs
2. PMI PMBOK® Guide / The Standard for Project Management는 primary reference
3. secondary training material은 explanation aid

### SW Proposal
1. customer RFP / evaluation criteria / confirmed discovery
2. contract/legal/compliance requirements
3. verified internal delivery/reference evidence
4. established proposal/capture guidance
5. generic marketing claims last

### DT→AX
1. stable transformation/business/operating-model principles
2. architecture/data/process fundamentals
3. necessary AI governance/reference sources
4. verified cases
5. technology/vendor examples

**Common rule:** Current legal/regulatory claims, benchmark numbers, DORA metrics, AI governance status, product/vendor claims는 detailed deck publication 시 재검증한다.

---
## Unified Portfolio Alignment v2.6
- 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
- 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
- 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
- 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.
