import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { LaunchRoutes } from "../src/application/router.js";
import { exportStaticSite } from "../src/application/staticSiteExporter.js";

test("static site exporter generates every launch route for staging hosting", async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), "humanity-laws-static-"));
  const result = await exportStaticSite(outputDir);

  assert.equal(result.files.length, LaunchRoutes.length);
  assert.ok(result.files.some((file) => file.routePath === "/"));
  assert.ok(result.files.some((file) => file.routePath === "/admin" && file.requiresAdmin));

  const homeHtml = await readFile(path.join(outputDir, "index.html"), "utf8");
  assert.match(homeHtml, /Humanity Laws/);
  assert.match(homeHtml, /Adam and Eve are AI companions/);

  const manifest = JSON.parse(await readFile(path.join(outputDir, "staging-manifest.json"), "utf8")) as {
    launchReady: boolean;
    routes: unknown[];
  };
  assert.equal(manifest.launchReady, false);
  assert.equal(manifest.routes.length, LaunchRoutes.length);
});

