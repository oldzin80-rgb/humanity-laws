import type { IncomingMessage, ServerResponse } from "node:http";

export interface JsonResponse {
  status: number;
  body: Record<string, unknown>;
}

export type ApiRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = ServerResponse & {
  status?(statusCode: number): ApiResponse;
  json?(body: unknown): void;
};

export function sendJson(res: ApiResponse, status: number, body: Record<string, unknown>): void {
  const statusFn = res.status;
  const jsonFn = res.json;
  if (typeof statusFn === "function" && typeof jsonFn === "function") {
    statusFn.call(res, status).json?.(body);
    return;
  }

  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(method: string | undefined): JsonResponse {
  return {
    status: 405,
    body: { success: false, error: `Method ${method ?? "UNKNOWN"} is not allowed.` },
  };
}

export async function readRawBody(req: ApiRequest): Promise<string> {
  if (typeof req.body === "string") return req.body;
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

export async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body as Record<string, unknown>;
  }

  const rawBody = await readRawBody(req);
  if (!rawBody.trim()) return {};

  const parsed = JSON.parse(rawBody) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Request body must be a JSON object.");
  }

  return parsed as Record<string, unknown>;
}

export function bearerToken(req: ApiRequest): string | undefined {
  const header = req.headers.authorization;
  if (!header) return undefined;
  const value = Array.isArray(header) ? header[0] : header;
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}
