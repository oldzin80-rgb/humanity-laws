import type { CompanionGateway, CompanionResponse } from "./types.js";
import { createMergedHumanityLawsRuntime } from "../runtime/mergedHumanityLaws.js";

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
    };
  }
}
