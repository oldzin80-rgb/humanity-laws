import { readBundle } from "./evidence-utils.js";
import { createReleaseReadinessReport } from "../src/core/index.js";
const report = createReleaseReadinessReport(readBundle());
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.launchReady ? 0 : 1;
