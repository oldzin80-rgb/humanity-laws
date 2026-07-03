import { ServiceContainer } from "../bootstrap/index.js";
import { ProviderRegistry, SupabaseClientBoundary, StripeClientBoundary } from "../infrastructure/index.js";
import { InMemoryMemberRepository, AuthService, SubscriptionStatusService } from "../member/index.js";
import { CheckoutFlowService, CheckoutService } from "../billing/index.js";
import { SparkNoRepeatService, CouncilConversationService, MemoryPersistenceService } from "../experiences/index.js";
export { createMergedHumanityLawsRuntime } from "./mergedHumanityLaws.js";
export function createLaunchRuntime(env: Record<string, string | undefined> = process.env) {
  const container = new ServiceContainer();
  const providers = new ProviderRegistry();
  const supabase = new SupabaseClientBoundary({ url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY });
  const stripe = new StripeClientBoundary({ secretKey: env.STRIPE_SECRET_KEY, webhookSecret: env.STRIPE_WEBHOOK_SECRET, monthlyPriceId: env.STRIPE_MONTHLY_7_PRICE_ID, yearlyPriceId: env.STRIPE_YEARLY_70_PRICE_ID });
  providers.register(supabase); providers.register(stripe);
  const members = new InMemoryMemberRepository();
  const auth = new AuthService(members);
  const subscriptionStatus = new SubscriptionStatusService(members);
  const checkout = new CheckoutService(stripe);
  const checkoutFlow = new CheckoutFlowService(checkout, subscriptionStatus);
  const spark = new SparkNoRepeatService();
  const memory = new MemoryPersistenceService();
  const council = new CouncilConversationService(undefined, memory);
  return { container, providers, supabase, stripe, members, auth, subscriptionStatus, checkout, checkoutFlow, spark, memory, council };
}
