import { createHash, randomInt } from "node:crypto";

export type FoundersBlessingEventStatus =
  | "in_preparation"
  | "pending_founder_review"
  | "recipient_suggested"
  | "founder_approved"
  | "gift_prepared"
  | "completed"
  | "cancelled"
  | "postponed";

export type FoundersBlessingGiftType =
  | "money"
  | "product"
  | "experience"
  | "trip"
  | "book"
  | "technology"
  | "clothing"
  | "other";

export type FoundersBlessingReviewStatus =
  | "not_requested"
  | "pending"
  | "approved"
  | "rejected";

export type FoundersBlessingPublicVisibilityStatus =
  | "private"
  | "anonymized"
  | "recipient_opted_in";

export type FoundersBlessingDeliveryStatus =
  | "not_prepared"
  | "held_for_founder_approval"
  | "held_for_admin_release"
  | "held_for_tax_accounting_review"
  | "ready_for_manual_release"
  | "delivered_manually"
  | "cancelled";

export type FoundersBlessingEnrollmentStatus = "included" | "paused" | "removed";
export type FoundersBlessingEligibilityStatus = "eligible" | "paused" | "pending";
export type FoundersBlessingLevelId = "level_1" | "level_2" | "level_3" | "level_4" | "level_5" | "level_6";
export type FoundersBlessingActivationStatus = "not_active" | "review_required" | "approved_for_manual_operation";
export type FoundersBlessingPublicConfirmationStatus = "draft_private" | "pending_admin_approval" | "approved_anonymized" | "rejected";
export type FoundersBlessingPublicCategory = "Financial Blessing" | "Product Blessing" | "Experience Blessing" | "Book Blessing" | "Personal Appreciation Gift" | "Community Blessing";
export type FoundersBlessingCommunicationType = "private_member_notification" | "private_email" | "private_secure_message" | "future_private_voice_video" | "future_founder_personal_message";
export type FoundersBlessingCommunicationChannel = "in_app" | "email" | "secure_message" | "future_voice" | "future_video";
export type FoundersBlessingMessageStatus = "draft_only" | "ready_for_private_review" | "delivered_privately" | "read_privately" | "archived_private";

export interface FoundersBlessingsLaunchGovernance {
  communityPageLaunchReady: true;
  foundersBlessingsPlumbingReady: boolean;
  foundersBlessingsProfilesReady: boolean;
  foundersBlessingsMonthlyPoolReady: boolean;
  foundersBlessingsRandomizerReady: boolean;
  realMoneyMovementEnabled: false;
  automaticGiftEnabled: false;
  automaticGiftDeliveryEnabled: false;
  publicAnnouncementEnabled: false;
  founderFinalApprovalRequired: true;
  adminReviewRequired: true;
  adminReleaseRequired: true;
  taxAccountingReviewRequired: true;
  legalReviewRecommended: true;
  activationBlocking: true;
  launchBlocking: false;
}

export interface FoundersBlessingLevelConfig {
  level: FoundersBlessingLevelId;
  name: string;
  description: string;
  eligibilityRules: readonly string[];
  blessingPossibilities: readonly string[];
  active: boolean;
}

export const foundersBlessingsLevels: readonly FoundersBlessingLevelConfig[] = [
  {
    level: "level_1",
    name: "Active Member",
    description: "Every active paid member in good standing is included.",
    eligibilityRules: ["active_paid_member", "account_good_standing", "one_profile_per_member"],
    blessingPossibilities: ["private_appreciation", "founder_selected_gift_later"],
    active: true,
  },
  {
    level: "level_2",
    name: "Long-Term Member",
    description: "Future level for members with longer-term participation.",
    eligibilityRules: ["future_configuration_required"],
    blessingPossibilities: ["future_configuration_required"],
    active: false,
  },
  {
    level: "level_3",
    name: "Founding Supporter",
    description: "Future level for early supporters if explicitly configured.",
    eligibilityRules: ["future_configuration_required"],
    blessingPossibilities: ["future_configuration_required"],
    active: false,
  },
  {
    level: "level_4",
    name: "Community Contributor",
    description: "Future level for verified community contribution if explicitly configured.",
    eligibilityRules: ["future_configuration_required"],
    blessingPossibilities: ["future_configuration_required"],
    active: false,
  },
  {
    level: "level_5",
    name: "Legacy Member",
    description: "Future level for legacy participation if explicitly configured.",
    eligibilityRules: ["future_configuration_required"],
    blessingPossibilities: ["future_configuration_required"],
    active: false,
  },
  {
    level: "level_6",
    name: "Founder’s Circle",
    description: "Future level requiring explicit approval, rules, and review before activation.",
    eligibilityRules: ["future_configuration_required"],
    blessingPossibilities: ["future_configuration_required"],
    active: false,
  },
];

export interface FoundersBlessingProfile {
  id: string;
  memberId: string;
  enrollmentStatus: FoundersBlessingEnrollmentStatus;
  enrolledAt: string;
  eligibilityStatus: FoundersBlessingEligibilityStatus;
  eligibilityReason: string;
  currentLevel: FoundersBlessingLevelId;
  lifetimeBlessingsReceived: number;
  lastIncludedEventId: string | null;
  lastSelectedEventId: string | null;
  activeMemberRequired: true;
  createdAt: string;
  updatedAt: string;
}

