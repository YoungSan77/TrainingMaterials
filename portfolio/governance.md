# TrainingMaterials Governance

> **Status:** TrainingMaterials 전체 workflow와 authority의 최상위 정본
>
> 이 문서는 산출물 생성 단계, 단계별 책임, authority, 충돌 처리, 검증과 릴리스 원칙을 소유한다. 용어·원칙·개념 소유권·evidence·practice의 상세 규칙은 각 Portfolio owner가 소유하며 이 문서는 이를 재정의하지 않는다.

---

## 1. Governing Model

```text
User Intent
    ↓
Portfolio ↔ Current Course Design
    ↓
Curriculum LLM
    ↓
Curriculum
    ↓
Curriculum Harness
    ↓
Deck LLM
    ↓
Deck
    ↓
Deck Harness
    ↓
Engine / PPT
```

현재 Portfolio Course Design 범위는 공식 11개 과정 전체다. 11개 Course Design은 동일한 품질 기준으로 각각 완성하며 상호 ownership과 handoff를 Portfolio와 정합화한다. 한 과정의 과거 Course Design, Curriculum, Source, Deck을 다른 과정의 설계 입력·선례·제약으로 사용하지 않는다.

현재 downstream 개발 과정은 OOAD다. 재구축된 OOAD Course Design을 다음 Curriculum 단계의 Guardrail로 사용하며, 기존 OOAD Curriculum과 Deck은 다음 단계의 정답이나 보존 제약이 아니다. 다른 10개 과정은 각자의 Curriculum 개발이 시작될 때 해당 Course Design에서 출발한다.

현재 디렉터리와 파일 구조는 구현 상태다. 목표 artifact와 책임을 정할 때 현재 구조를 보존하기 위해 설계를 타협하지 않는다. 구조 변경은 먼저 목표 책임과 stage contract를 확정한 뒤 결정한다.

---

## 2. Core Governance Principles

### G1. Upper Artifact Is the Next Stage Guardrail

상위 단계에서 승인된 산출물은 다음 단계의 Guardrail이다. Guardrail은 다음 단계가 지켜야 할 목적, scope, ownership, 필수 outcome, 검증된 사실과 제약을 제공한다.

Guardrail은 **최소 요구사항과 경계**이지 콘텐츠의 최대 범위나 문장 목록이 아니다. 하위 산출물은 상위 산출물을 단순 복사하거나 기계적으로 펼치는 결과물이 아니다.

### G2. The Next-stage LLM Completes the Artifact

각 단계 LLM은 자신의 산출물 전체를 완성할 책임이 있다. Guardrail 안에서 더 좋은 내용, 근거, 사례, 설명, 관계, 구성과 표현을 자율적으로 조사·선택·추가·개선할 수 있다.

단, 다음은 임의로 바꿀 수 없다.

- 승인된 목적과 target capability
- scope와 non-scope
- concept/course ownership과 boundary
- 필수 outcome과 release condition
- 검증된 사실, 정확한 인용과 공통 기준
- 상위 단계가 명시한 결정과 금지사항

상위 Guardrail이 모순되거나 산출물을 책임 있게 완성하기에 부족하면 추측으로 경계를 바꾸지 않는다. 충돌 또는 blocker를 드러내고 상위 단계로 되돌린다.

### G3. Harness Checks; It Does Not Author

Harness는 생성자가 아니라 Guardrail 준수 검사자다. Harness를 통과시키기 위해 내용을 형식적으로 채우거나 Harness가 교육 내용을 대신 생성하게 하지 않는다.

- deterministic harness는 구조, 식별자, 연결, 수량, 시간, schema, geometry처럼 재현 가능한 조건을 검사한다.
- semantic review는 목적 적합성, 의미 충실도, ownership, 교육 흐름, 근거의 적절성처럼 의미 판단이 필요한 조건을 검사한다.
- human review는 가치 판단, 중요한 trade-off, 최종 승인과 실제 사용 품질을 판정한다.

자동 검사 통과는 semantic 또는 human 품질 승인을 뜻하지 않는다. 반대로 자동화하기 어려운 판단을 임의의 수치 규칙으로 대체하지 않는다.

### G4. No Intermediate SSOT

단계 사이에 storyboard, semantic IR, slide-plan, session source, orientation source, 작업 메모 등 새로운 중간 정본을 두지 않는다.

