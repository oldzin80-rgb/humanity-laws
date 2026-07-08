import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
import { runPackageScript, writeCommandLog } from "./package-runner.js";
fs.mkdirSync("logs", { recursive: true });
const result = runPackageScript("smoke");
writeCommandLog("logs/smoke.log", result);
upsertEvidence("SMOKE_LOG", result.status === 0, "Smoke command executed and smoke.log written.", "logs/smoke.log");
process.exitCode = result.status === 0 ? 0 : 1;
