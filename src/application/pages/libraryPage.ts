import type { PageModel } from "../types.js";
import {
  getHumanityLawsArchiveManifest,
  getHumanityLawsLawIndex,
  getHumanityLawsQuoteLibrary,
} from "../../humanity-laws-source/bookRegistry.js";

export function createLibraryPage(): PageModel {
  const manifest = getHumanityLawsArchiveManifest();
  const lawIndex = getHumanityLawsLawIndex();
  const quoteLibrary = getHumanityLawsQuoteLibrary();
  return {
    pageId: "library",
    kind: "MEMBER",
    title: "Living Library",
    subtitle: "Saved wisdom, reading progress, reflections, and memory in one quiet place.",
    seoTitle: "Living Library — Humanity Laws",
    accessibilitySummary: "Living Library page",
    actions: [
      { label: "Read the Book", href: "/book", kind: "PRIMARY" },
      { label: "Start Spark", href: "/spark", kind: "SECONDARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Personal Library", title: "Preserve what matters.", body: "The Library holds saved Sparks, reflections, chapters, founder notes, podcast bookmarks, Table memories, and wellness notes as each source is verified." },
      { eyebrow: "Book archive", title: "Humanity Laws source ledger", body: `The preserved book archive is available to the Library: ${manifest.source.pageCount} pages, SHA-256 ${manifest.source.sha256}.` },
      { eyebrow: "Law index", title: "Page-referenced law and quote entries", body: `Law entries available: ${lawIndex.laws.length}. Quote entries with page provenance: ${quoteLibrary.quotes.length}.` },
      { title: "Find the next connection", body: "Move from a saved quote to a chapter, from a chapter to Spark, or from Spark to Adam and Eve." },
    ],
    emptyState: "Saved items will appear here after you save Sparks, reflections, chapters, founder updates, and Table memories.",
  };
}
