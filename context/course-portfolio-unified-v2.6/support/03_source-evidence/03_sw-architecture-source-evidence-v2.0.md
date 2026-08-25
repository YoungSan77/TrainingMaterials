# SW Architecture Verified Principles & Sources Pack v2.0

> Purpose: SW Architecture curriculum의 Why / Structure / Time 세 축을 source로 고정한다.


## Portfolio Evidence Classification

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Quality attributes / ATAM lineage | Foundational/Core | Original/Authoritative Architecture Literature | Strong | Broad | Core | Not classified |
| Clean Architecture / Dependency Rule | Established Practice-Pattern | Original-Foundational Author | Moderate | Conditional | Supporting | Not classified |
| *Building Evolutionary Architectures* | Foundational/Influential Work | Original Authors | Strong | Broad/Conditional | Core/Supporting | Not classified |
| Thoughtworks-hosted excerpts | Case/Example / Source copy | Organizational Primary | Moderate | Conditional | Reference | Not classified |

## 1. Three-Axis Reference Model

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

## 2. Quality Attribute / Evaluation

### A01 — Quality attributes significantly shape architecture
**Verification Status:** Verified  
**Source:** CMU SEI, “Reasoning About Software Quality Attributes.”  
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

## 3. Clean Architecture

### A05 — Clean Architecture is a structural lens, not the definition of architecture
**Verification Status:** Verified  
**Principle:** Clean Architecture는 separation of concerns, policy/detail separation, inward dependency를 가르치는 structural baseline이다. Driver/QA/evaluation을 대체하지 않는다.  
**Primary source:** Robert C. Martin, “The Clean Architecture” (2012), official Clean Coder blog.

### A06 — Dependency Rule
**Verification Status:** Verified  
**Principle:** source-code dependency는 higher-level policy 쪽으로 향해야 하며 volatile mechanism/detail이 policy를 지배하지 않도록 한다.  
**Use:** DIP → Architecture Dependency Rule lineage.

## 4. Evolutionary Architecture

### A07 — Guided incremental change
**Verification Status:** Verified  
**Source:** Ford, Parsons, Kua et al., *Building Evolutionary Architectures*.  
**Short verified quote:** “guided, incremental change across multiple dimensions.”  
**Use:** course time dimension.

### A08 — Fitness functions protect architectural characteristics
**Verification Status:** Verified  
**Principle:** 중요한 architectural characteristic이 변화 중 퇴화하지 않는지 tests, metrics, verification 등으로 평가한다.  
**Source:** Thoughtworks sample chapter, *Building Evolutionary Architectures*.

### A09 — Evolutionary ≠ uncontrolled / no architecture
**Verification Status:** Verified  
**Principle:** Evolutionary Architecture는 빠른 변화와 architectural rigor의 균형이며 무계획을 정당화하지 않는다.

## 5. Teaching Distinctions

- Architecture ≠ Diagram
- Quality Attribute ≠ vague adjective
- Quality Attribute Scenario ≠ Use Case
- Architecture Style ≠ Tactic
- Clean Architecture ≠ all Architecture
- Dependency Rule ≠ DI framework
- Module ≠ Runtime Service
- Fitness Function ≠ generic KPI
- Evolutionary Architecture ≠ “design nothing upfront”

## 6. ATAM Depth Recommendation

본 과정에서는:
- stakeholder concerns
- QA scenarios
- sensitivity / trade-off / risk
- lightweight evaluation mindset
를 가르친다.

정식 ATAM facilitator procedure/certification은 범위 밖.

## 7. Source Baseline

- CMU SEI — Quality Attributes / ATAM / Architecture Evaluation
- Robert C. Martin — The Clean Architecture
- Neal Ford, Rebecca Parsons, Patrick Kua et al. — Building Evolutionary Architectures

URLs:
- https://www.sei.cmu.edu/library/reasoning-about-software-quality-attributes/
- https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/
- https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/
- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- https://www.thoughtworks.com/content/dam/thoughtworks/documents/books/bk_building_evolutionary_architectures_second_edition_free_chapter.pdf


---
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.
