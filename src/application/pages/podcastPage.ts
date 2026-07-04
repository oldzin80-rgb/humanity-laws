import type { PageModel } from "../types.js";

export function createPodcastPage(): PageModel {
  return {
    pageId: "podcast",
    kind: "PUBLIC",
    title: "Podcast",
    subtitle: "A listening room for Humanity Laws conversations, founder updates, and related reflections.",
    seoTitle: "Podcast — Humanity Laws",
    accessibilitySummary: "Podcast listening room",
    actions: [
      { label: "Listen", href: "/podcast", kind: "PRIMARY" },
      { label: "Open Library", href: "/library", kind: "SECONDARY" },
      { label: "Read the Book", href: "/book", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Listening Room", title: "Listen, reflect, continue.", body: "Podcast episodes should connect to related Sparks, book chapters, founder notes, and saved Library items." },
      { eyebrow: "Current state", title: "Podcast publishing is not live yet.", body: "This room is ready for verified episodes. Until then, members can use Founder updates and the Living Library." },
    ],
    emptyState: "Episodes will appear here after they are reviewed, published, and connected to the Library.",
  };
}
