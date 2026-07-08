import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReleaseReadinessReport, type EvidenceBundle } from "../src/core/index.js";

const guidePath = "docs/launch/SUPABASE_LIVE_SETUP_PROOF.md";

function readGuide(): string {
  return readFileSync(guidePath, "utf8");
}

test("Supabase live setup proof guide exists and covers all required proof areas", () => {
  const guide = readGuide();

  for (const heading of [
    "## 1. Supabase project URL/key locations",
    "## 2. Auth signup/login settings to verify",
    "## 3. Required membership table/fields",
    "## 4. How to confirm a test user exists",
    "## 5. How to confirm unpaid user is blocked",
    "## 6. How to confirm monthly member has membership_status = ACTIVE",
    "## 7. How to confirm monthly member has digital_book_access = true",
    "## 8. How to confirm digital-book-only purchaser has book access but not full membership",
    "## 9. How to confirm failed/canceled payment does not unlock access",
    "## 10. How to confirm ADMIN_ALLOWLIST email matches admin test user",
    "## 11. Secret-safety warning",
    "## 12. LaunchReady rule",
  ]) {
    assert.ok(guide.includes(heading), `Missing Supabase proof section: ${heading}`);
  }
});

test("Supabase live setup proof guide includes required membership fields and expected access states", () => {
  const guide = readGuide();

  for (const expectedText of [
    "`member_id`",
    "`email`",
    "`membership_status`",
    "`digital_book_access`",
    "`stripe_customer_id`",
    "`stripe_subscription_id`",
    "`updated_at`",
    "`membership_status = ACTIVE`",
    "`membership_status = FREE`",
    "`digital_book_access = true`",
    "Member-only rooms remain locked.",
    "Failed/canceled payment does not unlock membership.",
  ]) {
    assert.ok(guide.includes(expectedText), `Missing membership/access proof text: ${expectedText}`);
  }
});

test("Supabase live setup proof guide covers auth settings, admin allowlist, and secret safety", () => {
  const guide = readGuide();

  for (const expectedText of [
    "Email provider is enabled",
    "Site URL matches the deployed Humanity Laws URL",
    "allowed redirect URLs include the deployed Humanity Laws URL",
    "`ADMIN_ALLOWLIST` contains that exact email or member ID",
    "Never paste these values into screenshots, chats, public docs, or commits:",
    "`SUPABASE_SERVICE_ROLE_KEY`",
    "User passwords",
  ]) {
    assert.ok(guide.includes(expectedText), `Missing auth/admin/secret proof text: ${expectedText}`);
  }
});

test("Supabase live setup proof guide keeps launchReady false until live proof passes", () => {
  const guide = readGuide();
  const bundle: EvidenceBundle = { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] };
  const report = createReleaseReadinessReport(bundle);

  assert.match(guide, /LaunchReady: FALSE/);
  assert.match(guide, /`launchReady` remains false until live proof passes\./);
  assert.equal(report.launchReady, false);
});
