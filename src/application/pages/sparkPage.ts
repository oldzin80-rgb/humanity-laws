import { createSimplifiedCinematicSparkExperience, type SparkRecord } from "../../experiences/index.js";
import type { PageModel } from "../types.js";

export function createSparkPage(_spark: SparkRecord): PageModel {
  const experience = createSimplifiedCinematicSparkExperience();
  const spark = experience.spark;
  const result = experience.result;
  const rollDescription =
    result.dicePath === "founder_wildcard"
      ? "Green landed. Founder Wildcard opened. No dice needed."
      : result.dicePath === "one_die"
        ? `Black landed. One die revealed category ${result.categoryNumber}.`
        : `Red landed. Two dice revealed category ${result.categoryNumber}.`;
  return {
    pageId: "spark",
    kind: "MEMBER",
    title: "The Spark",
    subtitle: "Spin the wheel. Roll the dice. Receive one question worth carrying into your day.",
    seoTitle: "Humanity Laws Spark",
    accessibilitySummary: "Daily reflection prompt",
    actions: [
      { label: "Discuss with Adam & Eve", href: "/council", kind: "PRIMARY" },
      { label: "Save Spark", href: "/library", kind: "SECONDARY" },
      { label: "Share Spark", href: "mailto:?subject=Humanity%20Laws%20Spark&body=I%20found%20a%20Spark%20worth%20reflecting%20on.", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Receive", title: result.title, body: `${rollDescription} ${result.whatItIs}` },
      { eyebrow: "Whisper", title: spark.title, body: spark.whisper },
      { eyebrow: "Question", title: result.question, body: "Let the question land before you answer it. No rush. No performance." },
      { eyebrow: "Reflect", title: "What it means", body: spark.reflection },
      { eyebrow: "Action", title: "Today’s move", body: spark.action },
      { eyebrow: "Adam & Eve", title: "Talk it through.", body: "Adam and Eve can help you reflect on this Spark, save the insight, or carry it into Council." },
    ],
    emptyState: "Save today’s Spark to the Living Library when you want to keep it. Adam and Eve can use saved Spark context with your consent. No fake streaks, no pressure loop.",
  };
}
