# TrainingMaterials Portfolio Context

## 1. Purpose

TrainingMaterials는 소프트웨어·디지털 전환 실무자가 중요한 판단을 더 정확히 내리고, 그 판단을 검증 가능한 산출물과 실행으로 연결하도록 돕는 교육 Portfolio다.

과정은 지식 목록이나 도구 사용법이 아니라 다음에서 출발한다.

```text
업무 맥락 → 반복 실패 → Capability Gap → 필요한 판단 → 학습과 실습
```

Portfolio는 공통 기준과 과정 간 경계를 제공한다. 각 Course Design은 실제 학습자와 업무 문제를 바탕으로 그 기준을 구체화하며, 발견한 충돌과 공백을 Portfolio에 되돌린다.

## 2. Current Development Scope

11개 Course Design은 현재 Portfolio baseline으로 함께 관리한다. 현재 downstream 개발 과정은 OOAD다. 기존 과정 산출물은 서로의 설계 입력이나 선례가 아니며, 각 과정의 Curriculum은 해당 Course Design과 Portfolio Guardrail에서 시작한다.

## 3. Confirmed Course Portfolio

| Course | Slug | Duration | Positioning |
|---|---|---:|---|
| 객체지향 분석과 설계 실무 | `ooad` | 16h | 요구와 변경을 객체의 책임·협력·계약으로 전환 |
| 도메인 주도 설계 개요와 실무 | `ddd` | 8h | 복잡한 도메인 의미와 불변식을 모델·경계·언어로 보호 |
| SW 아키텍처 설계 실무 | `sw-architecture` | 16h | 품질 속성과 제약을 구조적 선택·trade-off·검증으로 연결 |
| 마이크로서비스 아키텍처 개요와 설계 원칙 | `msa` | 8h | 분산의 필요성과 서비스·데이터·실패·운영 경계를 판단 |
| AI-Native Software Engineering | `ai-native` | 16h | AI 위임을 specification·context·guardrail·harness로 통제 |
| 현대적 SW 품질관리 실무 | `swqm` | 8h | 품질을 검사 활동이 아니라 위험·예방·evidence·개선 시스템으로 운영 |
| 애자일 개발 도입 실무 | `agile` | 8h | 불확실성에 맞는 짧은 학습주기와 Scrum 적용을 설계 |
| DevOps 개요와 SW Delivery 실무 | `devops` | 8h | 개발부터 운영까지 delivery flow와 feedback·recovery를 개선 |
| SW 프로젝트 관리 실무 | `project-management` | 16h | 가치·scope·일정·자원·위험·stakeholder 결정을 통합 |
| SW 제안 전략과 제안서 작성 실무 | `sw-proposal` | 8h | 고객 구매결정과 delivery credibility를 win strategy로 연결 |
| 디지털 전환에서 AI 전환으로 | `dt-to-ax` | 8h | 전환 목표·use case·운영모델·governance·확대를 evidence로 결정 |

교육시간은 Portfolio fixed constraint다. Course Design과 Curriculum은 임의로 변경하지 않는다. 변경 필요성이 발견되면 blocker로 보고한다.

## 4. Portfolio-level Outcomes

Portfolio 전체는 다음 능력을 서로 다른 owner 과정에서 강화한다.

- 문제와 맥락을 먼저 진단한다.
- 의미·책임·경계·계약을 명확히 한다.
- 품질·비용·위험·가치를 trade-off로 판단한다.
- 작은 feedback과 evidence로 가설과 결정을 수정한다.
- 자동화와 AI 위임에 guardrail과 harness를 둔다.
- 조직·delivery·operation까지 연결해 국소 최적화를 피한다.

각 능력의 정의와 owner는 `terminology.md`, `principles.md`, `concept-ownership.md`가 소유한다.
