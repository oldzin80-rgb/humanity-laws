import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperienceOrchestrator,
  createUniversalCommunicationGuidance,
  createUniversalKnowledgeFoundation,
  GrandKnowledgeDomains,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport as createCoreReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

test("Universal Knowledge Foundation includes all grand knowledge domains", () => {
  const foundation = createUniversalKnowledgeFoundation();

  assert.deepEqual(foundation.domains.map((domain) => domain.id), [
    "human_being",
    "human_mind",
    "human_relationships",
    "human_meaning",
    "health_and_wellness_traditions",
    "science",
    "society",
    "arts",
    "humanity_contributors",
  ]);
  assert.ok(GrandKnowledgeDomains.every((domain) => domain.sourcePolicy === "requires_attribution_and_evidence_context"));
});

test("Universal Knowledge Foundation is shared by every major Humanity Laws room", () => {
  const foundation = createUniversalKnowledgeFoundation();

  assert.deepEqual(foundation.sharedLayerFor, [
    "adam_eve",
    "spark",
    "wellness",
    "the_table",
    "community",
    "founder",
    "podcast",
    "living_library",
    "experience_orchestrator",
    "future_systems",
  ]);
});

test("health and wellness traditions remain educational with evidence, limitations, and cultural context", () => {
  const { healthTraditions } = createUniversalKnowledgeFoundation();

  assert.ok(healthTraditions.traditions.includes("traditional_chinese_medicine"));
  assert.ok(healthTraditions.traditions.includes("ayurveda"));
  assert.ok(healthTraditions.traditions.includes("native_american_traditions"));
  assert.deepEqual(healthTraditions.requiredContext, ["history", "principles", "contributions", "strengths", "limitations", "current_evidence", "respectful_cultural_context"]);
  assert.equal(healthTraditions.educationalOnly, true);
  assert.equal(healthTraditions.noMedicalReplacement, true);
  assert.equal(healthTraditions.noDiagnosisOrPrescription, true);
});

test("contributor profiles require humility, debates, later developments, and many perspectives", () => {
  const { contributorProfiles } = createUniversalKnowledgeFoundation();

  assert.deepEqual(contributorProfiles.requiredFields, ["biography", "major_discoveries", "why_work_mattered", "influence_on_humanity", "later_developments", "related_thinkers", "important_debates", "practical_lessons"]);
  assert.equal(contributorProfiles.manyCulturesTimePeriodsAndPerspectives, true);
  assert.equal(contributorProfiles.noHeroWorship, true);
  assert.equal(contributorProfiles.debateAndLimitationsRequired, true);
});

test("Knowledge Connection Engine links ideas without forcing journeys", () => {
  const foundation = createUniversalKnowledgeFoundation();

  assert.deepEqual(foundation.connectionEngine.map((connection) => [connection.from, connection.to]), [
    ["nutrition", "sleep"],
    ["sleep", "brain"],
    ["brain", "exercise"],
    ["exercise", "stress"],
    ["stress", "relationships"],
    ["relationships", "purpose"],
  ]);
  assert.ok(foundation.connectionEngine.every((connection) => connection.forced === false));
});

test("Universal Communication Engine adapts explanation style while preserving truth", () => {
  const child = createUniversalCommunicationGuidance("child", "beginner");
  const expert = createUniversalCommunicationGuidance("expert", "advanced");

  assert.match(child.style, /simple language/);
  assert.match(expert.style, /nuance/);
  assert.equal(child.truthMustRemainConsistent, true);
  assert.equal(expert.truthMustRemainConsistent, true);
  assert.equal(child.communicationMayAdapt, true);
});

test("Learning Engine, Living Knowledge, Wisdom Layer, and Flourishing Index preserve humility", () => {
  const foundation = createUniversalKnowledgeFoundation();

  assert.deepEqual(foundation.learningEngine.depths, ["beginner", "intermediate", "advanced", "professional_overview"]);
  assert.ok(foundation.learningEngine.lessonParts.includes("related_humanity_laws_themes"));
  assert.ok(foundation.livingKnowledge.tracks.includes("established_consensus"));
  assert.ok(foundation.livingKnowledge.tracks.includes("open_question"));
  assert.equal(foundation.livingKnowledge.noFalseCertainty, true);
  assert.ok(foundation.wisdomLayer.questions.includes("What are the tradeoffs?"));
  assert.equal(foundation.wisdomLayer.humanDecisionMaker, true);
  assert.deepEqual(foundation.flourishingIndex.dimensions, ["physical", "mental", "emotional", "relational", "intellectual", "purpose", "service", "stewardship"]);
  assert.equal(foundation.flourishingIndex.noJudgmentScore, true);
});

test("Adam and Eve can guide learning but never claim infallibility or replace human choice", () => {
  const { adamEveKnowledgeGuides } = createUniversalKnowledgeFoundation();

  assert.ok(adamEveKnowledgeGuides.may.includes("teach"));
  assert.ok(adamEveKnowledgeGuides.may.includes("compare_viewpoints"));
  assert.ok(adamEveKnowledgeGuides.may.includes("remember_interests_with_consent"));
  assert.deepEqual(adamEveKnowledgeGuides.mustNever, ["present_as_infallible", "replace_professionals", "claim_total_certainty", "override_human_decision"]);
  assert.equal(adamEveKnowledgeGuides.aiTransparencyRequired, true);
});

test("Universal Knowledge Foundation preserves constitutional source hierarchy and launchReady false", () => {
  const foundation = createUniversalKnowledgeFoundation();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createCoreReleaseReadinessReport(bundle);

  assert.deepEqual(foundation.sourceRules, ["humanity_laws_book_remains_constitutional_source", "about_nick_supports_but_does_not_replace_source", "knowledge_requires_attribution", "humans_remain_responsible_for_choices"]);
  assert.equal(foundation.launchReady, false);
  assert.equal(report.launchReady, false);
});

test("Experience Orchestrator carries the Universal Knowledge Foundation as a shared layer", () => {
  const orchestrator = createExperienceOrchestrator();

  assert.equal(orchestrator.universalKnowledgeFoundation.name, "Universal Human Knowledge Foundation");
  assert.ok(orchestrator.universalKnowledgeFoundation.sharedLayerFor.includes("experience_orchestrator"));
  assert.ok(orchestrator.universalKnowledgeFoundation.sharedLayerFor.includes("adam_eve"));
  assert.equal(orchestrator.universalKnowledgeFoundation.launchReady, false);
});
