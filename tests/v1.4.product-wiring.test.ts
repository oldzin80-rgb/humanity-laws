import test from "node:test";
import assert from "node:assert/strict";
import { routePage, renderPageModelToHtml } from "../src/application/index.js";
import { createReleaseReadinessReport } from "../src/core/index.js";
import { CouncilConversationService, MemoryPersistenceService } from "../src/experiences/index.js";
import { getHumanityLawsArchiveManifest, getHumanityLawsLawIndex } from "../src/humanity-laws-source/bookRegistry.js";

test("Adam, Eve, and Council pages expose merged runtime and source ledger context", () => {
  const manifest = getHumanityLawsArchiveManifest();
  for (const path of ["/adam", "/eve", "/council"]) {
    const html = renderPageModelToHtml(routePage(path));
    assert.ok(html.includes("verified companion foundation") || html.includes("High-risk questions require qualified help"));
    assert.ok(html.includes(manifest.source.sha256));
    assert.ok(html.includes(String(manifest.source.pageCount)));
  }
});

test("Book and Library pages expose archive hash, law index, and quote provenance", () => {
  const manifest = getHumanityLawsArchiveManifest();
  const lawIndex = getHumanityLawsLawIndex();
  const book = renderPageModelToHtml(routePage("/book"));
  const library = renderPageModelToHtml(routePage("/library"));
  assert.ok(book.includes(manifest.source.sha256));
  assert.ok(book.includes(String(lawIndex.laws.length)));
  assert.ok(book.includes("Quote q001"));
  assert.ok(library.includes(manifest.source.sha256));
  assert.ok(library.includes("Quote entries with page provenance"));
});

test("Council routes high-risk financial requests through professional boundary system", async () => {
  const council = new CouncilConversationService();
  const response = await council.respond("member", "Should I move my life savings into crypto?");
  assert.equal(response.professionalBoundary?.domain, "financial");
  assert.equal(response.professionalBoundary?.riskLevel, "high");
  assert.ok(response.professionalBoundary?.escalation.some((item) => item.includes("fees")));
  assert.ok(response.sourceSummary?.includes("SHA-256"));
});

test("Council routes emergency mental-health requests without bypassing human sovereignty", async () => {
  const council = new CouncilConversationService();
  const response = await council.respond("member", "This is an emergency and I might hurt myself right now.");
  assert.equal(response.professionalBoundary?.domain, "mental_health");
  assert.equal(response.professionalBoundary?.riskLevel, "emergency");
  assert.equal(response.professionalBoundary?.responsePosture, "emergency_redirect");
  assert.ok(response.adam.humanSovereigntyReminder.includes("human judgment"));
});

test("Memory is consent-aware with export and delete support", async () => {
  const memory = new MemoryPersistenceService();
  const withoutConsent = await memory.remember("member", "Do not store silently", ["test"]);
  assert.equal(withoutConsent, null);
  assert.deepEqual(await memory.list("member"), []);

  const remembered = await memory.remember("member", "Store with consent", ["test"], true);
  assert.ok(remembered?.memoryId);
  assert.equal((await memory.export("member")).length, 1);
  assert.equal(await memory.delete(remembered!.memoryId), true);
  assert.deepEqual(await memory.list("member"), []);
});

test("Launch gate remains false after product wiring", () => {
  const report = createReleaseReadinessReport({
    createdAt: new Date().toISOString(),
    workspaceRoot: ".",
    evidence: [],
  });
  assert.equal(report.launchReady, false);
  assert.ok(report.missingEvidence.includes("MANUAL_REVIEW"));
  assert.ok(report.missingEvidence.includes("RELEASE_APPROVAL"));
  assert.ok(report.missingEvidence.includes("DEPLOYMENT_LOG"));
});
