import type { PageModel } from "../types.js";

export function createTablePage(): PageModel {
  return {
    pageId: "table",
    kind: "MEMBER",
    title: "The Table",
    subtitle: "A future room for shared humanity, thoughtful updates, and carefully protected community.",
    seoTitle: "The Table — Humanity Laws",
    accessibilitySummary: "The Table member page",
    actions: [{ label: "Return to Dashboard", href: "/dashboard", kind: "SECONDARY" }],
    sections: [
      { eyebrow: "Coming online carefully", title: "Community deserves stewardship.", body: "The Table is prepared as a member space. Community features should launch only when moderation, dignity, and safety are ready." },
      { title: "The standard", body: "When The Table opens, it should feel like a calm room where people are treated as human beings, not as engagement metrics." },
    ],
  };
}
