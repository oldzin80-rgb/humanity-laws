export interface ServiceToken<T = unknown> { key: string; description: string }
export interface RegisteredService<T = unknown> { token: ServiceToken<T>; instance: T; registeredAt: string }
export class ServiceContainer {
  private readonly services = new Map<string, RegisteredService>();
  register<T>(token: ServiceToken<T>, instance: T): void { if (this.services.has(token.key)) throw new Error(`Service already registered: ${token.key}`); this.services.set(token.key, { token, instance, registeredAt: new Date().toISOString() }); }
  resolve<T>(token: ServiceToken<T>): T { const service = this.services.get(token.key); if (!service) throw new Error(`Service not registered: ${token.key}`); return service.instance as T; }
  has<T>(token: ServiceToken<T>): boolean { return this.services.has(token.key); }
  list(): RegisteredService[] { return [...this.services.values()]; }
}
