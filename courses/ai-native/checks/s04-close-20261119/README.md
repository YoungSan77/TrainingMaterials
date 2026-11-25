# S04 교정 마무리·정식 반영 — 2026-11-19

대상 `courses/ai-native/sessions/s04`, 브랜치 `migration/portfolio-v2.6-absorb`. 사용자가 승인한 13절 표의 한 행을 수정하고, 수정 원고에서 후보 PPTX/QA를 생성·렌더·검증한 뒤 **검증한 그대로 정식 경로에 반영했다**. 커밋·푸시는 하지 않았다.

## 바꾼 행과 근거

`s04.md` **725행**, 「모델 규칙과 코드·테스트의 대응」 표의 ‘개념과 식별’ 행이다.

| 열 | 이전 | 최종 |
|---|---|---|
| 코드 | 타입 `Order`, 값 타입 `OrderNumber` | 값 타입 `ProductNumber`, `OrderItem.productNumber()` |
| 테스트에서 확인할 내용 | 결제 거절 후 재결제에서도 주문 번호가 같은지 확인한다. | **주문 항목에 기록된 상품 번호가 `PEN`인지 확인한다.** |

실제 `StaticModelTest.java` 15행은 `equal(new ProductNumber("PEN"), item.productNumber(), "상품 식별자 유지")`를 실행한다. 바꾼 코드 열과 문장은 이 검사에 정확히 대응한다. Java 테스트 파일은 변경하지 않았으며 기존 진입점으로 실행해 **18 checks PASS, external calls=0**을 확인했다.

원고 전체를 변경 전 사본과 대조해 **위 한 줄 외 변경 0개**를 확인했다. 따라서 17쪽의 재결제 사례에 있는 같은 주문 번호·금액 유지 기대 결과, 응답 별첨과 실행 원문도 그대로다. 업무 사례의 기대 결과를 Java에서 검사한 것으로 확대하지 않는다. 원고·테스트·업무 기대 결과의 비교 근거는 `publication.json`, `start.json`에 있다.

## 최종 판정과 검증

**Production PASS, 37장.** 자동 QA는 오류 **0개**, 원고 경고 **24개**다. 원고 경고와 SA 완료/콘텐츠 승인 상태는 Production 제작 완료와 구분했다. 남은 경고 전문을 `source-warnings.md`에 별도 기록했다.

PowerPoint에서 최종 후보의 **전 37장**을 새로 PDF/PNG로 내보냈다. PDF 전체 24표·421셀의 원문·경계·식별자 줄 분리 검사가 PASS이며 문제 0개다(`render.json`). 표와 뒤 설명의 겹침을 검사하는 native QA도 통과했다.

바뀐 23쪽을 새 이미지에서 직접 확인했다. 나머지 36장 PNG는 직전 전 장 시각 검토본과 **바이트 단위 동일**하다. 슬라이드 XML도 23쪽만 달라졌다. 따라서 읽기 순서·도식·인용·실습·요약, 10절 검토 모델 문장 4개의 앞뒤 3pt, Java 내부 0pt 간격, 별첨 8pt 표 260셀·내용 기반 열 너비·왼쪽 우선 흐름·생략 표시가 유지된다. 4개 문장 속성과 Java/별첨 서식을 최종 후보에서 다시 전수 대조했다. `visual-verification.json`에 36개 이미지 해시와 변경 장 판정을 기록했다.

이번에는 renderer를 변경하지 않았다. 원고 한 행 수정이므로 S03·OOAD 재생성이나 renderer 전체 테스트를 반복하지 않았다. 다른 세션과 renderer/테스트·가이드 파일 **1,228개**의 해시가 시작 시점과 같음을 확인했다.

## 정식 반영 파일·해시

- 최종 원고: `courses/ai-native/sessions/s04.md`
- 원고 SHA-256: `744678f3e70e0f089d83aa479e970ab081c87609750c45ab2fd700bb6a927872`
- **정식 PPTX**: `courses/ai-native/sessions/s04.pptx`
- **정식 QA**: `courses/ai-native/sessions/s04.qa.json`
- PPTX SHA-256: **`c16507695edd55039163038a0328a7f9069f0e06bdbccc06a609b1154dc4f68e`**
- QA SHA-256: `fa3204d919f7d7005ef453e1621597ca21c641fd75cbeb1a8511191037346539`
- 검증 후보: `out/s04-close-20261119/s04-close-20261119.pptx`와 대응 `.qa.json`. 정식 반영 후 각각 후보와 SHA-256이 같다.
- 최종 PDF: `out/review/s04-close-20261119/s04-close-20261119.pdf`, 같은 폴더의 `p-01.png`~`p-37.png`.
- 교체 전 정식 파일: `out/s04-close-20261119/previous-official/s04.pptx`, `s04.qa.json`. 변경 전 원고 사본은 `out/s04-close-20261119/s04-before.md`다.

변경·생성 범위는 S04 원고 한 행, 정식 PPTX/QA, 이 폴더의 마무리 기록과 임시 생성/렌더 산출물이다. S01·S02 미커밋 변경, 승인 S03와 다른 세션은 보존했다. 남은 원고 경고는 숨기거나 면제하지 않았다.

생성 1회·전 장 렌더 1회. 변경 1장 시각 확인·나머지 36장 기존 전 장 시각 검토 이미지와 동일 확인.
