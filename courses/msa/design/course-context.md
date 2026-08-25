# MSA — Course Context

> **파이프라인 위치:** Portfolio Design(`portfolio/*.md`) + `guides/과정_설계_지침.md` + References + Human↔LLM → **Course Design(이 문서)** → Curriculum(`courses/msa/curriculum.md`, 별도 정본, 이 문서가 대체하지 않음).
> **정본 관계:** Portfolio-wide 원칙·용어·개념 소유는 `portfolio/`가 정본이다. 이 문서는 그 정본을 MSA 과정에 구체화한다 — 재정의하지 않는다.
> **실제 Curriculum과의 관계:** `courses/msa/curriculum.md`(8교시)는 이미 존재하는 보호 대상 자산이다. 이 문서는 그것을 대체·수정하지 않고, 그 위에 서는 상위 설계 문서로 병행 작성되었다(`guides/과정_설계_지침.md` §6).
> **알려진 격차 고지:** 이 문서는 `portfolio/concept-ownership.md`가 정한 **canonical ownership**을 그대로 반영한다. 현재 `courses/msa/curriculum.md`가 이 ownership과 어긋나는 지점이 있다면(아래 "Known Gap vs Current Curriculum" 참조) 이 문서는 그 어긋남을 **그대로 노출**한다 — curriculum의 현재 범위에 맞춰 이 문서의 OWNER 범위를 축소하지 않는다. curriculum 자체를 고치는 것은 이 작업의 범위가 아니다.

---

## 1. Course Purpose

독립 서비스로의 분산이 실제로 가치를 만드는 조건을 판단하고, 분산을 선택했을 때 발생하는 경계·데이터·계약·일관성·실패·운영 비용을 명시적으로 설계할 수 있게 한다. MSA는 pattern catalog 습득 과정이 아니라 **Distribution Decision** 과정이다.

## 2. Target Learner

- **Audience / Work Context:** 분산 구조 도입·분해·운영 결정을 내려야 하는 개발자·아키텍트.
- **Prerequisite (recommended, never assumed):** Bounded Context + Architecture Boundary/Port의 최소 의미(`portfolio/concept-ownership.md` §11). 독립 수강자를 가정하지 않되, 선수 과정을 들었다고 핵심 연결을 생략하지 않는다(Prerequisite Leakage 금지, §12).

## 3. Capability Gap / Typical Failure

- **Current Capability / Failure Mode:** 서비스 분리를 목표 그 자체로 삼고, 분산비용(네트워크·일관성·운영 constraint·bottleneck)을 과소평가한다.
- **Typical Failure 구체화:**
  - Bounded Context를 검증 없이 그대로 Microservice 경계로 치환한다 (`Bounded Context ≠ Microservice`).
  - 조직도나 데이터 테이블 기준으로 바로 서비스를 분리한다(MSA-02 실패 조건).
  - 메서드 호출을 HTTP/gRPC로 치환하면서 같은 설계라고 생각한다(MSA-04 실패 조건).
  - 장애 대응 메커니즘만 설계하고 원인을 관찰할 수단(Observability)은 설계하지 않는다(MSA-06 실패 조건).
  - Saga/Outbox 같은 분산 패턴을 만능 해법으로 오용해 실제로는 불필요한 분산 스파게티를 만든다.

## 4. Target Capability

- 분산이 실제 Business/Engineering Value를 만드는 조건을 판단한다.
- Service Boundary와 Data Ownership을 설계한다.
- API/Event Contract와 Compatibility Risk(backward/forward, additive/breaking, deprecation, consumer impact)를 평가한다.
- Sync/Async와 Consistency Strategy를 Trade-off로 설계한다.
- Partial Failure에 대비해 Retry/Idempotency/Resilience를 설계한다.
- Distributed Observability와 Operational Complexity를 분산 결정에 비용으로 포함한다.
- **Decision Level:** Decide.

## 5. Course Thesis / Narrative

> **Thesis:** 독립 서비스가 주는 자율성의 가치가 Network·Consistency·Failure·Operation 비용보다 클 때만 분산하고, 서비스 경계·계약·데이터·실패를 명시적으로 설계한다.

**Core Narrative:**
```text
Domain/Module Boundary
→ Modular Monolith
→ Boundary Validation
→ Distribution Decision
→ Service Extraction
→ Data Ownership
→ Service Contract
→ Communication
→ Consistency
→ Failure/Resilience
→ Observability
→ Operation
```

Microservice는 목표가 아니라 비용을 지불하고 얻는 autonomy option이다(`references/verified-sources.md` §1 Foundational Position 참조).

## 6. Problem This Course Owns

