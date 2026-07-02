import test from "node:test";
import assert from "node:assert/strict";
import { LaunchRoutes, routePage, renderPageModelToHtml } from "../src/application/index.js";
import { getHumanityLawsArchiveManifest } from "../src/humanity-laws-source/bookRegistry.js";

const routeHtml = (path: string): string => renderPageModelToHtml(routePage(path));

test("all expected visitor, member, and admin routes render accessible page models", () => {
  const expected = ["/", "/book", "/join", "/login", "/dashboard", "/spark", "/adam", "/eve", "/council", "/library", "/admin", "/launch-status"];
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
