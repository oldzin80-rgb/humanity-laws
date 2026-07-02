export interface Entity { id: string; createdAt: string; updatedAt: string }
export interface Repository<T extends Entity> { findById(id: string): Promise<T | null>; save(entity: T): Promise<T>; list(): Promise<T[]> }
export class InMemoryRepository<T extends Entity> implements Repository<T> {
  private readonly records = new Map<string, T>();
  async findById(id: string): Promise<T | null> { return this.records.get(id) ?? null; }
  async save(entity: T): Promise<T> { const saved = { ...entity, updatedAt: new Date().toISOString() }; this.records.set(entity.id, saved); return saved; }
  async list(): Promise<T[]> { return [...this.records.values()]; }
}
