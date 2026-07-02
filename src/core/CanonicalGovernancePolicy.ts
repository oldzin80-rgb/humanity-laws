export const CanonicalGovernancePolicy = {
  policy: "CANONICAL_GOVERNANCE_POLICY",
  version: "1.0.0",
  principle: "Design approvals may be direct. Implementation, verification, release readiness, and lifecycle state must be evidence-derived.",
  prohibitedActions: [
    "Do not manually set implementation status.",
    "Do not manually set build status.",
    "Do not manually set test status.",
    "Do not manually set smoke status.",
    "Do not manually set deployment status.",
    "Do not manually set release readiness.",
    "Do not manually advance lifecycle state.",
  ],
} as const;
