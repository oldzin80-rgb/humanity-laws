# v2.0 Evidence & Launch Control Checklist

Purpose: ensure every readiness claim is linked to objective evidence and that launch control cannot be bypassed.

Status language: Planned, In Progress, Verified, Blocked.

| Item | Status | Objective | Required evidence | Verification method | Owner action | Rollback or recovery requirement | Exit criteria |
|---|---|---|---|---|---|---|---|
| Evidence matrix | In Progress | Link every readiness criterion to proof. | Completed evidence matrix with file paths, dates, owners, and status. | Review each matrix row against source files/logs. | Maintain evidence matrix for v2.0. | Incorrect evidence is removed or reclassified. | No criterion marked Verified without objective evidence. |
| Risk register updates | In Progress | Keep known risks visible and tracked. | Updated risk register references, severity, owner, mitigation, status. | Review v1.6 risks and map them to v2.0 blockers. | Assign risk owners and review cadence. | Risk escalation path documented. | Critical/high risks are owned and blocked/resolved before beta. |
| Release checklist | In Progress | Convert launch readiness into actionable gates. | Release checklist with statuses and evidence links. | Review before alpha, beta, and launch decisions. | Keep checklist current. | Failed gate pauses release. | Checklist matches actual evidence, not assumptions. |
| Launch scorecard | In Progress | Summarize readiness across architecture, implementation, automated verification, human review, operations, docs, and approval. | Completed scorecard with evidence and decision. | Scorecard review meeting or written approval. | Fill scorecard for each release candidate. | Any failed category blocks release. | No category is complete without its required evidence. |
| Go/No-Go criteria | In Progress | Define objective release decisions. | Go/No-Go criteria document and decision record. | Compare current evidence to criteria. | Complete decision record when evidence exists. | No-Go keeps launch gate false. | Public launch and beta cannot proceed without criteria match. |
| Launch gate verification | Verified locally / Blocked for release | Keep Launch Ready false until approvals and evidence are complete. | Launch status page/logs, missing evidence list. | Inspect launch gate output and required evidence. | Continue verifying after each release-prep change. | Gate must fail closed if evidence is missing. | Gate remains false until all required approval evidence exists. |
| Manual review evidence | Blocked | Prove a human reviewed the real experience. | Dated reviewer notes, issues found, resolutions, sign-off or rejection. | Human walks all journeys in staging. | Assign reviewer. | Review failure pauses release. | Manual review exists and is accepted. |
| Release approval evidence | Blocked | Record authorized approval before beta/public release. | Approval record, approver identity, date, scope, conditions. | Compare approval against scorecard and evidence matrix. | Name approver and required format. | Approval can be revoked if evidence changes. | Approval is explicit and scoped. |
| Deployment verification evidence | Blocked | Prove staging/prod deployment behaves correctly. | Deployment log, URL, smoke test, route audit, dependency checks. | Run deployment verification checklist. | Generate deployment evidence in staging first. | Rollback plan tested before production. | Deployment is verified and recoverable. |

## Launch Control Rule

Launch Ready must remain false unless:

- manual review is complete;
- release approval is complete;
- deployment verification is complete;
- security review is complete;
- documentation is complete enough for operators and users;
- backup, rollback, monitoring, logging, and incident response are verified;
- all critical and high blockers are resolved or explicitly accepted by the authorized release owner.

At v2.0 creation, these requirements are not complete. Launch Ready remains **false**.

