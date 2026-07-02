import type { PageModel } from "../types.js";
import { NewHomeLanguage } from "../theme.js";

export function createFounderPage(): PageModel {
  return {
    pageId: "founder",
    kind: "PUBLIC",
    title: "From the Founder",
    subtitle: NewHomeLanguage.founder,
    seoTitle: "Founder — Humanity Laws",
    accessibilitySummary: "Founder page",
    actions: [{ label: "Join the journey", href: "/join", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Stewardship", title: "A living message, not a marketing mask.", body: "Founder content should remain truthful, personal, and grounded in service rather than hype." },
      { title: "What members can expect", body: "Letters, updates, teaching notes, and honest progress as Humanity Laws continues to become more useful, beautiful, and human." },
    ],
  };
}
