# Sprint 023 — Paid Media, Growth Experiments & Founder-Controlled Budget Operations

## Classification

SIMULATION-BACKED PAID-MEDIA CONTROL PLANE PROVEN; PROVIDER DRAFT AND SPEND BLOCKED

- Branch: `codex/paid-media-founder-budget-operations`
- Starting SHA: `6e185dddf2c94ec437419f96a94e054e4b823b14`
- Implementation commit: `cef140d`
- Migration: `009_paid_media_operations.sql`

## Proven

- Seven isolated advertising channel families and nineteen explicit campaign states.
- Immutable campaign, creative, landing-page, audience, environment, and approval binding.
- Sensitive targeting, minors, absent advertising consent, and missing suppression fail closed.
- Hierarchical currency-specific budget reservation prevents sequential oversubscription.
- Founder, provider, account, conversion, claims, rights, version, pause, incident, rate, and spend-freshness gates.
- Idempotent audited action intents with transactional outbox references.
- Optimization is recommendation-only and always requires Founder approval.
- Production activation is unreachable; automated external calls and spend are zero.

## Validation

- TypeScript: PASS
- Tests: 277 passed, 0 failed, 0 skipped
- Smoke: PASS; `launchReady: false`
- Secret scan: PASS; 262 tracked text files

## External blockers

No approved advertising account identities, OAuth scopes, conversion configuration, staging destination, or exact Founder authorization for one no-spend provider draft was supplied or exercised. Provider-connected staging therefore remains ineligible.
