package delivery;

public final class Delivery {
    private final String deliveryNumber;
    private final String carrier;
    private final DeliverySystem deliverySystem;

    public Delivery(String deliveryNumber, DeliverySystem deliverySystem) {
        this(deliveryNumber, "REGULAR", deliverySystem);
    }
    public Delivery(String deliveryNumber, String carrier, DeliverySystem deliverySystem) {
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
