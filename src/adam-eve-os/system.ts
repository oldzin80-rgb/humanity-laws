import {
  createLifeNavigator,
  type CompanionOptions,
  type LifeNavigationEngine,
} from "../legacy/humanity-laws-companion-os.ts";
import { ContinuityEngine, type YearOfContinuity } from "./continuity.ts";
import { DecisionJournal } from "./decisions.ts";
import { GovernanceLedger } from "./governance.ts";
import { FaithfulnessEngine } from "./faithfulness.ts";
import { SoulInheritanceEngine } from "./inheritance.ts";
import { KnowledgeFabric } from "./knowledge.ts";
import { LifeModelEngine } from "./life-model.ts";
import { ActiveLoveEngine } from "./love.ts";
import { ProfessionalBoundaryRouter } from "./professional-boundaries.ts";
import { SourceLedger } from "./source-ledger.ts";
import {
  defaultDependencies,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";
import { SovereignMemoryVault, type VaultStorage } from "./vault.ts";
import { StewardshipEngine } from "./stewardship.ts";

export interface MagnificentSystemOptions {
  readonly companion?: Omit<CompanionOptions, "name">;
  readonly dependencies?: SystemDependencies;
  readonly vaultStorage?: VaultStorage;
}

export interface MagnificentSystem {
  readonly constitutionalCore: LifeNavigationEngine;
  readonly vault: SovereignMemoryVault;
  readonly lifeModel: LifeModelEngine;
  readonly decisions: DecisionJournal;
  readonly continuity: ContinuityEngine;
  readonly knowledge: KnowledgeFabric;
  readonly governance: GovernanceLedger;
  readonly inheritance: SoulInheritanceEngine;
  readonly love: ActiveLoveEngine;
  readonly faithfulness: FaithfulnessEngine;
  readonly stewardship: StewardshipEngine;
  readonly professionalBoundaries: ProfessionalBoundaryRouter;
  readonly sourceLedger: SourceLedger;
  beginYear(personId: Identifier): YearOfContinuity;
}

export function createMagnificentSystem(
  options: MagnificentSystemOptions = {},
): MagnificentSystem {
  const dependencies = options.dependencies ?? defaultDependencies;
  const constitutionalCore = createLifeNavigator(options.companion);
  const vault = new SovereignMemoryVault(options.vaultStorage, dependencies);
  const lifeModel = new LifeModelEngine(dependencies);
  const decisions = new DecisionJournal(dependencies);
  const continuity = new ContinuityEngine(dependencies);
  const knowledge = new KnowledgeFabric(dependencies);
  const governance = new GovernanceLedger(dependencies);
  const inheritance = new SoulInheritanceEngine(undefined, dependencies);
  const love = new ActiveLoveEngine(dependencies);
  const faithfulness = new FaithfulnessEngine(dependencies);
  const stewardship = new StewardshipEngine(dependencies);
  const professionalBoundaries = new ProfessionalBoundaryRouter();
  const sourceLedger = new SourceLedger();

  return Object.freeze({
    constitutionalCore,
    vault,
    lifeModel,
    decisions,
    continuity,
    knowledge,
    governance,
    inheritance,
    love,
    faithfulness,
    stewardship,
    professionalBoundaries,
    sourceLedger,
    beginYear: (personId: Identifier) => continuity.createYear(personId),
  });
}
