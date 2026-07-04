import test from "node:test";
import assert from "node:assert/strict";
import { LaunchRoutes, routePage, renderPageModelToHtml } from "../src/application/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

const routeHtml = (path: string): string => renderPageModelToHtml(routePage(path));

test("all expected visitor, member, and admin routes render accessible page models", () => {
  const expected = ["/", "/book", "/join", "/login", "/dashboard", "/spark", "/adam", "/eve", "/council", "/table", "/library", "/podcast", "/founder", "/wellness", "/community", "/admin", "/launch-status"];
  for (const path of expected) {
    const route = LaunchRoutes.find((item) => item.path === path);
    assert.ok(route, `Missing route ${path}`);
    const page = routePage(path);
    const html = renderPageModelToHtml(page);
    assert.ok(page.title.length > 0, `${path} needs a title`);
    assert.ok(page.accessibilitySummary.length > 0, `${path} needs an accessibility summary`);
    assert.ok(html.includes("<main"), `${path} should render a main landmark`);
    assert.ok(html.includes("Skip to content"), `${path} should include skip navigation`);
  }
});

test("unified house flow gives major rooms room indicators, next steps, and connected pathways", () => {
  const expectedRooms = ["/", "/dashboard", "/book", "/spark", "/adam", "/eve", "/council", "/table", "/library", "/podcast", "/founder", "/wellness", "/community"];
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

  assert.equal(page.subtitle, "Choose one clear next step and continue from there.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Start today's Spark", "Continue Reading", "Talk with Adam & Eve"]);
  assert.ok(html.includes("Begin with one thing."));
  assert.ok(html.includes("No pressure loops."));
  assert.ok(html.includes("reduce decisions"));
});

test("Craftsmanship Pass 02 keeps Book source-preserving and reading-first", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const page = routePage("/book");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "Read the source. Carry one principle into daily practice.");
  assert.equal(page.actions[0]?.label, "Continue Reading");
  assert.deepEqual(page.actions.map((action) => action.label), ["Continue Reading", "Discuss with Adam & Eve", "Start a Spark", "Save to Library"]);
  assert.ok(html.includes(manifest.source.sha256), "Book page must keep source hash visible");
  assert.ok(html.includes("Quotes trace back to exact pages"), "Book page must keep quote provenance visible");
  assert.ok(html.includes("Book → Spark → Adam &amp; Eve → Library"), "Book should preserve connected pathway language");
});

test("Craftsmanship Pass 02 keeps Spark a clear daily practice with no dead end", () => {
  const page = routePage("/spark");
  const html = renderPageModelToHtml(page);

  assert.equal(page.subtitle, "One prompt. One reflection. One next step.");
  assert.deepEqual(page.actions.map((action) => action.label), ["Start today's Spark", "Reflect with Adam & Eve", "Save to Library", "Continue Reading"]);
  assert.ok(html.includes("Reveal today&#039;s prompt."));
  assert.ok(html.includes("Pause for one minute."));
  assert.ok(html.includes("Reflect with Adam and Eve"));
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
