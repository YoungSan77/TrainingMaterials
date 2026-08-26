# Portfolio Engineering Principles

이 문서는 여러 과정에서 재사용되는 판단 원칙과 course-owned principle ID의 단일 owner다. 과정 문서는 원칙을 복제하지 않고 필요한 ID와 적용 의미만 사용한다.

## 1. Portfolio-wide Principles

| ID | Principle | Decision meaning |
|---|---|---|
| P-SYS-01 | Optimize the whole | 부분 효율보다 end-to-end outcome과 상호작용을 본다. |
| P-LEAN-01 | Value before activity | 활동량이 아니라 학습자·고객·사용자 가치로 우선순위를 정한다. |
| P-FLOW-01 | Shorten the feedback loop | 작은 batch와 빠른 evidence로 오류 비용과 불확실성을 낮춘다. |
| P-TOC-01 | Improve the limiting constraint first | 전체 성과를 제한하는 제약을 먼저 찾는다. |
| P-DT-01 | Problem before solution | 도구나 solution을 선택하기 전에 문제·맥락·가설을 확인한다. |
| P-EMP-01 | Separate fact, interpretation, assumption and hypothesis | 관찰과 해석을 구분하고 중요한 가정을 검증 가능하게 만든다. |
| P-ECO-01 | Use the simplest adequate solution | 가능한 가장 단순한 해법이 아니라 현재 목적과 위험에 충분한 최소 해법을 선택한다. |
| P-RISK-01 | Rigor follows risk | 비가역성·영향·불확실성이 클수록 더 강한 근거와 검증을 요구한다. |
| P-EVID-01 | Claim strength must not exceed evidence strength | 근거보다 강한 확정 주장을 하지 않는다. |
| P-OWN-01 | One fact, one owner | 정의·규칙·상태는 한 owner가 소유하고 consumer는 참조한다. |
| P-AI-01 | Guardrail before autonomy | 허용 범위·권한·승인·복구를 정한 뒤 자율성을 넓힌다. |
| P-AI-02 | Harness determines operational reliability | 확률적 생성은 가능한 부분에서 재현 가능한 evidence와 gate로 통제한다. |

## 2. Course-owned Principle Families

| Owner course | Owned principle family |
|---|---|
| OOAD | 객체 책임, 협력, 캡슐화, 응집도·결합도, 계약 |
| DDD | 도메인 언어, 불변식, 일관성 경계, bounded context |
| SW Architecture | architecture driver, quality trade-off, structural decision, evaluation/evolution |
| MSA | 분산 비용, 서비스·데이터 소유, consistency, failure/observability |
| AI-Native | specification, context, delegation, guardrail, harness, evaluation, autonomy |
| Modern SWQM | 예방·검출 portfolio, quality evidence/gate, measurement, system improvement |
| Agile | empiricism, adaptive planning, working increment, Scrum adoption |
| DevOps | delivery flow, CI/CD, deployability, recovery, operational learning |
| Project Management | value, governance, integrated planning/control, tailoring |
| SW Proposal | bid/no-bid, customer decision, win strategy, claim–evidence credibility |
| DT→AX | transformation outcome, operating-model change, use-case portfolio, evidence-based scale |

상세 원칙은 해당 Course Design이 소유한다. Portfolio에 course별 장문의 원칙 목록을 다시 만들지 않는다.

## 3. Use Contract

- Curriculum은 필요한 Portfolio principle을 선택해 적용한다.
- 원칙은 session 수나 slide 수를 결정하지 않는다.
- trade-off와 failure condition 없이 slogan으로 사용하지 않는다.
- 외부 저작의 축자 문구가 필요하면 검증된 Anchor Source를 사용한다.
