import { SubscriptionStatusService } from "../member/index.js";
import type { StripeSubscriptionEvent } from "./stripeWebhookHandler.js";
export class SubscriptionSyncService { constructor(private readonly memberStatus: SubscriptionStatusService) {} async sync(event: StripeSubscriptionEvent) { if (event.status === "active") return this.memberStatus.markActiveFromPayment(event.memberId); throw new Error(`Subscription status not active: ${event.status}`); } }
