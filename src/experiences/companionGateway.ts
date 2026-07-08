import type { CompanionGateway, CompanionGatewayContext, CompanionResponse } from "./types.js";
import { createMergedHumanityLawsRuntime } from "../runtime/mergedHumanityLaws.js";
import { ADAM_EVE_MASTER_STANDARD_PROMPT } from "../communication/adamEveHighestStandardUpgrade.js";
import { buildAdamEveCompanionPrompt } from "../communication/adamEveMasterCompanion.js";
import { buildHumanityLawsCompanionOS } from "../communication/humanityLawsCompanionOperatingSystem.js";

export class DemoCompanionGateway implements CompanionGateway {
  async respond(companion: "Adam" | "Eve", input: string): Promise<CompanionResponse> {
    const runtime = createMergedHumanityLawsRuntime();
    const conversation = runtime.adamEve.constitutionalCore.continueConversation({
      history: [],
      message: input,
      cognitive: {
        lifeStage: "adulthood",
        readingLevel: "plain",
        communicationMode: "text",
        preferredLanguage: "en",
      },
    });
    const sourceReport = runtime.sourceLedger.report({ kind: "book" });
    const sourceSummary = `Source ledger: ${sourceReport.sources.length} Humanity Laws book source; SHA-256 ${runtime.bookRegistry.source.sha256}; page count ${runtime.archiveManifest.source.pageCount}.`;
    const message = companion === "Adam"
      ? `Adam: I am an AI companion. ${conversation.bridge} ${conversation.response}`
      : `Eve: I am an AI companion. ${conversation.acknowledgement} ${conversation.question}`;
    return {
      companion,
      message,
      transparency: "AI_TRANSPARENT",
      humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
      sourceSummary,
      responseOrigin: "demo_fallback",
      providerName: "demo",
    };
  }
}

export interface CompanionProviderConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function configuredTimeout(value?: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12000;
}

export function companionProviderConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return env.COMPANION_AI_PROVIDER === "openai" && Boolean(env.OPENAI_API_KEY?.trim()) && Boolean(env.COMPANION_MODEL?.trim());
}

export function companionProviderConfigFromEnv(env: Record<string, string | undefined> = process.env): CompanionProviderConfig {
  return {
    provider: env.COMPANION_AI_PROVIDER,
    apiKey: env.OPENAI_API_KEY,
    model: env.COMPANION_MODEL,
    timeoutMs: configuredTimeout(env.COMPANION_TIMEOUT_MS),
  };
}

export function councilSystemPromptScaffold(): string {
  return buildHumanityLawsCompanionOS({
    mode: "Council",
    memberId: "council_scaffold",
    userMessage: "Prepare a Council response scaffold.",
    humanityLawsBookContext: [sourceContextFallback()],
    memberContext: ["Return distinct Adam perspective, Eve perspective, Humanity Laws principle, and human final choice."],
    researchContext: ["Council is an AI-supported reflection structure, not a human authority."],
  }).systemPrompt;
}

function sourceContextFallback(): string {
  const runtime = createMergedHumanityLawsRuntime();
  return `Humanity Laws source context: SHA-256 ${runtime.bookRegistry.source.sha256}; page count ${runtime.archiveManifest.source.pageCount}; source remains preserved and must not be rewritten.`;
}

function historyText(context?: CompanionGatewayContext): string {
  const history = context?.conversationHistory?.slice(-6) ?? [];
  if (!history.length) return "No prior conversation turns were provided.";
  return history
    .map((turn, index) => {
      const input = turn.input ? `Member: ${turn.input}` : "";
      const message = turn.message ? `${turn.companion || "Companion"}: ${turn.message}` : "";
      return `Turn ${index + 1}: ${[input, message].filter(Boolean).join(" | ")}`;
    })
    .join("\n");
}

