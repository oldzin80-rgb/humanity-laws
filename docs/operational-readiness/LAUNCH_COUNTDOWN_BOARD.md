# Launch Countdown Board

Purpose: track only launch-candidate execution. No speculative architecture. No new philosophy. Every item must move toward a deployable launch candidate.

Launch Ready: **false**

## Ready

| Task | Evidence |
|---|---|
| Local route tests | App route test suite passes. |
| Adam/Eve runtime integration | Adam/Eve integration tests pass. |
| Humanity Laws archive integrity | Archive registry tests pass with source hash and quote provenance. |
| Professional-boundary routing | Safety tests pass. |
| Source ledger | Source-ledger tests pass. |
| Launch gate blocks release | Launch report remains false with missing manual review, release approval, and deployment evidence. |

## In Progress

| Task | Evidence Being Built |
|---|---|
| Staging route verification | Deployment verifier now checks required staging routes. |
| Staging environment readiness | Environment readiness validator now identifies missing/invalid config without exposing secrets. |
| Static staging build | Vercel config and static site exporter generate `dist/` for launch routes. |
| Operational evidence capture | Launch report and operational board are active. |

## Blocked

| Task | Needed Action |
|---|---|
| Staging deployment | Create Vercel staging project or provide alternate host. |
| Supabase production-like connection | Provide Supabase staging project URL and keys. |
| Stripe production-like/test-mode connection | Provide Stripe test keys, webhook secret, and price IDs. |
| Email delivery | Choose/provider email service and staging credentials. |
| Monitoring/error logging | Choose/provider monitoring and error logging endpoints. |
| Backup and restore | Requires deployed database/storage target. |
| Rollback | Requires staging deployment pipeline. |
| Manual review | Assign human reviewer and complete review checklist. |
| Release approval | Assign release approver and record explicit decision. |
