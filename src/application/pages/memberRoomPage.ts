import type { PageModel } from "../types.js";

export function createMemberRoomPage(): PageModel {
  return {
    pageId: "member-room",
    kind: "MEMBER",
    title: "Member Room",
    subtitle: "A quiet access room for the Book, Spark, Council, and the daily practice.",
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
        body: "This room opens only after the membership record is ACTIVE. Stripe payment alone is not enough without verified membership status.",
      },
    ],
  };
}
