import test from "node:test";
import assert from "node:assert/strict";
import { createLaunchRuntime } from "../src/runtime/index.js";
import { LaunchRoutes, renderPageModelToHtml, routePage } from "../src/application/index.js";

test("signup route renders a working account form", () => {
  const route = LaunchRoutes.find((item) => item.path === "/signup");
  assert.equal(route?.requiresAuth, false);

  const html = renderPageModelToHtml(routePage("/signup"));
  assert.ok(html.includes('data-auth-form="signup"'));
  assert.ok(html.includes('autocomplete="new-password"'));
  assert.ok(html.includes("Create account"));
});

test("login route renders a sign-in form and does not point to missing continuation route", () => {
  const html = renderPageModelToHtml(routePage("/login"));
  assert.ok(html.includes('data-auth-form="login"'));
  assert.ok(html.includes("Sign in"));
  assert.equal(html.includes("/login/continue"), false);
});

test("protected pages include session persistence and logout hooks", () => {
  const html = renderPageModelToHtml(routePage("/dashboard"));
  assert.ok(html.includes('data-page-kind="MEMBER"'));
  assert.ok(html.includes("hl_auth_session_v1"));
  assert.ok(html.includes("[data-auth-logout]"));
  assert.ok(html.includes("/login?next="));
});

test("auth renderer embeds Supabase auth configuration when present", () => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalAnon = process.env.SUPABASE_ANON_KEY;
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon-key";

  try {
    const html = renderPageModelToHtml(routePage("/login"));
    assert.ok(html.includes("https://project.supabase.co"));
    assert.ok(html.includes("anon-key"));
    assert.ok(html.includes("/auth/v1"));
  } finally {
    process.env.SUPABASE_URL = originalUrl;
    process.env.SUPABASE_ANON_KEY = originalAnon;
  }
});

test("auth service can create, sign in, persist, and clear sessions", async () => {
  const runtime = createLaunchRuntime();
  const { member, session } = await runtime.auth.signUp("auth-member@example.com", "Auth Member");
  assert.equal(session.authenticated, true);

  const login = await runtime.auth.signIn(member.email);
  assert.equal(login.success, true);
  assert.equal(login.session.authenticated, true);

  const persisted = runtime.auth.findSession(login.session.sessionId);
  assert.equal(persisted?.memberId, member.memberId);

  runtime.auth.signOut(login.session.sessionId);
  assert.equal(runtime.auth.findSession(login.session.sessionId), null);
});
