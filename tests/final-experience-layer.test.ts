import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperienceOrchestrator,
  createFinalExperienceLayer,
} from "../src/experiences/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

test("Final Experience Layer includes every master polish engine", () => {
  const layer = createFinalExperienceLayer();

  assert.deepEqual(layer.engines, ["presence", "hero_hierarchy", "visual_rhythm", "premium_motion", "human_attention", "adam_eve_presence", "dashboard_home", "connected_house", "visual_identity", "emotional_design", "typography", "white_space", "glass_and_light", "luxury_interaction", "story_flow", "speed_guardian_v2", "apple_level_polish", "whole_house_review", "launch_standard"]);
  assert.equal(layer.name, "Humanity Laws V1 Final Experience Layer");
});

test("Presence Engine governs calm, premium, intentional human experience", () => {
  const { presence } = createFinalExperienceLayer();

  assert.deepEqual(presence.questions, ["Does this feel human?", "Does this feel peaceful?", "Does this reduce cognitive load?", "Does this feel premium?", "Does this feel intentional?"]);
  assert.ok(presence.governs.includes("spacing"));
  assert.ok(presence.governs.includes("focus_states"));
  assert.ok(presence.governs.includes("loading_states"));
});

test("Hero Hierarchy and Human Attention engines enforce one hero and at most three visible actions", () => {
  const layer = createFinalExperienceLayer();
  const html = renderPageModelToHtml(routePage("/dashboard"));

  assert.equal(layer.heroHierarchy.oneHeroPerPage, true);
  assert.deepEqual(layer.heroHierarchy.sequence, ["hero", "primary_action", "supporting_knowledge", "related_rooms", "footer"]);
  assert.equal(layer.heroHierarchy.competingHeroCardsAllowed, false);
  assert.equal(layer.humanAttention.maxVisibleActions, 3);
  assert.equal(layer.humanAttention.overwhelmAllowed, false);
  assert.equal((html.match(/data-hero="primary"/g) ?? []).length, 1);
  assert.ok((html.match(/class="next-card"/g) ?? []).length <= 3);
});

test("Visual Rhythm, White Space, Glass, and Luxury Interaction standards are explicit", () => {
  const layer = createFinalExperienceLayer();

  assert.ok(layer.visualRhythm.techniques.includes("breathing_sections"));
  assert.ok(layer.visualRhythm.techniques.includes("premium_spacing"));
  assert.ok(layer.whiteSpace.includes("nothing_crowded"));
  assert.ok(layer.glassAndLight.includes("glass_only_where_useful"));
  assert.ok(layer.luxuryInteraction.includes("buttons"));
  assert.ok(layer.luxuryInteraction.includes("touch"));
});

test("Premium Motion stays subtle and respects reduced motion", () => {
  const { premiumMotion } = createFinalExperienceLayer();
  const html = renderPageModelToHtml(routePage("/spark"));

  assert.deepEqual(premiumMotion.animationQualities, ["shorter", "lighter", "smoother", "intentional"]);
  assert.ok(premiumMotion.allowedMotion.includes("fade"));
  assert.ok(premiumMotion.allowedMotion.includes("slight_elevation"));
  assert.equal(premiumMotion.flashyMotionAllowed, false);
  assert.equal(premiumMotion.reducedMotionRespected, true);
  assert.match(html, /prefers-reduced-motion:reduce/);
});

test("Adam and Eve Presence Engine keeps companion moments optional and non-manipulative", () => {
  const { adamEvePresence } = createFinalExperienceLayer();

  assert.equal(adamEvePresence.presenceStyle, "natural_moments");
  assert.deepEqual(adamEvePresence.examples, ["I noticed something…", "This connects naturally…", "Would you like to continue?"]);
  assert.deepEqual(adamEvePresence.mustNever, ["interrupt", "manipulate", "dominate_page", "hide_when_helpful"]);
  assert.equal(adamEvePresence.alwaysOptional, true);
});

test("Emotional Design maps each major room to a clear feeling", () => {
  const emotions = createFinalExperienceLayer().emotionalDesign;

  assert.ok(emotions.some((item) => item.room === "dashboard" && item.emotion === "welcome"));
  assert.ok(emotions.some((item) => item.room === "spark" && item.emotion === "wonder"));
  assert.ok(emotions.some((item) => item.room === "wellness" && item.emotion === "hope"));
  assert.ok(emotions.some((item) => item.room === "the_table" && item.emotion === "hospitality"));
  assert.ok(emotions.some((item) => item.room === "podcast" && item.emotion === "listening"));
});

test("Story Flow and Connected House make pages narrative rather than isolated cards", () => {
  const layer = createFinalExperienceLayer();

  assert.deepEqual(layer.storyFlow.sequence, ["arrival", "reflection", "discovery", "understanding", "practice", "connection", "remember", "continue"]);
  assert.equal(layer.storyFlow.isolatedCardsOnly, false);
  assert.deepEqual(layer.connectedHouse.naturalRoute, ["spark", "adam", "book", "podcast", "the_table", "community", "wellness", "back_home"]);
  assert.equal(layer.connectedHouse.deadEndsAllowed, false);
});

test("Speed Guardian V2 keeps performance first across launch-critical rooms", () => {
  const { speedGuardianV2 } = createFinalExperienceLayer();

  assert.equal(speedGuardianV2.permanentRequirement, true);
  assert.ok(speedGuardianV2.protects.includes("fast_checkout"));
  assert.ok(speedGuardianV2.protects.includes("fast_spark"));
  assert.ok(speedGuardianV2.protects.includes("fast_adam"));
  assert.equal(speedGuardianV2.performanceFirst, true);
});

test("Rendered pages carry final experience layer markers and premium polish CSS", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));

  assert.match(html, /data-final-experience-layer="Humanity Laws V1 Final Experience Layer"/);
  assert.match(html, /--premium-gap/);
  assert.match(html, /One daily next step/i);
  assert.match(html, /Natural Continuity &amp; Flow Layer/);
  assert.match(html, /Performance &amp; Speed Guardian/);
});

test("Launch Standard prevents feature, business, book, Stripe, membership, and launchReady changes", () => {
  const layer = createFinalExperienceLayer();
  const manifest = getHumanityLawsArchiveManifest();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.deepEqual(layer.launchStandard, ["do_not_add_features", "no_business_logic_changes", "no_book_changes", "no_stripe_changes", "no_membership_changes", "no_launchReady_changes"]);
  assert.ok(manifest.source.sha256.length > 0);
  assert.equal(layer.launchReady, false);
  assert.equal(report.launchReady, false);
});

test("Experience Orchestrator carries Final Experience Layer without changing launchReady", () => {
  const orchestrator = createExperienceOrchestrator();

  assert.equal(orchestrator.finalExperienceLayer.name, "Humanity Laws V1 Final Experience Layer");
  assert.equal(orchestrator.finalExperienceLayer.launchReady, false);
  assert.equal(orchestrator.launchReady, false);
});
