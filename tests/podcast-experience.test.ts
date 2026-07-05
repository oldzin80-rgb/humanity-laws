import test from "node:test";
import assert from "node:assert/strict";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { createPodcastExperience, createPodcastMomentEvent } from "../src/experiences/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

test("Podcast experience keeps one calm listening path without fake activity", () => {
  const experience = createPodcastExperience();

  assert.deepEqual(experience.path, ["Listen", "Reflect", "Discuss", "Remember"]);
  assert.deepEqual(experience.sections, ["Featured Episode", "Founder Voice", "Continue Listening", "Discuss with Adam & Eve"]);
  assert.equal(experience.noFakeActivity, true);
  assert.equal(experience.noNoisyFeed, true);
  assert.equal(experience.adamEveConnected, true);
  assert.equal(experience.featuredEpisode.status, "reviewed_placeholder");
});

test("Podcast page renders a calm listening room with honest placeholder language", () => {
  const page = routePage("/podcast");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "The Listening Room");
  assert.equal(page.subtitle, "Listen. Reflect. Discuss. Remember what stays with you.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Discuss with Adam & Eve", "Founder Letters", "Start a Spark"]);
  assert.match(html, /Listen → Reflect → Discuss → Remember/);
  assert.match(html, /data-podcast-room/);
  assert.match(html, /Play Reflection/);
  assert.match(html, /queuedPodcastCompanionEvents/);
  assert.match(html, /Podcast publishing is not live yet/);
  assert.match(html, /No episodes are being presented as live/);
  assert.doesNotMatch(html, /listener count|five-star reviews|trending|ranking|live audience/i);
});

test("Podcast moment events are user-owned and safe for Adam/Eve memory", () => {
  const event = createPodcastMomentEvent({
    userId: "member_1",
    type: "podcast_reflection_saved",
    createdAt: "2026-07-04T12:00:00.000Z",
  });

  assert.equal(event.source, "podcast");
  assert.equal(event.companionVisible, true);
  assert.equal(event.userOwned, true);
  assert.equal(event.editableByUser, true);
  assert.equal(event.deletableByUser, true);
  assert.equal(event.purpose, "listening_reflection_discussion_and_remembrance");
});

test("Podcast audit does not change book source, commerce, auth, or launchReady", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const membership = routePage("/membership");
  const login = routePage("/login");
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };

  assert.ok(manifest.source.sha256.length > 20);
  assert.deepEqual(membership.actions.map((action) => action.href), ["/checkout/monthly", "/checkout/yearly"]);
  assert.equal(login.pageId, "login");
  assert.equal(createReleaseReadinessReport(bundle).launchReady, false);
});
