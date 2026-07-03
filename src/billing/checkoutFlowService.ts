import type { MemberProfile, SubscriptionPlanId } from "../member/index.js";
import { SubscriptionStatusService } from "../member/index.js";
import type { CheckoutService } from "./checkoutService.js";

export interface CheckoutStartResult {
  success: boolean;
  planId: SubscriptionPlanId;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

export interface CheckoutCompletionResult {
  success: boolean;
  member?: MemberProfile;
  error?: string;
}

export class CheckoutFlowService {
  constructor(
    private readonly checkout: CheckoutService,
    private readonly subscriptionStatus: SubscriptionStatusService,
  ) {}

  async startCheckout(params: {
    memberId: string;
    planId: SubscriptionPlanId;
    appUrl: string;
  }): Promise<CheckoutStartResult> {
    const baseUrl = params.appUrl.replace(/\/$/, "");
    const result = await this.checkout.createCheckout({
      memberId: params.memberId,
      planId: params.planId,
      successUrl: `${baseUrl}/checkout/success?member_id=${encodeURIComponent(params.memberId)}`,
      cancelUrl: `${baseUrl}/checkout/cancel?plan=${params.planId}`,
    });

    if (!result.success) {
      return {
        success: false,
        planId: params.planId,
        error: result.error ?? "Stripe checkout could not be started.",
      };
    }

    return {
      success: true,
      planId: params.planId,
      checkoutUrl: result.url,
      sessionId: result.sessionId,
    };
  }

  async completeSuccessfulCheckout(params: {
    memberId: string;
    sessionId: string | undefined;
  }): Promise<CheckoutCompletionResult> {
    if (!params.sessionId?.trim()) {
      return { success: false, error: "Stripe session_id is required before membership can be unlocked." };
    }

    const member = await this.subscriptionStatus.markActiveFromPayment(params.memberId);
    return { success: true, member };
  }
}
