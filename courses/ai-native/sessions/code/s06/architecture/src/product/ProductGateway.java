package product;
public interface ProductGateway {
    // 상품의 현재 판매가. 원 단위의 0 이상 정수이며 결제 자료형에 의존하지 않는다.
    long salePrice(String productNumber);
}
