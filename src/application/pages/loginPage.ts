import type { PageModel } from "../types.js";

export function createLoginPage(): PageModel {
  return {
    pageId: "login",
    kind: "AUTH",
    title: "Welcome back.",
    subtitle: "Return to your Dashboard, Spark, Council, and Memory with a simple, respectful sign-in.",
    seoTitle: "Login — Humanity Laws",
    accessibilitySummary: "Login page",
    actions: [{ label: "Continue", href: "/login/continue", kind: "PRIMARY" }],
    sections: [
      { eyebrow: "Secure by design", title: "A clear door back into the home.", body: "Authentication should be simple, calm, and respectful of member privacy." },
      { title: "Need to join?", body: "Membership is $7/month or $70/year, with no ads, no donations, and a value-for-value promise." },
    ],
  };
}
