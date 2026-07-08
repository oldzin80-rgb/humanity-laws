# Humanity Laws Vercel Env Setup and Deployment Proof

Status: READY FOR VERCEL ENV ENTRY  
LaunchReady: FALSE until live evidence passes.

This guide shows where to enter live environment variables in Vercel, where each value comes from, how to redeploy, and how to record proof without exposing secrets.

Important safety rule: never paste secret keys into screenshots, chats, pull requests, public docs, or support messages. For proof, record only that the value is present, the provider it came from, and the environment where it was configured.

## 1. Where to enter env vars in Vercel

1. Open Vercel.
2. Open the Humanity Laws project.
3. Go to Project Settings.
4. Open Environment Variables.
5. Add or update each required variable.
6. Choose the correct environment:
   - Preview / Staging for live testing.
   - Production only when ready for production configuration.
7. Save changes.
8. Redeploy after saving.

Do not paste real secret values into this document.

## 2. Required env vars checklist

| Variable | Required | Source | Vercel environment | Proof to record |
|---|---:|---|---|---|
| `PUBLIC_APP_URL` | YES | Humanity Laws deployed app URL | Preview/Staging and Production | URL matches deployment being tested. |
| `DEPLOYMENT_URL` | YES | Humanity Laws deployed app URL | Preview/Staging and Production | URL matches deployment being tested. |
| `SUPABASE_URL` | YES | Supabase Project Settings → API | Preview/Staging and Production | Present. No secret in screenshot. |
| `SUPABASE_ANON_KEY` | YES | Supabase Project Settings → API | Preview/Staging and Production | Present. Secret hidden. |
| `NEXT_PUBLIC_SUPABASE_URL` | YES | Supabase Project Settings → API | Preview/Staging and Production | Same project URL as `SUPABASE_URL`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | Supabase Project Settings → API | Preview/Staging and Production | Same anon key as `SUPABASE_ANON_KEY`; value hidden. |
| `SUPABASE_SERVICE_ROLE_KEY` | YES | Supabase Project Settings → API | Preview/Staging and Production | Present. Secret hidden. |
| `STRIPE_SECRET_KEY` | YES | Stripe Developers → API keys | Preview/Staging and Production | Present. Secret hidden. |
| `STRIPE_WEBHOOK_SECRET` | YES | Stripe Webhook endpoint signing secret | Preview/Staging and Production | Present. Secret hidden. |
| `STRIPE_MONTHLY_7_PRICE_ID` | YES | Stripe Product/Price for $7/month | Preview/Staging and Production | Price ID points to `$7/month` recurring price. |
| `STRIPE_YEARLY_70_PRICE_ID` | YES if yearly remains enabled | Stripe Product/Price for $70/year | Preview/Staging and Production | Price ID points to `$70/year` recurring price. |
| `STRIPE_DIGITAL_BOOK_PRICE_ID` | YES | Stripe Product/Price for digital book only | Preview/Staging and Production | Price ID points to one-time digital book price. |
| `ADMIN_ALLOWLIST` | YES | Nick sets manually | Preview/Staging and Production | Contains approved admin email(s) or member ID(s). |
| `EMAIL_PROVIDER` | YES or placeholder until provider chosen | Email provider account | Preview/Staging and Production | Provider name recorded, or placeholder noted. |
| `ERROR_LOGGING_DSN` | YES or placeholder until provider chosen | Error monitoring provider | Preview/Staging and Production | Present, or placeholder noted. |
| `MONITORING_ENDPOINT` | YES or placeholder until provider chosen | Monitoring provider/dashboard | Preview/Staging and Production | Present, or placeholder noted. |

## 3. Values from Supabase

In Supabase:

1. Open the Humanity Laws Supabase project.
2. Go to Project Settings.
3. Go to API.
4. Copy the project URL into:
   - `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the anon/public key into:
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy the service role key into:
   - `SUPABASE_SERVICE_ROLE_KEY`

Secret safety:

- The service role key is highly sensitive.
- Do not screenshot the visible key.
- Do not paste it into chat.
- Do not commit it to Git.

## 4. Values from Stripe

In Stripe test mode for staging:

1. Go to Developers → API keys.
2. Copy the secret key into:
   - `STRIPE_SECRET_KEY`
3. Go to Product catalog.
4. Confirm the monthly membership product has a recurring `$7/month` price.
5. Copy that price ID into:
   - `STRIPE_MONTHLY_7_PRICE_ID`
6. Confirm the yearly membership product has a recurring `$70/year` price if yearly remains enabled.
7. Copy that price ID into:
   - `STRIPE_YEARLY_70_PRICE_ID`
8. Confirm the digital book product has a one-time payment price.
9. Copy that price ID into:
   - `STRIPE_DIGITAL_BOOK_PRICE_ID`
10. Go to Developers → Webhooks.
11. Open the Humanity Laws webhook endpoint.
12. Copy the signing secret into:
   - `STRIPE_WEBHOOK_SECRET`

Expected webhook endpoint:

`https://YOUR_DEPLOYMENT_URL/api/stripe-webhook`

