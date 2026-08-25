# OOAD Curriculum Revision Report v1

> 이 문서는 정본이 아니다. `courses/ooad/ooad-curriculum.md`를 v4→v5로 개정한 기록이다.
> 대상: OOAD 하나만. DDD/SWA/MSA/AI-Native/QM curriculum, deck/source/renderer는 이번 turn에서 수정하지 않았다.
> **작업 방식**: 기존 파일(세션 시작 전부터 있던 pre-existing uncommitted 사용자 편집 포함)을 base로 삼아 그 위에 Canon 정렬 편집을 얹었다 — wholesale overwrite가 아니다. `git diff -- courses/ooad/ooad-curriculum.md`(작업 전 스냅샷)를 `/private/tmp/.../pre-ooad-revision-backup/`에 보존했다.

---

## A. Existing Strengths Preserved

- **14세션 전체 구조** — Part 0~4, 세션 번호·순서 불변.
- **Use Case**(S02), **BDD**(S03), **정적/동적 모델링**(S04–S07), **책임 배치 워크숍**(S12), **모듈화**(S08), **SOLID**(S10), **RDD/GRASP**(S11), **Order 공통 도메인**, **TDD/리팩토링**(S13), **다음 과정 forward linkage**(S09, S14) — 전부 유지. 새로 쓴 세션은 없다, 기존 세션에 개정만 했다.
- **`(U)` 미작성 마커** — 모든 (U) 항목을 삭제하지 않았다. 일부는 새 요구사항(계약 작성 등)을 반영해 stub 설명 문구만 확장했지만, 미작성 상태(U) 자체와 원래 취지는 유지했다.
- **세션 시작 전 pre-existing uncommitted 변경**(S01의 C1~C16 재넘버링, C5 "절차적 Order 코드" 예시, C15 "과정 지도" 명제) — 그대로 base로 삼았다. 덮어쓰지 않았다.
- **명제=주장 / 심층 소스 분리 원칙**, **Order R1~R7 규칙 소유 = order-domain-definition.md** — 문서 서문 그대로 유지.

## B. Canon Gaps Fixed

| 항목 | 이전 | 이후 |
|---|---|---|
| Design by Contract | 14세션 전체에 0건 | S11에 정식 추가(Precondition/Postcondition/Object Invariant, Order.cancel() 예시), S12 워크숍에 계약 작성 단계 추가, S13에 Contract→Test Evidence lineage 추가 |
| "rich 전제" 프레이밍 | A0 "★층위: OOA는 rich 전제" | "rich는 분석의 전제가 아니라 책임·협력 설계의 결과" — A0, A0-2, S11 C5 세 곳 동시 수정 |
| "현대 OO=OO+FP 수렴" 핵심 명제화 | S01 C3 [원칙] | [현상]으로 격하, "이 과정은 객체 계보만 본다"로 축소 |
| Object = data+behavior 축소 정의 | S01 C8 | 상태·메시지·책임·캡슐화를 포함하도록 확장, Alan Kay 계보 인용(축자 quote 아님, lineage만) |
| Analysis Model→Design Model 기계적 매핑 인상 | S04 C15 "곧장 매핑" | "판단을 거쳐 다음 단계로" + 새 C16 "비타협: Concept≠Class, Analysis Model≠Design Model, Analysis Model≠Code Skeleton" 명시 |
| DIP≠DI Framework | 미명시 | S10 C6에 명시 추가 |
| TDD categorical 단정 | S13 C4 "TDD는 테스트 기법이 아니라 설계 기법" | "검증 기법이면서 설계 피드백 압력으로 작동할 수 있다"로 완화 |
| BDD "명세=검증, 안 낡음" 절대 표현 | S03 C4 | "이어질 수 있다"로 완화 |
| Just Enough Modeling 명시 | S07 워크숍이 4표기 전부 요구, 선택 기준 없음 | 디브리프에 상황별 표기 선택 기준(상호작용→시퀀스, 상태전이→상태머신, 흐름/분기→액티비티, 블랙박스→SSD) 추가 |

## C. Ownership Leakage Removed

