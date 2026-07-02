import assert from "node:assert/strict";
import { test } from "node:test";
import { REQUIRED_STAGING_PATHS, verifyDeployment } from "../src/deployment/deploymentVerifier.js";

test("deployment verifier fails closed when no deployment URL exists", async () => {
  const result = await verifyDeployment({ deploymentUrl: "" });

  assert.equal(result.passed, false);
  assert.equal(result.routeChecks.length, 0);
  assert.match(result.details.join("\n"), /DEPLOYMENT_URL is missing/);
});

test("deployment verifier rejects invalid deployment URLs", async () => {
  const result = await verifyDeployment({ deploymentUrl: "not-a-real-url" });

  assert.equal(result.passed, false);
  assert.equal(result.routeChecks.length, 0);
  assert.match(result.details.join("\n"), /valid http or https URL/);
});

test("deployment verifier proves all required staging routes respond", async () => {
  const visited = new Set<string>();
  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(input instanceof URL ? input.toString() : String(input));
    visited.add(url.pathname);
    return new Response("ok", { status: 200 });
  };

  const result = await verifyDeployment({
    deploymentUrl: "https://staging.humanity-laws.test",
    fetchImpl,
  });

  assert.equal(result.passed, true);
  assert.equal(result.routeChecks.length, REQUIRED_STAGING_PATHS.length);
  assert.deepEqual([...visited], [...REQUIRED_STAGING_PATHS]);
});

test("deployment verifier reports failed staging routes without approving launch evidence", async () => {
  const fetchImpl: typeof fetch = async (input) => {
    const url = new URL(input instanceof URL ? input.toString() : String(input));
    return new Response(url.pathname === "/admin" ? "forbidden" : "ok", {
      status: url.pathname === "/admin" ? 403 : 200,
    });
  };

  const result = await verifyDeployment({
    deploymentUrl: "https://staging.humanity-laws.test",
    fetchImpl,
  });

  assert.equal(result.passed, false);
  assert.equal(result.routeChecks.find((check) => check.path === "/admin")?.status, 403);
  assert.match(result.details.join("\n"), /1 required staging route/);
});
