package payment;

// 결제 패키지가 가진 요청 인터페이스. 결제 연동이 구현한다.
public interface PaymentGateway {
    void requestRefund(Money amount);
}
