import crypto from "node:crypto";

export type SparkPrimaryMode =
  | "morning_spark"
  | "evening_reflection"
  | "discovery_mode"
  | "circle_mode"
  | "table_mode"
  | "council_mode"
  | "book_mode"
  | "founder_podcast_mode";

export type SparkSupportingMode =
  | "adam_mode"
  | "eve_mode"
  | "council"
  | "book"
  | "table"
  | "wellness"
  | "library"
  | "podcast";

export type SparkMode = SparkPrimaryMode | SparkSupportingMode;

export type SparkInteractionState =
  | "idle"
  | "preparing"
  | "spinning"
  | "rolling"
  | "pausing"
  | "revealing"
  | "reflected"
  | "saved"
  | "unavailable";

export type SparkCategory =
  | "humanity_laws_principles"
  | "modern_life"
  | "relationships"
  | "parenting"
  | "leadership"
  | "creativity"
  | "discipline"
  | "responsibility"
  | "gratitude"
  | "wonder"
  | "service"
  | "philosophy"
  | "psychology"
  | "history"
  | "science"
  | "wellness"
  | "community"
  | "legacy"
  | "current_events_readiness";

export type SparkFutureNotificationType =
  | "morning_spark"
  | "evening_reflection"
  | "circle_invite"
  | "founder_spark_episode"
  | "table_spark"
  | "saved_spark_reminder";

export type SparkGroupMode = "solo_spark" | "shared_circle_spark" | "table_spark" | "community_spark" | "founder_podcast_spark";

export interface SparkModeDefinition {
  mode: SparkPrimaryMode;
  label: string;
  purpose: string;
  tone: string;
  actions: readonly string[];
  creatorOnly: boolean;
}

export interface SparkModeSelection {
  primaryMode: SparkPrimaryMode;
  supportingModes: SparkSupportingMode[];
  simplified: boolean;
  message?: string;
}

export interface SparkWheelState {
  state: SparkInteractionState;
  categories: SparkCategory[];
  selectedCategory: SparkCategory;
  animation: {
    providerReady: boolean;
    reducedMotionFallback: boolean;
    description: string;
  };
}

export interface SparkDiceState {
  state: SparkInteractionState;
  value: 1 | 2 | 3 | 4 | 5 | 6;
  influence: "depth" | "tone" | "variation";
  reducedMotionFallback: boolean;
}

export interface SparkPersonalizationHints {
  consent: boolean;
  preferredDepth?: "light" | "balanced" | "deep";
  preferredTone?: "calm" | "curious" | "practical" | "restorative";
  recentRoomsVisited?: string[];
  applied: boolean;
  note: string;
}

export interface SparkReveal {
  sparkId: string;
  mode: SparkPrimaryMode;
  supportingModes: SparkSupportingMode[];
  category: SparkCategory;
  title: string;
  shortReflection: string;
  primaryQuestion: string;
  practicalAction: string;
  relatedHumanityLawsPrinciple: string;
  relatedRoomConnections: string[];
  suggestedNextSteps: string[];
  saveReadyMetadata: {
    saveable: boolean;
    storage: "local_ready" | "server_ready_when_configured";
    historyPreferred: boolean;
  };
}

export interface SavedSparkRecord {
  sparkId: string;
  memberId: string;
  mode: SparkPrimaryMode;
  category: SparkCategory;
  prompt: string;
  userReflection?: string;
  practicalActionCompleted: boolean;
  consentAwarePersonalizationHints?: SparkPersonalizationHints;
  createdAt: string;
}

export interface SparkNotificationReadiness {
  type: SparkFutureNotificationType;
  configured: false;
  placeholderOnly: true;
  message: string;
}

export interface SparkGroupReadiness {
  mode: SparkGroupMode;
  liveParticipants: false;
  placeholderOnly: true;
  message: string;
}

export interface MasterSparkExperience {
  selection: SparkModeSelection;
  wheel: SparkWheelState;
  dice: SparkDiceState;
  reveal: SparkReveal;
  personalization: SparkPersonalizationHints;
  notifications: SparkNotificationReadiness[];
  groups: SparkGroupReadiness[];
  founderMode: {
    requested: boolean;
    creatorOnly: true;
    accessible: boolean;
    status: "available_to_creator" | "role_ready_placeholder" | "denied_for_member";
    message: string;
  };
  uncontrolledFeedsConnected: false;
  fakeLiveActivityShown: false;
}

