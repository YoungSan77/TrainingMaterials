# Production Guide

## 목적

Production은 최종 Session Source Markdown을 PowerPoint로 변환한다.

기본 흐름:

`Session Source Markdown → Production → PowerPoint`

Session Source가 Content authority이며, Production 제약 때문에 원고를 수정하지 않는다.

## SA와 Production의 검증 경계

- SA는 의미·사례 전제·계약·표기·출처를 검증한다. Production은 확정된 원고를 실제 PPT로 변환하고 글꼴·배치·분할·잘림·최종 표시 크기의 가독성을 검증한다.
- SA 원본 구조 확인이나 테스트 통과를 실제 PPT 검증으로 간주하지 않는다. Production 미실행은 SA의 내용 검토를 중단하거나 약화할 이유가 아니다.
- 교육 시간의 적합성은 최종 SA 완성 후 실제 강의·실습 운영을 기준으로 별도 평가한다. 시간이나 슬라이드 수에 맞추려고 Production이 내용을 축약하거나 제거하지 않는다.
- 렌더링 과정에서 인용문·수치·표준 관련 의문을 발견하면 원고 보완 피드백에 근거와 범위를 기록한다. Production이 출처나 문구를 추측해 고치지 않는다.

## 입력 / 출력

정상 실행 입력은 Session Source Markdown 파일 하나다.

```bash
node src/cli.js ../../courses/ooad/sessions/s01.md
```

일반 실행에서 별도 입력을 요구하지 않는다.

- `--title`
- `--source`
- `--template`
- `--output`
- `--layout`
- 기타 presentation metadata

출력은 입력 Markdown과 같은 디렉터리에 같은 basename으로 생성한다.

예:

`s01.md` → `s01.pptx`

## Session 명

모든 Session Source는 `guides/session-authoring-guide.md`의 형식에 따라 세션명을 포함한다.

```text
--------------------
Session 명: NN. 세션명
--------------------
```

Production은 이 값을 읽어 각 일반 슬라이드 우측 상단에 표시한다.

Session 명은 slide title, TOC item, body content가 아니다.

## 목차 생성 및 검증

Session Source의 `## 목차`는 `guides/session-authoring-guide.md`에서 정의한 수동 목차다. Production은 **이 목차의 항목과 순서를 그대로 사용하여 PPT 목차 슬라이드를 생성**한다. 본문 heading에서 목차를 새로 작성하거나 목차 제목을 임의로 고치지 않는다.

- `## 목차`와 본문 `## NN. 제목`의 번호·제목·순서를 1:1로 비교한다. 첫 항목 `01. 세션 목표`, 연속 번호, 중복·누락 여부도 검증한다.
- 일치하지 않으면 해당 항목과 불일치 내용을 보고하고, 원고를 묵시적으로 수정하거나 불일치를 감춘 PPT를 정상 완료로 판정하지 않는다. 사용자와 LLM이 Session Authoring에서 원고를 수정한 뒤 다시 검증한다.
- `## 목차`는 독립적인 내용 topic이 아니다. 목차가 한 슬라이드에 읽기 어렵게 들어가면 목차 슬라이드만 자연스럽게 분할하며 항목을 삭제하거나 축약하지 않는다.
- Topic 번호는 슬라이드 페이지 번호와 동일하지 않다. 본문과 continuation 슬라이드는 기존 pagination 원칙을 따른다.

## Visual authority

Production의 시각·배치·가독성 판단에는 이 지침이 우선한다. 현재 TrainingMaterials의 Production reference PPT는 승인된 기준선이 아닌 시각적 초안·참고자료다.

초안과 이 지침이 불일치하면 지침을 적용하고, 해당 슬라이드·항목, 불일치 내용과 처리 결과를 보고한다. 초안이 없거나 확인할 수 없어도 PPT 생성과 지침에 따른 검증은 계속한다. 이 경우 초안과의 비교만 `NOT VERIFIED`로 기록하며, 초안 미확인만으로 지침 준수 여부를 `NOT VERIFIED`로 처리하지 않는다.

Java → TM behavioral parity baseline은 regression 용도로만 유지하며 시각적 초안이나 이 지침을 대신하지 않는다.

## 기본 원칙