export interface FoundersBlessingEvent {
  id: string;
  eventMonth: string;
  eventDate: string;
  status: FoundersBlessingEventStatus;
  blessingTheme: string;
  giftType: FoundersBlessingGiftType;
  giftDescriptionPrivate: string;
  estimatedGiftValueCents: number;
  selectedMemberId: string | null;
  founderApprovedMemberId: string | null;
  founderApprovalStatus: FoundersBlessingReviewStatus;
  adminReviewStatus: FoundersBlessingReviewStatus;
  taxAccountingReviewStatus: FoundersBlessingReviewStatus;
  legalReviewStatus: FoundersBlessingReviewStatus;
  activationStatus: FoundersBlessingActivationStatus;
  publicVisibilityStatus: FoundersBlessingPublicVisibilityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FoundersBlessingMemberSource {
  memberId: string;
  membershipStatus: "FREE" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
  paidMember: boolean;
  accountGoodStanding: boolean;
  testAccount?: boolean;
  refunded?: boolean;
  banned?: boolean;
  fraudFlagged?: boolean;
  duplicateAccount?: boolean;
  adminExcluded?: boolean;
  jurisdictionExcluded?: boolean;
}

export interface FoundersBlessingCandidate {
  id: string;
  eventId: string;
  memberId: string;
  profileId: string;
  eligibilityStatus: "eligible" | "excluded";
  exclusionReason?: string;
  blessingLevelAtEvent: FoundersBlessingLevelId;
  createdAt: string;
}

export interface FoundersBlessingRandomAudit {
  id: string;
  eventId: string;
  algorithmName: "node_crypto_randomInt";
  algorithmVersion: "founders_blessings_v1";
  candidateCount: number;
  candidatePoolHash: string;
  randomSelectionIndex: number | null;
  selectedCandidateMemberId: string | null;
  auditHash: string;
  requestId: string;
  createdAt: string;
}

export interface FoundersBlessingGift {
  id: string;
  eventId: string;
  recipientMemberId: string;
  giftType: FoundersBlessingGiftType;
  giftDescriptionPrivate: string;
  estimatedValueCents: number;
  deliveryStatus: FoundersBlessingDeliveryStatus;
  payoutProvider: string | null;
  payoutStatus: string | null;
  taxHoldRequired: true;
  accountingCategoryPending: true;
  founderReleaseRequired: true;
  adminReleaseRequired: true;
  createdAt: string;
  updatedAt: string;
}

export interface FoundersBlessingNotification {
  id: string;
  eventId: string;
  recipientMemberId: string | null;
  notificationType: "private_in_app" | "private_email" | "anonymized_community_update";
  notificationStatus: "draft_only" | "ready_for_private_review" | "sent";
  privateMessage: string;
  publicIdentityExposed: false;
  createdAt: string;
}

export interface FoundersBlessingOutcomeConfirmation {
  id: string;
  eventId: string;
  internalGiftId: string | null;
  publicConfirmationStatus: FoundersBlessingPublicConfirmationStatus;
  publicMonth: string;
  publicYear: number;
  publicCategory: FoundersBlessingPublicCategory;
  publicMessage: string;
  exactValueHidden: true;
  recipientIdentityHidden: true;
  communicationPrivate: true;
  approvedForPublicDisplay: boolean;
  approvedByAdminId: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FoundersBlessingPrivateCommunication {
  id: string;
  eventId: string;
  memberId: string;
  communicationType: FoundersBlessingCommunicationType;
  communicationChannel: FoundersBlessingCommunicationChannel;
  messageStatus: FoundersBlessingMessageStatus;
  deliveredAt: string | null;
  readAt: string | null;
  founderMessageOptional: string | null;
  followUpRequired: boolean;
  createdAt: string;
}

export interface FoundersBlessingPrivateOutcomeRecord {
  eventId: string;
  eventMonth: string;
  suggestedMemberId: string | null;
  founderApprovedMemberId: string | null;
  giftType: FoundersBlessingGiftType;
  privateGiftDescription: string;
  estimatedValueCents: number;
  deliveryStatus: FoundersBlessingDeliveryStatus;
  notificationStatus: FoundersBlessingNotification["notificationStatus"];
  auditId: string | null;
  algorithmVersion: string | null;
  founderApprovalTimestamp: string | null;
  adminApprovalTimestamp: string | null;
  recipientConfirmationTimestamp: string | null;
  communicationLog: readonly FoundersBlessingPrivateCommunication[];
  deliveryVerification: "private_pending" | "privately_delivered" | "recipient_confirmed";
  internalNotes: string;
}

export interface FoundersBlessingPublicOutcomeSummary {
  blessingsCompletedPrivatelyThisYear: number;
  blessingsCompletedPrivatelyAllTime: number;
  lastBlessingMonth: string | null;
  recipientPrivacy: "Protected";
  communication: "One-to-One";
  categories: readonly FoundersBlessingPublicCategory[];
  publicMessage: string;
}

export interface FoundersBlessingAdminAuditTrail {
  eventId: string;
  suggestedMemberId: string | null;
  approvedRecipientId: string | null;
  giftStatus: FoundersBlessingDeliveryStatus;
  deliveryConfirmation: string | null;
  notificationConfirmation: string | null;
  publicConfirmationDraft: FoundersBlessingOutcomeConfirmation;
  communicationLogs: readonly FoundersBlessingPrivateCommunication[];
  adminCanApproveOrRejectPublicConfirmation: true;
}

export interface FoundersBlessingsReadinessModel {
  title: "Founder’s Blessings";
  subtitle: "An occasional expression of appreciation from the Founder to the Humanity Laws community.";
  memberFacingCopy: string;
  outcomeVerificationCopy: string;
  memberAutonomyCopy: string;
  quietImpactMetrics: {
    blessingsCompletedPrivatelyLabel: string;
    thisYearLabel: string;
    lastBlessingMonthLabel: string;
    recipientPrivacyLabel: "Protected";
    communicationLabel: "One-to-One";
  };
  enrollmentStatus: "Included";
  eligibility: "Active / Paused / Pending";
  currentBlessingLevel: "Active Member";
  currentStatus: "In preparation";
  blessingsEnabled: "Not yet active";
  privateRecognition: true;
  publicAnnouncement: "Disabled";
  founderApprovalRequired: true;
  randomSelectionAssist: "Secure cryptographic standard";
  moneyMovement: "Disabled";
  launchGovernance: FoundersBlessingsLaunchGovernance;
}

function isoDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day, 12, 0, 0, 0));
}

