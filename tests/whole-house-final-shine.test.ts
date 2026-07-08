import test from "node:test";
import assert from "node:assert/strict";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { getHumanityLawsArchiveManifest, getHumanityLawsQuoteLibrary } from "../src/humanity-laws-source/bookRegistry.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const majorRooms = [
  "/",
  "/dashboard",
  "/book",
  "/spark",
  "/adam",
  "/eve",
  "/council",
  "/table",
  "/library",
  "/founder",
  "/wellness",
  "/podcast",
  "/social-media-command-center",
  "/community",
  "/membership",
  "/settings",
] as const;

function htmlFor(path: string): string {
  return renderPageModelToHtml(routePage(path));
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

test("Whole House Final Shine gives every major page a clear purpose and one to three visible next steps", () => {
  for (const path of majorRooms) {
    const page = routePage(path);
    const html = renderPageModelToHtml(page);

    assert.ok(page.title.trim().length > 0, `${path} should have a title`);
    assert.ok(page.subtitle.trim().length > 0, `${path} should have a subtitle`);
    assert.ok(page.sections.length >= 1, `${path} should explain why the member is there`);
    assert.ok(page.actions.length >= 1, `${path} should have at least one action`);
    assert.match(html, /You're in /, `${path} should show the room indicator`);
    assert.match(html, /What you can do now/, `${path} should show next-step guidance`);
    assert.match(html, /data-continuity-layer="Natural Continuity &amp; Flow Layer"/, `${path} should carry the continuity layer`);
    assert.match(html, /data-speed-guardian="Performance &amp; Speed Guardian"/, `${path} should carry the speed guardian`);
    assert.match(html, /data-final-experience-layer="Humanity Laws V1 Final Experience Layer"/, `${path} should carry the final experience layer`);
    assert.equal(countMatches(html, /data-hero="primary"/g), 1, `${path} should have exactly one primary hero`);

    const visibleNextSteps = countMatches(html, /class="next-card"/g);
    assert.ok(visibleNextSteps >= 1, `${path} should have at least one visible next step`);
    assert.ok(visibleNextSteps <= 3, `${path} should limit visible next steps to three`);
  }
});

test("Whole House Final Shine preserves natural continuity and speed standards", () => {
  for (const path of majorRooms) {
    const html = htmlFor(path);

    assert.match(html, /This connects to the next room/, `${path} should explain how rooms connect`);
    assert.match(html, /return to your journey/i, `${path} should provide a calm return path`);
    assert.doesNotMatch(html, /must continue|forced path|blocking animation|fake loading/i, `${path} should not pressure or slow the member`);
  }
});

test("Whole House Final Shine leaves no major room as a dead end", () => {
  for (const path of majorRooms) {
    const html = htmlFor(path);
    const links = countMatches(html, /<a /g);
    assert.ok(links >= 3, `${path} should provide a way to continue through the house`);
    assert.doesNotMatch(html, /href="#"/, `${path} should not use empty placeholder links`);
  }
});

test("placeholder rooms are honest and make no fake live claims", () => {
  const podcast = htmlFor("/podcast");
  const social = htmlFor("/social-media-command-center");
  const community = htmlFor("/community");
  const wellness = htmlFor("/wellness");
  const companionRooms = [htmlFor("/adam"), htmlFor("/eve"), htmlFor("/council")].join("\n");

  assert.match(podcast, /Podcast publishing is not live yet/);
  assert.match(podcast, /No episodes are being presented as live/);
  assert.match(social, /No live publishing adapter is connected/);
  assert.match(social, /No social outlet is live-connected yet/);
  assert.match(community, /Community features are not live yet/);
  assert.match(community, /No fake members, fake conversations, fake activity, or fake testimonials/);
  assert.match(wellness, /Educational support only/);
  assert.match(wellness, /Health data requires explicit consent/);
  assert.match(companionRooms, /Avatar presence coming soon/);
  assert.match(companionRooms, /Not a live video call/);
  assert.doesNotMatch(podcast + social + community + wellness + companionRooms, /live video call is active|SMS is live|Adam is a real human|Eve is a real human|auto-posted|live dating is active|guaranteed health/i);
});

test("Settings is a real protected room with account, membership, and security paths", () => {
  const page = routePage("/settings");
  const html = renderPageModelToHtml(page);

  assert.equal(page.pageId, "settings");
  assert.equal(page.kind, "MEMBER");
  assert.match(html, /Account, membership, security, and preferences/);
  assert.match(html, /Open Dashboard/);
  assert.match(html, /Membership/);
  assert.match(html, /Launch Status/);
  assert.match(html, /\/login\?next=/, "protected-room client guard should remain present");
});

test("Book source registry remains preserved during whole-house polish", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const quoteLibrary = getHumanityLawsQuoteLibrary();
  const book = htmlFor("/book");

  assert.ok(manifest.source.pageCount > 0);
  assert.match(book, new RegExp(String(manifest.source.pageCount)));
  assert.match(book, new RegExp(manifest.source.sha256));
  assert.ok(quoteLibrary.quotes.every((quote) => quote.sourceSha256 === manifest.source.sha256));
});

test("membership and checkout routes preserve existing commerce paths", () => {
  const membership = routePage("/membership");
  const monthly = routePage("/checkout/monthly");
  const yearly = routePage("/checkout/yearly");
  const book = routePage("/checkout/book");

  assert.deepEqual(membership.actions.map((action) => action.href), ["/checkout/monthly", "/checkout/book", "/book/hardcover"]);
  assert.equal(monthly.actions[0]?.label, "Continue to Stripe");
  assert.equal(yearly.actions[0]?.label, "Continue to Stripe");
  assert.equal(book.actions[0]?.label, "Continue to Stripe");
});

test("Adam, Eve, and Council final shine behavior remains visible in the whole house", () => {
  const adam = htmlFor("/adam");
  const eve = htmlFor("/eve");
  const council = htmlFor("/council");

  assert.match(adam, /Write one clear message/);
  assert.match(eve, /Write one clear message/);
  assert.match(adam + eve, /Remember with my consent/);
  assert.match(adam + eve, /Save response as insight/);
  assert.match(council, /You make the final decision/);
});

test("Whole House Final Shine does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
