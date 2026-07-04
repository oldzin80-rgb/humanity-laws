import type { PageModel } from "../types.js";

export function createCommunityPage(): PageModel {
  return {
    pageId: "community",
    kind: "MEMBER",
    title: "Community",
    subtitle: "A future room for respectful discussion, encouragement, learning, and service.",
    seoTitle: "Community — Humanity Laws",
    accessibilitySummary: "Community member room",
    actions: [
      { label: "Visit The Table", href: "/table", kind: "PRIMARY" },
      { label: "Open Council", href: "/council", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Community", title: "Connection needs stewardship.", body: "Community should encourage listening, curiosity, kindness, and human dignity — not engagement loops." },
      { eyebrow: "Current state", title: "Community features are not live yet.", body: "No public feed or activity is being faked. The Table, Council, and Library are the safe foundation while moderation is verified." },
    ],
    emptyState: "Community spaces will open only after moderation, support, and safety paths are verified.",
  };
}
