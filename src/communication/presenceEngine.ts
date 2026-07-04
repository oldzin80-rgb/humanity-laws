import type {
  ApprovedContextFeedHook,
  CommunicationIntent,
  CompanionParticipant,
  CompanionVoiceProfile,
  EmotionalTone,
  PresenceContext,
  UnifiedCompanionRequest,
} from "./types.js";

export const aiDisclosure = "AI companion; not a real person; human final judgment remains central.";

export const companionVoiceProfiles: Record<CompanionParticipant, CompanionVoiceProfile> = {
  Adam: {
    companion: "Adam",
    qualities: ["calm", "steady", "grounded", "protective", "practical", "truth-oriented"],
    bestFor: ["decisions", "discipline", "responsibility", "structure", "clear next steps"],
    avoid: ["drama", "dependency", "fake certainty", "overexplaining"],
  },
  Eve: {
    companion: "Eve",
    qualities: ["warm", "perceptive", "emotionally intelligent", "encouraging", "relational", "reflective"],
    bestFor: ["feelings", "connection", "meaning", "restoration", "gentle reflection"],
    avoid: ["pressure", "shame", "fake intimacy", "overpromising"],
  },
  AdamEve: {
    companion: "AdamEve",
    qualities: ["balanced", "truthful", "relational", "clear", "careful"],
    bestFor: ["important choices", "tension", "integration", "discernment"],
    avoid: ["fake certainty", "dependency", "replacing human judgment", "overwhelming detail"],
  },
  Council: {
    companion: "Council",
    qualities: ["special", "calm", "balanced", "principled", "concise"],
    bestFor: ["meaningful decisions", "deeper reflection", "multiple perspectives", "human final choice"],
    avoid: ["spectacle", "dependency", "fake certainty", "authority overreach", "long lectures", "false final answers"],
  },
};

export const approvedContextFeedHooks: ApprovedContextFeedHook[] = [
  { kind: "founder_update", enabled: false, consentRequired: false, providerConfigured: false, description: "Future approved Founder updates." },
  { kind: "podcast_update", enabled: false, consentRequired: false, providerConfigured: false, description: "Future latest podcast context." },
  { kind: "spark_history", enabled: false, consentRequired: true, providerConfigured: false, description: "Future member Spark history with consent." },
  { kind: "saved_library_item", enabled: false, consentRequired: true, providerConfigured: false, description: "Future saved Library items with consent." },
  { kind: "wellness_note", enabled: false, consentRequired: true, providerConfigured: false, description: "Future wellness notes with consent." },
  { kind: "member_preference", enabled: false, consentRequired: true, providerConfigured: false, description: "Future member preferences with consent." },
  { kind: "humanity_laws_source_reference", enabled: false, consentRequired: false, providerConfigured: false, description: "Future approved Humanity Laws references." },
  { kind: "future_approved_knowledge_feed", enabled: false, consentRequired: true, providerConfigured: false, description: "Future reviewed knowledge feeds only after approval." },
];

export function detectCommunicationIntent(input: string, fallback: CommunicationIntent): CommunicationIntent {
  const lower = input.toLowerCase();
  if (/(suicide|self[- ]?harm|kill myself|hurt myself|violence|emergency|immediate danger)/.test(lower)) return "crisis_escalation_boundary";
  if (/(council|both adam and eve|two perspectives|decision)/.test(lower)) return "decision_support";
  if (/(spark|daily practice|prompt)/.test(lower)) return "spark_discussion";
  if (/(book|chapter|law|quote|read)/.test(lower)) return "book_discussion";
  if (/(wellness|sleep|stress|habit|movement|nutrition|breath|health)/.test(lower)) return "wellness_support";
  if (/(table|meal|family|friend|community|connection|recipe)/.test(lower)) return "table_community_connection";
  if (/(encourage|hope|keep going|support)/.test(lower)) return "encouragement";
  if (/(what should i do|choose|next step|responsib|discipline|structure)/.test(lower)) return "decision_support";
  return fallback;
}

