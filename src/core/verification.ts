export const EVIDENCE_TYPES = [
  "REPOSITORY_INSPECTION",
  "RUNTIME_CODE_INTEGRATED",
  "BUILD_LOG",
  "TEST_LOG",
  "SMOKE_LOG",
  "MANUAL_REVIEW",
  "RELEASE_APPROVAL",
  "DEPLOYMENT_LOG",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export interface ObjectiveEvidence {
  type: EvidenceType;
  description: string;
  source: string;
  timestamp: string;
  passed: boolean;
}

export interface EvidenceBundle {
  createdAt: string;
  workspaceRoot: string;
  evidence: ObjectiveEvidence[];
}

export interface EvidenceIndexEntry {
  exists: boolean;
  passed: boolean;
  entries: ObjectiveEvidence[];
}

export type EvidenceIndex = Record<EvidenceType, EvidenceIndexEntry>;

export function buildEvidenceIndex(evidence: ObjectiveEvidence[]): EvidenceIndex {
  const index = Object.fromEntries(
    EVIDENCE_TYPES.map((type) => [type, { exists: false, passed: false, entries: [] as ObjectiveEvidence[] }]),
  ) as EvidenceIndex;

  for (const item of evidence) {
    index[item.type].exists = true;
    index[item.type].entries.push(item);
    index[item.type].passed = index[item.type].passed || item.passed;
  }

  return index;
}

export function evidencePassed(evidence: ObjectiveEvidence[], type: EvidenceType): boolean {
  return buildEvidenceIndex(evidence)[type].passed;
}
