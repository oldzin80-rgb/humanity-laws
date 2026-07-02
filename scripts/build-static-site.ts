import { exportStaticSite } from "../src/application/staticSiteExporter.js";

const result = await exportStaticSite("dist");

console.log(
  JSON.stringify(
    {
      staticSiteBuilt: true,
      outputDir: result.outputDir,
      files: result.files.length,
      launchReady: false,
    },
    null,
    2,
  ),
);

