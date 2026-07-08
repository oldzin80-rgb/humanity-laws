# Humanity Laws RC1 Change Control

Status: RC1 CHANGE CONTROL ACTIVE  
LaunchReady: FALSE until live evidence passes.

After RC1, every change must be evidence-driven. The purpose of this document is to prevent accidental regressions while live validation is underway.

## Allowed RC1 changes

Only allow changes that:

- fix a verified launch blocker.
- fix broken auth.
- fix broken payments.
- fix broken webhook.
- fix broken membership access.
- fix broken digital book access.
- fix broken admin access.
- fix deployment failure.
- fix security/privacy issue.

## Not allowed before live validation

Do not add:

- new features.
- new architecture.
- new rooms.
- new engines.
- new providers.
- new commerce paths.
- pricing changes.
- book/source text changes.
- speculative polish.
- fake hardcover fulfillment.
- fake live community, voice, avatar, SMS, or analytics behavior.

## Required change record

After RC1, every change must include:

| Required field | Description |
|---|---|
| Reason | Why the change is needed. |
| Blocker evidence | The live error, failed test, failed route, failed payment, failed webhook, failed auth flow, or verified security/privacy issue. |
| Files changed | Exact files modified. |
| Tests run | TypeScript, focused tests, full tests, static build, and any live verification performed. |
| Rollback note | How to undo the change safely if it causes regression. |
| launchReady impact | Must state whether `launchReady` remains false or why evidence supports a future change. |

## Change template

Use this template for every RC1 change:

```text
RC1 Change Record

Reason:

Blocker evidence:

Files changed:

Tests run:

Rollback note:

launchReady impact:
```

## Required validation after any RC1 change

Run:

- TypeScript.
- Focused tests for the changed area.
- Full tests.
- Static build.

If the change affects live infrastructure, also run the relevant live proof steps from:

- `docs/launch/LIVE_TEST_RUNBOOK.md`
- `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`
- `docs/launch/VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md`
- `docs/launch/SUPABASE_LIVE_SETUP_PROOF.md`
- `docs/launch/STRIPE_LIVE_SETUP_PROOF.md`

## LaunchReady rule

`launchReady` remains false until live evidence passes.

No `launchReady = true` change is allowed unless:

- Vercel proof is complete.
- Supabase proof is complete.
- Stripe proof is complete.
- Webhook proof is complete.
- Admin proof is complete.
- Digital book access proof is complete.
- Founder approval is recorded.

## Final rule

No new features before live validation is complete.

Any change without blocker evidence should be deferred until after launch validation.

Current verdict: RC1 CHANGE CONTROL ACTIVE
