import {createHash} from "node:crypto";
import type {ProviderEnvironment, ProviderId, SecretReference} from "./types.js";

export const CoreProviderIds = ["github", "vercel", "supabase", "stripe", "openai", "lulu"] as const;
export type CoreProviderId = typeof CoreProviderIds[number];
export type DriftClassification =
  | "MATCHED" | "DRIFTED" | "MISSING" | "STALE" | "CONFLICTING"
  | "NOT_AUTHORIZED" | "NOT_CONFIGURED" | "UNKNOWN";

export const CoreProviderCapabilities: Readonly<Record<CoreProviderId, readonly string[]>> = {
  github: ["REPOSITORY_METADATA_READ", "BRANCH_COMMIT_READ", "PULL_REQUEST_READ", "WORKFLOW_STATUS_READ", "RELEASE_EVIDENCE_READ"],
  vercel: ["PROJECT_IDENTITY_READ", "DEPLOYMENT_STATUS_READ", "DOMAIN_READINESS_READ", "ENV_NAME_METADATA_READ", "REDACTED_LOG_READ"],
  supabase: ["PROJECT_IDENTITY_READ", "MIGRATION_STATUS_READ", "AUTH_READINESS_READ", "STORAGE_READINESS_READ", "RLS_EVIDENCE_READ"],
  stripe: ["ACCOUNT_READINESS_READ", "PRODUCT_PRICE_READ", "WEBHOOK_READINESS_READ", "TEST_SUMMARY_READ", "PAYMENT_OBSERVATION_READ"],
  openai: ["CREDENTIAL_VALIDATION", "MODEL_REGISTRY_READ", "USAGE_BUDGET_READ", "POLICY_READ", "SIMULATION"],
  lulu: ["ACCOUNT_READINESS_READ", "PRODUCT_METADATA_READ", "PRINT_SPEC_READ", "FULFILLMENT_STATUS_READ", "ORDER_ESTIMATE_SIMULATION"],
};
export const ProhibitedCoreProviderActions = [
  "GITHUB_MERGE", "GITHUB_BRANCH_DELETE", "GITHUB_SECRET_MUTATION",
  "VERCEL_PRODUCTION_PROMOTION", "VERCEL_DOMAIN_MUTATION", "VERCEL_SECRET_RETRIEVAL",
  "SUPABASE_SCHEMA_MUTATION", "SUPABASE_DATA_MUTATION",
  "STRIPE_CHARGE", "STRIPE_REFUND", "STRIPE_PRODUCT_MUTATION", "STRIPE_CUSTOMER_MUTATION",
  "OPENAI_UNRESTRICTED_INFERENCE", "OPENAI_TRAINING_SUBMISSION",
  "LULU_ORDER", "LULU_PUBLICATION_MUTATION", "LULU_PRICE_MUTATION",
] as const;

export const CoreProviderSecretReferences: Readonly<Record<CoreProviderId, readonly string[]>> = {
  github: ["GITHUB_APP_ID", "GITHUB_INSTALLATION_ID", "GITHUB_PRIVATE_KEY"],
  vercel: ["VERCEL_TOKEN", "VERCEL_TEAM_ID", "VERCEL_PROJECT_ID"],
  supabase: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_PROJECT_REF"],
  stripe: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PUBLISHABLE_KEY"],
  openai: ["OPENAI_API_KEY", "OPENAI_PROJECT_ID", "OPENAI_ORG_ID"],
  lulu: ["LULU_CLIENT_KEY", "LULU_CLIENT_SECRET", "LULU_API_BASE_URL"],
};

