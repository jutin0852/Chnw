import { Suspense } from "react";
import AuthShell from "@/components/store/auth-shell";
import { AccountAccessForm } from "@/components/account/account-access-form";

export default function AccountSignInPage() {
  return (
    <AuthShell
      tone="mist"
      panelLabel="Your CHNW account"
      panelTitle="Make checkout easier."
      panelBody="Save your delivery details, view your orders, and return whenever you are ready for another piece."
      label="Customer account"
      heading="Welcome back."
    >
      <Suspense fallback={null}><AccountAccessForm mode="sign-in" /></Suspense>
    </AuthShell>
  );
}
