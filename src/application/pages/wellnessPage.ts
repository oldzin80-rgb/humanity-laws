import type { PageModel } from "../types.js";

export function createWellnessPage(): PageModel {
  return {
    pageId: "wellness",
    kind: "MEMBER",
    title: "Wellness and Human OS.",
    subtitle: "A garden for steady habits, recovery, gratitude, and daily care.",
    seoTitle: "Wellness — Humanity Laws",
    accessibilitySummary: "Active member wellness page",
    actions: [
      { label: "Start Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Save to Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Wellness",
        title: "Stewardship, not diagnosis.",
        body: "Wellness supports daily care and reflection. It does not diagnose, prescribe, or replace qualified professional help.",
      },
      {
        eyebrow: "Today",
        title: "Choose one small practice.",
        body: "Begin with breath, movement, hydration, gratitude, rest, or a short reflection. Keep it simple enough to repeat.",
      },
    ],
  };
}
