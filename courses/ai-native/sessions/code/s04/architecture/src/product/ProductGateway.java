package product;
import payment.Money;
public interface ProductGateway {
    Money salePrice(String productNumber);
}
