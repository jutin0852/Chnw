import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { bachsApiUrl, bachsPaymentOutcome, hasValidBachsSignature, matchesBachsPayment, type BachsCheckoutSession } from "./bachs";

const SECRET = "whsec_test_secret";
const NOW = 1_800_000_000;
const body = JSON.stringify({ id: "evt_1", type: "collection.succeeded", data: { checkout_id: "chk_1" } });
const sign = (timestamp: number, payload = body, secret = SECRET) => createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");

function session(overrides: Partial<BachsCheckoutSession> = {}): BachsCheckoutSession {
  return {
    checkout_id: "chk_1",
    status: "completed",
    payment_status: "succeeded",
    amount: "75000.00",
    currency: "NGN",
    reference: "ref_1",
    charge: { status: "succeeded", amount: "75000.00", currency: "NGN", amount_paid: "75000.00" },
    ...overrides,
  };
}

test("picks the sandbox or live Bachs host from the key", () => {
  assert.equal(bachsApiUrl("sk_sandbox_abc"), "https://sandbox-api.bachs.io");
  assert.equal(bachsApiUrl("sk_live_abc"), "https://api.bachs.io");
});

test("accepts a correctly signed Bachs webhook (V2 and legacy headers)", () => {
  const v2 = { timestamp: null, signature: null, signatureV2: `t=${NOW},v1=${sign(NOW)}` };
  assert.equal(hasValidBachsSignature(body, v2, SECRET, NOW), true);
  const legacy = { timestamp: String(NOW), signature: sign(NOW), signatureV2: null };
  assert.equal(hasValidBachsSignature(body, legacy, SECRET, NOW), true);
});

test("accepts either signature while a secret is being rotated", () => {
  const header = `t=${NOW},v1=${sign(NOW, body, "old_secret")},v1=${sign(NOW)}`;
  assert.equal(hasValidBachsSignature(body, { timestamp: null, signature: null, signatureV2: header }, SECRET, NOW), true);
});

test("rejects tampered, stale, unsigned or unconfigured webhooks", () => {
  const good = { timestamp: null, signature: null, signatureV2: `t=${NOW},v1=${sign(NOW)}` };
  assert.equal(hasValidBachsSignature(body.replace("chk_1", "chk_2"), good, SECRET, NOW), false);
  assert.equal(hasValidBachsSignature(body, good, SECRET, NOW + 301), false);
  assert.equal(hasValidBachsSignature(body, good, "", NOW), false);
  assert.equal(hasValidBachsSignature(body, { timestamp: null, signature: null, signatureV2: null }, SECRET, NOW), false);
  assert.equal(hasValidBachsSignature(body, { timestamp: String(NOW), signature: "deadbeef", signatureV2: null }, SECRET, NOW), false);
});

test("reads the payment outcome from a Bachs checkout", () => {
  assert.equal(bachsPaymentOutcome(session()), "success");
  assert.equal(bachsPaymentOutcome(session({ status: "open", payment_status: "processing", charge: null })), "pending");
  assert.equal(bachsPaymentOutcome(session({ status: "expired", payment_status: null, charge: null })), "failed");
  assert.equal(bachsPaymentOutcome(session({ status: "open", payment_status: "failed", charge: { status: "failed", amount: "75000.00", currency: "NGN" } })), "failed");
  // Underpaid means money arrived; the amount check then sends it to review.
  assert.equal(bachsPaymentOutcome(session({ charge: { status: "underpaid", amount: "75000.00", currency: "NGN", amount_paid: "70000.00" } })), "success");
});

test("only matches a Bachs payment for the right order, currency and full amount", () => {
  const expected = BigInt(7_500_000);
  assert.equal(matchesBachsPayment(session(), "ref_1", expected), true);
  assert.equal(matchesBachsPayment(session(), "ref_other", expected), false);
  assert.equal(matchesBachsPayment(session({ currency: "USD" }), "ref_1", expected), false);
  assert.equal(matchesBachsPayment(session({ amount: "7500.00" }), "ref_1", expected), false);
  assert.equal(matchesBachsPayment(session({ charge: { status: "underpaid", amount: "75000.00", currency: "NGN", amount_paid: "70000.00" } }), "ref_1", expected), false);
  assert.equal(matchesBachsPayment(session({ charge: { status: "succeeded", amount: "75000.00", currency: "NGN", amount_paid: "70000.00" } }), "ref_1", expected), false);
  assert.equal(matchesBachsPayment(session({ charge: { status: "overpaid", amount: "75000.00", currency: "NGN", amount_paid: "76000.00" } }), "ref_1", expected), true);
});
