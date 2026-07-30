import type {PageModel} from "../types.js";
import {CanonicalProviderRegistry} from "../../provider-command-center/index.js";

export function createFounderCommandCenterPage(): PageModel {
  return {
    pageId: "founder-command-center",
    kind: "ADMIN",
    title: "Founder Command Center",
    subtitle: "Evidence-backed provider readiness with every external effect disabled by default.",
    seoTitle: "Founder Command Center — Humanity Laws",
    accessibilitySummary: "Founder-only provider configuration, health, budget, incident, and readiness dashboard.",
    actions: [{label: "Stewardship Dashboard", href: "/admin", kind: "SECONDARY"}],
    sections: [
      {
        eyebrow: "Global safety",
        title: "GLOBAL PAUSE ACTIVE",
        body: "Production activation is unavailable. Provider commands are limited to validation, non-destructive health checks, simulation, pause, resume-to-disabled, disable, and activation requests.",
      },
      {
        eyebrow: "Evidence-derived readiness",
        title: "NOT VERIFIED",
        body: "No provider is shown healthy or ready without committed configuration and validation evidence.",
      },
      ...CanonicalProviderRegistry.map(provider => ({
        eyebrow: provider.category,
        title: provider.displayName,
        body: `State: ${provider.defaultState}. Readiness: ${provider.defaultReadiness}. Credentials: ${provider.credentialRequirements.join(", ")}. Health: UNKNOWN.`,
        bullets: [
          `Capabilities: ${provider.capabilities.join(", ")}`,
          "Budget: NOT AUTHORIZED",
          `Webhook: ${provider.webhookRequirements.length ? "NOT VERIFIED" : "NOT REQUIRED"}`,
          "Activation eligibility: BLOCKED",
          "Audit: available through founder-only provider API",
        ],
      })),
    ],
  };
}
