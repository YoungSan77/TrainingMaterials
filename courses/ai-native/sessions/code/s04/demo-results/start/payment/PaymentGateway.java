package payment;

// 결제 시스템에 대한 요청 인터페이스.
public interface PaymentGateway {
    boolean requestApproval(Money amount, PaymentMethod method);
}
