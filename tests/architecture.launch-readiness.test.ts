import test from "node:test";
import assert from "node:assert/strict";
import { RELEASE_REQUIRED_EVIDENCE } from "../src/core/index.js";

test("launch readiness required evidence is canonical", () => {
  assert.ok(RELEASE_REQUIRED_EVIDENCE.includes("DEPLOYMENT_LOG"));
  assert.ok(RELEASE_REQUIRED_EVIDENCE.includes("MANUAL_REVIEW"));
});
