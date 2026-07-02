import type { PageModel } from "../types.js";
import { HumanExperienceCopy, NewHomeLanguage } from "../theme.js";

export function createJoinPage(): PageModel {
  return {
    pageId: "join",
    kind: "PUBLIC",
    title: "Join the daily practice.",
    subtitle: NewHomeLanguage.membership,
    seoTitle: "Join Humanity Laws",
    accessibilitySummary: "Membership and pricing page",
    actions: [
      { label: "Join monthly — $7", href: "/checkout/monthly", kind: "PRIMARY" },
      { label: "Join yearly — $70", href: "/checkout/yearly", kind: "SECONDARY" },
    ],
    sections: [
      {
        eyebrow: "Membership",
        title: "A calm place to return every day.",
        body: "Your membership opens the Dashboard, Spark, Adam, Eve, Council, Memory, Founder updates, The Table, and the Living Library as the home continues to grow.",
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
