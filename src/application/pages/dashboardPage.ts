import type { MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createDashboardPage(member: string | MemberProfile): PageModel {
  const displayName = typeof member === "string" ? member : member.displayName;
  const memberId = typeof member === "string" ? member : member.memberId;
  return {
    pageId: "dashboard",
    kind: "MEMBER",
    title: `Welcome home, ${displayName}.`,
    subtitle: "Choose one clear next step and continue from there.",
    seoTitle: "Humanity Laws Member Dashboard",
    accessibilitySummary: `Member dashboard for ${memberId}`,
    actions: [
      { label: "Start today's Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Continue Reading", href: "/book", kind: "SECONDARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Today", title: "Begin with one thing.", body: "Start Spark, continue the Book, or bring a real question to Adam and Eve." },
      { eyebrow: "Living Room", title: "Everything connects from here.", body: "Move naturally to The Table, Wellness, Founder updates, or the Living Library when the next step calls for it." },
      { eyebrow: "Memory", title: "You choose what stays.", body: "Memory is consent-aware. Save only what you want remembered, with export and delete paths kept visible." },
      { eyebrow: "Trust", title: "No pressure loops.", body: "The Dashboard should reduce decisions, not create more noise. One helpful next step is enough." },
    ],
    emptyState: "Your Dashboard will grow as you save Sparks, reflections, reading progress, and Council outcomes.",
  };
}
