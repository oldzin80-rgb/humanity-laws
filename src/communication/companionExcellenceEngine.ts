import type {
  CompanionExcellenceContext,
  ConversationQualityReviewHook,
  HumanNeed,
  LifeStageSupport,
  PresenceContext,
  UnifiedCompanionRequest,
} from "./types.js";

const allNeeds: Array<readonly [HumanNeed, RegExp]> = [
  ["grief", /(grief|grieving|loss|lost someone|funeral|mourning)/i],
  ["parenting", /(parent|child|kid|teen|daughter|son|family)/i],
  ["relationships", /(relationship|marriage|friend|partner|conflict|repair)/i],
  ["career", /(career|job|work|business|boss|interview)/i],
  ["learning", /(learn|study|school|class|skill|practice)/i],
  ["discipline", /(discipline|habit|routine|structure|consistent)/i],
  ["wellness", /(wellness|sleep|stress|movement|nutrition|health|breath)/i],
  ["purpose", /(purpose|meaning|calling|why am i here|direction)/i],
  ["forgiveness", /(forgive|forgiveness|resentment|apology)/i],
  ["legacy", /(legacy|elder|retire|retirement|what i leave|estate)/i],
  ["belonging", /(belong|lonely|alone|community|included)/i],
  ["spiritual_reflection", /(god|faith|pray|spiritual|soul|scripture)/i],
  ["decision_support", /(decision|choose|choice|should i|what should)/i],
  ["encouragement", /(encourage|hope|keep going|tired|discouraged)/i],
  ["growth", /(grow|growth|better|change|become)/i],
  ["practical_next_steps", /(next step|what do i do|plan|action)/i],
];

export function inferLifeStageSupport(input: string): LifeStageSupport {
  const lower = input.toLowerCase();
  if (/(my child|as a child|kid|elementary)/.test(lower)) return "child";
  if (/(teen|teenager|high school)/.test(lower)) return "teenager";
  if (/(college|young adult|starting out|first job)/.test(lower)) return "young_adult";
  if (/(as a parent|my son|my daughter|parenting)/.test(lower)) return "parent";
  if (/(elder|older|retirement|grandparent)/.test(lower)) return "elder";
  if (/(caregiver|caring for|caretaker)/.test(lower)) return "caregiver";
  if (/(grief|grieving|loss|mourning|lost someone)/.test(lower)) return "grieving_person";
  if (/(purpose|meaning|calling|direction)/.test(lower)) return "person_seeking_purpose";
  if (/(stress|overwhelmed|burned out|panic|pressure)/.test(lower)) return "person_under_stress";
  if (/(adult|work|marriage|mortgage|responsibility)/.test(lower)) return "adult";
  return "unspecified";
}

export function categorizeHumanNeeds(input: string, fallback: HumanNeed = "reflection"): HumanNeed[] {
  const found = allNeeds.filter(([, pattern]) => pattern.test(input)).map(([need]) => need);
  const needs = found.length ? found : [fallback];
  if (!needs.includes("practical_next_steps")) needs.push("practical_next_steps");
  return Array.from(new Set(needs)).slice(0, 4);
}

function primaryNeed(needs: HumanNeed[]): HumanNeed {
  return needs[0] ?? "reflection";
}

function nextStepForNeed(need: HumanNeed): string {
  if (need === "grief") return "name one person who can sit with you or check on you today";
  if (need === "parenting") return "choose one calm sentence before you correct or advise";
  if (need === "relationships") return "name what needs repair before deciding what needs to be said";
  if (need === "career") return "write the next concrete work step, not the whole career path";
  if (need === "wellness") return "choose one gentle practice that supports your body without making medical claims";
  if (need === "purpose") return "write one small act that aligns with what matters most";
  if (need === "forgiveness") return "separate forgiveness, safety, and reconciliation before acting";
  if (need === "legacy") return "name one value you want to leave clearer than you found it";
  if (need === "belonging") return "reach toward one safe person or place of connection";
  if (need === "spiritual_reflection") return "hold the question with humility, truth, and love before rushing an answer";
  return "choose one honest, small next step you can take today";
}

export function createCompanionExcellenceContext(request: UnifiedCompanionRequest, presence: PresenceContext): CompanionExcellenceContext {
  const humanNeeds = categorizeHumanNeeds(request.message);
  const lifeStage = inferLifeStageSupport(request.message);
  const need = primaryNeed(humanNeeds);
  const nextStep = nextStepForNeed(need);
  return {
    warmth: request.companion === "Eve" || presence.emotionalTone === "heavy" ? "high" : "steady",
    clarity: request.companion === "Council" || request.companion === "AdamEve" ? "structured" : "simple",
    brevity: "brief",
    helpfulness: "next_step_focused",
    humility: true,
    humanDignity: true,
    lifeStage,
    humanNeeds,
    loveInAction: {
      acknowledge: "You are being met with attention, not judgment.",
      understand: `The visible need appears to include ${need.replaceAll("_", " ")}.`,
      clarify: "Keep the center simple and truthful.",
      encourage: "You are still capable of one faithful next step.",
      guide: "Move gently, clearly, and without giving your agency away.",
      preserveAgency: "Adam and Eve can support reflection; they do not choose for you.",
      nextStep,
    },
  };
}

export function createConversationQualityReviewHook(
  excellence: CompanionExcellenceContext,
  request: UnifiedCompanionRequest,
  escalationNeeded: boolean,
): ConversationQualityReviewHook {
  return {
    savedInsight: request.saveInsight,
    escalationNeeded,
    topicCategory: primaryNeed(excellence.humanNeeds),
    unresolvedNeed: escalationNeeded ? primaryNeed(excellence.humanNeeds) : undefined,
    userNextStepSuccess: "unknown",
    invasiveAnalytics: false,
  };
}

export function excellenceLine(excellence: CompanionExcellenceContext): string {
  return `${excellence.loveInAction.acknowledge} ${excellence.loveInAction.preserveAgency} One meaningful next step: ${excellence.loveInAction.nextStep}.`;
}
