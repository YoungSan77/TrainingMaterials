# Repository Operating Guide

## Purpose

This repository is a governed curriculum-authoring and presentation-generation system.

Its primary artifacts are course portfolio governance, course design/context, curricula,
teaching sources, presentation decks, and the validation/rendering engine that checks
and produces those artifacts.

Do not treat this as a generic software application repository. Software under `engine/`
exists mainly to enforce authoring, traceability, presentation, and quality contracts.

## Authority and Roles

Use path and artifact roles to determine authority. A live artifact may explicitly
reference historical or migration material as input without transferring ownership.

1. `portfolio/`
   - Current portfolio-level governance.
   - Owns portfolio principles, terminology, concept ownership, evidence policy,
     cross-course rules, shared cases, and portfolio-wide constraints.

2. `courses/<course>/design/`
   - Owns the normative target: course purpose, learner context, capability gaps, scope,
     intended ownership, and target structure.

3. Actual course curriculum artifact
   - Owns the implemented state: sessions, timing, topic allocation, and claims.
   - Identify it using existing course conventions and engine discovery behavior where
     applicable; do not assume a fixed filename.
   - Differences from course design are target-versus-current divergence, not a simple
     authority override. Surface them; do not silently rewrite the curriculum to match.

4. `courses/<course>/sources/`
   - Contains teaching exposition, examples, and deeper instructional material where present.

5. `courses/<course>/design/references/`
   - Contains formal evidence, provenance, and verified-source artifacts where present.
   - Do not merge or substitute its role with `sources/` by assumption.

6. `courses/<course>/decks/`
   - Owns valid slide-level content wording and realization of curriculum claims.
   - Deck content must remain within engine-enforced contracts.

7. `engine/`
   - Owns executable schema, validation, geometry, and rendering contracts.

Historical and migration material:

- `context/course-portfolio-unified-v2.6/`
  is frozen migration input and provenance. Consult it when a current live guide explicitly
  requires migration or reference input, but never treat it as a competing live owner after
  its content has been absorbed into live artifacts.

- `program-design/`
  is historical design/decision material unless a current authoritative artifact
  explicitly references a specific item.

When roles conflict beyond the target-versus-current case above, do not invent a rule.
Identify the conflict and preserve the applicable live owner until it is resolved.

## Working Rules

- Preserve existing functionality and content unless the task explicitly requires change.
- Make the smallest change that satisfies the task.
- Do not perform cosmetic restructuring unless it improves correctness or maintainability.
- Do not duplicate governance content into operational files.
- Follow portfolio terminology and concept-ownership rules.
- Respect One Concept–One Owner and the defined consumer roles where applicable.
- Keep vendor, framework, tool, model, UI, and API specifics from becoming the curriculum spine.
- Keep LLM-related guidance vendor/model independent unless a task explicitly requires otherwise.
- Treat curricula as protected assets. Surface discrepancies instead of silently rewriting them.
- Distinguish current implementation, target design, historical material, and known gaps.
- Prefer existing owner documents over creating new governance or status documents.
- If a deterministic rule can be enforced by code, prefer fixing the owning code rather than
  documenting the defect as an agent instruction.

## Validation

Before considering a change complete:

- Inspect the relevant Git diff.
- Run the narrowest applicable validator first.
- For deck work, use `engine/verify.js` with the explicit deck path.
- Run broader validation only when the change can affect broader contracts.
- Treat validation errors as blockers.
- Treat warnings as items requiring explicit judgment; do not suppress them merely to obtain a clean report.
- Do not commit generated PPTX output unless a current repository rule explicitly requires it.
- After agent work, verify that no unintended files were created, modified, renamed, moved, or deleted.

## Do Not

- Do not create a second source of truth for material already owned by `portfolio/`,
  course design documents, curricula, sources, decks, or engine code.
- Do not copy large terminology tables, ownership matrices, course catalogs, session lists,
  detailed slide schemas, evidence definitions, or historical narratives into this file.
- Do not treat `context/course-portfolio-unified-v2.6/` as a competing live authority.
- Do not treat `program-design/` as current authority by default.
- Do not infer missing policy from conventional software-project practice.
- Do not change unrelated files while fixing a local issue.
