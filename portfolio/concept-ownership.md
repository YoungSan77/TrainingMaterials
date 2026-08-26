# Portfolio Concept Ownership

이 문서는 11개 과정의 positioning, concept ownership, boundary와 handoff의 단일 owner다. 과정 문서는 자신의 적용과 non-scope만 기술한다.

## Ownership Map

| Course | Owns | Receives | Hands off |
|---|---|---|---|
| OOAD | 객체 책임·협력·계약, 분석→객체 설계 전환 | 요구와 업무 시나리오 | 도메인 의미의 전략적 경계는 DDD, 구조적 품질 선택은 SW Architecture |
| DDD | 도메인 언어·모델·불변식·aggregate·bounded context | OO 책임·계약 기초 | 배포 분리는 MSA, architecture option은 SW Architecture |
| SW Architecture | driver·quality attribute·구조 대안·trade-off·평가·evolution | OO/DDD가 제공한 policy와 boundary | 분산 채택과 운영 현실은 MSA, delivery 실행은 DevOps |
| MSA | 분산 채택 판단, 서비스·데이터 소유, consistency, failure와 observability cost | DDD boundary와 architecture drivers | pipeline은 DevOps, 품질 시스템은 SWQM |
| AI-Native | AI 위임형식, specification, context, guardrail, harness, evaluation, autonomy | 각 과정의 전문 판단과 artifact | 전문 개념의 정의는 원 owner 과정에 유지 |
| Modern SWQM | quality risk, prevention/detection portfolio, evidence/gate, measurement와 improvement | 각 과정의 품질 요구와 실행 evidence | delivery metric은 DevOps, architecture evaluation은 SW Architecture |
| Agile | 불확실성 진단, adaptive planning, empiricism, Scrum 적용과 개선 | Engineering discipline과 product goal | delivery engineering은 DevOps, project governance는 PM |
| DevOps | delivery flow, CI/CD, deployability, operational feedback와 recovery | architecture와 quality guardrail | 조직·portfolio transformation은 DT→AX |
| Project Management | project value, governance, stakeholder/scope/schedule/resource/risk 통합과 tailoring | delivery/engineering evidence | 제안 이전 의사결정은 SW Proposal |
| SW Proposal | opportunity qualification, customer decision, win strategy, credible promise와 proposal evidence | architecture·delivery feasibility | 수주 이후 project governance는 PM |
| DT→AX | transformation outcome, capability/readiness, use-case portfolio, operating model, governance와 scale | 모든 전문 과정의 capability options | 실행 세부는 해당 전문 owner 과정 |

## Boundary Rules

- OOAD의 객체 경계는 DDD의 bounded context가 아니다.
- DDD의 bounded context는 MSA 배포 경계를 자동 결정하지 않는다.
- SW Architecture는 특정 style을 기본 정답으로 만들지 않는다.
- MSA는 “서비스로 나눈다”보다 “분산 비용을 지불할 가치가 있는가”를 먼저 소유한다.
- SWQM은 개발·architecture·delivery의 전문 기법을 재정의하지 않고 quality evidence 관점에서 조합한다.
- Agile은 Scrum event 운영을 넘어 adaptive delivery 판단을 소유하지만 CI/CD나 testing technique을 소유하지 않는다.
- DevOps는 조직문화 slogan이 아니라 delivery system을 소유한다.
- PM은 Agile/DevOps를 방법론으로 흡수하지 않고 project-level 통합 판단에 사용한다.
- SW Proposal은 delivery 가능성을 검토하지만 architecture solution을 독자적으로 설계하지 않는다.
- DT→AX는 AI-Native engineering 내부 설계를 소유하지 않는다.
- AI-Native는 다른 과정의 전문 판단을 AI 사용이라는 이유로 가져오지 않는다.

## Handoff Contract

Handoff는 다음 과정의 내용을 미리 가르치는 것이 아니다.

- 보내는 과정은 자신이 만든 판단·artifact·미해결 질문을 명확히 한다.
- 받는 과정은 자신의 owner 관점에서 이를 재해석한다.
- 공통 사례를 사용할 때도 각 과정의 판단 질문은 달라야 한다.
- Curriculum은 실제 handoff가 필요한 경우에만 연결한다.

## Gap Rule

새 개념이 두 과정 사이에 걸치면 먼저 기존 owner의 정의와 consumer 역할로 해결 가능한지 본다. 독립된 반복 판단과 capability가 없으면 새 owner를 만들지 않는다.
