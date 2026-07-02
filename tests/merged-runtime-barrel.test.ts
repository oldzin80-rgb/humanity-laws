import { createMergedHumanityLawsRuntime } from "../src/runtime/index.ts";

const runtime = createMergedHumanityLawsRuntime();

if (runtime.archiveManifest.source.pageCount !== 84) {
  throw new Error("Runtime barrel did not expose the merged Humanity Laws archive.");
}

if (!runtime.launchReadinessMustRemainEvidenceDerived) {
  throw new Error("Runtime barrel must preserve evidence-derived launch readiness.");
}

console.log(JSON.stringify({
  passed: true,
  pageCount: runtime.archiveManifest.source.pageCount,
  launchReadinessMustRemainEvidenceDerived: runtime.launchReadinessMustRemainEvidenceDerived,
}));
