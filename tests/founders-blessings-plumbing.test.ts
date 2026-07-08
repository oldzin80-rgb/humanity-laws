import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildAnonymizedCommunityUpdate,
  buildEligibleCandidatePool,
  buildPrivateEmail,
  buildPrivateFounderMessage,
  buildPrivateRecipientNotification,
  createPrivateMemberNotification,
  createPrivateOutcomeRecord,
  createMonthlyBlessingEvent,
  createFounderBlessingEvent,
  createFoundersBlessingsGovernance,
  enrollMemberAfterSignup,
  foundersBlessingsLevels,
  generateDiscreetPublicConfirmation,
  getInternalOutcomeAuditTrail,
  getPublicOutcomeSummary,
  hashCandidatePool,
  includeAllEligibleActiveMembers,
  prepareGiftRecord,
  approvePublicConfirmation,
  recordDeliveryConfirmation,
  recordReadConfirmation,
  archivePrivateConversation,
  requireFounderApproval,
  restoreEligibility,
  selectSuggestedRecipientWithCryptoRandomness,
  updateEligibilityFromMembershipStatus,
  type FoundersBlessingMemberSource,
} from "../src/experiences/index.js";

const serviceSource = readFileSync(new URL("../src/experiences/foundersBlessingsService.ts", import.meta.url), "utf8");
const migrationSource = readFileSync(new URL("../supabase/migrations/004_founders_blessings.sql", import.meta.url), "utf8");

const members: FoundersBlessingMemberSource[] = [
  { memberId: "member_active_1", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true },
  { memberId: "member_active_2", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true },
  { memberId: "member_test", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, testAccount: true },
  { memberId: "member_refunded", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, refunded: true },
  { memberId: "member_banned", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, banned: true },
  { memberId: "member_fraud", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, fraudFlagged: true },
  { memberId: "member_duplicate", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, duplicateAccount: true },
  { memberId: "member_free", membershipStatus: "FREE", paidMember: false, accountGoodStanding: true },
  { memberId: "member_active_1", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true },
];

test("Founder’s Blessings randomizer uses Node crypto, never Math.random", () => {
  assert.match(serviceSource, /from "node:crypto"/);
  assert.match(serviceSource, /\brandomInt\b/);
  assert.doesNotMatch(serviceSource, /Math\.random/);
});

test("candidate pool is deduplicated, exclusion-aware, and hashed", () => {
  const candidates = buildEligibleCandidatePool({ eventId: "event_1", members, adminExclusionList: ["member_active_2"], createdAt: "2026-07-06T12:00:00.000Z" });

  assert.equal(candidates.filter((candidate) => candidate.memberId === "member_active_1").length, 1);
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_active_1")?.eligibilityStatus, "eligible");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_active_2")?.exclusionReason, "admin_excluded_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_test")?.exclusionReason, "test_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_refunded")?.exclusionReason, "refunded_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_banned")?.exclusionReason, "banned_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_fraud")?.exclusionReason, "fraud_flagged_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_duplicate")?.exclusionReason, "duplicate_account");
  assert.equal(candidates.find((candidate) => candidate.memberId === "member_free")?.exclusionReason, "active_paid_member_required");
  assert.match(hashCandidatePool(candidates), /^[a-f0-9]{64}$/);
});

test("new active members are enrolled and restored members become eligible again", () => {
  const profile = enrollMemberAfterSignup("member_active_1", "2026-07-06T12:00:00.000Z");
  const active = updateEligibilityFromMembershipStatus({
    profile,
    member: { memberId: "member_active_1", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true },
    updatedAt: "2026-07-06T12:01:00.000Z",
  });
  const canceled = updateEligibilityFromMembershipStatus({
    profile: active,
    member: { memberId: "member_active_1", membershipStatus: "CANCELLED", paidMember: false, accountGoodStanding: true },
    updatedAt: "2026-07-06T12:02:00.000Z",
  });
  const restored = restoreEligibility(canceled, "2026-07-06T12:03:00.000Z");

  assert.equal(profile.enrollmentStatus, "included");
  assert.equal(profile.eligibilityStatus, "pending");
  assert.equal(profile.currentLevel, "level_1");
  assert.equal(active.eligibilityStatus, "eligible");
  assert.equal(canceled.eligibilityStatus, "paused");
  assert.equal(canceled.eligibilityReason, "canceled_account");
  assert.equal(restored.eligibilityStatus, "eligible");
});

