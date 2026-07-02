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
    subtitle: "A quiet shelf for founder letters, book excerpts, Sparks, and Humanity Laws teachings.",
    seoTitle: "Living Library — Humanity Laws",
    accessibilitySummary: "Living Library page",
    actions: [
      { label: "Read the Book", href: "/book", kind: "PRIMARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "SECONDARY" },
    ],
    sections: [
      { eyebrow: "Library", title: "Start with the foundation. Grow with care.", body: "The Library begins with the book and grows through member practice, founder updates, and carefully reviewed resources." },
      { eyebrow: "Book archive", title: "Humanity Laws source ledger", body: `The preserved book archive is available to the Library: ${manifest.source.pageCount} pages, SHA-256 ${manifest.source.sha256}.` },
      { eyebrow: "Law index", title: "Page-referenced law and quote entries", body: `Law entries available: ${lawIndex.laws.length}. Quote entries with page provenance: ${quoteLibrary.quotes.length}.` },
      { title: "No content for content's sake", body: "The Library should remain intentional. Every addition should help members return to truth, dignity, responsibility, and human growth." },
    ],
  };
}
