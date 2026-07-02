import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const archiveRoot = new URL("../", import.meta.url).pathname;
const required = [
  "01-book-source/humanity-laws (1).pdf",
  "02-book-extracted-text/humanity-laws-full-text.md",
  "02-book-extracted-text/humanity-laws-pages.json",
  "03-book-index/chapter-index.json",
  "03-book-index/law-index.json",
  "04-quote-library/quote-library.json",
  "05-concept-map/concept-map.json",
  "06-typescript-registry/archive-manifest.json",
  "06-typescript-registry/humanity-laws-source-registry.ts",
];

for (const relative of required) {
  const path = join(archiveRoot, relative);
  if (!existsSync(path)) throw new Error(`Missing archive artifact: ${relative}`);
}

const manifest = JSON.parse(readFileSync(join(archiveRoot, "06-typescript-registry/archive-manifest.json"), "utf8"));
const pdfBytes = readFileSync(join(archiveRoot, manifest.source.archivedPath));
const actualHash = createHash("sha256").update(pdfBytes).digest("hex");
if (actualHash !== manifest.source.sha256) {
  throw new Error("Archived PDF hash does not match manifest.");
}

const pages = JSON.parse(readFileSync(join(archiveRoot, "02-book-extracted-text/humanity-laws-pages.json"), "utf8"));
if (pages.sourceSha256 !== manifest.source.sha256) throw new Error("Pages JSON source hash mismatch.");
if (!Array.isArray(pages.pages) || pages.pages.length !== manifest.source.pageCount) {
  throw new Error("Pages JSON does not match recorded page count.");
}

const quoteLibrary = JSON.parse(readFileSync(join(archiveRoot, "04-quote-library/quote-library.json"), "utf8"));
if (quoteLibrary.sourceSha256 !== manifest.source.sha256) throw new Error("Quote library source hash mismatch.");
for (const entry of quoteLibrary.quotes) {
  const page = pages.pages.find((item: { page: number; text: string }) => item.page === entry.page);
  if (!page) throw new Error(`Quote ${entry.id} references missing page ${entry.page}.`);
  const normalizedPage = page.text.replace(/\s+/g, " ").trim();
  const normalizedQuote = entry.quote.replace(/\s+/g, " ").trim();
  if (!normalizedPage.includes(normalizedQuote)) {
    throw new Error(`Quote ${entry.id} does not trace back to exact extracted page text.`);
  }
}

console.log(JSON.stringify({
  passed: true,
  archive: "humanity-laws-master-archive",
  sourceSha256: manifest.source.sha256,
  pageCount: manifest.source.pageCount,
  quotesChecked: quoteLibrary.quotes.length,
}));
