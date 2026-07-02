import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { upsertEvidence } from "./evidence-utils.js";
fs.mkdirSync("logs", { recursive: true });
const result = spawnSync("npm", ["run", "build"], { encoding: "utf8", shell: process.platform === "win32" });
fs.writeFileSync("logs/build.log", `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
const bundle = upsertEvidence("BUILD_LOG", result.status === 0, "Build command executed and build.log written.", "logs/build.log");
console.log(JSON.stringify(bundle.evidence.find((e) => e.type === "BUILD_LOG"), null, 2));
process.exitCode = result.status === 0 ? 0 : 1;
