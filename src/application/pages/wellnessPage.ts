import type { PageModel } from "../types.js";
import { createHumanOSWellnessPlatform } from "../../experiences/index.js";

export function createWellnessPage(): PageModel {
  const platform = createHumanOSWellnessPlatform();

  return {
    pageId: "wellness",
    kind: "MEMBER",
    title: "Human OS Wellness",
    subtitle: "A calm garden for sustainable habits across body, mind, relationships, purpose, recovery, and daily stewardship.",
    seoTitle: "Wellness — Humanity Laws",
    accessibilitySummary: "Active member wellness page",
    actions: [
      { label: "Start Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Save to Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      {
        eyebrow: "Wellness Dashboard",
        title: "Daily check-in. One focus. Gentle progress.",
        body: "Human OS supports daily check-ins, today's wellness focus, weekly reflection, gentle habit streaks, and a member-owned progress summary.",
      },
      {
        eyebrow: "Safety",
        title: "Educational support only.",
        body: "This is not medical care. It does not diagnose, prescribe treatment, replace a qualified professional, or make medical claims. If something is urgent or unsafe, seek appropriate emergency or qualified help.",
        bullets: ["No diagnosis.", "No prescription.", "No shame-based language.", "User choice first.", "Different ability levels respected."],
      },
      {
        eyebrow: "Body",
        title: "Movement, nutrition, sleep, and recovery.",
        body: "Wellness can support walking, strength, mobility, stretching, yoga, recovery, recipes, meal planning, grocery lists, hydration, substitutions, nutrition education, sleep habits, rest, and recovery reminders.",
      },
      {
        eyebrow: "Mind",
        title: "Reflection without pressure.",
        body: "Journaling, gratitude, breathing exercises, stress reduction, and guided reflection stay gentle, optional, and supportive.",
      },
      {
        eyebrow: "Purpose",
        title: "Daily intention and stewardship.",
        body: "Purpose and growth connect daily intention, service, stewardship, personal goals, and habit building without coercive streak pressure.",
      },
      {
        eyebrow: "Integration",
        title: "The house connects naturally.",
        body: `${platform.name} connects Wellness to Spark, Adam and Eve, The Table, Podcast, Founder Letters, Community, Humanity Laws book themes, and the Experience Orchestrator.`,
      },
      {
        eyebrow: "Future",
        title: "Health data requires explicit consent.",
        body: "Wearables, fitness trackers, health data, family wellness, group challenges, preventive education, longevity education, and Human OS research remain future hooks only until provider, privacy, consent, and safety review are complete.",
      },
      {
        eyebrow: "Adam & Eve",
        title: "Encouragement, not medical authority.",
        body: "Adam and Eve may encourage, explain, help reflect, help build routines, and suggest gentle next steps. They must never diagnose, prescribe, claim medical authority, override user choice, shame, or pressure the member.",
      },
    ],
    emptyState: "Choose one gentle practice. If wellness ever feels urgent, unsafe, or medical, seek appropriate professional or emergency help.",
  };
}
