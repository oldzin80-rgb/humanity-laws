export const HUMANITY_LAWS_BOOK_SOURCE_REGISTRY = Object.freeze({
  archiveName: "humanity-laws-master-archive",
  version: "1.2",
  createdAt: "2026-07-01T18:28:52.875407+00:00",
  source: {
    title: "Humanity Laws",
    originalFileName: "humanity-laws (1).pdf",
    archivedPath: "humanity-laws-master-archive/01-book-source/humanity-laws (1).pdf",
    sha256: "46fe10120c2927e3f5659ea56dc3460691dbe0d78b70c3174efb5c2b6db62c1b",
    sizeBytes: 386009,
    pageCount: 84,
    sourceModifiedAtUtc: "2026-05-30T16:05:50.180526+00:00",
  },
  artifacts: {
    extractedText: "humanity-laws-master-archive/02-book-extracted-text/humanity-laws-full-text.md",
    pagesJson: "humanity-laws-master-archive/02-book-extracted-text/humanity-laws-pages.json",
    chapterIndex: "humanity-laws-master-archive/03-book-index/chapter-index.json",
    lawIndex: "humanity-laws-master-archive/03-book-index/law-index.json",
    quoteLibrary: "humanity-laws-master-archive/04-quote-library/quote-library.json",
    conceptMap: "humanity-laws-master-archive/05-concept-map/concept-map.json",
    manifest: "humanity-laws-master-archive/06-typescript-registry/archive-manifest.json",
  },
  guardrails: [
    "Preserve the original PDF unchanged.",
    "Use exact extracted source text only for quotes.",
    "Do not paraphrase source passages as if they are quotes.",
    "Separate source text from Adam/Eve interpretation.",
  ],
} as const);

export type HumanityLawsBookSourceRegistry = typeof HUMANITY_LAWS_BOOK_SOURCE_REGISTRY;
