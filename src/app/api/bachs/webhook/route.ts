import { NextResponse } from "next/server";
import { hasValidBachsSignature } from "@/lib/bachs";
import { verifyAndFinalizeBachsPayment } from "@/lib/payments";

export const runtime = "nodejs";

// Events that mean money moved for a checkout. The handler re-reads the checkout from Bachs
// before touching the order, and finalising is idempotent, so repeated deliveries are harmless.
const PAYMENT_EVENTS = new Set(["collection.succeeded", "collection.underpaid", "checkout.completed"]);

export async function POST(request: Request) {
  const rawBody = await request.text();
  const valid = hasValidBachsSignature(rawBody, {
    timestamp: request.headers.get("x-bachs-timestamp"),
    signature: request.headers.get("x-bachs-signature"),
    signatureV2: request.headers.get("x-bachs-signature-v2"),
  });
  if (!valid) return new NextResponse("Invalid signature", { status: 401 });
  try {
    const payload = JSON.parse(rawBody) as { type?: string; data?: { checkout_id?: string | null } };
    if (payload.type && PAYMENT_EVENTS.has(payload.type) && payload.data?.checkout_id) {
      await verifyAndFinalizeBachsPayment(payload.data.checkout_id);
    }
  } catch {
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
  return NextResponse.json({ received: true });
}
