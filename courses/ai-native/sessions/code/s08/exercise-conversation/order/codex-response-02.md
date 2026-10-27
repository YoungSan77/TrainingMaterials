첫 작업 단위(배송지 지정으로 주문 생성)를 구현했습니다.

- 주문 생성 시 상품 현재 판매가를 확정하고 `PENDING_PAYMENT` 주문을 저장합니다: [OrderApplicationService.java](/private/tmp/s08-delegation/repo/src/main/java/order/OrderApplicationService.java)
- 수량(1 이상), 금액(0 이상), 최소 한 항목, 배송지 존재 및 총액 계산 불변식을 검증합니다: [Order.java](/private/tmp/s08-delegation/repo/src/main/java/order/Order.java)
- 판매가 변경 뒤에도 기존 주문 단가·총액이 유지되는 테스트를 추가했습니다: [OrderApplicationServiceTest.java](/private/tmp/s08-delegation/repo/src/test/java/order/OrderApplicationServiceTest.java)
- Gradle/JUnit 다운로드 구성은 제거하고, 직접 컴파일·테스트 명령을 [README.md](/private/tmp/s08-delegation/repo/README.md)에 적었습니다.

검증 완료:

```sh
javac --release 17 -d build/classes $(find src/main/java src/test/java -name '*.java')
java -ea -cp build/classes order.OrderApplicationServiceTest
```

결과: `OrderApplicationServiceTest passed`

문서 정책이 미정인 식별자 형식·주소 세부 구조는 강제하지 않았고, `docs/`는 변경하지 않았습니다.

커밋은 환경이 `.git/index.lock` 생성을 `Operation not permitted`로 차단해 수행하지 못했습니다. 변경 내용은 작업 트리에 그대로 있습니다.