test("refunded and banned members become ineligible", () => {
  const profile = enrollMemberAfterSignup("member_blocked");
  const refunded = updateEligibilityFromMembershipStatus({
    profile,
    member: { memberId: "member_blocked", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, refunded: true },
  });
  const banned = updateEligibilityFromMembershipStatus({
    profile,
    member: { memberId: "member_blocked", membershipStatus: "ACTIVE", paidMember: true, accountGoodStanding: true, banned: true },
  });

  assert.equal(refunded.eligibilityStatus, "paused");
  assert.equal(refunded.eligibilityReason, "refunded_account");
  assert.equal(banned.eligibilityStatus, "paused");
  assert.equal(banned.eligibilityReason, "banned_account");
});

test("monthly pool includes all eligible active members and only one candidate per member", () => {
  const event = createMonthlyBlessingEvent(new Date("2026-07-06T12:00:00.000Z"), "2026-07-06T12:00:00.000Z");
  const candidates = buildEligibleCandidatePool({ eventId: event.id, members, createdAt: event.createdAt });
  const eligible = includeAllEligibleActiveMembers({ eventId: event.id, members, createdAt: event.createdAt });

  assert.equal(event.eventDate, "2026-07-25");
  assert.equal(candidates.filter((candidate) => candidate.memberId === "member_active_1").length, 1);
  assert.deepEqual(
    eligible.map((candidate) => candidate.memberId).sort(),
    ["member_active_1", "member_active_2"],
  );
  assert.ok(eligible.every((candidate) => candidate.profileId.startsWith("founders_blessings_profile_")));
  assert.ok(eligible.every((candidate) => candidate.blessingLevelAtEvent === "level_1"));
});

test("Founder’s Blessings levels keep level_1 active and future levels inactive", () => {
  const activeLevels = foundersBlessingsLevels.filter((level) => level.active);
  const inactiveLevels = foundersBlessingsLevels.filter((level) => !level.active);

  assert.deepEqual(activeLevels.map((level) => level.level), ["level_1"]);
  assert.equal(activeLevels[0]?.name, "Active Member");
  assert.deepEqual(
    inactiveLevels.map((level) => level.level),
    ["level_2", "level_3", "level_4", "level_5", "level_6"],
  );
});

test("crypto random selection creates audit id and remains a suggestion until Founder approval", () => {
  const event = createFounderBlessingEvent({ id: "event_1", fromDate: new Date("2026-07-06T12:00:00.000Z"), createdAt: "2026-07-06T12:00:00.000Z" });
  const candidates = buildEligibleCandidatePool({ eventId: event.id, members: members.slice(0, 2), createdAt: event.createdAt });
  const { suggestedMemberId, audit } = selectSuggestedRecipientWithCryptoRandomness({ eventId: event.id, candidates, requestId: "request_1", createdAt: event.createdAt });

  assert.ok(suggestedMemberId === "member_active_1" || suggestedMemberId === "member_active_2");
  assert.match(audit.id, /^audit_[a-f0-9]{16}$/);
  assert.match(audit.auditHash, /^[a-f0-9]{64}$/);
  assert.match(audit.candidatePoolHash, /^[a-f0-9]{64}$/);
  assert.equal(audit.algorithmName, "node_crypto_randomInt");
  assert.equal(audit.algorithmVersion, "founders_blessings_v1");

  const suggestedOnly = requireFounderApproval({ event, suggestedMemberId });
  assert.equal(suggestedOnly.selectedMemberId, suggestedMemberId);
  assert.equal(suggestedOnly.founderApprovedMemberId, null);
  assert.equal(suggestedOnly.founderApprovalStatus, "pending");
  assert.equal(suggestedOnly.status, "recipient_suggested");
});

