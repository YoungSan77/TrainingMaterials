package payment;
public interface PaymentGateway {
    PaymentDecision requestApproval(Money amount, PaymentMethod method);
}
