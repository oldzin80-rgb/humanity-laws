import type { EvidenceBundle } from "./verification.js";
import { deriveExecutionStatusFromEvidence } from "./executionStatus.js";
import { createReleaseReadinessReport } from "./releaseReadiness.js";

export function generateEvidenceMarkdownReport(bundle: EvidenceBundle): string {
  const status = deriveExecutionStatusFromEvidence(bundle);
  const release = createReleaseReadinessReport(bundle);
  return [
    "# Humanity Laws Evidence Report",
    "",
    `Generated At: ${new Date().toISOString()}`,
    `Workspace Root: ${bundle.workspaceRoot}`,
    "",
    "## Execution Status",
    `Repository Inspection: ${status.repositoryInspection}`,
    `Runtime Integration: ${status.runtimeIntegration}`,
    `Build: ${status.build}`,
    `Tests: ${status.tests}`,
    `Smoke: ${status.smoke}`,
    `Manual Review: ${status.manualReview}`,
    `Release Approval: ${status.releaseApproval}`,
    `Deployment: ${status.deployment}`,
    "",
    "## Release Readiness",
    `Launch Ready: ${release.launchReady}`,
    "",
    "## Blockers",
    release.blockers.length === 0 ? "No blockers." : release.blockers.map((b) => `- ${b}`).join("\n"),
    "",
    "Evidence before launch. No false claims.",
  ].join("\n");
}
