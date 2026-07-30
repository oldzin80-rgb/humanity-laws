# Sprint 020 — Core Provider Connections & Unified Operational Dashboard

## Traceability

- Branch: `codex/core-provider-connections-dashboard`
- Sprint 018: PASS — `4e1da2a271a7ac22a253f0178c4eac12dd8f9bab`
- Sprint 019 compatibility: PASS WITH PRESERVED BOUNDARIES — communications
  remains on the same registry, secret, guard, audit, budget, incident and
  dashboard control plane.
- Starting SHA: `c78a85b409d6fc64704a96eb291e392884996818`
- Implementation SHA: `63e609cfb431cfa4189f940b720a52e26947ac9f`
- Production mutation: `NO`
- Automated external calls: `0`

## Completed

- Independent GitHub, Vercel, Supabase, Stripe, OpenAI and Lulu capabilities
- Explicit destructive-action prohibitions
- Environment-scoped secret-reference inventories
- Canonical read-only/simulation adapter contract
- Credential presence, health, usage, cost and readiness methods
- Governed Founder command requirements
- Deterministic truth/drift engine with all eight classifications
- Evidence-derived unified operational dashboard
- Drift/repeated-denial incident recommendations
- Durable account, resource, configuration, permission, deployment, migration,
  payment, AI policy, publishing, drift and staging-action models
- RLS and Founder drift acknowledgement boundary

## Provider truth

| Provider | Code readiness | Live readiness | Mutation |
|---|---|---|---|
| GitHub | Simulation/read contract proven | NOT CONFIGURED | Prohibited |
| Vercel | Simulation/read contract proven | NOT CONFIGURED | Prohibited |
| Supabase | Simulation/read contract proven | NOT CONFIGURED | Prohibited |
| Stripe | Simulation/read contract proven | NOT CONFIGURED | Prohibited |
| OpenAI | Simulation/accounting contract proven | NOT CONFIGURED | Prohibited |
| Lulu | Simulation/read contract proven | NOT CONFIGURED | Prohibited |

Credentials do not imply readiness. UNKNOWN remains UNKNOWN.

## Drift matrix

`MATCHED`, `DRIFTED`, `MISSING`, `STALE`, `CONFLICTING`,
`NOT_AUTHORIZED`, `NOT_CONFIGURED`, and `UNKNOWN` are deterministic and tested.

Expected and observed values use fingerprints and evidence references. The
engine diagnoses; it never mutates a provider to resolve drift.

## Validation

- TypeScript: PASS
- Full suite: PASS — 234 passed, 0 failed, 0 skipped
- Sprint 020 focused tests: PASS — 10
- Smoke: PASS; `launchReady: false`
- Secret scan: PASS — 254 tracked text files at final clean-checkout validation
- Automated provider calls: 0
- Diff integrity: PASS

## Staging blockers

1. Protected staging secret references are not configured.
2. Migration `006_core_provider_observations.sql` is not applied to staging.
3. Provider identities, permissions and resource observations are absent.
4. Read-only credential verification has not been explicitly authorized.
5. No provider-specific staging evidence has been captured.
6. Budget authorization remains zero.
7. Controlled staging actions remain ineligible.

## Classification

`SPRINT 020 COMPLETE — SIMULATION-BACKED CORE PROVIDER CONTROL PLANE PROVEN`

This does not assert live provider connectivity or authorize deployment,
database mutation, charging, refunds, publication, orders or AI inference.
