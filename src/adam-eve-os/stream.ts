import { watch, type FSWatcher } from "node:fs";
import { access, appendFile, copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";
import {
  type InheritanceEntry,
  type InheritancePurpose,
  type InheritanceSegment,
  type InheritanceSourceKind,
  SoulInheritanceEngine,
} from "./inheritance.ts";
import {
  defaultDependencies,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type StreamCategory =
  | "book"
  | "conversations"
  | "podcast"
  | "morning-writings"
  | "journals"
  | "phone-recordings"
  | "speeches"
  | "creative-work"
  | "corrections"
  | "other";

export interface WatchedFolder {
  readonly path: string;
  readonly category: StreamCategory;
  readonly enabled: boolean;
  readonly recursive?: boolean;
}

export interface NickStreamConfig {
  readonly ownerId: Identifier;
  readonly root: string;
  readonly watchedFolders: readonly WatchedFolder[];
  readonly consentToAnalyzeByDefault: boolean;
  readonly consentToQuoteByDefault: boolean;
  readonly purposes: readonly InheritancePurpose[];
  readonly scanIntervalMs: number;
  readonly copyOriginals: boolean;
}

export interface StreamLedgerRecord {
  readonly id: Identifier;
  readonly at: ISODateTime;
  readonly sourcePath: string;
  readonly relativePath: string;
  readonly category: StreamCategory;
  readonly contentHash?: string;
  readonly entryId?: Identifier;
  readonly status:
    | "ingested"
    | "duplicate"
    | "queued_for_transcription"
    | "queued_for_extraction"
    | "unsupported"
    | "failed";
  readonly message: string;
}

export interface StreamScanReport {
  readonly scanned: number;
  readonly ingested: number;
  readonly duplicates: number;
  readonly queued: number;
  readonly failed: number;
  readonly records: readonly StreamLedgerRecord[];
}

const TEXT_EXTENSIONS = new Set([".txt", ".md", ".markdown", ".json", ".jsonl", ".srt", ".vtt"]);
const AUDIO_VIDEO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".wav",
  ".aac",
  ".flac",
  ".mp4",
  ".mov",
  ".mkv",
]);
const DOCUMENT_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".pages", ".rtf"]);

const categoryToKind = (category: StreamCategory): InheritanceSourceKind => {
  switch (category) {
    case "conversations":
      return "conversation";
    case "podcast":
      return "podcast";
    case "morning-writings":
      return "morning_writing";
    case "journals":
      return "journal";
    case "speeches":
      return "speech";
    case "creative-work":
    case "book":
      return "creative_work";
    case "corrections":
      return "correction";
    default:
      return "other";
  }
};

const encoder = new TextEncoder();

async function sha256(value: Uint8Array | string): Promise<string> {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function stripCaptions(text: string): string {
  return text
    .replace(/^WEBVTT.*$/gim, "")
    .replace(/^\d+\s*$/gm, "")
    .replace(/^\d{2}:\d{2}:\d{2}[,.\d]*\s+-->\s+\d{2}:\d{2}:\d{2}[,.\d]*.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractChatGPTExport(value: unknown): InheritanceSegment[] {
  if (!Array.isArray(value)) return [];
  const segments: InheritanceSegment[] = [];
  for (const conversation of value) {
    if (!conversation || typeof conversation !== "object") continue;
    const mapping = (conversation as { mapping?: Record<string, unknown> }).mapping;
    if (!mapping || typeof mapping !== "object") continue;
    for (const node of Object.values(mapping)) {
      const message = (node as {
        message?: {
          id?: string;
          author?: { role?: string; name?: string };
          content?: { parts?: unknown[] };
          create_time?: number;
        };
      }).message;
      const parts = message?.content?.parts;
      if (!message || !Array.isArray(parts)) continue;
      const words = parts.filter((part): part is string => typeof part === "string").join("\n").trim();
      if (!words) continue;
      const role = message.author?.name ?? message.author?.role ?? "unknown";
      segments.push({
        id: message.id ?? `chat-segment-${segments.length + 1}`,
        speaker: role === "user" ? "Nick" : role === "assistant" ? "ChatGPT" : role,
        words,
        occurredAt:
          typeof message.create_time === "number"
            ? new Date(message.create_time * 1000).toISOString()
            : undefined,
      });
    }
  }
  return segments;
}

function extractGenericJson(value: unknown): InheritanceSegment[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      if (typeof item === "string") {
        return [{ id: `json-${index + 1}`, speaker: "Nick", words: item }];
      }
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      const words = [record.text, record.content, record.words, record.message].find(
        (candidate): candidate is string => typeof candidate === "string",
      );
      if (!words) return [];
      return [
        {
          id: String(record.id ?? `json-${index + 1}`),
          speaker: String(record.speaker ?? record.author ?? "Nick"),
          words,
          occurredAt:
            typeof record.occurredAt === "string"
              ? record.occurredAt
              : typeof record.createdAt === "string"
                ? record.createdAt
                : undefined,
        },
      ];
    });
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const words = [record.text, record.content, record.words].find(
      (candidate): candidate is string => typeof candidate === "string",
    );
    if (words) return [{ id: "json-1", speaker: String(record.speaker ?? "Nick"), words }];
  }
  return [];
}

