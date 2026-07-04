import type { PageModel } from "../types.js";
import { HumanExperienceCopy, NewHomeLanguage } from "../theme.js";

export function createHomePage(): PageModel {
  return {
    pageId: "home",
    kind: "PUBLIC",
    title: "A more human way to return to yourself.",
    subtitle: NewHomeLanguage.welcome,
    seoTitle: "Humanity Laws — A beautiful home for daily human growth",
    accessibilitySummary: "Public homepage introducing the new Humanity Laws home",
    actions: [
      { label: "Join for $7/month", href: "/join", kind: "PRIMARY", ariaLabel: "Join Humanity Laws for seven dollars per month" },
      { label: "Read the Book", href: "/book", kind: "SECONDARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Front Door",
        title: "A calm home for daily growth.",
        body: "Humanity Laws gives members one place to read, reflect, talk with Adam and Eve, save what matters, and return to a better rhythm.",
      },
      {
        eyebrow: "Book",
        title: "Start with the foundation.",
        body: NewHomeLanguage.book,
        bullets: [
          "Read the principles.",
          "Use Spark for one focused reflection.",
          "Use Council for deeper perspective while you remain in charge.",
        ],
      },
      {
        eyebrow: "Adam & Eve",
        title: "AI companions with clear boundaries.",
        body: HumanExperienceCopy.aiTransparency,
        bullets: [
          "Adam brings grounded responsibility and truth.",
          "Eve brings warmth, dignity, and presence.",
          "Council combines both perspectives into a gentle synthesis.",
        ],
      },
      {
        eyebrow: "Membership",
        title: "Simple access. No manipulation.",
        body: HumanExperienceCopy.membershipPromise,
      },
      {
        eyebrow: "The Table",
        title: "A room for gratitude and connection.",
        body: "The Table connects recipes, reflection, hospitality, and meaningful conversation without becoming another feed.",
      },
      {
        eyebrow: "Founder",
        title: "Follow the stewardship.",
        body: "Founder updates keep the mission transparent, grounded, and accountable as the house grows.",
      },
    ],
  };
}
