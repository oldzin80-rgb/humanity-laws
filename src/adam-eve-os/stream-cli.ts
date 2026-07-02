import { resolve } from "node:path";
import { createMagnificentSystem } from "./system.ts";
import { loadNickStreamConfig, NickStreamEngine } from "./stream.ts";

const args = process.argv.slice(2);
const command = args[0] ?? "scan";
const configPath = resolve(args[1] ?? "../nick-stream/stream.config.json");
const config = await loadNickStreamConfig(configPath);
const system = createMagnificentSystem();
const stream = new NickStreamEngine(config, system.inheritance);

if (command === "init") {
  await stream.initialize();
  console.log(JSON.stringify({ status: "initialized", root: config.root }));
} else if (command === "scan") {
  await stream.initialize();
  console.log(JSON.stringify(await stream.scan(), null, 2));
} else if (command === "watch") {
  await stream.start();
  console.log(
    JSON.stringify({
      status: "watching",
      folders: config.watchedFolders.filter((folder) => folder.enabled).map((folder) => folder.path),
    }),
  );
  const stop = (): void => {
    stream.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
} else {
  throw new Error(`Unknown command: ${command}. Use init, scan, or watch.`);
}

