import test from "node:test";
import assert from "node:assert/strict";
import { CouncilConversationService } from "../src/experiences/index.js";

test("Council response includes transparency and human sovereignty", async () => {
  const council = new CouncilConversationService();
  const result = await council.respond("m", "What should I focus on?");
  assert.ok(result.adam.transparency.includes("AI_TRANSPARENT"));
  assert.ok(result.eve.humanSovereigntyReminder.includes("human judgment"));
  assert.ok(result.record.conversationId);
});
