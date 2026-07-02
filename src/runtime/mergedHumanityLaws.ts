import {
  ProfessionalBoundaryRouter,
  SourceLedger,
  createMagnificentSystem,
} from "../adam-eve-os/index.ts";
import {
  getHumanityLawsArchiveManifest,
  getHumanityLawsBookRegistry,
} from "../humanity-laws-source/bookRegistry.ts";

export const createMergedHumanityLawsRuntime = () => {
  const adamEve = createMagnificentSystem();
  const professionalBoundaries = new ProfessionalBoundaryRouter();
  const sourceLedger = new SourceLedger();
  const bookRegistry = getHumanityLawsBookRegistry();
  const archiveManifest = getHumanityLawsArchiveManifest();

  sourceLedger.add({
    id: "humanity-laws-book",
    title: "Humanity Laws",
    kind: "book",
    localPath: bookRegistry.source.archivedPath,
    hash: bookRegistry.source.sha256,
    retrievedAt: bookRegistry.createdAt,
  });

  return Object.freeze({
    adamEve,
    professionalBoundaries,
    sourceLedger,
    bookRegistry,
    archiveManifest,
    launchReadinessMustRemainEvidenceDerived: true,
  });
};
