import type {ProviderConfiguration, ProviderState} from "./types.js";

const transitions: Readonly<Record<ProviderState, readonly ProviderState[]>> = {
  NOT_CONFIGURED: ["CREDENTIALS_MISSING", "CONFIGURED_DISABLED", "BLOCKED"],
  CREDENTIALS_MISSING: ["CONFIGURED_DISABLED", "BLOCKED"],
  CONFIGURED_DISABLED: ["VALIDATION_PENDING", "PAUSED", "BLOCKED"],
  VALIDATION_PENDING: ["VALIDATED", "ERROR", "BLOCKED"],
  VALIDATED: ["DEGRADED", "PAUSED", "BLOCKED", "ACTIVE_STAGING"],
  DEGRADED: ["VALIDATION_PENDING", "PAUSED", "BLOCKED"],
  PAUSED: ["CONFIGURED_DISABLED", "VALIDATION_PENDING", "VALIDATED", "BLOCKED"],
  BLOCKED: ["CONFIGURED_DISABLED", "VALIDATION_PENDING"],
  ACTIVE_STAGING: ["DEGRADED", "PAUSED", "BLOCKED"],
  ACTIVE_PRODUCTION: ["DEGRADED", "PAUSED", "BLOCKED"],
  ERROR: ["VALIDATION_PENDING", "PAUSED", "BLOCKED"],
};

export function transitionProviderState(
  config: ProviderConfiguration,
  to: ProviderState,
  expectedVersion: number,
): ProviderConfiguration {
  if (config.version !== expectedVersion) throw new Error("STALE_EXPECTED_VERSION");
  if (!transitions[config.state].includes(to)) throw new Error(`FORBIDDEN_TRANSITION:${config.state}:${to}`);
  if (to === "ACTIVE_PRODUCTION") throw new Error("PRODUCTION_ACTIVATION_PROHIBITED_SPRINT_018");
  if (to === "ACTIVE_STAGING") {
    const referencesValid = config.secretReferences.length > 0 &&
      config.secretReferences.every(item => item.configured && item.validationResult === "VALID");
    if (config.environment !== "STAGING" || !referencesValid || !config.policyValidated ||
        !config.budgetAuthorized || !config.founderAuthorized ||
        config.evidenceReferences.length === 0 || config.globalPaused || config.providerPaused) {
      throw new Error("STAGING_ACTIVATION_GATES_INCOMPLETE");
    }
  }
  return {...config, state: to, version: config.version + 1};
}

export function allowedTransitions(from: ProviderState): readonly ProviderState[] {
  return transitions[from];
}
