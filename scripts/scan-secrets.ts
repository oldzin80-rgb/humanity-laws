import {execFileSync} from "node:child_process";

const files = execFileSync("git", ["ls-files"], {encoding: "utf8"})
  .trim().split("\n").filter(Boolean)
  .filter(file => !/\.(pdf|png|jpg|jpeg|gif|webp|lock)$/i.test(file));
const patterns = [
  /\bsk_live_[A-Za-z0-9]{12,}\b/,
  /\bSG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /\bAC[a-fA-F0-9]{32}\b/,
  /(?:API_KEY_SECRET|SERVICE_ROLE_KEY|SECRET_KEY)\s*[:=]\s*["'][A-Za-z0-9_+./=-]{24,}["']/,
];
const findings: string[] = [];
for (const file of files) {
  let content = "";
  try { content = execFileSync("git", ["show", `:${file}`], {encoding: "utf8", maxBuffer: 10_000_000}); }
  catch { continue; }
  if (patterns.some(pattern => pattern.test(content))) findings.push(file);
}
if (findings.length) {
  console.error(`Secret scan failed: ${findings.join(", ")}`);
  process.exit(1);
}
console.log(`Secret scan passed (${files.length} tracked text files inspected).`);
