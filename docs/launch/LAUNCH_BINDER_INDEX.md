# Humanity Laws Live Launch Binder Index

Status: READY FOR LIVE LAUNCH BINDER REVIEW  
LaunchReady: FALSE until all live evidence passes.

This binder is the founder-facing map for live launch proof. Use it to move through Vercel, Supabase, Stripe, webhook, admin, and digital book access verification in the correct order.

No public launch may begin until every launch-blocking proof item is complete.

## Binder documents in order

### 1. `LIVE_ENV_TEST_EVIDENCE.md`

Purpose: the official evidence log.

Use this document to record the result of every live test. All proof starts as `NO` or blank. Only change evidence to `YES` after manual verification.

Open:

- `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`

### 2. `LIVE_TEST_RUNBOOK.md`

Purpose: the step-by-step founder testing path.

Use this document while performing live tests. It explains the full order for Vercel, Supabase, Stripe, webhook delivery, database verification, access verification, failed/canceled payment checks, hardcover placeholder proof, and final PASS/FAIL launch gate.

Open:

- `docs/launch/LIVE_TEST_RUNBOOK.md`

### 3. `VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md`

Purpose: Vercel environment variable setup and deployment proof.

Use this document to enter environment variables, redeploy, confirm the deployment is Ready, and record deployment proof without exposing secrets.

Open:

- `docs/launch/VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md`

### 4. `SUPABASE_LIVE_SETUP_PROOF.md`

Purpose: Supabase auth, membership row, digital book access, and admin identity proof.

Use this document to verify signup, login, logout, session persistence, membership table fields, unpaid blocked state, active monthly membership, digital-book-only access, failed/canceled payment lockout, and admin allowlist matching.

Open:

- `docs/launch/SUPABASE_LIVE_SETUP_PROOF.md`

### 5. `STRIPE_LIVE_SETUP_PROOF.md`

Purpose: Stripe checkout, price ID, webhook, payment outcome, and access unlock proof.

Use this document to verify Stripe secret key setup, monthly `$7` price ID, yearly `$70` price ID, digital book price ID, webhook endpoint, webhook signing secret, monthly checkout, digital-book-only checkout, webhook delivery, membership row update, digital book unlock, failed/canceled payment lockout, and hardcover placeholder/no checkout.

Open:

- `docs/launch/STRIPE_LIVE_SETUP_PROOF.md`

## Recommended founder testing order

1. Open `LIVE_ENV_TEST_EVIDENCE.md`.
2. Open `LIVE_TEST_RUNBOOK.md`.
3. Configure Vercel using `VERCEL_ENV_SETUP_AND_DEPLOYMENT_PROOF.md`.
4. Redeploy and confirm Vercel deployment is Ready.
5. Verify Supabase setup using `SUPABASE_LIVE_SETUP_PROOF.md`.
6. Verify Stripe setup using `STRIPE_LIVE_SETUP_PROOF.md`.
7. Run the monthly checkout test.
8. Confirm webhook delivery for monthly checkout.
9. Confirm Supabase row shows `membership_status = ACTIVE`.
10. Confirm monthly member has `digital_book_access = true`.
11. Run the digital-book-only checkout test.
12. Confirm webhook delivery for digital-book-only checkout.
13. Confirm Supabase row shows `membership_status = FREE` and `digital_book_access = true`.
14. Confirm digital-book-only purchaser can access `/book` only.
15. Confirm unpaid user remains blocked.
16. Confirm failed/canceled payment does not unlock access.
17. Confirm non-admin is blocked from admin pages.
18. Confirm allowlisted admin is allowed.
19. Confirm hardcover remains an honest placeholder with no active checkout.
20. Record all results in `LIVE_ENV_TEST_EVIDENCE.md`.
21. Complete founder review.
22. Decide launch gate outcome.

## Final launch gate rule

`launchReady` remains false until all live evidence passes.

Public launch is blocked until proof is complete for:

- Vercel environment variables.
- Vercel deployment Ready state.
- Supabase signup, login, logout, and session persistence.
- Supabase membership lookup.
- Stripe monthly checkout.
- Stripe digital book checkout.
- Stripe webhook signature and delivery.
- Monthly membership row activation.
- Monthly digital book access.
- Digital-book-only book access.
- Failed/canceled payment lockout.
- Admin allowlist access control.
- Digital book access control.
- Hardcover placeholder/no checkout.
- Founder review and approval.

Do not infer live readiness from local tests alone.

Do not paste secret keys into evidence, chats, screenshots, or public documents.

Current verdict: READY FOR LIVE LAUNCH BINDER REVIEW
