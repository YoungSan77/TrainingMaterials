package payment;

import java.util.Objects;

/** Business request for card approval, independent of a provider protocol. */
public record CardApprovalRequest(String orderNumber, long amount, CardApprovalData cardApprovalData) {
    public CardApprovalRequest {
        Objects.requireNonNull(orderNumber, "orderNumber must not be null");
        Objects.requireNonNull(cardApprovalData, "cardApprovalData must not be null");
        if (amount < 0) {
            throw new IllegalArgumentException("amount must not be negative");
        }
    }
}
