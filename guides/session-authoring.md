# Session Authoring Guide

## 입력

- `courses/<course>/course-design.md`
- 필요시 `references/sw-engineering/**`(일반 참고 자료)

다른 semantic source는 없다.

## 결과

Session Source — 실제 교육에 필요한 내용을 직접 포함하는 최종 저작물. 다음을 포함할 수 있다.

설명, 정의, 사례, 비교, 반례, 코드, 표, UML, Diagram, Chart, Image reference.

## 원칙

- Session Authoring은 자유로운 저작 작업이다. Human과 LLM의 대화로 완성한다.
- 중간 DD나 authoring sheet 같은 별도 산출물을 만들지 않는다. Session Source 자체가 결과물이다.
- Renderer가 새로운 semantic 판단을 해야 한다면 Session Source가 불완전한 것이다 — 필요한
  의미는 이미 Session Source에 결정되어 있어야 한다.
- Production을 위해 내용 자체를 축약하거나 왜곡하지 않는다. Production은 표현만 담당한다.
- 고정 슬라이드 구조, 필드별 길이 제한, 정형 teaching pattern을 강제하지 않는다. Workflow는
  표준화하되 저작 사고는 표준화하지 않는다.

## Visual tool 선택

- UML → PlantUML
- 일반 구조/흐름/관계 → Mermaid
- 정량 Chart → Python/matplotlib

이 매핑은 저자의 기본 선택 기준이지, Session Source의 표현을 이 세 도구로만 강제하는 규칙은
아니다. 사진·스크린샷처럼 이 방식이 부적절한 자료는 Image로 직접 포함한다.

## 완료 기준

Session Source를 그대로 Production에 넘겼을 때 Production이 어떤 새로운 의미 판단도 하지
않고 완성된 PPTX를 만들 수 있으면 Session Authoring이 끝난 것이다.
