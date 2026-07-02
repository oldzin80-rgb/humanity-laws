import type { SubscriptionPlanId } from "../member/index.js";
import { StripeClientBoundary } from "../infrastructure/index.js";
export class CheckoutService { constructor(private readonly stripe: StripeClientBoundary) {} async createCheckout(params: { memberId: string; planId: SubscriptionPlanId; successUrl: string; cancelUrl: string }) { return this.stripe.createCheckoutSession(params); } }
