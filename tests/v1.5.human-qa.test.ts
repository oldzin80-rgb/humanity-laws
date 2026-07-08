import test from "node:test";
import assert from "node:assert/strict";
import { LaunchRoutes, routePage, renderPageModelToHtml } from "../src/application/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

const routeHtml = (path: string): string => renderPageModelToHtml(routePage(path));

test("all expected visitor, member, and admin routes render accessible page models", () => {
  const expected = ["/", "/book", "/join", "/login", "/dashboard", "/spark", "/adam", "/eve", "/council", "/table", "/library", "/podcast", "/social-media-command-center", "/founder", "/wellness", "/community", "/admin", "/launch-status"];
  for (const path of expected) {
    const route = LaunchRoutes.find((item) => item.path === path);
    assert.ok(route, `Missing route ${path}`);
    const page = routePage(path);
    const html = renderPageModelToHtml(page);
    assert.ok(page.title.length > 0, `${path} needs a title`);
    assert.ok(page.accessibilitySummary.length > 0, `${path} needs an accessibility summary`);
    assert.ok(html.includes("<main"), `${path} should render a main landmark`);
    assert.ok(html.includes("Skip to content"), `${path} should include skip navigation`);
    assert.ok(html.includes('data-final-experience-layer="Humanity Laws V1 Final Experience Layer"'), `${path} should carry the final experience layer`);
  }
});

test("unified house flow gives major rooms room indicators, next steps, and connected pathways", () => {
  const expectedRooms = ["/", "/dashboard", "/book", "/spark", "/adam", "/eve", "/council", "/table", "/library", "/podcast", "/social-media-command-center", "/founder", "/wellness", "/community"];
  for (const path of expectedRooms) {
    const html = routeHtml(path);
    assert.ok(html.includes("room-indicator"), `${path} should show where the member is`);
    assert.ok(html.includes("next-steps"), `${path} should show natural next steps`);
    assert.ok(html.includes("connected-pathways"), `${path} should connect to related rooms`);
  }
});

test("primary and secondary navigation match the unified house model", () => {
  const html = routeHtml("/");
  for (const label of ["Home", "Book", "Spark", "Adam &amp; Eve", "The Table", "Library", "Dashboard", "Council", "Podcast", "Founder", "Wellness", "Community", "Settings", "Membership"]) {
    assert.ok(html.includes(label), `Navigation should include ${label}`);
  }
});

test("Craftsmanship Pass 01 keeps Home focused, direct, and connected", () => {
  const page = routePage("/");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "A calm home for daily human growth.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Join for $7/month", "Read the Book", "Start Spark"]);
  assert.ok(html.includes("Know where you are."));
  assert.ok(html.includes("Start small. Continue naturally."));
  assert.ok(html.includes("AI companions, not authorities."));
  assert.ok(html.includes("You remain the final decision-maker."));
});

test("Craftsmanship Pass 01 keeps Dashboard calm and decision-light", () => {
  const page = routePage("/dashboard");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "One daily next step. Everything else can wait.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Start today's Spark", "Continue Reading", "Talk with Adam & Eve"]);
  assert.ok(html.includes("Begin with one thing."));
  assert.ok(html.includes("Experience Orchestrator"));
  assert.ok(html.includes("The house suggests. You choose."));
  assert.ok(html.includes("recommendations optional, limited, and explainable"));
  assert.ok(html.includes("No pressure loops."));
  assert.ok(html.includes("reduce decisions"));
  assert.ok(html.includes("Natural Continuity &amp; Flow Layer"));
  assert.ok(html.includes("Performance &amp; Speed Guardian"));
  assert.ok(html.includes("Humanity Laws V1 Final Experience Layer"));
  assert.ok(html.includes("Next steps should render before integrations finish"));
});

