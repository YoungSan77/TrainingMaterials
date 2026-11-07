package payment;

public interface PaymentGateway {
    CardApprovalResult approve(CardApprovalRequest request);
}