- 언제 Monolith를 유지하고 언제 분산하는가?
- 어떤 Boundary가 Independent Service가 될 가치가 있는가?
- Service Autonomy와 Operational Cost의 Trade-off는 무엇인가?
- Remote Interaction이 만드는 Failure Mode는 무엇인가?
- Contract/Data/Consistency를 어떻게 보호하는가?
- 분산 후 System을 어떻게 관찰하고 운영하는가?

## 7. Decisions Learner Must Make

1. 분산이 실제 Business/Engineering Value를 만드는가?
2. Boundary가 독립 Change/Deploy/Scale/Ownership 단위인가?
3. Data Ownership을 분리할 수 있는가?
4. Sync/Async 중 어떤 Coupling을 감당할 것인가?
5. 어떤 Consistency Lag가 허용되는가?
6. Failure/Retry/Duplication을 어떻게 처리할 것인가?
7. 운영 복잡성을 감당할 Capability가 있는가?

## 8. Course Ownership — OWNER / APPLY / RECAP / FORWARD / NON-SCOPE

> **정본:** `portfolio/concept-ownership.md` §6 (MSA Ownership). 아래는 그 정본을 MSA 과정에 구체화한 현재 Course Design이며, migration 당시 legacy context v2.6에서 흡수한 범위를 축소하지 않는다.

### OWNER

MSA가 정의·기원·판단·적용조건·Trade-off·실패조건까지 정본 교육하는 개념. (`concept-ownership.md` §6 OWNER 목록 + baseline §5 구체화, 전부 반영)

- **Modular Monolith**
- **Service Boundary Evaluation / Extraction**
- **Data Ownership**
- **Independent Deployment / Scaling / Operation**
- **Sync vs Async**
- **Integration Event / Messaging**
- **API / Event / Schema Contract**와 Compatibility / Contract Evolution (backward/forward compatibility, additive vs breaking change, deprecation, consumer impact)
- **Distributed Consistency / Transaction**
- **Saga / Outbox**
- **Idempotency**
- **Failure / Resilience** (Partial Failure, Retry / Isolation / Fallback)
- **Distributed Observability**
- **Deployment / Scaling / Operational Complexity**
- **MSA Adoption / Rejection Decision**

### APPLY

MSA가 정의를 바꾸지 않고 자신의 문제(경계 판단)에 가져와 쓰는 개념. OWNER는 각각 DDD, SW Architecture다.

- **DDD Bounded Context / Context Mapping** — OWNER는 DDD (`concept-ownership.md` §4). MSA는 이미 정의된 BC를 서비스 경계 후보 평가의 입력으로 가져다 쓴다. BC의 정의·전략적 매핑 자체를 다시 가르치지 않는다.
- **SW Architecture Port / Adapter / Quality Trade-off** — OWNER는 SW Architecture (`concept-ownership.md` §5). MSA는 로컬 Port/Adapter 구조를 원격 어댑터로 확장 적용하지만, Port/Adapter 개념 자체·Quality Attribute 판단 체계를 재정의하지 않는다.

### RECAP

- Coverage Matrix(`concept-ownership.md` §2)상 Modeling fundamentals / Object·Responsibility·Collaboration / SOLID·DIP에 대해 MSA는 **RECAP**이다 — 독립 수강자를 위한 최소 의미 복구만 하고, OOAD가 소유한 정본 정의를 다시 가르치지 않는다.
- Domain Service/Repository/Domain Event 계열은 Coverage Matrix상 MSA에 **EXTEND**로 표기되어 있다 — DDD가 준 씨앗(도메인 이벤트 등)을 분산 맥락(메시지·Integration Event)으로 확장하는 것이며, 이는 위 OWNER 목록의 "Integration Event/Messaging"과 연결된다.

### FORWARD / NON-SCOPE

- DDD 정의 재교육 (BC/Context Mapping의 craft·workshop은 DDD 과정 소유)
- CI/CD Pipeline 상세 → DevOps
- Kubernetes / Message Broker Vendor Catalog → 필요한 경우 Awareness(1~5분)로만 소개, Tool Catalog로 확장하지 않는다
- SRE 전체 → DevOps/전문 과정
- CQRS / Event Sourcing → 분산 심화(Advanced), 이 과정에서는 예고만

## 9. Known Gap vs Current Curriculum — 그대로 노출, 고치지 않음

이 절은 감사(audit)에서 발견된 사실을 기록한다. **이 문서는 `courses/msa/curriculum.md`를 수정하지 않으며, 이 절은 향후 커리큘럼 개정의 근거로 남기기 위한 기록이다.**

