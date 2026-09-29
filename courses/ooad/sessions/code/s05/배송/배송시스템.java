package 배송;

// 배송 경계가 소유하는 요청 인터페이스. 배송 연동이 구현한다.
public interface 배송시스템 {
    boolean 출고중단을요청한다(String 배송번호);
}
