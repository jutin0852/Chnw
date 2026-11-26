"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteAccount } from "./delete-account";
import { ChangePassword } from "./change-password";

export function AccountSettings() {
  const [open, setOpen] = useState(false);
  return <section className="mt-8 border-t border-black/20 pt-6"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="text-xs font-semibold uppercase tracking-[.13em] text-[var(--brand)] underline">{open ? "Hide account settings" : "Account settings"}</button>{open && <div className="mt-5 space-y-5"><div className="border border-black/20 p-5"><h3 className="text-lg font-medium">Password</h3><p className="mt-2 text-sm leading-6 text-black/65">Change your password here. Forgotten it? <Link href="/account/forgot-password" className="text-[var(--brand)] underline">Send yourself a reset link</Link> instead.</p><ChangePassword /></div><DeleteAccount /></div>}</section>;
}
