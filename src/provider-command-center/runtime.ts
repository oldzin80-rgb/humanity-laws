import {randomUUID} from "node:crypto";
import type {
  ProviderAuditEvent, ProviderConfiguration, ProviderId, ProviderOutboxRecord,
} from "./types.js";
import {redactSecrets} from "./security.js";
import {transitionProviderState} from "./stateMachine.js";

export class ProviderControlStore {
  private readonly configurations = new Map<string, ProviderConfiguration>();
  private readonly audits: ProviderAuditEvent[] = [];
  private readonly outbox: ProviderOutboxRecord[] = [];
  private readonly idempotency = new Map<string, unknown>();

  private key(providerId: ProviderId, environment: string) {
    return `${providerId}:${environment}`;
  }

  saveConfiguration(config: ProviderConfiguration): ProviderConfiguration {
    const key = this.key(config.providerId, config.environment);
    const existing = this.configurations.get(key);
    if (existing && config.version !== existing.version + 1) throw new Error("OPTIMISTIC_CONCURRENCY_VIOLATION");
    this.configurations.set(key, structuredClone(config));
    return structuredClone(config);
  }

  seedConfiguration(config: ProviderConfiguration): void {
    if (this.configurations.has(this.key(config.providerId, config.environment))) {
      throw new Error("CONFIGURATION_ALREADY_EXISTS");
    }
    this.configurations.set(this.key(config.providerId, config.environment), structuredClone(config));
  }

  getConfiguration(providerId: ProviderId, environment: ProviderConfiguration["environment"]) {
    const config = this.configurations.get(this.key(providerId, environment));
    return config ? structuredClone(config) : undefined;
  }

  transition(input: {
    providerId: ProviderId; environment: ProviderConfiguration["environment"];
    to: ProviderConfiguration["state"]; expectedVersion: number; actorId: string;
    correlationId: string; idempotencyKey: string;
  }) {
    if (this.idempotency.has(input.idempotencyKey)) {
      return structuredClone(this.idempotency.get(input.idempotencyKey)) as ProviderConfiguration;
    }
    const current = this.getConfiguration(input.providerId, input.environment);
    if (!current) throw new Error("CONFIGURATION_NOT_FOUND");
    const next = transitionProviderState(current, input.to, input.expectedVersion);
    this.saveConfiguration(next);
    this.appendAudit({
      providerId: input.providerId, environment: input.environment,
      actorId: input.actorId, action: `STATE_${current.state}_TO_${input.to}`,
      outcome: "RECORDED", reasonCodes: [], correlationId: input.correlationId,
    });
    this.outbox.push({
      id: randomUUID(), topic: "provider.state.changed",
      aggregateId: `${input.providerId}:${input.environment}`,
      payloadReference: `audit:${this.audits.at(-1)!.id}`,
      status: "PENDING", createdAt: new Date().toISOString(),
    });
    this.idempotency.set(input.idempotencyKey, structuredClone(next));
    return next;
  }

  recordDenial(input: Omit<ProviderAuditEvent, "id" | "occurredAt" | "immutable" | "outcome">) {
    return this.appendAudit({...input, outcome: "DENIED"});
  }

  appendAudit(input: Omit<ProviderAuditEvent, "id" | "occurredAt" | "immutable">) {
    const safe = redactSecrets(input) as typeof input;
    const event: ProviderAuditEvent = {
      ...safe, id: randomUUID(), occurredAt: new Date().toISOString(), immutable: true,
    };
    this.audits.push(event);
    return structuredClone(event);
  }

  auditEvents() { return structuredClone(this.audits); }
  outboxRecords() { return structuredClone(this.outbox); }
  updateAudit(): never { throw new Error("AUDIT_IMMUTABLE"); }
  deleteAudit(): never { throw new Error("AUDIT_IMMUTABLE"); }
}
