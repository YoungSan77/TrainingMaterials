package alternative;

import delivery.Address;
import payment.Money;
import payment.PaymentDecision;
import payment.PaymentMethod;
import product.ProductNumber;

// 쓰지 않기로 한 안 — 외부 연동 셋을 인터페이스 하나로 묶었다.
public interface ExternalSystemGateway {
    PaymentDecision requestApproval(Money amount, PaymentMethod method);
    void requestDelivery(String orderNumber, Address shippingAddress);
    long salePrice(ProductNumber number);
}
