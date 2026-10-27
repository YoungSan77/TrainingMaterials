package delivery;

public interface DeliveryGateway {
    // 사전조건: 그 주문이 결제완료다.
    // 사후조건: 배송을 요청했다. 배송이 시작됐는지는 통보로 따로 온다.
    void requestDelivery(String orderNumber, Address shippingAddress);
}
