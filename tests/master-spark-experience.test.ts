import test from "node:test";
import assert from "node:assert/strict";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import {
  canAccessFounderSparkMode,
  createMasterSparkExperience,
  createSparkGroupReadiness,
  createSparkNotificationReadiness,
  selectSparkModes,
  SparkModeDefinitions,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

test("Master Spark modes exist with Founder Podcast Mode creator-only", () => {
  const modes = SparkModeDefinitions.map((mode) => mode.mode);

  assert.deepEqual(modes, [
    "morning_spark",
    "evening_reflection",
    "discovery_mode",
    "circle_mode",
    "table_mode",
    "council_mode",
    "book_mode",
    "founder_podcast_mode",
  ]);
  assert.equal(SparkModeDefinitions.find((mode) => mode.mode === "founder_podcast_mode")?.creatorOnly, true);
  assert.equal(canAccessFounderSparkMode(["MEMBER"]), false);
  assert.equal(canAccessFounderSparkMode(["ADMIN"]), true);
  assert.equal(canAccessFounderSparkMode(["FOUNDER"]), true);
});

test("multi-mode Spark selection requires one primary and simplifies too many supports", () => {
  const defaultSelection = selectSparkModes();
  const selected = selectSparkModes({
    primaryMode: "morning_spark",
    supportingModes: ["adam_mode", "eve_mode", "book", "table"],
  });

  assert.equal(defaultSelection.primaryMode, "morning_spark");
  assert.equal(selected.supportingModes.length, 2);
  assert.equal(selected.simplified, true);
  assert.match(selected.message ?? "", /Choose one main mode and up to two supports/);
});

test("Founder Podcast Mode is denied for normal members and role-ready for creator/admin", () => {
  const member = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "founder_podcast_mode",
    roles: ["MEMBER"],
  });
  const founder = createMasterSparkExperience({
    memberId: "founder_1",
    primaryMode: "founder_podcast_mode",
    supportingModes: ["book", "adam_mode"],
    roles: ["FOUNDER"],
  });

  assert.equal(member.selection.primaryMode, "discovery_mode");
  assert.equal(member.founderMode.accessible, false);
  assert.equal(member.founderMode.status, "denied_for_member");
  assert.equal(founder.selection.primaryMode, "founder_podcast_mode");
  assert.equal(founder.founderMode.accessible, true);
  assert.equal(founder.founderMode.status, "available_to_creator");
});

test("Spark wheel and dice model produce one coherent reveal", () => {
  const experience = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "table_mode",
    supportingModes: ["eve_mode", "table"],
    personalization: { consent: true, preferredTone: "restorative" },
  });

  assert.equal(experience.wheel.state, "revealing");
  assert.ok(experience.wheel.categories.length >= 18);
  assert.equal(experience.wheel.animation.reducedMotionFallback, true);
  assert.equal(experience.dice.state, "revealing");
  assert.ok(experience.dice.value >= 1 && experience.dice.value <= 6);
  assert.ok(experience.reveal.title.length > 0);
  assert.ok(experience.reveal.shortReflection.length > 0);
  assert.ok(experience.reveal.primaryQuestion.length > 0);
  assert.ok(experience.reveal.practicalAction.length > 0);
  assert.ok(experience.reveal.relatedHumanityLawsPrinciple.length > 0);
  assert.ok(experience.reveal.suggestedNextSteps.length >= 1);
  assert.ok(experience.reveal.suggestedNextSteps.length <= 3);
});

test("Spark personalization respects consent and avoids false memory claims", () => {
  const noConsent = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "morning_spark",
    personalization: { consent: false, preferredDepth: "deep" },
  });
  const consented = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "morning_spark",
    personalization: { consent: true, preferredDepth: "deep", recentRoomsVisited: ["Book", "Wellness"] },
  });

  assert.equal(noConsent.personalization.applied, false);
  assert.match(noConsent.personalization.note, /does not claim personal memory without consent/);
  assert.equal(consented.personalization.applied, true);
  assert.equal(consented.personalization.preferredDepth, "deep");
  assert.deepEqual(consented.personalization.recentRoomsVisited, ["Book", "Wellness"]);
});

test("Spark notifications and group readiness are honest placeholders only", () => {
  for (const notification of createSparkNotificationReadiness()) {
    assert.equal(notification.configured, false);
    assert.equal(notification.placeholderOnly, true);
    assert.match(notification.message, /after provider verification/);
  }
  for (const group of createSparkGroupReadiness()) {
    assert.equal(group.liveParticipants, false);
    assert.equal(group.placeholderOnly, true);
    assert.match(group.message, /No live participants or group activity/);
  }
});

test("Spark page exposes premium ritual UI without fake live systems", () => {
  const html = renderPageModelToHtml(routePage("/spark"));

  assert.match(html, /Ready for today’s Spark/);
  assert.match(html, /data-spark-ritual/);
  assert.match(html, /Choose one main mode/);
  assert.match(html, /Wheel/);
  assert.match(html, /Dice/);
  assert.match(html, /Morning Spark reminders coming soon/);
  assert.match(html, /Notifications will be connected after provider verification/);
  assert.match(html, /No live participants or group activity/);
  assert.match(html, /Founder Podcast Mode is creator-only/);
  assert.doesNotMatch(html, /SMS is live|push notification sent|live participants are waiting|published live podcast/i);
});

test("Spark connects to relevant rooms without showing every room at once", () => {
  const experience = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "book_mode",
    supportingModes: ["adam_mode", "library"],
  });

  assert.ok(experience.reveal.relatedRoomConnections.includes("Book"));
  assert.ok(experience.reveal.relatedRoomConnections.includes("Adam"));
  assert.ok(experience.reveal.relatedRoomConnections.includes("Living Library"));
  assert.ok(experience.reveal.relatedRoomConnections.length <= 4);
  assert.ok(experience.reveal.suggestedNextSteps.length <= 3);
});

test("Spark history prefers non-repeated categories and falls back gracefully", () => {
  const first = createMasterSparkExperience({ memberId: "member_1", primaryMode: "book_mode" });
  const second = createMasterSparkExperience({
    memberId: "member_1",
    primaryMode: "book_mode",
    history: [{
      sparkId: "old",
      memberId: "member_1",
      mode: first.reveal.mode,
      category: first.reveal.category,
      prompt: first.reveal.primaryQuestion,
      practicalActionCompleted: false,
      createdAt: new Date().toISOString(),
    }],
  });

  assert.notEqual(first.reveal.category, second.reveal.category);
});

test("Master Spark upgrade does not touch book/source, commerce/auth, Adam/Eve/Council, or launchReady", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const membership = routePage("/membership");
  const adam = renderPageModelToHtml(routePage("/adam"));
  const eve = renderPageModelToHtml(routePage("/eve"));
  const council = renderPageModelToHtml(routePage("/council"));
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };

  assert.ok(manifest.source.sha256.length > 20);
  assert.deepEqual(membership.actions.map((action) => action.href), ["/checkout/monthly", "/checkout/yearly"]);
  assert.match(adam + eve, /Write one clear message/);
  assert.match(council, /You make the final decision/);
  assert.equal(createReleaseReadinessReport(bundle).launchReady, false);
});
