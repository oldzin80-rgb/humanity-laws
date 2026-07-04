import type { PageModel } from "../types.js";
import { NewHomeLanguage } from "../theme.js";
import {
  getHumanityLawsArchiveManifest,
  getHumanityLawsLawIndex,
  getHumanityLawsQuoteLibrary,
} from "../../humanity-laws-source/bookRegistry.js";

const cleanIndexTitle = (title: string): string => title.replace(/\s*\.+\s*\d+\s*$/, "").trim();

export function createBookPage(): PageModel {
  const manifest = getHumanityLawsArchiveManifest();
  const lawIndex = getHumanityLawsLawIndex();
  const quoteLibrary = getHumanityLawsQuoteLibrary();
  const firstQuote = quoteLibrary.quotes[0];
  return {
    pageId: "book",
    kind: "MEMBER",
    title: "The Humanity Laws Book",
    subtitle: "The foundation for a calmer, more responsible, more dignified way to live and grow.",
    seoTitle: "The Humanity Laws Book",
    accessibilitySummary: "Book sales page for Humanity Laws",
    actions: [
      { label: "Continue Reading", href: "/library", kind: "PRIMARY" },
      { label: "Discuss with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Create a Spark", href: "/spark", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Study", title: "Read the foundation.", body: NewHomeLanguage.book },
      { eyebrow: "Archived source", title: "The book source is preserved.", body: `Preserved PDF: ${manifest.source.pageCount} pages. SHA-256: ${manifest.source.sha256}.` },
      { eyebrow: "Table of contents", title: "The law index is page-referenced.", body: `Indexed law entries: ${lawIndex.laws.length}. First entry: ${cleanIndexTitle(lawIndex.laws[0]?.title ?? "Unavailable")}.` },
      { eyebrow: "Quote provenance", title: "Quotes trace back to exact pages.", body: firstQuote ? `Quote ${firstQuote.id} traces to page ${firstQuote.page}, line ${firstQuote.line}.` : "No quote entries are available." },
      { title: "Use it today", body: "Choose one chapter, save one line, or bring one question to Adam and Eve." },
      { title: "What membership adds", body: "Membership turns the message into a daily rhythm through Spark, Council, Memory, Founder updates, The Table, and the Living Library." },
      { eyebrow: "Member access", title: "The digital book is included for active monthly members.", body: "Access is controlled by the Supabase memberships record. Stripe payment alone does not unlock the book unless membership status becomes ACTIVE." },
      { eyebrow: "Digital book only", title: "Book-only purchase is separate from membership.", body: "A digital-book-only purchase unlocks the book and does not unlock Dashboard, Spark, Council, Wellness, or the full member room." },
    ],
  };
}