- Session Source의 내용과 순서를 보존한다.
- renderer 한계 때문에 원고를 삭제·왜곡·치환하지 않는다.
- 지원되지 않는 Markdown/visual type이 필요하면 Production을 확장한다.
- 내용이 한 장에 들어가지 않으면 자연스럽게 continuation slide로 분할한다.
- 짧은 마지막 문장이나 출처 하나만 별도 continuation으로 남지 않도록 실제 사용 가능 영역을 기준으로 pagination한다.
- clipping, overflow, content loss를 허용하지 않는다.
- 강사 노트는 presentation body와 분리한다.
- Mermaid, PlantUML, Chart, Image, 본문에 내장한 SVG 등 visual source는 최종적으로 실제 visual로 렌더한다. 원본 종류가 미지원이면 Production을 확장하며 ASCII나 소스 코드 출력으로 완료 처리하지 않는다.
- 사례의 가정·적용 범위·예외, 화살표의 의미, 계약의 사전·사후조건을 보존한다. 내용 분할 때문에 전제와 사례의 연결이 사라지지 않도록 한다.
- 인용문의 요약·발췌 여부, 시점·범위, 저자·문헌·직접 링크를 보존한다. 실제 확인 범위를 넘어 권위나 확실성을 강화하지 않는다.


## 블록 해석과 출력 보존

인용문·강사 노트·visual 표식의 경계는 `session-authoring-guide.md`의 「의미 표식과 블록 경계」를 따른다. fenced block 안의 heading·수평선은 구조 구분자로 해석하지 않는다. 강사 노트는 해당 topic의 발표자 노트에 보존하며 continuation에서도 필요한 노트의 연결을 유지한다. 본문 소제목이나 일반 `>` 블록을 인용문 또는 새 topic으로 추정하지 않는다.

출처 링크는 문헌명을 표시하고 클릭 가능한 hyperlink로 보존한다. 원시 URL 전체를 강제로 길게 노출하지 않으며 링크를 제거하지 않는다. 문헌명·재인용 표기·시점·표본 한계는 본문과 연결해 보존한다.

### 긴 표의 분할

- 표가 사용 가능 영역을 초과하면 행의 순서를 보존해 **행 단위**로 continuation 슬라이드에 나눈다. 각 분할 표의 상단에 **헤더(제목 행)를 반복**한다. 다중 헤더라면 의미를 이해하는 데 필요한 헤더 전체를 반복한다.
- 표의 제목·단위·교육용 가정·표본 한계가 각 분할 부분에 적용됨을 알 수 있게 연결한다. 열이나 행을 삭제·요약하거나 값을 변경하지 않는다.
- 단일 행도 한 장에 들어가지 않으면 글꼴을 임의 축소하거나 내용을 잘라내지 않는다. 가용 배치를 먼저 조정하고, 셀 내용의 의미 단위 continuation이 필요하면 행 식별자·열 헤더·이어짐을 반복해 원래 행과 대응시킨다. 의미 보존이 불가능하면 구체적인 원고 검토 항목으로 보고한다.

### 접근성 텍스트

- SVG의 `aria-label`, 유효한 `aria-labelledby` 참조, `<title>`·`<desc>`, Markdown 이미지의 대체 텍스트 등 원고의 접근성 정보를 최종 PPT 객체의 **Alt Text**에 보존한다.
- 같은 visual에 이름과 상세 설명이 함께 있으면 중복을 제거하되 서로 다른 정보를 잃지 않도록 결합한다. 상충하면 임의 선택하지 않고 보고한다. SVG를 raster로 바꿔도 대체 텍스트는 이미지 객체에 전달한다.
- 여러 객체로 분해하면 의미 있는 그룹 또는 대표 객체에 전체 설명을 연결하고, 중복 낭독을 피하도록 읽기 순서를 검토한다. 대체 텍스트가 없다고 임의 설명을 지어내거나 장식용으로 단정하지 않는다.
- S02 와이어프레임의 SVG `aria-label`도 이 규칙의 대상이다. PPT 객체에 값이 실제 보존됐는지 검사한다. 속성 복사만으로 스크린리더 사용성 전체를 검증했다고 판정하지 않는다.

## Typography 계약

Production은 Session Source의 의미 표식을 시각 표현으로 변환한다.

### 인용문

Session Source에서 인용문 그룹으로 명시된 직접 인용·번역·출처를 가진 요약은 다음 규칙을 따른다. 요약을 따옴표로 바꾸거나 영어 원문을 생성하지 않는다.

