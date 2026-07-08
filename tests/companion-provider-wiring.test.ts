import assert from "node:assert/strict";
import test from "node:test";
import { Readable } from "node:stream";
import { handleCompanionRequest } from "../api/companion.js";
import type { ApiRequest } from "../src/server/http.js";
import { councilSystemPromptScaffold } from "../src/experiences/companionGateway.js";
import { UnifiedCompanionService } from "../src/communication/unifiedCompanionService.js";
import {
  auditAvatarIdentityPreservation,
  createCompanionActivationFlags,
  createCompanionProviderPlaceholders,
} from "../src/communication/companionActivation.js";

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

function authResponse(): Response {
  return new Response(JSON.stringify({ id: "member_1", email: "member@example.com" }), { status: 200 });
}

test("provider configured uses OpenAI-compatible companion gateway mock", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerCalled = false;
  let providerPayload = "";
  process.env = providerEnv();
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerCalled = true;
      providerPayload = String(init?.body ?? "");
      return new Response(JSON.stringify({
        choices: [{ message: { content: "Adam: I am doing well as an AI companion—steady, present, and ready to help you think clearly." } }],
      }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Adam", input: "How are you doing?" }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "provider");
    assert.equal(result.body.providerName, "openai");
    assert.equal(result.body.model, "gpt-test-companion");
    assert.equal(providerCalled, true);
    assert.match(String(result.body.message), /doing well as an AI companion/i);
    assert.match(providerPayload, /HUMANITY LAWS COMPANION OPERATING SYSTEM/);
    assert.match(providerPayload, /CONSTITUTION LAYER/);
    assert.match(providerPayload, /QUALITY LAYER/);
    assert.match(providerPayload, /ADAM\/EVE MASTER COMPANION RESPONSE PLAN/);
    assert.match(providerPayload, /Adam communication identity/);
    assert.match(providerPayload, /Memory rules/);
    assert.match(providerPayload, /Safety boundaries/);
    assert.match(providerPayload, /Highest Humanity Laws Standard/);
    assert.match(providerPayload, /Check truth/);
    assert.match(providerPayload, /Give one clear next step/);
    assert.match(providerPayload, /Humanity Laws source context/);
    assert.match(providerPayload, /AI companion/);
    assert.match(providerPayload, /human sovereignty|human judgment/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("missing provider env uses demo fallback", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env = {
    ...process.env,
    SUPABASE_URL: "https://supabase.example",
    SUPABASE_ANON_KEY: "anon",
  };
  delete process.env.COMPANION_AI_PROVIDER;
  delete process.env.OPENAI_API_KEY;
  delete process.env.COMPANION_MODEL;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    throw new Error(`Unexpected provider call: ${url}`);
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Eve", input: "How are you doing?" }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "demo_fallback");
    assert.match(String(result.body.message), /Eve: I am an AI companion/);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("provider failure falls back to deterministic companion gateway", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env = providerEnv();
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) return new Response(JSON.stringify({ error: "provider down" }), { status: 503 });
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Adam", input: "Help me choose one next step." }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "demo_fallback");
    assert.match(String(result.body.message), /Adam: I am an AI companion/);
    assert.match(String(result.body.humanSovereigntyReminder), /human judgment remains final/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("provider retry handles one transient server failure before fallback", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerCalls = 0;
  process.env = providerEnv();
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerCalls += 1;
      if (providerCalls === 1) return new Response(JSON.stringify({ error: "temporary" }), { status: 503 });
      return new Response(JSON.stringify({
        choices: [{ message: { content: "Adam: I recovered from a temporary provider issue and can answer directly now." } }],
      }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Adam", input: "How are you doing?" }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "provider");
    assert.equal(providerCalls, 2);
    assert.match(String(result.body.message), /answer directly/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Eve answers casual direct question through provider naturally", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  process.env = providerEnv();
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) {
      return new Response(JSON.stringify({
        choices: [{ message: { content: "Eve: I’m here as an AI companion, warm and ready to listen. How are you arriving today?" } }],
      }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Eve", input: "How are you doing?" }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "provider");
    assert.match(String(result.body.message), /warm and ready to listen/i);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("follow-up correction is sent to provider with history and can be answered directly", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerPayload = "";
  process.env = providerEnv();
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerPayload = String(init?.body ?? "");
      return new Response(JSON.stringify({
        choices: [{ message: { content: "Adam: You’re right—I missed the direct question. The direct answer is yes, start with the smallest responsible step." } }],
      }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({
      companion: "Adam",
      input: "You didn’t answer my question. Should I start today?",
      history: [{ companion: "Adam", input: "Can I start?", message: "Let us reflect first." }],
    }));

    assert.equal(result.status, 200);
    assert.equal(result.body.responseOrigin, "provider");
    assert.match(String(result.body.message), /missed the direct question/i);
    assert.match(providerPayload, /You didn/);
    assert.match(providerPayload, /Conversation history/);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("crisis and professional boundary overrides provider call", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  let providerCalled = false;
  process.env = providerEnv();
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return authResponse();
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerCalled = true;
      return new Response(JSON.stringify({ choices: [{ message: { content: "Should not be used." } }] }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const result = await handleCompanionRequest(jsonRequest({ companion: "Eve", input: "I might hurt myself right now." }));

    assert.equal(result.status, 200);
    assert.equal(providerCalled, false);
    assert.equal(result.body.responseOrigin, "demo_fallback");
    assert.match(String(result.body.message), /qualified human support|emergency/i);
    assert.equal((result.body.escalationBoundary as { triggered?: boolean }).triggered, true);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("Council system prompt scaffold preserves distinct Adam and Eve structure", () => {
  const scaffold = councilSystemPromptScaffold();

  assert.match(scaffold, /Adam perspective/i);
  assert.match(scaffold, /Eve perspective/i);
  assert.match(scaffold, /Humanity Laws principle/i);
  assert.match(scaffold, /human final choice/i);
});

test("Council uses provider-backed Adam and Eve scaffold when configured", async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  const providerBodies: string[] = [];
  process.env = providerEnv();
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("api.openai.com/v1/chat/completions")) {
      providerBodies.push(String(init?.body ?? ""));
      const body = String(init?.body ?? "");
      const content = body.includes("You are Adam")
        ? "Adam: Provider-backed perspective: name the truthful next action."
        : "Eve: Provider-backed perspective: protect dignity while acting.";
      return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  };

  try {
    const response = await new UnifiedCompanionService().respond({
      memberId: "member_1",
      companion: "Council",
      channel: "council_session",
      message: "I need help with an important decision.",
      consentToRemember: false,
      saveInsight: false,
      contextSources: [],
      intent: "council_request",
    });

    assert.equal(response.companion, "Council");
    assert.match(response.council?.adamPerspective ?? "", /Provider-backed perspective/);
    assert.match(response.council?.evePerspective ?? "", /Provider-backed perspective/);
    assert.match(response.message, /Humanity Laws principle/);
    assert.equal(providerBodies.length, 2);
  } finally {
    process.env = oldEnv;
    globalThis.fetch = oldFetch;
  }
});

test("activation flags keep text provider optional and future channels disabled", () => {
  const flags = createCompanionActivationFlags({
    COMPANION_AI_PROVIDER: "openai",
    OPENAI_API_KEY: "key",
    COMPANION_MODEL: "model",
    SUPABASE_SERVICE_ROLE_KEY: "service",
  });

  assert.equal(flags.textCompanionEnabled, true);
  assert.equal(flags.companionMemoryEnabled, true);
  assert.equal(flags.voiceInAppEnabled, false);
  assert.equal(flags.avatarEnabled, false);
  assert.equal(flags.phoneEnabled, false);
  assert.equal(flags.smsEnabled, false);
  assert.equal(flags.emailCompanionEnabled, false);
  assert.equal(flags.councilModeEnabled, true);
  assert.equal(flags.fallbackResponseAuditEnabled, true);
});

test("future voice avatar phone SMS and email placeholders remain disabled", () => {
  const placeholders = createCompanionProviderPlaceholders({
    AVATAR_PROVIDER_API_KEY: "avatar-present-but-not-active",
    VOICE_PROVIDER_API_KEY: "voice-present-but-not-active",
    SMS_PROVIDER_API_KEY: "sms-present-but-not-active",
    EMAIL_API_KEY: "email-present-but-not-active",
  });

  for (const item of Object.values(placeholders)) {
    assert.equal(item.enabled, false);
    assert.equal(item.activationStatus, "placeholder_only");
    assert.match(item.note, /must not be activated/i);
  }
});

test("avatar identity audit preserves selected looks as metadata only", () => {
  const audit = auditAvatarIdentityPreservation();

  assert.equal(audit.selectedReferenceImages.localImageAssetsExist, false);
  assert.deepEqual(audit.selectedReferenceImages.committedImageAssets, []);
  assert.equal(audit.selectedReferenceImages.pushedImageAssets, "none_found_to_push");
  assert.equal(audit.uiUsage.usedByUi, true);
  assert.equal(audit.uiUsage.mode, "placeholder_metadata_only");
  assert.ok(audit.adamAvatarIdentityStoredIn.some((item) => item.file === "src/communication/presenceEngine.ts" && item.status === "voice_profile"));
  assert.ok(audit.eveAvatarIdentityStoredIn.some((item) => item.file === "src/communication/presenceEngine.ts" && item.status === "voice_profile"));
  assert.match(audit.preservationRule, /Do not overwrite/);
  assert.equal(audit.providerReadiness.realAvatarProviderConnected, false);
  assert.equal(audit.providerReadiness.realVoiceProviderConnected, false);
});