test("Natural continuity and speed guardians are visible without adding pressure", () => {
  const html = routeHtml("/spark");

  assert.ok(html.includes('data-continuity-layer="Natural Continuity &amp; Flow Layer"'));
  assert.ok(html.includes('data-speed-guardian="Performance &amp; Speed Guardian"'));
  assert.ok(html.includes("This connects to the next room"));
  assert.ok(html.includes("You can choose the next step, save this for later, or return to your journey."));
  assert.doesNotMatch(html, /must continue|forced path|loading forever|wait for every integration/i);
});

test("Craftsmanship Pass 02 keeps Book source-preserving and reading-first", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const page = routePage("/book");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "Read the source. Carry one principle into today.");
  assert.equal(page.actions[0]?.label, "Continue Reading");
  assert.deepEqual(page.actions.map((action) => action.label), ["Continue Reading", "Discuss with Adam & Eve", "Start a Spark", "Save to Library"]);
  assert.ok(html.includes(manifest.source.sha256), "Book page must keep source hash visible");
  assert.ok(html.includes("Quotes trace back to exact pages"), "Book page must keep quote provenance visible");
  assert.ok(html.includes("Book → Spark → Adam &amp; Eve → Library"), "Book should preserve connected pathway language");
});

test("Craftsmanship Pass 02 keeps Spark a clear daily practice with no dead end", () => {
  const page = routePage("/spark");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "Spin the wheel. Roll the dice. Receive one question worth carrying into your day.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Discuss with Adam & Eve", "Save Spark", "Share Spark"]);
  assert.ok(html.includes("Spin. Roll. Receive."));
  assert.ok(html.includes("Start Spark"));
  assert.ok(html.includes("Whisper"));
  assert.ok(html.includes("Wheel"));
  assert.ok(html.includes("Dice"));
  assert.ok(html.includes("Today’s move"));
  assert.ok(html.includes("connected-pathways"));
});

test("Craftsmanship Pass 03 keeps Adam and Eve conversation-first and connected", () => {
  const adam = routePage("/adam");
  const eve = routePage("/eve");
  const adamHtml = renderPageModelToHtml(adam);
  const eveHtml = renderPageModelToHtml(eve);

  assert.equal(adam.title, "Talk with Adam");
  assert.equal(eve.title, "Talk with Eve");
  assert.equal(adam.actions[0]?.label, "Talk with Adam");
  assert.equal(eve.actions[0]?.label, "Talk with Eve");
  for (const html of [adamHtml, eveHtml]) {
    assert.ok(html.includes("Conversation Room"));
    assert.ok(html.includes("Reflect on today&#039;s Spark"));
    assert.ok(html.includes("Open Council"));
    assert.ok(html.includes("Save insight"));
    assert.ok(html.includes("connected-pathways"));
  }
});

test("Craftsmanship Pass 03 keeps Council decision-focused with human final authority", () => {
  const page = routePage("/council");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "A calm room for decisions, tension, and deeper reflection.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Open Council", "Bring in Adam", "Bring in Eve", "Save outcome"]);
  assert.ok(html.includes("Council Chamber"));
  assert.ok(html.includes("Adam. Eve. Principle. Human choice."));
  assert.ok(html.includes("You make the final decision."));
  assert.ok(html.includes("final authority"));
  assert.ok(html.includes("Review the Humanity Laws principle."));
});

test("The Table stays warm, simple, connected, and not a feed", () => {
  const page = routePage("/table");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "Gather. Receive one beautiful prompt. Share honestly. Remember what mattered.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Discuss with Adam & Eve", "Save the Moment", "Start a Spark"]);
  assert.ok(html.includes("Gather → Prompt → Share → Remember"));
  assert.ok(html.includes("Family"));
  assert.ok(html.includes("Friends"));
  assert.ok(html.includes("Date"));
  assert.ok(html.includes("Dinner"));
  assert.ok(html.includes("Community"));
  assert.ok(html.includes("Founder Table"));
  assert.ok(html.includes("One prompt"));
  assert.ok(html.includes("Gratitude"));
  assert.ok(html.includes("Optional meal idea"));
  assert.ok(html.includes("Optional blessing or toast"));
  assert.ok(html.includes("queuedTableCompanionEvents"));
  assert.ok(html.includes("data-table-action=\"adam_eve_opened\""));
  assert.ok(html.includes("data-table-action=\"table_saved\""));
  assert.doesNotMatch(html, /infinite scroll|public feed|likes|ranking/i);
});

