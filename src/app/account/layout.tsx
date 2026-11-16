import type { Metadata } from "next";

// Account pages are personal, so they stay out of search results.
export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
