import {createHash, createHmac, timingSafeEqual, verify as verifySignature} from "node:crypto";

export const CommunicationCapabilities = [
  "TWILIO_VERIFY", "TWILIO_SMS_TRANSACTIONAL", "TWILIO_SMS_SPARK",
  "TWILIO_SMS_SUPPORT", "SENDGRID_TRANSACTIONAL_EMAIL",
  "SENDGRID_LIFECYCLE_EMAIL",
] as const;
export const ReservedCommunicationCapabilities = [
  "TWILIO_VOICE", "TWILIO_WHATSAPP", "SENDGRID_MARKETING_CAMPAIGNS",
] as const;
export type CommunicationChannel = "SMS" | "EMAIL";
export type CommunicationPurpose =
  | "SECURITY" | "TRANSACTIONAL" | "SPARK" | "SUPPORT" | "LIFECYCLE" | "MARKETING";
export type MessageState =
  | "DRAFT" | "POLICY_DENIED" | "APPROVED" | "QUEUED" | "DISPATCHING"
  | "PROVIDER_ACCEPTED" | "SENT" | "DELIVERED" | "UNDELIVERED"
  | "FAILED" | "CANCELED" | "EXPIRED" | "SUPPRESSED" | "UNKNOWN";

export interface CommunicationConsent {
  memberId: string; channel: CommunicationChannel; purpose: CommunicationPurpose;
  optInSource: string; consentTextVersion: string; capturedAt: string;
  jurisdiction: string; verified: boolean; revokedAt?: string; revocationReason?: string;
  timezone: string; quietHoursStart: number; quietHoursEnd: number;
  preferredChannel?: CommunicationChannel; locale: string;
  accessibilityPreferences: readonly string[]; guardianPolicyReference?: string;
}
export type SuppressionScope = "GLOBAL_MEMBER" | "CHANNEL" | "DESTINATION" |
  "PURPOSE" | "PROVIDER" | "LEGAL_HOLD" | "COMPLAINT_BOUNCE" | "TEMPORARY";
export interface Suppression {
  id: string; memberId: string; scope: SuppressionScope; value: string;
  active: boolean; reason: string; createdAt: string;
}

const stopCommands = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const startCommands = new Set(["START", "UNSTOP", "YES"]);
export function parseComplianceCommand(input: string) {
  const normalized = input.trim().replace(/\s+/g, " ").toUpperCase();
  if (stopCommands.has(normalized)) return {type: "STOP" as const, normalized};
  if (startCommands.has(normalized)) return {type: "START" as const, normalized};
  if (normalized === "HELP" || normalized === "INFO") return {type: "HELP" as const, normalized};
  return {type: "OTHER" as const, normalized};
}

