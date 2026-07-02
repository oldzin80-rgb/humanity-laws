import type { EvidenceBundle } from "./verification.js";
import { buildEvidenceIndex } from "./verification.js";

export interface ExecutionStatusRecord {
  repositoryInspection: "PASSED" | "FAILED" | "MISSING";
  runtimeIntegration: "PASSED" | "FAILED" | "MISSING";
  build: "PASSED" | "FAILED" | "MISSING";
  tests: "PASSED" | "FAILED" | "MISSING";
  smoke: "PASSED" | "FAILED" | "MISSING";
  manualReview: "PASSED" | "FAILED" | "MISSING";
  releaseApproval: "PASSED" | "FAILED" | "MISSING";
  deployment: "PASSED" | "FAILED" | "MISSING";
  releaseReady: boolean;
}

function status(entry: { exists: boolean; passed: boolean }): "PASSED" | "FAILED" | "MISSING" {
  if (!entry.exists) return "MISSING";
  return entry.passed ? "PASSED" : "FAILED";
}

export function deriveExecutionStatusFromEvidence(bundle: EvidenceBundle): ExecutionStatusRecord {
  const index = buildEvidenceIndex(bundle.evidence);
  const releaseReady =
    index.REPOSITORY_INSPECTION.passed &&
    index.RUNTIME_CODE_INTEGRATED.passed &&
    index.BUILD_LOG.passed &&
    index.TEST_LOG.passed &&
    index.MANUAL_REVIEW.passed &&
    index.RELEASE_APPROVAL.passed &&
    index.DEPLOYMENT_LOG.passed;

  return {
    repositoryInspection: status(index.REPOSITORY_INSPECTION),
    runtimeIntegration: status(index.RUNTIME_CODE_INTEGRATED),
    build: status(index.BUILD_LOG),
    tests: status(index.TEST_LOG),
    smoke: status(index.SMOKE_LOG),
    manualReview: status(index.MANUAL_REVIEW),
    releaseApproval: status(index.RELEASE_APPROVAL),
    deployment: status(index.DEPLOYMENT_LOG),
    releaseReady,
  };
}
