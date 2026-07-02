import { createMergedHumanityLawsRuntime } from "../src/runtime/mergedHumanityLaws.ts";

const runtime = createMergedHumanityLawsRuntime();

if (!runtime.adamEve.constitutionalCore) throw new Error("Adam/Eve system factory is not accessible.");
if (!runtime.adamEve.professionalBoundaries) throw new Error("Adam/Eve system lacks professional boundaries.");
if (!runtime.adamEve.sourceLedger) throw new Error("Adam/Eve system lacks source ledger.");

const assessment = runtime.professionalBoundaries.assess({
  domain: "financial",
  situation: "Large retirement decision.",
  asksToInvestBorrowOrMoveLargeMoney: true,
});

if (assessment.riskLevel !== "high") {
  throw new Error("Professional-boundary router is not accessible or not classifying risk.");
}

const report = runtime.sourceLedger.report({ kind: "book" });
if (report.sources.length !== 1) throw new Error("Source ledger did not receive the Humanity Laws book source.");

if (runtime.bookRegistry.source.sha256 !== runtime.archiveManifest.source.sha256) {
  throw new Error("Book registry and archive manifest are not aligned.");
}

if (!runtime.launchReadinessMustRemainEvidenceDerived) {
  throw new Error("Merged runtime must not bypass launch evidence.");
}

console.log(JSON.stringify({
  passed: true,
  sourceSha256: runtime.bookRegistry.source.sha256,
  pageCount: runtime.archiveManifest.source.pageCount,
  professionalRisk: assessment.riskLevel,
  sources: report.sources.length,
}));
