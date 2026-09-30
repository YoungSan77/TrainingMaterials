package payment;

public final class Payment {
    private final Money paymentAmount;
    private final PaymentSystem paymentSystem;

    public Payment(Money paymentAmount, PaymentSystem paymentSystem) {
        this.paymentAmount = paymentAmount;
        this.paymentSystem = paymentSystem;
    }
    public void requestRefund() {
        paymentSystem.requestRefund(paymentAmount);
    }
}
