package deliveryadapter;

import delivery.DeliveryGateway;
import order.OrderNumber;
import order.OrderNotice;

// 배송 시스템과 주고받는 형식을 주문 시스템의 의미로 옮긴다.
public final class DeliveryAdapter implements DeliveryGateway {
    private final DeliverySystemApi api;
    private final OrderNotice orderNotice;

    public DeliveryAdapter(DeliverySystemApi api, OrderNotice orderNotice) {
        this.api = api;
        this.orderNotice = orderNotice;
    }

    @Override
    public boolean requestDispatchStop(String deliveryNumber) {
        return api.request("STOP", deliveryNumber).equals("ACCEPTED");
    }

    // 배송 시스템의 통보를 주문의 사건으로 옮긴다. 연동은 통보 약속만 안다.
    public void receiveNotice(String statusCode, String orderNumber) {
        if (statusCode.equals("IN_TRANSIT")) orderNotice.onDeliveryStarted(new OrderNumber(orderNumber));
    }
}