일시적인 분석이나 대화 결과는 다음 authoritative artifact에 직접 반영하거나 폐기한다. 독립적으로 반복 사용되고 고유한 책임이 입증된 산출물만 별도 owner가 될 수 있다.

### G5. One Fact, One Owner

동일한 정의, 원칙, ownership, 상태, 규칙을 여러 live artifact가 각각 소유하지 않는다. Consumer는 owner를 참조하고 필요한 적용만 기술한다.

중복 서술이 발견되면 어느 표현을 유지할지 먼저 owner로 판정한다. 여러 파일을 동시에 맞추는 방식으로 중복 SSOT를 유지하지 않는다.

### G6. Historical Material Is Not Live Authority

Migration 문서, 과거 설계, 이전 Curriculum, 삭제된 Source, audit, revision directive와 작업 메모는 현재 authority가 아니다.

- 현재 생성 입력이나 필수 dependency로 요구하지 않는다.
- 현재 owner에 흡수된 과거 자료는 Git history가 보존한다.
- provenance가 현재 판단에 꼭 필요할 때만 historical provenance임을 명시한다.
- historical artifact와 live artifact가 충돌하면 historical artifact를 따르지 않는다.

---

## 3. Authority Owners

| Concern | Single Owner | Consumer Rule |
|---|---|---|
| 전체 workflow, stage contract, authority, release 원칙 | 이 문서 | 다른 문서는 반복 정의하지 않고 이 문서를 따른다. |
| Portfolio identity와 개발 과정 현황 | `portfolio/portfolio-context.md` | 과정 상세 설계나 Curriculum을 소유하지 않는다. |
| 공통 vocabulary와 용어 정의 | `portfolio/terminology.md` | Course와 Deck은 필요한 용어를 적용하되 재정의하지 않는다. |
| Portfolio 및 course-owned engineering principles | `portfolio/principles.md` | 적용 여부와 맥락은 Course Design/Curriculum이 선택한다. |
| concept/course ownership과 cross-course boundary | `portfolio/concept-ownership.md` | Course Design은 소유 범위와 forward boundary를 구체화한다. |
| evidence, verification, quote와 source 사용 정책 | `portfolio/evidence-policy.md` | 과정별 Source는 이 정책 안에서 evidence를 제공한다. |
| 공통 LLM-integrated 실습 규격 | `portfolio/practice-standard.md` | 과정별 실습은 course capability에 맞게 구체화한다. |
| 공유 사례의 상태·규칙·경계 | `portfolio/shared-cases/*` | 선택된 범위만 사용하며 Course가 임의 변경하지 않는다. |
| 과정 목적, learner, capability, scope와 boundary | 해당 Course Design | Curriculum은 이를 Guardrail로 사용한다. |
| 과정별 실습 상세 | 해당 Course Design의 실습 owner | Curriculum은 필요한 실습을 선택·배치한다. |
| 과정별 검증된 외부 evidence | 해당 Course Design의 Source owner | Curriculum과 Deck은 검증된 범위 안에서 사용한다. |
| Session, claim, 시간, 학습 흐름과 입력 routing | Curriculum | Deck은 교육 범위·선택·순서를 바꾸지 않는다. |
| slide-level teaching realization | Deck | Curriculum을 충족하되 설명과 표현을 책임 있게 완성한다. |
| executable schema, geometry, rendering behavior | Engine | Guide의 설명과 충돌하면 실행 계약은 Engine이 결정한다. |
| 자동 검증 판정 | 해당 Harness code | 문서는 의도를 설명하고 코드는 재현 가능한 판정을 소유한다. |

각 과정의 Course Design 정본은 `courses/<course>/course-design.md` 하나다. 과정의 차이는 별도 파일 구조가 아니라 이 정본의 내용으로 표현한다.

---

## 4. Portfolio ↔ Current Course Design

Portfolio와 현재 개발 Course Design은 일방향 상하관계가 아니라 상호 정합화 관계다.

### Portfolio가 제공하는 Guardrail

- Portfolio 목적과 course admission 판단
- 공통 vocabulary와 principles
- concept ownership과 cross-course boundary
- evidence와 실습의 공통 품질 기준
- 필요한 shared case

### Course Design이 책임지는 것

- 실제 learner와 work context
- current capability, failure mode와 target capability
- 학습자가 내려야 할 required decisions
- 과정 목적, scope, non-scope와 ownership 적용
- Curriculum을 생성할 수 있을 정도로 명확한 필수 outcome
- 과정에 필요한 실습과 verified evidence

