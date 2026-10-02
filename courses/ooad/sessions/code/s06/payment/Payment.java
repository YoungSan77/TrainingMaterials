package payment;

import java.util.Optional;

public final class Payment {
    private final Money paymentAmount;
    private final PaymentGateway paymentSystem;
    private Optional<Refund> refund = Optional.empty();

    public Payment(Money paymentAmount, PaymentGateway paymentSystem) {
        this.paymentAmount = paymentAmount;
        this.paymentSystem = paymentSystem;
    }
    public void requestRefund() {
        var newRefund = new Refund(paymentAmount, paymentAmount);
        refund = Optional.of(newRefund);
        newRefund.request(paymentSystem);
    }
}
