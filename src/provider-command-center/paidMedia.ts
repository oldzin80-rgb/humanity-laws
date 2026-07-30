import type { ProviderEnvironment } from "./types.js";

export const AdvertisingChannels = ["META_ADS", "GOOGLE_ADS", "YOUTUBE_ADS", "TIKTOK_ADS", "LINKEDIN_ADS", "PINTEREST_ADS", "X_ADS"] as const;
export type AdvertisingChannel = typeof AdvertisingChannels[number];
export const PaidCampaignStates = ["DRAFT", "IN_REVIEW", "CHANGES_REQUIRED", "APPROVED", "READY_FOR_STAGING", "STAGING_VALIDATED", "READY_FOR_LAUNCH", "LAUNCH_AUTHORIZED", "QUEUED", "PROVIDER_DRAFT_CREATED", "ACTIVE", "PAUSED", "BUDGET_BLOCKED", "POLICY_BLOCKED", "DEGRADED", "COMPLETED", "CANCELED", "ARCHIVED", "UNKNOWN"] as const;
export type PaidCampaignState = typeof PaidCampaignStates[number];

export interface AudienceVersion {
  id: string; version: number; purpose: string; kind: "CONTEXTUAL" | "GEOGRAPHIC" | "INTEREST" | "KEYWORD" | "FIRST_PARTY_CONSENTED" | "SUPPRESSION";
  advertisingConsentRequired: boolean; advertisingConsentProven: boolean; suppressionApplied: boolean;
  fields: readonly string[]; includesMinors: boolean; retentionDays: number;
}
const prohibitedAudienceFields = ["health", "memory", "conversation", "addiction", "grief", "religion", "minor", "protected_trait", "financial_distress", "email", "phone", "address"];
export function validateAudience(audience: AudienceVersion): readonly string[] {
  const reasons: string[] = [];
  if (audience.includesMinors) reasons.push("MINORS_TARGETING_PROHIBITED");
  if (audience.fields.some((field) => prohibitedAudienceFields.some((blocked) => field.toLowerCase().includes(blocked)))) reasons.push("SENSITIVE_TARGETING_PROHIBITED");
  if (audience.advertisingConsentRequired && !audience.advertisingConsentProven) reasons.push("ADVERTISING_CONSENT_REQUIRED");
  if (!audience.suppressionApplied) reasons.push("SUPPRESSION_REQUIRED");
  return reasons;
}

export interface PaidCampaignVersion {
  id: string; version: number; channel: AdvertisingChannel; objective: string;
  creativeVersionId: string; landingPageVersionId: string; audience: AudienceVersion;
  conversionEvent: string; attributionModel: string; immutable: boolean; currency: string;
}
export interface PaidApproval {
  id: string; campaignId: string; campaignVersion: number; creativeVersionId: string;
  landingPageVersionId: string; audienceVersion: number; channel: AdvertisingChannel;
  environment: ProviderEnvironment; founderId: string; active: boolean; expiresAt: string;
}
export interface BudgetCaps {
  globalMonthly: number; providerMonthly: number; campaignLifetime: number;
  campaignDaily: number; experiment: number; staging: number; perAction: number; currency: string;
}
export class BudgetLedger {
  private reserved = 0;
  private observed = 0;
  reserve(amountMinor: number, caps: BudgetCaps): boolean {
    if (!Number.isInteger(amountMinor) || amountMinor < 0 || !/^[A-Z]{3}$/.test(caps.currency)) return false;
    const hardCap = Math.min(caps.globalMonthly, caps.providerMonthly, caps.campaignLifetime, caps.campaignDaily, caps.experiment, caps.staging, caps.perAction);
    if (this.reserved + this.observed + amountMinor > hardCap) return false;
    this.reserved += amountMinor;
    return true;
  }
  reconcile(reservedMinor: number, observedMinor: number) {
    this.reserved = Math.max(0, this.reserved - reservedMinor);
    this.observed += observedMinor;
  }
  snapshot() { return { reservedMinor: this.reserved, observedMinor: this.observed }; }
}

