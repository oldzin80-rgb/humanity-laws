import type { PageModel } from "../types.js";

type CheckoutPageKind = "monthly" | "yearly" | "book" | "book-only" | "success" | "cancel";

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
    title: "Buy the digital book and try membership.",
    subtitle: "$7 today for the digital book, including 30 days of membership. Then $7/month unless you cancel before the trial ends.",
    seoTitle: "Digital Book + Membership Trial — Humanity Laws",
    accessibilitySummary: "Digital book and membership trial checkout start page",
  },
  "book-only": {
    title: "Buy digital book access only.",
    subtitle: "$7 once. No membership trial and no recurring charge.",
    seoTitle: "Digital Book Only Checkout — Humanity Laws",
    accessibilitySummary: "Digital book only checkout start page",
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
  const isStart = kind === "monthly" || kind === "yearly" || kind === "book" || kind === "book-only";
  const action = isSuccess
    ? { label: "Open Dashboard", href: "/dashboard", kind: "PRIMARY" as const }
    : isCancel
      ? { label: "Return to Membership", href: "/membership", kind: "PRIMARY" as const }
      : kind === "book"
        ? { label: "Agree — $7 now, then $7/month after 30 days", href: `#${kind}`, kind: "PRIMARY" as const }
        : { label: "Continue to Stripe", href: `#${kind}`, kind: "PRIMARY" as const };

  return {
    pageId: `checkout-${kind}`,
    kind: isCancel ? "PUBLIC" : "MEMBER",
    title: copy.title,
    subtitle: copy.subtitle,
    seoTitle: copy.seoTitle,
    accessibilitySummary: copy.accessibilitySummary,
    actions: kind === "book" ? [action, { label: "Book only — no recurring charge", href: "/checkout/book-only", kind: "SECONDARY" as const }] : [action],
    sections: [
      {
        eyebrow: "Membership",
        title: isSuccess
          ? "Your member room is ready after verification."
          : isCancel
            ? "No membership change was made."
            : kind === "book"
              ? "One clear purchase. One optional continuing path."
            : kind === "book-only"
              ? "Digital book access only."
            : "Value-for-value only.",
        body: isSuccess
          ? "Stripe session_id is required before membership can be unlocked. This protects members from false success states."
          : isCancel
            ? "No membership change was made. You can return when ready."
            : kind === "book"
              ? "You pay $7 today for permanent digital book access and receive 30 days of full membership. Unless you cancel before the trial ends, Stripe will charge $7 each month until canceled. Choose the book-only option if you do not want recurring membership."
            : kind === "book-only"
              ? "You pay $7 once for permanent digital book access. This option has no free trial and no recurring membership charge."
            : "Stripe handles payment. Humanity Laws keeps the membership promise simple: no ads, no donations, cancel anytime.",
        bullets: isStart
          ? [
              "Payment must be verified before membership unlocks.",
              "No fake payment success.",
              kind === "book"
                ? "By continuing, you expressly choose the 30-day membership trial and recurring $7 monthly billing after the trial."
                : kind === "book-only"
                  ? "Digital book access is separate from full membership."
                  : "Monthly membership includes digital book access.",
              kind === "book" ? "Cancel before the trial ends to avoid the first monthly membership charge." : "Cancel membership anytime.",
              "Checkout returns through Stripe success or cancel routes.",
            ]
          : undefined,
      },
    ],
  };
}
