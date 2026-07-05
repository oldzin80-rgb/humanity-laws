import test from "node:test";
import assert from "node:assert/strict";
import {
  createGrowthCommunicationsPlatform,
  createMasterContentDraftSet,
  runBrandGuardianReview,
} from "../src/experiences/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";

test("Growth & Communications Platform includes all major modules", () => {
  const platform = createGrowthCommunicationsPlatform();
  const moduleIds = platform.modules.map((module) => module.id);

  assert.equal(platform.name, "Growth & Communications Platform");
  for (const expected of [
    "campaign_orchestrator",
    "content_studio",
    "content_library",
    "automation_builder",
    "audience_manager",
    "communication_center",
    "editorial_calendar",
    "analytics",
    "brand_guardian",
    "adam_eve_integration",
    "founder_workspace",
    "future_api_layer",
    "master_content_engine",
  ]) {
    assert.ok(moduleIds.includes(expected as never), `Missing ${expected}`);
  }
  assert.ok(platform.modules.every((module) => module.humanApprovalRequired === true));
});

test("Growth platform supports campaigns, destinations, formats, library assets, and calendar types", () => {
  const platform = createGrowthCommunicationsPlatform();

  for (const campaign of ["launch_campaign", "evergreen_campaign", "seasonal_campaign", "founder_campaign", "book_campaign", "membership_campaign", "spark_campaign", "podcast_campaign", "event_campaign"]) {
    assert.ok(platform.campaignKinds.includes(campaign as never), `Missing campaign ${campaign}`);
  }

  for (const destination of ["instagram", "facebook", "tiktok", "youtube", "youtube_shorts", "x_twitter", "threads", "linkedin", "pinterest", "blog", "website", "founder_letter", "email_newsletter", "sms_text_campaign"]) {
    assert.ok(platform.contentDestinations.includes(destination as never), `Missing destination ${destination}`);
  }

  for (const format of ["caption", "long_form_post", "reel_script", "short_script", "carousel_copy", "video_script", "newsletter", "landing_page", "podcast_outline", "speaking_notes"]) {
    assert.ok(platform.outputFormats.includes(format as never), `Missing format ${format}`);
  }

  for (const asset of ["founder_reflection", "quote", "spark_moment", "podcast_clip", "book_excerpt", "testimonial", "photo", "video", "graphic", "campaign", "reusable_asset"]) {
    assert.ok(platform.libraryAssetTypes.includes(asset as never), `Missing asset ${asset}`);
  }

  assert.ok(platform.editorialCalendarTypes.includes("podcast"));
  assert.ok(platform.editorialCalendarTypes.includes("founder_letter"));
  assert.ok(platform.editorialCalendarTypes.includes("social_campaign"));
  assert.ok(platform.editorialCalendarTypes.includes("wellness_content"));
});

test("Master Content Engine creates one approved seed into many human-reviewed drafts", () => {
  const platform = createGrowthCommunicationsPlatform();
  const draftSet = createMasterContentDraftSet(platform.masterContentSeed);

  assert.equal(platform.masterContentSeed.requiresHumanReview, true);
  assert.equal(platform.masterContentSeed.constitutionalAlignment, "references_source_without_rewriting");
  assert.equal(draftSet.seedId, platform.masterContentSeed.id);
  assert.ok(draftSet.founderLetter);
  assert.ok(draftSet.podcastOutline);
  assert.ok(draftSet.blogPost);
  assert.ok(draftSet.youtubeScript);
  assert.ok(draftSet.shortFormScript);
  assert.ok(draftSet.socialPosts.length >= 3);
  assert.ok(draftSet.emailNewsletter);
  assert.ok(draftSet.smsReminder);
  assert.ok(draftSet.sparkConnection);
  assert.ok(draftSet.adamEveDiscussionPrompts.length >= 3);
  assert.ok(draftSet.relatedBookTheme);
  assert.equal(draftSet.requiresHumanApproval, true);
  assert.equal(draftSet.publishAutomatically, false);
});

test("Brand Guardian blocks manipulation, fake urgency, fake testimonials, and fake engagement", () => {
  const review = runBrandGuardianReview();

  assert.equal(review.voiceAligned, true);
  assert.equal(review.truthfulClaims, true);
  assert.equal(review.respectfulLanguage, true);
  assert.equal(review.noManipulation, true);
  assert.equal(review.noFakeUrgency, true);
  assert.equal(review.noFakeTestimonials, true);
  assert.equal(review.noFakeEngagement, true);
  assert.equal(review.requiresHumanApproval, true);
});

test("Automation, audience, analytics, and future APIs remain honest placeholders", () => {
  const platform = createGrowthCommunicationsPlatform();

  assert.ok(platform.automationWorkflows.every((workflow) => workflow.enabled === false));
  assert.ok(platform.audienceSegments.every((segment) => segment.consentRequired === true && segment.liveTargetingEnabled === false));
  assert.equal(platform.analytics.reach, null);
  assert.equal(platform.analytics.podcastListening, null);
  assert.match(platform.analytics.note, /placeholders/);
  assert.deepEqual(platform.futureApiLayer, ["social_platforms", "email_providers", "sms_providers", "analytics_providers", "crm_systems"]);
  assert.ok(platform.socialAdapters.every((adapter) => adapter.livePublishingEnabled === false));
});

test("Adam and Eve can assist growth work but cannot publish, send, or fake metrics", () => {
  const platform = createGrowthCommunicationsPlatform();

  assert.deepEqual(platform.adamEveAllowedActions, ["recommend_campaign_ideas", "organize_drafts", "summarize_analytics", "suggest_improvements"]);
  assert.deepEqual(platform.adamEveForbiddenActions, ["publish_without_human_approval", "send_without_human_approval", "fake_metrics", "fake_testimonials"]);
});

test("Growth page renders as a calm admin command center with no fake live claims", () => {
  const page = routePage("/social-media-command-center");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Growth & Communications Platform");
  assert.match(html, /Campaign Orchestrator/);
  assert.match(html, /Master Content Engine/);
  assert.match(html, /Create once\. Distribute thoughtfully\./);
  assert.match(html, /Founder Letter, podcast outline, blog, YouTube, Shorts, social, email, SMS, Spark, Adam &amp; Eve prompts/);
  assert.match(html, /Human approval stays before publishing/);
  assert.match(html, /Manual export only/);
  assert.doesNotMatch(html, /auto-posted|live audience|fake followers|fake analytics|fake publishing/i);
});

test("Growth platform does not change launchReady", () => {
  const platform = createGrowthCommunicationsPlatform();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(platform.launchReady, false);
  assert.equal(report.launchReady, false);
});
