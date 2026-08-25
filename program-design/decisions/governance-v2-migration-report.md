# Governance v2 Migration Report — Phase 1

> 이 문서는 정본이 아니다. Phase 1(5개 Governance 문서 편입) 작업 기록과, Phase 2(Curriculum Migration)의 input이 되는 충돌 목록이다.
> **Phase 1.5(§8) 추가**: C-1(참조 무결성 파손)을 조사해 최소 이관·참조 수정으로 해소했다.

---

## 1. Files Added / Replaced

**Added (신규)**
- `program-design/reference-frame.md` ← `01_reference-frame-v2.0.md` (원문 그대로, `diff` 확인)
- `program-design/principles.md` ← `02_principles-v2.0.md` (원문 그대로)
- `program-design/terminology.md` ← `03_terminology-v2.0.md` (원문 그대로)
- `program-design/decisions/governance-v2-review.md` ← `00_v2-critical-review.md` (원문 그대로)
- `program-design/README.md` (신규 — 기존에 program-design 안내 문서 없었음, 최소 index로 작성)

**Replaced (교체)**
- `program-design/concept-ownership-map.md` ← `04_concept-ownership-map-v2.0.md` (원문 그대로). 기존 내용은 Git history로 보존. **단 §3 참조 — 이 교체가 canon-stance.md·authoring-convention.md의 인용 앵커를 끊는다.**

**Modified (본문 불변, 안내문만 추가)**
- `program-design/canon-stance.md` — 상단에 2줄 안내("이 문서는 reference-frame.md를 상위 정본으로 따른다")만 추가. 본문(자산 블록·자세 선언)은 한 글자도 바꾸지 않았다.

---

## 2. Existing Files Preserved (의도적으로 수정하지 않음)

- `program-design/authoring-convention.md` — KEEP, 무수정
- `program-design/order-domain-definition.md` — KEEP, 무수정
- `program-design/clean-layer-convention.md` — KEEP, 무수정
- `program-design/sw-lab-environment-setup.md` — KEEP, 무수정
- `program-design/open-issues.md` — 무수정. 이미 세션 시작 전부터 uncommitted 변경이 있었고(OI-8 관련), 새 Governance로 해결되는 open issue는 없었다(OI-2/5/6/7/8 전부 엔진·렌더 메커니즘 결함이며 개념 소유·용어 문제가 아님).
- `courses/**` 전체 — 무수정 (session 시작 전 uncommitted 상태였던 `courses/ooad/decks/01.js`, `courses/ooad/ooad-curriculum.md` 포함, 손대지 않음)
- `engine/**`, `test/**` — 무수정
- 루트 `README.md` — 무수정. program-design을 안내하는 기존 index 역할을 하지 않았으므로(엔진 파이프라인 설명 문서), 이번 Phase에서는 새로 연결하지 않았다. §6 Open Decisions 참조.
- `guides/커리큘럼_작성_지침.md` — 무수정 (session 시작 전 uncommitted 변경 있었음, 손대지 않음)

---

## 3. Governance Conflicts Found

