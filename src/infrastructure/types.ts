export type ProviderKind = "DATABASE" | "PAYMENTS" | "EMAIL" | "SMS" | "STORAGE" | "AI";
export interface ProviderHealth { providerId: string; kind: ProviderKind; healthy: boolean; checkedAt: string; details?: Record<string, unknown> }
export interface ProviderAdapter { providerId: string; kind: ProviderKind; healthCheck(): Promise<ProviderHealth> }
