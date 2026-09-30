package samedaydeliveryadapter;

// 당일 배송 대행사가 정한 형식. 기존 배송 시스템과 다르며, 이 연동 밖으로 나가지 않는다.
public interface SameDayDeliveryApi {
    boolean cancelPickup(String trackingId);
}
