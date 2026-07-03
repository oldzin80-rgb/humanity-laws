import type { PageModel } from "../types.js";

type CheckoutPageKind = "monthly" | "yearly" | "book" | "success" | "cancel";

const checkoutCopy: Record<CheckoutPageKind, Pick<PageModel, "title" | "subtitle" | "seoTitle" | "accessibilitySummary">> = {
  monthly: {
    title: "Start monthly membership.",
    subtitle: "Continue to Stripe for the $7 monthly Humanity Laws membership.",
    seoTitle: "Monthly Checkout — Humanity Laws",
    accessibilitySummary: "Monthly checkout start page",
  },
  yearly: {
    title: "Start yearly membership.",
    subtitle: "Continue to Stripe for the $70 yearly Humanity Laws membership.",
    seoTitle: "Yearly Checkout — Humanity Laws",
    accessibilitySummary: "Yearly checkout start page",
  },
  book: {
    title: "Buy digital book access.",
    subtitle: "Continue to Stripe for digital Humanity Laws book access only.",
    seoTitle: "Digital Book Checkout — Humanity Laws",
    accessibilitySummary: "Digital book checkout start page",
  },
  success: {
    title: "Membership unlocked.",
    subtitle: "Your payment return was received. Continue to the member dashboard.",
    seoTitle: "Checkout Success — Humanity Laws",
    accessibilitySummary: "Checkout success page",
  },
  cancel: {
    title: "Checkout canceled.",
    subtitle: "No membership change was made. You can return to membership when ready.",
    seoTitle: "Checkout Canceled — Humanity Laws",
    accessibilitySummary: "Checkout cancel page",
  },
};

export function createCheckoutPage(kind: CheckoutPageKind): PageModel {
  const copy = checkoutCopy[kind];
  const isSuccess = kind === "success";
  const isCancel = kind === "cancel";
  const isStart = kind === "monthly" || kind === "yearly" || kind === "book";
  const action = isSuccess
    ? { label: "Open Dashboard", href: "/dashboard", kind: "PRIMARY" as const }
    : isCancel
      ? { label: "Return to Membership", href: "/membership", kind: "PRIMARY" as const }
      : { label: "Continue to Stripe", href: `#${kind}`, kind: "PRIMARY" as const };

  return {
    pageId: `checkout-${kind}`,
    kind: isCancel ? "PUBLIC" : "MEMBER",
    title: copy.title,
    subtitle: copy.subtitle,
    seoTitle: copy.seoTitle,
    accessibilitySummary: copy.accessibilitySummary,
    actions: [action],
    sections: [
      {
        eyebrow: "Membership",
        title: isSuccess
          ? "Your member room is ready after verification."
          : isCancel
            ? "No membership change was made."
            : kind === "book"
              ? "Digital book access only."
            : "Value-for-value only.",
        body: isSuccess
          ? "Stripe session_id is required before membership can be unlocked. This protects members from false success states."
          : isCancel
            ? "No membership change was made. You can return when ready."
            : kind === "book"
              ? "Digital book purchase unlocks the book only. It does not unlock Dashboard, Spark, Council, Wellness, or the full member room."
            : "Stripe handles payment. Humanity Laws keeps the membership promise simple: no ads, no donations, cancel anytime.",
        bullets: isStart
          ? [
              "Payment must be verified before membership unlocks.",
              "No fake payment success.",
              kind === "book" ? "Digital book access is separate from full membership." : "Monthly membership includes digital book access.",
              "Checkout returns through Stripe success or cancel routes.",
            ]
          : undefined,
      },
    ],
  };
}
