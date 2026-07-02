export type ImplementationStatus = "NOT_IMPLEMENTED" | "IMPLEMENTED" | "BUILD_VERIFIED" | "TEST_VERIFIED" | "RELEASE_VERIFIED";

export interface ArchitectureVerificationStatus {
  artifact: string;
  designStatus: "PASS" | "REQUIRES_CHANGES";
  implementationStatus: ImplementationStatus;
  implementedInWorkspace: boolean;
  buildVerified: boolean;
  testsVerified: boolean;
  smokeVerified: boolean;
  deploymentVerified: boolean;
  releaseReady: boolean;
  lifecycleAdvanced: boolean;
}

export function createDesignPassStatus(artifact: string): ArchitectureVerificationStatus {
  return {
    artifact,
    designStatus: "PASS",
    implementationStatus: "NOT_IMPLEMENTED",
    implementedInWorkspace: false,
    buildVerified: false,
    testsVerified: false,
    smokeVerified: false,
    deploymentVerified: false,
    releaseReady: false,
    lifecycleAdvanced: false,
  };
}
