import {
  clamp,
  defaultDependencies,
  type Domain,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";
import type { PersonalLifeModel } from "./life-model.ts";

export interface DecisionOption {
  readonly id: Identifier;
  readonly title: string;
  readonly description: string;
  readonly benefits: readonly string[];
  readonly costs: readonly string[];
  readonly risks: readonly string[];
  readonly reversibility: number;
  readonly evidenceStrength: number;
  readonly valueAlignment: Readonly<Record<string, number>>;
  readonly bestCase: string;
  readonly expectedCase: string;
  readonly worstCase: string;
}

export interface DecisionQuestion {
  readonly personId: Identifier;
  readonly title: string;
  readonly description: string;
  readonly domains: readonly Domain[];
  readonly stakes: "low" | "medium" | "high" | "critical";
  readonly deadline?: ISODateTime;
  readonly goals: readonly string[];
  readonly values: readonly string[];
  readonly knownFacts: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly options: readonly DecisionOption[];
}

export interface OptionScore {
  readonly optionId: Identifier;
  readonly score: number;
  readonly confidence: number;
  readonly valueFit: number;
  readonly resilience: number;
  readonly evidence: number;
  readonly reversibility: number;
  readonly reasons: readonly string[];
}

export interface DecisionRecord {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly question: DecisionQuestion;
  readonly scores: readonly OptionScore[];
  readonly recommendation: "choose" | "experiment" | "wait" | "seek_help";
  readonly leadingOptionId?: Identifier;
  readonly calibratedProbability?: number;
  readonly confidenceStatement: string;
  readonly missingInformation: readonly string[];
  readonly preMortem: readonly string[];
  readonly smallestSafeExperiment?: string;
  readonly reviewAt: ISODateTime;
  readonly humanChoice?: Identifier;
  readonly humanOwnsDecision: true;
}

export interface DecisionOutcome {
  readonly decisionId: Identifier;
  readonly observedAt: ISODateTime;
  readonly selectedOptionId: Identifier;
  readonly outcomeScore: number;
  readonly expectedOutcomeOccurred: boolean;
  readonly surprise: string;
  readonly lesson: string;
}

export interface CalibrationReport {
  readonly sampleSize: number;
  readonly brierScore?: number;
  readonly calibrationAccuracy?: number;
  readonly note: string;
}

export class DecisionJournal {
  #records = new Map<Identifier, DecisionRecord>();
  #outcomes: DecisionOutcome[] = [];
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  deliberate(question: DecisionQuestion, life?: PersonalLifeModel): DecisionRecord {
    if (!question.title.trim() || question.options.length < 2) {
      throw new Error("A decision needs a clear title and at least two genuine options.");
    }
    const valueSet = [...new Set([...question.values, ...(life?.values ?? [])])];
    const scores = question.options.map((option): OptionScore => {
      const valueFit = valueSet.length
        ? valueSet.reduce(
            (sum, value) => sum + clamp(option.valueAlignment[value] ?? 0.5),
            0,
          ) / valueSet.length
        : 0.5;
      const resilience = clamp(
        1 - option.risks.length * 0.08 + option.reversibility * 0.35,
      );
      const evidence = clamp(option.evidenceStrength);
      const reversibility = clamp(option.reversibility);
      const base =
        valueFit * 0.35 + resilience * 0.25 + evidence * 0.25 + reversibility * 0.15;
      const uncertaintyPenalty = Math.min(0.3, question.unknowns.length * 0.04);
      const score = clamp(base - uncertaintyPenalty);
      return Object.freeze({
        optionId: option.id,
        score: Number(score.toFixed(3)),
        confidence: Number(
          clamp(evidence * 0.55 + (1 - uncertaintyPenalty) * 0.45).toFixed(3),
        ),
        valueFit: Number(valueFit.toFixed(3)),
        resilience: Number(resilience.toFixed(3)),
        evidence: Number(evidence.toFixed(3)),
        reversibility: Number(reversibility.toFixed(3)),
        reasons: [
          `Value fit: ${Math.round(valueFit * 100)}%.`,
          `Evidence strength: ${Math.round(evidence * 100)}%.`,
          `Reversibility: ${Math.round(reversibility * 100)}%.`,
          `${option.risks.length} explicit risk(s) considered.`,
        ],
      });
    });
    const ranked = [...scores].sort((a, b) => b.score - a.score);
    const leader = ranked[0];
    const runnerUp = ranked[1];
    const margin = leader && runnerUp ? leader.score - runnerUp.score : 0;
    const highStakes = question.stakes === "high" || question.stakes === "critical";
    const recommendation: DecisionRecord["recommendation"] =
      highStakes && (question.unknowns.length >= 3 || (leader?.confidence ?? 0) < 0.65)
        ? "seek_help"
        : margin < 0.08
          ? "experiment"
          : question.unknowns.length >= 4
            ? "wait"
            : "choose";
    const now = this.#deps.clock.now();
    const reviewDays =
      question.stakes === "critical" ? 1 : question.stakes === "high" ? 7 : 30;
    const reviewAt = new Date(now.getTime() + reviewDays * 86_400_000).toISOString();
    const probability =
      leader && recommendation !== "seek_help"
        ? clamp(0.5 + leader.score * 0.35 + margin * 0.3 - question.unknowns.length * 0.025)
        : undefined;
    const record: DecisionRecord = Object.freeze({
      id: this.#deps.ids.create("decision"),
      createdAt: now.toISOString(),
      question,
      scores,
      recommendation,
      leadingOptionId: leader?.optionId,
      calibratedProbability:
        probability === undefined ? undefined : Number(probability.toFixed(3)),
      confidenceStatement:
        probability === undefined
          ? "The available information is insufficient for a responsible probability."
          : `Estimated chance of a satisfactory outcome is ${Math.round(
              probability * 100,
            )}%, conditional on the stated facts and assumptions—not a guarantee.`,
      missingInformation: question.unknowns,
      preMortem: question.options.flatMap((option) =>
        option.risks.map((risk) => `If “${option.title}” fails, ${risk}`),
      ),
      smallestSafeExperiment:
        recommendation === "experiment"
          ? "Test the most reversible distinguishing assumption before committing."
          : undefined,
      reviewAt,
      humanOwnsDecision: true,
    });
    this.#records.set(record.id, record);
    return record;
  }

  recordChoice(decisionId: Identifier, optionId: Identifier): DecisionRecord {
    const record = this.#records.get(decisionId);
    if (!record || !record.question.options.some((option) => option.id === optionId)) {
      throw new Error("Decision or option not found.");
    }
    const updated = Object.freeze({ ...record, humanChoice: optionId });
    this.#records.set(decisionId, updated);
    return updated;
  }

  recordOutcome(outcome: DecisionOutcome): void {
    if (!this.#records.has(outcome.decisionId)) throw new Error("Decision not found.");
    this.#outcomes.push(
      Object.freeze({ ...outcome, outcomeScore: clamp(outcome.outcomeScore) }),
    );
  }

  calibration(): CalibrationReport {
    const pairs = this.#outcomes
      .map((outcome) => {
        const decision = this.#records.get(outcome.decisionId);
        if (decision?.calibratedProbability === undefined) return undefined;
        return {
          predicted: decision.calibratedProbability,
          actual: outcome.expectedOutcomeOccurred ? 1 : 0,
        };
      })
      .filter((item): item is { predicted: number; actual: number } => item !== undefined);
    if (pairs.length === 0) {
      return Object.freeze({
        sampleSize: 0,
        note: "No scored outcomes exist yet. The system must not claim calibrated accuracy.",
      });
    }
    const brier =
      pairs.reduce((sum, pair) => sum + (pair.predicted - pair.actual) ** 2, 0) /
      pairs.length;
    return Object.freeze({
      sampleSize: pairs.length,
      brierScore: Number(brier.toFixed(4)),
      calibrationAccuracy: Number(clamp(1 - brier).toFixed(4)),
      note:
        "Calibration measures probability honesty over this sample; it does not prove correctness for every person or future decision.",
    });
  }

  get(id: Identifier): DecisionRecord | undefined {
    return this.#records.get(id);
  }
}

