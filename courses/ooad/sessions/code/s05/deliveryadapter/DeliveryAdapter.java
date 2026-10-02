package deliveryadapter;

import delivery.DeliveryGateway;
import order.Order;

// 배송 시스템과 주고받는 형식을 주문 시스템의 의미로 변환한다.
public final class DeliveryAdapter implements DeliveryGateway {
    private final DeliverySystemApi api;

    public DeliveryAdapter(DeliverySystemApi api) { this.api = api; }

    @Override
    public boolean requestDispatchStop(String deliveryNumber) {
        return api.request("STOP", deliveryNumber).equals("ACCEPTED");
    }

    // 배송 시스템의 통보를 주문의 사건으로 변환한다.
    public void receiveNotice(String statusCode, Order order) {
        if (statusCode.equals("IN_TRANSIT")) order.onDeliveryStarted();
        // PICKING·PACKED 같은 배송 시스템 내부 상태는 주문으로 변환하지 않는다.
    }
}
