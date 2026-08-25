# Package Manifest — Unified Course Portfolio v2.6

> Generated from the current package structure. Do not hand-maintain a second inventory elsewhere.

## Release Structure

- Learner / Context and Foundational Lens authority: `support/01_governance/01_reference-frame.md` + `02_principles.md`
- Change / Extension workflow: `support/01_governance/09_portfolio-change-and-extension-protocol.md`
- File authority and numbering: `support/01_governance/08_portfolio-structure-and-authority.md`
- 11 Course Baselines: `courses/01_...` through `courses/11_...`
- Course Assets: course-scoped folders using the same `01–11` Course IDs
- Source Evidence: one current evidence file per Course ID
- Audit: one current release audit

## File Inventory (67 files including this manifest)

- `01_PACKAGE_MANIFEST.md`
- `00_README.md`
- `courses/00_MANIFEST.md`
- `courses/01_ooad.md`
- `courses/02_ddd.md`
- `courses/03_sw-architecture.md`
- `courses/04_msa.md`
- `courses/05_ai-native.md`
- `courses/06_swqm.md`
- `courses/07_agile.md`
- `courses/08_devops.md`
- `courses/09_project-management-pmbok8.md`
- `courses/10_sw-proposal.md`
- `courses/11_dt-to-ax.md`
- `support/00_MANIFEST.md`
- `support/01_governance/00_MANIFEST.md`
- `support/01_governance/01_reference-frame.md`
- `support/01_governance/02_principles.md`
- `support/01_governance/03_terminology.md`
- `support/01_governance/04_concept-ownership-map.md`
- `support/01_governance/05_cross-course-framework.md`
- `support/01_governance/06_course-spec-template.md`
- `support/01_governance/07_evidence-source-localization-policy.md`
- `support/01_governance/08_portfolio-structure-and-authority.md`
- `support/01_governance/09_portfolio-change-and-extension-protocol.md`
- `support/01_governance/10_course-catalog.md`
- `support/01_governance/11_governance-quality-gate.md`
- `support/01_governance/12_llm-integrated-practice-standard.md`
- `support/02_course-assets/00_MANIFEST.md`
- `support/02_course-assets/01_ooad/00_MANIFEST.md`
- `support/02_course-assets/01_ooad/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/01_ooad/02_course-design-reference-v2.1.md`
- `support/02_course-assets/02_ddd/00_MANIFEST.md`
- `support/02_course-assets/02_ddd/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/03_sw-architecture/00_MANIFEST.md`
- `support/02_course-assets/03_sw-architecture/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/04_msa/00_MANIFEST.md`
- `support/02_course-assets/04_msa/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/05_ai-native/00_MANIFEST.md`
- `support/02_course-assets/05_ai-native/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/06_swqm/00_MANIFEST.md`
- `support/02_course-assets/06_swqm/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/07_agile/00_MANIFEST.md`
- `support/02_course-assets/07_agile/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/08_devops/00_MANIFEST.md`
- `support/02_course-assets/08_devops/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/09_project-management/00_MANIFEST.md`
- `support/02_course-assets/09_project-management/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/09_project-management/02_pmbok8-40-process-map-v1.0.md`
- `support/02_course-assets/10_sw-proposal/00_MANIFEST.md`
- `support/02_course-assets/10_sw-proposal/01_llm-integrated-practice-pack-v1.1.md`
- `support/02_course-assets/11_dt-to-ax/00_MANIFEST.md`
- `support/02_course-assets/11_dt-to-ax/01_llm-integrated-practice-pack-v1.1.md`
- `support/03_source-evidence/00_MANIFEST.md`
- `support/03_source-evidence/01_ooad-source-evidence-v2.0.md`
- `support/03_source-evidence/02_ddd-source-evidence-v2.0.md`
- `support/03_source-evidence/03_sw-architecture-source-evidence-v2.0.md`
- `support/03_source-evidence/04_msa-source-evidence-v2.0.md`
- `support/03_source-evidence/05_ai-native-source-evidence-v2.0.md`
- `support/03_source-evidence/06_swqm-source-evidence-v2.0.md`
- `support/03_source-evidence/07_agile-source-evidence-v2.0.md`
- `support/03_source-evidence/08_devops-source-evidence-v2.0.md`
- `support/03_source-evidence/09_project-management-source-evidence-v2.0.md`
- `support/03_source-evidence/10_sw-proposal-source-evidence-v2.0.md`
- `support/03_source-evidence/11_dt-to-ax-source-evidence-v2.0.md`
- `support/04_audit/00_MANIFEST.md`
- `support/04_audit/01_portfolio-integrity-audit-v2.6.md`

## Release Notes

- Preserved Learner & Context Fit and five Foundational Decision Lenses from v2.4.
- Added `Global Baseline` as the portfolio-wide content sourcing standard.
- Reworked Evidence/Source/Localization governance around Evidence Role, Source Provenance, and Transferability rather than a single BP/source tier.
- Clarified that Primary/Official source status does not equal evidence strength or generalizability.
- Treated foundational/influential engineering books and long-running empirical research as valid major curriculum evidence according to their role.
- Kept international standards primarily as reference unless the standard itself is the Course Decision subject.
- Defined Local/System Constraint → Contextual Adaptation → Preferred State handling; BP/WP labels are optional and used only when educationally necessary.
- Added non-negotiable LLM/vendor/model/UI/API independence.
- Removed the ambiguous concept/source-quality adjective from Portfolio vocabulary and all course/support documents; `Canon` remains only for approved Portfolio/Course baseline authority.
- Replaced former uses contextually with `Foundational / Established / Authoritative / Reference / Core / Owner`.
- Removed product-specific LLM authoring dependency and generalized product-specific course examples.
- Reclassified AI-Native vendor references as replaceable implementation examples rather than the engineering baseline.
- Migrated all 11 Source Evidence Packs to a common v2.0 metadata schema: Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification.
- Added Global Baseline & Source Governance review to the mandatory Change & Extension Protocol.
- Final reviewer audit verdict: PASS; v2.6 approved as the current Portfolio Canon baseline, with only documented non-blocking future evidence-depth items.