### 상호 정합화 규칙

- Course Design은 Portfolio 공통 정의와 ownership을 조용히 변경하지 않는다.
- Course Design에서 실제 capability gap이나 ownership 모순이 발견되면 Portfolio를 재검토한다.
- Portfolio 변경은 현재 개발 Course Design에 미치는 영향을 확인한다.
- 다른 과정의 현재 문서를 비교 기준으로 사용해 현재 개발 과정을 평균화하지 않는다.
- 새 과정명, tool, framework 또는 body of knowledge가 있다는 이유만으로 Course를 설계하지 않는다. learner의 required decision과 독립 capability gap에서 시작한다.

---

## 5. Stage Contracts

### 5.1 Course Design Stage

**Guardrail**

- User Intent
- 관련 Portfolio owner
- 검증 가능한 외부 evidence와 실제 learner/work context

**Responsible generator**

- Course Design LLM과 사용자

**Responsibility**

- Course Design artifact 전체를 완성한다.
- 기존 과정 구조를 복원하는 것이 아니라 목적과 capability에서 설계한다.
- Portfolio와 충돌하거나 Portfolio 갱신이 필요한 지점을 드러낸다.

**Completion gate**

- 목적, learner, capability gap, required decisions가 연결된다.
- scope, non-scope와 ownership이 명확하다.
- Curriculum LLM이 교육 흐름을 설계할 충분한 outcome과 boundary가 있다.
- evidence와 실습이 과정 capability에 필요한 수준으로 준비된다.

상세 저작 규칙은 Governance가 통제하는 Course Design annex가 담당한다.

### 5.2 Curriculum Stage

**Guardrail**

- 승인된 Course Design
- Course Design이 요구하거나 허용한 Portfolio Common Standards
- 검증된 Source와 실습 설계

**Responsible generator**

- Curriculum LLM

**Responsibility**

- 전체 시간 안에서 Session, claim, 학습 흐름과 실습 배치를 완성한다.
- 필요한 Source와 Common Standards를 선택·routing한다.
- Course Design을 단순 목차로 전사하지 않고 학습 가능한 진행 구조를 설계한다.
- Guardrail 안에서 필요한 설명, 근거와 사례를 보완할 수 있다.

**Common Session 01 Guardrail**

- 모든 과정의 Session 01 제목은 `<과정명> 개요`로 한다.
- Session 01은 단순 Orientation이나 목차 소개가 아니라 과정 전체의 주제, 문제영역과 큰 그림을 이해시키는 Overview다.
- 과정과 주제 소개, 핵심 정의, 필요한 이유, 현재 현황 또는 대표 문제 상황, 핵심 개념과 전체 범위, scope와 non-scope, 후속 학습을 이해하기 위한 큰 그림을 다룬다.
- 상세 설계 기법, 세부 절차와 심화 실습은 후속 Session에서 다룬다.
- 공통으로 고정하는 것은 Session 01의 목적과 경계뿐이다. slide 구조, claim 수, 항목 수와 진행 순서를 과정 사이에 통일하지 않는다.
- 과정별 시간, 문제 특성과 target capability에 따라 Session 01의 깊이와 구성을 자율적으로 결정한다.

**Curriculum Harness**

- deterministic: 구조, ID, 시간, 연결, required field와 dangling dependency
- semantic: Course Design outcome coverage, ownership, sequence, 밀도와 학습 흐름
- human: 과정 가치, 우선순위, trade-off와 최종 승인

상세 저작 규칙은 Governance가 통제하는 Curriculum annex가 담당한다.

### 5.3 Deck Stage

**Guardrail**

- 승인된 Curriculum
- 해당 Session에 연결된 실습과 Source
- 해당 Session에 지정된 Portfolio Common Standards
- Deck authoring annex

**Responsible generator**

- Deck LLM

**Responsibility**

- Session 시간을 실제로 가르칠 수 있는 Deck 전체를 완성한다.
- claim을 기계적으로 slide와 1:1 대응시키지 않는다.
- 관계, 인과, 상태, 책임, 경계와 전환을 의미에 맞는 시각 구조로 표현한다.
- Guardrail 안에서 설명, 예제, interaction, narrative와 instructor notes를 보완한다.
- Curriculum에 없는 새로운 과정 목적이나 ownership 변경을 만들지 않는다.

