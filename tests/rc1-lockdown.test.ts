import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const rc1Path = "docs/launch/RELEASE_CANDIDATE_1.md";
const limitationsPath = "docs/launch/KNOWN_LIMITATIONS.md";
const changeControlPath = "docs/launch/RC1_CHANGE_CONTROL.md";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("RC1 lockdown docs exist and define the launch candidate scope", () => {
  const rc1 = read(rc1Path);

  for (const expectedText of [
    "Core launch app.",
    "Home.",
    "Membership.",
    "Signup/Login.",
    "Checkout paths.",
    "Dashboard.",
    "Digital Book.",
    "Admin.",
    "Launch status.",
    "Live proof binder.",
    "TypeScript: PASS.",
    "Full tests: PASS.",
    "Static build: PASS.",
    "`launchReady`: false.",
    "Humanity Laws book/source text preserved.",
  ]) {
    assert.ok(rc1.includes(expectedText), `Missing RC1 scope/state text: ${expectedText}`);
  }
});

test("RC1 launch scope is frozen to verified blockers only", () => {
  const rc1 = read(rc1Path);
  const changeControl = read(changeControlPath);

  for (const expectedText of [
    "Launch scope is frozen.",
    "fix a verified launch blocker.",
    "fix broken auth.",
    "fix broken payments.",
    "fix broken webhook.",
    "fix broken membership access.",
    "fix broken digital book access.",
    "fix broken admin access.",
    "fix deployment failure.",
    "fix security/privacy issue.",
    "Do not add new rooms, new architecture, new providers, new commerce models, new pricing, or non-critical polish before live validation is complete.",
  ]) {
    assert.ok(rc1.includes(expectedText) || changeControl.includes(expectedText), `Missing freeze rule: ${expectedText}`);
  }
});

test("RC1 known limitations document post-launch deferred items", () => {
  const limitations = read(limitationsPath);

  for (const expectedText of [
    "Hardcover fulfillment is deferred.",
    "Advanced community features are deferred.",
    "Future live providers are deferred.",
    "Avatar, voice, phone, and SMS integrations are deferred.",
    "Expanded wellness integrations are deferred.",
    "Advanced analytics and monitoring are deferred",
    "Any non-critical polish is deferred.",
    "These remain launch-blocking if broken:",
  ]) {
    assert.ok(limitations.includes(expectedText), `Missing known limitation: ${expectedText}`);
  }
});

test("RC1 change control requires evidence, rollback, tests, and launchReady impact", () => {
  const changeControl = read(changeControlPath);

  for (const expectedText of [
    "| Reason |",
    "| Blocker evidence |",
    "| Files changed |",
    "| Tests run |",
    "| Rollback note |",
    "| launchReady impact |",
    "Reason:",
    "Blocker evidence:",
    "Files changed:",
    "Tests run:",
    "Rollback note:",
    "launchReady impact:",
    "Any change without blocker evidence should be deferred until after launch validation.",
  ]) {
    assert.ok(changeControl.includes(expectedText), `Missing change control requirement: ${expectedText}`);
  }
});

test("RC1 lockdown keeps launchReady false until live evidence passes", () => {
  const rc1 = read(rc1Path);
  const changeControl = read(changeControlPath);
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(rc1, /LaunchReady: FALSE/);
  assert.match(rc1, /No `launchReady = true` until live evidence passes\./);
  assert.match(changeControl, /`launchReady` remains false until live evidence passes\./);
  assert.equal(report.launchReady, false);
});
