export type PageKind =
  | "PUBLIC"
  | "AUTH"
  | "MEMBER"
  | "ADMIN"
  | "LAUNCH";

export interface PageAction {
  label: string;
  href: string;
  kind: "PRIMARY" | "SECONDARY" | "TERTIARY";
  ariaLabel?: string;
}

export interface PageSection {
  title: string;
  body: string;
  eyebrow?: string;
  bullets?: string[];
}

export interface PageModel {
  pageId: string;
  kind: PageKind;
  title: string;
  subtitle: string;
  actions: PageAction[];
  sections: PageSection[];
  seoTitle: string;
  accessibilitySummary: string;
  emptyState?: string;
  errorState?: string;
}

export interface RouteDefinition {
  path: string;
  label: string;
  pageId: string;
  requiresAuth: boolean;
  requiresAdmin: boolean;
}
