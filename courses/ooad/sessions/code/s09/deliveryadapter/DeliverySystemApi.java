package deliveryadapter;

// 배송 시스템이 정한 요청 형식. 이 형식은 배송 연동 밖으로 나가지 않는다.
public interface DeliverySystemApi {
    String request(String command, String deliveryNumber);
}