export const SparkModeDefinitions: readonly SparkModeDefinition[] = [
  { mode: "morning_spark", label: "Morning Spark", purpose: "Start the day with one meaningful reflection.", tone: "Warm, calm, fresh start.", actions: ["Begin Morning Spark", "Talk with Adam", "Talk with Eve", "Save to Library"], creatorOnly: false },
  { mode: "evening_reflection", label: "Evening Reflection", purpose: "Close the day with gratitude, reflection, and clarity.", tone: "Soft, calm, restorative.", actions: ["Begin Evening Reflection", "Save reflection", "Talk with Eve", "Add to Library"], creatorOnly: false },
  { mode: "discovery_mode", label: "Discovery Mode", purpose: "Reveal a meaningful topic with elegant surprise.", tone: "Curious, elegant, playful.", actions: ["Spin again later", "Reflect with Adam", "Reflect with Eve", "Save to Library"], creatorOnly: false },
  { mode: "circle_mode", label: "Circle Mode", purpose: "Support families, friends, book clubs, and teams.", tone: "Shared reflection and belonging.", actions: ["Start Circle Spark", "Discuss together", "Save group reflection", "Visit The Table"], creatorOnly: false },
  { mode: "table_mode", label: "Table Mode", purpose: "Turn dinner, gratitude, and hospitality into reflection.", tone: "Warm, human, relational.", actions: ["Bring to The Table", "Start gratitude prompt", "Save table memory", "Discuss with Adam & Eve"], creatorOnly: false },
  { mode: "council_mode", label: "Council Mode", purpose: "Turn a Spark into deeper perspective.", tone: "Calm, thoughtful, balanced.", actions: ["Open Council", "Ask Adam", "Ask Eve", "Save outcome"], creatorOnly: false },
  { mode: "book_mode", label: "Book Mode", purpose: "Connect the Spark to Humanity Laws source principles.", tone: "Grounded, study-like, timeless.", actions: ["Read related chapter", "Discuss chapter", "Save passage", "Continue Reading"], creatorOnly: false },
  { mode: "founder_podcast_mode", label: "Founder Podcast Mode", purpose: "Creator-only Spark reveal for future podcast episodes.", tone: "Signature founder ritual, thoughtful, conversational.", actions: ["Start Founder Spark", "Generate episode prompt", "Save episode Spark", "Link to Podcast"], creatorOnly: true },
] as const;

const categories: SparkCategory[] = [
  "humanity_laws_principles",
  "modern_life",
  "relationships",
  "parenting",
  "leadership",
  "creativity",
  "discipline",
  "responsibility",
  "gratitude",
  "wonder",
  "service",
  "philosophy",
  "psychology",
  "history",
  "science",
  "wellness",
  "community",
  "legacy",
  "current_events_readiness",
];

