import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
import { runPackageScript, writeCommandLog } from "./package-runner.js";
fs.mkdirSync("logs", { recursive: true });
const result = runPackageScript("build");
writeCommandLog("logs/build.log", result);
const bundle = upsertEvidence("BUILD_LOG", result.status === 0, "Build command executed and build.log written.", "logs/build.log");
console.log(JSON.stringify(bundle.evidence.find((e) => e.type === "BUILD_LOG"), null, 2));
process.exitCode = result.status === 0 ? 0 : 1;
