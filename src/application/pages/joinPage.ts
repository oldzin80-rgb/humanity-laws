import type { PageModel } from "../types.js";
import { HumanExperienceCopy, NewHomeLanguage } from "../theme.js";

export function createJoinPage(): PageModel {
  return {
    pageId: "join",
    kind: "PUBLIC",
    title: "Join Humanity Laws.",
    subtitle: NewHomeLanguage.membership,
    seoTitle: "Join Humanity Laws",
    accessibilitySummary: "Membership and pricing page",
    actions: [
      { label: "Join monthly — $7", href: "/checkout/monthly", kind: "PRIMARY" },
      { label: "Digital book only", href: "/checkout/book", kind: "SECONDARY" },
      { label: "Hardcover coming soon", href: "/book/hardcover", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Membership",
        title: "A calm place to return every day.",
        body: "Monthly membership is $7/month and includes digital book access, Dashboard, Spark, Adam, Eve, Council, Founder updates, The Table, Wellness, and the Living Library. The $70/year option remains available for members who prefer it.",
      },
      {
        eyebrow: "Commerce",
        title: "Three clear paths. No confusion.",
        body: "Choose monthly membership for the full house, digital book only for reading access, or hardcover to see the honest fulfillment placeholder. Hardcover orders are not accepted until print-on-demand plumbing is verified.",
        bullets: ["Monthly membership includes the digital book.", "Digital book purchase unlocks book access only.", "Hardcover remains separate and coming soon.", "No donations. No advertising."],
      },
      {
        eyebrow: "Trust",
        title: "Simple because trust should be simple.",
        body: HumanExperienceCopy.membershipPromise,
        bullets: ["No ads.", "No donations.", "Cancel anytime.", "Value-for-value only."],
      },
    ],
  };
}

export const createPricingPage = createJoinPage;
