import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const discoveryPath = "docs/launch/FAMOUS_AI_DEPLOYMENT_DISCOVERY.md";

function readDiscovery(): string {
  return readFileSync(discoveryPath, "utf8");
}

test("Famous AI deployment discovery document exists and covers required discovery questions", () => {
  const discovery = readDiscovery();

  for (const heading of [
    "## 1. Has the Humanity Laws project been published from Famous AI?",
    "## 2. Is a Vercel project already linked?",
    "## 3. Is there a deployment URL available?",
    "## 4. Is there a Preview deployment?",
    "## 5. Is there a Production deployment?",
    "## 6. Is a custom domain already configured?",
    "## 7. Does Famous AI require any remaining publish action?",
    "## 8. What is the next required manual step?",
  ]) {
    assert.ok(discovery.includes(heading), `Missing discovery heading: ${heading}`);
  }
});

test("Famous AI deployment discovery includes evidence fields and avoids assumptions", () => {
  const discovery = readDiscovery();

  for (const expectedText of [
    "Deployment status",
    "Deployment URL",
    "Environment",
    "Publish timestamp",
    "Deployment errors/warnings",
    "Do not assume Ready without dashboard evidence.",
    "Status: UNKNOWN",
    "Final verdict: NEEDS INVESTIGATION",
  ]) {
    assert.ok(discovery.includes(expectedText), `Missing evidence/unknown text: ${expectedText}`);
  }
});

test("Famous AI deployment discovery preserves DNS safety and launchReady false", () => {
  const discovery = readDiscovery();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  for (const expectedText of [
    "Do not change GoDaddy DNS",
    "DNS changes are blocked.",
    "LaunchReady: FALSE",
    "`launchReady` remains false",
    "Do not mark launchReady true from this document alone.",
  ]) {
    assert.ok(discovery.includes(expectedText), `Missing DNS/launch safety text: ${expectedText}`);
  }

  assert.equal(report.launchReady, false);
});

test("Famous AI deployment discovery maps evidence to the required final verdicts", () => {
  const discovery = readDiscovery();

  for (const verdict of [
    "READY TO PUBLISH FROM FAMOUS",
    "READY TO CONNECT DOMAIN",
    "READY FOR LIVE TESTING",
    "NEEDS INVESTIGATION",
  ]) {
    assert.ok(discovery.includes(verdict), `Missing final verdict option: ${verdict}`);
  }
});
