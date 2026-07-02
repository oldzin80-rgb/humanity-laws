export interface DeploymentRouteCheck {
  path: string;
  passed: boolean;
  status?: number;
  details: string[];
}

export interface DeploymentVerificationResult {
  deploymentUrl: string;
  checkedAt: string;
  passed: boolean;
  details: string[];
  routeChecks: DeploymentRouteCheck[];
}

export interface DeploymentVerificationOptions {
  deploymentUrl?: string;
  requiredPaths?: string[];
  fetchImpl?: typeof fetch;
}

export const REQUIRED_STAGING_PATHS = [
  "/",
  "/book",
  "/join",
  "/login",
  "/dashboard",
  "/spark",
  "/adam",
  "/eve",
  "/council",
  "/library",
  "/admin",
  "/launch-status",
] as const;

function normalizeDeploymentUrl(deploymentUrl: string): URL | null {
  try {
    const parsed = new URL(deploymentUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

async function checkRoute(baseUrl: URL, path: string, fetchImpl: typeof fetch): Promise<DeploymentRouteCheck> {
  const routeUrl = new URL(path, baseUrl);

  try {
    const response = await fetchImpl(routeUrl);
    const passed = response.ok;

    return {
      path,
      passed,
      status: response.status,
      details: passed
        ? [`${path} responded with HTTP ${response.status}.`]
        : [`${path} responded with HTTP ${response.status}; expected a successful response.`],
    };
  } catch (error) {
    return {
      path,
      passed: false,
      details: [`${path} could not be reached: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

export async function verifyDeployment(
  input: string | DeploymentVerificationOptions = process.env.DEPLOYMENT_URL ?? "",
): Promise<DeploymentVerificationResult> {
  const options = typeof input === "string" ? { deploymentUrl: input } : input;
  const deploymentUrl = options.deploymentUrl ?? process.env.DEPLOYMENT_URL ?? "";
  const checkedAt = new Date().toISOString();
  const details: string[] = [];
  const routeChecks: DeploymentRouteCheck[] = [];

  if (deploymentUrl.length === 0) {
    return {
      deploymentUrl,
      checkedAt,
      passed: false,
      details: ["DEPLOYMENT_URL is missing; staging deployment was not verified."],
      routeChecks,
    };
  }

  const parsedUrl = normalizeDeploymentUrl(deploymentUrl);
  if (!parsedUrl) {
    return {
      deploymentUrl,
      checkedAt,
      passed: false,
      details: ["DEPLOYMENT_URL must be a valid http or https URL."],
      routeChecks,
    };
  }

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (!fetchImpl) {
    return {
      deploymentUrl,
      checkedAt,
      passed: false,
      details: ["No fetch implementation is available; staging deployment routes were not verified."],
      routeChecks,
    };
  }

  const requiredPaths = options.requiredPaths ?? [...REQUIRED_STAGING_PATHS];
  for (const path of requiredPaths) {
    routeChecks.push(await checkRoute(parsedUrl, path, fetchImpl));
  }

  const passed = routeChecks.every((check) => check.passed);
  details.push(`Deployment URL configured: ${parsedUrl.toString()}`);
  details.push(
    passed
      ? `All ${routeChecks.length} required staging routes responded successfully.`
      : `${routeChecks.filter((check) => !check.passed).length} required staging route(s) failed verification.`,
  );

  return {
    deploymentUrl: parsedUrl.toString(),
    checkedAt,
    passed,
    details,
    routeChecks,
  };
}
