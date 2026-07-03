import type { PageModel } from "../types.js";

export function createSignupPage(): PageModel {
  return {
    pageId: "signup",
    kind: "AUTH",
    title: "Create your account.",
    subtitle: "Start with a simple account, then return to the member home.",
    seoTitle: "Signup — Humanity Laws",
    accessibilitySummary: "Signup page",
    actions: [{ label: "Already have an account?", href: "/login", kind: "SECONDARY" }],
    sections: [
      { eyebrow: "Account", title: "A clear beginning.", body: "Create your account with your name, email, and password." },
      { title: "After signup", body: "You will be sent to the Dashboard and stay signed in on this device." },
    ],
  };
}
