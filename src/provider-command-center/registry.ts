import type {ProviderDefinition, ProviderId} from "./types.js";

const allEnvironments = ["LOCAL", "DEVELOPMENT", "STAGING", "PRODUCTION"] as const;
const definition = (
  id: ProviderId,
  displayName: string,
  category: ProviderDefinition["category"],
  capabilities: readonly string[],
  credentialRequirements: readonly string[],
  webhookRequirements: readonly string[] = [],
  dataClassification: ProviderDefinition["dataClassification"] = "CONFIDENTIAL",
): ProviderDefinition => ({
  id, displayName, category, capabilities, supportedEnvironments: allEnvironments,
  configurationSchemaVersion: 1, credentialRequirements, webhookRequirements,
  healthCheckStrategy: "LOCAL_CONFIGURATION",
  rateLimitMetadata: "Durable provider/capability limits required before activation",
  costBudgetMetadata: "Zero default budget; explicit Founder authorization required",
  dataClassification,
  retentionPolicyReference: "docs/provider-command-center/PROVIDER_SECURITY_MATRIX.md",
  defaultState: "NOT_CONFIGURED",
  defaultReadiness: "NOT_VERIFIED",
});

export const CanonicalProviderRegistry: readonly ProviderDefinition[] = [
  definition("github", "GitHub", "SOURCE_CONTROL", ["REPOSITORY_READ", "EVIDENCE_LINK"], ["GITHUB_TOKEN"]),
  definition("vercel", "Vercel", "DEPLOYMENT", ["DEPLOYMENT_READ", "BUILD_STATUS"], ["VERCEL_TOKEN"]),
  definition("supabase", "Supabase", "DATABASE", ["DATABASE", "AUTH", "STORAGE"], ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"], [], "RESTRICTED"),
  definition("stripe", "Stripe", "PAYMENTS", ["PAYMENT_READ", "WEBHOOK"], ["STRIPE_SECRET_KEY"], ["STRIPE_WEBHOOK_SECRET"], "RESTRICTED"),
  definition("twilio_messaging", "Twilio Messaging", "MESSAGING", ["SMS_SIMULATION", "SMS_TRANSACTIONAL"], ["TWILIO_ACCOUNT_SID", "TWILIO_API_KEY_SID", "TWILIO_API_KEY_SECRET", "TWILIO_MESSAGING_SERVICE_SID"], ["TWILIO_STATUS_CALLBACK_URL"], "RESTRICTED"),
  definition("twilio_verify", "Twilio Verify", "MESSAGING", ["VERIFY_SIMULATION", "VERIFY_SMS"], ["TWILIO_ACCOUNT_SID", "TWILIO_API_KEY_SID", "TWILIO_API_KEY_SECRET", "TWILIO_VERIFY_SERVICE_SID"], [], "RESTRICTED"),
  definition("sendgrid", "SendGrid", "EMAIL", ["EMAIL_SIMULATION", "EMAIL_TRANSACTIONAL"], ["SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL", "SENDGRID_FROM_NAME"], ["SENDGRID_WEBHOOK_VERIFICATION_KEY"], "RESTRICTED"),
  definition("lulu", "Lulu", "PUBLISHING", ["PRINT_READ", "ORDER_SIMULATION"], ["LULU_CLIENT_KEY", "LULU_CLIENT_SECRET"]),
  definition("openai", "OpenAI", "AI", ["MODEL_HEALTH", "GENERATION_SIMULATION"], ["OPENAI_API_KEY"], [], "RESTRICTED"),
  definition("google_analytics", "Google Analytics", "ANALYTICS", ["ANALYTICS_READ"], ["GOOGLE_ANALYTICS_PROPERTY_ID"]),
  definition("google_tag_manager", "Google Tag Manager", "ANALYTICS", ["TAG_CONFIGURATION_READ"], ["GOOGLE_TAG_MANAGER_CONTAINER_ID"]),
  definition("google_search_console", "Google Search Console", "ANALYTICS", ["SEARCH_READ"], ["GOOGLE_SEARCH_CONSOLE_SITE_URL"]),
  definition("sentry", "Sentry", "MONITORING", ["ISSUE_READ", "HEALTH"], ["SENTRY_DSN"]),
] as const;

export function getProviderDefinition(id: ProviderId): ProviderDefinition {
  const provider = CanonicalProviderRegistry.find(item => item.id === id);
  if (!provider) throw new Error(`Unknown provider: ${String(id)}`);
  return provider;
}