export interface ExpectedProviderResource {
  providerId: CoreProviderId; environment: ProviderEnvironment; resourceType: string;
  resourceKey: string; expectedValueFingerprint?: string; required: boolean;
  approvedAt: string; evidenceReference: string;
}
export interface ObservedProviderResource {
  providerId: CoreProviderId; environment: ProviderEnvironment; resourceType: string;
  resourceKey: string; observedValueFingerprint?: string; observedAt: string;
  authorized: boolean; configured: boolean; evidenceReference?: string;
  conflictReferences?: readonly string[];
}
export interface DriftFinding {
  providerId: CoreProviderId; resourceKey: string; classification: DriftClassification;
  explanation: string; expectedEvidence: string; observedEvidence?: string;
  detectedAt: string; actionable: boolean;
}
export function detectDrift(
  expected: ExpectedProviderResource,
  observed: ObservedProviderResource | undefined,
  now: string,
  staleAfterMs = 86_400_000,
): DriftFinding {
  let classification: DriftClassification;
  let explanation: string;
  if (!observed) [classification, explanation] = ["MISSING", "Required provider observation is missing."];
  else if (!observed.configured) [classification, explanation] = ["NOT_CONFIGURED", "Provider resource is not configured."];
  else if (!observed.authorized) [classification, explanation] = ["NOT_AUTHORIZED", "Observed permission scope is not authorized."];
  else if ((observed.conflictReferences?.length ?? 0) > 1) [classification, explanation] = ["CONFLICTING", "Observed evidence conflicts."];
  else if (Date.parse(now) - Date.parse(observed.observedAt) > staleAfterMs) [classification, explanation] = ["STALE", "Provider observation is stale."];
  else if (!expected.expectedValueFingerprint || !observed.observedValueFingerprint) [classification, explanation] = ["UNKNOWN", "Evidence cannot prove the expected value."];
  else if (expected.expectedValueFingerprint !== observed.observedValueFingerprint) [classification, explanation] = ["DRIFTED", "Observed state differs from approved expected state."];
  else [classification, explanation] = ["MATCHED", "Observed state matches approved expected state."];
  return {
    providerId: expected.providerId, resourceKey: expected.resourceKey,
    classification, explanation, expectedEvidence: expected.evidenceReference,
    observedEvidence: observed?.evidenceReference, detectedAt: now,
    actionable: classification !== "MATCHED",
  };
}

export interface CoreProviderAdapter {
  providerId: CoreProviderId;
  inspectConfiguration(): {status: "NOT_CONFIGURED" | "CONFIGURED"; externalCalls: 0};
  validateCredentialPresence(references: readonly SecretReference[]): {valid: boolean; missing: string[]};
  verifyCredentialsReadOnly(): Promise<{status: "NOT_EXECUTED"; externalCalls: 0}>;
  capabilities(): readonly string[];
  health(): Promise<{status: "UNKNOWN"; externalCalls: 0}>;
  usage(): Promise<{status: "UNKNOWN"; externalCalls: 0}>;
  cost(): Promise<{status: "UNKNOWN"; externalCalls: 0}>;
  configurationReadiness(): {status: "NOT_VERIFIED"};
  simulate(capability: string): {simulated: true; externalCalls: 0; evidenceReference: string};
  requestControlledStagingAction(): {requested: true; executed: false};
}
export class ReadOnlyCoreProviderAdapter implements CoreProviderAdapter {
  constructor(readonly providerId: CoreProviderId) {}
  inspectConfiguration() { return {status: "NOT_CONFIGURED" as const, externalCalls: 0 as const}; }
  validateCredentialPresence(references: readonly SecretReference[]) {
    const present = new Set(references.filter(item => item.configured).map(item => item.referenceName));
    const missing = CoreProviderSecretReferences[this.providerId].filter(item => !present.has(item));
    return {valid: missing.length === 0, missing: [...missing]};
  }
  verifyCredentialsReadOnly() { return Promise.resolve({status: "NOT_EXECUTED" as const, externalCalls: 0 as const}); }
  capabilities() { return CoreProviderCapabilities[this.providerId]; }
  health() { return Promise.resolve({status: "UNKNOWN" as const, externalCalls: 0 as const}); }
  usage() { return Promise.resolve({status: "UNKNOWN" as const, externalCalls: 0 as const}); }
  cost() { return Promise.resolve({status: "UNKNOWN" as const, externalCalls: 0 as const}); }
  configurationReadiness() { return {status: "NOT_VERIFIED" as const}; }
  simulate(capability: string) {
    return {
      simulated: true as const, externalCalls: 0 as const,
      evidenceReference: `simulation:${createHash("sha256").update(`${this.providerId}:${capability}`).digest("hex").slice(0, 16)}`,
    };
  }
  requestControlledStagingAction() { return {requested: true as const, executed: false as const}; }
}

