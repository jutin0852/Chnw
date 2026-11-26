"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/auth-client";

/** Change the password while signed in (no email needed). Signs out other devices. */
export function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (next.length < 8) return setMessage({ ok: false, text: "The new password needs at least 8 characters." });
    startTransition(async () => {
      const { error } = await changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true });
      if (error) return setMessage({ ok: false, text: error.message || "Could not change the password. Check your current password." });
      setCurrent("");
      setNext("");
      setMessage({ ok: true, text: "Password changed." });
    });
  }

  const field = "mt-2 w-full border border-black px-3 py-3";
  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <label className="block text-sm">Current password<input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} /></label>
      <label className="block text-sm">New password<input type="password" required minLength={8} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={field} /></label>
      <button disabled={pending} className="bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[.13em] text-white disabled:opacity-50">{pending ? "Saving..." : "Change password"}</button>
      {message && <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "" : "text-[var(--brand)]"}`}>{message.text}</p>}
    </form>
  );
}