test("Founder approval and admin release are required before gift preparation advances", () => {
  const event = createFounderBlessingEvent({ id: "event_1", giftType: "book", giftDescriptionPrivate: "Private book set", estimatedGiftValueCents: 7000 });
  const suggestedOnly = requireFounderApproval({ event, suggestedMemberId: "member_active_1" });

  assert.equal(prepareGiftRecord({ event: suggestedOnly, recipientMemberId: "member_active_1", adminReleaseApproved: false }), null);

  const founderApproved = requireFounderApproval({ event, suggestedMemberId: "member_active_1", founderApprovedMemberId: "member_active_1" });
  const heldGift = prepareGiftRecord({ event: founderApproved, recipientMemberId: "member_active_1", adminReleaseApproved: false });
  const adminHeldGift = prepareGiftRecord({ event: founderApproved, recipientMemberId: "member_active_1", adminReleaseApproved: true });

  assert.equal(founderApproved.founderApprovalStatus, "approved");
  assert.equal(heldGift?.founderReleaseRequired, true);
  assert.equal(heldGift?.adminReleaseRequired, true);
  assert.equal(heldGift?.deliveryStatus, "held_for_founder_approval");
  assert.equal(adminHeldGift?.deliveryStatus, "held_for_admin_release");
  assert.equal(adminHeldGift?.payoutProvider, null);
  assert.equal(adminHeldGift?.payoutStatus, null);
});

test("notifications are private or anonymized and never expose recipient identity publicly", () => {
  const privateNotification = buildPrivateRecipientNotification({ eventId: "event_1", recipientMemberId: "member_active_1", createdAt: "2026-07-06T12:00:00.000Z" });
  const anonymizedUpdate = buildAnonymizedCommunityUpdate({ eventId: "event_1", createdAt: "2026-07-06T12:00:00.000Z" });

  assert.equal(privateNotification.notificationType, "private_in_app");
  assert.equal(privateNotification.notificationStatus, "draft_only");
  assert.equal(privateNotification.publicIdentityExposed, false);
  assert.match(privateNotification.privateMessage, /Founder’s Blessing/);
  assert.equal(anonymizedUpdate.notificationType, "anonymized_community_update");
  assert.equal(anonymizedUpdate.recipientMemberId, null);
  assert.equal(anonymizedUpdate.publicIdentityExposed, false);
});

test("private outcome records keep complete recipient and gift audit details internally", () => {
  const event = requireFounderApproval({
    event: createFounderBlessingEvent({ id: "event_private", giftType: "book", giftDescriptionPrivate: "Signed private book set", estimatedGiftValueCents: 12000 }),
    suggestedMemberId: "member_active_1",
    founderApprovedMemberId: "member_active_1",
  });
  const gift = prepareGiftRecord({ event, recipientMemberId: "member_active_1", adminReleaseApproved: true, createdAt: "2026-07-06T12:00:00.000Z" });
  const notification = buildPrivateRecipientNotification({ eventId: event.id, recipientMemberId: "member_active_1", createdAt: "2026-07-06T12:01:00.000Z" });
  const communication = recordDeliveryConfirmation(createPrivateMemberNotification({ eventId: event.id, memberId: "member_active_1", createdAt: "2026-07-06T12:02:00.000Z" }), "2026-07-06T12:03:00.000Z");
  const record = createPrivateOutcomeRecord({
    event,
    gift,
    notification,
    communications: [communication],
    founderApprovalTimestamp: "2026-07-06T12:04:00.000Z",
    adminApprovalTimestamp: "2026-07-06T12:05:00.000Z",
    recipientConfirmationTimestamp: "2026-07-06T12:06:00.000Z",
  });

  assert.equal(record.suggestedMemberId, "member_active_1");
  assert.equal(record.founderApprovedMemberId, "member_active_1");
  assert.equal(record.privateGiftDescription, "Signed private book set");
  assert.equal(record.estimatedValueCents, 12000);
  assert.equal(record.deliveryStatus, "held_for_admin_release");
  assert.equal(record.notificationStatus, "draft_only");
  assert.equal(record.deliveryVerification, "recipient_confirmed");
  assert.equal(record.communicationLog[0]?.memberId, "member_active_1");
});

