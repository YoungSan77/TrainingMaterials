# 의존 규칙

- 업무 패키지(`order`·`payment`·`delivery`·`product`)는 연동 패키지(`paymentadapter`)와 `persistence`를 import하지 않는다.
- 업무 패키지는 외부 시스템을 **인터페이스**로만 안다(`PaymentGateway`·`DeliveryGateway`·`OrderRepository`).
- 패키지 의존에 순환이 없다.

`test/DependencyRuleTest`가 이 규칙을 판정한다. 실패하면 메시지에 적힌 방법으로 고친다.