export interface PaidMediaCommand {
  id: string; idempotencyKey: string; actorId: string; actorRoles: readonly string[];
  environment: ProviderEnvironment; campaign: PaidCampaignVersion; approval: PaidApproval;
  expectedVersion: number; currentVersion: number; requestedReservationMinor: number; budgetCaps: BudgetCaps;
  providerValidated: boolean; accountAllowlisted: boolean; conversionValidated: boolean;
  claimsAndRightsValid: boolean; globalPaused: boolean; providerPaused: boolean; campaignPaused: boolean;
  rateLimitAvailable: boolean; incidentOpen: boolean; spendObservationFresh: boolean; now: string;
}
export interface PaidMediaResult {
  id: string; state: PaidCampaignState; reasons: readonly string[]; reservedMinor: number;
  externalCalls: 0; externalSpendMinor: 0; autonomousOptimization: false; simulation: true;
  auditReference: string; outboxReference?: string;
}
export class PaidMediaRuntime {
  private readonly seen = new Map<string, PaidMediaResult>();
  readonly ledger = new BudgetLedger();
  readonly audit: PaidMediaResult[] = [];
  readonly outbox: PaidMediaResult[] = [];
  readonly externalCalls = 0;

  createProviderDraftIntent(command: PaidMediaCommand): PaidMediaResult {
    const prior = this.seen.get(command.idempotencyKey);
    if (prior) return structuredClone(prior);
    const { campaign, approval } = command;
    const reasons = [
      ...(command.actorRoles.includes("FOUNDER") ? [] : ["FOUNDER_AUTHORIZATION_REQUIRED"]),
      ...(command.environment === "PRODUCTION" ? ["PRODUCTION_ACTIVATION_PROHIBITED"] : []),
      ...(campaign.immutable ? [] : ["CAMPAIGN_VERSION_NOT_IMMUTABLE"]),
      ...(approval.active && Date.parse(approval.expiresAt) > Date.parse(command.now) ? [] : ["APPROVAL_INACTIVE"]),
      ...(approval.campaignId === campaign.id && approval.campaignVersion === campaign.version && approval.creativeVersionId === campaign.creativeVersionId && approval.landingPageVersionId === campaign.landingPageVersionId && approval.audienceVersion === campaign.audience.version && approval.channel === campaign.channel && approval.environment === command.environment ? [] : ["APPROVAL_SCOPE_MISMATCH"]),
      ...validateAudience(campaign.audience),
      ...(command.expectedVersion === command.currentVersion ? [] : ["STALE_EXPECTED_VERSION"]),
      ...(command.providerValidated ? [] : ["PROVIDER_NOT_VALIDATED"]),
      ...(command.accountAllowlisted ? [] : ["ACCOUNT_NOT_ALLOWLISTED"]),
      ...(command.conversionValidated ? [] : ["CONVERSION_NOT_VALIDATED"]),
      ...(command.claimsAndRightsValid ? [] : ["CLAIMS_OR_RIGHTS_INVALID"]),
      ...(command.globalPaused ? ["GLOBAL_PAUSE_ACTIVE"] : []), ...(command.providerPaused ? ["PROVIDER_PAUSED"] : []),
      ...(command.campaignPaused ? ["CAMPAIGN_PAUSED"] : []), ...(command.rateLimitAvailable ? [] : ["RATE_LIMIT_UNAVAILABLE"]),
      ...(command.incidentOpen ? ["OPEN_INCIDENT"] : []), ...(command.spendObservationFresh ? [] : ["STALE_SPEND_OBSERVATION"]),
    ];
    const canReserve = reasons.length === 0 && this.ledger.reserve(command.requestedReservationMinor, command.budgetCaps);
    if (reasons.length === 0 && !canReserve) reasons.push("BUDGET_RESERVATION_DENIED");
    const accepted = reasons.length === 0;
    const result: PaidMediaResult = {
      id: command.id, state: accepted ? "READY_FOR_STAGING" : reasons.includes("BUDGET_RESERVATION_DENIED") ? "BUDGET_BLOCKED" : "POLICY_BLOCKED",
      reasons, reservedMinor: accepted ? command.requestedReservationMinor : 0,
      externalCalls: 0, externalSpendMinor: 0, autonomousOptimization: false, simulation: true,
      auditReference: `audit:paid-media:${command.id}`, outboxReference: accepted ? `outbox:paid-media:${command.id}` : undefined,
    };
    this.seen.set(command.idempotencyKey, result); this.audit.push(result); if (accepted) this.outbox.push(result);
    return structuredClone(result);
  }
}

export interface OptimizationRecommendation {
  action: "PAUSE_CREATIVE" | "REDUCE_FREQUENCY" | "SHIFT_BUDGET" | "NEW_EXPERIMENT";
  evidence: readonly string[]; confidence: number; projectedImpactRange: readonly [number, number];
  risk: "LOW" | "MEDIUM" | "HIGH"; requiresFounderApproval: true; executesAutomatically: false; expiresAt: string;
}
export function recommendOptimization(input: Omit<OptimizationRecommendation, "requiresFounderApproval" | "executesAutomatically">): OptimizationRecommendation {
  return { ...input, requiresFounderApproval: true, executesAutomatically: false };
}
