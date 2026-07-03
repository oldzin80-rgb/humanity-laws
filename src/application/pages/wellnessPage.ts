import type { PageModel } from "../types.js";

export function createWellnessPage(): PageModel {
  return {
    pageId: "wellness",
    kind: "MEMBER",
    title: "Wellness and Human OS.",
    subtitle: "A member space for steady habits, reflection, recovery, gratitude, and human flourishing.",
    seoTitle: "Wellness — Humanity Laws",
    accessibilitySummary: "Active member wellness page",
    actions: [
      { label: "Return to Dashboard", href: "/dashboard", kind: "PRIMARY" },
      { label: "Start Spark", href: "/spark", kind: "SECONDARY" },
    ],
    sections: [
      {
        eyebrow: "Wellness",
        title: "Stewardship, not diagnosis.",
        body: "Wellness supports daily care and reflection. It does not diagnose, prescribe, or replace qualified professional help.",
      },
    ],
  };
}
