import type { ProviderEnvironment } from "./types.js";

export const SocialChannels = ["FACEBOOK", "INSTAGRAM", "YOUTUBE", "TIKTOK", "LINKEDIN", "X", "PINTEREST", "FIRST_PARTY"] as const;
export type SocialChannel = typeof SocialChannels[number];
export const PublicationStates = ["DRAFT", "IN_REVIEW", "CHANGES_REQUIRED", "APPROVED", "SCHEDULED", "QUEUED", "DISPATCHING", "PROVIDER_ACCEPTED", "PUBLISHED", "PARTIALLY_PUBLISHED", "FAILED", "CANCELED", "EXPIRED", "WITHDRAWAL_REQUESTED", "WITHDRAWN", "BLOCKED", "UNKNOWN"] as const;
export type PublicationState = typeof PublicationStates[number];
export type ReviewRole = "EDITORIAL" | "BRAND" | "CLAIMS" | "LEGAL" | "RIGHTS" | "ACCESSIBILITY" | "FOUNDER";

export interface ContentClaim {
  id: string;
  statement: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  evidenceReferences: readonly string[];
  evidenceExpiresAt?: string;
}
export interface GovernedAsset {
  id: string;
  version: number;
  checksum: string;
  rightsStatus: "PROVEN" | "UNPROVEN" | "EXPIRED";
  rightsExpiresAt?: string;
  channels: readonly SocialChannel[];
  altText?: string;
  captionsAvailable?: boolean;
}
export interface ContentVersion {
  id: string;
  version: number;
  campaignId: string;
  channel: SocialChannel;
  copy: string;
  title?: string;
  locale: string;
  claims: readonly ContentClaim[];
  assets: readonly GovernedAsset[];
  createdBy: string;
  generatedByAi: boolean;
  immutable: boolean;
  supersedesVersionId?: string;
}
export interface VersionApproval {
  id: string;
  contentVersionId: string;
  contentVersion: number;
  assetBindings: readonly string[];
  channel: SocialChannel;
  campaignId: string;
  environment: ProviderEnvironment;
  scheduleStart: string;
  scheduleEnd: string;
  roles: readonly ReviewRole[];
  founderId: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  expiresAt: string;
}
export interface PublicationCommand {
  id: string;
  actorId: string;
  actorRoles: readonly string[];
  content: ContentVersion;
  approval: VersionApproval;
  environment: ProviderEnvironment;
  scheduledFor: string;
  expectedVersion: number;
  idempotencyKey: string;
  globalPaused: boolean;
  channelPaused: boolean;
  providerValidated: boolean;
  destinationAllowlisted: boolean;
  budgetAuthorized: boolean;
  rateLimitAvailable: boolean;
  incidentOpen: boolean;
  now: string;
}
export interface PublicationResult {
  id: string;
  state: PublicationState;
  reasonCodes: readonly string[];
  externalCalls: 0;
  auditReference: string;
  outboxReference?: string;
  analyticsReference?: string;
  simulation: true;
}

const limits: Readonly<Record<SocialChannel, number>> = {
  FACEBOOK: 63206, INSTAGRAM: 2200, YOUTUBE: 5000, TIKTOK: 2200,
  LINKEDIN: 3000, X: 280, PINTEREST: 500, FIRST_PARTY: 100000,
};
export const RequiredReviewRoles: readonly ReviewRole[] = ["EDITORIAL", "BRAND", "CLAIMS", "RIGHTS", "ACCESSIBILITY", "FOUNDER"];
const transitions: Readonly<Record<PublicationState, readonly PublicationState[]>> = {
  DRAFT: ["IN_REVIEW", "CANCELED"], IN_REVIEW: ["CHANGES_REQUIRED", "APPROVED", "BLOCKED"],
  CHANGES_REQUIRED: ["IN_REVIEW", "CANCELED"], APPROVED: ["SCHEDULED", "CANCELED", "EXPIRED"],
  SCHEDULED: ["QUEUED", "CANCELED", "EXPIRED", "BLOCKED"], QUEUED: ["DISPATCHING", "CANCELED", "BLOCKED"],
  DISPATCHING: ["PROVIDER_ACCEPTED", "FAILED", "UNKNOWN"], PROVIDER_ACCEPTED: ["PUBLISHED", "PARTIALLY_PUBLISHED", "FAILED", "UNKNOWN"],
  PUBLISHED: ["WITHDRAWAL_REQUESTED"], PARTIALLY_PUBLISHED: ["WITHDRAWAL_REQUESTED", "FAILED"],
  FAILED: ["QUEUED", "CANCELED"], CANCELED: [], EXPIRED: [], WITHDRAWAL_REQUESTED: ["WITHDRAWN", "FAILED"],
  WITHDRAWN: [], BLOCKED: ["IN_REVIEW", "CANCELED"], UNKNOWN: ["PROVIDER_ACCEPTED", "FAILED", "WITHDRAWAL_REQUESTED"],
};

export function transitionPublication(from: PublicationState, to: PublicationState): PublicationState {
  if (!transitions[from].includes(to)) throw new Error(`FORBIDDEN_PUBLICATION_TRANSITION:${from}:${to}`);
  return to;
}

