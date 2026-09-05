# Shared Modeling Conventions

> UML/Larman의 공통 선택·표현 기준이다. Reference의 존재는 teaching scope가 아니며 각 Course/Curriculum/DD가 필요한 subset과 depth를 선택한다.

- **Canonical-first:** formal notation은 shared canonical reference를 우선한다.
- **Minimal representation:** notation 하나를 가르칠 때 불필요한 주변 요소를 넣지 않고, 통합 질문에만 여러 notation을 조합한다.
- arrow·diamond·box를 장식으로 쓰지 않으며 visual symmetry보다 semantic accuracy를 우선한다.
- 관계·구조·시간·상태를 보여 줄 visual value가 있을 때 diagram을 쓰고, 아니면 text를 우선한다.
- Shared reference는 language를, course-local reference는 선택한 example/instance와 제한을 소유한다.
- Conceptual Class와 Design Class를 동일시하지 않는다. Domain Model에는 operation, DB table, API/DTO, framework detail을 넣지 않는다.
- 의미 있는 association만 남기고 단순 값은 attribute로 둔다. multiplicity와 navigability는 의미가 있을 때만 명시한다.
- aggregation은 shared whole–part 의미가 명확할 때만, composition은 강한 lifecycle ownership이 있을 때만 쓴다.
- return message는 필요할 때만 쓴다. Activity Diagram을 의미 없는 Process Flowchart 대용으로 쓰지 않는다.
- logical component structure와 physical deployment structure를 혼동하지 않는다.

Aggregate/Root, Entity, Value Object, Bounded Context/Context Map, Service Boundary, API/Event topology와 MSA-specific deployment convention은 향후 domain owner의 extension scope다.
