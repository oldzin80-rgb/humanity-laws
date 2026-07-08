import type { PageModel, RouteDefinition } from "./types.js";
import { createHomePage } from "./pages/homePage.js";
import { createJoinPage } from "./pages/joinPage.js";
import { createBookPage } from "./pages/bookPage.js";
import { createDashboardPage } from "./pages/dashboardPage.js";
import { createMemberRoomPage } from "./pages/memberRoomPage.js";
import { createSparkPage } from "./pages/sparkPage.js";
import { createCouncilPage } from "./pages/councilPage.js";
import { createAdamPage } from "./pages/adamPage.js";
import { createEvePage } from "./pages/evePage.js";
import { createTablePage } from "./pages/tablePage.js";
import { createLibraryPage } from "./pages/libraryPage.js";
import { createFounderPage } from "./pages/founderPage.js";
import { createPodcastPage } from "./pages/podcastPage.js";
import { createSocialMediaCommandCenterPage } from "./pages/socialMediaCommandCenterPage.js";
import { createWellnessPage } from "./pages/wellnessPage.js";
import { createCommunityPage } from "./pages/communityPage.js";
import { createHardcoverPage } from "./pages/hardcoverPage.js";
import { createSettingsPage } from "./pages/accountPage.js";
import { createLoginPage } from "./pages/loginPage.js";
import { createSignupPage } from "./pages/signupPage.js";
import { createCheckoutPage } from "./pages/checkoutPage.js";
import { createAdminPage } from "./pages/adminPage.js";
import { createLaunchStatusPage } from "./pages/launchStatusPage.js";
import { createReleaseReadinessReport, type EvidenceBundle } from "../core/index.js";

export const LaunchRoutes: RouteDefinition[] = [
  { path: "/", label: "Home", pageId: "home", requiresAuth: false, requiresAdmin: false },
  { path: "/book", label: "Book", pageId: "book", requiresAuth: true, requiresAdmin: false },
  { path: "/join", label: "Join", pageId: "join", requiresAuth: false, requiresAdmin: false },
  { path: "/membership", label: "Membership", pageId: "join", requiresAuth: false, requiresAdmin: false },
  { path: "/pricing", label: "Pricing", pageId: "join", requiresAuth: false, requiresAdmin: false },
  { path: "/login", label: "Login", pageId: "login", requiresAuth: false, requiresAdmin: false },
  { path: "/signup", label: "Signup", pageId: "signup", requiresAuth: false, requiresAdmin: false },
  { path: "/checkout/monthly", label: "Monthly Checkout", pageId: "checkout-monthly", requiresAuth: true, requiresAdmin: false },
  { path: "/checkout/yearly", label: "Yearly Checkout", pageId: "checkout-yearly", requiresAuth: true, requiresAdmin: false },
  { path: "/checkout/book", label: "Digital Book Checkout", pageId: "checkout-book", requiresAuth: true, requiresAdmin: false },
  { path: "/checkout/success", label: "Checkout Success", pageId: "checkout-success", requiresAuth: true, requiresAdmin: false },
  { path: "/checkout/cancel", label: "Checkout Cancel", pageId: "checkout-cancel", requiresAuth: false, requiresAdmin: false },
  { path: "/dashboard", label: "Dashboard", pageId: "dashboard", requiresAuth: true, requiresAdmin: false },
  { path: "/member-room", label: "Member Room", pageId: "member-room", requiresAuth: true, requiresAdmin: false },
  { path: "/spark", label: "Spark", pageId: "spark", requiresAuth: true, requiresAdmin: false },
  { path: "/adam", label: "Adam", pageId: "adam", requiresAuth: true, requiresAdmin: false },
  { path: "/eve", label: "Eve", pageId: "eve", requiresAuth: true, requiresAdmin: false },
  { path: "/council", label: "Council", pageId: "council", requiresAuth: true, requiresAdmin: false },
  { path: "/table", label: "The Table", pageId: "table", requiresAuth: true, requiresAdmin: false },
  { path: "/library", label: "Living Library", pageId: "library", requiresAuth: true, requiresAdmin: false },
  { path: "/podcast", label: "Podcast", pageId: "podcast", requiresAuth: false, requiresAdmin: false },
  { path: "/social-media-command-center", label: "Social Command Center", pageId: "social-media-command-center", requiresAuth: true, requiresAdmin: true },
  { path: "/founder", label: "Founder", pageId: "founder", requiresAuth: true, requiresAdmin: false },
  { path: "/wellness", label: "Wellness", pageId: "wellness", requiresAuth: true, requiresAdmin: false },
  { path: "/community", label: "Community", pageId: "community", requiresAuth: true, requiresAdmin: false },
  { path: "/settings", label: "Settings", pageId: "settings", requiresAuth: true, requiresAdmin: false },
  { path: "/book/hardcover", label: "Hardcover", pageId: "hardcover", requiresAuth: false, requiresAdmin: false },
  { path: "/admin", label: "Admin", pageId: "admin", requiresAuth: true, requiresAdmin: true },
  { path: "/launch-status", label: "Launch Status", pageId: "launch-status", requiresAuth: false, requiresAdmin: false },
];

export const CorePreloadRoutes: readonly string[] = ["/", "/dashboard", "/spark", "/book", "/membership", "/checkout/monthly"];

export function routePage(path: string, bundle?: EvidenceBundle): PageModel {
  if (path === "/join" || path === "/membership" || path === "/pricing") return createJoinPage();
  if (path === "/book") return createBookPage();
  if (path === "/login") return createLoginPage();
  if (path === "/signup") return createSignupPage();
  if (path === "/checkout/monthly") return createCheckoutPage("monthly");
  if (path === "/checkout/yearly") return createCheckoutPage("yearly");
  if (path === "/checkout/book") return createCheckoutPage("book");
  if (path === "/checkout/success") return createCheckoutPage("success");
  if (path === "/checkout/cancel") return createCheckoutPage("cancel");
  if (path === "/dashboard") return createDashboardPage("member");
  if (path === "/member-room") return createMemberRoomPage();
  if (path === "/spark") return createSparkPage({ sparkId: "spark_demo", memberId: "member", pillar: "Truth", prompt: "What is one truthful next step?", createdAt: new Date().toISOString() });
  if (path === "/adam") return createAdamPage();
  if (path === "/eve") return createEvePage();
  if (path === "/council") return createCouncilPage();
  if (path === "/table") return createTablePage();
  if (path === "/library") return createLibraryPage();
  if (path === "/podcast") return createPodcastPage();
  if (path === "/social-media-command-center") return createSocialMediaCommandCenterPage();
  if (path === "/founder") return createFounderPage();
  if (path === "/wellness") return createWellnessPage();
  if (path === "/community") return createCommunityPage();
  if (path === "/settings") return createSettingsPage();
  if (path === "/book/hardcover") return createHardcoverPage();
  if (path === "/admin") return createAdminPage();
  if (path === "/launch-status") return createLaunchStatusPage(createReleaseReadinessReport(bundle ?? { createdAt: new Date().toISOString(), workspaceRoot: ".", evidence: [] }));
  return createHomePage();
}

export function requireRoute(path: string): RouteDefinition {
  const route = LaunchRoutes.find((item) => item.path === path);
  if (!route) throw new Error(`Route not found: ${path}`);
  return route;
}
