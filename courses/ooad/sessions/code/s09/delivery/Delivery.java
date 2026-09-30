package delivery;

public final class Delivery {
    private final String deliveryNumber;
    private final DeliverySystem deliverySystem;

    public Delivery(String deliveryNumber, DeliverySystem deliverySystem) {
        this.deliveryNumber = deliveryNumber;
        this.deliverySystem = deliverySystem;
    }
    public boolean requestDispatchStop() {
        return deliverySystem.requestDispatchStop(deliveryNumber);
    }
}
