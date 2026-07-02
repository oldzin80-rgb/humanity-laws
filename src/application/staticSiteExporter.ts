import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderPageModelToHtml } from "./components.js";
import { LaunchRoutes, routePage } from "./router.js";

export interface StaticSiteExportFile {
  routePath: string;
  outputPath: string;
  requiresAuth: boolean;
  requiresAdmin: boolean;
}

export interface StaticSiteExportResult {
  outputDir: string;
  generatedAt: string;
  files: StaticSiteExportFile[];
}

function routeToOutputPath(outputDir: string, routePath: string): string {
  if (routePath === "/") return path.join(outputDir, "index.html");
  return path.join(outputDir, routePath.replace(/^\//, ""), "index.html");
}

export async function exportStaticSite(outputDir = "dist"): Promise<StaticSiteExportResult> {
  await rm(outputDir, { force: true, recursive: true });
  await mkdir(outputDir, { recursive: true });

  const files: StaticSiteExportFile[] = [];

  for (const route of LaunchRoutes) {
    const outputPath = routeToOutputPath(outputDir, route.path);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderPageModelToHtml(routePage(route.path)), "utf8");
    files.push({
      routePath: route.path,
      outputPath,
      requiresAuth: route.requiresAuth,
      requiresAdmin: route.requiresAdmin,
    });
  }

  await writeFile(
    path.join(outputDir, "staging-manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        launchReady: false,
        routes: files,
      },
      null,
      2,
    ),
    "utf8",
  );

  return {
    outputDir,
    generatedAt: new Date().toISOString(),
    files,
  };
}

