import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
import { runPackageScript, writeCommandLog } from "./package-runner.js";
fs.mkdirSync("logs", { recursive: true });
const result = runPackageScript("test");
writeCommandLog("logs/test.log", result);
upsertEvidence("TEST_LOG", result.status === 0, "Test command executed and test.log written.", "logs/test.log");
process.exitCode = result.status === 0 ? 0 : 1;
