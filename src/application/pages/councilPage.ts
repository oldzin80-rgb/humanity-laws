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
    subtitle: "Use Council when something deserves deeper perspective.",
    seoTitle: "Humanity Laws Council",
    accessibilitySummary: "Council conversation page with transparent AI companions",
    actions: [
      { label: "Start Council", href: "/council", kind: "PRIMARY" },
      { label: "Meet Adam", href: "/adam", kind: "SECONDARY" },
      { label: "Meet Eve", href: "/eve", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Human sovereignty", title: "The human remains first.", body: "Adam and Eve are AI companions. They can support reflection, but they do not replace your conscience, judgment, relationships, faith, or professional care." },
      { eyebrow: "Start", title: "Bring one decision or question.", body: summary },
      { eyebrow: "Professional boundary", title: "High-risk questions require qualified help.", body: `Medical, legal, financial, mental-health, emergency, and child/vulnerable-adult issues are routed through safety boundaries before response. Example route: ${highRiskExample.domain}/${highRiskExample.riskLevel}/${highRiskExample.responsePosture}.` },
      { eyebrow: "Source ledger", title: "Council shows where its foundation comes from.", body: `Humanity Laws book source: ${runtime.archiveManifest.source.pageCount} pages, SHA-256 ${runtime.bookRegistry.source.sha256}.` },
      { title: "How Council works", body: "Adam clarifies responsibility. Eve clarifies dignity. Humanity Laws keeps the source visible. You make the final decision." },
    ],
  };
}
