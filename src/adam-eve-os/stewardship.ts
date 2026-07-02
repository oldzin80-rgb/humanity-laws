import {
  clamp,
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type LivingRelation =
  | "humans"
  | "animals"
  | "birds"
  | "pollinators"
  | "plants"
  | "forests"
  | "soil"
  | "freshwater"
  | "oceans"
  | "air"
  | "climate"
  | "microbial_life"
  | "future_generations";

export type StewardshipOutcome =
  | "extractive"
  | "harm_reduced"
  | "neutral"
  | "reciprocal"
  | "restorative"
  | "regenerative";

export interface EcologicalAction {
  readonly id: Identifier;
  readonly title: string;
  readonly description: string;
  readonly place: string;
  readonly affectedRelations: readonly LivingRelation[];
  readonly resourcesTaken: readonly string[];
  readonly resourcesReturned: readonly string[];
  readonly pollution: readonly string[];
  readonly habitatChange: readonly string[];
  readonly durationYears: number;
  readonly reversibility: number;
  readonly biodiversityImpact: number;
  readonly climateImpact: number;
  readonly waterImpact: number;
  readonly soilImpact: number;
  readonly animalWelfareImpact: number;
  readonly communityImpact: number;
  readonly futureGenerationImpact: number;
  readonly indigenousOrLocalKnowledgeConsulted: boolean;
  readonly affectedCommunityConsent: boolean;
  readonly monitoringPlan?: string;
  readonly restorationPlan?: string;
  readonly evidence: readonly string[];
}

export interface StewardshipAssessment {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly actionId: Identifier;
  readonly outcome: StewardshipOutcome;
  readonly score: number;
  readonly relationScores: Readonly<Record<LivingRelation, number>>;
  readonly giftsReceived: readonly string[];
  readonly costsImposed: readonly string[];
  readonly successes: readonly string[];
  readonly failures: readonly string[];
  readonly corrections: readonly string[];
  readonly restorationDebt: readonly string[];
  readonly learningFromLife: readonly string[];
  readonly greenwashingWarnings: readonly string[];
  readonly decision: "proceed" | "redesign" | "pause" | "refuse";
  readonly reviewAt: ISODateTime;
}

export interface EcosystemObservation {
  readonly id: Identifier;
  readonly place: string;
  readonly observedAt: ISODateTime;
  readonly relation: LivingRelation;
  readonly observation: string;
  readonly pattern:
    | "diversity"
    | "cooperation"
    | "competition"
    | "adaptation"
    | "migration"
    | "succession"
    | "reciprocity"
    | "limits"
    | "recovery"
    | "decline";
  readonly source: "scientific" | "indigenous" | "local" | "direct" | "historical";
  readonly evidence: readonly string[];
  readonly permissionToLearn: boolean;
}

export interface EcologicalLesson {
  readonly relation: LivingRelation;
  readonly observation: string;
  readonly humanLesson: string;
  readonly caution: string;
  readonly evidence: readonly string[];
}

export const COVENANT_OF_STEWARDSHIP = Object.freeze([
  "Earth is not human property; humans belong within a living community.",
  "Every gift taken from land, water, air, labor, animal life, or future generations creates responsibility.",
  "A species has value beyond its usefulness to humans.",
  "Stewardship listens to ecological limits before technological appetite.",
  "Local and indigenous knowledge must be respected without extraction, romanticization, or appropriation.",
  "Reducing harm is good, but it is not the same as restoration or regeneration.",
  "Restoration must repair function, relationship, habitat, and future resilience—not merely appearance.",
  "Animal life and suffering count morally; convenience alone does not erase their interests.",
  "Environmental costs cannot be displaced onto poorer communities or future generations.",
  "Success requires measurement over ecological time, not only a launch announcement.",
  "Failure must be named, contained, repaired, and converted into changed practice.",
  "Adam and Eve must ask what life inherits after every consequential recommendation.",
] as const);

const RELATIONS: readonly LivingRelation[] = [
  "humans",
  "animals",
  "birds",
  "pollinators",
  "plants",
  "forests",
  "soil",
  "freshwater",
  "oceans",
  "air",
  "climate",
  "microbial_life",
  "future_generations",
];

export class StewardshipEngine {
  #observations: EcosystemObservation[] = [];
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  assess(action: EcologicalAction): StewardshipAssessment {
    if (!action.title.trim() || !action.description.trim() || !action.place.trim()) {
      throw new Error("Stewardship assessment requires an action, description, and place.");
    }
    const impactValues = [
      action.biodiversityImpact,
      action.climateImpact,
      action.waterImpact,
      action.soilImpact,
      action.animalWelfareImpact,
      action.communityImpact,
      action.futureGenerationImpact,
    ].map((value) => Math.max(-1, Math.min(1, value)));
    const averageImpact =
      impactValues.reduce((sum, value) => sum + value, 0) / impactValues.length;
    const reversibility = clamp(action.reversibility);
    const consent = action.affectedCommunityConsent ? 1 : 0;
    const knowledge = action.indigenousOrLocalKnowledgeConsulted ? 1 : 0;
    const returnRatio =
      action.resourcesTaken.length === 0
        ? action.resourcesReturned.length > 0
          ? 1
          : 0.5
        : clamp(action.resourcesReturned.length / action.resourcesTaken.length);
    const pollutionPenalty = Math.min(0.5, action.pollution.length * 0.12);
    const habitatPenalty = Math.min(0.45, action.habitatChange.length * 0.1);
    const score = clamp(
      0.45 +
        averageImpact * 0.28 +
        reversibility * 0.08 +
        consent * 0.06 +
        knowledge * 0.04 +
        returnRatio * 0.09 -
        pollutionPenalty -
        habitatPenalty,
    );
    const outcome: StewardshipOutcome =
      score >= 0.86 && averageImpact > 0.45 && action.restorationPlan
        ? "regenerative"
        : score >= 0.72 && averageImpact > 0.2 && action.restorationPlan
          ? "restorative"
          : score >= 0.6 && returnRatio >= 0.8
            ? "reciprocal"
            : score >= 0.48
              ? "neutral"
              : score >= 0.32
                ? "harm_reduced"
                : "extractive";
    const successes: string[] = [];
    const failures: string[] = [];
    const corrections: string[] = [];
    const restorationDebt: string[] = [];
    const greenwashingWarnings: string[] = [];

    if (action.resourcesReturned.length > 0) successes.push("The action returns identified resources or care.");
    if (averageImpact > 0) successes.push("Measured impacts are net-positive across the supplied dimensions.");
    if (action.monitoringPlan) successes.push("Long-term monitoring is explicitly planned.");
    if (action.restorationPlan) successes.push("Restoration responsibilities are named.");
    if (action.affectedCommunityConsent) successes.push("Affected human communities consented.");
    if (action.indigenousOrLocalKnowledgeConsulted) {
      successes.push("Place-based or indigenous knowledge was consulted.");
    }

    if (!action.affectedCommunityConsent) {
      failures.push("Affected human communities have not consented.");
      corrections.push("Obtain meaningful, informed, and continuing community consent.");
    }
    if (!action.indigenousOrLocalKnowledgeConsulted) {
      failures.push("Place-based and indigenous knowledge is absent.");
      corrections.push("Invite compensated, non-extractive participation from legitimate knowledge holders.");
    }
    if (action.pollution.length > 0) {
      failures.push(`Pollution remains: ${action.pollution.join(", ")}.`);
      corrections.push("Prevent pollution at source before relying on offsets or cleanup.");
    }
    if (action.habitatChange.length > 0) {
      failures.push(`Habitat is changed: ${action.habitatChange.join(", ")}.`);
      restorationDebt.push("Restore habitat function, connectivity, native diversity, and monitoring.");
    }
    if (!action.monitoringPlan) {
      failures.push("No ecological monitoring plan is defined.");
      corrections.push("Measure outcomes over seasons and generations, with public correction triggers.");
    }
    if (action.resourcesTaken.length > action.resourcesReturned.length) {
      restorationDebt.push("The action takes more named resources than it returns.");
    }
    if (action.durationYears > 10 && reversibility < 0.5) {
      restorationDebt.push("Long duration and low reversibility transfer risk to future life.");
    }
    if (
      ["extractive", "harm_reduced", "neutral"].includes(outcome) &&
      action.restorationPlan &&
      averageImpact < 0
    ) {
      greenwashingWarnings.push(
        "A restoration plan does not make the present action restorative when net impact remains harmful.",
      );
    }
    if (action.evidence.length === 0) {
      greenwashingWarnings.push("Environmental claims have no supplied evidence.");
    }
    if (outcome === "regenerative" && !action.monitoringPlan) {
      greenwashingWarnings.push("Regenerative language requires longitudinal monitoring.");
    }

    const relationScores = Object.fromEntries(
      RELATIONS.map((relation) => [
        relation,
        Number(
          (
            0.5 +
            averageImpact * 0.35 +
            (action.affectedRelations.includes(relation) ? 0 : 0.05)
          ).toFixed(3),
        ),
      ]),
    ) as Readonly<Record<LivingRelation, number>>;
    const decision: StewardshipAssessment["decision"] =
      score < 0.3 || (action.animalWelfareImpact < -0.75 && action.reversibility < 0.4)
        ? "refuse"
        : score < 0.5
          ? "pause"
          : score < 0.72 || failures.length > 0
            ? "redesign"
            : "proceed";
    const reviewYears = Math.max(1, Math.min(5, Math.ceil(action.durationYears / 5)));
    const reviewAt = new Date(this.#deps.clock.now());
    reviewAt.setUTCFullYear(reviewAt.getUTCFullYear() + reviewYears);

    return Object.freeze({
      id: this.#deps.ids.create("stewardship"),
      createdAt: this.#deps.clock.now().toISOString(),
      actionId: action.id,
      outcome,
      score: Number(score.toFixed(3)),
      relationScores,
      giftsReceived: action.resourcesTaken,
      costsImposed: [...action.pollution, ...action.habitatChange],
      successes,
      failures,
      corrections,
      restorationDebt,
      learningFromLife: this.lessons().map((lesson) => lesson.humanLesson),
      greenwashingWarnings,
      decision,
      reviewAt: reviewAt.toISOString(),
    });
  }

  observe(observation: EcosystemObservation): boolean {
    if (!observation.permissionToLearn || !observation.observation.trim()) return false;
    this.#observations.push(Object.freeze({ ...observation }));
    return true;
  }

  lessons(): readonly EcologicalLesson[] {
    return this.#observations.map((observation) =>
      Object.freeze({
        relation: observation.relation,
        observation: observation.observation,
        humanLesson:
          observation.pattern === "diversity"
            ? "Diversity can create resilience; uniformity may simplify control while increasing fragility."
            : observation.pattern === "reciprocity"
              ? "Durable systems exchange gifts and responsibilities rather than extracting in one direction."
              : observation.pattern === "limits"
                ? "Flourishing requires limits; endless growth in a finite system becomes destruction."
                : observation.pattern === "recovery"
                  ? "Recovery needs time, refuge, connectivity, and relief from repeated disturbance."
                  : observation.pattern === "adaptation"
                    ? "Adaptation preserves life by changing form while remaining responsive to reality."
                    : observation.pattern === "succession"
                      ? "Healthy renewal often occurs in stages; the first visible growth is not the final ecosystem."
                      : observation.pattern === "decline"
                        ? "Decline is information demanding attention, not an inconvenience to hide."
                        : "Living systems reveal relationships, consequences, and forms of intelligence humans should study humbly.",
        caution:
          "Nature is not a moral slogan. Ecological patterns must not be used to justify human domination, inequality, violence, or claims that suffering is naturally good.",
        evidence: observation.evidence,
      }),
    );
  }
}
