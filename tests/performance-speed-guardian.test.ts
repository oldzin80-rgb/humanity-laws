import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperienceOrchestrator,
  createPerformanceSpeedGuardian,
  DefaultSpeedBudgets,
} from "../src/experiences/index.js";
import { CorePreloadRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

test("Performance & Speed Guardian defines permanent launch-critical speed budgets", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.deepEqual(DefaultSpeedBudgets.map((budget) => budget.key), [
    "initial_load",
    "route_transition",
    "dashboard_render",
    "checkout_entry",
    "membership_status_check",
    "spark_start",
    "podcast_page",
    "wellness_page",
    "community_page",
    "social_command_center",
    "static_asset_size",
  ]);
  assert.ok(guardian.budgets.some((budget) => budget.key === "checkout_entry" && budget.launchCritical));
  assert.ok(guardian.budgets.some((budget) => budget.key === "static_asset_size" && budget.launchCritical));
});

test("Fast check-in and checkout safeguards avoid duplicate waits and unnecessary calls", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.equal(guardian.fastCheckIn.savedSessionHandling, true);
  assert.equal(guardian.fastCheckIn.gracefulErrorFallbacks, true);
  assert.equal(guardian.fastCheckout.stripeHandoffReady, true);
  assert.equal(guardian.fastCheckout.noDuplicateWaits, true);
  assert.equal(guardian.fastCheckout.noUnnecessaryNetworkCalls, true);
});

test("Transition speed preloads core routes and keeps motion non-blocking", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.deepEqual(guardian.transitionSpeed.preloadCoreRoutes, CorePreloadRoutes);
  assert.ok(CorePreloadRoutes.includes("/checkout/monthly"));
  assert.equal(guardian.transitionSpeed.noBlockingAnimations, true);
  assert.equal(guardian.transitionSpeed.reducedMotionFallback, true);
  assert.equal(guardian.transitionSpeed.instantNextStepRendering, true);
});

test("Whole-app performance audit guards against heavy duplicated work", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.ok(guardian.wholeAppAudit.detects.includes("heavy_components"));
  assert.ok(guardian.wholeAppAudit.detects.includes("duplicate_imports"));
  assert.ok(guardian.wholeAppAudit.detects.includes("redundant_experience_hydration"));
  assert.equal(guardian.wholeAppAudit.gracefulFallbackOverDelay, true);
});

test("Performance telemetry is placeholder-only and avoids private content", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.ok(guardian.telemetry.metrics.includes("load_time"));
  assert.ok(guardian.telemetry.metrics.includes("checkout_start_time"));
  assert.equal(guardian.telemetry.placeholderOnlyUntilMonitoringConfigured, true);
  assert.equal(guardian.telemetry.noPrivateContent, true);
});

test("Guardian rules keep mobile speed first and placeholders non-blocking", () => {
  const guardian = createPerformanceSpeedGuardian();

  assert.ok(guardian.guardianRules.rules.includes("no_blocking_adam_eve_events"));
  assert.ok(guardian.guardianRules.rules.includes("no_blocking_placeholders"));
  assert.equal(guardian.guardianRules.speedIsPermanentLaunchRequirement, true);
  assert.equal(guardian.mobileSpeedFirst.iPhonePerformancePriority, true);
  assert.equal(guardian.mobileSpeedFirst.fastTapResponse, true);
  assert.equal(guardian.continuousSpeedChecks.launchReadyRequiresFullLaunchReview, true);
});

test("Rendered pages expose speed guardian markers without adding fake loading states", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));

  assert.match(html, /data-speed-guardian="Performance &amp; Speed Guardian"/);
  assert.match(html, /Fast first\. Beautiful second\./);
  assert.match(html, /Next steps should render before integrations finish/);
  assert.doesNotMatch(html, /fake loading|loading forever|wait for every integration/i);
});

test("Experience Orchestrator carries Performance Guardian without changing launchReady", () => {
  const orchestrator = createExperienceOrchestrator();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(orchestrator.performanceSpeedGuardian.name, "Performance & Speed Guardian");
  assert.equal(orchestrator.performanceSpeedGuardian.launchReady, false);
  assert.equal(orchestrator.launchReady, false);
  assert.equal(report.launchReady, false);
});
