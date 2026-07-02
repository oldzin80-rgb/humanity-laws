# v2.0 Go / No-Go Criteria

Purpose: define objective conditions for controlled beta and public launch decisions.

## Controlled Beta Criteria

Controlled beta may be considered only when all of the following are Verified or explicitly accepted by the authorized release owner with documented conditions:

| Criterion | Required Status Before Beta |
|---|---|
| Staging environment verified | Verified |
| Hosting, SSL, domain/preview routing verified | Verified |
| Authentication and session handling verified | Verified |
| Database and memory persistence verified | Verified |
| Payment flow verified in test mode or intentionally disabled | Verified |
| Email delivery verified or intentionally disabled with user-safe alternative | Verified |
| Secrets management verified | Verified |
| Monitoring, logging, and error reporting verified | Verified |
| Backup and restore tested | Verified |
| Rollback tested | Verified |
| Admin route protection verified | Verified |
| Adam/Eve/Council staging conversations reviewed | Verified |
| Book archive experience verified, including hash and quote provenance | Verified |
| Memory consent/export/delete verified in deployed environment | Verified |
| Professional-boundary routing reviewed | Verified |
| Accessibility baseline reviewed | Verified |
| Internal alpha feedback reviewed | Verified or formally deferred |
| Incident response and support workflow ready | Verified |
| Manual review completed | Verified |
| Release approval completed | Verified |
| Launch gate remains false for public launch | Verified |

If any critical or high blocker remains open without documented acceptance, controlled beta is **No-Go**.

## Public Launch Criteria

Public launch requires everything in controlled beta plus:

- successful controlled beta evidence;
- stable infrastructure under real usage;
- successful onboarding evidence;
- successful payment evidence if payments are active;
- support request handling evidence;
- incident response readiness after real beta learnings;
- documentation reviewed and current;
- security review completed;
- final public launch approval completed;
- launch gate intentionally changed only after evidence and approval.

Public launch is currently **No-Go**.

## Decision Types

| Decision | Meaning |
|---|---|
| Go | All required evidence exists and no blocking risk remains. |
| Conditional Go | Minor conditions remain, but authorized owner accepts them in writing and they do not create safety, privacy, payment, or reliability risk. |
| No-Go | Required evidence is missing or critical/high risks remain unresolved. |

## Current Decision

Controlled beta: **No-Go today**

Public launch: **No-Go**

Reason: operational evidence, manual review, release approval, staging deployment, admin security verification, backup/rollback, monitoring, and incident/support processes remain incomplete.

