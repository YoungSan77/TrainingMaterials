package payment;
public interface PaymentGateway {
    boolean requestApproval(Money amount, PaymentMethod method);
}
