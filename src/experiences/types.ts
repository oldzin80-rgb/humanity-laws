export interface MemoryRecord { memoryId: string; memberId: string; content: string; tags: string[]; createdAt: string; consentToRemember: boolean }
export interface SparkRecord { sparkId: string; memberId: string; pillar: string; prompt: string; createdAt: string }
export interface ConversationRecord { conversationId: string; memberId: string; input: string; adam: string; eve: string; synthesis: string; createdAt: string }
export type CompanionResponseOrigin = "provider" | "demo_fallback" | "emergency_fallback";
export interface CompanionGatewayContext {
  memberId?: string;
  conversationHistory?: Array<{ companion: string; input?: string; message?: string; createdAt?: string }>;
  sourceContext?: string;
  companionOperatingSystem?: {
    mode: "Adam" | "Eve" | "Council";
    systemPrompt: string;
    activeLayers: readonly string[];
    launchStandard: string;
    qualityGates: readonly string[];
  };
  intent?: string;
  consentToRemember?: boolean;
  safetyBoundary?: {
    triggered: boolean;
    reason?: string;
    recommendedAction?: string;
  };
}
export interface CompanionResponse {
  companion: "Adam" | "Eve";
  message: string;
  transparency: "AI_TRANSPARENT";
  humanSovereigntyReminder: string;
  sourceSummary?: string;
  responseOrigin?: CompanionResponseOrigin;
  providerName?: string;
  model?: string;
}
export interface CouncilResponse {
  adam: CompanionResponse;
  eve: CompanionResponse;
  synthesis: string;
  record: ConversationRecord;
  professionalBoundary?: {
    domain: string;
    riskLevel: string;
    responsePosture: string;
    escalation: readonly string[];
  };
  sourceSummary?: string;
  memory?: {
    remembered: boolean;
    consentRequired: boolean;
    memoryId?: string;
  };
}
export interface CompanionGateway { respond(companion: "Adam" | "Eve", input: string, context?: CompanionGatewayContext): Promise<CompanionResponse> }
