import type { PageModel } from "../types.js";

export function createFounderPage(): PageModel {
  return {
    pageId: "founder",
    kind: "PUBLIC",
    title: "From the Founder",
    subtitle: "Founder updates for stewardship, continuity, gratitude, and honest progress.",
    seoTitle: "Founder — Humanity Laws",
    accessibilitySummary: "Founder page",
    actions: [
      { label: "Latest Update", href: "/founder", kind: "PRIMARY" },
      { label: "Listen", href: "/podcast", kind: "SECONDARY" },
      { label: "Open Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Founder Study", title: "Stewardship, not celebrity.", body: "Founder content should stay truthful, personal, and grounded in service." },
      { eyebrow: "Updates", title: "What members can expect.", body: "Letters, videos, teaching notes, gratitude, and honest progress." },
      { eyebrow: "Podcast", title: "Listen when ready.", body: "Podcast notes and related chapters connect here after review." },
    ],
  };
}
