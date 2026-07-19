# 코퍼스 인용 자산 (fixture) — 저장소의 실제 quotes.js 형식(계약)에 맞춘다.
# 6·7·9번 케이스가 이 자산과 대조된다. Q_ALPHA 하나면 충분하다.
# 헤더: - `ID` [GRADE] S##   /   필드: 들여쓰기 + 대문자 키(EN/KO/AUTHOR/SRC)

- `Q_ALPHA` [PRIMARY] S02
  EN: The alpha original sentence must be preserved verbatim.
  KO: 알파 원문 문장은 이대로 보존되어야 한다.
  AUTHOR: Q. Author
  SRC: Alpha Source (2000)

### S02. 코퍼스 세션
- **명제:** 명제 대조 케이스용. 이 절이 있으면 verify가 덱의 claim을 대조한다.
  - `C1` [현상] 코퍼스 명제 하나
