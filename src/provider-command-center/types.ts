export const ProviderIds = [
  "github", "vercel", "supabase", "stripe", "twilio_messaging",
  "twilio_verify", "sendgrid", "lulu", "openai", "google_analytics",
  "google_tag_manager", "google_search_console", "sentry",
] as const;
export type ProviderId = typeof ProviderIds[number];

export type ProviderCategory =
  | "SOURCE_CONTROL" | "DEPLOYMENT" | "DATABASE" | "PAYMENTS"
  | "MESSAGING" | "EMAIL" | "PUBLISHING" | "AI" | "ANALYTICS"
  | "MONITORING";
export type ProviderEnvironment = "LOCAL" | "DEVELOPMENT" | "STAGING" | "PRODUCTION";
export type ProviderState =
  | "NOT_CONFIGURED" | "CREDENTIALS_MISSING" | "CONFIGURED_DISABLED"
  | "VALIDATION_PENDING" | "VALIDATED" | "DEGRADED" | "PAUSED"
  | "BLOCKED" | "ACTIVE_STAGING" | "ACTIVE_PRODUCTION" | "ERROR";
export type ActivationReadiness = "NOT_VERIFIED" | "BLOCKED" | "READY_FOR_VALIDATION" | "VALIDATED";

export interface ProviderDefinition {
  id: ProviderId;
  displayName: string;
  category: ProviderCategory;
  capabilities: readonly string[];
  supportedEnvironments: readonly ProviderEnvironment[];
  configurationSchemaVersion: number;
  credentialRequirements: readonly string[];
  webhookRequirements: readonly string[];
  healthCheckStrategy: "LOCAL_CONFIGURATION" | "NON_DESTRUCTIVE_REMOTE";
  rateLimitMetadata: string;
  costBudgetMetadata: string;
  dataClassification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  retentionPolicyReference: string;
  defaultState: ProviderState;
  defaultReadiness: ActivationReadiness;
}

export interface SecretReference {
  referenceName: string;
  providerId: ProviderId;
  environment: ProviderEnvironment;
  versionFingerprint?: string;
  configured: boolean;
  lastValidatedAt?: string;
  validationResult: "NOT_VALIDATED" | "VALID" | "INVALID";
  rotationStatus: "CURRENT" | "ROTATION_DUE" | "ROTATING" | "REVOKED";
}

export interface ProviderConfiguration {
  providerId: ProviderId;
  environment: ProviderEnvironment;
  state: ProviderState;
  readiness: ActivationReadiness;
  version: number;
  secretReferences: readonly SecretReference[];
  budgetAuthorized: boolean;
  policyValidated: boolean;
  founderAuthorized: boolean;
  evidenceReferences: readonly string[];
  globalPaused: boolean;
  providerPaused: boolean;
  lastValidationAt?: string;
}

export interface ProviderAuditEvent {
  id: string;
  providerId: ProviderId;
  environment: ProviderEnvironment;
  actorId: string;
  action: string;
  outcome: "ALLOWED" | "DENIED" | "RECORDED";
  reasonCodes: readonly string[];
  occurredAt: string;
  correlationId: string;
  immutable: true;
}

export interface ProviderOutboxRecord {
  id: string;
  topic: string;
  aggregateId: string;
  payloadReference: string;
  status: "PENDING";
  createdAt: string;
}

export interface ProviderAdapter {
  readonly providerId: ProviderId;
  validateConfiguration(references: readonly SecretReference[]): Promise<{valid: boolean; blockers: string[]}>;
  checkCredentialPresence(references: readonly SecretReference[]): {present: boolean; missing: string[]};
  verifyCredentials(): Promise<{verified: boolean; evidenceReference?: string; externalCalls: number}>;
  healthCheck(): Promise<{healthy: boolean; status: "UNKNOWN" | "HEALTHY" | "DEGRADED"; externalCalls: number}>;
  discoverCapabilities(): readonly string[];
  verifyWebhook(input: {rawBody: string; signature?: string}): {valid: boolean; reason?: string};
  retrieveUsage(): Promise<{status: "UNKNOWN" | "AVAILABLE"; units?: number; externalCalls: number}>;
  retrieveCost(): Promise<{status: "UNKNOWN" | "AVAILABLE"; amountMinor?: number; externalCalls: number}>;
  simulate(capability: string): Promise<{simulated: true; externalCalls: 0; evidenceReference: string}>;
  requestActivation(): {requested: true; activated: false};
  pause(): {paused: true};
  resume(): {resumed: true; activated: false};
  disable(): {disabled: true};
}
