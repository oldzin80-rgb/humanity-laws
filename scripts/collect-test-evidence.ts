import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
fs.mkdirSync("logs", { recursive: true });
const result = spawnSync("npm", ["test"], { encoding: "utf8", shell: process.platform === "win32" });
fs.writeFileSync("logs/test.log", `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
upsertEvidence("TEST_LOG", result.status === 0, "Test command executed and test.log written.", "logs/test.log");
process.exitCode = result.status === 0 ? 0 : 1;
