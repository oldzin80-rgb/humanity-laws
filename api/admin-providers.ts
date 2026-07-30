import type {ApiRequest, ApiResponse} from "../src/server/http.js";
import {bearerToken, methodNotAllowed, readJsonBody, sendJson} from "../src/server/http.js";
import {
  FounderProviderCommandCenter, ProviderControlStore, ProviderIds,
  type ProviderEnvironment, type ProviderId,
} from "../src/provider-command-center/index.js";

const store = new ProviderControlStore();
const commandCenter = new FounderProviderCommandCenter(store);

function founderActor(req: ApiRequest) {
  const expected = process.env.FOUNDER_ADMIN_TOKEN;
  const supplied = bearerToken(req);
  if (!expected || !supplied || supplied !== expected) return null;
  return {id: "founder", roles: ["FOUNDER"] as const};
}
function providerId(value: unknown): ProviderId | undefined {
  return typeof value === "string" && ProviderIds.includes(value as ProviderId)
    ? value as ProviderId : undefined;
}
function environment(value: unknown): ProviderEnvironment {
  return ["LOCAL", "DEVELOPMENT", "STAGING", "PRODUCTION"].includes(String(value))
    ? value as ProviderEnvironment : "LOCAL";
}

export async function handleAdminProvidersRequest(req: ApiRequest) {
  if (req.method !== "GET" && req.method !== "POST") return methodNotAllowed(req.method);
  const actor = founderActor(req);
  if (!actor) return {status: 403, body: {success: false, error: "Founder authorization required."}};
  if (req.method === "GET") {
    const query = req.query ?? {};
    const id = providerId(query.providerId);
    const env = environment(query.environment);
    return {
      status: 200,
      body: {success: true, data: id ? commandCenter.detail(actor, id, env) : commandCenter.readiness(actor, env)},
    };
  }
  const body = await readJsonBody(req);
  const id = providerId(body.providerId);
  if (!id || typeof body.command !== "string") {
    return {status: 400, body: {success: false, error: "Valid providerId and command required."}};
  }
  const commands = ["VALIDATE_CREDENTIALS", "HEALTH_CHECK", "SIMULATE", "PAUSE", "RESUME", "DISABLE", "REQUEST_ACTIVATION"] as const;
  if (!commands.includes(body.command as typeof commands[number])) {
    return {status: 400, body: {success: false, error: "Unsupported command."}};
  }
  const data = await commandCenter.command(actor, {
    providerId: id,
    environment: environment(body.environment),
    command: body.command as typeof commands[number],
    capability: typeof body.capability === "string" ? body.capability : undefined,
  });
  return {status: 200, body: {success: true, data}};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const result = await handleAdminProvidersRequest(req);
    sendJson(res, result.status, result.body);
  } catch (error) {
    sendJson(res, 500, {
      success: false,
      error: error instanceof Error ? error.message : "Provider command failed.",
    });
  }
}
