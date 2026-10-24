package deliveryadapter;
import delivery.Address;
import delivery.DeliveryGateway;
public final class DeliveryAdapter implements DeliveryGateway {
    private final DeliveryGateway connection;
    public DeliveryAdapter(DeliveryGateway connection) { this.connection = connection; }
    public void requestDelivery(String orderNumber, Address shippingAddress) {
        connection.requestDelivery(orderNumber, shippingAddress);
    }
}
