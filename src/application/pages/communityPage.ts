import type { PageModel } from "../types.js";
import { createCommunityRelationshipsPlatform } from "../../experiences/index.js";

export function createCommunityPage(): PageModel {
  const platform = createCommunityRelationshipsPlatform();
  const blessings = platform.foundersBlessings;
  const readiness = blessings.readiness;

  return {
    pageId: "community",
    kind: "MEMBER",
    title: "Community",
    subtitle: "A living place for connection, trust, and private member appreciation.",
    seoTitle: "Community — Humanity Laws",
    accessibilitySummary: "Community member room",
    actions: [
      { label: "Visit The Table", href: "/table", kind: "PRIMARY" },
      { label: "Review Launch Status", href: "/launch-status", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Private member community", title: "Connection first. Appreciation without hype.", body: `${platform.corePhilosophy} This room is private, member-centered, and protected from fake activity, public pressure, gambling language, and attention manipulation.` },
      { eyebrow: "Founder’s Blessings", title: readiness.subtitle, body: blessings.coreLanguage },
      { eyebrow: "Your inclusion", title: "Every active member is included.", body: `Enrollment status: ${readiness.enrollmentStatus}. Eligibility: ${readiness.eligibility}. Current blessing level: ${readiness.currentBlessingLevel}. Founder’s Blessings remains an appreciation layer, not the reason for membership.` },
      { eyebrow: "Status", title: "Founder’s Blessings are prepared, not active.", body: `Current status: ${readiness.currentStatus}. Blessings enabled: ${readiness.blessingsEnabled}. Private recognition: Yes. Public announcement: ${readiness.publicAnnouncement}. Founder approval required: Yes. Random selection assist: ${readiness.randomSelectionAssist}. Money movement: ${readiness.moneyMovement}.` },
      { eyebrow: "Trust + Verification", title: "Selection assist is private, audited, and never final by itself.", body: `${blessings.auditPlaceholder} ${blessings.candidatePoolPlaceholder} Suggested recipient remains private. Founder final approval is required. Admin review is required. Public announcement is disabled.` },
      { eyebrow: "Blessing levels", title: "Simple for launch. Expandable later.", body: blessings.levels.join(" ") },
      { eyebrow: "Quiet Impact", title: blessings.quietImpactCard.title, body: `${blessings.quietImpactCard.body} Metrics: ${blessings.quietImpactCard.metrics.join(". ")}.` },
      { eyebrow: "Private recipient message", title: "Recipient is notified privately inside the platform.", body: blessings.privateRecipientMessage },
      { eyebrow: "Community history", title: "Anonymized history only, never public exposure without consent.", body: `Total prepared: ${blessings.anonymizedCommunityHistory.totalBlessingsPreparedLabel} Private recipients: ${blessings.anonymizedCommunityHistory.totalPrivateRecipientsLabel} Archive: ${blessings.anonymizedCommunityHistory.archive.join(" ")}` },
      { eyebrow: "Private relationship", title: "Private truth. Public humility.", body: `${blessings.privateRelationshipPrinciple} ${blessings.memberAutonomyPrinciple}` },
      { eyebrow: "Rules + Privacy", title: "Clear boundaries before activation.", body: blessings.rulesAndPrivacy.join(" ") },
      { eyebrow: "Safety", title: "The page is ready; live gift delivery remains locked.", body: `Member profiles, monthly inclusion, and secure selection assist are prepared. Real money movement is disabled. Automatic gift delivery is disabled. Public announcements are disabled. Founder final approval, admin release, and tax/accounting review are required before activation.` },
      { eyebrow: "Activation review", title: "No gift delivery happens until review is complete.", body: "Before Founder’s Blessings can become active, the Founder review flow, admin release flow, tax/accounting review, optional legal review, and private notification process must all be verified. Until then, this remains an included member profile layer only." },
      { eyebrow: "Community foundation", title: `${platform.modules.length} relationship modules remain privacy-first and safety-gated.`, body: "Community Hub, The Table Expansion, Groups, Events, Meeting & Dating, Conversation Engine, Shared Journey, Volunteer & Service, Privacy & Trust, Adam and Eve support, Founder Community, and future integrations remain modeled carefully. No fake members, fake conversations, fake activity, or fake testimonials are being created." },
    ],
    emptyState: "Community features are not live yet. Founder’s Blessings are not active yet and require Founder approval, admin review, tax/accounting review, optional legal review, verified backend records, and separate gift-release approval before activation.",
  };
}
