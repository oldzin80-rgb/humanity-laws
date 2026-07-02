import type { EvidenceBundle, EvidenceType } from "./verification.js";
import { buildEvidenceIndex } from "./verification.js";
import type { ImplementationStatus } from "./governanceStatus.js";

export interface SupportedImplementationStatus {
  status: ImplementationStatus;
  missingEvidence: EvidenceType[];
  blockedReasons: string[];
}

const stages: Array<{ status: ImplementationStatus; required: EvidenceType[] }> = [
  { status: "IMPLEMENTED", required: ["REPOSITORY_INSPECTION", "RUNTIME_CODE_INTEGRATED"] },
  { status: "BUILD_VERIFIED", required: ["REPOSITORY_INSPECTION", "RUNTIME_CODE_INTEGRATED", "BUILD_LOG"] },
  { status: "TEST_VERIFIED", required: ["REPOSITORY_INSPECTION", "RUNTIME_CODE_INTEGRATED", "BUILD_LOG", "TEST_LOG"] },
  { status: "RELEASE_VERIFIED", required: ["REPOSITORY_INSPECTION", "RUNTIME_CODE_INTEGRATED", "BUILD_LOG", "TEST_LOG", "MANUAL_REVIEW", "RELEASE_APPROVAL", "DEPLOYMENT_LOG"] },
];

export function determineSupportedImplementationStatus(bundle: EvidenceBundle): SupportedImplementationStatus {
  const index = buildEvidenceIndex(bundle.evidence);
  let status: ImplementationStatus = "NOT_IMPLEMENTED";
  let missingEvidence: EvidenceType[] = [];
  for (const stage of stages) {
    const missing = stage.required.filter((type) => !index[type].passed);
    if (missing.length === 0) {
      status = stage.status;
      missingEvidence = [];
    } else {
      missingEvidence = missing;
      break;
    }
  }
  return {
    status,
    missingEvidence,
    blockedReasons: missingEvidence.map((type) => `${type} is missing or failed.`),
  };
}