**Deck Harness**

- deterministic: schema, claim/routing integrity, quote exactness, geometry, overflow와 renderability
- semantic: 의미 coverage, scope, 사례 일관성, narrative, visual semantics와 설명 충분성
- human: 실제 강의 가능성, 가독성, 교육적 효과와 최종 승인

상세 저작 규칙은 Governance가 통제하는 Deck authoring annex가 담당한다.

### 5.4 Engine / PPT Stage

**Guardrail**

- Harness를 통과해 승인된 Deck
- Engine의 executable contract

**Responsible executor**

- Engine

**Responsibility**

- 승인된 Deck data를 임의로 재해석하지 않고 PPTX로 렌더한다.
- schema, geometry와 rendering behavior를 결정론적으로 적용한다.

**Output checks**

- structural QA: schema, geometry, overflow, clipping과 contract
- render QA: glyph, font resolution, wrapping과 실제 표시
- visual/human QA: hierarchy, readability와 발표 환경에서의 사용성

PPTX 생성 성공이나 geometry snapshot 일치는 render/visual 품질의 충분조건이 아니다.

---

## 6. Controlled Annexes

세 Guide는 이 Governance가 통제하는 stage annex다.

| Annex | Scope |
|---|---|
| `guides/과정_설계_지침.md` | Course Design LLM의 저작 방법과 completion criteria |
| `guides/커리큘럼_작성_지침.md` | Curriculum LLM의 저작 방법, routing과 completion criteria |
| `guides/교재_작성_지침.md` | Deck LLM의 teaching realization과 표현 규칙 |

Annex는 다음을 재정의하지 않는다.

- 전체 workflow와 stage 순서
- authority owner와 충돌 우선순위
- LLM의 공통 책임과 자율성 원칙
- historical material의 위상
- deterministic/semantic/human 검증의 경계

Annex와 이 문서가 충돌하면 이 문서를 따른다. Annex와 executable Engine contract가 형식·기하·렌더링에서 충돌하면 Engine을 따르고 Annex의 설명을 수정한다.

---

## 7. Conflict and Escalation Rules

1. User Intent가 불명확하거나 기존 승인 결정과 충돌하면 생성 전에 확인한다.
2. Portfolio owner끼리 충돌하면 하위 artifact에서 임의 해결하지 않고 Portfolio로 되돌린다.
3. Portfolio와 Course Design이 충돌하면 목적·ownership 변경 여부를 명시하고 상호 정합화한다.
4. Course Design과 Curriculum이 충돌하면 target-versus-implementation 차이를 드러내고 Curriculum을 조용히 재작성하지 않는다.
5. Curriculum과 Deck이 충돌하면 교육 범위·claim·순서·routing은 Curriculum을 따른다.
6. 외부 사실이나 인용이 Source와 충돌하면 verified Source를 따른다.
7. 공통 정의·원칙·shared case가 충돌하면 해당 Portfolio owner를 따른다.
8. Guide와 Engine의 executable behavior가 충돌하면 Engine을 따르고 문서 drift를 결함으로 기록한다.
9. Harness 결과와 human semantic 판단이 다르면 서로 다른 검증 범위를 명시한다. 한쪽을 다른 쪽의 증거로 과장하지 않는다.

충돌 해결이 상위 artifact의 목적, scope, ownership 또는 필수 outcome을 바꾸면 사용자 승인을 받아야 한다.

---

## 8. Change and Release Protocol

변경은 영향받는 가장 상위 owner에서 시작해 아래 방향으로 진행한다.

```text
User Intent / Portfolio decision
→ Current Course Design
→ Curriculum
→ Deck
→ Engine/PPT
```

다음 원칙을 적용한다.

- 하위 실패를 해결하기 위해 상위 Guardrail을 편의상 약화하지 않는다.
- Renderer 문제를 Deck 내용 변경으로 숨기지 않고, Deck 문제를 Curriculum 변경으로 숨기지 않는다.
- 상위 artifact를 변경하면 승인된 모든 downstream artifact와 Harness 영향을 식별한다.
- 영향 범위 밖의 과정과 파일은 함께 정렬한다는 이유로 변경하지 않는다.
- 영향 범위 밖 과정의 과거 산출물은 현재 작업의 자동 회귀 기준이 아니다. 공용 Engine을 변경할 때만 공용 executable regression 범위로 다룬다.
- generated PPTX와 임시 분석 산출물은 별도 승인된 저장소 정책이 없으면 live authority로 커밋하지 않는다.

