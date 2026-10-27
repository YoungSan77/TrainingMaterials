결제·배송 포트를 인터페이스 선언과 업무 값으로만 추가했습니다.

- 결제: [PaymentGateway.java](/private/tmp/s08-delegation/repo/src/main/java/payment/PaymentGateway.java), [CardApprovalRequest.java](/private/tmp/s08-delegation/repo/src/main/java/payment/CardApprovalRequest.java), [CardApprovalResult.java](/private/tmp/s08-delegation/repo/src/main/java/payment/CardApprovalResult.java)
- 배송: [DeliveryGateway.java](/private/tmp/s08-delegation/repo/src/main/java/delivery/DeliveryGateway.java), [DeliveryRequest.java](/private/tmp/s08-delegation/repo/src/main/java/delivery/DeliveryRequest.java)

실제 결제·배송 어댑터, 네트워크 호출, 제공자 코드 처리에는 손대지 않았습니다.

개발 결제 설정은 규격상 저장소 밖 `../order-config/application.properties`에 두어야 하지만, 현재 지시의 “저장소 밖 쓰기 금지” 때문에 만들 수 없습니다. 설정 담당 및 미정 결과 처리 질문은 [OPEN_QUESTIONS.md](/private/tmp/s08-delegation/repo/OPEN_QUESTIONS.md)에 남겼습니다.

검증 출력:

```text
PASS: saves a PENDING_PAYMENT order with the accepted price and total
PASS: keeps the fixed price and total after the sale price changes
PASS: rejects inputs that break order-creation preconditions
OrderApplicationServiceTest passed
classes -> java.base
```
