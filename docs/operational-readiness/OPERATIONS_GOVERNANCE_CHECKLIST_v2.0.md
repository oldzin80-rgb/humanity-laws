# v2.0 Operations & Governance Checklist

Purpose: prove people can responsibly operate, review, support, approve, and recover the system.

Status language: Planned, In Progress, Verified, Blocked.

| Item | Status | Objective | Required evidence | Verification method | Owner action | Rollback or recovery requirement | Exit criteria |
|---|---|---|---|---|---|---|---|
| Internal alpha | Planned | Test with a small trusted group before beta. | Alpha invite list, test plan, feedback log, issue triage. | Run alpha sessions and review feedback daily. | Select alpha users and prepare instructions. | Alpha access can be revoked quickly. | Alpha findings are logged, prioritized, and resolved or accepted. |
| Controlled beta | Blocked | Open to limited members only after operational evidence exists. | Beta plan, capacity limit, acceptance criteria, support owner, launch approval. | Review all v2.0 scorecard categories before enabling beta. | Draft beta plan after staging evidence exists. | Beta pause/disable procedure documented. | Beta is approved only by documented Go decision. |
| Incident response | Blocked | Respond quickly to safety, privacy, payment, auth, or outage incidents. | Incident runbook, severity levels, contacts, escalation steps, postmortem template. | Tabletop exercise and sample incident drill. | Assign incident commander/backup. | User communication and service disable paths documented. | Team can classify, respond, communicate, and recover. |
| Support procedures | Planned | Give users a clear way to ask for help and report issues. | Support channel, response targets, issue categories, escalation rules. | Submit test support requests and verify response workflow. | Define support inbox/process and owner. | Support fallback and emergency routing documented. | Support requests are received, tracked, and escalated correctly. |
| Release governance | Blocked | Prevent launch without proper evidence and approval. | Release approval record, scorecard, evidence package, sign-off. | Review scorecard and launch gate before any release. | Name release approver and approval format. | Release rollback and revocation process documented. | Release cannot proceed without documented approval. |
| Operational ownership | Blocked | Make sure every system has a responsible human owner. | Ownership matrix for hosting, auth, database, payments, monitoring, support, incidents, security. | Review matrix and confirm owners accept responsibility. | Assign primary and backup owners. | Backup owner and handoff procedure documented. | No critical system lacks owner and backup. |
| Manual review process | Blocked | Add human review evidence before beta/public launch. | Manual QA checklist, reviewer notes, dated completion record. | Reviewer walks all key flows and signs evidence record. | Assign reviewer and complete checklist. | Unsafe findings pause release until resolved. | Manual review evidence exists and is linked in evidence matrix. |
| Admin operating guide | Planned | Teach admins how to review evidence honestly and safely. | Admin guide, review workflow, escalation rules. | Admin performs sample review with guide. | Draft and review admin guide. | Admin access revocation documented. | Admin can operate without guessing. |
| Privacy and memory governance | Planned | Ensure memory consent, export, deletion, and retention are governed. | Memory policy, retention rules, deletion verification, data access rules. | Exercise consent/export/delete and inspect persistence. | Write operational policy and assign data owner. | Memory purge and account deletion process documented. | Memory behavior is legally and ethically supportable for beta. |
| Professional-boundary governance | In Progress | Keep high-risk guidance inside safe boundaries. | Boundary policy, test results, reviewer notes, escalation wording. | Review high-risk transcripts and UI copy. | Assign reviewer for medical/legal/financial/mental-health boundary language. | High-risk feature disable/fallback documented. | No high-risk path presents as licensed service replacement. |
| Founder/source governance | In Progress | Preserve source provenance and avoid unreviewed claims. | Source archive docs, hash evidence, quote provenance, founder-content provenance rules. | Inspect source registry and archive references. | Maintain provenance records for future founder data additions. | Incorrect source can be removed or quarantined. | Source-backed claims remain traceable. |

## Current Governance Summary

Verified locally:

- Public governance covenant exists.
- Professional boundaries are documented and tested.
- Launch gate remains false.
- Source archive hash and quote provenance are verified.

Blocked for controlled beta:

- Manual review evidence.
- Release approval evidence.
- Operational owners.
- Incident runbook and drill.
- Support workflow.
- Staging/admin protection evidence.

