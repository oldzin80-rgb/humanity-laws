import type { ProviderEnvironment } from "./types.js";

export const AnalyticsEventIds = [
  "page_view", "session_started", "signup_started", "signup_completed", "login_completed",
  "membership_viewed", "checkout_started", "checkout_completed", "purchase_completed",
  "membership_activated", "book_viewed", "book_downloaded", "spark_viewed", "spark_completed",
  "council_started", "council_completed", "memory_created", "table_viewed", "recipe_submitted",
  "podcast_viewed", "support_requested", "notification_opt_in", "notification_opt_out",
  "consent_granted", "consent_revoked", "campaign_landing_viewed", "referral_received",
] as const;
export type AnalyticsEventId = typeof AnalyticsEventIds[number];
export type ConsentCategory = "ESSENTIAL" | "FUNCTIONAL" | "ANALYTICS" | "PERSONALIZATION" | "ADVERTISING";
export type AnalyticsDestination = "FIRST_PARTY" | "GA4" | "META" | "TIKTOK" | "LINKEDIN" | "PINTEREST";

export interface EventDefinition {
  id: AnalyticsEventId;
  version: 1;
  purpose: string;
  category: ConsentCategory;
  allowedDestinations: readonly AnalyticsDestination[];
  prohibitedFields: readonly string[];
  retentionDays: number;
}

const prohibited = [
  "conversation", "conversation_content", "memory_content", "health_information", "password",
  "token", "payment_secret", "full_address", "phone", "email", "minor_sensitive_data", "free_form_text",
] as const;

export const AnalyticsEventTaxonomy: Readonly<Record<AnalyticsEventId, EventDefinition>> =
  Object.fromEntries(AnalyticsEventIds.map((id) => [id, {
    id,
    version: 1 as const,
    purpose: `Measure ${id.replaceAll("_", " ")} without sensitive content`,
    category: (id.startsWith("consent_") || id.startsWith("notification_") ? "ESSENTIAL" : "ANALYTICS") as ConsentCategory,
    allowedDestinations: id.startsWith("consent_") ? ["FIRST_PARTY"] : ["FIRST_PARTY", "GA4"],
    prohibitedFields: prohibited,
    retentionDays: 395,
  }])) as unknown as Readonly<Record<AnalyticsEventId, EventDefinition>>;

export interface MeasurementConsent {
  memberId?: string;
  revision: number;
  categories: Readonly<Record<ConsentCategory, boolean>>;
  updatedAt: string;
}

export const defaultMeasurementConsent = (updatedAt: string): MeasurementConsent => ({
  revision: 1, updatedAt,
  categories: { ESSENTIAL: true, FUNCTIONAL: false, ANALYTICS: false, PERSONALIZATION: false, ADVERTISING: false },
});

export interface AnalyticsEventInput {
  eventId: AnalyticsEventId;
  eventVersion: 1;
  environment: ProviderEnvironment;
  actorId?: string;
  anonymousId?: string;
  properties: Readonly<Record<string, string | number | boolean>>;
  destination: AnalyticsDestination;
  idempotencyKey: string;
  occurredAt: string;
}

export interface AnalyticsRecord {
  id: string;
  event: AnalyticsEventInput;
  minimizedProperties: Readonly<Record<string, string | number | boolean>>;
  status: "RECORDED" | "REJECTED";
  reasonCodes: readonly string[];
  immutable: true;
  auditReference: string;
  outboxReference?: string;
}

function looksSensitive(key: string, value: string | number | boolean): boolean {
  const normalized = key.toLowerCase();
  if (prohibited.some((field) => normalized.includes(field))) return true;
  return typeof value === "string" && /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s().-]{8,})/i.test(value);
}

export class FirstPartyAnalyticsRuntime {
  readonly records: AnalyticsRecord[] = [];
  readonly seen = new Set<string>();
  readonly externalCalls = 0;

