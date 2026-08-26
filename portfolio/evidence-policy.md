# Portfolio Evidence Policy

이 문서는 Course Design, Curriculum과 Deck에서 사용하는 외부 근거·정의·인용의 공통 계약을 소유한다.

## 1. Evidence Principles

- 주장 강도는 evidence 강도를 넘지 않는다.
- Primary/official source 여부와 empirical strength를 구분한다.
- 표준은 정의와 요구사항의 authority일 수 있지만 보편적 효과의 실증 근거와 같지 않다.
- 단일 조직 사례나 vendor 문서는 구현 사례이지 일반 원칙의 단독 owner가 아니다.
- 시점 의존 정보는 사용 시점에 다시 확인한다.
- 특정 LLM vendor/model/UI/API가 사라져도 과정 spine은 유지돼야 한다.

## 2. Allowed Status

| Status | Meaning | Allowed use |
|---|---|---|
| Verified | source, locator와 사용 범위가 확인됨 | 확인된 범위의 사실·정의 근거 |
| Quote-verified | 정확한 문구와 locator까지 확인됨 | 축자 인용 가능 |
| Unverified | 직접 확인되지 않거나 locator가 불충분 | live Source/Anchor로 사용 금지 |

최종 Course Design의 Anchor Source에는 Verified 또는 Quote-verified만 둔다. 검증 후보와 “나중에 사용할 자료”는 live Source registry에 보존하지 않는다.

## 3. Anchor Source Contract

Anchor Source는 장식용 참고문헌이 아니라 과정의 핵심 개념·방향을 고정한다. 필요한 경우 다음을 기록한다.

- source와 author/organization
- 정확한 원문 또는 검증 가능한 정의
- locator
- anchor하는 개념
- 과정에서의 역할
- verification status

축자 인용은 Quote-verified일 때만 허용한다. Verified source를 의역할 때는 source가 실제로 지지하는 범위를 넘지 않는다.

동일 Anchor의 원문·정의 owner는 하나만 둔다. 여러 과정에서 반복 사용되면 Portfolio common asset 후보로 검토하고, 한 과정에서만 필요하면 해당 Course Design이 소유한다.

## 4. Research Contract

LLM은 Course Design Guardrail 안에서 더 나은 근거를 조사·추가할 수 있다.

- 중요한 claim은 가능한 한 original/official source에서 확인한다.
- 검색 결과 요약만으로 verification을 선언하지 않는다.
- 책·유료 표준처럼 원문 접근이 제한되면 확인한 bibliographic/official 범위만 사용한다.
- 수치·benchmark·법규·표준 버전·제품 기능은 publication 단계에서 재검증한다.
- 근거가 약하면 claim을 약화하거나 제외하고, 검증되지 않은 상태로 Anchor를 유지하지 않는다.

## 5. Localization

한국어 설명은 원문의 의미와 강도를 보존한다. 국내 사례가 필요한 경우 local constraint와 적용 범위를 밝힌다. 국내 관행이나 번역이 global engineering definition을 대체하지 않는다.

## 6. Curriculum and Deck Use

- Course Design은 필요한 evidence family와 핵심 Anchor를 정한다.
- Curriculum LLM은 claim을 완성하며 필요한 Source를 선택한다.
- Deck LLM은 Curriculum이 routing한 Source를 우선 사용하되, Guardrail 안의 설명 보완을 위한 추가 조사 책임을 가진다.
- 추가한 중요한 외부 주장은 동일 verification contract를 충족해야 한다.
- Harness는 ID·locator·quote exactness처럼 deterministic한 부분을 검사한다.
- Source의 교육적 적합성과 claim strength는 semantic/human review가 판정한다.
