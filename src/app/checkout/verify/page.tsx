import PaymentConfirmation from "@/components/store/payment-confirmation";
import { verifyAndFinalizeBachsPayment, verifyAndFinalizePaystackPayment, verifyBachsPaymentForReference } from "@/lib/payments";

export const dynamic = "force-dynamic";

type Search = { reference?: string; provider?: string; ref?: string; checkout_id?: string };

// Paystack returns here with ?reference=...
// Bachs returns with ?provider=bachs&ref=<our reference>&checkout_id=<short code>.
export default async function VerifyPaymentPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { reference, provider, ref, checkout_id: checkoutId } = await searchParams;
  const result = provider === "bachs" && ref
    ? await verifyBachsPaymentForReference(ref)
    : checkoutId?.startsWith("chk_")
      ? await verifyAndFinalizeBachsPayment(checkoutId)
      : reference
        ? await verifyAndFinalizePaystackPayment(reference)
        : { state: "failed" as const, message: "Your payment reference is missing." };
  return <PaymentConfirmation result={result} />;
}
