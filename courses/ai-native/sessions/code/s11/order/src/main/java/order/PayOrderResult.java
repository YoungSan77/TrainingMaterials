package order;

import java.util.Objects;

import payment.CardApprovalResult;

public record PayOrderResult(Order order, CardApprovalResult cardApprovalResult) {
    public PayOrderResult {
        Objects.requireNonNull(order, "order must not be null");
        Objects.requireNonNull(cardApprovalResult, "cardApprovalResult must not be null");
    }
}
