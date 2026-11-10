"use client";
import Link from "next/link";
import AuthShell from "@/components/store/auth-shell";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
export default function ResetPasswordPage() { return <Suspense fallback={<main className="min-h-screen bg-white" />}><ResetPasswordForm /></Suspense>; }
function ResetPasswordForm() { const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false); const token = useSearchParams().get("token"); const router = useRouter(); async function submit(event: React.FormEvent) { event.preventDefault(); if (!token) return setMessage("This reset link is incomplete or expired."); setPending(true); const result = await resetPassword({ newPassword: password, token }); setPending(false); if (result.error) return setMessage(result.error.message || "This reset link is no longer valid."); router.replace("/account/sign-in"); } return (
    <AuthShell tone="mist" panelLabel="Account recovery" panelTitle="Pick something new." panelBody="Use at least 8 characters. You will sign in with it straight after." label="Account recovery" heading="Choose a new password.">
      <form onSubmit={submit} className="mt-9 space-y-6">
        <label className="block"><span className="field-label">New password</span><span className="relative block"><input type={showPassword ? "text" : "password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="field-input pr-16" autoComplete="new-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="label absolute inset-y-0 right-0 px-1 text-[11px] text-thread underline">{showPassword ? "Hide" : "Show"}</button></span></label>
        {message && <p role="alert" className="notice">{message}</p>}
        <button disabled={pending} className="pill pill--ink w-full disabled:opacity-50">{pending ? "Saving..." : "Save new password"}</button>
      </form>
      <Link href="/account/sign-in" className="label draw mt-6 inline-block py-1 text-[12px] text-thread">Back to sign in</Link>
    </AuthShell>
  );
}