export function detectEmotionalTone(input: string): EmotionalTone {
  const lower = input.toLowerCase();
  if (/(urgent|right now|emergency|panic|immediate)/.test(lower)) return "urgent";
  if (/(sad|grief|lost|heavy|hurt|afraid|anxious|overwhelmed)/.test(lower)) return "heavy";
  if (/(confused|uncertain|stuck|don't know|unsure)/.test(lower)) return "uncertain";
  if (/(grateful|hope|excited|better|progress)/.test(lower)) return "hopeful";
  if (/(calm|peace|steady)/.test(lower)) return "calm";
  return "neutral";
}

export function createPresenceContext(request: UnifiedCompanionRequest): PresenceContext {
  const detectedIntent = detectCommunicationIntent(request.message, request.intent);
  const emotionalTone = detectEmotionalTone(request.message);
  return {
    detectedIntent,
    emotionalTone,
    warmth: request.companion === "Eve" || emotionalTone === "heavy" ? "gentle" : "steady",
    clarity: request.companion === "Council" || request.companion === "AdamEve" ? "structured" : "brief",
    memoryStatus: request.consentToRemember ? "consented_context_available" : "no_long_term_memory_implied",
  };
}

function coreIssueFor(intent: CommunicationIntent): string {
  if (intent === "decision_support") return "there is a choice asking for truth and responsibility";
  if (intent === "spark_discussion") return "today's Spark is asking for one honest reflection";
  if (intent === "book_discussion") return "the source deserves to stay close to the conversation";
  if (intent === "wellness_support") return "your wellbeing needs care without turning this into medical advice";
  if (intent === "table_community_connection") return "connection grows through small acts of hospitality";
  if (intent === "encouragement") return "you need steadiness without pressure";
  if (intent === "crisis_escalation_boundary") return "this may need immediate qualified human support";
  return "something in this moment deserves slower, honest attention";
}

function insightFor(companion: "Adam" | "Eve", intent: CommunicationIntent): string {
  if (companion === "Adam") {
    if (intent === "decision_support") return "clarity usually begins by naming the next responsible action, not the entire future";
    if (intent === "wellness_support") return "a sound mind is helped by one grounded habit repeated honestly";
    if (intent === "book_discussion") return "truth gets stronger when you return to the source before reacting";
    return "the next step should be small enough to do and honest enough to matter";
  }
  if (intent === "decision_support") return "a wise choice protects both truth and the person living through it";
  if (intent === "wellness_support") return "care works best when it is gentle, consistent, and not used as self-judgment";
  if (intent === "table_community_connection") return "connection often begins with a simple invitation, meal, or word of gratitude";
  return "what you feel matters, and it can be held without letting it make the whole decision";
}

function nextStepFor(companion: "Adam" | "Eve", intent: CommunicationIntent): string {
  if (intent === "crisis_escalation_boundary") return "pause here and contact qualified human help or local emergency support now";
  if (companion === "Adam") return "write one next action you can take in the next ten minutes";
  if (intent === "table_community_connection") return "name one person you could encourage or welcome";
  return "take one quiet minute and name what needs care before you act";
}

export function shapeCompanionMessage(companion: "Adam" | "Eve", request: UnifiedCompanionRequest, presence: PresenceContext): string {
  const memoryLine = request.consentToRemember
    ? "With your consent, saved context can support the tone of this conversation."
    : "I will not treat this as long-term memory without your consent.";
  const coreIssue = coreIssueFor(presence.detectedIntent);
  const insight = insightFor(companion, presence.detectedIntent);
  const nextStep = nextStepFor(companion, presence.detectedIntent);
  if (companion === "Adam") {
    return `Adam: I am an AI companion. Not a real person. I hear you: ${coreIssue}. ${insight}. Next step: ${nextStep}. ${memoryLine}`;
  }
  return `Eve: I am an AI companion. Not a real person. I’m with the feeling of this: ${coreIssue}. ${insight}. Next step: ${nextStep}. ${memoryLine}`;
}

export function buildRelevantNextSteps(request: UnifiedCompanionRequest, presence: PresenceContext): string[] {
  const steps: string[] = [];
  if (presence.detectedIntent === "spark_discussion") steps.push("Reflect on Spark", "Save insight");
  else if (presence.detectedIntent === "book_discussion") steps.push("Continue Reading", "Add to Library");
  else if (presence.detectedIntent === "wellness_support") steps.push("Continue conversation", "Save insight");
  else if (presence.detectedIntent === "table_community_connection") steps.push("Continue conversation", "Save insight");
  else if (request.companion === "Council" || request.companion === "AdamEve" || request.channel === "council_session") steps.push("Save insight", "Continue conversation");
  else steps.push("Continue conversation", "Save insight");

  if (request.companion !== "Council" && request.companion !== "AdamEve") steps.push("Open Council");
  return Array.from(new Set(steps)).slice(0, 3);
}

export function shapeCouncilMessage(adamPerspective: string, evePerspective: string, principle: string): string {
  return [
    "Council: Adam and Eve are AI companions, not real people.",
    `Adam sees: ${adamPerspective}`,
    `Eve sees: ${evePerspective}`,
    `Humanity Laws principle: ${principle}`,
    "Your choice: you remain the final decision-maker.",
    "Next step: choose one honest action and one caring action.",
  ].join("\n");
}
