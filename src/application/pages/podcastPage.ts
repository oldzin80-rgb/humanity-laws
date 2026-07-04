import type { PageModel } from "../types.js";

export function createPodcastPage(): PageModel {
  return {
    pageId: "podcast",
    kind: "PUBLIC",
    title: "Podcast",
    subtitle: "A listening room for reviewed conversations, founder updates, and reflections.",
    seoTitle: "Podcast — Humanity Laws",
    accessibilitySummary: "Podcast listening room",
    actions: [
      { label: "Latest Episodes", href: "/podcast", kind: "PRIMARY" },
      { label: "Founder", href: "/founder", kind: "SECONDARY" },
      { label: "Open Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Listening Room", title: "Listen, reflect, continue.", body: "Episodes will connect to Sparks, chapters, founder notes, and Library items after review." },
      { eyebrow: "Current state", title: "Podcast publishing is not live yet.", body: "No episodes are being presented as live. Use Founder updates and the Library for now." },
    ],
    emptyState: "Episodes will appear here after they are reviewed, published, and connected to the Library.",
  };
}
