package payment;

// 불변 조건: 환불 금액은 결제 금액을 넘지 않는다.
final class Refund {
    private final Money refundAmount;

    Refund(Money refundAmount, Money paymentAmount) {
        if (refundAmount.won() > paymentAmount.won())
            throw new IllegalArgumentException("환불 금액 ≤ 결제 금액");
        this.refundAmount = refundAmount;
    }
    void request(PaymentSystem paymentSystem) {
        paymentSystem.requestRefund(refundAmount);
    }
}
