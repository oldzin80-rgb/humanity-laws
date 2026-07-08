# Humanity Laws Live Test Runbook

Status: READY FOR FOUNDER LIVE TESTING  
LaunchReady: FALSE until all launch-blocking live evidence passes.

This runbook is the step-by-step guide for Nick to verify Humanity Laws in Vercel, Supabase, and Stripe. Keep the evidence log open while testing:

- Evidence log: `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`

Do not mark a test as passed unless you personally observe the result in the live environment.

## 1. Pre-test setup

Before beginning:

1. Open the live Vercel deployment.
2. Open the Vercel project settings.
3. Open the Supabase project dashboard.
4. Open the Stripe dashboard in test mode.
5. Open `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`.
6. Prepare three test users:
   - Unpaid user.
   - Monthly member user.
   - Digital-book-only user.
7. Prepare one admin email for `ADMIN_ALLOWLIST`.
8. Keep screenshots or notes for every pass/fail.

Do not use real customer payment cards. Use Stripe test cards only.

## 2. Vercel environment variable checklist

In Vercel, go to Project Settings → Environment Variables.

Confirm each variable exists in the correct environment before testing:

| Variable | Required for live test | What to verify |
|---|---:|---|
| `PUBLIC_APP_URL` | YES | Matches the deployed Humanity Laws URL. |
| `DEPLOYMENT_URL` | YES | Matches the deployed Humanity Laws URL being tested. |
| `SUPABASE_URL` | YES | Matches the correct Supabase project. |
| `SUPABASE_ANON_KEY` | YES | Present. Do not paste value into notes. |
| `NEXT_PUBLIC_SUPABASE_URL` | YES | Matches the correct Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | Present. Do not paste value into notes. |
| `SUPABASE_SERVICE_ROLE_KEY` | YES | Present. Do not paste value into notes. |
| `STRIPE_SECRET_KEY` | YES | Present and from Stripe test mode for staging tests. |
| `STRIPE_WEBHOOK_SECRET` | YES | Matches the Stripe webhook endpoint secret. |
| `STRIPE_MONTHLY_7_PRICE_ID` | YES | Points to the $7/month recurring price. |
| `STRIPE_YEARLY_70_PRICE_ID` | YES | Points to the $70/year recurring price if yearly remains enabled. |
| `STRIPE_DIGITAL_BOOK_PRICE_ID` | YES | Points to the digital-book-only one-time price. |
| `ADMIN_ALLOWLIST` | YES | Includes the admin test email. |
| `EMAIL_PROVIDER` | YES | Provider name is present if email is being tested. |
| `ERROR_LOGGING_DSN` | YES | Error logging destination is present if configured. |
| `MONITORING_ENDPOINT` | YES | Monitoring endpoint or dashboard target is present if configured. |

After changes in Vercel:

1. Save variables.
2. Redeploy the site.
3. Wait for deployment status to show Ready.
4. Record the deployment URL in the evidence log.

## 3. Supabase user/auth test steps

### Signup

1. Open the live site.
2. Go to `/signup`.
3. Create a new unpaid test user.
4. If email confirmation is required, confirm the user in Supabase or through the email link.
5. Record PASS only if the user can complete signup or is clearly told to confirm email.

### Login

1. Go to `/login`.
2. Enter the confirmed test user email and password.
3. Confirm the app redirects to the intended next page or dashboard.
4. Record PASS only if login works without hidden manual fixes.

### Logout

1. Use the logout button.
2. Confirm the user returns to login.
3. Try visiting `/dashboard`.
4. Record PASS only if the logged-out user is redirected to login.

### Session persistence

1. Log in again.
2. Refresh the browser.
3. Close and reopen the tab.
4. Return to `/dashboard`.
5. Record PASS only if the session remains valid or expires with a clear login redirect.

### Membership lookup and unpaid blocked state

1. Log in as the unpaid test user.
2. Visit `/dashboard`.
3. Visit `/book`.
4. Record PASS only if unpaid access is blocked clearly and redirects to membership or checkout.

## 4. Stripe monthly checkout test steps

1. Log in as the monthly member test user.
2. Go to `/membership`.
3. Click the monthly membership path.
4. Confirm Stripe Checkout opens.
5. Confirm the product is the monthly membership.
6. Confirm the price is `$7/month`.
7. Use a Stripe test card to complete payment.
8. Record the Stripe checkout session ID.
9. Return to the site through the Stripe success redirect.

Record FAIL if:

- Checkout does not open.
- The wrong product appears.
- The wrong price appears.
- A literal environment variable name appears instead of a Stripe price.
- The success redirect fails.

## 5. Stripe digital book checkout test steps

1. Log in as the digital-book-only test user.
2. Go to `/membership`.
3. Click the digital book only path.
4. Confirm Stripe Checkout opens.
5. Confirm it is a one-time payment, not a subscription.
6. Use a Stripe test card to complete payment.
7. Record the Stripe checkout session ID.
8. Return to the site through the Stripe success redirect.

Record FAIL if:

- The digital book checkout starts a subscription.
- The digital book purchase unlocks full membership.
- The success redirect fails.

