# Humanity Laws Supabase Live Setup Proof

Status: READY FOR SUPABASE LIVE SETUP  
LaunchReady: FALSE until live proof passes.

This guide helps Nick verify Supabase auth, membership rows, digital book access, and admin identity for Humanity Laws.

Evidence log:

- `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`

Do not paste Supabase secret keys into screenshots, chats, public docs, or commits.

## 1. Supabase project URL/key locations

In Supabase:

1. Open the Humanity Laws project.
2. Go to Project Settings.
3. Open API.
4. Confirm these values exist:

| Supabase value | Goes into Vercel variable | Secret safety |
|---|---|---|
| Project URL | `SUPABASE_URL` | Safe to identify as present, but do not expose unnecessarily. |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Safe to identify as present, but do not expose unnecessarily. |
| anon/public key | `SUPABASE_ANON_KEY` | Do not paste full key into evidence. |
| anon/public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Do not paste full key into evidence. |
| service role key | `SUPABASE_SERVICE_ROLE_KEY` | Highly sensitive. Never paste or screenshot full key. |

Proof to record:

- Supabase project name:
- Vercel environment tested:
- Variables present in Vercel: YES/NO
- Date/time verified:

## 2. Auth signup/login settings to verify

In Supabase:

1. Go to Authentication.
2. Open Providers.
3. Confirm Email provider is enabled.
4. Open URL Configuration.
5. Confirm Site URL matches the deployed Humanity Laws URL.
6. Confirm allowed redirect URLs include the deployed Humanity Laws URL.
7. Confirm signup policy:
   - If email confirmation is required, the app should tell the user to check email.
   - If email confirmation is not required, signup should create a session.
8. Confirm password recovery redirect URL is valid if password reset is enabled.

Live app proof:

| Test | Required result | Evidence status |
|---|---|---:|
| Signup | User can create account or receives clear email-confirmation instruction. | NO |
| Login | Confirmed user can log in. | NO |
| Logout | User can log out and protected routes redirect to login. | NO |
| Session persistence | Refresh keeps valid session or clearly returns to login if expired. | NO |

## 3. Required membership table/fields

Confirm the `memberships` table exists in Supabase.

Required fields:

| Field | Expected purpose |
|---|---|
| `member_id` | Supabase user ID for the member. |
| `email` | Member email when available. |
| `membership_status` | Expected values include `FREE`, `ACTIVE`, `PAST_DUE`, `CANCELLED`. |
| `digital_book_access` | Boolean book access flag. |
| `stripe_customer_id` | Stripe customer ID when available. |
| `stripe_subscription_id` | Stripe subscription ID for membership subscriptions. |
| `updated_at` | Last membership update time. |

Proof to record:

- Table exists: YES/NO
- Required fields exist: YES/NO
- Row-level security reviewed: YES/NO
- Date/time verified:

## 4. How to confirm a test user exists

In Supabase:

1. Go to Authentication → Users.
2. Confirm the test user email exists.
3. Confirm the email is verified if confirmation is required.
4. Copy only the user ID if needed for matching membership rows.
5. Do not copy password or tokens into evidence.

Proof to record:

- Test user email:
- Supabase user ID observed: YES/NO
- Email confirmed: YES/NO
- Date/time verified:

## 5. How to confirm unpaid user is blocked

In the live app:

1. Log in as an unpaid test user.
2. Visit `/dashboard`.
3. Visit `/book`.
4. Visit `/spark`.
5. Confirm the user is redirected to `/membership` or a clear blocked state.

In Supabase:

1. Open the `memberships` table.
2. Confirm the unpaid user has no `ACTIVE` membership.
3. Confirm `digital_book_access` is not true unless the user purchased the digital book.

Required result:

- `membership_status` is not `ACTIVE`.
- `digital_book_access` is not true.
- Member-only rooms remain locked.

## 6. How to confirm monthly member has membership_status = ACTIVE

After successful monthly Stripe checkout:

1. Open Supabase Table Editor.
2. Open `memberships`.
3. Find the monthly test user by `member_id` or `email`.
4. Confirm:
   - `membership_status = ACTIVE`
   - `stripe_subscription_id` exists when Stripe provides it.
   - `updated_at` changed after checkout/webhook.

Required result:

- Monthly member row exists.
- Monthly member status is `ACTIVE`.
- The app unlocks `/dashboard`.

## 7. How to confirm monthly member has digital_book_access = true

For the same monthly member row:

1. Confirm `digital_book_access = true`.
2. Log in as the monthly member.
3. Visit `/book`.
4. Confirm the digital book unlocks.

Required result:

- Monthly membership includes digital book access.
- Book access does not require a separate digital book purchase.

## 8. How to confirm digital-book-only purchaser has book access but not full membership

After successful digital-book-only Stripe checkout:

1. Open Supabase Table Editor.
2. Open `memberships`.
3. Find the digital-book-only test user.
4. Confirm:
   - `membership_status = FREE`
   - `digital_book_access = true`
   - `stripe_subscription_id` is blank or not used for the one-time purchase.
5. Log in as the digital-book-only user.
6. Visit `/book`.
7. Confirm book unlocks.
8. Visit `/dashboard`, `/spark`, `/council`, and `/wellness`.
9. Confirm full member rooms remain locked.

Required result:

- Digital-book-only purchase unlocks the book only.
- It does not unlock full monthly membership.

## 9. How to confirm failed/canceled payment does not unlock access

For canceled payment:

1. Start monthly checkout as a fresh unpaid user.
2. Cancel checkout in Stripe.
3. Return to the live app.
4. Confirm no active membership was created.
5. Confirm dashboard/book remain locked.

For failed payment:

1. Start checkout as a fresh unpaid user.
2. Use a Stripe failing test card.
3. Confirm payment fails.
4. Open Supabase `memberships`.
5. Confirm no row grants `membership_status = ACTIVE`.
6. Confirm no row grants `digital_book_access = true` unless a separate successful digital-book purchase happened.

Required result:

- Failed/canceled payment does not unlock membership.
- Failed/canceled payment does not unlock digital book access.

## 10. How to confirm ADMIN_ALLOWLIST email matches admin test user

In Supabase:

1. Go to Authentication → Users.
2. Confirm the admin test user exists.
3. Confirm the admin test user email.

In Vercel:

1. Open Project Settings → Environment Variables.
2. Confirm `ADMIN_ALLOWLIST` contains that exact email or member ID.
3. Redeploy after changing `ADMIN_ALLOWLIST`.

In the live app:

1. Log in as a non-admin test user.
2. Visit `/admin`.
3. Confirm non-admin is blocked.
4. Log in as the allowlisted admin user.
5. Visit `/admin`.
6. Confirm admin is allowed.

Required result:

- Non-admin blocked.
- Allowlisted admin allowed.
- No broad public admin access.

## 11. Secret-safety warning

Never paste these values into screenshots, chats, public docs, or commits:

- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Supabase access tokens
- Supabase refresh tokens
- User passwords
- Stripe secret keys
- Stripe webhook secrets

Safe evidence:

- “Supabase service role key present in Vercel Preview.”
- “Admin test email matches `ADMIN_ALLOWLIST`.”
- “Monthly member row shows `membership_status = ACTIVE` and `digital_book_access = true`.”

Unsafe evidence:

- Screenshot showing full service role key.
- Chat message containing a Supabase token.
- Public document containing a real password.

## 12. LaunchReady rule

`launchReady` remains false until live proof passes.

Do not change `launchReady` based only on local tests.

Public launch remains blocked until:

1. Supabase auth is verified live.
2. Membership rows are verified live.
3. Monthly membership unlock is verified live.
4. Digital-book-only unlock is verified live.
5. Failed/canceled payment remains locked.
6. Admin allowlist is verified live.
7. Founder approval is recorded.

Current verdict: READY FOR SUPABASE LIVE SETUP
