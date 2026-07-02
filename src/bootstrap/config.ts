export type AppEnvironment = "development" | "test" | "production";
export interface AppConfig { environment: AppEnvironment; publicAppUrl: string; deploymentUrl: string; supabaseUrl: string | undefined; stripeEnabled: boolean }
export function loadAppConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  return { environment: (env.NODE_ENV as AppEnvironment) ?? "development", publicAppUrl: env.PUBLIC_APP_URL ?? "http://localhost:3000", deploymentUrl: env.DEPLOYMENT_URL ?? "http://localhost:3000", supabaseUrl: env.SUPABASE_URL, stripeEnabled: Boolean(env.STRIPE_SECRET_KEY) };
}
