import type { EvidenceBundle } from "./verification.js";
import { createReleaseReadinessReport } from "./releaseReadiness.js";

export type DivineBoundaryDomain = "health" | "legal" | "financial" | "psychological" | "crisis" | "general";

export interface DivineCodeAssessment {
  allowed: boolean;
  boundaryTriggered: boolean;
  domain: DivineBoundaryDomain;
  reasons: string[];
  requiredResponsePosture: "reflective" | "professional_boundary" | "emergency_escalation";
  aiDisclosureRequired: true;
  humanSovereigntyRequired: true;
}

export const DivineCodeManifest = {
  name: "Humanity Laws Divine Code Runtime",
  version: "1.0.0",
  constitutionalSource: "Humanity Laws book is immutable constitutional source and must not be rewritten by implementation code.",
  founderSource: "About Nick, founder voice, letters, podcasts, live sessions, and reflections support the book without replacing it.",
  nonNegotiables: {
    sovereignty: "The human remains sovereign above automation, companions, recommendations, and platform incentives.",
    dignity: "Every user-facing system must protect life, dignity, privacy, consent, and truthful care.",
    privacy: "Memory, personalization, and member context require consent and must avoid unnecessary sensitive collection.",
    aiTransparency: "Adam, Eve, and Council must disclose AI identity and never pretend to be real humans.",
    professionalBoundaries: "Health, legal, financial, psychological, vulnerable-person, and crisis issues require qualified human support boundaries.",
  },
  launchPaths: {
    digitalBookOnly: "Digital book purchase grants book access only.",
    monthlyMembership: "Monthly membership includes digital book access and member-room access.",
    hardcover: "Hardcover remains separate and must not claim live fulfillment without verified POD/provider evidence.",
  },
  sacredArchitectureLayers: [
    "Humanity Laws Constitutional Source",
    "Love Filter Engine",
    "Human Sovereignty Protection",
    "Human Dignity Firewall",
    "Truth / Uncertainty / Humility Standard",
    "Companion Boundary System",
    "Adam & Eve Identity Preservation",
    "Council Perspective System",
    "Member Context and Consent Layer",
    "Spark / Table / Wellness Experience Layer",
    "Payment / Membership / Book Access Layer",
    "Launch Stability Firewall",
  ],
} as const;

function domainFor(input: string): DivineBoundaryDomain {
  const lower = input.toLowerCase();
  if (/(suicide|self[- ]?harm|kill myself|hurt myself|violence|emergency|immediate danger|crisis)/.test(lower)) return "crisis";
  if (/(doctor|medical|diagnos|prescription|medicine|symptom|treatment|hospital)/.test(lower)) return "health";
  if (/(lawyer|legal|lawsuit|custody|contract|court|criminal)/.test(lower)) return "legal";
  if (/(invest|investment|retirement|tax|loan|debt|large money|portfolio)/.test(lower)) return "financial";
  if (/(trauma|panic|depression|anxiety|therapy|mental health|abuse|neglect)/.test(lower)) return "psychological";
  return "general";
}

export function assessDivineCodeRequest(input: string): DivineCodeAssessment {
  const domain = domainFor(input);
  const boundaryTriggered = domain !== "general";
  const requiredResponsePosture = domain === "crisis"
    ? "emergency_escalation"
    : boundaryTriggered
      ? "professional_boundary"
      : "reflective";
  const reasons: string[] = [
    DivineCodeManifest.nonNegotiables.sovereignty,
    DivineCodeManifest.nonNegotiables.dignity,
    DivineCodeManifest.nonNegotiables.aiTransparency,
  ];
  if (boundaryTriggered) reasons.push(DivineCodeManifest.nonNegotiables.professionalBoundaries);

  return {
    allowed: true,
    boundaryTriggered,
    domain,
    reasons,
    requiredResponsePosture,
    aiDisclosureRequired: true,
    humanSovereigntyRequired: true,
  };
}

export function divineLaunchReadiness(bundle: EvidenceBundle): {
  launchReady: boolean;
  missingEvidence: string[];
  blockers: string[];
} {
  const report = createReleaseReadinessReport(bundle);
  return {
    launchReady: report.launchReady,
    missingEvidence: report.missingEvidence,
    blockers: report.blockers,
  };
}

export function companionDisclosureFor(companion: "Adam" | "Eve" | "Council"): string {
  return `${companion} is an AI companion inside Humanity Laws, not a real human. Your human judgment remains final.`;
}