### Release Evidence

각 단계 완료는 최소한 다음을 남긴다.

- 변경된 authoritative artifact
- 적용한 Guardrail과 해결된 blocker
- deterministic Harness 결과
- semantic/human review 결과 또는 명시된 미수행 범위
- 알려진 gap과 다음 stage 진입 판정

별도 audit 문서를 의무적으로 만들지 않는다. 기존 owner, Git diff, test output과 변경 보고로 충분하면 새로운 상태 문서를 생성하지 않는다.

---

## 9. Governance Quality Gate

### Authority

- [ ] workflow와 stage contract는 이 문서만 소유한다.
- [ ] vocabulary, principles, ownership, evidence, 실습과 shared case에 각각 단일 owner가 있다.
- [ ] Consumer가 owner의 내용을 복제하거나 재정의하지 않는다.
- [ ] 현재 artifact, target design과 historical reference가 구분된다.

### Stage Responsibility

- [ ] 각 stage에 Guardrail, responsible LLM/executor, output과 Harness가 명시돼 있다.
- [ ] LLM이 Guardrail 안에서 산출물 전체를 완성할 권한과 책임이 있다.
- [ ] Guardrail이 콘텐츠 최대 범위나 전사 목록으로 오해되지 않는다.
- [ ] blocker를 상위 stage로 되돌리는 조건이 명확하다.

### Harness

- [ ] deterministic 검사와 semantic/human review가 구분된다.
- [ ] 자동 검사 통과를 교육 품질 승인으로 과장하지 않는다.
- [ ] Harness가 콘텐츠 생성자나 새로운 authority가 되지 않는다.
- [ ] 검증할 수 없는 의미 판단을 허위 정밀도의 수치 규칙으로 대체하지 않는다.

### Structure and History

- [ ] 현재 저장소 구조가 목표 artifact 책임을 제약하지 않는다.
- [ ] 각 과정의 Course Design이 `courses/<course>/course-design.md` 하나의 정본으로 유지된다.
- [ ] intermediate SSOT를 추가하지 않는다.
- [ ] migration, 과거 audit, 삭제된 경로와 legacy source가 live dependency로 남지 않는다.
- [ ] 이미 흡수된 역사 자료는 Git history에 맡긴다.

### Current Development Scope

- [ ] 공식 11개 Course Design과 현재 downstream 개발 과정이 구분돼 있다.
- [ ] 한 과정의 과거 산출물이 다른 Course Design의 입력·선례·제약으로 사용되지 않는다.
- [ ] 각 Course Design은 User Intent와 Portfolio에서 시작해 독립적으로 재설계할 수 있다.
- [ ] 공용 Engine 변경이 아니라면 영향 범위 밖의 과정에 회귀 정렬을 강제하지 않는다.

이 Gate를 통과하고 사용자 승인을 받은 뒤에만 다음 stage의 authoritative artifact를 확정한다.

---

## 10. Course-specific Artifact Rule

**Course uniqueness is expressed through content, not file topology.** 과정의 차이는 해당 단계 canonical artifact의 내용으로 표현하며, 과정 특수성을 이유로 과정별 보조 persistent artifact를 만들지 않는다.

이 규칙은 repository lifecycle의 일반적인 physical artifact 유연성보다 과정별 artifact에 우선 적용된다.

1. Course Design 단계의 과정별 정본은 `courses/<course>/course-design.md` 하나다. 과정 특화 지식, Source, Anchor Source와 실습 설계는 이 정본이 소유한다.
2. source·reference·anchor·실습·practice·lab·design 보조 문서, 별도 rule·note·context와 기타 과정별 보조 spec을 독립 persistent artifact로 만들지 않는다.
3. Curriculum 단계의 과정·Session 특수 요구는 해당 Curriculum 정본 안에서 해결한다. 별도 과정별 또는 Session별 보조 문서를 만들지 않는다.
4. Deck 단계의 설명·사례·표현 요구는 해당 Deck 또는 그 상위 canonical artifact가 소유한다. 설명용 보조 문서를 persistent artifact로 만들지 않는다.
5. 다음 두 경우만 별도 persistent artifact를 허용한다.
   - 여러 과정이 실제로 공유하고 반복 소비하는 지식은 Portfolio-level 공통 owner가 소유한다.
   - 공통 실행에 필요한 기술 artifact는 Engine, Runtime 또는 Harness 등 해당 기술 owner가 소유한다.
