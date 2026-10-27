package delivery;

import java.util.Objects;

/** Delivery request containing the order's already-confirmed shipping address. */
public record DeliveryRequest(String orderNumber, String shippingAddress) {
    public DeliveryRequest {
        Objects.requireNonNull(orderNumber, "orderNumber must not be null");
        Objects.requireNonNull(shippingAddress, "shippingAddress must not be null");
    }
}