export function normalizePhone(input: string): string {
  const value = input.trim().replace(/[()\s.-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(value)) throw new Error("INVALID_E164_DESTINATION");
  return value;
}
export function canonicalizeEmail(input: string): string {
  const value = input.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw new Error("INVALID_EMAIL_DESTINATION");
  return value;
}
export function destinationFingerprint(destination: string) {
  return createHash("sha256").update(destination).digest("hex");
}
export function maskDestination(destination: string) {
  if (destination.includes("@")) {
    const [local = "", domain = ""] = destination.split("@");
    return `${local.slice(0, 1)}***@${domain}`;
  }
  return `***${destination.slice(-4)}`;
}

export interface MessageTemplate {
  id: string; channel: CommunicationChannel; purpose: CommunicationPurpose;
  locale: string; semanticVersion: string; subject?: string; body: string;
  variables: readonly string[]; maximumRenderedLength: number;
  approvalState: "DRAFT" | "APPROVED" | "RETIRED";
  complianceReference: string; brandReviewState: "PENDING" | "APPROVED";
  activeFrom: string; activeTo?: string; supersedes?: string; immutable: boolean;
}
export const InitialTemplateIds = [
  "phone_verification_code", "welcome_activation_sms", "welcome_activation_email",
  "purchase_confirmation", "membership_confirmation", "password_security_notice",
  "spark_daily_inspiration", "support_acknowledgement", "help_response",
  "opt_in_confirmation", "opt_out_confirmation",
] as const;

export function renderApprovedTemplate(template: MessageTemplate, variables: Record<string, string>) {
  if (template.approvalState !== "APPROVED" || template.brandReviewState !== "APPROVED" ||
      !template.immutable) throw new Error("APPROVED_IMMUTABLE_TEMPLATE_REQUIRED");
  let body = template.body;
  for (const variable of template.variables) {
    const value = variables[variable];
    if (value === undefined) throw new Error(`TEMPLATE_VARIABLE_MISSING:${variable}`);
    if (/[<>{}\r\n]/.test(value)) throw new Error(`TEMPLATE_VARIABLE_UNSAFE:${variable}`);
    body = body.replaceAll(`{{${variable}}}`, value);
  }
  if (body.includes("{{") || body.length > template.maximumRenderedLength) {
    throw new Error("TEMPLATE_RENDER_INVALID");
  }
  return {body, smsSegments: template.channel === "SMS" ? estimateSmsSegments(body) : 0};
}
export function estimateSmsSegments(body: string) {
  const gsm = /^[\u000A\u000D\u0020-\u007E£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ]*$/.test(body);
  const single = gsm ? 160 : 70;
  const multipart = gsm ? 153 : 67;
  return body.length <= single ? 1 : Math.ceil(body.length / multipart);
}

const messageTransitions: Readonly<Record<MessageState, readonly MessageState[]>> = {
  DRAFT: ["POLICY_DENIED", "APPROVED", "SUPPRESSED", "CANCELED"],
  POLICY_DENIED: [], APPROVED: ["QUEUED", "CANCELED", "EXPIRED"],
  QUEUED: ["DISPATCHING", "CANCELED", "EXPIRED"], DISPATCHING: ["PROVIDER_ACCEPTED", "FAILED"],
  PROVIDER_ACCEPTED: ["SENT", "DELIVERED", "UNDELIVERED", "FAILED", "UNKNOWN"],
  SENT: ["DELIVERED", "UNDELIVERED", "FAILED", "UNKNOWN"], DELIVERED: [],
  UNDELIVERED: [], FAILED: [], CANCELED: [], EXPIRED: [], SUPPRESSED: [], UNKNOWN: ["DELIVERED", "UNDELIVERED", "FAILED"],
};
export function transitionMessage(from: MessageState, to: MessageState) {
  if (!messageTransitions[from].includes(to)) throw new Error(`FORBIDDEN_MESSAGE_TRANSITION:${from}:${to}`);
  return to;
}

export interface MessageIntentCommand {
  commandId: string; idempotencyKey: string; actorId: string; actorFounder: boolean;
  memberId: string; environment: "LOCAL" | "DEVELOPMENT" | "STAGING" | "PRODUCTION";
  capability: typeof CommunicationCapabilities[number]; channel: CommunicationChannel;
  purpose: CommunicationPurpose; destination: string; destinationVerified: boolean;
  destinationAllowlisted: boolean; consent?: CommunicationConsent;
  suppressions: readonly Suppression[]; quietHoursActive: boolean;
  template: MessageTemplate; variables: Record<string, string>;
  rateLimitAvailable: boolean; budgetAvailable: boolean; globalPaused: boolean;
  providerPaused: boolean; capabilityPaused: boolean; stagingAuthorization?: {
    founderId: string; expiresAt: string; exactDestinationFingerprint: string;
    exactTemplateId: string; estimatedChargeMinor: number;
  };
}
export interface MessageIntentResult {
  intentId: string; commandId: string; state: MessageState; reasons: string[];
  destinationFingerprint: string; maskedDestination: string;
  renderedLength: number; smsSegments: number; externalCalls: 0;
}
export class CommunicationsRuntime {
  private intents = new Map<string, MessageIntentResult>();
  private audit: {action: string; outcome: string; commandId: string}[] = [];
  private outbox: {id: string; intentId: string; status: "PENDING"}[] = [];
  create(command: MessageIntentCommand): MessageIntentResult {
    const existing = this.intents.get(command.idempotencyKey);
    if (existing) return structuredClone(existing);
    const reasons: string[] = [];
    if (command.environment === "PRODUCTION") reasons.push("PRODUCTION_PROHIBITED");
    if (!command.actorFounder) reasons.push("FOUNDER_AUTHORIZATION_REQUIRED");
    if (!command.destinationVerified) reasons.push("DESTINATION_NOT_VERIFIED");
    if (!command.destinationAllowlisted) reasons.push("DESTINATION_NOT_ALLOWLISTED");
    if (!command.consent?.verified || command.consent.revokedAt ||
        command.consent.channel !== command.channel || command.consent.purpose !== command.purpose) {
      reasons.push("APPLICABLE_CONSENT_MISSING");
    }
    if (command.suppressions.some(item => item.active)) reasons.push("SUPPRESSED");
    if (command.quietHoursActive) reasons.push("QUIET_HOURS");
    if (!command.rateLimitAvailable) reasons.push("RATE_LIMITED");
    if (!command.budgetAvailable) reasons.push("BUDGET_DENIED");
    if (command.globalPaused || command.providerPaused || command.capabilityPaused) reasons.push("PAUSED");
    let rendered: {body: string; smsSegments: number} | undefined;
    try { rendered = renderApprovedTemplate(command.template, command.variables); }
    catch { reasons.push("TEMPLATE_DENIED"); }
    const destination = command.channel === "SMS"
      ? normalizePhone(command.destination) : canonicalizeEmail(command.destination);
    const result: MessageIntentResult = {
      intentId: createHash("sha256").update(command.commandId).digest("hex").slice(0, 24),
      commandId: command.commandId, state: (reasons.length ? "POLICY_DENIED" : "QUEUED") as MessageState,
      reasons, destinationFingerprint: destinationFingerprint(destination),
      maskedDestination: maskDestination(destination), renderedLength: rendered?.body.length ?? 0,
      smsSegments: rendered?.smsSegments ?? 0, externalCalls: 0 as const,
    };
    this.intents.set(command.idempotencyKey, result);
    this.audit.push({action: "MESSAGE_INTENT_CREATED", outcome: result.state, commandId: command.commandId});
    if (!reasons.length) this.outbox.push({id: `outbox:${result.intentId}`, intentId: result.intentId, status: "PENDING"});
    return structuredClone(result);
  }
  auditEvents() { return structuredClone(this.audit); }
  outboxRecords() { return structuredClone(this.outbox); }
}

export function verifyTwilioSignature(input: {
  authToken: string; signature: string; url: string; parameters: Record<string, string>;
}) {
  const data = input.url + Object.entries(input.parameters).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}${value}`).join("");
  const expected = createHmac("sha1", input.authToken).update(data).digest("base64");
  const a = Buffer.from(expected); const b = Buffer.from(input.signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function verifySendGridSignature(input: {
  publicKeyPem: string; signatureBase64: string; timestamp: string; rawBody: string;
}) {
  return verifySignature(null, Buffer.from(input.timestamp + input.rawBody),
    input.publicKeyPem, Buffer.from(input.signatureBase64, "base64"));
}