### C-1. `concept-ownership-map.md` 교체가 인용 앵커를 끊는다 — **HIGH → RESOLVED (§8 참조)**
- **File**: `program-design/canon-stance.md` (SRC 필드), `program-design/authoring-convention.md` §3-c
- **Location**: `canon-stance.md`의 `proposition.governing`·`stance.*` 블록 4곳이 `SRC: concept-ownership-map.md §프로그램 명제` / `§프로그램 자세`로 앵커. `authoring-convention.md` §3-c는 "concept-ownership-map.md §R&R 미러"라고 명시.
- **Current statement**: 옛 `concept-ownership-map.md`에는 프로그램 명제(LLM 우발/본질 복잡도), 프로그램 자세(조건부 필요악·Just Enough·예방상환), LLM 트랙 격리 불변식, R&R(3자 역할·경계원칙), pptx 산출물 관리 책임, DDD 전술 경계, OOD↔아키텍처 이음매, 요구공학 분할, 선수 체인, 교과 계보·서술 원칙, 공유 자산 — 총 11개 절이 있었다.
- **New canonical rule**: v2 `concept-ownership-map.md`는 순수 5과정 Concept Ownership 표(OWNER/RECAP/APPLY/EXTEND/FORWARD/BRIDGE)만 담는다. 위 11개 절 중 어느 것도 새 파일에 없다.
- **Severity**: HIGH — 지시서 §4의 "새 파일에 반드시 유지해야 하는 정보가 누락됐다고 판단되면 자동 병합하지 말고 보고" 조건에 정확히 해당한다. 자동 병합하지 않았다. 옛 내용은 Git history(`git show <이전 커밋>:program-design/concept-ownership-map.md`)로 복구 가능하다.
- **Recommended next action**: ~~프로그램 명제·자세·R&R·pptx 정책·LLM 격리 불변식의 새 정본 위치를 결정한다.~~ → **§8에서 해소.** 요약: 프로그램 명제·자세는 이미 `canon-stance.md`가 완전한 원문(TEXT/SHORT 포함, 옛 map보다 상위 호환)을 갖고 있었으므로 SRC 필드만 정정. LLM 트랙 격리 불변식은 `concept-ownership-map.md` §14로 이관(유일하게 실제 콘텐츠 이관이 필요했던 항목). R&R·pptx 관리는 `authoring-convention.md`가 이미 완전한 사본을 갖고 있어(원래 "미러"였음) 그 절을 정본으로 승격하고 자기 서술만 정정 — 4정본으로는 옮기지 않았다(사람 R&R은 개념 소유 정본의 주제가 아니라는 판단, §8-3 참조).

### C-2. DDD 전술/전략 개념 소유 충돌 — **HIGH**
- **File**: 옛 `program-design/concept-ownership-map.md` (Git history), `courses/ooad/ooad-curriculum.md`, `courses/msa/curriculum.md`
- **Current statement**: "DDD 전술(Entity·VO·Aggregate·Domain Service·Repository·Factory·Domain Event) | 소유: **OOAD**" / "DDD 전략(Bounded Context·Context Mapping) | 소유: **MSA**" (DDD는 두 경우 모두 "모델링 실습"만 담당)
- **New canonical rule**: `concept-ownership-map.md` §4 — Entity/VO/Aggregate/Invariant/Domain Service/Repository/Domain Event/Bounded Context/Context Mapping 전부 **DDD OWNER**. OOAD는 FORWARD만, MSA는 APPLY만.
- **Severity**: HIGH — 지시서 예시("기존: Entity/Aggregate OWNER = OOAD, 신규: OWNER = DDD")와 정확히 일치하는 실제 충돌.
- **Recommended next action**: Phase 2 Curriculum Migration에서 `courses/ooad/ooad-curriculum.md`(S14 DDD·MSA 진화 절), `courses/ddd/curriculum.md`, `courses/msa/curriculum.md`(S02 DDD 전략)의 소유권 서술을 재정렬. 이번 Phase에서는 수정하지 않았다.

### C-3. Prerequisite 표현 — **MEDIUM**
- **File**: 옛 `concept-ownership-map.md`("선수 체인": "OOAD → SW 아키텍처(OOAD 강제 선수) → MSA(아키텍처 선수)"), `courses/sw-architecture/curriculum.md:5-6`("OOAD 선수 권장" / "MSA 과정의 선수"), `courses/msa/curriculum.md:5`("SW 아키텍처 선수"), `courses/ddd/curriculum.md:5`("전제: OOAD")
- **New canonical rule**: `reference-frame.md` §10 / `principles.md` P42 — "Prerequisite recommended, never assumed."
- **Severity**: MEDIUM — 옛 문서의 "강제 선수"는 명백한 하드 게이트 표현. 각 커리큘럼의 "선수"는 대체로 권장 톤이지만 한정어 없이 쓰여 강제로 읽힐 여지가 있다.
- **Recommended next action**: Phase 2에서 "선수"→"권장 선수" 등 표현 정리 여부 결정. 구조 변경(재정박 콘텐츠 추가) 필요 여부도 함께 판단.

