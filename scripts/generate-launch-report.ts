import fs from "node:fs";
import { readBundle } from "./evidence-utils.js";
import { createReleaseReadinessReport, deriveExecutionStatusFromEvidence, determineSupportedImplementationStatus } from "../src/core/index.js";
const bundle = readBundle();
const readiness = createReleaseReadinessReport(bundle);
const status = deriveExecutionStatusFromEvidence(bundle);
const supported = determineSupportedImplementationStatus(bundle);
const markdown = [
  "# Humanity Laws Launch Report", "", `Generated At: ${new Date().toISOString()}`, "", `Launch Ready: ${readiness.launchReady}`, `Supported Implementation Status: ${supported.status}`, "", "## Execution Status", "", `Repository: ${status.repositoryInspection}`, `Runtime: ${status.runtimeIntegration}`, `Build: ${status.build}`, `Tests: ${status.tests}`, `Smoke: ${status.smoke}`, `Manual Review: ${status.manualReview}`, `Release Approval: ${status.releaseApproval}`, `Deployment: ${status.deployment}`, "", "## Blockers", readiness.blockers.length ? readiness.blockers.map((b) => `- ${b}`).join("\n") : "No blockers.", "", "Release readiness is evidence-derived only."
].join("\n");
fs.mkdirSync("logs", { recursive: true });
fs.writeFileSync("logs/launch-report.md", markdown);
console.log(markdown);
