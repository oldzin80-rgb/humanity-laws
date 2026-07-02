import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { EvidenceBundle, EvidenceType, ObjectiveEvidence } from "../src/core/index.js";

export function readBundle(): EvidenceBundle {
  const file = path.resolve("logs/evidence.json");
  if (!fs.existsSync(file)) return { createdAt: new Date().toISOString(), workspaceRoot: process.cwd(), evidence: [] };
  return JSON.parse(fs.readFileSync(file, "utf8")) as EvidenceBundle;
}
export function writeBundle(bundle: EvidenceBundle): void {
  fs.mkdirSync("logs", { recursive: true });
  const json = JSON.stringify(bundle, null, 2);
  fs.writeFileSync("logs/evidence.json", json);
  fs.writeFileSync("logs/evidence.sha256", crypto.createHash("sha256").update(json).digest("hex"));
}
export function upsertEvidence(type: EvidenceType, passed: boolean, description: string, source: string): EvidenceBundle {
  const bundle = readBundle();
  const entry: ObjectiveEvidence = { type, passed, description, source, timestamp: new Date().toISOString() };
  const filtered = bundle.evidence.filter((item) => item.type !== type);
  const next = { ...bundle, evidence: [...filtered, entry] };
  writeBundle(next);
  return next;
}
