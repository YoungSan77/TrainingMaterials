# Repository Operating Guide

## Purpose

TrainingMaterials is a governed curriculum-authoring and presentation-generation system. Software under `engine/` exists to validate and render educational artifacts.

## Authority

- `portfolio/governance.md` owns workflow, stage contracts, authority, lifecycle and release rules.
- `REPOSITORY_MANIFEST.md` registers persistent artifacts and lifecycle status.
- Other `portfolio/` documents own the common concern named in Governance.
- `courses/<course>/course-design.md` is the current Curriculum Guardrail for that course.
- An approved Curriculum owns Session, claim, time, learning flow and input routing.
- A Deck owns slide-level teaching realization.
- `engine/` owns executable schema, validation, geometry and rendering behavior.
- The three files under `guides/` are controlled stage annexes, not independent workflow owners.

When rules conflict, follow `portfolio/governance.md`. For executable schema, geometry and rendering behavior, follow the Engine and report documentation drift.

## Working Rules

- Start from the current stage Guardrail and complete only the requested stage.
- Preserve One Fact, One Owner; consumers reference owners instead of copying common rules.
- Do not use historical artifacts, deleted paths, prior Curricula or Decks as live authority unless the user explicitly requests historical analysis.
- Do not create storyboard, semantic IR, slide-plan, session source, migration archive or another intermediate SSOT.
- Do not treat current file layout as a target architecture constraint.
- Keep LLM guidance vendor and model independent unless explicitly required.
- Update `REPOSITORY_MANIFEST.md` in the same change when a persistent artifact is created, deleted, moved, renamed, or changes owner, role or lifecycle.
- Preserve unrelated user changes and make the smallest change that satisfies the task.

## Validation

- Inspect the relevant Git diff and unintended file changes.
- Run the narrowest applicable deterministic check first.
- For Deck work, run the current explicit Deck verifier before broader regression checks.
- Treat errors as blockers and warnings as items requiring explicit judgment.
- Distinguish deterministic checks from semantic and human review.
- Do not commit generated PPTX output unless repository policy explicitly designates it as a regression baseline.