test("public outcome confirmation hides recipient identity, exact value, and communication by default", () => {
  const event = requireFounderApproval({
    event: createFounderBlessingEvent({ id: "event_public", giftType: "money", estimatedGiftValueCents: 50000 }),
    suggestedMemberId: "member_active_1",
    founderApprovedMemberId: "member_active_1",
  });
  const gift = prepareGiftRecord({ event, recipientMemberId: "member_active_1", adminReleaseApproved: true });
  const confirmation = generateDiscreetPublicConfirmation({ event, gift, createdAt: "2026-07-06T12:00:00.000Z" });

  assert.equal(confirmation.publicConfirmationStatus, "pending_admin_approval");
  assert.equal(confirmation.approvedForPublicDisplay, false);
  assert.equal(confirmation.exactValueHidden, true);
  assert.equal(confirmation.recipientIdentityHidden, true);
  assert.equal(confirmation.communicationPrivate, true);
  assert.equal(confirmation.publicCategory, "Financial Blessing");
  assert.doesNotMatch(JSON.stringify(confirmation), /member_active_1|50000|Signed private/i);
});

test("public confirmation requires admin approval and remains anonymized after approval", () => {
  const event = createFounderBlessingEvent({ id: "event_approved_public", giftType: "experience" });
  const draft = generateDiscreetPublicConfirmation({ event, createdAt: "2026-07-06T12:00:00.000Z" });
  const approved = approvePublicConfirmation({ confirmation: draft, adminId: "admin_1", approvedAt: "2026-07-06T12:10:00.000Z" });

  assert.equal(draft.approvedForPublicDisplay, false);
  assert.equal(approved.publicConfirmationStatus, "approved_anonymized");
  assert.equal(approved.approvedForPublicDisplay, true);
  assert.equal(approved.approvedByAdminId, "admin_1");
  assert.equal(approved.exactValueHidden, true);
  assert.equal(approved.recipientIdentityHidden, true);
});

test("aggregate public summary includes completed outcomes without exposing private details", () => {
  const event = createFounderBlessingEvent({ id: "event_summary", fromDate: new Date("2026-07-06T12:00:00.000Z"), giftType: "product" });
  const approved = approvePublicConfirmation({
    confirmation: generateDiscreetPublicConfirmation({ event, createdAt: "2026-07-06T12:00:00.000Z" }),
    adminId: "admin_1",
    approvedAt: "2026-07-06T12:10:00.000Z",
  });
  const unapproved = generateDiscreetPublicConfirmation({ event: createFounderBlessingEvent({ id: "event_unapproved", giftType: "book" }) });
  const summary = getPublicOutcomeSummary([approved, unapproved], 2026);

  assert.equal(summary.blessingsCompletedPrivatelyThisYear, 1);
  assert.equal(summary.blessingsCompletedPrivatelyAllTime, 1);
  assert.equal(summary.lastBlessingMonth, "2026-07");
  assert.equal(summary.recipientPrivacy, "Protected");
  assert.equal(summary.communication, "One-to-One");
  assert.deepEqual(summary.categories, ["Product Blessing"]);
  assert.doesNotMatch(JSON.stringify(summary), /member_|admin_1|exact|value/i);
});

test("private communication remains one-to-one and has no social or public posting flow", () => {
  const inApp = createPrivateMemberNotification({ eventId: "event_comm", memberId: "member_active_1" });
  const email = buildPrivateEmail({ eventId: "event_comm", memberId: "member_active_1" });
  const founderMessage = buildPrivateFounderMessage({ eventId: "event_comm", memberId: "member_active_1", founderMessage: "A private note." });
  const read = recordReadConfirmation(recordDeliveryConfirmation(inApp, "2026-07-06T12:00:00.000Z"), "2026-07-06T12:03:00.000Z");
  const archived = archivePrivateConversation(read);

  assert.equal(inApp.communicationChannel, "in_app");
  assert.equal(email.communicationChannel, "email");
  assert.equal(founderMessage.communicationChannel, "secure_message");
  assert.equal(read.messageStatus, "read_privately");
  assert.equal(archived.messageStatus, "archived_private");
  assert.doesNotMatch(JSON.stringify([inApp, email, founderMessage]), /social|leaderboard|ranking|testimonial|required_testimony|public_post/i);
});

