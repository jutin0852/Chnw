import { createHmac, timingSafeEqual } from "crypto";
import { koboToNairaDecimal, parseNairaToKobo, type MoneyKobo } from "./money";

// Bachs (bachs.io) hosted checkout. Docs: https://docs.bachs.io
// Sandbox keys start with sk_sandbox_ and talk to the sandbox host; live keys use the live host.

export type BachsCheckoutSession = {
  checkout_id: string;
  status: "open" | "completed" | "expired" | "cancelled" | string;
  payment_status?: string | null;
  amount: string;
  currency: string;
  reference?: string | null;
  charge?: {
    status: string;
    amount: string;
    currency: string;
    amount_paid?: string | null;
  } | null;
};

/** What the store needs to know about a payment, whichever provider took it. */
export type PaymentOutcome = "success" | "failed" | "pending";

const WEBHOOK_TOLERANCE_SECONDS = 300;
// Money has arrived for these charge states. "underpaid" counts as arrived so that the amount
// check below can send the order to manual review instead of leaving it pending forever.
const MONEY_RECEIVED = new Set(["succeeded", "accepted", "overpaid", "underpaid"]);
const DEAD_END = new Set(["failed", "expired", "cancelled", "canceled"]);

function getSecretKey() {
  const secretKey = process.env.BACHS_SECRET_KEY;
  if (!secretKey) throw new Error("Online payments are not configured yet. Please try again later.");
  return secretKey;
}

export function bachsApiUrl(secretKey: string) {
  return secretKey.startsWith("sk_live_") ? "https://api.bachs.io" : "https://sandbox-api.bachs.io";
}

async function bachsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const secretKey = getSecretKey();
  const response = await fetch(`${bachsApiUrl(secretKey)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => null)) as (T & { detail?: unknown }) | null;
  if (!response.ok || !body) {
    console.error("Bachs request failed", response.status, path, body && typeof body.detail === "string" ? body.detail : "");
    throw new Error("We could not start your payment. Please try again.");
  }
  return body;
}

export async function initializeBachsPayment(input: {
  email: string;
  name?: string;
  amountKobo: MoneyKobo;
  reference: string;
  /** Bachs appends ?checkout_id=... to this address after payment. Must be a public URL. */
  successUrl: string;
  cancelUrl: string;
  orderId: string;
  orderNumber: string;
  expiresInMinutes: number;
}) {
  const session = await bachsRequest<{ checkout_id: string; checkout_url: string }>("/v1/checkout-sessions", {
    method: "POST",
    body: JSON.stringify({
      pricing: { currency: "NGN", amount: koboToNairaDecimal(input.amountKobo) },
      payment_method_types: ["NGN_CARD", "NGN_BANK_TRANSFER"],
      customer: { email: input.email, ...(input.name?.trim() ? { name: input.name.trim() } : {}) },
      reference: input.reference,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      expires_in_minutes: Math.min(1440, Math.max(1, Math.round(input.expiresInMinutes))),
      metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
    }),
  });
  if (!session.checkout_url) throw new Error("We could not start your payment. Please try again.");
  return { authorization_url: session.checkout_url, checkoutId: session.checkout_id };
}

export async function getBachsCheckoutSession(checkoutId: string) {
  return bachsRequest<BachsCheckoutSession>(`/v1/checkout-sessions/${encodeURIComponent(checkoutId)}`);
}

export function bachsPaymentOutcome(session: BachsCheckoutSession): PaymentOutcome {
  const charge = session.charge?.status?.toLowerCase();
  if (charge && MONEY_RECEIVED.has(charge)) return "success";
  if (session.status === "completed" && session.payment_status === "succeeded") return "success";
  if (session.status === "expired" || session.status === "cancelled" || (charge && DEAD_END.has(charge))) return "failed";
  return "pending";
}

/** True only when the session is for this order's reference, in Naira, and at least the full amount was paid. */
export function matchesBachsPayment(session: BachsCheckoutSession, expectedReference: string, expectedAmountKobo: MoneyKobo) {
  try {
    if (session.reference !== expectedReference || session.currency !== "NGN") return false;
    if (parseNairaToKobo(session.amount) !== expectedAmountKobo) return false;
    const charge = session.charge;
    if (!charge) return session.payment_status === "succeeded";
    if (charge.currency !== "NGN" || charge.status.toLowerCase() === "underpaid") return false;
    const paid = parseNairaToKobo(charge.amount_paid ?? charge.amount);
    return paid >= expectedAmountKobo;
  } catch {
    return false;
  }
}

function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Bachs signs each webhook with HMAC-SHA256 over "{timestamp}.{raw body}" using the endpoint's
 * signing secret. V2 header: "t=<unix seconds>,v1=<hex>[,v1=<hex>]" (two values while a secret is
 * being rotated). Deliveries older than five minutes are rejected to stop replays.
 */
export function hasValidBachsSignature(
  rawBody: string,
  headers: { timestamp: string | null; signature: string | null; signatureV2: string | null },
  secret = process.env.BACHS_WEBHOOK_SECRET,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  if (!secret) return false;
  let timestamp = headers.timestamp;
  let candidates: string[] = headers.signature ? [headers.signature.trim()] : [];
  if (headers.signatureV2) {
    const parts = headers.signatureV2.split(",").map((part) => part.trim().split("="));
    const t = parts.find(([key]) => key === "t")?.[1];
    const v1 = parts.filter(([key]) => key === "v1").map(([, value]) => value).filter(Boolean);
    if (t && v1.length) {
      timestamp = t;
      candidates = v1;
    }
  }
  if (!timestamp || !/^\d+$/.test(timestamp) || candidates.length === 0) return false;
  if (Math.abs(nowSeconds - Number(timestamp)) > WEBHOOK_TOLERANCE_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return candidates.some((candidate) => safeEqualHex(candidate.toLowerCase(), expected));
}
