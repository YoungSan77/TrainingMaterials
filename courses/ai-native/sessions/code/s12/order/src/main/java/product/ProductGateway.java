package product;

public interface ProductGateway {
    Money findCurrentSalePrice(ProductNumber productNumber);
}
