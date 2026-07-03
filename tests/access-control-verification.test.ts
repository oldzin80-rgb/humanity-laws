import assert from "node:assert/strict";
import test from "node:test";
import { handleMembershipStatusRequest } from "../api/membership-status.ts";
import { LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";
import type { ApiRequest } from "../src/server/http.js";

const protectedRoutes = ["/dashboard", "/book", "/member-room", "/spark", "/council", "/founder", "/wellness"] as const;
const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function resetEnv(): void {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test.afterEach(resetEnv);

test("Access Control protected routes require authentication while public routes stay public", () => {
  const routes = new Map(LaunchRoutes.map((route) => [route.path, route]));

  for (const path of protectedRoutes) {
    assert.equal(routes.get(path)?.requiresAuth, true, `${path} should require auth`);
  }

  assert.equal(routes.get("/")?.requiresAuth, false);
  assert.equal(routes.get("/membership")?.requiresAuth, false);
  assert.equal(routes.get("/join")?.requiresAuth, false);
});

test("Access Control protected pages redirect logged-out users to login and unpaid users to membership", () => {
  for (const path of protectedRoutes) {
    const html = renderPageModelToHtml(routePage(path));

    assert.ok(html.includes(`memberOnly=[`), `${path} should include logged-out gate`);
    assert.ok(html.includes(`paidOnly=[`), `${path} should include paid member gate`);
    assert.ok(html.includes(`"/login?next="`), `${path} should redirect logged-out users to login`);
    assert.ok(html.includes(`/api/membership-status`), `${path} should check membership status`);
    assert.ok(html.includes(`/membership?membership=required`), `${path} should redirect unpaid users to membership`);
  }
});

test("Access Control digital book is included for ACTIVE monthly members", () => {
  const html = renderPageModelToHtml(routePage("/book"));

  assert.ok(html.includes("The digital book is included for active monthly members"));
  assert.ok(html.includes("membership status becomes ACTIVE"));
});

test("Access Control membership_status ACTIVE controls unlock", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";

  globalThis.fetch = (async (input) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return jsonResponse(200, { id: "00000000-0000-4000-8000-000000000001", email: "member@example.com" });
    if (url.includes("/rest/v1/memberships")) return jsonResponse(200, [{ membership_status: "ACTIVE" }]);
    return jsonResponse(404, {});
  }) as typeof fetch;

  const result = await handleMembershipStatusRequest({
    method: "GET",
    headers: { authorization: "Bearer access_token" },
  } as unknown as ApiRequest);

  assert.equal(result.status, 200);
  assert.equal(result.body.active, true);
  assert.equal(result.body.membershipStatus, "ACTIVE");
});

test("Access Control Stripe payment alone does not unlock unless membership persistence succeeds", async () => {
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  process.env.STRIPE_SECRET_KEY = "sk_test";

  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return jsonResponse(200, { id: "00000000-0000-4000-8000-000000000001", email: "member@example.com" });
    if (url.includes("api.stripe.com/v1/checkout/sessions/cs_paid")) {
      return jsonResponse(200, {
        id: "cs_paid",
        payment_status: "paid",
        status: "complete",
        metadata: { member_id: "00000000-0000-4000-8000-000000000001" },
      });
    }
    if (url.includes("/rest/v1/memberships") && init?.method === "POST") {
      return jsonResponse(500, { message: "membership persistence failed" });
    }
    return jsonResponse(404, {});
  }) as typeof fetch;

  const result = await handleMembershipStatusRequest({
    method: "POST",
    headers: { authorization: "Bearer access_token" },
    body: { sessionId: "cs_paid" },
  } as unknown as ApiRequest);

  assert.equal(result.status, 500);
  assert.equal(result.body.success, false);
  assert.match(String(result.body.error), /membership persistence failed/i);
});
