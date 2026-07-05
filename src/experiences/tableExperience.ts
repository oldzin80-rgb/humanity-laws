export type TableGatheringType = "family" | "friends" | "date" | "dinner" | "community" | "founder_table";

export type TableMomentEventType =
  | "table_entered"
  | "gathering_type_chosen"
  | "table_prompt_received"
  | "table_answered"
  | "table_saved"
  | "adam_eve_opened";

export interface TablePrompt {
  gatheringType: TableGatheringType;
  title: string;
  conversationPrompt: string;
  gratitudeQuestion: string;
  mealIdea?: string;
  toast?: string;
}

export interface TableMomentEvent {
  userId: string;
  type: TableMomentEventType;
  source: "table";
  gatheringType: TableGatheringType;
  prompt?: TablePrompt;
  userOutput?: string;
  createdAt: string;
  companionVisible: true;
  userOwned: true;
  editableByUser: true;
  deletableByUser: true;
  purpose: "hospitality_connection_gratitude_and_remembrance";
}

export interface TableExperience {
  path: readonly ["Gather", "Prompt", "Share", "Remember"];
  gatheringTypes: readonly TableGatheringType[];
  prompt: TablePrompt;
  adamEveConnected: true;
  noFeed: true;
  oneClearPath: true;
}

export const TablePrompts: readonly TablePrompt[] = [
  {
    gatheringType: "family",
    title: "The Story Worth Keeping",
    conversationPrompt: "What is one family story we should tell more often?",
    gratitudeQuestion: "Who quietly helps this family more than they get thanked for?",
    mealIdea: "Something familiar and low-pressure: pasta, soup, tacos, or breakfast-for-dinner.",
    toast: "To the people who keep showing up.",
  },
  {
    gatheringType: "friends",
    title: "The Good Chaos",
    conversationPrompt: "What is one memory with this group that still makes life feel lighter?",
    gratitudeQuestion: "What does this friend group give you that the world does not always give?",
    mealIdea: "Shareable food: sliders, flatbread, chips and dips, or a dessert everyone attacks first.",
    toast: "To the friends who make ordinary nights unforgettable.",
  },
  {
    gatheringType: "date",
    title: "The Simple Green Flag",
    conversationPrompt: "What is one small thing that makes you feel genuinely cared for?",
    gratitudeQuestion: "What is something you appreciate about how the other person shows up?",
    mealIdea: "Simple and warm: a favorite dish, fresh bread, fruit, or dessert with no performance.",
    toast: "To attention, kindness, and honest presence.",
  },
  {
    gatheringType: "dinner",
    title: "The Daily Return",
    conversationPrompt: "What part of today are you still carrying into this meal?",
    gratitudeQuestion: "What is one thing from today that deserves a quiet thank you?",
    mealIdea: "Keep it easy: roasted vegetables, rice bowls, sandwiches, or whatever lowers stress.",
    toast: "To food, breath, and a place to return.",
  },
  {
    gatheringType: "community",
    title: "The Longer Table",
    conversationPrompt: "What would make more people feel welcomed here?",
    gratitudeQuestion: "Who in this community serves without needing attention?",
    mealIdea: "Potluck-style: let everyone bring something simple, cultural, or meaningful.",
    toast: "To a longer table and fewer walls.",
  },
  {
    gatheringType: "founder_table",
    title: "The Built Thing",
    conversationPrompt: "What would you build if hospitality was the first design principle?",
    gratitudeQuestion: "What part of your story could become service for someone else?",
    mealIdea: "Founder Table can be anything humble and intentional: coffee, bread, soup, or a shared dessert.",
    toast: "To building what helps people become more human.",
  },
] as const;

export function createTableExperience(gatheringType: TableGatheringType = "family"): TableExperience {
  const prompt = TablePrompts.find((item) => item.gatheringType === gatheringType) ?? TablePrompts[0]!;
  return {
    path: ["Gather", "Prompt", "Share", "Remember"],
    gatheringTypes: ["family", "friends", "date", "dinner", "community", "founder_table"],
    prompt,
    adamEveConnected: true,
    noFeed: true,
    oneClearPath: true,
  };
}

export function createTableMomentEvent(params: {
  userId: string;
  type: TableMomentEventType;
  gatheringType?: TableGatheringType;
  prompt?: TablePrompt;
  userOutput?: string;
  createdAt?: string;
}): TableMomentEvent {
  const prompt = params.prompt ?? createTableExperience(params.gatheringType).prompt;
  return {
    userId: params.userId,
    type: params.type,
    source: "table",
    gatheringType: params.gatheringType ?? prompt.gatheringType,
    prompt,
    userOutput: params.userOutput,
    createdAt: params.createdAt ?? new Date().toISOString(),
    companionVisible: true,
    userOwned: true,
    editableByUser: true,
    deletableByUser: true,
    purpose: "hospitality_connection_gratitude_and_remembrance",
  };
}
