import test from "node:test";
import assert from "node:assert/strict";
import {
  createDiscoveryEngine,
  createDiscoveryGap,
  createExperienceOrchestrator,
  createResearchReviewItem,
  createUniversalKnowledgeFoundation,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

test("Discovery Engine preserves the vision to trust learning loop", () => {
  const engine = createDiscoveryEngine();

  assert.deepEqual(engine.learningLoop.sequence, ["vision", "belief", "experiment", "evidence", "refinement", "trust"]);
  assert.equal(engine.learningLoop.beliefStartsJourney, true);
  assert.equal(engine.learningLoop.evidenceSustainsTrust, true);
  assert.equal(engine.learningLoop.completionNeverAssumed, true);
});

test("Discovery Engine asks the core questions without claiming finished knowledge", () => {
  const engine = createDiscoveryEngine();

  assert.deepEqual(engine.coreQuestions, [
    "what_do_we_not_understand_well_enough",
    "where_do_people_still_struggle",
    "which_explanations_consistently_help",
    "which_interventions_support_learning_or_healthier_habits",
    "what_new_research_should_be_reviewed",
    "where_are_the_knowledge_gaps",
  ]);
  assert.ok(engine.adamEveDiscoveryPolicy.mustNever.includes("claim_finished_knowledge"));
  assert.ok(engine.adamEveDiscoveryPolicy.mustNever.includes("invent_evidence"));
});

test("Discovery gaps are privacy-preserving and require evidence before refinement", () => {
  const gap = createDiscoveryGap({
    question: "where_do_people_still_struggle",
    source: "community_questions",
    relatedDomain: "human_relationships",
  });

  assert.equal(gap.status, "needs_evidence");
  assert.equal(gap.memberContentStored, false);
  assert.ok(gap.requiredEvidence.includes("source_attribution_required"));
  assert.ok(gap.requiredEvidence.includes("human_review_required"));
  assert.ok(gap.requiredEvidence.includes("privacy_preserving"));
  assert.ok(gap.requiredEvidence.includes("no_false_certainty"));
});

test("research review items preserve source attribution, limitations, confidence, and professional boundaries", () => {
  const item = createResearchReviewItem({ topic: "new habit research" });

  assert.equal(item.status, "source_needed");
  assert.deepEqual(item.mustPreserve, ["source_attribution", "limitations", "confidence_level", "competing_viewpoints", "professional_boundaries"]);
});

test("Discovery Engine uses broad signal sources but does not store private content by default", () => {
  const engine = createDiscoveryEngine();

  assert.ok(engine.signalSources.includes("adam_eve_conversations"));
  assert.ok(engine.signalSources.includes("wellness_check_ins"));
  assert.ok(engine.signalSources.includes("external_research_review"));
  assert.ok(engine.defaultGaps.every((gap) => gap.memberContentStored === false));
  assert.ok(engine.explanationSignals.every((signal) => signal.exposesPrivateContent === false));
});

test("Adam and Eve discovery support is consent-aware, transparent, and bounded", () => {
  const policy = createDiscoveryEngine().adamEveDiscoveryPolicy;

  assert.deepEqual(policy.may, ["notice_confusion_patterns", "suggest_clearer_explanations", "recommend_learning_paths", "surface_open_questions", "invite_human_review"]);
  assert.deepEqual(policy.mustNever, ["claim_finished_knowledge", "invent_evidence", "store_sensitive_content_unnecessarily", "override_human_judgment", "replace_professional_review"]);
  assert.equal(policy.consentAware, true);
  assert.equal(policy.aiTransparencyRequired, true);
});

test("Universal Knowledge Foundation includes Discovery Engine as a living knowledge loop", () => {
  const foundation = createUniversalKnowledgeFoundation();

  assert.equal(foundation.discoveryEngine.name, "Discovery Engine");
  assert.ok(foundation.discoveryEngine.coreQuestions.includes("where_are_the_knowledge_gaps"));
  assert.equal(foundation.discoveryEngine.launchReady, false);
});

test("Experience Orchestrator carries Discovery Engine without changing launchReady", () => {
  const orchestrator = createExperienceOrchestrator();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(orchestrator.discoveryEngine.name, "Discovery Engine");
  assert.equal(orchestrator.discoveryEngine.launchReady, false);
  assert.equal(orchestrator.launchReady, false);
  assert.equal(report.launchReady, false);
});
