export type ReadinessState = "READY" | "IN_PROGRESS" | "BLOCKED";

export interface EnvironmentReadinessItem {
  key: string;
  objective: string;
  configured: boolean;
  required: boolean;
  secret: boolean;
  status: ReadinessState;
  details: string[];
}

export interface EnvironmentReadinessReport {
  target: "staging" | "production";
  checkedAt: string;
  ready: boolean;
  status: ReadinessState;
  items: EnvironmentReadinessItem[];
  blockers: string[];
}

interface EnvironmentRequirement {
  key: string;
  objective: string;
  secret?: boolean;
  required?: boolean;
  validate?: (value: string) => string | null;
}

const urlValidator = (label: string) => (value: string): string | null => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? null : `${label} must use http or https.`;
  } catch {
    return `${label} must be a valid URL.`;
  }
};

const REQUIREMENTS: EnvironmentRequirement[] = [
  { key: "PUBLIC_APP_URL", objective: "Public app URL is known for redirects and generated links.", validate: urlValidator("PUBLIC_APP_URL") },
  { key: "DEPLOYMENT_URL", objective: "Staging deployment URL is available for route verification.", validate: urlValidator("DEPLOYMENT_URL") },
  { key: "SUPABASE_URL", objective: "Supabase project URL is configured.", validate: urlValidator("SUPABASE_URL") },
  { key: "SUPABASE_ANON_KEY", objective: "Supabase anonymous key is configured.", secret: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", objective: "Supabase service role key is configured for trusted server operations.", secret: true },
  { key: "STRIPE_SECRET_KEY", objective: "Stripe server key is configured.", secret: true },
  { key: "STRIPE_WEBHOOK_SECRET", objective: "Stripe webhook verification secret is configured.", secret: true },
  { key: "STRIPE_MONTHLY_7_PRICE_ID", objective: "Monthly membership price is configured.", secret: false },
  { key: "STRIPE_YEARLY_70_PRICE_ID", objective: "Yearly membership price is configured.", secret: false },
  { key: "STRIPE_DIGITAL_BOOK_PRICE_ID", objective: "Digital book-only price is configured.", secret: false },
  { key: "EMAIL_PROVIDER", objective: "Email delivery provider is selected for account and support messages." },
  { key: "ERROR_LOGGING_DSN", objective: "Error reporting destination is configured.", secret: true },
  { key: "MONITORING_ENDPOINT", objective: "Monitoring endpoint or dashboard target is configured.", secret: true },
];

export function assessEnvironmentReadiness(
  env: Record<string, string | undefined> = process.env,
  target: "staging" | "production" = "staging",
): EnvironmentReadinessReport {
  const items = REQUIREMENTS.map((requirement): EnvironmentReadinessItem => {
    const value = env[requirement.key]?.trim() ?? "";
    const configured = value.length > 0;
    const validationError = configured && requirement.validate ? requirement.validate(value) : null;
    const required = requirement.required ?? true;
    const status: ReadinessState = configured && !validationError ? "READY" : required ? "BLOCKED" : "IN_PROGRESS";
    const details = configured
      ? validationError
        ? [validationError]
        : [requirement.secret ? "Configured. Value intentionally not displayed." : "Configured."]
      : [`${requirement.key} is missing.`];

    return {
      key: requirement.key,
      objective: requirement.objective,
      configured,
      required,
      secret: requirement.secret ?? false,
      status,
      details,
    };
  });

  const blockers = items
    .filter((item) => item.required && item.status === "BLOCKED")
    .map((item) => `${item.key}: ${item.details.join(" ")}`);
  const ready = blockers.length === 0;

  return {
    target,
    checkedAt: new Date().toISOString(),
    ready,
    status: ready ? "READY" : "BLOCKED",
    items,
    blockers,
  };
}
