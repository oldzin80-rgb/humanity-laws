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
      { label: "Bring this to Council", href: "/council", kind: "PRIMARY" },
      { label: "Return to Dashboard", href: "/dashboard", kind: "SECONDARY" },
    ],
    sections: [
      { eyebrow: "Reflection", title: "Carry one clear thought.", body: spark.prompt },
      { title: "Why it matters", body: "The Spark is intentionally small. A crowded screen can hide the truth; one clean question can open the day." },
      { title: "No-repeat promise", body: "Your Spark history helps the system avoid repeating the same prompt until the available pool has been honored." },
    ],
  };
}
