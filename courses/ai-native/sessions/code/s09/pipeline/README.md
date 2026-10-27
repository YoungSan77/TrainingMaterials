# 주문한다 — 검사 파이프라인

"세션 09. 검사 파이프라인"의 예시 저장소다. "세션 08. 위임"이 돌려받은 구현(`code/s08/delegation/`)을
그대로 가져와 **검사를 명령 하나로 모았다**. 테스트는 JUnit 5로 바꿨다.

## 돌리기

```sh
./gradlew check
```

`check`는 넷을 돈다 — 컴파일, 수용 테스트(`test`), 의존 규칙(`dependencyRules`), 결합도(`coupling`).
녹색 출력은 `check-output.txt`에 있다.

다섯째 검사인 **금액 계산의 LLM 심사**는 추론적이고 느려서 `check`에 넣지 않는다. CI에서 따로 돌린다.
보낸 프롬프트는 `examples/amount-review-prompt.txt`, 실제 응답은 `examples/amount-review-output.md`다
(Claude Opus 5.5, 2026-10-27, 1턴).

## 의존 규칙 위반을 재현하기

`examples/violation/`의 두 파일을 `src/main/java`의 같은 패키지로 복사하면 주문이 결제 연동을 직접
조립한다. 그 상태의 `./gradlew check` 출력이 `check-output-violation.txt`다.

```sh
cp examples/violation/order/PaymentAssembly.java src/main/java/order/
cp examples/violation/paymentadapter/CardPaymentAdapter.java src/main/java/paymentadapter/
./gradlew check            # dependencyRules FAILED — 고치는 방법이 메시지에 있다
rm src/main/java/order/PaymentAssembly.java src/main/java/paymentadapter/CardPaymentAdapter.java
```

## 검사의 내용

- **의존 규칙** — 업무 패키지(`order`·`payment`·`delivery`·`product`)가 연동·영속을 의존하지 않고,
  업무 사이는 허용 목록(`order->payment`·`order->delivery`·`order->product`)만 쓴다. 규칙과 허용
  목록은 "세션 06. 아키텍처"가 정한 것과 같다. 판정은 `jdeps`의 패키지 의존으로 한다.
- **결합도** — 클래스마다 아는 클래스 수를 세어 많은 쪽 다섯을 보인다. **합격선이 아니라 신호**다.

## 확인한 환경

Gradle 9.8.2(래퍼), JDK 26으로 실행하고 `options.release = 17`로 자바 17 호환 바이트코드를 만든다.
JUnit 5는 Maven Central에서 받는다 — 네트워크가 막힌 환경에서는 `./gradlew check`가 의존성 해석에서
멈춘다.
