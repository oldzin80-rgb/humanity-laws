# Humanity Laws Live Environment Test Evidence

Status: READY TO COLLECT LIVE EVIDENCE  
LaunchReady: FALSE until every launch-blocking live test below is manually verified.

This document is the evidence log for Vercel, Supabase, Stripe, Stripe webhooks, admin access, and digital book access. Do not mark any item complete until it has been verified in the live staging or production environment.

Evidence rule: fields begin blank or NO. Replace NO with YES only after manual verification, and add a short note with the date, environment, account/test user, and observed result.

## 1. Environment variables

| Required variable | Where it is set | Test/staging value confirmed | Production value confirmed | Notes |
|---|---|---:|---:|---|
| `PUBLIC_APP_URL` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `DEPLOYMENT_URL` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `SUPABASE_URL` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `SUPABASE_ANON_KEY` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `STRIPE_SECRET_KEY` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `STRIPE_WEBHOOK_SECRET` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `STRIPE_MONTHLY_7_PRICE_ID` | Vercel Project Settings → Environment Variables | NO | NO | Must point to the verified $7/month recurring Stripe price. |
| `STRIPE_YEARLY_70_PRICE_ID` | Vercel Project Settings → Environment Variables | NO | NO | Must point to the verified $70/year recurring Stripe price if yearly is enabled. |
| `STRIPE_DIGITAL_BOOK_PRICE_ID` | Vercel Project Settings → Environment Variables | NO | NO | Must point to the verified digital-book-only one-time Stripe price. |
| `ADMIN_ALLOWLIST` | Vercel Project Settings → Environment Variables | NO | NO | Comma-separated admin emails or member IDs. |
| `EMAIL_PROVIDER` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `ERROR_LOGGING_DSN` | Vercel Project Settings → Environment Variables | NO | NO |  |
| `MONITORING_ENDPOINT` | Vercel Project Settings → Environment Variables | NO | NO |  |

## 2. Supabase live evidence

| Live test | Evidence status | Evidence notes |
|---|---:|---|
| Signup works live | NO |  |
| Login works live | NO |  |
| Logout works live | NO |  |
| Session persists correctly after refresh/reopen | NO |  |
| Membership status lookup works for authenticated user | NO |  |
| Missing or expired membership returns clear blocked state | NO |  |

Required evidence:

- Test user email:
- Environment tested:
- Vercel deployment URL:
- Supabase project:
- Date/time tested:
- Result notes:

## 3. Stripe live evidence

| Live test | Evidence status | Evidence notes |
|---|---:|---|
| Monthly checkout opens | NO |  |
| Digital book checkout opens | NO |  |
| Correct monthly price ID is used | NO | Must verify `$7/month`. |
| Correct digital book price ID is used | NO |  |
| No hardcover checkout exists unless real POD/fulfillment exists | NO |  |
| No donation path exists | NO |  |
| No advertising path exists | NO |  |

Required evidence:

- Stripe mode tested:
- Monthly Stripe price ID observed:
- Digital book Stripe price ID observed:
- Checkout session IDs:
- Date/time tested:
- Result notes:

## 4. Webhook evidence

| Live test | Evidence status | Evidence notes |
|---|---:|---|
| `checkout.session.completed` received | NO |  |
| Stripe webhook signature verified | NO |  |
| Monthly membership activates membership row | NO | Expected `membership_status = ACTIVE`. |
| Monthly membership grants `digital_book_access` | NO | Expected `digital_book_access = true`. |
| Digital-book-only purchase grants book access | NO | Expected `membership_status = FREE` and `digital_book_access = true`. |
| Failed or canceled payment does not unlock access | NO |  |

Required evidence:

- Webhook endpoint URL:
- Stripe webhook event ID:
- Supabase membership row ID/member ID:
- Date/time tested:
- Result notes:

## 5. Access evidence

| Live test | Evidence status | Evidence notes |
|---|---:|---|
| Unpaid user is blocked from member-only areas | NO |  |
| Active monthly member accesses dashboard | NO |  |
| Active monthly member accesses digital book | NO |  |
| Digital-book-only purchaser accesses book only | NO |  |
| Digital-book-only purchaser remains blocked from full member rooms | NO |  |
| Non-admin is blocked from admin pages | NO |  |
| Allowlisted admin is allowed into admin pages | NO |  |

Required evidence:

- Unpaid test user:
- Active monthly member test user:
- Digital-book-only test user:
- Admin allowlisted user:
- Non-admin user:
- Date/time tested:
- Result notes:

## 6. Final launch gate

| Launch gate item | Evidence status | Evidence notes |
|---|---:|---|
| All required environment variables verified | NO |  |
| Supabase live evidence complete | NO |  |
| Stripe live evidence complete | NO |  |
| Webhook evidence complete | NO |  |
| Access evidence complete | NO |  |
| Founder review complete | NO |  |
| Public launch approval granted | NO |  |

Launch gate rule:

- `launchReady` remains false until evidence is complete.
- Public launch may only proceed after all launch-blocking live tests pass.
- Failed, canceled, missing, or uncertain evidence keeps launch blocked.
- Do not infer success from passing local tests alone.
- Do not mark public launch approved without explicit founder approval.

## Final live evidence verdict

Current verdict: READY TO COLLECT LIVE EVIDENCE

Final verdict after manual testing:

- READY FOR PUBLIC LAUNCH: NO
- READY FOR CONTROLLED BETA: NO
- REMAINING BLOCKERS:
  - Live Supabase evidence incomplete.
  - Live Stripe evidence incomplete.
  - Live webhook evidence incomplete.
  - Live access evidence incomplete.
  - Founder review incomplete.
