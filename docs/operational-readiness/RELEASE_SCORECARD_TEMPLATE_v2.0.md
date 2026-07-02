# v2.0 Release Scorecard Template

Purpose: make every release decision evidence-based.

Use this scorecard for every future release: controlled beta, public launch, and later major releases.

| Category | Status | Evidence | Verification method | Owner action | Rollback or recovery requirement | Exit criteria |
|---|---|---|---|---|---|---|
| Architecture | Planned | Reference document and architecture scope. | Confirm no unreviewed architecture changes are included. | Link current architecture docs. | Revert or defer unreviewed architecture changes. | Architecture is stable and understood. |
| Implementation | Planned | Source code, file list, change log. | Review changed files against release scope. | Link implementation evidence. | Revert or disable unsafe changes. | Implementation matches approved scope. |
| Automated Verification | Planned | Test logs, build logs, type-check logs. | Run required tests and inspect failures. | Attach latest logs. | Failed tests block release until resolved or explicitly waived by authorized owner. | Required checks pass. |
| Human Review | Blocked | Manual QA notes, reviewer findings, sign-off or rejection. | Reviewer exercises real flows and records findings. | Assign reviewer and complete review. | Human review failure pauses release. | Manual review is complete and accepted. |
| Operational Readiness | Blocked | Staging verification, monitoring, logging, backup, rollback, incident, support evidence. | Complete operational checklists. | Assign owners and complete validation. | Rollback/recovery paths tested. | Operations can support real users. |
| Documentation | In Progress | README, operating docs, admin docs, source archive docs, boundary docs, launch docs. | Audit docs for current release. | Update or link required docs. | Inaccurate docs are corrected before release. | Operators and users have enough guidance. |
| Approval | Blocked | Release approval record with scope and conditions. | Compare approval to scorecard and evidence package. | Obtain authorized approval. | Approval can be revoked if evidence changes. | Release decision is explicit, dated, and scoped. |

## Decision Summary

Release candidate:

Decision:

- [ ] Go
- [ ] Conditional Go
- [ ] No-Go

Conditions:

Evidence package location:

Approver:

Date:

## Current v2.0 Standing

Architecture: Verified for current foundation, no new architecture added in v2.0.

Implementation: Verified for current foundation through v1.6 local evidence; no new product implementation added in v2.0.

Automated Verification: Verified in v1.6; rerun required before any beta decision.

Human Review: Blocked.

Operational Readiness: Blocked.

Documentation: In Progress.

Approval: Blocked.

Overall: **No-Go**.

