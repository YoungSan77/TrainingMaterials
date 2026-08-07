# 레이어 규약 — 클린 아키텍처 (Java)

## 1. 의존성 규칙 (불변)
> **소스 코드 의존성은 오직 안쪽을 향한다. 안쪽 레이어는 바깥 레이어를 알지 못한다.**

- 이 한 줄이 전 과정의 축이다. 모든 패턴 문서는 "이 패턴이 의존성 규칙을 어떻게 지키는가"로 정당화된다.
- 위반 예: 도메인이 JPA·HTTP·프레임워크 타입을 import 하는 순간 규칙이 깨진다.

## 2. 네 개의 레이어 (안 → 밖)

### 2.1 Domain (엔티티)
- 담는 것: 엔티티, 값 객체, 도메인 서비스, 도메인 이벤트, 불변식.
- 알아도 되는 것: 순수 언어·표준 라이브러리.
- 금지: 프레임워크·영속성·전송·DI 어노테이션 일체.
- 예: Order, OrderLine, Money, OrderStatus, R1~R7.

### 2.2 Application (유스케이스)
- 담는 것: 유스케이스 인터랙터, 입력·출력 포트(경계 인터페이스), 리포지토리·협력자 **인터페이스**.
- 책임: 오케스트레이션(흐름 조정)만. 업무 규칙은 도메인에 위임한다.
- 금지: 규칙 로직을 여기 두지 않는다(그러면 빈혈 도메인이 된다).
- 예: PlaceOrderUseCase, OrderRepository(인터페이스), PaymentPort.

### 2.3 Interface Adapters (어댑터)
- 담는 것: 컨트롤러, 프레젠터, 게이트웨이·리포지토리 **구현**, DTO, 매퍼.
- 책임: 바깥 형식 ↔ 안쪽 모델 변환. 프레임워크와 도메인 사이의 번역.
- 예: OrderController, JpaOrderRepository, PaymentGateway, OrderDto, OrderMapper.

### 2.4 Frameworks & Drivers (인프라)
- 담는 것: 웹 프레임워크, DB, 메시징, 외부 SDK, DI 배선(합성 루트).
- 책임: 세부 기술. 가장 자주 바뀌고 가장 바깥.
- 예: Spring 설정, DataSource, main/부트스트랩.

## 3. 레이어 요약표
| 레이어 | 대표 요소 | 아는 것 | 금지 |
|---|---|---|---|
| Domain | 엔티티·VO·규칙 | 없음(순수) | 모든 바깥 기술 |
| Application | 유스케이스·포트 | Domain | 어댑터·프레임워크 구체 |
| Adapters | 컨트롤러·구현·DTO | Application·Domain | 프레임워크 배선 세부 |
| Frameworks | 프레임워크·DB·배선 | 전부 | — |

## 4. 경계 넘기 규칙
- **데이터**: 레이어 경계는 DTO로만 넘긴다. 도메인 객체를 어댑터 밖으로 유출하지 않는다.
- **제어 흐름**: 밖 → 안(컨트롤러가 유스케이스를 호출).
- **의존성**: 안 ← 밖. 안쪽이 바깥을 필요로 하면 **안쪽에 인터페이스(포트)를 두고 바깥이 구현**한다(DIP).
- 인터페이스 소유 위치: 포트·리포지토리 인터페이스는 Application(안), 구현은 Adapters(밖).

## 5. Java 패키지·명명 규약
패키지(기능 슬라이스 기준):

```
com.example.ordering
├─ domain           // 2.1
├─ application      // 2.2 (usecase, port)
├─ adapter          // 2.3 (web, persistence)
└─ infrastructure   // 2.4 (config, bootstrap)
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

## 6. 진행 단계와의 관계 (규약은 불변, 채움만 변한다)
- 규약은 스파게티·TS·리치에서 **동일하게 적용**된다. 바뀌는 것은 각 레이어가 채워지는 정도다.
- 스파게티: 경계가 없다 → 규약 위반 상태(대비의 출발점).
- TS: 레이어는 서지만 Domain이 빈약하다(규칙이 Application에 있음).
- 리치: 규칙이 Domain으로 이동해 Domain이 두꺼워진다. 규약의 완성형.
- 즉 이 문서는 "목표 형태"를 정의하고, 본편은 그 목표에 도달하는 경로를 보인다.
