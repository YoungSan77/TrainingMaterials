package delivery;

// 배송 시스템에 대한 요청 인터페이스. 배송 요청은 결과를 기다리지 않는다(비동기).
public interface DeliveryGateway {
    void requestDelivery(String orderNumber, Address shippingAddress);
}
