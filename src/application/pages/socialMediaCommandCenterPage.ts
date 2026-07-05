import type { PageModel } from "../types.js";
import { createGrowthCommunicationsPlatform, createSocialMediaCommandCenterExperience } from "../../experiences/index.js";

export function createSocialMediaCommandCenterPage(): PageModel {
  const experience = createSocialMediaCommandCenterExperience();
  const growth = createGrowthCommunicationsPlatform();
  const connectedCount = experience.outletAdapters.filter((adapter) => adapter.state === "connected").length;

  return {
    pageId: "social-media-command-center",
    kind: "ADMIN",
    title: "Growth & Communications Platform",
    subtitle: "One calm command center for campaigns, content, audiences, messages, calendars, approvals, and truthful growth.",
    seoTitle: "Growth & Communications Platform — Humanity Laws",
    accessibilitySummary: "Admin growth and communications command center",
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
        eyebrow: "Platform",
        title: `${growth.modules.length} growth modules work as one system.`,
        body: "Campaign Orchestrator, Content Studio, Content Library, Automation Builder, Audience Manager, Communication Center, Editorial Calendar, Analytics, Brand Guardian, Adam and Eve, Founder Workspace, Future APIs, and the Master Content Engine stay coordinated.",
      },
      {
        eyebrow: "Master Content Engine",
        title: "Create once. Distribute thoughtfully.",
        body: "One approved seed can prepare a Founder Letter, podcast outline, blog post, YouTube script, short-form script, social posts, newsletter, SMS reminder, Spark connection, Adam and Eve prompts, and a related book theme — all still requiring human approval.",
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
      {
        eyebrow: "Founder Workspace",
        title: "Nick gets one calm place for priorities and approvals.",
        body: growth.founderWorkspace.communicationReminders.join(" · "),
      },
    ],
    emptyState: "No social outlet is live-connected yet. Manual export is available while official APIs, OAuth, approval, and compliance are verified.",
  };
}