Secret safety:

- Never expose `STRIPE_SECRET_KEY`.
- Never expose `STRIPE_WEBHOOK_SECRET`.
- Price IDs are not secret, but still record them carefully.

## 5. ADMIN_ALLOWLIST value Nick sets manually

`ADMIN_ALLOWLIST` is a comma-separated list of approved admin emails or member IDs.

Example format:

`nick@example.com,admin@example.com`

Use the real admin email used to log in through Supabase.

Rules:

- Add only trusted admin accounts.
- Remove old admin emails that should no longer have access.
- Redeploy after changing this value.
- Test both a non-admin and an allowlisted admin.

## 6. App and deployment URL values

Set both URL values to the deployment being tested:

| Variable | Example format |
|---|---|
| `PUBLIC_APP_URL` | `https://humanity-laws.vercel.app` |
| `DEPLOYMENT_URL` | `https://humanity-laws.vercel.app` |

For staging or preview testing, use the staging/preview URL.

For production testing, use the production URL.

The URL must begin with `https://` for live deployment testing.

## 7. Optional monitoring/email vars

These may remain provider placeholders until the final provider is chosen:

- `EMAIL_PROVIDER`
- `ERROR_LOGGING_DSN`
- `MONITORING_ENDPOINT`

If a provider is not final yet:

1. Set a clear placeholder value.
2. Record that provider verification is still incomplete.
3. Do not mark operational readiness complete until the real provider is verified.

## 8. How to redeploy after env vars are saved

After saving Vercel env vars:

1. Open Vercel Deployments.
2. Select the latest deployment.
3. Choose Redeploy.
4. Make sure the redeploy uses the latest `main` branch commit.
5. Wait until the deployment status is Ready.
6. Open the deployment URL.
7. Confirm the homepage loads.

If deployment fails:

1. Open the build logs.
2. Copy the relevant error message only.
3. Do not copy secrets.
4. Record the failure in `LIVE_ENV_TEST_EVIDENCE.md`.
5. Do not continue launch testing until the deployment is Ready.

## 9. How to confirm deployment built successfully

Deployment proof should include:

- Vercel deployment URL.
- Vercel deployment status: Ready.
- Commit SHA deployed, if visible.
- Date/time deployed.
- Homepage load result.
- `/login` load result.
- `/membership` load result.
- `/checkout/monthly` load result while logged in.
- `/checkout/book` load result while logged in.
- `/launch-status` confirms launch remains blocked.

Do not mark deployment proof complete if any core route returns a 404 or runtime error.

## 10. How to record proof in LIVE_ENV_TEST_EVIDENCE.md

Open:

`docs/launch/LIVE_ENV_TEST_EVIDENCE.md`

For each completed item:

1. Change `NO` to `YES` only after verification.
2. Add the environment tested.
3. Add the deployment URL.
4. Add the date/time.
5. Add the test user email when relevant.
6. Add Stripe checkout session ID when relevant.
7. Add Stripe webhook event ID when relevant.
8. Add Supabase membership row result when relevant.
9. Do not paste secret keys.

If an item fails:

1. Keep status as `NO`.
2. Add a short note describing the failure.
3. Stop if the failure is launch-blocking.
4. Bring the exact error back for repair.

## 11. Secret safety warning

Never paste these into screenshots, chats, or public docs:

- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ERROR_LOGGING_DSN`
- Any private provider API key

Safe proof examples:

- “`STRIPE_SECRET_KEY` present in Vercel Preview.”
- “Webhook secret present and matched Stripe endpoint.”
- “Monthly price ID points to `$7/month` recurring price.”

Unsafe proof examples:

- A screenshot showing the full service role key.
- A chat message containing a Stripe secret key.
- A committed `.env` file with real secrets.

## 12. LaunchReady rule

`launchReady` must stay false until live evidence passes.

Public launch may only proceed after:

1. Vercel env vars are configured.
2. Deployment is Ready.
3. Supabase signup/login/session tests pass.
4. Stripe monthly checkout passes.
5. Stripe digital book checkout passes.
6. Webhook delivery passes.
7. Supabase membership row verification passes.
8. Digital book unlock verification passes.
9. Admin allowlist verification passes.
10. Failed/canceled payment tests pass.
11. Hardcover remains an honest placeholder.
12. Founder review and approval are complete.

Current verdict: READY FOR VERCEL ENV ENTRY
