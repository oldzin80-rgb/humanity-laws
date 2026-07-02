import test from "node:test";
import assert from "node:assert/strict";
import { SupabaseClientBoundary } from "../src/infrastructure/index.js";

test("Supabase health is explicit about configuration", async () => {
  const client = new SupabaseClientBoundary({});
  const health = await client.healthCheck();
  assert.equal(health.healthy, false);
});
