import {
  getHumanityLawsArchiveManifest,
  getHumanityLawsBookRegistry,
  getHumanityLawsLawIndex,
  getHumanityLawsQuoteLibrary,
  verifyHumanityLawsArchiveAlignment,
} from "../../src/humanity-laws-source/bookRegistry.ts";

const registry = getHumanityLawsBookRegistry();
const manifest = getHumanityLawsArchiveManifest();
const lawIndex = getHumanityLawsLawIndex();
const quoteLibrary = getHumanityLawsQuoteLibrary();

if (registry.source.sha256 !== manifest.source.sha256) {
  throw new Error("Book registry hash does not match archive manifest.");
}

if (manifest.source.pageCount !== 84) {
  throw new Error("Expected the archived Humanity Laws edition to have 84 pages.");
}

if (lawIndex.laws.length < 12) {
  throw new Error("Law index should contain the Humanity Laws.");
}

if (quoteLibrary.quotes.length === 0) {
  throw new Error("Quote library should contain exact source-traceable entries.");
}

if (!verifyHumanityLawsArchiveAlignment()) {
  throw new Error("Humanity Laws archive registry is not aligned.");
}

console.log(JSON.stringify({
  passed: true,
  sourceSha256: registry.source.sha256,
  pageCount: manifest.source.pageCount,
  laws: lawIndex.laws.length,
  quotes: quoteLibrary.quotes.length,
}));