export function validateBrand(copy: string): readonly string[] {
  const prohibited = ["guaranteed", "miracle", "everyone loves", "limited time or lose", "scientifically proven"];
  return prohibited.filter((term) => copy.toLowerCase().includes(term)).map((term) => `PROHIBITED_BRAND_CLAIM:${term}`);
}
export function validateChannel(content: ContentVersion): readonly string[] {
  const reasons: string[] = [];
  if (content.copy.length > limits[content.channel]) reasons.push("CHANNEL_LIMIT_EXCEEDED_NEW_VERSION_REQUIRED");
  if (content.assets.some((asset) => !asset.channels.includes(content.channel))) reasons.push("ASSET_CHANNEL_RIGHTS_MISSING");
  if (content.assets.some((asset) => !asset.altText?.trim())) reasons.push("ACCESSIBILITY_ALT_TEXT_MISSING");
  if (content.claims.some((claim) => claim.evidenceReferences.length === 0)) reasons.push("UNSUPPORTED_CLAIM");
  return [...reasons, ...validateBrand(content.copy)];
}

function approvalReasons(command: PublicationCommand): string[] {
  const { approval, content } = command;
  const reasons: string[] = [];
  if (approval.status !== "ACTIVE" || Date.parse(approval.expiresAt) <= Date.parse(command.now)) reasons.push("APPROVAL_INACTIVE");
  if (approval.contentVersionId !== content.id || approval.contentVersion !== content.version) reasons.push("APPROVAL_VERSION_MISMATCH");
  if (approval.campaignId !== content.campaignId || approval.channel !== content.channel || approval.environment !== command.environment) reasons.push("APPROVAL_SCOPE_MISMATCH");
  const assets = content.assets.map((asset) => `${asset.id}:${asset.version}`).sort();
  if (JSON.stringify([...approval.assetBindings].sort()) !== JSON.stringify(assets)) reasons.push("APPROVAL_ASSET_MISMATCH");
  if (RequiredReviewRoles.some((role) => !approval.roles.includes(role))) reasons.push("REQUIRED_REVIEW_MISSING");
  if (Date.parse(command.scheduledFor) < Date.parse(approval.scheduleStart) || Date.parse(command.scheduledFor) > Date.parse(approval.scheduleEnd)) reasons.push("SCHEDULE_OUTSIDE_APPROVAL");
  return reasons;
}

export class SocialPublicationRuntime {
  private readonly idempotency = new Map<string, PublicationResult>();
  readonly audit: PublicationResult[] = [];
  readonly outbox: PublicationResult[] = [];
  readonly externalCalls = 0;

  schedule(command: PublicationCommand): PublicationResult {
    const prior = this.idempotency.get(command.idempotencyKey);
    if (prior) return structuredClone(prior);
    const reasons = [
      ...(command.actorRoles.includes("FOUNDER") ? [] : ["FOUNDER_AUTHORIZATION_REQUIRED"]),
      ...(command.content.generatedByAi && command.content.createdBy === command.approval.founderId ? ["AI_SELF_APPROVAL_PROHIBITED"] : []),
      ...(command.content.immutable ? [] : ["CONTENT_VERSION_NOT_IMMUTABLE"]),
      ...approvalReasons(command),
      ...validateChannel(command.content),
      ...(command.content.claims.some((claim) => claim.evidenceExpiresAt && Date.parse(claim.evidenceExpiresAt) <= Date.parse(command.now)) ? ["STALE_EVIDENCE"] : []),
      ...(command.content.assets.some((asset) => asset.rightsStatus !== "PROVEN" || (asset.rightsExpiresAt && Date.parse(asset.rightsExpiresAt) <= Date.parse(command.now))) ? ["ASSET_RIGHTS_INVALID"] : []),
      ...(command.globalPaused ? ["GLOBAL_PAUSE_ACTIVE"] : []),
      ...(command.channelPaused ? ["CHANNEL_PAUSED"] : []),
      ...(command.providerValidated ? [] : ["PROVIDER_NOT_VALIDATED"]),
      ...(command.destinationAllowlisted ? [] : ["DESTINATION_NOT_ALLOWLISTED"]),
      ...(command.budgetAuthorized ? [] : ["BUDGET_NOT_AUTHORIZED"]),
      ...(command.rateLimitAvailable ? [] : ["RATE_LIMIT_UNAVAILABLE"]),
      ...(command.incidentOpen ? ["OPEN_INCIDENT"] : []),
      ...(command.environment === "PRODUCTION" ? ["PRODUCTION_PUBLICATION_DISABLED"] : []),
    ];
    const accepted = reasons.length === 0;
    const result: PublicationResult = {
      id: command.id, state: accepted ? "SCHEDULED" : "BLOCKED", reasonCodes: reasons,
      externalCalls: 0, simulation: true, auditReference: `audit:publication:${command.id}`,
      outboxReference: accepted ? `outbox:publication:${command.id}` : undefined,
      analyticsReference: accepted ? `analytics:publication:${command.id}` : undefined,
    };
    this.idempotency.set(command.idempotencyKey, result);
    this.audit.push(result);
    if (accepted) this.outbox.push(result);
    return structuredClone(result);
  }
}

export const SocialProviderCapabilities: Readonly<Record<SocialChannel, readonly string[]>> = {
  FACEBOOK: ["page_post"], INSTAGRAM: ["feed", "carousel", "reel_package", "story_readiness"],
  YOUTUBE: ["video_package", "shorts_package", "thumbnail", "captions"], TIKTOK: ["video_package", "caption_package"],
  LINKEDIN: ["company_post", "article_package", "media_post"], X: ["post", "thread", "media_post"],
  PINTEREST: ["pin", "board_mapping", "rich_metadata"], FIRST_PARTY: ["newsroom", "landing_page", "rss", "rollback"],
};
