import crypto from "node:crypto";
import type { CommercePlanId, SubscriptionPlanId } from "../member/index.js";

export interface StripeCheckoutSessionRequest {
  secretKey?: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  digitalBookPriceId?: string;
  publicAppUrl?: string;
  memberId: string;
  email?: string;
  planId: CommercePlanId;
  fetchImpl?: typeof fetch;
}

export interface StripeCheckoutSessionResult {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

export interface StripeCheckoutSessionSummary {
  id: string;
  paymentStatus?: string;
  status?: string;
  mode?: string;
  customerId?: string;
  subscriptionId?: string;
  email?: string;
  memberId?: string;
  planId?: CommercePlanId;
}

export function priceForPlan(params: {
  planId: CommercePlanId;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  digitalBookPriceId?: string;
}): string | undefined {
  if (params.planId === "MONTHLY_7") return params.monthlyPriceId;
  if (params.planId === "YEARLY_70") return params.yearlyPriceId;
  return params.digitalBookPriceId;
}

export async function createStripeCheckoutSession(params: StripeCheckoutSessionRequest): Promise<StripeCheckoutSessionResult> {
  if (!params.secretKey) return { success: false, error: "STRIPE_SECRET_KEY is missing." };
  if (!params.publicAppUrl) return { success: false, error: "PUBLIC_APP_URL is missing." };

  const price = priceForPlan(params);
  if (!price) return { success: false, error: `Stripe price is missing for ${params.planId}.` };

  const baseUrl = params.publicAppUrl.replace(/\/$/, "");
  const isBookOnly = params.planId === "DIGITAL_BOOK_ONLY";
  const isBookWithTrial = params.planId === "DIGITAL_BOOK";
  const body = new URLSearchParams({
    mode: isBookOnly ? "payment" : "subscription",
    client_reference_id: params.memberId,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel?plan=${params.planId}`,
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    "metadata[member_id]": params.memberId,
    "metadata[plan_id]": params.planId,
  });

  if (isBookWithTrial) {
    if (!params.monthlyPriceId) return { success: false, error: "STRIPE_MONTHLY_7_PRICE_ID is required for the digital-book membership trial." };
    body.set("line_items[1][price]", params.monthlyPriceId);
    body.set("line_items[1][quantity]", "1");
    body.set("subscription_data[trial_period_days]", "30");
    body.set("subscription_data[metadata][member_id]", params.memberId);
    body.set("subscription_data[metadata][plan_id]", params.planId);
  } else if (!isBookOnly) {
    body.set("subscription_data[metadata][member_id]", params.memberId);
    body.set("subscription_data[metadata][plan_id]", params.planId);
  }

  if (params.email) body.set("customer_email", params.email);

  const fetcher = params.fetchImpl ?? fetch;
  const response = await fetcher("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${params.secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const stripeError = json.error && typeof json.error === "object" ? (json.error as Record<string, unknown>).message : undefined;
    return { success: false, error: typeof stripeError === "string" ? stripeError : "Stripe checkout session creation failed." };
  }

  return {
    success: true,
    url: typeof json.url === "string" ? json.url : undefined,
    sessionId: typeof json.id === "string" ? json.id : undefined,
  };
}

export function verifyStripeWebhookSignature(params: {
  payload: string;
  signatureHeader?: string;
  webhookSecret?: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}): boolean {
  if (!params.webhookSecret || !params.signatureHeader) return false;

  const parts = Object.fromEntries(
    params.signatureHeader.split(",").map((part) => {
      const [key, ...value] = part.split("=");
      return [key, value.join("=")];
    }),
  );
  const timestamp = parts.t;
  const expectedSignature = parts.v1;
  if (!timestamp || !expectedSignature) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const tolerance = params.toleranceSeconds ?? 300;
  const now = params.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNumber) > tolerance) return false;

  const signedPayload = `${timestamp}.${params.payload}`;
  const actualSignature = crypto.createHmac("sha256", params.webhookSecret).update(signedPayload).digest("hex");
  const actual = Buffer.from(actualSignature);
  const expected = Buffer.from(expectedSignature);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export async function retrieveStripeCheckoutSession(params: {
  secretKey?: string;
  sessionId?: string;
  fetchImpl?: typeof fetch;
}): Promise<{ success: boolean; session?: StripeCheckoutSessionSummary; error?: string }> {
  if (!params.secretKey) return { success: false, error: "STRIPE_SECRET_KEY is missing." };
  if (!params.sessionId) return { success: false, error: "session_id is missing." };

  const fetcher = params.fetchImpl ?? fetch;
  const response = await fetcher(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(params.sessionId)}`, {
    headers: { authorization: `Bearer ${params.secretKey}` },
  });
  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const stripeError = json.error && typeof json.error === "object" ? (json.error as Record<string, unknown>).message : undefined;
    return { success: false, error: typeof stripeError === "string" ? stripeError : "Stripe checkout session retrieval failed." };
  }

  const metadata = json.metadata && typeof json.metadata === "object" ? (json.metadata as Record<string, unknown>) : {};
  const customerDetails = json.customer_details && typeof json.customer_details === "object" ? (json.customer_details as Record<string, unknown>) : {};

  return {
    success: true,
    session: {
      id: String(json.id ?? params.sessionId),
      paymentStatus: typeof json.payment_status === "string" ? json.payment_status : undefined,
      status: typeof json.status === "string" ? json.status : undefined,
      mode: typeof json.mode === "string" ? json.mode : undefined,
      customerId: typeof json.customer === "string" ? json.customer : undefined,
      subscriptionId: typeof json.subscription === "string" ? json.subscription : undefined,
      email: typeof customerDetails.email === "string" ? customerDetails.email : undefined,
      memberId: typeof metadata.member_id === "string" ? metadata.member_id : undefined,
      planId:
        metadata.plan_id === "MONTHLY_7" || metadata.plan_id === "YEARLY_70" || metadata.plan_id === "DIGITAL_BOOK" || metadata.plan_id === "DIGITAL_BOOK_ONLY"
          ? metadata.plan_id
          : undefined,
    },
  };
}

export function checkoutSessionIsPaid(session: StripeCheckoutSessionSummary): boolean {
  return session.paymentStatus === "paid" || session.status === "complete";
}

export async function createStripeBillingPortalSession(params: {
  secretKey?: string;
  customerId?: string;
  returnUrl?: string;
  fetchImpl?: typeof fetch;
}): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!params.secretKey) return { success: false, error: "STRIPE_SECRET_KEY is missing." };
  if (!params.customerId) return { success: false, error: "No Stripe customer is connected to this membership." };
  if (!params.returnUrl) return { success: false, error: "PUBLIC_APP_URL is missing." };

  const response = await (params.fetchImpl ?? fetch)("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${params.secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ customer: params.customerId, return_url: params.returnUrl }),
  });
  const json = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    const stripeError = json.error && typeof json.error === "object" ? (json.error as Record<string, unknown>).message : undefined;
    return { success: false, error: typeof stripeError === "string" ? stripeError : "Stripe billing portal session creation failed." };
  }
  return { success: true, url: typeof json.url === "string" ? json.url : undefined };
}