## 6. Stripe webhook delivery verification

In Stripe test mode:

1. Go to Developers → Webhooks.
2. Confirm the webhook endpoint is registered.
3. Expected endpoint:
   - `https://YOUR_DEPLOYMENT_URL/api/stripe-webhook`
4. Confirm the webhook signing secret matches `STRIPE_WEBHOOK_SECRET` in Vercel.
5. Open recent webhook events.
6. Find `checkout.session.completed`.
7. Confirm Stripe shows a successful delivery response.
8. Record the event ID and delivery status in the evidence log.

Record FAIL if:

- The endpoint is missing.
- Signature verification fails.
- Delivery fails.
- Stripe retries the event because the app returns an error.

## 7. Database membership row verification

In Supabase:

1. Open Table Editor.
2. Open the `memberships` table.
3. Find the monthly member test user row.
4. Confirm:
   - `membership_status = ACTIVE`
   - `digital_book_access = true`
5. Find the digital-book-only test user row.
6. Confirm:
   - `membership_status = FREE`
   - `digital_book_access = true`
7. Confirm the unpaid test user does not have active membership or book access.

Record FAIL if:

- No row is created after successful payment.
- Monthly user is not `ACTIVE`.
- Monthly user does not get `digital_book_access`.
- Digital-book-only user gets full membership.
- Failed/canceled payment creates access.

## 8. Digital book unlock verification

### Unpaid user

1. Log in as unpaid user.
2. Visit `/book`.
3. Confirm access is blocked or redirected clearly.

### Active monthly member

1. Log in as active monthly member.
2. Visit `/dashboard`.
3. Visit `/book`.
4. Confirm both unlock.

### Digital-book-only purchaser

1. Log in as digital-book-only user.
2. Visit `/book`.
3. Confirm book unlocks.
4. Visit `/dashboard`, `/spark`, `/council`, and `/wellness`.
5. Confirm full member rooms remain locked.

## 9. Admin allowlist verification

### Non-admin

1. Log in as a user not listed in `ADMIN_ALLOWLIST`.
2. Visit `/admin`.
3. Visit `/social-media-command-center`.
4. Confirm access is blocked or redirected.

### Allowlisted admin

1. Confirm the admin email is listed in `ADMIN_ALLOWLIST`.
2. Redeploy if the variable was changed.
3. Log in as the admin user.
4. Visit `/admin`.
5. Visit `/social-media-command-center`.
6. Confirm both pages open.

Record FAIL if a non-admin can access admin rooms.

## 10. Failed/canceled payment verification

### Canceled checkout

1. Log in as a fresh unpaid user.
2. Start monthly checkout.
3. Cancel checkout from Stripe.
4. Return to the site.
5. Confirm dashboard/book remain locked.

### Failed payment

1. Log in as a fresh unpaid user.
2. Start monthly checkout.
3. Use a Stripe test card that fails.
4. Confirm payment does not complete.
5. Confirm no membership row grants access.

Record PASS only if canceled/failed payment does not unlock membership or book access.

## 11. Hardcover placeholder verification

1. Visit `/book/hardcover`.
2. Confirm the page clearly says hardcover fulfillment is not live.
3. Confirm there is no fake buy button.
4. Confirm there is no fake shipping or fulfillment promise.
5. Confirm the page points to monthly membership and digital book only as available paths.

Record FAIL if the site appears to sell hardcover without a real POD/fulfillment provider.

## 12. Evidence capture instructions

For every test, capture:

- Environment tested: staging or production.
- Deployment URL.
- Date and time.
- Test user email.
- Expected result.
- Actual result.
- PASS or FAIL.
- Screenshot or dashboard evidence when possible.
- Stripe checkout session ID when payment is involved.
- Stripe webhook event ID when webhook is involved.
- Supabase membership row details when access is involved.

Never paste secret values into the evidence log.

## 13. Final PASS/FAIL launch gate

Public launch remains blocked unless every item below is PASS:

| Launch gate item | Required result |
|---|---:|
| Vercel environment variables verified | PASS |
| Supabase signup/login/logout/session verified | PASS |
| Monthly Stripe checkout verified | PASS |
| Digital book Stripe checkout verified | PASS |
| Webhook delivery verified | PASS |
| Monthly membership row verified | PASS |
| Digital-book-only access row verified | PASS |
| Failed/canceled payments do not unlock access | PASS |
| Unpaid user blocked | PASS |
| Active monthly member unlocks dashboard/book | PASS |
| Digital-book-only user unlocks book only | PASS |
| Non-admin blocked | PASS |
| Allowlisted admin allowed | PASS |
| Hardcover remains honest placeholder | PASS |
| Founder review complete | PASS |

Final rule:

- If any item is FAIL, the verdict is NEEDS PATCHES.
- If any item is untested, the verdict is READY TO CONTINUE LIVE TESTING, not launch ready.
- If every item passes and founder approval is recorded, the project may be considered for launch approval.
- `launchReady` must remain false until that evidence exists.

Current verdict: READY FOR FOUNDER LIVE TESTING
