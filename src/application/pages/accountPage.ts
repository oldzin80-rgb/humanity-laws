import type { AuthSession, MemberProfile } from "../../member/index.js";
import type { PageModel } from "../types.js";

export function createAccountPage(member: MemberProfile, session: AuthSession): PageModel {
  return {
    pageId: "settings",
    kind: "MEMBER",
    title: "Settings",
    subtitle: "Account, membership, security, and preferences in one simple place.",
    seoTitle: "Settings — Humanity Laws",
    accessibilitySummary: "Member settings page",
    actions: [
      { label: "Open Dashboard", href: "/dashboard", kind: "PRIMARY" },
      { label: "Membership", href: "/membership", kind: "SECONDARY" },
      { label: "Launch Status", href: "/launch-status", kind: "TERTIARY" },
    ],
    sections: [
      { eyebrow: "Account", title: "You are signed in.", body: `${member.displayName} • ${member.email}.` },
      { eyebrow: "Membership", title: "Your current access is visible.", body: `Membership status: ${member.membershipStatus}.` },
      { eyebrow: "Security", title: "Keep access clear.", body: `This session expires at ${session.expiresAt}. Sign out when you are done on a shared device.` },
      { title: "Preferences", body: "Notification, memory, export, and deletion controls should stay simple and member-controlled as live services are verified." },
    ],
  };
}

export function createSettingsPage(): PageModel {
  return createAccountPage(
    {
      memberId: "member",
      email: "member@example.com",
      displayName: "member",
      roles: ["MEMBER"],
      membershipStatus: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      sessionId: "settings-preview",
      memberId: "member",
      authenticated: true,
      roles: ["MEMBER"],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  );
}
