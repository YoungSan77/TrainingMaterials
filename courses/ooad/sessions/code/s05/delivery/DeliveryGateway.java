package delivery;

// 배송 패키지가 가진 요청 인터페이스. 배송 연동이 구현한다.
public interface DeliveryGateway {
    boolean requestDispatchStop(String deliveryNumber);
}
