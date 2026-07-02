export type SourceKind =
  | "primary"
  | "official"
  | "scholarly"
  | "professional"
  | "news"
  | "book"
  | "founder"
  | "user_provided"
  | "local_observation";

export interface SourceRecord {
  readonly id: string;
  readonly title: string;
  readonly kind: SourceKind;
  readonly publisher?: string;
  readonly author?: string;
  readonly url?: string;
  readonly localPath?: string;
  readonly retrievedAt?: string;
  readonly publishedAt?: string;
  readonly jurisdiction?: string;
  readonly hash?: string;
  readonly notes?: string;
}

export interface SourceLedgerQuery {
  readonly kind?: SourceKind;
  readonly jurisdiction?: string;
  readonly requireCurrent?: boolean;
  readonly maxAgeDays?: number;
}

export interface SourceLedgerReport {
  readonly sources: readonly SourceRecord[];
  readonly warnings: readonly string[];
  readonly coverageScore: number;
}

export class SourceLedger {
  readonly #sources = new Map<string, SourceRecord>();

  add(source: SourceRecord): SourceRecord {
    const clean = Object.freeze({
      ...source,
      title: source.title.trim(),
      publisher: source.publisher?.trim(),
      author: source.author?.trim(),
      notes: source.notes?.trim(),
    });
    if (!clean.id.trim()) throw new Error("Source id is required.");
    if (!clean.title) throw new Error("Source title is required.");
    this.#sources.set(clean.id, clean);
    return clean;
  }

  list(): readonly SourceRecord[] {
    return Object.freeze([...this.#sources.values()]);
  }

  report(query: SourceLedgerQuery = {}, now = new Date()): SourceLedgerReport {
    let sources = [...this.#sources.values()];
    if (query.kind) sources = sources.filter((source) => source.kind === query.kind);
    if (query.jurisdiction) {
      sources = sources.filter(
        (source) => !source.jurisdiction || source.jurisdiction === query.jurisdiction,
      );
    }

    const warnings: string[] = [];
    if (sources.length === 0) warnings.push("No matching sources are available.");

    if (query.requireCurrent) {
      const maxAgeDays = query.maxAgeDays ?? 120;
      const stale = sources.filter((source) => {
        const checked = source.retrievedAt ?? source.publishedAt;
        if (!checked) return true;
        return now.getTime() - new Date(checked).getTime() > maxAgeDays * 24 * 60 * 60 * 1000;
      });
      if (stale.length) warnings.push(`${stale.length} source(s) may be stale or missing retrieval dates.`);
    }

    const kinds = new Set(sources.map((source) => source.kind));
    const hasHighTrust = sources.some((source) =>
      ["primary", "official", "scholarly", "professional", "book"].includes(source.kind),
    );
    if (!hasHighTrust) warnings.push("No primary, official, scholarly, professional, or book source is present.");

    const coverageScore =
      Math.min(1, sources.length / 5) * 0.5 + Math.min(1, kinds.size / 3) * 0.3 + (hasHighTrust ? 0.2 : 0);

    return Object.freeze({
      sources: Object.freeze(sources),
      warnings: Object.freeze(warnings),
      coverageScore: Number(coverageScore.toFixed(3)),
    });
  }
}
