import test from "node:test";
import assert from "node:assert/strict";
import { createCommunityRelationshipsPlatform } from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

test("Community & Relationships Platform includes all major modules", () => {
  const platform = createCommunityRelationshipsPlatform();
  const moduleIds = platform.modules.map((module) => module.id);

  assert.equal(platform.name, "Community & Relationships Platform");
  assert.equal(platform.corePhilosophy, "Technology should help people connect more meaningfully, never manipulate or replace real human relationships.");
  for (const expected of [
    "community_hub",
    "table_expansion",
    "groups",
    "events",
    "meeting_and_dating",
    "conversation_engine",
    "shared_journey",
    "volunteer_and_service",
    "privacy_and_trust",
    "adam_eve_community_support",
    "founder_community",
    "future_integrations",
  ]) {
    assert.ok(moduleIds.includes(expected as never), `Missing ${expected}`);
  }
  assert.ok(platform.modules.every((module) => module.privacyByDefault === true));
  assert.ok(platform.modules.every((module) => module.humanModerationRequired === true));
});

test("Community platform supports relationship groups, events, meeting modes, and conversation prompts", () => {
  const platform = createCommunityRelationshipsPlatform();

  for (const group of ["families", "friends", "couples", "study_groups", "wellness_groups", "volunteer_groups", "book_clubs", "faith_discussions", "local_meetups"]) {
    assert.ok(platform.groupTypes.includes(group as never), `Missing group ${group}`);
  }

  for (const event of ["in_person", "virtual", "hybrid", "founder_event", "community_gathering", "wellness_session", "book_discussion", "spark_circle"]) {
    assert.ok(platform.eventTypes.includes(event as never), `Missing event ${event}`);
  }

  for (const mode of ["friendship", "mentorship", "professional_networking", "dating", "marriage_minded_connections"]) {
    assert.ok(platform.connectionModes.includes(mode as never), `Missing connection mode ${mode}`);
  }

  for (const prompt of ["icebreaker", "reflection_question", "group_discussion_guide", "family_conversation", "couple_conversation", "parenting_prompt", "team_conversation"]) {
    assert.ok(platform.conversationPromptTypes.includes(prompt as never), `Missing prompt ${prompt}`);
  }
});

test("The Table expansion remains invitation-ready but not fake-live", () => {
  const table = createCommunityRelationshipsPlatform().tableExpansion;

  assert.deepEqual(table.primaryPath, ["Gather", "Prompt", "Share", "Remember"]);
  assert.ok(table.supports.includes("invite_others"));
  assert.ok(table.supports.includes("dinner_planning"));
  assert.ok(table.supports.includes("conversation_guides"));
  assert.ok(table.supports.includes("shared_reflections"));
  assert.ok(table.supports.includes("hospitality_ideas"));
  assert.ok(table.supports.includes("celebration_planning"));
  assert.equal(table.adamEveContextAllowed, true);
  assert.equal(table.liveInvitesEnabled, false);
});

test("Meeting and dating safety requires consent, privacy, reporting, blocking, and moderation", () => {
  const safety = createCommunityRelationshipsPlatform().safety;

  assert.equal(safety.humanVerificationOptions, "provider_ready_not_live");
  assert.equal(safety.consentControls, true);
  assert.equal(safety.privacySettings, true);
  assert.equal(safety.reporting, "modeled_not_live");
  assert.equal(safety.blocking, "modeled_not_live");
  assert.equal(safety.moderationTools, "human_review_required");
  assert.equal(safety.datingSafety, "respect_user_choice_and_safety");
});

test("Privacy and shared journey controls avoid public comparison and invasive defaults", () => {
  const platform = createCommunityRelationshipsPlatform();

  assert.deepEqual(platform.privacyControls, ["visibility", "discoverability", "messaging", "invitations", "profile_sharing", "activity_sharing"]);
  assert.equal(platform.sharedJourney.shareGoals, true);
  assert.equal(platform.sharedJourney.celebrateMilestones, true);
  assert.equal(platform.sharedJourney.trackGroupProgress, "consent_required");
  assert.equal(platform.sharedJourney.rememberMeaningfulMoments, "member_owned");
  assert.equal(platform.sharedJourney.publicComparison, false);
});

test("Adam and Eve community support is helpful but bounded", () => {
  const support = createCommunityRelationshipsPlatform().adamEveSupport;

  assert.deepEqual(support.may, ["suggest_discussion_topics", "recommend_resources", "facilitate_reflections"]);
  assert.deepEqual(support.mustNever, ["pretend_to_be_human", "force_introductions", "manipulate_relationships", "override_user_preferences"]);
  assert.equal(support.aiTransparencyRequired, true);
  assert.equal(support.humanChoiceRequired, true);
});

test("Future community integrations are provider-ready placeholders only", () => {
  const integrations = createCommunityRelationshipsPlatform().futureIntegrations;

  assert.deepEqual(integrations.map((adapter) => adapter.provider), ["calendar_provider", "video_meeting_platform", "messaging_system", "event_ticketing", "identity_verification"]);
  assert.ok(integrations.every((adapter) => adapter.liveEnabled === false));
  assert.ok(integrations.every((adapter) => adapter.configurationNote.length > 0));
});

test("Community page renders honest relationship platform language with no fake activity", () => {
  const page = routePage("/community");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Community & Relationships");
  assert.match(html, /Technology should help people connect more meaningfully/);
  assert.match(html, /The Table Expansion/);
  assert.match(html, /Meeting &amp; Dating/);
  assert.match(html, /privacy controls, human verification options, reporting, blocking/);
  assert.match(html, /No fake members, fake conversations, fake activity, or fake testimonials/);
  assert.match(html, /Community features are not live yet/);
  assert.doesNotMatch(html, /fake member joined|live dating is active|messages are live|real human replacement/i);
});

test("Community & Relationships Platform does not change launchReady", () => {
  const platform = createCommunityRelationshipsPlatform();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(platform.launchReady, false);
  assert.equal(report.launchReady, false);
});
