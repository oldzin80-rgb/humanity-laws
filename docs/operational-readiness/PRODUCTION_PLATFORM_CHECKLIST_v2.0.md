# v2.0 Production Platform Checklist

Purpose: prove the platform can be safely operated in staging before production is considered.

Status language: Planned, In Progress, Verified, Blocked.

| Item | Status | Objective | Required evidence | Verification method | Owner action | Rollback or recovery requirement | Exit criteria |
|---|---|---|---|---|---|---|---|
| Infrastructure | Blocked | Establish a staging environment equivalent enough to production to validate real operation. | Staging environment URL, deployment log, environment inventory, service map. | Deploy to staging and compare configured services against this checklist. | Create staging environment and record configuration. | Staging teardown and redeploy procedure documented. | Staging works without using public launch mode. |
| Hosting | Blocked | Verify the app shell runs on approved hosting. | Hosting deployment log, health check, route smoke report. | Visit all major routes in staging and run route smoke checks. | Configure hosting target and record deployment result. | Previous build can be restored or redeployed. | Home, Book, Join, Login, Dashboard, Spark, Adam, Eve, Council, Library, Admin, Launch Status respond. |
| Domain configuration | Planned | Prepare controlled domain/subdomain routing without public launch announcement. | DNS record list, staging domain screenshot/log. | Confirm DNS resolves to staging only. | Assign staging domain or preview URL. | DNS rollback instructions documented. | Domain routes correctly and can be reverted. |
| SSL | Planned | Ensure traffic is encrypted. | Valid certificate details and expiry date. | Browser/certificate inspection in staging. | Enable managed SSL. | Certificate renewal/rotation owner identified. | HTTPS valid with no mixed-content warnings. |
| Authentication | Blocked | Verify login/session controls in deployed environment. | Auth provider configuration, login/logout test, expired-session test. | Exercise login, logout, expired session, and unauthorized access. | Configure production-like auth in staging. | Account recovery and session invalidation procedure documented. | Member-only and admin-only paths are enforced. |
| Database | Blocked | Verify durable storage for member data and memory behavior. | Database schema, migration log, read/write test, isolation test. | Run migrations and test member-scoped reads/writes. | Configure Supabase or approved database in staging. | Backup restore process tested before beta. | Data persists, isolates by member, and survives restart. |
| Payments | Blocked | Verify payment flow without charging real users. | Stripe test-mode configuration, checkout test, failure test, webhook log. | Run success/cancel/failure checkout in staging test mode. | Configure test products/prices/webhooks. | Payment disable switch and refund/escalation path documented. | Join/payment path is clear, reversible, and not public-live. |
| Email delivery | Planned | Verify account and support emails reach users reliably. | Email provider config, test sends, delivery logs. | Send signup, password, support, and incident test emails. | Configure staging sender domain. | Email provider fallback/disable procedure documented. | Emails deliver with correct sender and no secret exposure. |
| Session management | Blocked | Verify session duration, expiry, renewal, and logout behavior. | Session policy, expired-session test, protected-route test. | Exercise session lifecycle in staging. | Define and configure session settings. | Forced logout/invalidation procedure documented. | Expired sessions recover gracefully and protected routes stay protected. |
| Secrets management | Blocked | Keep secrets outside source and local logs. | Secret inventory, storage location, rotation plan, redacted logs. | Inspect config and logs for secrets; verify runtime can read only needed secrets. | Move all live secrets to approved manager. | Secret rotation and revocation playbook documented. | No secrets are committed, exposed, or logged. |
| Monitoring | Blocked | Observe app health before beta. | Dashboard links, uptime checks, latency metrics. | Trigger health checks and verify dashboard updates. | Configure service monitoring. | Escalation owner and monitoring fallback documented. | Basic uptime, latency, and error signals are visible. |
| Logging | Blocked | Capture useful operational events without unsafe personal data exposure. | Logging policy, sample redacted logs, retention settings. | Review logs for route, auth, payment, error, and safety events. | Configure structured logging. | Log purge/export procedure documented. | Logs help diagnose issues and respect privacy. |
| Backup | Blocked | Protect user, memory, and operational data. | Backup schedule, sample backup artifact, restore test result. | Perform staging backup and restore into isolated environment. | Configure backup schedule and owner. | Restore runbook tested and timed. | Restore succeeds and recovery point objective is documented. |
| Rollback | Blocked | Revert a bad release safely. | Rollback runbook, rollback test log. | Deploy staging version N, deploy N+1, rollback to N. | Define rollback procedure and approval path. | Rollback owner and communication plan documented. | Rollback succeeds with known data behavior. |
| Error reporting | Planned | Capture crashes and runtime failures. | Error reporting dashboard, sample captured error. | Trigger controlled test error in staging. | Configure error reporting tool. | Disable/filter procedure documented for sensitive events. | Errors appear with enough detail and no private content leak. |
| Security verification | Blocked | Verify deployed permission boundaries and input handling. | Security checklist, admin auth evidence, input validation review, dependency audit. | Review deployed routes, auth, dependencies, and high-risk inputs. | Assign security reviewer and complete checklist. | Incident response and hotfix path documented. | No critical/high security blocker remains open. |

## Current Platform Summary

Verified locally:

- Launch gate remains false.
- Stripe and Supabase unavailable boundaries fail gracefully.
- No deployment or external service activation occurred in v2.0 documentation work.

Blocked for controlled beta:

- Staging deployment evidence.
- Deployed admin protection evidence.
- Durable memory/database evidence.
- Backup/restore evidence.
- Rollback evidence.
- Monitoring/alerting evidence.
- Production secrets evidence.

