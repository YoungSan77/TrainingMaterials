# v2.0 Critical Review & Change Log

## 1. Review Conclusion

v1 초안은 OOAD·DDD·AI의 중심축은 명확했지만, **SWA와 MSA를 독립 과정으로
"존재"시키는 수준과 실제 정본에서 충분히 "대표"하는 수준 사이에 차이**가
있었다. v2는 이를 보정한다.

가장 중요한 수정은 네 가지다.

1.  공통 판단축에 **Why / Quality**를 추가했다.
2.  SW Architecture를 Clean/Hexagonal/Dependency 중심에서 **Driver →
    Quality → Trade-off → Evaluation**까지 확장했다.
3.  MSA를 boundary/pattern 중심에서 **Failure → Observability →
    Operation cost**까지 확장했다.
4.  AI-Native를 Prompt/Agent 통합 수준에서 **Specification → Context →
    Guardrail → Harness → Autonomy → Evaluation**의 통제 구조로
    정렬했다.

------------------------------------------------------------------------

## 2. Critical Findings

### Finding A --- SWA가 v1에서 과소대표됨

기존 repository의 SWA 과정은
`Spaghetti → TS → Rich Domain → Port/Adapter`라는 훌륭한 진화형 실습을
가진다. 그러나 이것만으로는 SW Architecture 전체의 핵심인
**quality-driven structural decision**을 충분히 설명하지 못한다.

**v2 조치** - Architecture Driver - Quality Attribute Scenario -
Architecture Decision - Evaluation / Fitness / Evolution

을 정본 OWNER에 추가한다.

**Trade-off** 현재 16교시 안에서 모두 깊게 넣으려면 기존 OO/DDD 재교육
비중을 줄여야 한다.

------------------------------------------------------------------------

### Finding B --- MSA가 분산 운영 현실을 충분히 소유하지 못함

기존 8교시는 boundary-first 접근이 강점이다. 반면
resilience/observability/deployment가 독립 학습목표로 약하다.

**v2 조치** MSA OWNER에 failure, idempotency, resilience, observability,
operational complexity를 명시한다.

**Trade-off** 8교시 유지 시 모든 distributed pattern을 넓게 다루는 것을
포기해야 한다.

------------------------------------------------------------------------

### Finding C --- Domain Model ownership 경계가 불명확

v1에서는 OOAD에서도 Domain Model이라는 표현을 넓게 사용하면서 DDD가
Domain Model을 OWNER로 갖도록 해 충돌 가능성이 있었다.

**v2 조치** - OOAD: **Conceptual / Analysis Model + Object Design** -
DDD: **Domain Model** 로 명확히 구분한다.

------------------------------------------------------------------------

### Finding D --- DDD의 Application Service 소유 충돌

Domain Service와 Application Service를 같은 DDD 묶음으로 오해할 가능성이
있었다.

**v2 조치** - Domain Service: DDD OWNER - Application Service /
application boundary: SWA OWNER - DDD에서는 차이만 recap/apply

------------------------------------------------------------------------

### Finding E --- Ontology가 필수 단계처럼 보일 위험

`DDD → Ontology → AI`를 선형 필수 단계로 읽을 수 있었다.

**v2 조치** Ontology를 **optional bridge**로 명시한다. Domain
Model/문서/Schema만으로 의미 공유가 충분하면 Ontology를 만들지 않는다.

------------------------------------------------------------------------

### Finding F --- AI 용어의 성숙도 차이

OOAD/DDD/SWA/MSA 용어는 장기간 안정된 반면 `Context Engineering`,
`Harness Engineering`, `AI-Native SE`는 빠르게 진화한다.

**v2 조치** - 프로그램 내부 operational definition을 명시한다. -
Vendor/tool definition으로 고정하지 않는다. - 매 개정 시 terminology
review 대상임을 전제로 한다.

------------------------------------------------------------------------

### Finding G --- 원칙의 attribution 위험

Tell, Don't Ask, "one dot per line", Anemic Domain Model 관련 문구는
인터넷에서 attribution이 쉽게 섞인다.

**v2 조치** - 원칙과 축자 quote를 분리한다. - 검증되지 않은 quote는
principles 정본에서 제거한다. - `One dot per line`은 Law of Demeter
정의가 아니라 heuristic임을 명시한다.

------------------------------------------------------------------------

### Finding H --- 5개 과정이 서로 침범할 위험

모든 과정이 boundary, dependency, event, observability를 말할 수 있기
때문에 OWNER가 없으면 중복이 급격히 늘어난다.

**v2 조치** `OWNER / RECAP / APPLY / EXTEND / FORWARD / BRIDGE` 6개
mode를 도입한다.

------------------------------------------------------------------------

## 3. Coverage Check

  ------------------------------------------------------------------------
  Course           Identity           Core decision fully v2 status
                                             represented? 
  ---------------- ---------------- --------------------- ----------------
  OOAD             Model /                            Yes 유지·경계 정교화
                   Responsibility /                       
                   Collaboration                          

  DDD              Domain / Rule /                    Yes tactical
                   Language /                             ownership 복원
                   Boundary                               

  SWA              Driver / Quality           **v1 부족** v2 보강
                   / Structure /                          
                   Trade-off                              

  MSA              Distribution          **v1 일부 부족** v2 보강
                   Value / Boundary                       
                   / Failure /                            
                   Operation                              

  AI-Native        Specification /   Yes, but terminology v2 순서·경계
                   Context /                        mixed 보강
                   Control /                              
                   Delegation                             
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 4. What v2 Does Not Decide Yet

이 네 정본은 **무엇을 가르칠지와 개념 경계**를 결정한다. 아직 다음은
확정하지 않는다.

-   각 과정의 최종 시간/일수
-   세션별 정확한 장수
-   기존 source 파일의 실제 MOVE/MERGE
-   SWA 16교시의 재배분
-   MSA를 8교시 유지할지 확장할지
-   AI-Native를 2일/3일 중 어떻게 편성할지
-   Ontology 실습의 깊이

이것은 다음 단계인 **Curriculum v2 Mapping**에서 결정한다.

------------------------------------------------------------------------

## 5. Acceptance Criteria for Canonization

네 정본을 v2.0으로 승인하려면:

-   5개 과정 각각 한 문장 Course Thesis가 있다.
-   각 과정의 OWNER가 겹치지 않는다.
-   모든 공통 개념은 재정박 경로가 있다.
-   SWA가 Quality/Trade-off를 소유한다.
-   MSA가 Failure/Operation cost를 소유한다.
-   DDD가 tactical + strategic modeling을 소유한다.
-   AI-Native가
    Specification/Context/Guardrail/Harness/Agent/Evaluation을 구분한다.
-   Ontology가 optional bridge임이 명확하다.
-   도입 조건/Trade-off/실패 조건이 프로그램 전체 원칙에 포함된다.
-   특정 Vendor/Framework가 정본 구조를 결정하지 않는다.

위 기준을 충족하므로 이 세트는 **v2.0 Canon Candidate**로 사용할 수
있다.
