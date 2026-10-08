package product;

import payment.Money;

// 상품 시스템에 대한 요청 인터페이스.
public interface ProductGateway {
    Money salePriceOf(ProductNumber number);
}