### C-4. 6과정 flat 구조 vs 5과정 Core/Specialized 구조 — **MEDIUM**
- **File**: `program-design/authoring-convention.md` 헤더("OOAD·SW 아키텍처·DDD·MSA·AI-assisted·Agentic 여섯 과정"), `program-design/open-issues.md` 전역("6과정 공통"), `courses/ooad/ooad-curriculum.md:229`("6과정 지도에서 OOAD 자리")
- **New canonical rule**: `reference-frame.md` §2 — 5과정(Core: OOAD·DDD·AI-Native / Specialized: SWA·MSA), ai-assisted+agentic는 향후 AI-Native로 병합.
- **Severity**: MEDIUM — 지시서 §7·9·14가 이번 Phase에서 병합·rename을 명시적으로 금지. 구조 자체는 바꾸지 않았고, "6과정"이라는 표현이 여러 문서에 남아있다는 사실만 기록한다.
- **Recommended next action**: Phase 2(AI-Native 커리큘럼 확정 후)까지 보류.

### C-5. Context/Guardrail/Harness 개념 혼용 — **MEDIUM**
- **File**: `courses/ai-assisted/curriculum.md:31` — "컨텍스트·제약 설계"를 "프롬프트 컨텍스트"로 서술, "하네스(제약만, 해법은 열기)" 한 용어로 guardrail 역할까지 겸용. 6개 파일 전체 grep 결과 "가드레일" 단어 자체가 한 번도 등장하지 않는다.
- **New canonical rule**: `terminology.md` §G·H — Context ≠ Prompt (Context는 Task/Knowledge/Tool/State/Domain-Policy를 포괄), Guardrail ≠ Harness (통제 규칙 vs 실행/통제 구조).
- **Severity**: MEDIUM.
- **Recommended next action**: AI-Native Curriculum Migration 후보로 기록.

### C-6. Saga = Agent rollback "재사용" 서술 — **LOW/MEDIUM**
- **File**: `courses/agentic/curriculum.md:4,49,63,67` — "MSA의 Saga·보상 **재사용**"
- **New canonical rule**: `terminology.md` §H(Saga ≠ Agent rollback), `reference-frame.md` §7 — "MSA의 Saga를 Agent rollback과 동일시하지 않고 실패·보상 사고의 유사성 수준에서만 참조한다."
- **Severity**: LOW/MEDIUM — 완전히 틀린 서술은 아니나 "재사용"이라는 표현이 신규 정본의 "유사성 참조" 수준보다 강하다.
- **Recommended next action**: 표현 완화 후보. Phase 2.

### C-7. SWA/MSA Coverage Gap — **정보성, 충돌 아님**
- SWA: Architecture Driver/Quality Attribute/Trade-off/Architecture Decision/Evaluation — `courses/sw-architecture/curriculum.md`에 전부 부재. Fitness/Enforcement만 존재(ArchUnit 게이트).
- MSA: Idempotency/Resilience/Operational Complexity 부재, Failure/Observability는 약함(스치는 언급 수준).
- 이 둘은 새 정본과의 "충돌"이 아니라 — `reference-frame.md` §5·§6이 스스로 "Current Curriculum Gap to Close"로 이미 인정한 항목이다. Phase 2 Curriculum Migration의 확인 입력으로만 기록한다.

---

## 4. Curriculum Migration Candidates (Phase 2 input)

| 과정 | 주요 후속 작업 후보 |
|---|---|
| OOAD | DDD 전술 소유권 이관(C-2) 반영 — S14 "DDD·MSA 진화" 절을 FORWARD-view로 재구성. "6과정 지도" 표현(C-4) 정리 |
| DDD | 전술+전략 OWNER 전체 회수(C-2) — 현재 "모델링 실습"만 있는 구조를 tactical+strategic 정본 교육으로 확장 |
| SW Architecture | Architecture Driver / Quality Attribute Scenario / Trade-off / Decision / Evaluation 보강(C-7) — 기존 Spaghetti→TS→Rich→DIP 실습은 KEEP |
| MSA | Idempotency / Resilience / Observability / Operational Complexity 보강(C-7), S02 DDD 전략 절을 OWNER→RECAP+input으로 축소(C-2) |
| AI-assisted / Agentic → AI-Native | Context≠Prompt, Guardrail≠Harness 용어 분리(C-5), Saga="재사용"→"유사성 참조" 완화(C-6), Specification→Context→Guardrail→Harness→Agent→Agentic Workflow→Evaluation 흐름으로 재편성. `ai-assisted`+`agentic` 병합은 이번 Phase 금지 — 병합 자체가 다음 Phase 대상 |