export interface FounderProviderCommand {
  actorId: string; actorFounder: boolean; providerId: CoreProviderId;
  environment: ProviderEnvironment; capability: string; expectedVersion: number;
  idempotencyKey: string; reason: string; budgetAuthorized: boolean;
  policyValidated: boolean; productionMutationRequested: boolean;
}
export function authorizeFounderProviderCommand(command: FounderProviderCommand) {
  const blockers: string[] = [];
  if (!command.actorFounder || !command.actorId.trim()) blockers.push("FOUNDER_AUTHORIZATION_REQUIRED");
  if (!CoreProviderCapabilities[command.providerId].includes(command.capability)) blockers.push("CAPABILITY_NOT_ALLOWED");
  if (command.expectedVersion < 1) blockers.push("EXPECTED_VERSION_REQUIRED");
  if (!command.idempotencyKey.trim()) blockers.push("IDEMPOTENCY_KEY_REQUIRED");
  if (!command.reason.trim()) blockers.push("EXPLICIT_REASON_REQUIRED");
  if (!command.budgetAuthorized) blockers.push("BUDGET_NOT_AUTHORIZED");
  if (!command.policyValidated) blockers.push("POLICY_NOT_VALIDATED");
  if (command.productionMutationRequested || command.environment === "PRODUCTION") blockers.push("PRODUCTION_MUTATION_PROHIBITED");
  return {authorizedForReadOnlyOrSimulation: blockers.length === 0, externalMutationAuthorized: false as const, blockers};
}

export interface UnifiedProviderSummary {
  providerId: CoreProviderId; accountIdentity: string; environment: ProviderEnvironment;
  credentialPresence: "PRESENT" | "MISSING" | "UNKNOWN"; permissions: string;
  health: "HEALTHY" | "DEGRADED" | "UNKNOWN"; configuration: "MATCHED" | "DRIFTED" | "UNKNOWN";
  usage: string; cost: string; budgetRemaining: string; webhook: string;
  incidentCount: number; lastValidatedAt?: string; evidenceAge: string; blockers: readonly string[];
}
export function createUnifiedOperationalDashboard(input: {
  generatedAt: string; globalPause: boolean; providers: readonly UnifiedProviderSummary[];
}) {
  const blockerCount = input.providers.reduce((total, item) => total + item.blockers.length, 0);
  const verified = input.providers.filter(item =>
    item.health === "HEALTHY" && item.configuration === "MATCHED" && !item.blockers.length).length;
  return {
    ...input, launchBlockerCount: blockerCount,
    evidenceDerivedReadiness: Math.round((verified / CoreProviderIds.length) * 100),
    overallState: blockerCount || verified !== CoreProviderIds.length ? "NOT_VERIFIED" as const : "READ_ONLY_READY" as const,
    productionMutationAvailable: false as const,
  };
}

export function evaluateCoreProviderIncident(
  finding: DriftFinding,
  repeatedDeniedActions: number,
) {
  const incidentRequired = ["DRIFTED", "CONFLICTING", "NOT_AUTHORIZED"].includes(finding.classification) ||
    repeatedDeniedActions >= 3;
  return {
    incidentRequired,
    severity: finding.classification === "NOT_AUTHORIZED" ? "HIGH" as const :
      incidentRequired ? "MEDIUM" as const : "INFORMATIONAL" as const,
    containmentRecommendation: incidentRequired
      ? "Keep the provider paused, preserve evidence, and require Founder review."
      : "Continue read-only observation.",
    automaticExternalAction: false as const,
  };
}