| 개념 | 위치 | 조치 |
|---|---|---|
| **Ubiquitous Language를 OOAD가 소유하는 듯한 표현** | S02 C10("UL이 여기서 시작"), S01 C14("UL은 다음 UC부터 적용"), A0-2("UL은 UC부터") — **세 곳** | 전부 "도메인 어휘"로 순화하고 `[FORWARD] ... DDD 소유`로 명시. 감사(curriculum-canon-audit-v1.md)가 발견한 건 S02 C10 한 곳이었으나, 같은 패턴이 S01·A0-2에도 있어 이번에 함께 정리했다 |
| **Repository를 OOAD 핵심 패턴 예시로 사용** | S11 C12(구) "Factory·Strategy·Repository(영속성 은닉)" | Repository 제거, `[타협/FORWARD]`로 "DDD에서 Aggregate 저장·조회 추상화로 심화(DDD 소유)"만 남김. 남은 예시는 Factory·Strategy·Adapter·Observer |
| **DDD 전술/전략의 이름·정의 수준 소개** | S14(구) C3/C4 "DDD 전술 설계 — 구성요소·경계·불변식을 이름과 규칙으로 체계화", "DDD 전략 설계 — Bounded Context로 나누고 Context Map으로" | `[FORWARD]` "도메인의 규칙·언어·경계를 어떻게 명시적 모델로 만들 것인가(전술·전략의 이름과 상세 정의는 DDD 과정 소유)"로 축소 — Bounded Context/Context Map이라는 이름 자체를 더 이상 쓰지 않는다 |
| **MSA 개요 수준 소개**(서비스=비즈니스 능력, 각자 데이터·API 등) | S14(구) C7–C9 | 한 줄 FORWARD로 축소: "독립 배포·팀 자율의 가치가 분산 비용보다 클 때만... MSA가 다룬다" |
| **"6과정" 하드코딩** | S14(구) C10 | "Engineering Portfolio에서 OOAD의 자리"로 교체(portfolio/course-catalog.md와 정합) |

**제거하지 않고 FORWARD로 남긴 것**(정상): S09의 레이어드·DIP 미리보기(아키텍처 forward, 이미 가벼움), S14의 SW Architecture forward-ref(신규 추가, C4) — 이들은 canon course-spec §4가 명시적으로 허용하는 FORWARD 수준이다.

## D. Session-by-Session Changes

| Session | 판정 | 핵심 변경 |
|---|---|---|
| S01 오리엔테이션 | REFINE | C3 격하(원칙→현상), C8 확장(Message/Responsibility), C14 UL 순화, C15/C16 번호는 기존 pre-existing 변경 그대로 유지 |
| S02 요구사항→유스케이스 | REFINE | C10 UL 리크 제거, FORWARD 명시 |
| S03 BDD | REFINE | C4 절대 표현 완화 |
| S04 정적 모델 | REFINE | C15 기계적 매핑 인상 제거, C16(신규) 비타협 3원칙 명시 |
| S05 정적 모델 실습 | KEEP | 무수정(audit LOW 판정과 일치) |
| S06 동적 모델 | KEEP | 무수정 |
| S07 동적 모델 실습 | REFINE | Just Enough Modeling 선택 기준 추가(기존 "4표기 관통" 실습 자체는 보존) |
| S08 모듈화·OO 기초 | KEEP | 무수정(이미 Parnas 계보와 정합) |
| S09 아키텍처 지향 | KEEP | 무수정(이미 forward-ref 수준 적절) |
| S10 SOLID | REFINE | DIP≠DI Framework 추가 |
| S11 RDD·GRASP·패턴 | **ADD(대규모)+REMOVE** | Design by Contract 전체 신설(C12–C15), Tell Don't Ask/LoD/CQS 명시(C11), Repository 예시 제거(C18로 FORWARD화), 명제 13→19, 제목 변경 |
| S12 책임 배치 실습 | REFINE | 계약 작성 단계 추가, 제목을 "Order 책임·계약 실습"으로 변경 |
| S13 코드로(TDD·리팩토링) | REFINE | C4 완화, C10(신규) Contract→Test Evidence lineage 추가 |
| S14 마무리 | **REDUCE(대규모)** | DDD/MSA 정의 수준 소개 전부 FORWARD 질문으로 축소, SW Architecture forward 신설(C4), "6과정" 제거 |

## E. DbC Integration

`courses/ooad/course-spec` §14(program-design/course-specs/ooad.md)의 흐름을 그대로 따랐다:

```
Responsibility → Precondition → Postcondition → Object Invariant → Collaboration → Verification
```

