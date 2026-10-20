package order;
import delivery.Address;
import payment.Money;

public final class Order {
    private final Money totalAmount;
    private final Address shippingAddress;
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    public Order(Money totalAmount, Address shippingAddress) {
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
    }
    public Money totalAmount() { return totalAmount; }
    public Address shippingAddress() { return shippingAddress; }
    public OrderStatus status() { return status; }
    public void onPaid() { status = OrderStatus.PAID; }
}
