import type { EvidenceBundle, EvidenceType } from "./verification.js";
import { buildEvidenceIndex } from "./verification.js";

export const RELEASE_REQUIRED_EVIDENCE: EvidenceType[] = [
  "REPOSITORY_INSPECTION",
  "RUNTIME_CODE_INTEGRATED",
  "BUILD_LOG",
  "TEST_LOG",
  "MANUAL_REVIEW",
  "RELEASE_APPROVAL",
  "DEPLOYMENT_LOG",
];

export interface ReleaseReadinessReport {
  launchReady: boolean;
  missingEvidence: EvidenceType[];
  blockers: string[];
  generatedAt: string;
}

export function createReleaseReadinessReport(bundle: EvidenceBundle): ReleaseReadinessReport {
  const index = buildEvidenceIndex(bundle.evidence);
  const missingEvidence = RELEASE_REQUIRED_EVIDENCE.filter((type) => !index[type].passed);
  return {
    launchReady: missingEvidence.length === 0,
    missingEvidence,
    blockers: missingEvidence.map((type) => `${type} has not passed.`),
    generatedAt: new Date().toISOString(),
  };
}
