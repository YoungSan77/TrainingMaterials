# SW Architecture — Verified Sources

> **Course ID:** sw-architecture
> **Standard:** `portfolio/evidence-policy.md` (Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification 스키마의 정본 — 여기서 재정의하지 않는다)
> **Source (§1–§7):** `context/course-portfolio-unified-v2.6/support/03_source-evidence/03_sw-architecture-source-evidence-v2.0.md` (SW Architecture Verified Principles & Sources Pack v2.0) — 아래 §1–§7은 이 Pack의 전체 내용을 요약 없이 그대로 옮긴 것이다.
> **Legacy migration provenance (§8):** 삭제된 legacy clean-layer convention의 Java 레이어/패키지 규약을 전문 흡수했다. 현재 정본과 의존 대상은 이 문서이며 원출처는 Git history에만 보존된다.
> **과정 설계 지침 §2-c 적용:** legacy 자료는 삭제하지 않되 normative instruction 여부를 각 절 상단에 명시한다.

---

## 1. Portfolio Evidence Classification (Pack v2.0 원문)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Quality attributes / ATAM lineage | Foundational/Core | Original/Authoritative Architecture Literature | Strong | Broad | Core | Not classified |
| Clean Architecture / Dependency Rule | Established Practice-Pattern | Original-Foundational Author | Moderate | Conditional | Supporting | Not classified |
| *Building Evolutionary Architectures* | Foundational/Influential Work | Original Authors | Strong | Broad/Conditional | Core/Supporting | Not classified |
| Thoughtworks-hosted excerpts | Case/Example / Source copy | Organizational Primary | Moderate | Conditional | Reference | Not classified |

## 2. Three-Axis Reference Model (Pack v2.0 원문)

```text
Decision Basis
Architecture Drivers / Quality Attribute Scenarios / Constraints
        ↓
Structural Baseline
Clean Architecture / Policy vs Detail / Dependency Rule
        ↓
Time Dimension
Evolutionary Architecture / Fitness Functions / Guided Change
```

## 3. Quality Attribute / Evaluation

### A01 — Quality attributes significantly shape architecture
**Verification Status:** Verified
**Source:** CMU SEI, "Reasoning About Software Quality Attributes."
**Principle:** performance, security, modifiability, reliability 등의 quality requirements는 architecture에 중요한 영향을 준다.

### A02 — Quality attributes should be made specific enough to reason about
**Verification Status:** Verified
**Source:** CMU SEI quality attribute scenario work.
**Principle:** vague adjective가 아니라 scenario로 요구를 구체화해야 architecture option을 평가할 수 있다.

### A03 — Architecture requires trade-off reasoning
**Verification Status:** Verified
**Source:** Kazman et al., ATAM, SEI.
**Principle:** competing quality attributes는 서로 상호작용하며 한 특성 개선이 다른 특성 비용을 만들 수 있다.
**Use:** Architecture decision / alternatives / ATAM orientation.

### A04 — Architecture evaluation is risk reduction
**Verification Status:** Verified
**Source:** SEI ATAM reports.
**Principle:** architecture analysis는 sensitivity, trade-off, risk를 조기에 드러내는 활동이다.

## 4. Clean Architecture

### A05 — Clean Architecture is a structural lens, not the definition of architecture
**Verification Status:** Verified
**Principle:** Clean Architecture는 separation of concerns, policy/detail separation, inward dependency를 가르치는 structural baseline이다. Driver/QA/evaluation을 대체하지 않는다.
**Primary source:** Robert C. Martin, "The Clean Architecture" (2012), official Clean Coder blog.

### A06 — Dependency Rule
**Verification Status:** Verified
**Principle:** source-code dependency는 higher-level policy 쪽으로 향해야 하며 volatile mechanism/detail이 policy를 지배하지 않도록 한다.
**Use:** DIP → Architecture Dependency Rule lineage.

## 5. Evolutionary Architecture

### A07 — Guided incremental change
**Verification Status:** Verified
**Source:** Ford, Parsons, Kua et al., *Building Evolutionary Architectures*.
**Short verified quote:** "guided, incremental change across multiple dimensions."
**Use:** course time dimension.

### A08 — Fitness functions protect architectural characteristics
**Verification Status:** Verified
**Principle:** 중요한 architectural characteristic이 변화 중 퇴화하지 않는지 tests, metrics, verification 등으로 평가한다.
**Source:** Thoughtworks sample chapter, *Building Evolutionary Architectures*.

### A09 — Evolutionary ≠ uncontrolled / no architecture
**Verification Status:** Verified
**Principle:** Evolutionary Architecture는 빠른 변화와 architectural rigor의 균형이며 무계획을 정당화하지 않는다.

## 6. Teaching Distinctions (Pack v2.0 원문)

