import { renderPageModelToHtml } from "./components.js";
import { LaunchRoutes, routePage } from "./router.js";
import type { EvidenceBundle } from "../core/index.js";

export interface FamousPageExport {
  path: string;
  label: string;
  pageId: string;
  html: string;
  requiresAuth: boolean;
  requiresAdmin: boolean;
}

export function createFamousReadyExport(bundle?: EvidenceBundle): FamousPageExport[] {
  return LaunchRoutes.map((route) => ({
    ...route,
    html: renderPageModelToHtml(routePage(route.path, bundle)),
  }));
}
