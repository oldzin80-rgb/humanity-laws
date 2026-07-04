import type { PageModel } from "../types.js";

export function createWellnessPage(): PageModel {
  return {
    pageId: "wellness",
    kind: "MEMBER",
    title: "Wellness",
    subtitle: "A calm garden for one small practice today.",
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
        body: "Wellness supports daily care and reflection. It does not diagnose, prescribe, or replace qualified help.",
      },
      {
        eyebrow: "Today",
        title: "Choose one small practice.",
        body: "Begin with breath, movement, hydration, gratitude, rest, or one short reflection.",
      },
    ],
  };
}