6. “이 과정만 특별하다”, “나중에 재사용할 수 있다”, “파일을 분리하면 편하다”는 별도 persistent artifact의 생성 근거가 아니다.
7. 새로운 과정별 persistent artifact가 반드시 필요하다고 판단되면 LLM이 임의 생성하지 않고 blocker로 보고한다.

현재 Manifest에 `WORKING`으로 등록된 regression artifact는 이 규칙만을 이유로 즉시 삭제하지 않는다. 해당 consumer와 exit condition에 따라 기존 lifecycle 절차로 귀결한다.

---

## 11. Repository Artifact Lifecycle

Repository에 지속적으로 존재하는 모든 artifact는 `REPOSITORY_MANIFEST.md`에 등록하고 다음 lifecycle 중 하나를 갖는다.

### REQUIRED

현재 workflow 수행에 필요한 live artifact다. 필수 responsibility와 필수 physical file은 구분한다. 하나의 책임이 반드시 필요해도 그 구현을 현재 파일명·파일 수·디렉터리 구조로 고정하지 않는다.

### CONDITIONAL

현재 명확한 owner와 consumer가 있고 특정 과정이나 실행 상황에서 실제로 필요할 때만 유지한다. 미래 가능성이나 “나중에 필요할 수도 있음”은 유지 근거가 아니다. owner 또는 consumer가 사라지면 다시 분류한다.

### WORKING

재구축, 비교, 흡수 또는 검증 중 임시로 유지하는 artifact다. 별도 archive, history, migration 또는 temp hierarchy를 만들지 않는다. 해당 Phase 종료 전 반드시 `REQUIRED`, `CONDITIONAL`, `GENERATED`, `DELETE` 중 하나로 귀결한다.

작업 중 기존 파일을 비교·흡수 목적으로 임시 보관할 수 있지만, Phase 종료 시 현재 workflow에 불필요한 파일은 삭제한다. `WORKING`은 장기 보존 상태가 아니다.

### GENERATED

다른 authoritative artifact와 실행 도구에서 재생성 가능한 artifact다. 승인된 regression baseline을 제외하면 Git의 live authority로 유지하지 않는다. Generated output을 수동 수정해 새로운 정본으로 만들지 않는다.

### DELETE

다음 중 하나에 해당해 제거해야 하는 artifact다.

- 현재 owner 또는 consumer가 없다.
- 고유 책임이 다른 owner에 흡수됐다.
- migration, history, reference 또는 과거 audit 목적만 남았다.
- 현재 workflow 수행에 불필요하다.

Historical preservation의 기본 수단은 Git history다. 삭제 대상을 보존하기 위한 archive/history/migration 계층을 새로 만들지 않는다.

현재 저장소 구조와 파일 존재 여부는 목표 구조나 lifecycle 판정의 근거가 아니다. 목표 responsibility를 먼저 확정하고 physical artifact를 결정한다.

## 12. Repository Manifest Synchronization

Repository root의 `REPOSITORY_MANIFEST.md`는 현재 TrainingMaterials 패키지 구성의 공식 등록부다.

다음 변경이 발생하면 Manifest를 같은 변경 단위에서 반드시 갱신한다.

- persistent file 생성
- 삭제
- 이동 또는 rename
- owner 변경
- role 변경
- lifecycle status 변경

Manifest가 갱신되지 않은 작업은 완료로 간주하지 않는다. 각 주요 Phase 종료 시 실제 repository와 Manifest를 전수 대조한다.

대조 시 최소한 다음을 확인한다.

- 모든 persistent artifact가 정확히 한 번 등록돼 있다.
- Manifest에서 live로 등록한 경로가 실제로 존재한다.
- 동일 path 또는 중첩되어 모호한 등록이 없다.
- `WORKING` artifact가 Phase 종료 판정을 받았다.
- `DELETE` artifact가 별도 archive 없이 제거됐다.
- generated/local 경로가 live authority로 오인되지 않는다.

`.git` 같은 repository metadata는 Manifest 대상에서 제외할 수 있다. 반복적인 generated/local 계층은 개별 파일 대신 path pattern으로 등록할 수 있다.