test("Podcast stays calm, reflective, honest, and connected", () => {
  const page = routePage("/podcast");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "Listen. Reflect. Discuss. Remember what stays with you.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Discuss with Adam & Eve", "Founder Letters", "Start a Spark"]);
  assert.ok(html.includes("Listen → Reflect → Discuss → Remember"));
  assert.ok(html.includes("Featured Episode"));
  assert.ok(html.includes("Founder Voice"));
  assert.ok(html.includes("Podcast publishing is not live yet"));
  assert.ok(html.includes("No episodes are being presented as live"));
  assert.ok(html.includes("queuedPodcastCompanionEvents"));
  assert.ok(html.includes("data-podcast-action=\"episode_played\""));
  assert.ok(html.includes("data-podcast-action=\"podcast_discussed\""));
  assert.ok(html.includes("data-podcast-action=\"podcast_reflection_saved\""));
  assert.doesNotMatch(html, /trending|listener count|reviews|ranking|noisy feed/i);
});

test("Social Media Command Center stays honest, approval-gated, and not a fake posting system", () => {
  const page = routePage("/social-media-command-center");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Growth & Communications Platform");
  assert.equal(page.subtitle, "One calm command center for campaigns, content, audiences, messages, calendars, approvals, and truthful growth.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Create Campaign", "Review with Adam & Eve", "Return to Dashboard"]);
  assert.ok(html.includes("Growth &amp; Communications"));
  assert.ok(html.includes("Social Media Command Center"));
  assert.ok(html.includes("Master Content Engine"));
  assert.ok(html.includes("Create once. Distribute thoughtfully."));
  assert.ok(html.includes("Idea → Campaign → Content Set → Channel Arrangement → Schedule → Approval → Publish/Export → Reflect/Analyze"));
  assert.ok(html.includes("Human approval stays before publishing."));
  assert.ok(html.includes("Manual export only"));
  assert.ok(html.includes("No social outlet is live-connected yet"));
  assert.ok(html.includes("queuedSocialCommandCenterEvents"));
  assert.ok(html.includes("data-social-action=\"campaign_created\""));
  assert.ok(html.includes("data-social-action=\"campaign_approved\""));
  assert.ok(html.includes("data-social-action=\"campaign_exported\""));
  assert.doesNotMatch(html, /auto-posted|live audience|viral/i);
});

test("Community & Relationships stays privacy-first, safety-gated, and not a fake social network", () => {
  const page = routePage("/community");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Community");
  assert.equal(page.subtitle, "A living place for connection, trust, and private member appreciation.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Visit The Table", "Review Launch Status", "Return to Dashboard"]);
  assert.ok(html.includes("Technology should help people connect more meaningfully"));
  assert.ok(html.includes("Founder’s Blessings"));
  assert.ok(html.includes("may vary and are not guaranteed"));
  assert.ok(html.includes("Founder final approval is required"));
  assert.ok(html.includes("Money movement: Disabled"));
  assert.ok(html.includes("Quiet Impact"));
  assert.ok(html.includes("Communication: One-to-One"));
  assert.ok(html.includes("Members are always free to share their own experiences"));
  assert.ok(html.includes("The Table Expansion"));
  assert.ok(html.includes("Meeting &amp; Dating"));
  assert.ok(html.includes("No fake members, fake conversations, fake activity, or fake testimonials"));
  assert.ok(html.includes("Community features are not live yet"));
  assert.doesNotMatch(html, /fake member joined|live dating is active|messages are live|public ranking|casino|lottery|jackpot|giveaway|prize pool/i);
});

