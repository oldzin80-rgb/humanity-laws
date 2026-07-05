import type { PageModel } from "../types.js";
import { createSocialMediaCommandCenterExperience } from "../../experiences/index.js";

export function createSocialMediaCommandCenterPage(): PageModel {
  const experience = createSocialMediaCommandCenterExperience();
  const connectedCount = experience.outletAdapters.filter((adapter) => adapter.state === "connected").length;

  return {
    pageId: "social-media-command-center",
    kind: "ADMIN",
    title: "Social Media Command Center",
    subtitle: "Plan calmly. Approve honestly. Export safely. Publish only after real channels are verified.",
    seoTitle: "Social Media Command Center — Humanity Laws",
    accessibilitySummary: "Admin campaign planning and approval room",
    actions: [
      { label: "Create Campaign", href: "/social-media-command-center", kind: "PRIMARY" },
      { label: "Review with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Command flow",
        title: experience.path.join(" → "),
        body: "Every campaign moves through planning, channel arrangement, scheduling, human approval, export or verified publishing, then reflection.",
      },
      {
        eyebrow: "Approval",
        title: "Human approval stays before publishing.",
        body: "Campaigns can be prepared and exported, but no outlet publishes automatically unless an official adapter is connected and the campaign is approved.",
        bullets: ["Founder approval required.", "No fake urgency.", "No fake audience behavior.", "No exaggerated claims."],
      },
      {
        eyebrow: "Channels",
        title: `${connectedCount} live publishing channels are connected.`,
        body: "Instagram, Facebook, TikTok, YouTube, Shorts, X/Twitter, LinkedIn, Threads, Pinterest, email, SMS, website announcements, and future outlets are represented as honest placeholders until configured.",
      },
      {
        eyebrow: "Voice",
        title: "Calm, truthful, classy, and human.",
        body: "The command center protects Humanity Laws voice: spiritual but not forced, clear without hype, warm without manipulation, and always accountable to human judgment.",
      },
      {
        eyebrow: "Adam & Eve",
        title: "Context can be remembered only as a member-owned event.",
        body: "Entering the command center, creating a campaign, approving, exporting, connecting a channel, or reviewing results can be queued for Adam and Eve without blocking the campaign experience.",
      },
    ],
    emptyState: "No social outlet is live-connected yet. Manual export is available while official APIs, OAuth, approval, and compliance are verified.",
  };
}
