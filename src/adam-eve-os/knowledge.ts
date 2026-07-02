import {
  clamp,
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type KnowledgeAuthority =
  | "primary"
  | "official"
  | "systematic_review"
  | "peer_reviewed"
  | "professional"
  | "journalistic"
  | "community"
  | "lived_experience";

export interface KnowledgeDocument {
  readonly id: Identifier;
  readonly title: string;
  readonly url?: string;
  readonly publisher: string;
  readonly authority: KnowledgeAuthority;
  readonly publishedAt?: ISODateTime;
  readonly retrievedAt: ISODateTime;
  readonly jurisdiction?: string;
  readonly contentHash?: string;
  readonly correctionPolicy?: string;
}

export interface KnowledgeConnector {
  readonly id: Identifier;
  readonly domains: readonly string[];
  fetch(query: string, asOf: ISODateTime): Promise<readonly KnowledgeDocument[]>;
}

export interface KnowledgeBundle {
  readonly id: Identifier;
  readonly query: string;
  readonly createdAt: ISODateTime;
  readonly documents: readonly KnowledgeDocument[];
  readonly freshness: number;
  readonly authorityDiversity: number;
  readonly publisherDiversity: number;
  readonly warnings: readonly string[];
}

export class KnowledgeFabric {
  #connectors = new Map<Identifier, KnowledgeConnector>();
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  register(connector: KnowledgeConnector): void {
    this.#connectors.set(connector.id, connector);
  }

  async gather(query: string, domains: readonly string[] = []): Promise<KnowledgeBundle> {
    const now = this.#deps.clock.now();
    const connectors = [...this.#connectors.values()].filter(
      (connector) =>
        domains.length === 0 || connector.domains.some((domain) => domains.includes(domain)),
    );
    const settled = await Promise.allSettled(
      connectors.map((connector) => connector.fetch(query, now.toISOString())),
    );
    const warnings: string[] = [];
    const documents = settled.flatMap((result, index) => {
      if (result.status === "fulfilled") return result.value;
      warnings.push(`Connector ${connectors[index]?.id ?? index} failed; coverage is incomplete.`);
      return [];
    });
    const unique = [
      ...new Map(
        documents.map((document) => [
          document.contentHash ?? document.url ?? document.id,
          Object.freeze({ ...document }),
        ]),
      ).values(),
    ];
    const current = unique.filter(
      (document) =>
        now.getTime() - new Date(document.retrievedAt).getTime() <=
        1000 * 60 * 60 * 24 * 120,
    );
    const authorities = new Set(unique.map((document) => document.authority));
    const publishers = new Set(unique.map((document) => document.publisher));
    if (unique.length === 0) warnings.push("No source documents were retrieved.");
    if (publishers.size < 2) warnings.push("Independent publisher diversity is limited.");
    if (!unique.some((document) => ["primary", "official"].includes(document.authority))) {
      warnings.push("No primary or official source is present.");
    }
    return Object.freeze({
      id: this.#deps.ids.create("knowledge"),
      query,
      createdAt: now.toISOString(),
      documents: unique,
      freshness: Number(clamp(unique.length ? current.length / unique.length : 0).toFixed(3)),
      authorityDiversity: Number(
        clamp(authorities.size / Math.max(1, unique.length)).toFixed(3),
      ),
      publisherDiversity: Number(
        clamp(publishers.size / Math.max(1, unique.length)).toFixed(3),
      ),
      warnings,
    });
  }
}

