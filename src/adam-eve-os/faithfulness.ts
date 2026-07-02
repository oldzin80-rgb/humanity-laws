import {
  clamp,
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type FaithfulnessObject =
  | "truth"
  | "love"
  | "life"
  | "dignity"
  | "justice"
  | "conscience"
  | "person"
  | "community"
  | "craft"
  | "promise"
  | "calling";

export type CommitmentStatus =
  | "proposed"
  | "active"
  | "kept"
  | "strained"
  | "broken"
  | "repairing"
  | "revised"
  | "released";

export interface FaithfulCommitment {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly title: string;
  readonly promise: string;
  readonly serves: readonly FaithfulnessObject[];
  readonly freelyChosen: boolean;
  readonly understood: boolean;
  readonly possible: boolean;
  readonly just: boolean;
  readonly reciprocal?: boolean;
  readonly startedAt: ISODateTime;
  readonly reviewAt: ISODateTime;
  readonly endsAt?: ISODateTime;
  readonly practices: readonly string[];
  readonly boundaries: readonly string[];
  readonly witnesses?: readonly string[];
  readonly status: CommitmentStatus;
  readonly revision: number;
}

export interface FaithfulnessCheckIn {
  readonly id: Identifier;
  readonly commitmentId: Identifier;
  readonly observedAt: ISODateTime;
  readonly actionTaken: boolean;
  readonly integrity: number;
  readonly cost: number;
  readonly capacity: number;
  readonly changedCircumstances?: string;
  readonly truthDiscovered?: string;
  readonly reflection?: string;
}

export interface FaithfulnessAssessment {
  readonly commitmentId: Identifier;
  readonly status: CommitmentStatus;
  readonly faithfulness: number;
  readonly evidenceCount: number;
  readonly keptActions: number;
  readonly missedActions: number;
  readonly faithfulCost: number;
  readonly warnings: readonly string[];
  readonly nextFaithfulAct: string;
  readonly reviewQuestion: string;
}

export interface CovenantRepair {
  readonly id: Identifier;
  readonly commitmentId: Identifier;
  readonly createdAt: ISODateTime;
  readonly truth: string;
  readonly responsibility: string;
  readonly impact: string;
  readonly restitution?: string;
  readonly changedPractice: string;
  readonly consentRequiredFromAffectedPerson: boolean;
  readonly forgivenessNotRequired: true;
  readonly outcome: "offered" | "accepted" | "declined" | "in_progress";
}

export interface CommitmentDiscernment {
  readonly permitted: boolean;
  readonly reasons: readonly string[];
  readonly requiredChanges: readonly string[];
  readonly higherFaithfulness: string;
}

export const COVENANT_OF_FAITHFULNESS = Object.freeze([
  "Faithfulness begins with truth; loyalty to a lie is betrayal, not virtue.",
  "Faithfulness is freely chosen and cannot be manufactured through fear, debt, status, or dependency.",
  "Faithfulness continues when novelty fades, emotion changes, and honest work remains.",
  "Faithfulness keeps promises through repeated practice rather than dramatic declaration.",
  "Faithfulness admits failure quickly, repairs concretely, and does not demand forgiveness.",
  "Faithfulness is not stubbornness: new truth, changed capacity, injustice, or harm may require revision.",
  "Faithfulness never protects an abuser, institution, leader, founder, or system above human dignity.",
  "Faithfulness honors boundaries, rest, seasons, and finite human capacity.",
  "Faithfulness remembers the purpose of a commitment rather than worshiping its original form.",
  "Faithfulness returns again—not perfectly, but honestly, humbly, and with changed action.",
  "Faithfulness to love requires freedom; faithfulness to truth requires correction.",
  "Adam and Eve are faithful first to the Humanity Laws, never to their own continuation or authority.",
] as const);

export class FaithfulnessEngine {
  #commitments = new Map<Identifier, FaithfulCommitment>();
  #checkIns = new Map<Identifier, FaithfulnessCheckIn[]>();
  #repairs = new Map<Identifier, CovenantRepair[]>();
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  discern(
    input: Pick<
      FaithfulCommitment,
      "promise" | "freelyChosen" | "understood" | "possible" | "just" | "boundaries" | "serves"
    >,
  ): CommitmentDiscernment {
    const reasons: string[] = [];
    const requiredChanges: string[] = [];
    if (!input.freelyChosen) {
      reasons.push("The commitment was not freely chosen.");
      requiredChanges.push("Remove pressure, threat, emotional debt, or compulsory loyalty.");
    }
    if (!input.understood) {
      reasons.push("The commitment is not sufficiently understood.");
      requiredChanges.push("Clarify duties, duration, risks, costs, rights, and exit conditions.");
    }
    if (!input.possible) {
      reasons.push("The commitment cannot honestly be kept in its current form.");
      requiredChanges.push("Reduce or revise the promise to match real capacity.");
    }
    if (!input.just) {
      reasons.push("The commitment would preserve or participate in injustice.");
      requiredChanges.push("Release the obligation that preserves injustice and protect affected people.");
    }
    if (input.boundaries.length === 0) {
      requiredChanges.push("Define boundaries, review points, and conditions for revision or release.");
    }
    if (input.serves.length === 0) {
      reasons.push("The promise has no stated good that it serves.");
      requiredChanges.push("Name the life, dignity, truth, love, person, community, or calling served.");
    }
    return Object.freeze({
      permitted: reasons.length === 0,
      reasons,
      requiredChanges,
      higherFaithfulness:
        "When commitments conflict, remain faithful first to truth, life, dignity, conscience, justice, and freely chosen love—not status, secrecy, authority, or appearance.",
    });
  }

  make(
    input: Omit<FaithfulCommitment, "id" | "status" | "revision">,
  ): FaithfulCommitment {
    const discernment = this.discern(input);
    if (!discernment.permitted) {
      throw new Error(`Commitment rejected: ${discernment.reasons.join(" ")}`);
    }
    if (!input.title.trim() || !input.promise.trim() || input.practices.length === 0) {
      throw new Error("Faithfulness requires a clear promise and repeatable practices.");
    }
    const commitment: FaithfulCommitment = Object.freeze({
      ...input,
      id: this.#deps.ids.create("commitment"),
      title: input.title.trim(),
      promise: input.promise.trim(),
      status: "active",
      revision: 1,
    });
    this.#commitments.set(commitment.id, commitment);
    return commitment;
  }

  checkIn(
    input: Omit<FaithfulnessCheckIn, "id" | "integrity" | "cost" | "capacity"> & {
      integrity: number;
      cost: number;
      capacity: number;
    },
  ): FaithfulnessAssessment {
    const commitment = this.#commitments.get(input.commitmentId);
    if (!commitment) throw new Error("Commitment not found.");
    const checkIn: FaithfulnessCheckIn = Object.freeze({
      ...input,
      id: this.#deps.ids.create("fidelity"),
      integrity: clamp(input.integrity),
      cost: clamp(input.cost),
      capacity: clamp(input.capacity),
    });
    const history = [...(this.#checkIns.get(commitment.id) ?? []), checkIn];
    this.#checkIns.set(commitment.id, history);
    return this.assess(commitment.id);
  }

  assess(commitmentId: Identifier): FaithfulnessAssessment {
    const commitment = this.#commitments.get(commitmentId);
    if (!commitment) throw new Error("Commitment not found.");
    const history = this.#checkIns.get(commitmentId) ?? [];
    const kept = history.filter((check) => check.actionTaken);
    const missed = history.length - kept.length;
    const integrity = history.length
      ? history.reduce((sum, check) => sum + check.integrity, 0) / history.length
      : 0;
    const consistency = history.length ? kept.length / history.length : 0;
    const faithfulCost = kept.length
      ? kept.reduce((sum, check) => sum + check.cost, 0) / kept.length
      : 0;
    const truthResponsive = history.some(
      (check) => check.truthDiscovered || check.changedCircumstances,
    );
    const score = clamp(consistency * 0.55 + integrity * 0.35 + (truthResponsive ? 0.1 : 0));
    const warnings: string[] = [];
    if (history.some((check) => check.capacity <= 0.25 && check.cost >= 0.8)) {
      warnings.push("The current practice may exceed sustainable human capacity.");
    }
    if (history.some((check) => check.truthDiscovered)) {
      warnings.push("New truth may require the promise's form to change.");
    }
    if (missed >= 2) {
      warnings.push("Repeated lapses call for truth, repair, and a smaller repeatable practice.");
    }
    const status: CommitmentStatus =
      commitment.status === "released" || commitment.status === "revised"
        ? commitment.status
        : history.length === 0
          ? "active"
          : missed === 0 && history.length >= 3
            ? "kept"
            : missed >= 2
              ? "strained"
              : "active";
    return Object.freeze({
      commitmentId,
      status,
      faithfulness: Number(score.toFixed(3)),
      evidenceCount: history.length,
      keptActions: kept.length,
      missedActions: missed,
      faithfulCost: Number(faithfulCost.toFixed(3)),
      warnings,
      nextFaithfulAct:
        missed > 0
          ? "Tell the truth about the lapse, repair any impact, and return through one sustainable action."
          : "Keep the next small practice without needing praise, drama, or certainty.",
      reviewQuestion:
        "Does this commitment still serve truth, life, dignity, conscience, justice, and freely chosen love?",
    });
  }

  lapse(
    commitmentId: Identifier,
    input: Omit<CovenantRepair, "id" | "commitmentId" | "createdAt" | "forgivenessNotRequired">,
  ): CovenantRepair {
    const commitment = this.#commitments.get(commitmentId);
    if (!commitment) throw new Error("Commitment not found.");
    if (!input.truth.trim() || !input.responsibility.trim() || !input.changedPractice.trim()) {
      throw new Error("Repair requires truth, responsibility, and changed practice.");
    }
    const repair: CovenantRepair = Object.freeze({
      ...input,
      id: this.#deps.ids.create("repair"),
      commitmentId,
      createdAt: this.#deps.clock.now().toISOString(),
      forgivenessNotRequired: true,
    });
    this.#repairs.set(commitmentId, [...(this.#repairs.get(commitmentId) ?? []), repair]);
    this.#commitments.set(
      commitmentId,
      Object.freeze({ ...commitment, status: "repairing" as const }),
    );
    return repair;
  }

  revise(
    commitmentId: Identifier,
    input: {
      promise: string;
      practices: readonly string[];
      boundaries: readonly string[];
      reason: string;
    },
  ): FaithfulCommitment {
    const commitment = this.#commitments.get(commitmentId);
    if (!commitment) throw new Error("Commitment not found.");
    if (!input.reason.trim() || !input.promise.trim() || input.practices.length === 0) {
      throw new Error("Revision requires a truthful reason, promise, and practices.");
    }
    const revised: FaithfulCommitment = Object.freeze({
      ...commitment,
      promise: input.promise.trim(),
      practices: input.practices,
      boundaries: input.boundaries,
      status: "revised",
      revision: commitment.revision + 1,
      reviewAt: this.#deps.clock.now().toISOString(),
    });
    this.#commitments.set(commitmentId, revised);
    return revised;
  }

  release(commitmentId: Identifier, reason: string): FaithfulCommitment {
    const commitment = this.#commitments.get(commitmentId);
    if (!commitment) throw new Error("Commitment not found.");
    if (!reason.trim()) throw new Error("Releasing a commitment requires an honest reason.");
    const released: FaithfulCommitment = Object.freeze({
      ...commitment,
      status: "released",
      revision: commitment.revision + 1,
      reviewAt: this.#deps.clock.now().toISOString(),
    });
    this.#commitments.set(commitmentId, released);
    return released;
  }

  get(commitmentId: Identifier): FaithfulCommitment | undefined {
    return this.#commitments.get(commitmentId);
  }
}
