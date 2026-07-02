import crypto from "node:crypto";
import type { MemoryRecord } from "./types.js";

export interface MemoryRepository {
  save(record: MemoryRecord): Promise<MemoryRecord>;
  listByMember(memberId: string): Promise<MemoryRecord[]>;
  delete(memoryId: string): Promise<boolean>;
}

export class InMemoryMemoryRepository implements MemoryRepository {
  private readonly records: MemoryRecord[] = [];
  async save(record: MemoryRecord): Promise<MemoryRecord> { this.records.push(record); return record; }
  async listByMember(memberId: string): Promise<MemoryRecord[]> { return this.records.filter((record) => record.memberId === memberId); }
  async delete(memoryId: string): Promise<boolean> {
    const index = this.records.findIndex((record) => record.memoryId === memoryId);
    if (index === -1) return false;
    this.records.splice(index, 1);
    return true;
  }
}

export class MemoryPersistenceService {
  constructor(private readonly repository: MemoryRepository = new InMemoryMemoryRepository()) {}
  async remember(memberId: string, content: string, tags: string[] = [], consentToRemember = false): Promise<MemoryRecord | null> {
    if (!consentToRemember) return null;
    const record = { memoryId: `memory_${crypto.randomUUID()}`, memberId, content, tags, createdAt: new Date().toISOString(), consentToRemember };
    return this.repository.save(record);
  }
  async list(memberId: string): Promise<MemoryRecord[]> { return this.repository.listByMember(memberId); }
  async export(memberId: string): Promise<MemoryRecord[]> { return this.list(memberId); }
  async delete(memoryId: string): Promise<boolean> { return this.repository.delete(memoryId); }
}
