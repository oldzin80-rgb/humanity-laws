import type { PageModel } from "../types.js";
import { createPodcastExperience } from "../../experiences/index.js";

export function createPodcastPage(): PageModel {
  const experience = createPodcastExperience();
  const episode = experience.featuredEpisode;
  return {
    pageId: "podcast",
    kind: "PUBLIC",
    title: "The Listening Room",
    subtitle: "Listen. Reflect. Discuss. Remember what stays with you.",
    seoTitle: "Podcast — Humanity Laws",
    accessibilitySummary: "Podcast listening room",
    actions: [
      { label: "Discuss with Adam & Eve", href: "/council", kind: "PRIMARY" },
      { label: "Founder Letters", href: "/founder", kind: "SECONDARY" },
      { label: "Start a Spark", href: "/spark", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Featured Episode", title: episode.title, body: episode.theme },
      { eyebrow: "Reflection", title: "Carry one sentence forward.", body: episode.reflectionPrompt },
      { eyebrow: "Founder Voice", title: "The living voice stays accountable.", body: "Founder audio should support the book, not replace it. Episodes connect to Founder Letters after review." },
      { eyebrow: "Current state", title: "Podcast publishing is not live yet.", body: "No episodes are being presented as live. No audience metrics or community activity are being faked." },
      { eyebrow: "Remember", title: "Save what stayed with you.", body: "Adam and Eve can receive Podcast context when you choose to play, save, or discuss an episode." },
    ],
    emptyState: "Podcast publishing is not live yet. Until then, use this room as a calm bridge to Founder Letters, Spark, The Table, and Adam & Eve.",
  };
}
