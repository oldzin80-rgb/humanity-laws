import type { MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createDashboardPage(member: string | MemberProfile): PageModel {
  const displayName = typeof member === "string" ? member : member.displayName;
  const memberId = typeof member === "string" ? member : member.memberId;
  return {
    pageId: "dashboard",
    kind: "MEMBER",
    title: `Welcome home, ${displayName}.`,
    subtitle: "Begin with one Spark. Carry what matters into Council. Let the day become cleaner from there.",
    seoTitle: "Humanity Laws Member Dashboard",
    accessibilitySummary: `Member dashboard for ${memberId}`,
    actions: [
      { label: "Start today's Spark", href: "/spark", kind: "PRIMARY" },
      { label: "Open Council", href: "/council", kind: "SECONDARY" },
      { label: "Visit the Library", href: "/library", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Today", title: "One honest beginning is enough.", body: "The Dashboard is intentionally simple: Spark for reflection, Council for perspective, Memory for continuity, and Founder notes for stewardship." },
      { title: "Council", body: "Adam and Eve offer complementary perspectives with AI transparency and human sovereignty. Their role is support; your judgment remains final." },
      { title: "Memory", body: "Memory is consent-aware. Reflections should only be remembered when you choose it, with export and delete paths kept visible." },
    ],
    emptyState: "Your dashboard will become richer as you create Sparks, Council conversations, and memories.",
  };
}
