import test from "node:test";
import assert from "node:assert/strict";
import { SupabaseClientBoundary } from "../src/infrastructure/index.js";

test("Supabase health is explicit about configuration", async () => {
  const client = new SupabaseClientBoundary({});
  const health = await client.healthCheck();
  assert.equal(health.healthy, false);
});

test("Supabase health passes when URL and anon key are configured", async () => {
  const client = new SupabaseClientBoundary({ url: "https://example.supabase.co", anonKey: "anon" });
  const health = await client.healthCheck();
  assert.equal(health.healthy, true);
  assert.equal(health.details?.configured, true);
});
