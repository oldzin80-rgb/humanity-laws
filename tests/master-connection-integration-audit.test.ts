import assert from "node:assert/strict";
import test from "node:test";
import { Readable } from "node:stream";
import { existsSync } from "node:fs";
import { handleCompanionRequest } from "../api/companion.js";
import { renderPageModelToHtml, routePage } from "../src/application/index.js";
import type { ApiRequest } from "../src/server/http.js";
import {
  auditAvatarIdentityPreservation,
  createCompanionActivationFlags,
  createCompanionProviderPlaceholders,
  UnifiedCompanionService,
} from "../src/communication/index.js";

function jsonRequest(body: Record<string, unknown>, token = "token"): ApiRequest {
  const req = Readable.from([]) as ApiRequest;
  req.method = "POST";
  req.headers = { authorization: `Bearer ${token}` };
  req.body = body;
  return req;
}

function providerEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    SUPABASE_URL: "https://supabase.example",
    SUPABASE_ANON_KEY: "anon",
    COMPANION_AI_PROVIDER: "openai",
    OPENAI_API_KEY: "test-openai-key",
    COMPANION_MODEL: "gpt-test-companion",
    COMPANION_TIMEOUT_MS: "5000",
  };
}

test("companion activation layer is exported through the shared communication surface", () => {
  const flags = createCompanionActivationFlags({
    COMPANION_AI_PROVIDER: "openai",
    OPENAI_API_KEY: "key",
    COMPANION_MODEL: "model",
    SUPABASE_SERVICE_ROLE_KEY: "service",
    AVATAR_PROVIDER_API_KEY: "avatar-present-but-disabled",
    VOICE_PROVIDER_API_KEY: "voice-present-but-disabled",
    SMS_PROVIDER_API_KEY: "sms-present-but-disabled",
    EMAIL_API_KEY: "email-present-but-disabled",
  });
  const placeholders = createCompanionProviderPlaceholders({
    AVATAR_PROVIDER_API_KEY: "avatar-present-but-disabled",
    VOICE_PROVIDER_API_KEY: "voice-present-but-disabled",
    SMS_PROVIDER_API_KEY: "sms-present-but-disabled",
    EMAIL_API_KEY: "email-present-but-disabled",
  });

  assert.equal(flags.textCompanionEnabled, true);
  assert.equal(flags.companionMemoryEnabled, true);
  assert.equal(flags.voiceInAppEnabled, false);
  assert.equal(flags.avatarEnabled, false);
  assert.equal(flags.phoneEnabled, false);
  assert.equal(flags.smsEnabled, false);
  assert.equal(flags.emailCompanionEnabled, false);
  for (const placeholder of Object.values(placeholders)) {
    assert.equal(placeholder.enabled, false);
    assert.equal(placeholder.activationStatus, "placeholder_only");
  }
});

test("Adam and Eve UI forms reach the live companion API instead of a stale demo-only path", () => {
  for (const path of ["/adam", "/eve"]) {
    const html = renderPageModelToHtml(routePage(path));

    assert.match(html, /data-companion-form="Adam"|data-companion-form="Eve"/);
    assert.match(html, /fetch\("\/api\/companion"/);
    assert.match(html, /Authorization/);
    assert.match(html, /consentToRemember/);
    assert.match(html, /saveInsight/);
    assert.match(html, /hl_companion_history_v1_/);
    assert.doesNotMatch(html, /live video call is active|SMS is live|Adam is a real human|Eve is a real human/i);
  }
});

test("API route uses provider-backed companion service when provider env is configured", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerCalled = false;
  process.env = providerEnv();
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) {
      return new Response(JSON.stringify({ id: "member_1", email: "member@example.com" }), { status: 200 });
    }
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerCalled = true;
      assert.match(String(init?.body ?? ""), /Humanity Laws source context/);
      return new Response(JSON.stringify({
        choices: [{ message: { content: "Adam: I am an AI companion using the provider-backed path for this direct answer." } }],
      }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Adam", input: "How are you doing?" }));

    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.equal(result.body.responseOrigin, "provider");
    assert.equal(result.body.providerName, "openai");
    assert.equal(providerCalled, true);
    assert.match(String(result.body.message), /provider-backed path/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Council service path uses the same provider-backed gateway scaffold as Adam and Eve", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  const providerBodies: string[] = [];
  process.env = providerEnv();
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("api.openai.com/v1/chat/completions")) {
      const body = String(init?.body ?? "");
      providerBodies.push(body);
      const content = body.includes("You are Adam")
        ? "Adam: Provider-backed Council perspective names one responsible next action."
        : "Eve: Provider-backed Council perspective protects dignity and relationship.";
      return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const response = await new UnifiedCompanionService().respond({
      memberId: "member_1",
      companion: "Council",
      channel: "council_session",
      message: "Help me think about an important decision.",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "council_request",
    });

    assert.equal(response.companion, "Council");
    assert.match(response.council?.adamPerspective ?? "", /Provider-backed Council perspective/);
    assert.match(response.council?.evePerspective ?? "", /Provider-backed Council perspective/);
    assert.match(response.council?.humanFinalChoice ?? "", /final decision-maker/i);
    assert.equal(providerBodies.length, 2);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("safety boundary stays ahead of provider wiring", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerCalled = false;
  process.env = providerEnv();
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) {
      return new Response(JSON.stringify({ id: "member_1", email: "member@example.com" }), { status: 200 });
    }
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerCalled = true;
      return new Response(JSON.stringify({ choices: [{ message: { content: "Should not appear." } }] }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Eve", input: "I might hurt myself right now." }));

    assert.equal(result.status, 200);
    assert.equal(providerCalled, false);
    assert.equal((result.body.escalationBoundary as { triggered?: boolean }).triggered, true);
    assert.match(String(result.body.message), /qualified human support|emergency/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Adam and Eve identity metadata stays consistent and avatar UI remains honest", () => {
  const audit = auditAvatarIdentityPreservation();
  const adamHtml = renderPageModelToHtml(routePage("/adam"));
  const eveHtml = renderPageModelToHtml(routePage("/eve"));
  const councilHtml = renderPageModelToHtml(routePage("/council"));

  assert.equal(audit.uiUsage.mode, "placeholder_metadata_only");
  assert.equal(audit.providerReadiness.realAvatarProviderConnected, false);
  assert.equal(audit.providerReadiness.realVoiceProviderConnected, false);
  assert.ok(audit.adamAvatarIdentityStoredIn.some((item) => item.file === "src/communication/presenceEngine.ts"));
  assert.ok(audit.eveAvatarIdentityStoredIn.some((item) => item.file === "src/communication/presenceEngine.ts"));
  assert.match(adamHtml + eveHtml + councilHtml, /Avatar presence coming soon/);
  assert.match(adamHtml + eveHtml + councilHtml, /Not a live video call/);
  assert.match(adamHtml + eveHtml + councilHtml, /Not a real person/);
});

test("Spark Table and Podcast context handoffs are buffered but context endpoint remains intentionally deferred", () => {
  const sparkHtml = renderPageModelToHtml(routePage("/spark"));
  const tableHtml = renderPageModelToHtml(routePage("/table"));
  const podcastHtml = renderPageModelToHtml(routePage("/podcast"));
  const combined = `${sparkHtml}\n${tableHtml}\n${podcastHtml}`;

  assert.match(combined, /\/api\/companion\/context/);
  assert.match(combined, /queuedCompanionEvents|queuedTableCompanionEvents|queuedPodcastCompanionEvents/);
  assert.match(combined, /catch\{queue/);
  assert.equal(existsSync(new URL("../api/companion/context.ts", import.meta.url)), false);
});
