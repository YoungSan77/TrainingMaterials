package delivery;
public interface DeliveryGateway {
    void requestDelivery(String orderNumber, Address shippingAddress);
}
