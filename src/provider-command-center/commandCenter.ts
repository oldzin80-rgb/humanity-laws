import {CanonicalProviderRegistry, getProviderDefinition} from "./registry.js";
import {DisabledProviderAdapter} from "./adapters.js";
import {isFounder} from "./security.js";
import type {ProviderConfiguration, ProviderEnvironment, ProviderId} from "./types.js";
import {ProviderControlStore} from "./runtime.js";

export interface FounderActor {id: string; roles: readonly string[]}

export class FounderProviderCommandCenter {
  constructor(private readonly store: ProviderControlStore) {}
  private authorize(actor: FounderActor) {
    if (!isFounder(actor)) throw new Error("FOUNDER_AUTHORIZATION_REQUIRED");
  }

  registry(actor: FounderActor) {
    this.authorize(actor);
    return CanonicalProviderRegistry.map(provider => ({
      ...provider,
      operationalState: provider.defaultState,
      activationReadiness: provider.defaultReadiness,
    }));
  }

  detail(actor: FounderActor, providerId: ProviderId, environment: ProviderEnvironment) {
    this.authorize(actor);
    const definition = getProviderDefinition(providerId);
    const configuration = this.store.getConfiguration(providerId, environment);
    return {
      definition,
      configuration: configuration ? {
        ...configuration,
        secretReferences: configuration.secretReferences.map(reference => ({
          ...reference, referenceName: reference.referenceName,
        })),
      } : null,
      health: "UNKNOWN" as const,
      usage: "UNKNOWN" as const,
      budget: configuration?.budgetAuthorized ? "AUTHORIZED" as const : "NOT_AUTHORIZED" as const,
      webhookReadiness: definition.webhookRequirements.length ? "NOT_VERIFIED" as const : "NOT_REQUIRED" as const,
      incidents: [],
      recentDeniedActions: this.store.auditEvents().filter(event =>
        event.providerId === providerId && event.outcome === "DENIED").slice(-10),
      launchBlockers: this.blockers(configuration, definition.credentialRequirements),
    };
  }

  async command(actor: FounderActor, input: {
    providerId: ProviderId; environment: ProviderEnvironment;
    command: "VALIDATE_CREDENTIALS" | "HEALTH_CHECK" | "SIMULATE" |
      "PAUSE" | "RESUME" | "DISABLE" | "REQUEST_ACTIVATION";
    capability?: string;
  }) {
    this.authorize(actor);
    const adapter = new DisabledProviderAdapter(input.providerId);
    if (input.command === "SIMULATE") return adapter.simulate(input.capability ?? "CONFIGURATION");
    if (input.command === "HEALTH_CHECK") return adapter.healthCheck();
    if (input.command === "VALIDATE_CREDENTIALS") {
      const config = this.store.getConfiguration(input.providerId, input.environment);
      return adapter.validateConfiguration(config?.secretReferences ?? []);
    }
    if (input.command === "PAUSE") return adapter.pause();
    if (input.command === "RESUME") return adapter.resume();
    if (input.command === "DISABLE") return adapter.disable();
    return adapter.requestActivation();
  }

  readiness(actor: FounderActor, environment: ProviderEnvironment) {
    this.authorize(actor);
    const details = CanonicalProviderRegistry.map(item => this.detail(actor, item.id, environment));
    const verified = details.filter(item => item.launchBlockers.length === 0).length;
    return {
      evidenceDerivedScore: Math.round((verified / details.length) * 100),
      globalPause: true,
      providers: details,
      overallState: verified === details.length ? "INTERNALLY_READY" : "NOT_VERIFIED",
      productionActivationAvailable: false,
    };
  }

  private blockers(config: ProviderConfiguration | undefined, required: readonly string[]) {
    if (!config) return ["CONFIGURATION_NOT_PERSISTED"];
    const configured = new Set(config.secretReferences.filter(item => item.configured).map(item => item.referenceName));
    const blockers = required.filter(item => !configured.has(item)).map(item => `MISSING_REFERENCE:${item}`);
    if (!config.policyValidated) blockers.push("POLICY_NOT_VALIDATED");
    if (!config.budgetAuthorized) blockers.push("BUDGET_NOT_AUTHORIZED");
    if (!config.evidenceReferences.length) blockers.push("EVIDENCE_MISSING");
    return blockers;
  }
}
