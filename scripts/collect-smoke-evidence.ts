import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
fs.mkdirSync("logs", { recursive: true });
const result = spawnSync("npm", ["run", "smoke"], { encoding: "utf8", shell: process.platform === "win32" });
fs.writeFileSync("logs/smoke.log", `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
upsertEvidence("SMOKE_LOG", result.status === 0, "Smoke command executed and smoke.log written.", "logs/smoke.log");
process.exitCode = result.status === 0 ? 0 : 1;
