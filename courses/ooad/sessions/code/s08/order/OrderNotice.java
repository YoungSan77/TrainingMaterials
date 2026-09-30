package order;

// 외부 통보를 받는 약속. 연동은 이 약속에만 의존한다.
public interface OrderNotice {
    void onDeliveryStarted(OrderNumber number);
    void onRefundCompleted(OrderNumber number);
}
