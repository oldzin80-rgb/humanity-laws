import type { PageModel } from "../types.js";

export function createMemberRoomPage(): PageModel {
  return {
    pageId: "member-room",
    kind: "MEMBER",
    title: "Your member room.",
    subtitle: "A quiet place for active members to return to the book, Spark, Council, and the daily practice.",
    seoTitle: "Member Room — Humanity Laws",
    accessibilitySummary: "Active member room",
    actions: [
      { label: "Open Dashboard", href: "/dashboard", kind: "PRIMARY" },
      { label: "Read the Book", href: "/book", kind: "SECONDARY" },
    ],
    sections: [
      {
        eyebrow: "Membership",
        title: "Access follows verified membership.",
        body: "This room opens only after the membership record is ACTIVE. Stripe payment alone is not enough unless the webhook or session verification updates membership status.",
      },
    ],
  };
}
