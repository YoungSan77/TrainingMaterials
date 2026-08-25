# Governance v2.2.2 Migration Report

> 이 문서는 정본이 아니다. `program-governance-current-working-set-with-ooad-spec.zip`(00_MANIFEST.md 기준, 01~21) 편입 작업 기록이다.
> 이전 세대 기록은 [governance-v2-review.md](governance-v2-review.md)·[governance-v2-migration-report.md](governance-v2-migration-report.md)(v2.0 세대, historical)를 참조 — 이 문서가 그 후속이다.

---

## 1. 입력

ZIP의 00_MANIFEST.md가 명시한 우선순위(01~10 Governance → 해당 Course Spec/Audit → 기존 curriculum/source → Handoff prompt)와 "Governance Freeze"·"Superseded/Excluded" 원칙을 그대로 따랐다. 사용자가 이번 턴에서 8개 항목으로 확정한 결정([아래 §2](#2-확정-결정-반영))을 실행 근거로 삼았다.

---

## 2. 확정 결정 반영

| # | 결정 | 반영 |
|---|---|---|
| 1 | 세션 시작 전 uncommitted 3파일 보호 + 외부 backup | §7 참조. 수정 없음, md5 대조로 확인 |
| 2 | v2.0 세대 program-design은 기계적 merge 없이 v2.2.2로 전체 교체 | §3 Applied |
| 3 | Course Spec 위치 = `program-design/course-specs/{ooad,ddd,sw-architecture,msa,ai-native}.md` | §3 Applied |
| 4 | `courses/swqm/`은 무수정, legacy/unresolved로 기록만 | §5 |
| 5 | 옛 concept-ownership-map §14(LLM 트랙 격리 불변식)는 superseded, 임의 이식 금지 | §4 |
| 6 | 20/21 prompt 파일은 저장하지 않음 | §6 |
| 7 | 10/19 → decisions/, 기존 v2.0 기록은 historical로 보존 | §3 Applied |
| 8 | 11/12/18은 이번 Phase에 미적용, 배치안만 보고 | §5 |

---

## 3. Applied — 실제 반영한 파일

**Phase A — program-design/ 루트 (ZIP 01~09, verbatim, `diff`로 byte-identical 확인)**
```
reference-frame.md                     ← 01_reference-frame.md
principles.md                          ← 02_principles.md
terminology.md                         ← 03_terminology.md
concept-ownership-map.md               ← 04_concept-ownership-map.md   (v2.0 세대 및 내가 넣었던 구 §14 전체 교체)
cross-course-framework.md              ← 05_cross-course-framework.md      (신규)
course-spec-template.md                ← 06_course-spec-template.md        (신규)
evidence-source-localization-policy.md ← 07_evidence-source-localization-policy.md  (신규)
sw-architecture-canon-stance.md        ← 08_sw-architecture-canon-stance.md  (신규)
portfolio/course-catalog.md            ← 09_course-catalog.md              (신규 하위 디렉터리)
```

**Phase B — program-design/course-specs/ (ZIP 13~17, verbatim)**
```
ooad.md            ← 13_ooad-course-spec.md
ddd.md              ← 14_ddd-course-spec.md
sw-architecture.md  ← 15_sw-architecture-course-spec.md
msa.md              ← 16_msa-course-spec.md
ai-native.md         ← 17_ai-native-course-spec.md
```
`ai-native.md`는 courses/ai-assisted/ + courses/agentic/ 두 physical directory에 대응하는 **미래 목표 course architecture**다. `courses/<course>/course-spec.md` 방식을 쓰지 않은 이유(사용자 확정): AI-Native는 단일 physical directory가 없다.

**Phase C — program-design/decisions/ (ZIP 10, 19, verbatim)**
```
governance-quality-gate-v2.2.2.md          ← 10_governance-quality-gate.md
six-course-architecture-completion-review.md ← 19_six-course-architecture-completion-review.md
```

**Phase D — 참조 무결성 최소 수정 (semantic rewrite 아님)**
- `program-design/canon-stance.md`: 제목·intro·범위 설명·개정 규율 4곳에서 "6과정(OOAD·SW 아키텍처·DDD·MSA·AI-assisted·Agentic)" 하드코딩을 "현재 Engineering Portfolio(과정 수·이름은 portfolio/course-catalog.md가 관리)"로 완화. TEXT/SHORT/REBUTTAL/HORIZON 등 인용 원문은 **한 글자도 바꾸지 않았다**.
- `program-design/authoring-convention.md`: `concept-ownership-map.md`의 "LLM 트랙 격리 불변식" 절을 인용하던 2곳(§2, §5)만 수정 — 그 절이 v2.2.2에서 사라졌음을 명시하고, 동일 목적(정본은 과정을 모른다/과정이 정본을 안다)을 달성하는 `cross-course-framework.md` §1 Governance Layers를 대체 인용으로 사용(§4 참조). **R&R(§3-c)·pptx 관리(§3-b) 본문은 지시대로 손대지 않았다.**
- `program-design/README.md`: 새로 추가된 9개 파일(§Phase A/B/C)을 index에 반영, "5개 과정" 하드코딩 문구를 portfolio-agnostic 표현으로 완화.

---

## 4. Superseded — 폐기/대체된 legacy 결정

### 4-1. 옛 `concept-ownership-map.md` §14 "LLM 트랙 격리 불변식"

이전 세션(v2.0 편입)에서 내가 직접 이 문서에 추가했던 절이다. ZIP의 04(v2.2.2)는 이 번호(§14)를 이미 "Scalable Concept Registry"라는 **다른 내용**으로 쓰고 있어 그대로 두면 번호·내용이 모두 충돌한다.

사용자 결정에 따라:
- 옛 §14 내용을 새 파일로 **이식하지 않았다**.
- 동일 목적(과정 간 문서가 서로를 지목하지 않는 단방향 참조 규율)을 이미 달성하는 조항이 있는지 확인한 결과, `cross-course-framework.md` §1 Governance Layers(`Program Governance ↓ Course Portfolio ↓ Course Architecture ↓ Curriculum`)가 같은 "위 layer는 아래를 모른다" 패턴을 일반화된 형태로 담고 있어 이를 대체 참조로 사용했다(`authoring-convention.md` §2·§5).
- 옛 §14의 정확한 원문(6과정 시절 "AI-assisted·Agentic를 앞 4과정 문서에서 지목 금지" 같은 구체 규정)은 이 절보다 세밀했다 — 그 구체성은 v2.2.2에 대응물이 없다. **완전한 동치가 아니라 "같은 목적의 상위 원칙으로 대체"임을 명시해 둔다.** 필요하면 향후 course-spec 작업에서 더 구체적인 형태로 재도입할 수 있으나, 이번 Phase에서는 임의로 만들지 않았다.

### 4-2. program-design/의 v2.0 세대 4파일 본문

`reference-frame.md`·`principles.md`·`terminology.md`·`concept-ownership-map.md`의 v2.0 본문 전체가 v2.2.2로 교체됐다. Git history로만 보존된다(이전 커밋 없음 — 세션 내 uncommitted 상태였으므로 `program-design-before-v2.2` backup 디렉터리로 별도 보존, §7 참조).

---

## 5. Deferred — 이번 Phase에 적용하지 않은 것

### 5-1. `courses/swqm/` — Portfolio 관계 미결정

`courses/qm/QM_커리큘럼.md`(v4.3, 16세션)는 `18_modern-qm-canon-audit.md`가 감사한 대상과 세션 수·구조·핵심 문제(S07 DDD/AI ownership 침범 등)가 일치해 새 Governance의 **"Modern QM"**에 대응하는 것으로 보인다.

반면 `courses/swqm/swqm_커리큘럼.md`("현대적 SW 품질관리", 11세션, 완전히 다른 서사·용어 체계 — "영역"이라는 별도 용어 규칙 사용)는 ZIP 01~21 어디에도 언급이 없다. `courses/qm/`과 `courses/swqm/`이 동시에 "SW 품질관리"를 자처하는 상태다.

**처리:** 수정·삭제·rename·merge 전부 하지 않았다. Modern QM Canon/Curriculum 작업 대상에도 포함하지 않았다. `courses/qm/`와의 관계(후속 버전인지, 병렬 대안인지, 폐기 대상인지)는 **미결정 legacy로 기록만 한다** — 다음 결정 필요.

### 5-2. 11 `ooad-curriculum-audit-revision-directive.md`

`courses/ooad/ooad-curriculum.md`의 REVISE 지시서. 이 파일은 세션 시작 전부터 uncommitted 상태였고(§7), 이번 지시서가 정확히 그 파일을 타깃으로 한다 — **기존 in-flight 편집과 신규 지시가 겹칠 위험이 가장 큰 지점**이다. curriculum/engine에 적용하지 않았다.

**배치안(승인 대기, 실행 안 함):** `program-design/course-specs/ooad-curriculum-audit.md` 또는 `program-design/decisions/ooad-curriculum-audit-revision-directive.md`. 후자를 권장한다 — course-spec(현재 상태 정의)이 아니라 curriculum 개정을 지시하는 **결정 문서**이기 때문이다.

### 5-3. 12 `ooad-verified-principles-quotes.md`

OOAD quote 자산 후보(Q01~Q09, HOLD 3건). 현재 `engine/quotes.js` 스키마(`id/grade/sessions/ko/en/author/src/url`)와 이 문서의 필드(`ko/en/author/source/locator/status`)가 다르다 — `grade`(PRIMARY/WIDELY-CITED, 검증 신뢰도)와 `status`(original/attributed, 원전/귀속 축)는 서로 다른 개념이라 자동 매핑이 안 된다. quote schema는 이번 Phase 수정 금지 대상이라 반영하지 않았다.

**배치안(승인 대기, 실행 안 함):** `program-design/course-specs/ooad-verified-quotes.md`(reference 자산 — course-spec과 별개 파일로 course-specs/ 안에 두거나, 스키마 결정 전까지는 `program-design/decisions/`에 둔다).

### 5-4. 18 `modern-qm-canon-audit.md`

`courses/qm/QM_커리큘럼.md`에 대한 MAJOR REFINE 감사(§07/10/11/12/14/15 ownership 위반, DORA freshness 등). qm curriculum은 이번 Phase 수정 금지 대상이라 반영하지 않았다.

**배치안(승인 대기, 실행 안 함):** `program-design/decisions/modern-qm-canon-audit.md` — course-spec이 아니라 기존 curriculum에 대한 감사/개정 지시라 11번과 같은 성격.

### 5-5. 20/21 Prompt 파일

`20_prompt-for-claude.md`(Claude 작업 지시), `21_prompt-for-claude-code.md`(Claude Code 작업 지시) — 외부 handoff instruction으로 판단해 **repository에 저장하지 않았다**. 두 파일 모두 임시 scratchpad(`/private/tmp/.../scratchpad/govzip/`)에만 남아 있으며 세션 종료 시 함께 사라진다.

---

## 6. Preserved — 의도적으로 수정하지 않은 것

- `courses/**`, `engine/**`, `test/**`, `guides/**`, 루트 `README.md` — 전체 무수정.
- `program-design/authoring-convention.md`의 R&R(§3-c)·pptx 관리(§3-b) 본문 — 참조 메타데이터 문구를 제외한 본문은 그대로.
- `program-design/{order-domain-definition,clean-layer-convention,sw-lab-environment-setup,open-issues}.md` — 무수정. ZIP 대응 문서 없음.
- `program-design/decisions/{governance-v2-review,governance-v2-migration-report}.md` — v2.0 세대 historical record, 무수정.
- quote schema(`engine/quotes.js`), golden snapshot(`test/__snapshots__/geometry.json`) — 무수정.
- `courses/ai-assisted/`·`courses/agentic/` physical structure — 무수정, 병합하지 않음.
- `courses/qm/`, `courses/swqm/` curriculum 내용 — 무수정.

---

## 7. Backup / 보호 확인

작업 시작 전 다음을 repository 밖(`/private/tmp/claude-501/.../scratchpad/pre-v2.2-backup/`)에 보존했다:
- `git-status.txt`, `git-status-porcelain.txt`, `git-diff.patch`, `git-diff-stat.txt`
- `program-design-before-v2.2/` — v2.2 반영 직전 program-design/ 전체 스냅샷
- `protected-files-snapshot/` — 3개 보호 파일의 사본
- `protected-files.md5` — 3개 보호 파일의 작업 전 md5

작업 후 아래 3개 파일의 md5를 재확인해 무수정을 증명한다(§F 참조):
```
courses/ooad/decks/01.js
courses/ooad/ooad-curriculum.md
guides/커리큘럼_작성_지침.md
```

---

## 8. Technical Impact

- engine/renderer/test 무수정 — import/path 의존성 깨짐 없음.
- 새 `program-design/portfolio/`, `program-design/course-specs/` 하위 디렉터리는 순수 문서이며 어떤 코드도 참조하지 않는다.
- `npm test` 결과는 §E(완료 보고 본문)에 기록한다.
