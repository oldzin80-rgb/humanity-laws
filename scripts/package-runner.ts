import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function packageRunner(): "pnpm" | "npm" {
  const npm = spawnSync("npm", ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
  if (npm.status === 0) return "npm";

  const pnpm = spawnSync("pnpm", ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
  if (pnpm.status === 0) return "pnpm";

  return "npm";
}

export function runPackageScript(script: string): ReturnType<typeof spawnSync> {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
    scripts?: Record<string, string>;
  };
  const command = packageJson.scripts?.[script];
  if (!command) {
    return spawnSync("node", ["-e", `throw new Error("Missing package script: ${script}")`], {
      encoding: "utf8",
      shell: process.platform === "win32",
    });
  }

  const localBin = path.resolve("node_modules", ".bin");
  return spawnSync(command, {
    encoding: "utf8",
    shell: true,
    env: {
      ...process.env,
      PATH: `${localBin}${path.delimiter}${process.env.PATH ?? ""}`,
    },
  });
}

export function writeCommandLog(path: string, result: ReturnType<typeof spawnSync>): void {
  fs.writeFileSync(path, `${result.stdout ?? ""}\n${result.stderr ?? ""}`);
}
