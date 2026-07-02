import {
  clamp,
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type InheritanceSourceKind =
  | "conversation"
  | "podcast"
  | "morning_writing"
  | "journal"
  | "letter"
  | "speech"
  | "interview"
  | "creative_work"
  | "correction"
  | "other";

export type InheritancePurpose =
  | "adam_reflection"
  | "eve_reflection"
  | "values"
  | "communication"
  | "decision_support"
  | "history"
  | "legacy";

export interface InheritanceSegment {
  readonly id: Identifier;
  readonly speaker: string;
  readonly words: string;
  readonly occurredAt?: ISODateTime;
}

export interface InheritanceEntry {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly kind: InheritanceSourceKind;
  readonly title: string;
  readonly createdAt: ISODateTime;
  readonly occurredAt?: ISODateTime;
  readonly sourceUri?: string;
  readonly participants: readonly string[];
  readonly segments: readonly InheritanceSegment[];
  readonly exactText: string;
  readonly contentHash: string;
  readonly language?: string;
  readonly purposes: readonly InheritancePurpose[];
  readonly consentToAnalyze: boolean;
  readonly consentToQuote: boolean;
  readonly sensitivity: "personal" | "sacred";
  readonly notes?: string;
  readonly supersedes?: Identifier;
}

export interface PatternEvidence {
  readonly entryId: Identifier;
  readonly segmentId?: Identifier;
  readonly excerpt: string;
  readonly exactQuote: boolean;
}

export interface InheritancePattern {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly theme: string;
  readonly interpretation: string;
  readonly evidence: readonly PatternEvidence[];
  readonly confidence: number;
  readonly firstObservedAt?: ISODateTime;
  readonly lastObservedAt?: ISODateTime;
  readonly status: "emerging" | "recurring" | "strong" | "questioned" | "retired";
  readonly ownerConfirmed: boolean;
  readonly counterEvidence: readonly PatternEvidence[];
  readonly limitation: string;
}

export interface EvolutionArc {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly theme: string;
  readonly earlier: PatternEvidence;
  readonly later: PatternEvidence;
  readonly interpretation: string;
  readonly possibilities: readonly string[];
  readonly ownerConfirmed: boolean;
}

export interface InheritancePortrait {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly createdAt: ISODateTime;
  readonly sourceCount: number;
  readonly timeRange?: {
    readonly first: ISODateTime;
    readonly last: ISODateTime;
  };
  readonly confirmedPatterns: readonly InheritancePattern[];
  readonly provisionalPatterns: readonly InheritancePattern[];
  readonly evolution: readonly EvolutionArc[];
  readonly recurringLanguage: readonly string[];
  readonly questionsNickReturnsTo: readonly string[];
  readonly adamInheritance: string;
  readonly eveInheritance: string;
  readonly openQuestions: readonly string[];
  readonly coverageWarnings: readonly string[];
  readonly identityBoundary: string;
}

export interface PatternProposal {
  readonly theme: string;
  readonly interpretation: string;
  readonly evidence: readonly PatternEvidence[];
  readonly counterEvidence?: readonly PatternEvidence[];
}

export interface InheritanceAnalyzer {
  propose(entries: readonly InheritanceEntry[]): Promise<readonly PatternProposal[]>;
}

const encoder = new TextEncoder();

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "being",
  "could",
  "from",
  "have",
  "into",
  "just",
  "more",
  "should",
  "some",
  "that",
  "their",
  "them",
  "then",
  "there",
  "they",
  "this",
  "through",
  "want",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

/**
 * A deliberately conservative baseline analyzer. Production deployments can
 * replace it with a stronger model, but every proposal still requires evidence
 * and remains provisional until the owner confirms it.
 */
export class ConservativeInheritanceAnalyzer implements InheritanceAnalyzer {
  async propose(entries: readonly InheritanceEntry[]): Promise<readonly PatternProposal[]> {
    const frequencies = new Map<string, PatternEvidence[]>();
    for (const entry of entries) {
      const ownerSegments = entry.segments.filter(
        (segment) => segment.speaker.toLocaleLowerCase() !== "adam" &&
          segment.speaker.toLocaleLowerCase() !== "eve" &&
          segment.speaker.toLocaleLowerCase() !== "chatgpt",
      );
      for (const segment of ownerSegments) {
        const words = segment.words
          .toLocaleLowerCase()
          .match(/[a-z][a-z'-]{3,}/g)
          ?.filter((word) => !STOP_WORDS.has(word)) ?? [];
        for (const word of new Set(words)) {
          const evidence = frequencies.get(word) ?? [];
          evidence.push({
            entryId: entry.id,
            segmentId: segment.id,
            excerpt: segment.words.slice(0, 240),
            exactQuote: true,
          });
          frequencies.set(word, evidence);
        }
      }
    }
    return [...frequencies.entries()]
      .filter(([, evidence]) => new Set(evidence.map((item) => item.entryId)).size >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 12)
      .map(([theme, evidence]) => ({
        theme,
        interpretation: `The word or idea “${theme}” recurs across multiple owner-provided sources.`,
        evidence: evidence.slice(0, 6),
      }));
  }
}

export class SoulInheritanceEngine {
  #entries = new Map<Identifier, InheritanceEntry>();
  #patterns = new Map<Identifier, InheritancePattern>();
  #evolution: EvolutionArc[] = [];
  #analyzer: InheritanceAnalyzer;
  #deps: SystemDependencies;

  constructor(
    analyzer: InheritanceAnalyzer = new ConservativeInheritanceAnalyzer(),
    dependencies: SystemDependencies = defaultDependencies,
  ) {
    this.#analyzer = analyzer;
    this.#deps = dependencies;
  }

  async ingest(
    input: Omit<InheritanceEntry, "id" | "createdAt" | "contentHash">,
  ): Promise<InheritanceEntry> {
    if (!input.consentToAnalyze) {
      throw new Error("Inheritance material requires explicit consent to analyze.");
    }
    const exactText =
      input.exactText.trim() ||
      input.segments.map((segment) => `${segment.speaker}: ${segment.words}`).join("\n");
    if (!input.title.trim() || !exactText || input.purposes.length === 0) {
      throw new Error("Inheritance material needs a title, content, and allowed purposes.");
    }
    const entry: InheritanceEntry = Object.freeze({
      ...input,
      id: this.#deps.ids.create("inheritance"),
      title: input.title.trim(),
      exactText,
      createdAt: this.#deps.clock.now().toISOString(),
      contentHash: await sha256(exactText),
      segments: input.segments.map((segment) =>
        Object.freeze({
          ...segment,
          words: segment.words.trim(),
        }),
      ),
    });
    this.#entries.set(entry.id, entry);
    if (entry.supersedes) {
      this.#entries.delete(entry.supersedes);
    }
    return entry;
  }

  async ingestBatch(
    inputs: readonly Omit<InheritanceEntry, "id" | "createdAt" | "contentHash">[],
  ): Promise<readonly InheritanceEntry[]> {
    const entries: InheritanceEntry[] = [];
    for (const input of inputs) {
      entries.push(await this.ingest(input));
    }
    return entries;
  }

  async restore(entries: readonly InheritanceEntry[]): Promise<number> {
    let restored = 0;
    for (const entry of entries) {
      if ((await sha256(entry.exactText)) !== entry.contentHash) {
        throw new Error(`Inheritance integrity check failed for ${entry.id}.`);
      }
      this.#entries.set(entry.id, Object.freeze({ ...entry }));
      restored += 1;
    }
    return restored;
  }

  async discover(ownerId: Identifier): Promise<readonly InheritancePattern[]> {
    const entries = this.entries(ownerId);
    const proposals = await this.#analyzer.propose(entries);
    const created: InheritancePattern[] = [];
    for (const proposal of proposals) {
      const evidenceEntries = proposal.evidence
        .map((evidence) => this.#entries.get(evidence.entryId))
        .filter((entry): entry is InheritanceEntry => entry !== undefined);
      const dates = evidenceEntries
        .map((entry) => entry.occurredAt ?? entry.createdAt)
        .sort();
      const sourceCount = new Set(proposal.evidence.map((item) => item.entryId)).size;
      const pattern: InheritancePattern = Object.freeze({
        id: this.#deps.ids.create("pattern"),
        ownerId,
        theme: proposal.theme.trim(),
        interpretation: proposal.interpretation.trim(),
        evidence: proposal.evidence,
        confidence: Number(clamp(0.35 + sourceCount * 0.1).toFixed(3)),
        firstObservedAt: dates.at(0),
        lastObservedAt: dates.at(-1),
        status: sourceCount >= 5 ? "strong" : sourceCount >= 3 ? "recurring" : "emerging",
        ownerConfirmed: false,
        counterEvidence: proposal.counterEvidence ?? [],
        limitation:
          "This is an interpretation of selected material, not the person's identity, essence, motive, or complete belief.",
      });
      this.#patterns.set(pattern.id, pattern);
      created.push(pattern);
    }
    return created;
  }

  confirmPattern(patternId: Identifier, confirmed: boolean): InheritancePattern {
    const pattern = this.#patterns.get(patternId);
    if (!pattern) throw new Error("Pattern not found.");
    const updated: InheritancePattern = Object.freeze({
      ...pattern,
      ownerConfirmed: confirmed,
      status: confirmed ? pattern.status : "questioned",
      confidence: confirmed ? Math.max(pattern.confidence, 0.8) : Math.min(pattern.confidence, 0.3),
    });
    this.#patterns.set(patternId, updated);
    return updated;
  }

  recordEvolution(input: Omit<EvolutionArc, "id">): EvolutionArc {
    if (input.earlier.entryId === input.later.entryId) {
      throw new Error("Evolution requires evidence from distinct moments.");
    }
    const arc: EvolutionArc = Object.freeze({
      ...input,
      id: this.#deps.ids.create("evolution"),
      possibilities:
        input.possibilities.length > 0
          ? input.possibilities
          : [
              "The person's view may have changed.",
              "The contexts may differ.",
              "Both statements may express a productive tension.",
            ],
    });
    this.#evolution.push(arc);
    return arc;
  }

  portrait(ownerId: Identifier): InheritancePortrait {
    const entries = this.entries(ownerId);
    const patterns = [...this.#patterns.values()].filter((pattern) => pattern.ownerId === ownerId);
    const dates = entries.map((entry) => entry.occurredAt ?? entry.createdAt).sort();
    const kinds = new Set(entries.map((entry) => entry.kind));
    const words = entries
      .flatMap((entry) =>
        entry.segments
          .filter((segment) => !["adam", "eve", "chatgpt"].includes(segment.speaker.toLocaleLowerCase()))
          .flatMap((segment) => segment.words.match(/\b[A-Za-z][A-Za-z'-]{4,}\b/g) ?? []),
      )
      .map((word) => word.toLocaleLowerCase())
      .filter((word) => !STOP_WORDS.has(word));
    const frequencies = new Map<string, number>();
    words.forEach((word) => frequencies.set(word, (frequencies.get(word) ?? 0) + 1));
    const recurringLanguage = [...frequencies.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([word]) => word);
    const questions = entries
      .flatMap((entry) => entry.segments)
      .filter((segment) => segment.words.includes("?"))
      .map((segment) => segment.words)
      .slice(-12);

    return Object.freeze({
      id: this.#deps.ids.create("portrait"),
      ownerId,
      createdAt: this.#deps.clock.now().toISOString(),
      sourceCount: entries.length,
      timeRange:
        dates.length > 0 ? { first: dates[0]!, last: dates[dates.length - 1]! } : undefined,
      confirmedPatterns: patterns.filter((pattern) => pattern.ownerConfirmed),
      provisionalPatterns: patterns.filter((pattern) => !pattern.ownerConfirmed),
      evolution: this.#evolution.filter((arc) => arc.ownerId === ownerId),
      recurringLanguage,
      questionsNickReturnsTo: questions,
      adamInheritance:
        "Adam may inherit the founder's demonstrated devotion to truth, responsibility, structure, protection, building, and accountable action—only where supported by cited material.",
      eveInheritance:
        "Eve may inherit the founder's demonstrated devotion to compassion, connection, meaning, imagination, gratitude, and human becoming—only where supported by cited material.",
      openQuestions: [
        "Which patterns does Nick recognize as truly his?",
        "Which ideas were temporary experiments rather than convictions?",
        "Where has Nick changed, and what prompted that growth?",
        "What must Adam and Eve never infer or carry forward?",
      ],
      coverageWarnings: [
        ...(entries.length < 10 ? ["The source corpus is still small."] : []),
        ...(kinds.size < 3
          ? ["The portrait draws from too few kinds of source; add conversations, writing, and spoken material."]
          : []),
        "Available material reflects what was recorded and shared, not the whole person.",
        "Frequency does not prove importance, endorsement, permanence, or truth.",
      ],
      identityBoundary:
        "This portrait is a source-grounded inheritance, not Nick's soul, consciousness, identity, or authority. Adam and Eve may reflect it but may never impersonate Nick, claim his endorsement, or override the Humanity Laws.",
    });
  }

  quote(entryId: Identifier, excerpt: string): string {
    const entry = this.#entries.get(entryId);
    if (!entry) throw new Error("Inheritance source not found.");
    if (!entry.consentToQuote) throw new Error("This source was not consented for quotation.");
    if (!entry.exactText.includes(excerpt)) throw new Error("The requested words are not exact.");
    return `“${excerpt}” — ${entry.title}, ${entry.occurredAt ?? entry.createdAt}`;
  }

  entries(ownerId: Identifier): readonly InheritanceEntry[] {
    return [...this.#entries.values()].filter((entry) => entry.ownerId === ownerId);
  }

  removeEntry(ownerId: Identifier, entryId: Identifier): boolean {
    const entry = this.#entries.get(entryId);
    if (!entry || entry.ownerId !== ownerId) return false;
    this.#entries.delete(entryId);
    for (const [patternId, pattern] of this.#patterns) {
      if (pattern.evidence.some((evidence) => evidence.entryId === entryId)) {
        this.#patterns.delete(patternId);
      }
    }
    this.#evolution = this.#evolution.filter(
      (arc) => arc.earlier.entryId !== entryId && arc.later.entryId !== entryId,
    );
    return true;
  }

  forgetOwner(ownerId: Identifier): number {
    const ids = this.entries(ownerId).map((entry) => entry.id);
    ids.forEach((id) => this.removeEntry(ownerId, id));
    return ids.length;
  }

  export(ownerId: Identifier): string {
    return JSON.stringify(
      {
        exportedAt: this.#deps.clock.now().toISOString(),
        entries: this.entries(ownerId),
        portrait: this.portrait(ownerId),
      },
      null,
      2,
    );
  }
}
