# Curriculum Canon Audit v1

> 이 문서는 정본이 아니다. 실제 repository의 curriculum(courses/**)을 Program Governance v2.2.2 Canon(program-design/**)과 대조한 감사 기록이며, 다음 Phase(Curriculum Revision)의 input이다.
> **이 감사는 curriculum/source/deck/engine을 수정하지 않았다.** 아래 모든 판정은 제안이며 실행되지 않았다.
> **읽은 파일(전문 read, 요약이 아님):** `courses/ooad/ooad-curriculum.md`, `courses/ddd/curriculum.md`, `courses/sw-architecture/curriculum.md`, `courses/msa/curriculum.md`, `courses/ai-assisted/curriculum.md`, `courses/agentic/curriculum.md`, `courses/qm/QM_커리큘럼.md`, `courses/swqm/swqm_커리큘럼.md`(read-only, legacy assessment 전용, 처음 120줄 — 목적·구조 파악에 충분했다). Canon 15개 문서는 이전 두 턴(Governance Integration)에서 이미 전문을 읽었다.
> **표기 범위**: 아래 표는 세션/토픽 단위로 **대표성 있는 실제 발견**을 기록한다 — 14~16세션 과정의 모든 명제(C1~C16 등)를 한 줄씩 판정하지 않는다. 명제 단위 상세는 Phase 3(Curriculum Revision) 착수 시 필요하다.

---

# Executive Verdict

**PARTIAL ALIGNMENT — 두 개의 구조적 공백이 나머지 전부를 막는다.**

1. **Design by Contract가 OOAD 어디에도 없다.** Canon(P11A·terminology.md·course-specs/ooad.md §14)이 OOAD OWNER로 확정했지만, 현재 `ooad-curriculum.md` 14세션 전체에 Precondition/Postcondition/Object Invariant가 단 한 번도 등장하지 않는다. Contract Lineage(`Object Contract → Domain Invariant → Interface Contract → Service Contract → Stage Contract → Quality Evidence`)의 첫 고리가 비어 있어 DDD·SWA·MSA·AI-Native 전부가 이 lineage를 제대로 재정박할 수 없다.
2. **DDD 전술/전략이 어디에도 없다.** 옛 소유 구조("전술=OOAD, DDD=craft")가 `ddd/curriculum.md`에 아직 그대로 박혀 있다("전술 문법은 OOAD 소유 — 여기선 안 가르친다"). 그런데 OOAD도 이걸 안 가르친다("이음만 = DDD 전술"). **Entity·VO·Domain Invariant·Aggregate·Domain Service·Repository·Domain Event가 정본 교육되는 자리가 repository 어디에도 없다.** concept-ownership-map.md §4가 이미 이 폐기를 명시했다("전술=OOAD, DDD=craft 소유 구조는 폐기한다").

이 둘은 six-course-architecture-completion-review.md가 "Open but Non-Blocking"으로 분류한 항목(DDD 세션 수)의 근거를 무효화한다 — **없는 것이 아니라 완전히 빈 것**이라 더 이상 non-blocking이 아니다. §Blocking Decisions 참조.

세 번째로 큰 발견은 SW Architecture다: Architecture Driver·Quality Attribute Scenario·Trade-off·ADR·Evaluation·Fitness Function이 16세션 어디에도 없다 — canon 자신이 이미 "Critical Gap"으로 예고했던 것과 정확히 일치하지만, 실제로 0세션이라는 건 이번에 직접 읽고 처음 확인했다.

반면 **기존 실습의 뼈대(스파게티→TS→리치, 이벤트 스토밍·애그리거트 경계 판단 워크숍, 에이전트 HITL 게이트 설계)는 전부 KEEP 등급**이다 — canon과 상충하지 않고, 오히려 canon이 자신의 course-spec에서 "이 강점을 보존하라"고 명시한 바로 그 콘텐츠다. 문제는 "나쁜 콘텐츠"가 아니라 "빠진 OWNER 정의"다.

---

# Cross-Course Findings

| Finding | 영향 범위 | 심각도 |
|---|---|---|
| Design by Contract 부재 | OOAD 자체 + DDD/SWA/MSA/AI-Native의 Contract Lineage 전부 | HIGH |
| DDD 전술/전략이 OOAD·DDD 어디에도 없음(옛 "전술=OOAD" 잔존) | DDD 자체 + MSA S02가 참조할 대상 부재 | HIGH |
| SWA에 Driver/QA/Trade-off/ADR/Evaluation/Fitness 전무 | SWA 자체 + MSA/AI-Native가 "SWA Policy/Gate를 APPLY"하려 해도 실체가 없음 | HIGH |
| "선수"(prerequisite) 표현이 여러 과정에 하드코딩되고 강도가 제각각 | ddd("전제: OOAD"), sw-architecture("후행: MSA 과정의 선수"), msa("전제: SW 아키텍처 선수") — P42 "recommended, never assumed"와 온도차 | MEDIUM |
| "6과정"/"6개 과정" 하드코딩 잔존 | ooad S14 C10("6과정 지도에서 OOAD 자리") | LOW |
| Global/Korea source 태깅 부재 | 6개 감사 대상 전부 [Korea BP]/[Korea WP]/[Local Context] 태그를 쓰지 않는다 — 다만 내용 자체가 이미 Global 1차 출처(Larman·Evans·Meyer·GoF·Parnas·Fowler·Deming) 중심이라 실질 위반은 QM에 집중(§Source/Evidence Risks) | LOW–MEDIUM |
| Quote asset이 Repository/DDD Repository 개념 혼용 | ooad S11이 Repository를 OOAD 패턴 예시로 사용(RemOVE 대상) | MEDIUM |

---

# OOAD Audit

**Canonical spine 대조**: `Problem → Requirement/Use Case → Analysis Model → Object/Responsibility → Contract → Collaboration → Design Model → Code → Feedback/Refactoring`. 현재 14세션은 이 spine을 대체로 따르나 **Contract가 통째로 빠져 있다.**

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| OOAD | A0/S01 "OOA는 rich 전제"(★층위) | anemic/rich를 설계·구현 층 문제로, "OOA는 rich 전제"라 명시 | course-spec §21 REFINE 대상(11번 문서 P1 HIGH) | OWNER | REFINE | "rich conceptual model", "OOA rich 전제" 표현 자체가 canon이 명시적으로 금지한 문구 — Analysis Model은 rich를 전제하지 않고, rich는 책임·협력 설계의 **결과**여야 한다 | A0 헤더, S01 본문 | 없음 | S04/S12 서술 톤에 연쇄 | HIGH |
| OOAD | S01 오리엔테이션 | 코드 진화사, "현대 OO=OO+FP 수렴"을 [원칙]으로 제시 | terminology.md Object | OWNER | REFINE | 수렴 명제를 core proposition으로 두지 않는다는 canon 방향과 충돌. Message(Alan Kay)·Responsibility가 S01에 명시적으로 없음 | S01 | 없음 | 낮음(1세션 국소) | MEDIUM |
| OOAD | S02 요구사항→유스케이스 | C10 "유스케이스는 편재 언어로 쓴다 — **UL이 여기서 시작**" | terminology.md UL = DDD OWNER | 위반(OWNER 밖 정의) | REFINE | "UL이 여기서 시작"은 명백한 ownership leakage. "domain vocabulary"로 순화하고 UL은 DDD FORWARD로 | S02 C10 | 없음 | DDD S01/S02가 받을 forward-ref 문구와 이어짐 | HIGH |
| OOAD | S03 BDD | C4 "시나리오가 곧 수용 테스트(명세=검증, 안 낡음)" | — | — | REFINE | 절대 표현. course-spec에 어긋나진 않으나 11번 문서가 이미 완화 지시 | S03 | 없음 | 낮음 | LOW |
| OOAD | S04 정적 모델 | C15 "구조가 코드 골격으로 곧장 매핑(codepair)" | Analysis Model ≠ Design Model | APPLY 경계 | REFINE | "곧장 매핑" 표현이 1:1 기계적 변환 인상을 줄 수 있다 — course-spec §8 Non-negotiable("Analysis Model ≠ Code Skeleton")과 온도차 | S04 C15 | 없음 | 낮음 | LOW |
| OOAD | **S08/S11 — Design by Contract 부재** | DbC 관련 언급이 14세션 전체에 0건 | Design by Contract, Precondition, Postcondition, Object Invariant (P11A, terminology.md, course-spec §14) | **OWNER (완전 공백)** | **ADD** | 신규 canon이 명시적으로 OOAD OWNER로 확정한 전체 개념군이 존재하지 않는다. course-spec §14 Order.cancel() 예시(Precondition=취소 가능 상태/Postcondition=Cancelled/Object Invariant=완료·취소 모순 방지)를 그대로 쓸 수 있다 | S11(권장, RDD/GRASP 옆) 또는 S12 실습에 편입 | 없음 | DDD Domain Invariant Minimum Recap, SWA/MSA/AI-Native 전체 Contract Lineage | **HIGH** |
| OOAD | S11 RDD·GRASP·패턴 | C12 "Factory·Strategy·**Repository(영속성 은닉)**"를 OOAD 핵심 패턴 예시로 사용 | Repository = DDD OWNER (concept-ownership-map §4) | 위반 | **REMOVE** | course-spec §19가 명시적으로 금지("Repository는 OOAD pattern catalog에서 핵심 예제로 사용하지 않는다") | S11 C12 | DDD Repository 정의가 먼저 있어야 자연스러운 FORWARD가 됨(현재는 DDD에도 없음, §Cross-Course Findings) | 낮음(문구 교체만) | MEDIUM |
| OOAD | S11 RDD·GRASP·패턴 | Tell Don't Ask / Law of Demeter / CQS가 본문에 명시적으로 등장하지 않음 | P05/P06/P07 (OOAD OWNER) | OWNER | ADD | canon이 OWNER로 못박은 세 heuristic이 세션 본문 명제 목록에 없다(과거 quote pack 계획엔 있었으나 curriculum 본문 미반영) | S11 | 없음 | 낮음 | MEDIUM |
| OOAD | S12 책임 배치 실습 | 빈혈→GRASP→SOLID→rich 워크숍 | RDD/GRASP capstone | OWNER | KEEP+STRENGTHEN | canon course-spec §12 GRASP 필수 목록과 완전히 일치, 캡스톤 실습으로 이미 강함 | — | S11 | — | LOW |
| OOAD | S13 TDD·리팩토링 | C4 "TDD는 테스트 기법이 아니라 설계 기법(테스트는 부산물)" | course-spec §20 | — | REFINE | course-spec §20이 정확히 이 categorical 단정을 금지("TDD는 verification technique이면서 design feedback pressure로 작동할 수 있다") — 즉 canon이 명시적으로 반대하는 문장이 현재 curriculum에 그대로 있다 | S13 C4 | 없음 | 낮음 | HIGH(직접 canon 위반 문장) |
| OOAD | S14 마무리(진화+종합) | C3/C4가 "DDD 전술 설계"/"DDD 전략 설계"/"Bounded Context"/"Context Map"을 **이름과 정의로** 소개 | DDD FORWARD (질문만 예고) | FORWARD 경계 초과 | REFINE | A1 절 자체가 "DDD 전술 이름 안 씀"이라 선언했는데 S14 C3/C4는 실제로 이름과 짧은 정의를 준다 — 자기모순. course-spec §4(OOAD)는 FORWARD를 "필요성만 예고"로 제한 | S14 C3/C4 | 없음 | 낮음 | MEDIUM |
| OOAD | S14 마무리 | C10 "6과정 지도에서 OOAD 자리" | reference-frame.md Portfolio 원칙 | — | REFINE | 하드코딩된 과정 수 표현, Portfolio-agnostic 원칙과 충돌(cosmetic) | S14 C10 | 없음 | 없음 | LOW |
| OOAD | S05~S07, S09, S10 | 정적/동적 모델링 워크숍, 아키텍처 지향(forward만), SOLID | 대부분 canon과 정합 | OWNER/FORWARD | KEEP | 11번 문서 판정과 직접 읽은 내용이 일치 — notation-보다-질문 중심, forward 절제 잘 지켜짐 | — | — | — | — |

---

# DDD Audit

**Canonical flow 대조**: `Domain Discovery → UL → Domain Model → Model-Driven Design → Entity/VO → Domain Invariant → Aggregate → Domain Interaction → Bounded Context → Context Relationship → Model Evolution → Explicit Semantics`. 현재 8세션은 이 flow의 **뒷부분 절반(Aggregate 경계 판단 이후)만** 갖고 있고, **앞부분(UL·Domain Model·Entity/VO·Domain Invariant의 정본 정의)이 통째로 없다.**

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| DDD | 과정 개요 전체 | "소유: 모델링 craft"로 스스로를 한정. "전술 문법(Entity·VO·Aggregate…)은 OOAD 소유 — 여기선 안 가르친다" | concept-ownership-map §4: Entity/VO/Domain Service/Repository/Domain Event/Invariant/Aggregate = **DDD OWNER** | **정면 위반** | **ADD (대규모)** | canon이 §4 "Migration from Current"에서 이미 이 정확한 문장("'전술=OOAD, DDD=craft' 소유 구조는 폐기한다")으로 폐기를 지시했다. 현재 파일은 그 지시 이전 상태 그대로다 | 과정 개요, 목차 전체 재편 | OOAD가 DbC/GRASP만 소유하도록 먼저 정리(§OOAD Audit ADD 항목)돼야 DDD의 Minimum Recap이 맞아떨어진다 | SWA/MSA/AI-Native의 "DDD Domain Model APPLY" 전부가 실체 없이 APPLY하는 중 | **HIGH(전체 중 최고 우선순위급)** |
| DDD | S1 오리엔테이션 | "왜·언제 DDD, 전술/전략 지도에서 이 과정=craft" | Domain/Subdomain/UL 도입(course-spec §5 Core Flow 1~2단계) | OWNER(공백) | ADD | 전체 재편의 진입점. Domain/Subdomain/UL의 정본 정의가 시작돼야 함 | S1 확장 또는 S1~S2 신설 | 위 항목 | 뒤 세션 전부 | HIGH |
| DDD | S2–S3 이벤트 스토밍 | 도메인 이벤트로 흐름 발견, Order 이벤트 스토밍 | Domain Discovery (OWNER) | OWNER | **KEEP** | canon course-spec §16 Suggested Backbone의 "S03 Domain Discovery/Event Storming"과 정확히 일치. 이 부분은 이미 canon 그대로다 | — | — | — | — |
| DDD | (부재) Domain Model / Model-Driven Design / Entity / VO 정본 정의 | 없음 | course-spec §9 Model-Driven Design, §5 OWNER | OWNER(공백) | **ADD** | "model이 코드와 지속 연결돼야 한다"는 canon 핵심 사고 자체가 현재 과정에 없다 | 이벤트 스토밍과 애그리거트 경계 설계 사이에 신설 | S1~S3 | S4~S6(애그리거트 워크숍)의 전제 조건이 채워짐 | HIGH |
| DDD | S4–S6 애그리거트 경계 설계 | "불변식이 경계를 정한다", 트랜잭션 일관성 vs 최종 일관성, 크기 트레이드오프 | course-spec §10 Aggregate(`Domain Invariant → Consistency Requirement → Aggregate Boundary → Aggregate Root`) | OWNER(부분) | **REFINE + ADD** | 판단 로직 자체는 canon과 완전히 정합(이미 옳은 사고를 훈련시킴) — 다만 Entity/VO/Domain Invariant/Aggregate Root라는 **용어의 정본 도입**이 이 워크숍 앞에 없어서 학습자가 "이름 없는 감"으로 판단하게 된다 | S4 앞에 짧은 정의 도입 삽입 | 위 ADD 항목 | 워크숍 품질 자체는 유지, 다만 독립 수강자 재정박 실패 위험 | HIGH |
| DDD | (부재) Domain Service / Repository / Domain Event | 없음(명시적으로 "안 함") | course-spec §5 OWNER, §11 Tactical Patterns 필수 목록 | OWNER(공백) | **ADD** | canon이 필수 본편으로 지정한 3개 tactical pattern이 전무 | 애그리거트 세션군 뒤에 신설 또는 확장 | 위 항목 | OOAD S11의 Repository REMOVE와 맞물려야 함(§Cross-Course MOVE Map) | HIGH |
| DDD | S7 컨텍스트 매핑 | "유비쿼터스 언어. 컨텍스트 관계(고객-공급자·순응자·ACL). 매핑만, 서비스 분해는 MSA" | Bounded Context / Context Mapping (OWNER) | OWNER | **KEEP** | canon과 정합 — "매핑만, 분해는 MSA"라는 경계가 정확히 course-spec §12 "strategic design은 microservice découpage가 아니다"와 일치 | — | — | — | — |
| DDD | (부재) Model Evolution / Explicit Semantics·Ontology bridge | 없음 | course-spec §14 | BRIDGE(공백) | ADD(낮은 우선순위) | reference-frame §8/concept-ownership-map §8이 요구하는 Bridge 내용이 없다. optional이라 강제는 아니지만 course-spec은 본편 포함을 권장 | S7과 S8 사이 또는 S8 종합에 축약 편입 | — | AI-Native의 BRIDGE 파트너 부재 상태 지속 | MEDIUM |
| DDD | S8 종합 | "전술(OOAD)↔craft(여기)↔전략 적용(MSA)↔아키텍처 연결"로 소유 지도 재확인 | — | — | REFINE | "전술(OOAD)"라는 문구 자체가 옛 소유 구조를 재확인하는 표현 — 위 ADD가 반영되면 이 문구도 자동 수정 필요 | S8 | 위 ADD | 낮음 | MEDIUM(연쇄) |
| DDD | 과정 개요 "전제: OOAD(DDD 전술 개념)" | OOAD가 DDD 전술을 가르친다는 전제 | course-spec §3 Minimum Recap(Object/Responsibility/Collaboration/Encapsulation/DbC/Analysis vs Design Model/Cohesion·Coupling — DDD 전술 아님) | — | REFINE | Minimum Recap 항목이 canon과 다르다 — "DDD 전술 개념"이 아니라 순수 OO 기초 + DbC가 recap 대상 | 과정 개요 | OOAD의 DbC ADD | 낮음 | MEDIUM |

**Supple Design 위치 제안**: course-spec §13이 이미 권장한 대로 — 16시간 이하 본편에서는 **개념 존재·목적만 소개하고 전체 패턴은 Advanced/Appendix로** 격리하는 것을 그대로 지지한다. 현재 8교시 구조에 Supple Design을 본편으로 넣을 여유가 없다(위 ADD 항목들이 이미 세션 압박을 만든다).

---

# SW Architecture Audit

**3축 대조**: (A) Decision Basis — Driver/QA Scenario/Constraint, (B) Structural Baseline — Clean Architecture, (C) Time Dimension — Evolutionary Architecture. 현재 16세션은 **(B)만 있고 (A)·(C)가 없다.**

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| SWA | 전체 구조(S1–S16) | Driver/Quality Attribute/Trade-off/ADR/Evaluation/Fitness Function이 16세션 어디에도 등장하지 않는다(직접 확인) | 3축 중 (A) Decision Basis, (C) Time Dimension 전체 | **OWNER(공백)** | **ADD(대규모)** | sw-architecture-canon-stance.md·course-spec 둘 다 이미 "Critical Gap"으로 예고했던 것과 정확히 일치 — 실제로 0세션임을 이번에 확인 | Part 1(Why)·Part 3(Decide&Evaluate 후반)·Part 4(Enforce&Evolve) 신설, 기존 토대(S2–S6) 압축으로 공간 확보 | 없음(즉시 착수 가능) | MSA/AI-Native가 "SWA Policy/Fitness Gate를 APPLY"하는 근거가 생김 | **HIGH(전체 최고 우선순위)** |
| SWA | S1 오리엔테이션 | Brooks 본질/우발 복잡도, 프로그램 자세, Order·레이어 규약 소개 | Course thesis 도입 | — | REFINE | Driver/QA를 최소한 예고만이라도 여기서 시작해야 spine 순서(`Drivers→Quality→...`)와 맞음 | S1 | — | 낮음 | MEDIUM |
| SWA | S2–S6 토대(OO·SOLID·결합응집·패턴·스타일개관) | OOAD 미보유자를 위한 안전망 교육 | APPLY(OOAD 재정박) | APPLY | KEEP, 단 REDUCE 검토 | 콘텐츠 자체는 문제없다(오히려 course-spec이 "OOAD 최소 재정박"을 요구) — 다만 6세션이 Driver/QA를 밀어낸 공간이므로, 새 Canon 반영 시 압축 후보 1순위. S6 "스타일 개관"은 스타일을 QA-driven 선택 없이 카탈로그로 나열(§course-spec "style catalog가 아니라 decision/trade-off") | S2–S6 재배분 | S1 | Part1 신설 공간 확보 | HIGH(구조적 트레이드오프) |
| SWA | S3 SOLID·의존성 규칙 | "DIP → 아키텍처 의존성 규칙" 재정박 | Dependency Rule (OWNER), DIP≠DI (terminology) | APPLY→OWNER 이음 | KEEP | canon과 정확히 일치하는 좋은 재정박 사례 | — | — | — | — |
| SWA | S7–S8 스파게티→TS | R1~R7 냄새 진단, 얇은 레이어·TS·Repository·DTO | Core Lab Spine (course-spec §9) | Structural Baseline 실습 | **KEEP** | course-spec §9가 "기존 강점을 보존한다"로 명시 지정한 바로 그 lab | — | — | — | — |
| SWA | S9–S12 TS→리치 | 도메인 모델링, 유스케이스·포트, 리치 완성·게이트(ArchUnit+캡슐화 린터) | Clean Architecture/Dependency Rule/Port·Adapter (OWNER) | OWNER | **KEEP**, 단 라벨링 REFINE | S12의 "게이트: ArchUnit(의존 방향)+캡슐화 린터"는 사실상 **Architecture Fitness Function의 실사례**다 — 새로 만들 필요 없이 "이것이 Fitness Function이다"로 명명·재프레이밍하면 (C) Time Dimension의 일부를 이미 갖고 있는 셈이 된다 | S12 문구에 "Fitness Function" 용어 추가 | — | ADD 부담 일부 경감 | MEDIUM(기회) |
| SWA | S13–S14 이벤트·반례 | 인프로세스 도메인 이벤트, Active Record/Anemic 반례 | APPLY | APPLY | KEEP | canon과 상충 없음 | — | — | — | — |
| SWA | S15 MSA 티저 | "다음 과정 소유... 이름만 예고" | FORWARD 경계 | FORWARD | **KEEP** | course-spec Non-Scope를 정확히 지킨다 — 좋은 FORWARD 사례 | — | — | — | — |
| SWA | S16 종합 | 판단 프레임 + "추세 언급(1~2줄)... 특정 과정 지목 없음" | cross-course-framework §1 Governance Layers 정신 | — | **KEEP** | LLM 트랙 단방향 참조 규율을 정확히 지킨다 — 다른 과정들의 모범 사례로 인용할 만하다 | — | — | — | — |

**Architecture Evaluation 깊이 제안**: course-spec §10 그대로 채택 — "scenario-driven evaluation mindset"을 목표로 하고 ATAM/QAW는 목적·구조 수준만(정식 facilitator 훈련 아님). 신설 세션 1개(Part 3)로 충분.

---

# MSA Audit

**Canonical priority 대조**: `Boundary → Contract → Failure → Operation`. 현재 8세션은 **Boundary는 강하고, Contract/Failure/Operation은 약하거나 없다.**

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| MSA | 과정 개요 | "소유: **DDD 전략(Bounded Context·Context Mapping)** · 모듈러 모놀리스 · 서비스 추출 · 분산 패턴" | concept-ownership-map §6: BC/Context Mapping = APPLY only, DDD가 OWNER | **정면 위반** | **REDUCE** | canon이 §6 "CHANGE"에서 이미 지시했다: "기존 S02 'DDD 전략: BC·Context Mapping'은 OWNER 교육이 아니라 DDD recap + service-boundary input으로 축소" — 개요 문구부터 고쳐야 한다(현재 "소유"라고 명시) | 과정 개요, S2 | DDD가 BC/Context Mapping을 실제로 OWNER 교육해야 자연스러운 RECAP이 성립(DDD Audit ADD 항목과 연동) | 하위 세션 전부의 자기소개 문구에 영향 | HIGH |
| MSA | S2 DDD 전략: BC·Context Mapping | "컨텍스트 간 관계 유형"까지 상세 교육 | 위와 동일 | 위반 | **REDUCE** | 관계 유형 분류까지 가르치는 건 RECAP 범위를 넘는 OWNER 교육이다 | S2를 "DDD recap(5분) + service-boundary 판단 input"으로 압축 | DDD ADD | 절약된 시간을 Contract/Failure로 재배분 가능 | HIGH |
| MSA | S3–S4 모듈러 모놀리스·분할 실습 | 포트=모듈 경계, 데이터 소유, 잘못된 경계를 싸게 고침 | Modular Monolith/Service Boundary Evaluation (OWNER) | OWNER | **KEEP** | course-spec §9 "Modular Monolith First" lab과 정확히 일치, MSA의 가장 강한 부분 | — | — | — | — |
| MSA | S5 서비스 추출 | payment/billing 추출, 원격 경계, 클린 구조 반복 | Service Extraction (OWNER) | OWNER | KEEP | canon과 정합 | — | — | — | — |
| MSA | (부재) API/Event/Schema Contract + Compatibility/Evolution | S5–S6에서 메시징을 짧게만 언급, 별도 세션 없음 | course-spec §10 (v2.2 신규 OWNER 확장 — API/Event/Schema Contract, compatibility, additive vs breaking, deprecation window) | OWNER(공백) | **ADD** | v2.2에서 새로 확정된 OWNER 범위인데 curriculum이 아직 v2.0 시절 그대로다 | S5–S6 사이 신설 또는 S6 확장 | — | AI-Native/SWA의 Contract Lineage 하위 고리 | HIGH |
| MSA | S6 분산 패턴① 동기 vs 이벤트 | 시간 결합, 인프로세스 이벤트→메시지 승격 | Sync vs Async (OWNER) | OWNER | KEEP | canon과 정합 | — | — | — | — |
| MSA | S7 분산 패턴② Saga·Outbox·최종 일관성 | 각 패턴 얻음/잃음 | Saga/Outbox/Distributed Consistency (OWNER) | OWNER | KEEP | canon과 정합, 다만 **Idempotency가 이 세션에도 명시적으로 없다**(Saga/Outbox만 언급) | S7에 Idempotency 명시 추가 | — | 낮음(같은 세션 확장) | MEDIUM |
| MSA | (부재) Idempotency 독립 취급 | 없음(S7에 암묵적으로만 인접) | Idempotency (OWNER, course-spec §14 필수) | OWNER(공백) | **ADD** | canon이 별도 필수 항목으로 명시하나 현재 세션 어디에도 "Idempotency"라는 용어 자체가 없다 | S7 또는 S6 | — | — | MEDIUM |
| MSA | (부재) Partial Failure/Timeout/Retry/Isolation/Fallback (Resilience) | 없음 | course-spec §14 필수 | OWNER(공백) | **ADD** | canon priority의 세 번째 축(Failure)이 8세션 어디에도 독립 세션이 없다 | S7~S8 사이 신설 | — | 1일 과정 capacity 문제 직결 | **HIGH** |
| MSA | (부재) Distributed Observability | 없음 | course-spec §15 필수 | OWNER(공백) | **ADD** | canon priority 네 번째 축(Operation)의 절반이 없다 | S8 확장 또는 신설 | — | — | HIGH |
| MSA | S8 종합 | "언제 MSA를 안 하나(YAGNI), 분산 스파게티 재확인, CQRS·ES 예고" | Deployment/Scaling/Operational Complexity (OWNER) | OWNER(부분 공백) | **REFINE + ADD** | 종합은 좋지만 Operational Complexity(배포·스케일링·on-call 비용)가 명시적으로 다뤄지지 않는다 | S8 확장 | — | — | MEDIUM |

**Capacity Decision (Blocking)**: 위 ADD 4개(Contract/Idempotency/Resilience/Observability)를 전부 8교시(1일) 안에 넣을 여유가 없다. course-spec §16이 이미 제시한 두 선택지(1일 유지·pattern breadth 축소 vs 2일 확장)를 사용자 결정이 필요한 항목으로 재상신한다 — §Blocking Decisions 참조.

---

# AI-Native Audit

물리적으로 `courses/ai-assisted/`·`courses/agentic/` 두 디렉터리로 남아 있으나, course-specs/ai-native.md 기준 **하나의 lineage**로 감사했다. 병합은 하지 않았다(금지 사항 준수 확인).

**Canonical flow 대조**: `Intent → Responsibility Allocation → Specification → Stage Contract → Context → Constraint/Permission → Guardrail → Harness → Agent/Workflow → Evaluation/Evidence → Feedback → Autonomy Adjustment`.

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| ai-assisted | S3 컨텍스트·제약 설계 | "요구사항·규칙·경계를 **프롬프트 컨텍스트**로. **하네스**(제약만, 해법은 열기)" | terminology.md §H: Context≠Prompt, Guardrail≠Harness | **위반** | **REFINE** | 이전 세션(Governance turn)에서 이미 확인된 사항을 이 audit에서 원문으로 재확인 — Context가 Prompt로 축소되고, "하네스"라는 한 단어가 Guardrail 역할까지 겸용 | S3 | — | Context Engineering 5차원 ADD와 함께 처리 | HIGH |
| ai-assisted | (부재) Specification Engineering 정식 어휘 | S2 "암묵지→명시 지시"가 유사 내용을 다루나 Intent/Constraints/Acceptance/Completion/Verification 구조화 없음 | Specification Engineering (OWNER, course-spec §9) | OWNER(약함) | **ADD** | canon이 요구하는 명시적 구조(course-spec §9 최소 8요소)가 없다 | S2–S3 | — | Stage Contract ADD의 전제 | MEDIUM |
| ai-assisted | (부재) Stage Contract | S4–S5 "지시→생성" 대조가 비형식적 | Stage Contract (course-spec §10) | OWNER(공백) | ADD | Input/Output/Precondition/Constraint/Acceptance/Gate/Failure Path 구조가 없다. **OOAD DbC ADD가 선행되면 자연스러운 EXTEND로 연결 가능**(cross-course-framework §5 Contract Lineage) | S4–S5 | OOAD DbC ADD | AI-Native 전체 Contract 고리 | MEDIUM |
| ai-assisted | S6–S10 통제(리뷰 기준·게이트·리팩토링·오류 패턴) | 앞 4과정 판단 재사용, ArchUnit·캡슐화 린터 재사용, 결정론적 게이트 | P37 Deterministic Evidence, Quality Gate cross-course mechanism | APPLY | **KEEP** | canon P37("deterministic evidence가 가능한 것을 LLM reviewer에게만 맡기지 않는다")과 정확히 일치하는 이미 좋은 설계 | — | — | — | — |
| ai-assisted | S13 언제 AI를, 언제 손으로 | "복잡도·위험이 높은 판단은 사람이" | P36 Autonomy=Risk Allocation(risk×reversibility×observability×verification cost) | OWNER(형식 약함) | REFINE | 방향은 맞으나 canon의 4축 명시 프레임이 없다 | S13 | — | agentic S10과 통합 여지 | MEDIUM |
| agentic | S2 에이전트란 | "자율·도구 사용·루프·HITL. assisted와의 경계" | Agent ≠ LLM call (terminology.md) | OWNER | **KEEP** | canon 정의 요소(goal/responsibility/context/tool/state/completion/failure/observation)를 사실상 다 포함 — 좋은 정의 | — | — | — | — |
| agentic | S3 아키텍처가 필요한 이유 | "도구 호출=포트, 경계가 blast radius 제한" | SWA Port/Boundary APPLY | APPLY | KEEP | 재사용이 canon 방향과 정확히 일치 | — | — | — | — |
| agentic | S6–S10 파이프라인 설계·HITL 게이트·자율 폭 조절 | 단계 경계=포트, 위험·비가역성 기준 승인 지점, 신뢰도별 자율 폭 | Stage Contract, HITL, Autonomy Boundary (OWNER) | OWNER | **KEEP**, 라벨 REFINE | 내용은 강하다 — "Stage Contract"라는 정식 용어만 도입하면 canon 어휘와 완전히 정렬됨 | 용어만 추가 | — | 낮음 | MEDIUM(기회) |
| agentic | S11 실패·롤백 | "단계 실패 시 격리·되돌림(**MSA의 Saga·보상 재사용**)" | terminology.md: Saga ≠ Agent rollback | **위반** | **REFINE** | course-spec §19가 정확히 이 표현("Saga = Agent rollback 표현 금지")을 금지한다. "재사용"을 "유사한 실패/보상 사고 참조"로 완화 | S11 | — | 낮음(문구 교체) | HIGH(명시적 canon 금지 문구 그대로 존재) |
| agentic | S12 관측성 | 로깅·추적·토큰 비용 | AI Observability (OWNER) | OWNER | KEEP | canon과 정합 | — | — | — | — |
| agentic | S13 확률적 산출 통제 | 환각·drift 잡기 | Evaluation(Deterministic/Probabilistic) | OWNER(형식 약함) | REFINE | 방향은 맞으나 course-spec §17 deterministic/probabilistic 이분법 어휘가 명시적으로 없다 | S13 | — | ai-assisted S13과 통합 여지 | MEDIUM |
| ai-assisted+agentic | (부재) Human–AI R&R 위험기반 위임 결정 트리 | 양쪽 다 원칙만 서술, 형식화된 질문 목록 없음 | course-spec §8 (irreversible?/regulated?/external side effect?/...) | OWNER(형식 약함) | ADD | canon Core Flow의 2번째 단계(Responsibility Allocation)가 명시적 결정 트리로 존재하지 않는다 | ai-assisted S1 또는 agentic S1 | — | — | MEDIUM |

**A. ai-assisted에서 KEEP**: 명세로서의 지시("암묵지→명시 지시" 프레임), 출력 리뷰·게이트 통제(결정론적 증거 우선 정신과 완전히 부합), 피드백 재지시 루프, "역량은 고정 아님"(capability growth) 관점.
**B. agentic에서 KEEP**: Agent 정의(자율+도구+루프+HITL, LLM call과 명확히 구분), 아키텍처 재사용(포트=도구 호출·blast radius), 단계 경계·인터페이스 설계, HITL 게이트 설계(위험·비가역성 기준), 관측성.
**C. 중복 제거 후보**: 두 과정 모두 "격리 불변식"(앞 4과정을 안다) 서술이 거의 동일 반복 — 통합 시 하나의 canon 서술로 정리 가능. 게이트(ArchUnit·캡슐화 린터) 재사용 언급이 ai-assisted S8과 agentic S9 양쪽에 있음(다른 맥락이라 지금은 문제 아니나 병합 검토 시 정리 후보).
**D. Course Spec 기준 신규 ADD**: Specification Engineering 정식 어휘, Stage Contract 정식 개념, Context Engineering 5차원(Task/Knowledge/Tool/State/Domain-Policy) 명시적 분류, Guardrail≠Harness 용어 분리, Human–AI R&R 위험기반 결정 트리, Tool Contract/permission 개념, Ontology-as-optional-context 명시(현재 양쪽 다 Ontology 언급 자체가 없음 — course-spec §21 "선택지" 서술 필요).

---

# Modern QM Audit

**Canonical spine 대조**: `Quality Risk → Prevention → Verification → Evidence → Gate → Feedback → System Improvement`. 16세션 대부분(S01–S06, S08, S13, S16)은 이 spine과 잘 맞는다. 문제는 **S07/S10/S11/S12/S14/S15에 집중된 ownership 침범과 최신성 오류**이며, 이는 이번에 `QM_커리큘럼.md` 원문을 직접 읽어 전부 재확인했다(18번 문서의 판정과 독립적으로 일치).

| Course | Session/Topic | Current Intent | Canon Owner | Relation | Decision | Reason | Target | Dependency | Impact | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| QM | S07 요구사항과 품질 계획 | "(1) Context Engineering — 도메인 맥락 단절을 메우는 설계... (2) Rich Domain Model + Ontology... 유비쿼터스 언어를 온톨로지로 승격" | Context Engineering/Rich Domain Model/UL/Ontology = QM이 재정의 금지(concept-ownership-map §15, cross-course-framework §9) | **정면 위반(OWNER)** | **REMOVE** | QM이 세 과정(DDD·AI-Native)의 OWNER 개념을 직접 "해결책"으로 정의한다 — canon이 명시적으로 금지한 정확한 사례. 원문에 "온톨로지는 AI 가드레일의 진실 원천(S14)으로 재사용"까지 있어 S14로도 위반이 전파됨 | S07 전체 재작성 — `Requirement Quality → Shared Vocabulary → Acceptance Criteria/BDD → Explicit Constraint → Traceability → Early Verification` | — | S14/S15 REMOVE와 연동 | **HIGH** |
| QM | S09 테스트 전략 | "단위 70/통합 20/E2E 10의 피라미드로 빠르고 견고한 피드백" | course-spec/원칙 문서: fixed ratio 금지 | 위반 | **REFINE** | 70/20/10을 고정 목표처럼 서술 — "many fast/narrow, fewer broad/slow, context-dependent portfolio"로 대체 | S09 | — | — | MEDIUM |
| QM | S10 지속적 품질 파이프라인 | CI/CD, DevSecOps, Stop the Line, **Blue/Green, Canary, Chaos Engineering**까지 한 세션이 소유 | 미래 DevOps candidate 영역(course-catalog.md §3) | OWNER 과잉 | **REDUCE/FORWARD** | QM OWNER는 `Local/Pre-commit/CI Verification → Quality Gate → Evidence → Fast Feedback`까지만. 배포 전략·카오스 엔지니어링은 향후 DevOps 과정으로 FORWARD | S10 축소, 배포 전략 부분 제거 | 없음(DevOps는 Candidate 상태) | 미래 DevOps 과정 설계 시 재사용 | HIGH |
| QM | S11 DX/아키텍처(Team Topologies) | Conway·역 Conway·Team Topologies·플랫폼 엔지니어링을 QM 해법으로 상세 교육 | 미래 DevOps/SWA 영역 | OWNER 과잉 | **MOVE/FORWARD** | "poor DX increases quality friction" 수준만 QM에 남기고 나머지는 이동. SWA course-spec §6도 "Conway는 driver/constraint로만 forward reference" 허용 | S11 대폭 축소 | — | — | MEDIUM |
| QM | S12 방어적 품질 지표(DORA) | "속도(배포 빈도·변경 리드타임)와 안정성(변경 실패율·MTTR)이 상호 견제하는 **DORA 4대 매트릭스**" | 최신 DORA는 5-metric(Throughput 3종 + Instability 2종) | **최신성 오류** | **REFINE(HIGH — source verification 필요)** | "4대 매트릭스"·"MTTR" 일반화 표현이 최신 DORA 정의와 어긋난다는 것이 이미 canon 조사에서 나온 사실이나, 이번 감사는 **직접 curriculum 원문에서 "4대 매트릭스" 문구를 확인**했다 — Deployment Rework Rate 등 최신 지표 추가 필요. **본 audit은 source를 수정하지 않았다 — 최신 DORA guidance의 1차 출처 재확인이 curriculum 수정 전 필요** | S12 | 1차 출처 검증(§Source/Evidence Risks) | S13(보상 설계)이 이 지표를 전제로 함 | **HIGH** |
| QM | S14 품질의 미래(AI 시대 QA) | "Guardrail Engineering... Harness & Eval... Context Engineering(AI 적용)... 온톨로지는 AI 가드레일의 진실 원천" | Guardrail/Harness/Context Engineering = AI-Native OWNER, QM은 APPLY만 | **정면 위반(OWNER)** | **REMOVE 정의, APPLY만 유지** | 세 개념 모두 정의를 QM이 직접 내리고 있다 — canon이 명시적으로 금지 | S14 재작성 — `AI Risk → Acceptance Criteria → Deterministic Evidence → Probabilistic Evaluation → Risk-based Review → Trace → Feedback`, Ontology는 "선택지" 정도로만 | AI-Native 과정이 이 개념들을 실제로 OWNER 교육해야 QM이 APPLY할 실체가 생김(현재 부분적으로만 존재, §AI-Native Audit) | S15 REFINE과 연동 | **HIGH** |
| QM | S15 QM Operating Model | 5요소 중 "프로세스(**Context Engineering**)". "작업자=...**온톨로지 내재화** / QA=**가드레일·하네스** 활용" | 위와 동일 | 위반(파생) | **REFINE** | S07/S14 REMOVE가 반영되면 S15의 프로세스 축 이름과 역할 서술도 자동으로 수정 필요 — `Prevention/Shift-Left + People&Responsibility + Engineering Process(Review/Test/Evidence/Gate) + Automation + Measurement&Feedback + Continuous Improvement`로 재편(18번 문서 권장 backbone과 동일) | S15 | S07/S14 REFINE | — | MEDIUM |
| QM | S01–S06, S08, S13, S16 | Shift-Left/CoQ, 3주체 R&R, ISO/CMMI/SPICE, 감사, 동료검토, 워크숍1, 보상체계, 워크숍2 | Quality as System Property/Prevention/Evidence/Gate 스핀 전체 | OWNER | **KEEP(+REFINE 경미)** | canon spine과 이미 잘 맞는다 — QM의 강점 구간. S04 "성숙도를 심판이 아니라 진단 거울로" 등은 canon 정신과 정확히 일치 | 경미한 표현 정리만 | — | — | LOW |

**18번 문서와의 관계**: 이번 audit의 QM 판정은 `18_modern-qm-canon-audit.md`(현재 program-design Canon에 반영되지 않은, 배치안만 있는 deferred 문서)의 결론과 사실상 일치한다. 다만 이번엔 그 문서를 인용한 것이 아니라 **`courses/qm/QM_커리큘럼.md` 원문을 직접 읽어 독립적으로 재확인**했다 — S07/S10/S11/S12/S14/S15 문구가 실제로 존재함을 원문 인용으로 검증했다.

---

# swqm Legacy Assessment (read-only, 정식 audit 대상 아님)

| 항목 | 관찰 |
|---|---|
| 목적 | "자기 조직의 품질 활동을 QA/QC·검토·테스트 축으로 진단하고, 2주 내 착수할 개선 하나를 근거와 함께 고른다" — **진단·워크숍 중심**, `courses/qm/`의 "품질 파이프라인 구축"(시스템 설계 중심)과 강조점이 다르다 |
| 세션 수 | 11세션(2일·16시간·740분) — `courses/qm/`은 16세션(800분) |
| 구조 | "다섯 영역"(이해당사자/조직전략/품질계획/품질관리활동/자동화)을 **병렬**로 구성 — `courses/qm/`의 A1 개념소유매트릭스(세션당 원리 소유 1개, Day1/Day2 선형 전개)와 근본적으로 다른 설계 철학 |
| qm과의 관계 | 인용 자산 일부 겹침(`Q-DEMING-94-6`·`Q-DEMING-BADSYS`·`Q-CROSBY-FREE` 등 공유) — 같은 소스 풀을 쓰지만, 용어 규칙(검증/확인/보증의 V&V&Assurance 구분, "수준"·"성숙도"를 상태로 쓰는 규칙)과 문체 규칙(44자 sub 상한, 물음표 금지 등)이 `courses/qm/`과 별도로 자체 정의돼 있다 — 파생·부분집합이 아니라 **독립적으로 저작된 평행 커리큘럼** |
| 중복 정도 | 주제 영역(품질관리 전반)은 크게 겹치나, 서사 구조·세션 분할·전개 순서·심지어 용어 규칙까지 독립적이다. 한쪽이 다른 쪽의 개정판이라는 근거를 찾지 못했다 |
| **후보 상태** | **ALTERNATIVE** — 같은 주제를 다른 교육적 아키텍처로 다루는 평행 초안으로 판단한다. LEGACY(단순 구버전)라기엔 구조·용어가 너무 독립적이고, UNKNOWN이라기엔 목적·대상·주제가 명확하다. **단, 이 판단은 제안일 뿐이며 실제 결정(폐기/병행 유지/qm으로 흡수)은 사용자 확인이 필요하다** — Modern QM Canon(18번 문서)이 아직 적용되지 않은 상태라 두 파일 중 어느 쪽을 canon 정렬 대상으로 삼을지도 함께 결정해야 한다 |

수정·삭제·rename·merge는 하지 않았다.

---

# Source / Evidence Risks

Global/Korea 정책(§10) 기준 문제 위치만 기록한다. **source는 수정하지 않았다.**

| 위치 | 문제 유형 | 상세 |
|---|---|---|
| QM S12 "DORA 4대 매트릭스" | **최신성 위험(HIGH)** | 현재 curriculum이 옛 4-metric 모델을 사용 — canon(18번 문서)이 이미 2026년 5-metric guidance로의 정정을 요구했다. 1차 출처(DORA 공식 가이드) 재검증 필요, 이번 audit에서는 수정하지 않았다 |
| QM 전반(Deming/Goldratt/Conway/Crosby 인용) | 낮은 위험 | 전부 Global Primary/Widely-Cited로 이미 잘 분류돼 있다(`A3. 인용 자산` 절이 등급·출처·URL을 갖춘 좋은 사례) — 특별한 문제 없음 |
| QM "SI 감리 제도" 배제 서술(용어 규칙) | 없음(양호) | 오히려 canon 정신("한국 특정 관행을 정설처럼 포장하지 않는다")을 이미 스스로 지키고 있다 — 좋은 선례로 기록 |
| QM S11 Team Topologies/inverse Conway | 중간 위험 | 특정 조직 이론을 Global BP처럼 서술하나 [Global BP] 태그가 없다 — REFINE 시 명시적 분류 필요(다만 §Modern QM Audit에서 이미 MOVE/FORWARD 대상으로 판정됐으므로 QM에는 남지 않을 가능성이 큼) |
| QM S13 보상 재설계(Collective Ownership 등) | 낮은-중간 위험 | 일반 관리 이론이나 한국 조직 문화 특수성과 충돌 가능성이 있는 영역 — Korea WP/Local Context 분류가 없다. 수정 시 명시적 라벨 필요 |
| ooad/ddd/sw-architecture/msa/ai-assisted/agentic 전체 | 낮은 위험 | vendor marketing, 출처 없는 한국 일반화, 한글 2차 자료 우선 사용 사례를 찾지 못했다 — 이미 Larman/Evans/Meyer/GoF/Parnas/Fowler 등 Global 1차 계보 중심으로 저작돼 있다 |

---

# Cross-Course MOVE Map

```text
OOAD S11 "Repository(영속성 은닉)" 패턴 예시
    ──REMOVE/MOVE──→ DDD Repository OWNER (DDD가 먼저 이 개념을 가져야 함)

MSA S02 "DDD 전략: BC·Context Mapping" 전체 교육
    ──REDUCE──→ DDD Bounded Context/Context Mapping OWNER (DDD가 먼저 이 개념을 가져야 함)
    MSA에는 RECAP + service-boundary input만 남는다

QM S10 CI/CD·Blue/Green·Canary·Chaos Engineering
    ──FORWARD──→ 미래 DevOps Candidate (course-catalog.md §3)
    QM에는 Local/Pre-commit/CI Verification→Gate→Evidence→Feedback만 남는다

QM S11 Team Topologies·Platform Engineering·inverse Conway
    ──MOVE/FORWARD──→ 미래 DevOps Candidate (일부는 SWA Architecture Driver로 forward-ref만)

QM S07 Rich Domain Model/UL/Ontology as solution
    ──REMOVE──→ (DDD/AI-Native가 실제 OWNER 교육을 갖춘 뒤) upstream engineering asset으로 참조만

QM S14 Guardrail/Harness/Context Engineering(AI 적용) 정의
    ──REMOVE 정의, APPLY만──→ AI-Native OWNER (ai-assisted/agentic가 먼저 형식화해야 함)
```

---

# Missing Concepts

Canon에는 있으나 6개 감사 대상 curriculum 어디에도 등장하지 않는 개념군:

| 개념군 | 소속 과정 | 현재 상태 |
|---|---|---|
| Design by Contract / Precondition / Postcondition / Object Invariant | OOAD | 완전 부재 |
| Domain Model / Model-Driven Design(정본 정의) / Entity / Value Object(정본 정의) | DDD | 완전 부재(워크숍에서 암묵적으로만 다룸) |
| Domain Invariant(정본 용어) / Domain Service / Repository(DDD 의미) / Domain Event | DDD | 완전 부재 |
| Explicit Semantics / Domain Model≠Ontology bridge | DDD | 완전 부재 |
| Architecture Driver / Quality Attribute Scenario | SWA | 완전 부재 |
| Architecture Decision(ADR)/Trade-off 명시적 기록 | SWA | 완전 부재 |
| Architecture Evaluation(ATAM/QAW 수준) | SWA | 완전 부재 |
| Architecture Fitness Function(용어) / Evolutionary Architecture | SWA | 부재(단, S12 게이트가 사실상의 예시를 이미 갖고 있음 — 라벨링만 필요) |
| API/Event/Schema Contract + Compatibility/Contract Evolution | MSA | 완전 부재 |
| Idempotency(독립 취급) | MSA | 사실상 부재 |
| Resilience(Timeout/Retry/Isolation/Fallback) | MSA | 완전 부재 |
| Distributed Observability | MSA | 완전 부재 |
| Specification Engineering(정식 어휘) | AI-Native | 비형식적으로만 존재 |
| Stage Contract(정식 개념) | AI-Native | 비형식적으로만 존재(agentic 실질 내용은 있음, 용어만 부재) |
| Context Engineering 5차원(Task/Knowledge/Tool/State/Domain-Policy) | AI-Native | 부재(Context=Prompt로 축소돼 있음) |
| Guardrail ≠ Harness(명시적 분리) | AI-Native | 부재(한 단어로 겸용) |
| Ontology as optional context | AI-Native | 완전 부재(언급 자체가 없음) |

---

# Recommended Revision Order

기본 authoring dependency(six-course-architecture-completion-review.md §4)를 그대로 따른다 — 이번 audit 결과가 이 순서를 뒤집을 근거를 만들지 않았다. 다만 아래 항목은 순서 안에서 **선행돼야 하는 이유**를 명시한다.

```text
1. OOAD   — Design by Contract ADD가 최우선. 이게 없으면 2~5의 Contract Lineage가 전부 헛돈다.
2. DDD    — 전술/전략 OWNER 전체 ADD. OOAD의 DbC가 Minimum Recap으로 들어와야 자연스럽다.
            (MSA S02 REDUCE는 DDD가 이 내용을 가진 *뒤에*만 의미가 있다 — 순서 필수)
3. SW Architecture — Driver/QA/ADR/Evaluation/Fitness ADD. OOAD/DDD와 독립적으로 착수 가능
            (병렬화 가능성 있음, 아래 참고).
4. MSA    — S02 REDUCE(2 선행 필요) + Contract/Idempotency/Resilience/Observability ADD.
5. AI-Native(ai-assisted+agentic) — OOAD DbC(1)가 있어야 Stage Contract EXTEND가 자연스럽다.
6. Modern QM — REMOVE 위주(자기완결적)라 실은 언제 손대도 되지만, canon이 명시한 순서를 따른다.
```

**병렬화 관찰(제안, 강제 아님)**: SW Architecture(3)의 ADD는 OOAD/DDD 콘텐츠에 직접 의존하지 않는다 — Driver/QA/ADR/Evaluation/Fitness는 SWA 자체 완결적 확장이다. 원한다면 1과 병렬 착수 가능하다. Modern QM(6)의 REMOVE 작업도 자기완결적(DDD/AI-Native의 실제 OWNER 콘텐츠가 아직 없어도 "정의를 지우고 APPLY로 낮추는" 일 자체는 가능)이라 순서 마지막에 묶여 있을 필요가 약하다 — 다만 canon이 "authoring dependency"로 명시했으므로 이 audit은 순서를 뒤집어 제안하지 않는다.

---

# Blocking Decisions

사용자 결정이 필요한 항목만 모았다. 자동 판단하지 않았다.

1. **DDD 과정 시간 확장 여부** — 전술+전략 OWNER 전체(Entity/VO/Domain Invariant/Aggregate/Domain Service/Repository/Domain Event/UL/Domain Model)를 현재 8교시(1일)에 넣을 수 없다. course-spec §16이 제시한 8–12세션 backbone은 이미 12세션을 권장한다. 1일 유지(깊이 축소) vs 1.5~2일 확장 중 결정 필요. six-course-architecture-completion-review.md는 이를 "Non-Blocking"으로 분류했으나, 이번 audit은 공백이 전면적임을 확인해 **Blocking으로 재상신**한다.
2. **SW Architecture 세션 재배분** — 신규 Driver/QA/ADR/Evaluation/Fitness(4개 이상 세션 분량)를 넣으려면 기존 토대(S2–S6, 6세션)를 압축해야 한다. 압축 폭 결정 필요.
3. **MSA 1일 vs 2일** — Contract/Idempotency/Resilience/Observability ADD가 4개 항목인데 현재 8교시에 여유가 거의 없다(경계 긋기 3+추출분산 3+왜·언제 1+종합 1). course-spec §16의 기존 open decision이 이번 audit으로 더 구체화됐다.
4. **`courses/qm` vs `courses/swqm` 관계** — Modern QM curriculum 개정(18번 문서 반영)에 착수하기 전에 swqm을 폐기/병행 유지/qm으로 흡수 중 무엇으로 할지 결정 필요. 이번 audit은 ALTERNATIVE 후보만 제안했다.
5. **Quote schema(grade vs status) 미해결** — OOAD verified quotes pack(12번 문서, deferred)을 실제로 반영하려면 schema 결정이 curriculum 개정보다 먼저 필요할 수 있다(OOAD DbC 세션에 Meyer quote를 넣으려면 이 자산이 필요하다).
6. **AI-Native 콘텐츠의 물리적 파일 배정** — Specification Engineering/Stage Contract/Context Engineering 5차원/Guardrail≠Harness ADD 항목들을 `courses/ai-assisted/`와 `courses/agentic/` 중 어느 파일에 넣을지(혹은 어떻게 나눌지) 병합 없이 결정해야 한다 — 두 물리 디렉터리가 유지되는 한 이 배정은 curriculum 개정 착수 전에 명시적으로 정해야 한다.