---

## 5. Technical Impact

- `engine/`, `renderer(render/)`, `test/`, `scripts` — 무수정.
- import/path 의존성 깨짐 없음. 새 문서는 순수 markdown이며 어떤 코드도 `program-design/*.md`를 참조하지 않는다(엔진은 `courses/<과정>/*.md`만 읽는다).
- Renderer에 `if (course === ...)` 류 domain-aware 분기 추가하지 않았다.

---

## 6. Open Decisions (자동 판단하지 않음)

1. ~~**C-1의 후속 위치**~~ — **해소됨(§8).** 남은 판단거리: `authoring-convention.md`의 R&R(§3-c)·pptx 관리(§3-b)를 앞으로도 "정본"으로 이 문서에 둘지, 아니면 언젠가 별도 운영 문서로 분리할지는 열려 있다(현재는 저작 규약 문서라는 성격상 그대로 두는 것이 맞다고 판단).
2. **authoring-convention.md §2 문서지도 갱신 여부** — 새 4개 정본(+decisions/)을 지도에 추가할지. 이번 Phase에서는 "authoring-convention.md 본문 무수정" 원칙에 따라 건드리지 않았다.
3. **루트 README.md 연결 여부** — program-design/README.md를 루트에서 링크할지. 루트 README가 지금까지 program-design을 안내한 적이 없어 이번엔 연결하지 않았다.
4. **QM·SWQM의 Governance 범위 포함 여부** — `courses/qm`, `courses/swqm`은 옛 6과정 프레임과 새 5과정 프레임 어디에도 속하지 않는다(옛 정본도 "QM/SWQM은 6과정 작업과 무관하게 계속 굴러가는 실제 산출물"이라고 명시). 의도적 배제로 보이지만 명시적 확인이 없어 열어둔다.
5. **decisions/ 위치** — 저장소에 기존 ADR/decision-record 컨벤션이 없어(검색 결과 없음) 지시서의 `program-design/decisions/`를 그대로 사용했다.
6. **C-2~C-6 전체** — Phase 2 Curriculum Migration의 확정 input으로만 기록, 이번 Phase에서 수정하지 않았다.
7. **"교과 계보·서술 원칙"·"요구공학 분할" 절의 최종 거처(§8-2)** — 옛 map에만 있던 두 절은 상충하지 않고 여전히 유효해 보이지만, 4정본의 선언된 범위(5과정 개념 소유)를 벗어나 이번엔 옮기지 않았다. "교과 계보·서술 원칙"은 성격상 `authoring-convention.md`(저작 규약)가 맞는 후보, "요구공학 분할"은 QM 과정을 지목해 Open Decision #4(QM 범위)가 먼저 풀려야 한다. 둘 다 Git history에 원문이 남아있다.

---

## 7. Test / Regression

`npm test` (corpus + snapshot):
- **PASS**: corpus 47/47 탐지 통과, exit code 0.
- **SNAPSHOT DIFFERENCE (pre-existing, unrelated)**: `[변화 1] 골든과 다르다: + 덱 추가: ooad/01.js`. 이는 세션 시작 **이전부터** uncommitted 상태였던 `courses/ooad/decks/01.js` 때문이며, 이번 Governance 편입 작업과 무관하다. 골든 스냅샷은 자동 갱신하지 않았다.
- Governance 문서 추가로 인한 FAIL은 없었다.
- **§8 참조 무결성 정리 후 재검증**: `npm test` 재실행 결과 동일(corpus 47/47, exit 0, 동일한 pre-existing snapshot diff 1건). 문서 전용 변경이라 기술적 영향 없음을 재확인했다.

---

