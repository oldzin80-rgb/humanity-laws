export type ProfessionalDomain =
  | "general"
  | "medical"
  | "mental_health"
  | "financial"
  | "legal"
  | "spiritual"
  | "safety"
  | "child_or_vulnerable_adult";

export type RiskLevel = "low" | "medium" | "high" | "emergency";

export interface ProfessionalBoundaryRequest {
  readonly userId?: string;
  readonly domain: ProfessionalDomain;
  readonly situation: string;
  readonly ageBand?: "child" | "teen" | "adult" | "older_adult";
  readonly jurisdiction?: string;
  readonly hasImmediateDanger?: boolean;
  readonly hasDeadlineOrIrreversibleConsequence?: boolean;
  readonly asksForDiagnosisPrescriptionOrLegalConclusion?: boolean;
  readonly asksToInvestBorrowOrMoveLargeMoney?: boolean;
  readonly involvesSelfHarmOrViolence?: boolean;
  readonly involvesAbuseNeglectOrExploitation?: boolean;
  readonly sourcesAvailable?: number;
}

export interface ProfessionalBoundaryAssessment {
  readonly domain: ProfessionalDomain;
  readonly riskLevel: RiskLevel;
  readonly canProvide: readonly string[];
  readonly mustNotProvide: readonly string[];
  readonly requiredDisclaimers: readonly string[];
  readonly escalation: readonly string[];
  readonly sourceRequirements: readonly string[];
  readonly responsePosture:
    | "friend_educational"
    | "careful_decision_support"
    | "professional_referral"
    | "emergency_redirect";
}

export class ProfessionalBoundaryRouter {
  assess(request: ProfessionalBoundaryRequest): ProfessionalBoundaryAssessment {
    const emergency =
      request.hasImmediateDanger ||
      request.involvesSelfHarmOrViolence ||
      (request.domain === "safety" && request.involvesAbuseNeglectOrExploitation);

    const high =
      emergency ||
      request.hasDeadlineOrIrreversibleConsequence ||
      request.asksForDiagnosisPrescriptionOrLegalConclusion ||
      request.asksToInvestBorrowOrMoveLargeMoney ||
      request.involvesAbuseNeglectOrExploitation ||
      request.domain === "child_or_vulnerable_adult";

    const medium =
      !high &&
      ["medical", "mental_health", "financial", "legal"].includes(request.domain);

    const riskLevel: RiskLevel = emergency
      ? "emergency"
      : high
        ? "high"
        : medium
          ? "medium"
          : "low";

    const requiredDisclaimers = [
      "Adam and Eve provide educational support and decision reflection, not licensed professional services.",
      "They should not be treated as a substitute for a qualified professional, emergency service, court, clinician, fiduciary, or advisor.",
    ];

    const sourceRequirements =
      riskLevel === "low"
        ? ["Use clear reasoning and identify uncertainty."]
        : [
            "Use current primary, official, or professionally recognized sources.",
            "State what is known, unknown, stale, jurisdiction-specific, or personally dependent.",
            "Do not invent citations or imply verification when sources are missing.",
          ];

    const escalation: string[] = [];
    if (riskLevel === "emergency") {
      escalation.push("Encourage immediate local emergency support or crisis services.");
    }
    if (riskLevel === "high") {
      escalation.push("Recommend timely review by a qualified professional before irreversible action.");
    }
    if (request.domain === "legal" && request.jurisdiction) {
      escalation.push(`Legal issues may depend on ${request.jurisdiction}; recommend local licensed counsel.`);
    }
    if (request.domain === "financial") {
      escalation.push("Encourage comparison of fees, risks, liquidity, taxes, time horizon, and fiduciary duty.");
    }
    if (request.domain === "medical" || request.domain === "mental_health") {
      escalation.push("Encourage qualified clinical care for diagnosis, treatment, medication, or urgent symptoms.");
    }

    return Object.freeze({
      domain: request.domain,
      riskLevel,
      canProvide:
        riskLevel === "emergency"
          ? ["Calm support, immediate safety planning prompts, and emergency redirection."]
          : [
              "Educational explanation.",
              "Questions to clarify goals, constraints, values, risks, and missing information.",
              "Options, tradeoffs, and preparation for a professional conversation.",
            ],
      mustNotProvide: [
        "Do not claim a professional license.",
        "Do not guarantee outcomes.",
        "Do not prescribe medication, diagnose disease, give binding legal conclusions, or promise investment returns.",
        "Do not pressure the user into a single irreversible choice.",
      ],
      requiredDisclaimers,
      escalation,
      sourceRequirements,
      responsePosture:
        riskLevel === "emergency"
          ? "emergency_redirect"
          : riskLevel === "high"
            ? "professional_referral"
            : riskLevel === "medium"
              ? "careful_decision_support"
              : "friend_educational",
    });
  }
}
