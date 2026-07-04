import type { SparkRecord } from "../../experiences/index.js";
import type { PageModel } from "../types.js";

export function createSparkPage(spark: SparkRecord): PageModel {
  return {
    pageId: "spark",
    kind: "MEMBER",
    title: "Today's Spark",
    subtitle: "One prompt. One reflection. One next step.",
    seoTitle: "Humanity Laws Spark",
    accessibilitySummary: "Daily reflection prompt",
    actions: [
      { label: "Start today's Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Reflect with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Save to Library", href: "/library", kind: "TERTIARY" },
      { label: "Continue Reading", href: "/book", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: spark.pillar, title: "Reveal today's prompt.", body: spark.prompt },
      { title: "Practice", body: "Pause for one minute. Write one honest sentence. Choose one next step." },
      { title: "Continue", body: "Reflect with Adam and Eve, save the insight, or return to the Book." },
      { title: "No-repeat promise", body: "Spark avoids repeating the same prompt until the available pool has been honored." },
    ],
  };
}
