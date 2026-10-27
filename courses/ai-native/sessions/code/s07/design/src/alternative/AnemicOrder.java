package alternative;

import delivery.Address;
import order.OrderStatus;
import payment.Money;

// 쓰지 않기로 한 안 — 주문이 값만 들고 규칙을 하나도 지키지 않는다.
public final class AnemicOrder {
    private Money totalAmount;
    private Address shippingAddress;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    public Money getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Money totalAmount) { this.totalAmount = totalAmount; }
    public Address getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Address shippingAddress) { this.shippingAddress = shippingAddress; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