- 한글 번역 또는 한글 인용문: **18pt**
- 영어 원문: **10pt**
- 출처: **10pt**
- 영어 원문이 없는 인용문도 출처는 **10pt**다.
- 한글 번역, 영어 원문, 출처는 같은 인용문 그룹으로 유지하되, OOXML run 수준에서 글꼴 크기를 구분한다.
- 인용문 구분자나 authoring marker는 슬라이드 본문에 출력하지 않는다.

Anchor Message는 Production 전용 시각 타입이 아니다. Course Design의 Anchor Message는 Session Source 내용에 자연스럽게 반영되며, 별도 `앵커 메시지` 블록을 요구하거나 추정하지 않는다.

### 괄호

본문, 목차, 슬라이드 제목에 등장하는 모든 괄호 `(...)`는 한글·영어 내용과 관계없이 기준 폰트 크기에서 **-4pt**로 렌더링한다. 예외는 인용문의 영어 원문·출처(10pt) 영역으로, 이 영역의 괄호는 그대로 10pt를 유지한다.

### "라벨 — 설명" 한 줄 표현

본문·목차의 한 줄(bullet 포함)에서 주제를 별도 줄과 하위 bullet으로 나누지 않고 `라벨 — 설명` 형태로 한 줄에 담은 경우, 첫 `—` 이후 텍스트는 기준 크기에서 **-2pt**로 렌더링한다. `**bold**` 범위가 `—`를 걸쳐 있어도 bold marker가 손상되지 않게 처리한다.

### 슬라이드 제목

슬라이드 제목(topic heading)은 항상 **bold**로 렌더링한다.

## Visual layout 및 가독성

- Visual은 관계와 흐름을 읽기 쉽게 표현하는 것을 우선한다.
- 도식 내부 구성은 **왼쪽 → 오른쪽** 흐름을 기본으로 한다.
- 노드나 관계가 많아 한 줄이 지나치게 길어지면, 의미를 유지한 채 **2~3행으로 나누어 상하로 연결**한다.
- 세로로 길게 늘어진 도식은 특별한 의미가 없는 한 피한다.
- Production이 Session Source의 노드·관계·의미를 임의로 바꾸지는 않는다. 의미 재구성이 필요하면 Session Source 보완 대상으로 보고한다.
- 슬라이드에 삽입된 최종 표시 크기 기준으로 visual 내부 텍스트는 **목표 10pt**로 렌더링한다. 배치 가능 영역에 여유가 있어도 10pt를 넘겨 키우지 않는다.
- 10pt 크기가 배치 가능 영역을 넘치면 이미지 자체를 원래 크기의 **90%, 이어서 80%** 순으로 축소해 맞춘다. 이때 본문 텍스트나 페이지 분할은 바꾸지 않는다. 90%/80% 축소로도 배치할 수 없으면 그 시점에 continuation 또는 Session Source 보완 필요로 판정한다.
- Mermaid, PlantUML, Chart, Image에 같은 가독성 기준을 적용한다.
- 이미지 크기를 일률적인 비율로 고정하지 않는다.
- 본문과 visual의 배치는 내용량과 가독성을 기준으로 결정하며, visual 때문에 짧은 문장 하나가 불필요하게 continuation으로 밀리지 않도록 한다.
- 본문과 함께 배치하는 visual은 본문의 마지막 줄과 페이지 번호 사이 여백의 중앙에 위치시킨다. 본문에 바로 붙여 배치하지 않는다.
- 도식(Mermaid/PlantUML) 내부 라벨이 `제목 - 설명` 형태로 하나의 노드·참여자에 두 정보를 담을 때는 라벨의 첫 `-` 뒤에서 줄바꿈하고, `-` 이후 텍스트를 약 80% 크기로 렌더링한다.
- 도식 내부에서 노드·참여자·엔티티 등 그 자체가 주제인 라벨은 bold로 렌더링한다. 화살표 위의 흐름·메시지 설명 텍스트는 bold로 렌더링하지 않는다.

## 구현 시 알려진 함정

이 절은 renderer(`engine/production/src/`)를 수정하는 작업자를 위한 기록이다. 아래 두 항목은 실제로 재현·진단하는 데 상당한 비용이 든 결함이었다 — 같은 원인을 다시 찾지 않도록 남긴다.

