package samedaydeliveryadapter;

import delivery.DeliverySystem;
import order.OrderNumber;
import order.OrderNotice;

// 당일 배송 대행사의 형식을 배송 경계의 약속(DeliverySystem)으로 옮긴다.
// 주문·배송 클래스는 바뀌지 않는다.
public final class SameDayDeliveryAdapter implements DeliverySystem {
    private final SameDayDeliveryApi api;
    private final OrderNotice orderNotice;

    public SameDayDeliveryAdapter(SameDayDeliveryApi api, OrderNotice orderNotice) {
        this.api = api;
        this.orderNotice = orderNotice;
    }

    @Override
    public boolean requestDispatchStop(String deliveryNumber) {
        return api.cancelPickup(deliveryNumber);
    }

    // 당일 배송 대행사의 이벤트를 주문의 사건으로 옮긴다.
    public void receiveEvent(String eventName, String orderNumber) {
        if (eventName.equals("OUT_FOR_DELIVERY")) orderNotice.onDeliveryStarted(new OrderNumber(orderNumber));
    }
}
