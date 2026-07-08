export interface LuluIntegrationReadiness {
  provider: "lulu";
  configured: boolean;
  liveFulfillmentEnabled: false;
  requiredEnvironment: readonly ["LULU_CLIENT_ID", "LULU_CLIENT_SECRET"];
  manualStepsRequired: string[];
  boundary: string;
}

export function assessLuluIntegrationReadiness(env: Record<string, string | undefined> = process.env): LuluIntegrationReadiness {
  return {
    provider: "lulu",
    configured: Boolean(env.LULU_CLIENT_ID?.trim() && env.LULU_CLIENT_SECRET?.trim()),
    liveFulfillmentEnabled: false,
    requiredEnvironment: ["LULU_CLIENT_ID", "LULU_CLIENT_SECRET"],
    manualStepsRequired: [
      "Create and verify Lulu account/API credentials.",
      "Create verified Humanity Laws hardcover product/print job template.",
      "Verify shipping, tax, support, refund, and return policies.",
      "Run test order through provider sandbox or approved manual proof.",
      "Document order webhook and support workflow before accepting live hardcover purchases.",
    ],
    boundary: "Hardcover fulfillment is not live until Lulu/POD credentials, product IDs, order flow, support policy, and launch evidence are verified.",
  };
}