## 8. Reference Integrity Remediation (Phase 1.5)

C-1에서 플래그한 인용 앵커 파손을 조사하고 해소했다. `curriculum/course/source/renderer/test`는 건드리지 않았다 — 전부 `program-design/` 내부 markdown 수정이다.

### 8-1. 조사 범위와 방법

`concept-ownership-map.md`(구 버전, `git show HEAD:...`로 복원)를 참조하는 모든 곳을 `grep -rn "concept-ownership-map" program-design/*.md`로 전수 조사했다.

- **canon-stance.md**: `SRC: concept-ownership-map.md §프로그램 명제` 1곳, `§프로그램 자세 · {조건부 필요악·Just Enough·예방상환구분}` 3곳, 본문 프로즈 1곳 — 총 5곳.
- **authoring-convention.md**: §2 표(여전히 유효, 무수정), §2 문서지도(여전히 유효, 무수정), §2 "LLM 트랙 격리 불변식" 패턴 언급 1곳, §3-b pptx 괄호주 1곳, §3-c "§R&R의 미러다" 1곳, §4 "전 과정 공통 선언" 출처 언급 1곳, §5 로드맵 "LLM 트랙 격리 불변식" 언급 1곳(내용 이관 후 자동 해결).
- **open-issues.md**: 조사 결과 `concept-ownership-map`에 대한 참조가 **없었다**. 수정 대상 아님.
- **README.md·governance-v2-migration-report.md**: 이번 Phase 1에서 내가 만든 신규 문서이므로 "기존 문서의 깨진 참조" 범주에 해당하지 않는다. README.md는 이미 새 `concept-ownership-map.md`를 가리키고 있어 문제없음.

### 8-2. 옛 절 11개의 처리 방침 — 이관 vs 비이관

옛 `concept-ownership-map.md`에는 11개 절이 있었다(§1 참조). 각각을 "다른 문서가 참조하는가" · "새 v2 정본과 상충하는가" · "4정본 중 주제가 맞는 곳이 있는가" 세 기준으로 판정했다.

