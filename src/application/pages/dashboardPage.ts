import type { MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createDashboardPage(member: string | MemberProfile): PageModel {
  const displayName = typeof member === "string" ? member : member.displayName;
  const memberId = typeof member === "string" ? member : member.memberId;
  return {
    pageId: "dashboard",
    kind: "MEMBER",
    title: `Welcome home, ${displayName}.`,
    subtitle: "One daily next step. Everything else can wait.",
    seoTitle: "Humanity Laws Member Dashboard",
    accessibilitySummary: `Member dashboard for ${memberId}`,
    actions: [
      { label: "Start today's Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Continue Reading", href: "/book", kind: "SECONDARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Today", title: "Begin with one thing.", body: "Start Spark, continue the Book, or bring one real question to Adam and Eve." },
      { eyebrow: "Living Room", title: "The house connects from here.", body: "Move to The Table, Wellness, Founder updates, or the Library only when it helps." },
      { eyebrow: "Memory", title: "You choose what stays.", body: "Memory is consent-aware. Save only what you want remembered. Export and delete paths stay visible." },
      { eyebrow: "Trust", title: "No pressure loops.", body: "The Dashboard should reduce decisions. One helpful next step is enough." },
    ],
    emptyState: "Your Dashboard will grow as you save Sparks, reflections, reading progress, and Council outcomes.",
  };
}
