import type { PageModel } from "../types.js";

export function createHardcoverPage(): PageModel {
  return {
    pageId: "hardcover",
    kind: "PUBLIC",
    title: "Hardcover edition is coming soon.",
    subtitle: "Humanity Laws will not pretend to fulfill hardcover orders until real print-on-demand fulfillment is connected.",
    seoTitle: "Hardcover Coming Soon — Humanity Laws",
    accessibilitySummary: "Hardcover book fulfillment placeholder",
    actions: [
      { label: "Join Monthly", href: "/checkout/monthly", kind: "PRIMARY" },
      { label: "Digital Book Only", href: "/checkout/book", kind: "SECONDARY" },
    ],
    sections: [
      {
        eyebrow: "Hardcover",
        title: "No fake fulfillment.",
        body: "A real hardcover path requires a print-on-demand provider such as Lulu or another fulfillment partner, product IDs, shipping rates, tax handling, order webhooks, support policy, and refund/return handling.",
      },
    ],
  };
}
