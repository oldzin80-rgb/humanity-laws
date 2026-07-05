import type { PageModel } from "../types.js";
import { createTableExperience } from "../../experiences/index.js";

export function createTablePage(): PageModel {
  const experience = createTableExperience();
  const prompt = experience.prompt;
  return {
    pageId: "table",
    kind: "MEMBER",
    title: "The Table",
    subtitle: "Gather. Receive one beautiful prompt. Share honestly. Remember what mattered.",
    seoTitle: "The Table — Humanity Laws",
    accessibilitySummary: "Warm gathering room for hospitality, conversation, gratitude, and remembrance",
    actions: [
      { label: "Discuss with Adam & Eve", href: "/council", kind: "PRIMARY" },
      { label: "Save the Moment", href: "/library", kind: "SECONDARY" },
      { label: "Start a Spark", href: "/spark", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Gather", title: "Choose who is at the table.", body: "Family, friends, date, dinner, community, or Founder Table. One gathering type is enough." },
      { eyebrow: "Prompt", title: prompt.title, body: prompt.conversationPrompt },
      { eyebrow: "Gratitude", title: "Ask one thankful question.", body: prompt.gratitudeQuestion },
      { eyebrow: "Meal", title: "Optional meal idea.", body: prompt.mealIdea ?? "Food can stay simple. The point is presence." },
      { eyebrow: "Toast", title: "Optional blessing or toast.", body: prompt.toast ?? "To the people around this table." },
      { eyebrow: "Remember", title: "Save what mattered.", body: "Adam and Eve can receive Table context when you choose to save, discuss, or carry the moment forward." },
    ],
    emptyState: "No feed. No performance. The Table is for one real moment of connection at a time.",
  };
}