function assemblePrompt(companion: "Adam" | "Eve", input: string, context?: CompanionGatewayContext): Array<{ role: "system" | "user"; content: string }> {
  const safety = context?.safetyBoundary?.triggered
    ? `Safety boundary triggered: ${context.safetyBoundary.reason ?? "High-risk concern."} Recommended action: ${context.safetyBoundary.recommendedAction ?? "Use qualified human support."}`
    : "Safety boundary: no high-risk trigger detected, but maintain professional boundaries.";
  const sourceContext = context?.sourceContext ?? sourceContextFallback();
  const os = context?.companionOperatingSystem ?? buildHumanityLawsCompanionOS({
    mode: companion,
    memberId: context?.memberId ?? "unknown_member",
    userMessage: input,
    humanityLawsBookContext: [sourceContext],
    memberContext: [
      `Intent: ${context?.intent ?? "reflection"}`,
      `Consent to remember: ${context?.consentToRemember === true ? "yes" : "no"}`,
      "Conversation history:",
      historyText(context),
    ],
    researchContext: [safety],
  });
  const masterPlan = buildAdamEveCompanionPrompt({
    companion,
    userMessage: input,
    member: {
      memberId: context?.memberId ?? "unknown_member",
      currentNeed: context?.intent ?? "reflection",
      preferredTone: companion === "Eve" ? "gentle" : "direct",
      savedMemory: context?.consentToRemember ? historyText(context).split("\n").filter(Boolean).slice(-6) : [],
    },
    sources: {
      humanityLawsBook: [sourceContext],
      researchContext: [safety],
    },
  });
  return [
    {
      role: "system",
      content: [
        os.systemPrompt,
        "The Companion Operating System above is the governing orchestration layer. Preserve the existing memory, source, safety, quality, avatar, and communication engines beneath it.",
        "ADAM/EVE MASTER COMPANION RESPONSE PLAN",
        masterPlan.systemPrompt,
        masterPlan.memoryInstructions,
        masterPlan.safetyInstructions,
        masterPlan.responseStyle,
        masterPlan.orchestrationRules,
        ADAM_EVE_MASTER_STANDARD_PROMPT,
      ].join("\n\n"),
    },
    {
      role: "user",
      content: [
        `Companion: ${companion}`,
        `Intent: ${context?.intent ?? "reflection"}`,
        `Consent to remember: ${context?.consentToRemember === true ? "yes" : "no"}`,
        `Humanity Laws source context: ${sourceContext}`,
        safety,
        "Conversation history:",
        historyText(context),
        "Current member message:",
        input,
      ].join("\n"),
    },
  ];
}

function parseProviderText(json: unknown): string | undefined {
  const value = json as {
    choices?: Array<{ message?: { content?: unknown }; text?: unknown }>;
    output_text?: unknown;
  };
  const content = value.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) return content.trim();
  const text = value.choices?.[0]?.text;
  if (typeof text === "string" && text.trim()) return text.trim();
  if (typeof value.output_text === "string" && value.output_text.trim()) return value.output_text.trim();
  return undefined;
}

export class OpenAICompatibleCompanionGateway implements CompanionGateway {
  constructor(private readonly config: CompanionProviderConfig) {}

  async respond(companion: "Adam" | "Eve", input: string, context?: CompanionGatewayContext): Promise<CompanionResponse> {
    if (this.config.provider !== "openai" || !this.config.apiKey || !this.config.model) {
      throw new Error("OpenAI-compatible companion provider is not configured.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs ?? 12000);
    try {
      const fetcher = this.config.fetchImpl ?? fetch;
      const request = {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.config.apiKey}`,
          "content-type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.model,
          temperature: 0.5,
          messages: assemblePrompt(companion, input, context),
        }),
      };
      let response = await fetcher("https://api.openai.com/v1/chat/completions", request);
      if (response.status >= 500) {
        response = await fetcher("https://api.openai.com/v1/chat/completions", request);
      }
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(`Companion provider failed with HTTP ${response.status}.`);
      const message = parseProviderText(json);
      if (!message) throw new Error("Companion provider returned no usable text.");
      return {
        companion,
        message,
        transparency: "AI_TRANSPARENT",
        humanSovereigntyReminder: "This is reflective support from AI; your human judgment remains final.",
        sourceSummary: context?.sourceContext ?? sourceContextFallback(),
        responseOrigin: "provider",
        providerName: "openai",
        model: this.config.model,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export class ProviderBackedCompanionGateway implements CompanionGateway {
  constructor(
    private readonly provider: CompanionGateway,
    private readonly fallback: CompanionGateway = new DemoCompanionGateway(),
  ) {}

  async respond(companion: "Adam" | "Eve", input: string, context?: CompanionGatewayContext): Promise<CompanionResponse> {
    try {
      return await this.provider.respond(companion, input, context);
    } catch (error) {
      console.error("Companion provider unavailable; using demo fallback.", error);
      return this.fallback.respond(companion, input, context);
    }
  }
}

export function createConfiguredCompanionGateway(env: Record<string, string | undefined> = process.env): CompanionGateway {
  if (!companionProviderConfigured(env)) return new DemoCompanionGateway();
  return new ProviderBackedCompanionGateway(new OpenAICompatibleCompanionGateway(companionProviderConfigFromEnv(env)));
}
