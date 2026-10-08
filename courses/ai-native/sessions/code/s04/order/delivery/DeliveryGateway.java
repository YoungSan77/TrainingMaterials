package delivery;

// 배송 시스템에 대한 요청 인터페이스.
public interface DeliveryGateway {
    void requestDelivery(String orderNumber, Address shippingAddress);
}
