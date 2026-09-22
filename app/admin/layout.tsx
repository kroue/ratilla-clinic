import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { isSignedIn } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Clinic admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isSignedIn();
  return (
    <div className="admin">
      <header className="admin-header">
        <div className="wrap admin-header-inner">
          <Link className="brand" href="/admin">
            <LogoMark id="admin" className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">Ratilla</span>
              <span className="brand-sub">Clinic admin</span>
            </span>
          </Link>
          <div className="admin-header-actions">
            <Link href="/">View website</Link>
            {signedIn && (
              <form action={logout}>
                <button type="submit" className="btn btn-secondary btn-compact">
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <main className="wrap admin-main">{children}</main>
    </div>
  );
}
