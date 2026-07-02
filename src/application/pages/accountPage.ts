import type { AuthSession, MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createAccountPage(member: MemberProfile, session: AuthSession): PageModel {
  return {
    pageId: "account",
    kind: "MEMBER",
    title: "Account",
    subtitle: `${member.displayName} • ${member.membershipStatus}`,
    seoTitle: "Account — Humanity Laws",
    accessibilitySummary: "Member account page",
    actions: [{ label: "Dashboard", href: "/dashboard", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Membership", title: "Your place in the home", body: `Status: ${member.membershipStatus}.` },
      { eyebrow: "Session", title: "Secure access", body: `Session expires at ${session.expiresAt}.` },
      { title: "Promise", body: "Account experiences should stay simple, dignified, and easy to trust." },
    ],
  };
}
