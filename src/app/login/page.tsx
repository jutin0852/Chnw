"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/store/auth-shell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await signIn.email({ email, password });
    setLoading(false);
    if (result.error) return setMessage(result.error.message || "We could not sign you in with those details.");
    router.replace("/admin");
    router.refresh();
  };

  return (
    <AuthShell
      tone="ink"
      panelLabel="Staff area"
      panelTitle="For the people running the store."
      panelBody="This area is for the team handling products, stock and customer orders."
      label="Staff area"
      heading="Sign in."
    >
      <p className="mt-3 text-[15px] leading-[1.6] text-stone">There is no public staff sign-up. Ask the owner for an invitation if you need access.</p>
      <form className="mt-9 space-y-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="field-label">Email address</span>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" placeholder="you@example.com" autoComplete="email" />
        </label>
        <label className="block">
          <span className="field-label">Password</span>
          <span className="relative block">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} className="field-input pr-16" placeholder="Your password" minLength={6} autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="label absolute inset-y-0 right-0 px-1 text-[11px] text-thread underline">{showPassword ? "Hide" : "Show"}</button>
          </span>
        </label>
        {message && <p role="alert" className="notice">{message}</p>}
        <button type="submit" disabled={loading} className="pill pill--ink w-full disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Signing in..." : "Sign in to admin"}</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/account/sign-in" className="label draw py-1 text-[12px] text-thread">Customer sign in</Link>
        <Link href="/account/forgot-password" className="label draw py-1 text-[12px] text-stone">Reset password</Link>
      </div>
    </AuthShell>
  );
}
