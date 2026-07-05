import test from "node:test";
import assert from "node:assert/strict";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { createTableExperience, createTableMomentEvent, TablePrompts } from "../src/experiences/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

test("The Table experience keeps one clear gathering path", () => {
  const experience = createTableExperience("family");

  assert.deepEqual(experience.path, ["Gather", "Prompt", "Share", "Remember"]);
  assert.deepEqual(experience.gatheringTypes, ["family", "friends", "date", "dinner", "community", "founder_table"]);
  assert.equal(experience.noFeed, true);
  assert.equal(experience.oneClearPath, true);
  assert.equal(experience.adamEveConnected, true);
  assert.ok(TablePrompts.every((prompt) => prompt.conversationPrompt.length > 0));
  assert.ok(TablePrompts.every((prompt) => prompt.gratitudeQuestion.length > 0));
});

test("The Table renders prompt, gratitude, meal, toast, and Adam/Eve connection", () => {
  const html = renderPageModelToHtml(routePage("/table"));

  assert.match(html, /data-table-room/);
  assert.match(html, /Gather → Prompt → Share → Remember/);
  assert.match(html, /Family|Friends|Date|Dinner|Community|Founder Table/);
  assert.match(html, /data-table-status/);
  assert.match(html, /data-table-action="adam_eve_opened"/);
  assert.match(html, /data-table-action="table_saved"/);
  assert.match(html, /queuedTableCompanionEvents/);
  assert.match(html, /hospitality_connection_gratitude_and_remembrance/);
});

test("The Table moment events are user-owned and safe for Adam/Eve memory", () => {
  const prompt = createTableExperience("community").prompt;
  const event = createTableMomentEvent({
    userId: "member_1",
    type: "table_saved",
    prompt,
    createdAt: "2026-07-04T12:00:00.000Z",
  });

  assert.equal(event.source, "table");
  assert.equal(event.gatheringType, "community");
  assert.equal(event.companionVisible, true);
  assert.equal(event.userOwned, true);
  assert.equal(event.editableByUser, true);
  assert.equal(event.deletableByUser, true);
  assert.equal(event.purpose, "hospitality_connection_gratitude_and_remembrance");
});

test("The Table audit does not change book source, commerce, auth, or launchReady", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const membership = routePage("/membership");
  const login = routePage("/login");
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };

  assert.ok(manifest.source.sha256.length > 20);
  assert.deepEqual(membership.actions.map((action) => action.href), ["/checkout/monthly", "/checkout/yearly"]);
  assert.equal(login.pageId, "login");
  assert.equal(createReleaseReadinessReport(bundle).launchReady, false);
});
