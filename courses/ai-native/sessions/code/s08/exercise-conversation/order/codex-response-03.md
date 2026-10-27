요청한 테스트를 보완해 실제 실행했습니다: [OrderApplicationServiceTest.java](/private/tmp/s08-delegation/repo/src/test/java/order/OrderApplicationServiceTest.java)

검사 범위:

- 펜 2개 × 1,000원, 서울 배송지 주문이 `PENDING_PAYMENT`, 단가 1,000원, 총액 2,000원으로 저장됨
- 판매가가 1,200원으로 바뀐 뒤에도 기존 주문은 단가 1,000원·총액 2,000원을 유지함
- 수량 0, 음수 금액, 빈 항목, 배송지 누락, 현재 판매가를 조회할 수 없는 입력을 거절함

실행 명령과 출력:

```text
$ javac --release 17 -d build/classes $(find src/main/java src/test/java -name '*.java')
$ java -ea -cp build/classes order.OrderApplicationServiceTest
PASS: saves a PENDING_PAYMENT order with the accepted price and total
PASS: keeps the fixed price and total after the sale price changes
PASS: rejects inputs that break order-creation preconditions
OrderApplicationServiceTest passed
```

변경은 요청대로 작업 트리에만 남겨 두었습니다.
