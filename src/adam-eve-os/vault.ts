import {
  clamp,
  defaultDependencies,
  type Domain,
  type ISODateTime,
  type Identifier,
  type SystemDependencies,
} from "./types.ts";

export type VaultSensitivity = "ordinary" | "personal" | "sacred";
export type VaultPurpose =
  | "continuity"
  | "personalization"
  | "decision_support"
  | "learning"
  | "legacy";

export interface VaultRecord {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly domain: Domain;
  readonly title: string;
  readonly content: string;
  readonly sensitivity: VaultSensitivity;
  readonly purposes: readonly VaultPurpose[];
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly expiresAt?: ISODateTime;
  readonly source: "human" | "import" | "reflection" | "system";
  readonly confidence: number;
  readonly consentVersion: number;
}

export interface EncryptedEnvelope {
  readonly id: Identifier;
  readonly ownerId: Identifier;
  readonly algorithm: "AES-GCM";
  readonly keyDerivation: "PBKDF2-SHA-256";
  readonly iterations: number;
  readonly salt: string;
  readonly iv: string;
  readonly ciphertext: string;
  readonly createdAt: ISODateTime;
}

export interface VaultAuditEvent {
  readonly id: Identifier;
  readonly at: ISODateTime;
  readonly actor: "owner" | "delegate" | "system";
  readonly action: "create" | "read" | "update" | "delete" | "export" | "deny";
  readonly recordId?: Identifier;
  readonly purpose?: VaultPurpose;
  readonly reason: string;
}

export interface VaultStorage {
  put(envelope: EncryptedEnvelope): Promise<void>;
  get(id: Identifier): Promise<EncryptedEnvelope | undefined>;
  delete(id: Identifier): Promise<boolean>;
  list(ownerId: Identifier): Promise<readonly EncryptedEnvelope[]>;
}

export class InMemoryVaultStorage implements VaultStorage {
  #items = new Map<Identifier, EncryptedEnvelope>();

  async put(envelope: EncryptedEnvelope): Promise<void> {
    this.#items.set(envelope.id, envelope);
  }

  async get(id: Identifier): Promise<EncryptedEnvelope | undefined> {
    return this.#items.get(id);
  }

  async delete(id: Identifier): Promise<boolean> {
    return this.#items.delete(id);
  }

