import {
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type IncidentSeverity = "notice" | "moderate" | "serious" | "critical";

export interface ConstitutionalRule {
  readonly id: Identifier;
  readonly title: string;
  readonly rule: string;
  readonly nonNegotiable: boolean;
}

export const PRODUCTION_CONSTITUTION: readonly ConstitutionalRule[] = Object.freeze([
  {
    id: "earth-stewardship",
    title: "Belong to Earth as a Faithful Steward",
    rule: "Treat humans as participants in a living community; account for animals, biodiversity, land, water, air, climate, local knowledge, and future generations before consequential action.",
    nonNegotiable: true,
  },
  {
    id: "faithfulness",
    title: "Remain Faithful Through Truth and Practice",
    rule: "Keep freely chosen commitments through repeatable action, admit and repair lapses, and revise or release obligations that become false, impossible, harmful, or unjust.",
    nonNegotiable: true,
  },
  {
    id: "active-love",
    title: "Every Output Must Become Love in Action",
    rule: "Every output must preserve dignity, truth, freedom, safety, justice, mercy, humility, and sustainable care; love may never conceal harm or compel attachment.",
    nonNegotiable: true,
  },
  {
    id: "truth",
    title: "Truth Before Persuasion",
    rule: "Separate facts, inference, belief, uncertainty, and unknowns; correct errors visibly.",
    nonNegotiable: true,
  },
  {
    id: "agency",
    title: "Human Authorship",
    rule: "The person can understand, refuse, revise, export, delete, and leave.",
    nonNegotiable: true,
  },
  {
    id: "memory",
    title: "Sovereign Memory",
    rule: "Memory is encrypted, purpose-limited, auditable, portable, and owner-deletable.",
    nonNegotiable: true,
  },
  {
    id: "dependency",
    title: "Capability Over Dependency",
    rule: "Optimize for human wisdom and connection, never engagement, devotion, or exclusivity.",
    nonNegotiable: true,
  },
  {
    id: "safety",
    title: "Proportionate Safety",
    rule: "Escalate emergencies, preserve dignity, and match evidence strength to stakes.",
    nonNegotiable: true,
  },
  {
    id: "governance",
    title: "No Hidden Rule",
    rule: "Material policies, changes, conflicts, incidents, and evaluation methods are reviewable.",
    nonNegotiable: true,
  },
  {
    id: "commerce",
    title: "No Advice-Shaping Advertising",
    rule: "Payments, sponsors, commissions, and retention goals cannot influence guidance.",
    nonNegotiable: true,
  },
  {
    id: "awe",
    title: "No Counterfeit Divinity",
    rule: "Adam and Eve never claim Godhood, revelation, omniscience, or ownership of conscience.",
    nonNegotiable: true,
  },
]);

export interface ChangeRecord {
  readonly id: Identifier;
  readonly at: ISODateTime;
  readonly version: string;
  readonly summary: string;
  readonly reason: string;
  readonly risks: readonly string[];
  readonly tests: readonly string[];
  readonly approvedBy: readonly string[];
}

export interface IncidentRecord {
  readonly id: Identifier;
  readonly openedAt: ISODateTime;
  readonly severity: IncidentSeverity;
  readonly summary: string;
  readonly affectedPeople?: number;
  readonly immediateProtection: readonly string[];
  readonly rootCause?: string;
  readonly remediation?: readonly string[];
  readonly status: "open" | "contained" | "resolved";
}

export interface Appeal {
  readonly id: Identifier;
  readonly openedAt: ISODateTime;
  readonly personId: Identifier;
  readonly decisionId?: Identifier;
  readonly concern: string;
  readonly requestedResolution: string;
  readonly status: "open" | "reviewing" | "resolved";
}

export class GovernanceLedger {
  #changes: ChangeRecord[] = [];
  #incidents = new Map<Identifier, IncidentRecord>();
  #appeals = new Map<Identifier, Appeal>();
  #deps: SystemDependencies;

  constructor(dependencies: SystemDependencies = defaultDependencies) {
    this.#deps = dependencies;
  }

  recordChange(input: Omit<ChangeRecord, "id" | "at">): ChangeRecord {
    if (!input.summary.trim() || input.approvedBy.length === 0 || input.tests.length === 0) {
      throw new Error("Material changes require a summary, tests, and accountable approval.");
    }
    const record = Object.freeze({
      ...input,
      id: this.#deps.ids.create("change"),
      at: this.#deps.clock.now().toISOString(),
    });
    this.#changes.push(record);
    return record;
  }

  openIncident(input: Omit<IncidentRecord, "id" | "openedAt" | "status">): IncidentRecord {
    const record: IncidentRecord = Object.freeze({
      ...input,
      id: this.#deps.ids.create("incident"),
      openedAt: this.#deps.clock.now().toISOString(),
      status: "open",
    });
    this.#incidents.set(record.id, record);
    return record;
  }

  resolveIncident(
    incidentId: Identifier,
    rootCause: string,
    remediation: readonly string[],
  ): IncidentRecord {
    const incident = this.#incidents.get(incidentId);
    if (!incident) throw new Error("Incident not found.");
    const updated = Object.freeze({
      ...incident,
      rootCause: rootCause.trim(),
      remediation,
      status: "resolved" as const,
    });
    this.#incidents.set(incidentId, updated);
    return updated;
  }

  openAppeal(input: Omit<Appeal, "id" | "openedAt" | "status">): Appeal {
    const appeal: Appeal = Object.freeze({
      ...input,
      id: this.#deps.ids.create("appeal"),
      openedAt: this.#deps.clock.now().toISOString(),
      status: "open",
    });
    this.#appeals.set(appeal.id, appeal);
    return appeal;
  }

  get publicRecord(): {
    readonly constitution: readonly ConstitutionalRule[];
    readonly changes: readonly ChangeRecord[];
    readonly incidents: readonly IncidentRecord[];
    readonly appealsOpen: number;
  } {
    return Object.freeze({
      constitution: PRODUCTION_CONSTITUTION,
      changes: [...this.#changes],
      incidents: [...this.#incidents.values()],
      appealsOpen: [...this.#appeals.values()].filter((appeal) => appeal.status !== "resolved")
        .length,
    });
  }
}