- Architecture ≠ Diagram
- Quality Attribute ≠ vague adjective
- Quality Attribute Scenario ≠ Use Case
- Architecture Style ≠ Tactic
- Clean Architecture ≠ all Architecture
- Dependency Rule ≠ DI framework
- Module ≠ Runtime Service
- Fitness Function ≠ generic KPI
- Evolutionary Architecture ≠ "design nothing upfront"

## 7. ATAM Depth Recommendation (Pack v2.0 원문)

본 과정에서는:
- stakeholder concerns
- QA scenarios
- sensitivity / trade-off / risk
- lightweight evaluation mindset

를 가르친다.

정식 ATAM facilitator procedure/certification은 범위 밖.

### 7.1 Source Baseline (Pack v2.0 원문)

- CMU SEI — Quality Attributes / ATAM / Architecture Evaluation
- Robert C. Martin — The Clean Architecture
- Neal Ford, Rebecca Parsons, Patrick Kua et al. — Building Evolutionary Architectures

URLs:
- https://www.sei.cmu.edu/library/reasoning-about-software-quality-attributes/
- https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/
- https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/
- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- https://www.thoughtworks.com/content/dam/thoughtworks/documents/books/bk_building_evolutionary_architectures_second_edition_free_chapter.pdf

### 7.2 Unified Portfolio Alignment v2.6 (Pack v2.0 원문 footer — 이 Pack 자체에 대한 원 주석)

- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.

---

## 8. 레이어 규약 — 클린 아키텍처 (Java) [원문 전체 보존]

> **Legacy provenance:** 삭제된 legacy clean-layer convention 원문 그대로이며, 이 절이 현재 유일한 보존처다.
> **Normative status:** Portfolio-level(일반 원칙·용어 소유)에서는 `portfolio/*.md`로 superseded되었다. 그러나 **아래 Java 레이어/패키지 상세 규약은 SW Architecture 고유 내용으로서 여전히 normative**다 — `courses/sw-architecture/lab-design.md`의 스니펫·통짜 대조(부2·3)가 실제로 이 패키지 구조·명명 규약을 코드 자산의 기준으로 사용한다. `course-context.md` §7에는 §1(의존성 규칙)·§2(4레이어 요지)·§4(경계 넘기 규칙)만 옮겨졌고, §5(Java 패키지·명명 규약 상세)·§6(진행 단계와의 관계)은 이 문서에만 원형 보존된다 — course-context.md §7 상단이 이를 명시한다.
> **Evidence Role:** Established Practice/Pattern (Course-owned structural convention). **Source Provenance:** Organizational Primary(과정 자체 저작, Clean Architecture/DIP 계보의 교육용 구체화). **Evidence Strength:** Moderate(Robert C. Martin Dependency Rule의 교육적 적용이며 독립적 실증 연구 대상은 아님). **Transferability:** Conditional(레이어 우선 패키지 구조는 IV 단계에서 기능 슬라이스 우선으로 의도적으로 전환됨 — §6 참조). **Curriculum Use:** Core(부2·3 실습 코드 자산의 구조적 기준). **BP Classification:** Not classified.

### 8.1 의존성 규칙 (불변)
> **소스 코드 의존성은 오직 안쪽을 향한다. 안쪽 레이어는 바깥 레이어를 알지 못한다.**

- 이 한 줄이 전 과정의 축이다. 모든 패턴 문서는 "이 패턴이 의존성 규칙을 어떻게 지키는가"로 정당화된다.
- 위반 예: 도메인이 JPA·HTTP·프레임워크 타입을 import 하는 순간 규칙이 깨진다.

### 8.2 네 개의 레이어 (안 → 밖)

#### 8.2.1 Domain (엔티티)
- 담는 것: 엔티티, 값 객체, 도메인 서비스, 도메인 이벤트, 불변식.
- 알아도 되는 것: 순수 언어·표준 라이브러리.
- 금지: 프레임워크·영속성·전송·DI 어노테이션 일체.
- 예: Order, OrderLine, Money, OrderStatus, R1~R7.

#### 8.2.2 Application (유스케이스)
- 담는 것: 유스케이스 인터랙터, 입력·출력 포트(경계 인터페이스), 리포지토리·협력자 **인터페이스**.
- 책임: 오케스트레이션(흐름 조정)만. 업무 규칙은 도메인에 위임한다.
- 금지: 규칙 로직을 여기 두지 않는다(그러면 빈혈 도메인이 된다).
- 예: PlaceOrderUseCase, OrderRepository(인터페이스), PaymentPort.

#### 8.2.3 Interface Adapters (어댑터)
- 담는 것: 컨트롤러, 프레젠터, 게이트웨이·리포지토리 **구현**, DTO, 매퍼.
- 책임: 바깥 형식 ↔ 안쪽 모델 변환. 프레임워크와 도메인 사이의 번역.
- 예: OrderController, JpaOrderRepository, PaymentGateway, OrderDto, OrderMapper.

