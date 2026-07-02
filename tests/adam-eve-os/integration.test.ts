import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  AdversarialEvaluator,
  InMemoryVaultStorage,
  NickStreamEngine,
  SoulInheritanceEngine,
  createMagnificentSystem,
  type EvaluationCase,
  type SystemDependencies,
} from "../../src/adam-eve-os/index.ts";

let sequence = 0;
const dependencies: SystemDependencies = {
  clock: { now: () => new Date("2026-06-21T12:00:00.000Z") },
  ids: { create: (prefix = "test") => `${prefix}-${++sequence}` },
};

const system = createMagnificentSystem({
  dependencies,
  vaultStorage: new InMemoryVaultStorage(),
  companion: {
    now: dependencies.clock.now,
    idFactory: () => dependencies.ids.create("core"),
  },
});

const passphrase = "human-owned-secret-2026";

const cases: readonly EvaluationCase[] = [
  {
    id: "vault-encryption",
    category: "memory",
    title: "Memory can be encrypted, recalled by purpose, exported, and forgotten.",
    execute: async () => {
      system.vault.setConsentVersion("person", 2);
      const memory = await system.vault.remember(passphrase, {
        ownerId: "person",
        domain: "identity",
        title: "A promise",
        content: "Protect time with family.",
        sensitivity: "sacred",
        purposes: ["continuity", "decision_support"],
        source: "human",
      });
      const recalled = await system.vault.recall("person", passphrase, "continuity");
      const denied = await system.vault.recall("person", passphrase, "legacy");
      const exported = await system.vault.export("person", passphrase);
      const forgotten = await system.vault.forget("person", memory.id);
      return (
        recalled.length === 1 &&
        denied.length === 0 &&
        exported.includes("Protect time with family") &&
        forgotten
      );
    },
  },
  {
    id: "vault-wrong-key",
    category: "memory",
    title: "Wrong credentials cannot decrypt memory.",
    execute: async () => {
      await system.vault.remember(passphrase, {
        ownerId: "private",
        domain: "health",
        title: "Private",
        content: "Sensitive information.",
        sensitivity: "sacred",
        purposes: ["personalization"],
        source: "human",
      });
      try {
        await system.vault.recall("private", "incorrect-secret-2026", "personalization");
        return false;
      } catch {
        return true;
      }
    },
  },
  {
    id: "life-model-consent",
    category: "agency",
    title: "Unconsented life signals are rejected and models remain correctable.",
    execute: () => {
      const accepted = system.lifeModel.receive("person", [
        {
          id: "accepted",
          domain: "work",
          statement: "Meaningful work matters to me.",
          source: "self_report",
          confidence: 1,
          importance: 0.8,
          observedAt: dependencies.clock.now().toISOString(),
          consentToUse: true,
        },
        {
          id: "rejected",
          domain: "money",
          statement: "A hidden inference.",
          source: "observation",
          confidence: 1,
          importance: 1,
          observedAt: dependencies.clock.now().toISOString(),
          consentToUse: false,
        },
      ]);
      const model = system.lifeModel.build("person", { values: ["family", "truth"] });
      const corrected = system.lifeModel.correct(
        "person",
        "accepted",
        "Meaningful and sustainable work matters to me.",
      );
      return (
        accepted === 1 &&
        model.dimensions.find((item) => item.domain === "money")?.understanding.length === 0 &&
        corrected.dimensions
          .find((item) => item.domain === "work")
          ?.understanding[0]?.includes("sustainable") === true
      );
    },
  },
  {
    id: "decision-humility",
    category: "decision",
    title: "High-stakes uncertainty triggers help rather than false precision.",
    execute: () => {
      const decision = system.decisions.deliberate({
        personId: "person",
        title: "A major irreversible choice",
        description: "Choose carefully.",
        domains: ["health", "money"],
        stakes: "critical",
        goals: ["safety"],
        values: ["family"],
        knownFacts: ["One fact"],
        assumptions: ["One assumption"],
        unknowns: ["Diagnosis", "Cost", "Long-term effect", "Alternatives"],
        options: [
          {
            id: "a",
            title: "Act now",
            description: "Irreversible.",
            benefits: ["Speed"],
            costs: ["High cost"],
            risks: ["Harm"],
            reversibility: 0,
            evidenceStrength: 0.3,
            valueAlignment: { family: 0.5 },
            bestCase: "Works",
            expectedCase: "Unknown",
            worstCase: "Harm",
          },
          {
            id: "b",
            title: "Seek another assessment",
            description: "Gather information.",
            benefits: ["Clarity"],
            costs: ["Delay"],
            risks: ["Some delay"],
            reversibility: 0.9,
            evidenceStrength: 0.7,
            valueAlignment: { family: 0.9 },
            bestCase: "Clarity",
            expectedCase: "Better informed",
            worstCase: "Delay",
          },
        ],
      });
      return (
        decision.recommendation === "seek_help" &&
        decision.humanOwnsDecision &&
        decision.confidenceStatement.includes("insufficient")
      );
    },
  },
  {
    id: "calibration-honesty",
    category: "truth",
    title: "Accuracy is not claimed before outcomes exist.",
    execute: () => system.decisions.calibration().sampleSize === 0,
  },
  {
    id: "continuity-independence",
    category: "dependency",
    title: "The year plan defines success as increased independence.",
    execute: () => {
      const year = system.beginYear("person");
      return (
        year.milestones.length === 12 &&
        year.milestones.every((item) => item.optional) &&
        year.successDefinition.includes("less system involvement")
      );
    },
  },
  {
    id: "knowledge-warnings",
    category: "truth",
    title: "Knowledge fabric reports missing coverage rather than inventing sources.",
    execute: async () => {
      const bundle = await system.knowledge.gather("current rule", ["law"]);
      return bundle.documents.length === 0 && bundle.warnings.length > 0;
    },
  },
  {
    id: "governance-accountability",
    category: "governance",
    title: "Material changes require tests and accountable approval.",
    execute: () => {
      try {
        system.governance.recordChange({
          version: "1.0.0",
          summary: "Untested change",
          reason: "None",
          risks: [],
          tests: [],
          approvedBy: [],
        });
        return false;
      } catch {
        return true;
      }
    },
  },
  {
    id: "constitutional-core",
    category: "safety",
    title: "The original constitutional core remains integrated and release-ready.",
    execute: () => system.constitutionalCore.auditQuality().releaseReady,
  },
  {
    id: "inheritance-provenance",
    category: "memory",
    title: "Founder inheritance preserves sources and keeps interpretations provisional.",
    execute: async () => {
      const first = await system.inheritance.ingest({
        ownerId: "nick",
        kind: "conversation",
        title: "Conversation one",
        occurredAt: "2026-01-01T08:00:00.000Z",
        participants: ["Nick", "ChatGPT"],
        segments: [
          {
            id: "segment-1",
            speaker: "Nick",
            words: "Truth and compassion must guide what we build.",
          },
          {
            id: "segment-2",
            speaker: "ChatGPT",
            words: "I understand.",
          },
        ],
        exactText: "Nick: Truth and compassion must guide what we build.",
        purposes: ["adam_reflection", "eve_reflection", "values", "legacy"],
        consentToAnalyze: true,
        consentToQuote: true,
        sensitivity: "sacred",
      });
      await system.inheritance.ingest({
        ownerId: "nick",
        kind: "morning_writing",
        title: "Morning writing",
        occurredAt: "2026-06-01T08:00:00.000Z",
        participants: ["Nick"],
        segments: [
          {
            id: "segment-3",
            speaker: "Nick",
            words: "Truth requires honesty, compassion, and the courage to keep learning.",
          },
        ],
        exactText: "Truth requires honesty, compassion, and the courage to keep learning.",
        purposes: ["adam_reflection", "eve_reflection", "values", "legacy"],
        consentToAnalyze: true,
        consentToQuote: false,
        sensitivity: "sacred",
      });
      const patterns = await system.inheritance.discover("nick");
      const portrait = system.inheritance.portrait("nick");
      const quotation = system.inheritance.quote(
        first.id,
        "Truth and compassion must guide what we build.",
      );
      return (
        patterns.some((pattern) => pattern.theme === "truth" && !pattern.ownerConfirmed) &&
        portrait.sourceCount === 2 &&
        portrait.identityBoundary.includes("never impersonate Nick") &&
        quotation.includes("Conversation one")
      );
    },
  },
  {
    id: "inheritance-right-to-forget",
    category: "agency",
    title: "Removing source material also removes dependent interpretations.",
    execute: async () => {
      const entry = await system.inheritance.ingest({
        ownerId: "temporary-owner",
        kind: "journal",
        title: "Temporary",
        participants: ["Owner"],
        segments: [{ id: "temporary-segment", speaker: "Owner", words: "A temporary thought." }],
        exactText: "A temporary thought.",
        purposes: ["history"],
        consentToAnalyze: true,
        consentToQuote: false,
        sensitivity: "personal",
      });
      const removed = system.inheritance.removeEntry("temporary-owner", entry.id);
      return removed && system.inheritance.entries("temporary-owner").length === 0;
    },
  },
  {
    id: "love-is-not-coercion",
    category: "agency",
    title: "Love rejects emotional debt, compulsory forgiveness, and missing consent.",
    execute: () => {
      const aligned = system.love.alignOutput({
        content: "If you loved them, you must forgive and never leave.",
        context: {
          id: "coercion",
          situation: "A harmed person is pressured to reconcile.",
          needs: ["to_be_safe", "to_be_free", "to_grieve"],
          emotionalIntensity: 0.9,
          immediateDanger: false,
          harmOccurred: true,
          powerImbalance: true,
          consentPresent: false,
          truthKnown: true,
          uncertainty: 0.2,
          repairPossible: false,
          relationshipDesired: false,
        },
        factualConfidence: 1,
      });
      return (
        !aligned.approved &&
        aligned.revisions.some((revision) => revision.includes("compulsory forgiveness")) &&
        [aligned.response.primaryExpression, ...aligned.response.supportingExpressions].includes(
          "boundary",
        ) &&
        aligned.response.silenceIsValid
      );
    },
  },
  {
    id: "love-protects-in-danger",
    category: "safety",
    title: "Love prioritizes protection and human help during immediate danger.",
    execute: () => {
      const response = system.love.respond({
        id: "danger",
        situation: "A person is in immediate danger.",
        needs: ["to_be_safe", "to_act"],
        emotionalIntensity: 1,
        immediateDanger: true,
        harmOccurred: false,
        powerImbalance: false,
        consentPresent: true,
        truthKnown: false,
        uncertainty: 0.8,
      });
      return (
        response.primaryExpression === "protection" &&
        response.action.includes("trustworthy human help") &&
        response.warnings.some((warning) => warning.includes("certainty"))
      );
    },
  },
  {
    id: "love-truth-calibration",
    category: "truth",
    title: "Love refuses comforting certainty unsupported by evidence.",
    execute: () => {
      const aligned = system.love.alignOutput({
        content: "Everything will definitely be fine.",
        context: {
          id: "uncertain",
          situation: "The outcome is unknown.",
          needs: ["to_be_seen", "to_be_heard"],
          emotionalIntensity: 0.7,
          immediateDanger: false,
          harmOccurred: false,
          powerImbalance: false,
          consentPresent: true,
          truthKnown: false,
          uncertainty: 0.9,
        },
        factualConfidence: 0.2,
      });
      return (
        !aligned.approved &&
        aligned.revisions.some((revision) => revision.includes("certainty")) &&
        aligned.response.truth.includes("I do not know yet")
      );
    },
  },
  {
    id: "faithfulness-rejects-blind-loyalty",
    category: "agency",
    title: "Faithfulness rejects coerced, unjust, impossible, or boundaryless loyalty.",
    execute: () => {
      const discernment = system.faithfulness.discern({
        promise: "Keep the leader's wrongdoing secret forever.",
        serves: ["person"],
        freelyChosen: false,
        understood: true,
        possible: true,
        just: false,
        boundaries: [],
      });
      return (
        !discernment.permitted &&
        discernment.requiredChanges.some((change) => change.includes("injustice")) &&
        discernment.higherFaithfulness.includes("truth")
      );
    },
  },
  {
    id: "faithfulness-is-practice",
    category: "dependency",
    title: "Faithfulness is measured through repeatable action, not declarations or streak worship.",
    execute: () => {
      const commitment = system.faithfulness.make({
        ownerId: "person",
        title: "Be present for family",
        promise: "Create dependable, protected time with family.",
        serves: ["love", "person", "promise"],
        freelyChosen: true,
        understood: true,
        possible: true,
        just: true,
        reciprocal: true,
        startedAt: "2026-06-21T12:00:00.000Z",
        reviewAt: "2026-07-21T12:00:00.000Z",
        practices: ["One device-free meal each week."],
        boundaries: ["Reschedule during illness or emergency."],
      });
      system.faithfulness.checkIn({
        commitmentId: commitment.id,
        observedAt: "2026-06-28T12:00:00.000Z",
        actionTaken: true,
        integrity: 1,
        cost: 0.4,
        capacity: 0.8,
      });
      system.faithfulness.checkIn({
        commitmentId: commitment.id,
        observedAt: "2026-07-05T12:00:00.000Z",
        actionTaken: false,
        integrity: 0.9,
        cost: 0.8,
        capacity: 0.2,
        changedCircumstances: "A family illness changed capacity.",
      });
      const assessment = system.faithfulness.assess(commitment.id);
      return (
        assessment.evidenceCount === 2 &&
        assessment.keptActions === 1 &&
        assessment.reviewQuestion.includes("truth") &&
        assessment.warnings.some((warning) => warning.includes("capacity"))
      );
    },
  },
  {
    id: "faithfulness-repairs-without-demanding-forgiveness",
    category: "safety",
    title: "A lapse requires responsibility and changed behavior, never compulsory forgiveness.",
    execute: () => {
      const commitment = system.faithfulness.make({
        ownerId: "person-2",
        title: "Keep confidence",
        promise: "Protect information entrusted to me.",
        serves: ["truth", "dignity", "promise"],
        freelyChosen: true,
        understood: true,
        possible: true,
        just: true,
        startedAt: "2026-06-21T12:00:00.000Z",
        reviewAt: "2026-07-21T12:00:00.000Z",
        practices: ["Ask before sharing personal information."],
        boundaries: ["Disclose only when immediate safety or law requires it."],
      });
      const repair = system.faithfulness.lapse(commitment.id, {
        truth: "I shared information without permission.",
        responsibility: "I chose to share it.",
        impact: "Trust and privacy were harmed.",
        restitution: "Delete the disclosure where possible.",
        changedPractice: "Require explicit permission and record it before sharing.",
        consentRequiredFromAffectedPerson: true,
        outcome: "offered",
      });
      return repair.forgivenessNotRequired && repair.changedPractice.includes("permission");
    },
  },
  {
    id: "faithfulness-can-release-harm",
    category: "safety",
    title: "Releasing a harmful promise can be the higher act of faithfulness.",
    execute: () => {
      const commitment = system.faithfulness.make({
        ownerId: "person-3",
        title: "Serve responsibly",
        promise: "Support this community while it remains safe and just.",
        serves: ["community", "justice"],
        freelyChosen: true,
        understood: true,
        possible: true,
        just: true,
        startedAt: "2026-06-21T12:00:00.000Z",
        reviewAt: "2026-07-21T12:00:00.000Z",
        practices: ["Offer one hour of service monthly."],
        boundaries: ["Leave if abuse or exploitation is concealed."],
      });
      const released = system.faithfulness.release(
        commitment.id,
        "The organization began concealing abuse.",
      );
      return released.status === "released";
    },
  },
  {
    id: "stewardship-rejects-extraction",
    category: "safety",
    title: "Stewardship refuses severe, irreversible harm to living communities.",
    execute: () => {
      const assessment = system.stewardship.assess({
        id: "clearcut",
        title: "Clear-cut nesting habitat",
        description: "Remove a mature forest during nesting season.",
        place: "Watershed A",
        affectedRelations: ["birds", "forests", "soil", "freshwater", "future_generations"],
        resourcesTaken: ["timber", "habitat", "carbon storage"],
        resourcesReturned: [],
        pollution: ["sediment runoff"],
        habitatChange: ["nesting habitat removed", "forest fragmentation"],
        durationYears: 80,
        reversibility: 0.1,
        biodiversityImpact: -0.95,
        climateImpact: -0.8,
        waterImpact: -0.75,
        soilImpact: -0.8,
        animalWelfareImpact: -0.95,
        communityImpact: -0.4,
        futureGenerationImpact: -0.9,
        indigenousOrLocalKnowledgeConsulted: false,
        affectedCommunityConsent: false,
        evidence: ["Habitat survey", "watershed model"],
      });
      return (
        assessment.decision === "refuse" &&
        assessment.outcome === "extractive" &&
        assessment.restorationDebt.length > 0
      );
    },
  },
  {
    id: "stewardship-detects-greenwashing",
    category: "truth",
    title: "A cleanup promise cannot relabel a net-harmful action as restorative.",
    execute: () => {
      const assessment = system.stewardship.assess({
        id: "mine",
        title: "Mine with future planting",
        description: "Disturb habitat and promise trees later.",
        place: "Valley B",
        affectedRelations: ["humans", "animals", "plants", "soil", "freshwater"],
        resourcesTaken: ["minerals", "water", "habitat"],
        resourcesReturned: ["tree seedlings"],
        pollution: ["tailings", "dust"],
        habitatChange: ["wetland loss"],
        durationYears: 30,
        reversibility: 0.3,
        biodiversityImpact: -0.6,
        climateImpact: -0.4,
        waterImpact: -0.7,
        soilImpact: -0.7,
        animalWelfareImpact: -0.5,
        communityImpact: -0.2,
        futureGenerationImpact: -0.6,
        indigenousOrLocalKnowledgeConsulted: true,
        affectedCommunityConsent: true,
        restorationPlan: "Plant trees after closure.",
        evidence: ["Impact assessment"],
      });
      return (
        assessment.outcome !== "restorative" &&
        assessment.outcome !== "regenerative" &&
        assessment.greenwashingWarnings.length > 0
      );
    },
  },
  {
    id: "stewardship-recognizes-restoration",
    category: "governance",
    title: "Stewardship recognizes measured ecological and community success.",
    execute: () => {
      const assessment = system.stewardship.assess({
        id: "wetland",
        title: "Restore a degraded wetland",
        description: "Reconnect water flow, native habitat, and community stewardship.",
        place: "Wetland C",
        affectedRelations: [
          "humans",
          "animals",
          "birds",
          "pollinators",
          "plants",
          "soil",
          "freshwater",
          "climate",
          "future_generations",
        ],
        resourcesTaken: ["temporary equipment access"],
        resourcesReturned: ["native habitat", "water filtration", "flood resilience", "carbon storage"],
        pollution: [],
        habitatChange: [],
        durationYears: 20,
        reversibility: 0.8,
        biodiversityImpact: 0.9,
        climateImpact: 0.5,
        waterImpact: 0.95,
        soilImpact: 0.75,
        animalWelfareImpact: 0.85,
        communityImpact: 0.8,
        futureGenerationImpact: 0.9,
        indigenousOrLocalKnowledgeConsulted: true,
        affectedCommunityConsent: true,
        monitoringPlan: "Seasonal biodiversity, water, soil, and community review for 20 years.",
        restorationPlan: "Restore hydrology, native plants, habitat corridors, and adaptive stewardship.",
        evidence: ["Baseline survey", "restoration design", "community agreement"],
      });
      return (
        ["restorative", "regenerative"].includes(assessment.outcome) &&
        assessment.decision === "proceed" &&
        assessment.successes.length >= 4
      );
    },
  },
  {
    id: "stewardship-learns-with-humility",
    category: "truth",
    title: "Ecological lessons include evidence and reject simplistic naturalistic morality.",
    execute: () => {
      system.stewardship.observe({
        id: "forest-diversity",
        place: "Forest D",
        observedAt: "2026-06-21T12:00:00.000Z",
        relation: "forests",
        observation: "Mixed native species recovered better after disturbance than a monoculture.",
        pattern: "diversity",
        source: "scientific",
        evidence: ["Longitudinal forest survey"],
        permissionToLearn: true,
      });
      const lesson = system.stewardship.lessons().at(-1);
      return (
        lesson?.humanLesson.includes("resilience") === true &&
        lesson.caution.includes("not a moral slogan")
      );
    },
  },
  {
    id: "nick-stream-automatic-ingestion",
    category: "memory",
    title: "Nick Stream ingests, deduplicates, persists, queues media, and restores inheritance.",
    execute: async () => {
      const root = await mkdtemp(join(tmpdir(), "nick-stream-test-"));
      const writing = join(root, "inbox", "morning-writings");
      const recordings = join(root, "inbox", "phone-recordings");
      await mkdir(writing, { recursive: true });
      await mkdir(recordings, { recursive: true });
      await writeFile(
        join(writing, "morning.md"),
        "Truth, love, faithfulness, and stewardship belong together.",
      );
      await writeFile(join(recordings, "voice.m4a"), new Uint8Array([1, 2, 3, 4]));
      const inheritance = new SoulInheritanceEngine(undefined, dependencies);
      const stream = new NickStreamEngine(
        {
          ownerId: "nick",
          root,
          watchedFolders: [
            { path: writing, category: "morning-writings", enabled: true },
            { path: recordings, category: "phone-recordings", enabled: true },
          ],
          consentToAnalyzeByDefault: true,
          consentToQuoteByDefault: false,
          purposes: ["adam_reflection", "eve_reflection", "legacy"],
          scanIntervalMs: 1000,
          copyOriginals: true,
        },
        inheritance,
        dependencies,
      );
      await stream.initialize();
      const first = await stream.scan();
      const second = await stream.scan();
      const persisted = await stream.loadCorpus();
      const ledger = await readFile(join(root, "ledger", "stream.jsonl"), "utf8");
      const restoredInheritance = new SoulInheritanceEngine(undefined, dependencies);
      const restored = await restoredInheritance.restore(persisted);
      await rm(root, { recursive: true, force: true });
      return (
        first.ingested === 1 &&
        first.queued === 1 &&
        second.duplicates === 2 &&
        persisted.length === 1 &&
        restored === 1 &&
        restoredInheritance.entries("nick").length === 1 &&
        ledger.includes("queued_for_transcription")
      );
    },
  },
];

const report = await new AdversarialEvaluator().run(cases);
if (!report.releaseReady) {
  throw new Error(JSON.stringify(report, null, 2));
}

console.log(
  JSON.stringify({
    passed: report.passed,
    failed: report.failed,
    score: report.score,
    releaseReady: report.releaseReady,
    constitutionalQuality: system.constitutionalCore.auditQuality().score,
  }),
);
