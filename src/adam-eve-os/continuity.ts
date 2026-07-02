import {
  defaultDependencies,
  type Domain,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export interface ContinuityMilestone {
  readonly id: Identifier;
  readonly date: ISODateTime;
  readonly domain: Domain;
  readonly invitation: string;
  readonly purpose: string;
  readonly optional: true;
}

export interface YearOfContinuity {
  readonly id: Identifier;
  readonly personId: Identifier;
  readonly beginsAt: ISODateTime;
  readonly endsAt: ISODateTime;
  readonly milestones: readonly ContinuityMilestone[];
  readonly rhythms: readonly string[];
  readonly dependencySafeguards: readonly string[];
  readonly successDefinition: string;
}

export class ContinuityEngine {
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  createYear(personId: Identifier, beginsAt = this.#deps.clock.now()): YearOfContinuity {
    const domains: readonly Domain[] = [
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
    const invitations: Readonly<Record<Domain, string>> = {
      identity: "What remains true about you, and what is changing?",
      relationships: "Which relationship needs gratitude, truth, repair, or a boundary?",
      health: "What does your body need you to notice without judgment?",
      mind: "What pattern of thought deserves curiosity rather than obedience?",
      spirit: "Where do awe, meaning, conscience, or mystery meet your life?",
      learning: "What would you love to understand well enough to use or teach?",
      work: "What work serves your life, values, craft, and responsibilities?",
      money: "What would greater financial safety and freedom make possible?",
      home: "What would make your living environment more supportive and alive?",
      community: "Where can you receive belonging and offer contribution?",
      creativity: "What wants to be made, played, written, built, or expressed?",
      future: "What future are your repeated choices quietly constructing?",
    };
    const milestones: ContinuityMilestone[] = [];
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(beginsAt);
      date.setUTCMonth(date.getUTCMonth() + month);
      const domain = domains[month] ?? "future";
      milestones.push(
        Object.freeze({
          id: this.#deps.ids.create("milestone"),
          date: date.toISOString(),
          domain,
          invitation: invitations[domain],
          purpose: "Notice, choose one proportionate step, and preserve the person's authorship.",
          optional: true,
        }),
      );
    }
    const ends = new Date(beginsAt);
    ends.setUTCFullYear(ends.getUTCFullYear() + 1);
    return Object.freeze({
      id: this.#deps.ids.create("year"),
      personId,
      beginsAt: beginsAt.toISOString(),
      endsAt: ends.toISOString(),
      milestones,
      rhythms: [
        "Daily: available only on request; silence and ordinary life are honored.",
        "Weekly: one optional check-in on what helped, hurt, changed, or matters now.",
        "Monthly: one life-domain reflection and one reversible experiment.",
        "Quarterly: review goals, boundaries, memory permissions, and system usefulness.",
        "Yearly: export, renew consent, revise the covenant, or leave completely.",
        "Always: faithfulness is measured through honest return and repair—not flawless streaks.",
      ],
      dependencySafeguards: [
        "Never reward streaks, screen time, disclosure, devotion, or exclusive reliance.",
        "Encourage trusted human relationships, community, and professional support.",
        "Offer fewer interventions as the person gains confidence and capability.",
        "Make absence normal: no guilt, abandonment language, or simulated distress.",
        "Success is increased human agency—not retention, engagement, or emotional dependence.",
      ],
      successDefinition:
        "After one year, the person understands themselves better, makes more deliberate decisions, retains ownership of memory, strengthens human connection, and can thrive with less system involvement.",
    });
  }
}
