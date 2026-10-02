package payment;

public final class Payment {
    private final Money paymentAmount;
    private final PaymentGateway paymentSystem;

    public Payment(Money paymentAmount, PaymentGateway paymentSystem) {
        this.paymentAmount = paymentAmount;
        this.paymentSystem = paymentSystem;
    }
    public void requestRefund() {
        paymentSystem.requestRefund(paymentAmount);
    }
}
