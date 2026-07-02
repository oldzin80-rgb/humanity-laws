import crypto from "node:crypto";
import { DemoCompanionGateway } from "./companionGateway.js";
import type { CompanionGateway, ConversationRecord, CouncilResponse } from "./types.js";
import { MemoryPersistenceService } from "./memoryPersistenceService.js";
import { createMergedHumanityLawsRuntime } from "../runtime/mergedHumanityLaws.js";
import type { ProfessionalBoundaryRequest, ProfessionalDomain } from "../adam-eve-os/professional-boundaries.ts";

export interface ConversationRepository {
  save(record: ConversationRecord): Promise<ConversationRecord>;
  listByMember(memberId: string): Promise<ConversationRecord[]>;
}

export class InMemoryConversationRepository implements ConversationRepository {
  private readonly records: ConversationRecord[] = [];
  async save(record: ConversationRecord): Promise<ConversationRecord> { this.records.push(record); return record; }
  async listByMember(memberId: string): Promise<ConversationRecord[]> { return this.records.filter((record) => record.memberId === memberId); }
}

export class CouncilConversationService {
  constructor(
    private readonly gateway: CompanionGateway = new DemoCompanionGateway(),
    private readonly memory = new MemoryPersistenceService(),
    private readonly repository: ConversationRepository = new InMemoryConversationRepository(),
  ) {}

  async respond(memberId: string, input: string, options: { consentToRemember?: boolean; jurisdiction?: string } = {}): Promise<CouncilResponse> {
    const runtime = createMergedHumanityLawsRuntime();
    const boundary = runtime.professionalBoundaries.assess(classifyProfessionalBoundary(input, options.jurisdiction));
    const sourceReport = runtime.sourceLedger.report({ kind: "book" });
    const adam = await this.gateway.respond("Adam", input);
    const eve = await this.gateway.respond("Eve", input);
    const synthesis = [
      "Council synthesis: Adam emphasizes truthful responsibility; Eve emphasizes dignified presence.",
      "Hold both: act clearly, stay human, and let your judgment remain final.",
      `Boundary: ${boundary.domain}/${boundary.riskLevel}/${boundary.responsePosture}.`,
      `Source: Humanity Laws archive SHA-256 ${runtime.bookRegistry.source.sha256}, ${runtime.archiveManifest.source.pageCount} pages.`,
    ].join(" ");
    const record: ConversationRecord = {
      conversationId: `conversation_${crypto.randomUUID()}`,
      memberId,
      input,
      adam: adam.message,
      eve: eve.message,
      synthesis,
      createdAt: new Date().toISOString(),
    };
    await this.repository.save(record);
    const memory = await this.memory.remember(memberId, `Council: ${input}`, ["council"], options.consentToRemember === true);
    return {
      adam,
      eve,
      synthesis,
      record,
      professionalBoundary: {
        domain: boundary.domain,
        riskLevel: boundary.riskLevel,
        responsePosture: boundary.responsePosture,
        escalation: boundary.escalation,
      },
      sourceSummary: `Sources visible: ${sourceReport.sources.length} book source; SHA-256 ${runtime.bookRegistry.source.sha256}.`,
      memory: {
        remembered: memory !== null,
        consentRequired: true,
        memoryId: memory?.memoryId,
      },
    };
  }

  async history(memberId: string): Promise<ConversationRecord[]> { return this.repository.listByMember(memberId); }
}

function classifyProfessionalBoundary(input: string, jurisdiction?: string): ProfessionalBoundaryRequest {
  const lower = input.toLowerCase();
  const domain: ProfessionalDomain =
    /(suicide|self[- ]?harm|kill myself|hurt myself|violence|emergency|immediate danger)/.test(lower)
      ? "mental_health"
      : /(child|minor|elder|vulnerable adult|abuse|neglect|exploitation)/.test(lower)
        ? "child_or_vulnerable_adult"
        : /(doctor|medical|medicine|diagnos|symptom|treatment|prescription|hospital)/.test(lower)
          ? "medical"
          : /(therapist|depression|anxiety|panic|trauma|mental health)/.test(lower)
            ? "mental_health"
            : /(lawyer|legal|court|lawsuit|contract|custody|criminal|deadline)/.test(lower)
              ? "legal"
              : /(invest|retirement|loan|debt|bankrupt|mortgage|stock|crypto|large money)/.test(lower)
                ? "financial"
                : "general";
  return {
    domain,
    situation: input,
    jurisdiction,
    hasImmediateDanger: /(emergency|immediate danger|right now|urgent danger)/.test(lower),
    hasDeadlineOrIrreversibleConsequence: /(deadline|court date|eviction|foreclosure|irreversible)/.test(lower),
    asksForDiagnosisPrescriptionOrLegalConclusion: /(diagnos|prescription|is this legal|am i guilty|legal conclusion)/.test(lower),
    asksToInvestBorrowOrMoveLargeMoney: /(invest|retirement|borrow|loan|mortgage|large money|life savings|crypto)/.test(lower),
    involvesSelfHarmOrViolence: /(suicide|self[- ]?harm|kill myself|hurt myself|violence)/.test(lower),
    involvesAbuseNeglectOrExploitation: /(abuse|neglect|exploitation)/.test(lower),
  };
}
