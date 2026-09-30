package paymentadapter;

import payment.PaymentSystem;
import payment.Money;
import order.OrderNumber;
import order.OrderNotice;

// 결제 시스템과 주고받는 형식을 주문 시스템의 의미로 옮긴다.
public final class PaymentAdapter implements PaymentSystem {
    private final PaymentSystemApi api;
    private final OrderNotice orderNotice;

    public PaymentAdapter(PaymentSystemApi api, OrderNotice orderNotice) {
        this.api = api;
        this.orderNotice = orderNotice;
    }

    @Override
    public void requestRefund(Money amount) {
        api.request("REFUND", amount.won());
    }

    // 결제 시스템의 환불 통보를 주문의 사건으로 옮긴다.
    public void receiveNotice(String resultCode, String orderNumber) {
        if (resultCode.equals("REFUNDED")) orderNotice.onRefundCompleted(new OrderNumber(orderNumber));
    }
}
