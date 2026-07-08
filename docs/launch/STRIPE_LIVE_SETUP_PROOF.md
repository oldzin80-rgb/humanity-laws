# Humanity Laws Stripe Live Setup Proof

Status: READY FOR STRIPE LIVE SETUP  
LaunchReady: FALSE until live proof passes.

This guide helps Nick verify Stripe checkout, price IDs, webhook delivery, payment outcomes, membership updates, and digital book unlocks.

Evidence log:

- `docs/launch/LIVE_ENV_TEST_EVIDENCE.md`

Use Stripe test mode for staging. Do not use real customer cards for staging verification.

## 1. Where to find Stripe secret key

In Stripe:

1. Open the Stripe Dashboard.
2. Make sure you are in the correct mode:
   - Test mode for staging.
   - Live mode only when production launch is approved.
3. Go to Developers.
4. Open API keys.
5. Find the secret key.
6. Put that value into Vercel as:
   - `STRIPE_SECRET_KEY`

Proof to record:

- Stripe mode used:
- Secret key present in Vercel: YES/NO
- Date/time verified:

Do not paste the secret key into evidence.

## 2. Where to find monthly $7 price ID

In Stripe:

1. Go to Product catalog.
2. Open the monthly membership product.
3. Confirm the price is recurring.
4. Confirm the amount is `$7/month`.
5. Copy the price ID.
6. Put that value into Vercel as:
   - `STRIPE_MONTHLY_7_PRICE_ID`

Proof to record:

- Product name:
- Price amount confirmed as `$7/month`: YES/NO
- Price ID present in Vercel: YES/NO
- Date/time verified:

## 3. Where to find yearly $70 price ID

In Stripe:

1. Go to Product catalog.
2. Open the yearly membership product if yearly remains enabled.
3. Confirm the price is recurring.
4. Confirm the amount is `$70/year`.
5. Copy the price ID.
6. Put that value into Vercel as:
   - `STRIPE_YEARLY_70_PRICE_ID`

Proof to record:

- Product name:
- Price amount confirmed as `$70/year`: YES/NO
- Price ID present in Vercel: YES/NO
- Date/time verified:

If yearly is not being offered publicly, keep this documented and do not present it as the primary purchase path.

## 4. Where to find digital book price ID

In Stripe:

1. Go to Product catalog.
2. Open the digital book product.
3. Confirm it is a one-time payment price.
4. Confirm it is not a subscription.
5. Copy the price ID.
6. Put that value into Vercel as:
   - `STRIPE_DIGITAL_BOOK_PRICE_ID`

Proof to record:

- Product name:
- One-time price confirmed: YES/NO
- Price ID present in Vercel: YES/NO
- Date/time verified:

## 5. Where to configure webhook endpoint

In Stripe:

1. Go to Developers.
2. Open Webhooks.
3. Choose Add endpoint.
4. Enter the Humanity Laws endpoint:
   - `https://YOUR_DEPLOYMENT_URL/api/stripe-webhook`
5. Select events to send.
6. Required event:
   - `checkout.session.completed`
7. Save the webhook endpoint.

Proof to record:

- Webhook endpoint URL:
- Required event selected: YES/NO
- Date/time verified:

## 6. Where to find webhook signing secret

In Stripe:

1. Go to Developers → Webhooks.
2. Open the Humanity Laws webhook endpoint.
3. Find the signing secret.
4. Put that value into Vercel as:
   - `STRIPE_WEBHOOK_SECRET`

Proof to record:

- Webhook signing secret present in Vercel: YES/NO
- Signing secret matched to correct endpoint: YES/NO
- Date/time verified:

Do not paste the webhook signing secret into evidence.

## 7. Monthly checkout proof steps

In the live app:

1. Log in as the monthly member test user.
2. Go to `/membership`.
3. Choose the monthly membership path.
4. Confirm Stripe Checkout opens.
5. Confirm the product is monthly membership.
6. Confirm the price is `$7/month`.
7. Complete payment with a Stripe test card.
8. Confirm Stripe redirects back to `/checkout/success`.
9. Record the Stripe checkout session ID.

Required result:

- Checkout opens.
- Correct product appears.
- Correct `$7/month` price appears.
- Success redirect works.

Record FAIL if checkout opens with the wrong price, wrong product, missing session, or a literal environment variable name.

## 8. Digital-book-only checkout proof steps

In the live app:

1. Log in as the digital-book-only test user.
2. Go to `/membership`.
3. Choose the digital book only path.
4. Confirm Stripe Checkout opens.
5. Confirm the product is digital book only.
6. Confirm the price is one-time payment.
7. Confirm it is not a subscription.
8. Complete payment with a Stripe test card.
9. Confirm Stripe redirects back to `/checkout/success`.
10. Record the Stripe checkout session ID.

Required result:

- Digital book checkout opens.
- Digital book is one-time payment.
- Digital book checkout does not create full monthly membership.

## 9. Webhook delivery proof steps

In Stripe:

1. Go to Developers → Webhooks.
2. Open the Humanity Laws webhook endpoint.
3. Open recent attempts/events.
4. Find the `checkout.session.completed` event from the monthly checkout.
5. Confirm delivery status is successful.
6. Find the `checkout.session.completed` event from the digital book checkout.
7. Confirm delivery status is successful.
8. Record the webhook event IDs.

Required result:

- `checkout.session.completed` is received.
- Webhook signature verifies successfully.
- Stripe does not keep retrying because of app errors.

Record FAIL if delivery fails, signature verification fails, or the app returns an error.

## 10. Membership row update proof

In Supabase after successful monthly checkout:

1. Open the `memberships` table.
2. Find the monthly member test user.
3. Confirm:
   - `membership_status = ACTIVE`
   - `digital_book_access = true`
   - `stripe_customer_id` exists when Stripe provides it.
   - `stripe_subscription_id` exists for the subscription.
4. Confirm `updated_at` changed after checkout/webhook.

Required result:

- Monthly checkout creates or updates the membership row.
- Monthly membership activates full member access.
- Monthly membership includes digital book access.

## 11. Digital book unlock proof

In Supabase after successful digital-book-only checkout:

1. Open the `memberships` table.
2. Find the digital-book-only test user.
3. Confirm:
   - `membership_status = FREE`
   - `digital_book_access = true`
   - `stripe_subscription_id` is blank or not used for the one-time purchase.

In the live app:

1. Log in as the digital-book-only user.
2. Visit `/book`.
3. Confirm book unlocks.
4. Visit `/dashboard`, `/spark`, `/council`, and `/wellness`.
5. Confirm full member rooms remain locked.

Required result:

- Book unlocks.
- Full membership does not unlock.

## 12. Failed/canceled payment proof

Canceled checkout:

1. Log in as a fresh unpaid user.
2. Start monthly checkout.
3. Cancel checkout from Stripe.
4. Return to the app.
5. Confirm dashboard and book remain locked.
6. Confirm Supabase does not show active membership or book access.

Failed payment:

1. Log in as a fresh unpaid user.
2. Start monthly checkout.
3. Use a Stripe failing test card.
4. Confirm payment fails.
5. Confirm no membership unlock occurs.
6. Confirm Supabase does not show active membership or book access.

Required result:

- Failed/canceled payment does not unlock membership.
- Failed/canceled payment does not unlock digital book access.

## 13. Hardcover remains placeholder/no checkout

In the live app:

1. Visit `/book/hardcover`.
2. Confirm the page says hardcover fulfillment is not live.
3. Confirm there is no hardcover Stripe checkout.
4. Confirm there is no fake shipping promise.
5. Confirm there is no fake fulfillment claim.

Required result:

- Hardcover remains a placeholder.
- No hardcover purchase is accepted until real POD/fulfillment exists.

## 14. Secret-safety warning

Never paste these values into screenshots, chats, public docs, or commits:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Stripe restricted keys
- Supabase service role key
- Full customer payment details
- Full payment method details

Safe evidence:

- “Stripe secret key present in Vercel Preview.”
- “Webhook signing secret matched to endpoint.”
- “Monthly checkout session succeeded.”
- “Webhook event delivered successfully.”
- “Monthly member row shows `membership_status = ACTIVE` and `digital_book_access = true`.”

Unsafe evidence:

- Screenshot showing full Stripe secret key.
- Chat message containing webhook signing secret.
- Public document containing customer/payment details.

## 15. LaunchReady rule

`launchReady` remains false until live proof passes.

Do not change `launchReady` based only on local tests.

Public launch remains blocked until:

1. Stripe price IDs are verified.
2. Monthly checkout is verified.
3. Digital book checkout is verified.
4. Webhook delivery is verified.
5. Membership row update is verified.
6. Digital book unlock is verified.
7. Failed/canceled payment remains locked.
8. Hardcover remains an honest placeholder.
9. Founder approval is recorded.

Current verdict: READY FOR STRIPE LIVE SETUP
