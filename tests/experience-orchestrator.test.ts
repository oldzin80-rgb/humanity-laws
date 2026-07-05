import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperienceOrchestrator,
  createMemberExperienceContext,
  DefaultCrossSystemConnections,
  OrchestrationSignals,
  recommendNextExperiences,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

test("Experience Orchestrator considers the required member context signals", () => {
  assert.deepEqual(OrchestrationSignals, [
    "new_vs_returning",
    "membership_status",
    "book_ownership",
    "spark_history",
    "podcast_activity",
    "wellness_engagement",
    "community_participation",
    "founder_content_viewed",
    "quiet_period",
  ]);
});

test("Member Journey Engine distinguishes new and returning members without locking a path", () => {
  const newMember = createMemberExperienceContext({ memberId: "new", isReturningMember: false });
  const returningMember = createMemberExperienceContext({ memberId: "returning", isReturningMember: true });

  assert.equal(newMember.journeyStage, "new_member");
  assert.equal(returningMember.journeyStage, "returning_member");
  assert.ok(recommendNextExperiences(newMember).every((recommendation) => recommendation.optional === true));
  assert.ok(recommendNextExperiences(returningMember).every((recommendation) => recommendation.userCanDismiss === true));
});

test("Recommendation Engine suggests Spark, Adam and Eve, Table, and Community without forcing actions", () => {
  const first = createMemberExperienceContext({ sparkHistoryCount: 0, preferredPace: "deep" });
  const active = createMemberExperienceContext({ sparkHistoryCount: 2, wellnessEngagementCount: 1, founderContentViewedCount: 1, communityParticipationCount: 0, preferredPace: "deep" });

  assert.equal(recommendNextExperiences(first)[0]?.experience, "spark");
  const activeExperiences = recommendNextExperiences(active).map((recommendation) => recommendation.experience);
  assert.ok(activeExperiences.includes("adam_eve"));
  assert.ok(activeExperiences.includes("the_table"));
  assert.ok(activeExperiences.includes("community"));
  assert.ok(recommendNextExperiences(active).every((recommendation) => recommendation.optional && recommendation.userCanDismiss));
});

test("Attention Management respects quiet mode and limits visible recommendations", () => {
  const quiet = createMemberExperienceContext({ quietMode: true, preferredPace: "deep", sparkHistoryCount: 5 });
  const balanced = createMemberExperienceContext({ quietMode: false, preferredPace: "balanced", sparkHistoryCount: 2, wellnessEngagementCount: 1, founderContentViewedCount: 1 });
  const quietResult = createExperienceOrchestrator(quiet);
  const balancedResult = createExperienceOrchestrator(balanced);

  assert.equal(quietResult.notificationSettings.cadence, "quiet");
  assert.equal(quietResult.recommendations.length, 1);
  assert.equal(quietResult.recommendations[0]?.experience, "book");
  assert.equal(quietResult.notificationSettings.quietPeriodsRespected, true);
  assert.ok(balancedResult.recommendations.length <= 2);
  assert.ok(balancedResult.attentionManagement.includes("avoid_overwhelm"));
  assert.ok(balancedResult.attentionManagement.includes("limit_visible_next_steps"));
});

test("Journey Timeline is member-owned, exportable, and deletable", () => {
  const context = createMemberExperienceContext({ sparkHistoryCount: 1, wellnessEngagementCount: 1, communityParticipationCount: 1, founderContentViewedCount: 1 });
  const result = createExperienceOrchestrator(context);

  assert.ok(result.timeline.length >= 4);
  assert.ok(result.timeline.every((event) => event.memberOwned === true));
  assert.ok(result.timeline.every((event) => event.exportable === true));
  assert.ok(result.timeline.every((event) => event.deletable === true));
});

test("Cross-System Coordination connects rooms without forcing journeys", () => {
  assert.deepEqual(DefaultCrossSystemConnections.map((connection) => [connection.from, connection.to]), [
    ["spark", "podcast"],
    ["podcast", "founder_letter"],
    ["wellness", "the_table"],
    ["founder_letter", "community"],
    ["book", "adam_eve"],
    ["council", "living_library"],
  ]);
  assert.ok(DefaultCrossSystemConnections.every((connection) => connection.forced === false));
});

test("Adam and Eve can explain recommendations but cannot override or pressure", () => {
  const policy = createExperienceOrchestrator().adamEvePolicy;

  assert.deepEqual(policy.may, ["explain_recommendations", "connect_experiences", "summarize_progress"]);
  assert.deepEqual(policy.mustNever, ["override_user_choices", "automatically_complete_actions", "pressure_engagement"]);
  assert.equal(policy.aiTransparencyRequired, true);
  assert.equal(policy.humanControlRequired, true);
});

test("Founder Stewardship Dashboard is aggregate and privacy-preserving", () => {
  const dashboard = createExperienceOrchestrator().founderStewardshipDashboard;

  assert.equal(dashboard.aggregatedOnly, true);
  assert.equal(dashboard.privacyPreserving, true);
  assert.deepEqual(dashboard.visibleSignals, ["journey_patterns", "feature_engagement", "content_performance", "ecosystem_health", "areas_needing_improvement"]);
  assert.equal(dashboard.noIndividualSurveillance, true);
});

test("Dashboard surfaces optional orchestrator reasoning without pressure", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));

  assert.match(html, /Experience Orchestrator/);
  assert.match(html, /The house suggests\. You choose\./);
  assert.match(html, /recommendations optional, limited, and explainable/);
  assert.match(html, /Quiet periods are respected/);
  assert.match(html, /avoids pressure loops/);
});

test("Experience Orchestrator does not change launchReady", () => {
  const result = createExperienceOrchestrator();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(result.launchReady, false);
  assert.equal(report.launchReady, false);
});
