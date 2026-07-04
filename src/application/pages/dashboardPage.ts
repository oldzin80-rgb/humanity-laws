import type { MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createDashboardPage(member: string | MemberProfile): PageModel {
  const displayName = typeof member === "string" ? member : member.displayName;
  const memberId = typeof member === "string" ? member : member.memberId;
  return {
    pageId: "dashboard",
    kind: "MEMBER",
    title: `Welcome home, ${displayName}.`,
    subtitle: "Your calm starting point for today.",
    seoTitle: "Humanity Laws Member Dashboard",
    accessibilitySummary: `Member dashboard for ${memberId}`,
    actions: [
      { label: "Start today's Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Talk with Adam & Eve", href: "/council", kind: "SECONDARY" },
      { label: "Open Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Today", title: "Choose one useful next step.", body: "Start with Spark, continue reading, visit The Table, or bring a real question to Adam and Eve." },
      { eyebrow: "Continue", title: "Keep the house connected.", body: "The Dashboard connects the Book, Spark, Council, The Table, Wellness, Founder updates, and the Living Library." },
      { eyebrow: "Memory", title: "You control what is remembered.", body: "Memory is consent-aware. Reflections should only be remembered when you choose it, with export and delete paths kept visible." },
      { eyebrow: "Founder", title: "Latest founder updates belong here.", body: "Founder letters, videos, and podcast notes should surface here when they are verified and ready." },
    ],
    emptyState: "Your dashboard will become richer as you create Sparks, Council conversations, and memories.",
  };
}
