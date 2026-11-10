import Link from "next/link";
import { getSessionUser } from "@/lib/admin-auth";
import { AcceptInvite } from "@/components/account/accept-invite";
import AuthShell from "@/components/store/auth-shell";

export default async function AcceptInvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const currentUser = await getSessionUser();
  if (!token) {
    return (
      <AuthShell tone="ink" panelLabel="Staff invitation" panelTitle="Join the CHNW team." label="Staff invitation" heading="This link is incomplete.">
        <p className="mt-4 text-[15px] leading-[1.6] text-stone">Open the invitation link from your email again, or ask the owner to send a new one.</p>
      </AuthShell>
    );
  }
  if (!currentUser) {
    const returnTo = encodeURIComponent(`/account/accept-invite?token=${token}`);
    return (
      <AuthShell tone="ink" panelLabel="Staff invitation" panelTitle="Join the CHNW team." panelBody="Handle products, stock and customer orders with us." label="Staff invitation" heading="Sign in to accept.">
        <p className="mt-4 text-[15px] leading-[1.6] text-stone">Sign in or create an account with the email address that received this invitation, then return here to accept it.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/account/sign-in?returnTo=${returnTo}`} className="pill pill--ink">Sign in</Link>
          <Link href={`/account/register?returnTo=${returnTo}`} className="pill pill--line">Create account</Link>
        </div>
      </AuthShell>
    );
  }
  return (
    <AuthShell tone="ink" panelLabel="Staff invitation" panelTitle="Join the CHNW team." panelBody="Handle products, stock and customer orders with us." label="Staff invitation" heading="Accept your invitation.">
      <p className="mt-4 text-[15px] leading-[1.6] text-stone">You are signed in as {currentUser.email}. Continue only if this is the email address the invitation was sent to.</p>
      <AcceptInvite token={token} />
    </AuthShell>
  );
}
