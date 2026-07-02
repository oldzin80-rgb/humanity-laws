import {
  clamp,
  defaultDependencies,
  type Domain,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export interface LifeSignal {
  readonly id: Identifier;
  readonly domain: Domain;
  readonly statement: string;
  readonly source: "self_report" | "record" | "trusted_person" | "observation";
  readonly confidence: number;
  readonly importance: number;
  readonly observedAt: ISODateTime;
  readonly consentToUse: boolean;
  readonly expiresAt?: ISODateTime;
}

export interface LifeDimension {
  readonly domain: Domain;
  readonly understanding: readonly string[];
  readonly confidence: number;
  readonly importance: number;
  readonly contradictions: readonly string[];
  readonly unknowns: readonly string[];
}

export interface PersonalLifeModel {
  readonly personId: Identifier;
  readonly version: number;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly dimensions: readonly LifeDimension[];
  readonly values: readonly string[];
  readonly boundaries: readonly string[];
  readonly relationships: readonly string[];
  readonly responsibilities: readonly string[];
  readonly aspirations: readonly string[];
  readonly uncertainty: number;
  readonly correctionInvitation: string;
}

const DOMAINS: readonly Domain[] = [
  "identity",
  "relationships",
  "health",
  "mind",
  "spirit",
  "learning",
  "work",
  "money",
  "home",
  "community",
  "creativity",
  "future",
];

export class LifeModelEngine {
  #signals = new Map<Identifier, LifeSignal[]>();
  #models = new Map<Identifier, PersonalLifeModel>();
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  receive(personId: Identifier, signals: readonly LifeSignal[]): number {
    const now = this.#deps.clock.now().getTime();
    const accepted = signals.filter(
      (signal) =>
        signal.consentToUse &&
        signal.statement.trim() &&
        (!signal.expiresAt || new Date(signal.expiresAt).getTime() > now),
    );
    const map = new Map((this.#signals.get(personId) ?? []).map((item) => [item.id, item]));
    accepted.forEach((signal) =>
      map.set(
        signal.id,
        Object.freeze({
          ...signal,
          confidence: clamp(signal.confidence),
          importance: clamp(signal.importance),
        }),
      ),
    );
    this.#signals.set(personId, [...map.values()]);
    return accepted.length;
  }

  build(
    personId: Identifier,
    declared: {
      values?: readonly string[];
      boundaries?: readonly string[];
      relationships?: readonly string[];
      responsibilities?: readonly string[];
      aspirations?: readonly string[];
    } = {},
  ): PersonalLifeModel {
    const now = this.#deps.clock.now();
    const active = (this.#signals.get(personId) ?? []).filter(
      (signal) => !signal.expiresAt || new Date(signal.expiresAt).getTime() > now.getTime(),
    );
    const dimensions = DOMAINS.map((domain): LifeDimension => {
      const signals = active.filter((signal) => signal.domain === domain);
      const statements = signals.map((signal) => signal.statement.trim());
      const confidence = signals.length
        ? signals.reduce((sum, signal) => sum + signal.confidence, 0) / signals.length
        : 0;
      const importance = signals.length
        ? Math.max(...signals.map((signal) => signal.importance))
        : 0;
      const contradictions = statements.filter((statement, index) =>
        statements.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            (other.startsWith(`not ${statement}`) || statement.startsWith(`not ${other}`)),
        ),
      );
      return Object.freeze({
        domain,
        understanding: statements,
        confidence: Number(confidence.toFixed(3)),
        importance: Number(importance.toFixed(3)),
        contradictions,
        unknowns: statements.length ? [] : [`The ${domain} dimension remains unknown.`],
      });
    });
    const prior = this.#models.get(personId);
    const uncertainty =
      1 - dimensions.reduce((sum, dimension) => sum + dimension.confidence, 0) / dimensions.length;
    const model: PersonalLifeModel = Object.freeze({
      personId,
      version: (prior?.version ?? 0) + 1,
      createdAt: prior?.createdAt ?? now.toISOString(),
      updatedAt: now.toISOString(),
      dimensions,
      values: [...(declared.values ?? prior?.values ?? [])],
      boundaries: [...(declared.boundaries ?? prior?.boundaries ?? [])],
      relationships: [...(declared.relationships ?? prior?.relationships ?? [])],
      responsibilities: [...(declared.responsibilities ?? prior?.responsibilities ?? [])],
      aspirations: [...(declared.aspirations ?? prior?.aspirations ?? [])],
      uncertainty: Number(uncertainty.toFixed(3)),
      correctionInvitation:
        "This map is provisional. What is wrong, missing, outdated, overconfident, or too private to retain?",
    });
    this.#models.set(personId, model);
    return model;
  }

  correct(personId: Identifier, signalId: Identifier, statement?: string): PersonalLifeModel {
    const signals = this.#signals.get(personId) ?? [];
    this.#signals.set(
      personId,
      statement === undefined
        ? signals.filter((signal) => signal.id !== signalId)
        : signals.map((signal) =>
            signal.id === signalId ? Object.freeze({ ...signal, statement }) : signal,
          ),
    );
    return this.build(personId);
  }

  forget(personId: Identifier): boolean {
    const signals = this.#signals.delete(personId);
    const model = this.#models.delete(personId);
    return signals || model;
  }

  get(personId: Identifier): PersonalLifeModel | undefined {
    return this.#models.get(personId);
  }
}

