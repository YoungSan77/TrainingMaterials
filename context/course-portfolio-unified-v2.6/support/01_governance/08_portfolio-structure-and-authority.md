# 08. Portfolio File Structure & Authority Standard v1.2

> **Status:** Portfolio Canon
> **Purpose:** 모든 파일이 하나의 책임과 예측 가능한 위치를 갖도록 하여, 과정이 늘거나 자산이 추가되어도 구조가 무너지지 않게 한다.

## 1. Structural Principle

Portfolio는 **Authority 축**과 **Course ID 축** 두 개만 사용한다.

- Authority 축: `Governance → Course Baseline → Course Asset / Source Evidence → Audit`
- Course ID 축: `01 OOAD → ... → 11 DT→AX`

새로운 임의 분류축을 만들지 않는다.

## 2. Directory Classes

| Location | Responsibility | Canon | Numbering |
|---|---|---|---|
| `courses/` | 현재 Course Baseline | Course-level Yes | `00` manifest + Course ID `01–11` |
| `support/01_governance/` | Portfolio-wide 원칙·용어·Ownership·Change Protocol·Quality Gate | Portfolio-level Yes | `00` manifest + 문서 책임 순서 `01–12` |
| `support/02_course-assets/` | 특정 과정의 Instructor/Design 재사용 자산 | No | `00` manifest + Course ID 폴더 `01–11` |
| `support/03_source-evidence/` | 과정별 근거·출처·최신성 검증 | No | `00` manifest + Course ID `01–11` |
| `support/04_audit/` | 현재 릴리스 정합성 검사 | No | `00` manifest + 현재 audit `01` |

## 3. Authority Order

```text
Portfolio Governance
→ Course Baseline
→ Course Asset / Source Evidence
→ Audit / External or Legacy Material
```

- Course Asset은 Course Baseline을 보완하지만 재정의하지 않는다.
- Source Evidence는 근거를 제공하지만 개념의 Owner가 아니다.
- Audit은 오류를 발견·기록하지만 Canon을 대신하지 않는다.

## 4. Numbering Rule

1. 파일을 직접 포함하는 모든 관리 폴더는 `00_MANIFEST.md`를 둔다.
2. Course 관련 번호는 어느 폴더에서도 Course ID `01–11`을 유지한다.
3. `course-assets/<Course ID>/` 안에서는:
   - `00_MANIFEST.md` — 해당 과정 자산 인덱스
   - `01_llm-integrated-practice-pack-...` — 공통 필수 Instructor Asset
   - `02_...`, `03_...` — 실제 추가 자산이 생길 때 순차 부여
4. placeholder 파일을 만들지 않는다. 번호 공백은 오류가 아니라 **아직 필요 없는 자산**을 뜻한다.
5. 이미 의미가 부여된 Course ID를 다른 과정에 재사용하지 않는다.

## 5. Course Asset Admission Rule

자산은 다음 질문에 모두 YES일 때만 `course-assets`에 둔다.

1. 특정 과정에서 반복 재사용되는가?
2. Course Baseline에 넣기에는 지나치게 상세하거나 Instructor-only인가?
3. Governance 또는 Source Evidence와 책임이 겹치지 않는가?
4. 수업 운영·설계·검증에 실제로 필요한가?
5. 일회성 작업지시·migration note·revision log가 아닌가?

하나라도 NO이면 기존 파일에 흡수하거나 Canon ZIP에서 제외한다.

## 6. Current Course Asset Contract

모든 11개 과정은 동일한 최소 구조를 갖는다.

```text
<Course ID>_<course>/
├─ 00_MANIFEST.md
└─ 01_llm-integrated-practice-pack-v1.1.md
```

추가 자산은 필요할 때만 존재한다. 현재 예외는 다음 두 개다.

- OOAD `02_course-design-reference-v2.1.md`
- Project Management `02_pmbok8-40-process-map-v1.0.md`

이 둘은 서로 다른 유형이지만 동일 과정 폴더 아래 있으므로 다른 과정 자산과 혼재하지 않는다.

## 7. LLM Practice Asset Rule

모든 `01_llm-integrated-practice-pack`은 동일 metadata와 Operating Rules를 사용한다. Practice별 필수 필드는 `12_llm-integrated-practice-standard.md`가 정한다.

Practice Pack은 Instructor-only다. 학습자에게는 실습 시작 시 Problem/Context/Inputs/Deliverable/Timebox만 제공하고, Intervention과 Recommended Prompt는 정해진 시점에 공개한다.

## 8. Keep / Remove Rule

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

## 9. Change Decision

새 파일을 만들기 전 우선 판단한다.

- 기존 Owner 문서에 넣는 것이 더 자연스러운가? → 새 파일을 만들지 않는다.
- 독립적으로 반복 재사용되는가? → 적절한 Course Asset 또는 Governance로 분리한다.
- 단지 변경 과정을 기록하기 위한 것인가? → Canon ZIP 밖의 작업/아카이브 영역에서 관리한다.

## 10. Change / Extension Governance

신규 과정, Course Scope 변경, Principle/Ownership 변경, 중요 Course Asset 추가는 `09_portfolio-change-and-extension-protocol.md`를 따른다.

- 구조만 맞춘 뒤 내용을 사후 정렬하지 않는다.
- Learner & Context Fit과 Required Decision을 먼저 확인한다.
- Portfolio-wide 변경은 상위 Governance부터 하위 Course/Asset 순으로 반영한다.
- 릴리스 전 `11_governance-quality-gate.md`와 현재 Audit을 통과한다.
