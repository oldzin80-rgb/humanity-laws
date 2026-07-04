import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createEvePage(): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const sourceReport = runtime.sourceLedger.report({ kind: "book" });
  return {
    pageId: "eve",
    kind: "MEMBER",
    title: "Talk with Eve",
    subtitle: "A warm AI companion for presence, dignity, and reflection.",
    seoTitle: "Meet Eve — Humanity Laws",
    accessibilitySummary: "Eve AI companion page",
    actions: [
      { label: "Talk with Eve", href: "/eve", kind: "PRIMARY" },
      { label: "Reflect on today's Spark", href: "/spark", kind: "SECONDARY" },
      { label: "Open Council", href: "/council", kind: "TERTIARY" },
      { label: "Save insight", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Conversation Room", title: "Bring one moment that needs care.", body: "Ask about a feeling, relationship, repair, gratitude, or next step. Keep the conversation honest and human." },
      { eyebrow: "Transparent companion", title: "Eve is AI, not human.", body: "Eve supports reflection. She does not replace your conscience, qualified help, relationships, faith, or human judgment." },
      { eyebrow: "Connected foundation", title: "Eve stays connected to the source.", body: `Eve uses the verified companion foundation, source ledger, and professional-boundary safeguards. Verified book sources visible: ${sourceReport.sources.length}.` },
      { eyebrow: "Source ledger", title: "The Humanity Laws source remains visible.", body: `Preserved book archive: ${runtime.archiveManifest.source.pageCount} pages. SHA-256: ${runtime.bookRegistry.source.sha256}.` },
      { title: "Natural next step", body: "Reflect on Spark, discuss a chapter, save the insight, or open Council when the question deserves more perspective." },
    ],
  };
}
