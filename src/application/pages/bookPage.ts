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
      { label: "Return to Dashboard", href: "/dashboard", kind: "PRIMARY" },
      { label: "Join the Practice", href: "/join", kind: "SECONDARY" },
    ],
    sections: [
      { eyebrow: "Foundation", title: "Start with the words. Return through the practice.", body: NewHomeLanguage.book },
      { eyebrow: "Archived source", title: "The book source is preserved.", body: `Preserved PDF: ${manifest.source.pageCount} pages. SHA-256: ${manifest.source.sha256}.` },
      { eyebrow: "Table of contents", title: "The law index is page-referenced.", body: `Indexed law entries: ${lawIndex.laws.length}. First entry: ${cleanIndexTitle(lawIndex.laws[0]?.title ?? "Unavailable")}.` },
      { eyebrow: "Quote provenance", title: "Quotes trace back to exact pages.", body: firstQuote ? `Quote ${firstQuote.id} traces to page ${firstQuote.page}, line ${firstQuote.line}.` : "No quote entries are available." },
      { title: "Why it exists", body: "The book gives language to what people already know deep down: truth matters, responsibility matters, dignity matters, and humanity must remain the standard." },
      { title: "What membership adds", body: "Membership turns the message into a daily rhythm through Spark, Council, Memory, Founder updates, and a growing Living Library." },
      { eyebrow: "Member access", title: "The digital book is included for active monthly members.", body: "Access is controlled by the Supabase memberships record. Stripe payment alone does not unlock the book unless membership status becomes ACTIVE." },
    ],
  };
}
