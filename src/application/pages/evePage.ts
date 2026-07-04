import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createEvePage(): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const sourceReport = runtime.sourceLedger.report({ kind: "book" });
  return {
    pageId: "eve",
    kind: "MEMBER",
    title: "Meet Eve",
    subtitle: "A warm AI companion for presence, dignity, and reflection.",
    seoTitle: "Meet Eve — Humanity Laws",
    accessibilitySummary: "Eve AI companion page",
    actions: [
      { label: "Open Council", href: "/council", kind: "PRIMARY" },
      { label: "Visit The Table", href: "/table", kind: "SECONDARY" },
      { label: "Save to Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Transparent companion", title: "Eve is AI, not human.", body: "Eve is designed to support presence, dignity, warmth, and emotionally intelligent reflection while always preserving AI transparency." },
      { eyebrow: "Connected foundation", title: "Eve is using the verified Adam/Eve foundation.", body: `Eve is wired to the same dignity, source, and professional-boundary safeguards used by Council. Verified book sources visible: ${sourceReport.sources.length}.` },
      { eyebrow: "Source ledger", title: "The Humanity Laws source is visible.", body: `Preserved book archive: ${runtime.archiveManifest.source.pageCount} pages. SHA-256: ${runtime.bookRegistry.source.sha256}.` },
      { title: "How to use Eve", body: "Bring a feeling, relationship question, or moment that needs care. Eve helps you slow down and remember dignity." },
      { title: "Human judgment remains first", body: "Eve never pretends to be human and never replaces your judgment, relationships, faith, qualified help, or professional care." },
    ],
  };
}
