import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { exportStaticSite, LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";
import { REQUIRED_STAGING_PATHS, verifyDeployment } from "../src/deployment/index.js";

const REQUIRED_PRODUCTION_PATHS = ["/", "/login", "/signup", "/dashboard", "/book", "/membership"] as const;

function routeToOutputPath(outputDir: string, routePath: string): string {
  if (routePath === "/") return path.join(outputDir, "index.html");
  return path.join(outputDir, routePath.replace(/^\//, ""), "index.html");
}

test("expected production routes are registered", () => {
  const registered = new Set(LaunchRoutes.map((route) => route.path));
  for (const routePath of REQUIRED_PRODUCTION_PATHS) {
    assert.equal(registered.has(routePath), true, `${routePath} should be registered`);
  }
});

test("membership route serves the existing join page model", () => {
  assert.equal(routePage("/membership").pageId, "join");
});

test("static export writes concrete HTML files for production routes", async () => {
  const result = await exportStaticSite("dist-test");
  const exported = new Set(result.files.map((file) => file.routePath));

  for (const routePath of REQUIRED_PRODUCTION_PATHS) {
    assert.equal(exported.has(routePath), true, `${routePath} should be exported`);
    const html = await readFile(routeToOutputPath("dist-test", routePath), "utf8");
    assert.ok(html.includes("<main"));
    assert.equal(html.includes("404: NOT_FOUND"), false);
  }
});

test("protected exported route redirects unauthenticated users client-side", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));
  assert.ok(html.includes("/login?next="));
  assert.ok(html.includes('data-page-kind="MEMBER"'));
});

test("deployment verifier includes signup and membership in required route checks", async () => {
  const visited = new Set<string>();
  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(input instanceof URL ? input.toString() : String(input));
    visited.add(url.pathname);
    return new Response("ok", { status: 200 });
  };

  const result = await verifyDeployment({
    deploymentUrl: "https://humanity-laws.example",
    fetchImpl,
  });

  assert.equal(result.passed, true);
  assert.deepEqual([...visited], [...REQUIRED_STAGING_PATHS]);
  assert.equal(visited.has("/signup"), true);
  assert.equal(visited.has("/membership"), true);
});

test("deployment verifier fails on production 404", async () => {
  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(input instanceof URL ? input.toString() : String(input));
    return new Response(url.pathname === "/signup" ? "not found" : "ok", {
      status: url.pathname === "/signup" ? 404 : 200,
    });
  };

  const result = await verifyDeployment({
    deploymentUrl: "https://humanity-laws.example",
    requiredPaths: [...REQUIRED_PRODUCTION_PATHS],
    fetchImpl,
  });

  assert.equal(result.passed, false);
  assert.equal(result.routeChecks.find((check) => check.path === "/signup")?.status, 404);
}
);
