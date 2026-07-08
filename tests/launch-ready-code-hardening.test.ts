import test from "node:test";
import assert from "node:assert/strict";
import { LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const routeMap = new Map(LaunchRoutes.map((route) => [route.path, route]));

test("Launch hardening core user flow routes exist and resolve", () => {
  for (const path of [
    "/",
    "/membership",
    "/signup",
    "/login",
    "/checkout/monthly",
    "/checkout/book",
    "/checkout/success",
    "/dashboard",
    "/book",
    "/book/hardcover",
    "/admin",
  ]) {
    assert.ok(routeMap.has(path), `Missing launch-critical route ${path}`);
    assert.ok(routePage(path).title.length > 0, `${path} should resolve to a page`);
  }
});

test("Launch hardening protects member-only and admin-only routes", () => {
  for (const path of ["/dashboard", "/book", "/member-room", "/spark", "/adam", "/eve", "/council", "/founder", "/wellness", "/table", "/library", "/community", "/settings"]) {
    assert.equal(routeMap.get(path)?.requiresAuth, true, `${path} should require auth`);
  }

  assert.equal(routeMap.get("/")?.requiresAuth, false);
  assert.equal(routeMap.get("/membership")?.requiresAuth, false);
  assert.equal(routeMap.get("/book/hardcover")?.requiresAuth, false);
  assert.equal(routeMap.get("/admin")?.requiresAuth, true);
  assert.equal(routeMap.get("/admin")?.requiresAdmin, true);
  assert.equal(routeMap.get("/social-media-command-center")?.requiresAdmin, true);
});

test("Launch hardening renders admin allowlist guard for admin-only rooms", () => {
  const adminHtml = renderPageModelToHtml(routePage("/admin"));
  const socialCommandHtml = renderPageModelToHtml(routePage("/social-media-command-center"));

  for (const html of [adminHtml, socialCommandHtml]) {
    assert.match(html, /adminOnly=\["\/admin","\/social-media-command-center"\]/);
    assert.match(html, /adminAllowlist/);
    assert.match(html, /admin=required/);
  }
});

test("Launch hardening presents three clear commerce paths without donations or advertising", () => {
  const membership = routePage("/membership");
  const html = renderPageModelToHtml(membership);

  assert.deepEqual(membership.actions.map((action) => action.href), ["/checkout/monthly", "/checkout/book", "/book/hardcover"]);
  assert.deepEqual(membership.actions.map((action) => action.label), ["Join monthly — $7", "Digital book only", "Hardcover coming soon"]);
  assert.match(html, /Monthly membership is \$7\/month and includes digital book access/);
  assert.match(html, /Digital book purchase unlocks book access only/);
  assert.match(html, /Hardcover remains separate and coming soon/);
  assert.match(html, /No donations\. No advertising\./);
});

test("Launch hardening keeps digital book, membership, and hardcover boundaries distinct", () => {
  const monthly = renderPageModelToHtml(routePage("/checkout/monthly"));
  const book = renderPageModelToHtml(routePage("/checkout/book"));
  const hardcover = renderPageModelToHtml(routePage("/book/hardcover"));

  assert.match(monthly, /Monthly membership includes digital book access/);
  assert.match(book, /Digital book purchase unlocks the book only/);
  assert.match(book, /does not unlock Dashboard, Spark, Council, Wellness, or the full member room/);
  assert.match(hardcover, /No fake fulfillment/);
  assert.match(hardcover, /print-on-demand provider/);
  assert.doesNotMatch(hardcover, /Buy hardcover now|fulfilled today|shipping now/i);
});

test("Launch hardening keeps mobile shell, return paths, and final experience guardrails", () => {
  for (const path of ["/", "/membership", "/dashboard", "/book", "/checkout/monthly", "/checkout/book", "/book/hardcover"]) {
    const html = renderPageModelToHtml(routePage(path));
    assert.match(html, /<meta name="viewport"/, `${path} should include mobile viewport`);
    assert.match(html, /Humanity Laws home/, `${path} should provide home return`);
    assert.match(html, /data-final-experience-layer="Humanity Laws V1 Final Experience Layer"/, `${path} should keep final experience guardrail`);
    assert.doesNotMatch(html, /href="#"/, `${path} should not expose dead placeholder links`);
  }
});

test("Launch hardening does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
