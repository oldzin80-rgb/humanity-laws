import test from "node:test";
import assert from "node:assert/strict";
import { ServiceContainer } from "../src/bootstrap/index.js";
import { ProviderRegistry } from "../src/infrastructure/index.js";

test("canonical abstractions are importable from owning layers", () => {
  assert.equal(typeof ServiceContainer, "function");
  assert.equal(typeof ProviderRegistry, "function");
});
