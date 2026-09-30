package paymentadapter;

import payment.PaymentSystem;
import payment.Money;
import order.Order;

// 결제 시스템과 주고받는 형식을 주문 시스템의 의미로 옮긴다.
public final class PaymentAdapter implements PaymentSystem {
    private final PaymentSystemApi api;

    public PaymentAdapter(PaymentSystemApi api) { this.api = api; }

    @Override
    public void requestRefund(Money amount) {
        api.request("REFUND", amount.won());
    }

    // 결제 시스템의 환불 통보를 주문의 사건으로 옮긴다.
    public void receiveNotice(String resultCode, Order order) {
        if (resultCode.equals("REFUNDED")) order.onRefundCompleted();
    }
}
