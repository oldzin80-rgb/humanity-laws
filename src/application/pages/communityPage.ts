import type { PageModel } from "../types.js";
import { createCommunityRelationshipsPlatform } from "../../experiences/index.js";

export function createCommunityPage(): PageModel {
  const platform = createCommunityRelationshipsPlatform();

  return {
    pageId: "community",
    kind: "MEMBER",
    title: "Community & Relationships",
    subtitle: "A future relationship ecosystem for meaningful connection, shared growth, hospitality, service, and trust.",
    seoTitle: "Community — Humanity Laws",
    accessibilitySummary: "Community member room",
    actions: [
      { label: "Visit The Table", href: "/table", kind: "PRIMARY" },
      { label: "Open Council", href: "/council", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Community", title: "Connection needs stewardship.", body: platform.corePhilosophy },
      { eyebrow: "Ecosystem", title: `${platform.modules.length} relationship modules stay privacy-first.`, body: "Community Hub, The Table Expansion, Groups, Events, Meeting & Dating, Conversation Engine, Shared Journey, Volunteer & Service, Privacy & Trust, Adam and Eve support, Founder Community, and future integrations are modeled as one safe ecosystem." },
      { eyebrow: "The Table", title: "Gather → Prompt → Share → Remember.", body: "The Table expands toward invitations, dinner planning, conversation guides, shared reflections, hospitality ideas, and celebrations — but live invites remain off until privacy and consent are verified." },
      { eyebrow: "Groups and events", title: "Families, friends, couples, study groups, wellness groups, book clubs, service, and Spark circles.", body: "Relationship spaces require human moderation, reporting, blocking, and clear consent before any live community features open." },
      { eyebrow: "Meeting and dating", title: "Choice, safety, and dignity come first.", body: "Future friendship, mentorship, professional networking, dating, and marriage-minded connections require privacy controls, human verification options, reporting, blocking, and explicit user preferences." },
      { eyebrow: "Current state", title: "Community features are not live yet.", body: "No fake members, fake conversations, fake activity, or fake testimonials are being created. The Table, Council, Library, and Founder updates remain the safe foundation while moderation is verified." },
    ],
    emptyState: "Community spaces will open only after consent, privacy, reporting, blocking, moderation, and support paths are verified.",
  };
}