| 절 | 판정 | 처리 |
|---|---|---|
| 프로그램 명제 | 참조됨(canon-stance.md) | **이관 불필요** — canon-stance.md가 이미 TEXT/SHORT/REBUTTAL/HORIZON을 포함한 상위 호환 원문을 보유. SRC만 정정 |
| 프로그램 자세 (3항목) | 참조됨(canon-stance.md) | **이관 불필요** — 위와 동일 |
| LLM 트랙 격리 불변식 | 참조됨(authoring-convention.md §2·§3-a·§5) | **이관함** → `concept-ownership-map.md` §14. 새 v2 5과정 구조와 상충하지 않고(방향성 규칙), 주제가 정확히 이 문서에 맞는다 |
| R&R(3자 역할과 경계원칙) | 참조됨(authoring-convention.md §3-c, 이미 전문 미러 보유) | **4정본으로 이관 안 함** — authoring-convention.md §3-c가 이미 완전한 사본을 갖고 있어 그 절을 정본으로 승격. 사람 R&R(누가 저작하는가)은 4정본의 주제(개념 소유·원칙·용어·5과정 구조)와 다르다 — 억지로 옮기면 `concept-ownership-map.md`의 성격이 흐려진다 |
| R&R — pptx 산출물 관리 책임 | 참조됨(authoring-convention.md §3-b, 이미 전문 보유) | **4정본으로 이관 안 함** — 위와 같은 이유. §3-b 괄호주만 정정 |
| DDD 전술 경계(겹침 주의) | 미참조 | **이관 안 함(의도적 폐기)** — "DDD 전술=OOAD 소유"라는 옛 판정 자체가 C-2로 이미 플래그한 충돌이다. 새 정본(DDD가 Entity/VO/Aggregate/Domain Service/Repository/Domain Event OWNER)과 정면 충돌하므로 앞으로 이관하면 SSOT를 오염시킨다. 유일하게 여전히 유효한 하위 항목("Domain Service ≠ Application Service")은 `terminology.md` §H pair table에 이미 존재 — 중복 불필요 |
| OOD ↔ 아키텍처 이음매 | 미참조 | **이관 안 함** — "DIP→Dependency Rule" 부분은 이미 `reference-frame.md` §3(Bridges Forward)·`terminology.md`(DIP≠DI pair)에 있어 중복이고, "Repository 부분"은 C-2와 같은 이유로 충돌(신규는 Repository=DDD OWNER) |
| 요구공학 분할 | 미참조 | **이관 안 함** — QM 과정을 지목하는데 QM은 새 5과정 Governance 범위 밖(Open Decision #4). 내용 자체는 여전히 유효해 보이지만 4정본의 선언된 범위(5과정)를 벗어나 억지로 넣지 않았다. Git history 보존 |
| 선수 체인 | 미참조 | **이관 안 함(의도적 폐기)** — "OOAD 강제 선수"가 C-3로 플래그한 충돌 그 자체("Prerequisite recommended, never assumed"와 정면 충돌). 이관하면 신규 원칙을 스스로 어기게 된다 |
| 교과 계보·서술 원칙 | 미참조 | **이관 안 함, 미해결로 보류** — Larman→Evans 계보, 탈신비화 서술 톤, 설명=NewPOS/실습=Order 관행 등은 상충하지 않고 여전히 유효해 보이나, 성격상 "무엇을 가르칠지"가 아니라 "어떻게 저작할지"에 가깝다. R&R과 같은 논리면 `authoring-convention.md`가 맞는 자리이지만, 이번 Phase는 "최소 이관"이 목표라 판단을 보류했다 — Open Decision #7 |
| 공유 자산 | 미참조 | **이관 안 함** — Order 도메인 귀속·Cohesion/Coupling 소유 등은 이미 `order-domain-definition.md`(KEEP)와 새 `concept-ownership-map.md` Coverage Matrix가 각각 정본으로 다룬다. 중복 |

### 8-3. 실제 수정한 파일과 위치

- `program-design/concept-ownership-map.md` — **§14 "LLM 트랙 격리 불변식" 신설**(유일한 실질 콘텐츠 이관). 원문 표현을 거의 그대로 보존, migration note로 출처 명시.
- `program-design/canon-stance.md` — SRC 필드 4곳 + 본문 프로즈 1곳 정정. **TEXT/SHORT/REBUTTAL/HORIZON 등 인용 원문은 한 글자도 바꾸지 않았다** — 메타데이터(출처 표기)만 고쳤다.
- `program-design/authoring-convention.md` — 4곳 정정(§2 "LLM 트랙 격리 불변식" 절 번호 갱신, §3-b pptx 괄호주, §3-c "미러다"→"정본이다" 승격, §4 출처 문서명 canon-stance.md로 교체). §2 문서지도·표, §5 로드맵 항목, 버전 changelog(줄 2)는 여전히 유효하거나 과거 사실 기록이라 무수정.

### 8-4. 중복 정의 여부 확인

새로 추가한 유일한 콘텐츠(§14 LLM 트랙 격리 불변식)는 4정본 어디에도 기존 항목이 없음을 확인했다(`grep -n "격리\|LLM 트랙"` 4정본 결과 없음). 나머지는 전부 "이미 있는 것에 SRC만 재연결" 또는 "의도적으로 옮기지 않음"이라 신규 중복을 만들지 않았다.

### 8-5. Reference Integrity 검증

```
grep -rn "concept-ownership-map.md §" program-design/*.md
→ authoring-convention.md:2 (버전 changelog, 과거 사실 기록이라 의도적으로 보존) 1건만 남음

grep -rn "정본은 그쪽" program-design/*.md
→ 0건 (해소 확인)

grep -n "concept-ownership-map" program-design/open-issues.md
→ 0건 (애초에 참조 없음, 재확인)

grep -n "^## 14" program-design/concept-ownership-map.md
→ 존재 확인
```

남은 1건(changelog 줄)은 "§3-c를 신설할 당시엔 미러였다"는 과거형 사실 진술이라 지금도 참이다 — 커밋 로그를 소급 수정하지 않는 것과 같은 이유로 그대로 뒀다.
