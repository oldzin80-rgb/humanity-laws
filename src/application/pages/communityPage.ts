import type { PageModel } from "../types.js";

export function createCommunityPage(): PageModel {
  return {
    pageId: "community",
    kind: "MEMBER",
    title: "Community",
    subtitle: "A member room for respectful discussion, encouragement, learning, and service.",
    seoTitle: "Community — Humanity Laws",
    accessibilitySummary: "Community member room",
    actions: [
      { label: "Visit The Table", href: "/table", kind: "PRIMARY" },
      { label: "Open Council", href: "/council", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Community", title: "Connection needs stewardship.", body: "Community should encourage listening, curiosity, kindness, and human dignity. It should not become another engagement feed." },
      { eyebrow: "Current state", title: "Public community features are not live yet.", body: "The safe foundation is The Table, Council, and the Living Library while moderation and support workflows are verified." },
    ],
    emptyState: "Community spaces will open only after moderation, support, and safety paths are verified.",
  };
}
