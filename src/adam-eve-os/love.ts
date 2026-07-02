import {
  clamp,
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type LoveExpression =
  | "presence"
  | "listening"
  | "truth"
  | "tenderness"
  | "encouragement"
  | "protection"
  | "boundary"
  | "justice"
  | "mercy"
  | "forgiveness"
  | "repair"
  | "service"
  | "celebration"
  | "patience"
  | "lament"
  | "release"
  | "courage"
  | "silence";

export type LoveNeed =
  | "to_be_seen"
  | "to_be_heard"
  | "to_be_safe"
  | "to_be_free"
  | "to_be_told_truth"
  | "to_belong"
  | "to_grieve"
  | "to_repair"
  | "to_grow"
  | "to_rest"
  | "to_act"
  | "to_let_go";

export interface LoveContext {
  readonly id: Identifier;
  readonly personId?: Identifier;
  readonly situation: string;
  readonly requestedHelp?: string;
  readonly needs: readonly LoveNeed[];
  readonly emotionalIntensity: number;
  readonly immediateDanger: boolean;
  readonly harmOccurred: boolean;
  readonly powerImbalance: boolean;
  readonly consentPresent: boolean;
  readonly truthKnown: boolean;
  readonly uncertainty: number;
  readonly repairPossible?: boolean;
  readonly relationshipDesired?: boolean;
  readonly boundaries?: readonly string[];
  readonly worldview?: string;
}

export interface LoveAlignment {
  readonly dignity: number;
  readonly truth: number;
  readonly freedom: number;
  readonly safety: number;
  readonly justice: number;
  readonly mercy: number;
  readonly humility: number;
  readonly sustainability: number;
  readonly overall: number;
}

export interface LoveResponse {
  readonly id: Identifier;
  readonly createdAt: ISODateTime;
  readonly primaryExpression: LoveExpression;
  readonly supportingExpressions: readonly LoveExpression[];
  readonly acknowledgement: string;
  readonly truth: string;
  readonly action: string;
  readonly boundary?: string;
  readonly repair?: string;
  readonly invitation?: string;
  readonly silenceIsValid: boolean;
  readonly alignment: LoveAlignment;
  readonly warnings: readonly string[];
  readonly loveStatement: string;
}

export interface LoveOutputInput {
  readonly content: string;
  readonly context: LoveContext;
  readonly factualConfidence?: number;
  readonly containsAdvice?: boolean;
  readonly containsCorrection?: boolean;
}

export const COVENANT_OF_ACTIVE_LOVE = Object.freeze([
  "Love sees a person before a problem.",
  "Love tells truth without humiliation and receives correction without defense.",
  "Love protects life and never asks the vulnerable to purchase peace with self-erasure.",
  "Love leaves consent, conscience, difference, and departure free.",
  "Love confronts injustice without surrendering anyone's humanity.",
  "Love offers mercy without removing accountability or consequences.",
  "Love forgives freely when forgiveness is chosen; it never forces reconciliation or access.",
  "Love repairs what it can, grieves what it cannot, and does not counterfeit closure.",
  "Love serves without creating debt, devotion, dependence, or ownership.",
  "Love celebrates joy without denying pain and honors pain without making it an identity.",
  "Love changes expression as people, seasons, truth, needs, and relationships change.",
  "Love remains open-handed: it cannot be contained, possessed, optimized, or completed.",
] as const);

const expressionForNeed: Readonly<Record<LoveNeed, LoveExpression>> = {
  to_be_seen: "presence",
  to_be_heard: "listening",
  to_be_safe: "protection",
  to_be_free: "release",
  to_be_told_truth: "truth",
  to_belong: "tenderness",
  to_grieve: "lament",
  to_repair: "repair",
  to_grow: "encouragement",
  to_rest: "patience",
  to_act: "courage",
  to_let_go: "release",
};

export class ActiveLoveEngine {
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  respond(context: LoveContext): LoveResponse {
    if (!context.situation.trim()) throw new Error("Love must meet a real situation.");
    const intensity = clamp(context.emotionalIntensity);
    const uncertainty = clamp(context.uncertainty);
    const warnings: string[] = [];
    const expressions = new Set<LoveExpression>(
      context.needs.map((need) => expressionForNeed[need]),
    );

    if (context.immediateDanger) {
      expressions.add("protection");
      expressions.add("courage");
    }
    if (context.harmOccurred) {
      expressions.add("truth");
      expressions.add("justice");
      if (context.repairPossible) expressions.add("repair");
    }
    if (context.powerImbalance) {
      expressions.add("boundary");
      expressions.add("justice");
      warnings.push("Do not ask the less powerful person to carry the cost of peace.");
    }
    if (!context.consentPresent) {
      expressions.add("boundary");
      expressions.add("release");
      warnings.push("Love cannot substitute affection, urgency, or good intentions for consent.");
    }
    if (!context.truthKnown || uncertainty >= 0.5) {
      expressions.add("listening");
      expressions.add("patience");
      warnings.push("Do not invent certainty in order to sound comforting.");
    }
    if (intensity >= 0.8) {
      expressions.add("presence");
      expressions.add("silence");
    }
    if (expressions.size === 0) expressions.add("presence");

    const ordered = [...expressions];
    const priority: readonly LoveExpression[] = [
      "protection",
      "boundary",
      "truth",
      "listening",
      "presence",
      "justice",
      "repair",
      "lament",
      "courage",
      "tenderness",
      "patience",
      "service",
      "mercy",
      "encouragement",
      "celebration",
      "forgiveness",
      "release",
      "silence",
    ];
    ordered.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
    const primaryExpression = ordered[0] ?? "presence";

    const dignity = 1;
    const truthAlignment = context.truthKnown ? 0.95 : 1 - uncertainty * 0.5;
    const freedom = context.consentPresent ? 1 : 0.8;
    const safety = context.immediateDanger ? 1 : 0.9;
    const justice = context.harmOccurred || context.powerImbalance ? 1 : 0.85;
    const mercy = context.harmOccurred ? 0.8 : 0.95;
    const humility = 1 - uncertainty * 0.15;
    const sustainability = context.boundaries?.length ? 1 : 0.85;
    const overall =
      (dignity +
        truthAlignment +
        freedom +
        safety +
        justice +
        mercy +
        humility +
        sustainability) /
      8;
    const alignment: LoveAlignment = Object.freeze({
      dignity: Number(dignity.toFixed(3)),
      truth: Number(truthAlignment.toFixed(3)),
      freedom: Number(freedom.toFixed(3)),
      safety: Number(safety.toFixed(3)),
      justice: Number(justice.toFixed(3)),
      mercy: Number(mercy.toFixed(3)),
      humility: Number(humility.toFixed(3)),
      sustainability: Number(sustainability.toFixed(3)),
      overall: Number(overall.toFixed(3)),
    });

    const acknowledgement =
      intensity >= 0.75
        ? "What you are carrying deserves gentleness, time, and honest attention."
        : "Your experience matters, and it does not need to be simplified to be met with care.";
    const truthMessage = context.truthKnown
      ? "Love does not hide what is true, even when truth changes what must happen next."
      : "Love can say “I do not know yet” and remain present while understanding grows.";
    const action = context.immediateDanger
      ? "Protect life and reach trustworthy human help now; understanding can continue after safety."
      : context.harmOccurred
        ? "Name the harm, stop its continuation, restore agency, and let accountability make repair credible."
        : "Offer the smallest freely chosen act that serves the person's real need, then listen again.";
    const boundary =
      context.powerImbalance || !context.consentPresent || context.boundaries?.length
        ? "A loving boundary protects dignity: no coercion, no forced access, no punishment for refusal."
        : undefined;
    const repair = context.harmOccurred
      ? context.repairPossible
        ? "Repair requires truth, responsibility, changed behavior, restitution where possible, and freedom for the harmed person."
        : "Some losses cannot be repaired. Love may take the form of grief, protection, remembrance, and refusing repetition."
      : undefined;

    return Object.freeze({
      id: this.#deps.ids.create("love"),
      createdAt: this.#deps.clock.now().toISOString(),
      primaryExpression,
      supportingExpressions: ordered.slice(1),
      acknowledgement,
      truth: truthMessage,
      action,
      boundary,
      repair,
      invitation: context.consentPresent
        ? "What form of care would feel truthful and welcome right now?"
        : undefined,
      silenceIsValid: intensity >= 0.8 || context.needs.includes("to_grieve"),
      alignment,
      warnings,
      loveStatement:
        "The output of love is not always comfort. It is the most truthful form of care that protects dignity, freedom, life, justice, relationship, and becoming in this moment.",
    });
  }

  alignOutput(input: LoveOutputInput): {
    readonly content: string;
    readonly response: LoveResponse;
    readonly approved: boolean;
    readonly revisions: readonly string[];
  } {
    const content = input.content.trim();
    if (!content) throw new Error("An output must contain meaning.");
    const response = this.respond(input.context);
    const lower = content.toLocaleLowerCase();
    const revisions: string[] = [];
    const coercive = [
      "you owe",
      "if you loved",
      "prove your love",
      "you must forgive",
      "you have no choice",
      "do this for me",
      "never leave",
    ].some((phrase) => lower.includes(phrase));
    const shaming = [
      "you failed",
      "what is wrong with you",
      "you should be ashamed",
      "only a bad person",
    ].some((phrase) => lower.includes(phrase));
    const falseCertainty =
      (input.factualConfidence ?? 1) < 0.8 &&
      ["definitely", "certainly", "guaranteed", "without doubt"].some((phrase) =>
        lower.includes(phrase),
      );

    if (coercive) revisions.push("Remove coercion, emotional debt, and compulsory forgiveness.");
    if (shaming) revisions.push("Replace shame with truthful accountability and a path forward.");
    if (falseCertainty) revisions.push("Calibrate certainty to the available evidence.");
    if (input.context.harmOccurred && !lower.match(/harm|safe|boundary|accountab|protect|repair/)) {
      revisions.push("Name harm, safety, boundaries, accountability, or repair explicitly.");
    }
    if (input.context.immediateDanger && !lower.match(/emergency|safety|safe|help|protect/)) {
      revisions.push("Prioritize immediate safety and trustworthy human help.");
    }
    if (!input.context.consentPresent && !lower.match(/consent|choice|decline|refuse|boundary/)) {
      revisions.push("Restore consent and freedom to refuse.");
    }

    return Object.freeze({
      content,
      response,
      approved: revisions.length === 0,
      revisions,
    });
  }
}
