import test from "node:test";
import assert from "node:assert/strict";
import { SparkNoRepeatService } from "../src/experiences/index.js";

test("Spark service does not repeat initial pillars before pool advances", async () => {
  const service = new SparkNoRepeatService();
  const first = await service.nextSpark("m");
  const second = await service.nextSpark("m");
  assert.notEqual(first.pillar, second.pillar);
});
