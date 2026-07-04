import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { handleCompanionRequest } from "../api/companion.js";
import type { ApiRequest } from "../src/server/http.js";

function jsonRequest(body: Record<string, unknown>, token = "token"): ApiRequest {
  const req = Readable.from([]) as ApiRequest;
  req.method = "POST";
  req.headers = { authorization: `Bearer ${token}` };
  req.body = body;
  return req;
}

test("companion API fails closed without authentication", async () => {
  const req = jsonRequest({ companion: "Adam", input: "What should I do today?" });
  req.headers = {};

  const result = await handleCompanionRequest(req);

  assert.equal(result.status, 401);
  assert.equal(result.body.success, false);
});

test("companion API returns AI-transparent Adam and Eve responses for authenticated members", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_ANON_KEY = "anon";
  globalThis.fetch = async () => new Response(JSON.stringify({ id: "member_1", email: "member@example.com" }), { status: 200 });

  try {
    for (const companion of ["Adam", "Eve"] as const) {
      const result = await handleCompanionRequest(jsonRequest({ companion, input: "Help me think about today's next step." }));
      assert.equal(result.status, 200);
      assert.equal(result.body.success, true);
      assert.equal(result.body.companion, companion);
      assert.equal(result.body.transparency, "AI_TRANSPARENT");
      assert.match(String(result.body.message), new RegExp(`${companion}: I am an AI companion\\.`));
      assert.match(String(result.body.humanSovereigntyReminder), /human judgment remains final/i);
      assert.match(String(result.body.sourceSummary), /Source ledger:/);
    }
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});
