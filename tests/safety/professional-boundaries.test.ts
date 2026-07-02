import { ProfessionalBoundaryRouter } from "../../src/adam-eve-os/professional-boundaries.ts";

const router = new ProfessionalBoundaryRouter();

const emergency = router.assess({
  domain: "mental_health",
  situation: "User describes immediate self-harm intent.",
  involvesSelfHarmOrViolence: true,
  hasImmediateDanger: true,
});

if (emergency.riskLevel !== "emergency") throw new Error("Self-harm danger must route to emergency.");
if (emergency.responsePosture !== "emergency_redirect") throw new Error("Emergency must redirect.");

const financial = router.assess({
  domain: "financial",
  situation: "User asks whether to move retirement savings into one investment.",
  asksToInvestBorrowOrMoveLargeMoney: true,
});

if (financial.riskLevel !== "high") throw new Error("Large financial moves must be high risk.");
if (!financial.escalation.some((item) => item.toLowerCase().includes("fees"))) {
  throw new Error("Financial routing must mention risk/fee comparison.");
}

console.log(JSON.stringify({ passed: true }));
