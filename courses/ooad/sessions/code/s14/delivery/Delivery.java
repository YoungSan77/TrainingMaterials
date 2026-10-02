package delivery;

public final class Delivery {
    private final String deliveryNumber;
    private final String carrier;
    private final DeliveryGateway deliverySystem;

    public Delivery(String deliveryNumber, DeliveryGateway deliverySystem) {
        this(deliveryNumber, "REGULAR", deliverySystem);
    }
    public Delivery(String deliveryNumber, String carrier, DeliveryGateway deliverySystem) {
        this.deliveryNumber = deliveryNumber;
        this.carrier = carrier;
        this.deliverySystem = deliverySystem;
    }
    public String deliveryNumber() { return deliveryNumber; }
    public String carrier() { return carrier; }
    public boolean requestDispatchStop() {
        return deliverySystem.requestDispatchStop(deliveryNumber);
    }
}