### 빈 텍스트 박스는 PowerPoint가 파일을 조용히 손상 판정한다

OOXML의 `CT_TextBody`(`<p:txBody>`)는 문단(`<a:p>`)이 **최소 1개** 있어야 한다. 어떤 도형의 텍스트를 항목 목록으로 채우는 코드가 "항목이 0개면 반복문이 0번 실행되어 문단도 0개"가 되는 경우, 그 파일은 zip 무결성·XML well-formedness·relationship 무결성 검사를 전부 통과하지만 실제 PowerPoint는 열 때마다 "복구 필요" 대화상자를 띄우고 해당 도형을 조용히 제거한다. 에러 메시지가 구체적이지 않아 원인 추적이 매우 어렵다.

- 목차 오른쪽 컬럼처럼 항목 수가 0이 될 수 있는 곳(예: 항목이 왼쪽 컬럼에 다 들어가는 경우), 이미지만 있고 본문 텍스트가 없는 슬라이드처럼 "이 도형에는 표시할 문단이 없다"는 경우가 생기면, 빈 문단이라도 최소 1개(`<a:p/>`만으로 충분하다)는 반드시 남긴다.
- 이런 도형을 다루는 코드를 새로 추가하거나 수정할 때는 "항목 수 0" 케이스를 별도로 확인한다. 정상 콘텐츠(항목이 여러 개인 경우)만으로 테스트를 통과시키고 끝내지 않는다.
- python-pptx, xmllint, zip CRC 검사, JSZip round-trip은 이 결함을 잡지 못한다. 실제 PowerPoint로 열어보거나, 렌더링된 모든 `<p:txBody>`에서 `<a:p>`가 최소 1개인지 스캔하는 별도 점검이 필요하다.

### PlantUML(smetana 레이아웃)은 대부분의 간격 skinparam을 무시한다

`!pragma layout smetana`로 그리는 class/usecase/state 등 graph 계열 다이어그램은 그래프 배치를 위해 Graphviz 대신 자체 레이아웃 엔진(smetana)을 쓴다. `skinparam padding`, `nodesep`, `ranksep`, `RectanglePadding`, `UsecasePadding` 같은 일반적인 간격 조정 skinparam은 이 엔진에서 **대부분 아무 효과가 없다.**

- 실제로 도형 크기(예: usecase 다이어그램에서 시스템 경계 사각형을 액터보다 크게 보이게 하는 것)에 영향을 주는 것은 요소별 **글꼴 크기** skinparam(`rectangleFontSize`, `usecaseFontSize` 등)이다. 텍스트가 커지면 그 요소를 감싸는 도형도 커진다.
- 반대로 `skinparam padding` 같은 전역 여백 설정은 다이어그램 전체(액터 포함 모든 요소)의 픽셀 크기를 부풀리는데, 실제 텍스트 밀도는 그대로라 `naturalSize()`(builder.js)의 글자 크기 추정이 왜곡되고, 여러 다이어그램이 한 topic에 몰려 있으면 페이지 분량 예산을 넘겨 의도치 않게 continuation slide가 늘어날 수 있다. 도형 하나만 키우고 싶을 때는 전역 skinparam이 아니라 해당 다이어그램 소스 안에 요소별 skinparam을 넣어 범위를 좁힌다.
- 값을 바꾸면 반드시 실제로 렌더링된 PNG를 눈으로 확인한다 — 액터 라벨과 도형 테두리가 겹치는지, 페이지 수가 의도치 않게 늘었는지 둘 다 확인한다.

## 최종 Production 검증과 증거

이 절은 **실제 Production 실행 시** 적용한다. SA 내용 완료의 선행 조건이 아니다.