- **위치**: S11(개념 도입, RDD/GRASP 바로 다음) + S12(워크숍 적용) + S13(Test Evidence로 이음).
- **예시**: `Order.cancel()` — Precondition=취소 가능한 상태 / Postcondition=Cancelled / Object Invariant=완료·취소 모순 방지. **정확한 규칙 값은 재정의하지 않고 `order-domain-definition.md`를 가리키기만 했다**(기존 Order 규칙 변경 금지 준수).
- **Object Invariant ≠ Domain Invariant**를 S11(C14)과 A1(개념 소유)에 이중으로 명시 — DDD가 나중에 Domain Invariant를 가르칠 때 충돌 없이 재정박되도록.
- **Eiffel 문법 강의화 금지**를 S11 C15에 명시적 타협 항목으로 남김.
- Repository를 DbC/패턴 예시에서 완전히 제거(§C).

## F. Forward References

| 대상 과정 | 위치 | 표현 수준 |
|---|---|---|
| DDD | S02(도메인 어휘→UL), S11(Repository), S14(DDD가 다루는 질문) | 이름은 언급하되 정의는 안 함(UL·Repository는 예외적으로 "무엇으로 심화되는지"까지만 한 줄) |
| SW Architecture | S09(레이어드·DIP 미리보기, 기존 유지), S14(신규 — "왜 이 구조인가"는 SWA가 다룬다) | 질문 수준 |
| MSA | S14(신규 — 분산 가치/비용 판단은 MSA가 다룬다) | 한 줄 질문 수준(구 3줄 개요에서 축소) |
| AI-Native | 언급 없음(의도적) | 이 프로그램의 LLM 트랙 단방향 참조 규율(과정을 지목하지 않는다) 준수 — 사용자 지시서에도 AI-Native forward는 요구되지 않았다 |

## G. Deferred Deck Changes

- **`courses/ooad/decks/01.js`는 건드리지 않았다.** S01 내용 변경(C3 격하, C8 확장, C14 순화)이 있었으므로, 01.js를 실제로 재생성하면 커버리지·claim 대조가 깨질 것이다 — **이번 turn에서는 재생성하지 않았고, 다음 단계(deck 재생성)에서 처리해야 한다.**
- **검증 중 발견한 순수 curriculum-side 버그 하나를 curriculum.md 안에서 고쳤다(deck 무관)**: `engine/quotes.js`의 인용 자산 파서가 `` - `ID` [태그] `` 형식을 범용으로 스캔하는데, 태그가 **영문 대문자로만** 이루어지면(`[A-Z-]+`) 인용 등급(PRIMARY/WIDELY-CITED) 필드로 오인식한다. S14에 새로 쓴 `[FORWARD]` 태그 3곳(C3–C5)이 여기 걸려 "알 수 없는 등급 'FORWARD'"·"KO/EN/AUTHOR 누락" 오류 6건을 유발했다. `[forward]`(소문자)로 바꿔 해소했다 — **engine은 건드리지 않았고**, curriculum 쪽 표기만 이 파서의 기존 계약(영문 대문자 태그는 인용 자산으로 해석됨)에 맞춰 조정했다. S11 C18의 `[타협/FORWARD]`(한글 포함)는 애초에 이 패턴에 걸리지 않아 그대로 뒀다.
- **`courses/ooad/sources/*.md`(심층 소스)도 무수정.** 특히 `sources/01-orientation.md`는 S01 명제 변경과 지금 어긋나 있을 수 있다 — 심층 소스 갱신은 이번 범위 밖.
- **S11 시간 배분(60분)은 잠정치다.** 명제가 13→19로 늘어난 만큼 실제 소요 시간이 늘 가능성이 크다. 800분 총량·1일/2일 분할은 curriculum 레벨에서 그대로 유지했지만, 세션별 분(分) 재계산은 심층 소스 작성 시점으로 미뤘다(A3에 명시).
- **quote/engine schema 무수정.** OOAD verified quotes pack(12번 문서, 이전 turn에서 deferred)의 Meyer(DbC)·Wirfs-Brock(RDD)·Larman(Information Expert) 등은 이번 curriculum에 **검증된 quote로 삽입하지 않았다** — S11 C1(RDD)·C6(GRASP)·C12(DbC) 등은 저자 이름만 괄호로 인용(Wirfs-Brock, Larman, Meyer)했고, 축자 quote는 만들지 않았다. Booch quote는 여전히 HOLD 상태(curriculum에 Booch 축자 인용 없음, 계보 언급도 원래 없었으므로 추가하지 않음).