function hash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function nowIso(createdAt?: string): string {
  return createdAt ?? new Date().toISOString();
}

export function createFoundersBlessingsGovernance(): FoundersBlessingsLaunchGovernance {
  return {
    communityPageLaunchReady: true,
    foundersBlessingsPlumbingReady: true,
    foundersBlessingsProfilesReady: true,
    foundersBlessingsMonthlyPoolReady: true,
    foundersBlessingsRandomizerReady: true,
    realMoneyMovementEnabled: false,
    automaticGiftEnabled: false,
    automaticGiftDeliveryEnabled: false,
    publicAnnouncementEnabled: false,
    founderFinalApprovalRequired: true,
    adminReviewRequired: true,
    adminReleaseRequired: true,
    taxAccountingReviewRequired: true,
    legalReviewRecommended: true,
    activationBlocking: true,
    launchBlocking: false,
  };
}

export function calculateSuggestedMonthlyEventDate(from: Date = new Date()): Date {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth();
  const day = from.getUTCDate();
  if (day <= 25) return utcDate(year, month, 25);
  return utcDate(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, 25);
}

export function calculateSuggestedEventDate(from: Date = new Date()): Date {
  return calculateSuggestedMonthlyEventDate(from);
}

export function enrollMemberAfterSignup(memberId: string, createdAt?: string): FoundersBlessingProfile {
  const timestamp = nowIso(createdAt);
  return {
    id: `founders_blessings_profile_${memberId}`,
    memberId,
    enrollmentStatus: "included",
    enrolledAt: timestamp,
    eligibilityStatus: "pending",
    eligibilityReason: "membership_status_pending",
    currentLevel: "level_1",
    lifetimeBlessingsReceived: 0,
    lastIncludedEventId: null,
    lastSelectedEventId: null,
    activeMemberRequired: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function pauseEligibility(profile: FoundersBlessingProfile, reason: string, updatedAt?: string): FoundersBlessingProfile {
  return {
    ...profile,
    enrollmentStatus: "paused",
    eligibilityStatus: "paused",
    eligibilityReason: reason,
    updatedAt: nowIso(updatedAt),
  };
}

export function restoreEligibility(profile: FoundersBlessingProfile, updatedAt?: string): FoundersBlessingProfile {
  return {
    ...profile,
    enrollmentStatus: "included",
    eligibilityStatus: "eligible",
    eligibilityReason: "active_paid_member_in_good_standing",
    currentLevel: "level_1",
    updatedAt: nowIso(updatedAt),
  };
}

function membershipExclusionReason(member: FoundersBlessingMemberSource, adminExclusionList: readonly string[] = []): string | null {
  if (member.testAccount) return "test_account";
  if (member.refunded) return "refunded_account";
  if (member.membershipStatus === "CANCELLED") return "canceled_account";
  if (member.membershipStatus !== "ACTIVE" || !member.paidMember) return "active_paid_member_required";
  if (!member.accountGoodStanding) return "account_not_in_good_standing";
  if (member.banned) return "banned_account";
  if (member.fraudFlagged) return "fraud_flagged_account";
  if (member.duplicateAccount) return "duplicate_account";
  if (member.adminExcluded || adminExclusionList.includes(member.memberId)) return "admin_excluded_account";
  if (member.jurisdictionExcluded) return "future_jurisdiction_legal_exclusion";
  return null;
}

export function updateEligibilityFromMembershipStatus(params: {
  profile: FoundersBlessingProfile;
  member: FoundersBlessingMemberSource;
  adminExclusionList?: readonly string[];
  updatedAt?: string;
}): FoundersBlessingProfile {
  const reason = membershipExclusionReason(params.member, params.adminExclusionList);
  if (reason) return pauseEligibility(params.profile, reason, params.updatedAt);
  return restoreEligibility(params.profile, params.updatedAt);
}

export function getFounderBlessingsProfile(memberId: string, profiles: readonly FoundersBlessingProfile[]): FoundersBlessingProfile | null {
  return profiles.find((profile) => profile.memberId === memberId) ?? null;
}

export function createFounderBlessingEvent(params: {
  id?: string;
  fromDate?: Date;
  blessingTheme?: string;
  giftType?: FoundersBlessingGiftType;
  giftDescriptionPrivate?: string;
  estimatedGiftValueCents?: number;
  createdAt?: string;
} = {}): FoundersBlessingEvent {
  const eventDate = calculateSuggestedMonthlyEventDate(params.fromDate);
  const createdAt = nowIso(params.createdAt);
  const eventMonth = isoDateOnly(eventDate).slice(0, 7);
  return {
    id: params.id ?? `founders_blessing_${eventMonth}`,
    eventMonth,
    eventDate: isoDateOnly(eventDate),
    status: "in_preparation",
    blessingTheme: params.blessingTheme ?? "Member appreciation",
    giftType: params.giftType ?? "other",
    giftDescriptionPrivate: params.giftDescriptionPrivate ?? "Private Founder’s Blessing details pending Founder approval.",
    estimatedGiftValueCents: params.estimatedGiftValueCents ?? 0,
    selectedMemberId: null,
    founderApprovedMemberId: null,
    founderApprovalStatus: "pending",
    adminReviewStatus: "pending",
    taxAccountingReviewStatus: "pending",
    legalReviewStatus: "pending",
    activationStatus: "review_required",
    publicVisibilityStatus: "private",
    createdAt,
    updatedAt: createdAt,
  };
}

export function createMonthlyBlessingEvent(fromDate: Date = new Date(), createdAt?: string): FoundersBlessingEvent {
  return createFounderBlessingEvent({ fromDate, createdAt, blessingTheme: "Monthly Founder’s Blessing" });
}

export function markEventPendingFounderReview(event: FoundersBlessingEvent, updatedAt?: string): FoundersBlessingEvent {
  return {
    ...event,
    status: "pending_founder_review",
    activationStatus: "review_required",
    updatedAt: nowIso(updatedAt),
  };
}

export function buildEligibleCandidatePool(params: {
  eventId: string;
  members: readonly FoundersBlessingMemberSource[];
  profiles?: readonly FoundersBlessingProfile[];
  adminExclusionList?: readonly string[];
  createdAt?: string;
}): FoundersBlessingCandidate[] {
  const createdAt = nowIso(params.createdAt);
  const seen = new Set<string>();
  const candidates: FoundersBlessingCandidate[] = [];
  for (const member of params.members) {
    if (seen.has(member.memberId)) continue;
    seen.add(member.memberId);
    const existingProfile = getFounderBlessingsProfile(member.memberId, params.profiles ?? []);
    const profile = existingProfile ?? enrollMemberAfterSignup(member.memberId, createdAt);
    const updatedProfile = updateEligibilityFromMembershipStatus({
      profile,
      member,
      adminExclusionList: params.adminExclusionList ?? [],
      updatedAt: createdAt,
    });
    const reason = updatedProfile.eligibilityStatus === "eligible" ? null : updatedProfile.eligibilityReason;
    candidates.push({
      id: `${params.eventId}_${member.memberId}`,
      eventId: params.eventId,
      memberId: member.memberId,
      profileId: updatedProfile.id,
      eligibilityStatus: reason ? "excluded" : "eligible",
      ...(reason ? { exclusionReason: reason } : {}),
      blessingLevelAtEvent: updatedProfile.currentLevel,
      createdAt,
    });
  }
  return candidates;
}

export function includeAllEligibleActiveMembers(params: {
  eventId: string;
  members: readonly FoundersBlessingMemberSource[];
  profiles?: readonly FoundersBlessingProfile[];
  adminExclusionList?: readonly string[];
  createdAt?: string;
}): FoundersBlessingCandidate[] {
  return buildEligibleCandidatePool(params).filter((candidate) => candidate.eligibilityStatus === "eligible");
}

export function buildMonthlyCandidatePool(params: {
  eventId: string;
  members: readonly FoundersBlessingMemberSource[];
  profiles?: readonly FoundersBlessingProfile[];
  adminExclusionList?: readonly string[];
  createdAt?: string;
}): FoundersBlessingCandidate[] {
  return buildEligibleCandidatePool(params);
}

export function hashCandidatePool(candidates: readonly FoundersBlessingCandidate[]): string {
  const eligibleMemberIds = candidates
    .filter((candidate) => candidate.eligibilityStatus === "eligible")
    .map((candidate) => `${candidate.memberId}:${candidate.profileId}:${candidate.blessingLevelAtEvent}`)
    .sort();
  return hash({ eligibleMemberIds });
}

export function generateAuditHash(input: unknown): string {
  return hash(input);
}

export function selectSuggestedRecipientWithCryptoRandomness(params: {
  eventId: string;
  candidates: readonly FoundersBlessingCandidate[];
  requestId: string;
  createdAt?: string;
}): { suggestedMemberId: string | null; audit: FoundersBlessingRandomAudit } {
  const createdAt = nowIso(params.createdAt);
  const eligible = params.candidates.filter((candidate) => candidate.eligibilityStatus === "eligible");
  const candidatePoolHash = hashCandidatePool(params.candidates);
  const randomSelectionIndex = eligible.length > 0 ? randomInt(eligible.length) : null;
  const selected = randomSelectionIndex === null ? undefined : eligible[randomSelectionIndex];
  const selectedCandidateMemberId = selected?.memberId ?? null;
  const auditHash = generateAuditHash({
    eventId: params.eventId,
    algorithmName: "node_crypto_randomInt",
    algorithmVersion: "founders_blessings_v1",
    candidateCount: eligible.length,
    candidatePoolHash,
    randomSelectionIndex,
    selectedCandidateMemberId,
    requestId: params.requestId,
    createdAt,
  });
  return {
    suggestedMemberId: selectedCandidateMemberId,
    audit: {
      id: `audit_${auditHash.slice(0, 16)}`,
      eventId: params.eventId,
      algorithmName: "node_crypto_randomInt",
      algorithmVersion: "founders_blessings_v1",
      candidateCount: eligible.length,
      candidatePoolHash,
      randomSelectionIndex,
      selectedCandidateMemberId,
      auditHash,
      requestId: params.requestId,
      createdAt,
    },
  };
}

export function requireFounderApproval(params: {
  event: FoundersBlessingEvent;
  suggestedMemberId: string | null;
  founderApprovedMemberId?: string | null;
}): FoundersBlessingEvent {
  return {
    ...params.event,
    selectedMemberId: params.suggestedMemberId,
    founderApprovedMemberId: params.founderApprovedMemberId ?? null,
    founderApprovalStatus: params.founderApprovedMemberId ? "approved" : "pending",
    status: params.founderApprovedMemberId ? "founder_approved" : "recipient_suggested",
    activationStatus: "review_required",
    updatedAt: new Date().toISOString(),
  };
}

export function approveSuggestedRecipient(params: {
  event: FoundersBlessingEvent;
  suggestedMemberId: string | null;
  reviewerId: string;
  reason?: string;
}): FoundersBlessingEvent {
  void params.reviewerId;
  void params.reason;
  return requireFounderApproval({ event: params.event, suggestedMemberId: params.suggestedMemberId, founderApprovedMemberId: params.suggestedMemberId });
}

export function overrideSuggestedRecipient(params: {
  event: FoundersBlessingEvent;
  suggestedMemberId: string | null;
  founderApprovedMemberId: string;
  reviewerId: string;
  reason: string;
}): FoundersBlessingEvent {
  void params.reviewerId;
  void params.reason;
  return requireFounderApproval({ event: params.event, suggestedMemberId: params.suggestedMemberId, founderApprovedMemberId: params.founderApprovedMemberId });
}

export function postponeBlessing(event: FoundersBlessingEvent, updatedAt?: string): FoundersBlessingEvent {
  return { ...event, status: "postponed", activationStatus: "review_required", updatedAt: nowIso(updatedAt) };
}

export function cancelBlessing(event: FoundersBlessingEvent, updatedAt?: string): FoundersBlessingEvent {
  return { ...event, status: "cancelled", activationStatus: "not_active", updatedAt: nowIso(updatedAt) };
}

export function approveGiftPreparation(event: FoundersBlessingEvent, updatedAt?: string): FoundersBlessingEvent {
  return { ...event, status: "gift_prepared", adminReviewStatus: "approved", activationStatus: "review_required", updatedAt: nowIso(updatedAt) };
}

export function requireAdminRelease(): true {
  return true;
}

export function requireFounderRelease(): true {
  return true;
}

export function prepareGiftRecord(params: {
  event: FoundersBlessingEvent;
  recipientMemberId: string | null;
  adminReleaseApproved: boolean;
  createdAt?: string;
}): FoundersBlessingGift | null {
  if (!params.event.founderApprovedMemberId || !params.recipientMemberId || params.event.founderApprovedMemberId !== params.recipientMemberId) {
    return null;
  }
  const createdAt = nowIso(params.createdAt);
  return {
    id: `gift_${params.event.id}_${hash({ recipientMemberId: params.recipientMemberId }).slice(0, 16)}`,
    eventId: params.event.id,
    recipientMemberId: params.recipientMemberId,
    giftType: params.event.giftType,
    giftDescriptionPrivate: params.event.giftDescriptionPrivate,
    estimatedValueCents: params.event.estimatedGiftValueCents,
    deliveryStatus: params.adminReleaseApproved ? "held_for_admin_release" : "held_for_founder_approval",
    payoutProvider: null,
    payoutStatus: null,
    taxHoldRequired: true,
    accountingCategoryPending: true,
    founderReleaseRequired: requireFounderRelease(),
    adminReleaseRequired: requireAdminRelease(),
    createdAt,
    updatedAt: createdAt,
  };
}

export function buildPrivateRecipientNotification(params: {
  eventId: string;
  recipientMemberId: string;
  createdAt?: string;
}): FoundersBlessingNotification {
  const createdAt = nowIso(params.createdAt);
  return {
    id: `notification_${params.eventId}_${params.recipientMemberId}`,
    eventId: params.eventId,
    recipientMemberId: params.recipientMemberId,
    notificationType: "private_in_app",
    notificationStatus: "draft_only",
    privateMessage: "Congratulations. The Founder has chosen to recognize you with a Founder’s Blessing as an expression of appreciation for being part of the Humanity Laws community. Further details will be shared privately.",
    publicIdentityExposed: false,
    createdAt,
  };
}

export function buildPrivateEmailDraft(params: {
  eventId: string;
  recipientMemberId: string;
  createdAt?: string;
}): FoundersBlessingNotification {
  return {
    ...buildPrivateRecipientNotification(params),
    id: `email_${params.eventId}_${params.recipientMemberId}`,
    notificationType: "private_email",
  };
}

export function buildInAppNotificationDraft(params: {
  eventId: string;
  recipientMemberId: string;
  createdAt?: string;
}): FoundersBlessingNotification {
  return buildPrivateRecipientNotification(params);
}

export function buildAnonymizedCommunityUpdate(params: {
  eventId: string;
  createdAt?: string;
}): FoundersBlessingNotification {
  const createdAt = nowIso(params.createdAt);
  return {
    id: `notification_${params.eventId}_anonymized`,
    eventId: params.eventId,
    recipientMemberId: null,
    notificationType: "anonymized_community_update",
    notificationStatus: "draft_only",
    privateMessage: "A Founder’s Blessing was prepared privately for a member of the Humanity Laws community. Recipient identity remains private.",
    publicIdentityExposed: false,
    createdAt,
  };
}

function publicCategoryForGiftType(giftType: FoundersBlessingGiftType): FoundersBlessingPublicCategory {
  if (giftType === "money") return "Financial Blessing";
  if (["product", "technology", "clothing"].includes(giftType)) return "Product Blessing";
  if (["experience", "trip"].includes(giftType)) return "Experience Blessing";
  if (giftType === "book") return "Book Blessing";
  if (giftType === "other") return "Personal Appreciation Gift";
  return "Community Blessing";
}

export function createPrivateOutcomeRecord(params: {
  event: FoundersBlessingEvent;
  gift?: FoundersBlessingGift | null;
  notification?: FoundersBlessingNotification | null;
  audit?: FoundersBlessingRandomAudit | null;
  communications?: readonly FoundersBlessingPrivateCommunication[];
  founderApprovalTimestamp?: string | null;
  adminApprovalTimestamp?: string | null;
  recipientConfirmationTimestamp?: string | null;
  internalNotes?: string;
}): FoundersBlessingPrivateOutcomeRecord {
  return {
    eventId: params.event.id,
    eventMonth: params.event.eventMonth,
    suggestedMemberId: params.event.selectedMemberId,
    founderApprovedMemberId: params.event.founderApprovedMemberId,
    giftType: params.gift?.giftType ?? params.event.giftType,
    privateGiftDescription: params.gift?.giftDescriptionPrivate ?? params.event.giftDescriptionPrivate,
    estimatedValueCents: params.gift?.estimatedValueCents ?? params.event.estimatedGiftValueCents,
    deliveryStatus: params.gift?.deliveryStatus ?? "not_prepared",
    notificationStatus: params.notification?.notificationStatus ?? "draft_only",
    auditId: params.audit?.id ?? null,
    algorithmVersion: params.audit?.algorithmVersion ?? null,
    founderApprovalTimestamp: params.founderApprovalTimestamp ?? null,
    adminApprovalTimestamp: params.adminApprovalTimestamp ?? null,
    recipientConfirmationTimestamp: params.recipientConfirmationTimestamp ?? null,
    communicationLog: params.communications ?? [],
    deliveryVerification: params.recipientConfirmationTimestamp ? "recipient_confirmed" : params.gift ? "privately_delivered" : "private_pending",
    internalNotes: params.internalNotes ?? "Private internal record. Not for public display.",
  };
}

export function generateDiscreetPublicConfirmation(params: {
  event: FoundersBlessingEvent;
  gift?: FoundersBlessingGift | null;
  createdAt?: string;
}): FoundersBlessingOutcomeConfirmation {
  const createdAt = nowIso(params.createdAt);
  return {
    id: `outcome_${params.event.id}`,
    eventId: params.event.id,
    internalGiftId: params.gift?.id ?? null,
    publicConfirmationStatus: "pending_admin_approval",
    publicMonth: params.event.eventMonth,
    publicYear: Number(params.event.eventMonth.slice(0, 4)),
    publicCategory: publicCategoryForGiftType(params.gift?.giftType ?? params.event.giftType),
    publicMessage:
      "Founder’s Blessings are shared privately and respectfully. When a Founder’s Blessing has been completed, Humanity Laws may quietly acknowledge that appreciation has been given while protecting the recipient's privacy. The relationship remains personal. The gratitude remains genuine.",
    exactValueHidden: true,
    recipientIdentityHidden: true,
    communicationPrivate: true,
    approvedForPublicDisplay: false,
    approvedByAdminId: null,
    approvedAt: null,
    createdAt,
    updatedAt: createdAt,
  };
}

export function approvePublicConfirmation(params: {
  confirmation: FoundersBlessingOutcomeConfirmation;
  adminId: string;
  approvedAt?: string;
}): FoundersBlessingOutcomeConfirmation {
  const approvedAt = nowIso(params.approvedAt);
  return {
    ...redactExactGiftValue(redactRecipientIdentity(params.confirmation)),
    publicConfirmationStatus: "approved_anonymized",
    approvedForPublicDisplay: true,
    approvedByAdminId: params.adminId,
    approvedAt,
    updatedAt: approvedAt,
  };
}

export function redactRecipientIdentity(confirmation: FoundersBlessingOutcomeConfirmation): FoundersBlessingOutcomeConfirmation {
  return {
    ...confirmation,
    recipientIdentityHidden: true,
  };
}

export function redactExactGiftValue(confirmation: FoundersBlessingOutcomeConfirmation): FoundersBlessingOutcomeConfirmation {
  return {
    ...confirmation,
    exactValueHidden: true,
  };
}

export function getPublicOutcomeSummary(confirmations: readonly FoundersBlessingOutcomeConfirmation[], currentYear = new Date().getUTCFullYear()): FoundersBlessingPublicOutcomeSummary {
  const approved = confirmations.filter((confirmation) => confirmation.approvedForPublicDisplay && confirmation.publicConfirmationStatus === "approved_anonymized");
  return {
    blessingsCompletedPrivatelyThisYear: approved.filter((confirmation) => confirmation.publicYear === currentYear).length,
    blessingsCompletedPrivatelyAllTime: approved.length,
    lastBlessingMonth: approved.at(-1)?.publicMonth ?? null,
    recipientPrivacy: "Protected",
    communication: "One-to-One",
    categories: Array.from(new Set(approved.map((confirmation) => confirmation.publicCategory))),
    publicMessage: "Founder’s Blessings are handled privately and respectfully. Quiet Impact shows only anonymized aggregate outcomes.",
  };
}

export function getInternalOutcomeAuditTrail(params: {
  event: FoundersBlessingEvent;
  gift?: FoundersBlessingGift | null;
  notification?: FoundersBlessingNotification | null;
  confirmation?: FoundersBlessingOutcomeConfirmation | null;
  communications?: readonly FoundersBlessingPrivateCommunication[];
}): FoundersBlessingAdminAuditTrail {
  const confirmation = params.confirmation ?? generateDiscreetPublicConfirmation({ event: params.event, gift: params.gift ?? null, createdAt: params.event.createdAt });
  return {
    eventId: params.event.id,
    suggestedMemberId: params.event.selectedMemberId,
    approvedRecipientId: params.event.founderApprovedMemberId,
    giftStatus: params.gift?.deliveryStatus ?? "not_prepared",
    deliveryConfirmation: params.gift?.updatedAt ?? null,
    notificationConfirmation: params.notification?.createdAt ?? null,
    publicConfirmationDraft: confirmation,
    communicationLogs: params.communications ?? [],
    adminCanApproveOrRejectPublicConfirmation: true,
  };
}

export function createPrivateMemberNotification(params: {
  eventId: string;
  memberId: string;
  communicationType?: FoundersBlessingCommunicationType;
  communicationChannel?: FoundersBlessingCommunicationChannel;
  founderMessageOptional?: string | null;
  createdAt?: string;
}): FoundersBlessingPrivateCommunication {
  const createdAt = nowIso(params.createdAt);
  return {
    id: `private_comm_${params.eventId}_${params.memberId}_${params.communicationChannel ?? "in_app"}`,
    eventId: params.eventId,
    memberId: params.memberId,
    communicationType: params.communicationType ?? "private_member_notification",
    communicationChannel: params.communicationChannel ?? "in_app",
    messageStatus: "draft_only",
    deliveredAt: null,
    readAt: null,
    founderMessageOptional: params.founderMessageOptional ?? null,
    followUpRequired: false,
    createdAt,
  };
}

export function sendPrivateInAppNotification(communication: FoundersBlessingPrivateCommunication, deliveredAt?: string): FoundersBlessingPrivateCommunication {
  return {
    ...communication,
    communicationChannel: "in_app",
    messageStatus: "delivered_privately",
    deliveredAt: nowIso(deliveredAt),
  };
}

export function buildPrivateEmail(params: {
  eventId: string;
  memberId: string;
  founderMessageOptional?: string | null;
  createdAt?: string;
}): FoundersBlessingPrivateCommunication {
  return createPrivateMemberNotification({
    eventId: params.eventId,
    memberId: params.memberId,
    communicationType: "private_email",
    communicationChannel: "email",
    founderMessageOptional: params.founderMessageOptional ?? null,
    createdAt: params.createdAt,
  });
}

export function buildPrivateFounderMessage(params: {
  eventId: string;
  memberId: string;
  founderMessage: string;
  createdAt?: string;
}): FoundersBlessingPrivateCommunication {
  return createPrivateMemberNotification({
    eventId: params.eventId,
    memberId: params.memberId,
    communicationType: "future_founder_personal_message",
    communicationChannel: "secure_message",
    founderMessageOptional: params.founderMessage,
    createdAt: params.createdAt,
  });
}

export function recordDeliveryConfirmation(communication: FoundersBlessingPrivateCommunication, deliveredAt?: string): FoundersBlessingPrivateCommunication {
  return {
    ...communication,
    messageStatus: "delivered_privately",
    deliveredAt: nowIso(deliveredAt),
  };
}

export function recordReadConfirmation(communication: FoundersBlessingPrivateCommunication, readAt?: string): FoundersBlessingPrivateCommunication {
  return {
    ...communication,
    messageStatus: "read_privately",
    readAt: nowIso(readAt),
  };
}

export function archivePrivateConversation(communication: FoundersBlessingPrivateCommunication): FoundersBlessingPrivateCommunication {
  return {
    ...communication,
    messageStatus: "archived_private",
  };
}

export const FounderBlessingsProfileService = {
  enrollMemberAfterSignup,
  updateEligibilityFromMembershipStatus,
  pauseEligibility,
  restoreEligibility,
  getFounderBlessingsProfile,
} as const;

export const FounderBlessingsEligibilityService = {
  buildEligibleCandidatePool,
  includeAllEligibleActiveMembers,
} as const;

export const FounderBlessingsEventService = {
  createMonthlyBlessingEvent,
  calculateSuggestedMonthlyEventDate,
  buildMonthlyCandidatePool,
  includeAllEligibleActiveMembers,
  markEventPendingFounderReview,
} as const;

export const FounderBlessingsRandomizerService = {
  selectSuggestedRecipientWithCryptoRandomness,
  hashCandidatePool,
  generateAuditHash,
} as const;

export const FounderBlessingsApprovalService = {
  approveSuggestedRecipient,
  overrideSuggestedRecipient,
  postponeBlessing,
  cancelBlessing,
  approveGiftPreparation,
  requireAdminRelease,
  requireFounderRelease,
} as const;

export const FounderBlessingsNotificationService = {
  buildPrivateRecipientNotification,
  buildPrivateEmailDraft,
  buildInAppNotificationDraft,
  buildAnonymizedCommunityUpdate,
} as const;

export const FounderBlessingsOutcomeConfirmationService = {
  createPrivateOutcomeRecord,
  generateDiscreetPublicConfirmation,
  approvePublicConfirmation,
  redactRecipientIdentity,
  redactExactGiftValue,
  getPublicOutcomeSummary,
  getInternalOutcomeAuditTrail,
} as const;

export const FounderBlessingsCommunicationService = {
  createPrivateMemberNotification,
  sendPrivateInAppNotification,
  buildPrivateEmail,
  buildPrivateFounderMessage,
  recordDeliveryConfirmation,
  recordReadConfirmation,
  archivePrivateConversation,
} as const;

export function createFoundersBlessingsReadinessModel(): FoundersBlessingsReadinessModel {
  return {
    title: "Founder’s Blessings",
    subtitle: "An occasional expression of appreciation from the Founder to the Humanity Laws community.",
    memberFacingCopy:
      "Every active Humanity Laws member is included in Founder’s Blessings as part of the community. From time to time, the Founder may privately recognize a member with a blessing. Blessings may vary and are not guaranteed. They are an expression of appreciation, not the reason for membership.",
    outcomeVerificationCopy:
      "Founder’s Blessings are shared privately and respectfully. This space simply reflects that appreciation continues to be given throughout the Humanity Laws community while protecting every recipient's privacy. Every blessing is intended to remain a personal expression of gratitude between Humanity Laws and the individual member.",
    memberAutonomyCopy:
      "Founder’s Blessings are communicated privately between Humanity Laws and the individual member. Members are always free to share their own experiences if they choose, but Humanity Laws will never require, pressure, or automatically publish a member’s private blessing.",
    quietImpactMetrics: {
      blessingsCompletedPrivatelyLabel: "Blessings Completed Privately",
      thisYearLabel: "This Year",
      lastBlessingMonthLabel: "Last Blessing Month",
      recipientPrivacyLabel: "Protected",
      communicationLabel: "One-to-One",
    },
    enrollmentStatus: "Included",
    eligibility: "Active / Paused / Pending",
    currentBlessingLevel: "Active Member",
    currentStatus: "In preparation",
    blessingsEnabled: "Not yet active",
    privateRecognition: true,
    publicAnnouncement: "Disabled",
    founderApprovalRequired: true,
    randomSelectionAssist: "Secure cryptographic standard",
    moneyMovement: "Disabled",
    launchGovernance: createFoundersBlessingsGovernance(),
  };
}
