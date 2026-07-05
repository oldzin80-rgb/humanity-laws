import test from "node:test";
import assert from "node:assert/strict";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import {
  canAccessFounderSparkMode,
  CinematicDailySparks,
  createSparkCompanionEvent,
  createMasterSparkExperience,
  createSimplifiedCinematicSparkExperience,
  createSparkGroupReadiness,
  createSparkNotificationReadiness,
  FinalSparkCategories,
  getDailyCinematicSpark,
  resolveFinalSparkGame,
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

  assert.match(html, /Spin\. Roll\. Receive\./);
  assert.match(html, /data-spark-ritual/);
  assert.match(html, /data-spark-stage="idle"/);
  assert.match(html, /classy roulette table/i);
  assert.match(html, /data-roulette-color="(red|black|green)"/);
  assert.match(html, /data-dice-path="(one_die|two_dice|founder_wildcard)"/);
  assert.match(html, /physical dice roll|One die|Two dice|No dice/i);
  assert.match(html, /Start Spark/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /Preparing today’s Spark/);
  assert.match(html, /Whisper/);
  assert.match(html, /Question/);
  assert.match(html, /Reflect/);
  assert.match(html, /Action/);
  assert.match(html, /Discuss with Adam &amp; Eve/);
  assert.doesNotMatch(html, /Choose one main mode|Available member modes|Selected category|Founder Podcast Mode is creator-only/);
  assert.doesNotMatch(html, /Notifications will be connected after provider verification|No live participants or group activity/);
  assert.doesNotMatch(html, /SMS is live|push notification sent|live participants are waiting|published live podcast/i);
});

test("Simplified cinematic Spark keeps engines backstage and reveals one daily Spark", () => {
  const date = new Date("2026-07-04T12:00:00Z");
  const spark = getDailyCinematicSpark(date);
  const experience = createSimplifiedCinematicSparkExperience(date);

  assert.ok(CinematicDailySparks.length >= 6);
  assert.equal(FinalSparkCategories.length, 12);
  assert.equal(experience.spark.id, spark.id);
  assert.equal(experience.result.mode, "solo");
  assert.deepEqual(experience.stages, ["idle", "preparing", "spinning", "rolling", "revealing", "ready"]);
  assert.deepEqual(experience.polish, {
    reducedMotion: true,
    mobileOptimized: true,
    companionEventsBuffered: true,
    oneDailySpin: true,
  });
  assert.equal(experience.enginesBackstage, true);
  assert.equal(experience.visibleModes, false);
  assert.equal(experience.visibleCategories, false);
  assert.deepEqual(experience.path, ["Spin", "Roll", "Receive", "Reflect", "Adam & Eve"]);
  assert.deepEqual(experience.nextSteps, ["Discuss with Adam & Eve", "Save to Library", "Return Tomorrow"]);
  assert.deepEqual(experience.rouletteLogic, {
    red: "two dice reveal categories 7–12",
    black: "one die reveals categories 1–6",
    green: "Founder Wildcard, no dice",
  });
  assert.equal(experience.wheel.reducedMotionFallback, true);
  assert.equal(experience.dice.reducedMotionFallback, true);
});

test("Spark extra buff polish adds accessible transitions, replay protection, and event buffering", () => {
  const html = renderPageModelToHtml(routePage("/spark"));

  assert.match(html, /data-stage-chip="preparing"/);
  assert.match(html, /data-stage-chip="spinning"/);
  assert.match(html, /data-stage-chip="rolling"/);
  assert.match(html, /data-stage-chip="revealing"/);
  assert.match(html, /data-stage-chip="ready"/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /queuedCompanionEvents/);
  assert.match(html, /hl_spark_daily_spin_v1/);
  assert.match(html, /navigator\.vibrate/);
  assert.match(html, /aria-label="Start today’s Spark roulette and dice reveal"/);
  assert.match(html, /viewport-fit=cover/);
});

test("Final Spark roulette resolves black, red, and green paths correctly", () => {
  const black = resolveFinalSparkGame(new Date("2026-07-05T12:00:00Z"));
  const red = resolveFinalSparkGame(new Date("2026-07-04T12:00:00Z"));
  const green = resolveFinalSparkGame(new Date("2026-07-11T12:00:00Z"), "founder");

  assert.equal(black.rouletteColor, "black");
  assert.equal(black.dicePath, "one_die");
  assert.equal(black.diceValues.length, 1);
  assert.equal(typeof black.categoryNumber, "number");
  assert.ok(Number(black.categoryNumber) >= 1 && Number(black.categoryNumber) <= 6);

  assert.equal(red.rouletteColor, "red");
  assert.equal(red.dicePath, "two_dice");
  assert.equal(red.diceValues.length, 2);
  assert.equal(typeof red.categoryNumber, "number");
  assert.ok(Number(red.categoryNumber) >= 7 && Number(red.categoryNumber) <= 12);

  assert.equal(green.rouletteColor, "green");
  assert.equal(green.dicePath, "founder_wildcard");
  assert.deepEqual(green.diceValues, []);
  assert.equal(green.categoryNumber, "wildcard");
  assert.equal(green.categoryName, "Founder Wildcard");
});

test("Final Spark companion events keep Adam and Eve connectability user-owned", () => {
  const spark = resolveFinalSparkGame(new Date("2026-07-04T12:00:00Z"));
  const event = createSparkCompanionEvent({
    userId: "member_1",
    type: "spark_received",
    spark,
    createdAt: "2026-07-04T12:00:00.000Z",
  });

  assert.equal(event.source, "spark");
  assert.equal(event.type, "spark_received");
  assert.equal(event.companionVisible, true);
  assert.equal(event.userOwned, true);
  assert.equal(event.editableByUser, true);
  assert.equal(event.deletableByUser, true);
  assert.equal(event.purpose, "personalized_reflection_and_growth");
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