const contentByCategory: Record<SparkCategory, Omit<SparkReveal, "sparkId" | "mode" | "supportingModes" | "category" | "relatedRoomConnections" | "suggestedNextSteps" | "saveReadyMetadata">> = {
  humanity_laws_principles: {
    title: "Return to the source",
    shortReflection: "Truth becomes easier to carry when it becomes one honest action.",
    primaryQuestion: "What principle needs to become visible in your next choice?",
    practicalAction: "Read one paragraph, then write one sentence you can live today.",
    relatedHumanityLawsPrinciple: "Truth before reaction.",
  },
  modern_life: {
    title: "Simplify the noise",
    shortReflection: "Modern life asks for speed; wisdom asks for attention.",
    primaryQuestion: "What noise can you lower so truth can be heard?",
    practicalAction: "Turn one distraction off for ten minutes.",
    relatedHumanityLawsPrinciple: "Attention is stewardship.",
  },
  relationships: {
    title: "Repair begins small",
    shortReflection: "A relationship often changes when one person chooses clarity without contempt.",
    primaryQuestion: "What would be honest and kind to say next?",
    practicalAction: "Write one sentence that names care before correction.",
    relatedHumanityLawsPrinciple: "Dignity before winning.",
  },
  parenting: {
    title: "Guide without crushing",
    shortReflection: "A child needs correction that still protects dignity.",
    primaryQuestion: "What does the young person need: structure, comfort, or clarity?",
    practicalAction: "Choose one calm sentence before giving direction.",
    relatedHumanityLawsPrinciple: "Strength protects dignity.",
  },
  leadership: {
    title: "Lead with responsibility",
    shortReflection: "Leadership becomes trustworthy when it carries weight without needing applause.",
    primaryQuestion: "What responsibility is yours to carry clearly today?",
    practicalAction: "Name one decision you can make simpler for someone else.",
    relatedHumanityLawsPrinciple: "Authority is service.",
  },
  creativity: {
    title: "Make the honest thing",
    shortReflection: "Creativity becomes powerful when beauty serves truth.",
    primaryQuestion: "What wants to be made without pretending to be perfect?",
    practicalAction: "Give one unfinished idea twenty focused minutes.",
    relatedHumanityLawsPrinciple: "Beauty should serve meaning.",
  },
  discipline: {
    title: "One faithful repetition",
    shortReflection: "Discipline is not drama; it is care repeated.",
    primaryQuestion: "What small practice would make you more free?",
    practicalAction: "Do the smallest repeatable version today.",
    relatedHumanityLawsPrinciple: "Faithfulness is practiced.",
  },
  responsibility: {
    title: "Carry what is yours",
    shortReflection: "Peace often starts when responsibility becomes specific.",
    primaryQuestion: "What is yours to own without owning what is not yours?",
    practicalAction: "Write one responsibility and one boundary.",
    relatedHumanityLawsPrinciple: "Responsibility without control.",
  },
  gratitude: {
    title: "Notice the gift",
    shortReflection: "Gratitude does not deny difficulty; it keeps the heart from becoming blind.",
    primaryQuestion: "What good thing deserves to be noticed before the day moves on?",
    practicalAction: "Name one person, place, or moment you can thank.",
    relatedHumanityLawsPrinciple: "Gratitude restores sight.",
  },
  wonder: {
    title: "Let awe interrupt hurry",
    shortReflection: "Wonder gives the soul room to breathe.",
    primaryQuestion: "What is one ordinary thing that is more mysterious than you remembered?",
    practicalAction: "Pause for one minute and look closely at something living.",
    relatedHumanityLawsPrinciple: "Mystery invites humility.",
  },
  service: {
    title: "Help without needing credit",
    shortReflection: "Service is love made practical.",
    primaryQuestion: "Who could be helped by one quiet act?",
    practicalAction: "Do one useful thing without announcing it.",
    relatedHumanityLawsPrinciple: "Love becomes action.",
  },
  philosophy: {
    title: "Ask the better question",
    shortReflection: "A better question can make a better life possible.",
    primaryQuestion: "What question would make this moment more truthful?",
    practicalAction: "Replace one rushed conclusion with one honest question.",
    relatedHumanityLawsPrinciple: "Truth begins with humility.",
  },
  psychology: {
    title: "Name the pattern",
    shortReflection: "A pattern loses power when it is seen clearly and held kindly.",
    primaryQuestion: "What pattern is asking for attention, not shame?",
    practicalAction: "Write the trigger, the feeling, and one healthier response.",
    relatedHumanityLawsPrinciple: "Awareness before reaction.",
  },
  history: {
    title: "Learn from what endured",
    shortReflection: "History teaches when we listen without using it as a weapon.",
    primaryQuestion: "What old lesson might help this present choice?",
    practicalAction: "Find one example worth learning from before deciding.",
    relatedHumanityLawsPrinciple: "Wisdom has memory.",
  },
  science: {
    title: "Stay curious and honest",
    shortReflection: "Good knowledge respects evidence and remains humble about what is unknown.",
    primaryQuestion: "What do you know, and what still needs evidence?",
    practicalAction: "Separate one fact, one assumption, and one question.",
    relatedHumanityLawsPrinciple: "Evidence protects truth.",
  },
  wellness: {
    title: "Care for the vessel",
    shortReflection: "Wellness begins with stewardship, not self-judgment.",
    primaryQuestion: "What would help your body or mind recover today?",
    practicalAction: "Choose water, breath, movement, rest, or a short reflection.",
    relatedHumanityLawsPrinciple: "Care is stewardship.",
  },
  community: {
    title: "Belonging needs invitation",
    shortReflection: "Community begins when someone makes room.",
    primaryQuestion: "Who could feel more welcomed because of you?",
    practicalAction: "Send one generous invitation or word of encouragement.",
    relatedHumanityLawsPrinciple: "Hospitality creates belonging.",
  },
  legacy: {
    title: "Leave one thing clearer",
    shortReflection: "Legacy is built in ordinary choices before it is remembered in big ones.",
    primaryQuestion: "What value do you want your life to make easier for someone else?",
    practicalAction: "Write one value and one action that protects it.",
    relatedHumanityLawsPrinciple: "The future receives today's stewardship.",
  },
  current_events_readiness: {
    title: "Respond, do not react",
    shortReflection: "Current events require truth, patience, and proportion before action.",
    primaryQuestion: "What would a truthful response look like before emotion takes over?",
    practicalAction: "Check the source, pause, then choose one constructive response.",
    relatedHumanityLawsPrinciple: "Truth before reaction.",
  },
};

