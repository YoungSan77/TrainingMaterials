package 배송;

public final class 배송 {
    private final String 배송번호;
    private final 배송시스템 배송시스템;

    public 배송(String 배송번호, 배송시스템 배송시스템) {
        this.배송번호 = 배송번호;
        this.배송시스템 = 배송시스템;
    }
    public boolean 출고중단을요청한다() {
        return 배송시스템.출고중단을요청한다(배송번호);
    }
}
