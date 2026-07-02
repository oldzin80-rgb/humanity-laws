import type { ReleaseReadinessReport } from "../../core/index.js";
import type { PageModel } from "../types.js";

export function createLaunchStatusPage(report: ReleaseReadinessReport): PageModel {
  return {
    pageId: "launch-status",
    kind: "LAUNCH",
    title: report.launchReady ? "Launch Ready" : "Launch Not Ready Yet",
    subtitle: "Readiness is derived from objective evidence only. No status is manually advanced.",
    seoTitle: "Launch Status — Humanity Laws",
    accessibilitySummary: "Evidence-derived launch status page",
    actions: [{ label: "Review evidence", href: "/admin", kind: "SECONDARY" }],
    sections: [
      { eyebrow: "Readiness", title: "Evidence decides.", body: `Launch ready: ${report.launchReady}.` },
      { eyebrow: "Blockers", title: report.blockers.length ? "Remaining blockers" : "No blockers", body: report.blockers.length ? report.blockers.join(" ") : "No blockers." },
      { title: "Trust rule", body: "Humanity Laws does not claim release readiness until repository inspection, runtime integration, build, test, smoke, manual review, release approval, and deployment evidence support it." },
    ],
  };
}