async function readSegments(path: string): Promise<{
  exactText: string;
  segments: readonly InheritanceSegment[];
}> {
  const extension = extname(path).toLocaleLowerCase();
  const raw = await readFile(path, "utf8");
  if (extension === ".srt" || extension === ".vtt") {
    const exactText = stripCaptions(raw);
    return {
      exactText,
      segments: [{ id: "transcript-1", speaker: "Nick", words: exactText }],
    };
  }
  if (extension === ".json" || extension === ".jsonl") {
    const parsed =
      extension === ".jsonl"
        ? raw
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line) => JSON.parse(line) as unknown)
        : (JSON.parse(raw) as unknown);
    const chatSegments = extractChatGPTExport(parsed);
    const segments = chatSegments.length > 0 ? chatSegments : extractGenericJson(parsed);
    const exactText =
      segments.length > 0
        ? segments.map((segment) => `${segment.speaker}: ${segment.words}`).join("\n\n")
        : raw;
    return { exactText, segments };
  }
  return {
    exactText: raw.trim(),
    segments: [{ id: "text-1", speaker: "Nick", words: raw.trim() }],
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(path: string, recursive = true): Promise<string[]> {
  if (!(await fileExists(path))) return [];
  const items = await readdir(path, { withFileTypes: true });
  const files: string[] = [];
  for (const item of items) {
    if (item.name.startsWith(".")) continue;
    const full = join(path, item.name);
    if (item.isFile()) files.push(full);
    else if (recursive && item.isDirectory()) files.push(...(await listFiles(full, true)));
  }
  return files;
}

export class NickStreamEngine {
  readonly inheritance: SoulInheritanceEngine;
  readonly config: NickStreamConfig;

  #deps: SystemDependencies;
  #knownHashes = new Set<string>();
  #watchers: FSWatcher[] = [];
  #debounce?: ReturnType<typeof setTimeout>;

  constructor(
    config: NickStreamConfig,
    inheritance = new SoulInheritanceEngine(),
    dependencies: SystemDependencies = defaultDependencies,
  ) {
    this.config = Object.freeze({ ...config, root: resolve(config.root) });
    this.inheritance = inheritance;
    this.#deps = dependencies;
  }

  async initialize(): Promise<void> {
    const directories = [
      this.config.root,
      join(this.config.root, "inbox"),
      join(this.config.root, "library"),
      join(this.config.root, "ledger"),
      join(this.config.root, "queue", "transcription"),
      join(this.config.root, "queue", "extraction"),
      join(this.config.root, "archive"),
      ...this.config.watchedFolders
        .filter((folder) => folder.path.startsWith(this.config.root))
        .map((folder) => folder.path),
    ];
    await Promise.all(directories.map((directory) => mkdir(directory, { recursive: true })));
    const ledgerPath = join(this.config.root, "ledger", "stream.jsonl");
    if (await fileExists(ledgerPath)) {
      const records = (await readFile(ledgerPath, "utf8"))
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line) as StreamLedgerRecord);
      records.forEach((record) => {
        if (record.contentHash) this.#knownHashes.add(record.contentHash);
      });
    }
    const corpus = await this.loadCorpus();
    await this.inheritance.restore(corpus);
  }

  async scan(): Promise<StreamScanReport> {
    const records: StreamLedgerRecord[] = [];
    for (const folder of this.config.watchedFolders.filter((item) => item.enabled)) {
      for (const path of await listFiles(resolve(folder.path), folder.recursive !== false)) {
        if (/^readme(\.[^.]+)?$/i.test(basename(path))) continue;
        if (path.includes(`${join(this.config.root, "library")}`)) continue;
        if (path.includes(`${join(this.config.root, "ledger")}`)) continue;
        const record = await this.ingestFile(path, folder.category);
        records.push(record);
      }
    }
    return Object.freeze({
      scanned: records.length,
      ingested: records.filter((record) => record.status === "ingested").length,
      duplicates: records.filter((record) => record.status === "duplicate").length,
      queued: records.filter((record) =>
        ["queued_for_transcription", "queued_for_extraction"].includes(record.status),
      ).length,
      failed: records.filter((record) =>
        ["failed", "unsupported"].includes(record.status),
      ).length,
      records,
    });
  }

  async ingestFile(path: string, category: StreamCategory): Promise<StreamLedgerRecord> {
    const absolute = resolve(path);
    const extension = extname(absolute).toLocaleLowerCase();
    const bytes = new Uint8Array(await readFile(absolute));
    const contentHash = await sha256(bytes);
    if (this.#knownHashes.has(contentHash)) {
      return this.#record(absolute, category, "duplicate", "Content hash already exists.", contentHash);
    }

    try {
      if (AUDIO_VIDEO_EXTENSIONS.has(extension)) {
        await this.#queueOriginal(absolute, "transcription");
        this.#knownHashes.add(contentHash);
        return this.#record(
          absolute,
          category,
          "queued_for_transcription",
          "Audio/video queued. Connect a transcription provider to complete ingestion.",
          contentHash,
        );
      }
      if (DOCUMENT_EXTENSIONS.has(extension)) {
        await this.#queueOriginal(absolute, "extraction");
        this.#knownHashes.add(contentHash);
        return this.#record(
          absolute,
          category,
          "queued_for_extraction",
          "Document queued. PDF/Word extraction must be connected before inheritance analysis.",
          contentHash,
        );
      }
      if (!TEXT_EXTENSIONS.has(extension)) {
        return this.#record(
          absolute,
          category,
          "unsupported",
          `Unsupported extension: ${extension || "(none)"}.`,
          contentHash,
        );
      }

      const { exactText, segments } = await readSegments(absolute);
      if (!exactText.trim()) {
        return this.#record(absolute, category, "failed", "No text could be extracted.", contentHash);
      }
      const sourceStats = await stat(absolute);
      const entry = await this.inheritance.ingest({
        ownerId: this.config.ownerId,
        kind: categoryToKind(category),
        title: basename(absolute, extension),
        occurredAt: sourceStats.birthtime.toISOString(),
        sourceUri: absolute,
        participants: [...new Set(segments.map((segment) => segment.speaker))],
        segments,
        exactText,
        language: "en",
        purposes: this.config.purposes,
        consentToAnalyze: this.config.consentToAnalyzeByDefault,
        consentToQuote: this.config.consentToQuoteByDefault,
        sensitivity: "sacred",
        notes: `Automatically ingested from ${category}. Original hash: ${contentHash}.`,
      });
      await this.#persistEntry(entry, category);
      if (this.config.copyOriginals) await this.#archiveOriginal(absolute, category, contentHash);
      this.#knownHashes.add(contentHash);
      return this.#record(
        absolute,
        category,
        "ingested",
        "Source preserved and added to Soul Inheritance.",
        contentHash,
        entry.id,
      );
    } catch (error) {
      return this.#record(
        absolute,
        category,
        "failed",
        error instanceof Error ? error.message : String(error),
        contentHash,
      );
    }
  }

  async loadCorpus(): Promise<readonly InheritanceEntry[]> {
    const library = join(this.config.root, "library");
    const files = (await listFiles(library, true)).filter((path) => path.endsWith(".json"));
    const entries: InheritanceEntry[] = [];
    for (const path of files) {
      entries.push(JSON.parse(await readFile(path, "utf8")) as InheritanceEntry);
    }
    return entries;
  }

  async start(): Promise<void> {
    await this.initialize();
    await this.scan();
    for (const folder of this.config.watchedFolders.filter((item) => item.enabled)) {
      if (!(await fileExists(folder.path))) continue;
      const watcher = watch(
        resolve(folder.path),
        { recursive: folder.recursive !== false },
        () => {
          if (this.#debounce) clearTimeout(this.#debounce);
          this.#debounce = setTimeout(() => {
            void this.scan();
          }, 750);
        },
      );
      this.#watchers.push(watcher);
    }
  }

  stop(): void {
    this.#watchers.forEach((watcher) => watcher.close());
    this.#watchers = [];
    if (this.#debounce) clearTimeout(this.#debounce);
  }

  async #persistEntry(entry: InheritanceEntry, category: StreamCategory): Promise<void> {
    const directory = join(this.config.root, "library", category);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, `${entry.contentHash}.json`), JSON.stringify(entry, null, 2));
  }

  async #archiveOriginal(path: string, category: StreamCategory, hash: string): Promise<void> {
    const directory = join(this.config.root, "archive", category);
    await mkdir(directory, { recursive: true });
    const destination = join(directory, `${hash.slice(0, 12)}-${basename(path)}`);
    if (!(await fileExists(destination))) await copyFile(path, destination);
  }

  async #queueOriginal(path: string, queue: "transcription" | "extraction"): Promise<void> {
    const directory = join(this.config.root, "queue", queue);
    await mkdir(directory, { recursive: true });
    const destination = join(directory, basename(path));
    if (!(await fileExists(destination))) await copyFile(path, destination);
  }

  async #record(
    sourcePath: string,
    category: StreamCategory,
    status: StreamLedgerRecord["status"],
    message: string,
    contentHash?: string,
    entryId?: Identifier,
  ): Promise<StreamLedgerRecord> {
    const record: StreamLedgerRecord = Object.freeze({
      id: this.#deps.ids.create("stream"),
      at: this.#deps.clock.now().toISOString(),
      sourcePath,
      relativePath: relative(this.config.root, sourcePath),
      category,
      contentHash,
      entryId,
      status,
      message,
    });
    await mkdir(join(this.config.root, "ledger"), { recursive: true });
    await appendFile(
      join(this.config.root, "ledger", "stream.jsonl"),
      `${JSON.stringify(record)}\n`,
    );
    return record;
  }
}

export async function loadNickStreamConfig(path: string): Promise<NickStreamConfig> {
  const config = JSON.parse(await readFile(resolve(path), "utf8")) as NickStreamConfig;
  return Object.freeze({
    ...config,
    root: resolve(config.root),
    watchedFolders: config.watchedFolders.map((folder) => ({
      ...folder,
      path: resolve(folder.path),
    })),
  });
}
