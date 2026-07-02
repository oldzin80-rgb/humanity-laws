# Sprint 1 — Staging Deployment Setup

Purpose: prepare the repository for staging deployment without deploying automatically and without storing secrets in source.

Selected default target: **Vercel static hosting**

Reason: the current app shell renders TypeScript page models to static HTML, making static staging hosting the simplest first deployment target.

## Repository Configuration Added

| File | Purpose |
|---|---|
| `vercel.json` | Tells Vercel to build the static staging site into `dist/`. |
| `scripts/build-static-site.ts` | Generates static HTML files for every launch route. |
| `src/application/staticSiteExporter.ts` | Shared static export implementation. |
| `tests/static-site-export.test.ts` | Proves every launch route is exported and Launch Ready remains false. |
| `.env.example` | Lists required staging environment values without secrets. |

## Build Command

Use this command for staging build verification:

```bash
npm run build:staging
```

The build creates:

```text
dist/
  index.html
  book/index.html
  join/index.html
  pricing/index.html
  login/index.html
  dashboard/index.html
  spark/index.html
  adam/index.html
  eve/index.html
  council/index.html
  table/index.html
  library/index.html
  founder/index.html
  admin/index.html
  launch-status/index.html
  staging-manifest.json
```

## Values Nick Must Supply

Do not paste secrets into chat. Add these only in the staging host's encrypted environment settings.

| Value | Where it belongs | Why it is needed | Secret? |
|---|---|---|---|
| `PUBLIC_APP_URL` | Vercel staging environment variable | Public app URL for redirects and generated links. | No |
| `DEPLOYMENT_URL` | Vercel staging environment variable | URL used by deployment verifier route checks. | No |
| `SUPABASE_URL` | Vercel staging environment variable | Staging Supabase project URL. | No |
| `SUPABASE_ANON_KEY` | Vercel staging environment variable | Client-safe Supabase anon key. | Yes-ish; treat carefully |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel encrypted environment variable | Trusted server-side Supabase operations. | Yes |
| `STRIPE_SECRET_KEY` | Vercel encrypted environment variable | Stripe test-mode server key. | Yes |
| `STRIPE_WEBHOOK_SECRET` | Vercel encrypted environment variable | Stripe webhook verification. | Yes |
| `STRIPE_MONTHLY_7_PRICE_ID` | Vercel staging environment variable | Monthly membership checkout. | No |
| `STRIPE_YEARLY_70_PRICE_ID` | Vercel staging environment variable | Yearly membership checkout. | No |
| `EMAIL_PROVIDER` | Vercel staging environment variable | Transactional email provider name. | No |
| `ERROR_LOGGING_DSN` | Vercel encrypted environment variable | Error reporting destination. | Yes |
| `MONITORING_ENDPOINT` | Vercel encrypted environment variable | Monitoring/health endpoint or dashboard target. | Yes |

## Staging Verification Order

1. Create Vercel project from this repository.
2. Set environment variables in Vercel staging/preview environment.
3. Run the Vercel build with `npm run build:staging`.
4. Confirm `dist/staging-manifest.json` exists and says `launchReady: false`.
5. Set `DEPLOYMENT_URL` to the staging deployment URL.
6. Run the deployment verifier against staging.
7. Run end-to-end staging checks for auth, session, Supabase, Stripe test mode, email, monitoring, logging, backup, rollback, and admin protection.

## Stop Condition

Stop before public launch. Staging verification does not approve launch. Launch Ready remains false until manual review, release approval, and deployment evidence all exist.

