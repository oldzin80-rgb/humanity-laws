import crypto from "node:crypto";
import type { SparkRecord } from "./types.js";

export interface SparkRepository {
  save(record: SparkRecord): Promise<SparkRecord>;
  listByMember(memberId: string): Promise<SparkRecord[]>;
}

export class InMemorySparkRepository implements SparkRepository {
  private readonly records: SparkRecord[] = [];
  async save(record: SparkRecord): Promise<SparkRecord> { this.records.push(record); return record; }
  async listByMember(memberId: string): Promise<SparkRecord[]> { return this.records.filter((record) => record.memberId === memberId); }
}

export const LaunchV1SparkPool = [
  { pillar: "Truth", prompt: "What is one truthful next step you can take today?" },
  { pillar: "Responsibility", prompt: "What responsibility would make you stronger if you honored it cleanly?" },
  { pillar: "Dignity", prompt: "Where can you treat yourself or another person with more dignity today?" },
  { pillar: "Stewardship", prompt: "What have you been trusted with that deserves better care?" },
  { pillar: "Presence", prompt: "What would change if you gave this moment your full attention?" },
  { pillar: "Courage", prompt: "What honest action have you been delaying?" },
  { pillar: "Mercy", prompt: "Where would gentleness be stronger than judgment?" },
  { pillar: "Legacy", prompt: "What small act today would your future self respect?" },
  { pillar: "Service", prompt: "Who can you help without needing applause?" },
  { pillar: "Humility", prompt: "What can you learn before trying to prove?" },
  { pillar: "Alignment", prompt: "What needs to become simpler so your life can become truer?" },
  { pillar: "Love", prompt: "What would love do here if it were also wise?" },
] as const;

export class SparkNoRepeatService {
  constructor(private readonly repository: SparkRepository = new InMemorySparkRepository()) {}
  async nextSpark(memberId: string): Promise<SparkRecord> {
    const history = await this.repository.listByMember(memberId);
    const used = new Set(history.map((item) => item.pillar));
    const available = LaunchV1SparkPool.filter((item) => !used.has(item.pillar));
    const next = (available.length ? available : LaunchV1SparkPool)[0];
    const record: SparkRecord = { sparkId: `spark_${crypto.randomUUID()}`, memberId, pillar: next.pillar, prompt: next.prompt, createdAt: new Date().toISOString() };
    return this.repository.save(record);
  }
}
