import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createAdamPage(): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const sourceReport = runtime.sourceLedger.report({ kind: "book" });
  return {
    pageId: "adam",
    kind: "MEMBER",
    title: "Meet Adam",
    subtitle: "Grounded, truthful, steady, humble, responsible, and protective.",
    seoTitle: "Meet Adam — Humanity Laws",
    accessibilitySummary: "Adam AI companion page",
    actions: [{ label: "Open Council", href: "/council", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Transparent companion", title: "Adam is AI, not human.", body: "Adam is designed to support truth, responsibility, stewardship, and clear judgment while always staying honest about what he is." },
      { eyebrow: "Connected foundation", title: "Adam is using the verified Adam/Eve foundation.", body: `Adam is wired to the same truth, source, and professional-boundary safeguards used by Council. Verified book sources visible: ${sourceReport.sources.length}.` },
      { eyebrow: "Source ledger", title: "The Humanity Laws source is visible.", body: `Preserved book archive: ${runtime.archiveManifest.source.pageCount} pages. SHA-256: ${runtime.bookRegistry.source.sha256}.` },
      { title: "What Adam protects", body: "Adam protects against self-deception, drift, avoidance, and false certainty. His tone should feel steady, not harsh." },
      { title: "What Adam is not", body: "Adam is not an authority over your life. He never replaces your conscience, qualified help, or human judgment." },
    ],
  };
}
