import { SourceLedger } from "../../src/adam-eve-os/source-ledger.ts";

const ledger = new SourceLedger();

const empty = ledger.report({ requireCurrent: true });
if (empty.coverageScore !== 0) throw new Error("Empty source ledger should have zero coverage.");
if (empty.warnings.length === 0) throw new Error("Empty source ledger should warn.");

ledger.add({
  id: "humanity-laws-book",
  title: "Humanity Laws",
  kind: "book",
  localPath: "humanity-laws-master-archive/01-book-source/humanity-laws.pdf",
  retrievedAt: new Date().toISOString(),
});

const report = ledger.report({ requireCurrent: false });
if (report.coverageScore <= 0) throw new Error("Source ledger should report coverage after source add.");
if (report.sources.length !== 1) throw new Error("Source ledger should return added source.");

console.log(JSON.stringify({ passed: true }));
