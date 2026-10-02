package payment;

// 결제 경계가 소유하는 요청 약속. 결제 연동이 구현한다.
public interface PaymentGateway {
    void requestRefund(Money amount);
}
