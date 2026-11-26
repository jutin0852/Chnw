import assert from "node:assert/strict";
import { test } from "node:test";
import { describeOrderedItems } from "./order-alert-text";

test("order alert names what was ordered", () => {
  assert.equal(describeOrderedItems("Ada", [{ name: "The Gigi Pants", size: "UK 4", quantity: 1 }]), "Ada ordered The Gigi Pants (UK 4).");
  assert.equal(describeOrderedItems("Ada", [{ name: "The Gigi Pants", size: "UK 4", quantity: 2 }, { name: "The Triangle Tote", size: "ONE_SIZE", quantity: 1 }]), "Ada ordered The Gigi Pants (UK 4) × 2 and The Triangle Tote.");
  assert.equal(
    describeOrderedItems("Ada", [{ name: "A", size: null, quantity: 1 }, { name: "B", size: null, quantity: 1 }, { name: "C", size: null, quantity: 1 }, { name: "D", size: null, quantity: 1 }]),
    "Ada ordered A, B and 2 more.",
  );
});

test("order alert includes the chosen colour", () => {
  assert.equal(describeOrderedItems("Ada", [{ name: "The Triangle Tote", size: "ONE_SIZE", colour: "Brown", quantity: 1 }]), "Ada ordered The Triangle Tote (Brown).");
  assert.equal(describeOrderedItems("Ada", [{ name: "The Halter Tank", size: "UK 8", colour: "Olive green", quantity: 2 }]), "Ada ordered The Halter Tank (Olive green, UK 8) × 2.");
});
