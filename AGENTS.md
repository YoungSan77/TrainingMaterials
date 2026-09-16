# Repository Operating Guide

## Rules

1. Course Design(`courses/<course>/course-design.md`)은 과정 수준 authority다.
2. Session Authoring은 `course-design.md`에서 시작한다. 다른 semantic source는 없다.
3. Production은 semantic content를 변경하지 않는다.
4. 기존 session/DD/curriculum artifact는 존재하지 않으며 다시 만들지 않는다.
5. `engine/production`은 presentation realization(레이아웃·페이지 분할·렌더링)만 담당한다.
6. UML → PlantUML.
7. 일반 구조/흐름/관계 → Mermaid.
8. 정량 Chart → Python/matplotlib.
9. Renderer가 새로운 의미 판단을 요구하면 authoring 문제이지 Renderer 문제가 아니다.
