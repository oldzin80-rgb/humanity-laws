import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { handleCompanionRequest } from "../api/companion.js";
import {
  createCompanionQualityIntelligence,
  createPresenceContext,
  decideConversationCraftMove,
  derivePresenceMemoryHints,
  generateWonderPrompt,
  UnifiedCompanionService,
} from "../src/communication/index.js";
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

function jsonRequest(body: Record<string, unknown>, token = "token"): ApiRequest {
  const req = Readable.from([]) as ApiRequest;
  req.method = "POST";
  req.headers = { authorization: `Bearer ${token}` };
  req.body = body;
  return req;
}

test("presence quality scores are generated internally", async () => {
  const response = await new UnifiedCompanionService(gateway).respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "I need one clear next step.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "decision_support",
  });

  assert.equal(response.internalQuality?.internalOnly, true);
  assert.ok((response.internalQuality?.qualityEvaluation.warmth ?? 0) >= 1);
  assert.ok((response.internalQuality?.qualityEvaluation.clarity ?? 0) <= 10);
  assert.equal(response.internalQuality?.qualityEvaluation.internalOnly, true);
});

test("quality scores are not exposed through the companion API response body", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_ANON_KEY = "anon";
  globalThis.fetch = async () => new Response(JSON.stringify({ id: "member_1", email: "member@example.com" }), { status: 200 });

  try {
    const result = await handleCompanionRequest(jsonRequest({
      companion: "Adam",
      input: "Help me with a clear next step.",
      consentToRemember: false,
      saveInsight: false,
    }));

    assert.equal(result.status, 200);
    assert.equal(result.body.internalQuality, undefined);
    assert.equal(result.body.qualityEvaluation, undefined);
    assert.equal(result.body.craftDecision, undefined);
    assert.equal(result.body.improvementSummary, undefined);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Adam, Eve, and Council can use craft moves", async () => {
  const service = new UnifiedCompanionService(gateway);
  const adam = await service.respond({
    memberId: "member_1",
    companion: "Adam",
    channel: "in_app",
    message: "This is a major life changing decision.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "decision_support",
  });
  const eve = await service.respond({
    memberId: "member_1",
    companion: "Eve",
    channel: "in_app",
    message: "I feel discouraged and tired.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "encouragement",
  });
  const council = await service.respond({
    memberId: "member_1",
    companion: "Council",
    channel: "council_session",
    message: "Please help with this decision.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "council_request",
  });

  assert.equal(adam.internalQuality?.craftDecision.move, "refer_to_council");
  assert.equal(eve.internalQuality?.craftDecision.move, "encourage");
  assert.ok(council.internalQuality?.craftDecision.move);
});

test("memory profile only applies with consent and avoids sensitive trait inference", () => {
  const history = [{ companion: "Adam", input: "Please be direct and slow with practical steps.", message: "A prior response." }];
  const noConsent = derivePresenceMemoryHints(history, false);
  const consent = derivePresenceMemoryHints(history, true);

  assert.equal(noConsent, undefined);
  assert.equal(consent?.consentApplied, true);
  assert.equal(consent?.communicationStyle, "direct");
  assert.equal(Object.keys(consent ?? {}).some((key) => /race|religion|health|political|sexual|disability/i.test(key)), false);
});

test("wonder prompts are simple and skipped for urgent/professional moments", () => {
  const calm = generateWonderPrompt({ need: "purpose", emotionalTone: "calm", escalationNeeded: false });
  const urgent = generateWonderPrompt({ need: "purpose", emotionalTone: "urgent", escalationNeeded: false, practicalUrgency: true });
  const crisis = generateWonderPrompt({ need: "purpose", emotionalTone: "heavy", escalationNeeded: true });

  assert.equal(calm.used, true);
  assert.match(calm.prompt?.text ?? "", /one small thing|peace|true/i);
  assert.doesNotMatch(calm.prompt?.text ?? "", /cosmic|infinite|transcendent symphony/i);
  assert.equal(urgent.used, false);
  assert.equal(crisis.used, false);
});

test("improvement signals are internal, consent-aware, and privacy preserving", () => {
  const request = {
    memberId: "member_1",
    companion: "Adam" as const,
    channel: "in_app" as const,
    message: "Why am I still confused?",
    consentToRemember: true,
    saveInsight: true,
    contextSources: [],
    intent: "reflection" as const,
  };
  const context = createPresenceContext(request);
  const intelligence = createCompanionQualityIntelligence({
    request,
    response: "Adam: I am an AI companion. I hear you. Next step: write one sentence.",
    context,
    primaryNeed: "reflection",
    escalationNeeded: false,
  });

  assert.equal(intelligence.internalOnly, true);
  assert.equal(intelligence.improvementSummary.privacyPreserved, true);
  assert.ok(intelligence.improvementSummary.signals.some((signal) => signal.kind === "saved_insight"));
  for (const signal of intelligence.improvementSummary.signals) {
    assert.equal(signal.consentAware, true);
    assert.equal(signal.sensitiveContentStored, false);
  }
});

test("professional boundary craft move is selected for high-risk domains", () => {
  const request = {
    memberId: "member_1",
    companion: "Eve" as const,
    channel: "in_app" as const,
    message: "I need a medical diagnosis and prescription advice.",
    consentToRemember: false,
    saveInsight: false,
    contextSources: [],
    intent: "wellness_support" as const,
  };
  const decision = decideConversationCraftMove(request, createPresenceContext(request));

  assert.equal(decision.move, "professional_boundary");
});

test("Companion Quality Intelligence does not change launchReady", () => {
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.equal(report.launchReady, false);
});
