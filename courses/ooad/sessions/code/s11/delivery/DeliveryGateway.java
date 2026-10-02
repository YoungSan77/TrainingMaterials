package delivery;

// 배송 경계가 소유하는 요청 약속. 배송 연동이 구현한다.
public interface DeliveryGateway {
    boolean requestDispatchStop(String deliveryNumber);
}
