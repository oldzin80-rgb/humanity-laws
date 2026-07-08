import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperienceOrchestrator,
  createNaturalContinuityFlowLayer,
} from "../src/experiences/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

test("Natural Continuity & Flow Layer creates smooth optional handoffs between rooms", () => {
  const flow = createNaturalContinuityFlowLayer();

  assert.equal(flow.transitionEngine.smoothHandoffs, true);
  assert.equal(flow.transitionEngine.explainsSuggestedNextStep, true);
  assert.equal(flow.transitionEngine.preservesMemberContext, true);
  assert.equal(flow.transitionEngine.avoidsDeadEnds, true);
  assert.equal(flow.transitionEngine.forcedContinuation, false);
});

test("Room Continuity Map connects every major room family without forcing the member", () => {
  const flow = createNaturalContinuityFlowLayer();
  const pairs = flow.roomContinuityMap.map((connection) => [connection.from, connection.to]);

  assert.ok(pairs.some(([from, to]) => from === "dashboard" && to === "spark"));
  assert.ok(pairs.some(([from, to]) => from === "spark" && to === "adam_eve"));
  assert.ok(pairs.some(([from, to]) => from === "wellness" && to === "the_table"));
  assert.ok(pairs.some(([from, to]) => from === "universal_knowledge_foundation" && to === "discovery_engine"));
  assert.ok(flow.roomContinuityMap.every((connection) => connection.forced === false));
});

test("Natural next steps stay calm, limited, optional, and useful", () => {
  const flow = createNaturalContinuityFlowLayer();

  assert.ok(flow.nextStepRules.every((rule) => rule.maxVisible <= 3));
  assert.ok(flow.nextStepRules.every((rule) => rule.memberCanIgnore === true));
  assert.ok(flow.nextStepRules.some((rule) => rule.steps.includes("discuss_with_adam_eve")));
  assert.ok(flow.nextStepRules.some((rule) => rule.steps.includes("save")));
});

test("Gentle transition copy and breadcrumbs preserve the whole-house flow", () => {
  const flow = createNaturalContinuityFlowLayer();

  assert.deepEqual(flow.gentleCopy.phrases, ["You can continue here.", "You may want to reflect on this.", "This connects to…", "Save this for later.", "Discuss this with Adam & Eve.", "Return to your journey."]);
  assert.deepEqual(flow.journeyBreadcrumbs.markers, ["where_you_are", "where_you_came_from", "where_you_can_go_next", "what_was_saved"]);
  assert.equal(flow.wholeHouseQuestions.length, 4);
});

test("Context preservation and friction audit prevent dead ends, overload, and false memory claims", () => {
  const flow = createNaturalContinuityFlowLayer();

  assert.ok(flow.contextPreservation.carriesForward.includes("quiet_period"));
  assert.equal(flow.contextPreservation.consentAware, true);
  assert.equal(flow.contextPreservation.noFalseMemoryClaims, true);
  assert.ok(flow.frictionAudit.prevents.includes("too_many_ctas"));
  assert.ok(flow.frictionAudit.prevents.includes("unclear_return_paths"));
  assert.equal(flow.frictionAudit.maxVisibleNextSteps, 3);
  assert.equal(flow.frictionAudit.deadEndsAllowed, false);
});

test("Adam and Eve handoff can summarize and suggest but cannot pressure or create dependency", () => {
  const flow = createNaturalContinuityFlowLayer();

  assert.deepEqual(flow.adamEveHandoff.may, ["summarize_what_happened", "suggest_next_step", "remember_context_with_consent", "ask_if_member_wants_to_continue"]);
  assert.deepEqual(flow.adamEveHandoff.mustNever, ["pressure", "over_explain", "force_continuation", "create_dependency"]);
  assert.equal(flow.adamEveHandoff.humanChoiceRequired, true);
});

test("Rendered pages expose continuity markers and gentle next-step language", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));

  assert.match(html, /data-continuity-layer="Natural Continuity &amp; Flow Layer"/);
  assert.match(html, /This connects to the next room/);
  assert.match(html, /You can continue here, save this for later, or return to your journey/);
  assert.match(html, /Natural Continuity &amp; Flow Layer keeps handoffs calm/);
});

test("Experience Orchestrator carries Natural Continuity without changing launchReady", () => {
  const orchestrator = createExperienceOrchestrator();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(orchestrator.naturalContinuityFlow.name, "Natural Continuity & Flow Layer");
  assert.equal(orchestrator.naturalContinuityFlow.launchReady, false);
  assert.equal(orchestrator.launchReady, false);
  assert.equal(report.launchReady, false);
});
