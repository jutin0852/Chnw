"use client";
import Link from "next/link";
import AuthShell from "@/components/store/auth-shell";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
export default function ForgotPasswordPage() { const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false); async function submit(event: React.FormEvent) { event.preventDefault(); setPending(true); const result = await requestPasswordReset({ email, redirectTo: `${window.location.origin}/account/reset-password` }); setPending(false); setMessage(result.error ? result.error.message || "We could not send that reset email." : "If an account exists for this email, a reset link is on its way."); } return (
    <AuthShell tone="mist" panelLabel="Account recovery" panelTitle="Locked out? It happens." panelBody="Enter the email you signed up with and we will send you a link to choose a new password." label="Account recovery" heading="Reset your password.">
      <form onSubmit={submit} className="mt-9 space-y-6">
        <label className="block"><span className="field-label">Email address</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" autoComplete="email" /></label>
        {message && <p role="status" className="notice">{message}</p>}
        <button disabled={pending} className="pill pill--ink w-full disabled:opacity-50">{pending ? "Sending..." : "Send reset link"}</button>
      </form>
      <Link href="/account/sign-in" className="label draw mt-6 inline-block py-1 text-[12px] text-thread">Back to sign in</Link>
    </AuthShell>
  );
}