test("Human OS Wellness stays supportive, educational, and medically bounded", () => {
  const page = routePage("/wellness");
  const html = renderPageModelToHtml(page);

  assert.equal(page.title, "Human OS Wellness");
  assert.equal(page.subtitle, "A calm garden for sustainable habits across body, mind, relationships, purpose, recovery, and daily stewardship.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Start Spark", "Talk with Adam & Eve", "Save to Library"]);
  assert.ok(html.includes("Daily check-in. One focus. Gentle progress."));
  assert.ok(html.includes("Educational support only."));
  assert.ok(html.includes("No diagnosis."));
  assert.ok(html.includes("No prescription."));
  assert.ok(html.includes("No shame-based language."));
  assert.ok(html.includes("Different ability levels respected."));
  assert.ok(html.includes("Health data requires explicit consent."));
  assert.ok(html.includes("Encouragement, not medical authority."));
  assert.doesNotMatch(html, /I can diagnose|I will prescribe|guaranteed health|medical authority over/i);
});

test("Adam and Eve reach conversation UI readiness with real input and output controls", () => {
  for (const path of ["/adam", "/eve"]) {
    const html = routeHtml(path);
    assert.ok(html.includes("conversation-panel"), `${path} should render a conversation panel`);
    assert.ok(html.includes("data-companion-form"), `${path} should render a companion form`);
    assert.ok(html.includes("Your message"), `${path} should provide a message input`);
    assert.ok(html.includes("data-companion-output"), `${path} should provide a response output area`);
    assert.ok(html.includes("/api/companion"), `${path} should post to the companion API`);
    assert.ok(html.includes("your judgment stays final"), `${path} should preserve the human judgment boundary`);
  }
});

test("Adam and Eve production conversation UI includes history, streaming, consent, and saved insights", () => {
  for (const path of ["/adam", "/eve"]) {
    const html = routeHtml(path);
    assert.ok(html.includes("data-companion-history"), `${path} should render persistent local conversation history`);
    assert.ok(html.includes("Remember with my consent."), `${path} should show memory consent`);
    assert.ok(html.includes("Save response as insight."), `${path} should show saved insight consent`);
    assert.ok(html.includes("data-save-latest-insight"), `${path} should include a save latest insight action`);
    assert.ok(html.includes("data-stream-output"), `${path} should progressively render response output`);
    assert.ok(html.includes("hl_companion_history_v1_"), `${path} should persist local history by companion`);
    assert.ok(html.includes("hl_saved_insights_v1"), `${path} should persist saved insights locally`);
  }
});

test("member experience clearly communicates AI transparency and human judgment", () => {
  for (const path of ["/", "/adam", "/eve", "/council", "/dashboard"]) {
    const html = routeHtml(path);
    assert.ok(html.includes("AI companion") || html.includes("AI companions"), `${path} should disclose AI companionship`);
    assert.ok(html.includes("human judgment") || html.includes("Human judgment") || html.includes("human remains first"), `${path} should preserve human judgment`);
  }
});

test("memory, source, archive, and professional-boundary language is visible where users need it", () => {
  const manifest = getHumanityLawsArchiveManifest();
  assert.ok(routeHtml("/dashboard").includes("Memory is consent-aware"));
  assert.ok(routeHtml("/book").includes(manifest.source.sha256));
  assert.ok(routeHtml("/book").includes("Quotes trace back to exact pages"));
  assert.ok(routeHtml("/library").includes("Quote entries with page provenance"));
  assert.ok(routeHtml("/council").includes("High-risk questions require qualified help"));
  assert.ok(routeHtml("/admin").includes("does not approve launch"));
});

test("launch status remains plainly blocked for real users", () => {
  const html = routeHtml("/launch-status");
  assert.ok(html.includes("Launch Not Ready Yet"));
  assert.ok(html.includes("Launch ready: false"));
  assert.ok(html.includes("MANUAL_REVIEW"));
  assert.ok(html.includes("RELEASE_APPROVAL"));
  assert.ok(html.includes("DEPLOYMENT_LOG"));
});
