package 배송연동;

// 배송 시스템이 정한 요청 형식. 이 형식은 배송 연동 밖으로 나가지 않는다.
public interface 배송시스템API {
    String 요청(String 명령, String 배송번호);
}
