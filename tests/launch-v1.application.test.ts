import test from "node:test";
import assert from "node:assert/strict";
import { LaunchRoutes, createFamousReadyExport, routePage, renderPageModelToHtml } from "../src/application/index.js";

test("all launch routes resolve to page models and Famous-ready HTML", () => {
  assert.ok(LaunchRoutes.length >= 14);
  const exported = createFamousReadyExport();
  assert.equal(exported.length, LaunchRoutes.length);
  for (const page of exported) {
    assert.ok(page.html.includes("Humanity Laws"));
    assert.ok(page.html.includes("<main"));
  }
});

test("Adam and Eve pages disclose AI companion status", () => {
  assert.ok(renderPageModelToHtml(routePage("/adam")).includes("AI companion"));
  assert.ok(renderPageModelToHtml(routePage("/eve")).includes("AI companion"));
});
