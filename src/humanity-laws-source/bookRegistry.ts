import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { HUMANITY_LAWS_BOOK_SOURCE_REGISTRY } from "../../humanity-laws-master-archive/06-typescript-registry/humanity-laws-source-registry.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const readArchiveJson = <T>(relativePath: string): T =>
  JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8")) as T;

export interface HumanityLawsArchiveManifest {
  readonly archiveName: string;
  readonly version: string;
  readonly source: {
    readonly archivedPath: string;
    readonly sha256: string;
    readonly sizeBytes: number;
    readonly pageCount: number;
  };
}

export interface HumanityLawsLawIndex {
  readonly sourceSha256: string;
  readonly laws: readonly {
    readonly id: string;
    readonly title: string;
    readonly page: number;
    readonly line: number;
    readonly sourceText: string;
  }[];
}

export interface HumanityLawsQuoteLibrary {
  readonly sourceSha256: string;
  readonly quotes: readonly {
    readonly id: string;
    readonly page: number;
    readonly line: number;
    readonly quote: string;
    readonly themes: readonly string[];
    readonly sourceSha256: string;
  }[];
}

export const getHumanityLawsBookRegistry = () => HUMANITY_LAWS_BOOK_SOURCE_REGISTRY;

export const getHumanityLawsArchiveManifest = (): HumanityLawsArchiveManifest =>
  readArchiveJson<HumanityLawsArchiveManifest>(
    HUMANITY_LAWS_BOOK_SOURCE_REGISTRY.artifacts.manifest,
  );

export const getHumanityLawsLawIndex = (): HumanityLawsLawIndex =>
  readArchiveJson<HumanityLawsLawIndex>(
    HUMANITY_LAWS_BOOK_SOURCE_REGISTRY.artifacts.lawIndex,
  );

export const getHumanityLawsQuoteLibrary = (): HumanityLawsQuoteLibrary =>
  readArchiveJson<HumanityLawsQuoteLibrary>(
    HUMANITY_LAWS_BOOK_SOURCE_REGISTRY.artifacts.quoteLibrary,
  );

export const verifyHumanityLawsArchiveAlignment = (): boolean => {
  const registry = getHumanityLawsBookRegistry();
  const manifest = getHumanityLawsArchiveManifest();
  const lawIndex = getHumanityLawsLawIndex();
  const quoteLibrary = getHumanityLawsQuoteLibrary();
  return (
    manifest.source.sha256 === registry.source.sha256 &&
    lawIndex.sourceSha256 === registry.source.sha256 &&
    quoteLibrary.sourceSha256 === registry.source.sha256 &&
    quoteLibrary.quotes.every((quote) => quote.sourceSha256 === registry.source.sha256)
  );
};
