package payment;

final class Refund {
    private final Money refundAmount;

    Refund(Money refundAmount, Money paymentAmount) {
        if (refundAmount.won() > paymentAmount.won())
            throw new IllegalArgumentException("환불 금액 ≤ 결제 금액");
        this.refundAmount = refundAmount;
    }
    void request(PaymentGateway paymentSystem) {
        paymentSystem.requestRefund(refundAmount);
    }
}
