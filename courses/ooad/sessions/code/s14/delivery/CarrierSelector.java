package delivery;

// 배송지에 맞는 배송 대행사를 골라 배송을 만든다(교육용 규칙: 당일 배송 권역이면 당일 배송).
// 대행사의 형식은 모르고 약속(DeliveryGateway)만 안다.
public final class CarrierSelector {
    private final DeliveryGateway regular;
    private final DeliveryGateway sameDay;
    private final String sameDayArea;

    public CarrierSelector(DeliveryGateway regular, DeliveryGateway sameDay, String sameDayArea) {
        this.regular = regular;
        this.sameDay = sameDay;
        this.sameDayArea = sameDayArea;
    }
    public Delivery deliveryFor(String deliveryNumber, String shippingAddress) {
        boolean isSameDay = shippingAddress.startsWith(sameDayArea);
        return new Delivery(deliveryNumber, isSameDay ? "SAME_DAY" : "REGULAR", isSameDay ? sameDay : regular);
    }
}
