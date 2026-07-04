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
    actions: [
      { label: "Join", href: "/join", kind: "PRIMARY" },
      { label: "Open Library", href: "/library", kind: "SECONDARY" },
      { label: "Return Home", href: "/", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Founder Study", title: "Stewardship, not celebrity.", body: "Founder content should remain truthful, personal, and grounded in service rather than hype." },
      { eyebrow: "Updates", title: "What members can expect", body: "Letters, videos, teaching notes, and honest progress as Humanity Laws becomes more useful, beautiful, and human." },
      { eyebrow: "Podcast", title: "Listening room foundation", body: "Podcast notes and related chapters can live here until a dedicated podcast room is ready." },
    ],
  };
}
