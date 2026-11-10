import { Suspense } from "react";
import AuthShell from "@/components/store/auth-shell";
import { AccountAccessForm } from "@/components/account/account-access-form";

export default function RegisterPage() {
  return (
    <AuthShell
      tone="red"
      panelLabel="Your CHNW account"
      panelTitle="Keep your details close."
      panelBody="Your account helps you check out faster and keep your order history in one place."
      label="Customer account"
      heading="Create your account."
    >
      <Suspense fallback={null}><AccountAccessForm mode="register" /></Suspense>
    </AuthShell>
  );
}