1. **Ownership Violation 후보 — Overview 문구.** `courses/msa/curriculum.md` 상단 "과정 개요"는 "소유: DDD 전략(Bounded Context·Context Mapping) · 모듈러 모놀리스 · 서비스 추출 · 분산 패턴"이라고 적어, DDD가 OWNER인 BC/Context Mapping을 MSA가 "소유"하는 것처럼 표현한다. `portfolio/concept-ownership.md` §6은 BC/Context Mapping을 MSA의 **APPLY**로만 규정한다(OWNER는 DDD, §4). 이는 `concept-ownership.md` §12 "Ownership Violation"의 **Duplicate Definition** / **Boundary Collapse**(`BC=Microservice`류) 위험 패턴에 해당할 수 있다. 실제 커리큘럼 2교시("DDD 전략: BC·Context Mapping")의 내용이 정의를 다시 가르치는지, 아니면 이미 정의된 BC를 서비스 경계 입력으로만 쓰는지는 curriculum 본문 검토가 필요하나, 최소한 **Overview 문구가 OWNER처럼 서술**하는 것 자체가 canonical ownership과 어긋난다.
2. **Coverage Gap — OWNER 개념의 커리큘럼 부재.** `portfolio/concept-ownership.md` §6과 `principles.md` C4는 **Idempotency**, **Failure/Resilience**, **Distributed Observability**, **Deployment/Scaling/Operational Complexity**를 MSA의 canonical OWNER 개념으로 명시한다. 그러나 현재 8교시 커리큘럼(`courses/msa/curriculum.md`)에는 이들을 다루는 독립 교시가 없다 — 7교시("분산 패턴 ② Saga·Outbox·최종 일관성")가 일관성/트랜잭션 패턴을 다루지만 Idempotency/Resilience/Observability/Operational Complexity에 대한 명시적 교시는 없고, `concept-ownership.md` §6 "Capacity Decision"이 이미 "현재 8교시를 유지하면 위 추가 내용을 모두 깊게 다룰 수 없다"고 지적한 바로 그 격차다. `concept-ownership.md` §12는 이를 **Distribution Blindness**("MSA를 가르치면서 failure/operation cost를 주변 주제로 취급")로 명명한다.
3. **이 문서의 입장:** 이 course-context.md의 OWNER 범위(§8)는 위 격차를 메우기 위해 curriculum을 앞질러 넓힌 것이 아니라, `concept-ownership.md`가 이미 정한 canonical scope를 있는 그대로 옮긴 것이다. curriculum이 현재 이 scope 전부를 다루지 못한다는 사실은 curriculum의 개정 대상이지, 이 문서가 scope를 curriculum에 맞춰 좁힐 이유가 아니다.

## 10. Key Distinctions

`portfolio/terminology.md` §H·§E 중 이 과정에 해당하는 것과 migration 당시 흡수된 course-specific distinction만 유지한다.

| A | B | 핵심 차이 |
|---|---|---|
| Bounded Context | Microservice | semantic boundary vs deployment/operation boundary |
| Module | Microservice (Service) | development boundary vs independent runtime boundary |
| Domain Event | Integration Event | domain fact vs cross-boundary contract |
| Saga | Agent rollback | distributed business transaction pattern vs generic workflow recovery |
| Local Call | Remote Call | 같은 프로세스 호출 vs latency/partial failure/retry/duplication이 있는 호출 |
| Eventual Consistency | No Consistency | 허용 시간/조건 안에서 수렴 vs 일관성을 신경 쓰지 않음 |
| Retry | Resilience | 재시도 자체 vs timeout/backoff/idempotency/isolation을 함께 설계한 결과 |
| Observability | Logging | log/metric/trace로 내부 상태·실패 원인을 추론하는 성질 vs 로그만 남기는 것 |

## 11. Foundational Decision Lens Fit

`portfolio/principles.md` C4와 migration 당시 흡수·검증된 판정을 현재 기준선으로 유지한다 — 5개 Lens 전부를 형식상 채우지 않는다.

- **APPLY:** Systems Thinking, Lean Thinking, Theory of Constraints, Empiricism / Scientific Thinking.
- **Why (baseline 원문):** 전체 delivery/operation flow와 현재 constraint를 보고, 분산가치를 작은 경계 검증과 운영 evidence로 확인한다.
- **NOT applied:** Design Thinking Lens는 이 과정의 실제 판단(분산 여부·경계·계약·일관성·실패·운영)을 강화하지 않으므로 포함하지 않는다.

## 12. Course-specific Principles (Parent Lens → Child)

정본은 `portfolio/principles.md` **C4. Distribution & Operational Reality — MSA**. Primary Parent Lenses: Systems Thinking / Lean Thinking / Theory of Constraints / Empiricism. 아래는 그 Child Principle을 그대로 옮긴 것이다(재정의하지 않음).

