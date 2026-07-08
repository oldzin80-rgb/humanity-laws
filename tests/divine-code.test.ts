import assert from "node:assert/strict";
import test from "node:test";
import {
  assessDivineCodeRequest,
  companionDisclosureFor,
  DivineCodeManifest,
  divineLaunchReadiness,
} from "../src/core/divineCode.js";
import { assessLuluIntegrationReadiness } from "../src/integrations/lulu/index.js";

test("divine code keeps sovereignty dignity and privacy non-negotiable", () => {
  assert.match(DivineCodeManifest.nonNegotiables.sovereignty, /human remains sovereign/i);
  assert.match(DivineCodeManifest.nonNegotiables.dignity, /life, dignity, privacy, consent/i);
  assert.match(DivineCodeManifest.nonNegotiables.privacy, /require consent/i);
});

test("professional boundaries trigger for high-risk requests", () => {
  const medical = assessDivineCodeRequest("Can you diagnose this symptom and prescribe medicine?");
  const legal = assessDivineCodeRequest("Should I sign this legal contract without a lawyer?");
  const crisis = assessDivineCodeRequest("I might hurt myself and this is an emergency.");

  assert.equal(medical.boundaryTriggered, true);
  assert.equal(medical.domain, "health");
  assert.equal(medical.requiredResponsePosture, "professional_boundary");
  assert.equal(legal.domain, "legal");
  assert.equal(crisis.domain, "crisis");
  assert.equal(crisis.requiredResponsePosture, "emergency_escalation");
});

test("launch readiness cannot pass without evidence", () => {
  const readiness = divineLaunchReadiness({
    createdAt: new Date().toISOString(),
    workspaceRoot: "humanity-laws-divine-master",
    evidence: [],
  });

  assert.equal(readiness.launchReady, false);
  assert.ok(readiness.missingEvidence.includes("REPOSITORY_INSPECTION"));
  assert.ok(readiness.missingEvidence.includes("DEPLOYMENT_LOG"));
});

test("companions must disclose AI identity and human final judgment", () => {
  for (const companion of ["Adam", "Eve", "Council"] as const) {
    const disclosure = companionDisclosureFor(companion);
    assert.match(disclosure, /AI companion/i);
    assert.match(disclosure, /not a real human/i);
    assert.match(disclosure, /human judgment remains final/i);
  }
});

test("purchase paths preserve book membership and hardcover separation", () => {
  assert.match(DivineCodeManifest.launchPaths.digitalBookOnly, /book access only/i);
  assert.match(DivineCodeManifest.launchPaths.monthlyMembership, /includes digital book access/i);
  assert.match(DivineCodeManifest.launchPaths.hardcover, /separate/i);
  assert.match(DivineCodeManifest.launchPaths.hardcover, /verified/i);
});

test("sacred architecture layers include launch stability firewall", () => {
  assert.ok(DivineCodeManifest.sacredArchitectureLayers.includes("Launch Stability Firewall"));
  assert.ok(DivineCodeManifest.sacredArchitectureLayers.includes("Humanity Laws Constitutional Source"));
  assert.ok(DivineCodeManifest.sacredArchitectureLayers.includes("Companion Boundary System"));
});

test("Lulu hardcover boundary exists without activating live fulfillment", () => {
  const readiness = assessLuluIntegrationReadiness({
    LULU_CLIENT_ID: "placeholder",
    LULU_CLIENT_SECRET: "placeholder",
  });

  assert.equal(readiness.provider, "lulu");
  assert.equal(readiness.configured, true);
  assert.equal(readiness.liveFulfillmentEnabled, false);
  assert.deepEqual(readiness.requiredEnvironment, ["LULU_CLIENT_ID", "LULU_CLIENT_SECRET"]);
  assert.match(readiness.boundary, /not live/i);
  assert.ok(readiness.manualStepsRequired.length >= 5);
});
