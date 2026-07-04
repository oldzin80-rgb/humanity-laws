import type { PageModel } from "../types.js";
import { HumanExperienceCopy, NewHomeLanguage } from "../theme.js";

export function createHomePage(): PageModel {
  return {
    pageId: "home",
    kind: "PUBLIC",
    title: "A calm home for daily human growth.",
    subtitle: "Read the Book. Practice one Spark. Talk with Adam and Eve. Save what matters.",
    seoTitle: "Humanity Laws — A beautiful home for daily human growth",
    accessibilitySummary: "Public homepage introducing the new Humanity Laws home",
    actions: [
      { label: "Join for $7/month", href: "/join", kind: "PRIMARY", ariaLabel: "Join Humanity Laws for seven dollars per month" },
      { label: "Read the Book", href: "/book", kind: "SECONDARY" },
      { label: "Start Spark", href: "/spark", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Front Door",
        title: "Know where you are.",
        body: "Humanity Laws is one connected home for reading, reflection, companionship, hospitality, wellness, and memory.",
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
        eyebrow: "Daily practice",
        title: "Start small. Continue naturally.",
        body: "Spark gives one reflection. Council helps when a question needs more care. The Library keeps what matters close.",
        bullets: [
          "Start Spark.",
          "Talk with Adam and Eve.",
          "Save the insight to the Library.",
        ],
      },
      {
        eyebrow: "Adam & Eve",
        title: "AI companions, not authorities.",
        body: HumanExperienceCopy.aiTransparency,
        bullets: [
          "Adam brings grounded responsibility and truth.",
          "Eve brings warmth, dignity, and presence.",
          "You remain the final decision-maker.",
        ],
      },
      {
        eyebrow: "The Table",
        title: "Connection belongs here too.",
        body: "The Table brings gratitude, hospitality, recipes, and conversation without becoming another feed.",
      },
      {
        eyebrow: "Membership",
        title: "Simple access. No manipulation.",
        body: HumanExperienceCopy.membershipPromise,
      },
    ],
  };
}
