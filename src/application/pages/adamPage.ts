import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createAdamPage(): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const sourceReport = runtime.sourceLedger.report({ kind: "book" });
  return {
    pageId: "adam",
    kind: "MEMBER",
    title: "Talk with Adam",
    subtitle: "A steady AI companion for truth, responsibility, and clear next steps.",
    seoTitle: "Meet Adam — Humanity Laws",
    accessibilitySummary: "Adam AI companion page",
    actions: [
      { label: "Talk with Adam", href: "/adam", kind: "PRIMARY" },
      { label: "Reflect on today's Spark", href: "/spark", kind: "SECONDARY" },
      { label: "Open Council", href: "/council", kind: "TERTIARY" },
      { label: "Save insight", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Conversation Room", title: "Bring one thing you want to see clearly.", body: "Ask about a decision, pattern, responsibility, or next step. Keep it simple and honest." },
      { eyebrow: "Transparent companion", title: "Adam is AI, not human.", body: "Adam supports reflection. He does not replace your conscience, qualified help, relationships, faith, or human judgment." },
      { eyebrow: "Connected foundation", title: "Adam stays connected to the source.", body: `Adam uses the verified Adam/Eve foundation, source ledger, and professional-boundary safeguards. Verified book sources visible: ${sourceReport.sources.length}.` },
      { eyebrow: "Source ledger", title: "The Humanity Laws source remains visible.", body: `Preserved book archive: ${runtime.archiveManifest.source.pageCount} pages. SHA-256: ${runtime.bookRegistry.source.sha256}.` },
      { title: "Natural next step", body: "Reflect on today's Spark, discuss a chapter, save the insight, or open Council when the question deserves more perspective." },
    ],
  };
}
