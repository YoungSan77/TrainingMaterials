# Portfolio Terminology

이 문서는 과정 간 의미 충돌을 막기 위한 공통 용어의 단일 owner다. 과정 고유 용어는 해당 Course Design이 소유한다.

## Workflow Terms

| Term | Definition |
|---|---|
| User Intent | 사용자가 달성하려는 outcome, 우선순위와 명시적 제약 |
| Guardrail | 다음 단계가 지켜야 할 최소 요구사항과 경계. 콘텐츠 최대 범위가 아니다. |
| LLM | Guardrail 안에서 해당 단계 산출물 전체를 완성하는 생성 책임자 |
| Harness | 산출물을 생성하지 않고 Guardrail 준수를 검사하는 장치 |
| Deterministic check | 동일 입력에 재현 가능한 구조·연결·수량·schema 검사 |
| Semantic review | 목적, 의미, ownership, 흐름과 trade-off의 적절성 검토 |
| Human review | 가치 판단, 중요 의사결정과 최종 사용 승인 |
| Authority | 특정 정의·결정·규칙을 변경할 권한을 가진 owner |
| Owner | 하나의 사실·정의·규칙·상태를 소유하는 artifact 또는 과정 |
| Consumer | Owner의 내용을 변경하지 않고 적용하는 artifact 또는 단계 |
| Lifecycle | REQUIRED, CONDITIONAL, WORKING, GENERATED, DELETE 중 repository artifact 상태 |

## Education Terms

| Term | Definition |
|---|---|
| Course Design | 과정 목적·학습자·capability·scope·ownership·필수 outcome을 정하는 Curriculum Guardrail |
| Curriculum | Course Design Guardrail을 계승해 Session 구조·시간·학습 목표·요약·teaching progression과 핵심 내용, Anchor/Reference의 교육적 사용 위치·목적, 실습의 실제 배치·실행 설계와 Deck의 권장 slide 수·허용 범위를 소유하는 모든 slide의 교육 설계이자 Deck Guardrail. 실제 slide wording, visual form, layout과 rendering은 소유하지 않는다. |
| Claim | 학습자가 이해·판단·적용해야 하는 검증 가능한 핵심 의미 |
| 실습 | 학습자가 과정이 소유한 판단을 적용하고 산출물과 evidence를 만드는 학습 활동 |
| Source | 과정 주장·정의·인용을 지지하는 검증된 외부 근거 |
| Anchor Source | 과정의 핵심 개념이나 방향을 고정하는 교육적 역할이 명확한 검증 Source |
| Common Standard | Curriculum이 명시적으로 선택하는 Portfolio 공통 원칙·용어·공유 사례 |
| Deck | Curriculum을 실제 강의용 slide와 instructor notes로 구현한 정본 |
| PPTX | Deck과 Engine에서 생성되는 배포 산출물 |

## Engineering Boundary Terms

| Term | Definition |
|---|---|
| Responsibility | 어떤 객체·모듈·역할이 알고 하기로 약속한 것 |
| Boundary | 의미, 책임, 변경 또는 실패 영향을 제한하는 경계 |
| Contract | 경계를 통과하는 기대, 조건, 결과와 실패 의미 |
| Invariant | 허용되는 모든 상태에서 반드시 지켜져야 하는 규칙 |
| Quality attribute | 시스템이 특정 자극과 환경에서 보여야 할 측정 가능한 품질 특성 |
| Evidence | 주장이나 결정을 지지·반박하거나 수정하게 하는 관찰·검증 결과 |
| Feedback | 실행 결과가 다음 판단과 행동을 바꾸도록 되돌아오는 정보 |
| Trade-off | 하나를 얻기 위해 다른 가치·비용·위험을 감수하는 선택 |
| Failure condition | 선택이나 설계가 유효하지 않다고 판단할 관찰 가능한 조건 |

## Admission Rule

새 공통 용어는 두 개 이상의 과정에서 동일 의미로 필요하고, 기존 용어로 정확히 표현할 수 없을 때만 추가한다. 특정 과정에서만 필요한 정의는 해당 Course Design이 소유한다.
