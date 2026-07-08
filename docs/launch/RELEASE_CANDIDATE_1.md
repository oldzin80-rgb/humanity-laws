# Humanity Laws Release Candidate 1

Status: RC1 LOCKDOWN  
LaunchReady: FALSE until live evidence passes.

Release Candidate 1 is the preserved launch candidate before live validation. From this point forward, the goal is not to add features. The goal is to prove the current system works in the live environment and fix only verified launch blockers.

## 1. RC1 scope

RC1 includes:

- Core launch app.
- Home.
- Membership.
- Signup/Login.
- Checkout paths.
- Dashboard.
- Digital Book.
- Admin.
- Launch status.
- Live proof binder.

Launch proof binder:

- `docs/launch/LAUNCH_BINDER_INDEX.md`
- `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`
- `docs/launch/LIVE_TEST_RUNBOOK.md`
- `docs/launch/VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md`
- `docs/launch/SUPABASE_LIVE_SETUP_PROOF.md`
- `docs/launch/STRIPE_LIVE_SETUP_PROOF.md`

## 2. Current verified state

Current local verification state:

- TypeScript: PASS.
- Full tests: PASS.
- Static build: PASS.
- `launchReady`: false.
- Humanity Laws book/source text preserved.

The current verified state does not mean public launch is approved. RC1 still requires live Vercel, Supabase, Stripe, webhook, admin, and digital book access evidence.

## 3. Frozen launch scope

Launch scope is frozen.

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

Do not add new rooms, new architecture, new providers, new commerce models, new pricing, or non-critical polish before live validation is complete.

## 4. Deferred post-launch items

Deferred items are documented in:

- `docs/launch/KNOWN_LIMITATIONS.md`

These items are not RC1 launch blockers unless they break core launch flows.

## 5. Change control rule

After RC1, every change must include:

- reason.
- blocker evidence.
- files changed.
- tests run.
- rollback note.
- launchReady impact.

Change control is documented in:

- `docs/launch/RC1_CHANGE_CONTROL.md`

## 6. Final rule

No new features before live validation is complete.

No `launchReady = true` until live evidence passes.

Public launch may only proceed after all launch-blocking live tests pass and founder approval is recorded.

Current verdict: RC1 LOCKED
