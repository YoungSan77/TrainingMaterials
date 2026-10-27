package payment;

public interface PaymentGateway {
    // 사전조건: amount는 그 주문의 확정 총액이다.
    // 사후조건: 승인·거절·확정 불가 중 하나를 돌려주며 주문 상태를 바꾸지 않는다.
    PaymentDecision requestApproval(Money amount, PaymentMethod method);
}
