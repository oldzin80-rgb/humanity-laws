import test from "node:test";
import assert from "node:assert/strict";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

test("Launch gate blocks without complete required evidence", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);
  assert.equal(report.launchReady, false);
  assert.ok(report.missingEvidence.includes("BUILD_LOG"));
});
