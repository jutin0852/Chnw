import Link from "next/link";
import AuthShell from "@/components/store/auth-shell";

export default function UnauthorizedPage() {
  return (
    <AuthShell tone="ink" panelLabel="Private area" panelTitle="This area is for the CHNW team." label="Access restricted" heading="You cannot view this page.">
      <p className="mt-4 text-[15px] leading-[1.6] text-stone">You do not have permission to view the administration area. Sign in with an approved account or return to the store.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="pill pill--ink">Return to store</Link>
        <Link href="/login" className="pill pill--line">Sign in</Link>
      </div>
    </AuthShell>
  );
}