export function canAccessFounderSparkMode(roles: readonly string[] = []): boolean {
  return roles.includes("FOUNDER") || roles.includes("ADMIN");
}

export function selectSparkModes(params: {
  primaryMode?: SparkPrimaryMode;
  supportingModes?: SparkSupportingMode[];
  roles?: readonly string[];
} = {}): SparkModeSelection {
  const primaryMode = params.primaryMode ?? "morning_spark";
  const founderRequested = primaryMode === "founder_podcast_mode";
  const founderAllowed = !founderRequested || canAccessFounderSparkMode(params.roles);
  const safePrimary = founderAllowed ? primaryMode : "discovery_mode";
  const uniqueSupports = Array.from(new Set(params.supportingModes ?? []));
  const limitedSupports = uniqueSupports.slice(0, 2);
  const tooMany = uniqueSupports.length > 2;
  return {
    primaryMode: safePrimary,
    supportingModes: limitedSupports,
    simplified: tooMany || !founderAllowed,
    message: tooMany
      ? "Let’s keep this focused. Choose one main mode and up to two supports."
      : !founderAllowed
        ? "Founder Podcast Mode is creator-only. Discovery Mode is shown instead."
        : undefined,
  };
}

function indexFromSeed(seed: string, size: number): number {
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  return Number.parseInt(hash.slice(0, 8), 16) % size;
}

function selectCategory(selection: SparkModeSelection, history: readonly SavedSparkRecord[] = []): SparkCategory {
  const preferred: SparkCategory[] = [];
  if (selection.primaryMode === "book_mode" || selection.supportingModes.includes("book")) preferred.push("humanity_laws_principles", "philosophy");
  if (selection.primaryMode === "table_mode" || selection.supportingModes.includes("table")) preferred.push("gratitude", "community", "relationships");
  if (selection.primaryMode === "council_mode" || selection.supportingModes.includes("council")) preferred.push("responsibility", "relationships");
  if (selection.primaryMode === "evening_reflection") preferred.push("gratitude", "wonder", "wellness");
  if (selection.primaryMode === "circle_mode") preferred.push("community", "relationships");
  if (selection.primaryMode === "founder_podcast_mode" || selection.supportingModes.includes("podcast")) preferred.push("legacy", "humanity_laws_principles", "modern_life");
  if (selection.supportingModes.includes("wellness")) preferred.push("wellness");
  const pool = Array.from(new Set([...preferred, ...categories]));
  const used = new Set(history.map((item) => item.category));
  const available = pool.filter((category) => !used.has(category));
  return (available.length ? available : pool)[0] ?? "humanity_laws_principles";
}

function modeNextSteps(selection: SparkModeSelection, category: SparkCategory): string[] {
  const steps: string[] = [];
  if (selection.supportingModes.includes("adam_mode")) steps.push("Talk with Adam");
  if (selection.supportingModes.includes("eve_mode")) steps.push("Talk with Eve");
  if (selection.primaryMode === "book_mode" || selection.supportingModes.includes("book") || category === "humanity_laws_principles") steps.push("Continue Reading");
  if (selection.primaryMode === "table_mode" || selection.supportingModes.includes("table") || category === "gratitude" || category === "community") steps.push("Visit The Table");
  if (selection.primaryMode === "council_mode" || selection.supportingModes.includes("council") || category === "responsibility") steps.push("Open Council");
  if (!steps.length) steps.push("Talk with Adam", "Talk with Eve");
  steps.push("Save to Library");
  return Array.from(new Set(steps)).slice(0, 3);
}

function roomConnections(selection: SparkModeSelection, category: SparkCategory): string[] {
  const rooms = ["Living Library"];
  if (category === "humanity_laws_principles" || selection.primaryMode === "book_mode") rooms.push("Book");
  if (selection.supportingModes.includes("adam_mode")) rooms.push("Adam");
  if (selection.supportingModes.includes("eve_mode")) rooms.push("Eve");
  if (selection.primaryMode === "council_mode" || selection.supportingModes.includes("council")) rooms.push("Council");
  if (selection.primaryMode === "table_mode" || selection.primaryMode === "circle_mode" || selection.supportingModes.includes("table")) rooms.push("The Table");
  if (category === "wellness" || selection.supportingModes.includes("wellness")) rooms.push("Wellness");
  if (selection.primaryMode === "founder_podcast_mode" || selection.supportingModes.includes("podcast")) rooms.push("Podcast", "Founder");
  return Array.from(new Set(rooms)).slice(0, 4);
}

