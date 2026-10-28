package order;

import java.util.Objects;

import payment.CardApprovalData;

public record PayOrderCommand(OrderNumber orderNumber, CardApprovalData paymentMethod) {
    public PayOrderCommand {
        Objects.requireNonNull(orderNumber, "orderNumber must not be null");
        Objects.requireNonNull(paymentMethod, "paymentMethod must not be null");
    }
}