test("admin audit trail is complete while public confirmation remains private by default", () => {
  const event = requireFounderApproval({
    event: createFounderBlessingEvent({ id: "event_audit", giftType: "book", giftDescriptionPrivate: "Private book gift" }),
    suggestedMemberId: "member_active_2",
    founderApprovedMemberId: "member_active_2",
  });
  const gift = prepareGiftRecord({ event, recipientMemberId: "member_active_2", adminReleaseApproved: true });
  const notification = buildPrivateRecipientNotification({ eventId: event.id, recipientMemberId: "member_active_2" });
  const communication = buildPrivateFounderMessage({ eventId: event.id, memberId: "member_active_2", founderMessage: "Private founder note." });
  const audit = getInternalOutcomeAuditTrail({ event, gift, notification, communications: [communication] });

  assert.equal(audit.suggestedMemberId, "member_active_2");
  assert.equal(audit.approvedRecipientId, "member_active_2");
  assert.equal(audit.giftStatus, "held_for_admin_release");
  assert.equal(audit.notificationConfirmation, notification.createdAt);
  assert.equal(audit.communicationLogs[0]?.founderMessageOptional, "Private founder note.");
  assert.equal(audit.adminCanApproveOrRejectPublicConfirmation, true);
  assert.equal(audit.publicConfirmationDraft.approvedForPublicDisplay, false);
});

test("Founder’s Blessings safety flags keep page launch-safe and activation blocked", () => {
  const governance = createFoundersBlessingsGovernance();

  assert.equal(governance.communityPageLaunchReady, true);
  assert.equal(governance.foundersBlessingsPlumbingReady, true);
  assert.equal(governance.foundersBlessingsProfilesReady, true);
  assert.equal(governance.foundersBlessingsMonthlyPoolReady, true);
  assert.equal(governance.foundersBlessingsRandomizerReady, true);
  assert.equal(governance.realMoneyMovementEnabled, false);
  assert.equal(governance.automaticGiftEnabled, false);
  assert.equal(governance.automaticGiftDeliveryEnabled, false);
  assert.equal(governance.publicAnnouncementEnabled, false);
  assert.equal(governance.founderFinalApprovalRequired, true);
  assert.equal(governance.adminReviewRequired, true);
  assert.equal(governance.adminReleaseRequired, true);
  assert.equal(governance.taxAccountingReviewRequired, true);
  assert.equal(governance.legalReviewRecommended, true);
  assert.equal(governance.launchBlocking, false);
  assert.equal(governance.activationBlocking, true);
});

test("Supabase migration creates Founder’s Blessings tables with RLS and service-role policies", () => {
  for (const table of [
    "founders_blessings_profiles",
    "founders_blessings_events",
    "founders_blessings_candidates",
    "founders_blessings_random_audits",
    "founders_blessings_gifts",
    "founders_blessings_notifications",
    "founders_blessings_outcome_confirmations",
    "founders_blessings_private_communications",
  ]) {
    assert.match(migrationSource, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(migrationSource, new RegExp(`alter table public\\.${table} enable row level security`));
  }

  assert.match(migrationSource, /selected_member_id_nullable/);
  assert.match(migrationSource, /founder_approved_member_id_nullable/);
  assert.match(migrationSource, /enrollment_status/);
  assert.match(migrationSource, /current_level/);
  assert.match(migrationSource, /profile_id/);
  assert.match(migrationSource, /blessing_level_at_event/);
  assert.match(migrationSource, /activation_status/);
  assert.match(migrationSource, /candidate_pool_hash/);
  assert.match(migrationSource, /audit_hash/);
  assert.match(migrationSource, /public_identity_exposed boolean not null default false/);
  assert.match(migrationSource, /recipient_identity_hidden boolean not null default true/);
  assert.match(migrationSource, /exact_value_hidden boolean not null default true/);
  assert.match(migrationSource, /communication_private boolean not null default true/);
  assert.match(migrationSource, /approved_for_public_display boolean not null default false/);
  assert.match(migrationSource, /communication_type/);
  assert.match(migrationSource, /message_status/);
  assert.match(migrationSource, /to service_role/);
});