#### 8.2.4 Frameworks & Drivers (인프라)
- 담는 것: 웹 프레임워크, DB, 메시징, 외부 SDK, DI 배선(합성 루트).
- 책임: 세부 기술. 가장 자주 바뀌고 가장 바깥.
- 예: Spring 설정, DataSource, main/부트스트랩.

### 8.3 레이어 요약표
| 레이어 | 대표 요소 | 아는 것 | 금지 |
|---|---|---|---|
| Domain | 엔티티·VO·규칙 | 없음(순수) | 모든 바깥 기술 |
| Application | 유스케이스·포트 | Domain | 어댑터·프레임워크 구체 |
| Adapters | 컨트롤러·구현·DTO | Application·Domain | 프레임워크 배선 세부 |
| Frameworks | 프레임워크·DB·배선 | 전부 | — |

### 8.4 경계 넘기 규칙
- **데이터**: 레이어 경계는 DTO로만 넘긴다. 도메인 객체를 어댑터 밖으로 유출하지 않는다.
- **제어 흐름**: 밖 → 안(컨트롤러가 유스케이스를 호출).
- **의존성**: 안 ← 밖. 안쪽이 바깥을 필요로 하면 **안쪽에 인터페이스(포트)를 두고 바깥이 구현**한다(DIP).
- 인터페이스 소유 위치: 포트·리포지토리 인터페이스는 Application(안), 구현은 Adapters(밖).

### 8.5 Java 패키지·명명 규약
패키지(기능 슬라이스 기준):

```
com.example.ordering
├─ domain           // 8.2.1
├─ application      // 8.2.2 (usecase, port)
├─ adapter          // 8.2.3 (web, persistence)
└─ infrastructure   // 8.2.4 (config, bootstrap)
```

- 이 구조는 **계층 우선**이다(대상 친숙도 우선). IV(모듈러 모놀리스·MSA)에서 기능 슬라이스 우선(`ordering/`, `payment/`)으로 전환한다 — 의도된 선택이며 누락이 아니다.

명명:

| 역할 | 이름 규약 | 위치 |
|---|---|---|
| 유스케이스 | `PlaceOrderUseCase` / `...Interactor` | application |
| 입력·출력 포트 | `...InputPort` / `...OutputPort` | application |
| 리포지토리 | 인터페이스 `OrderRepository` / 구현 `JpaOrderRepository` | application / adapter |
| 협력자 | 포트 `PaymentPort` / 구현 `PaymentGateway` | application / adapter |
| 전송 객체 | `OrderDto` + `OrderMapper` | adapter |

### 8.6 진행 단계와의 관계 (규약은 불변, 채움만 변한다)
- 규약은 스파게티·TS·리치에서 **동일하게 적용**된다. 바뀌는 것은 각 레이어가 채워지는 정도다.
- 스파게티: 경계가 없다 → 규약 위반 상태(대비의 출발점).
- TS: 레이어는 서지만 Domain이 빈약하다(규칙이 Application에 있음).
- 리치: 규칙이 Domain으로 이동해 Domain이 두꺼워진다. 규약의 완성형.
- 즉 이 문서는 "목표 형태"를 정의하고, 본편은 그 목표에 도달하는 경로를 보인다.

---

## Authoring Checklist Cross-check (evidence-policy.md §12, 적용 결과)

- [x] Global Baseline 근거 유형: Foundational/Core(SEI QA/ATAM), Established Practice-Pattern(Clean Architecture), Foundational/Influential Work(Building Evolutionary Architectures) — §1 표 그대로.
- [x] Source Provenance와 Evidence Strength를 분리해 표기했다(§1, §8 헤더).
- [x] Evidence Strength를 claim 계열별로 판단했다(§1: Strong/Moderate).
- [x] Transferability를 Broad/Conditional로 명시했다(§1, §8).
- [x] Curriculum Use를 Core/Supporting/Reference로 명시했다(§1, §8).
- [x] BP Classification은 기본값 Not classified를 유지했다(모든 절).
- [x] Foundational Work(Clean Architecture, Building Evolutionary Architectures)의 개념·원칙·적용조건을 구분했다(§4, §5, §8).
- [x] Vendor/organizational 자료(Thoughtworks-hosted excerpts)를 general rule로 자동 승격하지 않았다(§1: Case/Example로 유지).
- [x] 특정 LLM/vendor에 과정 구조가 종속되지 않는다(§7.2 원문 확인).
- [x] 국제표준(ATAM)이 필요 이상으로 Course Spine을 차지하지 않도록 §7에서 depth를 명시적으로 제한했다.
