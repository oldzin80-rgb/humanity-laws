import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { handleCompanionRequest } from "../api/companion.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import { UnifiedCompanionService } from "../src/communication/index.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";
import type { CompanionGateway } from "../src/experiences/index.js";
import type { ApiRequest } from "../src/server/http.js";

const gateway: CompanionGateway = {
  async respond(companion, input) {
    return {
      companion,
      message: `${companion}: I am an AI companion. Base response for ${input}`,
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary: "Source ledger: verified test source.",
    };
  },
};

const allowedNextSteps = new Set([
  "Continue conversation",
  "Save insight",
  "Open Council",
  "Reflect on Spark",
  "Continue Reading",
  "Add to Library",
]);

function count(text: string, phrase: string): number {
  return text.split(phrase).length - 1;
}

function jsonRequest(body: Record<string, unknown>): ApiRequest {
  const req = Readable.from([]) as ApiRequest;
  req.method = "POST";
  req.headers = { authorization: "Bearer test-token" };
  req.body = body;
  return req;
}

test("Adam and Eve use smoother, non-repetitive openings", async () => {
  const service = new UnifiedCompanionService(gateway);
  const adam = await service.respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "I need one practical next step.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "decision_support",
  });
  const eve = await service.respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I feel overwhelmed and need care.",
    consentToRemember: true,
    saveInsight: true,
    contextSources: [],
    intent: "encouragement",
  });

  assert.equal(count(adam.message, "I am an AI companion"), 1);
  assert.equal(count(eve.message, "I am an AI companion"), 1);
  assert.match(adam.message, /I hear you:/);
  assert.match(eve.message, /I’m with the feeling of this:|I'm with the feeling of this:/);
  assert.doesNotMatch(adam.message + eve.message, /Love in action:|A gentle insight:|My read is this:/);
});

test("visible companion next steps stay limited and relevant", async () => {
  const service = new UnifiedCompanionService(gateway);
  for (const message of [
    "Help me with today's Spark.",
    "Help me continue reading this chapter.",
    "I need wellness encouragement.",
    "I need Council for a decision.",
  ]) {
    const response = await service.respond({
      memberId: "member_1",
      companion: message.includes("Council") ? "Council" : "Adam",
      channel: message.includes("Council") ? "council_session" : "in_app",
      message,
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "reflection",
    });

    assert.ok(response.nextSteps.length >= 1);
    assert.ok(response.nextSteps.length <= 3);
    for (const step of response.nextSteps) assert.ok(allowedNextSteps.has(step), `Unexpected next step: ${step}`);
  }
});

test("Council stays calm, structured, and human-decision focused", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "I need help making an important choice.",
    consentToRemember: false,
    saveInsight: true,
    contextSources: [],
    intent: "council_request",
  });

  assert.match(response.message, /Adam sees:/);
  assert.match(response.message, /Eve sees:/);
  assert.match(response.message, /Humanity Laws principle:/);
  assert.match(response.message, /Your choice: you remain the final decision-maker\./);
  assert.match(response.message, /Next step: choose one honest action and one caring action\./);
});

test("Adam and Eve pages use shorter companion microcopy and honest presence language", () => {
  for (const path of ["/adam", "/eve"]) {
    const html = renderPageModelToHtml(routePage(path));
    assert.match(html, /Write one clear message/);
    assert.match(html, /Remember with my consent/);
    assert.match(html, /Save response as insight/);
    assert.match(html, /Recent turns will appear here on this device/);
    assert.match(html, /Avatar presence coming soon/);
    assert.match(html, /Not a live video call/);
    assert.doesNotMatch(html, /real human/i);
  }
});

test("companion API returns graceful saving warnings without false saved insight state", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return new Response(JSON.stringify({ id: "11111111-1111-1111-1111-111111111111", email: "member@example.com" }), { status: 200 });
    if (url.includes("/rest/v1/companion_conversation_turns")) return new Response(JSON.stringify({ message: "insert failed" }), { status: 500 });
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({
      companion: "Adam",
      input: "Help me save one insight.",
      consentToRemember: true,
      saveInsight: true,
    }));

    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.equal(result.body.persisted, false);
    assert.equal(result.body.savedInsight, false);
    assert.equal(result.body.persistenceWarning, "Adam returned a response, but saving was unavailable.");
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Companion Final Shine Pass does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
