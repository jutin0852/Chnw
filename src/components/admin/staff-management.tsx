"use client";
import { useState, useTransition } from "react";
import { addStaffDirectly, inviteStaff, removeStaff, revokeInvitation } from "@/app/actions/staff";

type Member = { id: string; name: string; email: string; role: string; createdAt: Date };
type Invitation = { id: string; email: string; expiresAt: Date; acceptedAt: Date | null; revokedAt: Date | null };

/** A readable temporary password, e.g. "chnw-4k7p-q2xm". Avoids look-alike characters. */
function makeTempPassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const pick = (n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (v) => chars[v % chars.length]).join("");
  return `chnw-${pick(4)}-${pick(4)}`;
}

const input = "min-w-0 w-full rounded-md border px-3 py-2 text-sm";
const primary = "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50";

export function StaffManagement({ members, invitations, emailReady }: { members: Member[]; invitations: Invitation[]; emailReady: boolean }) {
  const [pending, startTransition] = useTransition();

  // Add directly (no email needed)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(makeTempPassword);
  const [added, setAdded] = useState<{ email: string; password: string | null } | null>(null);
  const [addError, setAddError] = useState("");

  // Email invitation
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const [teamError, setTeamError] = useState("");

  function add(event: React.FormEvent) {
    event.preventDefault();
    setAddError("");
    startTransition(async () => {
      try {
        const result = await addStaffDirectly({ name, email, password });
        setAdded({ email: email.trim().toLowerCase(), password: result.created ? password : null });
        setName("");
        setEmail("");
        setPassword(makeTempPassword());
      } catch (error) {
        setAddError(error instanceof Error ? error.message : "Could not add them.");
      }
    });
  }

  function invite(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await inviteStaff(inviteEmail);
        setInviteEmail("");
        setInviteMessage("Invitation sent.");
      } catch (error) {
        setInviteMessage(error instanceof Error ? error.message : "Could not send invitation.");
      }
    });
  }

  const signInUrl = typeof window !== "undefined" ? `${window.location.origin}/account/sign-in` : "/account/sign-in";
  const shareText = added
    ? added.password
      ? `You now have CHNW admin access.\nSign in: ${signInUrl}\nEmail: ${added.email}\nTemporary password: ${added.password}\nPlease change it after signing in (Account → Account settings → Password).`
      : `You now have CHNW admin access. Sign in with your usual password: ${signInUrl}`
    : "";

  return (
    <div className="space-y-8 p-5 sm:p-8">
      <div>
        <p className="text-sm text-muted-foreground">Owner-only controls</p>
        <h1 className="text-3xl font-semibold">Staff access</h1>
      </div>

      <section className="max-w-xl rounded-lg border bg-card p-6">
        <h2 className="font-semibold">Add a staff member</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No email needed. Set a temporary password, then send them the sign-in details yourself (for example on WhatsApp). If they already have an account, they just get staff access and keep their own password.
        </p>
        <form onSubmit={add} className="mt-5 space-y-3">
          <label className="block text-sm">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Their full name" className={`mt-1 ${input}`} />
          </label>
          <label className="block text-sm">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@example.com" className={`mt-1 ${input}`} />
          </label>
          <label className="block text-sm">
            Temporary password
            <span className="mt-1 flex gap-2">
              <input required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} font-mono`} />
              <button type="button" onClick={() => setPassword(makeTempPassword())} className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-muted">New</button>
            </span>
          </label>
          <button disabled={pending} className={primary}>{pending ? "Adding..." : "Add staff member"}</button>
        </form>
        {addError && <p role="alert" className="mt-4 text-sm text-destructive">{addError}</p>}
        {added && (
          <div className="mt-5 rounded-md border bg-muted/40 p-4">
            <p className="text-sm font-medium">{added.email} now has staff access. Send them this:</p>
            <pre className="mt-3 whitespace-pre-wrap break-all rounded-md bg-background p-3 font-mono text-xs">{shareText}</pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void navigator.clipboard?.writeText(shareText)} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Copy</button>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Send on WhatsApp</a>
            </div>
            {added.password && <p className="mt-3 text-xs text-muted-foreground">This password is shown only once. Ask them to change it after signing in.</p>}
          </div>
        )}
      </section>

      <section className="max-w-xl rounded-lg border bg-card p-6">
        <h2 className="font-semibold">Invite by email</h2>
        {emailReady ? (
          <p className="mt-2 text-sm text-muted-foreground">They will create or sign in to their account, verify their email, then accept the invitation.</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Email sending is not set up yet (Resend), so invitations cannot be delivered. Use “Add a staff member” above instead.</p>
        )}
        <form onSubmit={invite} className="mt-5 flex gap-3">
          <input type="email" required disabled={!emailReady} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="staff@example.com" className={`flex-1 ${input}`} />
          <button disabled={pending || !emailReady} className={primary}>{pending ? "Sending..." : "Send invite"}</button>
        </form>
        {inviteMessage && <p className="mt-4 text-sm">{inviteMessage}</p>}
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b p-5"><h2 className="font-semibold">Current team</h2></div>
        {teamError && <p role="alert" className="px-5 pt-4 text-sm text-destructive">{teamError}</p>}
        <div className="divide-y">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wide">{member.role}</span>
                {member.role === "staff" && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm(`Remove staff access for ${member.email}? Their account stays, as a customer.`)) return;
                      setTeamError("");
                      startTransition(async () => {
                        try {
                          await removeStaff(member.id);
                        } catch (error) {
                          setTeamError(error instanceof Error ? error.message : "Could not remove them.");
                        }
                      });
                    }}
                    className="text-sm underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b p-5"><h2 className="font-semibold">Invitations</h2></div>
        <div className="divide-y">
          {invitations.length === 0 && <p className="p-5 text-sm text-muted-foreground">No invitations yet.</p>}
          {invitations.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{inv.email}</p>
                <p className="text-sm text-muted-foreground">{inv.acceptedAt ? "Accepted" : inv.revokedAt ? "Revoked" : `Expires ${inv.expiresAt.toLocaleDateString()}`}</p>
              </div>
              {!inv.acceptedAt && !inv.revokedAt && (
                <button onClick={() => startTransition(async () => { await revokeInvitation(inv.id); })} className="text-sm underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