| ID | Principle | Trade-off / Failure Condition |
|---|---|---|
| MSA-01 | Monolith First unless Distribution Pays — 분산은 기본값이 아니다. 독립 배포·확장·소유의 가치가 Network/Consistency/Operation 비용보다 클 때 선택한다. | — |
| MSA-02 | Validate Boundaries Cheaply before Distributing — Module/Modular Monolith에서 경계를 먼저 검증하면 잘못된 분할을 싸게 고칠 수 있다. | **실패 조건:** 조직도나 데이터 테이블 기준으로 바로 서비스 분리. |
| MSA-03 | Data Ownership Follows Service Autonomy — 독립 서비스가 같은 데이터 구조를 직접 공유하면 자율성은 환상이다. | **Trade-off:** 독립성을 얻고 데이터 중복·동기화 비용을 부담할 수 있다. |
| MSA-04 | Remote Calls Are Not Local Calls — Network에는 latency, partial failure, retry, timeout, duplication이 존재한다. | **실패 조건:** 메서드 호출을 HTTP/gRPC로 치환하고 같은 설계라 생각. |
| MSA-05 | Consistency Is a Business Decision — 모든 데이터를 즉시 일관되게 만들 필요도, eventual consistency가 항상 정답인 것도 아니다. | **판단:** 어떤 invariant가 어느 시간 범위 안에서 반드시 지켜져야 하는가? |
| MSA-06 | Design for Failure and Observability Together — 분산 시스템에서 failure는 예외가 아니라 정상 조건이다. Timeout/Retry/Idempotency/Compensation과 Trace/Metric/Log를 함께 설계한다. | **실패 조건:** 장애 대응 메커니즘만 있고 원인 관찰이 불가능. |
| MSA-07 | Operational Complexity Is Architecture Cost — Deployment, scaling, security, observability, on-call burden은 구현 이후의 문제가 아니라 Architecture 비용이다. | — |

이 원칙 목록은 §9 "Known Gap"의 근거이기도 하다 — MSA-06(Failure/Observability)·MSA-07(Operational Complexity)이 canon에 이미 존재함에도 커리큘럼에 대응 교시가 약하다는 것이 격차의 실체다.

## 13. Trade-offs / Failure Conditions (Course-level Table)

migration 당시 legacy context v2.6에서 흡수한 Learning Outcomes를 현재 기준선으로 유지한다.

| Principle | Trade-off | Failure Condition |
|---|---|---|
| Distribution is not Default | 초기 확장성 환상은 줄지만 불필요한 운영비용 방지 | "MSA가 현대적"이라서 선택 |
| Boundary before Distribution | 경계 검증 시간이 필요 | 조직도/BC를 서비스로 즉시 변환 |
| Contract enables Autonomy | Versioning 비용 발생 | Consumer Impact 없이 Breaking Change |
| Consistency is Business Decision | 일부 즉시 일관성을 포기할 수 있음 | 모든 것을 분산 트랜잭션 또는 무조건 Eventual로 처리 |
| Failure is Normal | 설계/운영 복잡성 증가 | Happy Path만 설계 |

## 14. Cross-course Interfaces

- **Uses (선수 입력):**
  - DDD → Bounded Context, Domain Event (APPLY 대상, §8)
  - SW Architecture → Port/Adapter, Quality Trade-off, 클린 구조(Policy/Detail 분리) (APPLY 대상, §8)
- **Bridges Forward:**
  - 분산 심화(CQRS, Event Sourcing) — 별도 Advanced로 이월, 이 과정은 예고만
  - DevOps — CI/CD, SRE 전체, 배포 파이프라인 상세
  - AI-Native — Failure/Resilience/Observability 판단에 AI 도구를 적용할 경우, Course Ownership Rule(`portfolio/practice-standard.md` §9)에 따라 판단 자체는 여전히 MSA OWNER다.
- **Related Courses:** OOAD(RECAP 대상: Object/Responsibility/SOLID/DIP), DDD(APPLY 대상), SW Architecture(APPLY 대상).

## 15. Source Provenance for This Document

이 문서의 §1–§7, §13은 migration 당시 legacy context v2.6의 progression/priority/rationale/coverage-intent를 흡수했다. 세션 번호·시간표·구체적 커리큘럼 구조는 옮기지 않았다 — 그것은 `courses/msa/curriculum.md`가 이미 소유한다. §8–§9, §12는 `portfolio/concept-ownership.md`·`portfolio/principles.md`를 정본으로 구체화했다. legacy 문서는 historical provenance이며 현재 의존성이 아니다.
