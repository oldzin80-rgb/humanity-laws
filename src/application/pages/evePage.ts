import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createEvePage(): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const sourceReport = runtime.sourceLedger.report({ kind: "book" });
  return {
    pageId: "eve",
    kind: "MEMBER",
    title: "Meet Eve",
    subtitle: "Warm, loving, present, emotionally intelligent, graceful, and dignified.",
    seoTitle: "Meet Eve — Humanity Laws",
    accessibilitySummary: "Eve AI companion page",
    actions: [{ label: "Open Council", href: "/council", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Transparent companion", title: "Eve is AI, not human.", body: "Eve is designed to support presence, dignity, warmth, and emotionally intelligent reflection while always preserving AI transparency." },
      { eyebrow: "Connected foundation", title: "Eve is using the verified Adam/Eve foundation.", body: `Eve is wired to the same dignity, source, and professional-boundary safeguards used by Council. Verified book sources visible: ${sourceReport.sources.length}.` },
      { eyebrow: "Source ledger", title: "The Humanity Laws source is visible.", body: `Preserved book archive: ${runtime.archiveManifest.source.pageCount} pages. SHA-256: ${runtime.bookRegistry.source.sha256}.` },
      { title: "What Eve protects", body: "Eve protects against shame, coldness, emotional neglect, and forgetting the human being in front of you." },
      { title: "Human judgment remains first", body: "Eve never pretends to be human and never replaces your judgment, relationships, faith, qualified help, or professional care." },
    ],
  };
}