## Validation

`node engine/cli.js check courses/ooad/decks/01.js`(수정 전/후 비교) + `npm test`(corpus + snapshot) 실행 결과:

| 검사 | 결과 |
|---|---|
| `courses/ooad/decks/01.js` md5 | 작업 전/후 동일(`d18f8f93...`) — 무수정 확인 |
| `guides/커리큘럼_작성_지침.md` md5 | 작업 전/후 동일(`b303f095...`) — 무수정 확인 |
| Pre-existing uncommitted 변경(S01 C5 "절차적 Order 코드", C15 "과정 지도") | grep으로 재확인, 유지됨 |
| Canon OWNER 위반 검색(`UL이`, `rich 전제`, `Repository(영속성`, `6과정`, `테스트 기법이 아니라`, `Bounded Context`, `Context Map`) | 0건 |
| 세션/heading 수 | 14 세션(S01 + 2~14) 확인, TOC와 본문 일치 |
| `npm test` corpus | 47/47 PASS(무관 — QM 코퍼스, engine 무수정이므로 예상대로 영향 없음) |
| `npm test` snapshot | **NEW 상태 변화**: `ooad/01.js` 렌더가 이제 "치명 1건"으로 중단된다. 원인은 `p7 claim 'C3'의 분류는 '현상'인데 이 장의 kind는 '원칙'이다` — S01 C3를 `[원칙]→[현상]`으로 의도적으로 바꿨는데(§B), decks/01.js는 이번 turn 수정 금지 대상이라 옛 kind(`원칙`)를 그대로 갖고 있다. **이것은 curriculum 개정이 정확히 의도한 결과이지 버그가 아니다** — deck을 다음 단계에서 재정렬해야 사라진다. 골든 스냅샷은 갱신하지 않았다 |
| 부수 발견·수정 | `engine/quotes.js` 인용 파서가 영문 대문자 전용 태그(`[FORWARD]`)를 인용 등급으로 오인식하는 문제를 발견 — curriculum 쪽 표기(`[forward]`)만 고쳐 해소(§G). 이 수정 후 `node engine/cli.js check`의 오류가 7건(부수 충돌 6 + 의도한 drift 1)에서 1건(의도한 drift만)으로 줄었다 |

**PRE-EXISTING vs NEW 구분**: 이번 turn 시작 시점에는 `ooad/01.js`가 정상 렌더됐다(오류 0). 지금 발생하는 1건은 **이번 curriculum 개정이 직접 유발한 신규 상태**이고, 원인이 명확하며(S01 C3 재분류), 의도된 것이다. `decks/01.js` 자체의 결함이 아니다.

## H. Remaining Risks

1. **덱-커리큘럼 drift(확인됨, §Validation 참조)**: `decks/01.js`가 S01의 새 명제(C3 격하, C8 확장, C14 UL 순화)를 아직 반영하지 않는다 — 특히 C3의 kind 불일치(원칙→현상)가 지금 `node engine/cli.js check` 오류로 실측된다. 다음 deck 작업 시 재대조 필요.
2. **S11 시간 압박**: 명제 수가 46% 늘었다(13→19) — 실제 강의 60분 안에 다 들어갈지 심층 소스 작성 시 검증 필요. 안 들어가면 S11을 둘로 쪼갤지, 다른 세션에서 시간을 옮길지 결정이 필요하다(A3에 이미 이 리스크를 기록해 뒀다).
3. **A0-2/A1의 "관통 축"·"개념 소유" 서술이 늘어나 문서 서두가 다소 길어졌다** — 가독성엔 영향 없는 수준으로 판단했으나, 추후 authoring-convention.md 관점의 검토 여지가 있다.
4. **S14가 이제 DDD·SWA·MSA 세 방향 모두를 다뤄야 해서 명제 밀도가 높다**(11명제, 50분) — 세 개를 균등히 다루려면 시간이 빠듯할 수 있다. 이 역시 심층 소스 단계에서 확인 필요.
5. **본 개정은 curriculum 텍스트 수준이다** — 실제 학습자 경험(슬라이드 밀도, 시간 배분의 현실성)은 deck 생성·시험 렌더 전까지 검증되지 않는다.
