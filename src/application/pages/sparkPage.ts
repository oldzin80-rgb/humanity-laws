import type { SparkRecord } from "../../experiences/index.js";
import type { PageModel } from "../types.js";

export function createSparkPage(spark: SparkRecord): PageModel {
  return {
    pageId: "spark",
    kind: "MEMBER",
    title: "Today's Spark",
    subtitle: spark.pillar,
    seoTitle: "Humanity Laws Spark",
    accessibilitySummary: "Daily reflection prompt",
    actions: [
      { label: "Reflect with Adam & Eve", href: "/council", kind: "PRIMARY" },
      { label: "Save to Library", href: "/library", kind: "SECONDARY" },
      { label: "Explore the Book", href: "/book", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Inspiration", title: "Start today's reflection.", body: spark.prompt },
      { title: "What to do next", body: "Sit with the question, bring it to Adam and Eve, or save it to the Living Library." },
      { title: "No-repeat promise", body: "Your Spark history helps the system avoid repeating the same prompt until the available pool has been honored." },
    ],
  };
}
