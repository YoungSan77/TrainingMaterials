package product;

import payment.Money;

// 상품 시스템에 대한 요청 인터페이스. 상품 정보는 동기로 조회한다.
public interface ProductGateway {
    Money salePriceOf(ProductNumber number);
}