export function deriveSparkPersonalizationHints(params: {
  consent: boolean;
  preferredDepth?: SparkPersonalizationHints["preferredDepth"];
  preferredTone?: SparkPersonalizationHints["preferredTone"];
  recentRoomsVisited?: string[];
}): SparkPersonalizationHints {
  if (!params.consent) {
    return {
      consent: false,
      applied: false,
      note: "Spark does not claim personal memory without consent.",
    };
  }
  return {
    consent: true,
    preferredDepth: params.preferredDepth,
    preferredTone: params.preferredTone,
    recentRoomsVisited: params.recentRoomsVisited?.slice(0, 5),
    applied: true,
    note: "Consent-based hints may shape tone and relevance without inferring sensitive traits.",
  };
}

export function createSparkNotificationReadiness(): SparkNotificationReadiness[] {
  return (["morning_spark", "evening_reflection", "circle_invite", "founder_spark_episode", "table_spark", "saved_spark_reminder"] as const).map((type) => ({
    type,
    configured: false,
    placeholderOnly: true,
    message: "Notifications will be connected after provider verification.",
  }));
}

export function createSparkGroupReadiness(): SparkGroupReadiness[] {
  return (["solo_spark", "shared_circle_spark", "table_spark", "community_spark", "founder_podcast_spark"] as const).map((mode) => ({
    mode,
    liveParticipants: false,
    placeholderOnly: true,
    message: "No live participants or group activity are shown until the feature is verified.",
  }));
}

export function createMasterSparkExperience(params: {
  memberId: string;
  primaryMode?: SparkPrimaryMode;
  supportingModes?: SparkSupportingMode[];
  roles?: readonly string[];
  history?: readonly SavedSparkRecord[];
  personalization?: Partial<SparkPersonalizationHints> & { consent: boolean };
}): MasterSparkExperience {
  const selection = selectSparkModes({
    primaryMode: params.primaryMode,
    supportingModes: params.supportingModes,
    roles: params.roles,
  });
  const category = selectCategory(selection, params.history);
  const diceValue = (indexFromSeed(`${params.memberId}:${selection.primaryMode}:${category}`, 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  const content = contentByCategory[category];
  const personalization = deriveSparkPersonalizationHints({
    consent: Boolean(params.personalization?.consent),
    preferredDepth: params.personalization?.preferredDepth,
    preferredTone: params.personalization?.preferredTone,
    recentRoomsVisited: params.personalization?.recentRoomsVisited,
  });
  const founderRequested = params.primaryMode === "founder_podcast_mode";
  const founderAllowed = canAccessFounderSparkMode(params.roles);
  return {
    selection,
    wheel: {
      state: "revealing",
      categories,
      selectedCategory: category,
      animation: {
        providerReady: true,
        reducedMotionFallback: true,
        description: "Wheel metadata is ready for elegant motion; static UI uses a reduced-motion reveal.",
      },
    },
    dice: {
      state: "revealing",
      value: diceValue,
      influence: diceValue <= 2 ? "tone" : diceValue <= 4 ? "depth" : "variation",
      reducedMotionFallback: true,
    },
    reveal: {
      sparkId: `spark_${crypto.randomUUID()}`,
      mode: selection.primaryMode,
      supportingModes: selection.supportingModes,
      category,
      ...content,
      relatedRoomConnections: roomConnections(selection, category),
      suggestedNextSteps: modeNextSteps(selection, category),
      saveReadyMetadata: {
        saveable: true,
        storage: "local_ready",
        historyPreferred: true,
      },
    },
    personalization,
    notifications: createSparkNotificationReadiness(),
    groups: createSparkGroupReadiness(),
    founderMode: {
      requested: founderRequested,
      creatorOnly: true,
      accessible: founderRequested && founderAllowed,
      status: founderRequested ? (founderAllowed ? "available_to_creator" : "denied_for_member") : "role_ready_placeholder",
      message: founderRequested && founderAllowed
        ? "Founder Podcast Mode is available to creator/admin roles, but publishing remains provider-dependent."
        : founderRequested
          ? "Founder Podcast Mode is creator-only and is not exposed to normal members."
          : "Founder Podcast Mode is role-ready and hidden from normal member controls.",
    },
    uncontrolledFeedsConnected: false,
    fakeLiveActivityShown: false,
  };
}