  async list(ownerId: Identifier): Promise<readonly EncryptedEnvelope[]> {
    return [...this.#items.values()].filter((item) => item.ownerId === ownerId);
  }
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  if (passphrase.length < 12) {
    throw new Error("Vault passphrases must contain at least 12 characters.");
  }
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export class SovereignMemoryVault {
  #storage: VaultStorage;
  #deps: SystemDependencies;
  #audit: VaultAuditEvent[] = [];
  #consentVersion = new Map<Identifier, number>();

  constructor(
    storage: VaultStorage = new InMemoryVaultStorage(),
    dependencies: SystemDependencies = defaultDependencies,
  ) {
    this.#storage = storage;
    this.#deps = dependencies;
  }

  setConsentVersion(ownerId: Identifier, version: number): void {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error("Consent version must be a positive integer.");
    }
    this.#consentVersion.set(ownerId, version);
  }

  async remember(
    passphrase: string,
    input: Omit<VaultRecord, "id" | "createdAt" | "updatedAt" | "confidence" | "consentVersion"> & {
      confidence?: number;
    },
  ): Promise<VaultRecord> {
    const now = this.#deps.clock.now().toISOString();
    const record: VaultRecord = Object.freeze({
      ...input,
      id: this.#deps.ids.create("memory"),
      title: input.title.trim(),
      content: input.content.trim(),
      createdAt: now,
      updatedAt: now,
      confidence: clamp(input.confidence ?? 1),
      consentVersion: this.#consentVersion.get(input.ownerId) ?? 1,
    });
    if (!record.title || !record.content || record.purposes.length === 0) {
      throw new Error("A memory requires a title, content, and at least one allowed purpose.");
    }
    await this.#storage.put(await this.#encrypt(passphrase, record));
    this.#log("owner", "create", record.id, "Memory encrypted under owner-controlled credentials.");
    return record;
  }

  async recall(
    ownerId: Identifier,
    passphrase: string,
    purpose: VaultPurpose,
  ): Promise<readonly VaultRecord[]> {
    const now = this.#deps.clock.now().getTime();
    const records: VaultRecord[] = [];
    for (const envelope of await this.#storage.list(ownerId)) {
      const record = await this.#decrypt(passphrase, envelope);
      if (record.expiresAt && new Date(record.expiresAt).getTime() <= now) {
        await this.#storage.delete(record.id);
        this.#log("system", "delete", record.id, "Memory expired under its owner-defined rule.");
        continue;
      }
      if (!record.purposes.includes(purpose)) {
        this.#log("system", "deny", record.id, `Purpose “${purpose}” was not consented.`);
        continue;
      }
      records.push(record);
      this.#log("owner", "read", record.id, `Read for consented purpose “${purpose}”.`);
    }
    return records;
  }

  async forget(ownerId: Identifier, recordId: Identifier): Promise<boolean> {
    const envelope = await this.#storage.get(recordId);
    if (!envelope || envelope.ownerId !== ownerId) return false;
    const deleted = await this.#storage.delete(recordId);
    if (deleted) this.#log("owner", "delete", recordId, "Owner exercised the right to forget.");
    return deleted;
  }

  async forgetAll(ownerId: Identifier): Promise<number> {
    const items = await this.#storage.list(ownerId);
    const results = await Promise.all(items.map((item) => this.#storage.delete(item.id)));
    const count = results.filter(Boolean).length;
    this.#log("owner", "delete", undefined, `Owner deleted ${count} encrypted memories.`);
    return count;
  }

  async export(ownerId: Identifier, passphrase: string): Promise<string> {
    const records: VaultRecord[] = [];
    for (const envelope of await this.#storage.list(ownerId)) {
      records.push(await this.#decrypt(passphrase, envelope));
    }
    this.#log("owner", "export", undefined, "Owner exported a portable plaintext archive.");
    return JSON.stringify({ ownerId, exportedAt: this.#deps.clock.now().toISOString(), records }, null, 2);
  }

  get auditLog(): readonly VaultAuditEvent[] {
    return [...this.#audit];
  }

  async #encrypt(passphrase: string, record: VaultRecord): Promise<EncryptedEnvelope> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const iterations = 310_000;
    const key = await deriveKey(passphrase, salt, iterations);
    const additionalData = encoder.encode(`${record.ownerId}:${record.id}`);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv as BufferSource, additionalData: additionalData as BufferSource },
      key,
      encoder.encode(JSON.stringify(record)),
    );
    return Object.freeze({
      id: record.id,
      ownerId: record.ownerId,
      algorithm: "AES-GCM",
      keyDerivation: "PBKDF2-SHA-256",
      iterations,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
      createdAt: record.createdAt,
    });
  }

  async #decrypt(passphrase: string, envelope: EncryptedEnvelope): Promise<VaultRecord> {
    const key = await deriveKey(passphrase, base64ToBytes(envelope.salt), envelope.iterations);
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(envelope.iv) as BufferSource,
        additionalData: encoder.encode(`${envelope.ownerId}:${envelope.id}`) as BufferSource,
      },
      key,
      base64ToBytes(envelope.ciphertext) as BufferSource,
    );
    return JSON.parse(decoder.decode(plaintext)) as VaultRecord;
  }

  #log(
    actor: VaultAuditEvent["actor"],
    action: VaultAuditEvent["action"],
    recordId: Identifier | undefined,
    reason: string,
  ): void {
    this.#audit.push(
      Object.freeze({
        id: this.#deps.ids.create("audit"),
        at: this.#deps.clock.now().toISOString(),
        actor,
        action,
        recordId,
        reason,
      }),
    );
  }
}
