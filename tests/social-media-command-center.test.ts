import test from "node:test";
import assert from "node:assert/strict";
import {
  createSocialCommandCenterEvent,
  createSocialMediaCommandCenterExperience,
  SocialIntegrationStates,
  SocialOutletAdapters,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";

test("Social Media Command Center models the full campaign flow honestly", () => {
  const experience = createSocialMediaCommandCenterExperience();

  assert.deepEqual(experience.path, ["Idea", "Campaign", "Content Set", "Channel Arrangement", "Schedule", "Approval", "Publish/Export", "Reflect/Analyze"]);
  assert.ok(experience.campaignTypes.includes("founder_reflection"));
  assert.ok(experience.campaignTypes.includes("book_theme"));
  assert.ok(experience.campaignTypes.includes("spark_prompt"));
  assert.ok(experience.campaignTypes.includes("adam_eve_conversation_invitation"));
  assert.ok(experience.campaignTypes.includes("podcast_listening_room"));
  assert.ok(experience.campaignTypes.includes("the_table"));
  assert.ok(experience.campaignTypes.includes("membership_invitation"));
  assert.ok(experience.campaignTypes.includes("short_form_video_script"));
  assert.ok(experience.goals.includes("awareness"));
  assert.ok(experience.goals.includes("book_sales"));
  assert.ok(experience.goals.includes("membership_conversion"));
  assert.ok(experience.goals.includes("launch_announcement"));
  assert.equal(experience.noFakePosting, true);
  assert.equal(experience.noFakeEngagement, true);
  assert.equal(experience.launchSafe, true);
});

test("Social outlet adapters are provider-ready placeholders with no fake live publishing", () => {
  const outlets = SocialOutletAdapters.map((adapter) => adapter.outlet);

  for (const expected of ["instagram", "facebook", "tiktok", "youtube", "youtube_shorts", "x_twitter", "linkedin", "threads", "pinterest", "email_newsletter", "sms_text_campaign", "website_announcement", "future_outlet"]) {
    assert.ok(outlets.includes(expected as never), `Missing ${expected}`);
  }

  assert.deepEqual(SocialIntegrationStates, ["not_connected", "connection_required", "connected", "approval_required", "ready_to_publish", "publish_failed", "exported_manually"]);
  assert.ok(SocialOutletAdapters.every((adapter) => adapter.manualExportAvailable === true));
  assert.ok(SocialOutletAdapters.every((adapter) => adapter.livePublishingEnabled === false));
  assert.ok(SocialOutletAdapters.every((adapter) => adapter.configurationNote.length > 0));
});

test("Social campaign content preserves the Humanity Laws voice and approval gate", () => {
  const campaign = createSocialMediaCommandCenterExperience().featuredCampaign;
  const content = campaign.contentSet[0];

  assert.equal(campaign.humanApprovalRequired, true);
  assert.equal(campaign.canPublishAutomatically, false);
  assert.deepEqual(campaign.voice, ["calm", "truthful", "classy", "Apple-like", "spiritual but not forced"]);
  assert.ok(campaign.prohibitedClaims.includes("fake scarcity"));
  assert.ok(campaign.prohibitedClaims.includes("fake audience behavior"));
  assert.ok(campaign.prohibitedClaims.includes("exaggerated claims"));
  assert.ok(campaign.prohibitedClaims.includes("hype manipulation"));
  assert.ok(content?.caption);
  assert.ok(content?.shortCaption);
  assert.ok(content?.longCaption);
  assert.ok(content?.hashtags.length);
  assert.ok(content?.carouselText.length);
  assert.ok(content?.videoScript);
  assert.ok(content?.reelOrShortHook);
  assert.ok(content?.cta);
  assert.ok(content?.imageDirection);
  assert.ok(content?.postingNotes.includes("Export manually"));
});

test("Social command center page renders as an admin command room with honest placeholder language", () => {
  const route = LaunchRoutes.find((item) => item.path === "/social-media-command-center");
  const page = routePage("/social-media-command-center");
  const html = renderPageModelToHtml(page);

  assert.equal(route?.requiresAuth, true);
  assert.equal(route?.requiresAdmin, true);
  assert.equal(page.pageId, "social-media-command-center");
  assert.equal(page.kind, "ADMIN");
  assert.match(html, /Growth &amp; Communications Platform/);
  assert.match(html, /Social Media Command Center/);
  assert.match(html, /Master Content Engine/);
  assert.match(html, /Idea → Campaign → Content Set → Channel Arrangement → Schedule → Approval → Publish\/Export → Reflect\/Analyze/);
  assert.match(html, /Manual export only/);
  assert.match(html, /No live publishing adapter is connected/);
  assert.match(html, /No social outlet is live-connected yet/);
  assert.match(html, /queuedSocialCommandCenterEvents/);
  assert.match(html, /data-social-action="campaign_created"/);
  assert.match(html, /data-social-action="campaign_approved"/);
  assert.match(html, /data-social-action="campaign_exported"/);
  assert.doesNotMatch(html, /published live|auto-posted|live audience|viral/i);
});

test("Social command center events are member-owned and bufferable for Adam and Eve", () => {
  const event = createSocialCommandCenterEvent({
    userId: "admin_test",
    type: "campaign_created",
    outlet: "instagram",
    createdAt: "2026-07-04T00:00:00.000Z",
  });

  assert.equal(event.userId, "admin_test");
  assert.equal(event.type, "campaign_created");
  assert.equal(event.source, "social_media_command_center");
  assert.equal(event.outlet, "instagram");
  assert.equal(event.companionVisible, true);
  assert.equal(event.userOwned, true);
  assert.equal(event.editableByUser, true);
  assert.equal(event.deletableByUser, true);
  assert.equal(event.purpose, "campaign_planning_approval_export_and_reflection");
});

test("Social command center does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