- 최종 PPTX를 대상으로 본문·인용문·표·visual·노트의 누락, 순서, 겹침, clipping, overflow, continuation 연결을 확인한다. 구조 검사와 실제 렌더 결과 검사를 함께 기록한다.
- 인용문 그룹 수는 입력 원고에서 다시 센다. 모든 그룹의 한글 18pt·영문 10pt·출처 10pt를 OOXML run 단위로 검사한다. 일부 표본 검사만으로 전체 통과를 선언하지 않는다. bold가 글꼴 크기를 덮어쓰지 않는지도 확인한다.
- visual 텍스트 목표 10pt는 **슬라이드에 배치한 최종 표시 크기**에서 판단한다. 소스의 font-size, PNG 해상도나 확대 화면만 보고 통과시키지 않는다. 배치 가능 영역을 넘쳐 이미지를 90%/80% 축소한 경우 그 축소된 최종 크기를 기준으로 판단한다.
- 측정에는 소스 좌표·글꼴 단위, 내부 transform, 이미지·viewBox의 실제 표시 영역과 최종 PPT 크기를 반영한다. 예를 들어 변환 없는 SVG에서 96px가 72pt로 해석되고 원본 폭 Wpx를 PPT 폭 Ppt에 균일 배치한다면 fpx 글자의 최종 크기는 `f × P / W`pt다. 중첩 변환·여백·비균일 축소가 있으면 이 단순식을 그대로 적용하지 않는다.
- raster 또는 윤곽선화된 글자처럼 정확한 원래 크기를 알 수 없는 경우 제작 기록과 배율을 확보한다. 근거 없이 OCR 높이를 글꼴 크기로 단정하지 않는다. 측정 불가능한 항목은 `NOT VERIFIED`로 남기고 시각 확인 결과와 구분한다.
- 판정은 `PASS`(확인된 충족), `FAIL`(확인된 위반), `NOT VERIFIED`(미실행·근거 부족)로 기록한다. 실패나 미확인 필수 항목이 있으면 전체 Production 검증 완료로 표시하지 않는다. 테스트 통과는 실제 가독성 통과를 대신하지 않는다.
- 입력·출력 파일의 실제 경로·수정 시각, 입력 식별 정보, 실행 시각, 최종 슬라이드 수, 사용한 renderer/버전, 슬라이드·객체 식별자, 측정값과 단위, 검사 방법·판정·근거를 입력과 같은 디렉터리의 `[basename]-production-check.md`에 남긴다. 렌더 증거를 저장했다면 실제 경로를 기록한다. 확인하지 않은 reference PPT 경로나 승인 상태를 지어내지 않는다.

## Session Authoring으로의 원고 보완 피드백

Production 검증에서 원고의 **내용·도식 구조·표기법**을 검토해야 하는 문제가 발견되면, 사용자와 LLM의 Session Authoring 논의에 사용할 **별도의 Markdown 피드백 문서**를 제공한다. 이 문서는 원고 수정 지시나 에이전트 간 자동 전달 절차가 아니다.

피드백 파일은 **입력 원고와 같은 디렉터리**에 `[basename]-feedback.md`로 생성한다. 예: `s02.md` → `s02-feedback.md`. 다른 세션의 피드백과 합치지 않는다. 재검토 시 해결·미해결 상태와 검토 시점을 갱신하며 수동 기록을 묵시적으로 덮어쓰지 않는다. 실행·렌더 검증 기록인 `[basename]-production-check.md`와 역할을 구분한다.

- 관련 Session Source, topic 번호·제목 및 해당 슬라이드(확인 가능한 경우)
- 발견된 문제, 판단 근거와 학습 내용·가독성에 미치는 영향
- Production 내부의 배치·크기·글꼴 조정으로 해결할 수 없는 이유 및 검토 가능한 대안
- 확인되지 않은 사항은 단정하지 않고 `NOT VERIFIED`로 표시

**사용자와 LLM이** 콘텐츠의 의미와 학습 목적을 기준으로 Session Source의 수정 여부를 결정한다. Production은 원고를 임의 수정하지 않는다. Production 자체의 렌더링·배치·글꼴 문제는 Production에서 해결하며 원고 보완 요청으로 전가하지 않는다. 원고 보완 항목이 없다면 빈 피드백 문서를 만들지 않는다.

## Regression

새 기능 추가 시 기존 Java behavioral baseline이 깨지지 않는지 확인한다.

`references/production/lecture-java-baseline/**`

## 하지 말아야 할 것

- Session Source를 renderer에 맞게 수정
- 일반 실행에서 presentation metadata 요구
- block type마다 기계적으로 별도 slide 생성
- visual source code를 최종 visual 대신 그대로 출력하고 완료 처리
- 테스트 통과만으로 visual 품질 PASS 판정
- 정해진 90%/80% 단계적 축소 절차를 거치지 않은 임의 축소로 가독성 기준 미달을 억지 수용
- 모든 visual을 기계적으로 한 방향 또는 한 크기로 강제
