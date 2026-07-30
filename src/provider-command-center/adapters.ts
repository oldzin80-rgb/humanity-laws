import {createHash} from "node:crypto";
import type {ProviderAdapter, ProviderId, SecretReference} from "./types.js";
import {getProviderDefinition} from "./registry.js";

export class DisabledProviderAdapter implements ProviderAdapter {
  constructor(readonly providerId: ProviderId) {}
  validateConfiguration(references: readonly SecretReference[]) {
    const missing = this.checkCredentialPresence(references).missing;
    return Promise.resolve({valid: missing.length === 0, blockers: missing.map(item => `MISSING_REFERENCE:${item}`)});
  }
  checkCredentialPresence(references: readonly SecretReference[]) {
    const required = getProviderDefinition(this.providerId).credentialRequirements;
    const present = new Set(references.filter(item => item.configured).map(item => item.referenceName));
    const missing = required.filter(item => !present.has(item));
    return {present: missing.length === 0, missing: [...missing]};
  }
  verifyCredentials() { return Promise.resolve({verified: false, externalCalls: 0}); }
  healthCheck() { return Promise.resolve({healthy: false, status: "UNKNOWN" as const, externalCalls: 0}); }
  discoverCapabilities() { return getProviderDefinition(this.providerId).capabilities; }
  verifyWebhook(input: {rawBody: string; signature?: string}) {
    if (!input.signature?.trim()) return {valid: false, reason: "WEBHOOK_SIGNATURE_MISSING"};
    return {valid: false, reason: "REMOTE_SIGNATURE_VERIFICATION_DISABLED"};
  }
  retrieveUsage() { return Promise.resolve({status: "UNKNOWN" as const, externalCalls: 0}); }
  retrieveCost() { return Promise.resolve({status: "UNKNOWN" as const, externalCalls: 0}); }
  simulate(capability: string) {
    const digest = createHash("sha256").update(`${this.providerId}:${capability}`).digest("hex").slice(0, 16);
    return Promise.resolve({simulated: true as const, externalCalls: 0 as const, evidenceReference: `simulation:${digest}`});
  }
  requestActivation() { return {requested: true as const, activated: false as const}; }
  pause() { return {paused: true as const}; }
  resume() { return {resumed: true as const, activated: false as const}; }
  disable() { return {disabled: true as const}; }
}

export const TwilioRequiredSecretReferences = [
  "TWILIO_ACCOUNT_SID", "TWILIO_API_KEY_SID", "TWILIO_API_KEY_SECRET",
  "TWILIO_MESSAGING_SERVICE_SID", "TWILIO_VERIFY_SERVICE_SID",
  "TWILIO_STATUS_CALLBACK_URL", "SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL",
  "SENDGRID_FROM_NAME", "SENDGRID_WEBHOOK_VERIFICATION_KEY",
] as const;
