package delivery;

public final class Delivery {
    private final String deliveryNumber;
    private final DeliveryGateway deliverySystem;

    public Delivery(String deliveryNumber, DeliveryGateway deliverySystem) {
        this.deliveryNumber = deliveryNumber;
        this.deliverySystem = deliverySystem;
    }
    public boolean requestDispatchStop() {
        return deliverySystem.requestDispatchStop(deliveryNumber);
    }
}
