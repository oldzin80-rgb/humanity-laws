import type { PageModel } from "../types.js";

export function createTablePage(): PageModel {
  return {
    pageId: "table",
    kind: "MEMBER",
    title: "The Table",
    subtitle: "A dining room for gratitude, hospitality, recipes, and meaningful conversation.",
    seoTitle: "The Table — Humanity Laws",
    accessibilitySummary: "The Table member page",
    actions: [
      { label: "Save to Library", href: "/library", kind: "PRIMARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Hospitality", title: "Begin with gratitude.", body: "Use The Table for simple prompts, family recipes, seasonal meals, and conversations that help people feel welcomed." },
      { eyebrow: "Connection", title: "Not another feed.", body: "The Table should encourage meaningful interaction and never become a place for endless consumption." },
      { eyebrow: "Next", title: "Carry the moment forward.", body: "Save a memory to the Living Library or bring a relationship question to Adam and Eve." },
    ],
  };
}
