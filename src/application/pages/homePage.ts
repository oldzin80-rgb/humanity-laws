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
      { label: "Meet Adam and Eve", href: "/council", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "A new home",
        title: "Peaceful by design. Practical by purpose.",
        body:
          "Humanity Laws is a premium member home for reflection, responsibility, dignity, and daily return. It is intentionally quiet, clear, and built to help people feel more human when they leave than when they arrived.",
      },
      {
        eyebrow: "The path",
        title: "Read the foundation. Practice it daily.",
        body: NewHomeLanguage.book,
        bullets: [
          "The book introduces the standard.",
          "Spark gives you one focused reflection.",
          "Council helps you think with Adam and Eve while keeping you in charge.",
        ],
      },
      {
        eyebrow: "Transparent companions",
        title: "Adam and Eve support reflection without pretending to be human.",
        body: HumanExperienceCopy.aiTransparency,
        bullets: [
          "Adam brings grounded responsibility and truth.",
          "Eve brings warmth, dignity, and presence.",
          "Council combines both perspectives into a gentle synthesis.",
        ],
      },
      {
        eyebrow: "Simple membership",
        title: "Value-for-value. No manipulation.",
        body: HumanExperienceCopy.membershipPromise,
      },
    ],
  };
}
