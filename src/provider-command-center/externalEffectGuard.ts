import type {ProviderConfiguration, ProviderId} from "./types.js";
import {isFounder} from "./security.js";

export const GuardDenialReasons = [
  "ACTOR_UNAUTHORIZED", "ENVIRONMENT_PROHIBITED", "PROVIDER_INACTIVE",
  "CAPABILITY_UNAVAILABLE", "CONSENT_MISSING", "SUPPRESSED",
  "APPROVAL_SCOPE_MISSING", "BUDGET_DENIED", "RATE_LIMITED",
  "DATA_CLASSIFICATION_DENIED", "DESTINATION_NOT_ALLOWED",
  "GLOBAL_PAUSE_ACTIVE", "PROVIDER_PAUSED", "IDEMPOTENCY_KEY_MISSING",
  "EVIDENCE_MISSING", "PRODUCTION_PROHIBITED",
] as const;
export type GuardDenialReason = typeof GuardDenialReasons[number];

export interface ExternalEffectRequest {
  actor: {id: string; roles: readonly string[]};
  providerId: ProviderId;
  environment: ProviderConfiguration["environment"];
  capability: string;
  consentVerified: boolean;
  suppressed: boolean;
  approvalScopeReference?: string;
  budgetAuthorized: boolean;
  rateLimitAvailable: boolean;
  dataClassificationAllowed: boolean;
  destinationAllowlisted: boolean;
  idempotencyKey?: string;
  evidenceReferences: readonly string[];
}

export function evaluateExternalEffect(
  request: ExternalEffectRequest,
  config: ProviderConfiguration,
  supportedCapabilities: readonly string[],
) {
  const reasons: GuardDenialReason[] = [];
  if (!isFounder(request.actor)) reasons.push("ACTOR_UNAUTHORIZED");
  if (request.environment === "PRODUCTION") reasons.push("PRODUCTION_PROHIBITED");
  if (request.environment !== config.environment) reasons.push("ENVIRONMENT_PROHIBITED");
  if (config.state !== "ACTIVE_STAGING") reasons.push("PROVIDER_INACTIVE");
  if (!supportedCapabilities.includes(request.capability)) reasons.push("CAPABILITY_UNAVAILABLE");
  if (!request.consentVerified) reasons.push("CONSENT_MISSING");
  if (request.suppressed) reasons.push("SUPPRESSED");
  if (!request.approvalScopeReference?.trim()) reasons.push("APPROVAL_SCOPE_MISSING");
  if (!request.budgetAuthorized || !config.budgetAuthorized) reasons.push("BUDGET_DENIED");
  if (!request.rateLimitAvailable) reasons.push("RATE_LIMITED");
  if (!request.dataClassificationAllowed) reasons.push("DATA_CLASSIFICATION_DENIED");
  if (!request.destinationAllowlisted) reasons.push("DESTINATION_NOT_ALLOWED");
  if (config.globalPaused) reasons.push("GLOBAL_PAUSE_ACTIVE");
  if (config.providerPaused) reasons.push("PROVIDER_PAUSED");
  if (!request.idempotencyKey?.trim()) reasons.push("IDEMPOTENCY_KEY_MISSING");
  if (request.evidenceReferences.length === 0) reasons.push("EVIDENCE_MISSING");
  return {allowed: reasons.length === 0, reasons, providerId: request.providerId};
}
