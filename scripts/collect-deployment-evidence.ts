import fs from "node:fs";
import { verifyDeployment } from "../src/deployment/index.js";
import { upsertEvidence } from "./evidence-utils.js";
fs.mkdirSync("logs", { recursive: true });
const result = await verifyDeployment();
fs.writeFileSync("logs/deployment.log", JSON.stringify(result, null, 2));
upsertEvidence("DEPLOYMENT_LOG", result.passed, "Deployment verification executed.", "logs/deployment.log");
process.exitCode = result.passed ? 0 : 1;
