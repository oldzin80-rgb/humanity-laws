import type { PageModel } from "../types.js";
import { createMergedHumanityLawsRuntime } from "../../runtime/mergedHumanityLaws.js";

export function createCouncilPage(summary = "Adam and Eve are ready to reflect with you."): PageModel {
  const runtime = createMergedHumanityLawsRuntime();
  const highRiskExample = runtime.professionalBoundaries.assess({
    domain: "financial",
    situation: "Large money decision",
    asksToInvestBorrowOrMoveLargeMoney: true,
  });
  return {
    pageId: "council",
    kind: "MEMBER",
    title: "Council",
    subtitle: "A calm room for decisions, tension, and deeper reflection.",
    seoTitle: "Humanity Laws Council",
    accessibilitySummary: "Council conversation page with transparent AI companions",
    actions: [
      { label: "Open Council", href: "/council", kind: "PRIMARY" },
      { label: "Bring in Adam", href: "/adam", kind: "SECONDARY" },
      { label: "Bring in Eve", href: "/eve", kind: "TERTIARY" },
      { label: "Save outcome", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Council Chamber", title: "Use Council for what deserves care.", body: "Bring one decision, tension, relationship question, or pattern that needs more than a quick answer." },
      { eyebrow: "Flow", title: "Adam. Eve. Principle. Human choice.", body: "Adam clarifies responsibility. Eve clarifies dignity. Humanity Laws keeps the principle visible. You make the final decision." },
      { eyebrow: "Start", title: "Bring one decision or question.", body: summary },
      { eyebrow: "Human sovereignty", title: "The human remains first.", body: "Adam and Eve are AI companions. They can support reflection, but they do not replace your conscience, judgment, relationships, faith, professional care, or final authority." },
      { eyebrow: "Professional boundary", title: "High-risk questions require qualified help.", body: `Medical, legal, financial, mental-health, emergency, and child/vulnerable-adult issues are routed through safety boundaries before response. Example route: ${highRiskExample.domain}/${highRiskExample.riskLevel}/${highRiskExample.responsePosture}.` },
      { eyebrow: "Source ledger", title: "Review the Humanity Laws principle.", body: `Humanity Laws book source: ${runtime.archiveManifest.source.pageCount} pages, SHA-256 ${runtime.bookRegistry.source.sha256}.` },
    ],
  };
}