  record(input: AnalyticsEventInput, consent: MeasurementConsent): AnalyticsRecord {
    const definition = AnalyticsEventTaxonomy[input.eventId];
    const reasons: string[] = [];
    if (!definition || input.eventVersion !== 1) reasons.push("UNKNOWN_EVENT_VERSION");
    if (!consent.categories[definition.category]) reasons.push("CONSENT_REQUIRED");
    if (!definition.allowedDestinations.includes(input.destination)) reasons.push("DESTINATION_NOT_ALLOWED");
    if (input.environment === "PRODUCTION" && input.destination !== "FIRST_PARTY") reasons.push("PRODUCTION_TAGS_DISABLED");
    if (this.seen.has(input.idempotencyKey)) reasons.push("DUPLICATE_EVENT");
    if (Object.entries(input.properties).some(([key, value]) => looksSensitive(key, value))) reasons.push("SENSITIVE_DATA_REJECTED");
    const accepted = reasons.length === 0;
    if (accepted) this.seen.add(input.idempotencyKey);
    const record: AnalyticsRecord = {
      id: `analytics:${input.idempotencyKey}`, event: input,
      minimizedProperties: accepted ? input.properties : {},
      status: accepted ? "RECORDED" : "REJECTED", reasonCodes: reasons,
      immutable: true, auditReference: `audit:analytics:${input.idempotencyKey}`,
      outboxReference: accepted ? `outbox:analytics:${input.idempotencyKey}` : undefined,
    };
    this.records.push(record);
    return record;
  }
}

export interface TagObservation {
  id: string;
  source: string;
  destination: AnalyticsDestination | "UNKNOWN";
  consentCategory?: ConsentCategory;
  loadsBeforeConsent: boolean;
  approved: boolean;
}
export type TagClassification = "APPROVED" | "BLOCKED" | "UNKNOWN" | "DUPLICATE" | "STALE" | "DRIFTED";
export function inventoryTags(observations: readonly TagObservation[]): Array<TagObservation & {classification: TagClassification}> {
  const counts = new Map<string, number>();
  for (const item of observations) counts.set(`${item.destination}:${item.source}`, (counts.get(`${item.destination}:${item.source}`) ?? 0) + 1);
  return observations.map((item) => ({ ...item,
    classification: item.destination === "UNKNOWN" ? "UNKNOWN"
      : item.loadsBeforeConsent && item.consentCategory !== "ESSENTIAL" ? "BLOCKED"
      : (counts.get(`${item.destination}:${item.source}`) ?? 0) > 1 ? "DUPLICATE"
      : item.approved ? "APPROVED" : "DRIFTED",
  }));
}

export const GovernedTagRegistry = {
  ga4: { destination: "GA4", enabled: false, delayedUntilConsent: true, productionAuthorized: false },
  meta: { destination: "META", enabled: false, delayedUntilConsent: true, productionAuthorized: false },
  tiktok: { destination: "TIKTOK", enabled: false, delayedUntilConsent: true, productionAuthorized: false },
  linkedin: { destination: "LINKEDIN", enabled: false, delayedUntilConsent: true, productionAuthorized: false },
  pinterest: { destination: "PINTEREST", enabled: false, delayedUntilConsent: true, productionAuthorized: false },
  googleTagManager: { enabled: false, customHtmlAllowed: false, productionPublished: false },
  searchConsole: { verified: false, writeActionsEnabled: false },
} as const;

export interface AttributionInput { source?: string; medium?: string; campaign?: string; content?: string; term?: string }
export function minimizeAttribution(input: AttributionInput): AttributionInput {
  const clean = (value?: string) => value?.slice(0, 100).replace(/[^a-zA-Z0-9 _.-]/g, "");
  return { source: clean(input.source), medium: clean(input.medium), campaign: clean(input.campaign), content: clean(input.content), term: clean(input.term) };
}
export function createSitemap(origin: string, paths: readonly string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((route) => `<url><loc>${origin}${route}</loc></url>`).join("")}</urlset>`;
}
export function createRobots(origin: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`;
}
