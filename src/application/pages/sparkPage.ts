import { createMasterSparkExperience, SparkModeDefinitions, type SparkRecord } from "../../experiences/index.js";
import type { PageModel } from "../types.js";

export function createSparkPage(spark: SparkRecord): PageModel {
  const experience = createMasterSparkExperience({
    memberId: spark.memberId,
    primaryMode: "morning_spark",
    supportingModes: ["adam_mode", "book"],
    personalization: { consent: false },
  });
  const reveal = experience.reveal;
  const publicModes = SparkModeDefinitions.filter((mode) => !mode.creatorOnly).map((mode) => mode.label).join(", ");
  return {
    pageId: "spark",
    kind: "MEMBER",
    title: "Today's Spark",
    subtitle: "Ready for today’s Spark? One beautiful moment, one reflection, one next step.",
    seoTitle: "Humanity Laws Spark",
    accessibilitySummary: "Daily reflection prompt",
    actions: [
      { label: "Begin Morning Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Talk with Adam", href: "/adam", kind: "SECONDARY" },
      { label: "Save to Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Arrival", title: "Ready for today’s Spark?", body: "Choose one primary mode and up to two supports. Spark keeps the reveal focused instead of cluttered." },
      { eyebrow: "Modes", title: "Choose the doorway.", body: `Available member modes: ${publicModes}. Founder Podcast Mode is creator-only and hidden from normal member controls.` },
      { eyebrow: "Wheel", title: "The wheel chooses a category.", body: `Selected category: ${reveal.category.replaceAll("_", " ")}. Motion metadata is ready, with reduced-motion fallback preserved.` },
      { eyebrow: "Dice", title: "The dice shapes the depth.", body: `Dice value ${experience.dice.value} shapes ${experience.dice.influence}. No casino feel, no heavy animation, no pressure loop.` },
      { eyebrow: reveal.category.replaceAll("_", " "), title: reveal.title, body: reveal.shortReflection },
      { title: "Practice", body: "Pause for one minute. Write one honest sentence. Choose one next step." },
      { eyebrow: "Question", title: reveal.primaryQuestion, body: `Practical action: ${reveal.practicalAction}` },
      { eyebrow: "Source connection", title: reveal.relatedHumanityLawsPrinciple, body: `Connected rooms: ${reveal.relatedRoomConnections.join(", ")}.` },
      { eyebrow: "Personalization", title: "Consent keeps Spark respectful.", body: experience.personalization.note },
      { eyebrow: "Notifications", title: "Morning Spark reminders coming soon.", body: "Notifications will be connected after provider verification. No push, SMS, or email reminders are sent yet." },
      { eyebrow: "Groups", title: "Circle and Table Sparks are role-ready.", body: "No live participants or group activity are shown until community and moderation workflows are verified." },
      { title: "No-repeat promise", body: "Spark prefers unrepeated categories when history is available and falls back gracefully when history is unavailable." },
    ],
    emptyState: "Saved Sparks will appear in the Living Library after you choose to save them. Until server persistence is verified, saving can remain local and honest.",
  };
}
