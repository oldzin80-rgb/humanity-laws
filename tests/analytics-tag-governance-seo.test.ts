import assert from "node:assert/strict";
import test from "node:test";
import {
  AnalyticsEventIds, AnalyticsEventTaxonomy, FirstPartyAnalyticsRuntime, GovernedTagRegistry,
  createRobots, createSitemap, defaultMeasurementConsent, inventoryTags, minimizeAttribution,
} from "../src/provider-command-center/index.js";

const now = "2026-07-29T12:00:00.000Z";
const consent = () => {
  const value = defaultMeasurementConsent(now);
  return { ...value, categories: { ...value.categories, ANALYTICS: true } };
};
const event = (overrides = {}) => ({
  eventId: "page_view" as const, eventVersion: 1 as const, environment: "STAGING" as const,
  properties: { route: "/book" }, destination: "FIRST_PARTY" as const,
  idempotencyKey: "event-1", occurredAt: now, ...overrides,
});

test("taxonomy contains every required governed event", () => {
  assert.equal(AnalyticsEventIds.length, 27);
  assert.deepEqual(Object.keys(AnalyticsEventTaxonomy), [...AnalyticsEventIds]);
});
test("analytics is denied by default consent", () => {
  assert.equal(new FirstPartyAnalyticsRuntime().record(event(), defaultMeasurementConsent(now)).status, "REJECTED");
});
test("consented first-party event creates audit and outbox evidence", () => {
  const result = new FirstPartyAnalyticsRuntime().record(event(), consent());
  assert.equal(result.status, "RECORDED");
  assert.match(result.auditReference, /^audit:/);
  assert.match(result.outboxReference ?? "", /^outbox:/);
});
test("raw email is rejected and never persisted", () => {
  const result = new FirstPartyAnalyticsRuntime().record(event({ properties: { value: "person@example.com" } }), consent());
  assert.deepEqual(result.minimizedProperties, {});
  assert.ok(result.reasonCodes.includes("SENSITIVE_DATA_REJECTED"));
});
test("conversation and memory fields are rejected", () => {
  const runtime = new FirstPartyAnalyticsRuntime();
  assert.equal(runtime.record(event({ properties: { conversation_content: "private" } }), consent()).status, "REJECTED");
});
test("duplicate events are idempotently rejected", () => {
  const runtime = new FirstPartyAnalyticsRuntime();
  assert.equal(runtime.record(event(), consent()).status, "RECORDED");
  assert.ok(runtime.record(event(), consent()).reasonCodes.includes("DUPLICATE_EVENT"));
});
test("production third-party tags are fail closed", () => {
  const result = new FirstPartyAnalyticsRuntime().record(event({ environment: "PRODUCTION", destination: "GA4" }), consent());
  assert.ok(result.reasonCodes.includes("PRODUCTION_TAGS_DISABLED"));
});
test("runtime makes zero live external calls", () => assert.equal(new FirstPartyAnalyticsRuntime().externalCalls, 0));
test("advertising and GTM are disabled", () => {
  assert.equal(GovernedTagRegistry.meta.enabled, false);
  assert.equal(GovernedTagRegistry.googleTagManager.productionPublished, false);
});
test("inventory detects unknown, duplicate, and pre-consent tags", () => {
  const result = inventoryTags([
    { id: "1", source: "gtag", destination: "GA4", consentCategory: "ANALYTICS", loadsBeforeConsent: false, approved: true },
    { id: "2", source: "gtag", destination: "GA4", consentCategory: "ANALYTICS", loadsBeforeConsent: false, approved: true },
    { id: "3", source: "vendor", destination: "UNKNOWN", loadsBeforeConsent: false, approved: false },
    { id: "4", source: "pixel", destination: "META", consentCategory: "ADVERTISING", loadsBeforeConsent: true, approved: true },
  ]);
  assert.deepEqual(result.map((item) => item.classification), ["DUPLICATE", "DUPLICATE", "UNKNOWN", "BLOCKED"]);
});
test("attribution removes unsafe characters and truncates", () => {
  const result = minimizeAttribution({ source: "<script>x</script>", campaign: "x".repeat(150) });
  assert.equal(result.source, "scriptxscript");
  assert.equal(result.campaign?.length, 100);
});
test("SEO artifacts expose sitemap and protect admin/API routes", () => {
  assert.match(createSitemap("https://humanitylaws.com", ["/", "/book"]), /<loc>https:\/\/humanitylaws.com\/book<\/loc>/);
  assert.match(createRobots("https://humanitylaws.com"), /Disallow: \/admin\//);
});
