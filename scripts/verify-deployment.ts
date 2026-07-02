import { verifyDeployment } from "../src/deployment/index.js";
const result = await verifyDeployment();
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.passed ? 0 : 1;
